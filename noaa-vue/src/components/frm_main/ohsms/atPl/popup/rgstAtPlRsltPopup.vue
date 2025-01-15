<template>
    <modal :pass="{popupTitle: '액션플랜 결과서'}">
		<template v-slot:contents>
			<table class="table">
                <caption>ActionPlan 평가 기준표</caption>
                <thead>
                    <tr>
                        <th scope="colgroup" rowspan="2">KFS</th>
                        <th scope="col" rowspan="2">세부 목표</th>
                        <th scope="col" rowspan="2">반기구분</th>
                        <th scope="col" rowspan="2">실적</th>
                        <th scope="col" rowspan="2">평가</th>
                        <th scope="col" rowspan="2">부진사유</th>
                        <th scope="col" rowspan="2">조치내용</th>
                        <th scope="col" rowspan="2">첨부</th>
                        <th scope="col" colspan="5">평가기준</th>
                    </tr>
                    <tr>
                        <th scope="col">S</th>
                        <th scope="col">A</th>
                        <th scope="col">B</th>
                        <th scope="col">C</th>
                        <th scope="col">D</th>
                    </tr>
                </thead>
                <tbody>
                    <template v-for="(item, i) in viewModel.actplnList2" :key="i">
                        <tr>
                            <td rowspan="2">
                                {{ item.kfs }}
                            </td>
                            <td rowspan="2">
                                {{ item.detail_goal }}
                            </td>
                            <td>
                                상
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
                                <fileform @filelist="fnFilelist_frhfyr"  @fileDelete="fnFileDelete_frhfyr" :pass="{id:'sc_frhfyr'+i, idx:i}" ref="files_frhfyr"></fileform>
                            </td>
                            <td> 
                                {{ item.frhfyr_evl_crtr_s }}
                            </td>
                            <td>
                                {{ item.frhfyr_evl_crtr_a }}
                            </td>
                            <td>
                                {{ item.frhfyr_evl_crtr_b }}
                            </td>
                            <td>
                                {{ item.frhfyr_evl_crtr_c }}                                
                            </td>
                            <td>
                                {{ item.frhfyr_evl_crtr_d }}                                
                            </td>
                        </tr>
                        <tr>
                            <td>
                                하
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
                                <fileform @filelist="fnFilelist_shyy"  @fileDelete="fnFileDelete_shyy" :pass="{id:'sc_shyy'+i, idx:i}" ref="files_shyy"></fileform>
                            </td>
                            <td>
                                {{ item.shyy_evl_crtr_s }}
                            </td>
                            <td>
                                {{ item.shyy_evl_crtr_a }}
                            </td>
                            <td>
                                {{ item.shyy_evl_crtr_b }}
                            </td>
                            <td>
                                {{ item.shyy_evl_crtr_c }}
                            </td>
                            <td>
                                {{ item.shyy_evl_crtr_d }}
                            </td>
                        </tr>
                    </template>
                </tbody>
            </table>
            <div class="table_footer btn-right">
                <button @click.prevent="fnFileInfo();" class="btn btn-purple"><svg class="icon"><use xlink:href="/img/symbol-defs.svg#icon-post-add"></use></svg>등록</button>
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
                    data:{
                        dcsnr:'',
                        dcsnr_nm:'',
                    },
                    userInfo:{},
                    filelist:[],
                    //추진계획서 리스트
                    actplnList:[{seq:1}],
                    actplnList2:[{seq2:1}],
                    selActplnList:[],
                    fileList1:[],
                    fileList2:[],
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
                $("#scope-rgstAtPl").find('.popup_panel').addClass('full');
                $("#scope-rgstAtPl").find('.btn.btn-icon.btn_fullscreen').addClass('on');
                $("#scope-rgstAtPl").find('.btn.btn-icon.btn_fullscreen').find('use').attr('xlink:href', '/img/symbol-defs.svg#icon-fullscreen-off')

                vm.viewModel.userInfo = vm.$store.state.global.userInfo;

                Modal.methods.fnInit();
                
                vm.fnDetail(sn);
            },
            fnDetail: function(sn){
                let vm = this;
                
                let data = {
                    plan_sn: sn
                }
                Axios.post("/selectAtPlDetail.do", data)
                .then(function(response) {
                    vm.viewModel.data = response.data.detail;
                    vm.viewModel.actplnList2 = response.data.list2;
                    vm.viewModel.fileList1 = response.data.fileList1;
                    vm.viewModel.fileList2 = response.data.fileList2;
                }).then(function(){
                    for(let i=0; i<vm.viewModel.actplnList2.length; i++){
                        let item = vm.viewModel.actplnList2[i];

                        // vm.viewModel.actplnList[i].filelist = vm.viewModel.crtrFileList.filter(data=>  data.sub_sn == item.prtn_actpln_sn && data.thrd_sn == item.evl_crtr_sn);
                        // vm.viewModel.actplnList[i].deletefileList = [];

                        vm.viewModel.actplnList2[i].frhfyrfilelist = vm.viewModel.fileList1.filter(data=>  data.sub_sn == item.kfs_sn);
                        vm.viewModel.actplnList2[i].frhfyrdeletefileList = [];
                        vm.viewModel.actplnList2[i].shyyfilelist = vm.viewModel.fileList2.filter(data=>  data.sub_sn == item.kfs_sn);
                        vm.viewModel.actplnList2[i].shyydeletefileList = [];
                        
                        vm.$refs.files_frhfyr[i].fnFileLoadList(vm.viewModel.actplnList2[i].frhfyrfilelist);
                        vm.$refs.files_shyy[i].fnFileLoadList(vm.viewModel.actplnList2[i].shyyfilelist);
                    }
                });
            },
            fnFileInfo: function(){
                let vm = this;
                let frm = new FormData();

                for(let i=0; i<vm.viewModel.actplnList2.length; i++) {
                    let item = vm.viewModel.actplnList2[i];
                    for(let j=0; j<item.frhfyrfilelist.length; j++) {
                        let fileData = item.frhfyrfilelist[j];
                        
                        let key = fileData.file_seq;
                        if(fileData.file != null) {
                            frm.append("fileTitle", fileData.file_title);
                            frm.append("uploadFiles", fileData.file);
                            frm.append("sn", item.kfs_sn);
                            frm.append("file_se", 1); //상반기
                            frm.append("key", 0)
                            if(fileData.file_sn){
                                frm.append("deleteFiles", fileData.file_sn);
                                frm.append("del_sn", item.kfs_sn);
                                frm.append("file_se", 1);//상반기
                            }
                        }
                    }

                    for(let j=0; j<item.shyyfilelist.length; j++) {
                        let fileData_shyy = item.shyyfilelist[j];
                        if(fileData_shyy.file != null) {
                            frm.append("fileTitle", fileData_shyy.file_title);
                            frm.append("uploadFiles", fileData_shyy.file);
                            frm.append("sn", item.kfs_sn);
                            frm.append("file_se", 2); //하반기
                            frm.append("key", 0)
                            if(fileData_shyy.file_sn){
                                frm.append("deleteFiles", fileData_shyy.file_sn);
                                frm.append("del_sn", item.kfs_sn);
                                frm.append("file_se", 2);//하반기
                            }
                        }
                    }

                    for(let j=0; j<item.frhfyrdeletefileList.length; j++){
                        frm.append("deleteFiles", item.frhfyrdeletefileList[j]);
                        frm.append("del_sn", item.kfs_sn);
                        frm.append("file_se", 1);//상반기
                    }

                    for(let j=0; j<item.shyydeletefileList.length; j++){
                        frm.append("deleteFiles", item.shyydeletefileList[j]);
                        frm.append("del_sn", item.kfs_sn);
                        frm.append("file_se", 2);//하반기
                    }
                }

                vm.fnSave(frm);
            },
            fnSave: function(frm){
                let vm = this;

                // for(let i=0; i<vm.viewModel.actplnList2.length; i++){
                //     let item = vm.viewModel.actplnList2[i];

                //     if(item.frhfyr_prfmnc == '' || item.frhfyr_prfmnc == undefined){
                //         alert(messageUtil(Message.VALIDATION_REQUIRED, ['상반기-실적']));
                //         $("#frhfyr_prfmnc_" + i).focus();;
                //         return false;
                //     }else if(item.frhfyr_evl == '' || item.frhfyr_evl == undefined){
                //         alert(messageUtil(Message.VALIDATION_REQUIRED, ['상반기-평가']));
                //         $("#frhfyr_evl_" + i).focus();
                //         return false;
                //     }else if(item.shyy_prfmnc == '' || item.shyy_prfmnc == undefined){
                //         alert(messageUtil(Message.VALIDATION_REQUIRED, ['하반기-실적']));
                //         $("#shyy_prfmnc_" + i).focus();;
                //         return false;
                //     }else if(item.shyy_evl == '' || item.shyy_evl == undefined){
                //         alert(messageUtil(Message.VALIDATION_REQUIRED, ['하반기-평가']));
                //         $("#shyy_evl_" + i).focus();
                //         return false;
                //     }
                // }
                
                let data = {
                    reg_id: vm.viewModel.userInfo.user_id,
                    list: vm.viewModel.actplnList2,
                    bplc_sn: vm.viewModel.data.bplc_sn,
                    plan_sn: vm.viewModel.data.plan_sn,
                };

                frm.append('data', new Blob([ JSON.stringify(data) ], {type : "application/json"}));
                
                frm.append("filePath", "atPl");

                
                if(confirm(Message.CREATE_CONFIRM)){
                    $(".loading").show();
                    $("#mask").show();
                    Axios.post("/updateAtPlEvlCrtr.do", frm).then(function(response) {
                        if(response.data == 1){
                            vm.$parent.rsltPop =false;
                            vm.$parent.fnList(0);
                            alert("저장되었습니다.");
                        }
                        
                    }).catch(function(ex) {
                        alert(Message.ERROR);
                    }).finally(function(){
                        $(".loading").hide();
                        $("#mask").hide();
                    });
                }
            },
            fnFileDelete_frhfyr: function(vm){
                this.viewModel.actplnList2[vm.idx].frhfyrdeletefileList = vm.deletefileList;
            },
            fnFilelist_frhfyr:function(vm){
                this.viewModel.actplnList2[vm.idx].frhfyrfilelist = vm.filelist;
            },
            fnFileDelete_shyy: function(vm){
                this.viewModel.actplnList2[vm.idx].shyydeletefileList = vm.deletefileList;
            },
            fnFilelist_shyy:function(vm){
                this.viewModel.actplnList2[vm.idx].shyyfilelist = vm.filelist;
            },
        }
    };
</script>