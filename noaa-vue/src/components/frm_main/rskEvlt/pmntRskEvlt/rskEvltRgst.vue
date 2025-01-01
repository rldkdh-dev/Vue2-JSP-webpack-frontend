<template>
    <div>
        <div class="search_area">
            <button class="btn_toggle_search">검색</button>
            <div>
                <div class="search_container">
                    <div class="row">
                        <div class="input_group" style="width:20rem" v-if="viewModel.userInfo.bplc_yn != 'Y'">
                            <select id="list" v-model="viewModel.search.bplc_use_yn" class="wp28">
                                <option value="A">전체</option>
                                <option value="Y" selected="selected">운영</option>
                                <option value="N">종료</option>
                            </select>
                                <select title="현장명" v-model="viewModel.search.bplc_sn">
                                <option value="">현장명 선택</option>
                                <option v-for="(item, i) in viewModel.searchBplcList" :key="i" :value="item.bplc_sn">{{ item.bplc_nm }}</option>
                            </select>
                        </div>
                        <div class="datepicker_box">
                            <input type="text" class="datepicker" id="sdt" placeholder="평가시작일" title="평가시작일" readonly ref="sdt">
                        </div>
                        <span>~</span>
                        <div class="datepicker_box">
                            <input type="text" class="datepicker" id="edt" placeholder="평가시작일" title="평가시작일" readonly ref="edt">
                        </div>
                    </div>
                </div>
                <div class="btn-group">
                    <button class="btn btn-default-line" @click="fnRefresh()"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-refresh"></use></svg>초기화</button>
                    <button class="btn btn-default" @click="fnList(1)"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-search"></use></svg>검색</button>
                </div>
            </div>
        </div>
        <div class="contents">
            
            <div>
                <div class="table_top">
                    <div class="total_count">총 <em>{{ viewModel.pager.totalSize }}</em>건</div>
                    <!-- <div class="icon_box">
                        <button class="btn btn-white"><i class="icon_pdf"></i></button>
                        <button class="btn btn-white"><i class="icon_word"></i></button>
                        <button class="btn btn-white"><i class="icon_ppt"></i></button>
                        <button class="btn btn-white"><i class="icon_excel"></i></button>
                    </div> -->
                    <select title="데이터 표출 개수" v-model="viewModel.pager.rowSize" @change="fnChangeCNTSelect(viewModel.pager.rowSize);">
                        <option value="10">10개씩 보기</option>
                        <option value="30">30개씩 보기</option>
                        <option value="50">50개씩 보기</option>
                        <option value="100">100개씩 보기</option>
                    </select>
                </div>
                <table class="table">
                    <caption>상시 위험성평가 등록</caption>
                    <thead>
                        <tr>
                            <th scope="col" rowspan="2" class="w50">번호</th>
                            <th scope="col" rowspan="2" v-if="viewModel.userInfo.bplc_yn != 'Y'">현장명</th>
                            <th scope="col" rowspan="2">공종명</th>
                            <th scope="col" colspan="2">평가기간</th>
                            <th scope="col" rowspan="2">위험성평가등록부</th>
                            <th scope="col" rowspan="2">작성일</th>
                            <th scope="col" rowspan="2">관리</th>
                        </tr>
                        <tr>
                            <th>시작일</th>
                            <th>종료일</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, i) in viewModel.list" :key="i">
                            <td>{{(viewModel.pager.pageNo==1) ? viewModel.pager.totalSize-i : viewModel.pager.totalSize-((viewModel.pager.rowSize*(viewModel.pager.pageNo-1))+i)}}</td>
                            <td class="text-left" v-if="viewModel.userInfo.bplc_yn != 'Y'">{{ item.bplc_nm }}</td>
                            <td class="text-left"><router-link :to="'/detail/'+item.reg_sn" class="btn-link">{{ item.work_type_nm }}</router-link></td>
                            <td>{{ item.evl_bgng_dt|yyyyMMdd }}</td>
                            <td>{{ item.evl_end_dt|yyyyMMdd }}</td>
                            <td>
                                <button :class="'btn btn-small btn-blue'" @click="fnViewPopup(item.reg_sn);"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-manage-search"></use></svg>미리보기</button>
                            </td>
                            <td>{{ item.wrt_dt|yyyyMMdd }}</td>
                            <td>
                                <router-link :to="'/detail/'+item.reg_sn" class="btn btn-icon"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-content-search"></use></svg></router-link>
                                <template v-if="item.reg_id == viewModel.userInfo.user_id">
                                    <router-link :to="'/write/'+item.reg_sn" class="btn btn-icon"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-edit-contents"></use></svg></router-link>
                                </template>
                            </td>
                        </tr>
                        <tr v-if="viewModel.list.length == 0"><td :colspan="viewModel.userInfo.bplc_yn != 'Y' ? '8' : '7'">게시물이 없습니다.</td></tr>
                    </tbody>
                </table>
                <div class="table_footer">
                    <pager :pass="viewModel.pager"></pager>
                    <!-- <div class="btn-group"> 
                        <router-link :to="'/write'" class="btn btn-purple"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-post-add"></use></svg>등록</router-link>
                    </div> -->
                </div>
            </div>
        </div>
        <viewPopup ref="viewPopup" v-if="viewPop==true"></viewPopup>
    </div>
    </template>
    
    <script>
        import "es6-promise/auto";
        import Vue from "vue";
        import Axios from "axios";
        import Common from '../../../../common/js/common.js';
        import Pager from "../../../../common/vue/paging.vue";
        import Message, {messageUtil} from "../../../../common/js/message";
        import viewPopup from "./popup/rskEvltRgstViewPopup.vue";

        export default {
            components: {
                'pager': Pager,
                'viewPopup': viewPopup
            },
            data: function() {
                return {
                    viewPop:false,
                    viewModel:{
                        search:{
                            bplc_sn:'',
                            bplc_use_yn:''
                        },
                        userInfo:{},
                        list: [],
                        searchBplcList: [],
                        pager: {
                            model: {},
                            pageNo: 1,
                            totalSize: 0,
                            rowSize: 10,
                            blockSize: 10,
                            list: [],
                            callBack: function (n) {
                                try{
                                    this.model.fnList(n);
                                } catch(e){
                                    console.log('callback error  ' + e);
                                }
                            }
                        },
                    }
                };
            },
            mounted: function() {
                let vm = this;
                vm.fnInit();
                vm.$router.afterEach(function(to, from){
                    vm.fnList(vm.viewModel.pager.pageNo);
                });
            },
            watch: {
                'viewModel.search.bplc_use_yn': {
                    handler() {
                        let vm = this;
                        if(vm.viewModel.userInfo.user_roles == 'ROLE_001'){
                            vm.fnBplcList();
                        }
                    }
                }
            },
            methods: {
                 //기본세팅
                 fnInit:function(){
                    let vm = this;
                    vm.viewModel.userInfo = vm.$store.state.global.userInfo;
                    vm.viewModel.search.bplc_use_yn = vm.viewModel.userInfo.bplc_yn == 'N' ? 'Y' : 'A';
                    vm.viewModel.search.bplc_sn = (vm.viewModel.userInfo.bplc_yn == 'N' && (vm.viewModel.userInfo.bplc_sn == 0 || vm.viewModel.userInfo.bplc_use_yn == 'N')) ? '': vm.viewModel.userInfo.bplc_sn;

                    vm.fnList(1);
                    calendarInput();
                },
                fnBplcList: function(){
                    let vm = this;
                    let data = {
                        mapperId: 'comm.selectAllBplcList',
                        bplc_use_yn: vm.viewModel.search.bplc_use_yn,
                        dept_sn: vm.viewModel.userInfo.dept_sn,
                        team_sn: vm.viewModel.userInfo.team_sn,
                    };
                    Axios.post("/list.do", data).then(function (rs) {
                        vm.viewModel.searchBplcList = rs.data.list;
                        
                        vm.viewModel.search.bplc_sn = '';
                        if(vm.viewModel.userInfo.bplc_use_yn == 'Y' && vm.viewModel.search.bplc_use_yn == 'Y'){
                            vm.viewModel.search.bplc_sn = vm.viewModel.userInfo.bplc_sn == 0 ? '' : vm.viewModel.userInfo.bplc_sn;
                        }
                    });
                },
                //초기화
                fnRefresh: function(){
                    let vm = this;
                    vm.viewModel.search = {
                        bplc_sn : (vm.viewModel.userInfo.bplc_yn == 'N' && (vm.viewModel.userInfo.bplc_sn == 0 || vm.viewModel.userInfo.bplc_use_yn == 'N')) ? '' : vm.viewModel.userInfo.bplc_sn,
                        bplc_use_yn : vm.viewModel.userInfo.bplc_yn == 'N' ? 'Y' : 'A',
                    }

                    vm.$refs.sdt.value = "";
                    vm.$refs.edt.value = "";
                },
                //목록 조회
                fnList:function(paramPageNo){
                    let vm = this;
                    vm.viewModel.pager.pageNo = paramPageNo == undefined ? vm.viewModel.pager.pageNo : paramPageNo;
    
                    let send = {
                        pageYn:'Y',
                        pageNo: vm.viewModel.pager.pageNo,
                        pageSize: vm.viewModel.pager.rowSize,
                        bplc_sn: vm.viewModel.search.bplc_sn,
                        evl_bgng_dt_s: vm.$refs.sdt.value,
                        evl_bgng_dt_e: vm.$refs.edt.value,
                        bplc_yn: vm.viewModel.userInfo.bplc_yn,
                        u_bplc_sn: vm.viewModel.userInfo.bplc_sn,
                        reg_id: vm.viewModel.userInfo.user_id,
                        bplc_use_yn: vm.viewModel.search.bplc_use_yn,
                        dept_sn: vm.viewModel.userInfo.dept_sn,
                        team_sn: vm.viewModel.userInfo.team_sn,
                    }
                    Axios.post("/selectRskEvltRgstList.do", send)
                    .then(function(response) {
                        vm.viewModel.list = response.data.list;
                        vm.viewModel.pager.totalSize = response.data.totalCNT;
    
                        // //조회조건 현장명
                        // vm.viewModel.searchBplcList = response.data.searchBplcList;
    
                        Pager.props = Pager.methods.createPaging(vm.viewModel.pager, vm, "list");
                    });
                },
                //페이징 처리
                fnChangeCNTSelect: function(rowSize){
                    let vm = this;
                    if(rowSize != undefined || rowSize > 0){
                        vm.viewModel.pager.rowSize = rowSize
                        vm.fnList(1);
                    }
                },
                fnViewPopup: function(sn){
                    let vm = this;
                    vm.viewPop = true;
                    vm.$nextTick(function() {
                        if(vm.viewPop) {
                            vm.$refs.viewPopup.fnInit(sn);
                        }
                    })
                },
            }
        };
    </script>