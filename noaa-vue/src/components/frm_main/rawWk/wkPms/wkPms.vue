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
                                <option value='0'>현장명 선택</option>
                                <option v-for="(item, i) in viewModel.searchBplcList" :key="i" :value="item.bplc_sn">{{ item.bplc_nm }}</option>
                            </select>
                        </div>
                        <select title="작업유형" v-model="viewModel.search.jobType">
                            <option v-for="(item, i) in viewModel.jobTypeList" :key="i" :value="item.value">{{ item.text }}</option>
                        </select>
                        <div class="datepicker_box">
                            <input type="text" class="datepicker" id="reg_bgng_day" title="datepicker" placeholder="등록기간 시작일" readonly>
                        </div>
                        <span>~</span>
                        <div class="datepicker_box">
                            <input type="text" class="datepicker" id="reg_end_day" title="datepicker" placeholder="등록기간 종료일" readonly>
                        </div>
                        <input type="text" placeholder="작성자를 입력하세요." title="작성자 입력" v-model="viewModel.search.wrtr">
                    </div>
                </div>
                <div class="btn-group">
                    <button class="btn btn-default-line" @click="fnInitSearchLine()"><svg class="icon"><use xlink:href="/img/symbol-defs.svg#icon-refresh"></use></svg>초기화</button>
                    <button class="btn btn-default" @click="fnList(0)"><svg class="icon"><use xlink:href="/img/symbol-defs.svg#icon-search"></use></svg>검색</button>
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
                    <caption>작업허가서</caption>
                    <thead> 
                        <tr>
                            <th scope="col" class="w50">번호</th>
                            <th scope="col">유형</th>
                            <th scope="col" v-if="viewModel.userInfo.user_roles == 'ROLE_001'">현장명</th>
                            <th scope="col">작성자</th>
                            <th scope="col">등록일</th>
                            <th scope="col">점검결과</th>
                            <th scope="col">승인여부</th>
                            <th scope="col">양식</th>
                            <th scope="col">관리</th>
                        </tr>
                    </thead>
                    <tbody>
                        <template v-if="viewModel.list.length != 0">
                            <tr v-for="(item, i) in viewModel.list" :key="i">
                                <td>{{(viewModel.pager.pageNo==1) ? viewModel.pager.totalSize-i : viewModel.pager.totalSize-((viewModel.pager.rowSize*(viewModel.pager.pageNo-1))+i)}}</td>
                                <td>{{ item.job_type }}</td>
                                <td class="text-left" v-if="viewModel.userInfo.user_roles == 'ROLE_001'"><router-link :to="{name: 'wkPmsDetail', params: {job_rpmsn_sn:item.job_rpmsn_sn, job_rpmsn_no:item.job_type_no}}" class="btn-link" title="상세보기">{{ item.bplc_nm }}</router-link></td>
                                <td>{{item.jbttl_id}}</td>
                                <td>{{item.reg_dt}}</td>
                                <td>
                                    <button class="btn btn-small btn-white" v-if="item.chck_cnt > 0" @click="fnChckRsltPopup(item.job_rpmsn_sn)">조회</button>
                                </td>
                                <td>
                                    <button v-if="item.last_aprv_yn == 'N'" class="btn btn-small btn-white">진행중</button>
                                    <template v-else>완료</template>
                                </td>
                                <td>
                                    <button class="btn btn-small btn-white" @click="fnDown(item.job_rpmsn_sn,item.job_type_no)">다운로드</button>
                                </td>
                                <td>
                                    <router-link :to="{name: 'wkPmsDetail', params: {job_rpmsn_sn:item.job_rpmsn_sn, job_rpmsn_no:item.job_type_no}}" class="btn btn-icon" title="상세보기"><svg class="icon"><use xlink:href="/img/symbol-defs.svg#icon-content-search"></use></svg></router-link>
                                    <router-link v-if="viewModel.userInfo.user_id == item.wrtr" :to="{name: 'wkPmsUpdate', params: {job_rpmsn_sn:item.job_rpmsn_sn, job_rpmsn_no:item.job_type_no}}" class="btn btn-icon" title="수정"><svg class="icon"><use xlink:href="/img/symbol-defs.svg#icon-edit-contents"></use></svg></router-link>
                                    <a href="javascript:void(0)" v-if="viewModel.userInfo.user_id == item.wrtr" class="btn btn-icon" @click="fnDelete(item.job_rpmsn_sn)" title="삭제"><svg class="icon"><use xlink:href="/img/symbol-defs.svg#icon-delete-sweep"></use></svg></a>
                                </td>
                            </tr>
                        </template>
                        <template v-else>
                            <tr>
                                <td :colspan="viewModel.userInfo.user_roles == 'ROLE_001' ? '9' : '8'">
                                    게시글이 없습니다.
                                </td>
                            </tr>
                        </template>
                    </tbody>
                </table>
                <div class="table_footer">
                    <pager :pass="viewModel.pager"></pager>
                    <div class="btn-group" v-if="viewModel.userInfo.bplc_yn == 'Y' && viewModel.userInfo.ocpt_se_cd == 'MNG'">
                        <a href="#/write" class="btn btn-purple"><svg class="icon"><use xlink:href="/img/symbol-defs.svg#icon-post-add"></use></svg>등록</a>
                    </div>
                </div>
            </div>
        </div>
        <chckRsltPopup ref="chckRsltPopup" v-if="chckRsltPop==true"></chckRsltPopup>
        <wkPmsDown v-if="isDown"></wkPmsDown>
    </div>
        </template>
        
        <script>
        import "es6-promise/auto";
        import Vue from "vue";
        import Axios from "axios";
        import pager from "../../../../common/vue/paging.vue";
        import board from "../../../../common/js/board";
        import chckRsltPopup from "./popup/wkPmsChkRsltPopup.vue";
        import wkPmsDown from '../../../../components/frm_main/rawWk/wkPms/wkPmsDown.vue';
        import Eventbus from "../../../../common/js/eventbus.js";
        
        export default {
            components: {
                'pager': pager,
                'board' : board,
                'chckRsltPopup': chckRsltPopup,
                wkPmsDown,
            },
            data: function() {
                return {
                    fileViewPop:false,
                    chckRsltPop:false,
                    isDown:true,
                    searchBplcList:[],
                    viewModel:{
                        jobTypeList:[
                            {value:"", text:"작업 유형을 선택해주세요."},
                            {value:"1", text:"사다리 사용 작업"},
                            {value:"2", text:"화재위험 작업"},
                            {value:"3", text:"밀폐공간 작업"}
                        ],
                        search:{
                            jobType:"",
                            wrtr:'',
                            bplc_sn:0,
                            bplc_use_yn:''
                        },
                        userInfo:{},
                        imgsrc:'',
                        list:[],
                        job_rpmsn_sn : '',
                        selectList:[],
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
                vm.viewModel.userInfo=vm.$store.state.global.userInfo;
                calendarInput();
                vm.fnInit();
                // if(vm.viewModel.userInfo.user_roles == 'ROLE_001' && vm.viewModel.userInfo.user_type_code == 'ACC_0000'){
                //     vm.fnBplcList();
                // }
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
                fnInitSearchLine : function() {
                    let vm = this;
                    vm.viewModel.search = {
                        bplc_use_yn : vm.viewModel.userInfo.bplc_yn == 'N' ? 'Y' : 'A',
                        bplc_sn: (vm.viewModel.userInfo.bplc_yn == 'N' && (vm.viewModel.userInfo.bplc_sn == 0 || vm.viewModel.userInfo.bplc_use_yn == 'N')) ? '0' : vm.viewModel.userInfo.bplc_sn,
                        jobType: '',
                        wrtr: '',
                    }
                    $('#reg_bgng_day').val("");
                    $('#reg_end_day').val("");
                },
                fnInit:function(){
                    let vm = this;
                    vm.viewModel.userInfo = vm.$store.state.global.userInfo;
                    vm.viewModel.search.bplc_use_yn = vm.viewModel.userInfo.bplc_yn == 'N' ? 'Y' : 'A';
                    vm.viewModel.search.bplc_sn = (vm.viewModel.userInfo.bplc_yn == 'N' && (vm.viewModel.userInfo.bplc_sn == 0 || vm.viewModel.userInfo.bplc_use_yn == 'N')) ? '0' : vm.viewModel.userInfo.bplc_sn;

                    vm.fnList(0);
                },
                fnList:function(paramPageNo){
                    let vm = this;
                    vm.viewModel.pager.pageNo = paramPageNo == 0 ? 1 : paramPageNo;
                    let send = {
                        pageNo:vm.viewModel.pager.pageNo,
                        pageSize:vm.viewModel.pager.rowSize,
                        pageYn:'Y',
                        bplc_yn: vm.viewModel.userInfo.bplc_yn,
                        job_type:vm.viewModel.search.jobType,
                        wrtr: vm.viewModel.search.wrtr,
                        reg_bgng_day: $('#reg_bgng_day').val(),
                        reg_end_day: $('#reg_end_day').val(),
                        bplc_sn: vm.viewModel.search.bplc_sn,
                        bplc_use_yn: vm.viewModel.search.bplc_use_yn,
                        dept_sn: vm.viewModel.userInfo.dept_sn,
                        team_sn: vm.viewModel.userInfo.team_sn,
                    }

                    Axios.post("/selectWkPmsList.do",send).then(function(res){
                        vm.viewModel.list = res.data.list;
                        vm.viewModel.pager.totalSize = res.data.totalCNT;
                        pager.props = pager.methods.createPaging(vm.viewModel.pager, vm, "list");

                    });
                },
    
                fnDelete:function(job_rpmsn_sn){
                    let vm = this;
                    let send = {
                        job_rpmsn_sn : job_rpmsn_sn 
                    }
                    if(confirm('정말 삭제하시겠습니까?')) { 
                        Axios.post('/deleteRgstWkPms.do', send).then(function(res){
                            alert('삭제되었습니다.');
                            vm.fnList(0);                    
                        })
                    } else { 
                        alert('취소되었습니다.');
                    }
                    
                },
                fnPopup: function(sn, se) {
                    let vm = this;
    
                    let send = {
                        sn: sn
                        , bplc_sn: se
                    }
    
                    Axios.post("/selectRgstWkPmsFileList.do", send)
                    .then(function(response) {
                        vm.fileViewPop=true;
                        vm.$nextTick(function() {
                            if(vm.fileViewPop) {
                                vm.$refs.fileViewPopup.fnInit(response.data.fileList, 'rawWk');
                            }
                        }) 
                    });	
                },
                fnDown:function(job_rpmsn_sn,job_type){
                    Eventbus.$emit('pdf-download',job_rpmsn_sn,job_type);
                },
                
                //페이징 처리
                fnChangeCNTSelect: function(rowSize) {
                    let vm = this;
                    if(rowSize != undefined || rowSize > 0) {
                        vm.viewModel.pager.rowSize = rowSize;
                        vm.fnList(0);
                    }
                },
                fnChckRsltPopup: function(sn){
                    let vm = this;
                    vm.chckRsltPop=true;
                    vm.$nextTick(function() {
                        if(vm.chckRsltPop) {
                            vm.$refs.chckRsltPopup.fnInit(sn);
                        }
                    })
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

                    vm.viewModel.search.bplc_sn = '0';
                    if(vm.viewModel.userInfo.bplc_use_yn == 'Y' && vm.viewModel.search.bplc_use_yn == 'Y'){
                        vm.viewModel.search.bplc_sn = vm.viewModel.userInfo.bplc_sn == 0 ? '0' : vm.viewModel.userInfo.bplc_sn;
                    }
                });
            },
            }
        };
        </script>