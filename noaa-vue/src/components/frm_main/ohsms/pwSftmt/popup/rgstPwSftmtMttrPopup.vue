<template>
    <modal :pass="{popupTitle: pass.title}">
		<template v-slot:contents>
			<div>
                <table class="table horizontal write">
                    <caption>주간안전회의록 등록</caption>
                    <tbody>
                        <tr>
                            <th scope="row"><label>조치부서</label></th>
                            <td>
                                {{ viewModel.data.dept_nm }}
                            </td>
                        </tr>
                        <tr>
                            <th scope="row"><label>조치내용</label></th>
                            <td>
                                <textarea rows="5" v-model="viewModel.data.actn_cn"></textarea>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row"><label>조치결과</label></th>
                            <td>
                                <input type="radio" id="r1" name="radio_btn" v-model="viewModel.data.actn_rslt" :value="'Y'"><label for="r1">완료</label>
                                <input type="radio" id="r2" name="radio_btn" v-model="viewModel.data.actn_rslt" :value="'N'"><label for="r2">미완료</label>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row"><label>첨부</label></th>
                            <td>
                                <fileform @filelist="fnFilelist"  @fileDelete="fnFileDelete" :pass="{id:'sc'}" ref="files"></fileform>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="btn-group btn-right">
                <button @click="fngetFileInfo();" class="btn btn-purple"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-post-add"></use></svg>등록</button>
            </div>
		</template>
	</modal>
</template>

<script>
    import "es6-promise/auto";
    import Vue from "vue";
    import Axios from "axios";
    import Modal from '../../../popup/modal.vue'
    import fileform from "../../../../../common/vue/fileform2.vue";
    import Message, {messageUtil} from "../../../../../common/js/message";

    export default {
        props: ['pass'],
        data: function() {
            return {
                viewModel:{
                    data:{},
                    userInfo: {},
                    //파일리스트
                    filelist:[],
                    deletefileList: [],
                },
            };
        },
        components: {
            Modal,
            'fileform' : fileform,
        },
        mounted: function() {
            let vm = this;
        },
        methods: {
            fnInit:function(m_sn, c_m_sn, d_sn){
                let vm = this;
                vm.viewModel.userInfo = vm.$store.state.global.userInfo;

                Modal.methods.fnInit();

                vm.fnGetInfo(m_sn, c_m_sn, d_sn);
            },
            fnGetInfo:function(m_sn, c_m_sn, d_sn){
                let vm = this;
                let data = {
                    mtg_sn: m_sn,
                    cnsltn_mttr_sn: c_m_sn,
                    dept_sn: d_sn
                }

                Axios.post("/selectMttrList.do", data)
                .then(function(response) {
                    vm.viewModel.data = response.data.detail;
                    vm.viewModel.filelist = response.data.fileList;
                    
                    vm.$refs.files.fnFileLoadList(vm.viewModel.filelist);
                });
            },
            fngetFileInfo: function(){

                let vm = this;
                let frm = new FormData();
                for(let i=0; i<vm.viewModel.filelist.length; i++) {
                    let key = vm.viewModel.filelist[i].file_seq;
                    if(vm.viewModel.filelist[i].file != null) {
                        frm.append("fileTitle", vm.viewModel.filelist[i].file_title);
                        frm.append("uploadFiles", vm.viewModel.filelist[i].file);
                        frm.append("file_se", 3);
                        frm.append("sn", vm.viewModel.data.cnsltn_mttr_sn);
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

                vm.fnSave(frm);
            },
            fnSave: function(frm){
               
                let vm = this;

                let data = {
                    user_id: vm.viewModel.userInfo.user_id,
                    dept_sn: vm.viewModel.data.dept_sn,
                    actn_cn: vm.viewModel.data.actn_cn,
                    actn_rslt: vm.viewModel.data.actn_rslt,
                    mtg_sn: vm.viewModel.data.mtg_sn,
                    cnsltn_mttr_sn: vm.viewModel.data.cnsltn_mttr_sn,
                };

                frm.append('data', new Blob([ JSON.stringify(data) ], {type : "application/json"}));
                
                frm.append("filePath", "pwSftmt");

                if(confirm(Message.CREATE_CONFIRM)){
                    Axios.post("/updatePwSftmtMttr.do", frm).then(function(response) {
                        if(response.data = 1){
                            vm.$parent.fnList();
                            vm.$parent.mttrPop = false;
                            alert("저장되었습니다.");
                        }else{
                            alert(Message.ERROR);    
                        }
                    }).catch(function(ex) {
                        alert(Message.ERROR);
                    });
                }
            },
            fnFilelist:function(vm){
                this.viewModel.filelist = vm.filelist;
            },
            fnFileDelete: function(vm){
                this.viewModel.deletefileList = vm.deletefileList;
            },
        }
    };
</script>