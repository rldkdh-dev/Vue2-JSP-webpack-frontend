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
                            <option value="0">현장명 선택</option>
                            <template v-for="(item, i) in viewModel.bplcList" :key="i">
                            <option :value=item.bplc_sn>{{ item.bplc_nm }}</option>
                            </template>
                        </select>
                    </div>
                    <select title="위험구분" v-model="viewModel.search.risk_se" @change="fnChgRiskSe">
                        <option value="0" disabled>위험구분을 선택하세요.</option>
                        <option value="LGZ_RISK">대형위험</option>
                        <option value="HGH_RISK">고위험</option>
                    </select>
                    <select title="작업유형" v-model="viewModel.search.job_type">
                        <option value="0" disabled>작업유형을 선택하세요.</option>
                        <template v-for="(item, i) in viewModel.jobTypeList" :key="i">
                        <option :value=item.CODE>{{ item.CODE_NM }}</option>
                        </template>
                    </select>
                    <div class="input_group">
                        <div class="datepicker_box" style="max-width:none">
                            <input type="text" class="datepicker" id="reg_dt" title="datepicker" placeholder="등록일자" readonly>
                        </div>
                    </div>
                    <input type="text" placeholder="작업위치를 입력하세요." title="작업위치 입력" v-model="viewModel.search.text" v-on:keyup.enter="fnList(0)">
                </div>
            </div>
            <div class="btn-group">
                <a href="javascript:void(0)" class="btn btn-default-line" @click="fnInitSearchLine"><svg class="icon"><use xlink:href="/img/symbol-defs.svg#icon-refresh"></use></svg>초기화</a>
                <a href="javascript:void(0)" class="btn btn-default" @click="fnList(0)"><svg class="icon"><use xlink:href="/img/symbol-defs.svg#icon-search"></use></svg>검색</a>
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
                <button class="btn btn-white" @click="fnExcelDownload"><i class="icon_excel"></i>엑셀다운로드</button>
                <select title="개수 선택" v-model="viewModel.pager.rowSize" @change="fnChangeCNTSelect(viewModel.pager.rowSize);">
                    <option value="10">10개씩 보기</option>
                    <option value="30">30개씩 보기</option>
                    <option value="50">50개씩 보기</option>
                    <option value="100">100개씩 보기</option>
                </select>
            </div>
            <div class="table_top box">
                <div class="input_group" v-if="viewModel.userInfo.user_roles == 'ROLE_001' && viewModel.userInfo.user_type_code == 'ACC_0000'">
                    <div class="yearpicker_box w120">
                        <input type="text" id="mtg_year" class="yearpicker" readonly>
                        <label for="mtg_year" class="btn-icon"><svg class="icon"><use xlink:href="/img/symbol-defs.svg#icon-calendar"></use></svg></label>
                    </div>
                    <select title="월" v-model="viewModel.data.mtg_month" class="w120" style="position:relative" id="mtg_month">
                        <option value="">월 선택</option>
                        <option :value=" i < 10 ? 0+''+i : i " v-for="i in 12">
                            {{ i < 10 ? 0+''+i : i }}월
                        </option>
                    </select>
                    <select title="주차" v-model="viewModel.data.mtg_week" class="w120" style="position:relative" id="mtg_week">
                        <option value="">주차 선택</option>
                        <option v-for="(i) in 5" :key="i" :value="i">
                            {{ i }}주차
                        </option>
                    </select>
                    <div class="btn-group">
                        <a href="" @click.prevent="fnRgstJobWeek" class="btn btn-white"><svg class="icon"><use xlink:href="/img/symbol-defs.svg#icon-task-add"></use></svg>주차 적용</a>
                    </div>
                </div>
            </div>
            <table class="table">
                <caption>대형(고)위험 작업관리 현황</caption>
                <thead>
                    <tr>
                        <th scope="col" class="w50"><input type="checkbox" v-model="viewModel.chkAll" true-value="Y" false-value="N" @change="fnChkAll" title="선택"></th>
                        <th scope="col" class="w50">번호</th>
                        <th scope="col" v-if="viewModel.userInfo.user_roles == 'ROLE_001'">현장명</th>
                        <th scope="col">작업유형</th>
                        <th scope="col">작업위치</th>
                        <th scope="col">위험구분</th>
                        <th scope="col">위험명</th>
                        <th scope="col">등록일자</th>
                        <th scope="col">일정</th>
                        <th scope="col">관리</th>
                    </tr>
                </thead>
                <tbody>
                    <template v-if="viewModel.list.length > 0">
                    <tr v-for="(item, i) in viewModel.list" :key="i">
                        <td><input type="checkbox" v-model="viewModel.chkInfoArr" :value="[item.bplc_sn,item.job_plan_sn]" title="선택"></td>
                        <td>{{(viewModel.pager.pageNo==1) ? viewModel.pager.totalSize-i : viewModel.pager.totalSize-((viewModel.pager.rowSize*(viewModel.pager.pageNo-1))+i)}}</td>
                        <td class="text-left" v-if="viewModel.userInfo.user_roles == 'ROLE_001'"><router-link class="btn-link" :to="'/detail/'+item.bplc_sn+','+item.job_plan_sn" title="상세보기">{{ item.bplc_nm }}</router-link></td>
                        <td  class="text-left">{{ item.job_type_text }}</td>
                        <td class="text-left pre">{{ item.job_risk_factor }}</td>
                        <td>{{ item.risk_se }}</td>
                        <td  class="text-left">{{ item.risk.replace('ETC_','') }}</td>
                        <td>{{ item.reg_dt }}</td>
                        <td>{{ item.job_year + '-' + item.job_month + '(' + ((item.job_week == 'null' || item.job_week == '') ? '-' : item.job_week) + '주차)' }}</td>
                        <td class="ws-nw">
                            <router-link :to="'/detail/'+item.bplc_sn+','+item.job_plan_sn" class="btn btn-icon" title="상세보기"><svg class="icon"><use xlink:href="/img/symbol-defs.svg#icon-content-search"></use></svg></router-link>
                            <router-link :to="'/write/'+item.bplc_sn+','+item.job_plan_sn"
                                v-if="viewModel.userInfo.user_roles == 'ROLE_002'
                                && viewModel.userInfo.user_type_code == 'ACC_0001'
                                && viewModel.userInfo.ocpt_se_cd == 'MNG'"
                                class="btn btn-icon" title="수정"><svg class="icon">
                                <use xlink:href="/img/symbol-defs.svg#icon-edit-contents"></use></svg></router-link>
                            <a href="javascript:void(0)" class="btn btn-icon" title="삭제"
                                v-if="viewModel.userInfo.user_roles == 'ROLE_002'
                                && viewModel.userInfo.user_type_code == 'ACC_0001'
                                && viewModel.userInfo.ocpt_se_cd == 'MNG'"
                                @click="fnDelete(item.bplc_sn+','+item.job_plan_sn)">
                                <svg class="icon"><use xlink:href="/img/symbol-defs.svg#icon-delete-sweep"></use></svg></a>
                        </td>
                    </tr>
                    </template>
                    <template v-else>
                        <tr>
                            <td :colspan="viewModel.userInfo.user_roles == 'ROLE_001'?'10':'9'">조회 데이터가 없습니다.</td>
                        </tr>
                    </template>
                </tbody>
            </table>
            <div class="table_footer">
                <pager :pass="viewModel.pager"></pager>
                <div class="btn-group">
                    <router-link :to="'/preview/'" v-if="viewModel.userInfo.user_roles == 'ROLE_001' && viewModel.userInfo.user_type_code == 'ACC_0000'" class="btn btn-purple" title="주차별 미리보기">
                        <svg class="icon"><use xlink:href="/img/symbol-defs.svg#icon-search"></use></svg>주차별 미리보기</router-link>
                    <a href="#/write" class="btn btn-purple"
                        v-if="viewModel.userInfo.user_roles == 'ROLE_002'
                        && viewModel.userInfo.user_type_code == 'ACC_0001'
                        && viewModel.userInfo.ocpt_se_cd == 'MNG'">
                        <svg class="icon"><use xlink:href="/img/symbol-defs.svg#icon-post-add"></use></svg>등록</a>
                </div>
            </div>
        </div>
    </div>
    <excelform ref="excelform"></excelform>
</div>
</template>

<script>
    import "es6-promise/auto";
    import Vue from "vue";
    import Axios from "axios";
    import Pager from "../../../../common/vue/paging";
    import board from "../../../../common/js/board";
    import Message, {messageUtil} from "../../../../common/js/message";
    import excelform from "../../excelform.vue";

    export default {
        components: {
            'pager': Pager,
            'board' : board,
            'excelform': excelform,
        },
        data: function() {
            return {
                imgsrc:'',
                viewModel:{
                    data:{
                        mtg_month:'',
                        mtg_week:''
                    },
                    userInfo:{},
                    search:{
                        bplc_sn:'0',
                        text:'',
                        job_type:'0',
                        risk_se:'0',
                        bplc_use_yn:'',
                    },
                    chkAll:'',
                    chkInfoArr: [],
                    bplcList:[],
                    jobTypeList:[],
                    list: [],
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
            'viewModel.search.bplc_use_yn': {
                handler() {
                    let vm = this;
                    if(vm.viewModel.userInfo.user_roles == 'ROLE_001'){
                        vm.fnBplcList();
                    }
                }
            }
        },
        mounted: function() {
            let vm = this;

            //캘린더
            calendarInput();

            //메뉴 타이틀 상세 타이틀 설정(상세,등록,수정)
            ////board.fnGetMenuTitle(vm);
            vm.fnInit();

            vm.$router.afterEach(function(to, from){
                vm.fnList(vm.viewModel.pager.pageNo);
            })
        },
        methods: {
            fnInit:function(){
                let vm = this;
                vm.viewModel.userInfo = vm.$store.state.global.userInfo;

                vm.fnInitSearchLine();
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
                    vm.viewModel.bplcList = rs.data.list;

                    vm.viewModel.search.bplc_sn = '0';
                    if(vm.viewModel.userInfo.bplc_use_yn == 'Y' && vm.viewModel.search.bplc_use_yn == 'Y'){
                        vm.viewModel.search.bplc_sn = vm.viewModel.userInfo.bplc_sn == 0 ? '0' : vm.viewModel.userInfo.bplc_sn;
                    }
                });
            },
            fnChgRiskSe: function() {
                let vm = this;
                vm.viewModel.search.job_type = 0;
                vm.fnJobTypeList();
            },
            fnJobTypeList: function() {
                let vm = this;
                let send = {
                    mapperId:'HrMngmtPrcs.selectJobTypeList',
                    risk_se: vm.viewModel.search.risk_se,
                    job_type: vm.viewModel.search.job_type
                };

                Axios.post("/selectJobTypeList.do", send).then(function(response) {
                    vm.viewModel.jobTypeList = response.data;
                });
            },
            fnChkAll: function() {
                let vm = this;
                if(vm.viewModel.chkAll == 'Y') {
                    $('input[type=checkbox]').prop('checked',true);
                    $.each(vm.viewModel.list, function(idx, item) {
                        vm.viewModel.chkInfoArr.push([item.bplc_sn,item.job_plan_sn]);
                    });
                }
                else {
                    vm.viewModel.chkInfoArr = [];
                    $('input[type=checkbox]').prop('checked',false);
                }
            },
            fnRgstJobWeek: function() {
                let vm = this;

                if(vm.viewModel.chkInfoArr.length == 0) {
                    alert('현장명을 체크해 주세요.');
                    return;
                }

                if(vm.viewModel.data.mtg_week == '') {
                    alert('주차를 선택해 주세요.');
                    return;
                }

                if(!confirm('주차를 적용 하시겠습니까?')) {
                    return;
                }

                let send = {
                    chkInfo : vm.viewModel.chkInfoArr,
                    job_year : $('#mtg_year').val(),
                    job_month : vm.viewModel.data.mtg_month,
                    job_week : vm.viewModel.data.mtg_week
                };

                Axios.post("/updateJobWeek.do", send).then(function(response) {
                    if(response.data > 0) {
                        alert('적용 되었습니다.');
                        vm.fnList(0);
                    }
                });
            },
            fnList:function(paramPageNo){
				let vm = this;
				
                vm.viewModel.pager.pageNo = paramPageNo == 0 ? 1 : paramPageNo;
                let send = {
                    mapperId:'HrMngmtPrcs.selectHrWkPlanPrcs',
                    totalId:'HrMngmtPrcs.getHrWkPlanPrcsListTotalCount',
                    pageYn:'Y',
                    pageNo: vm.viewModel.pager.pageNo,
                    pageSize: vm.viewModel.pager.rowSize,
                    searchBplcSn: vm.viewModel.search.bplc_sn,
                    bplc_use_yn: vm.viewModel.search.bplc_use_yn,
                    searchText: vm.viewModel.search.text,
                    bplc_sn: vm.viewModel.search.bplc_sn,
                    reg_dt: $('#reg_dt').val(),
                    job_type: vm.viewModel.search.job_type,
                    risk_se: vm.viewModel.search.risk_se,
                    dept_sn: vm.viewModel.userInfo.dept_sn,
                    team_sn: vm.viewModel.userInfo.team_sn,
                };

                Axios.post("/selectHrWkPlanPrcs.do", send).then(function(response) {

                    vm.viewModel.list = response.data.list;
                    vm.viewModel.pager.totalSize = response.data.totalCNT;

                    //페이징세팅
                    Pager.props = Pager.methods.createPaging(vm.viewModel.pager, vm, "list");

                    let myDate = new Date();
                    let thisYear = myDate.getFullYear();
                    let thisMonth = myDate.getMonth() + 1 < 10? "0" + (myDate.getMonth() + 1): myDate.getMonth() + 1;
                    
                    vm.viewModel.data.mtg_month = thisMonth;

                    $(".yearpicker").yearpicker({
                        year: thisYear
                    });

                });
            },
            fnInitSearchLine : function() {
                let vm = this;
                $('.search_container select option:eq(0)').prop('selected',true);
                $('.search_container input[type=text]').val('');
                vm.viewModel.search = {
                    bplc_sn : (vm.viewModel.userInfo.bplc_yn == 'N' && (vm.viewModel.userInfo.bplc_sn == 0 || vm.viewModel.userInfo.bplc_use_yn == 'N')) ? '0' : vm.viewModel.userInfo.bplc_sn,
                    bplc_use_yn : vm.viewModel.userInfo.bplc_yn == 'N' ? 'Y' : 'A',
                    text:'',
                    job_type:'0',
                    risk_se:'0',
                }
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
                    mapperId: 'HrMngmtPrcs.deleteHrWkPlanPrcs',
                    mapperId_Rvw: 'HrMngmtPrcs.deleteHrWkPlanPrcsRvw',
                    bplc_sn_key: sn.split(',')[0],
                    job_plan_sn_key: sn.split(',')[1]
                }

                if(confirm(Message.DELETE_CONFIRM)){
                    Axios.post("/deleteHrWkPlanPrcs.do", send).then(function(response) {
                        if(response.data == 1){
                            alert(Message.DELETE_MESSAGE);
                            vm.fnList(0);
                        }
                    });
                }
            },
            fnExcelDownload: function () {
                let vm = this;
                // 자바 버전
                const header = ["현장명", "작업유형", "작업위치", "위험구분", "위험명", "등록일자", "일정"];
                const mapperId = 'selectHrWkPlanPrcs';
                //검색조건
                let data = {
                    header: header,
                    mapperId: mapperId,
                    searchBplcSn: vm.viewModel.search.bplc_sn,
                    bplc_use_yn: vm.viewModel.search.bplc_use_yn,
                    searchText: vm.viewModel.search.text,
                    bplc_sn: vm.viewModel.search.bplc_sn,
                    reg_dt: $('#reg_dt').val(),
                    job_type: vm.viewModel.search.job_type,
                    risk_se: vm.viewModel.search.risk_se,
                    dept_sn: vm.viewModel.userInfo.dept_sn,
                    team_sn: vm.viewModel.userInfo.team_sn,
                    // 파일명 
                    fileName: "대형(고)위험작업계획관리", // 스마트안전보건_년월일.xlsx
                };
                if (confirm("엑셀 출력 하시겠습니까?")) {
                    this.$nextTick(function () {
                        vm.$refs.excelform.fnInit(data);
                    })
                }
            },
        }
    };
</script>