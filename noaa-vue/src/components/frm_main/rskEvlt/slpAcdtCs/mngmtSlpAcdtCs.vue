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
                                <option value="0">현장명 선택</option>
                                <option v-for="(item, i) in searchBplcList" :key="i" :value="item.bplc_sn">{{ item.bplc_nm }}</option>
                            </select>
                        </div>
                        
                        <div class="input_group">
                            <div class="datepicker_box">
                                <input type="text" class="datepicker" id="sdt" title="datepicker" placeholder="시작일" readonly>
                            </div>
                            <label>~</label>
                            <div class="datepicker_box">
                                <input type="text" class="datepicker" id="edt" title="datepicker" placeholder="종료일" readonly>
                            </div>
                        </div>
                        <input type="text" placeholder="사고명을 입력하세요." title="검색어 입력" v-model="ttl" @input="ttl = $event.target.value">
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
                <div class="table_top">
                    <div class="total_count">총 <em>{{ viewModel.pager.totalSize }}</em>건</div>
                    <!-- <div class="icon_box">
                        <button class="btn btn-white"><i class="icon_pdf"></i></button>
                        <button class="btn btn-white"><i class="icon_word"></i></button>
                        <button class="btn btn-white"><i class="icon_ppt"></i></button>
                        <button class="btn btn-white"><i class="icon_excel"></i></button>
                    </div> -->
					<select v-model="viewModel.pager.rowSize" @change="fnGetChangeSelectList(viewModel.pager.rowSize);">
                            <option :value="10" >10개</option>
                            <option :value="30" >30개</option>
                            <option :value="50" >50개</option>
                            <option :value="100" >100개</option>
					</select>
                </div>
                <table class="table">
                    <caption>아차사고 이력 관리</caption>
                    <thead>
                        <tr>
                            <th scope="col" class="w50">번호</th>
                            <th scope="col">발생일자</th>
                            <th scope="col" v-if="viewModel.userInfo.user_roles == 'ROLE_001'">현장명</th>
                            <th scope="col">위치</th>
                            <th scope="col">사고명</th>
                            <th scope="col">아차사고내용</th>
                            <th scope="col">재발방지대책</th>
                            <th scope="col">작성자</th>
                            <th scope="col">첨부</th>
                            <th scope="col">관리</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item,i) in viewModel.list" :key="i">
                            <td>{{(viewModel.pager.pageNo==1) ? viewModel.pager.totalSize-i : viewModel.pager.totalSize-((viewModel.pager.rowSize*(viewModel.pager.pageNo-1))+i)}}</td>
                            <td class="ws-nw">{{ item.ocrn_dt }}</td>
                            <td class="text-left" v-if="viewModel.userInfo.user_roles == 'ROLE_001'"><router-link class="btn-link" :to="{name:'mngmtSlpAcdtCsDetail', params: {uid : item.acdnt_mng_sn , atchmnfl: item.file_se}}">{{ item.bplc_nm }}</router-link></td>
                            <td>{{ item.pstn }}</td>
                            <td class="text-left">{{ item.ttl }}</td>
                            <td class="text-left">{{ item.cn }}</td>
                            <td class="text-left">{{ item.recr_prvn_cntrpln }}</td>
                            <td>{{ item.jbttl_id }}</td>
                            <td>
                                <a v-if="item.file_se != 0" href="javascript:;" class="btn btn-icon" @click="fnPopup(item.acdnt_mng_sn);"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-attachment"></use></svg></a>
                            </td>
                            <td class="ws-nw">
                                <router-link :to="{name:'mngmtSlpAcdtCsDetail', params: {uid : item.acdnt_mng_sn , atchmnfl: item.file_se }}" href="javacript:;" class="btn btn-icon"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-content-search"></use></svg></router-link>
                                <router-link v-if="viewModel.userInfo.user_id == item.reg_id" :to="{name:'mngmtSlpAcdtCsupdate' ,params: {uid:item.acdnt_mng_sn, atchmnfl: item.file_se}}" href="javacript:;" class="btn btn-icon"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-edit-contents"></use></svg></router-link>
                                <a v-if="viewModel.userInfo.user_id == item.reg_id" href="javascript:;" class="btn btn-icon" @click="fndelete(item.acdnt_mng_sn)"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-delete-sweep"></use></svg></a>
                            </td>
                        </tr>
                        <tr v-if="viewModel.list.length == 0"><td :colspan="viewModel.userInfo.user_roles == 'ROLE_001'? '14' : '13'">게시물이 없습니다.</td></tr>
                    </tbody>
                </table>
                <div class="table_footer">
                    <pager :pass="viewModel.pager"></pager>
                    <div class="btn-group"> 
                        <!-- <excel></excel> -->
                        <!-- <div class="upload_file">
                            <div class="btn filebox">
                                첨부파일을 마우스로 드래그해서 추가해 주세요.
                                <svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-mouse"></use></svg>
                            </div>
                        </div>				
                        <a href="" class="btn btn-white"><i class="icon_excel"></i>엑셀업로드</a>
                        <a href="" class="btn btn-purple"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-post-add"></use></svg>등록</a> -->
                        <router-link to="/write" class="btn btn-purple"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-post-add"></use></svg>등록</router-link>
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
    import Pager from "../../../../common/vue/paging.vue";
    // import Excel from "../../../excelupload.vue";
    import fileViewPopup from "../../../../common/vue/fileViewPopup.vue";
    Vue.component('pager',Pager);
    // Vue.component('excel',Excel);
    Vue.component('fileViewPopup',fileViewPopup);

    export default {
        data: function() {
            return {
                fileViewPop:false,
                imgsrc:'',
                select:'',
                ttl:'',
                searchBplcList:"",
                viewModel:{
                    userInfo:{},
                    list:[],
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
                    search:{
                        bplc_sn:0,
                        bplc_use_yn: ''
                    },
                }
            };
        },
        mounted: function() {
            let vm = this;
            calendarInput();
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
                vm.viewModel.search.bplc_use_yn = vm.viewModel.userInfo.bplc_yn == 'N' ? 'Y' : 'A';
                vm.viewModel.search.bplc_sn = (vm.viewModel.userInfo.bplc_yn == 'N' && (vm.viewModel.userInfo.bplc_sn == 0 || vm.viewModel.userInfo.bplc_use_yn == 'N')) ? '0': vm.viewModel.userInfo.bplc_sn;
                
                vm.fnList(0);
            },
            fnList:function(paramPageNo){
				let vm = this;
				
                vm.viewModel.pager.pageNo = paramPageNo == 0 ? 1 : paramPageNo;
                
                let send = {
                    pageNo:vm.viewModel.pager.pageNo,
                    pageSize:vm.viewModel.pager.rowSize,
                    ttl:vm.ttl,
                    pstn:vm.select,
                    bplc_sn:vm.viewModel.search.bplc_sn,
                    sdt:$("#sdt").val(),
                    edt:$("#edt").val(),
                    bplc_use_yn: vm.viewModel.search.bplc_use_yn,
                    dept_sn: vm.viewModel.userInfo.dept_sn,
                    team_sn: vm.viewModel.userInfo.team_sn
                }

                const sdt = new Date($("#sdt").val());
                const edt = new Date($("#edt").val());

                if (sdt > edt) {
                    return alert('시작일이 종료일보다 클 수 없습니다.');
                }

                Axios.post("/selectMngmtSlpAcdtCsList.do", send)
                .then(function(response) {
                    vm.viewModel.list = response.data.rskEvltList;
                    // console.log(vm.viewModel.list);
                    vm.viewModel.pager.totalSize = response.data.totalCount;

                    Pager.props = Pager.methods.createPaging(vm.viewModel.pager, vm, "list");
                }).catch(function(e){
                    console.error(e);
                });
            },
            fndelete:function(sn){
                let vm = this;
                if(confirm("삭제하시겠습니까?")){
                    Axios.post("/deleteMngmtSlpAcdtCsList.do",{acdnt_mng_sn:sn}).then(function(){
                        vm.fnInit();
                        alert("삭제를 완료했습니다.");
                    })
                }else{
                    alert("삭제를 취소합니다.");
                }
            },
            fnGetChangeSelectList: function(data){
                let vm = this;
                if(data >= null || data != 0){
                    vm.viewModel.pager.pageNo = 1;
                    vm.fnInit();
                }
            },
            fnreset:function(){
                this.select = "";
                this.pstn = "";
                this.spt = "";
                this.ttl = "";
                this.viewModel.search.bplc_sn = (this.viewModel.userInfo.bplc_yn == 'N' && (this.viewModel.userInfo.bplc_sn == 0 || this.viewModel.userInfo.bplc_use_yn == 'N')) ? '0' : this.viewModel.userInfo.bplc_sn,
                this.viewModel.search.bplc_use_yn = this.viewModel.userInfo.bplc_yn == 'N' ? 'Y' : 'A',
                
                $("#sdt").val("");
                $("#edt").val("");
            },
            fnPopup: function(sn) {
				let vm = this;
                Axios.post("/selectMngmtSlpAcdtCsFileList.do", {sn: sn})
                .then(function(response) {
                    vm.fileViewPop=true;
                    vm.$nextTick(function() {
                        if(vm.fileViewPop) {
                            vm.$refs.fileViewPopup.fnInit(response.data.fileList, 'mngmt');
                        }
                    })
                });
			},
            fnBplcList: function(){
                let vm = this;
                let data = {
                    mapperId: 'comm.selectAllBplcList',
                    bplc_use_yn: vm.viewModel.search.bplc_use_yn,
                    dept_sn: vm.viewModel.userInfo.dept_sn,
                    team_sn: vm.viewModel.userInfo.team_sn
                };
                Axios.post("/list.do", data).then(function (rs) {
                    vm.searchBplcList = rs.data.list;
                    
                    vm.viewModel.search.bplc_sn = '0';
                    if(vm.viewModel.userInfo.bplc_use_yn == 'Y' && vm.viewModel.search.bplc_use_yn == 'Y'){
                        vm.viewModel.search.bplc_sn = vm.viewModel.userInfo.bplc_sn == 0 ? '0' : vm.viewModel.userInfo.bplc_sn;
                    }
                });
            },
        }
    };
</script>