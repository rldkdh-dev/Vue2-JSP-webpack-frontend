<template>
    <modal :pass="{popupTitle:'교육사진 등록'}">
        <template v-slot:contents>
            <div>
                <h3>교육 사진 등록</h3>
                <imgfile ref="imgfile" :pass="{id:'img',index:0}" @filelist="imgfiles" @fileDelete="imgfileDelete"></imgfile>
            </div>
            <div class="btn-group">
                <div class="right_side">
                    <!-- <a href="javascript:;" @click="upload" class="btn btn-purple">등록</a> -->
                    <a href="javascript:;" @click="upload" class="btn btn-purple">등록</a>
                </div>
            </div>
        </template>
    </modal>
</template>
<script>
    import "es6-promise/auto";
    import Vue from "vue";
    import Axios from "axios";
    // import imgsfile from "../../frm_main/imgsfileform2.vue"
    import imgsfile from "../../../../../common/vue/imgsfileform2.vue"
    import modal from '../../../../../common/vue/modal.vue';
    Vue.component('modal',modal);
    Vue.component('imgfile',imgsfile);
    
    export default {
      data: function() {
        return {
            uploadImageSrc: '',
            viewModel:{
                filelist:[],
                fileGroup: '',
                deletefileList: [],
                imgfilelist:[],
                imgfileGroup: '',
            },
            edu_sn: '',
        };
      },
      mounted: function() {},
      methods: {
        fnInit:function(sn){
            let vm = this;
            modal.methods.fnInit();

            vm.viewModel.imgfilelist = [];

            vm.edu_sn = sn;
            if(sn != null){
                this.fnFileLoad(sn);
            }
        },
        fnClose:function(){
            if(confirm(" 자료 등록을 취소하시겠습니까? \n 창을 닫으면 저장되지 않는 파일은 등록이 취소됩니다.")){
                this.$emit('close',false);
            }
        },
        upload:function(){
            let vm = this;
            if(confirm("등록 하시겠습니까?")){
                // if(vm.viewModel.imgfileGroup != ''){
                    vm.fnImgInsertFile();
                // }
            }else{
                alert("등록을 취소하였습니다.");
            }
            
        },
    	fnSetFileName: function(index) { //file start
            let vt = this;
            let vm = this.viewModel;
            let file = new FormData();
            file = $('#sc'+index+' #uf01'+ index);
            let filename = file.val().split('\\').pop();
            let filetitle = filename.substr(0, filename.lastIndexOf('.'));
            if(file != undefined) {
                // $('#'+this.pass.id+index+' .upload-name').val(filename);
                // $('#'+this.pass.id+index+' .bf_title').val(filetitle);
                $('#sc'+index+' #filebox').text(filename);
                
                vm.filelist[index].file = file[0].files[0];
                vm.filelist[index].orgnl_file_nm = filename;
                vm.filelist[index].file_title = filetitle;
                
                if(vm.fileGroup == '') {
                    Axios.post('/filegroup.do').then((response) => {
                        vm.fileGroup = response.data;
                    });
                }
            }
        },
        fnAddFile: function() {
            this.viewModel.filelist.push({seq: this.viewModel.filelist.length});
        },
        fnDeleteFile: function(index) {
            let vt = this;
            let vm = this.viewModel;
            let key = vm.filelist[index].seq;
            let deletekey = vm.filelist[index].file_sn;
            if(confirm("삭제하시겠습니까?")){
                if(vm.filelist.length > 1) {
                    vm.filelist.splice(index, 1);

                    for(let i=0; i<vm.filelist.length; i++){
                        vm.filelist[i].seq = i;
                    }
                } else {
                    vm.filelist = [{seq: 0},]
                    vm.fileGroup = '';
                    
                    $('#uf01' + index).val(null);
                    $('#sc'+index+' #filebox').text("첨부파일을 추가해 주세요.");
                }
                if(key != undefined){
                    vm.deletefileList.push(deletekey);       
                }
            }
        },
        fnAfterDelete: function() {
            let vm = this;
            if(vm.viewModel.deletefileList.length != 0){
                for(var i=0; i<vm.viewModel.deletefileList.length; i++){
                    Axios.post("/hsEd/deletefile.do",{file_sn:vm.viewModel.deletefileList[i]}).then(function(){})
                }
            }
        },
        fnMoveFile: function(index, ud) {
            let vm = this.viewModel;
            let {objFile, objTargetFile} = new FormData();

            if(index!=0 && ud==-1 || index!=vm.filelist.length-1 && ud==1) {
                objFile = vm.filelist[index].file;
                objTargetFile = vm.filelist[index+ud].file;

                let obj = JSON.parse(JSON.stringify(vm.filelist[index]));
                let objTarget = JSON.parse(JSON.stringify(vm.filelist[index+ud]));
                

                vm.filelist[index] = objTarget;
                vm.filelist[index+ud] = obj;
                
                vm.filelist[index].file = objTargetFile;
                vm.filelist[index+ud].file = objFile;

                $('#sc'+index+' #filebox').text(objTarget.orgnl_file_nm == undefined ? '첨부파일을 추가해 주세요.' : objTarget.orgnl_file_nm);
                $('#sc'+(index+ud)+' #filebox').text(obj.orgnl_file_nm == undefined ? '첨부파일을 추가해 주세요.' : obj.orgnl_file_nm);

            } 
        },
        fnFileLoad: function(groupid) {
            let vt = this;
            let vm = this.viewModel;

            $(".loading").show();
            $("#mask").show();
            Axios.post("/hsEdFilelist.do",{groupid:groupid, file_se: 2})
            .then(function(rs) {
                vm.imgfilelist = rs.data.filelist.filter(item => item.file_se != "1");
                vt.$refs.imgfile.fnFileLoadList(vm.imgfilelist);
            }).catch(function(ex){
                $(".loading").hide();
                $("#mask").hide();
            }).finally(function(){
                $(".loading").hide();
                $("#mask").hide();
            });
        },
    	fnImgInsertFile: function() {
            let vt = this;
            let vm = this.viewModel;
            let frm = new FormData();

            frm.append("fileGroup", vm.imgfileGroup);
            frm.append("reg_id",vt.$store.state.global.userInfo.user_id);
            frm.append("file_se",2);
            frm.append("edu_sn",vt.edu_sn);
            frm.append("bplc_sn",vt.$store.state.global.userInfo.bplc_sn);
            vt.fnAfterDelete();

            for(let i=0; i<vm.imgfilelist.length; i++) {
                frm.append("uploadFiles", vm.imgfilelist[i].file);
            }

            $(".loading").show();
            $("#mask").show();
            Axios.post('/hsEd/file/upload.do', frm, {headers: {'Content-Type': 'multipart/form-data'}}).then((response) => {
                // console.log(response.data);
                alert("등록 되었습니다.");
                vt.$emit('close',false);
                vt.$parent.fnList();
            }).catch(function(ex){
                $(".loading").hide();
				$("#mask").hide();
            }).finally(function(){
                $(".loading").hide();
				$("#mask").hide();
            });
            
        },
        imgfiles:function(file){
            let vm = this;
            vm.viewModel.imgfilelist = file.viewModel.filelist;
            if(vm.viewModel.imgfileGroup == '') {
                Axios.post('/filegroup.do').then((response) => {
                    vm.viewModel.imgfileGroup = response.data;
                });
            }
        },
        imgfileDelete:function(list){ // file end
            for(var i=0; i<list.viewModel.deletefileList.length; i++){
                this.viewModel.deletefileList.push(list.viewModel.deletefileList[i]);    
            }
            
        }
      }
    };
</script>