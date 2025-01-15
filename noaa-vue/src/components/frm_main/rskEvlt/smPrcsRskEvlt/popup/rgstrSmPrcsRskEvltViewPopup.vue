<template>
    <modal :pass="{popupTitle: '소공정위험성평가표'}">
		<template v-slot:contents>
            <div class="btn-group btn-right">
                <button class="btn btn-white" @click="fnDownlaod();"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-download"></use></svg>다운로드</button>
                <button class="btn btn-purple" @click="fnPrint();"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-print"></use></svg>인쇄</button>
            </div>

            <div id="viewDiv" class="print_page">
                <div v-for="(item, idx) in viewModel.selCfnlList" class="a4 contents">
                    <div>
                        <table class="table horizontal print">
                            <tbody>
                                <tr>
                                    <th scope="row">현장명</th>
                                    <td>{{ viewModel.data.bplc_nm }}</td>
                                    <td rowspan="4" class="print_title">
                                        <div class="logo">
                                            <div class="logo_img"><img src="/img/logo.png" alt="GS네오텍 로고"></div>
                                            <span>스마트 <strong>안전보건</strong> 솔루션</span>
                                        </div>
                                        <p>[ 공종명 : {{ item.spcmDetail.cfnl_nm }} ]<span v-if="item.spcmDetail.lgz_hgh_risk_yn == 'Y'">■ 대형(고)위험</span></p>
                                    </td>
                                    <th scope="col">작성자</th>
                                    <th scope="col" v-if="viewModel.data.mdtr != ''">조정자</th>
                                    <th scope="col">결정자</th>
                                </tr>
                                <tr>
                                    <th scope="row">작성일</th>
                                    <td>{{viewModel.data.reg_dt|yyyyMMdd}}</td>
                                    <td rowspan="3" class="text-center">
                                        <div class="approval" v-if="viewModel.data.wrtr_sign_yn == 'Y'">
                                            <!-- <img :src="viewModel.data.wrtr_sign" class="sign_img"/> -->
                                        </div>
                                    </td>
                                    <td rowspan="3" v-if="viewModel.data.mdtr != ''" class="text-center">
                                        <div class="approval" v-if="viewModel.data.mdtr_sign_yn == 'Y'">
                                            <img class="sign_img" :src="viewModel.data.mdtr_sign" />
                                        </div>  
                                    </td>
                                    <td rowspan="3" class="text-center">
                                        <div class="approval" v-if="viewModel.data.dcsnr_sign_yn == 'Y'">
                                            <img class="sign_img" :src="viewModel.data.dcsnr_sign" />
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <th scope="row">작업기간</th>
                                    <td></td>
                                </tr>
                                <tr>
                                    <th>작성자</th>
                                    <td></td>
                                    <!-- <td>{{ viewModel.data.wrtr_nm }}</td> -->
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div class="divide">
                        <div class="contents">
                            <div>
                                <h3>■ 우리 기준</h3>
                                <table class="table" :id="'table_our_'+idx">
                                    <thead>
                                        <tr>
                                            <th scope="col">작업절차</th>
                                            <th scope="col">주요위험요인</th>
                                            <th scope="col">안전대책</th>
                                            <th scope="col">할 수<br>없는 것</th>
                                            <th scope="col">위험도<br>[상,중,하]</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="(cfnlItem, index) in item.cfnlList">
                                            <template v-if="cfnlItem.row1 == 'Y'">
                                                <td :rowspan="cfnlItem.row1_cnt">
                                                    {{ cfnlItem.job_process_nm }}
                                                </td>
                                            </template>
                                            <template v-if="cfnlItem.row2 == 'Y'">
                                                <td :rowspan="cfnlItem.row2_cnt">
                                                    {{ cfnlItem.main_risk_fctr }}
                                                </td>
                                            </template>
                                            <td>
                                                {{ cfnlItem.safe_cntrpln }}
                                            </td>
                                            <td>
                                                <input type="checkbox" :id="'psblty_yn'" v-model="cfnlItem.psblty_yn" true-value="Y" false-value="N" disabled>
                                            </td>
                                            <td>
                                                {{ cfnlItem.dgdgr_uml_nm }}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div class="contents">
                            <div>
                                <h3>■ 작업내용/ 계획 소공정 PCM</h3>
                                <table class="table horizontal" :id="'table_spcm_'+idx">
                                    <tbody>
                                        <tr>
                                            <th scope="row" class="w100">아차사고사례</th>
                                            <td :colspan="3">{{ item.spcmDetail.acdnt_case }}</td>
                                        </tr>
                                        <tr>
                                            <th scope="row">주변여건</th>
                                            <td>{{ item.spcmDetail.cfr_cnd }}</td>
                                            <th scope="row" class="w100">사용장비/<br>기계기구</th>
                                            <td>{{ item.spcmDetail.use_eqpmnt_mchn }}</td>
                                        </tr>
                                        <tr>
                                            <th :colspan="4" class="text-center">◆작업 방법/절차  ◆현장여건  ◆위험 요인   ◆기계기구 점검   ◆기타 정보제공</th>
                                        </tr>
                                        <tr>
                                            <td>
                                                {{ item.spcmDetail.cn_type }}
                                            </td>
                                            <td :colspan="3">
                                                <imgfileform :ref="'imgfileform2'" :pass="{id:'img2_'+idx, index: idx, mode:'view'}"></imgfileform>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div>
                                <h3>■ 소공정 위험성 평가 회의에서 결정된 사항 (추가 위험 및 대책)</h3>
                                <table class="table">
                                    <thead>
                                        <th scope="col">누락된 작업</th>
                                        <th scope="col">위험요인</th>
                                        <th scope="col">위험감소대책</th>
                                        <th scope="col">조치기한 / 담당자</th>
                                        <th scope="col">위험도[상,중,하]</th>
                                    </thead>
                                    <tbody>
                                        <tr v-for="(riskItem, riskIndex) in item.aditRiskList">
                                            <td class="text-left">{{ riskItem.ovsite_job }}</td>
                                            <td class="text-left">{{ riskItem.risk_fctr }}</td>
                                            <td class="text-left">{{ riskItem.risk_dcrs_cntrpln }}</td>
                                            <td class="text-left"><span v-if="riskItem.actn_term != undefined">{{ riskItem.actn_term }} / {{ riskItem.pic_nm }}</span></td>
                                            <td>{{ riskItem.dgdgr_uml_nm }}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div>
                                <h3>■ 타사사고사례</h3>
                                <span style="float:right" v-if="item.spcmDetail.dsstr_type != ''">
                                    재해유형 : {{ item.spcmDetail.dsstr_type }}
                                </span>
                                <table class="table">
                                    <thead>
                                        <th scope="col">관련사진</th>
                                        <th scope="col">사고발생원인</th>
                                        <th scope="col">안전대책</th>
                                    </thead>
                                    <tbody>
                                        <td>
                                            <imgfileform :ref="'imgfileform1'" :pass="{id:'img1_'+idx, index: idx, mode:'view'}"></imgfileform>
                                        </td>
                                        <td class="text-left">
                                            <p style="white-space: pre-wrap">{{ item.spcmDetail.acdnt_ocrn_cause }}</p>
                                        </td>
                                        <td class="text-left">
                                            <p style="white-space: pre-wrap">{{ item.spcmDetail.othr_safe_cntrpln }}</p>
                                        </td>
                                    </tbody>
                                </table>
                            </div>
                            <div>
                                <h3>■ 참석자 서명</h3>
                                <table class="table">
                                    <thead>
                                        <tr>
                                            <th scope="col">직책(담당)</th>
                                            <th scope="col">성명</th>
                                            <th scope="col">서명</th>
                                        </tr>
                                    </thead>
                                    <tbody v-if="viewModel.atdrnList.length > 0">
                                        <tr v-for="item in viewModel.atdrnList" :key="item">
                                            <td>{{ item.ocpt_detail_nm }}</td>
                                            <td>{{ item.user_nm }}</td>
                                            <td><img v-if="item.sign_yn == 'Y'" :src="item.user_sign" style="width: 50px;" oneror="this.src=''"></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <div style='page-break-before:always' v-if="idx != (viewModel.selCfnlList.length - 1)"></div>
                </div>
            </div>
		</template>
	</modal>
</template>

<style>
    td:empty {
        padding: 0.8rem 0!important;
    }
</style>

<script>
    import "es6-promise/auto";
    import Vue from "vue";
    import Axios from "axios";
    import Modal from '../../../popup/modal.vue'
    import printJS from 'print-js'
    import imgfileform from '../../../../../common/vue/imgfileform2.vue';

    export default {
        props: ['pass'],
        data: function() {
            return {
                viewModel:{
                    data:{
                        mdtr:'',
                        mdtr_nm:'',
                        dcsnr:'',
                        dcsnr_nm:'',
                    },
                    userInfo:{},
                    selCfnlList:[],   //선택된 공종과 정보 담
                    atdrnList:[],
                }
            };
        },
        components: {
            Modal,
            'imgfileform' : imgfileform,
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
                    spcm_risk_evl_sn: sn,
                }
                Axios.post("/selectSmPrcsRskEvltDetail.do", send)
                .then(function(response) {
                    vm.viewModel.data = response.data.mstDetail;
                    vm.viewModel.selCfnlList = response.data.selCfnlList;
                    vm.viewModel.atdrnList = response.data.atdrnList;

                    //서명 이미지
                    vm.viewModel.data.wrtr_sign = vm.viewModel.data.wrtr_sign.charAt() == '/' ? vm.viewModel.data.wrtr_sign : vm.viewModel.data.wrtr_sign.substr(2);
                    vm.viewModel.data.mdtr_sign = vm.viewModel.data.mdtr_sign.charAt() == '/' ? vm.viewModel.data.mdtr_sign : vm.viewModel.data.mdtr_sign.substr(2);
                    vm.viewModel.data.dcsnr_sign = vm.viewModel.data.dcsnr_sign.charAt() == '/' ? vm.viewModel.data.dcsnr_sign : vm.viewModel.data.dcsnr_sign.substr(2);
                }).then(function(){       
                    
                    for(let i= 0; i<vm.viewModel.atdrnList.length; i++){
                        vm.viewModel.atdrnList[i].user_sign = vm.viewModel.atdrnList[i].user_sign.charAt() == '/' ? vm.viewModel.atdrnList[i].user_sign : vm.viewModel.atdrnList[i].user_sign.substr(2);
                    }

                    let atdrnLen = vm.viewModel.atdrnList == null ? 0 : vm.viewModel.atdrnList.length;
                    if(atdrnLen < 3){
                        for(let i=0; i<3-atdrnLen; i++){
                            vm.viewModel.atdrnList.push({});
                        }
                    }

                    vm.viewModel.selCfnlList.forEach(function(item, i){
                        let len = item.aditRiskList == null ? 0 : item.aditRiskList.length;
                        if(len < 3){
                            for(let i=0; i<3-len; i++){
                                item.aditRiskList.push({});
                            }
                        }

                        item.imgfilelist1 = item.fileList.filter(data=> data.file_se == 1);
                        vm.$refs.imgfileform1[i].fnFileLoadList(item.imgfilelist1);

                        item.imgfilelist2 = item.fileList.filter(data=> data.file_se == 2);
                        vm.$refs.imgfileform2[i].fnFileLoadList(item.imgfilelist2);

                    })
                });
            },
            fnPrint : function(){
                printJS({
                    printable:'viewDiv',
                    type:'html',
                    css: ['/css/basic.css','/css/print.css'],
                    scanStyles : false,
                });
            },
            fnDownlaod: function(){
                let vm = this;
                let fileNm =   '소공정 위험성평가(' + vm.viewModel.data.team_nm + ").pdf";   
                var editorData = $("#viewDiv").html();
                
                var linkBasic = document.createElement('link');
                linkBasic.href = '/css/form.css';
                linkBasic.rel = 'stylesheet';
                linkBasic.type = 'text/css';
                document.head.appendChild(linkBasic);

                var hiddenDiv = document.createElement('div');
                hiddenDiv.classList.add("downloadformDiv");
                hiddenDiv.innerHTML = editorData;
                document.body.appendChild(hiddenDiv);

                $(".loading").show();
                $("#mask").show();

                setTimeout(() => {
                    html2pdf().from(hiddenDiv).set({
                        margin: 5,
                        html2canvas: { scale: 3 },
                        jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4'}
                    }).save(fileNm).then((pdf) => {
                        document.body.removeChild(hiddenDiv);
                        document.head.removeChild(linkBasic);
                    }).then(function(){
                        $(".loading").hide();
                        $("#mask").hide();
                    });
                }, 1000);
            }
        }
    };
</script>