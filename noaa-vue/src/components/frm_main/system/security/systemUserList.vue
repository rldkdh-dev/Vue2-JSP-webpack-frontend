<template>
    <div>
        <h1 class="ub-control title">사용자 관리</h1>
    <div class="ub-layout search">
        <span class="search-ltbg"></span>
        <span class="search-rtbg"></span>
        <span class="search-lbbg"></span>
        <span class="search-rbbg"></span>
        <span class="ub-control button search" id="search">
            <a href="javascript:void(0)" title="Search" @click="fnSearch">검색</a>
        </span>
        <form id="searchForm" name="searchForm">
            <table class="ub-control table normal ">
                <colgroup>
                    <col width="120px"/>
                    <col width="150px"/>
                    <col width="80px"/>
                    <col width="150px"/>
                    <col width="80px"/>
                    <col width="150px"/>
                    <col width="80px"/>
                    <col />
                </colgroup>
                <tbody>
                    <tr id="layout-1_2">
                        <th id="layout-1_2_3"><label class="ub-control label">재직여부</label></th>
                        <td id="layout-1_2_4">
                            <select id="search_INCUMBENT_CD" name="search_INCUMBENT_CD" class="ub-control select " style="width:120px;" size="1" v-model="viewModel.search.INCUMBENT_CD">
                                
                                <option value="">전체</option>
                                <option value="E">재직</option>
                                <option value="D">퇴사</option>
                                <option value="H">휴직</option>
                            </select>
                        </td>
                        <th id="layout-1_2_5" style='text-align:Right'><label class="ub-control label">이름</label></th>
                        <td id="layout-1_2_6">
                            <input type=text  class="ub-control input-text " id="search_USER_NM" name="search_USER_NM" v-model="viewModel.search.USER_NM" style="text-align:left;width:100px;"></td>
                        <th id="layout-1_2_7" style='text-align:Right'><label class="ub-control label">ID</label></th>
                        <td id="layout-1_2_8"><input type=text  class="ub-control input-text " id="search_LOGIN_ID" name="search_LOGIN_ID" v-model="viewModel.search.LOGIN_ID" style="text-align:left;width:100px;"></td>
                        <th id="layout-1_2_9" style='text-align:Right'><label class="ub-control label">사번</label></th>
                        <td id="layout-1_2_10"><input type=text  class="ub-control input-text " id="search_EMP_NO" name="search_EMP_NO"   v-model="viewModel.search.EMP_NO" style="text-align:left;width:100px;"></td>
                    </tr>
                </tbody>
            </table>
        
        </form>

        </div>
        <div class="ub-layout list"><div class="ub-control temp" style="border:2px solid gray;width:100%;height:300px;text-align:center;"><h3 style="padding-top:120px;">Grid Control</h3></div>
            <table class="ub-control grid" id="list" name="list">
            <!--
                <caption>사용자 관리</caption>
                <thead>
                    <tr>
                        <th scope="col" class="w50">ID</th>
                        <th scope="col">이름</th>
                        <th scope="col">핸드폰 번호</th>
                        <th scope="col">이메일</th>
                        <th scope="col">재직여부</th>
                    </tr>
                </thead>
                <tbody>
                    <template>
                        <tr v-for="(item, i) in viewModel.list" :key="i">
                            <td>
                                <router-link :to="{name: 'systemUserDetail', params: {LOGIN_ID:item.LOGIN_ID}}">{{ item.LOGIN_ID }}</router-link>
                            </td>
                            <td>
                                <router-link :to="{name: 'systemUserDetail', params: {LOGIN_ID: item.LOGIN_ID}}">{{ item.USER_NM }}</router-link>
                            </td>
                            <td>
                                <router-link :to="{name: 'systemUserDetail', params: {LOGIN_ID: item.LOGIN_ID}}">{{ item.MOBILE_NO }}</router-link>
                            </td>
                            <td>
                                <router-link :to="{name: 'systemUserDetail', params: {LOGIN_ID: item.LOGIN_ID}}">{{ item.EMAIL_DS }}</router-link>
                            </td>
                            <td>
                                <router-link :to="{name: 'systemUserDetail', params: {LOGIN_ID: item.LOGIN_ID}}">{{ item.INCUMBENT_CD=='E'? '재직' : item.INCUMBENT_CD == 'D' ? '퇴사' : '휴직' }}</router-link>
                            </td>
                        </tr>
                    </template>
                </tbody>-->
            </table> 
            <div id="pager"></div>
        </div>
        <div class="ub-layout pagging"><div class="ub-control temp" style="border:2px solid gray;width:100%;height:30px;text-align:center;"><h3 style="padding-top:3px;">Paging Navigation</h3></div>
        <div class="ub-control pagging" for="list" formId="searchForm" function="fnSearch"></div>
        </div>
        <div class="ub-layout button top"><span class="ub-control button top icon" id="newBtn">
            <a href="#none" title="신규등록"><span class="ico-register"></span>신규등록</a>
        </span>
    </div>
    </div>

<!-- <div>
    <div class="search_area">
        <button class="btn_toggle_search">검색</button>
        <div>
            <div class="search_container">
                <div class="row">
                    <span class="w150 text-center">재직여부</span>
                    <select id="search_INCUMBENT_CD" class="w100" v-model="viewModel.search.INCUMBENT_CD">
                        <option value="">선택</option>
                        <option value="E">재직</option>
                        <option value="D">퇴사</option>
                        <option value="H">휴직</option>
                    </select>
                    <span class="w150 text-center">이름</span>
                    <input type="text" id="search_USER_NM" placeholder="이름을 입력하세요." title="이름 입력" class="w150" v-model="viewModel.search.USER_NM">
                    <span class="w150 text-center">ID</span>
                    <input type="text" id="search_LOGIN_ID" placeholder="아이디를 입력하세요." title="아이디 입력" class="w150" v-model="viewModel.search.LOGIN_ID">
                    <span class="w150 text-center">사번</span>
                    <input type="text" id="search_EMP_NO" placeholder="사번을 입력하세요." title="사번 입력" class="w150" v-model="viewModel.search.EMP_NO">

                </div>
            </div>
            <div class="btn-group">
                <button class="btn btn-default-line" @click="fnreset"><svg class="icon"><use xlink:href="/img/symbol-defs.svg#icon-refresh"></use></svg>초기화</button>
                <button class="btn btn-default" @click="fnInit"><svg class="icon"><use xlink:href="/img/symbol-defs.svg#icon-search"></use></svg>검색</button>
            </div>
        </div>
    </div>
    <div class="contents">
        <div>
            <div class="table_top">
                <div class="total_count">총<i>{{ viewModel.pager.totalSize }}</i>건</div>
                <select v-model="viewModel.pager.rowSize" @change="fnGetChangeSelectList(viewModel.pager.rowSize);">
                        <option :value="10" >10개씩 보기</option>
                        <option :value="30" >30개씩 보기</option>
                        <option :value="50" >50개씩 보기</option>
                        <option :value="100" >100개씩 보기</option>
                </select>
            </div>
            <table class="table">
                <caption>사용자 관리</caption>
                <thead>
                    <tr>
                        <th scope="col" class="w50">ID</th>
                        <th scope="col">이름</th>
                        <th scope="col">핸드폰 번호</th>
                        <th scope="col">이메일</th>
                        <th scope="col">재직여부</th>
                    </tr>
                </thead>
                <tbody>
                    <template>
                        <tr v-for="(item, i) in viewModel.list" :key="i">
                            <td>
                                <router-link :to="{name: 'systemUserDetail', params: {LOGIN_ID:item.LOGIN_ID}}">{{ item.LOGIN_ID }}</router-link>
                            </td>
                            <td>
                                <router-link :to="{name: 'systemUserDetail', params: {LOGIN_ID: item.LOGIN_ID}}">{{ item.USER_NM }}</router-link>
                            </td>
                            <td>
                                <router-link :to="{name: 'systemUserDetail', params: {LOGIN_ID: item.LOGIN_ID}}">{{ item.MOBILE_NO }}</router-link>
                            </td>
                            <td>
                                <router-link :to="{name: 'systemUserDetail', params: {LOGIN_ID: item.LOGIN_ID}}">{{ item.EMAIL_DS }}</router-link>
                            </td>
                            <td>
                                <router-link :to="{name: 'systemUserDetail', params: {LOGIN_ID: item.LOGIN_ID}}">{{ item.INCUMBENT_CD=='E'? '재직' : item.INCUMBENT_CD == 'D' ? '퇴사' : '휴직' }}</router-link>
                            </td>
                        </tr>
                    </template>
                </tbody>
            </table>
            <div class="table_footer">
                <pager :pass="viewModel.pager"></pager>
                <div v-if="viewModel.userInfo.user_roles == 'ROLE_001' && viewModel.userInfo.user_type_code == 'ACC_0000'" class="btn-group"> 
                    <a v-if="viewModel.userInfo.bplc_yn == 'N' || viewModel.userInfo.ocpt_se_cd == 'MNG'" href="#/write" class="btn btn-purple"><svg class="icon"><use xlink:href="../../../img/symbol-defs.svg#icon-post-add"></use></svg>등록</a>
                </div>
            </div>
        </div>
    </div>
    <fileViewPopup ref="fileViewPopup" v-if="fileViewPop==true"></fileViewPopup>
</div> -->
</template>

<script>
    import "es6-promise/auto";
    import Vue from "vue";
    import Axios from "axios";
    import Pager from "../../../../common/vue/paging.vue";
    import fileViewPopup from "../../popup/fileViewPopup.vue";

    export default {
        components: {
            'pager': Pager,
            'fileViewPopup':fileViewPopup,
        },
        data: function() {
            return {
                fileViewPop:false,
                viewModel:{
                    search:{
                            INCUMBENT_CD:'',
                            USER_NM:'',
                            LOGIN_ID:'',
                            EMP_NO:''
                        },
                    userInfo:{},
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
        mounted: function() {
            let vm = this;
            vm.viewModel.userInfo=vm.$store.state.global.userInfo;
            vm.fnInit();
            vm.$router.afterEach((to, from) => {
                vm.fnList(vm.viewModel.pager.pageNo);
            });
        },
        methods: {
            //초기화
            fnRefresh: function(){
                let vm = this;
                vm.viewModel.search = {
                            INCUMBENT_CD:'',
                            USER_NM:'',
                            LOGIN_ID:'',
                            EMP_NO:''
                        }
                $("#search_INCUMBENT_CD").val('');
                $("#search_USER_NM").val('');
                $("#search_LOGIN_ID").val('');
                $("#search_EMP_NO").val('');

                vm.fnList(0);
            },
            fnInit:function(){

                let vm = this;
                vm.viewModel.userInfo = vm.$store.state.global.userInfo;
                vm.fnList(0);

            },
            fnSearch: function(e) {
                e.preventDefault();

                let vm = this;

                vm.fnList(0);
                return false;
            },
            fnList:function(paramPageNo){
				let vm = this;
				
                vm.viewModel.pager.pageNo = paramPageNo == 0 ? 1 : paramPageNo;

                
                let send = {
                    mapperId:'securityUser.selectSecurityUserList',
                    totalId:'securityUser.selectSecurityUserListTotal',
                    pageYn:'Y',
                    pageNo: vm.viewModel.pager.pageNo,
                    pageSize: vm.viewModel.pager.rowSize
                }

                if (vm.viewModel.search.INCUMBENT_CD != '' && vm.viewModel.search.INCUMBENT_CD != null && vm.viewModel.search.INCUMBENT_CD != undefined) send.incumbnet_cd = vm.viewModel.search.INCUMBENT_CD;
                if (vm.viewModel.search.USER_NM != '' && vm.viewModel.search.USER_NM != null && vm.viewModel.search.USER_NM != undefined) send.user_nm = vm.viewModel.search.USER_NM;
                if (vm.viewModel.search.LOGIN_ID != '' && vm.viewModel.search.LOGIN_ID != null && vm.viewModel.search.LOGIN_ID != undefined) send.login_id = vm.viewModel.search.LOGIN_ID;
                if (vm.viewModel.search.EMP_NO != '' && vm.viewModel.search.EMP_NO != null && vm.viewModel.search.EMP_NO != undefined) send.emp_no = vm.viewModel.search.EMP_NO;


                Axios.post("/selectUserList.do", send).then(function(response) {

                    vm.viewModel.list = response.data.list;
                    vm.viewModel.pager.totalSize = response.data.totalCNT;
                    //페이징세팅
                    Pager.props = Pager.methods.createPaging(vm.viewModel.pager, vm, "list");
                    
                    vm.setGrid();
                });
                
            },
            setGrid: function () {
                let vm = this;

                $('#list').jqGrid({
                    datatype : 'local', // 데이터 타입 : json, local
                    data : vm.viewModel.list, // 데이터
                    colNames : ['LOGIN_ID', 'USER_NM', 'MOBILE_NO', 'EMAIL_DS', 'INCUMBENT_CD'], // 그리드 헤더명
                    colModel : [ // 각 컬럼 설정정
                        { name: 'LOGIN_ID', index: 'LOGIN_ID', width: 60 },
                        { name: 'USER_NM', index: 'USER_NM', width: 150 },
                        { name: 'MOBILE_NO', index: 'MOBILE_NO', width: 150 },
                        { name: 'EMAIL_DS', index: 'EMAIL_DS', width:  200 },
                        { name: 'INCUMBENT_CD', index: 'INCUMBENT_CD', width: 100 }
                    ],
                    rowNum: 5,// 한 페이지에 표시할 데이터 수
                    rowList: [5, 10, 20], // 사용자가 선택할 수 있는 데이터 수 옵션
                    pager: '#pager',// 페이징을 위한 요소
                    sortname: 'LOGIN_ID', // 기본 정렬할 걸럼
                    viewrecords: true, // 총 레코드 수 표시 여부
                    sortorder: 'asc', // 정렬 순서
                    height: 'auto',  // 그리드 높이 자동 조절
                    autowidth: true // 그리드 너비 자동 조절
                })
            },
            fnGetChangeSelectList: function(data){
                let vm = this;
                if(data >= null || data != 0){
                    vm.viewModel.pager.pageNo = 1;
                    vm.fnInit();
                }
            },
            fnreset:function(){
                this.fnRefresh();
            },
            fnDelete:function(notice_sn){
                let vm = this;
                let send = {
                    mapperId : 'notice.deleteNotice',
                    notice_sn : notice_sn 
                }
                if(confirm('정말 삭제하시겠습니까?')) { 
                    Axios.post('/deleteNotice.do', send).then(function(res){
                        alert('삭제되었습니다.');
                        vm.fnList(0);                    
                    })
                } else { 
                    alert('취소되었습니다.');
                }
            },
            fnPopup: function(sn) {
				let vm = this;

                let send = {
                    sn: sn
                }

                // Axios.post("/selectNoticeFileList.do", send)
                // .then(function(response) {
                //     vm.fileViewPop=true;
                //     vm.$nextTick(function() {
                //         if(vm.fileViewPop) {
                //             vm.$refs.fileViewPopup.fnInit(response.data.fileList, 'notice');
                //         }
                //     })
                // });	
			},
        }
    };
</script>