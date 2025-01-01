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
                                <th scope="row" class="w180 essential">현장명</th>
                                <td colspan="3">
                                    {{viewModel.bplc_nm}}
                                </td>
                            </tr>
                            <tr>
                                <th scope="row" class="essential">회의일시</th>
                                <td>
                                    <div class="datepicker_box">
                                        <input type="text" class="datepicker" id="dt" title="회의일시" placeholder="회의일시 선택" v-if="viewModel.data.reg_id == viewModel.userInfo.user_id || viewModel.userInfo.user_roles == 'ROLE_001' || mode=='write'" readonly>
                                        <input type="text" class="datepicker" id="dt" title="회의일시" placeholder="회의일시 선택" disabled v-else>
                                    </div>
                                </td>
                                <th scope="row" class="essential">회의장소</th>
                                <td>
                                    <input type="text" v-model="viewModel.data.mtg_plc" v-if="viewModel.data.reg_id == viewModel.userInfo.user_id || viewModel.userInfo.user_roles == 'ROLE_001' || mode=='write'">
                                    <input type="text" v-model="viewModel.data.mtg_plc" disabled v-else>
                                </td>
                            </tr>
                            <tr>
                                <th scope="row" class="essential">안건</th>
                                <td colspan="3">
                                    <input type="text" v-model="viewModel.data.agnd" v-if="viewModel.data.reg_id == viewModel.userInfo.user_id || viewModel.userInfo.user_roles == 'ROLE_001' || mode=='write'">
                                    <input type="text" v-model="viewModel.data.agnd" disabled v-else>
                                </td>
                            </tr>
                            <tr>
                                <th scope="row"><label for="">첨부</label></th>
                                <td>
                                    <fileform @filelist="fnFilelist" @fileDelete="fnFileDelete" :pass="{id:'sc'}" ref="files"></fileform>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div>
                    <h3>참석자 명단</h3>
                    <div class="table_top btn-right">
                        <button @click="fnMtgUserPopup" class="btn btn-light-purple">
                            <svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-group-add"></use></svg>추가
                        </button>
                    </div>
                    <table class="table write" id="userTbl">
                        <caption>참석자 명단</caption>
                        <colgroup>
                            <col width="40%">
                            <col width="40%">
                            <col width="10%">
                            <col width="10%">
                        </colgroup>
                        <thead>
                            <tr>
                                <th scope="col">직책(담당)</th>
                                <th scope="col">성명</th>
                                <th scope="col" style="width:10%">서명</th>
                                <th scope="col"></th>
                            </tr>
                        </thead>
                        <tbody v-if="mode == 'detail'">
                            <tr v-for="(item,i) in viewModel.mtgUserList" :key="i">
                                <td><input type="text" class="text-center" :value="item.ocpt_detail_nm" readonly></td>
                                <td v-if='item.user_nm != ""'><input type="text" class="text-center" :value="item.user_nm" readonly></td>
                                <td v-else>
                                    <div class="input_btn" @click="fnUserPopup(i)">
                                        <input type="text" v-model="item.user_nm" readonly>
                                        <label><svg class="icon">
                                                <use xlink:href="../../img/symbol-defs.svg#icon-search"></use>
                                            </svg></label>
                                    </div>
                                </td>
                                <td>
                                    <button class="btn btn-small btn-white" v-if="viewModel.userInfo.user_id == item.atdrn && item.sign_yn =='N'" @click="signBtn(item.atdrn_sn,i)">서명하기</button>
                                    <div class="user_img" id="" v-else>
                                        <img :src="item.sign_img" v-bind:style="item.sign_yn != 'Y' ? 'display: none;' : ''">
                                    </div>
                                </td>
                                <td>
                                    <button @click="fnDeleteBtn(i)" class="btn btn-icon" v-if="viewModel.data.reg_id == viewModel.userInfo.user_id || viewModel.userInfo.user_roles == 'ROLE_001'"><svg class="icon">
                                            <use xlink:href="../../img/symbol-defs.svg#icon-circle-minus"></use>
                                        </svg></button>
                                </td>
                            </tr>
                        </tbody>
                        <tbody v-else>
                            <tr v-for="(item,i) in viewModel.mngUserList" :key="i">
                                <td><input type="text" class="text-center" :value="item.OCPT_DETAIL_NM" readonly></td>
                                <td v-if='item.USER_NM != ""'><input type="text" class="text-center" :value="item.USER_NM" readonly></td>
                                <td v-else>
                                    <div class="input_btn" @click="fnUserPopup(i)">
                                        <input type="text" v-model="item.USER_NM" readonly>
                                        <label><svg class="icon">
                                                <use xlink:href="../../img/symbol-defs.svg#icon-search"></use>
                                            </svg></label>
                                    </div>
                                </td>
                                <!-- <button class="btn btn-small btn-white">서명하기</button> -->
                                <td></td>
                                <td>
                                    <button @click="fnDeleteBtn(i)" class="btn btn-icon"><svg class="icon">
                                            <use xlink:href="../../img/symbol-defs.svg#icon-circle-minus"></use>
                                        </svg></button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div>
                    <h3>회의내용 요약</h3>
                    <div style="height: 400px;">
                        <textarea rows="5" v-model="viewModel.data.mtg" v-if="viewModel.data.reg_id == viewModel.userInfo.user_id || viewModel.userInfo.user_roles == 'ROLE_001' || mode=='write'"></textarea>
                        <textarea rows="5" v-model="viewModel.data.mtg" readonly v-else></textarea>
                    </div>
                </div>
                <div class="btn-group btn-right">
                    <button @click="fnSave" class="btn btn-purple" v-if="mode=='detail' &&(viewModel.data.reg_id == viewModel.userInfo.user_id || viewModel.userInfo.user_roles == 'ROLE_001')">
                        <svg class="icon">
                            <use xlink:href="../../img/symbol-defs.svg#icon-post-add"></use>
                        </svg>수정</button>
                    <button @click="fnSave" class="btn btn-purple" v-else-if="mode == 'write'">
                        <svg class="icon">
                            <use xlink:href="../../img/symbol-defs.svg#icon-post-add"></use>
                        </svg>등록</button>
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
                            <p class="essential">작성자</p>
                            <div class="user_img" id="1">
                                <img :src="viewModel.data.wrtr_sign">
                            </div>
                            <span>{{ viewModel.data.wrtr_nm == "" ? "작성자 등록": viewModel.data.wrtr_nm }}</span>
                        </a>
                    </li>
                    <li :class="[viewModel.data.mdtr && viewModel.data.mdtr_sign_yn != 'Y' ? 'set' : viewModel.data.mdtr && viewModel.data.mdtr_sign_yn=='Y' ? 'signed' : null]" @click="fnAprvrpopup('mdtr')" v-if="viewModel.data.reg_id == viewModel.userInfo.user_id || viewModel.userInfo.user_roles == 'ROLE_001'|| mode=='write'">
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
                    <li :class="[viewModel.data.dcsnr != '' && viewModel.data.dcsnr_sign_yn != 'Y' ? 'set' : viewModel.data.dcsnr != '' && viewModel.data.dcsnr_sign_yn=='Y' ? 'signed' : null]" @click="fnAprvrpopup('dcsnr')" v-if="viewModel.data.reg_id == viewModel.userInfo.user_id || viewModel.userInfo.user_roles == 'ROLE_001' || mode=='write'">
                        <a href="javascript:;">
                            <p class="essential">결정자</p>
                            <div class="user_img" id="3">
                                <img :src="viewModel.data.dcsnr_sign" v-bind:style="viewModel.data.dcsnr_sign_yn != 'Y' ? 'display: none;' : ''">
                            </div>
                            <span>{{ viewModel.data.dcsnr_nm == "" ? "결정자 등록":viewModel.data.dcsnr_nm }}</span>
                        </a>
                    </li>
                    <li :class="[viewModel.data.dcsnr != '' && viewModel.data.dcsnr_sign_yn != 'Y' ? 'set' : viewModel.data.dcsnr != '' && viewModel.data.dcsnr_sign_yn=='Y' ? 'signed' : null]" v-else>
                        <a href="javascript:;">
                            <p class="essential">결정자</p>
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
    <hquser ref="user" v-if="hqUserPop==true" :pass="{title:'유저', multi:'N'}"></hquser>
    <user ref="aprvr" v-if="aprvrPop==true" :pass="{dept_sn: viewModel.userInfo.dept_sn, team_sn: viewModel.userInfo.team_sn, title:'결재자', bplc_yn:'Y', bplc_sn: viewModel.data.bplc_sn, ocpt_detail_cd : 1}"></user>
    <user ref="mtgUser" v-if="mtgUserPop==true" :pass="{dept_sn: viewModel.userInfo.dept_sn, team_sn: viewModel.userInfo.team_sn, title:'참석자', multi:'Y', bplc_yn:'Y', bplc_sn: viewModel.data.bplc_sn, ocpt_detail_cd : 1}"></user>
</div>
</template>

<script>
import "es6-promise/auto";
import Vue from "vue";
import Axios from "axios";
import hquser from "../../popup/hq_user_popup.vue";
import Fileform from '../../../../common/vue/fileform2.vue';
import user from "../../popup/user_popup.vue";
export default {
    components: {
        'fileform': Fileform,
        'hquser': hquser,
        'user': user,
    },
    data: function () {
        return {
            mode: "write",
            hqUserPop: false,
            mtgUserPop: false,
            aprvrPop: false,
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
            },
            isSaved: false,
        };
    },
    beforeRouteLeave: function(to, from, next){
        let vm = this;
        if(!vm.isSaved){
            if(!confirm("페이지를 이동할 경우 현재 페이지는 저장되지 않습니다.\n그래도 나가시겠습니까?")){
                return false;
            } 
        }
        next();
    },
    mounted: function () {
        let vm = this;
        calendarInput();
        vm.fnInit();
    },
    methods: {
        fnInit: function () {
            let vm = this;
            vm.viewModel.userInfo = vm.$store.state.global.userInfo;
            vm.viewModel.bplc_sn = vm.$route.params.bplc_sn;
            let send = {
                mapperId: 'comm.selectAllBplcList',
                bplc_use_yn: 'A',
                bplc_sn: vm.viewModel.bplc_sn,
            };
            Axios.post("/list.do", send).then(function (rs) {
                vm.viewModel.bplcList = rs.data.list;
                const target = vm.viewModel.bplcList.find(item => item.bplc_sn == vm.viewModel.bplc_sn);
                vm.viewModel.bplc_nm = target.bplc_nm;
            });
            
            if (vm.$route.params.mtg_sn != null && vm.$route.params.mtg_sn != undefined) {
                vm.mode = "detail";
                vm.fnDetail(vm.$route.params.mtg_sn, vm.$route.params.bplc_sn);
            } else {

                let data = {
                    bplc_sn: vm.viewModel.bplc_sn,
                }
                Axios.post("/selectMtgUserList.do", data).then(function (res) {
                    vm.viewModel.mngUserList = res.data.list;
                    vm.viewModel.data.dcsnr = res.data.resultMap.dcsnr
                    vm.viewModel.data.dcsnr_nm = res.data.resultMap.dcsnr_nm
                    vm.viewModel.data.dcsnr_sign = res.data.resultMap.dcsnr_sign.charAt() == '/' ? res.data.resultMap.dcsnr_sign : res.data.resultMap.dcsnr_sign.substr(2);
                })
                vm.viewModel.data.bplc_sn = vm.viewModel.bplc_sn == 0 ? '' : vm.viewModel.bplc_sn;
                //작성자 결재정보 추가
                vm.viewModel.data.wrtr = vm.$store.state.global.userInfo.user_id;
                vm.viewModel.data.wrtr_nm = vm.$store.state.global.userInfo.user_name;
                vm.viewModel.data.wrtr_sign = vm.$store.state.global.userInfo.aprvr_path.charAt() == '/' ? vm.$store.state.global.userInfo.aprvr_path : vm.$store.state.global.userInfo.aprvr_path.substr(2);
            }
        },
        fnList: function (paramPageNo) {
            let vm = this;

            vm.viewModel.pager.pageNo = paramPageNo == 0 ? 1 : paramPageNo;

            let send = {
                mapperId: 'Data.selectPolicy',
                totalId: 'Data.getBaseCheckListTotalCount',
            }
            Axios.post("/adminlist", send)
                .then(function (response) {
                    // vm.imgsrc = response.data.list[0].contents;
                    // editor.setData('\''+text+'\'');
                    // editor.setData(text);
                    // $('.image').css('width', '44.41%');

                    //페이징세팅
                    Pager.props = Pager.methods.createPaging(vm.viewModel.pager, vm, "list");
                });
        },
        fnAddBtn: function () {
            let vm = this;
            if (vm.mode == 'write') {
                let data = {
                    user_nm: "",
                    user_id: "",
                    uid_seq: '',
                    ocpt_detail_nm: ""
                };
                vm.viewModel.mngUserList.push(data);
            } else if (vm.mode == 'detail') {
                let data = {
                    user_nm: "",
                    atdrn: "",
                    ocpt_detail_nm: ""
                };
                vm.viewModel.mtgUserList.push(data);
            }
        },
        fnHqMemberAdd: function (item) {
            let vm = this;
            if (vm.mode == 'write') {
                vm.viewModel.mngUserList[vm.popIndex].USER_NM = item.user_nm;
                vm.viewModel.mngUserList[vm.popIndex].USER_ID = item.user_id;
                vm.viewModel.mngUserList[vm.popIndex].OCPT_DETAIL_NM = item.jbttl_nm;
            } else if (vm.mode == 'detail') {
                vm.viewModel.mtgUserList[vm.popIndex].user_nm = item.user_nm;
                vm.viewModel.mtgUserList[vm.popIndex].atdrn = item.user_id;
                vm.viewModel.mtgUserList[vm.popIndex].ocpt_detail_nm = item.jbttl_nm;
                vm.viewModel.mtgUserList[vm.popIndex].sign_yn = 'N';
            }
        },
        fnMemberAdd: function (item) {
            let vm = this;

            if (vm.AprvrGbn == 'mdtr') {
                vm.viewModel.data.mdtr = item.user_id;
                vm.viewModel.data.mdtr_nm = item.user_nm;
            } else {
                vm.viewModel.data.dcsnr = item.user_id;
                vm.viewModel.data.dcsnr_nm = item.user_nm;
            }

            //팝업 초기화
            vm.hqUserPop = false;
            vm.mtgUserPop = false;
            vm.aprvrPop = false;
        },
        fnUserPopup: function (i) {
            let vm = this;
            vm.popIndex = i;
            vm.hqUserPop = true;
            vm.mtgUserPop = false;
            vm.aprvrPop = false;
            vm.$nextTick(function () {
                if (vm.hqUserPop) {
                    vm.$refs.user.fnInit();
                }
            })
        },
        fnDeleteBtn: function (i) {
            let vm = this;
            if (vm.mode == 'write') {
                vm.viewModel.mngUserList.splice(i, 1);
            } else if (vm.mode == 'detail') {
                vm.viewModel.mtgUserList.splice(i, 1);
            }
        },
        fnAprvrpopup: function (gbn) {
            let vm = this;

            vm.AprvrGbn = gbn; //어느 결재자 정보인지 담아두기.

            vm.hqUserPop = false;
            vm.mtgUserPop = false;
            vm.aprvrPop = false;

            if (vm.viewModel.data.bplc_sn == '' || vm.viewModel.data.bplc_sn == undefined) {
                alert("현장명을 선택해주세요.");
                return false;
            } else if (gbn == 'mdtr' && vm.viewModel.data.mdtr_sign_yn == 'Y') {
                alert("검토자는 이미 결재를 진행하여 변경할 수 없습니다.");
            } else if (gbn == 'dcsnr' && vm.viewModel.data.dcsnr_sign_yn == 'Y') {
                alert("소장은 이미 결재를 진행하여 변경할 수 없습니다.");
            } else {
                vm.aprvrPop = true;
                vm.$nextTick(function () {
                    if (vm.aprvrPop) {
                        vm.$refs.aprvr.fnInit();
                    }
                });
            }
        },
        fnMtgUserPopup: function(){
            let vm = this;

            vm.hqUserPop = false;
            vm.mtgUserPop = true;
            vm.aprvrPop = false;

            vm.$nextTick(function() {
                if(vm.mtgUserPop) {
                    vm.$refs.mtgUser.fnInit();
                }
            })
        },
        fnMultiMemberAdd: function(list){
            let vm = this;
            vm.mtgUserPop=false;

            if(vm.mode == 'detail'){
                vm.viewModel.mtgUserList = [];
                list.forEach((item, i) => {
                    vm.viewModel.mtgUserList.push({'user_nm' : item.user_nm, 'atdrn' : item.user_id, 'ocpt_detail_nm' : item.ocpt_detail_nm})
                    });
            }else{
                vm.viewModel.mngUserList = [];
                list.forEach((item, i) => {
                    vm.viewModel.mngUserList.push({'USER_NM' : item.user_nm, 'USER_ID' : item.user_id, 'OCPT_DETAIL_NM' : item.ocpt_detail_nm})
                });
            }
        },
        fnSave: function () {
            let vm = this;
            let frm = new FormData();
            for (let i = 0; i < vm.viewModel.filelist.length; i++) {
                let key = vm.viewModel.filelist[i].file_seq;
                if (vm.viewModel.filelist[i].file != null) {
                    frm.append("fileTitle", vm.viewModel.filelist[i].file_title);
                    frm.append("uploadFiles", vm.viewModel.filelist[i].file);
                    frm.append("file_se", 1);
                    if (vm.viewModel.filelist[i].file_sn) {
                        frm.append("deleteFiles", vm.viewModel.filelist[i].file_sn);
                    }
                    frm.append("key", 0)
                } else {
                    if (vm.viewModel.filelist[i].file == undefined) {

                    } else {
                        frm.append("fileTitle", vm.viewModel.filelist[i].file_title);
                        frm.append("key", key)
                    }
                }
            }
            for (let i = 0; i < vm.viewModel.deletefileList.length; i++) {
                frm.append("deleteFiles", vm.viewModel.deletefileList[i]);
            }

            vm.fngetFileInfo(frm);
        },
        fngetFileInfo: function (frm) {
            let vm = this;
            if (vm.viewModel.data.dcsnr_nm == "") return alert("결정자가 지정되지 않았습니다.");
            if ($(".datepicker").val() == "") return alert("회의일시가 지정되지 않았습니다.");
            if (vm.viewModel.data.agnd == "") return alert("안건이 입력되지 않았습니다.");
            if (vm.viewModel.data.mtg_plc == "") return alert("회의장소가 입력되지 않았습니다.");

            if (vm.mode == 'write') {
                vm.viewModel.mngUserList = vm.viewModel.mngUserList.filter(data => data.USER_NM != "");
            } else if (vm.mode == 'detail') {
                vm.viewModel.mtgUserList = vm.viewModel.mtgUserList.filter(data => data.user_nm != "");
            }
            let data = {}

            if (vm.mode == 'write') {
                data = {
                    mode: vm.mode,
                    list: vm.viewModel.mngUserList,
                    bplc_sn: vm.viewModel.bplc_sn,
                    mtg_dt: $(".datepicker").val(),
                    mtg_plc: vm.viewModel.data.mtg_plc,
                    mtg: vm.viewModel.data.mtg,
                    agnd: vm.viewModel.data.agnd,
                    wrtr: vm.viewModel.data.wrtr,
                    mdtr: vm.viewModel.data.mdtr,
                    dcsn: vm.viewModel.data.dcsnr,
                }

            } else if (vm.mode == 'detail') {
                data = {
                    mode: vm.mode,
                    mod_id: vm.viewModel.userInfo.user_id,
                    mtg_sn: vm.$route.params.mtg_sn,
                    list: vm.viewModel.mtgUserList,
                    bplc_sn: vm.viewModel.bplc_sn,
                    mtg_dt: $(".datepicker").val(),
                    mtg_plc: vm.viewModel.data.mtg_plc,
                    mtg: vm.viewModel.data.mtg,
                    agnd: vm.viewModel.data.agnd,
                    wrtr: vm.viewModel.data.wrtr,
                    mdtr: vm.viewModel.data.mdtr,
                    dcsn: vm.viewModel.data.dcsnr,
                }
            }

            frm.append('data', new Blob([JSON.stringify(data)], {
                type: "application/json"
            }));
            frm.append("filePath", "bsnsAplct");

            if (vm.mode == 'write') {
                if (confirm("등록하시겠습니까?")) {
                    Axios.post("/insertFstRskEvltMtg.do", frm).then(function (res) {
                        if (res.data == 1) {
                            vm.isSaved = true;
                            alert("정상적으로 등록되었습니다.");
                            if (vm.viewModel.data.mdtr == "" || vm.viewModel.data.mdtr == null) {
                                $.ajax({
                                    type: "post",
                                    url: "/api/pushSendPerson.do",
                                    data: {
                                        // 제목 및 내용
                                        title: "최초위험성평가 회의록",
                                        message: "새로 등록된 결재항목이 있습니다. PC에서 확인바랍니다.",
                                        user_id: vm.viewModel.data.dcsnr,
                                        // 클릭 시 이동 화면주소
                                        link: "/main/index.do"
                                    }
                                });
                            } else {
                                $.ajax({
                                    type: "post",
                                    url: "/api/pushSendPerson.do",
                                    data: {
                                        // 제목 및 내용
                                        title: "최초위험성평가 회의록",
                                        message: "새로 등록된 결재항목이 있습니다. PC에서 확인바랍니다.",
                                        user_id: vm.viewModel.data.dcsnr,
                                        // 클릭 시 이동 화면주소
                                        link: "/main/index.do"
                                    }
                                });
                            }
                            vm.$router.push({
                                path: '/'
                            }).then(() => {
                                window.location.reload();
                            });
                        } else {
                            alert("예기치 못한 오류 발생!!");
                        }
                    });
                }
            } else if (vm.mode == 'detail') {
                Axios.post("/updateFstRskEvltMtg.do", frm).then(function (res) {
                    if (res.data.result == 1) {
                        vm.isSaved = true;
                        alert("정상적으로 수정되었습니다.");
                        vm.$router.push('/');
                    } else {
                        alert("예기치 못한 오류 발생!!");
                    }
                });
            }

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
                    $(".datepicker").val(vm.viewModel.data.mtg_dt);
                    vm.viewModel.filelist = response.data.filelist;
                    vm.viewModel.bplc_nm = vm.viewModel.data.bplc_nm;
                    vm.viewModel.bplc_sn = vm.viewModel.data.bplc_sn;
                    vm.viewModel.mtgUserList = response.data.list;
                    vm.$refs.files.fnFileLoadList(vm.viewModel.filelist);
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
    }
};
</script>
