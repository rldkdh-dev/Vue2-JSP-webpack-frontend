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
                            <option selected value="0">현장명 선택</option>
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
                    <select v-model="actn_prgrs">
                        <option value="">진행상황 선택</option>
                        <option value="P">조치진행중</option>
                        <option value="PC">완료진행중</option>
                        <option value="C">완료</option>
                    </select>
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
                <caption>시정조치계획</caption>
                <thead>
                    <tr>
                        <th scope="col" class="w50">번호</th>
                        <th scope="col">내부심사일자</th>
                        <th scope="col" v-if="viewModel.userInfo.user_roles == 'ROLE_001'">현장명</th>
                        <th scope="col" colspan="2">구분항목</th>
                        <th scope="col">내부심사 부적합 사항</th>
                        <th scope="col">조치담당자</th>
                        <!-- <th scope="col">조치담당자직책</th> -->
                        <th scope="col">조치요구사항</th>
                        <th scope="col">조치예정일</th>
                        <th scope="col">작성자</th>
                        <th scope="col">진행상황</th>
                        <th scope="col">관리</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item ,i) in cmplanlist " :key="item">
                        <td>{{(viewModel.pager.pageNo==1) ? viewModel.pager.totalSize-i : viewModel.pager.totalSize-((viewModel.pager.rowSize*(viewModel.pager.pageNo-1))+i)}}</td>
                        <td>{{ item.srng_dt }}</td>
                        <td class="text-left" v-if="viewModel.userInfo.user_roles == 'ROLE_001'">{{ item.bplc_nm }}</td>
                        <td>{{ item.artcl_nm }}</td>
                        <td class="text-left">{{ item.artcl_detail_nm }}</td>
                        <td>{{ item.rslt_cn }}</td>
                        <td v-if="viewModel.userInfo.bplc_yn == 'N' && item.cmplanyn == ''"><a href="javascript:;" class="btn btn-small btn-blue" @click="fnuserpopup(item,1)">등록</a></td>
                        <td v-else-if="viewModel.userInfo.bplc_yn == 'N' && item.cmplanyn != ''" >{{ item.jbttl_nm + ' '+ item.actn_pic_nm }}</td>
                        <td v-else-if="viewModel.userInfo.bplc_yn == 'Y' && viewModel.userInfo.ocpt_se_cd == 'MNG' && item.cmplanyn == ''"><a href="javascript:;" class="btn btn-small btn-blue" @click="fnuserpopup(item,1)">등록</a></td>
                        <td v-else-if="viewModel.userInfo.bplc_yn == 'Y' && viewModel.userInfo.ocpt_se_cd == 'MNG' && item.cmplanyn != ''">{{ item.jbttl_nm + ' '+ item.actn_pic_nm }}</td>
                        <td v-else-if="viewModel.userInfo.bplc_yn == 'N' && item.cmplanyn == 'PC'">{{ item.jbttl_nm + ' '+ item.actn_pic_nm }}</td>
                        <td v-else>{{ item.jbttl_nm + ' '+ item.actn_pic_nm }}</td>
                        <!-- <td>{{ item.jbttl_nm }}</td> -->
                        <td>{{ item.actn_demand_mttr }}</td>
                        <td>{{ item.actn_prnmnt_dt }}</td>
                        <td>{{ item.user_nm }}</td>
                        <td v-if="item.cmplanyn == 'Y' && item.actn_pic != viewModel.userInfo.user_id "><span class="btn btn-small btn-approval"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-approval-ongoing"></use></svg>{{ item.actn_prgrs }}</span></td>
                        <td v-else-if="item.cmplanyn == 'Y' && item.actn_pic == viewModel.userInfo.user_id "><a href="javascript:;"><span class="btn btn-small btn-approval" @click="fnuserpopup(item,2)"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-approval-ongoing"></use></svg>{{ item.actn_prgrs }}</span></a></td>
                        <td v-else-if="item.cmplanyn == 'YC'"><span class="btn btn-small btn-approval"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-user-check"></use></svg>{{ item.actn_prgrs }}</span></td>
                        <td v-else-if="item.cmplanyn == 'PC' && viewModel.userInfo.bplc_yn == 'N' && viewModel.userInfo.ocpt_se_cd == 'MNG' && item.bplc_sn == viewModel.userInfo.bplc_sn"><a href="javascript:;"><span class="btn btn-small btn-approval" @click="fnuserpopup(item,3)"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-user-check"></use></svg>{{ item.actn_prgrs }}</span></a></td>
                        <td v-else-if="item.cmplanyn == 'PC' && viewModel.userInfo.bplc_yn == 'Y' && viewModel.userInfo.ocpt_se_cd == 'MNG' && item.bplc_sn == viewModel.userInfo.bplc_sn"><a href="javascript:;"><span class="btn btn-small btn-approval" @click="fnuserpopup(item,3)"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-user-check"></use></svg>{{ item.actn_prgrs }}</span></a></td>
                        <td v-else><span class="btn btn-small btn-approval complete"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-approval-ongoing"></use></svg>{{ item.actn_prgrs }}</span></td>
                        <td>
                            <a v-if="item.cmplanyn=='YC'" @click="fnuserpopup(item,4)" href="javascript:;" class="btn btn-icon"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-content-search"></use></svg></a>
                            <a v-if="item.cmplanyn=='PC' && item.actn_pic == viewModel.userInfo.user_id" @click="fnuserpopup(item,2)" href="javascript:;" class="btn btn-icon"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-edit-contents"></use></svg></a>
                        </td>
                    </tr>
                    <tr v-if="cmplanlist.length ==0"><td :colspan="viewModel.userInfo.user_roles == 'ROLE_001' ? '13' : '12'">게시물이 없습니다.</td></tr>
                </tbody>
            </table>
            <div class="table_footer">
                <pager :pass="viewModel.pager"></pager>
                <div class="btn-group"> 
                    <button class="btn btn-white" @click="fnExcelDownload"><i class="icon_excel"></i>엑셀다운로드</button>
                </div>
            </div>
        </div>
    </div>
    <userpopup ref="userpopup" v-if="isuser==true" :pass="{title:'시정 조치 및 예방조치',bplc_sn:bplc_sn}" @close="close"></userpopup>
    <excelform ref="excelform"></excelform>
</div>
</template>

<script>
    import "es6-promise/auto";
    import Vue from "vue";
    import Axios from "axios";
    import Pager from "../../../../common/vue/paging.vue";
    import userpopup from "./popup/cmPlanpopup.vue";
    import excelform from "../../excelform.vue";

    Vue.component('userpopup',userpopup);
    Vue.component('excelform',excelform);
    export default {
        components: {
            'pager': Pager,
        },
        data: function() {
            return {
                isuser:false,
                bplc_nm:"",
                bplc_sn:"",
                actn_prgrs:"",
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
                        bplc_sn:0,
                        bplc_use_yn:'',
                        wrtr:'',
                    },
                },
                cmplanlist:[],
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

                vm.viewModel.search.bplc_use_yn = vm.viewModel.userInfo.bplc_yn == 'N' ? 'Y' : 'A';
                vm.viewModel.search.bplc_sn = (vm.viewModel.userInfo.bplc_yn == 'N' && (vm.viewModel.userInfo.bplc_sn == 0 || vm.viewModel.userInfo.bplc_use_yn == 'N')) ? "0" : vm.viewModel.userInfo.bplc_sn;

                vm.fnList(vm.viewModel.pager.pageNo);
            },
            fnList:function(paramPageNo){
				let vm = this;
				
                vm.viewModel.pager.pageNo = paramPageNo == 0 ? 1 : paramPageNo;

                
                let send = {
                    pageNo:vm.viewModel.pager.pageNo,
                    pageSize:vm.viewModel.pager.rowSize,
                    bplc_nm:vm.bplc_nm,
                    bplc_yn:vm.viewModel.userInfo.bplc_yn,
                    actn_prgrs:vm.actn_prgrs,
                    bplc_sn: vm.viewModel.search.bplc_sn,
                    reg_id:vm.viewModel.search.wrtr,
                    bplc_use_yn: vm.viewModel.search.bplc_use_yn,
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

                Axios.post("/selectCmplanList.do", send)
                .then(function(response) {
                    vm.cmplanlist = response.data.hseList;
                    for(var i=0; i<vm.cmplanlist.length; i++){
                        vm.cmplanlist[i].cmplanyn = '';
                        if(vm.cmplanlist[i].actn_prgrs == 'P'){
                            vm.cmplanlist[i].actn_prgrs = '조치 진행 중'
                            vm.cmplanlist[i].cmplanyn = 'Y'
                        }else if(vm.cmplanlist[i].actn_prgrs == 'C'){
                            vm.cmplanlist[i].actn_prgrs = '조치 완료'
                            vm.cmplanlist[i].cmplanyn = 'YC'
                        }else if(vm.cmplanlist[i].actn_prgrs == 'PC'){
                            vm.cmplanlist[i].actn_prgrs = '완료 진행중'
                            vm.cmplanlist[i].cmplanyn = 'PC'
                        }else{
                            vm.cmplanlist[i].actn_prgrs = '조치 진행 중'
                        }
                    }
                    vm.viewModel.pager.totalSize = response.data.totalCount;
                    Pager.props = Pager.methods.createPaging(vm.viewModel.pager, vm, "list");
                });
            },
            fnGetChangeSelectList: function(data){
                let vm = this;
                if(data >= null || data != 0){
                    vm.viewModel.pager.pageNo = 1;
                    vm.fnInit();
                }
            },
            fnuserpopup:function(item,n){
                let vm = this;
                vm.isuser = true;
                vm.bplc_sn = item.bplc_sn;
                vm.$nextTick(function() {
                    if(vm.isuser){
                        vm.$refs.userpopup.fnInit(item,n);
                    }                
                })
            },
            close:function(bool){
                this.isuser = bool;
                this.fnList(this.viewModel.pager.pageNo);
            },
            fnreset:function(){
                this.bplc_nm = "";
                this.actn_prgrs = "";
                this.viewModel.search.bplc_sn = (this.viewModel.userInfo.bplc_yn == 'N' && (this.viewModel.userInfo.bplc_sn == 0 || this.viewModel.userInfo.bplc_use_yn == 'N')) ? "0" : this.viewModel.userInfo.bplc_sn;
                this.viewModel.search.bplc_use_yn = this.viewModel.userInfo.bplc_yn == 'N' ? 'Y' : 'A',
                this.viewModel.search.wrtr = "";
                $("#sdt").val("");
                $("#edt").val("");
            },
            fnBplcList: function() {
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
            fnExcelDownload: function(){
                let vm = this;
                    // 자바 버전
                    const header = ['내부심사일자','현장명','항목1','항목2','내부심사 부적합 사항','조치담당자','조치부서','조치요구사항','조치예정일','작성자','진행상황'];
                    const mapperId = 'selectExcelcmPlanList';
                    //검색조건
                    let data = {
                        header:header,
                        mapperId:mapperId,
                        bplc_nm:vm.bplc_nm,
                        bplc_yn:vm.viewModel.userInfo.bplc_yn,
                        actn_prgrs:vm.actn_prgrs,
                        sdt:$("#sdt").val(),
                        edt:$("#edt").val(),
                        reg_id:vm.viewModel.search.wrtr,
                        bplc_use_yn:vm.viewModel.search.bplc_use_yn,
                        bplc_sn:vm.viewModel.search.bplc_sn,
                        // 파일명 
                        fileName:"시정조치계획", // 스마트안전보건_년월일.xlsx
                        dept_sn: vm.viewModel.userInfo.dept_sn,
                        team_sn: vm.viewModel.userInfo.team_sn
                        // 해당 화면 필요한 조건 파라미터 추가 부분
                    };
                    // if(vm.viewModel.userInfo.bplc_yn != "Y" && vm.viewModel.userInfo.bplc_sn == 0){ 
                    //     data.bplc_sn = vm.viewModel.search.bplc_sn;
                    // }else{
                    //     data.bplc_sn = vm.viewModel.userInfo.bplc_sn;   
                    // }
                    if(confirm("엑셀 출력 하시겠습니까?")){
                        this.$nextTick(function() {
                            vm.$refs.excelform.fnInit(data);
                        })
                    }
            },
        }
    };
</script>