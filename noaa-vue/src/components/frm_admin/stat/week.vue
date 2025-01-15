<template>
<div>
    <div class="contents">
        <div class="box">
            <h3>요일별 목록</h3>
            <div>
                <div class="datepicker_box">
                    <input type="text" class="datepicker" id="sdt" placeholder="날짜 시작일" title="날짜 시작일" readonly :ref="'sdt'">
                </div>
                <span>~</span>
                <div class="datepicker_box">
                    <input type="text" class="datepicker" id="edt" placeholder="날짜 종료일" title="날짜 종료일" readonly :ref="'edt'">
                </div>
                <div>
                    <button class="btn btn-default" @click="fnList(0)"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-search"></use></svg>검색</button>
                </div>
                <div class="table_top">
                    <div class="total_count">전체 <em id="total_cnt">{{ viewModel.pager.totalSize == 0 ? 0 : viewModel.pager.totalSize-1 }}</em>건</div>
                    <div class="table_service">
                        <!-- <router-link to="/write" class="btn btn-darkblue">등록</router-link> -->
                        <button v-if="viewModel.pager.totalSize > 0" class="btn btn-white" @click="fnExcelDownload"><i class="icon_excel"></i></button>
                    </div>
                </div>
                <table class="table">
                    <thead>
                        <tr>
                            <th>구분</th>
                            <th>경기수</th>
                            <th>예매매수</th>
                            <th>현장매수</th>
                            <th>합계</th>
                            <th>평균매수</th>
                            <th>예매율</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, i) in viewModel.list.filter(data => data.GWEEK !== '합계')" :key="i">
                            <td>{{ item.GWEEK }}</td>
                            <td>{{ item.GAME_CNT }}</td>
                            <td>{{ item.TICKET_CNT_Y }}</td>
                            <td>{{ item.TICKET_CNT_H }}</td>
                            <td>{{ item.TOTAL_CNT }}</td>
                            <td>{{ item.AVR_TICKET }}</td>
                            <td>{{ item.AVR_CNT }}</td>
                        </tr>
                    </tbody>
                    <tfoot>
                        <tr v-for="(item, i) in viewModel.list.filter(data => data.GWEEK === '합계')" :key="'tfoot-' + i">
                            <td>{{ item.GWEEK }}</td>
                            <td>{{ item.GAME_CNT }}</td>
                            <td>{{ item.TICKET_CNT_Y }}</td>
                            <td>{{ item.TICKET_CNT_H }}</td>
                            <td>{{ item.TOTAL_CNT }}</td>
                            <td>{{ item.AVR_TICKET }}</td>
                            <td>{{ item.AVR_CNT }}</td>
                        </tr>
                    </tfoot>
                </table>
                <div id="pager">
                    <pager :pass="viewModel.pager"></pager>
                </div>
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
import pager from "../../../common/vue/paging.vue";
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
                    rowSize: 10,
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
        // setTimeout(function () {
        vm.viewModel.userInfo = vm.$store.state.global.userInfo;
        // vm.fnGetSelectList(0);
        // let data = {
        //     mapperId: 'comm.selectAllBplcList',
        //     dept_sn: vm.$store.state.global.userInfo.dept_sn == 0 || vm.$store.state.global.userInfo.dept_sn == 2 ? '' : vm.$store.state.global.userInfo.dept_sn,
        //     team_sn: vm.$store.state.global.userInfo.team_sn == 0 ? '' : vm.$store.state.global.userInfo.team_sn,
        //     gbn: 'each',
        //     bplc_use_yn:'A'
        // };
        // Axios.post("/list.do", data).then(function (rs) {
        //     vm.viewModel.bplcList = rs.data.list;
        // });
        // },100);
        vm.$router.afterEach((to, from) => {
            vm.fnList(vm.viewModel.pager.pageNo);
        });
        vm.fnSetDate();
        vm.fnList();
    },
    methods: {
        fnList: function () {
            let vm = this;

            let send = {
                pageNo:vm.viewModel.pager.pageNo,
                pageSize:vm.viewModel.pager.rowSize,
                dt_game_s:$('#sdt').val(),
                dt_game_e:$('#edt').val(),
            };

            Axios.post("/getWeekList.do", send).then (function (rs) {
                vm.viewModel.list = rs.data.list;
                vm.viewModel.pager.totalSize = rs.data.totalCNT;
                pager.props = pager.methods.createPaging(vm.viewModel.pager, vm, "list");
            });

        },
        fnSetDate: function(){
            const today = new Date();

            // Format date to YYYY-MM-DD
            const formatDate = (date) => {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
            };

            // Get previous 1 month
            const prevMonth = new Date(today);
            prevMonth.setMonth(today.getMonth() - 1);


            $('#sdt').val(formatDate(prevMonth));
            $('#edt').val(formatDate(today));
        },
        fnExcelDownload: function () {
                let vm = this;
                let excelList = [];
                let send = {
                    pageNo:vm.viewModel.pager.pageNo,
                    pageSize:vm.viewModel.pager.rowSize,
                    dt_game_s:$('#sdt').val(),
                    dt_game_e:$('#edt').val(),
                };
                Axios.post("/getWeekList.do", send)
                    .then(function (response) {
                        excelList = response.data.list;
                        // console.log(excelList);
                        for (const ex of excelList) {
                            
                            let excel = {구분:'', 경기수:'', 예매매수:'', 현장매수:'', 합계:'', 평균매수:'', 평균예매율:'',};

                            excel.구분 = ex.GWEEK;
                            excel.경기수 = ex.GAME_CNT;
                            excel.예매매수 = ex.TICKET_CNT_Y;
                            excel.현장매수 = ex.TICKET_CNT_H;
                            excel.합계 = ex.TOTAL_CNT;
                            excel.평균매수 = ex.AVR_TICKET;
                            excel.평균예매율 = ex.AVR_CNT;

                            vm.excelDownload.push(excel);
                        }
                        try {
                            const workBook = Xlsx.utils.book_new();
                            const workSheet = Xlsx.utils.json_to_sheet(vm.excelDownload);
                            Xlsx.utils.book_append_sheet(workBook, workSheet, '요일별 현황');
                            Xlsx.writeFile(workBook, '요일별 현황.xlsx');
                            vm.excelDownload = [];
                        } catch (er) {
                            console.log("Download error " + er);
                        };
                    })
                        
            },
        // setGrid: function () {
        //     let vm = this;

        //     let colMod = [
        //         {name: 'st_season', index: 'st_season', align: 'center'},
        //         {name: 'dt_season_st', index: 'dt_season_st', align: 'center'},
        //         {name: 'dt_season_ed', index: 'dt_season_ed', align: 'center'}
        //     ];
            
        //     $("#seasonList").jqGrid({
        //         dataType : 'local',
        //         data : vm.viewModel.list,
        //         colNames : ['시즌 년도', '시즌 시작일', '시즌 종료일'],
        //         colModel : colMod,
        //         rowNum : vm.viewModel.pager.rowSize,
        //         pager : '#pager',
        //         sortname : 'st_season',
        //         viewrecords: true,
        //         sortable: true,
        //         sortorder : 'DESC',
        //         height : 'auto',
        //         autowidth: true,
        //         shrinkToFit: true,
        //         onSelectRow: function (id) {
        //             var rowData = $('#seasonList').getRowData(id);
        //             vm.$router.push({path: '/'+rowData.st_season, name: 'seasondetail', params : {sn : rowData.st_season}});
        //         }
        //     })
            
        // },

    }
}
</script>
