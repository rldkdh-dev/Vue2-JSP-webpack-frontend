<template>
<div>
    <div class="search_area">
        <button class="btn_toggle_search">검색</button>
        <div>
            <div class="search_container">
                <div class="row">
                    <div class="datepicker_box">
                        <input type="text" class="datepicker" id="sdt" placeholder="시작일" value="" title="시작일" readonly>
                    </div>
                    <span>~</span>
                    <div class="datepicker_box">
                        <input type="text" class="datepicker" id="edt" placeholder="종료일" value="" title="종료일" readonly>
                    </div>
                    <input type="text" placeholder="제목을 입력하세요." title="제목 입력" v-model="viewModel.search.ttl">
                </div>
            </div>
            <div class="btn-group">
                <button class="btn btn-default-line" @click="fnreset"><svg class="icon"><use xlink:href="/img/symbol-defs.svg#icon-refresh"></use></svg>초기화</button>
                <button class="btn btn-default" @click="fnInit"><svg class="icon"><use xlink:href="/img/symbol-defs.svg#icon-search"></use></svg>검색</button>
            </div>
        </div>
    </div>
    <div class="contents">
        
        <div>
            <div class="table_top">
                <div class="total_count">총<i>{{ viewModel.pager.totalSize }}</i>건</div>
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
                <caption>공지사항</caption>
                <thead>
                    <tr>
                        <th scope="col" class="w50">번호</th>
                        <th scope="col">제목</th>
                        <th scope="col">작성자</th>
                        <th scope="col">작성일자</th>
                        <th scope="col">첨부</th>
                        <th scope="col">관리</th>
                    </tr>
                </thead>
                <tbody>
                    <template>
                        <tr v-if="item.main_notice_yn != 'N'" v-for="(item, i) in viewModel.mainList" :key="i">
                        <td class="ws-nw" style="background-color: #fffbff;"><b>주요 공지사항</b></td>
                        {{ item.new_yn }}
                        <td class="text-left" style="background-color: #fffbff;"><b><router-link :class="item.new_yn == 'Y' ? 'btn-link new' : 'btn-link'" :to="{name: 'noticeDetail', params: {notice_sn:item.notice_sn}}">{{ item.ttl }}</router-link></b></td>
                        <td style="background-color: #fffbff;"><b>{{ item.reg_nm }}</b></td>
                        <td style="background-color: #fffbff;"><b>{{ item.reg_dt }}</b></td>
                        <td style="background-color: #fffbff;"><button v-if="item.file_cnt > 0 " class="btn btn-icon" @click="fnPopup(item.notice_sn);"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-attachment"></use></svg></button></td>
                        <td style="background-color: #fffbff;" v-if="item.reg_id == viewModel.userInfo.user_id">
                                <router-link :to="{name: 'noticeDetail', params: {notice_sn:item.notice_sn}}" class="btn btn-icon"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-content-search"></use></svg></router-link>
                                <router-link v-if="item.system_sn == undefined" :to="{name: 'noticeUpdate', params: {notice_sn:item.notice_sn}}" class="btn btn-icon"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-edit-contents"></use></svg></router-link>
                                <a href="#" class="btn btn-icon" v-if="item.system_sn == undefined" @click="fnDelete(item.notice_sn)"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-delete-sweep"></use></svg></a>
                            </td>
                            <td style="background-color: #fffbff;" v-else>
                                <router-link :to="{name: 'noticeDetail', params: {notice_sn:item.notice_sn}}" class="btn btn-icon"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-content-search"></use></svg></router-link> 
                            </td>
                        </tr>
                    </template>
                    <template>
                        <tr v-for="(item, i) in viewModel.list" :key="i">
                            <td>{{(viewModel.pager.pageNo==1) ? viewModel.pager.totalSize-i : viewModel.pager.totalSize-((viewModel.pager.rowSize*(viewModel.pager.pageNo-1))+i)}}</td>
                            <td class="text-left"><router-link :class="item.new_yn == 'Y' ? 'btn-link new' : 'btn-link'" :to="{name: 'noticeDetail', params: {notice_sn:item.notice_sn}}">{{ item.ttl }}</router-link></td>
                            <td>{{ item.reg_nm }}</td>
                            <td>{{ item.reg_dt }}</td>
                            <td><button v-if="item.file_cnt > 0 " class="btn btn-icon" @click="fnPopup(item.notice_sn);"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-attachment"></use></svg></button></td>
                            <td v-if="item.reg_id == viewModel.userInfo.user_id">
                                    <router-link :to="{name: 'noticeDetail', params: {notice_sn:item.notice_sn}}" class="btn btn-icon"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-content-search"></use></svg></router-link>
                                    <router-link v-if="item.system_sn == undefined" :to="{name: 'noticeUpdate', params: {notice_sn:item.notice_sn}}" class="btn btn-icon"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-edit-contents"></use></svg></router-link>
                                    <a href="#" class="btn btn-icon" v-if="item.system_sn == undefined" @click="fnDelete(item.notice_sn)"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-delete-sweep"></use></svg></a>
                                </td>
                                <td v-else>
                                    <router-link :to="{name: 'noticeDetail', params: {notice_sn:item.notice_sn}}" class="btn btn-icon"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-content-search"></use></svg></router-link> 
                                </td>
                        </tr>
                    <!-- <tr><td colspan="4">게시물이 없습니다.</td></tr> -->
                    </template>
                </tbody>
            </table>
            <div class="table_footer">
                <pager :pass="viewModel.pager"></pager>
                <div v-if="viewModel.userInfo.user_roles == 'ROLE_001' && viewModel.userInfo.user_type_code == 'ACC_0000'" class="btn-group"> 
                    <!-- <div class="upload_file">
                        <div class="btn filebox">
                            첨부파일을 마우스로 드래그해서 추가해 주세요.
                            <svg class="icon"><use xlink:href="/img/symbol-defs.svg#icon-mouse"></use></svg>
                        </div>
                    </div>				 
                    <a href="" class="btn btn-white"><i class="icon_excel"></i>엑셀업로드</a>-->
                    <a v-if="viewModel.userInfo.bplc_yn == 'N' || viewModel.userInfo.ocpt_se_cd == 'MNG'" href="#/write" class="btn btn-purple"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-post-add"></use></svg>등록</a>
                    <!-- <a href="" class="btn btn-gray"><svg class="icon"><use xlink:href="/img/symbol-defs.svg#icon-trash-can"></use></svg>삭제</a> -->
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
    import Pager from "../../../common/vue/paging.vue";
    import fileViewPopup from "../popup/fileViewPopup.vue";

    export default {
        components: {
            'pager': Pager,
            'fileViewPopup':fileViewPopup,
        },
        data: function() {
            return {
                fileViewPop:false,
                viewModel:{
                    search:{
                            ttl:'',
                        },
                    userInfo:{},
                    list: [],
                    mainList:[],
                    pager: {
                        model: {},
                        pageNo: 1,
                        totalSize: 0,
                        rowSize: 10,
                        blockSize: 10,
                        list: [],
                        mainList:[],
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
            vm.viewModel.userInfo=vm.$store.state.global.userInfo;
            vm.fnInit();
            vm.$router.afterEach((to, from) => {
                vm.fnList(vm.viewModel.pager.pageNo);
            });
        },
        methods: {
            //초기화
            fnRefresh: function(){
                let vm = this;
                vm.viewModel.search = {ttl:''}
                $("#sdt").val('');
                $("#edt").val('');
            },
            fnInit:function(){
                let vm = this;
                vm.viewModel.userInfo = vm.$store.state.global.userInfo;
                vm.fnList(0)
            },
            fnList:function(paramPageNo){
				let vm = this;
				
                vm.viewModel.pager.pageNo = paramPageNo == 0 ? 1 : paramPageNo;

                
                let send = {
                    mapperId:'notice.selectNoticeList',
                    totalId:'notice.selectNoticeListTotal',
                    pageYn:'Y',
                    pageNo: vm.viewModel.pager.pageNo,
                    pageSize: vm.viewModel.pager.rowSize,
                    ttl:vm.viewModel.search.ttl,
                    sdt:$('#sdt').val(),
                    edt:$('#edt').val(),
                }

                Axios.post("/selectNoticeList.do", send).then(function(response) {

                    vm.viewModel.list = response.data.list;
                    vm.viewModel.mainList = response.data.list2;
                    vm.viewModel.pager.totalSize = response.data.totalCNT;
                    //페이징세팅
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
            fnreset:function(){
                this.bplc_nm = "";
                this.actn_prgrs = "";
                $("#sdt").val("");
                $("#edt").val("");
            },
            fnDelete:function(notice_sn){
                let vm = this;
                let send = {
                    mapperId : 'notice.deleteNotice',
                    notice_sn : notice_sn 
                }
                if(confirm('정말 삭제하시겠습니까?')) { 
                    Axios.post('/deleteNotice.do', send).then(function(res){
                        alert('삭제되었습니다.');
                        vm.fnList(0);                    
                    })
                } else { 
                    alert('취소되었습니다.');
                }
            },
            fnPopup: function(sn) {
				let vm = this;

                let send = {
                    sn: sn
                }

                Axios.post("/selectNoticeFileList.do", send)
                .then(function(response) {
                    vm.fileViewPop=true;
                    vm.$nextTick(function() {
                        if(vm.fileViewPop) {
                            vm.$refs.fileViewPopup.fnInit(response.data.fileList, 'notice');
                        }
                    })
                });	
			},
        }
    };
</script>