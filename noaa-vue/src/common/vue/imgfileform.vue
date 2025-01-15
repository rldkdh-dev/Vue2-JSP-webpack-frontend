<template>
    <!-- <ul id="tbl_filelist">
        <li v-for="(item, i) in viewModel.imgfilelist" :key="i" :id="pass.id+i">
            <div class="upload_file_wrap">
                <div class="upload_file">
                    <div class="btn filebox" id="filebox">
                        {{item.file_org_name == null ? '첨부파일을 마우스로 드래그해서 추가해 주세요.' : item.file_org_name}}
                    </div>
                    <input type="file" hidden="" :id="pass.id+'_img'+i" :target=i @change="fnUploadImageThumbnail(i)" >
                    <label :for="pass.id+'_img'+i" class="btn btn-white"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-folder-filled"></use></svg>찾아보기</label>
                </div>
                <div class="icon_box">
                    <a href="javascript:;" class="btn btn-icon" @click="fnAddFile()"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-add-circle"></use></svg></a>
                    <a href="javascript:;" class="btn btn-icon" @click="fnDeleteFile(i)"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-circle-minus"></use></svg></a>
                </div>
                <div class="icon_box">
                    <a href="javascript:;" class="btn btn-icon" @click="fnMoveFile(i, -1)"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-arrow-up-circle"></use></svg></a>
                    <a href="javascript:;" class="btn btn-icon" @click="fnMoveFile(i, 1)"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-arrow-down-circle"></use></svg></a>
                </div>
            </div>
        </li>
    </ul> -->
    <div class="upload_file_wrap">
        <div :class="imgclass">
            <label :for="pass.id+'_img_upload_01'" class="btn btn-white">
                <input type="file" :id="pass.id+'_img_upload_01'" @change="fnUploadImageThumbnail" accept="image/*" hidden>
                <svg class="icon"><use xlink:href="/img/symbol-defs.svg#icon-camera"></use></svg>사진올리기
            </label>
            <ul>
                <li>
                    <img :src="uploadImageSrc" alt="이미지">
                    <!-- <button class="img_control"></button> -->
                    <button class="close" @click="fnImgclose">
                        <svg class="icon"><use xlink:href="/img/symbol-defs.svg#icon-delete-circle"></use></svg>
                    </button>
                </li>
            </ul>
        </div>
    </div>
</template>
<!-- <span class="btn btn-default btn-file">
    <input type="file" :id="pass.id+'_img'" @change="fnUploadImageThumbnail">
</span> -->
<script>
import 'es6-promise/auto'
import Vue from 'vue'
import Axios from 'axios'
import Message, {messageUtil} from "../js/message"

export default{
    props: ['pass'],
    data: function () {
        return {
            uploadImageSrc: '',
            imgclass:'img_area img_upload box no-img',
            viewModel: {
                imgfilelist: [{seq: 0}],
                key: null,
                filelist: null,
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
            let maxSize = 1 * 1024 * 1024 * 1024;

            let file = $('#'+this.pass.id+'_img_upload_01')[0].files[0];
            vm.filelist = file;

            // $('#'+this.pass.id+i+' #filebox').text(filename);
            let fileUploadType = ['jpg', 'gif', 'png', 'jpeg'];

            let fileExt = file.name.split('.').pop().toLowerCase();
            
            if(fileUploadType.indexOf(fileExt) == -1){
                alert(messageUtil(Message.UPLOAD_FILE_TYPE, ['이미지']));
                return;
            }else{
                if(file.size > maxSize){
                    alert("첨부파일 사이즈는 1GB 이내로 등록 가능합니다.");
                    return false;
                }else{
                    vt.uploadImageSrc = URL.createObjectURL(file);
                    let img = new Image();
                    img.src = vt.uploadImageSrc;
                    vt.imgclass='img_area img_upload box';
                    if(vm.fileGroup == '') {
                        Axios.post('/filegroup.do').then((response) => {
                            vm.fileGroup = response.data;
                            vt.$emit('filelist', vm);
                        });
                    }
                }
            }
            
            
        },
    	fnInsertFile: function(mapperId,user_id) {
            let vt = this;
            let vm = this.viewModel;
            let frm = new FormData();
            let string = "";
            frm.append("fileGroup", vm.fileGroup);
            frm.append("uploadFiles", vm.filelist);
            frm.append("mapperId",mapperId);//매퍼아이디
            frm.append("user_id",user_id);
            frm.append("mode","I");
            vm.key == null ? '': frm.append("sn",vm.key);
            // let key = vm.key
            if(vm.filelist.file_seq == null) {
                // if(key!=null) {
                //     Axios.post('/file/drop/'+key, key).then((response) => {
                //         // console.log(response.data)
                //     });
                // }
                Axios.post('/main/file/upload.do', frm, {headers: {'Content-Type': 'multipart/form-data'}}).then((response) => {
                    // console.log(response.data);
                    string = response.data.success;
                });
            }

            return string;
        },
        fnFileLoad: function(data) {
            let vt = this;
            let vm = this.viewModel;
            Axios.post("/filelist.do", data).then(function(rs) {
                let filelist = rs.data.filelist;
                if(filelist!=undefined) {
                    vm.filelist = filelist;
                    vm.fileGroup = rs.data.acdnt_mng_sn;
                    vt.imgclass = 'img_area img_upload box';
                    for(var i=0; i< vm.filelist.length; i++){
                        if(vm.filelist[i].se != "F"){
                            if(vm.filelist[i].strg_path.charAt()=='/') {       //리눅스 경로때문에 사용
                                vt.uploadImageSrc = vm.filelist[i].strg_path + vm.filelist[i].strg_file_nm;
                            } else {    //아닐경우
                                vt.uploadImageSrc = vm.filelist[i].strg_path.substr(2) + vm.filelist[i].strg_file_nm;
                                // vt.uploadImageSrc = vm.filelist[i].strg_path + vm.filelist[i].strg_file_nm;
                            }
                            vm.key = vm.filelist[i].file_sn;
                        }
                    }
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
                Axios.post('/filegroup.do').then((response) => {
                    vm.fileGroup = response.data;
                    vt.$emit('filelist', vm);
                });
            }
        },
        fnDragOver: function(event){
            event.stopPropagation();
            event.preventDefault();
        },
        fnInit: function(){
            //초기화
            let vm = this;
            vm.uploadImageSrc = '';
            vm.viewModel.filelist = null;
            vm.viewModel.fileGroup = '';
        },
        fnAddFile: function() {
            this.viewModel.imgfilelist.push({seq: this.viewModel.imgfilelist.length});
        },
        fnMoveFile: function(index, ud) {
            let vm = this.viewModel;
            let {objFile, objTargetFile} = new FormData();

            if(index!=0 && ud==-1 || index!=vm.imgfilelist.length-1 && ud==1) {
                objFile = vm.imgfilelist[index].file;
                objTargetFile = vm.imgfilelist[index+ud].file;
    
                let obj = JSON.parse(JSON.stringify(vm.imgfilelist[index]));
                let objTarget = JSON.parse(JSON.stringify(vm.imgfilelist[index+ud]));
    
                vm.imgfilelist[index] = objTarget;
                vm.imgfilelist[index+ud] = obj;
                
                vm.imgfilelist[index].file = objTargetFile;
                vm.imgfilelist[index+ud].file = objFile;

                $('#'+this.pass.id+index+' #filebox').text(objTarget.file_org_name == undefined ? '첨부파일을 마우스로 드래그해서 추가해 주세요.' : objTarget.file_org_name);
                $('#'+this.pass.id+(index+ud)+' #filebox').text(obj.file_org_name == undefined ? '첨부파일을 마우스로 드래그해서 추가해 주세요.' : obj.file_org_name);

            }
        },
        fnDeleteFile: function(index) {
            let vt = this;
            let vm = this.viewModel;
            let key = vm.imgfilelist[index].file_seq;

            if(confirm("삭제하시겠습니까?")){
                
                if(vm.imgfilelist.length > 1) {
                    vm.imgfilelist.splice(index, 1);

                    for(let i=0; i<vm.imgfilelist.length; i++){
                        vm.imgfilelist[i].seq = i;
                    }
                } else {
                    vm.imgfilelist = [{seq: 0},]
                    vm.fileGroup = ''
                }

                $('#uf01' + index).val(null);
                $('#'+this.pass.id+index+' #filebox').text("첨부파일을 마우스로 드래그해서 추가해 주세요.");

                // if(key != undefined){
                //     vm.deletefileList.push(key);                   
                // }
            }
        },
        fnImgclose:function(){
            let vm = this;
            vm.imgclass = "img_area img_upload box no-img";
            vm.uploadImageSrc = "";
            // let file = $('#'+this.pass.id+'_img_upload_01')[0].files[0];
            // vm.filelist = file;
            
            console.log(vm.filelist);
        },
    }
}
</script>