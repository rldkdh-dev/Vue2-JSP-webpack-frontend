<template>
<modal :pass="{popupTitle:'현장 권한정보'}">
    <template v-slot:contents>
        <div style="float: left; width: 50%; padding: 1em;">
            <div>
                <table class="table">
                    <caption>현장 목록</caption>
                    <thead>
                        <tr>
                            <th scope="col">권한부여 현장</th>
                            <th scope="col">선택</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in setBplcList" :key="item.BPLC_SN">
                            <td class="text-left">{{ item.BPLC_NM }}</td>
                            <td>
                                <button class="btn btn-small btn-default" @click="fnSetBplcDelete(item.BPLC_SN)"><svg class="icon">
                                        <use xlink:href="../../img/symbol-defs.svg#icon-checklist"></use>
                                    </svg>삭제</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <div style="float: right; width: 50%; padding: 1em;">
            <div>
                <table class="table">
                    <caption>현장 목록</caption>
                    <thead>
                        <tr>
                            <th scope="col">현장명</th>
                            <th scope="col">선택</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in bplcOrgList" :key="item.bplc_sn">
                            <td class="text-left">{{ item.bplc_nm }}</td>
                            <td>
                                <button class="btn btn-small btn-default" @click="fnSetBplcAdd(item.bplc_sn)"><svg class="icon">
                                        <use xlink:href="../../img/symbol-defs.svg#icon-checklist"></use>
                                    </svg>추가</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </template>
</modal>
</template>

<script>
import 'es6-promise/auto'
import Vue from 'vue'
import Axios from 'axios'
import Modal from './modal.vue'
import Pager from "../../paging.vue";

export default {
    components: {
        Pager,
        Modal
    },
    data: function () {
        return {
            search: '',
            setBplcList: [],
            bplcList: [],
            bplcOrgList: [],
            userInfo: {},
        }
    },
    methods: {
        fnInit: function () {
            Modal.methods.fnInit();
            this.fnSetList();
            this.fnList();
        },
        fnSetList: function () {
            let vm = this;

            let data = {
                mapperId: 'comm.selectSetBplcList',
                user_id: vm.$parent.viewModel.detailUser.user_id,
            };
            Axios.post("/list.do", data).then(function (rs) {
                vm.setBplcList = rs.data.list;
            });
        },
        fnList: function () {
            let vm = this;

            let data = {
                mapperId: 'comm.selectAllBplcList'
            };
            Axios.post("/list.do", data).then(function (rs) {
                vm.bplcList = rs.data.list;
                vm.bplcOrgList = rs.data.list.filter((e) => !vm.setBplcList.map(row => row.BPLC_SN).includes(e.bplc_sn));
            });
        },
        fnFilter: function () {
            let vm = this;
            let list = vm.bplcList;
            vm.bplcOrgList = list.filter((e) => !vm.setBplcList.map(row => row.BPLC_SN).includes(e.bplc_sn));
        },
        fnSetBplcDelete: function (sn) {
            let vm = this;
            let data = {
                bplc_sn: sn,
                user_id: vm.$parent.viewModel.detailUser.user_id,
            }

            if (vm.$parent.viewModel.bplc_sn === sn) {
                alert("기본 현장 권한은 삭제 불가능합니다.")
            } else {
                if (confirm("삭제하시겠습니까?")) {
                    Axios.post("/deleteUserBplcInfo.do", data).then(function (rs) {
                        if (rs.data == 1) {
                            alert("해당 현장 권한이 삭제되었습니다.")
                            vm.fnSetList();
                            setTimeout(() => vm.fnFilter(), 500);
                        } else {
                            alert("실패!! 관리자에게 문의바랍니다.")
                        }
                    })
                }
            }

        },
        fnSetBplcAdd: function (sn) {
            let vm = this;
            let data = {
                bplc_sn: sn,
                user_id: vm.$parent.viewModel.detailUser.user_id,
            }
            if (confirm("추가하시겠습니까?")) {
                if (vm.setBplcList.map(row => row.BPLC_SN).includes(sn)) {
                    alert("해당현장 권한은 이미 포함되어있습니다.")
                } else {
                    Axios.post("/insertUserBplcInfo.do", data).then(function (rs) {
                        if (rs.data == 1) {
                            alert("해당 현장 권한이 추가되었습니다.")
                            vm.fnSetList();
                            vm.$parent.fnSetBplcList();
                            setTimeout(() => vm.fnFilter(), 500);
                        } else {
                            alert("관리자에게 문의바랍니다.");
                            return false;
                        }
                    }).catch(function(){
                        alert("관리자에게 문의바랍니다.");
                        return false;
                    })
                }

            }
        },
    }
}
</script>
