<template>
    <modal :pass="{popupTitle: '일일 작업장 위험성평가표'}">
		<template v-slot:contents>
            <div class="btn-group btn-right">
                <button class="btn btn-white" @click="fnDownlaod();"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-download"></use></svg>다운로드</button>
                <button class="btn btn-purple" @click="fnPrint();"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-print"></use></svg>인쇄</button>
            </div>

            <div id="viewDiv" class="print_page">
                <div class="contents">
                    <div>
                        <table class="table horizontal print">
                            <caption>일일 작업장 위험성평가표 기본정보</caption>
                            <tbody>
                                <tr>
                                    <th scope="row">작업일자</th>
                                    <td>{{ viewModel.data.job_dt|yyyyMMdd }}</td>
                                    <td rowspan="2" class="print_title">
                                        <div class="logo">
                                            <div class="logo_img"><img src="/img/logo.png" alt="GS네오텍 로고"></div>
                                            <span>스마트 <strong>안전보건</strong> 솔루션</span>
                                        </div>
                                        <p>일일 작업장 위험성평가표</p>
                                    </td>
                                    <th scope="row">작업조명</th>
                                    <th scope="row">작업팀(반)장</th>
                                </tr>
                                <tr>
                                    <th scope="row">작업장소</th>
                                    <td></td>
                                    <td>{{ viewModel.data.bplc_team_nm }}</td>
                                    <td>
                                        <div class="unit_box">
                                            <p></p>
                                            <span>(인)</span>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <th scope="row">작업내용</th>
                                    <td colspan="4"></td>
                                    
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div>
                        <table class="table"> 
                            <tbody>
                                <tr>
                                    <th colspan="6">【 상시/소공정 위험성평가 위험성 감소대책 이행/점검 】</th>
                                </tr>
                                <tr>
                                    <th>단위작업</th>
                                    <th>장비<br>공구</th>
                                    <th>위험요소</th>
                                    <th>안전대책</th>
                                    <th>해당<br>있음</th>
                                    <th>조치이행자</th>
                                </tr>
                                <tr v-for="(item, index) in viewModel.itemList">
                                    <td class="text-left"><p style="white-space: pre-wrap">{{ item.unit_job }}</p></td>
                                    <td class="text-left"><p style="white-space: pre-wrap">{{ item.eqpmnt }}</p></td>
                                    <td class="text-left"><p style="white-space: pre-wrap">{{ item.risk_factor }}</p></td>
                                    <td class="text-left"><p style="white-space: pre-wrap">{{ item.safe_cntrpln }}</p></td>
                                    <td>□</td>
                                    <td></td>
                                </tr>
                                <tr v-if="viewModel.itemList == 0">
                                    <td colspan="6"></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div>
                        <table class="table">
                            <colgroup>
                                <col width="25%">
                                <col width="25%">
                                <col width="25%">
                                <col width="25%">
                            </colgroup> 
                            <tbody>
                                <tr>
                                    <th colspan="6">【 일일 작업장 위험성평가 】</th>
                                </tr>
                                <tr>
                                    <th>주변여건</th>
                                    <th colspan="2">유해. 위험요인</th>
                                    <th>감소대책</th>
                                </tr>
                                <tr>
                                    <td class="text-left">체크리스트 없는 유해위험요인<br>또는 주변여건, 작업방법에 대한<br>위험성평가</td>
                                    <td colspan="2"></td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <th>전일 미비사항 or 핵심이행사항</th>
                                    <td colspan="3"></td>
                                </tr>
                            </tbody>
                        </table>
                        <table class="table">
                            <tbody>
                                <tr>
                                    <th colspan="2">구분</th>
                                    <th colspan="2">내용</th>
                                    <th>점검</th>
                                    <th>비고</th>
                                </tr>
                                <tr>
                                    <th rowspan="2">작업전</th>
                                    <th>건강상태</th>
                                    <td colspan="2" class="text-left">근로자 개인건강 상태는 양호한가?</td>
                                    <td>□</td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <th>개인보호구</th>
                                    <td colspan="2" class="text-left">개인보호구 지급상태 및 착용상태는 양호한가?</td>
                                    <td>□</td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <th>건의사항</th>
                                    <td colspan="5"></td>
                                </tr>
                                <tr>
                                    <th>아차<br>사고사례</th>
                                    <td colspan="5"></td>
                                </tr>
                                <tr>
                                    <th>비상사태<br>대응/요령</th>
                                    <td colspan="5"></td>
                                </tr>
                            </tbody>
                        </table>
                        <table class="table">
                            <colgroup>
                                <col width="20%">
                                <col width="20%">
                                <col width="20%">
                                <col width="20%">
                                <col width="20%">
                            </colgroup>
                            <tbody>
                                <tr>
                                    <th rowspan="5">작업자<br>(평가참석자)</th>
                                    <td class="text-right">(인)</td>
                                    <td class="text-right">(인)</td>
                                    <td class="text-right">(인)</td>
                                    <td class="text-right">(인)</td>
                                </tr>
                                <tr v-for="i in 4">
                                    <td class="text-right">(인)</td>
                                    <td class="text-right">(인)</td>
                                    <td class="text-right">(인)</td>
                                    <td class="text-right">(인)</td>
                                </tr>
                                <tr>
                                    <th rowspan="4">확인자</th>
                                    <th>(오전) 내용/조치</th>
                                    <td colspan="3"></td>
                                </tr>
                                <tr>
                                    <th>점검자 서명</th>
                                    <td class="text-right">(인)</td>
                                    <td colspan="2"></td>
                                </tr>
                                <tr>
                                    <th>(오후) 내용/조치</th>
                                    <td colspan="3"></td>
                                </tr>
                                <tr>
                                    <th>점검자 서명</th>
                                    <td class="text-right">(인)</td>
                                    <td colspan="2"></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
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
    import printJS from 'print-js'
    import common from "../../../../common";

    export default {
        props: ['pass'],
        data: function() {
            return {
                year: '',
                viewModel:{
                    data:{
                    },
                    userInfo:{},
                    itemList:[],
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

                let date = new Date();
                vm.year = date.getFullYear();
            },
            fnDetail: function(sn){
                let vm = this;

                let send = {
                    wrkshp_risk_evl_sn: sn,
                }

                Axios.post("/selectWpRskEvltFormDetail.do", send)
                .then(function(response) {
                    vm.viewModel.data = response.data.detail;
                    vm.viewModel.itemList = response.data.itemList;
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
                let fileNm = '일일 작업장 위험성평가표(' + vm.viewModel.data.team_nm + ')_' + common.fnDateTimeStr(vm.viewModel.data.job_dt) + '.pdf';   
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