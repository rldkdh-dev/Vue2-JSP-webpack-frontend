<template>
    <div>
        <div class="contents">
        	<h3>기본정보</h3>
            <div class="divide">
                <div>
                    <div>
                        <table class="table horizontal green write">
                            <caption>최초 위험성평가 등록</caption>
                            <tbody>
                                <tr>
                                    <th scope="row" class="w180 essential"><label for="">현장명</label></th>
                                    <td>
                                        {{viewModel.bplc_nm}}
                                    </td>
                                </tr>
                                <tr>
                                    <th scope="row" class="essential"><label for="">사업군</label></th>
                                    <td>
                                        <select title="사업군" id="bizSel" class="wa" @change="fnBizChange" v-model="viewModel.bizgroup_sn">
                                            <option disabled="" selected="" value="">사업군 선택</option>
                                            <option v-for="(item,i) in viewModel.bizGroup" :value="item.bizgroup_sn" :key="i">{{ item.bizgroup }}</option>
                                        </select>
                                    </td>
                                </tr>
                                <tr>
                                    <th scope="row" class="essential"><label>대공종</label></th>
                                    <td>
                                        <div class="input_wrap tag lrg_tag">
                                            <span class="btn-gray" tabindex="0" v-if="viewModel.lrge_worktype == ''">사업군 선택 후 활성화</span>
                                            <span class="btn-gray on lrg_tag" :tabindex="item.lrge_worktype_sn" v-for="(item,i) in viewModel.lrge_worktype" :key="i" v-else>{{item.lrge_worktype}}<button class="fx fx-ac" @click="deleteLrgTag(i)"><svg class="icon">
                                                        <use xlink:href="../../img/symbol-defs.svg#icon-delete"></use>
                                                    </svg></button></span>
                                            <!-- <span class="btn-gray on" tabindex="0">가설공사<button class="fx fx-ac"><svg class="icon">
                                                    <use xlink:href="../../img/symbol-defs.svg#icon-delete"></use>
                                                </svg></button></span>
                                        <span class="btn-gray" tabindex="0">기초공사<button class="fx fx-ac"><svg class="icon">
                                                    <use xlink:href="../../img/symbol-defs.svg#icon-check"></use>
                                                </svg></button></span>
                                        <span class="btn-gray" tabindex="0">조립공사<button class="fx fx-ac"><svg class="icon">
                                                    <use xlink:href="../../img/symbol-defs.svg#icon-check"></use>
                                                </svg></button></span> -->
                                            <div class="btn-group" v-if="viewModel.lrge_worktype != ''">
                                                <button class="btn btn-small btn-blue" @click="fnLrgSelect()"><svg class="icon">
                                                        <use xlink:href="../../img/symbol-defs.svg#icon-check"></use>
                                                    </svg>확정</button>
                                                <!-- <button class="btn btn-small btn-white"><svg class="icon">
                                                    <use xlink:href="../../img/symbol-defs.svg#icon-refresh"></use>
                                                </svg>초기화</button> -->
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <th scope="row" class="essential"><label>중공종</label></th>
                                    <td>
                                        <div class="input_wrap tag middl_tag">
                                            <span class="btn-gray" tabindex="default" v-if="viewModel.middle_worktype == ''">대공종 확정 후 활성화</span>
                                            <span class="btn-gray on middle_tag" :tabindex="item.middl_worktype_sn" :parent="item.lrge_worktype_sn" v-for="(item,i) in viewModel.middle_worktype" :key="i" v-else>{{item.middl_worktype}}
                                                <button class="fx fx-ac" @click="deleteMiddleTag(i)"><svg class="icon">
                                                        <use xlink:href="../../img/symbol-defs.svg#icon-delete"></use>
                                                    </svg></button>
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <div class="table_footer btn-right">
                            <a @click="fnReload()" class="btn btn-gray"><svg class="icon">
                                    <use xlink:href="../../img/symbol-defs.svg#icon-refresh"></use>
                                </svg>초기화</a>
                            <button class="btn btn-purple" @click="fnSelectBtn()"><svg class="icon">
                                    <use xlink:href="../../img/symbol-defs.svg#icon-task-add"></use>
                                </svg>공종저장</button>
                        </div>
                    </div>
                    <div class="overflow-y h500">
                        <table class="table write narrow" id="tbl">
                            <colgroup>
                                <col width="5%">
                                <col width="5%">
                                <col width="5%">
                                <col width="5%">
                                <col width="*">
                                <col width="*">
                                <col width="*">
                                <col width="*">
                                <col width="*">
                                <col width="3%">
                                <col width="*">
                                <col width="3%">
                                <col width="3%">
                                <col width="3%">
                            </colgroup>
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
                                    <!-- <th scope="col" rowspan="2">S_PCM 결과 Up-Date된 날짜</th> -->
                                    <th scope="col" rowspan="2">제외항목</th>
                                </tr>
                                <tr>
                                    <th scope="col">기인물</th>
                                    <th scope="col">재해유형</th>
                                    <th scope="col">사고개요</th>
                                    <th scope="col">사고원인</th>
                                </tr>
                            </thead>
                            <tbody>

                            </tbody>
                        </table>
                    </div>
                    <div class="btn-group btn-right">
                        <button class="btn btn-purple" @click="fnPrevInfo();" v-if="viewModel.evl_sn == null || viewModel.evl_sn == ''"><svg class="icon">
                                <use xlink:href="../../img/symbol-defs.svg#icon-manage-search"></use>
                            </svg>이전버전 정보 가져오기</button>
                        <button @click="fnAddPopup" class="btn btn-purple"><svg class="icon">
                                <use xlink:href="../../img/symbol-defs.svg#icon-wrap-text"></use>
                            </svg>추가</button>
                        <button class="btn btn-white router-link-active" @click="fnViewList()"><svg class="icon">
                                <use xlink:href="../../img/symbol-defs.svg#icon-list-back"></use>
                            </svg>목록</button>
                        <button @click="fnSave" class="btn btn-purple"><svg class="icon">
                                <use xlink:href="../../img/symbol-defs.svg#icon-save"></use>
                            </svg>저장</button>
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
        </div>
        <addPopup ref="addPopup" v-if="addPopup==true" :pass="{bplc_sn : viewModel.bplc_sn}"></addPopup>
        <user ref="aprvr" v-if="aprvrPop==true" :pass="{dept_sn: viewModel.userInfo.dept_sn, team_sn: viewModel.userInfo.team_sn, title:'결재자', bplc_yn:'Y', bplc_sn: viewModel.bplc_sn, ocpt_detail_cd : 1}"></user>
    </div>
</template>
    
<script>
    import "es6-promise/auto";
    import Vue from "vue";
    import Axios from "axios";
    import addPopup from "./popup/fstRskEvltRgstrAddPopup.vue"
    import user from "../../popup/user_popup.vue";
    
    export default {
        components: {
            "addPopup": addPopup,
            'user': user,
        },
        data: function () {
            return {
                mode: "write",
                addPopup: false,
                aprvrPop: false,
                imgsrc: '',
                AprvrGbn: '',
                viewModel: {
                    bizgroup_sn: "",
                    bizgroup_nm: "",
                    bplc_sn: "",
                    bplc_nm: "",
                    evl_sn: "",
                    bplcList: [],
                    userInfo: {},
                    // 사업군
                    bizGroup: [],
                    // 대공종
                    lrge_worktype: [],
                    middle_worktype: [],
                    success_list: [],
                    save_list: [],
                    data: {
                        wrtr: '',
                        max_lrge_worktype_sn: '',
                        max_detail_jobcn_sn: '',
                        wrtr_nm: '',
                        mdtr: '',
                        mdtr_nm: '',
                        dcsnr: '',
                        dcsnr_nm: '',
                        mdtr_sign: '',
                        wrtr_sign: '',
                        dcsnr_sign: '',
                        evl_sn: '',
                    },
                },
                isSaved:false
            };
        },
        mounted: function () {
            let vm = this;
            vm.fnInit();
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
        methods: {
            fnInit: function () {
                let vm = this;
                vm.viewModel.userInfo = vm.$store.state.global.userInfo;
                vm.viewModel.bplc_sn = vm.$route.params.bplc_sn;
                vm.viewModel.evl_sn = vm.$route.params.evl_sn;
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
                let data = {};
                // 사업군 리스트
                Axios.post("/selectFstRskBizGroupList.do", data).then(function (res) {
                    vm.viewModel.bizGroup = res.data.list;
                });
                if (vm.viewModel.bplc_sn != "") {
                    data = {
                        bplc_sn: vm.viewModel.bplc_sn,
                        evl_sn: vm.viewModel.evl_sn,
                    };
                    $(".loading").show();
                    Axios.post("/selectBplcFstRskEvltList.do", data).then(function (res) {
                        vm.viewModel.success_list = res.data.list;
                        if (vm.viewModel.success_list.length > 0) {
                            vm.viewModel.data.wrtr = res.data.sign.wrtr;
                            vm.viewModel.data.wrtr_nm = res.data.sign.user_nm;
                            vm.viewModel.data.wrtr_sign = res.data.sign.sign_img.charAt() == '/' ? res.data.sign.sign_img : res.data.sign.sign_img.substr(2);
                            if (res.data.sign.mdtr != null) {
                                vm.viewModel.data.mdtr = res.data.sign.mdtr;
                                vm.viewModel.data.mdtr_nm = res.data.sign.mdtr_nm;
                                vm.viewModel.data.mdtr_sign_yn = res.data.sign.mdtr_sign_yn;
                                if (res.data.sign.mdtr_sign_img != null) vm.viewModel.data.mdtr_sign = res.data.sign.dcsn_sign_img.charAt() == '/' ? res.data.sign.dcsn_sign_img : res.data.sign.dcsn_sign_img.substr(2);
                            }
                            if (res.data.sign.dcsn != null) {
                                vm.viewModel.data.dcsnr = res.data.sign.dcsn
                                vm.viewModel.data.dcsnr_nm = res.data.sign.dcsn_nm
                                vm.viewModel.data.dcsnr_sign_yn = res.data.sign.dcsn_sign_yn
                                if (res.data.sign.dcsn_sign_img != null) vm.viewModel.data.dcsnr_sign = res.data.sign.dcsn_sign_img.charAt() == '/' ? res.data.sign.dcsn_sign_img : res.data.sign.dcsn_sign_img.substr(2);
                            }
    
                            vm.viewModel.bizgroup_sn = vm.viewModel.success_list[0].bizgroup_sn;
                            vm.viewModel.bizgroup_nm = vm.viewModel.success_list[0].bizgroup;
                            var target = {
                                target: {
                                    value: vm.viewModel.bizgroup_sn
                                }
                            };
                            vm.fnBizChange(target);
    
                            var html = "";
                            vm.viewModel.success_list.forEach(function (item, index) {
                                html += '<tr biz="' + item.bizgroup_sn + '" lrge="' + item.lrge_worktype_sn + '" middl="' + item.middl_worktype_sn + '" small="' + item.small_worktype_sn + '" detail="' + item.detail_jobcn_sn + '" risk="' + item.risk_factor_sn + '" newYn="' + item.new_yn + '" aprvYn="' + item.aprv_yn + '">';
                                html += '    <td><textarea>' + item.lrge_worktype + '</textarea></td>';
                                html += '    <td><textarea>' + item.middl_worktype + '</textarea></td>';
                                html += '    <td><textarea>' + item.small_worktype + '</textarea></td>';
                                html += '    <td><textarea>' + item.detail_jobcn + '</textarea></td>';
                                html += '    <td><textarea rows="5">' + item.risk_factor + '</textarea></td>';
                                html += '    <td><textarea rows="5">' + item.acdnt_case_orgcause_material + '</textarea></td>';
                                html += '    <td><textarea rows="5">' + item.acdnt_case_dsstr_stle + '</textarea></td>';
                                html += '    <td><textarea rows="5">' + item.acdnt_case_sumry + '</textarea></td>';
                                html += '    <td><textarea rows="5">' + item.acdnt_case_cause + '</textarea></td>';
                                html += '    <td>';
                                if (item.risk_grd == "상") {
                                    html += '        <select>';
                                    html += '            <option value="상" selected>상</option>';
                                    html += '            <option value="중">중</option>';
                                    html += '            <option value="하">하</option>';
                                    html += '        </select>';
                                } else if (item.risk_grd == "중") {
                                    html += '        <select>';
                                    html += '            <option value="상">상</option>';
                                    html += '            <option value="중" selected>중</option>';
                                    html += '            <option value="하">하</option>';
                                    html += '        </select>';
                                } else {
                                    html += '        <select>';
                                    html += '            <option value="상">상</option>';
                                    html += '            <option value="중">중</option>';
                                    html += '            <option value="하" selected>하</option>';
                                    html += '        </select>';
                                }
                                html += '    </td>';
                                html += '    <td><textarea rows="5">' + item.cntrpln + '</textarea></td>';
                                html += '    <td>';
                                if (item.lgz_hrisk_job_yn == 'Y') {
                                    html += '        <input type="checkbox" checked />';
                                } else {
                                    html += '        <input type="checkbox"/>';
                                }
                                html += '    </td>';
                                html += '    <td>';
                                if (item.cant_yn == 'Y') {
                                    html += '        <input type="checkbox" checked />';
                                } else {
                                    html += '        <input type="checkbox"/>';
                                }
                                html += '    </td>';
                                html += '    <td><input class="del" type="checkbox"/></td>';
                                html += '</tr>';
                            })
    
                            $("#tbl tbody").html(html);
                        } else {
                            //작성자 결재정보 추가
                            vm.viewModel.data.wrtr = vm.viewModel.userInfo.user_id;
                            vm.viewModel.data.wrtr_nm = vm.viewModel.userInfo.user_name;
                            vm.viewModel.data.wrtr_sign = vm.viewModel.userInfo.aprvr_path.charAt() == '/' ? vm.viewModel.userInfo.aprvr_path : vm.viewModel.userInfo.aprvr_path.substr(2);
    
                            Axios.post("/selectMtgUserList.do", data).then(function (res) {
                                if (res.data.resultMap != null) {
                                    vm.viewModel.data.dcsnr = res.data.resultMap.dcsnr
                                    vm.viewModel.data.dcsnr_nm = res.data.resultMap.dcsnr_nm
                                    vm.viewModel.data.dcsnr_sign = res.data.resultMap.dcsnr_sign.charAt() == '/' ? res.data.resultMap.dcsnr_sign : res.data.resultMap.dcsnr_sign.substr(2);
                                }
                            })
    
                            $(".loading").hide();
                        }
                    }).then(function () {
                        $('#tbl').rowspan(0);
                        $('#tbl').rowspan(1);
                        $('#tbl').rowspan(2);
                        $('#tbl').rowspan(3);
                        $(".loading").hide();
                    });
                }
                // vm.fnTableData();
    
            },
            // 사업군 선택 시 대공종 불러오기
            fnBizChange: function (event) {
                let vm = this;
    
                let data = {
                    bizgroup_sn: event.target.value,
                }
    
                Axios.post("/selectFstRskLrgeWorkTypeList.do", data).then(function (res) {
                    vm.viewModel.lrge_worktype = res.data.list;
                    vm.viewModel.middle_worktype = [];
                });
    
            },
            // 대공종 태그 삭제
            deleteLrgTag: function (key) {
                this.viewModel.lrge_worktype.splice(key, 1);
            },
            // 선택된 대공종에 맞는 중공종 SELECT
            fnLrgSelect: function () {
                let vm = this;
                var arr = [];
    
                for (var i = 0; i < $("span.lrg_tag").length; i++) {
                    arr.push($("span.lrg_tag:eq(" + i + ")").attr("tabindex"));
                }
    
                let data = {
                    bizgroup_sn: $("#bizSel").val(),
                    lrge_worktype_sn: arr,
                }
    
                Axios.post("/selectFstRskMiddleWorkTypeList.do", data).then(function (res) {
                    vm.viewModel.middle_worktype = res.data.list;
                });
            },
            // 중공종 태그 삭제
            deleteMiddleTag: function (key) {
                if ($(".middl_tag span[parent=" + this.viewModel.middle_worktype[key].lrge_worktype_sn + "]").length == 1) {
                    $(".lrg_tag span[tabindex=" + this.viewModel.middle_worktype[key].lrge_worktype_sn + "]").remove();
                }
                this.viewModel.middle_worktype.splice(key, 1);
            },
            // 공종선택완료
            fnSuccess: function () {
                let vm = this;
                var pArr = new Array();
                var list = new Array();
    
                for (var i = 0; i < $("span.lrg_tag").length; i++) {
                    pArr.push($("span.lrg_tag:eq(" + i + ")").attr("tabindex"));
                }
    
                pArr.forEach(function (item, i) {
                    var dt = new Object();
                    dt.lrge_worktype_sn = item;
                    var mSize = $("span.middle_tag[parent='" + item + "']").length;
                    var mArr = new Array();
                    for (var i = 0; i < mSize; i++) {
                        mArr.push($("span.middle_tag[parent='" + item + "']:eq(" + i + ")").attr("tabindex"));
                    }
                    dt.middle_worktype_sn = mArr;
                    list.push(dt);
                });
    
                let data = {
                    bizgroup_sn: $("#bizSel").val(),
                    worktype: list,
                }
                if ($("div.middl_tag span:eq(0)").attr("tabindex") != "default") {
                    $(".loading").show();
                    Axios.post("/selectFstRskSuccessList.do", data).then(function (res) {
                        vm.viewModel.success_list = res.data.list;
                        var html = "";
                        vm.viewModel.success_list.forEach(function (item, index) {
                            html += '<tr biz="' + item.bizgroup_sn + '" lrge="' + item.lrge_worktype_sn + '" middl="' + item.middl_worktype_sn + '" small="' + item.small_worktype_sn + '" detail="' + item.detail_jobcn_sn + '" risk="' + item.risk_factor_sn + '">';
                            html += '    <td><textarea>' + item.lrge_worktype + '</textarea></td>';
                            html += '    <td><textarea>' + item.middl_worktype + '</textarea></td>';
                            html += '    <td><textarea>' + item.small_worktype + '</textarea></td>';
                            html += '    <td><textarea>' + item.detail_jobcn + '</textarea></td>';
                            html += '    <td><textarea rows="5">' + item.risk_factor + '</textarea></td>';
                            html += '    <td><textarea rows="5">' + item.acdnt_case_orgcause_material + '</textarea></td>';
                            html += '    <td><textarea rows="5">' + item.acdnt_case_dsstr_stle + '</textarea></td>';
                            html += '    <td><textarea rows="5">' + item.acdnt_case_sumry + '</textarea></td>';
                            html += '    <td><textarea rows="5">' + item.acdnt_case_cause + '</textarea></td>';
                            html += '    <td>';
                            if (item.risk_grd == "상") {
                                html += '        <select>';
                                html += '            <option value="상" selected>상</option>';
                                html += '            <option value="중">중</option>';
                                html += '            <option value="하">하</option>';
                                html += '        </select>';
                            } else if (item.risk_grd == "중") {
                                html += '        <select>';
                                html += '            <option value="상">상</option>';
                                html += '            <option value="중" selected>중</option>';
                                html += '            <option value="하">하</option>';
                                html += '        </select>';
                            } else {
                                html += '        <select>';
                                html += '            <option value="상">상</option>';
                                html += '            <option value="중">중</option>';
                                html += '            <option value="하" selected>하</option>';
                                html += '        </select>';
                            }
                            html += '    </td>';
                            html += '    <td><textarea rows="5">' + item.cntrpln + '</textarea></td>';
                            html += '    <td>';
                            if (item.lgz_hrisk_job_yn == 'Y') {
                                html += '        <input type="checkbox" checked />';
                            } else {
                                html += '        <input type="checkbox"/>';
                            }
                            html += '    </td>';
                            html += '    <td>';
                            if (item.cant_yn == 'Y') {
                                html += '        <input type="checkbox" checked />';
                            } else {
                                html += '        <input type="checkbox"/>';
                            }
                            html += '    </td>';
                            html += '    <td><input class="del" type="checkbox"/></td>';
                            html += '</tr>';
                        })
    
                        $("#tbl tbody").html(html);
                    }).then(function () {
                        $('#tbl').rowspan(0);
                        $('#tbl').rowspan(1);
                        $('#tbl').rowspan(2);
                        $('#tbl').rowspan(3);
                        $(".loading").hide();
                    });
                } else {
                    alert("모든공종 선택 후 저장할 수 있습니다.")
                }
            },
            fnTableData: function (table) {
                let vm = this;
                var data = [];
                var tr = $('input.del:checkbox:not(:checked)').parent().parent();
                var headers = ["lrge_worktype", "middl_worktype", "small_worktype", "detail_jobcn",
                    "risk_factor", "acdnt_case_orgcause_material", "acdnt_case_dsstr_stle", "acdnt_case_sumry",
                    "acdnt_case_cause", "risk_grd", "cntrpln", "lgz_hrisk_job_yn", "cant_yn"
                ];
                for (var i = 0; i < tr.length; i++) {
                    var tableRow = tr[i];
                    var rowData = {};
                    for (var j = 0; j < tableRow.cells.length - 1; j++) {
                        if ($(tableRow).attr("newYn") != undefined && $(tableRow).attr("newYn") != null) {
                            rowData["newYn"] = $(tableRow).attr("newYn");
                        } else {
                            rowData["newYn"] = 'N';
                        };
                        if ($(tableRow).attr("aprvYn") != undefined && $(tableRow).attr("aprvYn") != null) {
                            rowData["aprvYn"] = $(tableRow).attr("aprvYn");
                        } else {
                            rowData["aprvYn"] = 'D';
                        };
                        rowData["bplc_sn"] = vm.viewModel.bplc_sn;
                        rowData["bizgroup_sn"] = $(tableRow).attr("biz");
                        rowData["lrge_worktype_sn"] = $(tableRow).attr("lrge");
                        rowData["middl_worktype_sn"] = $(tableRow).attr("middl");
                        rowData["small_worktype_sn"] = $(tableRow).attr("small");
                        rowData["detail_jobcn_sn"] = $(tableRow).attr("detail");
                        rowData["risk_factor_sn"] = $(tableRow).attr("risk");
                        if (headers[j] == "acdnt_case_orgcause_material" || headers[j] == "acdnt_case_dsstr_stle" ||
                            headers[j] == "acdnt_case_sumry" || headers[j] == "acdnt_case_cause" ||
                            headers[j] == "risk_grd" || headers[j] == "cntrpln" || headers[j] == "risk_factor" ||
                            headers[j] == "lrge_worktype" || headers[j] == "middl_worktype" || headers[j] == "small_worktype" || headers[j] == "detail_jobcn") {
                            if (i != 0 && headers[j] == "lrge_worktype" && $(tr[i]).attr("lrge") == $(tr[i - 1]).attr("lrge")) {
                                rowData[headers[j]] = $(tr[i - 1].cells[j]).children().val();
                                $(tr[i].cells[j]).children().val($(tr[i - 1].cells[j]).children().val());
                            } else if (i != 0 && headers[j] == "middl_worktype" && $(tr[i]).attr("lrge") == $(tr[i - 1]).attr("lrge") && $(tr[i]).attr("middl") == $(tr[i - 1]).attr("middl")) {
                                rowData[headers[j]] = $(tr[i - 1].cells[j]).children().val();
                                $(tr[i].cells[j]).children().val($(tr[i - 1].cells[j]).children().val());
                            } else if (i != 0 && headers[j] == "small_worktype" && $(tr[i]).attr("lrge") == $(tr[i - 1]).attr("lrge") && $(tr[i]).attr("middl") == $(tr[i - 1]).attr("middl") && $(tr[i]).attr("small") == $(tr[i - 1]).attr("small")) {
                                rowData[headers[j]] = $(tr[i - 1].cells[j]).children().val();
                                $(tr[i].cells[j]).children().val($(tr[i - 1].cells[j]).children().val());
                            } else if (i != 0 && headers[j] == "detail_jobcn" && $(tr[i]).attr("lrge") == $(tr[i - 1]).attr("lrge") && $(tr[i]).attr("middl") == $(tr[i - 1]).attr("middl") && $(tr[i]).attr("small") == $(tr[i - 1]).attr("small") && $(tr[i]).attr("detail") == $(tr[i - 1]).attr("detail")) {
                                rowData[headers[j]] = $(tr[i - 1].cells[j]).children().val();
                                $(tr[i].cells[j]).children().val($(tr[i - 1].cells[j]).children().val());
                            } else {
                                rowData[headers[j]] = $(tableRow.cells[j]).children().val();
                            }
                        } else if (headers[j] == "lgz_hrisk_job_yn" || headers[j] == "cant_yn") {
                            if ($(tableRow.cells[j]).children().prop("checked")) {
                                rowData[headers[j]] = "Y";
                            } else {
                                rowData[headers[j]] = "N";
                            }
                        } else {
                            rowData[headers[j]] = tableRow.cells[j].innerHTML;
                        }
                    }
                    data.push(rowData);
    
                }
                return data;
            },
            fnSave: function () {
                var vm = this;
                var dt = vm.fnTableData();
                if(vm.viewModel.data.dcsnr == "" || vm.viewModel.data.dcsnr == null) return alert("결정자는 필수 지정하여야합니다.");
                var data = {
                    list: dt,
                    bplc_sn: vm.viewModel.bplc_sn,
                    evl_sn: vm.viewModel.evl_sn,
                    bizgroup_sn: dt[0].bizgroup_sn,
                    wrtr: vm.viewModel.data.wrtr,
                    wrtr_nm: vm.viewModel.data.wrtr_nm,
                    mdtr: vm.viewModel.data.mdtr,
                    mdtr_nm: vm.viewModel.data.mdtr_nm,
                    dcsn: vm.viewModel.data.dcsnr,
                    dcsn_nm: vm.viewModel.data.dcsnr_nm,
                    user_id: vm.viewModel.userInfo.user_id,
                }
                if(confirm("등록 하시겠습니까?")){
                    Axios.post("/insertFstRskSave.do", data).then(function (res) {
                        if (res.data.result == 0) {
                            alert("예기치 못한 오류 발생 !!")
                        } else {
                            vm.isSaved = true;
                            alert("정상등록되었습니다.");
                            if(vm.viewModel.data.mdtr == "" || vm.viewModel.data.mdtr == null){
                                $.ajax({
                                    type: "post",
                                    url: "/api/pushSendPerson.do",
                                    data: {
                                        // 제목 및 내용
                                        title: "최초위험성평가",
                                        message: "새로 등록된 결재항목이 있습니다. PC에서 확인바랍니다.",
                                        user_id: vm.viewModel.data.dcsnr,
                                        // 클릭 시 이동 화면주소
                                        link: "/main/index.do"
                                    }
                                });
                            }else{
                                $.ajax({
                                    type: "post",
                                    url: "/api/pushSendPerson.do",
                                    data: {
                                        // 제목 및 내용
                                        title: "최초위험성평가",
                                        message: "새로 등록된 결재항목이 있습니다. PC에서 확인바랍니다.",
                                        user_id: vm.viewModel.data.mdtr,
                                        // 클릭 시 이동 화면주소
                                        link: "/main/index.do"
                                    }
                                });
                            }
                            vm.$router.push({ path: '/' });
                        }
                    }).catch(function (ex){
                        alert("예기치 못한 오류 발생 !!");
                    })
                }
            },
            fnAddPopup: function (i) {
                let vm = this;
                if(vm.viewModel.bizgroup_sn == "") return alert("사업군 선택 후 추가해주세요.");
                vm.popIndex = i;
                vm.aprvrPop = false;
                vm.addPopup = true;
    
                vm.$nextTick(function () {
                    if (vm.addPopup) {
                        vm.$refs.addPopup.fnInit(vm.viewModel.bizgroup_sn, vm.viewModel.bizgroup_nm);
                    }
                })
            },
            fnAprvrpopup: function (gbn) {
                let vm = this;
    
                vm.AprvrGbn = gbn; //어느 결재자 정보인지 담아두기.
    
                vm.addPopup = false;
                if (vm.viewModel.bplc_sn == '' || vm.viewModel.bplc_sn == undefined) {
                    alert("현장명을 선택해주세요.");
                    return false;
                } else if (gbn == 'mdtr' && vm.viewModel.data.mdtr_sign_yn == 'Y') {
                    alert("조정자는 이미 결재를 진행하여 변경할 수 없습니다.");
                } else if (gbn == 'dcsnr' && vm.viewModel.data.dcsnr_sign_yn == 'Y') {
                    alert("결정자가 이미 결재를 진행하여 변경할 수 없습니다.");
                } else {
                    vm.aprvrPop = true;
                    vm.$nextTick(function () {
                        if (vm.aprvrPop) {
                            vm.$refs.aprvr.fnInit();
                        }
                    });
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
    
                //결재담당자 팝업 초기화
                vm.aprvrPop = false;
                vm.mesuPop = false;
            },
            fnAddRow: function () {
                let vm = this;
                var html = "";
                var yn = "N";
                vm.viewModel.success_list.forEach(function (item, index) {
                    if (item.new_yn == "Y") {
                        yn = "Y";
                    } else if(item.new_yn == "D"){
                        yn = "D";
                    }else{
                        yn = "N";
                    }
                    if (item.aprv_yn == null || item.aprv_yn == undefined) {
                        item.aprv_yn = "D";
                    }
                    html += '<tr biz="' + item.bizgroup_sn + '" lrge="' + item.lrge_worktype_sn + '" middl="' + item.middl_worktype_sn + '" small="' + item.small_worktype_sn + '" detail="' + item.detail_jobcn_sn + '" risk="' + item.risk_factor_sn + '" newYn="' + yn + '" aprv_yn="' + item.aprv_yn + '">';
                    html += '    <td><textarea>' + item.lrge_worktype + '</textarea></td>';
                    html += '    <td><textarea>' + item.middl_worktype + '</textarea></td>';
                    html += '    <td><textarea>' + item.small_worktype + '</textarea></td>';
                    html += '    <td><textarea>' + item.detail_jobcn + '</textarea></td>';
                    html += '    <td><textarea>' + item.risk_factor + '</textarea></td>';
                    html += '    <td><textarea>' + item.acdnt_case_orgcause_material + '</textarea></td>';
                    html += '    <td><textarea>' + item.acdnt_case_dsstr_stle + '</textarea></td>';
                    html += '    <td><textarea>' + item.acdnt_case_sumry + '</textarea></td>';
                    html += '    <td><textarea>' + item.acdnt_case_cause + '</textarea></td>';
                    html += '    <td>';
                    if (item.risk_grd == "상") {
                        html += '        <select>';
                        html += '            <option value="상" selected>상</option>';
                        html += '            <option value="중">중</option>';
                        html += '            <option value="하">하</option>';
                        html += '        </select>';
                    } else if (item.risk_grd == "중") {
                        html += '        <select>';
                        html += '            <option value="상">상</option>';
                        html += '            <option value="중" selected>중</option>';
                        html += '            <option value="하">하</option>';
                        html += '        </select>';
                    } else {
                        html += '        <select>';
                        html += '            <option value="상">상</option>';
                        html += '            <option value="중">중</option>';
                        html += '            <option value="하" selected>하</option>';
                        html += '        </select>';
                    }
                    html += '    </td>';
                    html += '    <td><textarea>' + item.cntrpln + '</textarea></td>';
                    html += '    <td>';
                    if (item.lgz_hrisk_job_yn == 'Y') {
                        html += '        <input type="checkbox" checked />';
                    } else {
                        html += '        <input type="checkbox"/>';
                    }
                    html += '    </td>';
                    html += '    <td>';
                    if (item.cant_yn == 'Y') {
                        html += '        <input type="checkbox" checked />';
                    } else {
                        html += '        <input type="checkbox"/>';
                    }
                    html += '    </td>';
                    html += '    <td><input class="del" type="checkbox"/></td>';
                    html += '</tr>';
                })
    
                $("#tbl tbody").html(html);
    
                $('#tbl').rowspan(0);
                $('#tbl').rowspan(1);
                $('#tbl').rowspan(2);
                $('#tbl').rowspan(3);
            },
            fnPrevInfo: function () {
                if(confirm("이전버전정보 가져오기를 실행하시면 기존에 작업하던 위험성평가가 초기화됩니다. 정말 실행하시겠습니까?")){
                let vm = this;
    
                let data = {
                    bplc_sn: vm.viewModel.bplc_sn,
                }
                $(".loading").show();
                Axios.post("/selectFstrskEvlPrevInfo.do", data)
                    .then(function (response) {
                        if (response.data.list.length > 0) {
                            vm.viewModel.success_list = response.data.list;
                            var html = "";
                            vm.viewModel.bizgroup_sn = vm.viewModel.success_list[0].bizgroup_sn;
                            vm.viewModel.bizgroup_nm = vm.viewModel.success_list[0].bizgroup;
                            var target = {
                                target: {
                                    value: vm.viewModel.bizgroup_sn
                                }
                            };
                            vm.fnBizChange(target);
    
                            vm.viewModel.success_list.forEach(function (item, index) {
                                html += '<tr biz="' + item.bizgroup_sn + '" lrge="' + item.lrge_worktype_sn + '" middl="' + item.middl_worktype_sn + '" small="' + item.small_worktype_sn + '" detail="' + item.detail_jobcn_sn + '" risk="' + item.risk_factor_sn + '">';
                                html += '    <td><textarea>' + item.lrge_worktype + '</textarea></td>';
                                html += '    <td><textarea>' + item.middl_worktype + '</textarea></td>';
                                html += '    <td><textarea>' + item.small_worktype + '</textarea></td>';
                                html += '    <td><textarea>' + item.detail_jobcn + '</textarea></td>';
                                html += '    <td><textarea>' + item.risk_factor + '</textarea></td>';
                                html += '    <td><textarea>' + item.acdnt_case_orgcause_material + '</textarea></td>';
                                html += '    <td><textarea>' + item.acdnt_case_dsstr_stle + '</textarea></td>';
                                html += '    <td><textarea>' + item.acdnt_case_sumry + '</textarea></td>';
                                html += '    <td><textarea>' + item.acdnt_case_cause + '</textarea></td>';
                                html += '    <td>';
                                if (item.risk_grd == "상") {
                                    html += '        <select>';
                                    html += '            <option value="상" selected>상</option>';
                                    html += '            <option value="중">중</option>';
                                    html += '            <option value="하">하</option>';
                                    html += '        </select>';
                                } else if (item.risk_grd == "중") {
                                    html += '        <select>';
                                    html += '            <option value="상">상</option>';
                                    html += '            <option value="중" selected>중</option>';
                                    html += '            <option value="하">하</option>';
                                    html += '        </select>';
                                } else {
                                    html += '        <select>';
                                    html += '            <option value="상">상</option>';
                                    html += '            <option value="중">중</option>';
                                    html += '            <option value="하" selected>하</option>';
                                    html += '        </select>';
                                }
                                html += '    </td>';
                                html += '    <td><textarea>' + item.cntrpln + '</textarea></td>';
                                html += '    <td>';
                                if (item.lgz_hrisk_job_yn == 'Y') {
                                    html += '        <input type="checkbox" checked />';
                                } else {
                                    html += '        <input type="checkbox"/>';
                                }
                                html += '    </td>';
                                html += '    <td>';
                                if (item.cant_yn == 'Y') {
                                    html += '        <input type="checkbox" checked />';
                                } else {
                                    html += '        <input type="checkbox"/>';
                                }
                                html += '    </td>';
                                html += '    <td><input class="del" type="checkbox"/></td>';
                                html += '</tr>';
                            })
    
                            $("#tbl tbody").html(html);
                        } else {
                            alert("일치하는 이전회차정보가 없습니다.");
                        }
    
                    }).then(function () {
                        $('#tbl').rowspan(0);
                        $('#tbl').rowspan(1);
                        $('#tbl').rowspan(2);
                        $('#tbl').rowspan(3);
                        $(".loading").hide();
                    });
                }
            },
            fnReload: function () {
                if (confirm("정말 초기화하시겠습니까?")) {
                    window.location.reload();
                }
            },
            fnSelectBtn: function () {
                if (confirm("선택하신 공종으로 리스트를 생성하시겠습니까?")) {
                    this.fnSuccess();
                }
            },
            fnViewList : function(){
                let vm = this;
                vm.$router.push({ path: '/' });
                // if(confirm("저장하지 않고 목록으로 돌아가시겠습니까?")){
                //     vm.$router.push({ path: '/' });
                // }
            }
        }
    };
</script>
    