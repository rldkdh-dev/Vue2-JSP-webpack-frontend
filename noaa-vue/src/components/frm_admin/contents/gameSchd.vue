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
                            일정
                            <div class="datepicker_box">
                                <input type="text" class="datepicker" title="일정" placeholder="날짜 선택" readonly id="dt_start" name="dt_start" >
                            </div>
                            <span>~</span>
                            <div class="datepicker_box">
                                <input type="text" class="datepicker" title="일정" placeholder="날짜 선택" readonly id="dt_end" name="dt_end" >
                            </div>  
                        </label>
                        
                        <label for="">
                            홈팀
                            <select title="홈팀" id="home" name="home" v-model="viewModel.search.home">
                                <option value="" default hidden>선택</option>
                                <option v-for="item in viewModel.teamList" :key="item" :value="item.code">{{ item.code_name }}</option>
                            </select>
                        </label>
                        
                        <label for="">
                            원정팀
                            <select title="원정팀" id="visitTeam" name="visitTeam" v-model="viewModel.search.visit">
                                <option value="" default hidden>선택</option>
                                <option v-for="item in viewModel.teamList" :key="item" :value="item.code">{{ item.code_name }}</option>
                            </select>
                        </label>
                        
                        <label for="">
                            구장
                            <select title="구장" id="stadium" name="stadium" v-model="viewModel.search.stadium">
                                <option value="" default hidden>선택</option>
                                <option v-for="item in viewModel.parkList" :key="item" :value="item.code">{{ item.code_name }}</option>
                            </select>
                        </label>
                        
                        <label for="cancelYN">취소여부<input type="checkbox" name="cancelYN" id="cancelYN" v-model="viewModel.search.cancel_yn"></label>
                    </div>            
                </div>
                <!-- <div class="search_container">
                    <div>
                        <label for="">
                            산정기준년월
                            <div class="datepicker_box">
                                <input type="text" class="datepicker month" title="멤버십기간" placeholder="날짜 선택" readonly >
                            </div>
                        </label>
                    </div>
                </div> -->
            </div>
            
            <div class="box">
                <div>
                    <div class="table_top">
                        <div class="total_count">전체 <em id="total_cnt">0</em>건</div>
                        <div class="table_service">
                            <button class="btn btn-green"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-excel"></use></svg>Excel 다운로드</button>
                            <router-link :to="{name: 'gameSchdExcelUpload'}" href="javascript:;" class="btn btn-green"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-excel"></use></svg>Excel 업로드</router-link>
                            <button class="btn btn-darkblue">등록</button>
                        </div>
                    </div>
                    <table class="table" id="gameSchdList">
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
import printJS from 'print-js';
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
                parkList: [],
                teamList: [],
                gameSchdList: [],
                userInfo: {},
                search: {
                    dt_start : '',
                    dt_end : '',
                    home: '',
                    visit: '',
                    stadium: '',
                    cancel_yn: false
                },
                pageNo: 1,
                totalSize: 0,
                rowSize: 10,
                blockSize: 10,
                // pager: {
                //     model: {},
                //     pageNo: 1,
                //     totalSize: 0,
                //     rowSize: 10,
                //     blockSize: 10,
                //     gameSchdList: [],
                //     callBack: function (n) {
                //         this.model.fnGetSelectList(n);
                //     }
                // },
            }
        }
    },
    mounted: function () {
        let vm = this;

        let searchCode = ['CD_BALLPARK', 'CD_TEAMNAME'];

        common.fnGetBaseCodeJson(searchCode).then(result => {
            
            vm.viewModel.parkList = result.filter(value => value.code_category_id === 'CD_BALLPARK');
            vm.viewModel.teamList = result.filter(value => value.code_category_id === 'CD_TEAMNAME');

            vm.fnList();
        }).catch(error => {
            console.error('Error:', error); // 에러 처리
        });

    },
    methods: {
        fnReset: function () {
            let vm = this;

            $(".datepicker_box > input").val('');
            vm.viewModel.search.home = "";
            vm.viewModel.search.visit = "";
            vm.viewModel.search.stadium = "";
            vm.viewModel.search.cancel_yn = "N";
            
        },
        fnList: function () {
            let vm = this;
            let data = {};

            if ($("#dt_start").val() != undefined && $("#dt_start").val() != null && $("#dt_start").val() != '') {
                data.dt_start = $("#dt_start").val();
            }

            if ($("#dt_end").val() != undefined && $("#dt_end").val() != null && $("#dt_end").val() != '') {
                data.dt_end = $("#dt_end").val();
            }

            if (vm.viewModel.search.home != null && vm.viewModel.search.home != undefined && vm.viewModel.search.home != '') {
                data.home = vm.viewModel.search.home;
            }

            if (vm.viewModel.search.visit != null && vm.viewModel.search.visit != undefined && vm.viewModel.search.visit != '') {
                data.visit = vm.viewModel.search.visit;
            }

            if (vm.viewModel.search.stadium != null && vm.viewModel.search.stadium != undefined && vm.viewModel.search.stadium != '') {
                data.stadium = vm.viewModel.search.stadium;
            }

            if ($("#cancelYN").is(":checked")) {
                data.cancel_yn = "Y";
            }

            Axios.post("/getGameSchdList.do", data)
            .then (function (rs) {
                console.log(rs);
                vm.viewModel.gameSchdList = rs.data.list;
                $("#total_cnt").text(rs.data.totalCNT);

                vm.setGrid();
            });
        },
        setGrid: function () {
            let vm = this;

            $("#gameSchdList").jqGrid("GridUnload");
            //
            $("#gameSchdList").jqGrid({
                dataType: 'local',
                data: vm.viewModel.gameSchdList,
                colNames: ['일련번호', '경기일정', '시간', '요일', '홈팀', '원정팀', '구장', '헤더', '취소여부', '선공점수', '후공점수', '승리'],
                colModel: [
                    {label: 'GMKEY', name:'GMKEY', key: true, hidden: true, align: 'center'},
                    {label: 'DATE', name: 'DATE', align: 'center', formatter(cellvalue) { 
                        return vm.formatYYMMDD(cellvalue); 
                    }},
                    {label: 'GTIME', name: 'GTIME', align: 'center'},
                    {label: 'GWEEK', name: 'GWEEK', align: 'center'},
                    {label: 'HOME', name: 'HOME', align: 'center'},
                    {label: 'VISIT', name: 'VISIT', align: 'center'},
                    {label: 'STADIUM', name: 'STADIUM', align: 'center'},
                    {label: 'DHEADER', name: 'DHEADER', align: 'center'},
                    {label: 'CANCEL_YN', name: 'CANCEL_YN', align: 'center'},
                    {label: 'TPOINT', name: 'TPOINT', align: 'center'},
                    {label: 'BPOINT', name: 'BPOINT', align: 'center'},
                    {label: 'WLS', name: 'WLS', align: 'center'}
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
                //     var rowData = $("#gameSchdList").jqGrid('getRowData', id);

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
            $("#gameSchdList").setGridWidth($(".grid-container").width() - 1);

        },
        formatYYMMDD: function (cellValue) {
            return moment(cellValue).format('YYYY-MM-DD');
        }
        
    }
}
</script>
