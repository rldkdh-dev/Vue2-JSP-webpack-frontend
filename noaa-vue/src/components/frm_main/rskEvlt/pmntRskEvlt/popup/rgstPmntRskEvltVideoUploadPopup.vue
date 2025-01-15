<template>
    <modal :pass="{popupTitle: '회의 동영상 업로드'}">
		<template v-slot:contents>
            <div>
                <fileform @filelist="fnFilelist"  @fileDelete="fnFileDelete" :pass="{id:'sc', type:'video'}" ref="files"></fileform>
            </div>
            <div class="btn-group">
                <div class="right_side">
                    <button class="btn btn-purple" @click.prevent="fnSave()">등록</button>
                </div>
            </div>
		</template>
	</modal>
</template>

<script>
    import "es6-promise/auto";
    import Vue from "vue";
    import Axios from "axios";
    import fileform from "../../../../../common/vue/fileform2.vue";
    import Modal from '../../../popup/modal.vue'
    import Message, {messageUtil} from "../../../../../common/js/message";

    export default {
        props: ['pass'],
        data: function() {
            return {
                viewModel:{
                    data:{},
                    userInfo:{},
                    filelist: [],
                    deletefileList: [],
                },
            };
        },
        components: {
            Modal,
            'fileform':fileform,
        },
        mounted: function() {
            let vm = this;
        },
        methods: {
            fnInit:function(sn){
                let vm = this;
                vm.viewModel.userInfo = vm.$store.state.global.userInfo;

                Modal.methods.fnInit();

                vm.fnDetail(sn);
            },
            fnDetail: function(sn){
                let vm = this;

                let send = {
                    ordtm_risk_evl_sn: sn,
                    file_se: 2
                }

                Axios.post("/selectPmntRskEvlFileDetail.do", send)
                .then(function(response) {
                    vm.viewModel.data = response.data.detail;
                    vm.viewModel.filelist = response.data.fileList;

                    vm.$refs.files.fnFileLoadList(vm.viewModel.filelist);
                });
            },
            fnFilelist:function(vm){
                this.viewModel.filelist = vm.filelist;
            },
            fnFileDelete: function(vm){
                this.viewModel.deletefileList = vm.deletefileList;
            },
            fnSave: function(){
                let vm = this;
                let frm = new FormData();
                for(let i=0; i<vm.viewModel.filelist.length; i++) {
                    let key = vm.viewModel.filelist[i].file_seq;
                    if(vm.viewModel.filelist[i].file != null) {
                        frm.append("fileTitle", vm.viewModel.filelist[i].file_title);
                        frm.append("uploadFiles", vm.viewModel.filelist[i].file);
                        frm.append("file_se", 2);
                        if(vm.viewModel.filelist[i].file_sn){
                            frm.append("deleteFiles", vm.viewModel.filelist[i].file_sn);
                        }
                        frm.append("key", 0)
                    } else {
                        if(vm.viewModel.filelist[i].file == undefined){
                            
                        }else{
                            frm.append("fileTitle", vm.viewModel.filelist[i].file_title);
                            frm.append("key", key)
                        }
                    }
                }

                for(let i=0; i<vm.viewModel.deletefileList.length; i++){
                    frm.append("deleteFiles", vm.viewModel.deletefileList[i]);
                }

                let data = {
                    reg_id: vm.viewModel.userInfo.user_id,
                    bplc_sn: vm.viewModel.data.bplc_sn,
                    ordtm_risk_evl_sn: vm.viewModel.data.ordtm_risk_evl_sn,
                };

                frm.append('data', new Blob([ JSON.stringify(data) ], {type : "application/json"}));


                frm.append("filePath", "pmntRskEvlt");

                if(confirm(Message.CREATE_CONFIRM)){
                    $(".loading").show();
                    $("#mask").show();
                    Axios.post("/updatePmntRiskFile.do", frm).then(function(response) {
                        $(".loading").hide();
                        $("#mask").hide();
                        if(response.data == 1){
                            alert("저장되었습니다.");
                            vm.$parent.videoUploadPop = false;
                            vm.$parent.fnList();
                        }else{
                            alert(Message.ERROR);    
                        }
                    }).catch(function(ex) {
                        $(".loading").hide();
                        $("#mask").hide();
                        alert(Message.ERROR);
                    });
                }
            }
        }
    };
</script>