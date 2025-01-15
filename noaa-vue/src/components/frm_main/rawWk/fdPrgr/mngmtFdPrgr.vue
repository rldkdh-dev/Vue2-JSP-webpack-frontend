<template>
<div>
    <div class="search_area">
        <button class="btn_toggle_search">검색</button>
        <div>
            <div class="search_container">
                <div class="row">
                    <!-- <select title="자격종류" id="select">
                        <option value="" selected>현장 선택</option>
                        <option v-for="(item,i) in viewModel.bplcList" :key="i" :value="item.BPLC_SN">{{item.BPLC_NM}}</option>>
                    </select> -->
                    <div class="input_group" style="width:20rem" v-if="viewModel.userInfo.user_roles == 'ROLE_001'">
                        <select id="list" v-model="viewModel.search.bplc_use_yn" class="wp28">
                            <option value="A">전체</option>
                            <option value="Y" selected="selected">운영</option>
                            <option value="N">종료</option>
                        </select>
                        <select title="현장명" v-model="viewModel.search.bplc_sn">
                            <option value=''>현장명 선택</option>
                            <option v-for="(item, i) in viewModel.bplcList" :key="i" :value="item.bplc_sn">{{ item.bplc_nm }}</option>
                        </select>
                    </div>
                    <input type="text" placeholder="제목을 입력하세요." title="제목을 입력" v-model="viewModel.search.title">
                </div>
            </div>
            <div class="btn-group">
                <a href="javascript:;" class="btn btn-default-line" @click="fnreset"><svg class="icon">
                        <use xlink:href="../../img/symbol-defs.svg#icon-refresh"></use>
                    </svg>초기화</a>
                <a href="javascript:;" class="btn btn-default" @click="fnList(0)"><svg class="icon">
                        <use xlink:href="../../img/symbol-defs.svg#icon-search"></use>
                    </svg>검색</a>
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
                    <option :value="10">10개</option>
                    <option :value="30">30개</option>
                    <option :value="50">50개</option>
                    <option :value="100">100개</option>
                </select>
            </div>
            <table class="table">
                <caption>안전보건 선임관리</caption>
                <thead>
                    <tr>
                        <th scope="col" class="w50">번호</th>
                        <th scope="col" v-if="viewModel.userInfo.user_roles == 'ROLE_001'">현장</th>
                        <th scope="col">제목</th>
                        <th scope="col">담당자</th>
                        <th scope="col">등록일자</th>
                        <th scope="col">첨부</th>
                        <th scope="col">관리</th>
                    </tr>
                </thead>
                <tbody v-if="viewModel.list.length > 0">
                    <tr v-for="(item,i) in viewModel.list" :key="i">
                        <td>{{(viewModel.pager.pageNo==1) ? viewModel.pager.totalSize-i : viewModel.pager.totalSize-((viewModel.pager.rowSize*(viewModel.pager.pageNo-1))+i)}}</td>
                        <td class="text-left" v-if="viewModel.userInfo.user_roles == 'ROLE_001'">{{ item.BPLC_NM }}</td>
                        <td class="text-left">
                            <router-link class="btn-link" :to="{name:'detail' ,params: {sn:item.PRGRM_SN}}">{{ item.TTL }}</router-link>
                        </td>
                        <td>{{ item.USER_NM}}</td>
                        <td>{{ item.REG_DT }}</td>
                        <td>
                            <button class="btn btn-icon" @click="fnPopup(item.PRGRM_SN);" v-if="item.file_cnt > 0"><svg class="icon">
                                    <use xlink:href="../../img/symbol-defs.svg#icon-attachment"></use>
                                </svg></button>
                        </td>
                        <td>
                            <router-link v-if="(viewModel.userInfo.user_id == item.USER_ID) || (viewModel.userInfo.user_roles == 'ROLE_001')" :to="{name:'write', params: {sn : item.PRGRM_SN}}" href="javacript:;" class="btn btn-icon"><svg class="icon">
                                    <use xlink:href="../../img/symbol-defs.svg#icon-edit-contents"></use>
                                </svg></router-link>
                            <router-link :to="{name:'detail' ,params: {sn:item.PRGRM_SN}}" href="javacript:;" class="btn btn-icon"><svg class="icon">
                                    <use xlink:href="../../img/symbol-defs.svg#icon-content-search"></use>
                                </svg></router-link>
                            <a v-if="(viewModel.userInfo.user_id == item.USER_ID) || (viewModel.userInfo.user_roles == 'ROLE_001')" href="javacript:;" class="btn btn-icon" @click="fndelete(item.PRGRM_SN)"><svg class="icon">
                                    <use xlink:href="../../img/symbol-defs.svg#icon-delete-sweep"></use>
                                </svg></a>
                        </td>
                    </tr>
                </tbody>
                <tbody v-else>
                    <tr>
                        <td :colspan="viewModel.userInfo.user_roles == 'ROLE_001' ? '7' : '6'">등록된 데이터가 없습니다.</td>
                    </tr>
                </tbody>
            </table>
            <div class="table_footer">
                <pager :pass="viewModel.pager"></pager>
                <div class="btn-group">
                    <router-link to="/write" class="btn btn-purple"><svg class="icon">
                            <use xlink:href="../../img/symbol-defs.svg#icon-post-add"></use>
                        </svg>등록</router-link>
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
import Pager from "../../../paging.vue";
import fileViewPopup from "../../popup/fileViewPopup.vue";
Vue.component('pager', Pager);
// Vue.component('excel',Excel);
Vue.component('fileViewPopup', fileViewPopup);
export default {
    data: function () {
        return {
            fileViewPop: false,
            viewModel: {
                userInfo: {},
                list: [],
                bplcList: [],
                search:{
                    bplc_sn:'',
                    bplc_use_yn:'',
                    title:''
                },
                pager: {
                    model: {},
                    pageNo: 1,
                    totalSize: 0,
                    rowSize: 10,
                    blockSize: 10,
                    list: [],
                    callBack: function (n) {
                        try {
                            this.model.fnList(n);
                        } catch (e) {
                            console.log('callback error  ' + e);
                        }
                    }
                },
            }
        };
    },
    mounted: function () {
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
        fnInit: function () {
            let vm = this;
            vm.viewModel.userInfo = vm.$store.state.global.userInfo;
            vm.viewModel.search.bplc_use_yn = vm.viewModel.userInfo.bplc_yn == 'N' ? 'Y' : 'A';
            vm.viewModel.search.bplc_sn = (vm.viewModel.userInfo.bplc_yn == 'N' && (vm.viewModel.userInfo.bplc_sn == 0 || vm.viewModel.userInfo.bplc_use_yn == 'N')) ? '' : vm.viewModel.userInfo.bplc_sn;

            // vm.fnSearch();
            vm.fnList(0);
        },
        fnList: function (paramPageNo) {
            let vm = this;
            vm.viewModel.pager.pageNo = paramPageNo == 0 ? 1 : paramPageNo;

            let send = {
                pageYn:'Y',
                pageNo: vm.viewModel.pager.pageNo,
                pageSize: vm.viewModel.pager.rowSize,
                bplc_sn: vm.viewModel.search.bplc_sn,
                bplc_use_yn: vm.viewModel.search.bplc_use_yn,
                role_id: vm.viewModel.userInfo.user_roles,
                title: vm.viewModel.search.title,
                search_bplc_sn: $("#select").val(),
                dept_sn: vm.viewModel.userInfo.dept_sn,
                team_sn: vm.viewModel.userInfo.team_sn,
            }
            Axios.post("/selectFdPrgrList.do", send)
                .then(function (response) {
                    vm.viewModel.list = response.data.list;
                    vm.viewModel.pager.totalSize = response.data.totalCNT;
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

                vm.viewModel.search.bplc_sn = '';
                if(vm.viewModel.userInfo.bplc_use_yn == 'Y' && vm.viewModel.search.bplc_use_yn == 'Y'){
                    vm.viewModel.search.bplc_sn = vm.viewModel.userInfo.bplc_sn == 0 ? '' : vm.viewModel.userInfo.bplc_sn;
                }
            });
        },
        fndelete: function (sn) {
            let vm = this;
            if (confirm("삭제하시겠습니까?")) {
                Axios.post("/deleteFdPrgr.do", {
                    prgrm_sn: sn
                }).then(function () {
                    vm.fnInit();
                    alert("삭제를 완료했습니다.");
                })
            } else {
                alert("삭제를 취소합니다.");
            }
        },
        //페이징 처리
        fnChangeCNTSelect: function (rowSize) {
            let vm = this;
            if (rowSize != undefined || rowSize > 0) {
                vm.viewModel.pager.rowSize = rowSize
                vm.fnList(0);
            }
        },
        fnreset: function () {
            let vm = this;
            vm.viewModel.search = {
                title: '',
                bplc_use_yn : vm.viewModel.userInfo.bplc_yn == 'N' ? 'Y' : 'A',
                bplc_sn: (vm.viewModel.userInfo.bplc_yn == 'N' && (vm.viewModel.userInfo.bplc_sn == 0 || vm.viewModel.userInfo.bplc_use_yn == 'N')) ? '' : vm.viewModel.userInfo.bplc_sn
            }
        },
        fnPopup: function (sn) {
            let vm = this;

            Axios.post("/selectFdPrgrFileList.do", {
                    sn: sn
                })
                .then(function (response) {
                    vm.fileViewPop = true;
                    vm.$nextTick(function () {
                        if (vm.fileViewPop) {
                            vm.$refs.fileViewPopup.fnInit(response.data.fileList, 'fdPrgr');
                        }
                    })
                });
        },
    }
};
</script>
