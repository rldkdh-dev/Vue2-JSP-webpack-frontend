<template>
<div>
    <div class="contents">
        <div class="divide">
            <div>
                <div>
                    <table class="table horizontal green write" style="max-height: 100px; margin-top: 3em;">
                        <caption>최초 위험성평가 등록</caption>
                        <tbody>
                            <tr>
                                <th scope="row" class="w180"><label for="">현장명</label></th>
                                <!-- <select class="w400" id="list" v-model="viewModel.bplc_sn" @change="fnSelect" v-if="viewModel.userInfo.user_roles == 'ROLE_001'">
                                        <option value="0" disabled="" selected="">현장명 선택</option>
                                        <option :value="item.bplc_sn" v-for="(item,i) in viewModel.bplcList" :key="i">{{ item.bplc_nm }}</option>
                                    </select>
                                    <input class="w400" type="text" v-model="viewModel.userInfo.bplc_nm" v-if="viewModel.userInfo.user_roles == 'ROLE_002'" disabled /> -->
                                <!-- <a href="" class="btn btn-default" style="width: 5%; display:inline-flex;" v-if="viewModel.userInfo.user_roles == 'ROLE_001'"><svg class="icon">
                                            <use xlink:href="../../img/symbol-defs.svg#icon-search"></use>
                                        </svg>검색</a> -->
                                <td>
                                    {{viewModel.bplc_nm}}
                                </td>
                            </tr>
                            <tr>
                                <th scope="row"><label for="">사업군</label></th>
                                <td>
                                    {{viewModel.bizgroup}}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="h650 overflow-y">
                    <table class="table write narrow" id="tbl">
                        <caption>최초위험성평가</caption>
                        <thead>
                            <tr>
                                <th scope="col" rowspan="2">대공종</th>
                                <th scope="col" rowspan="2">중공종</th>
                                <th scope="col" rowspan="2">소공종</th>
                                <th scope="col" rowspan="2">세부작업내용</th>
                                <th scope="col" rowspan="2">위험요소</th>
                                <th scope="col" colspan="4">사고사례</th>
                                <th scope="col" rowspan="2">위험성</th>

                                <th scope="col" rowspan="2">대책</th>
                                <th scope="col" rowspan="2">대형(고) 위험작업</th>
                                <th scope="col" rowspan="2">할 수 없는것 체크</th>
                            </tr>
                            <tr>
                                <th scope="col">기인물</th>
                                <th scope="col">재해유형</th>
                                <th scope="col">사고개요</th>
                                <th scope="col">사고원인</th>
                            </tr>
                        </thead>
                        <tbody v-if="viewModel.success_list.length > 0">
                            <tr v-for="(item, index) in viewModel.success_list" :key="index" :lrge="item.lrge_worktype_sn" :middl="item.middl_worktype_sn" :small="item.small_worktype_sn" :detail="item.detail_jobcn_sn" :risk="item.risk_factor_sn">
                                <!-- <td v-if="index === 0 || item.lrge_worktype_sn !== viewModel.success_list[index - 1].lrge_worktype_sn">{{ item.lrge_worktype }}</td>
                                    <td v-else></td>
                                    <td v-if="index === 0 || item.middl_worktype !== viewModel.success_list[index - 1].middl_worktype">{{ item.middl_worktype }}</td>
                                    <td v-else></td>
                                    <td v-if="index === 0 || item.small_worktype !== viewModel.success_list[index - 1].small_worktype">{{ item.small_worktype }}</td>
                                    <td v-else></td>
                                    <td v-if="index === 0 || item.detail_jobcn !== viewModel.success_list[index - 1].detail_jobcn">{{ item.detail_jobcn }}</td>
                                    <td v-else></td> -->
                                <td>{{ item.lrge_worktype }}</td>
                                <td>{{ item.middl_worktype }}</td>
                                <td>{{ item.small_worktype }}</td>
                                <td>{{ item.detail_jobcn }}</td>
                                <td>{{ item.risk_factor }}</td>
                                <td>{{ item.acdnt_case_orgcause_material }}</td>
                                <td>{{ item.acdnt_case_dsstr_stle }}</td>
                                <td>{{ item.acdnt_case_sumry }}</td>
                                <td>{{ item.acdnt_case_cause }}</td>
                                <td>{{ item.risk_grd }}</td>
                                <td>{{ item.cntrpln }}</td>
                                <td>{{ item.lgz_hrisk_job_yn }}</td>
                                <td>{{ item.cant_yn }}</td>
                            </tr>
                        </tbody>
                        <tbody v-else>
                            <tr>
                                <td style="font-size: 20px; padding: 50px;" colspan="12" id="msg1"></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="btn-group btn-right" v-if="viewModel.bplc_sn == 0">
                </div>
                <div class="btn-group btn-right" v-else>
                    <button class="btn btn-white" @click="fnExcelDownload"><i class="icon_excel"></i>엑셀다운로드</button>
                    <!-- <router-link :to="'/write/'+viewModel.bplc_sn" class="btn btn-purple" v-if="viewModel.success_list.length > 0 && viewModel.data.dcsn_sign_yn == 'N'"><svg class="icon">
                            <use xlink:href="../../img/symbol-defs.svg#icon-edit"></use>
                        </svg>편집</router-link>
                    <router-link :to="'/write/'+viewModel.bplc_sn" class="btn btn-purple" v-else-if="viewModel.success_list.length == 0 || viewModel.data.dcsn_sign_yn == 'N'"><svg class="icon">
                            <use xlink:href="../../img/symbol-defs.svg#icon-post-add"></use>
                        </svg>등록</router-link> -->
                    <router-link :to="'/'" class="btn btn-purple"><svg class="icon">
                            <use xlink:href="../../img/symbol-defs.svg#icon-list-back"></use>
                        </svg>목록</router-link>
                </div>
            </div>
            <div class="approval" style="right: 3em;">
                <h3>결재 정보</h3>
                <ul>
                    <li class="signed">
                        <a href="javascript:;">
                            <p>작성자</p>
                            <div class="user_img" id="1">
                                <img :src="viewModel.data.wrtr_sign">
                            </div>
                            <span>{{ viewModel.data.wrtr_nm == "" ? "작성자 등록": viewModel.data.wrtr_nm }}</span>
                        </a>
                    </li>
                    <li :class="[viewModel.data.mdtr && viewModel.data.mdtr_sign_yn != 'Y' ? 'set' : viewModel.data.mdtr && viewModel.data.mdtr_sign_yn=='Y' ? 'signed' : null]">
                        <a href="javascript:;">
                            <p>조정자</p>
                            <div class="user_img" id="2">
                                <img :src="viewModel.data.mdtr_sign" v-if="viewModel.data.mdtr_sign_yn == 'Y'">
                                <a class="btn btn-purple" @click="fnSign('mdtr')" v-if="viewModel.data.mdtr_sign_yn == 'N' && viewModel.data.mdtr == viewModel.userInfo.user_id">결재</a>
                                <img src="" v-if="viewModel.data.mdtr_sign_yn == 'N' && viewModel.data.mdtr != viewModel.userInfo.user_id">
                            </div>
                            <span>{{ viewModel.data.mdtr_nm == "" ? "조정자 미지정":viewModel.data.mdtr_nm }}</span>
                        </a>
                    </li>
                    <li :class="[viewModel.data.dcsn != '' && viewModel.data.dcsn_sign_yn != 'Y' ? 'set' : viewModel.data.dcsn != '' && viewModel.data.dcsn_sign_yn=='Y' ? 'signed' : null]">
                        <a href="javascript:;">
                            <p>결정자</p>
                            <div class="user_img" id="3">
                                <img :src="viewModel.data.dcsn_sign" v-if="viewModel.data.dcsn_sign_yn == 'Y'">
                                <a class="btn btn-purple" @click="fnSign('dcsn')" v-if="viewModel.data.dcsn_sign_yn == 'N'&& viewModel.data.dcsn == viewModel.userInfo.user_id">결재</a>
                                <img src="" v-if="viewModel.data.dcsn_sign_yn == 'N'&& viewModel.data.dcsn != viewModel.userInfo.user_id">
                            </div>
                            <span>{{ viewModel.data.dcsn_nm == "" ? "결정자 미지정":viewModel.data.dcsn_nm }}</span>
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    </div>
    <excelform ref="excelform"></excelform>
</div>
</template>

<script>
import "es6-promise/auto";
import Vue from "vue";
import Axios from "axios";
import Pager from "../../../paging.vue";
import excelform from "../../excelform.vue";

export default {
    components: {
        'pager': Pager,
        'excelform': excelform,
    },
    data: function () {
        return {
            imgsrc: '',
            viewModel: {
                bplc_sn: 0,
                evl_sn: '',
                bizgroup_sn: "",
                bplcList: [],
                userInfo: {},
                success_list: [],
                bplc_nm: "",
                bizgroup: "",
                data: {
                    wrtr: '',
                    wrtr_nm: '',
                    mdtr: '',
                    mdtr_nm: '',
                    dcsn: '',
                    dcsn_nm: '',
                    mdtr_sign: '',
                    wrtr_sign: '',
                    dcsn_sign: '',
                    mdtr_sign_yn: '',
                    dcsn_sign_yn: '',
                },
            }
        };
    },
    mounted: function () {
        let vm = this;
        vm.fnInit();
    },
    methods: {
        fnInit: function () {
            let vm = this;
            vm.viewModel.userInfo = vm.$store.state.global.userInfo;
            vm.viewModel.bplc_sn = vm.$route.params.bplc_sn;
            vm.viewModel.evl_sn = vm.$route.params.evl_sn;
            vm.fnList()
        },
        fnList: function () {
            let vm = this;
            vm.viewModel.bizgroup = "";
            $("#msg1").text("");
            let data = {
                mapperId: 'comm.selectAllBplcList',
                bplc_use_yn: 'A',
                bplc_sn: vm.viewModel.bplc_sn,
            };
            Axios.post("/list.do", data).then(function (rs) {
                vm.viewModel.bplcList = rs.data.list;
                const target = vm.viewModel.bplcList.find(item => item.bplc_sn == vm.viewModel.bplc_sn);
                vm.viewModel.bplc_nm = target.bplc_nm;
            });
            if (vm.viewModel.userInfo.user_roles == 'ROLE_001' && vm.viewModel.bplc_sn == 0) {
                $("#msg1").text("현장을 선택하여 조회하세요.");
            } else {
                let data = {
                    bplc_sn: vm.viewModel.bplc_sn,
                    evl_sn: vm.viewModel.evl_sn,
                }

                $(".loading").show();
                Axios.post("/selectBplcFstRskEvltList.do", data).then(function (res) {
                    vm.viewModel.success_list = res.data.list;
                    if (res.data.sign != null) vm.viewModel.data = res.data.sign;
                    if (res.data.list.length > 0) {
                        vm.viewModel.data.wrtr = res.data.sign.wrtr;
                        vm.viewModel.data.wrtr_nm = res.data.sign.user_nm;
                        vm.viewModel.data.wrtr_sign = res.data.sign.sign_img.charAt() == '/' ? res.data.sign.sign_img : res.data.sign.sign_img.substr(2);
                        if (res.data.sign.mdtr != null) {
                            vm.viewModel.data.mdtr = res.data.sign.mdtr;
                            vm.viewModel.data.mdtr_nm = res.data.sign.mdtr_nm;
                            vm.viewModel.data.mdtr_sign_yn = res.data.sign.mdtr_sign_yn;
                            if (res.data.sign.mdtr_sign_img != null) vm.viewModel.data.mdtr_sign = res.data.sign.mdtr_sign_img.charAt() == '/' ? res.data.sign.mdtr_sign_img : res.data.sign.mdtr_sign_img.substr(2);
                        }
                        if (res.data.sign.dcsn != null) {
                            vm.viewModel.data.dcsn = res.data.sign.dcsn
                            vm.viewModel.data.dcsn_nm = res.data.sign.dcsn_nm
                            vm.viewModel.data.dcsn_sign_yn = res.data.sign.dcsn_sign_yn
                            if (res.data.sign.dcsn_sign_img != null) vm.viewModel.data.dcsn_sign = res.data.sign.dcsn_sign_img.charAt() == '/' ? res.data.sign.dcsn_sign_img : res.data.sign.dcsn_sign_img.substr(2);
                        }
                        vm.viewModel.bizgroup = res.data.list[0].bizgroup;
                    }
                }).then(function () {
                    if (vm.viewModel.success_list.length > 0) {
                        $('#tbl').rowspan(0);
                        $('#tbl').rowspan(1);
                        $('#tbl').rowspan(2);
                        $('#tbl').rowspan(3);
                    } else {
                        $("#msg1").text("아직 최초위험성 평가가 등록되지 않았습니다.");
                    }
                    $(".loading").hide();
                });;
            }
        },
        fnSelect: function () {
            let vm = this;
            vm.viewModel.bizgroup = "";
            $("#msg1").text("");
            let data = {
                bplc_sn: vm.viewModel.bplc_sn,
                evl_sn: vm.viewModel.evl_sn,
            }

            $(".loading").show();
            Axios.post("/selectBplcFstRskEvltList.do", data).then(function (res) {
                vm.viewModel.success_list = res.data.list;
                if (res.data.sign != null) vm.viewModel.data = res.data.sign;
                if (res.data.list.length > 0) {
                    vm.viewModel.data.wrtr = res.data.sign.wrtr;
                    vm.viewModel.data.wrtr_nm = res.data.sign.user_nm;
                    vm.viewModel.data.wrtr_sign = res.data.sign.sign_img.charAt() == '/' ? res.data.sign.sign_img : res.data.sign.sign_img.substr(2);
                    if (res.data.sign.mdtr != null) {
                        vm.viewModel.data.mdtr = res.data.sign.mdtr;
                        vm.viewModel.data.mdtr_nm = res.data.sign.mdtr_nm;
                        vm.viewModel.data.mdtr_sign_yn = res.data.sign.mdtr_sign_yn;
                        if (res.data.sign.mdtr_sign_img != null) vm.viewModel.data.mdtr_sign = res.data.sign.mdtr_sign_img.charAt() == '/' ? res.data.sign.mdtr_sign_img : res.data.sign.mdtr_sign_img.substr(2);
                    }
                    if (res.data.sign.dcsn != null) {
                        vm.viewModel.data.dcsn = res.data.sign.dcsn
                        vm.viewModel.data.dcsn_nm = res.data.sign.dcsn_nm
                        vm.viewModel.data.dcsn_sign_yn = res.data.sign.dcsn_sign_yn
                        if (res.data.sign.dcsn_sign_img != null) vm.viewModel.data.dcsn_sign = res.data.sign.dcsn_sign_img.charAt() == '/' ? res.data.sign.dcsn_sign_img : res.data.sign.dcsn_sign_img.substr(2);
                    }

                    vm.viewModel.bizgroup = res.data.list[0].bizgroup;
                }
            }).then(function () {
                if (vm.viewModel.success_list.length > 0) {
                    $('#tbl').rowspan(0);
                    $('#tbl').rowspan(1);
                    $('#tbl').rowspan(2);
                    $('#tbl').rowspan(3);
                } else {
                    $("#msg1").text("아직 최초위험성 평가가 등록되지 않았습니다.");
                }
                $(".loading").hide();
            });;
        },
        fnExcelDownload: function () {
            let vm = this;
            // 자바 버전
            const header = ['대공종', '중공종', '소공종', '세부작업내용', '위험요소', '기인물', '재해유형', '사고개요', '사고원인', '위험성', '대책', '대형(고)위험작업', '할수없는것체크'];
            const mapperId = 'selectBplcFstRskEvltList';
            //검색조건
            let data = {
                header: header,
                mapperId: mapperId,
                bplc_sn: vm.viewModel.bplc_sn,
                evl_sn: vm.viewModel.evl_sn,
                // 파일명 
                fileName: "최초위험성평가", // 스마트안전보건_년월일.xlsx
                // 해당 화면 필요한 조건 파라미터 추가 부분
            };
            if (confirm("엑셀 출력 하시겠습니까?")) {
                this.$nextTick(function () {
                    vm.$refs.excelform.fnInit(data);
                })
            }
        },
        fnSign: function (gbn) {
            let vm = this;
            if (gbn == 'dcsn') {
                if (vm.viewModel.data.wrtr_sign_yn == "N") return alert("작성자 결재 후 결재가능합니다.");
                if (vm.viewModel.data.mdtr != "" && vm.viewModel.data.mdtr_sign_yn == "N") return alert("조정자 결재 후 결재가능합니다.");
            }

            if (gbn == 'mdtr') {
                if (vm.viewModel.data.wrtr_sign_yn == "N") return alert("작성자 결재 후 결재가능합니다.");
            }
            let data = {
                bplc_sn: vm.viewModel.bplc_sn,
                evl_sn: vm.viewModel.evl_sn,
                gbn: gbn,
            }
            if (confirm("결재처리 하시겠습니까?")) {
                Axios.post("/updateFstRskSign.do", data).then(function (res) {
                    if (res.data.result == 1) {
                        alert("결재처리 되었습니다.");
                        if (gbn == 'mdtr') {
                            vm.viewModel.data.mdtr_sign_yn = 'Y';
                            $.ajax({
                                type: "post",
                                url: "/api/pushSendPerson.do",
                                data: {
                                    // 제목 및 내용
                                    title: "최초위험성평가",
                                    message: "조정자 결재가 완료되었습니다. PC에서 확인바랍니다.",
                                    user_id: vm.viewModel.data.dcsn,
                                    // 클릭 시 이동 화면주소
                                    link: "/main/index.do"
                                }
                            });
                        }
                        if (gbn == 'dcsn') {
                            vm.viewModel.data.dcsn_sign_yn = 'Y';
                            let sendUser = "";
                            sendUser = vm.viewModel.data.mdtr + "," + vm.viewModel.data.wrtr;
                            if (vm.viewModel.data.mdtr == "" || vm.viewModel.data.mdtr == null) sendUser = vm.viewModel.data.wrtr;
                            $.ajax({
                                type: "post",
                                url: "/api/pushSendPerson.do",
                                data: {
                                    // 제목 및 내용
                                    title: "최초위험성평가",
                                    message: "결재 종결되었습니다. PC에서 확인바랍니다.",
                                    user_id: sendUser,
                                    // 클릭 시 이동 화면주소
                                    link: "/main/index.do"
                                }
                            });
                        }
                    } else {
                        alert("결재 실패하였습니다.");
                    }
                });
            }

        },
    }
};
</script>
