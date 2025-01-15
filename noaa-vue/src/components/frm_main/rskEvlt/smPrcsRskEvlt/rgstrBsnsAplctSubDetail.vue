<template>
    <ul class="accordion">
        <template v-for="(item, idx) in viewModel.selCfnlList" >
            <li>
                <button class="title">
                    공종명 : {{ item.spcmDetail.cfnl_nm }}
                    <label for="a1" class="switch">
                        <input type="checkbox" :id="'lgz_hgh_risk_yn_'+idx" true-value="Y" false-value="N" v-model="item.spcmDetail.lgz_hgh_risk_yn" disabled>
                        <span><i></i></span>
                        대형(고)위험
                    </label>
                </button>
                <div class="contents" style="max-height: 100%;">  <!-- 팝업에서 fullscreen, 아코디언있을경우 깨지는 경우 있어서 추가 -->
                    <div>
                        <h3>우리 기준</h3>
                        <table class="table">
                            <caption>우리 기준</caption>
                            <thead>
                                <tr>
                                    <th></th>
                                    <th scope="col">작업절차</th>
                                    <th scope="col">주요위험요인</th>
                                    <th scope="col">안전대책</th>
                                    <th scope="col">할 수 없는 것</th>
                                    <th scope="col">위험도[상,중,하]</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(cfnlItem, index) in item.cfnlList">
                                    <template v-if="cfnlItem.row1 == 'Y'">
                                        <td :rowspan="cfnlItem.row1_cnt"><input type="checkbox" :id="cfnlItem.job_process_sn" :value="cfnlItem" v-model="item.delcfnlList"></td>
                                        <td :rowspan="cfnlItem.row1_cnt">
                                            <textarea title="입력" v-model="cfnlItem.job_process_nm" style="border: none; background-color: white;" disabled></textarea>
                                        </td>
                                    </template>
                                    <template v-if="cfnlItem.row2 == 'Y'">
                                        <td :rowspan="cfnlItem.row2_cnt">
                                            <textarea v-model="cfnlItem.main_risk_fctr" style="border: none; background-color: white;" disabled></textarea>
                                        </td>
                                    </template>
                                    <td>
                                        <textarea v-model="cfnlItem.safe_cntrpln" style="border: none; background-color: white;" disabled></textarea>
                                    </td>
                                    <td>
                                        <input type="checkbox" :id="'psblty_yn'" v-model="cfnlItem.psblty_yn" true-value="Y" false-value="N" disabled>
                                    </td>
                                    <td>
                                        <select title="위험도 선택" v-model="cfnlItem.dgdgr_uml" :style="cfnlItem.psblty_yn == 'Y' ? 'display: none;':''" disabled>
                                            <option value=''>위험도 선택</option>
                                            <option v-for="item in viewModel.dgdgrList" :key="item" :value="item.CODE">{{ item.CODE_NM }}</option>
                                        </select>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div>
                        <h3>타사사고사례</h3>
                        <span style="float:right" v-if="item.spcmDetail.dsstr_type != ''">
                            재해유형 : {{ item.spcmDetail.dsstr_type }}
                        </span>
                        <table class="table">
                            <caption>타사사고사례</caption>
                            <thead>
                                <th>관련사진</th>
                                <th>사고발생원인</th>
                                <th>안전대책</th>
                            </thead>
                            <tbody>
                                <td style="width: 11.25rem;">
                                    <!-- <img :src="item.spcmDetail.f1_file"> -->
                                    <imgfileform :ref="'imgfileform1'" :pass="{id:'img1_'+idx, index: idx, mode:'view'}"></imgfileform>
                                </td>
                                <td>
                                    <textarea v-model="item.spcmDetail.acdnt_ocrn_cause" id="acdnt_ocrn_cause" rows="10" style="border: none; background-color: white;" disabled></textarea>
                                </td>
                                <td><textarea v-model="item.spcmDetail.othr_safe_cntrpln" id="othr_safe_cntrpln" rows="10" style="border: none; background-color: white;" disabled></textarea></td>
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
                                    <td :colspan="3" class="text-left">{{ item.spcmDetail.acdnt_case }}</td>
                                </tr>
                                <tr>
                                    <th>주변여건</th>
                                    <td class="text-left">{{ item.spcmDetail.cfr_cnd }}</td>
                                    <th>사용장비/기계기구</th>
                                    <td class="text-left">{{ item.spcmDetail.use_eqpmnt_mchn }}</td>
                                </tr>
                                <tr>
                                    <th :colspan="4">◆작업 방법/절차  ◆현장여건  ◆위험 요인   ◆기계기구 점검   ◆기타 정보제공</th>
                                </tr>
                                <tr>
                                    <td>
                                        <textarea v-model="item.spcmDetail.cn_type"  rows="10" style="border: none; background-color: white;" disabled></textarea>
                                    </td>
                                    <td :colspan="3">
                                        <imgfileform :ref="'imgfileform2'" :pass="{id:'img2_'+idx, index: idx, mode:'view'}"></imgfileform>
                                        <!-- <img :src="item.spcmDetail.f2_file"> -->
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div>
                        <h3>추가 위험 및 대책</h3>
                        <table class="table">
                            <caption>추가 위험 및 대책</caption>
                            <thead>
                                <th>누락된 작업</th>
                                <th>위험요인</th>
                                <th>위험감소대책</th>
                                <th>조치기한 / 담당자</th>
                                <th>위험도[상,중,하]</th>
                            </thead>
                            <tbody>
                                <tr v-for="(riskItem, riskIndex) in item.aditRiskList">
                                    <td class="text-left">
                                        {{ riskItem.ovsite_job }}
                                    </td>
                                    <td class="text-left">
                                        {{ riskItem.risk_fctr }}
                                    </td>
                                    <td class="text-left">
                                        {{ riskItem.risk_dcrs_cntrpln }}
                                    </td>
                                    <td class="text-left">
                                        {{ riskItem.actn_term }} / {{ riskItem.pic_nm }}
                                    </td>
                                    <td>
                                        <select title="위험도 선택" v-model="riskItem.dgdgr" disabled>
                                            <option value=''>위험도 선택</option>
                                            <option v-for="item in viewModel.dgdgrList" :key="item" :value="item.CODE" disabled>{{ item.CODE_NM }}</option>
                                        </select>
                                    </td>
                                </tr>
                                <tr v-if="item.aditRiskList.length == 0"><td :colspan="'5'">데이터가 없습니다.</td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </li>
        </template>
    </ul>
</template> 

<script>
    import "es6-promise/auto";
    import Vue from "vue";
    import Axios from "axios";
    import imgfileform from '../../../../common/vue/imgfileform2.vue';
    
    export default {
        props: ['pass'],
        components: {
            'imgfileform' : imgfileform,
		},
        data: function() {
            return {
                viewModel:{
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
        }
    };
</script>