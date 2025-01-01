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
                                <input type="text" title="년도" readonly v-model="viewModel.list.st_season">
                            </td>
                            <th scope="row">시즌 시작일</th>
                            <td>
                                <div class="datepicker_box">
                                    <input type="text" class="datepicker" title="시즌 시작일" placeholder="날짜 선택" readonly>
                                </div>
                            </td>
                            <th scope="row">시즌 종료일</th>
                            <td>
                                <div class="datepicker_box">
                                    <input type="text" class="datepicker" title="시즌 종료일" placeholder="날짜 선택" readonly>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
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
            select: "0",
            category: 'user_name',
            viewModel: {
                userInfo: {},
                serachList: {
                    text: "",
                    select_cat: "",
                },
                list: [],
                bplc_sn: "",
                assistant_manager: [],
                ownerlist: [],
                authlist: [],
                auth_uid: "",
                user_auth_click: false,
                name: "",
                pager: {
                    model: {},
                    pageNo: 1,
                    totalSize: 0,
                    rowSize: 5,
                    blockSize: 5,
                    list: [],
                    callBack: function (n) {
                        this.model.fnGetSelectList(n);
                    }
                },
            }
        }
    },
    mounted: function () {
        let vm = this;
        vm.viewModel.userInfo = vm.$store.state.global.userInfo;
        vm.$router.afterEach((to, from) => {
            vm.fnInit(vm.viewModel.pager.pageNo);
        });

        vm.fnInit();
    },
    methods: {
        fnInit: function(){
            let vm = this;
            let sn = vm.$route.params.sn;

            console.log(sn)
            vm.fnList(sn);
        },
        fnList: function (sn) {
            let vm = this;

            let send = {
                st_season: sn,
            };

            Axios.post("/getSeasonDetail.do", send).then (function (rs) {
                vm.viewModel.list = rs.data.list;
                console.log(rs.data.list)

            });

        },

    }
}
</script>
