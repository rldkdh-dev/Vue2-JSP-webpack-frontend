<template>
    <modal :pass="{popupTitle: '상시위험성평가표'}">
		<template v-slot:contents>
            <div class="btn-group btn-right">
                <button class="btn btn-white" @click="fnDownlaod();"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-download"></use></svg>다운로드</button>
                <button class="btn btn-purple" @click="fnPrint();"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-print"></use></svg>인쇄</button>
            </div>

            <div id="viewDiv" class="print_page">
                <div v-for="(detail, idx) in viewModel.detailListInfo" class="a4 contents">
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
                                        <p>위험성평가표[상시■](팀명 : {{ detail.teamInfo.TEAM_NM }}  )</p>
                                    </td>
                                    <th scope="col">작성자</th>
                                    <th scope="col" v-if="viewModel.data.rvwr != ''">검토자</th>
                                    <th scope="col">결정자</th>
                                </tr>
                                <tr>
                                    <th scope="row">평가기간</th>
                                    <td>{{ viewModel.data.evl_bgng_dt|yyyyMMdd }} ~ {{ viewModel.data.evl_end_dt|yyyyMMdd }}</td>
                                    <td rowspan="3" class="text-center">
                                        <!-- <div class="approval">
                                            <img :src="viewModel.data.wrtr_sign" class="sign_img"/>
                                        </div> -->
                                    </td>
                                    <td rowspan="3" v-if="viewModel.data.rvwr != ''" class="text-center">
                                        <div class="approval" v-if="viewModel.data.rvwr_sign_yn == 'Y'">
                                            <img :src="viewModel.data.rvwr_sign" class="sign_img"/>
                                        </div>
                                    </td>
                                    <td rowspan="3" class="text-center">
                                        <div class="approval" v-if="viewModel.data.dcsnr_sign_yn == 'Y'">
                                            <img :src="viewModel.data.dcsnr_sign" class="sign_img" />
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <th>작성일자</th>
                                    <td>{{ viewModel.data.wrt_dt|yyyyMMdd }}</td>
                                </tr>
                                <tr>
                                    <th>작성자</th>
                                    <td></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>                
                    <div>
                        <table class="table">
                            <thead>
                                <tr>
                                    <th scope="col" rowspan="2">위험<br>발취</th>
                                    <th scope="col" rowspan="2">작업절차<br>[중공정]</th>
                                    <th scope="col" rowspan="2">사용<br>장비</th>
                                    <th scope="col" rowspan="2">작업일정</th>
                                    <th scope="col" rowspan="2">위험요인</th>
                                    <th scope="col" rowspan="2">위험유형</th>
                                    <th scope="col" rowspan="2">안전대책</th>
                                    <th scope="col" colspan="2">평가 결과</th>
                                    <th scope="col" rowspan="2">재평가</th>
                                </tr>
                                <tr>
                                    <th>위험도</th>
                                    <th>이행<br>상태</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(item, i) in detail.artclList.filter(data=>data.se == 1)">
                                    <td :rowspan="detail.artclList.filter(data=>data.se == 1).length" v-if="i == 0">소공정<br>위험성<br>평가</td>
                                    <td class="text-left">
                                        {{ item.job_process_nm }}
                                    </td>
                                    <td class="text-left">
                                        {{ item.eqpment }}
                                    </td>
                                    <td class="text-center">
                                        {{ item.job_bgng_dt }} ~ {{ item.job_end_dt }}
                                    </td>
                                    <td class="text-left">
                                        {{ item.main_risk_fctr }}
                                    </td>
                                    <td class="text-left">
                                        {{ item.risk_type }}
                                    </td>
                                    <td class="text-left">
                                        {{ item.safe_cntrpln }}
                                    </td>
                                    <td class="text-center">
                                        {{ item.dgdgr_uml_nm }}
                                    </td>
                                    <td class="text-center">
                                        {{ item.now_mng_level_nm }}
                                    </td>
                                    <td class="text-center">
                                        {{item.re_evl_nm}}
                                    </td>
                                </tr>
                                <tr v-for="(item, i) in detail.artclList.filter(data=>data.se == 2)">
                                    <td :rowspan="detail.artclList.filter(data=>data.se == 2).length" v-if="i == 0">추가<br>위험성<br>평가</td>
                                    <td class="text-left">{{ item.job_process_nm }}</td>
                                    <td class="text-left">
                                        {{ item.eqpment }}
                                    </td>
                                    <td class="text-center">
                                        {{ item.job_bgng_dt }} ~ {{ item.job_end_dt }}
                                    </td>
                                    <td class="text-left">
                                        {{ item.main_risk_fctr }}
                                    </td>
                                    <td class="text-left">
                                        {{ item.risk_type }}
                                    </td>
                                    <td class="text-left">
                                        {{ item.safe_cntrpln }}
                                    </td>
                                    <td class="text-center">
                                        {{ item.dgdgr_uml_nm }}
                                    </td>
                                    <td class="text-center">
                                        {{ item.now_mng_level_nm }}
                                    </td>
                                    <td class="text-center">
                                        {{item.re_evl_nm}}
                                    </td>
                                </tr>
                                <tr>
                                    <th>아차사고사례<br>[경험]</th>
                                    <td colspan="6" class="text-left"><p style="white-space: pre-wrap">{{ detail.detail.acdnt_case }}</p></td>
                                    <th>지적</th>
                                    <td colspan="2" class="text-right">{{ detail.detail.chck_cnt }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div>
                        <table class="table">
                            <thead>
                                <tr>
                                    <th rowspan="3">장소<br>내용</th>
                                    <th rowspan="3">작업절차<br>[중공정]</th>
                                    <th rowspan="3">작업일정</th>
                                    <th colspan="2">위험성평가</th>
                                    <th rowspan="3">위험도</th>
                                    <th rowspan="3">검토의견</th>
                                </tr>
                                <tr>
                                    <th colspan="2">[누락된작업, 추가된위험,정한대로 할 수 없는 것,  점검 결과 실행이안되는 사항 작성]</th>
                                </tr>
                                <tr>
                                    <th>추가위험요인</th>
                                    <th>위험방지대책 </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(item, i) in detail.aditList">
                                    <td class="text-left">{{ item.plc_cn }}</td>
                                    <td class="text-left">{{ item.job_process_nm }}</td>
                                    <td><span v-if="item.job_bgng_dt != undefined">{{ item.job_bgng_dt }} ~ {{ item.job_end_dt }}</span></td>
                                    <td class="text-left">{{ item.main_risk_fctr }}</td>
                                    <td class="text-left">{{ item.safe_cntrpln }}</td>
                                    <td class="text-center">{{ item.dgdgr_uml_nm }}</td>
                                    <td :rowspan="detail.aditList.length"  v-if="i == 0" class="text-left"><p style="white-space: pre-wrap">{{ detail.aditList[0].rvw_opnn }}</p></td>
                                </tr>                
                                <tr>
                                    <th>건의 사항</th>
                                    <td colspan="6" class="text-left"><p style="white-space: pre-wrap">{{ detail.detail.sugest_mttr }}</p></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div style='page-break-before:always' v-if="idx != (viewModel.detailListInfo.length - 1)"></div>           
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

    export default {
        props: ['pass'],
        data: function() {
            return {
                viewModel:{
                    data:{
                    },
                    userInfo:{},
                    itemList:[],
                    addOrgArtclList:[{},{},{}],
                    detailListInfo:[],
                },
            };
        },
        components: {
            Modal
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
            fnInit2: function(data, list, wrt_dt){
                let vm = this;
                vm.viewModel.data = {};
                vm.viewModel.detailListInfo = [];
                vm.viewModel.userInfo = vm.$store.state.global.userInfo;

                Modal.methods.fnInit();
                
                vm.viewModel.data = data;
                if(wrt_dt != ''){
                    vm.viewModel.data.wrt_dt = wrt_dt;
                }

                let detaillist = list;
                vm.viewModel.detailListInfo = detaillist;

                //서명 이미지
                vm.viewModel.data.wrtr_sign = vm.viewModel.data.wrtr_sign.charAt() == '/' ? vm.viewModel.data.wrtr_sign : vm.viewModel.data.wrtr_sign.substr(2);
                if(vm.viewModel.data.rvwr_sign != undefined){
                    vm.viewModel.data.rvwr_sign = vm.viewModel.data.rvwr_sign.charAt() == '/' ? vm.viewModel.data.rvwr_sign : vm.viewModel.data.rvwr_sign.substr(2);
                }

                if(vm.viewModel.data.dcsnr_sign != undefined){
                    vm.viewModel.data.dcsnr_sign = vm.viewModel.data.dcsnr_sign.charAt() == '/' ? vm.viewModel.data.dcsnr_sign : vm.viewModel.data.dcsnr_sign.substr(2);
                }       
                
                // vm.viewModel.detailListInfo[0].aditList = 
                vm.viewModel.detailListInfo.forEach(data => {
                    let len = data.aditList.length == 0 ? 0 : data.aditList.length;
                    if(len < 3){
                        for(let i=0; i<3-len; i++){
                            data.aditList.push({});
                        }
                    }
                });
                
            },
            fnDetail: function(sn){
                let vm = this;

                let send = {
                    ordtm_risk_evl_sn: sn,
                }

                Axios.post("/selectPmntRskEvltDetail.do", send)
                .then(function(response) {
                    vm.viewModel.data = response.data.detail;
                    // vm.viewModel.chckArtclList = response.data.artclList.filter(data=>data.se == 1);
                    // vm.viewModel.addArtclList = response.data.artclList.filter(data=>data.se == 2);
                    // vm.viewModel.addOrgArtclList = response.data.aditList;
                    vm.viewModel.detailListInfo = response.data.detailListInfo;

                    //코드값
                    vm.viewModel.dgdgrList = response.data.dgdgrList;

                    //서명 이미지
                    vm.viewModel.data.wrtr_sign = vm.viewModel.data.wrtr_sign.charAt() == '/' ? vm.viewModel.data.wrtr_sign : vm.viewModel.data.wrtr_sign.substr(2);
                    vm.viewModel.data.rvwr_sign = vm.viewModel.data.rvwr_sign.charAt() == '/' ? vm.viewModel.data.rvwr_sign : vm.viewModel.data.rvwr_sign.substr(2);
                    vm.viewModel.data.dcsnr_sign = vm.viewModel.data.dcsnr_sign.charAt() == '/' ? vm.viewModel.data.dcsnr_sign : vm.viewModel.data.dcsnr_sign.substr(2);                    

                    vm.viewModel.detailListInfo.forEach(data => {
                        let len = data.aditList.length == 0 ? 0 : data.aditList.length;
                        if(len < 3){
                            for(let i=0; i<3-len; i++){
                                data.aditList.push({});
                            }
                        }
                    });
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

                var editorData = $("#viewDiv").html();
                let fileNm = '상시 위험성평가(' + vm.viewModel.data.work_type_nm + ').pdf';

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
            },
            fnRowSpan: function(type, item, i){
                let rs = 1;
                if(type == 'spcm'){
                    while (
                        i + rs < this.viewModel.chckArtclList.length &&
                        this.viewModel.chckArtclList[i + rs].spcm_risk_evl_sn === item.spcm_risk_evl_sn
                    ) {
                        rs++;
                    }
                }else{
                    while (
                        i + rs < this.viewModel.addArtclList.length &&
                        this.viewModel.addArtclList[i + rs].spcm_risk_evl_sn === item.spcm_risk_evl_sn
                    ) {
                        rs++;
                    }
                }
                return rs;
            },
        }

    };
</script>
