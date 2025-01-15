<template>
<div>
    <div class="search_area">
        <button class="btn_toggle_search">검색</button>
        <div>
            <div class="search_container">
                <div class="row">
                    <div class="input_group" style="width:20rem" v-if="viewModel.userInfo.bplc_yn == 'N'">
                        <select id="list" v-model="viewModel.search.bplc_use_yn" class="wp28">
                            <option value="A">전체</option>
                            <option value="Y" selected="selected">운영</option>
                            <option value="N">종료</option>
                        </select>
                        <select title="현장명" v-model="viewModel.search.bplc_sn" >
                            <option value="">현장명 선택</option>
                            <option v-for="(item, i) in viewModel.searchBplcList" :key="i" :value="item.bplc_sn">{{ item.bplc_nm }}</option>
                        </select>
                    </div>                   
                    <input type="text" placeholder="개정번호를 입력하세요." title="개정번호 입력" v-model="viewModel.search.rvsn_no">
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
                <caption>목표 추진계획, 평가기준</caption>
                <thead>
                    <tr>
                        <th scope="col" :rowspan="2" class="w50">번호</th>
                        <th scope="col" :rowspan="2" v-if="viewModel.userInfo.bplc_yn == 'N'">현장명</th>
                        <!-- <th scope="col" :rowspan="2">문서번호</th> -->
                        <th scope="col" :rowspan="2">제 &middot; 개정일</th>
                        <th scope="col" :rowspan="2">개정번호</th>
                        <th scope="col" :rowspan="2">작성자</th>
                        <th scope="col" colspan="3">결재현황</th>
                        <th scope="col" :rowspan="2">결과서</th>
                        <th scope="col" :rowspan="2">첨부</th>
                        <th scope="col" :rowspan="2">관리</th>
                    </tr>
                    <tr>
                        <th>작성자</th>
                        <th>조정자</th>
                        <th>결정자</th>
                    </tr>
                </thead>
                <tbody>
                    <template v-for="(item, i) in viewModel.list" :key="i">
                        <tr>
                            <td>{{(viewModel.pager.pageNo==1) ? viewModel.pager.totalSize-i : viewModel.pager.totalSize-((viewModel.pager.rowSize*(viewModel.pager.pageNo-1))+i)}}</td>
                            <td class="text-left" v-if="viewModel.userInfo.bplc_yn == 'N'">{{ item.bplc_nm }}</td>
                            <!-- <td class="text-left"><router-link :to="'/detail/'+item.prtn_plan_sn" class="btn-link">{{ item.doc_no }}</router-link></td> -->
                            <td>{{ item.estbsh_day_rvsn_day|yyyyMMdd }}</td>
                            <td> <router-link :to="'/detail/'+item.prtn_plan_sn" class="btn-link">{{ item.rvsn_no }}</router-link></td>
                            <td>{{ item.reg_nm }}</td>
                            <td>
                                <router-link :to="'/detail/'+item.prtn_plan_sn" class="btn btn-small btn-approval" v-if="item.wrtr == viewModel.userInfo.user_id && item.wrtr_sign_yn != 'Y'"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-approval"></use></svg>결재 요청</router-link> 
                                <span class="btn btn-small btn-approval" v-else-if="item.wrtr == viewModel.userInfo.user_id && item.wrtr_sign_yn != 'Y'"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-approval-ongoing"></use></svg>진행 중</span>
                                <span class="btn btn-small btn-approval complete" v-else-if="item.wrtr == viewModel.userInfo.user_id && item.wrtr_sign_yn == 'Y'"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-user-check"></use></svg>결재 완료</span>
                                <span v-else-if="item.wrtr != viewModel.userInfo.user_id && item.wrtr_sign_yn == 'Y'">결재완료</span>
                                <span v-else-if="item.wrtr != viewModel.userInfo.user_id && item.wrtr_sign_yn != 'Y'">결재요청</span>
                            </td>
                            <td>
                                <router-link :to="'/detail/'+item.prtn_plan_sn" class="btn btn-small btn-approval" v-if="item.mdtr == viewModel.userInfo.user_id && item.mdtr_sign_yn != 'Y' && item.wrtr_sign_yn == 'Y'"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-approval"></use></svg>결재 요청</router-link>
                                <span class="btn btn-small btn-approval" v-else-if="item.mdtr == viewModel.userInfo.user_id && item.mdtr_sign_yn != 'Y' && item.wrtr_sign_yn != 'Y'"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-approval-ongoing"></use></svg>진행 중</span>
                                <span class="btn btn-small btn-approval complete" v-else-if="item.mdtr == viewModel.userInfo.user_id && item.mdtr_sign_yn == 'Y'"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-user-check"></use></svg>결재 완료</span>
                                <span v-else-if="item.mdtr != viewModel.userInfo.user_id && item.mdtr == ''"></span>
                                <span v-else-if="item.mdtr != viewModel.userInfo.user_id && item.mdtr_sign_yn == 'Y'">결재완료</span>
                                <span v-else-if="item.dcsnr != viewModel.userInfo.user_id && item.dcsnr_sign_yn != 'Y' && item.wrtr_sign_yn != 'Y'" >진행중</span>
                                <span v-else-if="item.mdtr != viewModel.userInfo.user_id && item.mdtr_sign_yn != 'Y'">결재요청</span>
                            </td>
                            <td>
                                <router-link :to="'/detail/'+item.prtn_plan_sn" class="btn btn-small btn-approval" v-if="item.dcsnr == viewModel.userInfo.user_id && item.dcsnr_sign_yn != 'Y' && ((item.mdtr == '' || item.mdtr_sign_yn == 'Y') && item.wrtr_sign_yn == 'Y')"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-approval"></use></svg>결재 요청</router-link> 
                                <span class="btn btn-small btn-approval" v-else-if="item.dcsnr == viewModel.userInfo.user_id && item.dcsnr_sign_yn != 'Y' && (item.mdtr != '' || item.mdtr_sign_yn != 'Y' || item.wrtr_sign_yn != 'Y')"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-approval-ongoing"></use></svg>진행 중</span>
                                <span class="btn btn-small btn-approval complete" v-else-if="item.dcsnr == viewModel.userInfo.user_id && item.dcsnr_sign_yn == 'Y'"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-user-check"></use></svg>결재 완료</span>
                                <span v-else-if="item.dcsnr != viewModel.userInfo.user_id && item.dcsnr_sign_yn != 'Y' && ((item.mdtr == '' || item.mdtr_sign_yn == 'Y') && item.wrtr_sign_yn == 'Y')">결재요청</span>
                                <span v-else-if="item.dcsnr != viewModel.userInfo.user_id && item.dcsnr_sign_yn != 'Y' && (item.mdtr != '' || item.mdtr_sign_yn != 'Y' || item.wrtr_sign_yn != 'Y')" >진행중</span>
                                <span v-else-if="item.dcsnr != viewModel.userInfo.user_id && item.dcsnr_sign_yn == 'Y'">결재완료</span>
                            </td>
                            <td>
                                <button class="btn btn-small btn-blue" @click.prevent="fnRsltPopup(item.prtn_plan_sn);">등록</button>
                                <!-- <button class="btn btn-small btn-gray" @click.prevent="fnRsltPopup(item.prtn_plan_sn);" v-else>완료</button>  v-if="item.rslt_n_cnt > 0"-->
                            </td>
                            <td>
                                <button v-if="item.file_cnt > 0" class="btn btn-icon" @click="fnFilePopup(item.prtn_plan_sn);"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-attachment"></use></svg></button>
                            </td>
                            <td>
                                <router-link :to="'/detail/'+item.prtn_plan_sn" class="btn btn-icon"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-content-search"></use></svg></router-link>
                                <template v-if="item.reg_id == viewModel.userInfo.user_id">
                                    <button class="btn btn-icon" @click="fnUpdate(item.prtn_plan_sn, item.dcsnr_sign_yn);"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-edit-contents"></use></svg></button>
                                    <button class="btn btn-icon" @click="fnDelete(item.prtn_plan_sn)"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-delete-sweep"></use></svg></button>
                                </template>
                            </td>
                        </tr>
                    </template>
                    <tr v-if="viewModel.list.length == 0"><td :colspan="viewModel.userInfo.bplc_yn == 'N' ? '11' : '10'">게시물이 없습니다.</td></tr>
                </tbody>
            </table>
            <div class="table_footer">
                <pager :pass="viewModel.pager"></pager>
                <div class="btn-group"> 
                    <a href="#/write" class="btn btn-purple"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-post-add"></use></svg>등록</a>
                </div>
            </div>
        </div>
    </div>
    <fileViewPopup ref="fileViewPopup" v-if="fileViewPop==true"></fileViewPopup>
    <rsltPopup ref="rsltPopup" v-if="rsltPop==true"></rsltPopup>
</div>    
</template>

<script>
    import "es6-promise/auto";
    import Vue from "vue";
    import Axios from "axios";
    import Common from '../../../../common/js/common.js';
    import Pager from "../../../../common/vue/paging.vue";
    import Message, {messageUtil} from "../../../../common/js/message";
    import fileViewPopup from "../../popup/fileViewPopup.vue";
    import rsltPopup from "./popup/rgstGPlEvltPopup.vue";
    
    export default {
        components: {
            'pager': Pager,
            'fileViewPopup': fileViewPopup,
            'rsltPopup': rsltPopup,
        },
        data: function() {
            return {
                fileViewPop:false,
                rsltPop:false,
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
        watch: {
            'viewModel.search.bplc_use_yn':{
                handler(){
                    let vm = this;
                    if(vm.viewModel.userInfo.user_roles == 'ROLE_001'){
                        vm.fnBplcList();
                    }
                }
            }
        },
        mounted: function() {
            let vm = this;
            vm.fnInit();

            vm.$router.afterEach(function(to, from){
                vm.fnList(vm.viewModel.pager.pageNo);
            })
        },
        methods: {
            //초기화
            fnRefresh: function(){
                let vm = this;
                vm.viewModel.search = {
                    bplc_sn : (vm.viewModel.userInfo.bplc_yn == 'N' && (vm.viewModel.userInfo.bplc_sn == 0 || vm.viewModel.userInfo.bplc_use_yn == 'N')) ? '' : vm.viewModel.userInfo.bplc_sn,
                    bplc_use_yn : vm.viewModel.userInfo.bplc_yn == 'N' ? 'Y' : 'A',
                }
            },
            fnInit: function(){
                let vm = this;
                vm.viewModel.userInfo = vm.$store.state.global.userInfo;
                vm.viewModel.search.bplc_use_yn = vm.viewModel.userInfo.bplc_yn == 'N' ? 'Y' : 'A';
                vm.viewModel.search.bplc_sn = (vm.viewModel.userInfo.bplc_yn == 'N' && (vm.viewModel.userInfo.bplc_sn == 0 || vm.viewModel.userInfo.bplc_use_yn == 'N')) ? '': vm.viewModel.userInfo.bplc_sn;
                
                vm.fnList(1);
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
                vm.viewModel.pager.pageNo = paramPageNo == undefined ? vm.viewModel.pager.pageNo : paramPageNo;

                let send = {
                    pageYn:'Y',
                    pageNo: vm.viewModel.pager.pageNo,
                    pageSize: vm.viewModel.pager.rowSize,
                    rvsn_no: vm.viewModel.search.rvsn_no,
                    bplc_sn: vm.viewModel.search.bplc_sn,
                    bplc_use_yn: vm.viewModel.search.bplc_use_yn,
                    bplc_yn: vm.viewModel.userInfo.bplc_yn,
                    u_bplc_sn: vm.viewModel.userInfo.bplc_sn,
                    dept_sn: vm.viewModel.userInfo.dept_sn,
                    team_sn: vm.viewModel.userInfo.team_sn,
                }

                Axios.post("/selectGPlEvltList.do", send)
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
                    vm.fnList(1);
                }
            },
            fnDelete: function(sn){
                let vm = this;
                let send = {
                    prtn_plan_sn: sn
                }

                if(confirm(Message.DELETE_CONFIRM)){
                    Axios.post("/deleteGPlEvlt.do", send)
                    .then(function(response) {
                        if(response.data == 1){
                            alert("삭제가 완료되었습니다.");
                            vm.fnList(vm.viewModel.pager.pageNo);
                        }
                    }).catch(function(ex){
                        alert(Message.ERROR);
                    });
                }
            },
            fnFilePopup: function(sn) {
				let vm = this;

                vm.rsltPop=false;
                vm.fileViewPop=true;

                let send = {
                    sn: sn
                }

                Axios.post("/selectGPlEvltFileList.do", send)
                .then(function(response) {
                    
                    vm.$nextTick(function() {
                        if(vm.fileViewPop) {
                            vm.$refs.fileViewPopup.fnInit(response.data.fileList, 'gPlEvlt');
                        }
                    })
                });				
			},
            fnRsltPopup: function(sn){
                let vm = this;

                vm.fileViewPop=false;
                vm.rsltPop=true;
                
                vm.$nextTick(function() {
                    if(vm.rsltPop) {
                        vm.$refs.rsltPopup.fnInit(sn);
                    }
                })
            },
            fnUpdate: function(sn, dcsnr_sign_yn){
                let vm = this;

                if(dcsnr_sign_yn == 'Y'){
                    alert("결정자가 결재를 완료하여 수정이 불가합니다.");
                    return false;
                }else{
                    vm.$router.push('/write/'+sn);
                }

            },
        }
    };
</script>