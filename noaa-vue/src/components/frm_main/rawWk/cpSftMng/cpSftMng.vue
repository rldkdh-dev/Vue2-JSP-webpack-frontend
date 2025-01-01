<template>
<div>
    <div class="search_area">
        <button class="btn_toggle_search">검색</button>
        <div>
            <div class="search_container">
                <div class="row">
                    <input type="text" placeholder="협력업체명" title="협력업체명 입력" v-model="viewModel.search.ccpy_nm" v-on:keyup.enter="fnList(1)">
                    <!-- <input type="text" placeholder="검색어를 입력하세요." title="검색어 입력" v-model="viewModel.search.text" v-on:keyup.enter="fnList(0)"> -->
                </div>
            </div>
            <div class="btn-group">
                <a href="javascript:void(0)" class="btn btn-default-line" @click="fnInitSearchLine"><svg class="icon"><use xlink:href="/img/symbol-defs.svg#icon-refresh"></use></svg>초기화</a>
                <a href="javascript:void(0)" class="btn btn-default" @click="fnList(1)"><svg class="icon"><use xlink:href="/img/symbol-defs.svg#icon-search"></use></svg>검색</a>
            </div>
        </div>
    </div>
    <div class="contents">
        <div>
            <div class="search_area opened">
                <div>
                    <div class="input_group" style="width:20rem" v-if="viewModel.userInfo.user_roles == 'ROLE_001'">
                        <select id="list" v-model="viewModel.search.bplc_use_yn" class="wp28">
                            <option value="A">전체</option>
                            <option value="Y" selected="selected">운영</option>
                            <option value="N">종료</option>
                        </select>
                        <select id="" v-model="viewModel.search.bplc_sn" @change="fnBplcInfo">
                            <option value="0" disabled="">현장명 선택</option>
                            <option :value="item.bplc_sn" v-for="(item,i) in viewModel.bplcList" :key="i">{{ item.bplc_nm }}</option>
                        </select>
                    </div>
                    <input type="text" v-model="viewModel.userInfo.bplc_nm" v-if="viewModel.userInfo.user_roles != 'ROLE_001'" disabled />

                    <!-- <a href="" class="btn btn-default" style="width: 5%; display:inline-flex;" v-if="viewModel.userInfo.user_roles == 'ROLE_001'"><svg class="icon">
                            <use xlink:href="../../img/symbol-defs.svg#icon-search"></use>
                        </svg>검색</a> -->
                </div>
            </div>
            <div class="table_top box fx-js" v-if="viewModel.search.bplc_sn != 0">
                <ul>
                    <li><label for="">현장명</label> : {{ viewModel.bplcInfo.bplc_nm }}</li>
                    <li><label for="">안전관리계획서 등록 URL</label> : 
                        <button id="copyBtn" @click="copyUrl" :data-clipboard-text="viewModel.clipboard" class="btn btn-small btn-white" title="안전관리계획서 등록 URL">복사</button>
                    </li>
                    <li><label for="">접속코드</label> : {{ viewModel.bplcInfo.urlcntn_cd }}</li>
                </ul>
            </div>
            <div class="">
                <div>
                    <div class="table_top">
                        <div class="total_count">총 <em>{{ viewModel.pager.totalSize }}</em>건</div>
                        <!-- <div class="icon_box">
                            <button class="btn btn-white"><i class="icon_pdf"></i></button>
                            <button class="btn btn-white"><i class="icon_word"></i></button>
                            <button class="btn btn-white"><i class="icon_ppt"></i></button>
                            <button class="btn btn-white"><i class="icon_excel"></i></button>
                        </div> -->
                        <select title="개수 선택" v-model="viewModel.pager.rowSize" @change="fnChangeCNTSelect(viewModel.pager.rowSize);">
                            <option value="10">10개씩 보기</option>
                            <option value="30">30개씩 보기</option>
                            <option value="50">50개씩 보기</option>
                            <option value="100">100개씩 보기</option>
                        </select>
                    </div>
                    <table class="table">
                        <caption>협력업체안전관리</caption>
                        <thead>
                            <tr>
                                <th scope="col" class="w50">번호</th>
                                <th scope="col">협력업체명</th>
                                <th scope="col">안전보건현황</th>
                                <th scope="col">안전관리계획서</th>
                                <th scope="col">사전협의</th>
                                <th scope="col">사업부승인</th>
                                <th scope="col">검토의견서</th>
                                <th scope="col">현장소장 업체평가</th>
                            </tr>
                        </thead>
                        <tbody>
                            <template v-if="viewModel.list.length > 0">
                            <tr v-for="(item, i) in viewModel.list" :key="i">
                                <td>{{(viewModel.pager.pageNo==1) ? viewModel.pager.totalSize-i : viewModel.pager.totalSize-((viewModel.pager.rowSize*(viewModel.pager.pageNo-1))+i)}}</td>
                                <td>{{ item.ccpy_nm }}</td>
                                <td><a href="javascript:void(0)" class="btn btn-small btn-white" @click="fnPopup('D',item.bplc_sn,item.sfmng_sn)">보기</a></td>
                                <td id="f_01">
                                    <a href="javascript:void(0)" v-if="item.p_file_sn == null" class="btn btn-small btn-white" @click="fnPopup('P',item.bplc_sn,item.sfmng_sn)">파일</a>
                                    <a href="javascript:void(0)" v-else class="btn btn-icon" title="첨부파일" @click="fnPopup('P',item.bplc_sn,item.sfmng_sn)">
                                        <svg class="icon"><use xlink:href="/img/symbol-defs.svg#icon-attachment"></use></svg>
                                    </a>
                                </td>
                                <td id="f_02">
                                    <a href="javascript:void(0)" v-if="item.c_file_sn == null" class="btn btn-small btn-blue" @click="fnPopup('C',item.bplc_sn,item.sfmng_sn)">등록</a>
                                    <a href="javascript:void(0)" v-else class="btn btn-icon" title="첨부파일" @click="fnPopup('C',item.bplc_sn,item.sfmng_sn)">
                                        <svg class="icon"><use xlink:href="/img/symbol-defs.svg#icon-attachment"></use></svg>
                                    </a>
                                </td>
                                <td id="f_03"><a href="javascript:void(0)" class="btn btn-small btn-blue"
                                     :disabled="(item.p_file_sn == null || item.c_file_sn == null)"
                                     :title="(item.p_file_sn == null || item.c_file_sn == null) ? '안전관리계획서, 사전협의를 먼저 등록해 주세요.' : '사업부승인 등록'"
                                     @click="fnPopup('A',item.bplc_sn,item.sfmng_sn)">
                                     {{ item.bizdept_aprv_stts == null ? '등록' : item.bizdept_aprv_stts == 'Y' ? '완료' : '보류'}}
                                    </a></td>
                                <td id="f_04"><a href="javascript:void(0)" class="btn btn-small btn-blue"
                                     :disabled="item.bizdept_aprv_stts == 'N'"
                                     :title="item.bizdept_aprv_stts == 'N' ? '사업부승인을 등록해 주세요.' : '검토의견서 등록'"
                                     @click="fnPopup('R',item.bplc_sn,item.sfmng_sn)">
                                     {{ item.rvw_opnn_reg_yn == null ? '등록' : item.rvw_opnn_reg_yn == 'Y' ? '완료' : '보류'}}
                                    </a></td>
                                <td id="f_05"><a href="javascript:void(0)" class="btn btn-small btn-blue"
                                     :disabled="item.rvw_opnn_reg_yn == 'N'"
                                     :title="item.rvw_opnn_reg_yn == 'N' ? '현장소장 업체평가를 등록해 주세요.' : '현장소장 업체평가 등록'"
                                     @click="fnPopup('S',item.bplc_sn,item.sfmng_sn)">
                                    {{ item.rvw_opnn_reg_yn == 'Y' ? (Number(item.score_sum) >= 70 ? '적합' : '부적합') : '등록' }}
                                    </a></td>
                            </tr>
                            </template>
                            <template v-else>
                            <tr>
                                <td colspan="8">조회 데이터가 없습니다.</td>
                            </tr>
                            </template>
                        </tbody>
                    </table>
                    <div class="table_footer">
                        <pager :pass="viewModel.pager"></pager>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <cpSftMngDetailPopup ref="cpSftMngDetailPopup" id="cpSftMngDetailPopup" v-if="showCpSftMngDetailPop==true"></cpSftMngDetailPopup>
    <cpSftMngPlanPopup ref="cpSftMngPlanPopup" id="cpSftMngPlanPopup" v-if="showCpSftMngPlanPop==true"></cpSftMngPlanPopup>
    <cpSftMngConferPopup ref="cpSftMngConferPopup" id="cpSftMngConferPopup" v-if="showCpSftMngConferPop==true"></cpSftMngConferPopup>
    <cpSftMngAprvPopup ref="cpSftMngAprvPopup" id="cpSftMngAprvPopup" v-if="showCpSftMngAprvPop==true"></cpSftMngAprvPopup>
    <cpSftMngReviewPopup ref="cpSftMngReviewPopup" id="cpSftMngReviewPopup" v-if="showCpSftMngReviewPop==true"></cpSftMngReviewPopup>
    <cpSftMngAssmtPopup ref="cpSftMngAssmtPopup" id="cpSftMngAssmtPopup" v-if="showCpSftMngAssmtPop==true"></cpSftMngAssmtPopup>
</div>
</template>

<script>
    import "es6-promise/auto";
    import Vue from "vue";
    import Axios from "axios";
    import Pager from "../../../../common/vue/paging";
    import cpSftMngDetailPopup from "./popup/cpSftMngDetailPopup";
    import cpSftMngPlanPopup from "./popup/cpSftMngPlanPopup";
    import cpSftMngConferPopup from "./popup/cpSftMngConferPopup";
    import cpSftMngAprvPopup from "./popup/cpSftMngAprvPopup";
    import cpSftMngReviewPopup from "./popup/cpSftMngReviewPopup";
    import cpSftMngAssmtPopup from "./popup/cpSftMngAssmtPopup";
    
    export default {
        components: {
            'pager': Pager,
            'cpSftMngDetailPopup': cpSftMngDetailPopup,
            'cpSftMngPlanPopup': cpSftMngPlanPopup,
            'cpSftMngConferPopup': cpSftMngConferPopup,
            'cpSftMngAprvPopup': cpSftMngAprvPopup,
            'cpSftMngReviewPopup': cpSftMngReviewPopup,
            'cpSftMngAssmtPopup': cpSftMngAssmtPopup
        },
        data: function() {
            return {
                showCpSftMngDetailPop: false,
                showCpSftMngPlanPop: false,
                showCpSftMngConferPop: false,
                showCpSftMngAprvPop: false,
                showCpSftMngReviewPop: false,
                showCpSftMngAssmtPop: false,

                viewModel:{
                    clipboard: '',
                    userInfo:{},
                    bplcList:[],
                    bplcInfo:{},
                    bplc_sn:'0',
                    list:[],
                    search: {
                        ccpy_nm: '',
                        bplc_nm:'',
                        bplc_sn:'',
                        bplc_use_yn:''
                    },
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
                    scoreSum:0
                }
            };
        },
        mounted: function() {
            let vm = this;
            vm.fnInit();
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
            fnInit:function(){
                let vm = this;
                vm.viewModel.userInfo = vm.$store.state.global.userInfo;
                vm.viewModel.search.bplc_use_yn = vm.viewModel.userInfo.bplc_yn == 'N' ? 'Y' : 'A';
                vm.viewModel.search.bplc_sn = (vm.viewModel.userInfo.bplc_yn == 'N' && (vm.viewModel.userInfo.bplc_sn == 0 || vm.viewModel.userInfo.bplc_use_yn == 'N')) ? '0' : vm.viewModel.userInfo.bplc_sn;

                if(vm.viewModel.search.bplc_sn != '0'){
                    vm.fnBplcInfo();
                }
            },
            fnBplcList: function() {
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
            fnBplcInfo: function() {
                let vm = this;
                let send = {
                    bplc_sn : vm.viewModel.search.bplc_sn
                };
                
                Axios.post("/selectBplcInfo.do", send).then(function(response) {
                    vm.viewModel.bplcInfo = response.data[0];
                    vm.fnList(1);
                });
            },
            fnList:function(paramPageNo){
				let vm = this;
                vm.viewModel.pager.pageNo = paramPageNo == 0 ? 1 : paramPageNo;
                
                let send = {
                    pageYn: 'Y',
                    pageNo: vm.viewModel.pager.pageNo,
                    pageSize: vm.viewModel.pager.rowSize,
                    bplc_sn: vm.viewModel.search.bplc_sn,
                    ccpy_nm: vm.viewModel.search.ccpy_nm,
                }
                Axios.post("/selectCpSftMnglist.do", send).then(function(response) {
                    vm.viewModel.list = response.data.list;
                    vm.viewModel.pager.totalSize = response.data.totalCNT;
                    
                    //페이징세팅
                    Pager.props = Pager.methods.createPaging(vm.viewModel.pager, vm, "list");

                    //복사
                    //if(vm.viewModel.bplcInfo.length > 0) 
                    {
                        vm.viewModel.clipboard = '현장명 : ' + vm.viewModel.bplcInfo.bplc_nm + '\n'+
                                            '안전관리계획서 등록 URL : ' + response.data.cpSftMng_url + 'openCntn.do?sn=' + vm.viewModel.bplcInfo.bplc_sn + '\n'+
                                            '접속코드 : ' + vm.viewModel.bplcInfo.urlcntn_cd;
                    }

                    //파일 등록이후 아이콘 변경..
                    if(vm.viewModel.list.length > 0) {
                        $.each(vm.viewModel.list, function(idx, item) {

                            //console.log(' item : ' , item);

                            if(item.p_file_sn == null) $('#f_01 a').removeClass('btn-icon').addClass('btn-small btn-white');
                            else $('#f_01 a').removeClass('btn-small btn-white').addClass('btn-icon');

                            if(item.c_file_sn == null) $('#f_02 a').removeClass('btn-icon').addClass('btn-small btn-blue');
                            else $('#f_02 a').removeClass('btn-small btn-blue').addClass('btn-icon');

                            var bizdept_aprv_stts = item.bizdept_aprv_stts == null ? '등록' : item.bizdept_aprv_stts == 'Y' ? '완료' : '보류';
                            $('#f_03 a').text(bizdept_aprv_stts);
                            var rvw_opnn_reg_yn = item.rvw_opnn_reg_yn == null ? '등록' : item.rvw_opnn_reg_yn == 'Y' ? '완료' : '보류';
                            $('#f_04 a').text(rvw_opnn_reg_yn);
                            var score_sum = item.rvw_opnn_reg_yn == 'Y' ? (Number(item.score_sum) >= 70 ? '적합' : '부적합') : '등록';
                            $('#f_05 a').text(score_sum);
                            
                        });
                    }
                    
                    
                });
            },
            fnInitSearchLine : function() {
                let vm = this;
                $('.search_container input[type=text]').val('');
                vm.viewModel.search = {
                        ccpy_nm:''
                    };
            },
            //페이징 처리
            fnChangeCNTSelect: function(rowSize) {
                let vm = this;
                if(rowSize != undefined || rowSize > 0) {
                    vm.viewModel.pager.rowSize = rowSize;
                    vm.fnList(1);
                }
            },
            fnPopup: function(flag,bplc_sn,sfmng_sn) {
                let vm = this;
                vm.showCpSftMngDetailPop = false;
                vm.showCpSftMngPlanPop = false;
                vm.showCpSftMngConferPop = false;
                vm.showCpSftMngAprvPop = false;
                vm.showCpSftMngReviewPop = false;
                vm.showCpSftMngAssmtPop = false;

                if(flag == 'D') { //안전보건 현황
                    // $('.modal_wrap.detail').show();
                    vm.showCpSftMngDetailPop = true;
                    if(vm.showCpSftMngDetailPop){
                        vm.$nextTick(function(){
                            vm.$refs.cpSftMngDetailPopup.fnInit([bplc_sn,sfmng_sn]);
                        });
                    }
                } else if(flag == 'P') { //안전관리 계획서
                    vm.showCpSftMngPlanPop = true;
                    // $('.modal_wrap.plan').show();
                    
                    if(vm.showCpSftMngPlanPop){
                        vm.$nextTick(function(){
                            vm.$refs.cpSftMngPlanPopup.fnInit([bplc_sn,sfmng_sn]);
                        });
                    }
                } else if(flag == 'C') { //사전 협의
                    vm.showCpSftMngConferPop = true;
                    // $('.modal_wrap.confer').show();
                    // vm.$refs.cpSftMngConferPopup.fnInit([bplc_sn,sfmng_sn]);
                    if(vm.showCpSftMngConferPop){
                        vm.$nextTick(function(){
                            vm.$refs.cpSftMngConferPopup.fnInit([bplc_sn,sfmng_sn]);
                        });
                    }
                } else if(flag == 'A') { //사업부 승인
                    vm.showCpSftMngAprvPop = true;
                    // $('.modal_wrap.aprv').show();
                    // vm.$refs.cpSftMngAprvPopup.fnInit([bplc_sn,sfmng_sn]);
                    if(vm.showCpSftMngAprvPop){
                        vm.$nextTick(function(){
                            vm.$refs.cpSftMngAprvPopup.fnInit([bplc_sn,sfmng_sn]);
                        });
                    }
                } else if(flag == 'R') { //검토 의견서
                    vm.showCpSftMngReviewPop = true;
                    // $('.modal_wrap.review').show();
                    // vm.$refs.cpSftMngReviewPopup.fnInit([bplc_sn,sfmng_sn]);
                    if(vm.showCpSftMngReviewPop){
                        vm.$nextTick(function(){
                            vm.$refs.cpSftMngReviewPopup.fnInit([bplc_sn,sfmng_sn]);
                        });
                    }
                } else if(flag == 'S') { //현장소장 업체평가
                    // $('.modal_wrap.assmt').show();
                    vm.showCpSftMngAssmtPop = true;
                    // vm.$refs.cpSftMngAssmtPopup.fnInit([bplc_sn,sfmng_sn]);
                    if(vm.showCpSftMngAssmtPop){
                        vm.$nextTick(function(){
                            vm.$refs.cpSftMngAssmtPopup.fnInit([bplc_sn,sfmng_sn]);
                        });
                    }
                }
			},
            copyUrl: function() {
                let vm = this;
                var clipboard = new ClipboardJS('#copyBtn');
      
                clipboard.on('success', function(e) {
                    //console.log('success : ' , e);
                });
            
                clipboard.on('error', function(e) {
                    //console.log('error : ' , e);
                });
            },
            fnFileDown:function(item){
                let vm = this;
                let send = {
                    gbn: 'cpSftMng',
                    bplc_sn: item.bplc_sn,
                    sfmng_sn: vm.viewModel.sfmng_sn,
                    atchmnfl_sn: item.atchmnfl_sn,
                    orgnl_file_nm: item.orgnl_file_nm
                }
                
                $(".loading").show();
                $("#mask").show();

                Axios.post("/download.do",send,{responseType: "blob",}).then(function(e) {
                    const url = window.URL.createObjectURL(new Blob([e.data], { type: e.headers["content-type"] }));
                    const link = document.createElement("a");
                    link.href = url;
                    link.download = item.orgnl_file_nm;
                    link.click();
                    window.URL.revokeObjectURL(url);
                }).then(function(){
                    $(".loading").hide();
                    $("#mask").hide();
                });
            }
        }
    };
</script>