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
                    <label for="">
                        산정기준년월
                        <div class="datepicker_box">
                            <!--  v-model="viewModel.ym_calcu_basic" -->
                            <input type="text" class="datepicker month" title="멤버십기간" placeholder="날짜 선택" readonly >
                        </div>
                    </label>
                </div>
            </div>
        </div>
        <div class="box">
            <div>
                <div class="table_top">
                    <div class="total_count">전체 <em id="total_cnt">0</em>건</div>
                    <div class="table_service">
                        <button class="btn btn-darkblue"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-person-add"></use></svg>등록</button>
                    </div>
                </div>
                <table class="table" id="gradeList">
                </table>
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
                codeList: [],
                colNames: [],
                colValue: [],
                gradeList: [],
                userInfo: {},
                bplc_sn: "",
                pager: {
                    model: {},
                    pageNo: 1,
                    totalSize: 0,
                    rowSize: 10,
                    blockSize: 10,
                    gradeList: [],
                    callBack: function (n) {
                        this.model.fnGetSelectList(n);
                    }
                },
            }
        }
    },
    mounted: function () {
        let vm = this;

        let searchCode = ['CD_GRADE'];

        common.fnGetBaseCodeJson(searchCode).then(result => {
            vm.viewModel.codeList = result;
            
            vm.viewModel.colNames = ['산정기준년월', '등급구분', '등급구분코드'];

            vm.viewModel.codeList.forEach(element => {
                vm.viewModel.colNames.push(element.code_name);
                vm.viewModel.colValue.push(element.code);
            });

            vm.fnList();
        }).catch(error => {
            console.error('Error:', error); // 에러 처리
        });

    },
    methods: {
        fnReset: function () {
            let vm = this;

            $(".datepicker_box > input").val('');
            //vm.viewModel.ym_calcu_basic = '';

            vm.fnList();
        },
        fnList: function () {
            let vm = this;

            let data = {
                code_arr: vm.viewModel.colValue
            };

            if ($(".datepicker_box > input").val() != null && $(".datepicker_box > input").val() != undefined && $(".datepicker_box > input").val() != '') {
                data.ym_calcu_basic = $(".datepicker_box > Input").val().split("-")[0]+$(".datepicker_box > Input").val().split("-")[1];
            }

            /*
            if (vm.viewModel.ym_calcu_basic != null && vm.viewModel.ym_calcu_basic != undefined && vm.viewModel.ym_calcu_basic != '') {
                data.ym_calcu_basic = vm.viewModel.ym_calcu_basic.split("-")[0]+vm.viewModel.ym_calcu_basic.split("-")[1];
            }
            */

            Axios.post("/getGradeList.do", data)
            .then (function (rs) {
                vm.viewModel.gradeList = rs.data.list;
                $("#total_cnt").text(rs.data.totalCNT);

                vm.setGrid();
            });

        },
        setGrid: function () {
            let vm = this;

            let colMod = [
                {name: 'YM_CALCU_BASIC', index: 'YM_CALCU_BASIC', align: 'center', width : 80},
                {name: 'NM_TP_GRADE', index: 'NM_TP_GRADE', align: 'center', width : 50, code_category: 'CD_TP_GRADE'},
                {name: 'CD_TP_GRADE', index: 'CD_TP_GRADE', align: 'center', width : 0, hidden: true}
            ];
            vm.viewModel.colNames.forEach((element,idx) => {
                if (idx > 2) {
                    let str = vm.fnGetString(element);
                    colMod.push({name: 'NM_CONDITION'+str, index: 'NM_CONDITION'+str, align: 'center', width: 50});
                }
            });

            $("#gradeList").jqGrid("GridUnload");
            
            $("#gradeList").jqGrid({
                dataType: 'local',
                data: vm.viewModel.gradeList,
                colNames: vm.viewModel.colNames,
                colModel: colMod,
                rowNum: vm.viewModel.pager.rowSize,
                pager: '#pager',
                viewrecords: true,
                height: 'auto',
                shrinkToFit: true,
                autowidth: true,
                sortable: true,
                onSelectRow: function (id) {
                    // 선택된 행 데이터 가져오기
                    var rowData = $("#gradeList").jqGrid('getRowData', id);

                    // 예외 처리
                    if (!rowData || !rowData.YM_CALCU_BASIC) {
                        console.error('선택된 행의 데이터가 유효하지 않습니다.');
                        return;
                    }

                    var firstData = rowData.YM_CALCU_BASIC;

                    // Vue Router로 페이지 이동
                    vm.$router.push({ name: 'gradeWrite', params: { ym_calcu_basic: firstData } });
                }
            });
        },
        fnGetString: function (code) {
            let str = "";
            switch (code) {
                case "DIAMOND":
                    str = "_17";
                    break;
                case "PLATINUM":
                    str = "_16"
                    break;
                case "BRONZE":
                    str = "_15"
                    break;
                case "SILVER":
                    str = "_14"
                    break;
                case "GOLD":
                    str = "_13"
                    break;
                case "VIP":
                    str = "_12"
                    break;
                case "VVIP":
                    str = "_11"
                    break;
                case "FREE":
                    str = "_99"
                    break;
                default:
                    break;
            }

            return str;
        },
        fnGroupString: function (code) {
            let str = "";
            switch (code) {
                case "A":
                    str = "일반";
                    break;
                case "B":
                    str = "블루";
                    break;
                case "C":
                    str = "블루패밀리 개인";
                    break;
                case "D":
                    str = "블루패밀리 기업";
                    break;
                default:
                    str = "일반";
                    break;
            }
            return str;
        }
    }
}
</script>
