<template>
<div>
    <div class="search_area">
        <button class="btn_toggle_search">검색</button>
        <div>
            <div class="search_container">
                <div class="row">
                    
                    <div class="input_group" style="width:20rem" v-if="viewModel.userInfo.user_roles == 'ROLE_001'">
                        <select id="list" v-model="viewModel.bplc_use_yn" class="wp28">
                            <option value="A">전체</option>
                            <option value="Y" selected="selected">운영</option>
                            <option value="N">종료</option>
                        </select>
                        <select title="현장명" v-model="viewModel.bplc_sn">
                            <option value="">현장명 선택</option>
                            <option :value=item.bplc_sn v-for="(item, i) in searchBplcList" :key=i >{{ item.bplc_nm }}</option>
                        </select>
                    </div>

                    <div class="datepicker_box">
                        <input type="text" class="datepicker" id="datepicker_s" placeholder="투표 조회시작일" title="조회시작일" readonly>
                    </div>
                    <span>~</span>
                    <div class="datepicker_box">
                        <input type="text" class="datepicker" id="datepicker_e" placeholder="투표 조회종료일" title="조회종료일" readonly>
                    </div>
                </div>
            </div>
            <div class="btn-group">
                <a href="javascript:void(0);" class="btn btn-default-line" @click="fnReset()"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-refresh"></use></svg>초기화</a>
                <a href="javascript:void(0);" class="btn btn-default" @click="fnList(1)"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-search"></use></svg>검색</a>
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
                <span>※ 근로자 수 대비 과반수 이상이 투표해야 투표 종료가 가능합니다.</span>
                <select title="개수 선택" v-model="viewModel.pager.rowSize"  @change="fnRowSize(viewModel.pager.rowSize)">
                    <option :value="10">10개씩 보기</option>
                    <option :value="30">30개씩 보기</option>
                    <option :value="50">50개씩 보기</option>
                    <option :value="100">100개씩 보기</option>
                </select>
            </div>
            <table class="table">
                <caption>개선조치 계획</caption>
                <thead>
                    <tr>
                        <th scope="col" class="w50">번호</th>
                        <th scope="col" v-if="viewModel.userInfo.user_roles == 'ROLE_001'">현장명</th>
                        <th scope="col">투표 시작일</th>
                        <th scope="col">투표 종료일</th>
                        <th scope="col">후보자</th>
                        <th scope="col">투표</th>
                        <th scope="col">결과</th>
                        <th scope="col">관리</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, i) in list" :key="i">
                        <td>{{ item.rownum }}</td>
                        <td class="text-left" v-if="viewModel.userInfo.user_roles == 'ROLE_001'">{{ item.bplc_nm }}</td>
                        <td>{{ item.vote_bgn_dt }}</td>
                        <td>{{ item.vote_end_dt }}</td>
                        <td><button @click="fnPopup('candidate', item.vote_sn, 0)" class="btn btn-small btn-blue" >보기</button></td>

                        <!-- 투표 (해당 현장의 현장 근로자만 투표) -->
                        <td v-if="(new Date(item.vote_bgn_dt) <= today && item.vote_ck != 'true' && item.vote_end_yn != 'Y') && (item.bplc_sn == viewModel.userInfo.bplc_sn) && (viewModel.userInfo.ocpt_se_cd == 'WRK' || viewModel.userInfo.ocpt_se_cd == 'WRKM') && item.voter_yn == 'Y'">
                            <a href="javascript:void(0);" @click="fnPopup('vote', item.vote_sn, item.bplc_sn)" class="btn btn-small btn-blue"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-sign-complete"></use></svg>투표</a>
                        </td>
                        <td v-else-if="(new Date(item.vote_bgn_dt) <= today && item.vote_ck == 'true' && item.vote_end_yn != 'Y')"><a href="javascript:void(0);" class="btn btn-small btn-gray">투표 완료</a></td>
                        <td v-else-if="item.vote_end_yn == 'Y'"><button class="btn btn-small btn-gray">투표 종료</button></td>
                        <td v-else-if="new Date(item.vote_bgn_dt) > today">-</td>
                        <td v-else>-</td>

                        <!-- 결과 -->
                        <td v-if="item.vote_end_yn == 'Y'"><button @click="fnPopup('result', item.vote_sn, item.bplc_sn)" class="btn btn-small btn-blue" >보기</button></td>
                        <td v-else>-</td>
                        
                        <td v-if="item.reg_id == viewModel.userInfo.user_id">
                            <button v-if="item.vote_end_yn != 'Y'" @click="fnStop(item.vote_sn, item.bplc_sn)" class="btn btn-icon"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-delete-circle"></use></svg></button>
                            <button @click="fnDelete(item.vote_sn)" class="btn btn-icon"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-delete-sweep"></use></svg></button>
                        </td> 
                        <td v-else></td>
                    </tr>
                    <tr v-if="list.length == 0"><td :colspan="viewModel.userInfo.user_roles == 'ROLE_001' ? '10' : '9'">게시물이 없습니다.</td></tr>
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
                    <router-link to="/write" class="btn btn-purple"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-post-add"></use></svg>등록</router-link>
                </div>
            </div>
        </div>
    </div>
    <CandidatePopup ref="candidate" v-if="candidatePopup==true"></CandidatePopup>
    <VotePopup ref="vote" v-if="votePopup==true"></VotePopup>
    <ResultPopup ref="result" v-if="resultPopup==true"></ResultPopup>
    <!-- <ResultPopup ref="result" v-if="resultPopup==true" @close="fnList()"></ResultPopup> -->
</div>
</template>

<script>
    import "es6-promise/auto";
    import Vue from "vue";
    import Axios from "axios";
    import Common from '../../../../common/js/common.js';
    import Pager from "../../../paging.vue";
    import CandidatePopup from "../../popup/implPl_candidate_popup.vue";
    import VotePopup from "../../popup/implPl_vote_popup.vue";
    import ResultPopup from "../../popup/implPl_result_popup.vue";
    
    export default {
        components: {
            Pager, CandidatePopup, VotePopup, ResultPopup
        },
        data: function() {
            return {
                candidatePopup:false,
                votePopup:false,
                resultPopup:false,
                today : '',
                list: [],
                searchBplcList:[],
                viewModel:{
                    userInfo:{},
                    bplc_use_yn : '',
                    bplc_sn : '',
                    bplc_nm : '',
                    vote_bgn_dt : '',
                    vote_end_dt : '',
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
            let vt = this;
            let date = new Date();
            vt.today = new Date(Common.fnDateTimeStr(date));
            vt.fnInit();
            vt.$router.afterEach((to, from) => {
                vt.fnList(vt.viewModel.pager.pageNo);
            });
        },
        watch: {
            'viewModel.bplc_use_yn': {
                handler() {
                    let vm = this;
                    if(vm.viewModel.userInfo.user_roles == 'ROLE_001'){
                        vm.fnBplcList();
                    }
                }
            }
        },
        methods: {
            fnInit:function(){
                let vt = this;
                let vm = this.viewModel;
                
                vm.userInfo = vt.$store.state.global.userInfo;
                vm.bplc_use_yn = vm.userInfo.bplc_yn == 'N' ? 'Y' : 'A';
                vm.bplc_sn = (vm.userInfo.bplc_yn == 'N' && (vm.userInfo.bplc_sn == 0 || vm.userInfo.bplc_use_yn == 'N')) ? '' : vm.userInfo.bplc_sn;

                // vt.fnBplcList();
                vt.fnList();
            },
            fnList:function(paramPageNo){
				let vt = this;
                let vm = this.viewModel;
				
                vm.pager.pageNo = paramPageNo == undefined ? vm.pager.pageNo : paramPageNo;

                if(($("#datepicker_s").val() && !$("#datepicker_e").val()) || (!$("#datepicker_s").val() && $("#datepicker_e").val())){
                    alert("조회시작일과 종료일을 모두 선택해야합니다.");
                    return false;
                }if($("#datepicker_s").val() > $("#datepicker_e").val()){
                    alert("조회시작일이 종료일보다 큽니다.");
                    return false;
                }

                vm.vote_bgn_dt = $("#datepicker_s").val();
                vm.vote_end_dt = $("#datepicker_e").val();
                
                let data = {
                    bplc_sn : vm.bplc_sn,
                    bplc_use_yn : vm.bplc_use_yn,
                    user_bplc_sn : vm.userInfo.bplc_sn,
                    bplc_yn : vm.userInfo.bplc_yn,
                    vote_bgn_dt : (vm.vote_bgn_dt == '') ? null : vm.vote_bgn_dt,
                    vote_end_dt : (vm.vote_end_dt == '') ? null : vm.vote_end_dt,
                    user_id : vm.userInfo.user_id,
                    hdofc_mngr_yn : vm.userInfo.hdofc_mngr_yn,
                    dept_sn: vm.userInfo.dept_sn,
                    team_sn: vm.userInfo.team_sn,
                    pageNo: vm.pager.pageNo,
					pageSize: vm.pager.rowSize,
                }
                
                Axios.post("/selectMauImplPlVoteList.do", data)
                .then(function(response) {
                    vt.list = response.data.list;
					vm.pager.totalSize = response.data.totalCount;
                    // vt.searchBplcList = response.data.searchBplcList;

                    vt.candidatePopup = false;
                    vt.votePopup = false;
                    vt.resultPopup = false;
                   
                    //페이징세팅
                    Pager.props = Pager.methods.createPaging(vm.pager, vt, "list");
                });
            },
            //페이지 목록
            fnReset:function(){
                let vm = this.viewModel;
                // vm.bplc_sn = (vm.userInfo.bplc_sn == 0) ? '' : vm.userInfo.bplc_sn;
                // vm.bplc_nm = (vm.userInfo.bplc_sn == 0) ? '' : vm.userInfo.bplc_nm;
                vm.bplc_use_yn = vm.userInfo.bplc_yn == 'N' ? 'Y' : 'A',
                vm.bplc_sn = (vm.userInfo.bplc_yn == 'N' && (vm.userInfo.bplc_sn == 0 || vm.userInfo.bplc_use_yn == 'N')) ? '' : vm.userInfo.bplc_sn
                vm.vote_bgn_dt = '';
                vm.vote_end_dt = '';
                $("#datepicker_s").val('');
                $("#datepicker_e").val('');
            },
            fnRowSize:function(value){
                let vt = this;
                if(value != undefined || value != '' || value > 0){
                    vt.viewModel.pager.rowSize = value
                    vt.fnList();
                }
            },
            fnDelete:function(param){
                let vt = this;
                if(confirm("삭제하시겠습니까?")){ 
                    let data = {
                        vote_sn : param,
                        user_id : vt.viewModel.userInfo.user_id
                    }
                    Axios.post("/deleteMauImplPlVote.do", data).then(function(res){
                        console.log(res);
                    }).catch(function(ex) {
                        console.log(ex);
                    });
                    window.location.reload(); 
                }
            },
            fnStop:function(vote_sn, bplc_sn){
                let vt = this;
                
                let data = {
                    vote_sn : vote_sn,
                    bplc_sn : bplc_sn,
                    user_id : vt.viewModel.userInfo.user_id
                }

                //결과 조회
                Axios.post("/selectImplPlDetail.do", data).then(function(response) {
                    console.log(response.data);
                    vt.bplc_mem_cnt = response.data.electedList[0].bplc_mem_cnt;
                    vt.vote_cnt = response.data.electedList[0].vote_cnt;
                    
                    if((vt.bplc_mem_cnt/2) <=  vt.vote_cnt){
                        if(confirm("투표를 중단하시겠습니까?")){ 
                            Axios.post("/updateMauImplPlVote.do", data).then(function(res){
                                console.log(res);
                                vt.fnList();
                            }).catch(function(ex) {
                                console.log(ex);
                            });
                        }
                    }else{
                        return alert("근로자 수 대비 과반수 이상이 투표하지 않아 \n투표를 종료할 수 없습니다.");
                    }
                    
                })
            },
            //팝업
            fnPopup:function(value, vote_sn, bplc_sn){
                let vt = this;
                let vm = this.viewModel;
                vm.vote_sn = vote_sn;
                vt.candidatePopup = false;
                vt.votePopup = false;
                vt.resultPopup = false;
                
                setTimeout(()=>{
                    if(value == 'candidate'){
                        vt.candidatePopup = true;

                        vt.$nextTick(function() {
                            if(vt.candidatePopup) {
                                vt.$refs.candidate.fnInit(vote_sn);
                            }
                        })
                    }if(value == 'vote'){
                        vt.votePopup = true;

                        vt.$nextTick(function() {
                            if(vt.votePopup) {
                                vt.$refs.vote.fnInit(vote_sn, bplc_sn);
                            }
                        })
                    }if(value == 'result'){
                        vt.resultPopup = true;

                        vt.$nextTick(function() {
                            if(vt.resultPopup) {
                                vt.$refs.result.fnInit(vote_sn, bplc_sn);
                            }
                        })
                    }
                }, 100)
            },
            fnBplcList: function() { //사업장 리스트 추출(검색)
                let vm = this;

                let data = {
                    mapperId: 'comm.selectAllBplcList',
                    bplc_use_yn: vm.viewModel.bplc_use_yn,
                    dept_sn: vm.viewModel.userInfo.dept_sn,
                    team_sn: vm.viewModel.userInfo.team_sn,
                };
                Axios.post("/list.do", data).then(function (rs) {
                    vm.searchBplcList = rs.data.list;

                    vm.viewModel.bplc_sn = '';
                    if(vm.viewModel.userInfo.bplc_use_yn == 'Y' && vm.viewModel.bplc_use_yn == 'Y'){
                        vm.viewModel.bplc_sn = vm.viewModel.userInfo.bplc_sn == 0 ? '' : vm.viewModel.userInfo.bplc_sn;
                    }
                });
            },
        }
    };
</script>