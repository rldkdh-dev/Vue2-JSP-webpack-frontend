<template>
<div>
    <div class="search_area">
        <button class="btn_toggle_search">검색</button>
        <div>
            <div class="search_container">
                <div class="row">
                    <!-- <select title="현장명" v-model="viewModel.search.bplc_sn" v-if="viewModel.userInfo.bplc_yn == 'N'">
                        <option value="">현장명 선택</option>
                        <option v-for="(item, i) in viewModel.searchBplcList" :key="i" :value="item.bplc_sn">{{ item.bplc_nm }}</option>
                    </select> -->
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
                    <div class="datepicker_box">
                        <input type="text" class="datepicker" :id="'sdt'" placeholder="안전검사유효기간" title="안전검사유효기간" readonly ref="sdt">
                    </div>
                    <span>~</span>
                    <div class="datepicker_box">
                        <input type="text" class="datepicker" :id="'edt'" placeholder="안전검사유효기간" title="안전검사유효기간" readonly ref="edt">
                    </div>
                    <select title="장비구분" v-model="viewModel.search.hqp_sn">
                        <option selected value="">장비구분 선택</option>
                        <option v-for="(item, i) in viewModel.hqpList" :key="i" :value="item.hqp_sn">{{ item.hqp_nm }}</option>
                    </select>
                    <input type="text" placeholder="장비명 입력하세요." title="장비명 입력" v-model="viewModel.search.hqp_mng_nm">
                    <input type="text" placeholder="장비번호 입력하세요." title="장비번호 입력" v-model="viewModel.search.hqp_no">
                    <input type="text" placeholder="차량번호 입력하세요." title="차량번호 입력" v-model="viewModel.search.lcns_no">
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
                <caption>중장비 관리</caption>
                <thead>
                    <tr>
                        <th scope="col" class="w50">번호</th>
                        <th scope="col" v-if="viewModel.userInfo.user_roles == 'ROLE_001'">현장</th>
                        <th scope="col">장비구분</th>
                        <th scope="col">중장비명</th>
                        <th scope="col">장비번호</th>
                        <th scope="col">차량번호</th>
                        <th scope="col">담당자</th>
                        <th scope="col">안전검사<br>유효기간</th>
                        <th scope="col">안전작업 계획서<br>작성일</th>
                        <th scope="col">자율안전점검표</th>
                        <th scope="col">QR코드</th>
                        <th scope="col">첨부</th>
                        <th scope="col">관리</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, i) in viewModel.list" :key="i">
                        <td>{{(viewModel.pager.pageNo==1) ? viewModel.pager.totalSize-i : viewModel.pager.totalSize-((viewModel.pager.rowSize*(viewModel.pager.pageNo-1))+i)}}</td>
                        <td class="text-left" v-if="viewModel.userInfo.user_roles == 'ROLE_001'">{{ item.bplc_nm }}</td>
                        <td class="text-left">{{ item.hqp_nm }}</td>
                        <td class="text-left"><router-link :to="'/detail/'+item.manage_sn" class="btn-link">{{ item.hqp_mng_nm }}</router-link></td>
                        <td class="text-left">{{ item.hqp_no }}</td>  
                        <td class="text-left">{{ item.lcns_no }}</td>  
                        <td class="text-left">{{ item.pic_nm }}</td>
                        <td>{{ item.safe_chck_vld_pd|yyyyMMdd }}</td>
                        <td>{{ item.safe_work_actpln_wrt_dt|yyyyMMdd }}</td>
                        <td>
                            <button :class="'btn btn-small btn-blue'" @click="fnViewPopup(item.manage_sn, item.hqp_sn);"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-manage-search"></use></svg>출력</button>
                        </td>
                        <td>
                            <button :class="'btn btn-small btn-blue'" @click="fnQrPopup(item.manage_sn);"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-manage-search"></use></svg>출력</button>
                        </td>
                        <td>
                            <button v-if="item.file_cnt > 0" class="btn btn-icon" @click="fnPopup(item.manage_sn);"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-attachment"></use></svg></button>
                        </td>
                        <td>
                            <router-link :to="'/detail/'+item.manage_sn" class="btn btn-icon"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-content-search"></use></svg></router-link>
                            <template v-if="item.reg_id == viewModel.userInfo.user_id">
                                <router-link :to="'/write/'+item.manage_sn" class="btn btn-icon"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-edit-contents"></use></svg></router-link>
                                <button class="btn btn-icon" @click="fnDelete(item.manage_sn)"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-delete-sweep"></use></svg></button>
                            </template>
                        </td>
                    </tr>
                    <tr v-if="viewModel.list.length == 0"><td :colspan="viewModel.userInfo.user_roles == 'ROLE_001' ? '13' : '12'">게시물이 없습니다.</td></tr>
                </tbody>
            </table>
            <div class="table_footer">
                <pager :pass="viewModel.pager"></pager>
                <div class="btn-group"> 
                    <router-link :to="'/write'" class="btn btn-purple"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-post-add"></use></svg>등록</router-link>
                </div>
            </div>
        </div>
    </div>
    <viewPopup ref="viewPopup" v-if="viewPop==true"></viewPopup>
    <qrPopup ref="qrPopup" v-if="qrPop==true"></qrPopup>
    <fileViewPopup ref="fileViewPopup" v-if="fileViewPop==true"></fileViewPopup>
</div>
</template>

<script>
    import "es6-promise/auto";
    import Vue from "vue";
    import Axios from "axios";
    import Common from '../../../../common/js/common.js';
    import Pager from "../../../../common/vue/paging.vue";
    import Message, {messageUtil} from "../../../../common/js/message";
    import viewPopup from "./popup/fcltMngmtViewPopup.vue";
    import qrPopup from "./popup/fcltMngmtQRPopup.vue";
    import fileViewPopup from "../../popup/fileViewPopup.vue";

    export default {
        components: {
            'pager': Pager,
            'viewPopup': viewPopup,
            'qrPopup': qrPopup,
            'fileViewPopup': fileViewPopup,
        },
        data: function() {
            return {
                fileViewPop:false,
                qrPop:false,
                viewPop:false,
                viewModel:{
                    search:{
                        bplc_sn:'',
                        bplc_use_yn:'',
                        hqp_sn:'',
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
             //기본세팅
             fnInit:function(){
                let vm = this;
                vm.viewModel.userInfo = vm.$store.state.global.userInfo;
                vm.viewModel.search.bplc_use_yn = vm.viewModel.userInfo.bplc_yn == 'N' ? 'Y' : 'A';
                vm.viewModel.search.bplc_sn = (vm.viewModel.userInfo.bplc_yn == 'N' && (vm.viewModel.userInfo.bplc_sn == 0 || vm.viewModel.userInfo.bplc_use_yn == 'N')) ? '' : vm.viewModel.userInfo.bplc_sn;

                vm.fnList(1);
                calendarInput();
            },
            //초기화
            fnRefresh: function(){
                let vm = this;
                vm.viewModel.search = {
                    bplc_use_yn : vm.viewModel.userInfo.bplc_yn == 'N' ? 'Y' : 'A',
                    bplc_sn: (vm.viewModel.userInfo.bplc_yn == 'N' && (vm.viewModel.userInfo.bplc_sn == 0 || vm.viewModel.userInfo.bplc_use_yn == 'N')) ? '' : vm.viewModel.userInfo.bplc_sn,
                    hqp_sn :''
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
                    bplc_use_yn: vm.viewModel.search.bplc_use_yn,
                    safe_chck_vld_pd_s: vm.$refs.sdt.value,
                    safe_chck_vld_pd_e: vm.$refs.edt.value,
                    hqp_sn: vm.viewModel.search.hqp_sn,
                    hqp_mng_nm: vm.viewModel.search.hqp_mng_nm,
                    hqp_no: vm.viewModel.search.hqp_no,
                    lcns_no: vm.viewModel.search.lcns_no,
                    bplc_yn: vm.viewModel.userInfo.bplc_yn,
                    u_bplc_sn: vm.viewModel.userInfo.bplc_sn,
                    reg_id: vm.viewModel.userInfo.user_id,
                    dept_sn: vm.viewModel.userInfo.dept_sn,
                    team_sn: vm.viewModel.userInfo.team_sn,
                }
                Axios.post("/selectFcltMngmtList.do", send)
                .then(function(response) {
                    vm.viewModel.list = response.data.list;
                    vm.viewModel.pager.totalSize = response.data.totalCNT;

                    // //조회조건 현장명
                    // vm.viewModel.searchBplcList = response.data.searchBplcList;

                    //장비구분
                    vm.viewModel.hqpList = response.data.hqpList;

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
            //삭제
            fnDelete:function(sn){
                let vm = this;
                let send = {
                    manage_sn: sn
                }
                if(confirm(Message.DELETE_CONFIRM)){
                    Axios.post("/deleteFcltMngmt.do", send)
                        .then(function(response) {
                        if(response.data == 1){
                            alert("삭제되었습니다.");
                            vm.fnList(vm.viewModel.pager.pageNo);
                        }else{
                            alert("관리자에게 문의해주세요.");
                        }
                    });
                }   
            },
            fnViewPopup: function(sn, hqp_sn){
                let vm = this;
                vm.fileViewPop=false;
                vm.qrPop=false;
                vm.viewPop = true;
                vm.$nextTick(function() {
                    if(vm.viewPop) {
                        vm.$refs.viewPopup.fnInit(sn, hqp_sn);
                    }
                })
            },
            fnQrPopup: function(sn){
                let vm = this;
                vm.qrPop=true;
                vm.fileViewPop=false;
                vm.viewPop = false;
                vm.$nextTick(function() {
                    if(vm.qrPop) {
                        vm.$refs.qrPopup.fnInit(sn);
                    }
                })
            },
            fnPopup: function(sn) {
				let vm = this;

                let send = {
                    sn: sn
                }

                vm.qrPop=false;
                vm.viewPop = false;
                vm.fileViewPop=true;

                Axios.post("/selectFcltMngmtFileList.do", send)
                .then(function(response) {
                    
                    vm.$nextTick(function() {
                        if(vm.fileViewPop) {
                            vm.$refs.fileViewPopup.fnInit(response.data.fileList, 'fcltMngmt');
                        }
                    })
                });				
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
        }
    };
</script>