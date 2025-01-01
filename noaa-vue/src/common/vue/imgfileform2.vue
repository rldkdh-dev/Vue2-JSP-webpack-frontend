<template>
    <div class="upload_file_wrap" :id="pass.id" >
         <div class="img_area img_upload box no-img" v-if="pass.mode !='view'" @drop.prevent="fnDropInputTag" @dragover.prevent="fnDragOver" :target="i">
            <label :for="pass.id+'_img_upload_01'" class="btn btn-white">
                <input type="file" :id="pass.id+'_img_upload_01'" hidden="" @change="fnSetFileName" accept="image/*">
                <svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-camera"></use></svg>사진올리기
            </label>
            <ul>
                <li v-for="(item, i) in viewModel.uploadImageSrc">
                    <label :for="pass.id+'_img_upload_01'" class="img_control">
                        <img :src="item">
                    </label>
                    <button class="close" @click="fnDeleteFile(i)" >
                        <svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-delete-circle"></use></svg>
                    </button>
                </li>
            </ul>
         </div>
         <div class="img_area img_upload box" v-else>
             <ul>
                <li v-for="(item, i) in viewModel.uploadImageSrc">
                    <img :src="item">
                </li>  
             </ul>
         </div>
     </div>
 </template>
 <script>
 import 'es6-promise/auto'
 import Vue from 'vue'
 import Axios from 'axios'
 import Message, {messageUtil} from "../js/message";
 
 export default{
     props: ['pass'],
     data: function () {
         return {
             viewModel: {
                 filelist: [],
                 deletefileList: [],
                 fileGroup: '',
                 uploadImageSrc:[],
                 index:this.pass.index,
             }
         }
     },
     mounted: function() {
     },
     methods: {
         fnSetFileName: function() {
             let vm = this;
             let maxSize = 1 * 1024 * 1024 * 1024;
 
             let files = $('#'+ vm.pass.id + '_img_upload_01')[0].files;
 
             let flag = true;
             
            let file = files[0];
            
            let fileUploadType = ['jpg', 'gif', 'png', 'jpeg'];

            let filename = file.name;
            let fileExt = filename.split('.').pop().toLowerCase();

            if(fileUploadType.indexOf(fileExt) == -1){
                flag = false;
            }else{
                if(file.size > maxSize){
                    alert("첨부파일 사이즈는 1GB 이내로 등록 가능합니다.");
                    return false;
                }else{

                    if(vm.viewModel.filelist.length > 0){
                        let key = vm.viewModel.filelist[0].file_sn;

                        if(key != undefined){
                            vm.viewModel.deletefileList.push(key);
                            vm.$emit('fileDelete', vm);
                        }
                    }
                    
                    vm.viewModel.filelist = []
                    vm.viewModel.uploadImageSrc = []

                    vm.viewModel.filelist.push({'file' : file});
                    vm.viewModel.uploadImageSrc.push(URL.createObjectURL(file));

                    vm.$set(vm.viewModel.filelist, 0, vm.viewModel.filelist[0]);
                    vm.$set(vm.viewModel.uploadImageSrc, 0, vm.viewModel.uploadImageSrc[0]);
                }
            }
 
            if(!flag){
                alert(messageUtil(Message.UPLOAD_FILE_TYPE, ['이미지']));
            }

            //파일 초기화 해주기
            $('#'+ vm.pass.id + '#_img_upload_01').val("");

            if(vm.viewModel.filelist.length > 0){
                $("#" + vm.pass.id +" .img_area.img_upload").removeClass("no-img");
            }

            vm.$emit('filelist', vm);
         },
         fnDeleteFile: function(index) {
             let vm = this;
             let key = vm.viewModel.filelist[index].file_sn;
             
             if(confirm('삭제하시겠습니까?')){
                 vm.viewModel.filelist.splice(index, 1);
                 vm.viewModel.uploadImageSrc.splice(index, 1);  
 
                 if(key != undefined){
                     vm.viewModel.deletefileList.push(key);
                     vm.$emit('fileDelete', vm);
                 }
             }
             if(vm.viewModel.filelist.length == 0){
                 $("#" + vm.pass.id +" > .img_area.img_upload").addClass("no-img");
             }
         },
         fnFileLoadList: function(list) {
            let vm = this;
            
            //파일 리스트 초기화
            vm.viewModel.filelist = [];
            vm.viewModel.uploadImageSrc = [];

            if(list.length>0) {
                vm.viewModel.filelist = list;
                for(let i=0; i<vm.viewModel.filelist.length; i++) {
                    if(vm.viewModel.filelist[i].strg_path.charAt()=='/') {       //리눅스 경로때문에 사용
                        vm.viewModel.uploadImageSrc.push(vm.viewModel.filelist[i].strg_path + vm.viewModel.filelist[i].strg_file_nm);
                    }else{
                        vm.viewModel.uploadImageSrc.push(vm.viewModel.filelist[i].strg_path.substring(2) + vm.viewModel.filelist[i].strg_file_nm);
                    }
                }
            } else {
                vm.viewModel.filelist = []
                vm.viewModel.uploadImageSrc = []
            }
            
            if(vm.viewModel.filelist.length > 0){
                $("#" + vm.pass.id +" .img_area.img_upload").removeClass("no-img");
            }
         },
        //  fnImgClick: function(event){
        //      event.preventDefault();
 
        //      $('.imgpop').magnificPopup({
        //          type: 'image',
        //          closeOnContentClick: true,
        //          mainClass: 'mfp-img-mobile',
        //          // image: {
        //          //     verticalFit: true
        //          // },
        //          gallery: {
        //              enabled: true
        //          },
 
        //      });
        //  },
         fnNoLoad:function(){
             let vm = this;
             //파일 리스트 초기화
             vm.viewModel.filelist = [];
             vm.viewModel.uploadImageSrc = [];
             if(vm.viewModel.filelist.length == 0){
                 $("#" + vm.pass.id +" > .img_area.img_upload").addClass("no-img");
             }
         },
         fnDropInputTag: function(e) {
            let vm = this;
            let dataTransfer = new DataTransfer();
            Array.from(e.dataTransfer.files).forEach(file => {
                dataTransfer.items.add(file);
            });
            const targetIndex = e.target.getAttribute("target");

            let flag = true;

            let files = $(`input[type=file][target=${targetIndex}]`)[0];
            files = dataTransfer.files;
 
            let file = files[0];
            
            let fileUploadType = ['jpg', 'gif', 'png', 'jpeg'];

            let filename = file.name;
            let fileExt = filename.split('.').pop().toLowerCase();

            let maxSize = 1 * 1024 * 1024 * 1024;

            if(fileUploadType.indexOf(fileExt) == -1){
                flag = false;
            }else{

                if(file.size > maxSize){
                    alert("첨부파일 사이즈는 1GB 이내로 등록 가능합니다.");
                    return false;
                }else{

                    if(vm.viewModel.filelist.length > 0){
                        let key = vm.viewModel.filelist[0].file_sn;
                        if(key != undefined){
                            vm.viewModel.deletefileList.push(key);
                            vm.$emit('fileDelete', vm);
                        }
                    }
                    
                    vm.viewModel.filelist = []
                    vm.viewModel.uploadImageSrc = []

                    vm.viewModel.filelist.push({'file' : file});
                    vm.viewModel.uploadImageSrc.push(URL.createObjectURL(file));

                    vm.$set(vm.viewModel.filelist, 0, vm.viewModel.filelist[0]);
                    vm.$set(vm.viewModel.uploadImageSrc, 0, vm.viewModel.uploadImageSrc[0]);
                }
            }
 
            if(!flag){
                alert(messageUtil(Message.UPLOAD_FILE_TYPE, ['이미지']));
            }

            //파일 초기화 해주기
            $('#'+ vm.pass.id + '#_img_upload_01').val("");

            if(vm.viewModel.filelist.length > 0){
                $("#" + vm.pass.id +" .img_area.img_upload").removeClass("no-img");
            }

            vm.$emit('filelist', vm);

            if(files.length > 1){
                alert("여러개의 파일을 선택해도 하나의 파일만 등록 가능합니다.");
            }
         },
         fnDragOver: function(event){
             event.stopPropagation();
             event.preventDefault();
         },
 
     }
 }
 </script>