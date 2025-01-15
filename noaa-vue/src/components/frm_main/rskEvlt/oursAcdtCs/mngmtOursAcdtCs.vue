<template>
<div>
    <div class="search_area">
        <button class="btn_toggle_search">검색</button>
        <div>
            <div class="search_container">
                <div class="row">
                    <select title="도급관계" v-model="viewModel.search.outsrc_rel">
                        <option disabled value="" selected>도급관계 선택</option>
                        <option value="">전체</option>
                        <option value="원도급">원도급</option>
                        <option value="하도급">하도급</option>
                        <option value="외주/용역/위탁">외주/용역/위탁</option>
                    </select>
                    <div class="input_group" style="width:20rem" v-if="viewModel.userInfo.bplc_yn != 'Y'">
                        <select id="list" v-model="viewModel.search.bplc_use_yn" class="wp28">
                            <option value="A">전체</option>
                            <option value="Y" selected="selected">운영</option>
                            <option value="N">종료</option>
                        </select>
                        <select title="현장명" v-model="viewModel.search.bplc_sn">
                            <option value="">현장명 선택</option>
                            <option :value=item.bplc_sn v-for="(item, i) in searchBplcList" :key=i >{{ item.bplc_nm }}</option>
                        </select>
                    </div>
                    
                    <div><input type="text" id="01" placeholder="외주업체" v-model="viewModel.search.outord_bzenty_conm"></div>
                    <div><input type="text" id="02" placeholder="재해자직종" v-model="viewModel.search.dsstr_man_ocpt"></div>
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
                <caption>우리사고 이력 관리</caption>
                <thead>
                    <tr>
                        <th scope="col" class="w50">번호</th>
                        <th scope="col" v-if="viewModel.userInfo.bplc_yn != 'Y'">현장명</th>
                        <th scope="col">도급관계</th>
                        <th scope="col">사고일자</th>
                        <th scope="col">재해자 수</th>
                        <th scope="col">현장조사</th>
                        <th scope="col">사고 관련 사진</th>
                        <th scope="col">첨부</th>
                        <th scope="col">결재</th>
                        <th scope="col">관리</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, i) in list" :key="i">
                        <!-- <td>{{ item.rownum }}</td> -->
                        <td>{{(viewModel.pager.pageNo==1) ? viewModel.pager.totalSize-i : viewModel.pager.totalSize-((viewModel.pager.rowSize*(viewModel.pager.pageNo-1))+i)}}</td>
                        <td class="text-left" v-if="viewModel.userInfo.bplc_yn != 'Y'"><router-link :to="'/detail/'+item.acdnt_sn">{{ item.bplc_nm }}</router-link></td>
                        <td>{{ item.outsrc_rel }}</td>
                        <td>{{ item.acdnt_dt }}</td>
                        <td>{{ item.dsstrman_cnt }} 명</td>
                        <!-- <td><a href="" class="btn btn-blue">등록</a></td> -->
                        <td>
                            <a v-if="item.atrz != 5" href="javascript:void(0);" class="btn btn-small btn-blue" @click="fnModal('file', item.acdnt_sn, item.atrz)">등록</a>
                            <a v-if="item.atrz == 5" href="javascript:void(0);" class="btn btn-small btn-gray" @click="fnModal('file', item.acdnt_sn, item.atrz)">조회</a>
                        </td>
                        <!-- <td><a href="" class="btn btn-small btn-gray">완료</a></td> -->
                        <!-- <td><a href="" class="btn btn-white">사진</a></td> -->
                        <td v-if="item.img_ck == 'true'" ><a href="javascript:void(0);" class="btn btn-icon" @click="fnModal('img', item.acdnt_sn, item.atrz)"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-camera"></use></svg></a></td>
                        <td v-if="item.img_ck == 'false'" ><a href="javascript:void(0);" class="btn btn-icon" @click="fnModal('img', item.acdnt_sn, item.atrz)"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-camera-add"></use></svg></a></td>
                        <td>
                            <a v-if="item.file_ck == 'true'" href="javascript:void(0);" class="btn btn-icon" @click="fnPopup(item.acdnt_sn);"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-attachment"></use></svg></a>
                        </td><!-- <td><a href="" class="btn btn-icon"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-attachment"></use></svg></a></td> --> <!--첨부-->
                        <td v-if="item.atrz == 1"><span class="btn btn-small btn-approval"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-approval"></use></svg>결재 요청</span></td>
                        <td v-if="item.atrz == 2"><span class="btn btn-small btn-approval return"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-approval-return"></use></svg>조정자 반려</span></td>
                        <td v-if="item.atrz == 3"><span class="btn btn-small btn-approval"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-approval-ongoing"></use></svg>조정자 결재</span></td>
                        <td v-if="item.atrz == 4"><span class="btn btn-small btn-approval return"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-approval-return"></use></svg>결재자 반려</span></td>
                        <td v-if="item.atrz == 5"><span class="btn btn-small btn-approval complete"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-user-check"></use></svg>결재 완료</span></td>
                        <td>
                            <router-link :to="'/detail/'+item.acdnt_sn" class="btn btn-icon"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-content-search"></use></svg></router-link>
                            <router-link :to="'/update/'+item.acdnt_sn" class="btn btn-icon" v-if="item.pic_id == viewModel.userInfo.user_id || item.reg_id == viewModel.userInfo.user_id"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-edit-contents"></use></svg></router-link>
                            <a href="#" v-if="item.atrz != 5 || (item.atrz != 5 && item.reg_id == viewModel.userInfo.user_id)" @click="fnOurCaseDelete(item.acdnt_sn)" class="btn btn-icon"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-delete-sweep"></use></svg></a>
                        </td>
                    </tr>
                    <tr v-if="list.length == 0"><td :colspan="viewModel.userInfo.bplc_yn != 'Y' ? '10' : '9'">게시물이 없습니다.</td></tr>
                </tbody>
            </table>
            <div class="table_footer">
                <pager :pass="viewModel.pager"></pager>
                <div class="btn-group"> 
                    <!-- <div class="upload_file">
                        <div class="btn filebox" id="filebox">
                            첨부파일을 마우스로 드래그해서 추가해 주세요.
                        </div>
                        <input type="file" hidden id="uf01">
                        <label for="uf01" class="btn btn-white"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-folder-filled"></use></svg>찾아보기</label>
                        <a href="" class="btn btn-white"><i class="icon_excel"></i>엑셀업로드</a>
                    </div> -->
                    <router-link to="/write" class="btn btn-purple"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-post-add"></use></svg>등록</router-link>
                </div>
            </div>
        </div>
    </div>
    <oursRtptFilePopup v-if="rtptFileModal" ref="oursAcdtRtpt_file" ></oursRtptFilePopup>
    <oursFilePopup v-if="fileModal" :pass="{id:'oursAcdt_file'}" ref="oursAcdt_file"></oursFilePopup>
    <oursImgPopup  v-if="imgModal"  :pass="{id:'oursAcdt_img'}"  ref="oursAcdt_img"></oursImgPopup>
</div>
</template>

<script>
    import "es6-promise/auto";
    import Vue from "vue";
    import Axios from "axios";
    import Pager from "../../../../common/vue/paging.vue";
	import Common from "../../../../common/js/common.js";
    import fileform from '../../../../common/vue/fileform2.vue';
    import imgsfileform from '../../../../common/vue/imgsfileform2.vue';
    import oursRtptFilePopup from '../../popup/oursAcdtCsRtpt_file_popup.vue';
    import oursFilePopup from "../../popup/oursAcdtCs_file_popup.vue";
    import oursImgPopup from "../../popup/oursAcdtCs_img_popup.vue";
    
    
    export default {
        components: {
            'pager': Pager,
            'fileform' : fileform,
            'imgsfileform' : imgsfileform,
            'oursRtptFilePopup' : oursRtptFilePopup,
            'oursFilePopup' : oursFilePopup,
            'oursImgPopup' : oursImgPopup,
            
        },
        data: function() {
            return {
                imgsrc:'',
                list:[],
                rtptFileModal : false,
                fileModal : false,
                imgModal : false,
                // fileLoadList:[],
                acdnt_sign:'',
                acdnt_sn:'',
                searchBplcList:[],
                viewModel:{
                    userInfo:{},
                    search:{
                        outsrc_rel : '',
                        bplc_sn : '',
                        bplc_nm : '',
                        bplc_use_yn:'',
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
                vm.search.bplc_sn = (vm.userInfo.bplc_yn == 'N' && (vm.userInfo.bplc_sn == 0 || vm.userInfo.bplc_use_yn == 'N')) ? '': vm.userInfo.bplc_sn;
                
                vt.fnList()
            },
            fnList:function(paramPageNo){
				let vt = this;
                let vm = this.viewModel;
				
                vm.pager.pageNo = paramPageNo == undefined ? vm.pager.pageNo : paramPageNo;
                
                let send = {
                    user_id : vm.userInfo.user_id,
                    outsrc_rel : (vm.search.outsrc_rel == '') ? null : vm.search.outsrc_rel,
                    bplc_sn : vm.search.bplc_sn,
                    bplc_nm : vm.search.bplc_nm,
                    outord_bzenty_conm : (vm.search.outord_bzenty_conm == '') ? null : vm.search.outord_bzenty_conm,
                    dsstr_man_ocpt : (vm.search.dsstr_man_ocpt == '') ? null : vm.search.dsstr_man_ocpt,
                    hdofc_mngr_yn : vm.userInfo.hdofc_mngr_yn,

                    pageNo: vm.pager.pageNo,
					pageSize: vm.pager.rowSize,
                    bplc_use_yn: vt.viewModel.search.bplc_use_yn,
                    dept_sn: vm.userInfo.dept_sn,
                    team_sn: vm.userInfo.team_sn,
                }
                Axios.post("/selectOursAcdtCsList.do", send)
                .then(function(response) {
                    vt.list = response.data.oursAcdtCsList;
					vm.pager.totalSize = response.data.totalCount;
                    for(let i=0; i<vt.list.length; i++){
						vt.list[i].acdnt_dt = (Common.fnDateTimeStr(vt.list[i].acdnt_dt)).substring(0,10);
                        vt.fnSigncheck(i);
                    }
                    //페이징세팅
                    Pager.props = Pager.methods.createPaging(vm.pager, vt, "list");
                });
            },
            fnBplcList:function(){
                let vm = this;
                let data = {};

                data = {
                    mapperId: 'comm.selectAllBplcList',
                    bplc_use_yn: vm.viewModel.search.bplc_use_yn,
                    dept_sn: vm.viewModel.userInfo.dept_sn,
                    team_sn: vm.viewModel.userInfo.team_sn,
                };
                Axios.post("/list.do",data).then(function(rs) {
                    vm.searchBplcList = rs.data.list;
                    
                    vm.viewModel.search.bplc_sn = '';
                    if(vm.viewModel.userInfo.bplc_use_yn == 'Y' && vm.viewModel.search.bplc_use_yn == 'Y'){
                        vm.viewModel.search.bplc_sn = vm.viewModel.userInfo.bplc_sn == 0 ? '' : vm.viewModel.userInfo.bplc_sn;
                    }
                });
            },
            fnOurCaseDelete:function(param){
                let vt = this;
                if(confirm("삭제하시겠습니까?")){ 
                    let data = {
                        acdnt_sn : param
                    }
                    Axios.post("/deleteOursAcdtCs.do", data).then(function(res){
                        console.log(res);
                    }).catch(function(ex) {
                        console.log(ex);
                    });
                    window.location.reload(); 
                }
            },
            fnSigncheck:function(i){
                let vt = this;
                //담당자 작성
                if(vt.list[i].pic_atrz_yn=='Y' && vt.list[i].mdtr_atrz_yn=='N' && vt.list[i].dcsn_atrz_yn=='N'){ 
                    vt.list[i].atrz = 1;
                }
                //조정자 (조정자ID 있을 때)
                if(vt.list[i].mdtr_id){
                    if(vt.list[i].pic_atrz_yn=='Y' && vt.list[i].mdtr_atrz_yn=='R' && vt.list[i].dcsn_atrz_yn=='N'){
                        //반려
                        vt.list[i].atrz = 2;
                    }if(vt.list[i].pic_atrz_yn=='Y' && vt.list[i].mdtr_atrz_yn=='Y' && vt.list[i].dcsn_atrz_yn=='N'){
                        //결재
                        vt.list[i].atrz = 3;
                    }
                    //결재자
                    if(vt.list[i].pic_atrz_yn=='Y' && vt.list[i].mdtr_atrz_yn=='Y' && vt.list[i].dcsn_atrz_yn=='R'){
                        //반려
                        vt.list[i].atrz = 4;
                    }if(vt.list[i].pic_atrz_yn=='Y' && vt.list[i].mdtr_atrz_yn=='Y' && vt.list[i].dcsn_atrz_yn=='Y'){
                        //결재
                        vt.list[i].atrz = 5;
                    }
                }else{//조정자 (조정자ID 없을 때)
                    //결재자
                    if(vt.list[i].pic_atrz_yn=='Y' && vt.list[i].dcsn_atrz_yn=='R'){
                        //반려
                        vt.list[i].atrz = 4;
                    }if(vt.list[i].pic_atrz_yn=='Y' && vt.list[i].dcsn_atrz_yn=='Y'){
                        //결재
                        vt.list[i].atrz = 5;
                    }
                }
            },
            fnModal:function(value, sn, sign){
                let vt = this;
                vt.acdnt_sign = sign;
                vt.acdnt_sn = sn;

                vt.rtptFileModal = false;
                vt.fileModal = false;
                vt.imgModal = false;
                
                if(value == 'file'){
                    vt.fileModal = true;
                    vt.$nextTick(function() {
                        vt.$refs.oursAcdt_file.fnInit(value, vt.acdnt_sn, vt.acdnt_sign);
                    })
                }if(value == 'img'){
                    vt.imgModal = true;
                    vt.$nextTick(function() {
                        vt.$refs.oursAcdt_img.fnInit(value, vt.acdnt_sn, vt.acdnt_sign);
                    })
                }
            },
            fnPopup: function(sn) {
				let vt = this;
                vt.rtptFileModal = false;
                vt.fileModal = false;
                vt.imgModal = false;
                Axios.post("/selectOursAcdtCsDetailList.do", {acdnt_sn: sn})
                .then(function(response) {
                    console.log(response.data);
                    vt.rtptFileModal=true;
                    vt.$nextTick(function() {
                        if(vt.rtptFileModal) {
                            vt.$refs.oursAcdtRtpt_file.fnInit(response.data.fileList, 'oursAcdtCsRptp', vt.rtptFileModal, sn);
                        }
                    })
                });
			},
           
            //페이지 목록
            fnReset:function(){
                let vt = this;
                vt.viewModel.search.outsrc_rel = '';
                vt.viewModel.search.outord_bzenty_conm = '';
                vt.viewModel.search.dsstr_man_ocpt = '';
                vt.viewModel.search.bplc_sn = (vt.viewModel.userInfo.bplc_yn == 'N' && (vt.viewModel.userInfo.bplc_sn == 0 || vt.viewModel.userInfo.bplc_use_yn == 'N')) ? '' : vt.viewModel.userInfo.bplc_sn,
                vt.viewModel.search.bplc_use_yn = vt.viewModel.userInfo.bplc_yn == 'N' ? 'Y' : 'A',
                
                vt.$forceUpdate();
            },
            fnRowSize:function(value){
                let vt = this;
                if(value != undefined || value != '' || value > 0){
                    vt.viewModel.pager.rowSize = value
                    vt.fnList();
                }
            },
        }
    };
</script>