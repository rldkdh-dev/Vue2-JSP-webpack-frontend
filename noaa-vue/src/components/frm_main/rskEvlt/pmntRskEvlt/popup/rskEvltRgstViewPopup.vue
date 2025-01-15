<template>
    <modal :pass="{popupTitle: '위험성평가등록부'}">
		<template v-slot:contents>
            <div class="btn-group btn-right">
                <button class="btn btn-white" @click="fnDownlaod();"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-download"></use></svg>다운로드</button>
                <button class="btn btn-purple" @click="fnPrint();"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-print"></use></svg>인쇄</button>
            </div>

            <div id="viewDiv" class="print_page">
                <div class="a4 contents" v-for="(item1, idx) in viewModel.detailList">
                    <div>
                        <table class="table horizontal print">
                            <thead>
                                <tr>
                                    <th scope="row">현장명</th>
                                    <td>{{ viewModel.data.bplc_nm }}</td>
                                    <td class="print_title" rowspan="3">
                                        <div class="logo">
                                            <div class="logo_img"><img src="/img/logo.png" alt="GS네오텍 로고"></div>
                                            <span>스마트 <strong>안전보건</strong> 솔루션</span>
                                        </div>
                                        위험성평가 등록부 {{ viewModel.data.month }}<span v-if="viewModel.data.month != null">월</span> {{ viewModel.data.ngr }}<span v-if="viewModel.data.ngr != null">회차</span> (팀명 : {{ item1.teamInfo.bplc_team_nm }})
                                    </td>
                                </tr>
                                <tr>
                                    <th scope="row">평가기간</th>
                                    <td>{{ viewModel.data.evl_bgng_dt|yyyyMMdd }} ~ {{ viewModel.data.evl_end_dt|yyyyMMdd }}</td>
                                </tr>
                                <tr>
                                    <th scope="row">작성자</th>
                                    <td> {{ viewModel.data.user_nm }}</td>
                                </tr>
                            </thead>
                        </table>
                    </div>
                    <div>
                        <table class="table">
                            <thead>
                                <tr>
                                    <th :rowspan="2">고위험(상)</th>
                                    <th :rowspan="2">작업절차[중공정]</th>
                                    <th :rowspan="2">사용장비</th>
                                    <th :rowspan="2">작업일정</th>
                                    <th :rowspan="2">위험요인</th>
                                    <th :rowspan="2">위험유형</th>
                                    <th :rowspan="2">안전대책</th>
                                    <th>평가 결과</th>
                                    <th :rowspan="2">재평가<br>결과</th>
                                    <th :rowspan="2">이행담당자</th>
                                </tr>
                                <tr>
                                    <th>이행상태</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(item2, i) in item1.itemList">
                                    <td :rowspan="item1.itemList.length" v-if="i == 0">
                                        상등급
                                    </td>
                                    <td class="text-left">{{ item2.unit_work }}</td>
                                    <td class="text-left">{{ item2.using_tool }}</td>
                                    <td>{{ item2.term_bgng_dt|yyyyMMdd }} ~ {{ item2.term_end_dt|yyyyMMdd }}</td>
                                    <td class="text-left">
                                        <p style="white-space: pre-wrap">{{ item2.risk_fctr }}</p>
                                    </td>
                                    <td class="text-left">{{ item2.risk_type }}</td>
                                    <td class="text-left">
                                        <p style="white-space: pre-wrap">{{ item2.safe_cntrpln }}</p>
                                    </td>
                                    <td>{{ item2.now_mng_level_nm }}</td>
                                    <td>{{ item2.re_evl_nm }}</td>
                                    <td class="text-left">{{ item2.pic_nm }}</td>
                                </tr>
                                <tr v-if="item1.itemList.length == 0"><td :colspan="'10'">데이터가 없습니다.</td></tr>
                            </tbody>
                        </table>
                    </div>
                    
                    <div v-if="item1.rsltList.length > 0">
                        <h3>점검/조치사항</h3>
                        <table class="table horizontal">
                            <tbody v-for="(item, i) in item1.rsltList" :key="i">
                                <tr>
                                    <th scope="row" :rowspan="item.chck_rslt == 'I' ? 10 : 5" class="w50">
                                        {{ item.chck_dt|yyyyMMdd }}
                                    </th>
                                    <th scope="row" class="w100"><label for="">점검자</label></th>
                                    <td class="text-left">
                                        {{ item.reg_nm }} ( {{ item.jbttl_nm }} )
                                    </td> 
                                </tr>
                                <tr v-if="item.bplc_team != null" >
                                    <th scope="row"><label for="">현장팀명</label></th>
                                    <td>
                                        {{ item.bplc_team }}
                                    </td> 
                                </tr>
                                <tr>
                                    <th scope="row" class="w100"><label for="">점검결과</label></th>
                                    <td class="text-left">
                                        {{ item.chck_rslt_nm }}
                                    </td> 
                                </tr>
                                <tr>
                                    <th scope="row"><label for="">사진등록</label></th>
                                    <td>
                                        <imgsfileform :ref="'imgsfileform'" :pass="{id:'chckRslt'+i, idx1:idx , idx2:i, gbn:'chckRslt', mode:'view'}"></imgsfileform>
                                    </td>
                                </tr>
                                <tr>
                                    <th scope="row"><label for="">점검내용</label></th>
                                    <td class="text-left"><p style="white-space: pre-wrap">{{ item.chck_cn }}</p></td> 
                                </tr>
                                <tr v-if="item.chck_rslt == 'I'">
                                    <th scope="row"><label for="">지적/요청사항</label></th>
                                    <td class="text-left">
                                        <p style="white-space: pre-wrap">{{ item.actn_mttr }}</p>
                                    </td>
                                </tr>
                                <tr v-if="item.chck_rslt == 'I'">
                                    <th scope="row"><label for="">조치자</label></th>
                                    <td class="text-left">
                                        {{ item.actn_pic_nm }}
                                    </td>
                                </tr>
                                <tr v-show="item.chck_rslt == 'I'">
                                    <th scope="row"><label for="">사진등록</label></th>
                                    <td>
                                        <imgsfileform :pass="{id:'mttr'+i, idx1:idx , idx2:i, gbn:'mttr', mode:'view'}" :ref="'mttr_imgsfileform'"></imgsfileform>
                                    </td>
                                </tr>
                                <tr v-if="item.chck_rslt == 'I'">
                                    <th scope="row"><label for="">조치내용</label></th>
                                    <td class="text-left">
                                        <p style="white-space: pre-wrap">{{ item.actn_sttus }}</p>
                                    </td>
                                </tr>
                                <tr v-if="item.chck_rslt == 'I'">
                                    <th scope="row"><label for="">진행현황</label></th>
                                    <td class="text-left">
                                        <span>{{ item.actn_prgrs_nm }}</span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>    
                    </div>
                    
                    <div style='page-break-before:always' v-if="idx != (viewModel.detailList.length - 1)"></div>
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
                    data:{
                    },
                    userInfo:{},
                    detailList:[],
                    chkRsltList:[],
                },
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

                let send = {
                    reg_sn: sn,
                }

                Axios.post("/selectRskEvltRgstDetail.do", send)
                .then(function(response) {
                    vm.viewModel.data = response.data.detail;
                    vm.viewModel.chkRsltList = response.data.chkRsltList;
                    
                    vm.viewModel.detailList = response.data.detailList;
                    vm.viewModel.data.chck_clsf = 'REC'
                }).then(function(){

                    vm.$nextTick(function() {

                        if(vm.$refs.imgsfileform != undefined){
                            vm.$refs.imgsfileform.forEach(data=> {
                                let idx1 = data.pass.idx1;
                                let idx2 = data.pass.idx2;
                                
                                let fileList = vm.viewModel.detailList[idx1].fileList;
                                let rsltList = vm.viewModel.detailList[idx1].rsltList[idx2];
    
                                if(fileList != null){
                                    data.fnFileLoadList(fileList.filter(data => data.sub_sn == rsltList.chck_act_rslt_sn && data.sn == rsltList.chck_act_sn));                                
                                }
                            });
                        }

                        if(vm.$refs.mttr_imgsfileform != undefined){
                            vm.$refs.mttr_imgsfileform.forEach(data=> {
                                let idx1 = data.pass.idx1;
                                let idx2 = data.pass.idx2;
                                
                                let mttrFileList = vm.viewModel.detailList[idx1].mttrFileList;
                                let rsltList = vm.viewModel.detailList[idx1].rsltList[idx2];

                                if(mttrFileList != null){
                                    data.fnFileLoadList(mttrFileList.filter(data => data.sub_sn == rsltList.chck_act_rslt_sn && data.sn == rsltList.chck_act_sn));                                
                                }

                            });
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
                
                if(vm.viewModel.data.length == 0){
                    alert("조회된 데이터가 없습니다.");
                    return false;
                }
                
                let a4_cnt = document.getElementsByClassName('a4').length;

                let imgDataList = [];

                Array.from($('#viewDiv .a4')).forEach(function (item, index) {
                    html2canvas(item, {
                        scale: 3
                    }).then(function (canvas) {
                        // 캔버스를 이미지로 변환
                        let imgData = canvas.toDataURL('image/jpeg');

                        imgDataList.push({'img':imgData});

                        if(a4_cnt == (index+1)){
                            let data = {
                                fileNm: '위험성평가등록부('+common.fnConvertDateStr(vm.viewModel.data.evl_bgng_dt, '-') + '~' + common.fnConvertDateStr(vm.viewModel.data.evl_end_dt, '-') +')_'+ vm.viewModel.data.bplc_nm + '.pdf',
                                imgData: imgDataList,
                                type: 'p'
                            };

                            $(".loading").show();
                            $("#mask").show();

                            Axios.post("/downloadPdf.do",data, {
                                responseType: 'blob',
                            }).then(function(e) {
                                const url = window.URL.createObjectURL(new Blob([e.data], { type: e.headers["content-type"] }))
                                const link = document.createElement("a")
                                link.href = url
                                link.download = '위험성평가등록부('+common.fnConvertDateStr(vm.viewModel.data.evl_bgng_dt, '-') + '~' + common.fnConvertDateStr(vm.viewModel.data.evl_end_dt, '-') +')_'+ vm.viewModel.data.bplc_nm + '.pdf'
                                link.click()
                                window.URL.revokeObjectURL(url)
                            }).finally(function(){
                                $(".loading").hide();
                                $("#mask").hide();
                            });
                        }
                    });
                })
            },
            fnRowSpan: function(item, i){
                let rs = 1;
                while (
                    i + rs < this.viewModel.itemList.length &&
                    this.viewModel.itemList[i + rs].spcm_risk_evl_sn === item.spcm_risk_evl_sn
                ) {
                    rs++;
                }
                return rs;
            }
        }
    };
</script>