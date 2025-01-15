<template>
    <div>
        <div class="search_area">
            <button class="btn_toggle_search">검색</button>
            <div>
                <div class="search_container">
                    <div class="row">
                        <div class="input_group" style="width:20rem" v-if="viewModel.userInfo.user_roles == 'ROLE_001'">
                            <select id="list" v-model="viewModel.search.bplc_use_yn" class="wp28">
                                <option value="A">전체</option>
                                <option value="Y" selected="selected">운영</option>
                                <option value="N">종료</option>
                            </select>
                            <select title="현장명" v-model="viewModel.search.bplc_sn">
                                <option value=''>현장명 선택</option>
                                <option v-for="(item, i) in viewModel.searchBplcList" :key="i" :value="item.bplc_sn">{{ item.bplc_nm }}</option>
                            </select>
                        </div>
                        <!-- <input type="text" placeholder="팀명 입력하세요." title="팀명 입력" v-model="viewModel.search.bplc_team"> -->
                        <div class="datepicker_box">
                            <input type="text" class="datepicker" id="sdt" placeholder="등록일" title="등록일" readonly ref="sdt">
                        </div>
                        <span>~</span>
                        <div class="datepicker_box">
                            <input type="text" class="datepicker" id="edt" placeholder="등록일" title="등록일" readonly ref="edt">
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
                    <caption>점검활동</caption>
                    <thead>
                        <tr>
                            <th scope="col" class="w50" rowspan="2">번호</th>
                            <th scope="col" rowspan="2" v-if="viewModel.userInfo.user_roles == 'ROLE_001'">현장명</th>
                            <!-- <th scope="col" rowspan="2">팀명</th> -->
                            <th scope="col" rowspan="2">작성자</th>
                            <th scope="col" rowspan="2">등록일</th>
                            <th scope="col" rowspan="2">점검활동결과</th>
                            <th scope="col" rowspan="2">일일안전점검일지</th>
                            <th scope="col" colspan="2">결재</th>
                            <th scope="col" rowspan="2">관리</th>
                        </tr>
                        <tr>
                            <th scope="col">안전</th>
                            <th scope="col">소장</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, i) in viewModel.list" :key="i">
                            <td>{{(viewModel.pager.pageNo==1) ? viewModel.pager.totalSize-i : viewModel.pager.totalSize-((viewModel.pager.rowSize*(viewModel.pager.pageNo-1))+i)}}</td>
                            <td class="text-left" v-if="viewModel.userInfo.user_roles == 'ROLE_001'">{{ item.bplc_nm }}</td>
                            <!-- <td class="text-left"><router-link :to="'/detail/'+item.diary_sn" class="btn-link">{{ item.bplc_team }}</router-link></td> -->
                            <td>{{ item.wrtr_nm }}</td>
                            <td>{{ item.wrt_dt|yyyyMMdd }}</td>
                            <td>
                                <button class="btn btn-small btn-white" v-if="item.chck_cnt > 0" @click="fnPopup(item.diary_sn)">조회</button>
                            </td>
                            <td>
                                <button :class="'btn btn-small btn-blue'" @click="fnViewPopup(item.diary_sn);"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-manage-search"></use></svg>미리보기</button>
                            </td>
                            <td>
                                <router-link :to="'/detail/'+item.diary_sn" class="btn btn-small btn-approval" v-if="item.safe_mngr == viewModel.userInfo.user_id && item.safe_mngr_sign_yn != 'Y'"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-approval"></use></svg>결재 요청</router-link>
                                <span class="btn btn-small btn-approval complete" v-else-if="item.safe_mngr == viewModel.userInfo.user_id && item.safe_mngr_sign_yn == 'Y'"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-user-check"></use></svg>결재 완료</span>
                                <span v-else-if="item.safe_mngr != viewModel.userInfo.user_id && item.safe_mngr == ''"></span>
                                <span v-else-if="item.safe_mngr != viewModel.userInfo.user_id && item.safe_mngr_sign_yn == 'Y'">결재완료</span>
                                <span v-else-if="item.safe_mngr != viewModel.userInfo.user_id && item.safe_mngr_sign_yn != 'Y'">결재요청</span>
                            </td>
                            <td>
                                <router-link :to="'/detail/'+item.diary_sn" class="btn btn-small btn-approval" v-if="item.bplc_mngr == viewModel.userInfo.user_id && item.bplc_mngr_sign_yn != 'Y' && (item.safe_mngr == '' || item.safe_mngr_sign_yn == 'Y')"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-approval"></use></svg>결재 요청</router-link> 
                                <span class="btn btn-small btn-approval" v-else-if="item.bplc_mngr == viewModel.userInfo.user_id && item.bplc_mngr_sign_yn != 'Y' && item.safe_mngr != '' && item.safe_mngr_sign_yn != 'Y'"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-approval-ongoing"></use></svg>진행 중</span>
                                <span class="btn btn-small btn-approval complete" v-else-if="item.bplc_mngr == viewModel.userInfo.user_id && item.bplc_mngr_sign_yn == 'Y'"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-user-check"></use></svg>결재 완료</span>
                                <span v-else-if="item.bplc_mngr != viewModel.userInfo.user_id && item.bplc_mngr_sign_yn == 'Y'">결재완료</span>
                                <span v-else-if="item.bplc_mngr != viewModel.userInfo.user_id && item.bplc_mngr_sign_yn != 'Y' && item.safe_mngr_sign_yn != 'Y'" >진행중</span>
                                <span v-else-if="item.bplc_mngr != viewModel.userInfo.user_id && item.bplc_mngr_sign_yn != 'Y'">결재요청</span>
                            </td>
                            <td>
                                <router-link :to="'/detail/'+item.diary_sn" class="btn btn-icon"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-content-search"></use></svg></router-link>
                                <template v-if="item.reg_id == viewModel.userInfo.user_id">
                                    <button class="btn btn-icon" @click="fnUpdate(item.diary_sn, item.bplc_mngr_sign_yn);"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-edit-contents"></use></svg></button>
                                    <button class="btn btn-icon" @click="fnDelete(item.diary_sn)"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-delete-sweep"></use></svg></button>
                                </template>
                            </td>
                        </tr>
                        <tr v-if="viewModel.list.length == 0"><td :colspan="viewModel.userInfo.user_roles == 'ROLE_001' ? '9' : '8'">게시물이 없습니다.</td></tr>
                    </tbody>
                </table>
                <div class="table_footer">
                    <pager :pass="viewModel.pager"></pager>
                    <div class="btn-group"> 
                       <router-link to="/write" class="btn btn-purple"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-post-add"></use></svg>등록</router-link>
                    </div>
                </div>
            </div>
        </div>
        <viewPopup ref="viewPopup" v-if="viewPop==true"></viewPopup>
        <rgstChkPopup ref="rgstChkPopup" v-if="chkPop==true"></rgstChkPopup>
    </div>
    </template>
    
<script>
    import "es6-promise/auto";
    import Vue from "vue";
    import Axios from "axios";
    import Pager from "../../../../common/vue/paging.vue";
    import Common from '../../../../common/js/common.js';
    import Message, {messageUtil} from "../../../../common/js/message";
    import rgstChkPopup from "./popup/rgstDiyChkPopup.vue";
    import viewPopup from "./popup/rgstDiyChkFormViewPopup.vue";
    
    export default {
        components: {
            'pager': Pager,
            'rgstChkPopup': rgstChkPopup,
            'viewPopup': viewPopup
        },
        data: function() {
            return {
                chkPop:false,
                viewPop:false,
                viewModel:{
                    search:{
                        bplc_sn:'',
                        bplc_use_yn:'',
                        chk_type:''
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
            calendarInput();

            vm.$router.afterEach(function(to, from){
                vm.fnList(vm.viewModel.pager.pageNo);
            })
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
            //초기화
            fnRefresh: function(){
                let vm = this;
                vm.viewModel.search = {
                    bplc_use_yn : vm.viewModel.userInfo.bplc_yn == 'N' ? 'Y' : 'A',
                    bplc_sn: (vm.viewModel.userInfo.bplc_yn == 'N' && (vm.viewModel.userInfo.bplc_sn == 0 || vm.viewModel.userInfo.bplc_use_yn == 'N')) ? '' : vm.viewModel.userInfo.bplc_sn,
                    chk_type:''
                }
                
               vm.$refs.sdt.value = "";
               vm.$refs.edt.value = "";
            },
            fnInit: function(){
                let vm = this;
                vm.viewModel.userInfo = vm.$store.state.global.userInfo;
                vm.viewModel.search.bplc_use_yn = vm.viewModel.userInfo.bplc_yn == 'N' ? 'Y' : 'A';
                vm.viewModel.search.bplc_sn = (vm.viewModel.userInfo.bplc_yn == 'N' && (vm.viewModel.userInfo.bplc_sn == 0 || vm.viewModel.userInfo.bplc_use_yn == 'N')) ? '' : vm.viewModel.userInfo.bplc_sn;
                
                vm.fnList(1);
            },
            //목록 조회
            fnList:function(paramPageNo){
                let vm = this;
                vm.viewModel.pager.pageNo = paramPageNo == undefined ? vm.viewModel.pager.pageNo : paramPageNo;

                let send = {
                    pageYn:'Y',
                    pageNo: vm.viewModel.pager.pageNo,
                    pageSize: vm.viewModel.pager.rowSize,
                    user_id: vm.viewModel.userInfo.user_id,
                    bplc_team: vm.viewModel.search.bplc_team,
                    wrt_dt_s: vm.$refs.sdt.value,
                    wrt_dt_e: vm.$refs.edt.value,
                    bplc_use_yn: vm.viewModel.search.bplc_use_yn,
                    bplc_sn: vm.viewModel.search.bplc_sn,
                    bplc_yn: vm.viewModel.userInfo.bplc_yn,
                    u_bplc_sn: vm.viewModel.userInfo.bplc_sn,
                    dept_sn: vm.viewModel.userInfo.dept_sn,
                    team_sn: vm.viewModel.userInfo.team_sn,
                }

                Axios.post("/selectDiyChkActList.do", send)
                .then(function(response) {
                    vm.viewModel.list = response.data.list;
                    vm.viewModel.pager.totalSize = response.data.totalCNT;
                    
                    //페이징세팅
                    Pager.props = Pager.methods.createPaging(vm.viewModel.pager, vm, "list");
                    
                    //조회조건 현장명
                    // vm.viewModel.searchBplcList = response.data.searchBplcList;
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
            fnBplcList: function() { //사업장 리스트 추출(검색)
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
            fnDelete: function(sn){
                let vm = this;
                let send = {
                    diary_sn: sn,
                    reg_id: vm.viewModel.userInfo.user_id,
                }

                if(confirm(Message.DELETE_CONFIRM)){
                    Axios.post("/deleteDiyChk.do", send)
                    .then(function(response) {
                        if(response.data == 1){
                            alert("삭제가 완료되었습니다.");
                            vm.fnList(vm.viewModel.pager.pageNo);
                        }
                    }).catch(function(ex) {
                        alert(Message.ERROR);
                    });
                }
            },
            fnPopup: function(sn) {
                let vm = this;
                vm.chkPop=true;
                vm.viewPop = false;
                vm.$nextTick(function() {
                    if(vm.chkPop) {
                        vm.$refs.rgstChkPopup.fnInit(sn);
                    }
                })
            },
            fnUpdate: function(sn, sign_yn){
                let vm = this;

                if(sign_yn == 'Y'){
                    alert("현장소장이 결재를 완료하여 수정이 불가합니다.");
                    return false;
                }else{
                    vm.$router.push('/write/'+sn);
                }
            },
            fnViewPopup: function(sn){
                let vm = this;
                vm.chkPop=false;
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