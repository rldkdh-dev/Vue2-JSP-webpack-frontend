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
                            <option selected value=''>현장명 선택</option>
                            <option v-for="(item, i) in viewModel.searchBplcList" :key="i" :value="item.bplc_sn">{{ item.bplc_nm }}</option>
                        </select>
                    </div>
                    <div class="datepicker_box">
                        <input type="text" class="datepicker" id="sdt" placeholder="시작일" value="" title="시작일" readonly>
                    </div>
                    <span>~</span>
                    <div class="datepicker_box">
                        <input type="text" class="datepicker" id="edt" placeholder="종료일" value="" title="종료일" readonly>
                    </div>
                    <input type="text" placeholder="작성자명을 입력하세요." title="작성자명 입력" v-model="viewModel.search.user_nm">
                </div>
            </div>
            <div class="btn-group">
                <button class="btn btn-default-line" @click="fnRefresh()"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-refresh"></use></svg>초기화</button>
                <button class="btn btn-default" @click="fnList(0)"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-search"></use></svg>검색</button>
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
                <select>
                    <option value="10">10개씩 보기</option>
                    <option value="30">30개씩 보기</option>
                    <option value="50">50개씩 보기</option>
                    <option value="100">100개씩 보기</option>
                </select>
            </div>
            <table class="table">
                <caption>액션플랜 등록</caption>
                <thead>
                    <tr>
                        <th scope="col" class="w50">번호</th>
                        <th scope="col" v-if="viewModel.userInfo.user_roles == 'ROLE_001'">현장명</th>
                        <th scope="col">작성자</th>
                        <th scope="col">작성일</th>
                        <th scope="col">현장소장</th>
                        <th scope="col">결과서</th>
                        <th scope="col">관리</th>
                    </tr>
                </thead>
                <tbody>
                    <template v-for="(item, i) in viewModel.list" :key="i">
                        <tr>
                            <td>{{(viewModel.pager.pageNo==1) ? viewModel.pager.totalSize-i : viewModel.pager.totalSize-((viewModel.pager.rowSize*(viewModel.pager.pageNo-1))+i)}}</td>
                            <td class="text-left" v-if="viewModel.userInfo.user_roles == 'ROLE_001'">{{ item.bplc_nm }}</td>
                            <td>{{ item.reg_nm }}</td>
                            <td>{{ item.reg_dt }}</td>
                            <td v-if="item.bplc_mngr_sign_yn == 'Y'">
                                <span class="btn btn-small btn-gray">
                                    결재완료
                                </span>
                            </td>
                            <td v-else-if="item.bplc_mngr_sign_yn != 'Y' && viewModel.userInfo.bplc_sn == item.bplc_sn && viewModel.userInfo.user_id == item.bplc_mngr">
                                <button class="btn btn-small btn-blue" @click="fnPopup(item.plan_sn, item.reg_id)" >
                                    결재
                                </button>
                            </td>
                            <td v-else></td>
                            <td>
                                <button class="btn btn-small btn-blue" @click.prevent="fnRsltPopup(item.plan_sn);">등록</button>
                                <!-- <button class="btn btn-small btn-gray" @click.prevent="fnRsltPopup(item.plan_sn);" v-else>완료</button>  v-if="item.rslt_n_cnt > 0" -->
                            </td>
                            <td>
                            <router-link :to="'/detail/'+item.plan_sn" class="btn btn-icon"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-content-search"></use></svg></router-link>
                            <template v-if="item.reg_id == viewModel.userInfo.user_id">
                                <button @click="fnModify(item.bplc_mngr_sign_yn, item.plan_sn)" class="btn btn-icon"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-edit-contents"></use></svg></button>
                                <button class="btn btn-icon" @click="fnDelete(item.plan_sn)"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-delete-sweep"></use></svg></button>
                            </template>
                            </td>
                        </tr>
                    </template>
                    <template v-if="viewModel.pager.totalSize == 0"><tr><td :colspan="viewModel.userInfo.user_roles == 'ROLE_001' ? '14' : '13'">게시물이 없습니다.</td></tr></template>
                </tbody>
            </table>
            <div class="table_footer">
                <pager :pass="viewModel.pager"></pager>
                <div class="btn-group"> 
                    <!-- <div class="upload_file">
                        <div class="btn filebox">
                            첨부파일을 마우스로 드래그해서 추가해 주세요.
                            <svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-mouse"></use></svg>
                        </div>
                    </div>				 -->
                    <!-- <a href="" class="btn btn-white"><i class="icon_excel"></i>엑셀업로드</a> -->
                    <a v-if="viewModel.userInfo.bplc_yn == 'N' || viewModel.userInfo.ocpt_se_cd == 'MNG'" href="#/write" class="btn btn-purple"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-post-add"></use></svg>등록</a>
                    <!-- <a href="" class="btn btn-gray"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-trash-can"></use></svg>삭제</a> -->
                </div>
            </div>
        </div>
    </div>
    <popUp ref="popUp" v-if="popUp==true"></popUp>
    <rsltPopup ref="rsltPopup" v-if="rsltPop==true"></rsltPopup>
</div>
</template>

<script>
    import "es6-promise/auto";
    import Vue from "vue";
    import Axios from "axios";
    import Pager from "../../../paging.vue";
    import Message from "../../../../common/js/message";
    import popUp from "./popup/rgstAtPlPopup.vue";
    import rsltPopup from "./popup/rgstAtPlRsltPopup.vue";

    export default {
        components: {
            'pager': Pager,
            'popUp': popUp,
            'rsltPopup': rsltPopup,
        },
        data: function() {
            return {
                popUp:false,
                rsltPop:false,
                imgsrc:'',
                viewModel:{
                    search:{
                        bplc_sn:'',
                        user_nm:'',
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
            vm.$router.afterEach((to, from) => {
                vm.fnInit();
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
            //초기화
            fnRefresh: function(){
                let vm = this;
                vm.viewModel.search = {
                    bplc_sn : (vm.viewModel.userInfo.bplc_yn == 'N' && (vm.viewModel.userInfo.bplc_sn == 0 || vm.viewModel.userInfo.bplc_use_yn == 'N')) ? '' : vm.viewModel.userInfo.bplc_sn,
                    bplc_use_yn : vm.viewModel.userInfo.bplc_yn == 'N' ? 'Y' : 'A',
                    user_nm:''
                }
                $("#sdt").val('');
                $("#edt").val('');
            },
            fnInit: function(){
                let vm = this;
                vm.viewModel.userInfo = vm.$store.state.global.userInfo;
                vm.viewModel.search.bplc_use_yn = vm.viewModel.userInfo.bplc_yn == 'N' ? 'Y' : 'A';
                vm.viewModel.search.bplc_sn = (vm.viewModel.userInfo.bplc_yn == 'N' && (vm.viewModel.userInfo.bplc_sn == 0 || vm.viewModel.userInfo.bplc_use_yn == 'N')) ? '': vm.viewModel.userInfo.bplc_sn;
                
                vm.fnList(0);
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
            fnList:function(paramPageNo){
				let vm = this;
                vm.viewModel.pager.pageNo = paramPageNo == 0 ? 1 : paramPageNo;

                let send = {
                    pageYn:'Y',
                    pageNo: vm.viewModel.pager.pageNo,
                    pageSize: vm.viewModel.pager.rowSize,
                    user_nm: vm.viewModel.search.user_nm,
                    bplc_sn: vm.viewModel.search.bplc_sn,
                    bplc_use_yn: vm.viewModel.search.bplc_use_yn,
                    bplc_yn: vm.viewModel.userInfo.bplc_yn,
                    u_bplc_sn: vm.viewModel.userInfo.bplc_sn,
                    sdt:$("#sdt").val(),
                    edt:$("#edt").val(),
                    dept_sn: vm.viewModel.userInfo.dept_sn,
                    team_sn: vm.viewModel.userInfo.team_sn,
                }

                Axios.post("/selectAtPlList.do", send)
                .then(function(response) {
                    vm.viewModel.list = response.data.list;
                    vm.viewModel.pager.totalSize = response.data.totalCNT;
                    
                    //페이징세팅
                    Pager.props = Pager.methods.createPaging(vm.viewModel.pager, vm, "list");
                    
                    // //조회조건 현장명
                    // vm.viewModel.searchBplcList = response.data.searchBplcList;
                });
            },
            //페이징 처리
            fnChangeCNTSelect: function(rowSize){
                let vm = this;
                if(rowSize != undefined || rowSize > 0){
                    vm.viewModel.pager.rowSize = rowSize
                    vm.fnList(0);
                }
            },
            fnDelete: function(sn){
                let vm = this;
                let send = {
                    plan_sn: sn
                }

                if(confirm(Message.DELETE_CONFIRM)){
                    Axios.post("/deleteAtPl.do", send)
                    .then(function(response) {
                        if(response.data == 1){
                            alert("삭제가 완료되었습니다.");
                            vm.fnList(0);
                        }
                    }).catch(function(ex){
                        alert(Message.ERROR);
                    });
                }
            },
            fnPopup: function(sn,id){
                let vm = this;

                vm.rsltPop=false;
                vm.popUp=true;
                vm.$nextTick(function() {
                    if(vm.popUp) {
                        vm.$refs.popUp.fnInit(sn, id);
                    }
                })
            },
            fnRsltPopup: function(sn){
                let vm = this;

                vm.rsltPop=true;
                vm.popUp=false;
                
                vm.$nextTick(function() {
                    if(vm.rsltPop) {
                        vm.$refs.rsltPopup.fnInit(sn);
                    }
                })
            },
            fnModify: function(yn,sn){
                let vm = this;
                if(yn == 'Y'){
                    alert('이미 현장소장 결재가 완료되어 수정이 불가능합니다.');
                    return false;
                } else {
                    vm.$router.push({name:'rgstAtplUpdate', params: {plan_sn:sn}});   
                }
                
            }
        }
    }
</script>