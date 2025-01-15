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
                    <input type="text" placeholder="공종명 입력하세요." title="공종명 입력" v-model="viewModel.search.work_type_nm">
                    <div class="datepicker_box">
                        <input type="text" class="datepicker search" id="sdt" name="sdt" placeholder="평가시작일" title="평가시작일" readonly ref="sdt">
                    </div>
                    <span>~</span>
                    <div class="datepicker_box">
                        <input type="text" class="datepicker search" id="edt" name="edt" placeholder="평가시작일" title="평가시작일" readonly ref="edt">
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
                        <th scope="col" rowspan="2" class="w200">팀명</th>
                        <th scope="col" colspan="2">평가기간</th>
                        <th scope="col" rowspan="2">작성일</th>
                        <th scope="col" rowspan="2">상시위험성평가표</th>
                        <th scope="col" rowspan="2">상시위험성평가표<br>업로드</th>
                        <th scope="col" rowspan="2">회의동영상</th>
                        <th scope="col" colspan="3">결재</th>
                        <th scope="col" rowspan="2">관리</th>
                    </tr>
                    <tr>
                        <th>시작일</th>
                        <th>종료일</th>
                        <th>작성자</th>
                        <th>검토자</th>
                        <th>결정자</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, i) in viewModel.list" :key="i">
                        <td>{{(viewModel.pager.pageNo==1) ? viewModel.pager.totalSize-i : viewModel.pager.totalSize-((viewModel.pager.rowSize*(viewModel.pager.pageNo-1))+i)}}</td>
                        <td class="text-left" v-if="viewModel.userInfo.bplc_yn != 'Y'">{{ item.bplc_nm }}</td>
                        <td class="text-left"><router-link :to="'/detail/'+item.ordtm_risk_evl_sn" class="btn-link">{{ item.work_type_nm }}</router-link></td>
                        <td class="text-left">{{ item.bplc_team_nm }}</td>
                        <td>{{ item.evl_bgng_dt|yyyyMMdd }}</td>
                        <td>{{ item.evl_end_dt|yyyyMMdd }}</td>
                        <td>{{ item.wrt_dt|yyyyMMdd }}</td>
                        <td>
                            <button :class="'btn btn-small btn-blue'" @click="fnViewPopup(item.ordtm_risk_evl_sn);"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-manage-search"></use></svg>미리보기</button>
                        </td>
                        <td>
                            <button class="btn btn-small btn-blue" @click="fnFileUploadPopup(item.ordtm_risk_evl_sn);" v-if="item.file_cnt == 0">등록</button>
                            <button class="btn btn-small btn-gray" @click="fnFileUploadPopup(item.ordtm_risk_evl_sn);" v-if="item.file_cnt > 0">완료</button>
                        </td>
                        <td>
                            <button class="btn btn-icon" @click="fnVideoUplaodPopup(item.ordtm_risk_evl_sn);"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-video-add"></use></svg></button>
                            <button class="btn btn-icon" @click="fnVideoViewPopup(item.ordtm_risk_evl_sn);" v-if="item.video_file_cnt > 0"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-video-play"></use></svg></button>                           
                        </td>
                        <td>
                            <span class="btn btn-small btn-approval complete" v-if="item.wrtr == viewModel.userInfo.user_id"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-user-check"></use></svg>결재 완료</span>
                            <span v-else>결재완료</span>
                        </td>
                        <td>
                            <router-link :to="'/detail/'+item.ordtm_risk_evl_sn" class="btn btn-small btn-approval" v-if="item.rvwr == viewModel.userInfo.user_id && item.rvwr_sign_yn != 'Y'"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-approval"></use></svg>결재 요청</router-link>
                            <span class="btn btn-small btn-approval complete" v-else-if="item.rvwr == viewModel.userInfo.user_id && item.rvwr_sign_yn == 'Y'"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-user-check"></use></svg>결재 완료</span>
                            <span v-else-if="item.rvwr != viewModel.userInfo.user_id && item.rvwr == ''"></span>
                            <span v-else-if="item.rvwr != viewModel.userInfo.user_id && item.rvwr_sign_yn == 'Y'">결재완료</span>
                            <span v-else-if="item.rvwr != viewModel.userInfo.user_id && item.rvwr_sign_yn != 'Y'">결재요청</span>
                        </td>
                        <td>
                            <router-link :to="'/detail/'+item.ordtm_risk_evl_sn" class="btn btn-small btn-approval" v-if="item.dcsnr == viewModel.userInfo.user_id && item.dcsnr_sign_yn != 'Y' && (item.rvwr == '' || item.rvwr_sign_yn == 'Y')"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-approval"></use></svg>결재 요청</router-link> 
                            <span class="btn btn-small btn-approval" v-else-if="item.dcsnr == viewModel.userInfo.user_id && item.dcsnr_sign_yn != 'Y' && item.rvwr != '' && item.rvwr_sign_yn != 'Y'"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-approval-ongoing"></use></svg>진행 중</span>
                            <span class="btn btn-small btn-approval complete" v-else-if="item.dcsnr == viewModel.userInfo.user_id && item.dcsnr_sign_yn == 'Y'"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-user-check"></use></svg>결재 완료</span>
                            <span v-else-if="item.dcsnr != viewModel.userInfo.user_id && item.dcsnr_sign_yn == 'Y'">결재완료</span>
                            <span v-else-if="item.dcsnr != viewModel.userInfo.user_id && item.dcsnr_sign_yn != 'Y' && item.rvwr_sign_yn != 'Y'" >진행중</span>
                            <span v-else-if="item.dcsnr != viewModel.userInfo.user_id && item.dcsnr_sign_yn != 'Y'">결재요청</span>
                        </td>
                        <td>
                            <router-link :to="'/detail/'+item.ordtm_risk_evl_sn" class="btn btn-icon"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-content-search"></use></svg></router-link>
                            <template v-if="item.reg_id == viewModel.userInfo.user_id">
                                <button class="btn btn-icon" @click="fnUpdate(item.ordtm_risk_evl_sn, item.dcsnr_sign_yn);"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-edit-contents"></use></svg></button>
                                <button class="btn btn-icon" @click="fnDelete(item.ordtm_risk_evl_sn, item.wrkshp_cnt)"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-delete-sweep"></use></svg></button>
                            </template>
                        </td>
                    </tr>
                    <tr v-if="viewModel.list.length == 0"><td :colspan="viewModel.userInfo.bplc_yn != 'Y' ? '14' : '13'">게시물이 없습니다.</td></tr>
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
                    </div>				
                    <a href="" class="btn btn-white"><i class="icon_excel"></i>엑셀업로드</a>
                    <a href="" class="btn btn-gray"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-trash-can"></use></svg>삭제</a> -->
                    <router-link :to="'/write'" class="btn btn-purple"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-post-add"></use></svg>등록</router-link>
                </div>
            </div>
        </div>
    </div>
    <viewPopup ref="viewPopup" v-if="viewPop==true"></viewPopup>
    <videoUploadPopup ref="videoUplaodPopup" v-if="videoUploadPop==true"></videoUploadPopup>
    <videoViewPopup ref="videoViewPopup" v-if="videoViewPop==true"></videoViewPopup>
    <fileUploadPopup ref="fileUploadPopup" v-if="fileUploadPop==true"></fileUploadPopup>
</div>
</template>

<script>
    import "es6-promise/auto";
    import Vue from "vue";
    import Axios from "axios";
    import Common from '../../../../common/js/common.js';
    import Pager from "../../../../common/vue/paging.vue";
    import Message, {messageUtil} from "../../../../common/js/message";
    import viewPopup from "./popup/rgstPmntRskEvltViewPopup.vue";
    import videoUploadPopup from "./popup/rgstPmntRskEvltVideoUploadPopup.vue";
    import videoViewPopup from "./popup/rgstPmntRskEvltVideoViewPopup.vue";
    import fileUploadPopup from "./popup/rgstPmntRskEvltFilePopup.vue";


    export default {
        components: {
            'pager': Pager,
            'viewPopup': viewPopup,
            'videoUploadPopup': videoUploadPopup,
            'videoViewPopup': videoViewPopup,
            'fileUploadPopup': fileUploadPopup,
        },
        data: function() {
            return {
                viewPop:false,
                videoUploadPop:false,
                videoViewPop:false,
                fileUploadPop:false,
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
                    work_type_nm: vm.viewModel.search.work_type_nm,
                    evl_bgng_dt_s: vm.$refs.sdt.value,
                    evl_bgng_dt_e: vm.$refs.edt.value,
                    bplc_yn: vm.viewModel.userInfo.bplc_yn,
                    u_bplc_sn: vm.viewModel.userInfo.bplc_sn,
                    reg_id: vm.viewModel.userInfo.user_id,
                    bplc_use_yn: vm.viewModel.search.bplc_use_yn,
                    dept_sn: vm.viewModel.userInfo.dept_sn,
                    team_sn: vm.viewModel.userInfo.team_sn,
                }
                Axios.post("/selectPmntRskEvltList.do", send)
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
            //삭제
            fnDelete:function(sn, cnt){
                let vm = this;

                if(cnt > 0){
                    alert("이미 작성된 일일작업장위험성평가양식이 존재하므로 삭제가 불가능합니다.");
                    return false;
                }
                let send = {
                    ordtm_risk_evl_sn: sn
                }
                if(confirm(Message.DELETE_CONFIRM)){
                    Axios.post("/deletePmntRskEvlt.do", send)
                        .then(function(response) {
                        if(response.data == 1){
                            alert("삭제되었습니다.");
                            vm.fnList();
                        }else{
                            alert("관리자에게 문의해주세요.");
                        }
                    });
                }   
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
            fnViewPopup: function(sn){
                let vm = this;
                vm.viewPop = true;
                vm.videoUploadPop = false;
                vm.videoViewPop = false;
                vm.fileUploadPop = false;
                vm.$nextTick(function() {
                    if(vm.viewPop) {
                        vm.$refs.viewPopup.fnInit(sn);
                    }
                })
            },
            fnVideoUplaodPopup: function(sn){
                let vm = this;
                vm.viewPop = false;
                vm.videoViewPop = false;
                vm.fileUploadPop = false;
                vm.videoUploadPop = true;
                vm.$nextTick(function() {
                    if(vm.videoUploadPop) {
                        vm.$refs.videoUplaodPopup.fnInit(sn);
                    }
                })
            },
            fnVideoViewPopup: function(sn){
                let vm = this;
                vm.viewPop = false;
                vm.videoUploadPop = false;
                vm.fileUploadPop = false;
                vm.videoViewPop = true;
                vm.$nextTick(function() {
                    if(vm.videoViewPop) {
                        vm.$refs.videoViewPopup.fnInit(sn);
                    }
                })
            },
            fnFileUploadPopup: function(sn){
                let vm = this;

                vm.viewPop = false;
                vm.videoUploadPop = false;
                vm.videoViewPop = false;
                vm.fileUploadPop = true;

                vm.$nextTick(function() {
                    if(vm.fileUploadPop) {
                        vm.$refs.fileUploadPopup.fnInit(sn);
                    }
                });
            },
        }
    };
</script>