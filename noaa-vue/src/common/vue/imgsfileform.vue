<template>
    <!-- <div class="file_box3">
        <div class="fileinput-preview thumbnail" :class="{'drag-success': viewModel.filelist != null}">
            <img :src="uploadImageSrc">
        </div>
        <span class="btn btn-default btn-file">
            <input type="file" :id="pass.id+'_img'" @change="fnUploadImageThumbnail">
        </span>
    </div> -->

    <div class="file_box3">
        <span class="btn btn-file btn-light fileinput-button" v-show="pass.mode != 'view'">
            <span class="mi">add_a_photo</span> <span>파일추가</span>
            <input type="file" :id="pass.id+'_img'" @change="fnUploadImageThumbnail" accept="image/*">
        </span>
        <div class="file_area">
            <ul id="fileList_pc" class="fileList clearfix">
                <li data-type='old' v-for="(item, index) in viewModel.filelist" :key="item">
                    <!-- <a class="imgpop" :href="uploadImageSrc[index]">
                        <img class='thumbnail' :src="uploadImageSrc[index]" @click="fnImgClick($event);">
                    </a> -->
                    <a data-magnify="gallery" :href="uploadImageSrc[index]" class="imgpop">
                        <img :src="uploadImageSrc[index]" class='thumbnail'>
                    </a>

                    <span class="mi btn_del" @click="fnDeleteFile(index)" v-show="pass.mode != 'view'">&#xe14c</span>
                </li>
            </ul>
        </div>
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
            uploadImageSrc: [],
            viewModel: {
                key: null,
                filelist: [],
                fileGroup: ''
            }
        }
    },
    mounted: function(){
    },
    methods: {
        fnUploadImageThumbnail: function(){
            let vt = this;
            let vm = this.viewModel;
            let file = $('#'+this.pass.id+'_img')[0].files[0];

            vm.filelist.push(file)
           
            
            if(file.length > 0) {
                let fileUploadType = ['jpg', 'gif', 'png', 'jpeg'];
                let fileExt = file.split('.').pop();
                alert(fileExt);
                if(fileUploadType.indexOf(fileExt) == -1){
                    alert(messageUtil(Message.UPLOAD_FILE_TYPE, ['이미지']));
                    return;
                }
            }
            
            vt.uploadImageSrc.push(URL.createObjectURL(file));
  
            if(vm.fileGroup == '') {
                Axios.post('/filegroup.do').then((response) => {
                    vm.fileGroup = response.data;
                    vt.$emit('filelist', vm);
                });
            }

            //파일 초기화 해주기
            $('#'+this.pass.id+'_img').val("");
        },
    	fnInsertFile: function(mapperId,user_id) {
            let vt = this;
            let vm = this.viewModel;
            let frm = new FormData();
            frm.append("fileGroup", vm.fileGroup);
            frm.append("mapperId",mapperId);//매퍼아이디
            frm.append("user_id",user_id);
            frm.append("mode","I");
            for(let i=0; i<vm.filelist.length; i++) {
                frm.append("uploadFiles", vm.filelist[i]);
            }
            Axios.post('/main/file/upload.do', frm, {headers: {'Content-Type': 'multipart/form-data'}}).then((response) => {
                //console.log(response.data)
            });
        },
        fnFileLoad: function(groupid) {
            let vt = this;
            let vm = this.viewModel;

            Axios.post("/filelist", {groupid: groupid}).then(function(rs) {
                vm.filelist = rs.data.filelist;
                vm.fileGroup = rs.data.file_grp_id;
                
                if(vm.filelist.length!=0) {
                    for(let i=0; i<vm.filelist.length;i++){
                        if(vm.filelist[i].file_path.charAt()=='/') {       //리눅스 경로때문에 사용
                            vt.uploadImageSrc.push(vm.filelist[i].file_path + vm.filelist[i].file_new_name);
                        } else {    //아닐경우
                            vt.uploadImageSrc.push(vm.filelist[i].file_path.substr(2) + vm.filelist[i].file_new_name);
                        }
                    }
                }else{
                    vt.fnInit();
                }
                vt.$emit('filelist', vm);
            });
        },
        fnDragOver: function(event){
            event.stopPropagation();
            event.preventDefault();
        },
        fnDeleteFile: function(index){
            let vt = this;
            let vm = this.viewModel;
            let key = vm.filelist[index].file_seq;

            if(key != undefined && confirm('삭제하시겠습니까?')) {
                Axios.post('/file/drop/'+key, key).then((response) => {
                    vm.filelist.splice(index, 1);    
                    vt.uploadImageSrc.splice(index, 1);  
                });
            } else if(key == undefined && confirm('삭제하시겠습니까?')) {
                vm.filelist.splice(index, 1);    
                vt.uploadImageSrc.splice(index, 1);  
            }  
        },
        fnInit: function(){
            //초기화
            let vm = this;
            vm.uploadImageSrc = [];
            vm.viewModel.filelist = [];
            vm.viewModel.fileGroup = '';
        },
        // fnImgClick: function(event){
        //     event.preventDefault();

        //     $('.imgpop').magnificPopup({
        //         type: 'image',
        //         closeOnContentClick: true,
        //         mainClass: 'mfp-img-mobile',
        //         // image: {
        //         //     verticalFit: true
        //         // },
        //         gallery: {
        //             enabled: true
        //         },

        //     });
        // }
    }
}
</script>