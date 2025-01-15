<template>
<div>
    <div class="contents">
        <div class="box">
            <h3>기본검색 
                <div class="btn-group btn-right">
                    <button type="button" class="btn btn-gray" @click="fnReset()">초기화</button>
                    <button type="button" class="btn btn-blue" @click="fnList()">검색</button>
                </div>
            </h3>
            <div class="search_container">
                <div>
                    <label for="">코드유형ID<input type="text" title="" placeholder="입력해주세요" v-model="viewModel.search.code_category_id"></label>
                    <label for="">코드유형명<input type="text" title="" placeholder="입력해주세요" v-model="viewModel.search.code_category_nm"></label>
                    <label for="">코드명<input type="text" title="" placeholder="입력해주세요" v-model="viewModel.search.code_name"></label>
                    <label for="">
                        코드유형
                        <select title="" id="search_code_tp" name="search_code_tp" v-model="viewModel.search.code_tp">
                            <option value="" hidden default>선택</option>
                            <option v-for="item in viewModel.searchCodeTpList" :key="item.code" :value="item.code">{{ item.code_name }}</option>
                        </select>
                    </label>
                </div>
            </div>
        </div>
        <div class="box">
            <div>
                <div class="table_top">
                    <div class="total_count">전체 <em id="total_cnt">0</em>건</div>
                    <div class="table_service">
                        <button class="btn btn-darkblue">등록</button>
                    </div>
                </div>
                <div class="grid-container">
                    <table class="table" id="codeList"></table>
                </div>
                <div id="pager"></div>
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
import Message, {
    messageUtil
} from "../../../common/js/message";
import excelform from "../../frm_main/excelform.vue";
// import resignPopup from "./popup/resignInfoPopup.vue";
// import printPopup from "./popup/memberPrintPopup.vue";
import printJS from 'print-js'

import moment from 'moment' ;
import common from '../../../common/js/common.js';



Vue.component("pager", pager);
Vue.config.devtools = true;

export default {
    components: {
        pager,
        'excelform': excelform,
        // 'resignPopup': resignPopup,
        // 'printPopup': printPopup,
    },
    data: function () {
        return {
            select: "0",
            viewModel: {
                ym_calcu_basic: "",
                searchCodeTpList: [],
                codeList: [],
                userInfo: {},
                search : {
                    code_category_id: "",
                    code_category_nm: "",
                    code_tp: "",
                    code_name: ""
                },
                pager: {
                    model: {},
                    pageNo: 1,
                    totalSize: 0,
                    rowSize: 10,
                    blockSize: 10,
                    codeList: [],
                    callBack: function (n) {
                        this.model.fnGetSelectList(n);
                    }
                },
            }
        }
    },
    created: function () {
        let vm = this;
    },
    mounted: function () {
        let vm = this;

        let searchCode = ['CODE_TP'];

        common.fnGetBaseCodeJson(searchCode).then(result => {
            vm.viewModel.searchCodeTpList = result;

            vm.fnList();
        }).catch(error => {
            console.error('Error:', error); // 에러 처리
        });
        
    },
    methods: {
        fnReset: function () {
            let vm = this;

            vm.viewModel.search.code_category_id = "";
            vm.viewModel.search.code_category_nm = "";
            vm.viewModel.search.code_name = "";
            vm.viewModel.search.code_tp = "";
            

            vm.fnList();
        },
        fnList: function () {
            let vm = this;

            let data = {
                //code_arr: vm.viewModel.colValue
            };

            if (vm.viewModel.search.code_category_id != null && vm.viewModel.search.code_category_id != undefined && vm.viewModel.search.code_category_id != '') {
                data.code_category_id = vm.viewModel.search.code_category_id;
            }

            if (vm.viewModel.search.code_category_nm != null && vm.viewModel.search.code_category_nm != undefined && vm.viewModel.search.code_category_nm != '') {
                data.code_category_nm = vm.viewModel.search.code_category_nm;
            }

            if (vm.viewModel.search.code_tp != null && vm.viewModel.search.code_tp != undefined && vm.viewModel.search.code_tp != '') {
                data.code_tp = vm.viewModel.search.code_tp;
            }

            if (vm.viewModel.search.code_name != null && vm.viewModel.search.code_name != undefined && vm.viewModel.search.code_name != '') {
                data.code_name = vm.viewModel.search.code_name;
            }
            
            Axios.post("/getBaseCodeList.do", data)
            .then (function (rs) {
                vm.viewModel.codeList = rs.data.list;
                $("#total_cnt").text(rs.data.totalCNT);

                vm.setGrid();
            });

        },
        setGrid: function () {
            let vm = this;

            $("#codeList").jqGrid("GridUnload");
            
            $("#codeList").jqGrid({
                dataType: 'local',
                data: vm.viewModel.codeList,
                colNames: ['코드유형ID', '코드유형명', '상태', '상위코드', 'MAPPING여부', '등록자', '등록일시'],
                colModel: [
                    {label: 'CODE_CATEGORY_ID', name: 'CODE_CATEGORY_ID', key: true},
                    {label: 'CODE_CATEGORY_NM', name: 'CODE_CATEGORY_NM'},
                    {label: 'STATUS', name: 'STATUS'},
                    {label: 'CODE_CATEGORY_ID_UP', name: 'CODE_CATEGORY_ID_UP'},
                    {label: 'MAPPING_YN', name: 'MAPPING_YN'},
                    {label: 'USER_NM', name: 'USER_NM'},
                    {label: 'REG_DT', name: 'REG_DT', formatter(cellValue) {
                        return vm.formatDate(cellValue);
                    }},
                ],
                rowNum: vm.viewModel.pager.rowSize,
                pager: '#pager',
                viewrecords: true,
                height: 'auto',
                shrinkToFit: true,
                autowidth: true,
                sortable: true,
                onSelectRow: function (id) {
                    // 선택된 행 데이터 가져오기
                    var rowData = $("#codeList").jqGrid('getRowData', id);

                    // 예외 처리
                    if (!rowData || !rowData.CODE_CATEGORY_ID) {
                        console.error('선택된 행의 데이터가 유효하지 않습니다.');
                        return;
                    }

                    var firstData = rowData.CODE_CATEGORY_ID;

                    // Vue Router로 페이지 이동
                    vm.$router.push({ name: 'codedetail', params: { id: firstData } });
                }
            });
            $("#codeList").setGridWidth($(".grid-container").width() - 1);
        },
        formatDate: function (cellValue) {
            return moment(cellValue).format('YYYY-MM-DD HH:mm:ss');
        }
    }
}
</script>
