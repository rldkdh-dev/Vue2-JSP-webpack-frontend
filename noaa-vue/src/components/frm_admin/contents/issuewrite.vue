<template>

    <div id="contents">
        <div class="box">
            <h3>쿠폰 발급관리 등록</h3>
            <div>
                <table class="table horizontal write">
                    <!-- <caption>쿠폰 발행 정보</caption> -->
                    <tbody>
                        <tr>
                            <th scope="row">발급방법</th>
                                <td>
                                    <input type="text" title="발행처" v-model="vm.viewModel.detail.DT_REG">
                                </td>
                            <th scope="row">발급수량</th>
                                <td>
                                    <input type="text" title="발급수량" v-model="vm.viewModel.detail.DT_REG">
                                </td>    
                        </tr>
                        <tr>
                            <th scope="row">발급구분</th>
                                <td>
                                    <input type="text" title="발급구분" v-model="vm.viewModel.detail.DT_REG">
                                </td>
                            <th scope="row">출석회차</th>
                                <td>
                                    <input type="text" title="출석회차" v-model="vm.viewModel.detail.DT_REG">
                                </td>
                        </tr>
                        <tr>
                            <th scope="row">발급기준</th>
                                <td>
                                    <input type="text" title="발급기준" v-model="vm.viewModel.detail.DT_REG">
                                </td>
                            <th scope="row">발급쿠폰</th>
                                <td>
                                    <input type="text" title="발급쿠폰" v-model="vm.viewModel.detail.DT_REG">
                                </td>
                        </tr>
                        <tr>
                            <th scope="row">출석시작일자</th>
                                <td>
                                    <input type="text" title="출석시작일자" v-model="vm.viewModel.detail.DT_REG">
                                </td>
                            <th scope="row">출석종료일자</th>
                                <td>
                                    <input type="text" title="출석종료일자" v-model="vm.viewModel.detail.DT_REG">
                                </td>
                        </tr>
                        <tr>
                            <th scope="row">발급시작일자</th>
                                <td>
                                    <input type="text" title="발급시작일자" v-model="vm.viewModel.detail.DT_REG">
                                </td>
                            <th scope="row">발급종료일자</th>
                                <td>
                                    <input type="text" title="발급종료일자" v-model="vm.viewModel.detail.DT_REG">
                                </td>
                        </tr>
                        <tr>
                            <th scope="row">회원구분</th>
                                <td>
                                    <input type="text" title="회원구분" v-model="vm.viewModel.detail.DT_REG">
                                </td>
                            <th scope="row">회원등급</th>
                                <td>
                                    <input type="text" title="회원등급" v-model="vm.viewModel.detail.DT_REG">
                                </td>
                        </tr>                                                                  
                    </tbody>
                </table>
        <router-link to="/" class="btn btn-white">목록</router-link>
        <button class="btn btn-blue" @click.prevent="fnSave()">등록</button>
        </div>
    </div>
</div>  
</template>

<script>
import 'es6-promise/auto'
import Vue from 'vue'
import Axios from 'axios'
import Xlsx from 'xlsx'
import pager from "../../../common/vue/admin_paging.vue";
import Message, {messageUtil} from "../../../common/js/message";
import excelform from "../../frm_main/excelform.vue";
import printJS from 'print-js'

Vue.component("pager", pager);
Vue.config.devtools = true;

export default {
    components: {
        pager,
        'excelform': excelform,
    },
    data: function () {
        return {
            pop:false,
            printPop:false,
            excelDownload: [],
            write: 'N',
            viewModel: {
                userInfo: {},
                serachList: {
                    text: "",
                    select_cat: "",
                },
                list: [],
            }
        }
    },
    activated:function(){
        calendarInput();
        this.fnInit();
    },
    deactivated:function(){
        this.$destroy();
    },
    mounted: function () {
    },
    methods: {
        fnInit: function(){
            let vm = this;
            let sn = vm.$route.params.sn;

            vm.viewModel.userInfo = vm.$store.state.global.userInfo;

            if(sn!='write') {
                vm.fnList(sn);
            } else {
                vm.write = 'Y'
            }
        },
        fnList: function (sn) {
            let vm = this;

            let send = {
                st_season: sn,
            };

            Axios.post("/getSeasonDetail.do", send).then (function (rs) {
                vm.viewModel.list = rs.data.list;
                vm.$refs.sdt.value = rs.data.list.dt_season_st;
                vm.$refs.edt.value = rs.data.list.dt_season_ed;

            });
        },
        fnSave: function() {
            let vm = this;

            let send = {
                st_season: vm.viewModel.list.st_season,
                dt_season_st: vm.$refs.sdt.value,
                dt_season_ed: vm.$refs.edt.value,
                user_id: vm.viewModel.userInfo.user_id,
            }

            if(vm.write == 'Y') {
                if(confirm(Message.CREATE_CONFIRM)) {
                    Axios.post("/insertSeason.do", send).then (function (rs) {
                        if(rs.data == 1) {
                            alert('저장되었습니다.');
                            vm.$router.push('/');
                        }
                    }).catch(function (ex) {
                        alert(Message.ERROR);
                    });
                }
            } else {
                if(confirm(Message.UPDATE_CONFIRM)) {
                    Axios.post("/updateSeason.do", send).then (function (rs) {
                        if(rs.data == 1) {
                            alert('저장되었습니다.');
                            vm.$router.push('/');
                        }
                    }).catch(function (ex) {
                        alert(Message.ERROR);
                    });
                }
            }
        }

    }
}
</script>
