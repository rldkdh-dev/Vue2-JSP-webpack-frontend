<template>
    <div>
        <div class="search_area">
            <button class="btn_toggle_search">검색</button>
            <div>
                <div class="search_container">
                    <div class="row">
                        <input type="text" placeholder="제목을 입력하세요." title="제목 입력" v-model="viewModel.search.ttl">
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
                    <select title="데이터 표출 개수" v-model="viewModel.pager.rowSize" @change="fnChangeCNTSelect(viewModel.pager.rowSize);">
                        <option value="10">10개씩 보기</option>
                        <option value="30">30개씩 보기</option>
                        <option value="50">50개씩 보기</option>
                        <option value="100">100개씩 보기</option>
                    </select>
                </div>
                <table class="table">
                    <caption>점검활동</caption>
                    <thead>
                        <tr>
                            <th scope="col">NO.</th>
                            <th scope="col">답변여부</th>
                            <th scope="col">구분</th>
                            <th scope="col">제목</th>
                            <th scope="col">등록일자</th>
                            <th scope="col">등록자</th>
                            <th scope="col">첨부</th>
                            <th scope="col">관리</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, i) in viewModel.list" :key="i">
                            <td>{{(viewModel.pager.pageNo==1) ? viewModel.pager.totalSize-i : viewModel.pager.totalSize-((viewModel.pager.rowSize*(viewModel.pager.pageNo-1))+i)}}</td>
                            <td>{{ item.ans !=  null ? '완료' : '-' }}</td>
                            <td>{{ item.se_nm }}</td>
                            <td class="text-left"><router-link :to="'/detail/'+item.sugest_sn" class="btn-link">{{ item.ttl }}</router-link></td>
                            <td>{{ item.reg_dt|yyyyMMdd }}</td>
                            <td>{{ item.reg_nm }}</td>
                            <td>
                                <button v-if="item.file_cnt > 0" class="btn btn-icon" @click="fnPopup(item.sugest_sn);"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-attachment"></use></svg></button>
                            </td>
                            <td>
                                <router-link :to="'/detail/'+item.sugest_sn" class="btn btn-icon"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-content-search"></use></svg></router-link>
                                <template v-if="item.reg_id == viewModel.userInfo.user_id">
                                    <router-link :to="'/write/'+item.sugest_sn" class="btn btn-icon"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-edit-contents"></use></svg></router-link>
                                    <button class="btn btn-icon" @click="fnDelete(item.sugest_sn)"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-delete-sweep"></use></svg></button>
                                </template>
                                <template v-if="'system' == viewModel.userInfo.user_id">
                                    <router-link :to="'/reply/'+item.sugest_sn" class="btn btn-icon"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-chat"></use></svg></router-link>
                                </template>
                            </td>
                        </tr>
                        <tr v-if="viewModel.list.length == 0"><td :colspan="'7'">게시물이 없습니다.</td></tr>
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
        <fileViewPopup ref="fileViewPopup" v-if="fileViewPop==true"></fileViewPopup>
    </div>
    </template>
    
<script>
    import "es6-promise/auto";
    import Vue from "vue";
    import Axios from "axios";
    import Common from '../../../../common/js/common.js';
    import Pager from "../../../../common/vue/paging.vue";
    import Message, {messageUtil} from "../../../../common/js/message";
    import fileViewPopup from "../../popup/fileViewPopup.vue";
    
    export default {
        components: {
            'pager': Pager,
            'fileViewPopup': fileViewPopup,
        },
        data: function() {
            return {
                fileViewPop: false,
                viewModel:{
                    search:{
                        ttl:''
                    },
                    userInfo:{},
                    list: [],
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
                vm.fnList();
            })
        },
        methods: {
            //초기화
            fnRefresh: function(){
                let vm = this;
                vm.viewModel.search = {ttl:''}
            },
            fnInit: function(){
                let vm = this;
                vm.viewModel.userInfo = vm.$store.state.global.userInfo;
                vm.fnList(1);
            },
            //목록 조회
            fnList:function(paramPageNo){
                let vm = this;
                vm.viewModel.pager.pageNo = paramPageNo == undefined ? vm.viewModel.pager.pageNo : paramPageNo;

                let send = {
                    pageYn:'Y',
                    pageNo: vm.viewModel.pager.pageNo,
                    pageSize: vm.viewModel.pager.rowSize,
                    ttl: vm.viewModel.search.ttl,
                    bplc_yn: vm.viewModel.userInfo.bplc_yn,
                    user_id: vm.viewModel.userInfo.user_id,
                }

                Axios.post("/selectSugestList.do", send)
                .then(function(response) {
                    vm.viewModel.list = response.data.list;
                    vm.viewModel.pager.totalSize = response.data.totalCNT;
                    
                    //페이징세팅
                    Pager.props = Pager.methods.createPaging(vm.viewModel.pager, vm, "list");
                });
            },
            //페이징 처리
            fnChangeCNTSelect: function(rowSize){
                let vm = this;
                if(rowSize != undefined || rowSize > 0){
                    vm.viewModel.pager.rowSize = rowSize
                    vm.fnList(1);
                }
            },
            fnDelete: function(sn){
                let vm = this;
                let send = {
                    sugest_sn: sn
                }

                if(confirm(Message.DELETE_CONFIRM)){
                    Axios.post("/deleteSugest.do", send)
                    .then(function(response) {
                        if(response.data == 1){
                            alert("삭제가 완료되었습니다.");
                            vm.fnList();
                        }
                    }).catch(function(ex) {
                        alert(Message.ERROR);
                    });
                }
            },
            fnPopup: function(sn) {
				let vm = this;
                let send = {
                    sn: sn
                }
                Axios.post("/selectSugestFileList.do", send)
                .then(function(response) {
                    vm.fileViewPop=true;
                    vm.$nextTick(function() {
                        if(vm.fileViewPop) {
                            vm.$refs.fileViewPopup.fnInit(response.data.fileList, 'sugest');
                        }
                    })
                });				
			},
        }
    };
</script>