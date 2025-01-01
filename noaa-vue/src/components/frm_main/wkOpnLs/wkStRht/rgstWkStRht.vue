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
                    <input type="text" placeholder="작업중지요청자 입력하세요." title="작업중지요청자 입력" v-model="viewModel.search.rqstr_nm">
                    <select title="위험명" v-model="viewModel.search.risk_se">
                        <option value="">위험명 선택</option>
                        <option v-for="(item, i) in viewModel.riskNmList" :key="i" :value="item.CODE">{{ item.CODE_NM }}</option>
                    </select>
                    <div class="datepicker_box">
                        <input type="text" class="datepicker" id="sdt" placeholder="중지 조회시작일" title="중지 조회시작일" readonly ref="sdt">
                    </div>
                    <span>~</span>
                    <div class="datepicker_box">
                        <input type="text" class="datepicker" id="edt" placeholder="중지 조회종료일" title="중지 조회종료일" readonly ref="edt">
                    </div>
                </div>
                <div class="row">
                    <input type="text" placeholder="조치자 입력하세요." title="조치자 입력" v-model="viewModel.search.maner_nm">
                    <div class="datepicker_box">
                        <input type="text" class="datepicker" id="sdt2" placeholder="조치 조회시작일" title="조치 조회시작일" readonly ref="sdt2">
                    </div>
                    <span>~</span>
                    <div class="datepicker_box">
                        <input type="text" class="datepicker" id="edt2" placeholder="조치 조회종료일" title="조치 조회종료일" readonly ref="edt2">
                    </div>
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
            <div class="table_top">
                <div class="total_count">총 <em>{{ viewModel.pager.totalSize }}</em>건</div>
                <!-- <div class="icon_box">
                    <button class="btn btn-white"><i class="icon_pdf"></i></button>
                    <button class="btn btn-white"><i class="icon_word"></i></button>
                    <button class="btn btn-white"><i class="icon_ppt"></i></button>
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
                <caption>작업중지권 등록</caption>
                <thead>
                    <tr>
                        <th scope="col" class="w50">번호</th>
                        <th scope="col" v-if="viewModel.userInfo.user_roles == 'ROLE_001'">현장</th>
                        <th scope="col">작업중지 요청자</th>
                        <th scope="col">위험명</th>
                        <th scope="col">중지일시</th>
                        <th scope="col">중지사진</th>
                        <th scope="col">조치자</th>
                        <th scope="col">조치일시</th>
                        <th scope="col">조치</th>
                        <th scope="col">조치사진</th>
                        <th scope="col">관리</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, i) in viewModel.list" :key="i">
                        <td>{{(viewModel.pager.pageNo==1) ? viewModel.pager.totalSize-i : viewModel.pager.totalSize-((viewModel.pager.rowSize*(viewModel.pager.pageNo-1))+i)}}</td>
                        <td class="text-left" v-if="viewModel.userInfo.user_roles == 'ROLE_001'">{{ item.bplc_nm }}</td>
                        <td>{{ item.rqstr_nm }}</td>
                        <td class="text-left"><router-link :to="'/detail/'+item.stpge_sn" class="btn-link">{{ item.risk_se_nm }}</router-link></td>
                        <td>{{ item.stpge_dt }}</td>
                        <td>
                            <img :src="item.dmnd_file_path" style="width: 64px; height: 44px;" onerror="this.src='../../img/m_no-img.png'">
                        </td>
                        <td>{{ item.maner_nm }}</td>
                        <td>{{ item.actn_dt }}</td>
                        <td>
                            <button @click="fnMttrPopup(item.stpge_sn)" :class="item.actn_yn == 3 ? 'btn btn-small btn-gray' : item.actn_yn == 2 ? 'btn btn-small btn-white' : 'btn btn-small btn-blue'" v-if="viewModel.userInfo.bplc_yn == 'N' || (viewModel.userInfo.bplc_yn == 'Y' && viewModel.userInfo.ocpt_se_cd == 'MNG')">{{ item.actn_yn_nm }}</button>
                            <span v-else>{{ item.actn_yn_nm }}</span>
                        </td>
                        <td>
                            <img :src="item.maner_file_path" style="width: 64px; height: 44px;" onerror="this.src='../../img/m_no-img.png'">
                        </td>
                        <td>
                            <router-link :to="'/detail/'+item.stpge_sn" class="btn btn-icon"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-content-search"></use></svg></router-link>
                            <template v-if="item.reg_id == viewModel.userInfo.user_id || (viewModel.userInfo.ocpt_detail_cd == 'MNG-01' && viewModel.userInfo.bplc_yn == 'Y')">
                                <router-link :to="'/write/'+item.stpge_sn" class="btn btn-icon"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-edit-contents"></use></svg></router-link>
                                <button class="btn btn-icon" @click="fnDelete(item.stpge_sn)"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-delete-sweep"></use></svg></button>
                            </template>
                        </td>
                    </tr>
                    <tr v-if="viewModel.list.length == 0"><td :colspan="viewModel.userInfo.user_roles == 'ROLE_001' ? '11' : '10'">게시물이 없습니다.</td></tr>
                </tbody>
            </table>
            <div class="table_footer">
                <pager :pass="viewModel.pager"></pager>
                <div class="btn-group"> 
                    <router-link to="/write" class="btn btn-purple"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-post-add"></use></svg>등록</router-link>
                </div>
            </div>
        </div>
    </div>
    <rgstWkStRhtPopup ref="rgstWkStRhtPopup" v-if="mttrPop==true"></rgstWkStRhtPopup>
    <excelform ref="excelform"></excelform>
</div>
</template>

<script>
    import "es6-promise/auto";
    import Vue from "vue";
    import Axios from "axios";
    import Pager from "../../../../common/vue/paging.vue";
    import Common from '../../../../common/js/common.js';
    import Message, {messageUtil} from "../../../../common/js/message";
    import rgstWkStRhtPopup from "./popup/rgstWkStRhtPopup.vue";
    import excelform from "../../excelform.vue";
    
    export default {
        components: {
            'pager': Pager,
            'rgstWkStRhtPopup': rgstWkStRhtPopup,
            'excelform': excelform,
        },
        data: function() {
            return {
                mttrPop:false,
                viewModel:{
                    search:{
                        bplc_use_yn:'',
                        bplc_sn:'',
                        risk_se:'',
                    },
                    userInfo:{},
                    list: [],
                    searchBplcList: [],
                    riskNmList: [],
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
             //초기화
             fnRefresh: function(){
                let vm = this;
                vm.viewModel.search = {
                    bplc_use_yn : vm.viewModel.userInfo.bplc_yn == 'N' ? 'Y' : 'A',
                    bplc_sn: (vm.viewModel.userInfo.bplc_yn == 'N' && (vm.viewModel.userInfo.bplc_sn == 0 || vm.viewModel.userInfo.bplc_use_yn == 'N')) ? '' : vm.viewModel.userInfo.bplc_sn,
                    risk_se: ''
                };
                vm.$refs.sdt.value = '';
                vm.$refs.edt.value = '';
                vm.$refs.sdt2.value = '';
                vm.$refs.edt2.value = '';
            },
            fnInit: function(){
                let vm = this;
                vm.viewModel.userInfo = vm.$store.state.global.userInfo;
                vm.viewModel.search.bplc_use_yn = vm.viewModel.userInfo.bplc_yn == 'N' ? 'Y' : 'A';
                vm.viewModel.search.bplc_sn = (vm.viewModel.userInfo.bplc_yn == 'N' && (vm.viewModel.userInfo.bplc_sn == 0 || vm.viewModel.userInfo.bplc_use_yn == 'N')) ? '' : vm.viewModel.userInfo.bplc_sn;

                vm.fnList(1);
            },
            //페이징 처리
            fnChangeCNTSelect: function(rowSize){
                let vm = this;
                if(rowSize != undefined || rowSize > 0){
                    vm.viewModel.pager.rowSize = rowSize
                    vm.fnList(1);
                }
            },
            fnList:function(paramPageNo){
				let vm = this;
                vm.viewModel.pager.pageNo = paramPageNo == undefined ? vm.viewModel.pager.pageNo : paramPageNo;

                let send = {
                    pageYn:'Y',
                    pageNo: vm.viewModel.pager.pageNo,
                    pageSize: vm.viewModel.pager.rowSize,
                    user_id: vm.viewModel.userInfo.user_id,
                    bplc_yn: vm.viewModel.userInfo.bplc_yn,
                    u_bplc_sn: vm.viewModel.userInfo.bplc_sn,
                    bplc_use_yn: vm.viewModel.search.bplc_use_yn,
                    bplc_sn: vm.viewModel.search.bplc_sn,
                    rqstr_nm: vm.viewModel.search.rqstr_nm,
                    maner_nm: vm.viewModel.search.maner_nm,
                    sdt: vm.$refs.sdt.value,    //중지시작일
                    edt: vm.$refs.edt.value,    //중지종료일
                    sdt2: vm.$refs.sdt2.value,    //조치시작일
                    edt2: vm.$refs.edt2.value,    //조치종료일
                    risk_se: vm.viewModel.search.risk_se,
                    dept_sn: vm.viewModel.userInfo.dept_sn,
                    team_sn: vm.viewModel.userInfo.team_sn,
                }

                Axios.post("/selectWkStRhtList.do", send)
                .then(function(response) {
                    vm.viewModel.list = response.data.list;
                    vm.viewModel.pager.totalSize = response.data.totalCNT;
                    
                    //이미지 세팅
                    if(vm.viewModel.list.length>0) {
                        for(let i=0; i<vm.viewModel.list.length; i++) {
                            if(vm.viewModel.list[i].dmnd_file_path.charAt()!='/') {
                                vm.viewModel.list[i].dmnd_file_path = vm.viewModel.list[i].dmnd_file_path.substring(2);
                            }
                            if(vm.viewModel.list[i].maner_file_path.charAt()!='/') {
                                vm.viewModel.list[i].maner_file_path = vm.viewModel.list[i].maner_file_path.substring(2);
                            }
                        }
                    }
                    
                    //페이징세팅
                    Pager.props = Pager.methods.createPaging(vm.viewModel.pager, vm, "list");
                    
                    //조회조건 현장명
                    // vm.viewModel.searchBplcList = response.data.searchBplcList;

                    vm.viewModel.riskNmList = response.data.riskNmList;
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
                    vm.viewModel.searchBplcList = rs.data.list;

                    vm.viewModel.search.bplc_sn = '';
                    if(vm.viewModel.userInfo.bplc_use_yn == 'Y' && vm.viewModel.search.bplc_use_yn == 'Y'){
                        vm.viewModel.search.bplc_sn = vm.viewModel.userInfo.bplc_sn == 0 ? '' : vm.viewModel.userInfo.bplc_sn;
                    }
                });
            },
            fnDelete: function(sn){
                let vm = this;
                let send = {
                    stpge_sn: sn
                }

                if(confirm(Message.DELETE_CONFIRM)){
                    Axios.post("/deleteWkStRht.do", send)
                    .then(function(response) {
                        if(response.data == 1){
                            alert("삭제가 완료되었습니다.");
                            vm.fnList(vm.viewModel.pager.pageNo);
                        }
                    }).catch(function(ex) {
                        alert(Message.ERROR);
                    });
                }
            },
            fnMttrPopup: function(sn) {
                let vm = this;
                vm.mttrPop=true;
                vm.$nextTick(function() {
                    if(vm.mttrPop) {
                        vm.$refs.rgstWkStRhtPopup.fnInit(sn);
                    }
                })
            },
            fnExcelDownload: function () {
                let vm = this;
                // 자바 버전
                const header = ['현장명','작업중지요청자','위험명','중지일시','중지요청내용','조치','조치자','조치일시','조치내용'];
                const mapperId = 'selectWkStRhtExcelList';
                //검색조건
                let data = {
                    header: header,
                    mapperId: mapperId,
                    bplc_use_yn: vm.viewModel.search.bplc_use_yn,
                    bplc_sn: vm.viewModel.search.bplc_sn,
                    rqstr_nm: vm.viewModel.search.rqstr_nm,
                    maner_nm: vm.viewModel.search.maner_nm,
                    sdt: vm.$refs.sdt.value,    //중지시작일
                    edt: vm.$refs.edt.value,    //중지종료일
                    sdt2: vm.$refs.sdt2.value,    //조치시작일
                    edt2: vm.$refs.edt2.value,    //조치종료일
                    risk_se: vm.viewModel.search.risk_se,
                    // 파일명 
                    fileName: "작업중지권", // 스마트안전보건_년월일.xlsx
                    // 해당 화면 필요한 조건 파라미터 추가 부분
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