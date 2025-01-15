<template>
<div>
    <div class="contents">
        <div class="box">
            <h3>시즌목록</h3>
            <div>
                <div class="table_top">
                    <div class="total_count">전체 <em id="total_cnt">0</em>건</div>
                    <div class="table_service">
                        <router-link to="/write" class="btn btn-darkblue">등록</router-link>
                    </div>
                </div>
                <table class="table" id="seasonList">
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

        vm.fnList();
    },
    methods: {
        fnList: function () {
            let vm = this;

            let senddata = {
                
            };

            Axios.post("/getSeasonList.do", senddata).then (function (rs) {
                vm.viewModel.list = rs.data.list;
                $("#total_cnt").text(rs.data.totalCNT);

                vm.setGrid();
            });

        },
        setGrid: function () {
            let vm = this;

            let colMod = [
                {name: 'st_season', index: 'st_season', align: 'center'},
                {name: 'dt_season_st', index: 'dt_season_st', align: 'center'},
                {name: 'dt_season_ed', index: 'dt_season_ed', align: 'center'}
            ];
            
            $("#seasonList").jqGrid({
                dataType : 'local',
                data : vm.viewModel.list,
                colNames : ['시즌 년도', '시즌 시작일', '시즌 종료일'],
                colModel : colMod,
                rowNum : vm.viewModel.pager.rowSize,
                pager : '#pager',
                sortname : 'st_season',
                viewrecords: true,
                sortable: true,
                sortorder : 'DESC',
                height : 'auto',
                autowidth: true,
                shrinkToFit: true,
                onSelectRow: function (id) {
                    var rowData = $('#seasonList').getRowData(id);
                    vm.$router.push({path: '/'+rowData.st_season, name: 'seasondetail', params : {sn : rowData.st_season}});
                }
            })
            
        },

    }
}
</script>
