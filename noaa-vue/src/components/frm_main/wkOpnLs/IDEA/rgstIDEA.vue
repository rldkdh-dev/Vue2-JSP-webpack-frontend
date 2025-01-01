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
                    <input type="text" placeholder="제목을 입력하세요." title="제목 입력" v-model="viewModel.search.propse_ttl">
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
                <caption>안전제안IDEA 등록</caption>
                <thead>
                    <tr>
                        <th scope="col" class="w50">번호</th>
                        <th scope="col" v-if="viewModel.userInfo.user_roles == 'ROLE_001'">현장명</th>
                        <th scope="col">직종</th>
                        <th scope="col">이름</th>
                        <th scope="col">제목</th>
                        <th scope="col">등록일자</th>
                        <th scope="col">첨부파일</th>
                        <th scope="col">담당자의견</th>
                        <th scope="col">관리</th>
                    </tr>
                </thead>
                <tbody>
                    <template v-if="list.length > 0">
                        <tr v-for="(item, i) in list" :key="i">
                            <td>{{ item.rownum }}</td>
                            <td class="text-left" v-if="viewModel.userInfo.user_roles == 'ROLE_001'">{{ item.bplc_nm }}</td>
                            <td v-if="item.ocpt_detail_nm">{{ item.ocpt_detail_nm }}</td>
                            <td v-if="!item.ocpt_detail_nm">-</td>
                            <td>{{ item.user_nm }}</td>
                            <td class="text-left"><router-link class="btn-link" :to="'/detail/'+item.propse_sn">{{ item.propse_ttl }}</router-link></td>
                            <td>{{ item.reg_dt }}</td>
                            <td><button class="btn btn-icon" v-if="item.file_ck == 'true'" @click="fnDetail('file', item.propse_sn)"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-attachment"></use></svg></button></td>
                            
                            <!-- 현장소장 or 관리자가 등록 -->
                            <td v-if="!item.opnn_cn && (item.ocpt_ck != 'MNG' && item.bplc_mngr != viewModel.userInfo.user_name)"> - </td>
                            <td v-if="!item.opnn_cn && (item.ocpt_ck == 'MNG' || item.bplc_mngr == viewModel.userInfo.user_name)">
                                <a href="javascript:void(0);" class="btn btn-small btn-blue" @click="fnDetail('idea', item.propse_sn)">등록</a>
                            </td>
                            <td v-if="item.opnn_cn">
                                <a href="javascript:void(0);" class="btn btn-small btn-gray" @click="fnDetail('idea', item.propse_sn, 'view')">완료</a>
                            </td>

                            <td>
                                <router-link :to="'/detail/'+item.propse_sn" class="btn btn-icon"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-content-search"></use></svg></router-link>
                                <router-link :to="'/update/'+item.propse_sn" class="btn btn-icon" v-if="item.reg_id == viewModel.userInfo.user_id"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-edit-contents"></use></svg></router-link>
                                <a href="#" v-if="item.reg_id == viewModel.userInfo.user_id" @click="fnDelete(item.propse_sn)" class="btn btn-icon"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-delete-sweep"></use></svg></a>
                            </td> 
                        </tr>
                    </template>
                    <template v-else>
                        <tr>
                            <td :colspan="viewModel.userInfo.user_roles == 'ROLE_001' ? '9' : '8'">게시물이 없습니다.</td>
                        </tr>
                    </template>
                </tbody>
            </table>
            <div class="table_footer">
                <pager :pass="viewModel.pager"></pager>
                <!-- 본사 및 현장관리자(현장소장 포함)만 등록 -->
                <div class="btn-group" v-if="viewModel.userInfo.hdofc_mngr_yn == 'Y' || viewModel.userInfo.ocpt_se_cd == 'MNG'"> 
                    <!-- <div class="upload_file">
                        <div class="btn filebox">
                            첨부파일을 마우스로 드래그해서 추가해 주세요.
                            <svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-mouse"></use></svg>
                        </div>
                    </div>				 -->
                    <!-- <a href="" class="btn btn-white"><i class="icon_excel"></i>엑셀업로드</a>
                    <a href="" class="btn btn-purple"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-post-add"></use></svg>등록</a>
                    <a href="" class="btn btn-gray"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-trash-can"></use></svg>삭제</a> -->
                    <router-link to="/write" class="btn btn-purple"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-post-add"></use></svg>등록</router-link>
                </div>
            </div>
        </div>
    </div>
    <filePopup ref="fileView" v-if="fileViewPopup==true"></filePopup>
    <safeIDEAPopup ref="safeIdea" v-if="ideaPopup==true"></safeIDEAPopup>
</div>
</template>

<script>
    import "es6-promise/auto";
    import Vue from "vue";
    import Axios from "axios";
    import Pager from "../../../../common/vue/paging.vue";
    import FilePopup from '../../popup/fileViewPopup.vue';
    import SafeIDEAPopup from '../../popup/safeIDEA_popup.vue';
    
    export default {
        components: {
            'pager': Pager, FilePopup, SafeIDEAPopup
        },
        data: function() {
            return {
                fileViewPopup:false,
                ideaPopup:false,
                list:[],
                searchBplcList:[],
                popupDetail:{},
                fileList:[],
                viewModel:{
                    userInfo:{},
                    search:{
                        bplc_use_yn:'',
                        bplc_sn : '',
                        bplc_nm : '',
                        propse_ttl : '',
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

                vt.viewModel.userInfo = vt.$store.state.global.userInfo;
                vt.viewModel.search.bplc_use_yn = vt.viewModel.userInfo.bplc_yn == 'N' ? 'Y' : 'A';
                vt.viewModel.search.bplc_sn = (vt.viewModel.userInfo.bplc_yn == 'N' && (vt.viewModel.userInfo.bplc_sn == 0 || vt.viewModel.userInfo.bplc_use_yn == 'N')) ? '' : vt.viewModel.userInfo.bplc_sn;

                // vt.fnBplcList();
                vt.fnList();
            },
            fnList:function(paramPageNo){
				let vt = this;
                let vm = this.viewModel;
				
                vm.pager.pageNo = paramPageNo == undefined ? vm.pager.pageNo : paramPageNo;

                let send = {
                    user_id : vm.userInfo.user_id,
                    bplc_sn : vm.search.bplc_sn,
                    bplc_use_yn : vm.search.bplc_use_yn,
                    bplc_nm : vm.search.bplc_nm,
                    propse_ttl : (vm.search.propse_ttl == '') ? null:vm.search.propse_ttl,
                    hdofc_mngr_yn : vm.userInfo.hdofc_mngr_yn,
                    dept_sn: vm.userInfo.dept_sn,
                    team_sn: vm.userInfo.team_sn,
                    pageNo: vm.pager.pageNo,
					pageSize: vm.pager.rowSize,
                }
                Axios.post("/selectSafeIDEAList.do", send)
                .then(function(response) {
                    console.log(response);
                    vt.list = response.data.list;
                    // vt.searchBplcList = response.data.searchBplcList;
					vm.pager.totalSize = response.data.totalCount;
                    for(let i=0; i<vt.list.length; i++){
						vt.list[i].reg_dt = (vt.list[i].reg_dt).substring(0,10);
                    }
                    //페이징세팅 
                    Pager.props = Pager.methods.createPaging(vm.pager, vt, "list");
                });
            }, 
            fnDelete:function(param){
                let vt = this;
                if(confirm("삭제하시겠습니까?")){ 
                    let data = {
                        propse_sn : param,
                        user_id : vt.viewModel.userInfo.user_id
                    }
                    Axios.post("/deleteSafeIDEA.do", data).then(function(res){
                        console.log(res);
                    }).catch(function(ex) {
                        console.log(ex);
                    });
                    window.location.reload(); 
                }
            },
            fnReset:function(){
                let vm = this.viewModel;

                vm.search = {
                    bplc_use_yn : vm.userInfo.bplc_yn == 'N' ? 'Y' : 'A',
                    bplc_sn: (vm.userInfo.bplc_yn == 'N' && (vm.userInfo.bplc_sn == 0 || vm.userInfo.bplc_use_yn == 'N')) ? '' : vm.userInfo.bplc_sn
                }
                vm.search.propse_ttl = '';

            },
            fnRowSize:function(value){
                let vt = this;
                if(value != undefined || value != '' || value > 0){
                    vt.viewModel.pager.rowSize = value
                    vt.fnList();
                }
            },
            
            //팝업 조회
            fnDetail:function(value, sn, mode){
                let vt = this;
                vt.fileList = [];

                Axios.post("/selectSafeIDEADetail.do", {propse_sn : sn}).then(function(res){
                    console.log(res);
                    vt.popupDetail = res.data.detail;
                    for(let i=0; i<res.data.fileList.length; i++){
                        if(res.data.fileList[i].file_se == '2'){ //파일
                            vt.fileList.push(res.data.fileList[i]);
                        }
                    }

                }).catch(function(ex) {
                    console.log(ex);
                }).finally(function(){
                    vt.fnPopup(value, sn, mode);
                });
            },
            //팝업
            fnPopup:function(value, sn, mode){
                let vt = this;
                let vm = this.viewModel;
                
                // vm.propse_sn = sn;
                // vt.fnDetail(sn);

                vt.$nextTick(function() {
                    if(value == 'file'){
                        vt.fileViewPopup = true;
                        vt.ideaPopup = false;

                        vt.$nextTick(function() {
                            if(vt.fileViewPopup) {
                                vt.$refs.fileView.fnInit(vt.fileList, 'safeIdea');
                            }
                        })
                    }if(value == 'idea'){
                        vt.fileViewPopup = false;
                        vt.ideaPopup = true;
                        vt.$nextTick(function() {
                            if(vt.ideaPopup) { 
                                vt.$refs.safeIdea.fnInit(vt.popupDetail, mode);
                            }
                        })
                    }
                })
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
        }
    };
</script>