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
                            <option v-for="(item, i) in viewModel.bplcList" :key="i" :value="item.bplc_sn">{{ item.bplc_nm }}</option>
                        </select>
                    </div>
                    <select title="기상유형 선택" v-model="viewModel.search.wetherType">
                        <!-- <option value="" disabled>기상 유형 선택</option> -->
                        <option value="">전체</option>
                        <template v-for="(item, i) in viewModel.wetherTypeList" :key="i">
                        <option :value=item.CODE>{{ item.CODE_NM }}</option>
                        </template>
                    </select>
                    <div class="datepicker_box">
                        <input type="text" class="datepicker" id="sdt" title="datepicker" placeholder="등록기간 시작일" readonly>
                    </div>
                    <span>~</span>
                    <div class="datepicker_box">
                        <input type="text" class="datepicker" id="edt" title="datepicker" placeholder="등록기간 종료일" readonly>
                    </div>
                    <input type="text" placeholder="검색어를 입력하세요." title="검색어 입력" v-model="viewModel.search.text" v-on:keyup.enter="fnList(0)">
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
                <select title="데이터 표출 개수" v-model="viewModel.pager.rowSize" @change="fnChangeCNTSelect(viewModel.pager.rowSize);">
                    <option value="10">10개씩 보기</option>
                    <option value="30">30개씩 보기</option>
                    <option value="50">50개씩 보기</option>
                    <option value="100">100개씩 보기</option>
                </select>
            </div>
            <table class="table">
                <caption>혹서·혹한기 안전대책</caption>
                <!-- 관리자 -->
                <template v-if="!viewModel.isUser && viewModel.userInfo.user_roles == 'ROLE_001' && viewModel.userInfo.user_type_code == 'ACC_0000'">
                <thead>
                    <tr>
                        <th scope="col" class="w50">번호</th>
                        <th scope="col">기상유형</th>
                        <th scope="col">등록기간</th>
                        <th scope="col">제목</th>
                        <th scope="col">등록일자</th>
                        <th scope="col">관리</th>
                    </tr>
                </thead>
                <tbody>
                    <template v-if="viewModel.list.length > 0">
                    <tr v-for="(item, i) in viewModel.list" :key="i">
                        <td>{{(viewModel.pager.pageNo==1) ? viewModel.pager.totalSize-i : viewModel.pager.totalSize-((viewModel.pager.rowSize*(viewModel.pager.pageNo-1))+i)}}</td>
                        <td>{{ item.wether_type_text }}</td>
                        <td>{{ item.reg_bgng_day }} ~ {{ item.reg_end_day }}</td>
                        <td class="text-left"><router-link :to="'/detail/'+item.safe_cntrpln_sn" class="btn-link" title="상세보기">{{ item.ttl }}</router-link></td>
                        <td>{{ item.reg_dt }}</td>
                        <td>
                            <router-link :to="'/detail/'+item.safe_cntrpln_sn" class="btn btn-icon" title="상세보기"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-content-search"></use></svg></router-link>
                            <router-link :to="'/write/'+item.safe_cntrpln_sn" v-if="viewModel.userInfo.user_roles == 'ROLE_001' && viewModel.userInfo.user_type_code == 'ACC_0000'" class="btn btn-icon" title="수정"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-edit-contents"></use></svg></router-link>
                            <a href="javascript:void(0)" v-else @click="fnPopup(item.safe_cntrpln_sn)" class="btn btn-icon" title="수정"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-edit-contents"></use></svg></a>
                            <a href="javascript:void(0)" class="btn btn-icon" title="삭제" @click="fnDelete(item.safe_cntrpln_sn)"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-delete-sweep"></use></svg></a>
                        </td>
                    </tr>
                    </template>
                    <template v-else>
                        <tr>
                            <td colspan="6">조회 데이터가 없습니다.</td>
                        </tr>
                    </template>
                </tbody>
                </template>

                <!-- 사용자 -->
                <template v-else>
                    <thead>
                    <tr>
                        <th scope="col" class="w50">번호</th>
                        <th scope="col">기상유형</th>
                        <th scope="col">등록기간</th>
                        <th scope="col" v-if="viewModel.userInfo.user_roles == 'ROLE_001'">현장명</th>
                        <th scope="col">점검일</th>
                        <th scope="col">점검시간</th>
                        <th scope="col">진행상황</th>
                        <th scope="col">관리</th>
                    </tr>
                </thead>
                <tbody>
                    <template v-if="viewModel.list.length > 0">
                    <tr v-for="(item, i) in viewModel.list" :key="i">
                        <td>{{(viewModel.pager.pageNo==1) ? viewModel.pager.totalSize-i : viewModel.pager.totalSize-((viewModel.pager.rowSize*(viewModel.pager.pageNo-1))+i)}}</td>
                        <td>{{ item.wether_type_text }}</td>
                        <td>{{ item.reg_dt }}</td>
                        <td class="text-left" v-if="viewModel.userInfo.user_roles == 'ROLE_001'"><a href="" class="btn-link" @click.prevent="fnPopup('D',[item.bplc_sn,item.safe_cntrpln_sn,item.ntcn_sn,item.isSave])" title="상세보기">{{ item.bplc_nm }}</a></td>
                        <td>{{ item.sndng_dt }}</td>
                        <td>{{ item.sndng_hr }}</td>
                        <td>
                            <button :disabled="viewModel.userInfo.user_roles == 'ROLE_002' && (viewModel.userInfo.ocpt_detail_cd == 'MNG-01' || viewModel.userInfo.ocpt_detail_cd == 'MNG-03') ? false : true"  
                            :class="(item.isSave == 'N') ? 'btn btn-small btn-gray' : 'btn btn-small btn-blue'" @click="fnPopup('W',[item.bplc_sn,item.safe_cntrpln_sn,item.ntcn_sn,item.isSave])">{{ (item.isSave == 'N') ? '미완료' : '완료' }}</button>
                        </td>
                        <td>
                            <a href="javascript:void(0)" @click="fnPopup('D',[item.bplc_sn,item.safe_cntrpln_sn,item.ntcn_sn,item.isSave])" class="btn btn-icon" title="상세보기"><svg class="icon"><use xlink:href="/img/symbol-defs.svg#icon-content-search"></use></svg></a>
                            <a href="javascript:void(0)" v-if="viewModel.userInfo.user_roles == 'ROLE_002' && (viewModel.userInfo.ocpt_detail_cd == 'MNG-01' || viewModel.userInfo.ocpt_detail_cd == 'MNG-03')" @click="fnPopup('W',[item.bplc_sn,item.safe_cntrpln_sn,item.ntcn_sn,item.isSave])" class="btn btn-icon" :title="(item.isSave == 'Y') ? '수정' : '등록'"><svg class="icon"><use xlink:href="/img/symbol-defs.svg#icon-edit-contents"></use></svg></a>
                        </td>
                    </tr>
                    </template>
                    <template v-else>
                        <tr>
                            <td :colspan="viewModel.userInfo.user_roles == 'ROLE_001' ? '10' : '9'">조회 데이터가 없습니다.</td>
                        </tr>
                    </template>
                </tbody>
                </template>

            </table>
            <div class="table_footer">
                <pager :pass="viewModel.pager"></pager>
                <div class="btn-group">
                    <a href="#/write" v-if="!viewModel.isUser && viewModel.userInfo.user_roles == 'ROLE_001' && viewModel.userInfo.user_type_code == 'ACC_0000'" class="btn btn-purple"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-post-add"></use></svg>등록</a>
                    <!-- <a href="javascript:void(0)" v-else @click="fnPopup()" class="btn btn-purple" title="등록"><svg class="icon"><use xlink:href="/img/symbol-defs.svg#icon-post-add"></use></svg>등록</a> -->
                    <!-- <a href="" class="btn btn-gray"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-trash-can"></use></svg>삭제</a> -->
                </div>
            </div>
        </div>
    </div>
    <wcSftpPlWritePopup ref="wcSftpPlWritePopup" id="chkWritePop" v-show=chkWritePop></wcSftpPlWritePopup>
    <wcSftpPlDetailPopup ref="wcSftpPlDetailPopup" id="chkDetailPop" v-show=chkDetailPop></wcSftpPlDetailPopup>
</div>
</template>

<script>
    import "es6-promise/auto";
    import Vue from "vue";
    import Axios from "axios";
    import Pager from "../../../../common/vue/paging";
    import Message, {messageUtil} from "../../../../common/js/message";
    import board from "../../../../common/js/board";
    import wcSftpPlWritePopup from "./popup/wcSftpPlWritePopup.vue";
    import wcSftpPlDetailPopup from "./popup/wcSftpPlDetailPopup.vue";
    
    export default {
        components: {
            'pager': Pager,
            'board' : board,
            'wcSftpPlWritePopup' : wcSftpPlWritePopup,
            'wcSftpPlDetailPopup' : wcSftpPlDetailPopup
        },
        data: function() {
            return {
                chkWritePop:false,
                chkDetailPop:false,
                //detailPopObj:{},
                //writePopObj:{},
                viewModel:{
                    userInfo:{},
                    search:{
                        bplc_sn:'0',
                        bplc_use_yn:'',
                        wetherType:'',
                        text:''
                    },
                    bplcList:[],
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
                    isUser: false,
                    fileUploadFolder: ''
                }
            };
        },
        mounted: function() {
            let vm = this;
            
            //현황 메뉴 분기..
            if(window.location.pathname.indexOf('wcSftPlMngUser') > -1) vm.viewModel.isUser = true;

            //메뉴 타이틀 상세 타이틀 설정(상세,등록,수정)
            ////board.fnGetMenuTitle(vm);
            // vm.viewModel.userInfo = vm.$store.state.global.userInfo;
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
            fnInit:function() {
                let vm = this;
                vm.viewModel.userInfo = vm.$store.state.global.userInfo;
                vm.viewModel.search.bplc_use_yn = vm.viewModel.userInfo.bplc_yn == 'N' ? 'Y' : 'A';
                vm.viewModel.search.bplc_sn = (vm.viewModel.userInfo.bplc_yn == 'N' && (vm.viewModel.userInfo.bplc_sn == 0 || vm.viewModel.userInfo.bplc_use_yn == 'N')) ? '0' : vm.viewModel.userInfo.bplc_sn;
                calendarInput();

                // if(vm.viewModel.userInfo.user_roles == 'ROLE_001' && vm.viewModel.userInfo.user_type_code == 'ACC_0000') vm.fnBplcList();
                vm.fnGetWetherType();
                vm.fnList(0);

                //vm.detailPopObj = vm.$refs.wcSftpPlDetailPopup;
                //vm.writePopObj = vm.$refs.wcSftpPlWritePopup;

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
                    vm.viewModel.bplcList = rs.data.list;

                    vm.viewModel.search.bplc_sn = '0';
                    if(vm.viewModel.userInfo.bplc_use_yn == 'Y' && vm.viewModel.search.bplc_use_yn == 'Y'){
                        vm.viewModel.search.bplc_sn = vm.viewModel.userInfo.bplc_sn == 0 ? '0' : vm.viewModel.userInfo.bplc_sn;
                    }
                });
            },
            fnGetWetherType: function() {
                let vm = this;
                let send = {
                    mapperId: 'wcSftPl.selectWetherTypeList'
                }
                Axios.post("/selectWetherTypeList.do", send).then(function(response) {
                    vm.viewModel.wetherTypeList = response.data;
                });
            },
            fnList:function(paramPageNo) {
				let vm = this;
                vm.viewModel.pager.pageNo = paramPageNo == 0 ? 1 : paramPageNo;
                let send = {
                    mapperId: 'wcSftPl.selectWcSftPlList',
                    totalId: 'wcSftPl.selectWcSftPlListCnt',
                    pageYn:'Y',
                    isUser: vm.viewModel.isUser,
                    user_roles: vm.viewModel.userInfo.user_roles,
                    user_type_code: vm.viewModel.userInfo.user_type_code,
                    pageNo: vm.viewModel.pager.pageNo,
                    pageSize: vm.viewModel.pager.rowSize,
                    searchBplcSn: vm.viewModel.search.bplc_sn,
                    bplc_use_yn: vm.viewModel.search.bplc_use_yn,
                    wetherType: vm.viewModel.search.wetherType,
                    reg_bgng_day: $("#sdt").val(),
                    reg_end_day: $("#edt").val(),
                    searchText: vm.viewModel.search.text,
                    dept_sn: vm.viewModel.userInfo.dept_sn,
                    team_sn: vm.viewModel.userInfo.team_sn,
                    // bplc_sn: vm.viewModel.userInfo.bplc_sn
                };

                Axios.post("/selectWcSftPlList.do", send).then(function(response) {
                    vm.viewModel.list = response.data.list;
                    vm.viewModel.pager.totalSize = response.data.totalCNT;

                    //console.log(' list : ' , vm.viewModel.list);

                    //페이징세팅
                    Pager.props = Pager.methods.createPaging(vm.viewModel.pager, vm, "list");
                });
            },
            fnInitSearchLine : function() {
                let vm = this;
                $('.search_container select:eq(0) option:eq(0)').prop('selected',true);
                $('.search_container select:eq(1) option:eq(0)').prop('selected',true);
                $('.search_container input[type=text]').val('');
                vm.viewModel.search = {
                    bplc_use_yn : vm.viewModel.userInfo.bplc_yn == 'N' ? 'Y' : 'A',
                    bplc_sn: (vm.viewModel.userInfo.bplc_yn == 'N' && (vm.viewModel.userInfo.bplc_sn == 0 || vm.viewModel.userInfo.bplc_use_yn == 'N')) ? '0' : vm.viewModel.userInfo.bplc_sn,
                    wetherType:'',
                    text:''
                };
            },
            //페이징 처리
            fnChangeCNTSelect: function(rowSize) {
                let vm = this;
                if(rowSize != undefined || rowSize > 0) {
                    vm.viewModel.pager.rowSize = rowSize;
                    vm.fnList(0);
                }
            },
            fnDelete: function(sn){
                let vm = this;
                let send = {
                    safe_cntrpln_sn: sn
                }
                if(confirm(Message.DELETE_CONFIRM)){
                    Axios.post("/deleteWcSftPl.do", send).then(function(response) {
                        if(response.data > 0){
                            alert("삭제가 완료되었습니다.");
                            vm.fnList(0);
                        }
                    });
                }
            },
            // fnPopup: function(flag, sn, isSave) {
            //     sn = (typeof sn == 'undefined') ? '' : sn;
			// 	let vm = this;
            //     let send = {sn: sn}

            //     vm.chkWritePop = false;
            //     vm.chkDetailPop = false;

            //     if(flag == 'D') {
            //         vm.chkDetailPop = true;
            //         vm.$refs.wcSftpPlDetailPopup.fnInit(sn);
                    
            //     } else if(flag == 'W') {
            //         vm.chkWritePop = true;
            //         vm.$refs.wcSftpPlWritePopup.fnInit(sn);
            //     }
			// }

            fnPopup: function(flag,sn) {
                let vm = this;
                if(flag == 'D') {
                    $('.modal_wrap.detail').show();
                    vm.$refs.wcSftpPlDetailPopup.fnInit(sn);
                } else if(flag == 'W') {
                    $('.modal_wrap.write').show();
                    vm.$refs.wcSftpPlWritePopup.fnInit(sn);
                }
			}
        }
    };
</script>