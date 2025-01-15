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
                            <option value="">현장명 선택</option>
                            <option v-for="(item, i) in viewModel.searchBplcList" :key="i" :value="item.bplc_sn">{{ item.bplc_nm }}</option>
                        </select>
                    </div>
                    <select title="자격종류" id="select">
                        <option value="all" selected>전체</option>
                        <option v-for="(item,i) in viewModel.qlfcList" :key="i" :value="item.CODE">{{item.CODE_NM}}</option>>
                    </select>
                    <input type="text" id="keyword" placeholder="검색어를 입력하세요." title="검색어 입력">
                </div>
            </div>
            <div class="btn-group">
                    <a href="javascript:;" class="btn btn-default-line" @click="fnreset"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-refresh"></use></svg>초기화</a>
                    <a href="javascript:;" class="btn btn-default" @click="fnList(0)"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-search"></use></svg>검색</a>
                </div>
        </div>
    </div>
    <div class="contents">
        <div>
            <!-- <ul class="tab">
                <li class="active"><button id="elt" ref="eltClick" @click="fnList(0,'elt')">안전보건 선임관리</button></li>
                <li><button id="edc" ref="edcClick" @click="fnList(0,'edc')">안전보건 교육관리</button></li>
            </ul>
            <div class="tab_content"> -->
                <!-- <div class="on"> -->
                    <div class="table_top">
                        <div class="total_count">총 <em>{{ viewModel.pager.totalSize }}</em>건</div>
                        <!-- <div class="icon_box">
                            <button class="btn btn-white"><i class="icon_pdf"></i></button>
                            <button class="btn btn-white"><i class="icon_word"></i></button>
                            <button class="btn btn-white"><i class="icon_ppt"></i></button>
                            <button class="btn btn-white"><i class="icon_excel"></i></button>
                        </div> -->
                        <select v-model="viewModel.pager.rowSize" @change="fnChangeCNTSelect(viewModel.pager.rowSize);">
                            <option :value="10" >10개</option>
                            <option :value="30" >30개</option>
                            <option :value="50" >50개</option>
                            <option :value="100" >100개</option>
					    </select>
                    </div>
                    <table class="table">
                        <caption>안전보건 선임관리</caption>
                        <thead>
                            <tr>
                                <th scope="col" class="w50">번호</th>
                                <th scope="col">자격종류</th>                                                                       
                                <th scope="col" v-if="viewModel.userInfo.user_roles == 'ROLE_001'">현장명</th>
                                <th scope="col">성명</th>
                                <th scope="col">이수교육</th>
                                <th scope="col">선임계</th>
                                <th scope="col">교육이수증</th>
                                <th scope="col">관리</th>
                            </tr>
                        </thead>
                        <tbody v-if="viewModel.list.length > 0">
                            <tr v-for="(item,i) in viewModel.list" :key="i">
                                <td>{{(viewModel.pager.pageNo==1) ? viewModel.pager.totalSize-i : viewModel.pager.totalSize-((viewModel.pager.rowSize*(viewModel.pager.pageNo-1))+i)}}</td>
                                <td>{{ item.qlfc_knd }}</td>
                                
                                <td class="text-left" v-if="viewModel.userInfo.user_roles == 'ROLE_001'"><router-link class="btn-link" :to="{name:'detail' ,params: {sn:item.apnt_mng_sn}}">{{ item.bplc_nm }}</router-link></td>
                                <td>{{ item.user_nm }}</td>
                                <td v-if="item.edu_compl_yn == 'N' && viewModel.userInfo.user_id == item.user_id">
                                    <router-link :to="{name:'edcWrite' ,params: {sn:item.apnt_mng_sn}}" class="btn btn-small btn-blue">
                                        등록
                                    </router-link>
                                    </td>
                                <td v-else>{{ item.edu_nm }} 
                                    <router-link v-if="(viewModel.userInfo.user_id == item.user_id)" :to="{name:'edcWrite', params: {sn : item.apnt_mng_sn}}" href="javacript:;" class="btn btn-icon"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-edit-contents"></use></svg></router-link>
                                </td>
                                <td>
                                    <button class="btn btn-icon" @click="fnPopup(item.apnt_mng_sn,'1');" v-if="item.elt_file_cnt > 0"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-attachment"></use></svg></button>
                                </td>
                                <td>
                                    <button class="btn btn-icon" @click="fnPopup(item.apnt_mng_sn,'2');" v-if="item.edc_file_cnt > 0"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-attachment"></use></svg></button>
                                </td>
                                <td class="ws-nw">
                                    <router-link :to="{name:'detail' ,params: {sn:item.apnt_mng_sn}}" href="javacript:;" class="btn btn-icon"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-content-search"></use></svg></router-link>
                                    <router-link v-if="(viewModel.userInfo.user_id == item.reg_id) || (viewModel.userInfo.user_roles == 'ROLE_001')" :to="{name:'eltWrite', params: {sn : item.apnt_mng_sn}}" href="javacript:;" class="btn btn-icon"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-edit-contents"></use></svg></router-link>
                                    <a v-if="(viewModel.userInfo.user_id == item.reg_id) || (viewModel.userInfo.user_roles == 'ROLE_001')" href="javacript:;" class="btn btn-icon" @click="fndelete(item.apnt_mng_sn)"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-delete-sweep"></use></svg></a>
                                </td>
                            </tr>
                        </tbody>
                        <tbody v-else>
                        <tr>
                            <td :colspan="viewModel.userInfo.user_roles == 'ROLE_001' ? '8' : '7'">등록된 데이터가 없습니다.</td>
                        </tr>
                    </tbody>
                    </table>
                    <div class="table_footer">
                        <pager :pass="viewModel.pager"></pager>
                        <div class="btn-group"> 
                            <router-link to="/eltWrite" class="btn btn-purple"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-post-add"></use></svg>등록</router-link>
                        </div>
                    </div>
                <!-- </div> -->
                <!-- <div>
                    <div class="table_top">
                        <div class="total_count">총 <em>{{ viewModel.pager.totalSize }}</em>건</div>
                        <div class="icon_box">
                            <button class="btn btn-white"><i class="icon_pdf"></i></button>
                            <button class="btn btn-white"><i class="icon_word"></i></button>
                            <button class="btn btn-white"><i class="icon_ppt"></i></button>
                            <button class="btn btn-white"><i class="icon_excel"></i></button>
                        </div>
                        <select v-model="viewModel.pager.rowSize" @change="fnChangeCNTSelect(viewModel.pager.rowSize,'edc');">
                            <option :value="10" >10개</option>
                            <option :value="30" >30개</option>
                            <option :value="50" >50개</option>
                            <option :value="100" >100개</option>
					    </select>
                    </div>
                    <table class="table">
                        <caption>안전보건 교육관리</caption>
                        <thead>
                            <tr>
                                <th scope="col">번호</th>
                                <th scope="col">교육분류</th>
                                <th scope="col">교육명</th>
                                <th scope="col">부서명</th>
                                <th scope="col">담당자</th>
                                <th scope="col">교육일</th>
                                <th scope="col">미교육자</th>
                                <th scope="col">첨부</th>
                                <th scope="col">관리</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item,i) in viewModel.list" :key="i">
                                <td>{{(viewModel.pager.pageNo==1) ? viewModel.pager.totalSize-i : viewModel.pager.totalSize-((viewModel.pager.rowSize*(viewModel.pager.pageNo-1))+i)}}</td>
                                <td>{{ item.edu_clsf }}</td>
                                <td>{{ item.edu_nm }}</td>
                                <td>{{ item.dept_nm }}</td>
                                <td>{{ item.pic }}</td>
                                <td>{{ item.edu_dt }}</td>
                                <td><a href="" class="btn btn-small btn-white">메일발송</a></td>
                                <td>
                                    <a v-if="viewModel.userInfo.user_id == item.reg_id" href="javacript:;" class="btn btn-icon" @click="fnPopup(item.edu_mng_sn);"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-attachment"></use></svg></a></td>
                                <td>
                                    <a href="javacript:;" class="btn btn-icon"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-edit"></use></svg></a>
                                    <router-link v-if="viewModel.userInfo.user_id == item.reg_id" :to="{name:'edcWrite' ,params: {uid:item.edu_mng_sn}}" href="javacript:;" class="btn btn-icon"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-edit-contents"></use></svg></router-link>
                                    <a v-if="viewModel.userInfo.user_id == item.reg_id" href="javacript:;" class="btn btn-icon" @click="fndelete(item.edu_mng_sn)"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-delete-sweep"></use></svg></a>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div class="table_footer">
                        <pager :pass="viewModel.pager"></pager>
                        <div class="btn-group"> 
                            <router-link to="/edcWrite" class="btn btn-purple"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-post-add"></use></svg>등록</router-link>
                        </div>
                    </div>
                </div> -->
            <!-- </div> -->
        </div>
    </div>
    <fileViewPopup ref="fileViewPopup" v-if="fileViewPop==true"></fileViewPopup>
</div>
</template>

<script>
    import "es6-promise/auto";
    import Vue from "vue";
    import Axios from "axios";
    import Pager from "../../../paging.vue";
    import fileViewPopup from "../../popup/fileViewPopup.vue";
    Vue.component('pager',Pager);
    // Vue.component('excel',Excel);
    Vue.component('fileViewPopup',fileViewPopup);
    export default {
        data: function() {
            return {
                fileViewPop:false,
                viewModel:{
                    userInfo:{},
                    list:[],
                    qlfcList:[],
                    searchBplcList:[],
                    search:{
                        bplc_use_yn:'',
                        bplc_sn:'',
                    },
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
            fnInit:function(){
                let vm = this;
                vm.viewModel.userInfo = vm.$store.state.global.userInfo;
                vm.viewModel.search.bplc_sn = (vm.viewModel.userInfo.bplc_yn == 'N' && (vm.viewModel.userInfo.bplc_sn == 0 || vm.viewModel.userInfo.bplc_use_yn == 'N')) ? '' : vm.viewModel.userInfo.bplc_sn;
                vm.viewModel.search.bplc_use_yn = vm.viewModel.userInfo.bplc_yn == 'N' ? 'Y' : 'A';

                vm.fnSearch();
                vm.fnList(0);
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
            fnList:function(paramPageNo){
				let vm = this;
                vm.viewModel.pager.pageNo = paramPageNo == 0 ? 1 : paramPageNo;
                
                let send = {
                    pageNo:vm.viewModel.pager.pageNo,
                    pageSize:vm.viewModel.pager.rowSize,
                    bplc_sn : vm.viewModel.search.bplc_sn,
                    role_id : vm.viewModel.userInfo.user_roles,
                    bplc_use_yn: vm.viewModel.search.bplc_use_yn,
                    qlfc_knd : $("#select").val(),
                    keyword : $("#keyword").val(),
                    dept_sn: vm.viewModel.userInfo.dept_sn,
                    team_sn: vm.viewModel.userInfo.team_sn,
                }
                Axios.post("/selectHsPsList.do", send)
                .then(function(response) {
                    vm.viewModel.list = response.data.list;
                    vm.viewModel.pager.totalSize = response.data.totalCNT;
                    //페이징세팅
                    Pager.props = Pager.methods.createPaging(vm.viewModel.pager, vm, "list");
                });
            },
            fnSearch:function(){
                let vm = this;
                let data = {
                    code_group : "QLFC_TYPE"
                }
                Axios.post("/selectHsPsQlfcList.do",data)
                .then(function(response) {
                    vm.viewModel.qlfcList = response.data.list;

                });
            },
            fndelete:function(sn){
                let vm = this;
                if(confirm("삭제하시겠습니까?")){
                    Axios.post("/deleteHsPs.do",{apnt_mng_sn:sn}).then(function(){
                        vm.fnInit();
                        alert("삭제를 완료했습니다.");
                    })
                }else{
                    alert("삭제를 취소합니다.");
                }
            },
            //페이징 처리
            fnChangeCNTSelect: function(rowSize){
                let vm = this;
                if(rowSize != undefined || rowSize > 0){
                    vm.viewModel.pager.rowSize = rowSize
                    vm.fnList(0);
                }
            },
            fnreset:function(){
                this.select = "";
                this.keyword = "";
                this.viewModel.search = {
                    bplc_use_yn : this.viewModel.userInfo.bplc_yn == 'N' ? 'Y' : 'A',
                    bplc_sn: (this.viewModel.userInfo.bplc_yn == 'N' && (this.viewModel.userInfo.bplc_sn == 0 || this.viewModel.userInfo.bplc_use_yn == 'N')) ? '' : this.viewModel.userInfo.bplc_sn
                }
                $("#keyword").val("");
                $("#select").val("all");
            },
            fnPopup: function(sn,file_se) {
				let vm = this;

                Axios.post("/selectHsPsFileList.do", {sn: sn,file_se : file_se})
                .then(function(response) {
                    vm.fileViewPop=true;
                    vm.$nextTick(function() {
                        if(vm.fileViewPop) {
                            vm.$refs.fileViewPopup.fnInit(response.data.fileList, 'hsps');
                        }
                    })
                });
			},
        }
    };
</script>