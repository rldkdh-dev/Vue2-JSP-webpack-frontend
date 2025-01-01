<template>
<div>
    <div class="search_area">
        <button class="btn_toggle_search">검색</button>
        <div>
            <div class="search_container">
                <div class="row">
                    <div class="input_group" style="width:20rem" v-if="viewModel.userInfo.user_roles == 'ROLE_001'">
                        <select id="list" v-model="viewModel.bplc_use_yn" class="wp28">
                            <option value="A">전체</option>
                            <option value="Y" selected="selected">운영</option>
                            <option value="N">종료</option>
                        </select>
                        <select title="현장명" v-model="viewModel.bplc_sn">
                            <option value=''>현장명 선택</option>
                            <option v-for="(item, i) in searchBplcList" :key="i" :value="item.bplc_sn">{{ item.bplc_nm }}</option>
                        </select>
                    </div>
                    <div class="datepicker_box">
                        <input type="text" class="datepicker" id="datepicker_s" placeholder="조회시작일" title="조회시작일" readonly>
                    </div>
                    <span>~</span>
                    <div class="datepicker_box">
                        <input type="text" class="datepicker" id="datepicker_e" placeholder="조회종료일" title="조회종료일" readonly>
                    </div>
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
                <caption>개선조치 계획 등록</caption>
                <thead>
                    <tr>
                        <th scope="col" class="w50">번호</th>
                        <th scope="col" v-if="viewModel.userInfo.user_roles == 'ROLE_001'">현장명</th>
                        <th scope="col">회의일시</th>
                        <th scope="col">회의장소</th>
                        <th scope="col">참석자</th>
                        <th scope="col">노사 합동점검</th>
                        <th scope="col">심의·의결사항</th>
                        <th scope="col">협의사항</th>
                        <th scope="col">건의사항</th>
                        <th scope="col">피드백</th>
                        <th scope="col">관리</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, i) in list" :key="i">
                        <td>{{ item.rownum }}</td>
                        <td class="text-left" v-if="viewModel.userInfo.user_roles == 'ROLE_001'">{{ item.bplc_nm }}</td>
                        <td>{{ item.mtg_dt }}</td>
                        <td>{{ item.mtg_plc }}</td>
                        <!-- 서명 -->
                        <td v-if="item.sign_yn != 'Y' && ((item.mng_mem_ck == 'true' || viewModel.userInfo.hdofc_mngr_yn == 'Y') || viewModel.userInfo.ocpt_se_cd == 'MNG')"><a href="javascript:void(0);" @click="fnPopup('sign', item.lbm_cfrnc_mtg_sn)" class="btn btn-small btn-blue" >서명</a></td>
                        <td v-else-if="item.sign_yn == 'Y' && ((item.mng_mem_ck == 'true' || viewModel.userInfo.hdofc_mngr_yn == 'Y') || viewModel.userInfo.ocpt_se_cd == 'MNG')"><a href="javascript:void(0);" class="btn btn-small btn-gray" >서명 완료</a></td> 
                        <td v-else>-</td>
                        <!-- 점검조회 -->
                        <td v-if="item.chck_ck == 'true' && ((item.mng_mem_ck == 'true' || viewModel.userInfo.hdofc_mngr_yn == 'Y') || viewModel.userInfo.ocpt_se_cd == 'MNG')"><a href="javascript:void(0);" class="btn btn-small btn-blue" @click="fnPopup('chck', item)">보기</a></td> <td v-else>-</td>
                        <!-- prgrs_sittn: 진행상황 (1.회의등록 / 2.심의,의결사항 등록 / 3.협의사항 등록 / 4.건의사항 등록 / 5.피드백 등록) -->
                        <td v-if="item.prgrs_sittn>=1 && item.sign_yn == 'Y' && ((item.mng_mem_ck == 'true' || viewModel.userInfo.hdofc_mngr_yn == 'Y') || viewModel.userInfo.ocpt_se_cd == 'MNG')"><a href="javascript:void(0);" class="btn btn-small btn-blue" @click="fnPopup('consider', item)">등록</a></td> <td v-else>-</td>
                        <td v-if="item.prgrs_sittn>=2 && item.sign_yn == 'Y' && ((item.mng_mem_ck == 'true' || viewModel.userInfo.hdofc_mngr_yn == 'Y') || viewModel.userInfo.ocpt_se_cd == 'MNG')"><a href="javascript:void(0);" class="btn btn-small btn-blue" @click="fnPopup('consult',  item)">등록</a></td> <td v-else>-</td>
                        <td v-if="item.prgrs_sittn>=3 && item.sign_yn == 'Y' && ((item.mng_mem_ck == 'true' || viewModel.userInfo.hdofc_mngr_yn == 'Y') || viewModel.userInfo.ocpt_se_cd == 'MNG')"><a href="javascript:void(0);" class="btn btn-small btn-blue" @click="fnPopup('suggest',  item)">등록</a></td> <td v-else>-</td>
                        <td v-if="item.prgrs_sittn>=3 && item.sign_yn == 'Y' && ((item.mng_mem_ck == 'true' || viewModel.userInfo.hdofc_mngr_yn == 'Y') || viewModel.userInfo.ocpt_se_cd == 'MNG')"><a href="javascript:void(0);" class="btn btn-small btn-blue" @click="fnPopup('feedback', item)">등록</a></td> <td v-else>-</td>
                        <td>
                            <router-link  v-if="item.sign_yn == 'Y' && item.prgrs_sittn>=3 && ((item.mng_mem_ck == 'true' || viewModel.userInfo.hdofc_mngr_yn == 'Y') || viewModel.userInfo.ocpt_se_cd == 'MNG')" :to="{name:'rgstPlImplActDetail', params:{sn:item.lbm_cfrnc_mtg_sn, b_sn:item.bplc_sn}}" class="btn btn-icon"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-content-search"></use></svg></router-link>
                            <!-- <router-link :to="'/update/'+item.chck_sn" class="btn btn-icon" v-if="item.reg_id == viewModel.userInfo.user_id"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-edit-contents"></use></svg></router-link> -->
                            <a href="#" v-if="item.reg_id == viewModel.userInfo.user_id" @click="fnDelete(item.lbm_cfrnc_mtg_sn, item.bplc_sn)" class="btn btn-icon"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-delete-sweep"></use></svg></a>
                        </td>
                    </tr>
                    <tr v-if="list.length == 0"><td :colspan="viewModel.userInfo.user_roles == 'ROLE_001' ? '11' : '10'">게시물이 없습니다.</td></tr>
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
                    <router-link to="/write" class="btn btn-purple"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-post-add"></use></svg>등록</router-link>
                </div>
            </div>
        </div>
    </div>
    <SignPopup ref="sign" v-if="signPopup==true"></SignPopup>
    <ChckPopup ref="chck" v-if="chckPopup==true" @close="fnClose"></ChckPopup>
    <SuggestPopup ref="suggest" v-if="suggestPopup==true" @close="fnClose"></SuggestPopup>
    <MeetingPopup ref="meeting" v-if="meetingPopup==true" @close="fnClose"></MeetingPopup>
</div>
</template>

<script>
    import "es6-promise/auto";
    import Vue from "vue";
    import Axios from "axios";
    import Pager from "../../../paging.vue";
    import Common from "../../../../common/js/common.js";
    import SignPopup from "../../popup/implPl_sign_popup.vue";
    import ChckPopup from "../../popup/implPl_chck_popup.vue";
    import SuggestPopup from "../../popup/implPl_suggest_popup.vue";
    import MeetingPopup from "../../popup/implPl_meeting_popup.vue";
    
    export default {
        components: {
            Pager, SignPopup, ChckPopup, SuggestPopup, MeetingPopup
        },
        data: function() {
            return {
                signPopup:false,
                chckPopup:false,
                suggestPopup:false,
                meetingPopup:false,
                list: [],
                searchBplcList: [],
                viewModel:{
                    userInfo:{},
                    bplc_sn : '',
                    bplc_use_yn : '',
                    bplc_nm : '',
                    mtg_bgn_dt : '',
                    mtg_end_dt : '',
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
        watch: {
            'viewModel.bplc_use_yn': {
                handler() {
                    let vm = this;
                    if(vm.viewModel.userInfo.user_roles == 'ROLE_001'){
                        vm.fnBplcList();
                    }
                }
            }
        },
        mounted: function() {
            let vt = this;
            let vm = this.viewModel;
                
            vm.userInfo = vt.$store.state.global.userInfo;
            vm.bplc_use_yn = vm.userInfo.bplc_yn == 'N' ? 'Y' : 'A';
            vm.bplc_sn = (vm.userInfo.bplc_yn == 'N' && (vm.userInfo.bplc_sn == 0 || vm.userInfo.bplc_use_yn == 'N')) ? '' : vm.userInfo.bplc_sn;
            
            vt.fnInit();
            vt.$router.afterEach((to, from) => {
                vt.fnList(vt.viewModel.pager.pageNo);
            });
            calendarInput();
        },
        methods: {
            fnInit:function(){
                let vt = this;
                
                vt.signPopup = false;
                vt.fnBplcList();
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
                
                vm.mtg_bgn_dt = $("#datepicker_s").val();
                vm.mtg_end_dt = $("#datepicker_e").val();
                
                let data = {
                    bplc_sn : vm.userInfo.bplc_sn,
                    bplc_use_yn : vm.bplc_use_yn,
                    user_bplc_sn : vm.userInfo.bplc_sn,
                    bplc_yn : vm.userInfo.bplc_yn,
                    mtg_bgn_dt : (vm.mtg_bgn_dt == '') ? null : vm.mtg_bgn_dt,
                    mtg_end_dt : (vm.mtg_end_dt == '') ? null : vm.mtg_end_dt,
                    mtg_cn : (vm.mtg_cn == '') ? null : vm.mtg_cn,
                    user_id : vm.userInfo.user_id,
                    lbm_cfrnc_mtg_sn : null, //상세화면 조회와 리스트 조회 구분 기준
                    dept_sn: vm.userInfo.dept_sn,
                    team_sn: vm.userInfo.team_sn,
                    pageNo: vm.pager.pageNo,
					pageSize: vm.pager.rowSize,
                }
                Axios.post("/selectMauImplPlActList.do", data)
                .then(function(response) {
                    vt.list = response.data.list;
                    // vt.searchBplcList = response.data.searchBplcList;
					vm.pager.totalSize = response.data.totalCount;

                    for(let i=0; i<vt.list.length; i++){
                        vt.list[i].mtg_dt = (Common.fnDateTimeStr(vt.list[i].mtg_dt));
                    }
                    //페이징세팅
                    Pager.props = Pager.methods.createPaging(vm.pager, vt, "list");
                });
            },
            //페이지 목록
            fnReset:function(){
                let vm = this.viewModel;
                vm.bplc_use_yn = vm.userInfo.bplc_yn == 'N' ? 'Y' : 'A';
                vm.bplc_sn = (vm.userInfo.bplc_yn == 'N' && (vm.userInfo.bplc_sn == 0 || vm.userInfo.bplc_use_yn == 'N')) ? '' : vm.userInfo.bplc_sn;
                vm.mtg_bgn_dt = '';
                vm.mtg_end_dt = '';
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
            //팝업
            fnPopup:function(value, item){//value:명칭, item:데이터
                let vt = this;
                let vm = this.viewModel;
                vm.lbm_cfrnc_mtg_sn = item.lbm_cfrnc_mtg_sn;
                vt.signPopup = false;
                vt.chckPopup = false;
                vt.suggestPopup = false;
                vt.meetingPopup = false;

                setTimeout(()=>{
                    if(value == 'sign'){
                        vt.signPopup = true;

                        vt.$nextTick(function() {
                            if(vt.signPopup) {
                                vt.$refs.sign.fnInit(item);
                            }
                        })
                    }if(value == 'chck'){
                        vt.chckPopup = true;

                        vt.$nextTick(function() {
                            if(vt.chckPopup) {
                                vt.$refs.chck.fnInit(item);
                            }
                        })
                    }if(value == 'consider'){
                        vt.meetingPopup = true;

                        vt.$nextTick(function() {
                            if(vt.meetingPopup) {
                                vt.$refs.meeting.fnInit(item, value);
                            }
                        })
                    }if(value == 'consult'){
                        vt.meetingPopup = true;

                        vt.$nextTick(function() {
                            if(vt.meetingPopup) {
                                vt.$refs.meeting.fnInit(item, value);
                            }
                        })
                    }if(value == 'suggest'){
                        vt.suggestPopup = true;

                        vt.$nextTick(function() {
                            if(vt.suggestPopup) {
                                vt.$refs.suggest.fnInit(item);
                            }
                        })
                    }if(value == 'feedback'){
                        vt.meetingPopup = true;

                        vt.$nextTick(function() {
                            if(vt.meetingPopup) {
                                vt.$refs.meeting.fnInit(item, value);
                            }
                        })
                    }
                }, 10)
                    
            },
            fnClose:function(value){
			    let vt = this;
                vt.signPopup = value;
                vt.chckPopup = value;
                vt.suggestPopup = value;
                vt.meetingPopup = value;
            },

            fnDelete:function(sn_param, b_sn_param){
                let vm = this.viewModel;

                if(confirm("삭제하시겠습니까?")){ 
                    let data = {
                        lbm_cfrnc_mtg_sn : sn_param,
                        bplc_sn : b_sn_param,
                        user_id : vm.userInfo.user_id
                    }
                    Axios.post("/deleteMauImplPlAct.do", data).then(function(res){
                        console.log(res);
                    }).catch(function(ex) {
                        console.log(ex);
                    });
                    window.location.reload(); 
                }
            },
            fnBplcList: function() { //사업장 리스트 추출(검색)
                let vm = this;

                let data = {
                    mapperId: 'comm.selectAllBplcList',
                    bplc_use_yn: vm.viewModel.bplc_use_yn,
                    dept_sn: vm.viewModel.userInfo.dept_sn,
                    team_sn: vm.viewModel.userInfo.team_sn,
                };
                Axios.post("/list.do", data).then(function (rs) {
                    vm.searchBplcList = rs.data.list;

                    vm.viewModel.bplc_sn = '';
                    if(vm.viewModel.userInfo.bplc_use_yn == 'Y' && vm.viewModel.bplc_use_yn == 'Y'){
                        vm.viewModel.bplc_sn = vm.viewModel.userInfo.bplc_sn == 0 ? '' : vm.viewModel.userInfo.bplc_sn;
                    }
                });
            },
        }
    };
</script>