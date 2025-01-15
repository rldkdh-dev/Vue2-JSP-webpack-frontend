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
                        <input type="text" placeholder="팀명 입력하세요." title="팀명 입력하세요."  v-model="viewModel.search.team_nm">
                    </div>
                </div>
                <div class="btn-group">
                    <a href="#" class="btn btn-default-line" @click="fnRefresh();"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-refresh"></use></svg>초기화</a>
                    <a href="#" class="btn btn-default" @click="fnList(1);"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-search"></use></svg>검색</a>
                </div>
            </div>
        </div>
        <div class="contents">
            <div>
                <div class="table_top">
                    <div class="total_count">총 <em>{{ viewModel.pager.totalSize }}</em>건</div>
                    <div class="icon_box">
                        <!-- <button class="btn btn-white"><i class="icon_pdf"></i></button>
                        <button class="btn btn-white"><i class="icon_word"></i></button>
                        <button class="btn btn-white"><i class="icon_ppt"></i></button>
                        <button class="btn btn-white"><i class="icon_excel"></i></button> -->
                    </div>
                    <select title="데이터 표출 개수" v-model="viewModel.pager.rowSize" @change="fnChangeCNTSelect(viewModel.pager.rowSize);">
                        <option value="10">10개씩 보기</option>
                        <option value="30">30개씩 보기</option>
                        <option value="50">50개씩 보기</option>
                        <option value="100">100개씩 보기</option>
                    </select>
                </div>
                <table class="table">
                    <caption>소공종 위험성평가 등록</caption>
                    <thead>
                        <tr>
                            <th scope="col" class="w50">번호</th>
                            <th scope="col" v-if="viewModel.userInfo.bplc_yn != 'Y'">현장명</th>
                            <th scope="col">팀명</th>
                            <!-- <th scope="col" :rowspan="2">참석자 확인</th> -->
                            <th scope="col">소공정위험성평가표</th>
                            <!-- <th scope="col" :rowspan="2">회의동영상</th> -->
                            <!-- <th scope="col" :colspan="3">결재</th> -->
                            <th scope="col">관리</th>
                        </tr>
                        <!-- <tr>
                            <th>작성자</th>
                            <th>조정자</th>
                            <th>결정자</th>
                        </tr> -->
                    </thead>
                    <tbody>
                        <tr v-for="(item, i) in viewModel.list" :key=item.spcm_risk_evl_sn>
                            <td scope="row">{{(viewModel.pager.pageNo==1) ? viewModel.pager.totalSize-i : viewModel.pager.totalSize-((viewModel.pager.rowSize*(viewModel.pager.pageNo-1))+i)}}</td>
                            <td class="text-left" v-if="viewModel.userInfo.bplc_yn != 'Y'">{{ item.bplc_nm }}</td>
                            <td class="text-left"><router-link class="btn-link" :to="'/detail/'+item.spcm_risk_evl_sn">{{ item.team_nm }}</router-link></td>
                            <!-- <td>
                                <button v-if="item.sign_yn == 'Y'" @click="fnSignPop(item.spcm_risk_evl_sn, item.sign_yn)" class="btn btn-small btn-gray" ><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-task-alt"></use></svg>참석자 확인 완료</button>
                                <button v-else @click="fnSignPop(item.spcm_risk_evl_sn, item.sign_yn)" class="btn btn-small btn-blue" ><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-signature-reset"></use></svg>참석자 확인</button>
                            </td> -->
                            <td>
                                <button :class="'btn btn-small btn-blue'" @click="fnViewPopup(item.spcm_risk_evl_sn);"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-manage-search"></use></svg>미리보기</button>
                                <!-- <button class="btn btn-icon" @click="fnExcelDownlaod(item.spcm_risk_evl_sn);"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-excel"></use></svg></button> -->
                            </td>
                            <!-- <td>
                                <button class="btn btn-icon" @click="fnVideoUplaodPopup(item.spcm_risk_evl_sn);"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-camera-add"></use></svg></button>
                                <button class="btn btn-icon" @click="fnVideoViewPopup(item.spcm_risk_evl_sn);" v-if="item.file_cnt > 0"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-camera"></use></svg></button>      
                            </td>
                            <td>
                                <span class="btn btn-small btn-approval complete" v-if="item.wrtr == viewModel.userInfo.user_id"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-user-check"></use></svg>결재 완료</span>
                                <span v-else>결재완료</span>
                            </td> 
                            <td>
                                <router-link :to="'/detail/'+item.spcm_risk_evl_sn" class="btn btn-small btn-approval" v-if="item.mdtr == viewModel.userInfo.user_id && item.mdtr_sign_yn != 'Y'"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-approval"></use></svg>결재 요청</router-link>
                                <span class="btn btn-small btn-approval complete" v-else-if="item.mdtr == viewModel.userInfo.user_id && item.mdtr_sign_yn == 'Y'"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-user-check"></use></svg>결재 완료</span>
                                <span v-else-if="item.mdtr != viewModel.userInfo.user_id && item.mdtr == ''"></span>
                                <span v-else-if="item.mdtr != viewModel.userInfo.user_id && item.mdtr_sign_yn == 'Y'">결재완료</span>
                                <span v-else-if="item.mdtr != viewModel.userInfo.user_id && item.mdtr_sign_yn != 'Y'">결재요청</span>
                            </td>
                            <td>
                                <router-link :to="'/detail/'+item.spcm_risk_evl_sn" class="btn btn-small btn-approval" v-if="item.dcsnr == viewModel.userInfo.user_id && item.dcsnr_sign_yn != 'Y' && (item.mdtr == '' || item.mdtr_sign_yn == 'Y')"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-approval"></use></svg>결재 요청</router-link> 
                                <span class="btn btn-small btn-approval" v-else-if="item.dcsnr == viewModel.userInfo.user_id && item.dcsnr_sign_yn != 'Y' && item.mdtr != '' && item.mdtr_sign_yn != 'Y'"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-approval-ongoing"></use></svg>진행 중</span>
                                <span class="btn btn-small btn-approval complete" v-else-if="item.dcsnr == viewModel.userInfo.user_id && item.dcsnr_sign_yn == 'Y'"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-user-check"></use></svg>결재 완료</span>
                                <span v-else-if="item.dcsnr != viewModel.userInfo.user_id && item.dcsnr_sign_yn == 'Y'">결재완료</span>
                                <span v-else-if="item.dcsnr != viewModel.userInfo.user_id && item.dcsnr_sign_yn != 'Y' && item.mdtr_sign_yn != 'Y'" >진행중</span>
                                <span v-else-if="item.dcsnr != viewModel.userInfo.user_id && item.dcsnr_sign_yn != 'Y'">결재요청</span>
                            </td>-->
                            <td>
                                <router-link :to="'/detail/'+item.spcm_risk_evl_sn" class="btn btn-icon"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-content-search"></use></svg></router-link>
                                <router-link :to="'/copy/'+item.spcm_risk_evl_sn" class="btn btn-icon"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-copy"></use></svg></router-link>
                                <template v-if="item.reg_id == viewModel.userInfo.user_id">
                                    <button class="btn btn-icon" @click="fnUpdate(item.spcm_risk_evl_sn, item.dcsnr_sign_yn);"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-edit-contents"></use></svg></button>
                                    <button class="btn btn-icon" @click="fnDelete(item.spcm_risk_evl_sn);"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-delete-sweep"></use></svg></button>
                                </template>
                            </td>
                        </tr>
                        <tr v-if="viewModel.list.length == 0"><td :colspan="viewModel.userInfo.bplc_yn != 'Y' ? '9' : '8'">게시물이 없습니다.</td></tr>
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
                        <a href="" class="btn btn-white"><i class="icon_excel"></i>엑셀업로드</a> -->
                        <router-link :to="'/write'" class="btn btn-purple"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-post-add"></use></svg>등록</router-link>
                    </div>
                </div>
            </div>
        </div>
        <atdrnPopup ref="atdrnPopup" v-if="atdrnPop==true"></atdrnPopup>
        <viewPopup ref="viewPopup" v-if="viewPop==true"></viewPopup>
        <videoUploadPopup ref="videoUplaodPopup" v-if="videoUploadPop==true"></videoUploadPopup>
        <videoViewPopup ref="videoViewPopup" v-if="videoViewPop==true"></videoViewPopup>
    </div>
</template>

<script>
    import "es6-promise/auto";
    import Vue from "vue";
    import Axios from "axios";
    import Pager from "../../../../common/vue/paging.vue";
    import Message, {messageUtil} from "../../../../common/js/message";
    import atdrnPopup from "./popup/rgstrSmPrcsRskEvltPopup.vue"
    import viewPopup from "./popup/rgstrSmPrcsRskEvltViewPopup.vue";
    import videoUploadPopup from "./popup/rgstrSmPrcsRskEvltVideoUploadPopup.vue";
    import videoViewPopup from "./popup/rgstrSmPrcsRskEvltVideoViewPopup.vue";

    export default {
        components: {
			'pager': Pager,
            'atdrnPopup': atdrnPopup,
            'viewPopup': viewPopup,
            'videoUploadPopup': videoUploadPopup,
            'videoViewPopup': videoViewPopup,
		},
        data: function() {
            return {
                viewPop: false,
                atdrnPop: false,
                videoUploadPop: false,
                videoViewPop: false,
                viewModel:{
                    userInfo:{},
                    search:{
                        bplc_use_yn:'',
                        bplc_sn:'',
                    },
                    list:[{seq:0}],
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
            vm.fnInit();
            vm.$router.afterEach(function(to, from){
                vm.fnList(vm.viewModel.pager.pageNo);
            });
        },
        methods: {
            //기본세팅
            fnInit:function(){
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
            //초기화
            fnRefresh: function(){
                let vm = this;
                vm.viewModel.search = {
                    bplc_sn : (vm.viewModel.userInfo.bplc_yn == 'N' && (vm.viewModel.userInfo.bplc_sn == 0 || vm.viewModel.userInfo.bplc_use_yn == 'N')) ? '' : vm.viewModel.userInfo.bplc_sn,
                    bplc_use_yn : vm.viewModel.userInfo.bplc_yn == 'N' ? 'Y' : 'A',
                }
            },
            //목록 조회
            fnList:function(paramPageNo){
                let vm = this;
                vm.viewModel.pager.pageNo = paramPageNo == undefined ? vm.viewModel.pager.pageNo : paramPageNo;

                let send = {
                    pageYn:'Y',
                    pageNo: vm.viewModel.pager.pageNo,
					pageSize: vm.viewModel.pager.rowSize,
                    team_nm:vm.viewModel.search.team_nm,
                    bplc_sn: vm.viewModel.search.bplc_sn,
                    bplc_yn: vm.viewModel.userInfo.bplc_yn,
                    u_bplc_sn: vm.viewModel.userInfo.bplc_sn,
                    reg_id: vm.viewModel.userInfo.user_id,
                    bplc_use_yn: vm.viewModel.search.bplc_use_yn,
                    dept_sn: vm.viewModel.userInfo.dept_sn,
                    team_sn: vm.viewModel.userInfo.team_sn,
                }
                Axios.post("/selectSmPrcsRskEvltList.do", send)
                .then(function(response) {
                    vm.viewModel.list = response.data.list;
                    vm.viewModel.pager.totalSize = response.data.totalCNT;

                    //조회조건 현장명
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
            fnDelete:function(sn){
                let vm = this;
                let send = {
                    spcm_risk_evl_sn: sn
                }
                if(confirm(Message.DELETE_CONFIRM)){
                    Axios.post("/deleteSmPrcsRskEvlt.do", send)
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
            fnUpdate: function(sn, dcsnr_sign_yn){
                let vm = this;

                if(dcsnr_sign_yn == 'Y'){
                    alert("결정자가 결재를 완료하여 수정이 불가합니다.");
                    return false;
                }else{
                    vm.$router.push('/write/'+sn);
                }

            },
            fnSignPop: function(sn, yn){
                let vm = this;

                vm.atdrnPop = true;
                vm.viewPop = false;
                vm.videoUploadPop = false;
                vm.videoViewPop = false;
                let sign_yn = yn == 'X' ? 'N' : yn;

                vm.$nextTick(function() {
                    if(vm.atdrnPop) {
                        vm.$refs.atdrnPopup.fnInit(sn, sign_yn);
                    }
                })
            },
            fnViewPopup: function(sn){
                let vm = this;
                vm.atdrnPop = false;
                vm.viewPop = true;
                vm.videoUploadPop = false;
                vm.videoViewPop = false;
                vm.$nextTick(function() {
                    if(vm.viewPop) {
                        vm.$refs.viewPopup.fnInit(sn);
                    }
                })
            },
            fnVideoUplaodPopup: function(sn){
                let vm = this;
                vm.atdrnPop = false;
                vm.viewPop = false;
                vm.videoUploadPop = true;
                vm.videoViewPop = false;
                vm.$nextTick(function() {
                    if(vm.videoUploadPop) {
                        vm.$refs.videoUplaodPopup.fnInit(sn);
                    }
                })
            },
            fnVideoViewPopup: function(sn){
                let vm = this;
                vm.atdrnPop = false;
                vm.viewPop = false;
                vm.videoUploadPop = false;
                vm.videoViewPop = true;
                vm.$nextTick(function() {
                    if(vm.videoViewPop) {
                        vm.$refs.videoViewPopup.fnInit(sn);
                    }
                })
            },
        },
    };
</script>
