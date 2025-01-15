<template>
<modal :pass="{popupTitle: '최초위험성평가 회의록'}">
    <template v-slot:contents>
        <div class="btn-group btn-right">
            <button class="btn btn-white" @click="fnDownlaod();"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-download"></use></svg>다운로드</button>
            <button class="btn btn-light-purple" @click="fnPrint('viewDiv');"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-print"></use></svg>인쇄</button>
        </div>
        <div id="viewDiv" class="print_page a4 contents">
            <div>
                <table class="table horizontal print">
                    <caption>최초위험성평가 회의록 기본정보</caption>
                    <tbody>
                        <tr>
                            <td rowspan="2" class="print_title">
                                <div class="logo">
                                    <div class="logo_img"><img src="/img/logo.png" alt="GS네오텍 로고"></div>
                                    <span>스마트 <strong>안전보건</strong> 솔루션</span>
                                </div>
                                <p>최초위험성평가 회의록</p>
                            </td>
                            <th scope="col">작성자</th>
                            <th scope="col" v-if="viewModel.data.mdtr != ''">조정자</th>
                            <th scope="col">결정자</th>
                        </tr> 
                        <tr>
                            <td class="text-center">
                                <div class="approval">
                                    <img :src="viewModel.data.wrtr_sign" class="sign_img" />
                                </div>
                            </td>
                            <td v-if="viewModel.data.mdtr != ''" class="text-center">
                                <div class="approval">
                                    <img class="sign_img" :src="viewModel.data.mdtr_sign" v-bind:style="viewModel.data.mdtr_sign_yn != 'Y' ? 'display: none;' : ''" />
                                </div>
                            </td>
                            <td class="text-center">
                                <div class="approval">
                                    <img class="sign_img" :src="viewModel.data.dcsnr_sign" v-bind:style="viewModel.data.dcsnr_sign_yn != 'Y' ? 'display: none;' : ''" />
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div>
                <h3>회의개요</h3>
                <table class="table horizontal write">
                    <caption>회의개요</caption>
                    <tbody>
                        <tr>
                            <th scope="row" class="w100">현장명</th>
                            <td colspan="3">{{ viewModel.bplc_nm }}</td>
                        </tr>
                        <tr>
                            <th scope="row">회의일시</th>
                            <td>{{viewModel.data.mtg_dt}}</td>
                            <th scope="row">회의장소</th>
                            <td>{{viewModel.data.mtg_plc}}</td>
                        </tr>
                        <tr>
                            <th scope="row">안건</th>
                            <td colspan="3">{{ viewModel.data.agnd }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div>
                <h3>참석자 명단</h3>
                <table class="table write" id="userTbl">
                    <caption>참석자 명단</caption>
                    <colgroup>
                        <col width="35%" />
                        <col width="35%" />
                        <col width="10%" />
                    </colgroup>
                    <thead>
                        <tr>
                            <th scope="col" class="th2">직책(담당)</th>
                            <th scope="col" class="th2">성명</th>
                            <th scope="col" class="th2">서명</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item,i) in viewModel.mtgUserList" :key="i">
                            <td>{{ item.ocpt_detail_nm }}</td>
                            <td v-if='item.user_nm != ""'>{{item.user_nm}}</td>
                            <td v-else>
                                <div class="input_btn" @click="fnUserPopup(i)">
                                    {{ item.user_nm }}
                                    <label><svg class="icon">
                                            <use xlink:href="../../img/symbol-defs.svg#icon-search"></use>
                                        </svg></label>
                                </div>
                            </td>
                            <td>
                                <button class="btn btn-small btn-white" v-if="viewModel.userInfo.user_id == item.atdrn && item.sign_yn =='N'" @click="signBtn(item.atdrn_sn,i)">서명하기</button>
                                <div class="sign_img" id="" v-else>
                                    <img :src="item.sign_img" style="width: 100%;" v-bind:style="item.sign_yn != 'Y' ? 'display: none;' : ''">
                                </div>
                            </td>
                        </tr>
                    </tbody>

                </table>
            </div>
            <div>
                <h3>회의내용 요약</h3>
                <div class="h300">
                    <textarea style="background-color: white;" rows="5" v-model="viewModel.data.mtg" readonly></textarea>
                </div>
            </div>
        </div>

        <!-- <div class="approval">
                <h3>결재 정보</h3>
                <ul>
                    <li class="signed">
                        <a href="javascript:;">
                            <div class="user_img" id="1">
                                <img :src="viewModel.data.wrtr_sign" style="width: 100%;">
                            </div>
                            <span>{{ viewModel.data.wrtr_nm == "" ? "작성":"작성: "+ viewModel.data.wrtr_nm }}</span>
                        </a>
                    </li>
                    <li :class="[viewModel.data.mdtr && viewModel.data.mdtr_sign_yn != 'Y' ? 'set' : viewModel.data.mdtr && viewModel.data.mdtr_sign_yn=='Y' ? 'signed' : null]" @click="fnAprvrpopup('mdtr')"
                    v-if="viewModel.data.reg_id == viewModel.userInfo.user_id || viewModel.userInfo.user_roles == 'ROLE_001'|| mode=='write'">
                        <a href="javascript:;">
                            <div class="user_img" id="">
                                <img :src="viewModel.data.mdtr_sign" style="width: 100%;" v-bind:style="viewModel.data.mdtr_sign_yn != 'Y' ? 'display: none;' : ''">
                            </div>
                            <span>{{ viewModel.data.mdtr_nm == "" ? "조정":"조정: "+ viewModel.data.mdtr_nm }}</span>
                        </a>
                    </li>
                    <li :class="[viewModel.data.mdtr && viewModel.data.mdtr_sign_yn != 'Y' ? 'set' : viewModel.data.mdtr && viewModel.data.mdtr_sign_yn=='Y' ? 'signed' : null]"
                    v-else>
                        <a href="javascript:;">
                            <div class="user_img" id="">
                                <img :src="viewModel.data.mdtr_sign" style="width: 100%;" v-bind:style="viewModel.data.mdtr_sign_yn != 'Y' ? 'display: none;' : ''">
                            </div>
                            <span>{{ viewModel.data.mdtr_nm == "" ? "조정":"조정: "+ viewModel.data.mdtr_nm }}</span>
                        </a>
                    </li>
                    <li :class="[viewModel.data.dcsnr != '' && viewModel.data.dcsnr_sign_yn != 'Y' ? 'set' : viewModel.data.dcsnr != '' && viewModel.data.dcsnr_sign_yn=='Y' ? 'signed' : null]" @click="fnAprvrpopup('dcsnr')"
                    v-if="viewModel.data.reg_id == viewModel.userInfo.user_id || viewModel.userInfo.user_roles == 'ROLE_001' || mode=='write'">
                        <a href="javascript:;">
                            <div class="user_img" id="3">
                                <img :src="viewModel.data.dcsnr_sign" style="width: 100%;" v-bind:style="viewModel.data.dcsnr_sign_yn != 'Y' ? 'display: none;' : ''">
                            </div>
                            <span>{{ viewModel.data.dcsnr_nm == "" ? "결정":"결정: " + viewModel.data.dcsnr_nm }}</span>
                        </a>
                    </li>
                    <li :class="[viewModel.data.dcsnr != '' && viewModel.data.dcsnr_sign_yn != 'Y' ? 'set' : viewModel.data.dcsnr != '' && viewModel.data.dcsnr_sign_yn=='Y' ? 'signed' : null]"
                    v-else>
                        <a href="javascript:;">
                            <div class="user_img" id="3">
                                <img :src="viewModel.data.dcsnr_sign" style="width: 100%;" v-bind:style="viewModel.data.dcsnr_sign_yn != 'Y' ? 'display: none;' : ''">
                            </div>
                            <span>{{ viewModel.data.dcsnr_nm == "" ? "결정":"결정: " + viewModel.data.dcsnr_nm }}</span>
                        </a>
                    </li>
                </ul>
            </div> -->
    </template>
</modal>
</template>

<script>
import "es6-promise/auto";
import Vue from "vue";
import Modal from '../../../popup/modal.vue'
import Axios from "axios";
import printJS from 'print-js';

export default {
    components: {
        Modal,
    },
    data: function () {
        return {
            imgsrc: '',
            AprvrGbn: '',
            viewModel: {
                bizgroup: '',
                success_list: [],
                bplc_nm: '',
                mtgUserList: [],
                userInfo: {},
                mngUserList: [],
                bplc_sn: '',
                data: {
                    wrtr: '',
                    wrtr_nm: '',
                    mdtr: '',
                    mdtr_nm: '',
                    dcsnr: '',
                    dcsnr_nm: '',
                    mtg: '',
                    mtg_dt: '',
                    mtg_plc: '',
                    agnd: '',
                    mdtr_sign: '',
                    wrtr_sign: '',
                    dcsnr_sign: '',
                },
            }
        };
    },
    mounted: function () {
        let vm = this;
        //vm.fnInit();
    },
    methods: {
        fnInit: function (p_mtg_sn, p_bplc_sn) {
            let vm = this;
            vm.viewModel.userInfo = vm.$store.state.global.userInfo;
            vm.viewModel.bplc_nm = vm.viewModel.userInfo.bplc_nm;
            Modal.methods.fnInit();
            vm.fnDetail(p_mtg_sn, p_bplc_sn);
        },
        fnDetail: function (mtg_sn, bplc_sn) {
            let vm = this;
            let data = {
                mtg_sn: mtg_sn,
                bplc_sn: bplc_sn
            };
            Axios.post("/selectFstRskEvltMtgDetail.do", data)
                .then(function (response) {
                    vm.viewModel.data = response.data.result;
                    vm.viewModel.bplc_nm = vm.viewModel.data.bplc_nm;
                    vm.viewModel.bplc_sn = vm.viewModel.data.bplc_sn;
                    vm.viewModel.mtgUserList = response.data.list;

                    //서명 이미지
                    vm.viewModel.data.wrtr_sign = vm.viewModel.data.wrtr_sign.charAt() == '/' ? vm.viewModel.data.wrtr_sign : vm.viewModel.data.wrtr_sign.substr(2);
                    vm.viewModel.data.mdtr_sign = vm.viewModel.data.mdtr_sign.charAt() == '/' ? vm.viewModel.data.mdtr_sign : vm.viewModel.data.mdtr_sign.substr(2);
                    vm.viewModel.data.dcsnr_sign = vm.viewModel.data.dcsnr_sign.charAt() == '/' ? vm.viewModel.data.dcsnr_sign : vm.viewModel.data.dcsnr_sign.substr(2);

                }).then(function () {
                    let data2 = {
                        bplc_sn: vm.viewModel.bplc_sn,
                    }
                    Axios.post("/selectBplcFstRskEvltList.do", data2).then(function (res) {
                        vm.viewModel.success_list = res.data.list;
                        if (res.data.list.length > 0) {
                            vm.viewModel.bizgroup = res.data.list[0].bizgroup;
                        }
                    }).then(function () {
                        $('#tbl').rowspan(0);
                        $('#tbl').rowspan(1);
                        $('#tbl').rowspan(2);
                        $('#tbl').rowspan(3);
                    });
                });
        },
        signBtn: function (atdrn_sn, i) {
            let vm = this;
            if (confirm("서명하시겠습니까?")) {
                let data = {
                    atdrn_sn: atdrn_sn,
                    mtg_sn: vm.viewModel.data.mtg_sn,
                    bplc_sn: vm.viewModel.bplc_sn,
                };

                Axios.post("/updateFstRskEvltMtgSign.do", data).then(function (res) {
                    if (res.data.result == 1) {
                        alert("서명이 완료되었습니다.");
                        vm.viewModel.mtgUserList[i].sign_yn = 'Y';
                    } else {
                        alert("예기치 못한 오류 발생!!");
                    }
                });
            }
        },
        fnPrint: function (divName) {
            try {
                printJS({
                    printable: divName,
                    type: 'html',
                    css: ['/css/basic.css', '/css/print.css'],
                    scanStyles: false,
                });
            } catch (ex) {
                console.log(ex);
                alert("서명 이미지를 확인해주세요.");
            }

        },
        fnDownlaod: function () {
            let vm = this;

            let doc = new jsPDF('p', 'mm', 'a4')

            let a4_cnt = document.getElementsByClassName('a4').length;

            $('#viewDiv.a4').each(function (index, item) {
                html2canvas(item, {
                    scale: 3
                }).then(function (canvas) {
                    // 캔버스를 이미지로 변환
                    let imgData = canvas.toDataURL('image/jpeg');

                    let canWidth = canvas.width / 10;
                    let canHeight = canvas.height / 10;

                    let imgWidth = 190; // 이미지 가로 길이(mm) A4 기준
                    let imgHeight = canHeight * imgWidth / canWidth;
                    let margin = 10; // 출력 페이지 여백설정

                    // 첫 페이지 출력
                    if (index != 0) {
                        doc.addPage();
                    }
                    doc.addImage(imgData, 'jpeg', margin, margin, imgWidth, imgHeight);

                    // 파일 저장
                    if (Number(a4_cnt - 1) == index) {
                        doc.save('최초위험성평가 회의록.pdf');
                    }
                });
            });
        },
    }
};
</script>
