<template>
<modal :pass="{popupTitle: '최초위험성평가 추가'}">
    <template v-slot:contents>
        <div>
            <h3>위험성평가 추가</h3>
            <table class="table horizontal write">
                <caption>위험성평가 추가</caption>
                <tbody>
                    <tr>
                        <th>구분</th>
                        <td colspan="3">
                            <select v-model="viewModel.addGbn" @change="fnBizChange(viewModel.data.bizgroup_sn)">
                                <option value="old">기존공종에 추가</option>
                                <option value="new">신규 추가</option>
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row" class="w100">대공종</th>
                        <td colspan="3">
                            <input type="text" v-model="viewModel.lrge_nm" v-if="viewModel.addGbn == 'new'">
                            <select id="lrgeSel" v-model="viewModel.lrge" @change="fnSelectWorkType('lrge')" v-else-if="viewModel.addGbn == 'old'">
                                <option value="0" disabled selected>선택하기</option>
                                <option v-for="(item,i) in viewModel.lrge_list" :key="i" :value="item.lrge_worktype_sn">{{item.lrge_worktype}}</option>
                            </select>
                            <input type="text" value="구분 선택 후 활성화됩니다." readonly v-else>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row" class="w100">중공종</th>
                        <td colspan="3">
                            <input type="text" v-model="viewModel.middl_nm" v-if="viewModel.addGbn == 'new'">
                            <select id="middlSel" v-model="viewModel.middl" @change="fnSelectWorkType('middl')" v-else-if="viewModel.addGbn == 'old' && viewModel.lrge != 0">
                                <option value="0" disabled selected>선택하기</option>
                                <option v-for="(item,i) in viewModel.middl_list" :key="i" :value="item.middl_worktype_sn">{{item.middl_worktype}}</option>
                            </select>
                            <input type="text" value="대공종 선택 후 활성화됩니다." readonly v-else>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row" class="w100">소공종</th>
                        <td colspan="3">
                            <input type="text" v-model="viewModel.small_nm" v-if="viewModel.addGbn == 'new'">
                            <select id="smallSel" v-model="viewModel.small" v-else-if="viewModel.addGbn == 'old' && viewModel.middl != 0">
                                <option value="0" disabled selected>선택하기</option>
                                <option v-for="(item,i) in viewModel.small_list" :key="i" :value="item.small_worktype_sn">{{item.small_worktype}}</option>
                            </select>
                            <input type="text" value="중공종 선택 후 활성화됩니다." readonly v-else>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row" class="w100">세부작업내용</th>
                        <td colspan="3">
                            <textarea v-model="viewModel.data.detail_jobcn"></textarea>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row" class="w100">위험요소</th>
                        <td colspan="3">
                            <textarea v-model="viewModel.data.risk_factor"></textarea>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row" class="w100">기인물</th>
                        <td colspan="3">
                            <textarea v-model="viewModel.data.acdnt_case_orgcause_material"></textarea>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row" class="w100">재해유형</th>
                        <td colspan="3">
                            <textarea v-model="viewModel.data.acdnt_case_dsstr_stle"></textarea>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row" class="w100">사고개요</th>
                        <td colspan="3">
                            <textarea v-model="viewModel.data.acdnt_case_sumry"></textarea>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row" class="w100">사고원인</th>
                        <td colspan="3">
                            <textarea v-model="viewModel.data.acdnt_case_cause"></textarea>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row" class="w100">대책</th>
                        <td colspan="3">
                            <textarea v-model="viewModel.data.cntrpln"></textarea>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row" class="w100" rowspan="2">Check</th>
                        <th scope="row" class="w100">위험성</th>
                        <th scope="row" class="w100">대형(고)위험작업</th>
                        <th scope="row" class="w100">할수없는것</th>
                    </tr>
                    <tr>
                        <td>
                            <select v-model="viewModel.data.risk_grd">
                                <option value="상" selected>상</option>
                                <option value="중">중</option>
                                <option value="하">하</option>
                            </select>
                        </td>
                        <td><input id="lgz_hrisk_job_yn" type="checkbox" /></td>
                        <td><input id="cant_yn" type="checkbox" /></td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="btn-group btn-right">
            <button @click="fnInsert" class="btn btn-purple"><svg class="icon">
                    <use xlink:href="../../img/symbol-defs.svg#icon-save"></use>
                </svg>등록</button>
        </div>
    </template>
</modal>
</template>

<script>
import "es6-promise/auto";
import Vue from "vue";
import Modal from '../../../popup/modal.vue'
import Axios from "axios";

export default {
    components: {
        Modal,
    },
    data: function () {
        return {
            viewModel: {
                addGbn: 'new',
                bizgroup: '',
                success_list: [],
                lrge_list: [],
                middl_list: [],
                small_list: [],
                lrge: 0,
                middl: 0,
                small: 0,
                lrge_nm: '',
                middl_nm: '',
                small_nm: '',
                mtgUserList: [],
                userInfo: {},
                mngUserList: [],
                bplc_sn: '',
                data: {
                    bizgroup_sn: '',
                    bizgroup: '',
                    lrge_worktype_sn: '',
                    lrge_worktype: '',
                    middl_worktype_sn: '',
                    middl_worktype: '',
                    detail_jobcn_sn: '',
                    risk_factor_sn: '',
                    risk_factor: '',
                    job_pstn: '',
                    job_mchn: '',
                    temp_fclts: '',
                    acdnt_case_orgcause_material: '',
                    acdnt_case_dsstr_stle: '',
                    acdnt_case_sumry: '',
                    acdnt_case_cause: '',
                    risk_grd: '상',
                    cntrpln: '',
                    lgz_hrisk_job_yn: '',
                    cant_yn: '',
                    s_pcm_rst: '',
                    small_worktype: '',
                    small_worktype_sn: '',
                    detail_jobcn: '',
                    new_yn: '',
                }
            }
        };
    },
    mounted: function () {
        let vm = this;
        //vm.fnInit();
    },
    methods: {
        fnInit: function (bizsn, biznm) {
            let vm = this;
            vm.viewModel.userInfo = vm.$store.state.global.userInfo;
            vm.viewModel.data.bizgroup = biznm;
            vm.viewModel.data.bizgroup_sn = bizsn;
            $(".modal_wrap").show();
        },
        fnBizChange: function (biz_sn) {
            let vm = this;
            if (vm.viewModel.addGbn == "old") {
                let data = {
                    bizgroup_sn: biz_sn,
                }

                Axios.post("/selectFstRskLrgeWorkTypeList.do", data).then(function (res) {
                    vm.viewModel.lrge_list = res.data.list;
                });
            }

        },
        fnSelectWorkType: function (gbn) {
            let vm = this;
            let data = {
                bizgroup_sn: vm.viewModel.data.bizgroup_sn,
                lrge_worktype_sn: vm.viewModel.lrge,
                middl_worktype_sn: vm.viewModel.middl,
                gbn: gbn,
            };
            Axios.post("/selectAllWorkType.do", data).then(function (res) {
                if (gbn == "lrge") vm.viewModel.middl_list = res.data.list;
                if (gbn == "middl") vm.viewModel.small_list = res.data.list;
            });

        },
        fnInsert: function () {
            let vm = this;
            var tr = $('input.del:checkbox:not(:checked):eq(-1)').parent().parent();
            var maxWorktype = {};
            let data = {
                bizgroup_sn: vm.viewModel.data.bizgroup_sn,
                bplc_sn: vm.$parent.viewModel.bplc_sn,
            }

            let max_lrge_worktype_sn = vm.$parent.viewModel.success_list.reduce((max, item) => Math.max(item.lrge_worktype_sn, max), 0) + 1;

            Axios.post("/selectMaxWorkTypeSn.do", data).then(function (res) {
                maxWorktype = res.data.result;
                if (vm.$parent.viewModel.data.max_lrge_worktype_sn == '') vm.$parent.viewModel.data.max_lrge_worktype_sn = Number(maxWorktype.max_lrge_worktype_sn) > max_lrge_worktype_sn ? Number(maxWorktype.max_lrge_worktype_sn) : max_lrge_worktype_sn;
                // if (vm.$parent.viewModel.data.max_detail_jobcn_sn == '') vm.$parent.viewModel.data.max_detail_jobcn_sn = Number(maxWorktype.max_detail_jobcn_sn);
            }).then(function () {
                if (vm.viewModel.addGbn == "new") {
                    if (vm.viewModel.lrge_nm == "") return alert("대공종은 필수 입력 사항입니다.");
                    if (vm.viewModel.middl_nm == "") return alert("중공종은 필수 입력 사항입니다.");
                    if (vm.viewModel.small_nm == "") return alert("소공종은 필수 입력 사항입니다.");

                    vm.viewModel.data.lrge_worktype_sn = Number(vm.$parent.viewModel.data.max_lrge_worktype_sn) + 1;
                    vm.$parent.viewModel.data.max_lrge_worktype_sn = Number(vm.$parent.viewModel.data.max_lrge_worktype_sn) + 1;
                    vm.viewModel.data.lrge_worktype = vm.viewModel.lrge_nm;
                    vm.viewModel.data.middl_worktype_sn = 1;
                    vm.viewModel.data.middl_worktype = vm.viewModel.middl_nm;
                    vm.viewModel.data.small_worktype_sn = 1;
                    vm.viewModel.data.small_worktype = vm.viewModel.small_nm;
                    vm.viewModel.data.detail_jobcn_sn = 1;
                    vm.viewModel.data.risk_factor_sn = 1;
                    vm.viewModel.data.new_yn = "Y";
                } else {
                    if ($("#lrgeSel").val() == 0 || $("#lrgeSel").val() == null) return alert("대공종은 필수 선택 사항입니다.");
                    if ($("#middlSel").val() == 0 || $("#middlSel").val() == null) return alert("중공종은 필수 선택 사항입니다.");
                    if ($("#smallSel").val() == 0 || $("#smallSel").val() == null) return alert("소공종은 필수 선택 사항입니다.");
                    vm.viewModel.data.lrge_worktype_sn = vm.viewModel.lrge;
                    vm.viewModel.data.lrge_worktype = $("#lrgeSel option:selected").text();
                    vm.viewModel.data.middl_worktype_sn = vm.viewModel.middl;
                    vm.viewModel.data.middl_worktype = $("#middlSel option:selected").text();
                    vm.viewModel.data.small_worktype_sn = vm.viewModel.small;
                    vm.viewModel.data.small_worktype = $("#smallSel option:selected").text();
                    let list = vm.$parent.viewModel.success_list.filter(data => data.lrge_worktype_sn == vm.viewModel.data.lrge_worktype_sn && data.middl_worktype_sn == vm.viewModel.data.middl_worktype_sn
                        && data.small_worktype_sn == vm.viewModel.data.small_worktype_sn);
                    let max = 0;
                    if(list.length > 0){
                        max = Math.max(...list.map(item => item.detail_jobcn_sn));
                    }
                    vm.viewModel.data.detail_jobcn_sn = max + 1;
                    vm.$parent.viewModel.data.max_detail_jobcn_sn = max + 1;
                    vm.viewModel.data.risk_factor_sn = 1;
                    vm.viewModel.data.new_yn = "D";
                }
                if ($("#lgz_hrisk_job_yn").prop("checked")) {
                    vm.viewModel.data.lgz_hrisk_job_yn = "Y";
                } else {
                    vm.viewModel.data.lgz_hrisk_job_yn = "N";
                }
                if ($("#cant_yn").prop("checked")) {
                    vm.viewModel.data.cant_yn = "Y";
                } else {
                    vm.viewModel.data.cant_yn = "N";
                }

                vm.$parent.viewModel.success_list.push({
                    "bizgroup_sn": vm.viewModel.data.bizgroup_sn,
                    "bizgroup": vm.viewModel.data.bizgroup,
                    "lrge_worktype_sn": vm.viewModel.data.lrge_worktype_sn,
                    "lrge_worktype": vm.viewModel.data.lrge_worktype,
                    "middl_worktype_sn": vm.viewModel.data.middl_worktype_sn,
                    "middl_worktype": vm.viewModel.data.middl_worktype,
                    "detail_jobcn_sn": vm.viewModel.data.detail_jobcn_sn,
                    "risk_factor_sn": vm.viewModel.data.risk_factor_sn,
                    "risk_factor": vm.viewModel.data.risk_factor,
                    "job_pstn": "",
                    "job_mchn": "",
                    "temp_fclts": "",
                    "acdnt_case_orgcause_material": vm.viewModel.data.acdnt_case_orgcause_material,
                    "acdnt_case_dsstr_stle": vm.viewModel.data.acdnt_case_dsstr_stle,
                    "acdnt_case_sumry": vm.viewModel.data.acdnt_case_sumry,
                    "acdnt_case_cause": vm.viewModel.data.acdnt_case_cause,
                    "risk_grd": vm.viewModel.data.risk_grd,
                    "cntrpln": vm.viewModel.data.cntrpln,
                    "lgz_hrisk_job_yn": vm.viewModel.data.lgz_hrisk_job_yn,
                    "cant_yn": vm.viewModel.data.cant_yn,
                    "s_pcm_rst": "",
                    "small_worktype": vm.viewModel.data.small_worktype,
                    "small_worktype_sn": vm.viewModel.data.small_worktype_sn,
                    "detail_jobcn": vm.viewModel.data.detail_jobcn,
                    "new_yn": vm.viewModel.data.new_yn,
                });

                alert("추가되었습니다.");
                vm.$parent.addPopup = false;

                vm.viewModel.data.bizgroup_sn = '';
                vm.viewModel.data.bizgroup = '';
                vm.viewModel.data.lrge_worktype_sn = '';
                vm.viewModel.data.lrge_worktype = '';
                vm.viewModel.data.middl_worktype_sn = '';
                vm.viewModel.data.middl_worktype = '';
                vm.viewModel.data.detail_jobcn_sn = '';
                vm.viewModel.data.risk_factor_sn = '';
                vm.viewModel.data.risk_factor = '';
                vm.viewModel.data.job_pstn = '';
                vm.viewModel.data.job_mchn = '';
                vm.viewModel.data.temp_fclts = '';
                vm.viewModel.data.acdnt_case_orgcause_material = '';
                vm.viewModel.data.acdnt_case_dsstr_stle = '';
                vm.viewModel.data.acdnt_case_sumry = '';
                vm.viewModel.data.acdnt_case_cause = '';
                vm.viewModel.data.risk_grd = '상';
                vm.viewModel.data.cntrpln = '';
                vm.viewModel.data.lgz_hrisk_job_yn = '';
                vm.viewModel.data.cant_yn = '';
                vm.viewModel.data.s_pcm_rst = '';
                vm.viewModel.data.small_worktype = '';
                vm.viewModel.data.small_worktype_sn = '';
                vm.viewModel.data.detail_jobcn = '';

                vm.$parent.fnAddRow();
            })

        }

    }
};
</script>
