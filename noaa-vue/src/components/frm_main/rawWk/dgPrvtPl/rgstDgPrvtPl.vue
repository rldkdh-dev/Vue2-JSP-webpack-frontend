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
                    
                    <input type="text" placeholder="제목을 입력하세요." title="제목 입력" v-model="viewModel.search.ttl">
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
                <div class="total_count">총 <em>{{ viewModel.pager.totalSize }}</em>건</div>
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
                <caption>유해위험방지계획서</caption>
                <thead>
                    <tr>
                        <th scope="col" class="w50">번호</th>
                        <th scope="col" v-if="viewModel.userInfo.user_roles == 'ROLE_001'">현장명</th>
                        <th scope="col">날짜</th>
                        <th scope="col">제목</th>
                        <th scope="col">담당자</th>
                        <!-- <th>사진</th> -->
                        <th scope="col">첨부</th>
                        <th scope="col">관리</th>
                    </tr>
                </thead>
                <tbody>
                    <template v-if="viewModel.list.length != 0">
                        <tr  v-for="(item, i) in viewModel.list" :key="i">
                            <td>{{(viewModel.pager.pageNo==1) ? viewModel.pager.totalSize-i : viewModel.pager.totalSize-((viewModel.pager.rowSize*(viewModel.pager.pageNo-1))+i)}}</td>
                            <td class="text-left" v-if="viewModel.userInfo.user_roles == 'ROLE_001'">{{item.bplc}}</td>
                            <td>{{item.dt}}</td>
                            <td class="text-left"><router-link class="btn-link" :to="'/detail/' + item.actpln_sn">{{item.ttl}}</router-link></td>
                            <td>{{item.pic}}</td>
                            <!-- <td></td> -->
                            <!-- <td v-if="item.STRG_FILE_NM != '' && item.STRG_FILE_NM != null && item.STRG_FILE_NM != undefined && item.FILE_EXTN == 'png' || item.FILE_EXTN == 'jpg' || item.FILE_EXTN == 'jpeg' || item.FILE_EXTN == 'gif' " style="width: 15%;"><img :src="'/uploadfiles/temp/prttMngmt/' + item.STRG_FILE_NM"/></td>
                             <td v-else></td> -->
                            <td><button v-if="item.STRG_FILE_NM != '' && item.STRG_FILE_NM != null && item.STRG_FILE_NM != undefined " class="btn btn-icon" @click="fnPopup(item.actpln_sn, 5);"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-attachment"></use></svg></button></td>
                            <td v-if="item.reg_id == viewModel.userInfo.user_id">
                                <router-link :to="{name: 'rgstDgPrvtPlDetail', params: {actpln_sn:item.actpln_sn}}" class="btn btn-icon"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-content-search"></use></svg></router-link>
                                <router-link :to="{name: 'rgstDgPrvtPlUpdate', params: {actpln_sn:item.actpln_sn}}" class="btn btn-icon"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-edit-contents"></use></svg></router-link>
                                <a href="#" class="btn btn-icon" @click="fnDelete(item.actpln_sn)"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-delete-sweep"></use></svg></a>
                            </td>
                            <td v-else>
                                <router-link :to="{name: 'rgstDgPrvtPlDetail', params: {actpln_sn:item.actpln_sn}}" class="btn btn-icon"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-content-search"></use></svg></router-link> 
                            </td>
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
                    <a v-if="viewModel.userInfo.bplc_yn == 'N' || viewModel.userInfo.ocpt_se_cd == 'MNG'" href="#/write" class="btn btn-purple"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-post-add"></use></svg>등록</a>
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
    import fileViewPopup from "../../../../common/vue/fileViewPopup.vue";

    Vue.component('pager',pager,)
    Vue.component('fileViewPopup',fileViewPopup,)
    
    export default {
        data: function() {
            return {
                fileViewPop:false,
                viewModel:{
                    search:{
                        bplc_sn:'',
                        bplc_use_yn:''
                    },
                    searchBplcList:[],
                    userInfo:{},
                    imgsrc:'',
                    list:[],
                    actpln_sn : '',
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
            vm.userinfo=vm.$store.state.global.userInfo;
            
            vm.fnInit();
            vm.$router.afterEach((to, from) => {
                vm.fnList(vm.viewModel.pager.pageNo);
            });
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
                }
            },            
            fnInit:function(){
                let vm = this;
                vm.viewModel.userInfo = vm.$store.state.global.userInfo;
                vm.viewModel.search.bplc_use_yn = vm.viewModel.userInfo.bplc_yn == 'N' ? 'Y' : 'A';
                vm.viewModel.search.bplc_sn = (vm.viewModel.userInfo.bplc_yn == 'N' && (vm.viewModel.userInfo.bplc_sn == 0 || vm.viewModel.userInfo.bplc_use_yn == 'N')) ? '' : vm.viewModel.userInfo.bplc_sn;

                vm.fnList(0);
            },
            fnList:function(paramPageNo){
                let vm = this;

                vm.viewModel.pager.pageNo = paramPageNo == 0 ? 1 : paramPageNo;

                let send={
                    mapperId:'rgstDgPrvtPl.selectRgstDgPrvtPlList',
                    totalId:'rgstDgPrvtPl.selectRgstDgPrvtPlListTotal',
                    pageNo:vm.viewModel.pager.pageNo,
                    pageSize:vm.viewModel.pager.rowSize,
                    pagingYN:'Y',
                    ttl:vm.viewModel.search.ttl,
                    bplc_sn:vm.viewModel.search.bplc_sn,
                    bplc_use_yn: vm.viewModel.search.bplc_use_yn,
                    bplc_yn:vm.viewModel.userInfo.bplc_yn,
                    dept_sn: vm.viewModel.userInfo.dept_sn,
                    team_sn: vm.viewModel.userInfo.team_sn,
                    // bplc: vm.viewModel.search.bplc_sn,
                }
                Axios.post("/selectRgstDgPrvtPlList.do",send).then(function(res){
                    vm.viewModel.list = res.data.list;
                    vm.viewModel.pager.totalSize = res.data.totalCNT;
                    pager.props = pager.methods.createPaging(vm.viewModel.pager, vm, "list");
                    // vm.viewModel.searchBplcList = res.data.searchBplcList;
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
            fnDelete:function(actpln_sn){
                let vm = this;
                let send = {
                    mapperId : 'rgstDgPrvtPl.deleteRgstDgPrvtPl',
                    actpln_sn : actpln_sn 
                }
                if(confirm('정말 삭제하시겠습니까?')) { 
                    Axios.post('/deleteRgstDgPrvtPl.do', send).then(function(res){
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
                    , menu_se: se
                }

                Axios.post("/selectRgstDgPrvtPlFileList.do", send)
                .then(function(response) {
                    vm.fileViewPop=true;
                    vm.$nextTick(function() {
                        if(vm.fileViewPop) {
                            vm.$refs.fileViewPopup.fnInit(response.data.fileList, 'rawWk');
                        }
                    }) 
                });	
			},
            
            fnGetChangeSelectList: function(data){
                let vm = this;
                if(data >= null || data != 0){
                    vm.viewModel.pager.pageNo = 1;
                    vm.fnList(0);                
                }
            },
        }
    };
</script>