<template>
    <div>
        <div class="search_area">
            <button class="btn_toggle_search">검색</button>
            <div>
                <div class="search_container">
                    <div class="row">
                        <div class="datepicker_box">
                            <input type="text" class="datepicker" id="datepicker_s" placeholder="점검일자 조회시작일" title="점검일자 조회시작일" readonly>
                        </div>
                        <span>~</span>
                        <div class="datepicker_box">
                            <input type="text" class="datepicker" id="datepicker_e" placeholder="점검일자 조회종료일" title="점검일자 조회종료일" readonly>
                        </div>
                        <div class="input_group" style="width:20rem" v-if="viewModel.userInfo.user_roles == 'ROLE_001'">
                            <select id="list" v-model="viewModel.search.bplc_use_yn" class="wp28">
                                <option value="A">전체</option>
                                <option value="Y" selected="selected">운영</option>
                                <option value="N">종료</option>
                            </select>
                            <select title="현장명" v-model="viewModel.search.bplc_sn">
                                <option value=''>현장명 선택</option>
                                <option v-for="(item, i) in searchBplcList" :key="i" :value="item.bplc_sn">{{ item.bplc_nm }}</option>
                            </select>
                        </div>
                        <input type="text" placeholder="점검 내용을 입력하세요." title="내용 입력" v-model="viewModel.search.chck_cn">
                    </div>
                </div>
                <div class="btn-group">
                <a href="javascript:void(0);" class="btn btn-default-line" @click="fnReset()"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-refresh"></use></svg>초기화</a>
                <a href="javascript:void(0);" class="btn btn-default" @click="fnList(1)"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-search"></use></svg>검색</a>
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
                    <select title="개수 선택" v-model="viewModel.pager.rowSize"  @change="fnRowSize(viewModel.pager.rowSize)">
                        <option :value="10">10개씩 보기</option>
                        <option :value="30">30개씩 보기</option>
                        <option :value="50">50개씩 보기</option>
                        <option :value="100">100개씩 보기</option>
                    </select>
                </div>
                <table class="table">
                    <caption>경영자 안전점검 목록</caption>
                    <thead>
                        <tr>
                            <th scope="col" class="w50">번호</th>
                            <th scope="col" v-if="viewModel.userInfo.user_roles == 'ROLE_001'">점검현장</th>
                            <th scope="col">점검일자</th>
                            <th scope="col">점검항목</th>
                            <th scope="col">점검결과</th>
                            <th scope="col">조치현황</th>
                            <th scope="col">조치자</th>
                            <th scope="col">조치일자</th>
                            <th scope="col">관리</th>
                        </tr>
                    </thead>
                    <tbody v-if="list.length != 0">
                        <tr v-for="(item, i) in list" :key="i">
                            <td>{{ item.rownum }}</td>
                            <td class="text-left" v-if="viewModel.userInfo.user_roles == 'ROLE_001'"><router-link class="btn-link" :to="'/detail/'+item.chck_sn">{{ item.bplc_nm }}</router-link></td>
                            <td>{{ item.chck_dt }}</td>
                            <td><button class="btn btn-icon" v-if="item.file_ck == 'true'" @click="fnPopup('file', item.chck_sn)"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-attachment"></use></svg></button></td>
                            <!-- 점검결과 -->
                            <td v-if="item.chck_rslt == null || item.chck_rslt == ''"><a href="javascript:void(0);" class="btn btn-small btn-blue" @click="fnPopup('result', item.chck_sn)">등록</a></td>
                            <td v-else-if="item.chck_rslt != null && item.chck_rslt == 'Y' && item.actn_dt == null"><a href="javascript:void(0);" class="btn btn-small btn-gray" @click="fnPopup('result', item.chck_sn)">양호</a></td>
                            <td v-else-if="item.chck_rslt != null && item.chck_rslt == 'N' && item.actn_dt == null"><a href="javascript:void(0);" class="btn btn-small btn-gray" @click="fnPopup('result', item.chck_sn)">조치 요청</a></td>
                            <td v-else-if="item.chck_rslt != null && item.chck_rslt == 'Y' && item.actn_dt != null">양호</td>
                            <td v-else-if="item.chck_rslt != null && item.chck_rslt == 'N' && item.actn_dt != null">미흡</td>
                            <!-- 조치현황 -->
                            <td v-if="item.chck_rslt == null || item.chck_rslt == ''"></td>
                            <td v-else-if="item.chck_rslt != null && item.chck_rslt == 'N' && item.actn_cn == null"><a href="javascript:void(0);" class="btn btn-small btn-blue" @click="fnPopup('action', item.chck_sn)">등록</a></td>
                            <td v-else-if="item.chck_rslt != null && item.chck_rslt == 'Y'">-</td>
                            <td v-else-if="item.chck_rslt != null && item.chck_rslt == 'N' && item.actn_cn != null"><a href="javascript:void(0);" class="btn btn-small btn-gray" @click="fnPopup('action', item.chck_sn)">완료</a></td>
                            
                            <td v-if="item.chck_rslt == 'N'">{{ item.maner_nm }}</td> <td v-else>-</td>
                            <td v-if="item.chck_rslt == 'N'">{{ item.actn_dt }}</td>  <td v-else>-</td>
                            <td>
                                <router-link :to="'/detail/'+item.chck_sn" class="btn btn-icon"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-content-search"></use></svg></router-link>
                                <router-link :to="'/update/'+item.chck_sn" class="btn btn-icon" v-if="item.reg_id == viewModel.userInfo.user_id"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-edit-contents"></use></svg></router-link>
                                <a href="#" v-if="item.reg_id == viewModel.userInfo.user_id" @click="fnDelete(item.chck_sn)" class="btn btn-icon"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-delete-sweep"></use></svg></a>
                            </td>
                        </tr>
                    </tbody>
                    <tbody v-else>
                        <tr><td :colspan="viewModel.userInfo.user_roles == 'ROLE_001' ? '9' : '8'">게시물이 없습니다.</td></tr>
                    </tbody>
                </table>
                <div class="table_footer">
                    <Pager :pass="viewModel.pager"></Pager>
                    <div class="btn-group" v-if="viewModel.userInfo.hdofc_mngr_yn == 'Y'"> <!--  본사사람만 등록  -->
                        <router-link to="/write" class="btn btn-purple"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-post-add"></use></svg>등록</router-link>
                    </div>
                </div>
            </div>
        </div>
        <filePopup ref="fileView" v-if="fileViewPopup==true"></filePopup>
        <rpResultPopup ref="rpResult" v-if="rpResultPopup==true"></rpResultPopup>
        <rpActionPopup ref="rpAction" v-if="rpActionPopup==true"></rpActionPopup>
    </div>
</template>

<script>
    import "es6-promise/auto";
    import Vue from "vue";
    import Axios from "axios";
    import Pager from "../../../../common/vue/paging.vue";
    import rpResultPopup from "../../popup/rgstChkPoint_result_popup.vue";
    import rpActionPopup from "../../popup/rgstChkPoint_action_popup.vue";
    import filePopup from '../../popup/fileViewPopup.vue';
    
    export default {
        components: {
            Pager, 
            rpResultPopup, 
            rpActionPopup,
            filePopup
        },
        data: function() {
            return {
                fileViewPopup : false,
                rpResultPopup : false,
                rpActionPopup : false,
                list:[],
                searchBplcList:[],
                detail:{},
                fileList:[],
                actionFileList:[],
                viewModel:{
                    userInfo:{},
                    search:{
                        bplc_sn : '',
                        bplc_use_yn : '',
                        bplc_nm : '',
                        chck_cn : '',
                        chck_dt_s : '',
                        chck_dt_e : '',
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
            let vt = this;
            vt.fnInit();
            vt.$router.afterEach((to, from) => {
                vt.fnList(vt.viewModel.pager.pageNo);
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
                let vt = this;
                let vm = this.viewModel;

                vm.userInfo = vt.$store.state.global.userInfo;
                vm.search.bplc_use_yn = vm.userInfo.bplc_yn == 'N' ? 'Y' : 'A';
                vm.search.bplc_sn = (vm.userInfo.bplc_yn == 'N' && (vm.userInfo.bplc_sn == 0 || vm.userInfo.bplc_use_yn == 'N')) ? '' : vm.userInfo.bplc_sn;
                // vt.fnBplcList();
                vt.fnList();
            },
            fnList:function(paramPageNo){
				let vt = this;
                let vm = this.viewModel;
				
                vm.pager.pageNo = paramPageNo == undefined ? vm.pager.pageNo : paramPageNo;

                if(($("#datepicker_s").val() && !$("#datepicker_e").val()) || (!$("#datepicker_s").val() && $("#datepicker_e").val())){
                    alert("조회시작일과 종료일을 모두 선택해야합니다.");
                    return false;
                }if($("#datepicker_s").val() > $("#datepicker_e").val()){
                    alert("조회시작일이 종료일보다 큽니다.");
                    return false;
                }
                vm.search.chck_dt_s = vm.search.chck_dt_s == '' ? $("#datepicker_s").val() : vm.search.chck_dt_s;
                vm.search.chck_dt_e = vm.search.chck_dt_e == '' ? $("#datepicker_e").val() : vm.search.chck_dt_e;
                
                let send = {
                    user_id : vm.userInfo.user_id,
                    bplc_sn : vm.search.bplc_sn,
                    bplc_use_yn : vm.search.bplc_use_yn,
                    bplc_nm : vm.search.bplc_nm,
                    chck_cn : (vm.search.chck_cn == '') ? null:vm.search.chck_cn,
                    chck_dt_s : (vm.search.chck_dt_s == '') ? null:vm.search.chck_dt_s,
                    chck_dt_e : (vm.search.chck_dt_e == '') ? null:vm.search.chck_dt_e,
                    hdofc_mngr_yn : vm.userInfo.hdofc_mngr_yn,
                    dept_sn: vm.userInfo.dept_sn,
                    team_sn: vm.userInfo.team_sn,
                    pageNo: vm.pager.pageNo,
					pageSize: vm.pager.rowSize,
                }
                
                Axios.post("/selectRgstChkPointList.do", send)
                .then(function(response) {
                    vt.list = response.data.list;
                    // vt.searchBplcList = response.data.searchBplcList;
					vm.pager.totalSize = response.data.totalCount;
                    for(let i=0; i<vt.list.length; i++){
						vt.list[i].chck_dt = (vt.list[i].chck_dt).substring(0,10);
                        if(vt.list[i].actn_dt){
                            vt.list[i].actn_dt = (vt.list[i].actn_dt).substring(0,10);
                        }
                    }
                    //페이징세팅
                    Pager.props = Pager.methods.createPaging(vm.pager, vt, "list");
                });
            },
            fnDelete:function(param){
                let vt = this;
                if(confirm("삭제하시겠습니까?")){ 
                    let data = {
                        chck_sn : param,
                        user_id : vt.viewModel.userInfo.user_id
                    }
                    Axios.post("/deleteRgstChkPoint.do", data).then(function(res){
                        console.log(res);
                    }).catch(function(ex) {
                        console.log(ex);
                    });
                    window.location.reload(); 
                }
            },

            //페이지 목록
            fnReset:function(){
                let vm = this.viewModel;
                vm.search.bplc_use_yn = vm.userInfo.bplc_yn == 'N' ? 'Y' : 'A';
                vm.search.bplc_sn = (vm.userInfo.bplc_yn == 'N' && (vm.userInfo.bplc_sn == 0 || vm.userInfo.bplc_use_yn == 'N')) ? '' : vm.userInfo.bplc_sn;
                vm.search.chck_cn = '';
                vm.search.chck_dt_s = '',
                vm.search.chck_dt_e = '',
                $("#datepicker_s").val('');
                $("#datepicker_e").val('');
            },
            fnRowSize:function(value){
                let vt = this;
                if(value != undefined || value != '' || value > 0){
                    vt.viewModel.pager.rowSize = value
                    vt.fnList();
                }
            },
            // fnSearchList:function(param){
            //     let vt = this;
            //     vt.filePopup = false;
            //     vt.rpResultPopup = false;
            //     vt.rpActionPopup = false;

            //     vt.viewModel.search = param.search;
            //     vt.viewModel.pager.rowSize = param.rowSize;
            //     vt.fnList(param.pageNo);
            // },
            //팝업
            fnPopup:function(value, sn){
                let vt = this;
                let vm = this.viewModel;
                vt.fileViewPopup = false;
                vt.rpResultPopup = false;
                vt.rpActionPopup = false;
                vm.chck_sn = sn;
                vt.fnDetail(sn);
                
                setTimeout(()=>{
                    if(value == 'file'){
                        vt.fileViewPopup = true;

                        vt.$nextTick(function() {
                            if(vt.fileViewPopup) {
                                vt.$refs.fileView.fnInit(vt.fileList, 'rgstChkPoint');
                            }
                        })
                    }if(value == 'result'){
                        vt.rpResultPopup = true;
                        vt.$nextTick(function() {
                            if(vt.rpResultPopup) {
                                vt.$refs.rpResult.fnInit(vt.detail, vt.fileList, vm.chck_sn);
                            }
                        })
                    }if(value == 'action'){
                        vt.rpActionPopup = true;
                        vt.$nextTick(function() {
                            if(vt.rpActionPopup) {
                                vt.$refs.rpAction.fnInit(vt.detail, vt.fileList, vt.actionFileList, vm.chck_sn);
                            }
                        })
                    }
                }, 100)
            },
            fnDetail:function(sn){
                let vt = this;
                vt.fileList = [];
                vt.actionFileList = [];

                Axios.post("/selectRgstChkPointDetail.do", {chck_sn : sn}).then(function(response) {
                    console.log(response.data);
                    vt.detail = response.data.detail;
                    for(let i=0; i<response.data.fileList.length; i++){
                        if(response.data.fileList[i].file_se == '1'){ //점검항목 파일
                            vt.fileList.push(response.data.fileList[i]);
                        }if(response.data.fileList[i].file_se == '2'){ //조치결과 파일
                            vt.actionFileList.push(response.data.fileList[i]);
                        }
                    }
                })
            },
            fnBplcList:function(){
                let vm = this;

                let data = {
                    mapperId: 'comm.selectAllBplcList',
                    bplc_use_yn: vm.viewModel.search.bplc_use_yn,
                    dept_sn: vm.viewModel.userInfo.dept_sn,
                    team_sn: vm.viewModel.userInfo.team_sn,
                };
                Axios.post("/list.do", data).then(function (rs) {
                    vm.searchBplcList = rs.data.list;

                    vm.viewModel.search.bplc_sn = '';
                    if(vm.viewModel.userInfo.bplc_use_yn == 'Y' && vm.viewModel.search.bplc_use_yn == 'Y'){
                        vm.viewModel.search.bplc_sn = vm.viewModel.userInfo.bplc_sn == 0 ? '' : vm.viewModel.userInfo.bplc_sn;
                    }
                });
            },
        }
    };
</script>