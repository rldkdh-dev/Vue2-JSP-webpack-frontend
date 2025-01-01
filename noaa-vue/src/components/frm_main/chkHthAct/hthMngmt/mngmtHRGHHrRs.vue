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
                            <option value=0>현장명 선택</option>
                            <option v-for="(item, i) in viewModel.bplcList" :key="i" :value="item.bplc_sn">{{ item.bplc_nm }}</option>
                        </select>
                    </div>

                    <input type="text" placeholder="성명을 입력하세요." title="성명 입력" v-model="viewModel.search.user_nm">
                </div>
            </div>
            <div class="btn-group">
                <button class="btn btn-default-line" @click="fnRefresh()"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-refresh"></use></svg>초기화</button>
                <button class="btn btn-default" @click="fnList()"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-search"></use></svg>검색</button>
            </div>
        </div>
    </div>
    <div class="contents">
        <div>
            <div class="table_top">
                <div class="total_count">총 <em>{{ viewModel.pager.totalSize }}</em>건</div>
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
            <!-- <div class="table_top box">
                <div class="input_group" v-if="viewModel.userInfo.user_roles == 'ROLE_001' && viewModel.userInfo.user_type_code == 'ACC_0000'">
                    <select title="주차" v-model="viewModel.data.mtg_week" class="w120" style="position:relative" id="mtg_week">
                        <option value="">주차 선택</option>
                        <option v-for="(i) in 5" :key="i" :value="i">
                            {{ i }}주차
                        </option>
                    </select>
                    <div class="btn-group">
                        <a href="" @click.prevent="fnRgstJobWeek" class="btn btn-white"><svg class="icon"><use xlink:href="/img/symbol-defs.svg#icon-task-add"></use></svg>주차 적용</a>
                    </div>
                </div>
            </div> -->
            <table class="table write">
                <caption>심혈관질환 주의군 관리</caption>
                <thead>
                    <tr>
                        <th scope="col" rowspan="2" class="w50">번호</th>
                        <th scope="col" rowspan="2" v-if="viewModel.userInfo.user_roles == 'ROLE_001'">현장명</th>
                        <th scope="col" rowspan="2">성명</th>
                        <th scope="col" rowspan="2">직종</th>
                        <th scope="col" rowspan="2">연령</th>
                        <th scope="col" rowspan="2">신장</th>
                        <th scope="col" rowspan="2">체중</th>
                        <th scope="col" rowspan="2">흡연 유무</th>
                        <th scope="col" rowspan="2">혈압약<br>복용 유무</th>
                        <th scope="col" rowspan="2">당뇨 유무</th>
                        <th scope="col" rowspan="2">심혈관 질환</th>
                        <th scope="col" rowspan="2">혈압</th>
                        <th scope="col" rowspan="2">위험군 분류</th>
                        <th scope="colgroup" colspan="2">계속 고용</th>
                        <th scope="col" rowspan="2" class="w250">건강관리 계획</th>
                        <th scope="col" rowspan="2">면담일지</th>
                        <th scope="col" rowspan="2">채용사유서</th>
                    </tr>
                    <tr>
                        <th scope="col" class="w50">Y/N</th>
                        <th scope="col" class="w200">계속 고용 사유</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, i) in viewModel.list" :key="i">
                        <td>{{(viewModel.pager.pageNo==1) ? viewModel.pager.totalSize-i : viewModel.pager.totalSize-((viewModel.pager.rowSize*(viewModel.pager.pageNo-1))+i)}}</td>
                        <td class="text-left" v-if="viewModel.userInfo.user_roles == 'ROLE_001'">{{item.bplc_nm}}</td>
                        <td>{{item.user_nm}}</td>
                        <td>{{item.ocpt_detail_nm}}</td>
                        <td>{{item.age}}</td>
                        <td>{{item.height}}</td>
                        <td>{{item.weight}}</td>
                        <td>{{item.smkng_yn}}</td>
                        <td>{{item.brssr_medicn_yn}}</td>
                        <td>{{item.glycsr_yn}}</td>
                        <td>{{item.crdvsc_yn}}</td>
                        <td class="ws-nw">{{item.systolic_brssr}} / {{item.diastolic_brssr}}</td>
                        <td>
                            <span v-if="item.age >= 60">고령위험군</span>
                            <span v-if="item.glycsr_yn == 'Y' && item.crdvsc_yn == 'Y'">건강위험군</span>
                        </td>
                        <td>
                            <input type="text" class="w25" v-if="mode==''" v-model="item.con_emplym_yn">
                            <div v-else>{{item.con_emplym_yn}}</div>
                        </td>
                        <td class="text-left">
                            <textarea v-if="mode==''" v-model="item.con_emplym_rsn"></textarea>
                            <div v-else>{{item.con_emplym_rsn}}</div>
                        </td>
                        <td class="text-left">
                            <textarea v-if="mode==''" v-model="item.health_mng_plan"></textarea>
                            <div v-else>{{item.health_mng_plan}}</div>
                        </td>
                        <td><button class="btn btn-small btn-white" @click="fnPopup(item.user_id, '', item.bplc_sn)" v-if="item.high_risk_yn == 'Y'">보기</button></td>
                        <td>
                            <button class="btn btn-small btn-blue" @click="fnPopup2(item.user_id, item.bplc_sn);" v-if="item.high_risk_yn == 'Y' && item.file_cnt == 0">등록</button>
                            <button class="btn btn-small btn-gray" @click="fnPopup2(item.user_id, item.bplc_sn);" v-if="item.high_risk_yn == 'Y' && item.file_cnt > 0">완료</button>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div class="table_footer">
                <pager :pass="viewModel.pager"></pager>
                <div class="btn-group" v-if="mode=='view'">
                    <button class="btn btn-purple" @click="fnChangeMode('')"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-post-add"></use></svg>편집</button>
                </div>
                <div class="btn-group" v-else>
                    <button class="btn btn-purple" @click="fnSave()"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-post-add"></use></svg>저장</button>
                    <button class="btn btn-gray" @click="fnChangeMode('view')"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-trash-can"></use></svg>취소</button>
                </div>
            </div>
        </div>
    </div>
    <itrvwPopup ref="itrvwPopup" v-if="itrvwPop==true"></itrvwPopup>
    <itrvwFilePopup ref="itrvwFilePopup" v-if="itrvwFilePop==true"></itrvwFilePopup>
    <excelform ref="excelform"></excelform>
</div>
</template>

<script>
    import "es6-promise/auto";
    import Vue from "vue";
    import Axios from "axios";
    import Pager from "../../../paging.vue";
    import itrvwPopup from "../../popup/itrvwPopup.vue";
    import itrvwFilePopup from "../../popup/itrvwFilePopup.vue";
    import excelform from "../../excelform.vue";

    export default {
        components: {
            'pager': Pager,
            'itrvwPopup': itrvwPopup,
            'itrvwFilePopup': itrvwFilePopup,
            'excelform': excelform,
        },
        data: function() {
            return {
                imgsrc:'',
                itrvwPop: false,
                itrvwFilePop: false,
                mode: 'view',
                viewModel:{
                    bplc_sn: 0,
                    search:{
                        bplc_sn: 0,
                        bplc_use_yn:''
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

                    vm.viewModel.search.bplc_sn = 0;
                    if(vm.viewModel.userInfo.bplc_use_yn == 'Y' && vm.viewModel.search.bplc_use_yn == 'Y'){
                        vm.viewModel.search.bplc_sn = vm.viewModel.userInfo.bplc_sn == 0 ? 0 : vm.viewModel.userInfo.bplc_sn;
                    }
                });
            },
            fnPopup: function(id, stat, sn) {
                let vm = this;
                vm.itrvwPop=true;
                vm.itrvwFilePop=false;
                
                vm.$nextTick(function() {
                    if(vm.itrvwPop) {
                        vm.$refs.itrvwPopup.fnInit(id, sn);
                    }
                })
            },
            fnPopup2: function(user_id, bplc_sn){
                let vm = this;

                vm.itrvwFilePop=true;
                vm.itrvwPop=false;
                vm.$nextTick(function() {
                    if(vm.itrvwFilePop) {
                        vm.$refs.itrvwFilePopup.fnInit(user_id, bplc_sn);
                    }
                });
            },
            fnRefresh: function(){
                let vm = this;
                vm.viewModel.search = {
                    bplc_use_yn : vm.viewModel.userInfo.bplc_yn == 'N' ? 'Y' : 'A',
                    bplc_sn: (vm.viewModel.userInfo.bplc_yn == 'N' && (vm.viewModel.userInfo.bplc_sn == 0 || vm.viewModel.userInfo.bplc_use_yn == 'N')) ? 0 : vm.viewModel.userInfo.bplc_sn
                }
            },
            // fnSearch: function() {
            //     this.viewModel.bplc_sn = this.viewModel.search.bplc_sn;
            //     this.fnList(1);
            // },
            fnInit:function(){
                let vm = this;
                vm.viewModel.userInfo = vm.$store.state.global.userInfo;
                vm.viewModel.bplc_sn = vm.viewModel.userInfo.bplc_sn;

                // 사용자 현장번호 세팅
                vm.viewModel.search.bplc_use_yn = vm.viewModel.userInfo.bplc_yn == 'N' ? 'Y' : 'A';
                vm.viewModel.search.bplc_sn = (vm.viewModel.userInfo.bplc_yn == 'N' && (vm.viewModel.userInfo.bplc_sn == 0 || vm.viewModel.userInfo.bplc_use_yn == 'N')) ? 0 : vm.viewModel.userInfo.bplc_sn;

                vm.fnList(1)
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
                Axios.post("/selectMngmtHRGHHrRsList.do", send).then(function(response) {
                    vm.viewModel.list = response.data.list;
                    vm.viewModel.pager.totalSize = response.data.totalCNT;

                    //페이징세팅
                    Pager.props = Pager.methods.createPaging(vm.viewModel.pager, vm, "list");
                    vm.mode = 'view';
                });
            },
            fnChangeCNTSelect: function(rowSize){
                let vm = this;
                if(rowSize != undefined || rowSize > 0){
                    vm.viewModel.pager.rowSize = rowSize
                    vm.fnList(1);
                }
            },
            fnChangeMode: function(mode) {
                if(this.viewModel.bplc_sn!=0) {
                    this.mode = mode;
                } else {
                    alert("현장을 선택하세요.")
                }
            },
            fnSave: function() {
                let vm = this;
                let data = {
                    list: vm.viewModel.list,
                    bplc_sn: vm.viewModel.bplc_sn,
                }
                console.log(data)
                Axios.post("/updateMngmtHRGHHrRs.do", data).then(function(rs) {
                    console.log(rs.data)
                    alert("저장되었습니다.");
                    vm.mode = 'view';
                })
            },
            fnExcelDownload: function () {
                let vm = this;
                // 자바 버전
                const header = ["현장명", "성명", "직종", "연령", "신장", "체중", "흡연\n유무", "혈압약\n복용\n유무", "당뇨\n유무", "실혈관질환", "혈압(마지막등록일)", "위험군부류","계속고용여부","계속고용사유","건강관리계획"];
                const mapperId = 'selectMngmtHRGHHrRsList';
                //검색조건
                let data = {
					header: header,
                    mapperId: mapperId,
                    bplc_sn: vm.viewModel.search.bplc_sn,
                    userNm: vm.viewModel.search.user_nm,
                    bplc_use_yn: vm.viewModel.search.bplc_use_yn,
                    dept_sn: vm.viewModel.userInfo.dept_sn,
                    team_sn: vm.viewModel.userInfo.team_sn,
                    // 파일명 
                    fileName: "주의군건강관리계획", // 스마트안전보건_년월일.xlsx
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