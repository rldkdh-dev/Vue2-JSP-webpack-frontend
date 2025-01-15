<template>
<div>
    <div class="contents write">
        <div>
            <h3>안전보건 선임관리 등록</h3>
            <table class="table horizontal write">
                <caption>안전보건 선임관리 등록</caption>
                <tbody>
                    <tr>
                        <th scope="row" class="w180 essential"><label for="">자격종류</label></th>
                        <td>
                            <select title="자격종류" id="qlfc_knd" v-model="viewModel.data.qlfc_knd">
                                <option value="0" disabled selected>자격종류 선택</option>
                                <option v-for="(item,i) in viewModel.list.qlfcList" :key="i" :value="item.CODE">{{item.CODE_NM}}</option>
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row" class="essential"><label for="bplc">현장명</label></th>
                        <td>
                            <div class="input_group" v-if="viewModel.userInfo.bplc_sn != 0">
                                <input type="text" id="bplc_nm" v-model="viewModel.data.bplc_nm" disabled>
                                <input type="hidden" id="bplc" v-model="viewModel.data.bplc_sn">
                                <!-- <a @click="fnPopup();"><svg class="icon">
                                        <use xlink:href="../../img/symbol-defs.svg#icon-search"></use>
                                    </svg></a> -->
                            </div>
                            <div class="input_group" v-else>
                                <input type="text" id="bplc_nm" v-model="viewModel.data.bplc_nm" disabled>
                                <input type="hidden" id="bplc" v-model="viewModel.data.bplc_sn">
                                <a @click="fnPopup();"><svg class="icon">
                                        <use xlink:href="../../img/symbol-defs.svg#icon-search"></use>
                                    </svg></a>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row" class="essential"><label for="">성명</label></th>
                        <td v-if="viewModel.list.bplcNm.length > 0">
                            <select title="성명" id="user_nm" v-model="viewModel.data.user_id">
                                <option v-for="(item,i) in viewModel.list.bplcNm" :selected="i === 0" :key="i" :value="item.USER_ID" >{{ item.USER_NM }}</option>
                            </select>
                        </td>
                        <td v-else>
                            <select title="성명" id="user_nm">
                                <option disabled selected v-if="viewModel.data.bplc_sn == ''">현장 선택 후 조회됩니다.</option>
                                <option disabled selected v-else>해당 현장에 조회된 유저가 없습니다.</option>
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row" class="essential"><label for="">선임일자</label></th>
                        <td>
                            <div class="input_group">
                                <div class="datepicker_box">
                                    <input type="text" class="datepicker" id="apnt_dt" title="datepicker" readonly>
                                </div>
                            </div>
                        </td>
                    </tr>
                    <!-- <tr>
                            <th scope="row"><label for="">유효기간</label></th>
                            <td>
                                <div class="input_group" style="width: 30%;">
                                    <div class="datepicker_box">
                                        <input type="text" class="datepicker" id="vld_pd_bgnde" title="datepicker" v-model="viewModel.data.vld_pd_bgnde">
                                    </div>
                                    <label>~</label>
                                    <div class="datepicker_box">
                                        <input type="text" class="datepicker" id="vld_pd_endde" title="datepicker" v-model="viewModel.data.vld_pd_endde">
                                    </div>
                                </div>
                            </td>
                        </tr> -->
                    <tr>
                        <th scope="row"><label for="">선임계</label></th>
                        <td>
                            <fileform @filelist="fnFilelist" @fileDelete="fnFileDelete" :pass="{id:'sc'}" ref="files"></fileform>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div class="table_footer btn-right">
                <button class="btn btn-purple" @click.prevent="fnSave()"><svg class="icon">
                        <use xlink:href="../../img/symbol-defs.svg#icon-post-add"></use>
                    </svg>등록</button>
                <router-link to="/" class="btn btn-white"><svg class="icon">
                        <use xlink:href="../../img/symbol-defs.svg#icon-list-back"></use>
                    </svg>목록</router-link>
            </div>
        </div>
    </div>
    <bplc ref="bplc" v-if="bplcPop==true" :pass="{dept_sn: viewModel.userInfo.dept_sn, team_sn: viewModel.userInfo.team_sn}"></bplc>
</div>
</template>

<script>
import "es6-promise/auto";
import Vue from "vue";
import Axios from "axios";
import Fileform from '../../../../common/vue/fileform2.vue'
import Message, {
    messageUtil
} from "../../../../common/js/message";
import fromValidation from "../../../../common/js/fromValidation";
import bplc from "../../popup/bplc_popup.vue";

export default {
    components: {
        'fileform': Fileform,
        'bplc': bplc,
    },
    data: function () {
        return {
            tabNm: "elt",
            bplcPop: false,
            viewModel: {
                userInfo: {},
                filelist: [],
                fileGroup: '',
                data: {
                    bplc_sn : "",
                    bplc_nm : "",
                    qlfc_knd : "0",
                    user_id : "",

                },
                list: {
                    qlfcList: [],
                    bplcNm: []
                },
            },
            mode: '',
            isSaved:false,
        };
    },
    mounted: function () {
        let vm = this;
        vm.viewModel.userInfo = vm.$store.state.global.userInfo;
        calendarInput();
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

            let sn = vm.$route.params.sn;
            vm.$route.params.sn = sn;
            vm.viewModel.data.bplc_sn = vm.viewModel.userInfo.bplc_sn;
            vm.viewModel.data.bplc_nm = vm.viewModel.userInfo.bplc_nm;
            vm.viewModel.data.user_id = vm.viewModel.userInfo.user_id;
            vm.fnBplcNmList();
            vm.fnSearch();
            if (sn != undefined) {
                vm.fnDetail(sn);
            }
        },
        fnSearch: function () {
            let vm = this;
            let data = {
                code_group: "QLFC_TYPE"
            }
            Axios.post("/selectHsPsQlfcList.do", data)
                .then(function (response) {
                    vm.viewModel.list.qlfcList = response.data.list;

                });

            if ($("#bplc").val() != "") {

            }
        },
        fnDetail: function (sn) {
            let vm = this;
            let data = {
                sn: sn,
                tabNm: "elt",
                file_se: "1"
            }
            Axios.post("/selectHsPsWrite.do", data)
                .then(function (response) {
                    vm.viewModel.data = response.data.result;
                    $("#apnt_dt").val(vm.viewModel.data.apnt_dt);
                    vm.viewModel.filelist = response.data.fileList;

                    let data2 = {
                        bplc_sn: response.data.result.bplc_sn,
                    }
                    Axios.post("/selectHsPsBplcNmList.do", data2)
                        .then(function (response) {
                            vm.viewModel.list.bplcNm = response.data.list;
                        });
                    vm.$refs.files.fnFileLoadList(vm.viewModel.filelist);
                });
        },
        fnFileDelete: function (vm) {
            this.viewModel.deletefileList = vm.deletefileList;
        },
        fnSave: function () {
            let vm = this;
            let frm = new FormData();
            if (vm.viewModel.filelist != null && vm.viewModel.filelist != undefined) {
                for (let i = 0; i < vm.viewModel.filelist.length; i++) {
                    let key = vm.viewModel.filelist[i].file_seq;
                    if (vm.viewModel.filelist[i].file != null) {
                        frm.append("fileTitle", vm.viewModel.filelist[i].file_title);
                        frm.append("uploadFiles", vm.viewModel.filelist[i].file);
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
                if (vm.viewModel.deletefileList != null && vm.viewModel.deletefileList != undefined) {
                    for (let i = 0; i < vm.viewModel.deletefileList.length; i++) {
                        frm.append("deleteFiles", vm.viewModel.deletefileList[i]);
                    }
                }
            }
            vm.fngetFileInfo(frm);
        },
        fngetFileInfo: function (frm) {
            let vm = this;
            const valiData = [{
                    id: 'bplc_nm',
                    type: 'input',
                    title: '현장명'
                },
                {
                    id: 'qlfc_knd',
                    type: 'input',
                    title: '자격종류'
                },
                {
                    id: 'user_nm',
                    type: 'input',
                    title: '성명'
                },
                {
                    id: 'apnt_dt',
                    type: 'input',
                    title: '선임일자'
                },
            ];

            if (!fromValidation(valiData)) {
                return false;
            }

            let data = {
                user_id: vm.viewModel.userInfo.user_id,
                bplc_id: $("#user_nm").val(),
                bplc_sn: vm.viewModel.data.bplc_sn,
                qlfc_knd: $("#qlfc_knd").val(),
                user_nm: vm.viewModel.data.user_nm,
                apnt_dt: $("#apnt_dt").val(),
                apnt_mng_sn: vm.$route.params.sn,
                gbn: "elt",
                atchmnfl: "1"

            };

            frm.append('data', new Blob([JSON.stringify(data)], {
                type: "application/json"
            }));

            frm.append("filePath", "hsPs");

            if (vm.$route.params.sn == undefined) {
                if (confirm(Message.CREATE_CONFIRM)) {
                    Axios.post("/insertHsPsApnt.do", frm).then(function (response) {
                        if (response.data == 1) {
                            vm.isSaved = true;
                            vm.$router.push('/');
                            alert("저장되었습니다.");
                        }

                    }).catch(function (ex) {
                        alert(Message.ERROR);
                    });
                }
            } else {
                if (confirm(Message.UPDATE_CONFIRM)) {
                    Axios.post("/updateHsPs.do", frm).then(function (response) {
                        if (response.data == 1) {
                            vm.isSaved = true;
                            vm.$router.push('/');
                            alert("저장되었습니다.");
                        }

                    }).catch(function (ex) {
                        alert(Message.ERROR);
                    });
                }
            }
        },
        fnFilelist: function (vm) {
            this.viewModel.filelist = vm.filelist;
            this.vie, wModel.fileGroup = vm.fileGroup;
        },
        fnPopup: function () {
            let vm = this;
            vm.bplcPop = true;
            vm.$nextTick(function () {
                if (vm.bplcPop) {
                    vm.$refs.bplc.fnInit();
                }
            })
        },
        fnBplcAdd: function (item) {
            let vm = this;

            vm.viewModel.data.bplc_sn = item.bplc_sn;
            vm.viewModel.data.bplc_nm = item.bplc_nm;
            let data = {
                bplc_sn: vm.viewModel.data.bplc_sn,
            }
            Axios.post("/selectHsPsBplcNmList.do", data)
                .then(function (response) {
                    vm.viewModel.list.bplcNm = response.data.list;

                });
        },
        fnBplcNmList: function(){
            let vm = this;
            let data = {
                bplc_sn: vm.viewModel.data.bplc_sn,
            }
            Axios.post("/selectHsPsBplcNmList.do", data)
                .then(function (response) {
                    vm.viewModel.list.bplcNm = response.data.list;

                });
        }
    }
};
</script>
