<template>
<div>
    <div class="search_area">
        <button class="btn_toggle_search" id="key" ref="seacth">검색</button>
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
                    
                    <div class="datepicker_box">
                        <input type="text" class="datepicker" id="sdt" placeholder="시작일" value="" title="시작일" readonly>
                    </div>
                    <span>~</span>
                    <div class="datepicker_box">
                        <input type="text" class="datepicker" id="edt" placeholder="종료일" value="" title="종료일" readonly>
                    </div>
                    <input type="text" placeholder="작성자를 입력하세요." title="작성자 입력" v-model="viewModel.search.wrtr">
                </div>
            </div>
            <div class="btn-group">
                <a href="javascript:;" class="btn btn-default-line" @click="fnreset"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-refresh"></use></svg>초기화</a>
                <a href="javascript:;" class="btn btn-default" @click="fnList(1)"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-search"></use></svg>검색</a>
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
                        <option :value="10" >10개씩 보기</option>
                        <option :value="30" >30개씩 보기</option>
                        <option :value="50" >50개씩 보기</option>
                        <option :value="100" >100개씩 보기</option>
                </select>
            </div>
            <table class="table">
                <caption>내부심사 평가관리</caption>
                <thead>
                    <tr>
                        <th scope="col" class="w50">번호</th>
                        <th scope="col" v-if="viewModel.userInfo.user_roles == 'ROLE_001'">현장명</th>
                        <th scope="col">현장소장</th>
                        <th scope="col">공정율</th>
                        <th scope="col">평가</th>
                        <th scope="col">심사일자</th>
                        <th scope="col">작성자</th>
                        <th scope="col">관리</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item , i) in list " :key="item">
                        <td>{{(viewModel.pager.pageNo==1) ? viewModel.pager.totalSize-i : viewModel.pager.totalSize-((viewModel.pager.rowSize*(viewModel.pager.pageNo-1))+i)}}</td>
                        <template v-if="viewModel.userInfo.user_roles == 'ROLE_001'">
                            <td class="text-left" v-if="item.artcl_cnt != 0"><router-link class="btn-link" :to="{name:'mngmtHseDetail' , params:{sn:item.inner_srng_sn}}">{{ item.bplc_nm }}</router-link></td>
                            <td class="text-left" v-else>{{ item.bplc_nm }}</td>
                        </template>
                        <td>{{ item.spt_hdch }}</td>
                        <td>{{ item.fair_rt+'%' }}</td>
                        <td v-if="item.artcl_cnt == 0"><a href="javascript:;" class="btn btn-blue btn-small" @click="fnhsePopup(item.inner_srng_sn)">등록</a></td>
                        <td v-else>등록 완료</td>
                        <td>{{ item.srng_dt }}</td>
                        <td>{{ item.user_nm }}</td>
                        <td>
                            <router-link v-if="item.artcl_cnt != 0" :to="{name:'mngmtHseDetail' , params:{sn:item.inner_srng_sn}}" class="btn btn-icon"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-content-search"></use></svg></router-link>
                            <router-link v-if="viewModel.userInfo.user_id == item.reg_id" :to="{name:'mngmtHseUpdate' , params:{sn:item.inner_srng_sn}}" class="btn btn-icon"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-edit-contents"></use></svg></router-link>
                            <a v-if="viewModel.userInfo.user_id == item.reg_id" href="javascript:;" class="btn btn-icon" @click="fnDelete(item.inner_srng_sn)"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-delete-sweep"></use></svg></a>
                        </td>
                    </tr>
                    <tr v-if="list.length ==0"><td :colspan="viewModel.userInfo.user_roles == 'ROLE_001' ? '14' : '13'">게시물이 없습니다.</td></tr>
                </tbody>
            </table>
            <div class="table_footer">
                <pager :pass="viewModel.pager"></pager>
                <div class="btn-group"> 
                    <router-link v-if="viewModel.userInfo.bplc_yn == 'N'" to="/write" class="btn btn-purple" id="router"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-post-add"></use></svg>등록</router-link>
                    <router-link v-if="viewModel.userInfo.bplc_yn == 'Y' && viewModel.userInfo.ocpt_se_cd == 'MNG'" to="/write" class="btn btn-purple" id="router"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-post-add"></use></svg>등록</router-link>
                </div>
            </div>
        </div>
    </div>
    <hsepopup ref="hsepopup" v-if="ishse==true"  @close="close"></hsepopup>
</div>
</template>

<script>
    import "es6-promise/auto";
    import Vue from "vue";
    import Axios from "axios";
    import Pager from "../../../../common/vue/paging.vue";
    import hsepopup from "./popup/Hsejudgepopup.vue";

    Vue.component('hsepopup',hsepopup);

    export default {
        components: {
            'pager': Pager,
        },
        data: function() {
            return {
                ishse:false,
                bplc_nm:"",
                list:[],
                searchBplcList:[],
                viewModel:{
                    userInfo:{},
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
                        bplc_sn:'0',
                        wrtr:"",
                        bplc_use_yn:''
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
            // window.addEventListener('keyup', vm.test);
            calendarInput();
            vm.fnInit();

            vm.$router.afterEach((to, from) => {
                vm.fnList(vm.viewModel.pager.pageNo);
            });
        },
        // beforeDestroy () {
        //     window.removeEventListener('keyup', this.test);
        // },
        methods: {
            // test:function(e){ //vue 키업테스트
            //     console.log(e.keyCode);
            //     if(e.keyCode == 13){
            //         // alert('엔터');
            //         // this.$router.push('/write');
            //         console.log(this.$refs);
            //         this.$refs.seacth.click();
            //         // this.$refs.seacth.$el.click();
            //     }
            // },
            fnInit:function(){
                let vm = this;
                vm.viewModel.userInfo = vm.$store.state.global.userInfo;
                vm.viewModel.search.bplc_use_yn = vm.viewModel.userInfo.bplc_yn == 'N' ? 'Y' : 'A';
                vm.viewModel.search.bplc_sn = (vm.viewModel.userInfo.bplc_yn == 'N' && (vm.viewModel.userInfo.bplc_sn == 0 || vm.viewModel.userInfo.bplc_use_yn == 'N')) ? "0" : vm.viewModel.userInfo.bplc_sn;
                vm.fnList(vm.viewModel.pager.pageNo)
            },
            fnList:function(paramPageNo){
				let vm = this;
				
                vm.viewModel.pager.pageNo = paramPageNo == 0 ? 1 : paramPageNo;
                
                let send = {
                    pageNo:vm.viewModel.pager.pageNo,
                    pageSize:vm.viewModel.pager.rowSize,
                    bplc_nm:vm.bplc_nm,
                    bplc_yn:vm.viewModel.userInfo.bplc_yn,
                    bplc_sn: vm.viewModel.search.bplc_sn,
                    bplc_use_yn: vm.viewModel.search.bplc_use_yn,
                    user_nm:vm.viewModel.search.wrtr,
                    sdt:$("#sdt").val(),
                    edt:$("#edt").val(),
                    dept_sn: vm.viewModel.userInfo.dept_sn,
                    team_sn: vm.viewModel.userInfo.team_sn
                }

                const sdt = new Date($("#sdt").val());
                const edt = new Date($("#edt").val());

                if (sdt > edt) {
                    return alert('시작일이 종료일보다 클 수 없습니다.');
                }

                // if(vm.viewModel.userInfo.bplc_yn != "Y" && vm.viewModel.userInfo.bplc_sn == 0){ 
                //     send.bplc_sn = vm.viewModel.search.bplc_sn;
                // }else{
                //     send.bplc_sn = vm.viewModel.userInfo.bplc_sn;   
                // }


                Axios.post("/selectHseList.do", send)
                .then(function(response) {
                    vm.list = response.data.hseList;
                    vm.viewModel.pager.totalSize = response.data.totalCount;

                    Pager.props = Pager.methods.createPaging(vm.viewModel.pager, vm, "list");
                });
            },
            fnDelete:function(sn){
                let vm = this;
                if(confirm("삭제하시겠습니까?")){
                    Axios.post("/deleteHse.do",{inner_srng_sn : sn}).then(function(){
                        alert("삭제되었습니다.");
                        vm.fnInit();
                    })
                }else{
                    alert("삭제를 취소하였습니다.");
                }
            },
            fnGetChangeSelectList: function(data){
                let vm = this;
                if(data >= null || data != 0){
                    vm.viewModel.pager.pageNo = 1;
                    vm.fnList();
                }
            },
            fnreset:function(){
                this.bplc_nm = "";
                this.viewModel.search.bplc_sn = (this.viewModel.userInfo.bplc_yn == 'N' && (this.viewModel.userInfo.bplc_sn == 0 || this.viewModel.userInfo.bplc_use_yn == 'N')) ? "0" : this.viewModel.userInfo.bplc_sn;
                this.viewModel.search.bplc_use_yn = this.viewModel.userInfo.bplc_yn == 'N' ? 'Y' : 'A',
                this.viewModel.search.wrtr = "";
                $("#sdt").val("");
                $("#edt").val("");
            },
            fnhsePopup:function(i){
                let vm = this;
                vm.ishse = true;
                vm.$nextTick(function() {
                    if(vm.ishse) {
                        vm.$refs.hsepopup.fnInit(i);
                    }
                })
            },
            close:function(bool){
                this.ishse = bool;
                this.fnList(this.viewModel.pager.pageNo);
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

                    vm.viewModel.search.bplc_sn = "0";
                    if(vm.viewModel.userInfo.bplc_use_yn == 'Y' && vm.viewModel.search.bplc_use_yn == 'Y'){
                        vm.viewModel.search.bplc_sn = vm.viewModel.userInfo.bplc_sn == 0 ? "0" : vm.viewModel.userInfo.bplc_sn;
                    }
                });
            },
        }
    };
</script>