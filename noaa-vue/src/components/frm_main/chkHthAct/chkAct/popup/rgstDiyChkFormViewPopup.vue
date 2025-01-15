<template>
    <modal :pass="{popupTitle: '일일안전점검일지'}">
		<template v-slot:contents>
            <div class="btn-group btn-right">
                <button class="btn btn-white" @click="fnDownlaod();"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-download"></use></svg>다운로드</button>
                <button class="btn btn-purple" @click="fnPrint();"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-print"></use></svg>인쇄</button>
            </div>

            <div id="viewDiv" class="print_page">
                <div class="a4 contents">
                    <div>
                        <table class="table horizontal print">
                            <caption>일일안전점검일지 기본정보</caption>
                            <tbody>
                                <tr>
                                    <th scope="row">현장명</th>
                                    <td>{{ viewModel.data.bplc_nm }}</td>
                                    <td rowspan="3" class="print_title">
                                        <div class="logo">
                                            <div class="logo_img"><img src="/img/logo.png" alt="GS네오텍 로고"></div>
                                            <span>스마트 <strong>안전보건</strong> 솔루션</span>
                                        </div>
                                        <p>일일 안전 점검 일지</p>
                                    </td>
                                    <th scope="col">안전</th> 
                                    <th scope="col">현장소장</th>
                                </tr> 
                                <tr>
                                    <th scope="row">일시</th>
                                    <td>
                                        {{ viewModel.data.wrt_dt|yyyyMMdd }} 
                                        &nbsp;<span>{{ viewModel.data.wrt_hour }}</span>
                                        <span>:</span>
                                        <span>{{ viewModel.data.wrt_min }}</span>
                                    </td>
                                    <td rowspan="2" class="text-center">
                                        <div class="approval">
                                            <img class="sign_img" :src="viewModel.data.safe_mngr_sign" v-bind:style="viewModel.data.safe_mngr_sign_yn != 'Y' ? 'display: none;' : ''">
                                        </div>
                                    </td> 
                                    <td rowspan="2" class="text-center">
                                        <div class="approval">
                                            <img class="sign_img" :src="viewModel.data.bplc_mngr_sign" v-bind:style="viewModel.data.bplc_mngr_sign_yn != 'Y' ? 'display: none;' : ''">
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <th scope="row">공정률(%)</th>
                                    <td>{{ viewModel.data.prgrs_rt }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div>
                        <h3>현황점검표</h3>
                        <table class="table print">
                            <caption>현황점검표</caption>
                            <thead>
                                <tr>
                                    <th scope="colgroup" colspan="4">출력 현황</th>
                                    <th scope="colgroup" colspan="2">사고 현황</th>
                                </tr>
                                <tr>
                                    <th scope="col">구분</th>
                                    <th scope="col">전일누계</th>
                                    <th scope="col">금일</th>
                                    <th scope="col">총누계</th>
                                    <th scope="col">사망</th>
                                    <th scope="col">부상</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <th scope="row">직원</th>
                                    <td class="text-right">{{ viewModel.data.emp_yeday_acmtl }}</td>
                                    <td class="text-right">{{ viewModel.data.emp_today }}</td>
                                    <td class="text-right">{{ viewModel.data.emp_tot_acmtl }}</td>
                                    <td class="text-right">{{ viewModel.data.emp_dth }}</td>
                                    <td class="text-right">{{ viewModel.data.emp_inj }}</td>
                                </tr>
                                <tr>
                                    <th scope="row">작업자</th>
                                    <td class="text-right">{{ viewModel.data.oprtr_yeday_acmtl }}</td>
                                    <td class="text-right">{{ viewModel.data.oprtr_today }}</td>
                                    <td class="text-right">{{ viewModel.data.oprtr_tot_acmtl }}</td>
                                    <td class="text-right">{{ viewModel.data.oprtr_dth }}</td>
                                    <td class="text-right">{{ viewModel.data.oprtr_inj }}</td>
                                </tr>
                                <tr>
                                    <th scope="row">장비기사</th>
                                    <td class="text-right">{{ viewModel.data.driver_yeday_acmtl }}</td>
                                    <td class="text-right">{{ viewModel.data.driver_today }}</td>
                                    <td class="text-right">{{ viewModel.data.driver_tot_acmtl }}</td>
                                    <td class="text-right">{{ viewModel.data.driver_dth }}</td>
                                    <td class="text-right">{{ viewModel.data.driver_inj }}</td>
                                </tr>
                                <tr>
                                    <th scope="row">합계</th>
                                    <td class="text-right">{{ viewModel.data.sum_yeday_acmtl }}</td>
                                    <td class="text-right">{{ viewModel.data.sum_today }}</td>
                                    <td class="text-right">{{ viewModel.data.sum_tot_acmtl }}</td>
                                    <td class="text-right">{{ viewModel.data.sum_dth }}</td>
                                    <td class="text-right">{{ viewModel.data.sum_inj }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div>
                        <h3>주요업무/확인사항</h3>
                        <table class="table print">
                            <caption>주요업무/확인사항</caption>
                            <thead>
                                <tr>
                                    <th scope="col">안전관리자 금일 주요업무 / 확인사항</th>
                                    <th scope="col">안전관리자 명일 주요업무 / 확인예정사항</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td class="text-left"><p style="white-space: pre-wrap">{{ viewModel.data.safe_mngr_today_main_task }}</p></td>
                                    <td class="text-left"><p style="white-space: pre-wrap">{{ viewModel.data.safe_mngr_tomo_main_task }}</p></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div>
                        <h3>점검항목/체크리스트</h3>
                        <div class="inspection_list">
                            <table class="table horizontal print">
                                <caption>점검항목/체크리스트</caption>
                                <thead>
                                    <tr>
                                        <th scope="colgroup" colspan="4">7대 기본사항</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>
                                            <p class="title">① 이동통로</p>
                                            <span><i v-if="viewModel.data.mvmn_passway_rslt=='Y'">■</i><i v-else>□</i> 양호  /  <i v-if="viewModel.data.mvmn_passway_rslt=='N'">■</i><i v-else>□</i> 미흡  /  <i v-if="viewModel.data.mvmn_passway_rslt=='C'">■</i><i v-else>□</i> 해당없음</span>
                                            <div> - 가설 이동통로 설치 개소: {{ viewModel.data.mvmn_passway_cnt }} 개<br> - 설치상태 : 틈새(3cm이내), 추락방지 조치 등<br> - 관리상태 : 미끄럼 방지 조치, 통로내 장애물 여부 등</div>
                                        </td>
                                        <td>
                                            <p class="title">② 안전난간/생명줄</p>
                                            <span><i v-if="viewModel.data.safe_railing_rslt=='Y'">■</i><i v-else>□</i> 양호  /  <i v-if="viewModel.data.safe_railing_rslt=='N'">■</i><i v-else>□</i> 미흡  /  <i v-if="viewModel.data.safe_railing_rslt=='C'">■</i><i v-else>□</i> 해당없음</span>
                                            <div> - 2m↑ 안전난간 및 생명줄 설치<br> - 안전난간 설치 기준 준수<br> : 상부난간 90~120cm, 임의하중 100kg이상 등<br> - 생명줄 사용 규격: 16mm 이상 등</div>
                                        </td>
                                        <td>
                                            <p class="title">③ 사다리</p>
                                            <span><i v-if="viewModel.data.lddr_rslt=='Y'">■</i><i v-else>□</i> 양호  /  <i v-if="viewModel.data.lddr_rslt=='N'">■</i><i v-else>□</i> 미흡  /  <i v-if="viewModel.data.lddr_rslt=='C'">■</i><i v-else>□</i> 해당없음</span>
                                            <div> - 사용허가 사다리: {{ viewModel.data.lddr_cnt }} 개  / 허가 적정 여부<br> - 안전수칙 준수 여부:<br> ＊최상단 및 바로 밑단 작업 금지<br> ＊승하강 시 3점 지지(손, 발)</div>
                                        </td>
                                        <td>
                                            <p class="title">④ 작업발판</p>
                                            <span><i v-if="viewModel.data.job_foothold_rslt=='Y'">■</i><i v-else>□</i> 양호  /  <i v-if="viewModel.data.job_foothold_rslt=='N'">■</i><i v-else>□</i> 미흡  /  <i v-if="viewModel.data.job_foothold_rslt=='C'">■</i><i v-else>□</i> 해당없음</span>
                                            <div> - 사용허가(말비계, 이동식 틀비계 등): {{ viewModel.data.job_foothold_cnt }} 개<br> - 고정 상태 확인 </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <p class="title">⑤ 인양도구</p>
                                            <span><i v-if="viewModel.data.salvage_rslt=='Y'">■</i><i v-else>□</i> 양호  /  <i v-if="viewModel.data.salvage_rslt=='N'">■</i><i v-else>□</i> 미흡  /  <i v-if="viewModel.data.salvage_rslt=='C'">■</i><i v-else>□</i> 해당없음</span>
                                            <div> - 인양계획 수립 여부<br> - 줄걸이 상태 (슬링밸트, 샤클 등)<br> - 체인/레버 HooK 해지 장치 설치 상태</div>
                                        </td>
                                        <td>
                                            <p class="title">⑥ 접지/위험기계기구</p>
                                            <span><i v-if="viewModel.data.risk_mchn_rslt=='Y'">■</i><i v-else>□</i> 양호  /  <i v-if="viewModel.data.risk_mchn_rslt=='N'">■</i><i v-else>□</i> 미흡  /  <i v-if="viewModel.data.risk_mchn_rslt=='C'">■</i><i v-else>□</i> 해당없음</span>
                                            <div> - 기계, 기구 안전조치 상태 <br> :연삭기/컷터기 덮개 등<br> - 접지 연결 상태: 전동기계기구, 작업선 등</div>
                                        </td>
                                        <td>
                                            <p class="title">⑦ 개인보호구</p>
                                            <span><i v-if="viewModel.data.indvdl_prtc_rslt=='Y'">■</i><i v-else>□</i> 양호  /  <i v-if="viewModel.data.indvdl_prtc_rslt=='N'">■</i><i v-else>□</i> 미흡  /  <i v-if="viewModel.data.indvdl_prtc_rslt=='C'">■</i><i v-else>□</i> 해당없음</span>
                                            <div> - 적정 보호구 착용 지급 및 착용 여부<br> : 고소작업:안전밸트 / 유해가스 작업: 방독마스크 등<br> - 개인보호구 상태 확인: 훼손 여부</div>
                                        </td>
                                        <td></td>
                                    </tr>
                                </tbody>
                            </table>
                            <div class="check_list">
                                <table class="table horizontal print">
                                    <caption>대형(고)위험</caption>
                                    <thead>
                                        <tr>
                                            <th scope="colgroup" colspan="6">대형(고)위험</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td><span v-if="viewModel.data.rlway=='Y'">■</span><span v-else>□</span> 선로 주변 작업</td>
                                            <td><span v-if="viewModel.data.road=='Y'">■</span><span v-else>□</span> 도로점용 공사</td>
                                            <td><span v-if="viewModel.data.scaffhold=='Y'">■</span><span v-else>□</span> 비계 작업 (높이 10m이상)</td>
                                            <td><span v-if="viewModel.data.sealed_space=='Y'">■</span><span v-else>□</span> 밀폐공간 작업</td>
                                            <td><span v-if="viewModel.data.retaining=='Y'">■</span><span v-else>□</span> 흙막이 시설 설치/해체</td>
                                            <td><span v-if="viewModel.data.high_tention=='Y'">■</span><span v-else>□</span> 고압 판넬 작업</td>
                                        </tr>
                                        <tr>
                                            <td><span v-if="viewModel.data.salvage=='Y'">■</span><span v-else>□</span> 인양 작업 (20톤 이상)</td>
                                            <td><span v-if="viewModel.data.pipe_connect=='Y'">■</span><span v-else>□</span> 기존 배관 연결 (Tie-In)</td>
                                            <td><span v-if="viewModel.data.tower_crane=='Y'">■</span><span v-else>□</span> 타워크레인 설치/인상/해체</td>
                                            <td><span v-if="viewModel.data.high_worktable=='Y'">■</span><span v-else>□</span> 고소작업대 중간발판 사용</td>
                                            <td><span v-if="viewModel.data.firearm=='Y'">■</span><span v-else>□</span> 화기작업 (대형 화재 위험)</td>
                                            <td></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <!-- <div>
                        <h3>안전관리자</h3>
                        <table class="table horizontal print">
                            <caption>안전관리자</caption>
                            <tbody>
                                <tr>
                                    <th scope="row" class="w150">안전점검 지적/요청사항</th>
                                    <td><p style="white-space: pre-wrap">{{ viewModel.data.safe_mngr_safechck_lgstr }}</p></td>
                                </tr>
                                <tr>
                                    <th scope="row">대상팀(작업자)</th>
                                    <td><p style="white-space: pre-wrap">{{ viewModel.data.safe_mngr_trgt_team }}</p></td>
                                </tr>
                                <tr>
                                    <th scope="row">조치결과</th>
                                    <td><p style="white-space: pre-wrap">{{ viewModel.data.safe_mngr_actn_rslt }}</p></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div>
                        <h3>현장소장</h3>
                        <table class="table horizontal print">
                            <caption>현장소장</caption>
                            <tbody>
                                <tr>
                                    <th scope="row" class="w150">검토 및 지시사항</th>
                                    <td><p style="white-space: pre-wrap">{{ viewModel.data.bplc_mngr_rvw_mttr }}</p></td>
                                </tr>
                                <tr>
                                    <th scope="row">현장 안전점검사항</th>
                                    <td><p style="white-space: pre-wrap">{{ viewModel.data.bplc_mngr_safe_chck_mttr }}</p></td>
                                </tr>
                            </tbody>
                        </table>
                    </div> -->
                    
                    <div style='page-break-before:always'  v-if="viewModel.rsltList.length > 0"></div>
                    
                    <div v-if="viewModel.rsltList.length > 0">
                        <h3>점검/조치사항</h3>
                        <table class="table horizontal write print">
                            <tbody v-for="(item, i) in viewModel.rsltList" :key="i">
                                <tr>
                                    <th scope="row" :rowspan="item.chck_rslt == 'I' ? 11 : 6" class="w50">
                                        {{ i+1 }}
                                    </th>
                                    <th scope="row"><label for="">점검결과</label></th>
                                    <td>
                                        {{ item.chck_rslt_nm }}
                                    </td> 
                                </tr>
                                <tr>
                                    <th scope="row" class="w130"><label for="">점검자</label></th>
                                    <td>
                                        {{ item.reg_nm }} ( {{ item.jbttl_nm }} )
                                    </td>
                                </tr>
                                <tr>
                                    <th scope="row" class="w100"><label for="">현장팀명</label></th>
                                    <td>
                                        {{ item.bplc_team }}
                                    </td>
                                </tr>
                                <tr>
                                    <th scope="row" class="w100"><label for="">사진등록</label></th>
                                    <td>
                                        <imgsfileform :ref="'imgsfileform'" :pass="{id:'chckRslt'+i, index:i, gbn:'chckRslt', mode:'view'}"></imgsfileform>
                                    </td>
                                </tr>
                                <tr>
                                    <th scope="row"><label for="">점검내용</label></th>
                                    <td class="pre">{{ item.chck_cn }}</td> 
                                </tr>
                                <tr v-if="item.chck_rslt == 'I'">
                                    <th scope="row"><label for="">지적/요청사항</label></th>
                                    <td class="pre">{{ item.actn_mttr }}</td>
                                </tr>
                                <tr v-if="item.chck_rslt == 'I'">
                                    <th scope="row"><label for="">조치자</label></th>
                                    <td>
                                        {{ item.actn_pic_nm }}
                                    </td>
                                </tr>
                                <tr v-show="item.chck_rslt == 'I'">
                                    <th scope="row"><label for="">사진등록</label></th>
                                    <td>
                                        <imgsfileform :pass="{id:'mttr'+i, index:i, gbn:'mttr', mode:'view'}" :ref="'mttr_imgsfileform'"></imgsfileform>
                                    </td>
                                </tr>
                                <tr v-if="item.chck_rslt == 'I'">
                                    <th scope="row"><label for="">조치내용</label></th>
                                    <td class="pre">{{ item.actn_sttus }}</td>
                                </tr>
                                <tr v-if="item.chck_rslt == 'I'">
                                    <th scope="row"><label for="">진행현황</label></th>
                                    <td>
                                        <span>{{ item.actn_prgrs_nm }}</span>
                                    </td>
                                </tr>
                                <tr v-if="item.reg_id != viewModel.data.bplc_mngr"> 
                                    <th scope="row"><label for="">검토 및 지시사항</label></th>
                                    <td class="pre">{{ item.rvw_mttr }}</td>
                                </tr>
                                <!-- <tr>
                                    <th scope="row"><label for="">현장 안전점검사항</label></th>
                                    <td class="pre">{{ item.safe_chck_mttr }}</td>
                                </tr> -->
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
    import imgsfileform from '../../../../../common/vue/imgsfileform2.vue';
    import common from "../../../../common";

    export default {
        props: ['pass'],
        data: function() {
            return {
                viewModel:{
                    chkRsltList:[],
                    rsltList:[],
                    data:{
                        safe_mngr:'',
                        safe_mngr_nm:'',
                        bplc_mngr:'',
                        bplc_mngr_nm:'',
                        wrt_hour: '',
                        wrt_min: '',
                        mvmn_passway_rslt: 'Y',
                        safe_railng_rslt: 'Y',
                        lddr_rslt: 'Y',
                        job_foothold_rslt: 'Y',
                        salvage_rslt: 'Y',
                        risk_mchn_rslt: 'Y',
                        indvdl_prtc_rslt: 'Y',
                    },
                    userInfo:{},
                }
            };
        },
        components: {
            Modal,
            'imgsfileform' : imgsfileform,
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

                let data = {
                    diary_sn: sn,
                }
                Axios.post("/selectDiyChkDetail.do", data)
                .then(function(response) {
                    vm.viewModel.data = response.data.detail;
                    
                    //점검 항목 + 파일
                    vm.viewModel.rsltList = response.data.rsltList;
                    vm.viewModel.filelist = response.data.fileList;
                    vm.viewModel.mttrFileList = response.data.mttrFileList;

                    //서명 이미지
                    vm.viewModel.data.safe_mngr_sign = vm.viewModel.data.safe_mngr_sign.charAt() == '/' ? vm.viewModel.data.safe_mngr_sign : vm.viewModel.data.safe_mngr_sign.substr(2);
                    vm.viewModel.data.bplc_mngr_sign = vm.viewModel.data.bplc_mngr_sign.charAt() == '/' ? vm.viewModel.data.bplc_mngr_sign : vm.viewModel.data.bplc_mngr_sign.substr(2);

                    //해당없음일 경우 빈값으로 보여지기 위해서
                    vm.viewModel.data.mvmn_passway_cnt = (vm.viewModel.data.mvmn_passway_rslt == 'C' ? "" : vm.viewModel.data.mvmn_passway_cnt);
                    vm.viewModel.data.lddr_cnt = (vm.viewModel.data.lddr_rslt == 'C' ? "" : vm.viewModel.data.lddr_cnt);
                    vm.viewModel.data.job_foothold_cnt = (vm.viewModel.data.job_foothold_rslt == 'C' ? "" : vm.viewModel.data.job_foothold_cnt);
                }).then(function(){
                    for(let i=0; i<vm.viewModel.rsltList.length; i++){
                        vm.viewModel.rsltList[i].imgfilelist = vm.viewModel.filelist.filter(data => data.sub_sn == vm.viewModel.rsltList[i].chck_act_rslt_sn && data.sn == vm.viewModel.rsltList[i].chck_act_sn);
                        vm.viewModel.rsltList[i].mttr_imgfilelist = vm.viewModel.mttrFileList.filter(data => data.sub_sn == vm.viewModel.rsltList[i].chck_act_rslt_sn && data.sn == vm.viewModel.rsltList[i].chck_act_sn);

                        vm.$nextTick(function() {
                            if(vm.viewModel.rsltList[i] != undefined && vm.viewModel.rsltList[i].imgfilelist != null){
                                vm.$refs.imgsfileform[i].fnFileLoadList(vm.viewModel.rsltList[i].imgfilelist);
                            }
                            if(vm.viewModel.rsltList[i] != undefined && vm.viewModel.rsltList[i].mttr_imgfilelist != null){
                                vm.$refs.mttr_imgsfileform[i].fnFileLoadList(vm.viewModel.rsltList[i].mttr_imgfilelist);
                            }
                        });
                    }
                })
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
                let fileNm =  '일일안전점검일지_' +  vm.viewModel.data.wrt_dt + '.pdf';
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
