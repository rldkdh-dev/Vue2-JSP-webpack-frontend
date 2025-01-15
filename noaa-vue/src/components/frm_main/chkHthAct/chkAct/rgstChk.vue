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
                        <select title="점검유형명" v-model="viewModel.search.chk_type">
                            <option value="">점검유형명 선택</option>
                            <option v-for="(item, i) in viewModel.chkTypeList" :key="i" :value="item.CODE">{{ item.CODE_NM }}</option>
                        </select>
                        <div class="datepicker_box">
                            <input type="text" class="datepicker" id="sdt" placeholder="점검일자 조회시작일" title="점검일자 조회시작일" readonly ref="sdt">
                        </div>
                        <span>~</span>
                        <div class="datepicker_box">
                            <input type="text" class="datepicker" id="edt" placeholder="점검일자 조회종료일" title="점검일자 조회종료일" readonly ref="edt">
                        </div>
                        <input type="text" placeholder="점검항목을 입력하세요." title="점검항목 입력" v-model="viewModel.search.chck_mttr">
                        <input type="text" placeholder="점검자를 입력하세요." title="점검자 입력" v-model="viewModel.search.user_nm">
                        <input type="text" placeholder="조치자를 입력하세요." title="조치자 입력" v-model="viewModel.search.actn_pic_nm">
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
                    <button class="btn btn-white" @click="fnExcelDownload"><i class="icon_excel"></i>엑셀다운로드</button>
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
                            <th scope="col" class="w50">번호</th>
                            <th scope="col">점검유형</th>
                            <th scope="col" v-if="viewModel.userInfo.user_roles == 'ROLE_001'">현장명</th>
                            <th scope="col">점검일</th>
                            <th scope="col">점검자</th>
                            <th scope="col">점검항목</th>
                            <!-- <th>점검결과</th> -->
                            <th scope="col">장비점검 확인자 확인</th>
                            <th scope="col">조치현황</th>
                            <th scope="col">조치자</th>
                            <th scope="col">관리</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, i) in viewModel.list" :key="i">
                            <td>{{(viewModel.pager.pageNo==1) ? viewModel.pager.totalSize-i : viewModel.pager.totalSize-((viewModel.pager.rowSize*(viewModel.pager.pageNo-1))+i)}}</td>
                            <td class="text-left">{{ item.chck_clsf_nm }}</td>
                            <td class="text-left" v-if="viewModel.userInfo.user_roles == 'ROLE_001'">{{ item.bplc_nm }}</td>
                            <td>{{ item.chck_dt|yyyyMMdd }}</td>
                            <td>{{ item.user_nm }}</td>
                            <td class="text-left"><router-link :to="'/detail/'+item.chck_act_sn" class="btn-link">{{ item.chck_mttr }}</router-link></td>
                            <td >
                                <button :class="item.idfr_sign_yn == 'Y' ? 'btn btn-small btn-gray' : 'btn btn-small btn-blue'" v-if="item.chck_clsf == 'FC' && item.idfr == viewModel.userInfo.user_id" @click="fnPopup2(item.chck_act_sn)">{{ item.idfr_sign_yn == 'Y' ? '완료' : '확인' }}</button>
                            </td>
                            <td>
                                <button :class="item.actn_prgrs == 'MP1' ? 'btn btn-small btn-blue' : item.actn_prgrs == 'MP2' ? 'btn btn-small btn-white' : 'btn btn-small btn-gray'" v-if="item.mttr_yn == 'Y'" @click="fnPopup(item.chck_act_sn)">{{ item.actn_prgrs_nm }}</button>
                                <span v-else-if="item.mttr_yn == 'N'">{{ item.actn_prgrs_nm }}</span>
                                <span v-else>-</span>
                            </td>
                            <td class="text-left">{{ item.actn_pic_nm == null ? '' : item.actn_pic_nm }}</td>
                            <td>
                                <router-link :to="'/detail/'+item.chck_act_sn" class="btn btn-icon"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-content-search"></use></svg></router-link>
                                <template v-if="item.reg_id == viewModel.userInfo.user_id">
                                    <router-link :to="'/write/'+item.chck_act_sn" class="btn btn-icon"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-edit-contents"></use></svg></router-link>
                                    <button class="btn btn-icon" @click="fnDelete(item.chck_act_sn)"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-delete-sweep"></use></svg></button>
                                </template>
                                <template v-else-if="viewModel.userInfo.user_id == 'system'">
                                    <button class="btn btn-icon" @click="fnDelete(item.chck_act_sn)"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-delete-sweep"></use></svg></button>
                                </template>
                            </td>
                        </tr>
                        <tr v-if="viewModel.list.length == 0"><td :colspan="viewModel.userInfo.user_roles == 'ROLE_001' ? '10' : '9'">게시물이 없습니다.</td></tr>
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
        <rgstChkPopup ref="rgstChkPopup" v-if="chkPop==true"></rgstChkPopup>
        <idfrPopup ref="idfrPopup" v-if="idfrPop==true"></idfrPopup>
        <excelform ref="excelform"></excelform>
    </div>
    </template>
    
<script>
    import "es6-promise/auto";
    import Vue from "vue";
    import Common from '../../../../common/js/common.js';
    import Axios from "axios";
    import Pager from "../../../../common/vue/paging.vue";
    import Message, {messageUtil} from "../../../../common/js/message";
    import rgstChkPopup from "./popup/rgstChkPopup.vue";
    import idfrPopup from "./popup/idfrPopup.vue";
    import excelform from "../../excelform.vue";
    
    export default {
        components: {
            'pager': Pager,
            'rgstChkPopup': rgstChkPopup,
            'idfrPopup': idfrPopup,
            'excelform': excelform,
        },
        data: function() {
            return {
                chkPop:false,
                idfrPop:false,
                viewModel:{
                    search:{
                        bplc_use_yn:'',
                        bplc_sn:'',
                        chk_type:''
                    },
                    userInfo:{},
                    list: [],
                    searchBplcList: [],
                    chkTypeList: [],
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
            //초기화
            fnRefresh: function(){
                let vm = this;
                vm.viewModel.search = {
                    bplc_use_yn : vm.viewModel.userInfo.bplc_yn == 'N' ? 'Y' : 'A',
                    bplc_sn: (vm.viewModel.userInfo.bplc_yn == 'N' && (vm.viewModel.userInfo.bplc_sn == 0 || vm.viewModel.userInfo.bplc_use_yn == 'N')) ? '' : vm.viewModel.userInfo.bplc_sn,
                    chk_type:'',
                    user_nm :'',
                    actn_pic_nm:''
                }
                $("#sdt").val("");
                $("#edt").val("");
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
                    chck_mttr: vm.viewModel.search.chck_mttr,
                    chk_type: vm.viewModel.search.chk_type,
                    user_nm: vm.viewModel.search.user_nm,
                    actn_pic_nm: vm.viewModel.search.actn_pic_nm,
                    sdt: vm.$refs.sdt.value,
                    edt: vm.$refs.edt.value,
                    bplc_sn: vm.viewModel.search.bplc_sn,
                    bplc_use_yn: vm.viewModel.search.bplc_use_yn,
                    bplc_yn: vm.viewModel.userInfo.bplc_yn,
                    u_bplc_sn: vm.viewModel.userInfo.bplc_sn,
                    dept_sn: vm.viewModel.userInfo.dept_sn,
                    team_sn: vm.viewModel.userInfo.team_sn,
                }

                Axios.post("/selectChkActList.do", send)
                .then(function(response) {
                    vm.viewModel.list = response.data.list;
                    vm.viewModel.pager.totalSize = response.data.totalCNT;
                    
                    //페이징세팅
                    Pager.props = Pager.methods.createPaging(vm.viewModel.pager, vm, "list");
                    
                    //조회조건 현장명
                    // vm.viewModel.searchBplcList = response.data.searchBplcList;

                    //조회조건 점검유형
                    vm.viewModel.chkTypeList = response.data.chkTypeList;
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
                    chck_act_sn: sn
                }

                if(confirm(Message.DELETE_CONFIRM)){
                    Axios.post("/deleteChkAct.do", send)
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
                vm.idfrPop=false;
                vm.$nextTick(function() {
                    if(vm.chkPop) {
                        vm.$refs.rgstChkPopup.fnInit(sn);
                    }
                })
            },
            fnPopup2: function(sn) {
                let vm = this;
                vm.chkPop=false;
                vm.idfrPop=true;
                vm.$nextTick(function() {
                    if(vm.idfrPop) {
                        vm.$refs.idfrPopup.fnInit(sn);
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

                    vm.viewModel.search.bplc_sn = '';
                    if(vm.viewModel.userInfo.bplc_use_yn == 'Y' && vm.viewModel.search.bplc_use_yn == 'Y'){
                        vm.viewModel.search.bplc_sn = vm.viewModel.userInfo.bplc_sn == 0 ? '' : vm.viewModel.userInfo.bplc_sn;
                    }
                });
            },
            fnExcelDownload: function () {
                let vm = this;
                // 자바 버전
                const header = ['점검유형','현장명','점검일','점검자','점검항목','장비점검 확인자 확인','조치현황','조치자'];
                const mapperId = 'selectChkActExcelList';
                //검색조건
                let data = {
                    header: header,
                    mapperId: mapperId,
                    user_id: vm.viewModel.userInfo.user_id,
                    chck_mttr: vm.viewModel.search.chck_mttr,
                    chk_type: vm.viewModel.search.chk_type,
                    user_nm: vm.viewModel.search.user_nm,
                    actn_pic_nm: vm.viewModel.search.actn_pic_nm,
                    sdt: vm.$refs.sdt.value,
                    edt: vm.$refs.edt.value,
                    bplc_use_yn: vm.viewModel.search.bplc_use_yn,
                    bplc_sn: vm.viewModel.search.bplc_sn,
                    bplc_yn: vm.viewModel.userInfo.bplc_yn,
                    u_bplc_sn: vm.viewModel.userInfo.bplc_sn,
                    // 파일명 
                    fileName: "점검 등록", // 스마트안전보건_년월일.xlsx
                    // 해당 화면 필요한 조건 파라미터 추가 부분
                    dept_sn: vm.viewModel.userInfo.dept_sn,
                    team_sn: vm.viewModel.userInfo.team_sn,
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