<template>
    <ul class="accordion">
        <template v-for="(item, idx) in viewModel.selCfnlList" >
                <li>
                    <button class="title">
                        공종명 : <span :class="'ml5'">{{ item.spcmDetail.cfnl_nm }}</span>
                        <label :for="'lgz_hgh_risk_yn_'+idx" class="switch">
                            <input type="checkbox" :id="'lgz_hgh_risk_yn_'+idx" true-value="Y" false-value="N" v-model="item.spcmDetail.lgz_hgh_risk_yn">
                            <span><i></i></span>
                            대형(고)위험
                        </label>
                    </button>
                    
                    <div class="contents">
                        <div>
                            <h3>우리 기준</h3>
                            <div class="table_top btn-right">
                                <button class="btn btn-white" @click="fnFstRisk(idx);"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-search"></use></svg>최초위험성찾기</button>
                                <button class="btn btn-light-purple" @click.prevent="fnItemAdd(idx)"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-wrap-text"></use></svg>추가</button>
                                <button class="btn btn-gray" @click.prevent="fnItemSort(idx)"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-trash-can"></use></svg>삭제</button>
                            </div>
                            <table class="table">
                                <caption>우리 기준</caption>
                                <thead>
                                    <tr>
                                        <th></th>
                                        <th scope="col">작업절차</th>
                                        <th scope="col">주요위험요인</th>
                                        <th scope="col">안전대책</th>
                                        <th scope="col">할 수 없는 것</th>
                                        <th scope="col" >위험도[상,중,하]</th>
                                        <th colspan="2">관리</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(cfnlItem, index) in item.cfnlList">
                                        <template v-if="cfnlItem.row1 == 'Y'">
                                            <td :rowspan="cfnlItem.row1_cnt"><input type="checkbox" :id="cfnlItem.job_process_sn" :value="cfnlItem" v-model="item.delcfnlList"></td>
                                            <td :rowspan="cfnlItem.row1_cnt">
                                                <textarea title="입력" v-model="cfnlItem.job_process_nm" v-input="fnInptJob(cfnlItem.job_process_sn, index, idx)" :id="'job_process_nm_'+idx+'_'+index"></textarea>
                                            </td>
                                        </template>
                                        <template v-if="cfnlItem.row2 == 'Y'">
                                            <td :rowspan="cfnlItem.row2_cnt">
                                                <textarea v-model="cfnlItem.main_risk_fctr" v-input="fnInptMain(cfnlItem.job_process_sn, cfnlItem.main_risk_fctr_sn, index, idx)" :id="'main_risk_fctr_'+idx+'_'+index"></textarea>
                                            </td>
                                        </template>
                                        <td>
                                            <textarea v-model="cfnlItem.safe_cntrpln" :id="'safe_cntrpln_'+idx+'_'+index"></textarea>
                                        </td>
                                        <td>
                                            <input type="checkbox" :id="'psblty_yn'" v-model="cfnlItem.psblty_yn" true-value="Y" false-value="N">
                                        </td>
                                        <td>
                                            <select title="위험도 선택" v-model="cfnlItem.dgdgr_uml" :style="cfnlItem.psblty_yn == 'Y' ? 'display: none;':''" :id="'dgdgr_uml_'+idx+'_'+index">
                                                <option value=''>위험도 선택</option>
                                                <option v-for="item in viewModel.dgdgrList" :key="item" :value="item.CODE">{{ item.CODE_NM }}</option>
                                            </select>
                                        </td>
                                        <td>
                                            <div class="icon_box">
                                                <button class="btn btn-icon" @click.prevent="fnItemAdd3(cfnlItem.job_process_sn, cfnlItem.main_risk_fctr_sn, cfnlItem.safe_cntrpln_sn, index, idx)"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-add-circle"></use></svg></button>
                                                <button class="btn btn-icon" @click.prevent="fnItemDel3(cfnlItem.job_process_sn, cfnlItem.main_risk_fctr_sn, cfnlItem.safe_cntrpln_sn, index, idx)"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-circle-minus"></use></svg></button>
                                            </div>
                                        </td>
                                        <template v-if="cfnlItem.row2 == 'Y'">
                                            <td :rowspan="cfnlItem.row2_cnt">
                                                <div class="icon_box">
                                                    <button class="btn btn-icon" @click.prevent="fnItemAdd2(cfnlItem.job_process_sn, cfnlItem.main_risk_fctr_sn, idx)"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-add-circle"></use></svg></button>
                                                    <button class="btn btn-icon" @click.prevent="fnItemDel2(cfnlItem.job_process_sn, cfnlItem.main_risk_fctr_sn, idx)"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-circle-minus"></use></svg></button>
                                                </div>
                                            </td>
                                        </template>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div>
                            <h3>타사사고사례</h3>
                            <div class="input_group btn-right" >
                                <span>
                                    재해유형 : 
                                </span>
                                <input type="text" v-model="item.spcmDetail.dsstr_type" class="w180">
                            </div>
                            <table class="table">
                                <caption>타사사고사례</caption>
                                <thead>
                                	<tr>
                                    	<th scope="col">관련사진</th>
	                                    <th scope="col">사고발생원인</th>
	                                    <th scope="col">안전대책</th>
	                                </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td style="width: 16.15rem;">
                                            <imgfileform :ref="'imgfileform1'" :pass="{id:'img1_'+idx, index: idx, mode:'update'}" @filelist="fnImgFileList1" @fileDelete="fnImgFileDelete1"></imgfileform>
                                        </td>
                                        <td>
                                            <textarea v-model="item.spcmDetail.acdnt_ocrn_cause" id="acdnt_ocrn_cause" rows="10"></textarea>
                                        </td>
                                        <td><textarea v-model="item.spcmDetail.othr_safe_cntrpln" id="othr_safe_cntrpln" rows="10"></textarea></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div>
                            <h3>작업내용 / 계획 소공정 PCM</h3>
                            <table class="table">
                                <caption>작업내용 / 계획 소공정 PCM</caption>
                                <tbody>
                                    <tr>
                                        <th>아차사고사례</th>
                                        <td :colspan="3"><input type="text" v-model="item.spcmDetail.acdnt_case" :id="'acdnt_case'"></td>
                                    </tr>
                                    <tr>
                                        <th>주변여건</th>
                                        <td><input type="text" v-model="item.spcmDetail.cfr_cnd" :id="'cfr_cnd'"></td>
                                        <th>사용장비/기계기구</th>
                                        <td><input type="text" v-model="item.spcmDetail.use_eqpmnt_mchn" :id="'use_eqpmnt_mchn'"></td>
                                    </tr>
                                    <tr>
                                        <th :colspan="4">◆작업 방법/절차  ◆현장여건  ◆위험 요인   ◆기계기구 점검   ◆기타 정보제공</th>
                                    </tr>
                                    <tr>
                                        <td>
                                            <textarea title="유형" v-model="item.spcmDetail.cn_type" :id="'cn_type_'+idx" rows="10"></textarea>
                                        </td>
                                        <td :colspan="3">
                                            <imgfileform :ref="'imgfileform2'" :pass="{id:'img2_'+idx, index: idx, mode:'update'}" @filelist="fnImgFileList2" @fileDelete="fnImgFileDelete2"></imgfileform>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div>
                            <h3>추가 위험 및 대책</h3>
                            <div class="table_top btn-right">
                                <button class="btn btn-light-purple" @click="fnRiskAdd(idx);"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-wrap-text"></use></svg>추가</button>
                                <button class="btn btn-gray" @click="fnRiskDel(idx);"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-trash-can"></use></svg>삭제</button>
                            </div>
                            <table class="table">
                                <caption>추가 위험 및 대책</caption>
                                <thead>
                                    <th></th>
                                    <th>누락된 작업</th>
                                    <th>위험요인</th>
                                    <th>위험감소대책</th>
                                    <th>조치기한 / 담당자</th>
                                    <th>위험도[상,중,하]</th>
                                </thead>
                                <tbody>
                                    <tr v-for="(riskItem, riskIndex) in item.aditRiskList">
                                        <td>
                                            <input type="checkbox" :id="'risk_check_'+riskIndex" :value="riskItem" v-model="item.selAditRiskList" title="선택">
                                        </td>
                                        <td>
                                            <input type="text" v-model="riskItem.ovsite_job" :id="'ovsite_job_' + idx + '_' + riskIndex">
                                        </td>
                                        <td>
                                            <input type="text" v-model="riskItem.risk_fctr" :id="'risk_fctr_' + idx + '_' + riskIndex">
                                        </td>
                                        <td>
                                            <input type="text" v-model="riskItem.risk_dcrs_cntrpln" :id="'risk_dcrs_cntrpln_' + idx + '_' + riskIndex">
                                        </td>
                                        <td>
                                            <div class="input_group input_btn">
                                                <input type="text" v-model="riskItem.actn_term" :id="'actn_term_' + idx + '_' + riskIndex">&nbsp;&nbsp;/&nbsp;
                                                <input type="text" :id="'pic_nm_' + idx + '_' + riskIndex" :value="riskItem.pic_nm" readonly @click="fnMeaPopup(idx, riskIndex);">
                                                <label :for="'pic_nm_' + idx + '_' + riskIndex"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-search"></use></svg></label>
                                            </div>
                                        </td>
                                        <td>
                                            <select title="위험도 선택" v-model="riskItem.dgdgr" :id="'dgdgr_' + idx + '_' + riskIndex">
                                                <option value=''>위험도 선택</option>
                                                <option v-for="item in viewModel.dgdgrList" :key="item" :value="item.CODE">{{ item.CODE_NM }}</option>
                                            </select>
                                        </td>
                                    </tr>
                                    <tr v-if="item.aditRiskList.length == 0"><td :colspan="'6'">데이터가 없습니다.</td></tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </li>
            <!-- </template> -->
        </template>
    </ul>
</template> 
<script>
    import "es6-promise/auto";
    import Vue from "vue";
    import Axios from "axios";
    import imgfileform from '../../../../common/vue/imgfileform2.vue';
    
    export default {
        components: {
            'imgfileform' : imgfileform,
		},
        data: function() {
            return {
                viewModel:{
                    userInfo: this.$parent.viewModel.userInfo,
                    dgdgrList:[],
                    selCfnlList:[],
                },
                idx: '',
                riskIndex: '',
            }
        },
        mounted: function() {
            let vm = this;
        },
        methods: {
            fnInit: function(dgdgrList, selCfnlList){
                let vm = this;
                vm.viewModel.dgdgrList = dgdgrList;

                if(selCfnlList != undefined){
                    vm.viewModel.selCfnlList = selCfnlList;

                    vm.$nextTick(function() {
                        for(let i=0; i<vm.viewModel.selCfnlList.length; i++){
                            vm.viewModel.selCfnlList[i].imgfilelist1 = vm.viewModel.selCfnlList[i].fileList.filter(item=> item.file_se == 1);
                            vm.$refs.imgfileform1[i].fnFileLoadList(vm.viewModel.selCfnlList[i].imgfilelist1);

                            vm.viewModel.selCfnlList[i].imgfilelist2 = vm.viewModel.selCfnlList[i].fileList.filter(item=> item.file_se == 2);
                            vm.$refs.imgfileform2[i].fnFileLoadList(vm.viewModel.selCfnlList[i].imgfilelist2);
                        }
                    });
                }
            },
            fnRiskAdd: function(index){
                let vm = this;
                let seq = vm.viewModel.selCfnlList[index].aditRiskList.length == 0 ? 0 : vm.viewModel.selCfnlList[index].aditRiskList[vm.viewModel.selCfnlList[index].aditRiskList.length-1].seq;
                vm.viewModel.selCfnlList[index].aditRiskList.push({'seq': seq + 1,  'dgdgr':''});
            },
            fnRiskDel: function(index){
                let vm = this;
                
                for(let i=0; i<vm.viewModel.selCfnlList[index].selAditRiskList.length; i++){
                    let selRiskIndex = vm.viewModel.selCfnlList[index].aditRiskList.findIndex(data=> data.seq == vm.viewModel.selCfnlList[index].selAditRiskList[i].seq);

                    vm.viewModel.selCfnlList[index].aditRiskList.splice(selRiskIndex, 1);
                }
            },
            fnMeaPopup: function(idx, riskIndex){
                let vm = this;
				
                vm.idx = idx;
                vm.riskIndex = riskIndex 
                vm.$parent.fnMesurePopup();
            },
            fnMemberAdd: function(list){
                let vm = this;

                let userNmStr = "";
                let userIdStr = "";
                for(let i=0; i<list.length; i++){
                    if(userNmStr == ""){
                        userNmStr = list[i].user_nm;
                        userIdStr = list[i].user_id;
                    }else{
                        userNmStr += "," + list[i].user_nm;
                        userIdStr += "," + list[i].user_id;
                    }
                }

                vm.viewModel.selCfnlList[vm.idx].aditRiskList[vm.riskIndex].pic = userIdStr;
                vm.viewModel.selCfnlList[vm.idx].aditRiskList[vm.riskIndex].pic_nm = userNmStr;
                
                vm.$set(vm.viewModel.selCfnlList[vm.idx].aditRiskList, vm.riskIndex, vm.viewModel.selCfnlList[vm.idx].aditRiskList[vm.riskIndex]);
            }, 
            fnItemAdd:function(idx){
                let vm = this;
                let len = vm.viewModel.selCfnlList[idx].cfnlList.length;
                let val = {
                    job_process_sn: len == 0 ? 0 : (vm.viewModel.selCfnlList[idx].cfnlList[len-1].job_process_sn + 1),
                    job_process_nm: '',
                    main_risk_fctr_sn: 0,
                    main_risk_fctr: '',
                    safe_cntrpln_sn: 0,
                    safe_cntrpln: '',
                    row1:'Y',
                    row2:'Y',
                    row1_cnt:1,
                    row2_cnt:1,
                    psblty_yn:'N',
                    dgdgr_uml:''
                }
                vm.viewModel.selCfnlList[idx].cfnlList.push(val);
            },
            fnItemSort: function(idx){
                //정렬먼저
                let vm = this;
                
                // vm.viewModel.selCfnlList[idx].delcfnlList.sort();

                vm.fnItemDel(idx);
            },
            fnItemDel:function(idx){
                let vm = this;
                let delList = [];

                if(vm.viewModel.selCfnlList[idx].delcfnlList.length == 0){
                   alert("삭제할 작업절차를 선택해주세요.");
                   return false;
                }

                for(let i in vm.viewModel.selCfnlList[idx].delcfnlList){
                    for(let j in vm.viewModel.selCfnlList[idx].cfnlList){
                        if(vm.viewModel.selCfnlList[idx].cfnlList[j].job_process_sn == vm.viewModel.selCfnlList[idx].delcfnlList[i].job_process_sn){ //일치하는지 체크
                            delList.push(j);
                        }
                    }
                }

                delList.sort(function (a, b) {
                    return a - b;
                });
                
                for(let i in vm.viewModel.selCfnlList[idx].cfnlList){
                    let item = vm.viewModel.selCfnlList[idx].cfnlList[i];

                    let list = vm.viewModel.selCfnlList[idx].delcfnlList.filter(data => data < item.job_process_sn);
                    item.job_process_sn -= list.length;
                    
                }
                
                // //일치하는 작업절차 삭제(하위항목도 같이 삭제)
                for(let i = delList.length-1; i>=0; i--){
                    vm.viewModel.selCfnlList[idx].cfnlList.splice(delList[i], 1);

                    if(i == 0){
                        vm.viewModel.selCfnlList[idx].delcfnlList = [];
                    }
                }

                
            },
            fnItemAdd2:function(j_id, m_id, idx){
                let vm = this;

                let list = vm.viewModel.selCfnlList[idx].cfnlList.filter(data => data.job_process_sn == j_id);
                let list2 = list.filter(data => data.main_risk_fctr_sn == m_id);
                let index = vm.viewModel.selCfnlList[idx].cfnlList.findIndex(data => data.job_process_sn == j_id && data.main_risk_fctr_sn == m_id);

                let nameList = vm.viewModel.selCfnlList[idx].cfnlList.filter(data=> data.job_process_sn == j_id); 
                let job_process_nm = '';

                if(nameList.length > 0){
                    job_process_nm = nameList[0].job_process_nm;
                }
                
                let val = {
                    job_process_sn: j_id,
                    job_process_nm: job_process_nm,
                    main_risk_fctr_sn: (m_id + 1),
                    main_risk_fctr: '',
                    safe_cntrpln_sn: 0,
                    safe_cntrpln: '',
                    row1_cnt: (list.length+1),
                    row2_cnt: 1,
                    row2:'Y',
                    psblty_yn:'N',
                    dgdgr_uml:''
                }

                for(let i in vm.viewModel.selCfnlList[idx].cfnlList){
                    let item = vm.viewModel.selCfnlList[idx].cfnlList[i];

                    if(item.job_process_sn == j_id){

                        vm.viewModel.selCfnlList[idx].cfnlList[i].row1_cnt = (list.length + 1);

                        if(item.main_risk_fctr_sn > m_id){
                            vm.viewModel.selCfnlList[idx].cfnlList[i].main_risk_fctr_sn++;
                        }
                    }
                }
                vm.viewModel.selCfnlList[idx].cfnlList.splice((index+list2.length), 0, val);

            },
            fnItemDel2:function(j_id, m_id, idx){
                let vm = this;
                let delList = [];
                
                let list = vm.viewModel.selCfnlList[idx].cfnlList.filter(data => data.job_process_sn == j_id && data.main_risk_fctr_sn == m_id);
                let cnt1 = list[0].row1_cnt;
                let cnt2 = list[0].row2_cnt;

                for(let j in vm.viewModel.selCfnlList[idx].cfnlList){
                    let item = vm.viewModel.selCfnlList[idx].cfnlList[j];
                    
                    if(vm.viewModel.selCfnlList[idx].cfnlList[j].job_process_sn == j_id ){
                        item.row1_cnt = (item.row1_cnt - list.length);

                        if(item.main_risk_fctr_sn == m_id){
                            delList.push(j);
                        }
                    }
                    
                    if(cnt1 == cnt2){
                        if(item.job_process_sn > j_id){
                            item.job_process_sn = (item.job_process_sn - 1);
                        }                    
                    }else{
                        if(item.job_process_sn == j_id && item.main_risk_fctr_sn > m_id){
                            item.main_risk_fctr_sn--;
                        } 
                    }                
                }
                
                //일치하는 작업절차 삭제(하위항목도 같이 삭제)
                for(let i = delList.length-1; i>=0; i--){
                    vm.viewModel.selCfnlList[idx].cfnlList.splice(delList[i], 1);
                }
  
                //rowspan 해야할 항목 체크
                for(let i in vm.viewModel.selCfnlList[idx].cfnlList){
                    let item = vm.viewModel.selCfnlList[idx].cfnlList[i];

                    if(item.safe_cntrpln_sn == 0){
                        vm.viewModel.selCfnlList[idx].cfnlList[i].row2 = 'Y';

                        if(item.main_risk_fctr_sn == 0){
                            vm.viewModel.selCfnlList[idx].cfnlList[i].row1 = 'Y';
                        }else{
                            vm.viewModel.selCfnlList[idx].cfnlList[i].row1 = 'N';
                        }
                    }else{
                        vm.viewModel.selCfnlList[idx].cfnlList[i].row1 = 'N';
                    }
                }
            },
            fnItemAdd3:function(j_id, m_id, s_id, index, idx){
                let vm = this;

                let list = vm.viewModel.selCfnlList[idx].cfnlList.filter(data=> data.job_process_sn == j_id && data.job_process_sn == m_id); 
                let job_process_nm = '';
                let main_risk_fctr = '';

                if(list.length > 0){
                    job_process_nm = list[0].job_process_nm;
                    main_risk_fctr = list[0].main_risk_fctr;
                }
                
                let val = {
                    job_process_sn: j_id,
                    job_process_nm: job_process_nm,
                    main_risk_fctr_sn: m_id,
                    main_risk_fctr: main_risk_fctr,
                    safe_cntrpln_sn: (s_id+1),
                    safe_cntrpln: '',
                    row1_cnt: (vm.viewModel.selCfnlList[idx].cfnlList[index].row1_cnt + 1),
                    row2_cnt: (vm.viewModel.selCfnlList[idx].cfnlList[index].row2_cnt + 1),
                    psblty_yn:'N',
                    dgdgr_uml:''
                }

                for(let i in vm.viewModel.selCfnlList[idx].cfnlList){
                    let item = vm.viewModel.selCfnlList[idx].cfnlList[i];

                    if(item.job_process_sn == j_id){

                        vm.viewModel.selCfnlList[idx].cfnlList[i].row1_cnt = (vm.viewModel.selCfnlList[idx].cfnlList[i].row1_cnt + 1);

                        if(item.main_risk_fctr_sn == m_id){
                            vm.viewModel.selCfnlList[idx].cfnlList[i].row2_cnt = (vm.viewModel.selCfnlList[idx].cfnlList[i].row2_cnt + 1);
    
                            if(item.safe_cntrpln_sn > s_id){
                                vm.viewModel.selCfnlList[idx].cfnlList[i].safe_cntrpln_sn++;
                            }
                        }
                    }
                }

                vm.viewModel.selCfnlList[idx].cfnlList.splice((index+1), 0, val);
            },
            fnItemDel3:function(j_id, m_id, s_id, index, idx){
                let vm = this;
                
                let list = vm.viewModel.selCfnlList[idx].cfnlList.filter(data => data.job_process_sn == j_id && data.main_risk_fctr_sn == m_id);
                
                for(let i in vm.viewModel.selCfnlList[idx].cfnlList){
                    let item = vm.viewModel.selCfnlList[idx].cfnlList[i];

                    if(item.job_process_sn == j_id){
                        if(item.main_risk_fctr_sn == m_id){
                            
                            vm.viewModel.selCfnlList[idx].cfnlList[i].row2_cnt = (vm.viewModel.selCfnlList[idx].cfnlList[i].row2_cnt - 1);

                            if(item.safe_cntrpln_sn > s_id){
                                vm.viewModel.selCfnlList[idx].cfnlList[i].safe_cntrpln_sn--;
                            }

                        }
                        
                        vm.viewModel.selCfnlList[idx].cfnlList[i].row1_cnt = (vm.viewModel.selCfnlList[idx].cfnlList[i].row1_cnt - 1);

                        if(list.length == 1){
                            if(item.main_risk_fctr_sn > m_id){
                                vm.viewModel.selCfnlList[idx].cfnlList[i].main_risk_fctr_sn--;
                            }
                        }                        
                    }
                }
                vm.viewModel.selCfnlList[idx].cfnlList.splice(index, 1);

                //rowspan 해야할 항목 체크
                for(let i in vm.viewModel.selCfnlList[idx].cfnlList){
                    let item = vm.viewModel.selCfnlList[idx].cfnlList[i];

                    if(item.safe_cntrpln_sn == 0){
                        vm.viewModel.selCfnlList[idx].cfnlList[i].row2 = 'Y';

                        if(item.main_risk_fctr_sn == 0){
                            vm.viewModel.selCfnlList[idx].cfnlList[i].row1 = 'Y';
                        }else{
                            vm.viewModel.selCfnlList[idx].cfnlList[i].row1 = 'N';
                        }
                    }else{
                        vm.viewModel.selCfnlList[idx].cfnlList[i].row1 = 'N';
                    }
                }
            },
            fnAddCfnl: function(sn){
                let vm = this;
                
                if(sn == 'etc'){
                    //
                    let val = {
                        job_process_sn: 0,
                        job_process_nm: '',
                        main_risk_fctr_sn: 0,
                        main_risk_fctr: '',
                        safe_cntrpln_sn: 0,
                        safe_cntrpln: '',
                        row1:'Y',
                        row2:'Y',
                        row1_cnt:1,
                        row2_cnt:1,
                        psblty_yn:'N',
                        dgdgr_uml:''
                    }
                    vm.viewModel.selCfnlList.push({work_type_sn: '9999', cfnlList: [val], delcfnlList: [{}], spcmDetail:{cfnl_nm: '일반작업', work_type_sn: '9999'}, aditRiskList: [], selAditRiskList : [], newYn:'Y'}, )

                    vm.$emit('selCfnlList', vm);
                }else{
                    let data = {
                        work_type_sn:sn
                    }

                    Axios.post("/selectCfnlInfo.do", data).then(function(response) {
                        let spcmRiskEvlList = response.data.spcmRiskEvlList;
                        let spcmDetail = response.data.spcmDetail;
                        let spcmFileList = response.data.spcmFileList;

                        vm.viewModel.selCfnlList.push({work_type_sn: sn, cfnlList: spcmRiskEvlList, delcfnlList: [{}], spcmDetail:spcmDetail, aditRiskList: [], selAditRiskList : [], imgfilelist1: spcmFileList.filter(item=> item.file_se == 1), imgfilelist2: spcmFileList.filter(item=> item.file_se == 2), newYn:'Y'})

                        vm.$nextTick(function() {
                            if(vm.viewModel.selCfnlList[vm.viewModel.selCfnlList.length-1].imgfilelist1 != null){
                                vm.$refs.imgfileform1[vm.viewModel.selCfnlList.length-1].fnFileLoadList(vm.viewModel.selCfnlList[vm.viewModel.selCfnlList.length-1].imgfilelist1);
                            }

                            if(vm.viewModel.selCfnlList[vm.viewModel.selCfnlList.length-1].imgfilelist2 != null){
                                vm.$refs.imgfileform2[vm.viewModel.selCfnlList.length-1].fnFileLoadList(vm.viewModel.selCfnlList[vm.viewModel.selCfnlList.length-1].imgfilelist2);
                            }
                        });

                        vm.$emit('selCfnlList', vm);
                    });
                } 
            },
            fnDelCfnl: function(sn){
                let vm = this;

                let index = vm.viewModel.selCfnlList.findIndex(data => data.work_type_sn == sn);

                vm.viewModel.selCfnlList.splice(index, 1);

                vm.$nextTick(function() {
                    for(let i=0; i<vm.viewModel.selCfnlList.length; i++){
                        if(vm.viewModel.selCfnlList[i].imgfilelist1 != null){
                            vm.$refs.imgfileform1[i].fnFileLoadList(vm.viewModel.selCfnlList[i].imgfilelist1);
                        }

                        if(vm.viewModel.selCfnlList[i].imgfilelist2 != null){
                            vm.$refs.imgfileform2[i].fnFileLoadList(vm.viewModel.selCfnlList[i].imgfilelist2);
                        }
                    }
                });
                
                vm.$emit('selCfnlList', vm);
            },
            fnImgFileList1:function(vm){
                this.viewModel.selCfnlList[vm.viewModel.index].imgfilelist1 = vm.viewModel.filelist;
            },
            fnImgFileDelete1: function(vm){
                this.viewModel.selCfnlList[vm.viewModel.index].imgdeletefileList1 = vm.viewModel.deletefileList;
            },
            fnImgFileList2:function(vm){
                this.viewModel.selCfnlList[vm.viewModel.index].imgfilelist2 = vm.viewModel.filelist;
            },
            fnImgFileDelete2: function(vm){
                this.viewModel.selCfnlList[vm.viewModel.index].imgdeletefileList2 = vm.viewModel.deletefileList;
            },
            fnInptJob: function(id, index, idx){
                let vm = this;

                let job_process_nm = vm.viewModel.selCfnlList[idx].cfnlList[index].job_process_nm

                vm.viewModel.selCfnlList[idx].cfnlList.filter(data=> data.job_process_sn == id)

                let len = vm.viewModel.selCfnlList[idx].cfnlList.filter(data=> data.job_process_sn == id).length;

                if(len > 0){
                    for(let i=0; i<len; i++){
                        let item = vm.viewModel.selCfnlList[idx].cfnlList.filter(data=> data.job_process_sn == id)[i];
        
                        item.job_process_nm = job_process_nm;
                    }
                }
            },
            fnInptMain: function(j_id, m_id, index, idx){
                let vm = this;

                let job_process_nm = vm.viewModel.selCfnlList[idx].cfnlList[index].job_process_nm
                let main_risk_fctr = vm.viewModel.selCfnlList[idx].cfnlList[index].main_risk_fctr

                let len = vm.viewModel.selCfnlList[idx].cfnlList.filter(data=> data.job_process_sn == j_id && data.main_risk_fctr_sn == m_id).length;

                if(len > 0){
                    for(let i=0; i<len; i++){
                        let item = vm.viewModel.selCfnlList[idx].cfnlList.filter(data=> data.job_process_sn == j_id && data.main_risk_fctr_sn == m_id)[i];

                        item.job_process_nm = job_process_nm;
                        item.main_risk_fctr = main_risk_fctr;
                    }
                }
            },
            fnFstRisk: function(idx){
                let vm = this;
                vm.idx = idx;
                
                vm.$parent.fnFstRiskPopup();
            },
            fnSelect:function(list){

                let vm = this;
                let idx = vm.idx;
                let len = vm.viewModel.selCfnlList[idx].cfnlList.length;
                
                for(let i=0; i<list.length; i++){
                    let val = {
                        job_process_sn: len == 0 ? 0 : (vm.viewModel.selCfnlList[idx].cfnlList[len-1].job_process_sn + 1),
                        job_process_nm: list[i].job_process_nm,
                        main_risk_fctr_sn: i,
                        main_risk_fctr: list[i].risk_factor,
                        safe_cntrpln_sn: 0,
                        safe_cntrpln: list[i].cntrpln,
                        row1: i == 0 ? 'Y' : '',
                        row2:'Y',
                        row1_cnt:list.length,
                        row2_cnt:1,
                        psblty_yn:'N',
                        dgdgr_uml:''
                    }

                    vm.viewModel.selCfnlList[idx].cfnlList.push(val);
                }
            }
        }
    };
</script>