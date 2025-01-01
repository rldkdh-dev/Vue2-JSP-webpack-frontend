<template>
    <div class="fileinput2">
        <div v-if="uploadImageSrc != null && uploadImageSrc != ''" class="fileinput-preview thumbnail checklist_photo photo_info mt5" :class="{'drag-success': viewModel.filelist != null}">
            <img :src="uploadImageSrc">
        </div>
        <label class="btn btn-light btn-danger2">필수 사진첨부
            <div class="filebox single">
                <span class="btn btn-default btn-file">
                    <input type="file" :id="pass.id+'_img'" accept="image/*" @change="fnUploadImageThumbnail">
                </span>
            </div>
        </label>
    </div>
</template>
<script>
import 'es6-promise/auto'
import Vue from 'vue'
import Axios from 'axios'
import Message, {messageUtil} from "../../common/message"

export default{
    props: ['pass'],
    data: function () {
        return {
            fileAttached: false,
            uploadImageSrc: '',
            viewModel: {
                key: this.pass.key,
                filelist: null,
                fileGroup: '',
            }
        }
    },
    methods: {
        fnupdatemode: function(img){
            this.uploadImageSrc = img;
        },
        fnUploadImageThumbnail: function(event){
            let vt = this;
            let vm = this.viewModel;
            let file = $('#'+this.pass.id+'_img')[0].files[0];
            vm.filelist = file;
            if (!this.fileAttached) {
                this.fileAttached = true;
                this.$emit('file-attached');
            }
            if(file.length > 0) {
                let fileUploadType = ['jpg', 'gif', 'png', 'jpeg'];
                let fileExt = file.name.split('.').pop();
                if(fileUploadType.indexOf(fileExt) == -1){
                    alert(messageUtil(Message.UPLOAD_FILE_TYPE, ['이미지']));
                    return;
                }
            }
            
            vt.uploadImageSrc = URL.createObjectURL(file);
            let img = new Image();
            img.src = vt.uploadImageSrc;

            if(vm.fileGroup == '') {
                Axios.post('/filegroup').then((response) => {
                    vm.fileGroup = response.data;
                    vt.$emit('filelist', vm);
                });
            }
        },
    	fnInsertFile: function() {
            let vt = this;
            let vm = this.viewModel;
            let frm = new FormData();
            frm.append("fileGroup", vm.fileGroup);
            frm.append("uploadFiles", vm.filelist);
            let key = vm.key
            if(vm.filelist.file_seq == null) {
                if(key!=null) {
                    Axios.post('/file/drop/'+key, key).then((response) => {
                       // console.log(response.data)
                    });
                }
                Axios.post('/main/file/upload', frm, {headers: {'Content-Type': 'multipart/form-data'}}).then((response) => {
                   // console.log(response.data)
                });
            }
        },
        fnFileLoad: function(groupid) {
            let vt = this;
            let vm = this.viewModel;

            Axios.post("/filelist", {groupid: groupid}).then(function(rs) {
                let filelist = rs.data.filelist[0];
                if(filelist!=undefined) {
                    vm.filelist = filelist;
                    vm.fileGroup = rs.data.file_grp_id;
                    if(vm.filelist.file_path.charAt()=='/') {       //리눅스 경로때문에 사용
                        vt.uploadImageSrc = vm.filelist.file_path + vm.filelist.file_new_name;
                    } else {    //아닐경우
                        vt.uploadImageSrc = vm.filelist.file_path.substr(2) + vm.filelist.file_new_name;
                    }
                    vm.key = vm.filelist.file_seq;
                } else {
                    vm.filelist = null;
                    vm.fileGroup = ''
                    vt.uploadImageSrc = '';
                }
                vt.$emit('filelist', vm);
            });
        },
        fnDropInputTag: function(e) {
            let vt = this;
            let vm = this.viewModel;
            let dataTransfer = new DataTransfer();
            Array.from(e.dataTransfer.files).forEach(file => {
                dataTransfer.items.add(file);
            });
            const targetIndex = e.target.getAttribute("target");
            let targetFile = $(`input[type=file][target=${targetIndex}]`)[0];
            targetFile = dataTransfer.files;

            let fileName = targetFile[0].name;
            vm.filelist[targetIndex].file = targetFile[0];
            vm.filelist[targetIndex].file_org_name = fileName;
            vm.filelist[targetIndex].file_title = fileName.substr(0, fileName.lastIndexOf('.'));
            if(vm.fileGroup == '') {
                Axios.post('/filegroup').then((response) => {
                    vm.fileGroup = response.data;
                    vt.$emit('filelist', vm);
                });
            }
        },
        fnDragOver: function(event){
            event.stopPropagation();
            event.preventDefault();
        },
    }
}
</script>