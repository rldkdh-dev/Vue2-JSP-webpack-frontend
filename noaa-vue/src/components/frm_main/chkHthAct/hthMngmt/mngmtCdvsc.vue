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
                    <input type="text" placeholder="성명을 입력하세요." title="성명 입력" v-model="viewModel.search.user_nm">
                </div>
            </div>
            <div class="btn-group">
                <button class="btn btn-default-line" @click="fnRefresh()"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-refresh"></use></svg>초기화</button>
                <button class="btn btn-default" @click="fnList(1)"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-search"></use></svg>검색</button>
            </div>
        </div>
    </div>
    <div class="contents">
        <div>
            <!-- style="align-items: flex-end; justify-content: flex-start;" -->
            <div class="table_top">
                <div class="total_count">총 <em>{{ viewModel.pager.totalSize }}</em>건<em v-if="viewModel.highCnt == 0" style="color: #555;">※위험군이 존재하지 않습니다.</em></div>
                <!-- <div class="icon_box">
                    <button class="btn btn-white"><i class="icon_pdf"></i></button>
                    <button class="btn btn-white"><i class="icon_excel"></i></button>
                </div> -->
                <button class="btn btn-white" @click="fnExcelDownload"><i class="icon_excel"></i>엑셀다운로드</button>
                <select title="데이터 표출 개수" v-model="viewModel.pager.rowSize" @change="fnChangeCNTSelect(viewModel.pager.rowSize);">
                    <option value="10">10개씩 보기</option>
                    <option value="30">30개씩 보기</option>
                    <option value="50">50개씩 보기</option>
                    <option value="100">100개씩 보기</option>
                </select>
            </div>
            <table class="table">
                <caption>건강검진 관리</caption>
                <thead>
                    <tr>
                        <th scope="col" class="w50">번호</th>
                        <th scope="col" v-if="viewModel.userInfo.user_roles == 'ROLE_001'">현장명</th>
                        <th scope="col">성명</th>
                        <th scope="col">직종</th>
                        <th scope="col">연령</th>
                        <th scope="col">입사일</th>
                        <th scope="col">혈압</th>
                        <th scope="col">위험군 분류</th>
                        <th scope="col">혈압측정</th>
                        <!-- <th scope="col">면담일지</th>
                        <th scope="col">채용사유서</th> -->
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, i) in viewModel.list" :key="i">
                        <td>{{(viewModel.pager.pageNo==1) ? viewModel.pager.totalSize-i : viewModel.pager.totalSize-((viewModel.pager.rowSize*(viewModel.pager.pageNo-1))+i)}}</td>
                        <td class="text-left" v-if="viewModel.userInfo.user_roles == 'ROLE_001'">
                            {{ item.bplc_nm }}
                        </td>
                        <td>{{item.user_nm}}</td>
                        <td>{{item.ocpt_detail_nm}}</td>
                        <td>{{item.age}}</td>
                        <td>{{item.jncmp_day}}</td>
                        <td class="ws-nw">
                            {{item.systolic_brssr}} / {{item.diastolic_brssr}} <span v-if="item.msrmt_day != null && item.msrmt_day != undefined">( {{item.msrmt_day|yyyyMMdd}} )</span>
                        </td>
                        <td>
                            <span v-if="item.age >= 60">고령위험군</span>
                            <span v-if="item.glycsr_yn == 'Y' && item.crdvsc_yn == 'Y'">건강위험군</span>
                        </td>
                        <td><button class="btn btn-small btn-white" @click="fnPopup(item.user_id, 'msrmt', item.bplc_sn)">보기</button></td>
                        <!-- <td><button class="btn btn-small btn-white" @click="fnPopup(item.user_id, '', item.bplc_sn)" v-if="item.high_risk_yn == 'Y'">보기</button></td>
                        <td>
                            <button class="btn btn-small btn-blue" @click="fnPopup2(item.user_id, item.bplc_sn);" v-if="item.high_risk_yn == 'Y' && item.file_cnt == 0">등록</button>
                            <button class="btn btn-small btn-gray" @click="fnPopup2(item.user_id, item.bplc_sn);" v-if="item.high_risk_yn == 'Y' && item.file_cnt > 0">완료</button>
                        </td> -->
                    </tr>
                </tbody>
            </table>
            <div class="table_footer">
                <pager :pass="viewModel.pager"></pager>
            </div>
        </div>
    </div>
    <msrmtPopup ref="msrmtPopup" v-if="msrmtPop==true"></msrmtPopup>
    <itrvwPopup ref="itrvwPopup" v-if="itrvwPop==true"></itrvwPopup>
    <itrvwFilePopup ref="itrvwFilePopup" v-if="itrvwFilePop==true"></itrvwFilePopup>
    <excelform ref="excelform"></excelform>
</div>
</template>

<script>
    import "es6-promise/auto";
    import Vue from "vue";
    import Axios from "axios";
    import Pager from "../../../../common/vue/paging.vue";
    import msrmtPopup from "../../popup/msrmtPopup.vue";
    import itrvwPopup from "../../popup/itrvwPopup.vue";
    import itrvwFilePopup from "../../popup/itrvwFilePopup.vue";
    import excelform from "../../excelform.vue";
    
    export default {
        components: {
            'pager': Pager,
            'msrmtPopup': msrmtPopup,
            'excelform': excelform,
            'itrvwPopup': itrvwPopup,
            'itrvwFilePopup': itrvwFilePopup,
        },
        data: function() {
            return {
                imgsrc:'',
                msrmtPop: false,
                itrvwPop: false,
                itrvwFilePop: false,
                viewModel:{
                    highCnt:0,
                    search:{
                        bplc_sn: 0,
                        bplc_use_yn: ''
                    },
                    userInfo:{},
                    list: [],
                    bplcList: [],
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

            vm.$router.afterEach(function(to, from){
                vm.fnList(vm.viewModel.pager.pageNo);
            })
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
            fnRefresh: function(){
                let vm = this;
                vm.viewModel.search = {
                    bplc_use_yn : vm.viewModel.userInfo.bplc_yn == 'N' ? 'Y' : 'A',
                    bplc_sn: (vm.viewModel.userInfo.bplc_yn == 'N' && (vm.viewModel.userInfo.bplc_sn == 0 || vm.viewModel.userInfo.bplc_use_yn == 'N')) ? '0' : vm.viewModel.userInfo.bplc_sn
                }
            },
            fnInit:function(){
                let vm = this;
                vm.viewModel.userInfo = vm.$store.state.global.userInfo;
                vm.viewModel.search.bplc_use_yn = vm.viewModel.userInfo.bplc_yn == 'N' ? 'Y' : 'A';
                vm.viewModel.search.bplc_sn = (vm.viewModel.userInfo.bplc_yn == 'N' && (vm.viewModel.userInfo.bplc_sn == 0 || vm.viewModel.userInfo.bplc_use_yn == 'N')) ? '0' : vm.viewModel.userInfo.bplc_sn;

                vm.fnList(1);
            },
            fnList:function(paramPageNo){
				let vm = this;
                
                vm.viewModel.pager.pageNo = paramPageNo == undefined ? vm.viewModel.pager.pageNo : paramPageNo;

                let send = {
                    pageNo: vm.viewModel.pager.pageNo,
                    pageSize: vm.viewModel.pager.rowSize,
                    bplc_sn: vm.viewModel.search.bplc_sn,
                    bplc_use_yn: vm.viewModel.search.bplc_use_yn,
                    userNm: vm.viewModel.search.user_nm,
                    dept_sn: vm.viewModel.userInfo.dept_sn,
                    team_sn: vm.viewModel.userInfo.team_sn,
                }
                Axios.post("/selectMngmtCdvscList.do", send).then(function(response) {
                    vm.viewModel.list = response.data.list;
                    vm.viewModel.pager.totalSize = response.data.totalCNT;
                    vm.viewModel.highCnt = response.data.highCnt;

                    //페이징세팅
                    Pager.props = Pager.methods.createPaging(vm.viewModel.pager, vm, "list");
                });
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
            fnChangeCNTSelect: function(rowSize){
                let vm = this;
                if(rowSize != undefined || rowSize > 0){
                    vm.viewModel.pager.rowSize = rowSize
                    vm.fnList(1);
                }
            },
            fnPopup: function(id, stat, sn) {
                let vm = this;
                vm.msrmtPop=false;
                vm.itrvwPop=false;
                vm.itrvwFilePop=false;
                if(stat != '') {
                    vm.msrmtPop=true;
                    vm.$nextTick(function() {
                        if(vm.msrmtPop) {
                            vm.$refs.msrmtPopup.fnInit(id, sn);
                        }
                    })
                } else {
                    vm.itrvwPop=true;
                    vm.$nextTick(function() {
                        if(vm.itrvwPop) {
                            vm.$refs.itrvwPopup.fnInit(id, sn);
                        }
                    })
                }
            },
            fnPopup2: function(user_id, bplc_sn){
                let vm = this;

                vm.itrvwFilePop=true;
                vm.msrmtPop=false;
                vm.itrvwPop=false;
                vm.$nextTick(function() {
                    if(vm.itrvwFilePop) {
                        vm.$refs.itrvwFilePopup.fnInit(user_id, bplc_sn);
                    }
                });
            },
            fnExcelDownload: function () {
                let vm = this;
                // 자바 버전
                const header = ["성명", "현장명", "전화번호", "주소", "직종", "입사일", "연령", "위험군분류", "혈액형", "신장/체중", "담배", "음주","혈압(마지막등록일)", "혈압약", "질병"];
                const mapperId = 'selectMngmtCdvscList2';
                //검색조건
                let data = {
                    header: header,
                    mapperId: mapperId,
                    bplc_sn: vm.viewModel.search.bplc_sn,
                    user_nm: vm.viewModel.search.user_nm,
                    // 파일명 
                    fileName: "건강검진관리", // 스마트안전보건_년월일.xlsx
                    bplc_use_yn: vm.viewModel.search.bplc_use_yn,
                    dept_sn: vm.viewModel.userInfo.dept_sn,
                    team_sn: vm.viewModel.userInfo.team_sn,
                };
                if (confirm("엑셀 출력 하시겠습니까?")) {
                    this.$nextTick(function () {
                        vm.$refs.excelform.fnInit(data);
                    })
                }
            },
        }
    };
</script>