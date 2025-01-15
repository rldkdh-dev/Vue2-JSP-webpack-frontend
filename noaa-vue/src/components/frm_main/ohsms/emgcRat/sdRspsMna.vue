<template>
    <div>
        <div class="search_area">
            <button class="btn_toggle_search">검색</button>
            <div>
                <div class="search_container">
                    <div class="row">
                        <div class="input_group" style="width:20rem" v-if="viewModel.userInfo.bplc_yn == 'N'">
                            <select id="list" v-model="viewModel.search.bplc_use_yn" class="wp28">
                                <option value="A">전체</option>
                                <option value="Y" selected="selected">운영</option>
                                <option value="N">종료</option>
                            </select>
                            <select  title="현장명" v-model="viewModel.search.bplc_sn">
                                <option selected value="">현장명 선택</option>
                                <option v-for="(item, i) in viewModel.searchBplcList" :key="i" :value="item.bplc_sn">{{ item.bplc_nm }}</option>
                            </select>
                        </div>
                        <div class="datepicker_box">
                            <input type="text" class="datepicker" id="sdt" placeholder="등록일" title="등록일" readonly>
                        </div>
                        <span>~</span>
                        <div class="datepicker_box">
                            <input type="text" class="datepicker" id="edt" placeholder="등록일" title="등록일" readonly>
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
                    <select title="데이터 표출 개수" v-model="viewModel.pager.rowSize" @change="fnChangeCNTSelect(viewModel.pager.rowSize);">
                        <option value="10">10개씩 보기</option>
                        <option value="30">30개씩 보기</option>
                        <option value="50">50개씩 보기</option>
                        <option value="100">100개씩 보기</option>
                    </select>
                </div>
                <PDFviewer ref="PDFviewer" v-show="bool == true"></PDFviewer>
                <table class="table">
                    <caption>중대재해 대응 등록</caption>
                    <thead>
                        <tr>
                            <th scope="col" class="w50">번호</th>
                            <th scope="col" v-if="viewModel.userInfo.bplc_yn == 'N'">현장명</th>
                            <th scope="col">중대재해 대응 매뉴얼</th>
                            <th scope="col">등록일자</th>
                            <th scope="col">등록자</th>
                            <th scope="col">현장소장 결재</th>
                            <th scope="col">관리</th>
                        </tr>
                    </thead>
                    <tbody>
                        <template v-if="viewModel.list.length != 0" v-for="(item, i) in viewModel.list" :key="i">
                            <tr v-if="viewModel.list.length != 0">
                                <td>{{(viewModel.pager.pageNo==1) ? viewModel.pager.totalSize-i : viewModel.pager.totalSize-((viewModel.pager.rowSize*(viewModel.pager.pageNo-1))+i)}}</td>
                                <td class="text-left" v-if="viewModel.userInfo.bplc_yn == 'N'">{{ item.bplc_nm }}</td>
                                <td>
                                    <button class="btn btn-small btn-blue" @click="fnPdfView( item.strg_path + item.strg_file_nm, item.orgnl_file_nm)" >
                                        조회
                                    </button>
                                </td>
                                <td>{{ item.reg_dt | yyyyMMdd }}</td>
                                <td>{{ item.reg_nm }}</td>
                                <td>
                                    <span class="btn btn-small btn-approval complete" v-if="item.bplc_mngr_sign_yn == 'Y' && viewModel.userInfo.user_id == item.bplc_mngr"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-user-check"></use></svg>결재 완료</span>
                                    <span class="btn btn-small btn-approval" v-else-if="item.bplc_mngr_sign_yn != 'Y' && viewModel.userInfo.user_id == item.bplc_mngr" @click="fnPopup(item.atchmnfl_sn, item.reg_id)"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-approval"></use></svg>결재 요청</span>
                                    <span v-else-if="item.bplc_mngr != viewModel.userInfo.user_id && item.bplc_mngr_sign_yn == 'Y'">결재완료</span>
                                    <span v-else-if="item.bplc_mngr != viewModel.userInfo.user_id && item.bplc_mngr_sign_yn != 'Y'">결재요청</span>
                                </td>
                                <td>
                                <template v-if="item.reg_id == viewModel.userInfo.user_id">
                                    <button class="btn btn-icon" @click="fnDelete(item)"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-delete-sweep"></use></svg></button>
                                </template>
                                </td>
                            </tr>
                        </template>
                        <template v-if="viewModel.list.length == 0"><tr><td :colspan="viewModel.userInfo.bplc_yn == 'N' ? '7' : '6'">게시물이 없습니다.</td></tr></template>
                    </tbody>
                </table>
				<div class="table_footer">
                    <pager :pass="viewModel.pager"></pager>                    
                    	<div class="btn-group"> 
                        <!-- <div class="upload_file">
                            <div class="btn filebox">
                                첨부파일을 마우스로 드래그해서 추가해 주세요.
                                <svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-mouse"></use></svg>
                            </div>
                        </div>				 -->
                        <!-- <a href="" class="btn btn-white"><i class="icon_excel"></i>엑셀업로드</a> -->
                        <a v-if="viewModel.userInfo.bplc_yn == 'N' || viewModel.userInfo.ocpt_se_cd == 'MNG'" href="#/write" class="btn btn-purple"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-post-add"></use></svg>등록</a>
                        <!-- <a href="" class="btn btn-gray"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-trash-can"></use></svg>삭제</a> -->
                    </div>
                </div>
            </div>
        </div>
        <signPopup ref="signPopup" v-if="signPop==true"></signPopup>
    </div>
</template>
    
<script>
    import "es6-promise/auto";
    import Vue from "vue";
    import Axios from "axios";
    import Message from "../../../../common/js/message";
    import PDFviewer from "../../../../common/vue/pdfViewer.vue";
    import Pager from "../../../../common/vue/paging.vue";
    import signPopup from "../../popup/sign_popup.vue";

    Vue.component('PDFviewer',PDFviewer);

    export default {
        components: {
            'pager': Pager,
            'signPopup': signPopup,
        },
        data: function() {
            return {
                bool:false,
                signPop:false,
                imgsrc:'',
                sn:'',
                send_id:'',
                viewModel:{
                    search:{
                        bplc_sn:'',
                        bplc_use_yn:''
                    },
                    userInfo:{},
                    list: [],
                    searchBplcList: [
                    ],
                    data:{
                        totalCNT:0,
                    },
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
            calendarInput();
            
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
                    bplc_sn : (vm.viewModel.userInfo.bplc_yn == 'N' && (vm.viewModel.userInfo.bplc_sn == 0 || vm.viewModel.userInfo.bplc_use_yn == 'N')) ? '' : vm.viewModel.userInfo.bplc_sn,
                    bplc_use_yn : vm.viewModel.userInfo.bplc_yn == 'N' ? 'Y' : 'A',
                    bplc_nm:'',
                }
                $("#sdt").val('');
                $("#edt").val('');

                // if(vm.viewModel.userInfo.user_roles == 'ROLE_001'){
                //     vm.fnBplcList();
                // }
            },
            fnInit: function(){
                let vm = this;
                
                vm.viewModel.userInfo = vm.$store.state.global.userInfo;
                vm.viewModel.search.bplc_use_yn = vm.viewModel.userInfo.bplc_yn == 'N' ? 'Y' : 'A';
                vm.viewModel.search.bplc_sn = (vm.viewModel.userInfo.bplc_yn == 'N' && (vm.viewModel.userInfo.bplc_sn == 0 || vm.viewModel.userInfo.bplc_use_yn == 'N')) ? '': vm.viewModel.userInfo.bplc_sn;

                vm.fnList(1);
            },
            fnBplcList: function(){
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
            fnList:function(paramPageNo){
                let vm = this;
                vm.viewModel.pager.pageNo = paramPageNo == undefined ? vm.viewModel.pager.pageNo : paramPageNo;

                let send = {
                    pageNo: vm.viewModel.pager.pageNo,
                    pageSize: vm.viewModel.pager.rowSize,
                    user_nm: vm.viewModel.search.user_nm,
                    bplc_sn: vm.viewModel.search.bplc_sn,
                    bplc_use_yn: vm.viewModel.search.bplc_use_yn,
                    bplc_yn: vm.viewModel.userInfo.bplc_yn,
                    u_bplc_sn: vm.viewModel.userInfo.bplc_sn,
                    mnl_se : '2',
                    reg_dt_s: $("#sdt").val(),
                    reg_dt_e: $("#edt").val(),
                    dept_sn: vm.viewModel.userInfo.dept_sn,
                    team_sn: vm.viewModel.userInfo.team_sn,
                }

                Axios.post("/selectStHsMnaList.do", send)
                .then(function(response) {
                    vm.viewModel.list = response.data.list;
                    vm.viewModel.pager.totalSize = response.data.totalCNT;
                    //페이징세팅
                    Pager.props = Pager.methods.createPaging(vm.viewModel.pager, vm, "list");
                    for(let i=0; i<vm.viewModel.list.length; i++){
                        let item = vm.viewModel.list[i].strg_path;
                        if(item.charAt()=='/') {       //리눅스 경로때문에 사용
                            vm.viewModel.list[i].strg_path = item;
                        }else{
                            vm.viewModel.list[i].strg_path = item.substring(2);
                        }
                    }
                    // //조회조건 현장명
                    // vm.viewModel.searchBplcList = response.data.searchBplcList;
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
            fnDelete: function(item){
                let vm = this;

                if(item.bplc_mngr_sign_yn == 'Y'){
                    alert("현장소장 결재가 완료되어 삭제가 불가합니다.");
                    return false;
                }else{
                    let send = {
                        bplc_sn: item.bplc_sn,
                        atchmnfl_sn: item.atchmnfl_sn,
                        mnl_se : '2',
                    }

                    if(confirm(Message.DELETE_CONFIRM)){
                        Axios.post("/deleteStHsMna.do", send)
                        .then(function(response) {
                            alert("삭제가 완료되었습니다.");
                            vm.fnList(1);
                        }).catch(function(ex){
                            alert(Message.ERROR);
                        });
                    }
                }
            },
            fnPdfView:function(path, nm){    
                this.bool = true;
                this.signPop = false;
                this.$refs.PDFviewer.fnSetContents(path, nm,'중대재해 대응 매뉴얼');                
            },
            fnPopup: function(sn, reg_id){
                let vm = this;
                vm.sn = sn;
                vm.send_id = reg_id;

                vm.bool=false;
                vm.signPop = true;

                vm.$nextTick(function() {
                    if(vm.signPop) {
                        vm.$refs.signPopup.fnInit(sn, id);
                    }
                })
            },
            fnSign: function(){
                let vm = this;

                let data = {
                    reg_id: vm.viewModel.userInfo.user_id,
                    atchmnfl_sn: vm.sn,
                    mnl_se : '2',
                }

                Axios.post("/updateStHsMnaSign.do", data)
                .then(function(response) {
                    alert("결재가 완료되었습니다.");
                    vm.fnList(vm.viewModel.pager.pageNo);
                    vm.callPushAlarm(vm.send_id);
                });
            },
            callPushAlarm: function(user_id) {
                let vm = this;
                    
                let link = '/m/main/index.do#/';

                $.ajax({
                    type: "post",
                    url:"/api/pushSendPerson.do",
                    data:{
                        // 제목 및 내용
                        title : "중대재해 대응 매뉴얼 현장소장 결재가 완료되었습니다.",
                        message : "PC에서 확인해주세요.",
                        user_id : user_id,
                        // 클릭 시 이동 화면주소
                        link : link
                    }
                });
            }
        }
    }
</script>