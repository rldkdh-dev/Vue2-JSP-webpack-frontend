<template>
    <div>
        <modal :pass="{popupTitle: '혈압측정 내역'}">
            <template v-slot:contents>
                <div>
                    <table class="table horizontal">
                        <caption>사용자 정보</caption>
                        <tbody>
                            <tr>
                                <th scope="row" class="w100">현장명</th>
                                <td>
                                    <!-- <select v-if="viewModel.targetUser.bplc_nm_arr.length > 1" @change="fnChangeBplcSN($event)" v-model="viewModel.targetUser.bplc_sn">
                                        <option v-for="(item, i) in viewModel.targetUser.bplc_nm_arr" :key="i" :value="viewModel.targetUser.bplc_sn_arr[i]">{{item}}</option>
                                    </select>
                                    <span v-else>{{viewModel.targetUser.bplc_nm_arr[0]}}</span> -->
                                    {{ viewModel.targetUser.bplc_nm }}
                                </td>
                            </tr>
                            <tr>
                                <th scope="row">성명</th>
                                <td>{{viewModel.targetUser.user_nm}}</td>
                            </tr>
                            <tr>
                                <th scope="row">전화번호</th>
                                <td>{{viewModel.targetUser.user_cttpc}}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div>
                    <table class="table">
                        <caption>혈압 목록</caption>
                        <thead>
                            <tr>
                                <th scope="col">번호</th>
                                <th scope="col">최고혈압</th>
                                <th scope="col">최저혈압</th>
                                <th scope="col">첨부파일</th>
                                <th scope="col">등록일자</th>
                            </tr>
                        </thead>
                        <tbody>
                            <template v-if="viewModel.list.length>0">
                                <tr v-for="(item, i) in viewModel.list" :key="i">
                                    <td>{{(viewModel.pager.pageNo==1) ? viewModel.pager.totalSize-i : viewModel.pager.totalSize-((viewModel.pager.rowSize*(viewModel.pager.pageNo-1))+i)}}</td>
                                    <td>{{item.systolic_brssr}}</td>
                                    <td>{{item.diastolic_brssr}}</td>
                                    <td><button class="btn btn-icon" v-if="item.file_sn!=0" @click="fnImgPopup(item.sn, item.bplc_sn)"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-camera"></use></svg></button></td>
                                    <td>{{item.msrmt_day | yyyyMMdd}}</td>
                                </tr>
                            </template>
                            <template v-else>
                                <tr>
                                    <td colspan="5">데이터가 없습니다.</td>
                                </tr>
                            </template>
                        </tbody>
                    </table>
                    <div class="table_footer">
                        <pager :pass="viewModel.pager"></pager>
                    </div>
                </div>
            </template>
        </modal>
        <imgFileView ref="imgFileView" v-if="imgFileView==true"></imgFileView>
    </div>
</template>

<script>
    import "es6-promise/auto";
    import Vue from "vue";
    import Axios from "axios";
    import Common from "../../../common/js/common.js";
    import Pager from "../../../common/vue/paging.vue";
    import Modal from './modal.vue';
    import imgFileView from './imgFileViewPopup.vue';

    export default {
        props: ['pass'],
        components: {
            Pager, Modal,
            'imgFileView': imgFileView
        },
        data: function() {
            return {
                imgFileView: false,
                viewModel:{
                    sn: null,
                    list: [],
                    userInfo:{},
                    targetUser:{
                        bplc_sn: null,
                        bplc_nm_arr: []
                    },
                    imgfilelist:[],
                    pager: {
                        model: {},
                        pageNo: 1,
                        totalSize: 0,
                        rowSize: 5,
                        blockSize: 5,
                        list: [],
                        callBack: function (n) {
                            try{
                                this.model.fnList(n);
                            } catch(e){
                                console.log('callback error  ' + e);
                            }
                        }
                    },
                },
                gbn:'',
                user_id:'',
                sn:'',
            };
        },
        mounted: function() {
            let vm = this;
            vm.viewModel.userInfo = vm.$store.state.global.userInfo;
        },
        methods: {
            fnInit:function(id, sn){
                let vm = this;
                vm.imgFileView=false;
                
                Modal.methods.fnInit();

                vm.user_id = id;
                vm.sn = sn;

                vm.fnList(0);
            },
            fnList:function(paramPageNo){
				let vm = this;
                vm.viewModel.pager.pageNo = paramPageNo == 0 ? 1 : paramPageNo;
                
                let send = {
                    pageNo_sub: vm.viewModel.pager.pageNo,
                    pageSize_sub: vm.viewModel.pager.rowSize,
                    user_id: vm.user_id,
                    sn: vm.viewModel.sn,
                    bplc_sn: vm.sn,
                }
                Axios.post("/selectMngmtCdvscList.do", send).then(function(response) {
                    vm.viewModel.targetUser = response.data.list[0];
                    vm.viewModel.list = response.data.msrmtlist;
                    vm.viewModel.pager.totalSize = response.data.totalCNT;
                    
                    //페이징세팅
                    Pager.props = Pager.methods.createPaging(vm.viewModel.pager, vm, "list");
                });
            },
            fnSave:function(){
                let vm = this;
                let list = [];
                let frm = new FormData();
                for(let i=0; i<vm.viewModel.rsltList.length; i++){
                    
                    if(vm.viewModel.rsltList[i].mttr_imgfilelist != null){
                        for(let j=0; j<vm.viewModel.rsltList[i].mttr_imgfilelist.length; j++){
                            let key = vm.viewModel.rsltList[i].mttr_imgfilelist[j].file_seq;

                            if(vm.viewModel.rsltList[i].mttr_imgfilelist[j].file != null) {
                                frm.append("uploadFiles", vm.viewModel.rsltList[i].mttr_imgfilelist[j].file);
                                frm.append("sn", vm.viewModel.rsltList[i].chck_act_rslt_sn);
                                frm.append("fileTitle", vm.viewModel.rsltList[i].mttr_imgfilelist[j].file.name);
                                if(vm.viewModel.rsltList[i].mttr_imgfilelist[j].file_sn){
                                    frm.append("deleteFiles", vm.viewModel.rsltList[i].mttr_imgfilelist[j].file_sn);
                                }
                                frm.append("key", 0)
                            } else {
                                if(vm.viewModel.rsltList[i].mttr_imgfilelist[j].file == undefined){
                                    
                                }else{
                                    frm.append("fileTitle", vm.viewModel.rsltList[i].mttr_imgfilelist[j].file_title);
                                    frm.append("key", key)
                                }
                            }
                        }
                    }

                    if(vm.viewModel.rsltList[i].mttr_imgdeletefileList != null){
                        for(let j=0; j<vm.viewModel.rsltList[i].mttr_imgdeletefileList.length; j++){
                            frm.append("deleteFiles", vm.viewModel.rsltList[i].mttr_imgdeletefileList[j]);
                            frm.append("del_sn", vm.viewModel.rsltList[i].chck_act_rslt_sn);
                        }
                    }                    
                }

                vm.fngetFileInfo(frm);
            },
            fngetFileInfo(frm){
                let vm = this;

                let data = {
                    user_id: vm.viewModel.userInfo.user_id,
                    rsltList: vm.viewModel.rsltList,
                };

                //조치사항 빈값 체크
                if(vm.viewModel.rsltList.length > 0){
                    let len = vm.viewModel.rsltList.length;
                    for(let i=0; i<len;i++){
                        if(vm.viewModel.rsltList[i].mttr_yn == 'Y' && (vm.viewModel.rsltList[i].actn_sttus == "" || vm.viewModel.rsltList[i].actn_sttus == undefined)){
                            alert("조치내용을 입력해주세요.");
                            return false;
                        }
                    }
                }

                frm.append('data', new Blob([ JSON.stringify(data) ], {type : "application/json"}));

                frm.append("filePath", "chkAct");

                if(confirm(Message.UPDATE_CONFIRM)){
                    Axios.post("/updateMttrRslt.do", frm).then(function(response) {
                        if(response.data == 1){
                            vm.$parent.fnList(0);
                            vm.$parent.chkPop = false;
                            alert("저장되었습니다.");
                        }
                    }).catch(function(ex) {
                        alert(Message.ERROR);
                    });
                }
            },
            fnImgPopup: function(sn, bplc_sn) {
                let vm = this;
                vm.imgFileView=true;
                vm.$nextTick(function() {
                    if(vm.imgFileView) {
                        vm.$refs.imgFileView.fnInit(sn, bplc_sn);
                    }
                })
            },
            fnChangeBplcSN: function(event) {
                let sn = parseInt(event.target.value);
                this.viewModel.targetUser.bplc_sn = sn;
                this.fnList(this.viewModel.targetUser.user_id, sn, 0);
            }
        }
    };
</script>