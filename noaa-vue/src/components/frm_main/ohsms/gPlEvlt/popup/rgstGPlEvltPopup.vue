<template>
    <modal :pass="{popupTitle: '목표 추진계획, 평가기준 결과서'}" >
		<template v-slot:contents>
			<div>
                <table class="table">
                    <caption>목표 추진계획, 평가기준 결과서 등록</caption>
                    <thead>
                        <tr>
                            <th scope="colgroup" rowspan="2">안전보건목표</th>
                            <th scope="col" colspan="4">추진결과</th>
                            <th scope="col" rowspan="2">부진사유</th>
                            <th scope="col" rowspan="2">조치내용</th>
                            <th scope="col" rowspan="2">첨부</th>
                            <th scope="col" colspan="5">평가기준</th>
                            <th scope="col" rowspan="2">비고</th>
                        </tr>
                        <tr>
                            <th scope="col">세부추진계획</th>
                            <th scope="col">반기구분</th>
                            <th scope="col">실적</th>
                            <th scope="col">평가</th>
                            <th scope="col">S</th>
                            <th scope="col">A</th>
                            <th scope="col">B</th>
                            <th scope="col">C</th>
                            <th scope="col">D</th>
                        </tr>
                    </thead>
                    <tbody>
                        <template v-for="(item, i) in viewModel.actplnList" :key="i">
                            <tr>
                                <template v-if="item.row1 == 'Y'">
                                    <td :rowspan="item.row1_cnt * 2" class="align-center">
                                        <textarea title="안전보건목표 입력" v-model="item.safe_helth_goal" disabled rows="4" style="border: none; background-color: white;"></textarea>
                                    </td>
                                </template>
                                <td rowspan="2">
                                    <textarea title="세부추진계획 입력" v-model="item.act_cn" style="border: none; background-color: white;" disabled rows="4"></textarea>
                                </td>
                                <td>
                                    상반기
                                </td>
                                <td>
                                    <textarea title="실적 입력" v-model="item.frhfyr_prfmnc" rows="4" :id="'frhfyr_prfmnc_'+i"></textarea>
                                </td>
                                <td>
                                    <!-- <textarea title="평가 입력" v-model="item.evl" rows="4" :id="'evl_'+i"></textarea> -->
                                    <select title="평가" v-model="item.frhfyr_evl" :id="'frhfyr_evl_'+i" class="wa">
                                        <option value="" selected>평가 선택</option>
                                        <option value="S">S</option>
                                        <option value="A">A</option>
                                        <option value="B">B</option>
                                        <option value="C">C</option>
                                        <option value="D">D</option>
                                    </select>
                                </td>
                                <td>
                                    <textarea title="부진사유 입력" v-model="item.frhfyr_dlln_rsn" rows="4"></textarea>
                                </td>
                                <td>
                                    <textarea title="조치내용 입력" v-model="item.frhfyr_actn_cn" rows="4"></textarea>
                                </td>
                                <td>
                                    <fileform @filelist="fnFilelist"  @fileDelete="fnFileDelete" :pass="{id:'sc'+i, idx:i}" ref="files"></fileform>
                                </td>
                                <td>
                                    <textarea title="S" v-model="item.frhfyr_evl_crtr_s" style="border: none; background-color: white;" disabled rows="4"></textarea>
                                </td>
                                <td>
                                    <textarea title="A" v-model="item.frhfyr_evl_crtr_a" style="border: none; background-color: white;" disabled rows="4"></textarea>
                                </td>
                                <td>
                                    <textarea title="B" v-model="item.frhfyr_evl_crtr_b" style="border: none; background-color: white;" disabled rows="4"></textarea>
                                </td>
                                <td>
                                    <textarea title="C" v-model="item.frhfyr_evl_crtr_c" style="border: none; background-color: white;" disabled rows="4"></textarea>
                                </td>
                                <td>
                                    <textarea title="D" v-model="item.frhfyr_evl_crtr_d" style="border: none; background-color: white;" disabled rows="4"></textarea>
                                </td>
                                <td>
                                    <textarea title="비고" v-model="item.frhfyr_evl_crtr_rmrk" style="border: none; background-color: white;" disabled rows="4"></textarea>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    하반기
                                </td>
                                <td>
                                    <textarea title="실적 입력" v-model="item.shyy_prfmnc" rows="4" :id="'shyy_prfmnc_'+i"></textarea>
                                </td>
                                <td>
                                    <!-- <textarea title="평가 입력" v-model="item.evl" rows="4" :id="'evl_'+i"></textarea> -->
                                    <select title="평가" v-model="item.shyy_evl" :id="'shyy_evl_'+i" class="wa">
                                        <option value="" selected>평가 선택</option>
                                        <option value="S">S</option>
                                        <option value="A">A</option>
                                        <option value="B">B</option>
                                        <option value="C">C</option>
                                        <option value="D">D</option>
                                    </select>
                                </td>
                                <td>
                                    <textarea title="부진사유 입력" v-model="item.shyy_dlln_rsn" rows="4"></textarea>
                                </td>
                                <td>
                                    <textarea title="조치내용 입력" v-model="item.shyy_actn_cn" rows="4"></textarea>
                                </td>
                                <td>
                                    <fileform @filelist="fnFilelist2"  @fileDelete="fnFileDelete2" :pass="{id:'sc1'+i, idx:i}" ref="files2"></fileform>
                                </td>
                                <td>
                                    <textarea title="S" v-model="item.shyy_evl_crtr_s" style="border: none; background-color: white;" disabled rows="4"></textarea>
                                </td>
                                <td>
                                    <textarea title="A" v-model="item.shyy_evl_crtr_a" style="border: none; background-color: white;" disabled rows="4"></textarea>
                                </td>
                                <td>
                                    <textarea title="B" v-model="item.shyy_evl_crtr_b" style="border: none; background-color: white;" disabled rows="4"></textarea>
                                </td>
                                <td>
                                    <textarea title="C" v-model="item.shyy_evl_crtr_c" style="border: none; background-color: white;" disabled rows="4"></textarea>
                                </td>
                                <td>
                                    <textarea title="D" v-model="item.shyy_evl_crtr_d" style="border: none; background-color: white;" disabled rows="4"></textarea>
                                </td>
                                <td>
                                    <textarea title="비고" v-model="item.shyy_evl_crtr_rmrk" style="border: none; background-color: white;" disabled rows="4"></textarea>
                                </td>
                            </tr>
                        </template>
                    </tbody>
                </table>
                <div class="table_footer btn-right">
                    <button @click.prevent="fnFile();" class="btn btn-purple"><svg class="icon"><use xlink:href="/img/symbol-defs.svg#icon-post-add"></use></svg>등록</button>
                </div>
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
                    userInfo:{},
                    actplnList:[],
                    crtrFileList:[],
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
            fnInit:function(sn){
                let vm = this;

                //초기화
                vm.actplnList = [];
                $("#scope-rgstGPlEvlt").find('.popup_panel').addClass('full');
                $("#scope-rgstGPlEvlt").find('.btn.btn-icon.btn_fullscreen').addClass('on');
                $("#scope-rgstGPlEvlt").find('.btn.btn-icon.btn_fullscreen').find('use').attr('xlink:href', '/img/symbol-defs.svg#icon-fullscreen-off')

                vm.viewModel.userInfo = vm.$store.state.global.userInfo;

                Modal.methods.fnInit();
                
                vm.fnDetail(sn);
            },
            fnDetail: function(sn){
                let vm = this;
                
                let data = {
                    prtn_plan_sn: sn,
                    gbn:'rslt'
                }
                Axios.post("/selectGPlEvltDetail.do", data)
                .then(function(response) {
                    vm.viewModel.data = response.data.detail;
                    vm.viewModel.actplnList = response.data.list;
                    vm.viewModel.crtrFileList = response.data.crtrFileList;
                }).then(function(){
                    for(let i=0; i<vm.viewModel.actplnList.length; i++){
                        let item = vm.viewModel.actplnList[i];

                        vm.viewModel.actplnList[i].filelist = vm.viewModel.crtrFileList.filter(data=> data.sub_sn == item.prtn_actpln_sn && data.thrd_sn == item.evl_crtr_sn && data.file_se == 1);
                        vm.viewModel.actplnList[i].filelist2 = vm.viewModel.crtrFileList.filter(data=> data.sub_sn == item.prtn_actpln_sn && data.thrd_sn == item.evl_crtr_sn && data.file_se == 2);
                        vm.viewModel.actplnList[i].deletefileList = [];
                        vm.viewModel.actplnList[i].deletefileList2 = [];

                        vm.$refs.files[i].fnFileLoadList(vm.viewModel.actplnList[i].filelist);
                        vm.$refs.files2[i].fnFileLoadList(vm.viewModel.actplnList[i].filelist2);
                    }
                });
            },
            fnFile: function(){
                let vm = this;
                let frm = new FormData();

                for(let i=0; i<vm.viewModel.actplnList.length; i++) {
                    let item = vm.viewModel.actplnList[i];
                    for(let j=0; j<item.filelist.length; j++) {
                        let fileData = item.filelist[j];
                        let key = fileData.file_seq;
                        if(fileData.file != null) {
                            frm.append("fileTitle", fileData.file_title);
                            frm.append("uploadFiles", fileData.file);
                            frm.append("sn", item.prtn_actpln_sn);
                            frm.append("sub_sn", item.evl_crtr_sn);
                            frm.append("file_se", 1);
                            frm.append("key", 0)
                            if(fileData.file_sn){
                                frm.append("deleteFiles", fileData.file_sn);
                                frm.append("del_sn", item.prtn_actpln_sn);
                                frm.append("del_sub_sn", item.evl_crtr_sn);
                            }
                        } else {
                            if(fileData.file == undefined){
                            }else{
                            }
                        }
                    }

                    for(let j=0; j<item.deletefileList.length; j++){
                        frm.append("deleteFiles", item.deletefileList[j]);
                        frm.append("del_sn", item.prtn_actpln_sn);
                        frm.append("del_sub_sn", item.evl_crtr_sn);
                    }

                    for(let j=0; j<item.filelist2.length; j++) {
                        let fileData = item.filelist2[j];
                        let key = fileData.file_seq;
                        if(fileData.file != null) {
                            frm.append("fileTitle", fileData.file_title);
                            frm.append("uploadFiles", fileData.file);
                            frm.append("sn", item.prtn_actpln_sn);
                            frm.append("sub_sn", item.evl_crtr_sn);
                            frm.append("file_se", 2);
                            frm.append("key", 0)
                            if(fileData.file_sn){
                                frm.append("deleteFiles", fileData.file_sn);
                                frm.append("del_sn", item.prtn_actpln_sn);
                                frm.append("del_sub_sn", item.evl_crtr_sn);
                            }
                        } else {
                            if(fileData.file == undefined){
                            }else{
                            }
                        }
                    }

                    for(let j=0; j<item.deletefileList2.length; j++){
                        frm.append("deleteFiles", item.deletefileList2[j]);
                        frm.append("del_sn", item.prtn_actpln_sn);
                        frm.append("del_sub_sn", item.evl_crtr_sn);
                    }
                }

                vm.fnSave(frm);
            },
            fnSave: function(frm){
                let vm = this;

                // for(let i=0; i<vm.viewModel.actplnList.length; i++){
                //     let item = vm.viewModel.actplnList[i];

                //     if(item.frhfyr_prfmnc == '' || item.frhfyr_prfmnc == undefined){
                //         alert(messageUtil(Message.VALIDATION_REQUIRED, ['추진결과-실적']));
                //         $("#frhfyr_prfmnc_" + i).focus();;
                //         return false;
                //     }else if(item.frhfyr_evl == '' || item.frhfyr_evl == undefined){
                //         alert(messageUtil(Message.VALIDATION_REQUIRED, ['추진결과-평가']));
                //         $("#frhfyr_evl_" + i).focus();
                //         return false;
                //     }else if(item.shyy_prfmnc == '' || item.shyy_prfmnc == undefined){
                //         alert(messageUtil(Message.VALIDATION_REQUIRED, ['추진결과-실적']));
                //         $("#shyy_prfmnc_" + i).focus();;
                //         return false;
                //     }else if(item.shyy_evl == '' || item.shyy_evl == undefined){
                //         alert(messageUtil(Message.VALIDATION_REQUIRED, ['추진결과-평가']));
                //         $("#shyy_evl_" + i).focus();
                //         return false;
                //     }
                // }
                
                let data = {
                    reg_id: vm.viewModel.userInfo.user_id,
                    list: vm.viewModel.actplnList,
                    bplc_sn: vm.viewModel.data.bplc_sn,
                    prtn_plan_sn: vm.viewModel.data.prtn_plan_sn,
                };

                frm.append('data', new Blob([ JSON.stringify(data) ], {type : "application/json"}));
                
                frm.append("filePath", "gPlEvlt");

                
                if(confirm(Message.CREATE_CONFIRM)){
                    $(".loading").show();
                    $("#mask").show();
                    Axios.post("/updateGPlEvltEvl.do", frm).then(function(response) {
                        if(response.data == 1){
                            vm.$parent.rsltPop =false;
                            vm.$parent.fnList();
                            alert("저장되었습니다.");
                        }else{
                            alert(Message.ERROR);    
                        }
                        
                    }).catch(function(ex) {
                        alert(Message.ERROR);
                    }).finally(function(){
                        $(".loading").hide();
                        $("#mask").hide();
                    });
                }
            },
            fnFileDelete: function(vm){
                this.viewModel.actplnList[vm.idx].deletefileList = vm.deletefileList;
            },
            fnFilelist:function(vm){
                this.viewModel.actplnList[vm.idx].filelist = vm.filelist;
            },
            fnFileDelete2: function(vm){
                this.viewModel.actplnList[vm.idx].deletefileList2 = vm.deletefileList;
            },
            fnFilelist2:function(vm){
                this.viewModel.actplnList[vm.idx].filelist2 = vm.filelist;
            },
        }
    };
</script>