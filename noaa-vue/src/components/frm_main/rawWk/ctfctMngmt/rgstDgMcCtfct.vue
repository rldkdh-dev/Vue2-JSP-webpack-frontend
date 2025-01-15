<template>i
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
                            <select id="list" v-model="viewModel.search.bplc_sn">
                                <option value="" selected="">현장명 선택</option>
                                <option :value="item.bplc_sn" v-for="(item,i) in viewModel.searchBplcList" :key="i">{{ item.bplc_nm }}</option>
                            </select>
                        </div>
                        <select title="구분" id="crtfct" v-model="viewModel.search.crtfct_se">
                            <option v-for="(item, i) in viewModel.crtfctList" :key="i" :value="item.value">{{ item.text }}</option>
                        </select>
                        <input type="text" placeholder="인증서명을 입력하세요." title="인증서명 입력" v-model="viewModel.search.ORGNL_FILE_NM">
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
                    <caption>인증서 관리</caption>
                    <thead>
                        <tr>
                            <th scope="col" class="w50">번호</th>
                            <th scope="col" v-if="viewModel.userInfo.user_roles == 'ROLE_001'">현장명</th>
                            <th scope="col">인증서 구분(품명)</th>
                            <th scope="col">인증서명</th>
                            <th scope="col">등록일자</th>
                            <th scope="col">첨부</th>
                            <th scope="col">관리</th>
                        </tr>
                    </thead>
                    <tbody>
                        <template v-if="viewModel.list.length != 0">
                            <tr  v-for="(item, i) in viewModel.list" :key="i">
                                <td>{{(viewModel.pager.pageNo==1) ? viewModel.pager.totalSize-i : viewModel.pager.totalSize-((viewModel.pager.rowSize*(viewModel.pager.pageNo-1))+i)}}</td>
                                <td class="text-left" v-if="viewModel.userInfo.user_roles == 'ROLE_001'">{{item.bplc_nm}}</td>
                                <td v-if="item.crtfct_se == '1'">유해위험기계기구({{ item.rmrk }})</td>
                                <td v-else-if="item.crtfct_se == '2'">보호구({{ item.rmrk }})</td>
                                <td v-else></td>
                                <td class="text-left"><router-link class="btn-link" :to="'/detail/' + item.crtfct_sn">{{item.ORGNL_FILE_NM}}</router-link></td>
                                <td>{{item.reg_dt}}</td>
                                <td><button v-if="item.STRG_FILE_NM != '' && item.STRG_FILE_NM != null && item.STRG_FILE_NM != undefined " class="btn btn-icon" @click="fnPopup(item.crtfct_sn, 1);"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-attachment"></use></svg></button></td>
                                <td v-if="item.reg_id == viewModel.userInfo.user_id || (viewModel.userInfo.user_roles == 'ROLE_001' && viewModel.userInfo.user_type_code == 'ACC_0000')">
                                    <router-link :to="{name: 'rgstDgMcCtfctDetail', params: {crtfct_sn:item.crtfct_sn}}" class="btn btn-icon"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-content-search"></use></svg></router-link>
                                    <router-link :to="{name: 'rgstDgMcCtfctUpdate', params: {crtfct_sn:item.crtfct_sn}}" class="btn btn-icon"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-edit-contents"></use></svg></router-link>
                                    <a href="#" class="btn btn-icon" @click="fnDelete(item.crtfct_sn)"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-delete-sweep"></use></svg></a>
                                </td>
                                <td v-else>
                                    <router-link :to="{name: 'rgstDgMcCtfctDetail', params: {crtfct_sn:item.crtfct_sn}}" class="btn btn-icon"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-content-search"></use></svg></router-link> 
                                </td>
                            </tr>
                        </template>
                        <template v-if="viewModel.pager.totalSize == 0"><tr><td :colspan="viewModel.userInfo.user_roles == 'ROLE_001' ? '14' : '13'">게시물이 없습니다.</td></tr></template>
                        <!-- 나머지 행들도 동일한 형식으로 추가 -->
                    </tbody>
                </table>
                <div class="table_footer">
                    <pager :pass="viewModel.pager"></pager>
                    <div class="btn-group"> 
                        <!-- <div class="upload_file">
                            <div class="btn filebox">
                                첨부파일을 마우스로 드래그해서 추가해 주세요.f
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
    
        export default {
            components: {
                'pager':pager,
                'fileViewPopup':fileViewPopup,                
            },
            data: function() {
                return {
                    fileViewPop:false,
                    // test: false,
                    viewModel:{
                        search:{
                            bplc_sn:'',
                            bplc_use_yn:'',
                            crtfct_se:'',
                        },
                        crtfctList:[
                            {value:"", text:"작업 구분을 선택해주세요"},    
                            {value:"1", text:"유해위험기계기구"},
                            {value:"2", text:"보호구"}, 
                        ],
                        searchBplcList:[],
                        userInfo:{},
                        imgsrc:'',
                        list:[],
                        crtfct_sn : '',
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
                    },
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
                        crtfct_se:''
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
                        mapperId:'rgstDgMcCtfct.selectRgstDgMcCtfctList',
                        totalId:'rgstDgMcCtfct.selectRgstDgMcCtfctListTotal',
                        pageNo:vm.viewModel.pager.pageNo,
                        pageSize:vm.viewModel.pager.rowSize,
                        pagingYN:'Y',
                        ORGNL_FILE_NM:vm.viewModel.search.ORGNL_FILE_NM,
                        bplc_sn:vm.viewModel.search.bplc_sn,
                        bplc_use_yn:vm.viewModel.search.bplc_use_yn,
                        bplc_yn:vm.viewModel.userInfo.bplc_yn,
                        crtfct_se:vm.viewModel.search.crtfct_se,
                        dept_sn: vm.viewModel.userInfo.dept_sn,
                        team_sn: vm.viewModel.userInfo.team_sn,
                    }
                    Axios.post("/selectRgstDgMcCtfctList.do",send).then(function(res){
                        vm.viewModel.list = res.data.list;
                        vm.viewModel.pager.totalSize = res.data.totalCNT;
                        pager.props = pager.methods.createPaging(vm.viewModel.pager, vm, "list");
                        // vm.viewModel.searchBplcList = res.data.searchBplcList;
                        for(var i =0; i<vm.viewModel.list.length; i++){
                            var text = vm.viewModel.list[i].ORGNL_FILE_NM.split('.');
                            vm.viewModel.list[i].ORGNL_FILE_NM = text[0]
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
                fnDelete:function(crtfct_sn){
                    let vm = this;
                    let send = {
                        mapperId : 'rgstDgMcCtfct.deleteRgstDgMcCtfct',
                        crtfct_sn : crtfct_sn 
                    }
                    if(confirm('정말 삭제하시겠습니까?')) { 
                        Axios.post('/deleteRgstDgMcCtfct.do', send).then(function(res){
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
    
                    Axios.post("/selectRgstDgMcCtfctFileList.do", send)
                    .then(function(response) {
                        vm.fileViewPop=true;
                        vm.$nextTick(function() {
                            if(vm.fileViewPop) {
                                response.data.fileList.sn 
                                vm.$refs.fileViewPopup.fnInit(response.data.fileList, 'rgstDgMcCtfct');
                            }
                        })
                    });	
                },
                
                fnGetChangeSelectList: function(data){
                    let vm = this;
                    if(data >= null || data != 0){
                        vm.viewModel.pager.pageNo = 1;
                        vm.fnInit();                
                    }
                },
                // fntest:function(p,t){
                //     console.log(p+t);
                //     console.log(this.$refs.PDFviewer);
                //     this.test = true;
                //     this.$refs.PDFviewer.fnSetContents(p,t);

                // }
            }
        };
    </script>