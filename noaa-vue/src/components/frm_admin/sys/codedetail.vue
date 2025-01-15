<template>
    <div>
        <div class="contents">
            <div class="box">
                <div>
                    <h3>코드 유형 상세</h3>
                    <div>
                        <table class="table horizontal write">
                            <caption>코드 유형 상세</caption>
                            <tbody>
                                <tr>
                                    <th scope="row">코드유형ID</th>
                                    <td>
                                        <input type="text" title="코드유형ID" v-model="viewModel.detail.code_category_id" readonly>
                                    </td>
                                    <th scope="row">상위코드</th>
                                    <td>
                                        <input type="text" title="상위코드" v-model="viewModel.detail.code_category_id_up" readonly>
                                    </td>
                                </tr>
                                <tr>
                                    <th scope="row">코드유형명</th>
                                    <td>
                                        <input type="text" title="코드유형명" v-model="viewModel.detail.code_category_nm">
                                    </td>
                                    <th scope="row">상태</th>
                                    <td>
                                        <select title="상태" v-model="viewModel.detail.code_tp">
                                            <option value="" default hidden></option>
                                            <option v-for="item in viewModel.codeTpCode" :key="item" :value="item.code">{{ item.code_name }}</option>
                                        </select>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div>
                    <h3>코드 상세 목록</h3>
                    <div>
                        <table id="codeDetailList" class="table write">
                            <!-- <caption>코드 상세 목록</caption>
                            <thead>
                                <tr>
                                    <th scope="col"><input type="checkbox"></th>
                                    <th scope="col">코드</th>
                                    <th scope="col">코드명</th>
                                    <th scope="col">코드설명</th>
                                    <th scope="col">정렬순서</th>
                                    <th scope="col">상위코드</th>
                                    <th scope="col">상태</th>
                                    <th scope="col">삭제</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><input type="checkbox"></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                </tr>
                            </tbody> -->
                        </table>

                    </div>
                <div id="pager"></div>
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
            viewModel: {
                userInfo: {},
                detail: [],
                codeList: [],
                flagYnCode: [],
                statusCode: [],
                codeTpCode: [],
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
        let vm = this;
        let id = vm.$route.params.id;

        vm.fnList(id);
    },
    methods: {
        fnInit: function () {
            let vm = this;

            vm.viewModel.userInfo = vm.$store.state.global.userInfo;

            let searchCode = ['STATUS', 'FLAG_YN', 'CODE_TP'];

            common.fnGetBaseCodeJson(searchCode).then(result => {
                vm.viewModel.statusCode = result.filter(value => value.code_category_id === 'STATUS');
                vm.viewModel.flagYnCode = result.filter(value => value.code_category_id === 'FLAG_YN');
                vm.viewModel.codeTpCode = result.filter(value => value.code_category_id === 'CODE_TP');

            }).catch(error => {
                console.error('Error:', error); // 에러 처리
            });
        },
        fnList: function (id) {
            let vm = this;

            let send = {
                code_category_id : id
            };

            Axios.post("/getBaseCodeDetail.do", send).then (function (rs) {
                vm.viewModel.detail = rs.data.detail;
                vm.viewModel.codeList = rs.data.codeList;


                vm.setGrid(rs.data.codeList);
            });

        },
        setGrid: function (data) {
            let vm = this;

            console.log(data);

            $("#codeDetailList").jqGrid("GridUnload");

            $("#codeDetailList").jqGrid({
                dataType: 'local',
                data: data,
                colNames: ['코드', '코드명', '코드설명', '정렬순서', '상위코드', '상태', '삭제'],
                colModel: [
                    {label: 'code', name: 'code', key: true},
                    {label: 'code_name', name: 'code_name'},
                    {label: 'code_ds', name: 'code_ds'},
                    {label: 'sort_order', name: 'sort_order'},
                    {label: 'parent_code', name: 'parent_code'},
                    {label: 'status', name: 'status'},
                    {label: '', name: ''}
                    // {label: 'CODE_CATEGORY_ID', name: 'CODE_CATEGORY_ID', key: true},
                    // {label: 'CODE_CATEGORY_NM', name: 'CODE_CATEGORY_NM'},
                    // {label: 'STATUS', name: 'STATUS'},
                    // {label: 'CODE_CATEGORY_ID_UP', name: 'CODE_CATEGORY_ID_UP'},
                    // {label: 'MAPPING_YN', name: 'MAPPING_YN'},
                    // {label: 'USER_NM', name: 'USER_NM'},
                    // {label: 'REG_DT', name: 'REG_DT', formatter(cellValue) {
                    //     return vm.formatDate(cellValue);
                    // }},
                ],
                rowNum: 10,
                pager: '#pager',
                viewrecords: true,
                height: 'auto',
                shrinkToFit: true,
                autowidth: true,
                sortable: true,
                sortname: 'sort_order',
                sortorder: 'asc'
                // onSelectRow: function (id) {
                //     // 선택된 행 데이터 가져오기
                //     var rowData = $("#codeDetailList").jqGrid('getRowData', id);

                //     // 예외 처리
                //     if (!rowData || !rowData.CODE_CATEGORY_ID) {
                //         console.error('선택된 행의 데이터가 유효하지 않습니다.');
                //         return;
                //     }

                //     var firstData = rowData.CODE_CATEGORY_ID;

                //     // Vue Router로 페이지 이동
                //     vm.$router.push({ name: 'codedetail', params: { id: firstData } });
                // }
            });
            $("#codeDetailList").setGridWidth($(".grid-container").width() - 1);
        }
    }
}
</script>
