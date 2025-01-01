<template>
    <modal :pass="{popupTitle: '자율안전점검표'}">
		<template v-slot:contents>
            <div class="btn-group btn-right">
                <button class="btn btn-purple" @click="fnPrint();"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-print"></use></svg>인쇄</button>
            </div>

            <div id="viewDiv" class="print_page">
                <div class="contents">
                    <div>
                        <table class="table horizontal print">
                            <caption>자율안전점검표 기본정보</caption>
                            <tbody>
                                <tr>
                                    <th scope="row">현장명</th>
                                    <td>{{ viewModel.detail.bplc_nm }}</td>
                                    <td rowspan="4" class="print_title">
                                        <div class="logo">
                                            <div class="logo_img"><img src="/img/logo.png" alt="GS네오텍 로고"></div>
                                            <span>스마트 <strong>안전보건</strong> 솔루션</span>
                                        </div>
                                        <p>자율안전점검표 [{{ viewModel.data.hqp_nm }}]</p>
                                    </td>
                                </tr> 
                                <tr>
                                    <th scope="row">점검자</th>
                                    <td></td>
                                </tr>
                                <tr>
                                    <th scope="row">점검일자</th>
                                    <td></td>
                                </tr>
                                <tr>
                                    <th scope="row">확인자</th>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td colspan="4">
                                        <img :src="viewModel.filepath" style="margin-left: auto; margin-right: auto; display: block;"/>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div>
                        <table class="table">
                            <caption>자율안전점검표</caption>
                            <thead>
                                <tr>
                                    <th scope="col" rowspan="2">번호</th>
                                    <th scope="col" rowspan="2">구분</th>
                                    <th scope="col" rowspan="2">자율점검항목</th>
                                    <th scope="colgroup" colspan="3">점검결과</th>
                                </tr>
                                <tr>
                                    <th scope="col">적정</th>
                                    <th scope="col">부적정</th>
                                    <th scope="col">조치</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(item,index) in viewModel.itemList">
                                    <td class="text-center">
                                        {{index + 1}}
                                    </td>
                                    <template v-if="item.row1 == 'Y'">
                                        <td :rowspan="item.row1_cnt" class="text-left">
                                            {{ item.se_cn }}
                                        </td>
                                    </template>
                                    <td class="text-left">
                                        {{ item.artcl_cn }}
                                    </td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td colspan="6" style="height: 100px; vertical-align: top;" class="text-left">
                                    <span>점검자 의견</span>
                                    </td>
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
    import imgsfileform from '../../../../../common/vue/imgsfileform2.vue';
    import common from "../../../../common";

    export default {
        props: ['pass'],
        data: function() {
            return {
                viewModel:{
                    userInfo:{},
                    filepath:'',
                    data:{},
                    detail:{},
                    itemList:[],
                }
            };
        },
        components: {
            Modal,
        },
        mounted: function() {
            let vm = this;
        },
        methods: {
            fnInit:function(sn, hqp_sn){
                let vm = this;
                vm.viewModel.userInfo = vm.$store.state.global.userInfo;

                Modal.methods.fnInit();
                
                vm.fnDetail(sn, hqp_sn);
            },
            fnDetail: function(sn, hqp_sn){
                let vm = this;

                let data = {
                    manage_sn: sn,
                    hqp_sn: hqp_sn
                }
                
                Axios.post("/selectFcltMngmtFormDetail.do", data)
                .then(function(response) {
                    vm.viewModel.data = response.data.data;
                    vm.viewModel.detail = response.data.detail;
                    vm.viewModel.itemList = response.data.itemList;

                    vm.viewModel.filepath = vm.viewModel.data.strg_path.charAt() == '/' ? vm.viewModel.data.strg_path + vm.viewModel.data.strg_file_nm : vm.viewModel.data.strg_path.substr(2)  + vm.viewModel.data.strg_file_nm;
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
                
                let doc = new jsPDF('p', 'mm', 'a4')

                let a4_cnt = document.getElementsByClassName('a4').length;

                $('#viewDiv > .a4').each(function (index, item) {
                    html2canvas(item, {scale:3}).then(function(canvas) {
                        // 캔버스를 이미지로 변환
                        let imgData = canvas.toDataURL('image/jpeg');

                        let canWidth = canvas.width/10;

                        let margin = 10; // 출력 페이지 여백설정
                        let imgWidth = 210 - (10 * 2); // 이미지 가로 길이(mm) A4 기준
                        let imgHeight = (297 - (10 * 2)) / (canWidth/210);

                        // 첫 페이지 출력
                        if(index!=0){
                            doc.addPage();
                        }
                        doc.addImage(imgData, 'jpeg', margin, margin, imgWidth, imgHeight);
                           
                        // 파일 저장
                        if(Number(a4_cnt-1) == index){
                            doc.save('자율안전점검표(' + vm.viewModel.data.hqp_nm + ")_" +  vm.viewModel.detail.bplc_nm + '.pdf');   
                        }
                    });
                });
            }
        }
    };
</script>
