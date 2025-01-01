<template>
<div>
    <div class="contents">
        <div class="divide">
            <div>
                <div>
                    <h3>회의개요</h3>
                    <table class="table horizontal write">
                        <caption>회의개요</caption>
                        <tbody>
                            <tr>
                                <th scope="row" class="w180">현장명</th>
                                <td colspan="3">
                                    {{viewModel.bplc_nm}}
                                </td>
                            </tr>
                            <tr>
                                <th scope="row">회의일시</th>
                                <td>
                                    {{ viewModel.data.mtg_dt }}
                                </td>
                                <th scope="row">회의장소</th>
                                <td>
                                    {{ viewModel.data.mtg_plc }}
                                </td>
                            </tr>
                            <tr>
                                <th scope="row">안건</th>
                                <td colspan="3">
                                    {{ viewModel.data.agnd }}
                                </td>
                            </tr>
                            <tr>
                                <th scope="row"><label for="">첨부</label></th>
                                <td>
                                    <ul>
                                        <li v-for="item in viewModel.filelist" :key="item">
                                            <button class="btn-link" @click="fnFileDown(item)">{{ item.orgnl_file_nm }}</button>
                                        </li>
                                    </ul>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div>
                    <h3>참석자 명단</h3>
                    <div class="table_top btn-right">
                        <!-- <button @click="fnAddBtn" class="btn btn-light-purple" v-if="viewModel.data.reg_id == viewModel.userInfo.user_id || viewModel.userInfo.user_roles == 'ROLE_001'"><svg class="icon">
                                <use xlink:href="../../img/symbol-defs.svg#icon-group-add"></use>
                            </svg>추가</button> -->
                    </div>
                    <table class="table write" id="userTbl">
                        <caption>참석자 명단</caption>
                        <colgroup>
                            <col width="40%">
                            <col width="40%">
                            <col width="10%">
                        </colgroup>
                        <thead>
                            <tr>
                                <th scope="col">직책(담당)</th>
                                <th scope="col">성명</th>
                                <th scope="col" style="width:10%">서명</th>
                            </tr>
                        </thead>
                        <tbody v-if="mode == 'detail'">
                            <tr v-for="(item,i) in viewModel.mtgUserList" :key="i">
                                <td><input type="text" class="text-center" :value="item.ocpt_detail_nm" readonly></td>
                                <td><input type="text" class="text-center" :value="item.user_nm" readonly></td>
                                <td>
                                    <button class="btn btn-small btn-white" v-if="viewModel.userInfo.user_id == item.atdrn && item.sign_yn =='N'" @click="signBtn(item.atdrn_sn,i)">서명하기</button>
                                    <div class="approval" id="" v-else>
                                        <img class="user_img" :src="item.sign_img" v-bind:style="item.sign_yn != 'Y' ? 'display: none;' : ''">
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div>
                    <h3>회의내용 요약</h3>
                    <div style="height: 400px;">
                        <textarea rows="5" v-model="viewModel.data.mtg" readonly></textarea>
                    </div>
                </div>
                <div class="btn-group btn-right">
                    <router-link to="/" class="btn btn-white">
                        <svg class="icon">
                            <use xlink:href="../../img/symbol-defs.svg#icon-list-back"></use>
                        </svg>목록</router-link>
                </div>
            </div>
            <div class="approval">
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
                    <li :class="[viewModel.data.mdtr && viewModel.data.mdtr_sign_yn != 'Y' ? 'set' : viewModel.data.mdtr && viewModel.data.mdtr_sign_yn=='Y' ? 'signed' : null]" v-if="viewModel.data.reg_id == viewModel.userInfo.user_id || viewModel.userInfo.user_roles == 'ROLE_001'|| mode=='write'">
                        <a href="javascript:;">
                            <p>조정자</p>
                            <div class="user_img" id="">
                                <img :src="viewModel.data.mdtr_sign" v-bind:style="viewModel.data.mdtr_sign_yn != 'Y' ? 'display: none;' : ''">
                            </div>
                            <span>{{ viewModel.data.mdtr_nm == "" ? "조정자 등록":viewModel.data.mdtr_nm }}</span>
                        </a>
                    </li>
                    <li :class="[viewModel.data.mdtr && viewModel.data.mdtr_sign_yn != 'Y' ? 'set' : viewModel.data.mdtr && viewModel.data.mdtr_sign_yn=='Y' ? 'signed' : null]" v-else>
                        <a href="javascript:;">
                            <p>조정자</p>
                            <div class="user_img" id="">
                                <img :src="viewModel.data.mdtr_sign" v-bind:style="viewModel.data.mdtr_sign_yn != 'Y' ? 'display: none;' : ''">
                            </div>
                            <span>{{ viewModel.data.mdtr_nm == "" ? "조정자 등록":viewModel.data.mdtr_nm }}</span>
                        </a>
                    </li>
                    <li :class="[viewModel.data.dcsnr != '' && viewModel.data.dcsnr_sign_yn != 'Y' ? 'set' : viewModel.data.dcsnr != '' && viewModel.data.dcsnr_sign_yn=='Y' ? 'signed' : null]" v-if="viewModel.data.reg_id == viewModel.userInfo.user_id || viewModel.userInfo.user_roles == 'ROLE_001' || mode=='write'">
                        <a href="javascript:;">
                            <p>결정자</p>
                            <div class="user_img" id="3">
                                <img :src="viewModel.data.dcsnr_sign" v-bind:style="viewModel.data.dcsnr_sign_yn != 'Y' ? 'display: none;' : ''">
                            </div>
                            <span>{{ viewModel.data.dcsnr_nm == "" ? "결정자 등록":viewModel.data.dcsnr_nm }}</span>
                        </a>
                    </li>
                    <li :class="[viewModel.data.dcsnr != '' && viewModel.data.dcsnr_sign_yn != 'Y' ? 'set' : viewModel.data.dcsnr != '' && viewModel.data.dcsnr_sign_yn=='Y' ? 'signed' : null]" v-else>
                        <a href="javascript:;">
                            <p>결정자</p>
                            <div class="user_img" id="3">
                                <img :src="viewModel.data.dcsnr_sign" v-bind:style="viewModel.data.dcsnr_sign_yn != 'Y' ? 'display: none;' : ''">
                            </div>
                            <span>{{ viewModel.data.dcsnr_nm == "" ? "결정자 등록":viewModel.data.dcsnr_nm }}</span>
                        </a>
                    </li>
                </ul>
            </div>
        </div>
        <!-- <div v-if="mode=='detail'">
            <h3>사업군 : <span> {{viewModel.bizgroup}}</span></h3>
            <div class="overflow-x overflow-y h500">
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
                            <td v-if="index === 0 || item.lrge_worktype_sn !== viewModel.success_list[index - 1].lrge_worktype_sn">{{ item.lrge_worktype }}</td>
                            <td v-else></td>
                            <td v-if="index === 0 || item.middl_worktype !== viewModel.success_list[index - 1].middl_worktype">{{ item.middl_worktype }}</td>
                            <td v-else></td>
                            <td v-if="index === 0 || item.small_worktype !== viewModel.success_list[index - 1].small_worktype">{{ item.small_worktype }}</td>
                            <td v-else></td>
                            <td v-if="index === 0 || item.detail_jobcn !== viewModel.success_list[index - 1].detail_jobcn">{{ item.detail_jobcn }}</td>
                            <td v-else></td>
                            <td>{{ item.lrge_worktype }}</td>
                            <td>{{ item.middl_worktype }}</td>
                            <td>{{ item.small_worktype }}</td>
                            <td class="text-left">{{ item.detail_jobcn }}</td>
                            <td class="text-left">{{ item.risk_factor }}</td>
                            <td>{{ item.acdnt_case_orgcause_material }}</td>
                            <td>{{ item.acdnt_case_dsstr_stle }}</td>
                            <td class="text-left">{{ item.acdnt_case_sumry }}</td>
                            <td class="text-left">{{ item.acdnt_case_cause }}</td>
                            <td>{{ item.risk_grd }}</td>
                            <td class="text-left">{{ item.cntrpln }}</td>
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
        </div> -->
    </div>
</div>
</template>

<script>
import "es6-promise/auto";
import Vue from "vue";
import Axios from "axios";
import Fileform from '../../../../common/vue/fileform2.vue';
export default {
    components: {
        'fileform': Fileform,
    },
    data: function () {
        return {
            mode: "detail",
            imgsrc: '',
            AprvrGbn: '',
            viewModel: {
                filelist: [],
                bplcList: [],
                deletefileList: [],
                fileGroup: '',
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
        vm.fnInit();
    },
    methods: {
        fnInit: function () {
            let vm = this;
            vm.viewModel.userInfo = vm.$store.state.global.userInfo;
            vm.fnDetail(vm.$route.params.mtg_sn, vm.$route.params.bplc_sn);
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
                    vm.viewModel.filelist = response.data.filelist;
                    vm.viewModel.bplc_nm = response.data.result.bplc_nm;
                    vm.viewModel.bplc_sn = response.data.result.bplc_sn;
                    vm.viewModel.mtgUserList = response.data.list;
                    //서명 이미지
                    vm.viewModel.data.wrtr_sign = vm.viewModel.data.wrtr_sign.charAt() == '/' ? vm.viewModel.data.wrtr_sign : vm.viewModel.data.wrtr_sign.substr(2);
                    if(vm.viewModel.data.mdtr_sign != null){
                        vm.viewModel.data.mdtr_sign = vm.viewModel.data.mdtr_sign.charAt() == '/' ? vm.viewModel.data.mdtr_sign : vm.viewModel.data.mdtr_sign.substr(2);
                    }
                    vm.viewModel.data.dcsnr_sign = vm.viewModel.data.dcsnr_sign.charAt() == '/' ? vm.viewModel.data.dcsnr_sign : vm.viewModel.data.dcsnr_sign.substr(2);
                }).then(function(){
                    for(let i=0; i<vm.viewModel.mtgUserList.length; i++){
                        vm.viewModel.mtgUserList[i].sign_img = vm.viewModel.mtgUserList[i].sign_img.charAt() == '/' ? vm.viewModel.mtgUserList[i].sign_img : vm.viewModel.mtgUserList[i].sign_img.substr(2);
                    }
                })

                // .then(function () {
                //     let data2 = {
                //         bplc_sn: vm.viewModel.bplc_sn,
                //     }
                //     Axios.post("/selectBplcFstRskEvltList.do", data2).then(function (res) {
                //         vm.viewModel.success_list = res.data.list;
                //         if (res.data.list.length > 0) {
                //             vm.viewModel.bizgroup = res.data.list[0].bizgroup;
                //         }
                //     }).then(function () {
                //         $('#tbl').rowspan(0);
                //         $('#tbl').rowspan(1);
                //         $('#tbl').rowspan(2);
                //         $('#tbl').rowspan(3);
                //     });
                // });
        },
        signBtn: function (atdrn_sn, i) {
            let vm = this;
            if (confirm("서명하시겠습니까?")) {
                let data = {
                    atdrn_sn: atdrn_sn,
                    mtg_sn: vm.$route.params.mtg_sn,
                    bplc_sn: vm.$route.params.bplc_sn,
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
        fnFileDelete: function (vm) {
            this.viewModel.deletefileList = vm.deletefileList;
        },
        fnFilelist: function (vm) {
            this.viewModel.filelist = vm.filelist;
            this.viewModel.fileGroup = vm.fileGroup;
        },
        fnFileDown:function(item){
                    let vm = this;
                    let send = {
                        menu_se: item.menu_se,
                        sn: item.sn,
                        file_sn: item.file_sn,
                        gbn:'bsnsAplct'
                    }
                    $(".loading").show();
                    $("#mask").show();

                    Axios.post("/download.do",send,{responseType: "blob",}
                    ).then(function(e) {
                        const url = window.URL.createObjectURL(new Blob([e.data], { type: e.headers["content-type"] }))
                        const link = document.createElement("a")
                        link.href = url
                        link.download = item.orgnl_file_nm
                        link.click()
                        window.URL.revokeObjectURL(url)
                    }).then(function(){
                        $(".loading").hide();
                        $("#mask").hide();
                    }); 
                },
    }
};
</script>
