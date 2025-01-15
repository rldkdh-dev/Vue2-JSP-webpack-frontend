<template>
   <div class="upload_file_wrap" :id="pass.id">
        <div class="img_area img_upload box no-img" v-if="pass.mode !='view'">
            <label :for="pass.id+'_img_upload_01'" class="btn btn-white">
                <input type="file" :id="pass.id+'_img_upload_01'" multiple="" hidden="" @change="fnSetFileName" accept="image/*">
                <svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-camera"></use></svg>사진올리기
            </label>
            <ul>
                <li v-for="(item, i) in viewModel.uploadImageSrc">
                    <!-- <a :href="item" class="img_control imgpop">
                        <img :src="item" @click="fnImgClick($event);">
                    </a> -->
                    <a data-magnify="gallery" :href="item" class="img_control imgpop">
                        <img :src="item">
                    </a>
                    <button class="close" @click="fnDeleteFile(i)" >
                        <svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-delete-circle"></use></svg>
                    </button>
                </li>
                <li>
                    <label :for="pass.id+'_img_upload_01'" class="img_control">
                        <svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-plus-small"></use></svg>
                    </label>
                </li>
            </ul>
        </div>
        <div class="img_area img_upload box" v-else>
            <ul>
                <li v-for="(item, i) in viewModel.uploadImageSrc">
                    <!-- <a :href="item" class="img_control imgpop">
                        <img :src="item" @click="fnImgClick($event);">
                    </a> -->
                    <a data-magnify="gallery" :href="item" class="img_control imgpop">
                        <img :src="item">
                    </a>
                </li>
            </ul>
        </div>
    </div>
</template>
<script>
import 'es6-promise/auto'
import Vue from 'vue'
import Axios from 'axios'
import Message, {messageUtil} from "../../common/js/message";

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
            for(let i=0; i<files.length; i++){
                let file = files[i];
                
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
                        vm.viewModel.filelist.push({'file' : file});
                        vm.viewModel.uploadImageSrc.push(URL.createObjectURL(file));
                    }
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
        // },
        fnNoLoad:function(){
            let vm = this;
            //파일 리스트 초기화
            vm.viewModel.filelist = [];
            vm.viewModel.uploadImageSrc = [];
            if(vm.viewModel.filelist.length == 0){
                $("#" + vm.pass.id +" > .img_area.img_upload").addClass("no-img");
            }
        }
    }
}
</script>