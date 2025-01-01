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
                    <input type="text" placeholder="이름을 입력하세요." title="이름 입력" v-model="viewModel.search.user_nm">
                </div>
            </div>
            <div class="btn-group">
                <button class="btn btn-default-line" @click="fnRefresh()"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-refresh"></use></svg>초기화</button>
                <button class="btn btn-default" @click="fnList(0)"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-search"></use></svg>검색</button>
            </div>
        </div>
    </div>
    <div class="contents">    
        <div>
            <div class="table_top">
                <div class="total_count">총<em>{{ viewModel.pager.totalSize }}</em>건</div>
                <!-- <div class="icon_box">
                    <button class="btn btn-white"><i class="icon_pdf"></i></button>
                    <button class="btn btn-white"><i class="icon_word"></i></button>
                    <button class="btn btn-white"><i class="icon_ppt"></i></button>
                    <button class="btn btn-white"><i class="icon_excel"></i></button>
                </div> -->
                <select v-model="viewModel.pager.rowSize" @change="fnGetChangeSelectList(viewModel.pager.rowSize);">
                    <option :value="10">10개씩 보기</option>
                    <option :value="30">30개씩 보기</option>
                    <option :value="50">50개씩 보기</option>
                    <option :value="100">100개씩 보기</option>
                </select>
            </div>
            <table class="table">
                <caption>보호구 관리</caption>
                <thead>
                    <tr>
                        <th scope="col" class="w50">번호</th>
                        <th scope="col" v-if="viewModel.userInfo.user_roles == 'ROLE_001'">현장명</th>
                        <th scope="col">이름</th>
                        <th scope="col">안전모</th>
                        <th scope="col">안전화</th>
                        <th scope="col">안전대(벨트)</th>
                        <th scope="col">마스크</th>
                        <th scope="col">기타(각반)</th>
                    </tr>
                </thead>
                <tbody>
                    <template v-if="viewModel.list.length != 0">
                        <tr v-for="(item, i) in viewModel.list" :key="i">
                            <td>{{(viewModel.pager.pageNo==1) ? viewModel.pager.totalSize-i : viewModel.pager.totalSize-((viewModel.pager.rowSize*(viewModel.pager.pageNo-1))+i)}}</td>
                            <td class="text-left" v-if="viewModel.userInfo.user_roles == 'ROLE_001'">{{item.BPLC_NM}}</td>
                            <td>{{ item.USER_NM }}</td>
                            <td v-if="item.SAFETY_HELMET == 'Y'">O</td><td v-else>X</td>
                            <td v-if="item.SAFETY_SHOE == 'Y'">O</td><td v-else>X</td>
                            <td v-if="item.SAFETY_BELT == 'Y'">O</td><td v-else>X</td>
                            <td v-if="item.MASK == 'Y'">O</td><td v-else>X</td>
                            <td v-if="item.ETC_GAITERS == 'Y'">O</td><td v-else>X</td>
                        </tr>
                    </template>
                    <template v-if="viewModel.list.length == 0"><tr><td :colspan="viewModel.userInfo.user_roles == 'ROLE_001' ? '14' : '13'">게시물이 없습니다.</td></tr></template>
                    <!-- 나머지 행들도 동일한 형식으로 추가 -->
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
                    <!-- <a href="#/write" class="btn btn-purple"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-post-add"></use></svg>등록</a> -->
                    <!-- <a href="" class="btn btn-gray"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-trash-can"></use></svg>삭제</a> -->
                </div>
            </div>
        </div>
    </div>
    <fileViewPopup ref="fileViewPopup" v-if="fileViewPop==true"></fileViewPopup>
</div>
</template>

<script>
    import "es6-promise/auto";
    import Vue from "vue";
    import Axios from "axios";
    import pager from "../../../../common/vue/paging.vue";
    import fileViewPopup from "../../popup/fileViewPopup.vue";
    

    export default {
        components: {
            'pager':pager,
            'fileViewPopup':fileViewPopup,
            
        },
        data: function() {
            return {
                fileViewPop:false,
                viewModel:{
                    search:{
                        bplc_sn:'',
                        bplc_use_yn:'',
                        user_nm:''
                    },
                    searchBplcList:[],
                    userInfo:{},
                    imgsrc:'',
                    list:[],
                    prtc_eqpmnt_sn : '',
                    selectList:[],
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
            fnDetail:function(sn){
                    let vm = this;
                    vm.$router.push('/detail/' + sn)  
                },
            fnRefresh: function(){
                let vm = this;
                vm.viewModel.search = {
                    bplc_use_yn : vm.viewModel.userInfo.bplc_yn == 'N' ? 'Y' : 'A',
                    bplc_sn: (vm.viewModel.userInfo.bplc_yn == 'N' && (vm.viewModel.userInfo.bplc_sn == 0 || vm.viewModel.userInfo.bplc_use_yn == 'N')) ? '' : vm.viewModel.userInfo.bplc_sn,
                    user_nm: ''
                }
            },  
            fnInit:function(){
                let vm = this;
                vm.viewModel.search.bplc_use_yn = vm.viewModel.userInfo.bplc_yn == 'N' ? 'Y' : 'A';
                vm.viewModel.search.bplc_sn = (vm.viewModel.userInfo.bplc_yn == 'N' && (vm.viewModel.userInfo.bplc_sn == 0 || vm.viewModel.userInfo.bplc_use_yn == 'N')) ? '' : vm.viewModel.userInfo.bplc_sn;
                
                vm.fnList(0);
            },
            fnList:function(paramPageNo){
                let vm = this;
                vm.viewModel.pager.pageNo = paramPageNo == 0 ? 1 : paramPageNo;

                let send={
                    mapperId:'prttMngmt.selectPrttRcptList',
                    totalId:'prttMngmt.selectRcptListTotal',
                    pageNo:vm.viewModel.pager.pageNo,
                    pageSize:vm.viewModel.pager.rowSize,
                    pagingYN:'Y',
                    user_nm:vm.viewModel.search.user_nm,
                    bplc_sn:vm.viewModel.search.bplc_sn,
                    bplc_use_yn:vm.viewModel.search.bplc_use_yn,
                    bplc_yn:vm.viewModel.userInfo.bplc_yn,
                    dept_sn: vm.viewModel.userInfo.dept_sn,
                    team_sn: vm.viewModel.userInfo.team_sn,
                    // bplc: vm.viewModel.search.bplc_sn,
                }
                Axios.post("/selectPrttMngmtList.do",send).then(function(res){
                    vm.viewModel.list = res.data.list;
                    vm.viewModel.pager.totalSize = res.data.totalCNT;
                    pager.props = pager.methods.createPaging(vm.viewModel.pager, vm, "list");
                })
                // console.log(send);
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
            fnGetChangeSelectList: function(data){
                let vm = this;
                if(data >= null || data != 0){
                    vm.viewModel.pager.pageNo = 1;
                    vm.fnInit();                
                }
            },
        }
    };
</script>