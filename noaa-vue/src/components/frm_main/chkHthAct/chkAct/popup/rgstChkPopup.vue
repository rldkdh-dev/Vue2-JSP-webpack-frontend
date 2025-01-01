<template>
    <modal :pass="{popupTitle: '점검활동 조치사항'}">
		<template v-slot:contents>
			<div>
                <table class="table horizontal write">
                    <caption>점검활동 상세</caption>
                    <tbody>
                        <tr>
                            <th scope="row"><label for="">점검유형</label></th>
                            <td>
                                <ul class="input_wrap">
                                    <li v-for="(item, i) in viewModel.chkTypeList" :key="i">
                                        <label :for="'chck_clsf'+item.CODE">
                                            <input type="checkbox" :id="'chck_clsf'+item.CODE" v-model="viewModel.data.chck_clsf" :value="item.CODE" disabled>{{ item.CODE_NM }}
                                         </label>
                                    </li>
                                </ul>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row"><label for="bplc">현장명</label></th>
                            <td>
                                {{ viewModel.data.bplc_nm }}
                            </td>
                        </tr>
                        <tr>
                            <th scope="row"><label for="">작성자</label></th>
                            <td>
                                {{viewModel.data.user_nm}}
                            </td> 
                        </tr>
                        <tr v-if="bplcTeamYn == 'Y'">
                            <th scope="row"><label for="">현장팀명</label></th>
                            <td>
                                {{viewModel.data.bplc_team}}
                            </td> 
                        </tr>
                        <tr>
                            <th scope="row"><label for="chck_dt">점검일자</label></th>
                            <td>
                                {{ viewModel.data.chck_dt|yyyyMMdd }}
                            </td> 
                        </tr>
                        <tr>
                            <th scope="row"><label for="">점검항목</label></th>
                            <td>
                                <div class="input_group">
                                    <input type="text" id="chck_mttr" title="점검항목" disabled v-model="viewModel.data.chck_mttr">
                                </div>
                            </td> 
                        </tr>
                        <tr v-if="jobYn == 'Y'">
                            <th scope="row"><label for="">허가서 선택</label></th>
                            <td>
                                {{viewModel.data.job_type_nm}}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <rgstChkSubDetail ref="sub" :pass="{mode: 'update', gbn:'chk'}" @rsltList="fnrsltList"></rgstChkSubDetail>
            <!-- <rgstChkMttrDetail ref="mttr" @rsltList="fnrsltList" :pass="{mode:'update'}"></rgstChkMttrDetail> -->
            <div class="table_footer btn-right">
                <button class="btn btn-purple" @click.prevent="fnSave()"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-post-add"></use></svg>등록</button>
            </div>
		</template>
	</modal>
</template>

<script>
    import "es6-promise/auto";
    import Vue from "vue";
    import Axios from "axios";
    import rgstChkSubDetail from "../rgstChkSubDetail.vue";
    import imgsfileform from '../../../../../common/vue/imgsfileform2.vue';
    import Modal from '../../../popup/modal.vue'
    import Message, {messageUtil} from "../../../../../common/js/message";

    export default {
        props: ['pass'],
        data: function() {
            return {
                bplcTeamYn: 'N',
                jobYn: 'N',
                viewModel:{
                    data:{
                        chck_clsf: [],
                        chck_rslt: 'G',
                    },
                    userInfo:{},
                    imgfilelist:[],
                    chkTypeList:[],
                    chkRsltList:[],
                    mttrPrgrsList:[],
                    mttrFileList:[],
                },
            };
        },
        components: {
            'rgstChkSubDetail' : rgstChkSubDetail,
            'imgsfileform' : imgsfileform,
            Modal
        },
        mounted: function() {
            let vm = this;
            // vm.fnInit();
        },
        methods: {
            fnInit:function(sn){
                let vm = this;
                vm.viewModel.userInfo = vm.$store.state.global.userInfo;

                Modal.methods.fnInit();
                
                //초기화
                vm.viewModel.data = {};
                vm.viewModel.filelist = [];
                vm.viewModel.mttrFileList = [];

                vm.fnDetail(sn);
            },
            fnDetail:function(sn){
                let vm = this;
                let data = {
                    user_id: vm.viewModel.userInfo.user_id, 
                    chck_act_sn: sn,
                }
                Axios.post("/selectChkActDetail.do", data)
                .then(function(response) {
                    vm.viewModel.chkTypeList = response.data.chkTypeList;
                    vm.viewModel.chkRsltList = response.data.chkRsltList;
                    vm.viewModel.mttrPrgrsList = response.data.mttrPrgrsList;

                    vm.viewModel.data = response.data.detail;
                    //점검 항목 + 파일
                    vm.viewModel.rsltList = response.data.rsltList;
                    vm.viewModel.filelist = response.data.fileList;
                    vm.viewModel.mttrFileList = response.data.mttrFileList;
                }).then(function(){
                    
                    //점검결과 코드 리스트 전달
                    vm.$refs.sub.viewModel.chkRsltList = vm.viewModel.chkRsltList;

                    //진행현황 코드 리스트 전달
                    vm.$refs.sub.viewModel.mttrPrgrsList = vm.viewModel.mttrPrgrsList;

                    //점검등록 체크
                    var arr = vm.viewModel.data.chck_clsf.split(',');
                    vm.viewModel.data.chck_clsf = [];
                    for(let i=0; i<arr.length; i++){
                        vm.viewModel.data.chck_clsf.push(arr[i]);
                    }

                    vm.jobYn = vm.viewModel.data.chck_clsf.indexOf('JC') != -1 ? 'Y' : 'N';
                    // vm.bplcTeamYn = vm.viewModel.data.chck_clsf.indexOf('REC') > -1 || vm.viewModel.data.chck_clsf.indexOf('FC') > -1 ? 'Y' : 'N';
                    vm.bplcTeamYn = vm.viewModel.data.chck_clsf.indexOf('FC') > -1 ? 'Y' : 'N';

                    //점검사항 리스트
                    if(vm.viewModel.rsltList.length > 0){
                        vm.$refs.sub.fnLoadList(vm.viewModel.rsltList, vm.viewModel.filelist, vm.viewModel.mttrFileList);
                    }
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
                            vm.$parent.fnList();
                            vm.$parent.chkPop = false;
                            alert("저장되었습니다.");
                        }else{
                            alert(Message.ERROR);
                        }
                    }).catch(function(ex) {
                        alert(Message.ERROR);
                    });
                }
            },
            fnrsltList:function(vm){
                this.viewModel.rsltList = vm.viewModel.rsltList;
            }
        }
    };
</script>