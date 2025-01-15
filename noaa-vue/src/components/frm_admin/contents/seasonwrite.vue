<template>
<div>
    <div class="contents">
        <div class="box">
            <h3>시즌정보</h3>
            <div>
                <table class="table horizontal write">
                    <caption>시즌정보</caption>
                    <tbody>
                        <tr>
                            <th scope="row">년도</th>
                            <td>
                                <input type="text" title="년도" v-model="viewModel.list.st_season">
                            </td>
                            <th scope="row">시즌 시작일</th>
                            <td>
                                <div class="datepicker_box">
                                    <input type="text" class="datepicker" title="시즌 시작일" placeholder="날짜 선택" readonly ref="sdt">
                                </div>
                            </td>
                            <th scope="row">시즌 종료일</th>
                            <td>
                                <div class="datepicker_box">
                                    <input type="text" class="datepicker" title="시즌 종료일" placeholder="날짜 선택" readonly ref="edt">
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="btn-group btn-right">
                <router-link to="/" class="btn btn-white">목록</router-link>
                <button class="btn btn-blue" @click.prevent="fnSave()">등록</button>
            </div>
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
