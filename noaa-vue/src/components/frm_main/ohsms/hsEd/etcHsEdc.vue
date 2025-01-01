<template>
<div>
    <div class="search_area">
        <button class="btn_toggle_search">검색</button>
        <div>
            <div class="search_container">
                <!-- <div class="row">
                    <select v-if="viewModel.userInfo.user_roles == 'ROLE_001' && viewModel.userInfo.user_type_code == 'ACC_0000'" title="현장명" v-model="viewModel.search.bplc_sn">
                        <option disabled selected value="0">현장명 선택</option>
                        <option v-for="(item, i) in searchBplcList" :key="i" :value="item.BPLC_SN">{{ item.BPLC_NM }}</option>
                    </select>
                    <div>
                        <select title="교육명 선택" v-model="selectEdu">
                            <option value="">교육명 선택</option>
                            <option v-for="item in eduCodeList" :key="item" :value="item.edu_se_cd">{{ item.edu_se_nm }}</option>
                        </select>
                    </div>
                    <div> 
                        <input type="text" placeholder="교육명을 입력하세요." title="검색어 입력" v-model="edu_nm_ttl" @input="edu_nm_ttl = $event.target.value">
                    </div>
                </div> -->
                <div class="row">
                    <!-- <select v-if="viewModel.userInfo.user_roles == 'ROLE_001' && viewModel.userInfo.user_type_code == 'ACC_0000'" title="현장명" v-model="viewModel.search.bplc_sn">
                        <option disabled selected value="0">현장명 선택</option>
                        <option v-for="(item, i) in searchBplcList" :key="i" :value="item.BPLC_SN">{{ item.BPLC_NM }}</option>
                    </select> -->
                    <div class="input_group" style="width:20rem" v-if="viewModel.userInfo.user_roles == 'ROLE_001'">
                        <select id="list" v-model="viewModel.search.bplc_use_yn" class="wp28">
                            <option value="A">전체</option>
                            <option value="Y" selected="selected">운영</option>
                            <option value="N">종료</option>
                        </select>
                        <select title="현장명" v-model="viewModel.search.bplc_sn">
                            <option selected value="0">현장명 선택</option>
                            <option v-for="(item, i) in searchBplcList" :key="i" :value="item.bplc_sn">{{ item.bplc_nm }}</option>
                        </select>
                    </div>
                    <select title="교육명 선택" v-model="selectEdu" @change="fnEdu_Detail_Code(selectEdu)">
                        <option value="">교육종류 선택</option>
                        <option v-for="item in eduCodeList" :key="item" :value="item.edu_se_cd">{{ item.edu_se_nm }}</option>
                    </select>
                    <select v-model="selectEdu_se" ref="clsf_se" v-if="selectEdu != 'EA04' && selectEdu != 'EA05' && selectEdu != 'EA06'">
                        <option value="">선택</option>
                        <option v-for="item in eduCodeDetailList" :key="item" :value="item.edu_detail_cd">{{ item.edu_detail_nm }}</option>
                    </select>
                    <input v-else-if="selectEdu == 'EA05'" type="text" v-model="edu_detail_etc" placeholder="교육명을 입력해주세요." ref="clsf_detail">
                    <input v-else type="text" v-model="edu_detail_etc" placeholder="교육명을 입력해주세요." ref="clsf_detail">
                    <div class="datepicker_box">
                        <input type="text" class="datepicker" id="sdt" placeholder="교육일시" value="" title="교육일시" readonly>
                    </div>
                    <select v-model="edu_bgng_hour">
                        <option value="">시간</option>
                        <option :value="i-1 < 10 ? 0+''+(i-1) : i-1" v-for="i in 24" :key="i">
                            {{ i-1 < 10 ? 0+''+(i-1) : i-1}}시
                        </option>
                    </select>
                    <div> 
                        <input type="text" placeholder="담당자을 입력하세요." title="담당자 입력" v-model="aprvr1_nm" @input="aprvr1_nm = $event.target.value">
                    </div>
                </div>
            </div>
            <div class="btn-group">
                <a href="javascript:;" class="btn btn-default-line" @click="fnreset"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-refresh"></use></svg>초기화</a>
                <a href="javascript:;" class="btn btn-default" @click="fnList(0)"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-search"></use></svg>검색</a>
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
                <select v-model="viewModel.pager.rowSize" @change="fnGetChangeSelectList(viewModel.pager.rowSize);">
                        <option :value="10" >10개씩 보기</option>
                        <option :value="30" >30개씩 보기</option>
                        <option :value="50" >50개씩 보기</option>
                        <option :value="100" >100개씩 보기</option>
                </select>
            </div>
            <table class="table">
                <caption>기타 안전교육</caption>
                <thead>
                    <tr>
                        <th scope="col" class="w50">번호</th>
                        <th scope="col" v-if="viewModel.userInfo.user_roles == 'ROLE_001'">현장명</th>
                        <th scope="col">분류</th>
                        <th scope="col">교육명</th>
                        <th scope="col">교육일시</th>
                        <th scope="col">인원</th>
                        <th scope="col">참석자 지졍 여부</th>
                        <th scope="col">참석자 명단</th>
                        <th scope="col">참석자 확인</th>
                        <!-- <th scope="col">미리보기</th> -->
                        <!-- <th scope="col">미제출자</th> -->
                        <!-- <th scope="col">만족도</th> 추후추가 -->
                        <th scope="col">교육사진</th>
                        <th scope="col">교안</th>
                        <th scope="col">결재</th>
                        <th scope="col">교육완료</th>
                        <th scope="col">담당자</th>
                        <th scope="col">관리</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item,i) in list" :key="item">
                        <td>{{(viewModel.pager.pageNo==1) ? viewModel.pager.totalSize-i : viewModel.pager.totalSize-((viewModel.pager.rowSize*(viewModel.pager.pageNo-1))+i)}}</td>
                        <td class="text-left" v-if="viewModel.userInfo.user_roles == 'ROLE_001'"><router-link class="btn-link" :to="{name:'etcHsEdcDetail',params:{uid:item.edu_sn,edu_se_cd:item.edu_se_cd , edu_detail_cd:item.edu_detail_cd == '' ? 'ED06-01' : item.edu_detail_cd}}">{{ item.bplc }}</router-link></td>
                        <td class="text-left">{{ item.edu_se_nm }} {{ item.edu_se_cd != 'EA04' && item.edu_se_cd != 'EA05' && item.edu_se_cd != 'EA06' ? '-' + item.edu_detail_nm : '' }}</td>
                        <td class="text-left">{{ item.edu_nm_ttl }}</td>
                        <td>{{ item.edu_dt+' '+item.edu_bgng_tm+'~'+item.edu_end_tm }}</td>
                        <td class="text-right">{{ item.tot_cnt }}</td>
                        <td>
                            {{ item.assign_yn == 'Y' ? '지정' : '미지정' }}
                        </td>
                        <td>
                            <button class="btn btn-icon" @click="fnParticiPantListPopup(item.edu_sn)"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-user-group"></use></svg></button>
                        </td>
                        <td>
                            <template v-if="item.assign_yn == 'Y'">
                                <template v-if="item.sign_yn != 'X'">
                                    <button v-if="item.sign_yn == 'Y'" @click="fnSignPop(item.edu_sn, item.sign_yn, item.edu_cmpl_yn)" class="btn btn-small btn-gray" ><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-task-alt"></use></svg>참석자 확인 완료</button>
                                    <button v-else @click="fnSignPop(item.edu_sn, item.sign_yn, item.edu_cmpl_yn)" class="btn btn-small btn-blue" ><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-signature-reset"></use></svg>참석자 확인</button>
                                </template>
                            </template>
                            <template v-else>
                                <button v-if="item.sign_yn == 'Y'" @click="fnSignPop(item.edu_sn, item.sign_yn, item.edu_cmpl_yn)" class="btn btn-small btn-gray" ><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-task-alt"></use></svg>참석자 확인 완료</button>
                                <button v-else @click="fnSignPop(item.edu_sn, item.sign_yn, item.edu_cmpl_yn)" class="btn btn-small btn-blue" ><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-signature-reset"></use></svg>참석자 확인</button>
                            </template>
                        </td>
                        <!-- <td>미리보기</td> -->
                        <!-- <td>재츌</td> -->
                        <!-- <td><button class="btn btn-icon"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-thumb-up"></use></svg></button></td> -->
                        <td><button v-if="viewModel.userInfo.user_id == item.reg_id" class="btn btn-icon" @click="fnfilepopup(item.edu_sn,1)"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-camera"></use></svg></button></td>
                        <td><button v-if="item.cnt > 0" class="btn btn-icon" @click="fnfilepopup(item.edu_sn,2)"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-attachment"></use></svg></button></td>
                        <td>
                            <template v-if="item.aprvr_my_no != 0" >
                                <span v-if="item.aprvr_comp_yn == 'Y'" class="btn btn-small btn-approval complete"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-user-check"></use></svg>결재 완료</span>
                                <a v-else-if="item.aprvr_my_no < item.aprvr_to_no"><span class="btn btn-small btn-approval"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-approval-ongoing"></use></svg>진행 중</span></a>
                                <a v-else-if="item.aprvr_my_no > item.aprvr_to_no"><span class="btn btn-small btn-approval"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-approval-ongoing"></use></svg>결재 대기</span></a>
                                <button v-else-if="item.aprvr_my_no == item.aprvr_to_no"><span class="btn btn-small btn-approval" @click="fnAprvrpopup(item.edu_sn, item.aprvr_to_no)"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-approval-ongoing"></use></svg>결재 요청</span></button>
                            </template>
                        </td>
                        <td>
                            <template v-if="viewModel.userInfo.bplc_yn == 'N' || viewModel.userInfo.ocpt_detail_cd == 'MNG-01' || viewModel.userInfo.ocpt_detail_cd == 'MNG-02'">
                                <button v-if="item.edu_cmpl_yn != 'Y'" @click="fnCmpl(item.edu_sn, 'Y', item.aprvr3_atrz_yn, item.tot_cnt, item.y_cnt)" class="btn btn-small btn-blue" ><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-task-alt"></use></svg>교육완료</button>
                                <button v-else @click="fnCmpl(item.edu_sn, 'N', item.aprvr3_atrz_yn, item.tot_cnt, item.y_cnt)" class="btn btn-small btn-gray" ><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-task-alt"></use></svg>교육완료 취소</button>
                            </template>
                            <template v-else>
                                <span v-if="item.edu_cmpl_yn != 'Y'">-</span>
                                <span v-else>교육종료</span>
                            </template>
                        </td>
                        <td>{{ item.aprvr1_nm }}</td>
                        <td>
                            <div class="icon_box">
                                <router-link :to="{name:'etcHsEdcDetail',params:{uid:item.edu_sn,edu_se_cd:item.edu_se_cd , edu_detail_cd:item.edu_detail_cd == '' ? 'ED06-01' : item.edu_detail_cd}}" class="btn btn-icon"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-content-search"></use></svg></router-link>
                                <a href="javascript:;" v-if="viewModel.userInfo.user_id == item.reg_id" @click="fnUpdate(item)" class="btn btn-icon"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-edit-contents"></use></svg></a>
                                <a href="javascript:;" v-if="viewModel.userInfo.user_id == item.reg_id" @click="fndelete(item.edu_sn)" class="btn btn-icon"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-delete-sweep"></use></svg></a>
                            </div>
                        </td>
                    </tr>
                    <tr v-if="list.length ==0"><td :colspan="viewModel.userInfo.user_roles == 'ROLE_001' ? '15' : '14'">게시물이 없습니다.</td></tr>
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
                    </div>				
                    <a href="" class="btn btn-white"><i class="icon_excel"></i>엑셀업로드</a> -->
                    <router-link to="/write" href="javascript:;" class="btn btn-purple" 
                    v-if="viewModel.userInfo.ocpt_se_cd == 'MNG' || viewModel.userInfo.bplc_yn == 'N'"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-post-add"></use></svg>등록</router-link>
                    <!-- <a href="" class="btn btn-gray"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-trash-can"></use></svg>삭제</a> -->
                </div>
            </div>
        </div>
    </div>
    <ParticiPantListPopup ref="ParticiPantListPopup" v-if="ParticiPantListPopup==true" @close="close();"></ParticiPantListPopup>
    <ParticiPantPopup ref="ParticiPantPopup" v-if="ParticiPantPopup==true" @close="close();"></ParticiPantPopup>
    <EduPicpopup ref="EduPicpopup" v-if="EduPicpopup==true" @close="close();"></EduPicpopup>
    <Edumatpopup ref="Edumatpopup" v-if="filepopup==true" @close="close();"></Edumatpopup>
    <Aprvr_ment_popup ref="Aprvr_ment_popup" v-if="isaprvr==true" @close="close();"></Aprvr_ment_popup>
    <signPopup ref="signPopup" v-if="signPop==true" @close="close();"></signPopup>
</div>
</template>

<script>
    import "es6-promise/auto";
    import Vue from "vue";
    import Axios from "axios";
    import Pager from "../../../../common/vue/paging.vue";
    import ParticiPantListPopup from "./popup/ParticiPantListPopup.vue"; // 참석자명단 팝업
    import ParticiPantPopup from "./popup/ParticiPantPopup.vue"; // 참석자 팝업
    import Edumatpopup from "./popup/edu_mat_popup.vue"; // 교육교안 첨부 팝업
    import EduPicpopup from "./popup/edu_pic_popup.vue"; // 교육사진 첨부 팝업
    import Aprvr_ment_popup from "./popup/edu_aprvr_payment_popup.vue"; // 결제 팝업
    import signPopup from "./popup/edu_sign_popup.vue"; // 서명 팝업

    Vue.component('ParticiPantListPopup',ParticiPantListPopup);
    Vue.component('ParticiPantPopup',ParticiPantPopup);
    Vue.component('Edumatpopup',Edumatpopup);
    Vue.component('EduPicpopup',EduPicpopup);
    Vue.component('Aprvr_ment_popup',Aprvr_ment_popup);
    Vue.component('Aprvr_ment_popup',Aprvr_ment_popup);
    Vue.component('signPopup',signPopup);

    export default {
        components: {
            'pager': Pager,
        },
        data: function() {
            return {
                isaprvr:false,
                ParticiPantListPopup:false,
                ParticiPantPopup:false,
                filepopup:false,
                EduPicpopup:false,
                signPop:false,
                edu_cn:"",
                list:[],
                eduCodeList:[],
                eduCodeDetailList:[],
                edu_nm_ttl:"",
                selectEdu:"",
                selectEdu_se:"",
                searchBplcList:[],
                edu_bgng_hour:"",
                aprvr1_nm:"",
                edu_detail_etc:"",
                viewModel:{
                    userInfo:{},
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
                    search:{
                        bplc_sn:0,
                        bplc_use_yn:''
                    },
                }
            };
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
        mounted: function() {
            let vm = this;
            calendarInput();
            
            vm.fnSelectEdulist();
            vm.fnInit();
            
            vm.$router.afterEach((to, from) => {
                vm.fnList(vm.viewModel.pager.pageNo);
            });
        },
        methods: {
            fnInit:function(){
                let vm = this;
                vm.viewModel.userInfo = vm.$store.state.global.userInfo;
                vm.viewModel.search.bplc_use_yn = vm.viewModel.userInfo.bplc_yn == 'N' ? 'Y' : 'A';
                vm.viewModel.search.bplc_sn = (vm.viewModel.userInfo.bplc_yn == 'N' && (vm.viewModel.userInfo.bplc_sn == 0 || vm.viewModel.userInfo.bplc_use_yn == 'N')) ? '' : vm.viewModel.userInfo.bplc_sn;

                vm.fnList(vm.viewModel.pager.pageNo);
            },
            fnList:function(paramPageNo){
				let vm = this;
				
                vm.viewModel.pager.pageNo = paramPageNo == 0 ? 1 : paramPageNo;

                let send = {
                    pageNo:vm.viewModel.pager.pageNo,
                    pageSize:vm.viewModel.pager.rowSize,
                    edu_cn:vm.edu_cn,
                    edu_se_cd:vm.selectEdu,
                    edu_detail_cd:vm.selectEdu_se,
                    edu_nm_ttl:vm.edu_detail_etc,
                    user_id: vm.viewModel.userInfo.user_id,
                    bplc_yn: vm.viewModel.userInfo.bplc_yn,
                    edu_bgng_tm:vm.edu_bgng_hour,
                    aprvr1_nm:vm.aprvr1_nm,
                    edu_dt:$("#sdt").val(),
                    u_bplc_sn: vm.viewModel.search.bplc_sn,
                    bplc_use_yn: vm.viewModel.search.bplc_use_yn,
                    dept_sn: vm.viewModel.userInfo.dept_sn,
                    team_sn: vm.viewModel.userInfo.team_sn,
                }
                // if(vm.viewModel.userInfo.bplc_yn != "Y" && vm.viewModel.userInfo.bplc_sn == 0){ 
                //     send.u_bplc_sn = vm.viewModel.search.bplc_sn;
                // }else{
                //     send.u_bplc_sn = vm.viewModel.userInfo.bplc_sn;   
                // }
                Axios.post("/selectEdudcList.do", send)
                .then(function(response) {
                    vm.list = response.data.hsEdList;
                    vm.viewModel.pager.totalSize = response.data.totalCount;
                    //페이징세팅
                    Pager.props = Pager.methods.createPaging(vm.viewModel.pager, vm, "list");
                });
            },
            fnGetChangeSelectList: function(data){
                let vm = this;
                if(data != undefined || data > 0){
                    vm.viewModel.pager.rowSize = data;
                    vm.fnList(1);
                }
            },
            fnSelectEdulist:function(){
                let vm = this;
                Axios.post('/hsEd/code.do',{}).then(function(res){
                    vm.eduCodeList = res.data.hsEdList;
                });
            },
            fndelete:function(sn){
                let vm = this;
                if(confirm("삭제하시겠습니까?")){ //교육자료 관리 페이지와 테이블이 같음
                    Axios.post("/deleteWkRglHsEdc.do",{edu_sn:sn}).then(function(){
                        vm.fnInit();
                        alert("삭제를 완료하였습니다.");
                    })
                }else{
                    alert("삭제를 취소하였습니다.");
                }
            },
            fnUpdate: function(item){
                let vm = this;
                if(item.edu_cmpl_yn == 'Y'){
                    alert("교육이 완료되어 수정이 불가 합니다.");
                    return false;
                }else{
                    vm.$router.push('/write/'+ item.edu_sn);
                }
            },
            fnreset:function(){
                this.viewModel.search.bplc_sn = (this.viewModel.userInfo.bplc_yn == 'N' && (this.viewModel.userInfo.bplc_sn == 0 || this.viewModel.userInfo.bplc_use_yn == 'N')) ? "0" : this.viewModel.userInfo.bplc_sn;
                this.viewModel.search.bplc_use_yn = this.viewModel.userInfo.bplc_yn == 'N' ? 'Y' : 'A',
                this.selectEdu="";
                this.selectEdu_se="";
                this.edu_bgng_hour="";
                this.aprvr1_nm = "";
                $("#sdt").val("");

            },
            fnParticiPantPopup:function(sn, bplc_sn){
                let vm = this;
                vm.close(false);
                vm.ParticiPantPopup = true;
                vm.$nextTick(function() {
                    if(vm.ParticiPantPopup) {
                        vm.$refs.ParticiPantPopup.fnInit(sn, bplc_sn);
                    }
                })
            },
            fnfilepopup:function(sn,code){
                let vm = this;
                vm.EduPicpopup = false;
                vm.filepopup = false;
                vm.close(false);
                if(code == 1){
                    vm.EduPicpopup = true;
                    vm.$nextTick(function() {
                        if(vm.EduPicpopup) {
                            vm.$refs.EduPicpopup.fnInit(sn);
                        }
                    })
                }else{
                    vm.filepopup = true;
                    vm.$nextTick(function() {
                        if(vm.filepopup) {
                            vm.$refs.Edumatpopup.fnInit(sn);
                        }
                    })
                }
            },
            fnAprvrpopup:function(sn, no){
                let vm = this;
                vm.close(false);
                vm.isaprvr = true;
                vm.$nextTick(function() {
                    if(vm.isaprvr) {
                        vm.$refs.Aprvr_ment_popup.fnInit(sn, no);
                    }
                })
            },
            fnSignPop:function(sn, yn, cmpl_yn){
                let vm = this;

                vm.close(false);
                if(cmpl_yn == 'Y'){
                    alert("교육이 완료되어 참석확인이 불가합니다.");
                    return false;
                }

                vm.signPop = true;
                
                let sign_yn = yn == 'X' ? 'N' : yn;

                vm.$nextTick(function() {
                    if(vm.signPop) {
                        vm.$refs.signPopup.fnInit(sn, sign_yn);
                    }
                })
            },
            close:function(bool){
                this.ParticiPantListPopup = bool;
                this.ParticiPantPopup = bool;
                this.filepopup = bool;
                this.EduPicpopup = bool;
                this.isaprvr = bool;
                this.signPop = bool;
                this.fnList(this.viewModel.pager.pageNo);
            },
            fnCmpl: function(sn, yn, sign_yn, tot_cnt, y_cnt){
                let vm = this;

                if(tot_cnt == 0 && yn == 'Y'){
                    alert("참석자 확인이 진행되지 않아 교육 완료를 진행할 수 없습니다.");
                    return false;
                }else if(tot_cnt != y_cnt && yn == 'Y'){
                    // alert("참석자 확인이 완료되지 않아 교육완료를 진행할 수 없습니다.");
                    alert("참석자 확인이 완료되지 않아 교육 완료를 진행할 수 없습니다.");
                    return false;
                }else if(sign_yn == 'N' && yn == 'Y'){ //결재완료
                    alert("결재가 완료되지 않아 교육완료를 진행할 수 없습니다.");
                    return false;
                }else{
                    let data = {
                        edu_sn : sn,
                        edu_cmpl_yn: yn,
                        user_id: vm.viewModel.userInfo.user_id,
                    }
    
                    if(confirm(yn == 'Y' ? '교육완료처리를 하시겠습니까?' : '교육완료취소처리를 하시겠습니까?')){
                        Axios.post("/updateEduCmplYn.do", data).then(function(){
                            vm.fnInit();
                            alert(yn == 'Y' ? '교육완료되었습니다.' : '교육완료가 취소되었습니다.');
                        });
                    }
                }
            },
            fnParticiPantListPopup: function(sn){
                let vm = this;
                vm.close(false);
                vm.ParticiPantListPopup = true;
                vm.$nextTick(function() {
                    if(vm.ParticiPantListPopup) {
                        vm.$refs.ParticiPantListPopup.fnInit(sn);
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
                    vm.searchBplcList = rs.data.list;
                    
                    vm.viewModel.search.bplc_sn = "0";
                    if(vm.viewModel.userInfo.bplc_use_yn == 'Y' && vm.viewModel.search.bplc_use_yn == 'Y'){
                        vm.viewModel.search.bplc_sn = vm.viewModel.userInfo.bplc_sn == 0 ? "0" : vm.viewModel.userInfo.bplc_sn;
                    }
                });
            },
            fnEdu_Detail_Code:function(value){
                let vm = this;
                vm.selectEdu_se = "";
                vm.edu_detail_etc = "";
                if(value != 'EA06'){
                    Axios.post('/hsEd/detail/code.do',{edu_se_cd:value}).then(function(res){
                        vm.eduCodeDetailList = res.data.hsEdList;
                    })    
                }
            },
        }
    };
</script>