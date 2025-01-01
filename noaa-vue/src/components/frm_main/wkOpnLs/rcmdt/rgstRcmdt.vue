<template>
    <div>
        <div class="search_area">
            <button class="btn_toggle_search">검색</button>
            <div>
                <div class="search_container">
                    <div class="row">
                        <select title="분류"  v-model="viewModel.search.clsf_cd">
                            <option value="default">분류 선택</option>
                            <option v-for="(item, i) in viewModel.codeList" :key="i" :value="item.CODE">{{ item.CODE_NM }}</option>
                        </select> 
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
                    <button class="btn btn-white" @click="fnExcelDownload"><i class="icon_excel"></i>엑셀다운로드</button>
                    <select title="데이터 표출 개수" v-model="viewModel.pager.rowSize" @change="fnChangeCNTSelect(viewModel.pager.rowSize);">
                        <option value="10">10개씩 보기</option>
                        <option value="30">30개씩 보기</option>
                        <option value="50">50개씩 보기</option>
                        <option value="100">100개씩 보기</option>
                    </select>
                </div>
                <table class="table">
                    <caption>건의사항 관리</caption>
                    <thead>
                        <tr>
                            <th scope="col" class="w50">번호</th>
                            <th scope="col" v-if="viewModel.userInfo.user_roles == 'ROLE_001'">현장</th>
                            <th scope="col">분류</th>
                            <th scope="col">등록자</th>
                            <th scope="col">등록일자</th>
                            <th scope="col">내용</th>
                            <th scope="col">사진</th>
                            <th scope="col">조치</th>
                            <th scope="col">담당자</th>
                            <th scope="col">조치일자</th>
                            <th scope="col">관리</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, i) in viewModel.list" :key="i">
                            <td>{{(viewModel.pager.pageNo==1) ? viewModel.pager.totalSize-i : viewModel.pager.totalSize-((viewModel.pager.rowSize*(viewModel.pager.pageNo-1))+i)}}</td>
                            <td class="text-left" v-if="viewModel.userInfo.user_roles == 'ROLE_001'">{{ item.bplc_nm }}</td>
                            <td>{{ item.clsf_cd }}</td>
                            <td>{{ item.reg_nm }}</td>
                            <td>{{ item.reg_dt }}</td>
                            <td class="text-left"><router-link class="btn-link" :to="'/detail/' + item.sugest_sn">{{ item.sugest_cn }}</router-link></td>
                            <td v-if="item.strg_file_nm != null && item.strg_file_nm != '' && item.strg_file_nm != undefined"><img :src="item.strg_file_nm" style="width: 64px; height: 44px;" onerror="this.src='../../../img/m_no-img.png'"></td>
                            <td v-else></td>
                            <td v-if="item.prgrs_stts == '2' && (item.opinion != null && item.opinion != '' && item.opinion != undefined)">
                                <button @click="fnMttrPopup(item.sugest_sn)" class="btn btn-small btn-red" >
                                    완료
                                </button>
                            </td>
                            <td v-else-if="item.prgrs_stts == '2'">
                                <button @click="fnMttrPopup(item.sugest_sn)" class="btn btn-small btn-gray" >
                                    완료
                                </button>
                            </td>
                            <td v-else-if="item.prgrs_stts == '1'">
                                <button @click="fnMttrPopup(item.sugest_sn)" class="btn btn-small btn-blue" >
                                    조치
                                </button>
                            </td>
                            <td v-else-if="item.prgrs_stts == '3'">
                                <button @click="fnMttrPopup(item.sugest_sn)" class="btn btn-small btn-white" >
                                    이관
                                </button>
                            </td>
                            <td v-else>
                                <button @click="fnMttrPopup(item.sugest_sn)" class="btn btn-small btn-white" >
                                    보류
                                </button>
                            </td>
                            <td>{{ item.maner }}</td>
                            
                            <td>{{ item.actn_dt }}</td>
                            <td>
                                <router-link :to="'/detail/'+item.sugest_sn" class="btn btn-icon"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-content-search"></use></svg></router-link>
                                <template v-if="item.reg_id == viewModel.userInfo.user_id">
                                    <router-link :to="'/write/'+item.sugest_sn" class="btn btn-icon"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-edit-contents"></use></svg></router-link>
                                    <button class="btn btn-icon" @click="fnDelete(item.sugest_sn)"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-delete-sweep"></use></svg></button>
                                </template>
                            </td>
                            <!-- <td><img :src="item.maner_file_path" style="width: 100px;"></td> -->
                        </tr>
                        <tr v-if="viewModel.list.length == 0"><td :colspan="viewModel.userInfo.user_roles == 'ROLE_001' ? '11' : '10'">게시물이 없습니다.</td></tr>
                    </tbody>
                </table>
                <div class="table_footer">
                    <pager :pass="viewModel.pager"></pager>
                    <div class="btn-group"> 
                        <a href="#/write" class="btn btn-purple"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-post-add"></use></svg>등록</a>
                    </div>
                </div>
            </div>
        </div>
        <rgstRcmdtPopup ref="rgstRcmdtPopup" v-if="mttrPop==true"></rgstRcmdtPopup>
        <excelform ref="excelform"></excelform>
    </div>
    </template>
    
    <script>
        import "es6-promise/auto";
        import Vue from "vue";
        import Axios from "axios";
        import Pager from "../../../../common/vue/paging.vue";
        //import Common from '../../../common.js';
        import Message, {messageUtil} from "../../../../common/js/message";
        import rgstRcmdtPopup from "./popup/rgstRcmdtPopup.vue";
        import excelform from "../../excelform.vue";

        export default {
            components: {
                'pager': Pager,
                'rgstRcmdtPopup': rgstRcmdtPopup,
                'excelform': excelform,
            },
            data: function() {
                return {
                    mttrPop:false,
                    viewModel:{
                        codeList:[],
                        file_path:'',
                        search:{
                            bplc_use_yn:'',
                            bplc_sn:'',
                            clsf_cd: 'default',
                        },
                        userInfo:{},
                        list: [],
                        searchBplcList: [],
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
                fnDetail:function(sn){
                    let vm = this;
                    vm.$router.push('/detail/' + sn)  
                }, 
                //초기화
                fnRefresh: function(){
                    let vm = this;
                    vm.viewModel.search = {
                        bplc_use_yn : vm.viewModel.userInfo.bplc_yn == 'N' ? 'Y' : 'A',
                        bplc_sn: (vm.viewModel.userInfo.bplc_yn == 'N' && (vm.viewModel.userInfo.bplc_sn == 0 || vm.viewModel.userInfo.bplc_use_yn == 'N')) ? '' : vm.viewModel.userInfo.bplc_sn,
                        clsf_cd:'default'
                    }
                },
                fnInit: function(){
                    let vm = this;
                    vm.viewModel.userInfo = vm.$store.state.global.userInfo;
                    vm.viewModel.search.bplc_use_yn = vm.viewModel.userInfo.bplc_yn == 'N' ? 'Y' : 'A';
                    vm.viewModel.search.bplc_sn = (vm.viewModel.userInfo.bplc_yn == 'N' && (vm.viewModel.userInfo.bplc_sn == 0 || vm.viewModel.userInfo.bplc_use_yn == 'N')) ? '' : vm.viewModel.userInfo.bplc_sn;

                    vm.fnList(0);
                    vm.fnWriteInfo();
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
                fnWriteInfo:function(){
                let vm = this;
                let data = {}

                Axios.post("/selectRcmdtWriteInfo.do", data)
                .then(function(response) {
                    vm.viewModel.codeList = response.data.codeList;
                });
              
                },
                //페이징 처리
                fnChangeCNTSelect: function(rowSize){
                    let vm = this;
                    if(rowSize != undefined || rowSize > 0){
                        vm.viewModel.pager.rowSize = rowSize
                        vm.fnList(0);
                    }
                },
                fnList:function(paramPageNo){
                    let vm = this;
                    vm.viewModel.pager.pageNo = paramPageNo == 0 ? 1 : paramPageNo;
    
                    let send = {
                        pageYn:'Y',
                        pageNo: vm.viewModel.pager.pageNo,
                        pageSize: vm.viewModel.pager.rowSize,
                        user_id: vm.viewModel.userInfo.user_id,
                        bplc_yn: vm.viewModel.userInfo.bplc_yn,
                        bplc_use_yn: vm.viewModel.search.bplc_use_yn,
                        bplc_sn: vm.viewModel.search.bplc_sn,
                        clsf_cd: vm.viewModel.search.clsf_cd,
                        dept_sn: vm.viewModel.userInfo.dept_sn,
                        team_sn: vm.viewModel.userInfo.team_sn,
                    }
    
                    Axios.post("/selectRcmdtList.do", send)
                    .then(function(response) {
                        vm.viewModel.list = response.data.list;
                        vm.viewModel.pager.totalSize = response.data.totalCNT;
                        
                        //페이징세팅
                        Pager.props = Pager.methods.createPaging(vm.viewModel.pager, vm, "list");

                        // 이미지 세팅
                        if(vm.viewModel.list.length>0) {
                            for(let i=0; i<vm.viewModel.list.length; i++) {
                                if(vm.viewModel.list[i].strg_file_nm == null){
                                    vm.viewModel.list[i].strg_file_nm = "../../../img/m_no-img.png"
                                }else if(vm.viewModel.list[i].strg_file_nm.charAt()!='/') {
                                    vm.viewModel.list[i].strg_file_nm = vm.viewModel.list[i].strg_file_nm.substring(2);
                                }
                            }
                        }
                        
                        //조회조건 현장명
                        // vm.viewModel.searchBplcList = response.data.searchBplcList;
                    });
                },
                fnDelete: function(sn){
                    let vm = this;
                    let send = {
                        sugest_sn: sn
                    }
    
                    if(confirm(Message.DELETE_CONFIRM)){
                        Axios.post("/deleteRcmdt.do", send)
                        .then(function(response) {
                            if(response.data == 1){
                                alert("삭제가 완료되었습니다.");
                                vm.fnList(0);
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
                            vm.$refs.rgstRcmdtPopup.fnInit(sn);
                        }
                    })
                },
                fnExcelDownload: function () {
                    let vm = this;
                    // 자바 버전
                    const header = ['현장명','분류','등록자','등록일자','내용','조치','담당자','조치일자','조치내용'];
                    const mapperId = 'selectRcmdtExcelList';
                    //검색조건
                    let data = {
                        header: header,
                        mapperId: mapperId,
                        user_id: vm.viewModel.userInfo.user_id,
                        user_id: vm.viewModel.userInfo.user_id,
                        bplc_yn: vm.viewModel.userInfo.bplc_yn,
                        bplc_use_yn: vm.viewModel.search.bplc_use_yn,
                        bplc_sn: vm.viewModel.search.bplc_sn,
                        clsf_cd: vm.viewModel.search.clsf_cd,
                        // 파일명 
                        fileName: "건의사항", // 스마트안전보건_년월일.xlsx
                        dept_sn: vm.viewModel.userInfo.dept_sn,
                        team_sn: vm.viewModel.userInfo.team_sn,
                        // 해당 화면 필요한 조건 파라미터 추가 부분
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