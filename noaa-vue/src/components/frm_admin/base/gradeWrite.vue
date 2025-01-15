<template>
    <div>
        <div class="contents">
            <div class="box">
                <h3>승급기준조회</h3>
                <div>
                    <table class="table horizontal write">
                        <caption>시즌정보</caption>
                        <thead>

                        </thead>
                        <tbody>
                            <tr>
                                <th scope="row">년도</th>
                                <td>
                                    <input type="text" title="년도" v-model="viewModel.detail.ym_calcu_basic">
                                </td>
                                <th scope="row">시작조건</th>
                                <td>
                                    <input type="text" title="시작조건" placeholder="시작조건" readonly ref="sdt">
                                </td>
                                <th scope="row">끝조건</th>
                                <td>
                                    <input type="text" title="끝조건" placeholder="끝조건" readonly ref="edt">
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="btn-group btn-right">
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
import common from '../../../common/js/common.js';


Vue.config.devtools = true;

export default {
    components: {
    },
    data: function () {
        return {
            write: 'N',
            viewModel: {
                userInfo: {},
                detail: [],
                codeList: [],
                colNames: [],
                colValue: [],
            }
        }
    },
    activated: function() {
        calendarInput();
        this.fnInit();
    },
    deactivated: function() {
        this.$destroy();
    },
    mounted: function () {
    },
    methods: {
        fnInit: function () {
            let vm = this;
            let ym_calcu_basic = vm.$route.params.ym_calcu_basic;

            vm.viewModel.userInfo = vm.$store.state.global.userInfo;
            
            let searchCode = ['CD_GRADE'];

            common.fnGetBaseCodeJson(searchCode).then(result => {
                vm.viewModel.codeList = result;

                vm.viewModel.codeList.forEach(element => {
                    vm.viewModel.colValue.push(element.code);
                });

                if (ym_calcu_basic != 'write') vm.fnList(ym_calcu_basic); else vm.write='Y';
            }).catch(error => {
                console.error('Error:', error); // 에러 처리
            });
        },
        fnList: function (ym_calcu_basic) {
            let vm = this;

            let send = {
                ym_calcu_basic : ym_calcu_basic,
                code_arr: vm.viewModel.colValue
            };

            Axios.post("/getGradeDetail.do", send).then (function (rs) {
                vm.viewModel.detail = rs.data;
            });
        }
    }
}
</script>