<template>
<div>
    <div class="contents write">
        <!-- <div class="table_top btn-right write_area">
            <a href="javascript:void(0);" class="btn btn-light-purple" @click="fnDsstrAdd('user')" v-if="modifyMode"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-group-add"></use></svg>사용자 위원 추가</a>
            <a href="javascript:void(0);" class="btn btn-gray" @click="fnDsstrSub('user')" v-if="modifyMode"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-trash-can"></use></svg>사용자 위원 삭제</a>
            <a href="javascript:void(0);" class="btn btn-light-purple" @click="fnDsstrAdd('worker')" v-if="modifyMode"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-group-add"></use></svg>근로자 위원 추가</a>
            <a href="javascript:void(0);" class="btn btn-gray" @click="fnDsstrSub('worker')" v-if="modifyMode"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-trash-can"></use></svg>근로자 위원 삭제</a>
        </div> -->
        <div style="padding:0px 0px 30px 0px;">
            <h3>조직도 현장</h3>
            <table class="table horizontal write">
                <tbody>
                    <tr>
                        <th scope="row" class="w180"><label for="">현장</label></th>
                        <td v-if="viewModel.userInfo.hdofc_mngr_yn != 'Y'">
                            <div class="input_group">
                                {{ viewModel.bplc_nm }}
                            </div>
                        </td>
                        <td v-if="viewModel.userInfo.user_roles == 'ROLE_001'">
                            <!-- <div class="input_btn">
                                <input type="text" id="bplc_nm" v-model="viewModel.bplc_nm" disabled>    
                                <input type="hidden" v-if="viewModel.bplc_sn" id="bplc" v-model="viewModel.bplc_sn">
                                <button @click="fnBplcPopup();" v-if="viewModel.userInfo.hdofc_mngr_yn =='Y'"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-search"></use></svg></button>
                            </div> -->
                            <div class="input_group" style="width:20rem">
                                <select id="list" v-model="viewModel.bplc_use_yn" class="wp28">
                                    <option value="A">전체</option>
                                    <option value="Y" selected="selected">운영</option>
                                    <option value="N">종료</option>
                                </select>
                                <select title="현장명" v-model="viewModel.bplc_sn" @change="fnInit()">
                                    <option value="" disabled>현장명 선택</option>
                                    <option :value=item.bplc_sn v-for="(item, i) in searchBplcList" :key=i >{{ item.bplc_nm }}</option>
                                </select>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="organ-chart">
            <ol>
                <li>
                    <div class="lv1 children">
                        <h5 class="purple">사용자 대표</h5>
                        <ul>
                            <li>
                                <span>{{ viewModel.data.user_rprs_nm }}</span>
                                <span v-if="!viewModel.data.user_rprs_aprvr" ><a href="javascript:void(0);">-</a></span>
                                <span v-if="viewModel.data.user_rprs_aprvr" ><img :src="viewModel.data.user_rprs_aprvr" style="height:30px; width:auto;"></span>
                            </li>
                        </ul>
                    </div>
                    <ol class="branch">
                        <li>
                            <div class="lv2 children">
                                <h5 class="green">안전관리자 1인 ( 안전관리자 )</h5>
                                <ul>
                                    <li v-if="modifyMode">
                                        <span class="input_btn">
                                            <input type="text" id="" v-model="viewModel.data.sfmngr_1man_nm" disabled>    
                                            <button @click="fnUserPopup('sfmngr_1man', 0);"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-search"></use></svg></button>
                                        </span>
                                        <span v-if="!viewModel.data.sfmngr_1man_aprvr" ><a href="javascript:void(0);">-</a></span>
                                        <span v-if="viewModel.data.sfmngr_1man_aprvr" ><img :src="viewModel.data.sfmngr_1man_aprvr" style="height:30px; width:auto;"></span>
                                    </li>
                                    <li v-if="!modifyMode">
                                        <span>{{ viewModel.data.sfmngr_1man_nm }}</span>
                                        <span v-if="!viewModel.data.sfmngr_1man_aprvr" ><a href="javascript:void(0);">-</a></span>
                                        <span v-if="viewModel.data.sfmngr_1man_aprvr" ><img :src="viewModel.data.sfmngr_1man_aprvr" style="height:30px; width:auto;"></span>
                                    </li>
                                </ul>
                            </div>
                            <ol>
                                
                                <li>
                                    <div class="last">
                                        <div class="btn-group btn-right">
                                            <button href="javascript:void(0);" class="btn btn-white" @click="fnDsstrAdd()" v-if="modifyMode"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-group-add"></use></svg>추가</button>
                                            <button href="javascript:void(0);" class="btn btn-gray" @click="fnDsstrSub()" v-if="modifyMode"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-trash-can"></use></svg>삭제</button>
                                        </div>
                                        <div>
                                            <h5>사용자 위원</h5>
                                            <ul v-if="modifyMode">
                                                <li class="title">
                                                    <span>직종</span>
                                                    <span>성명</span>
                                                    <span>서명</span>
                                                </li>
                                                <li  v-for="(item, i) in viewModel.user_member" :key="i">
                                                    <span><input type="text" id="" v-model="item.ocpt_detail_nm" disabled></span>
                                                    <span class="input_btn">
                                                            <input type="text" id="" v-model="item.user_nm" disabled>    
                                                            <button @click="fnUserPopup('user_member', i);"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-search"></use></svg></button>
                                                    </span>
                                                    <span>
                                                        <span v-if="item.sign_yn != 'Y'"><a href="javascript:void(0);">-</a></span>
                                                        <span v-else-if="!item.user_aprvr && item.sign_yn == 'Y'"><a href="javascript:void(0);">서명 완료</a></span>
                                                        <span v-else-if="item.user_aprvr && item.sign_yn == 'Y'" ><img :src="item.user_aprvr" style="height:30px; width:auto;"></span>
                                                        <!-- <img src="../../img/user3_sign.png" alt="서명"> -->
                                                    </span>
                                                </li>
                                            </ul>
                                            <ul v-if="!modifyMode">
                                                <li class="title">
                                                    <span>직종</span>
                                                    <span>성명</span>
                                                    <span>서명</span>
                                                </li>
                                                <li v-for="(item, i) in viewModel.user_member" :key="i">
                                                    <span>{{ item.ocpt_detail_nm }}</span>
                                                    <span>{{ item.user_nm }}</span>
                                                    <span>
                                                        <!-- <span><a href="javascript:void(0);">서명</a></span> -->
                                                        <span v-if="item.sign_yn != 'Y' && item.mfcmm != viewModel.userInfo.user_id"><a href="javascript:void(0);">-</a></span>
                                                        <span v-else-if="item.sign_yn != 'Y' && item.mfcmm == viewModel.userInfo.user_id" @click="fnSign('Y', item)" class="btn btn-small btn-sign"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-signature"></use></svg>서명</span>
                                                        <span v-else-if="!item.user_aprvr && item.sign_yn == 'Y'"><a href="javascript:void(0);">서명 완료</a></span>
                                                        <span v-else-if="item.user_aprvr && item.sign_yn == 'Y'" ><img :src="item.user_aprvr" style="height:30px; width:auto;"></span>
                                                    </span>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </li>
                            </ol>
                        </li>
                    </ol>
                </li>
                <li>
                    <div class="lv1 children">
                        <h5 class="blue">근로자 대표</h5>
                        <ul>
                            <li>
                                <span>{{ viewModel.data.wrkr_rprs_nm }}</span>
                                <span v-if="!viewModel.data.wrkr_rprs_aprvr" ><a href="javascript:void(0);">-</a></span>
                                <span v-if="viewModel.data.wrkr_rprs_aprvr" ><img :src="viewModel.data.wrkr_rprs_aprvr" style="height:30px; width:auto;"></span>
                            </li>
                        </ul>
                    </div>
                    <ol>
                        
                        <li>
                            <div class="lv2 children">
                                <h5 class="cyan">근로자 대표 지정 1인 ( 근로자 위원 )</h5>
                                <ul>
                                    <li v-if="modifyMode">
                                        <span class="input_btn">
                                            <input type="text" id="" v-model="viewModel.data.wrkr_rprs_dsgn_1man_nm" disabled>    
                                            <button @click="fnUserPopup('wrkr_rprs_dsgn_1man', 0);"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-search"></use></svg></button>
                                        </span>
                                        <span v-if="!viewModel.data.wrkr_rprs_dsgn_1man_aprvr" ><a href="javascript:void(0);">-</a></span>
                                        <span v-if="viewModel.data.wrkr_rprs_dsgn_1man_aprvr" ><img :src="viewModel.data.wrkr_rprs_dsgn_1man_aprvr" style="height:30px; width:auto;"></span>
                                    </li>
                                    <li v-if="!modifyMode">
                                        <span>{{ viewModel.data.wrkr_rprs_dsgn_1man_nm }}</span>
                                        <span v-if="!viewModel.data.wrkr_rprs_dsgn_1man_aprvr" ><a href="javascript:void(0);">-</a></span>
                                        <span v-if="viewModel.data.wrkr_rprs_dsgn_1man_aprvr" ><img :src="viewModel.data.wrkr_rprs_dsgn_1man_aprvr" style="height:30px; width:auto;"></span>
                                    </li>
                                </ul>
                            </div>
                            <ol>
                                <li>
                                    <div class="last">
                                        <div class="btn-group btn-right">
                                            <button href="javascript:void(0);" class="btn btn-white" @click="fnDsstrAdd()" v-if="modifyMode"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-group-add"></use></svg>추가</button>
                                            <button href="javascript:void(0);" class="btn btn-gray" @click="fnDsstrSub()" v-if="modifyMode"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-trash-can"></use></svg>삭제</button>
                                        </div>
                                        <div>
                                            <h5>근로자 위원</h5>
                                            <ul v-if="modifyMode">
                                                <li class="title">
                                                    <span>업체명</span>
                                                    <span>성명</span>
                                                    <span>서명</span>
                                                </li>
                                                <li v-for="(item, i) in viewModel.worker_member" :key="i">
                                                    <span><input type="text" id="" v-model="item.ccpy_nm"></span>
                                                    <!-- <span><input type="text" id="" v-model="item.mfcmm"> </span> -->
                                                    <span class="input_btn">
                                                            <input type="text" id="" v-model="item.user_nm" disabled>   
                                                            <button @click="fnUserPopup('worker_member', i);"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-search"></use></svg></button>
                                                    </span>
                                                    <span>
                                                        <!-- <span v-if="item.sign_yn != 'Y' && item.sign_yn != null" @click="fnSign('Y', item)" class="btn btn-small btn-sign"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-signature"></use></svg>서명</span>
                                                        <span v-else-if="item.sign_yn == 'Y'"><a href="javascript:void(0);">서명 완료</a></span>
                                                        <span v-else><a href="javascript:void(0);">-</a></span> -->
                                                        <span v-if="item.sign_yn != 'Y'"><a href="javascript:void(0);">-</a></span>
                                                        <span v-else-if="!item.user_aprvr && item.sign_yn == 'Y'"><a href="javascript:void(0);">서명 완료</a></span>
                                                        <span v-else-if="item.user_aprvr && item.sign_yn == 'Y'" ><img :src="item.user_aprvr" style="height:30px; width:auto;"></span>
                                                    </span>
                                                </li>
                                            </ul>
                                            <ul v-if="!modifyMode">
                                                <li class="title">
                                                    <span>업체명</span>
                                                    <span>성명</span>
                                                    <span>서명</span>
                                                </li>
                                                <li v-for="(item, i) in viewModel.worker_member" :key="i">
                                                    <span>{{ item.ccpy_nm }}</span>
                                                    <span>{{ item.user_nm }}</span>
                                                    <span>
                                                        <!-- <span v-if="item.sign_yn != 'Y'"><a href="javascript:void(0);">-</a></span>
                                                        <span v-else-if="item.sign_yn == 'Y'"><a href="javascript:void(0);">서명 완료</a></span> -->
                                                        <span v-if="item.sign_yn != 'Y' && item.mfcmm != viewModel.userInfo.user_id"><a href="javascript:void(0);">-</a></span>
                                                        <span v-else-if="item.sign_yn != 'Y' && item.mfcmm == viewModel.userInfo.user_id" @click="fnSign('Y', item)" class="btn btn-small btn-sign"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-signature"></use></svg>서명</span>
                                                        <span v-else-if="!item.user_aprvr && item.sign_yn == 'Y'"><a href="javascript:void(0);">서명 완료</a></span>
                                                        <span v-else-if="item.user_aprvr && item.sign_yn == 'Y'" ><img :src="item.user_aprvr" style="height:30px; width:auto;"></span>
                                                    </span>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </li>
                            </ol>
                        </li>
                    </ol>
                </li>
            </ol>
        </div>
        <div class="table_footer btn-right" v-if="viewModel.data.wrkr_rprs">
            <a href="#" class="btn btn-purple" @click="fnModify()" v-if="!modifyMode"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-post-add"></use></svg>편집하기</a>
            <a href="#" class="btn btn-gray" @click="fnModify()" v-if="modifyMode"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-delete-circle"></use></svg>취소하기</a>
            <a href="#" class="btn btn-purple" @click="fnSave()" v-if="modifyMode"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-save"></use></svg>저장하기</a>
        </div>
    </div>
    <!-- <userPopup ref="user_u" v-if="userPop_u==true" :pass="{title:'사용자 위원', dept_sn: viewModel.userInfo.dept_sn, team_sn: viewModel.userInfo.team_sn, multi:'Y', bplc_yn:'Y', bplc_sn: viewModel.userInfo.bplc_sn}"></userPopup> -->
    <userPopup ref="user_u" v-if="userPop_u==true" :pass="{title:'사용자 위원', bplc_yn:'Y', bplc_sn: viewModel.bplc_sn, wrk_yn: 'N'}"></userPopup> 
    <userPopup ref="user_w" v-if="userPop_w==true" :pass="{title:'근로자 위원', bplc_yn:'Y', bplc_sn: viewModel.bplc_sn, wrk_yn: 'Y'}"></userPopup>
    <userPopup ref="user_s1" v-if="userPop_s1==true" :pass="{title:'안전관리자', bplc_yn:'Y', bplc_sn: viewModel.bplc_sn, wrk_yn: 'N'}"></userPopup>
    <userPopup ref="user_w1" v-if="userPop_w1==true" :pass="{title:'근로자 대표 지정 위원', bplc_yn:'Y', bplc_sn: viewModel.bplc_sn, wrk_yn: 'Y'}"></userPopup>
    <bplcPopup ref="bplc" v-if="bplcPop==true" :pass="{dept_sn: viewModel.userInfo.dept_sn, team_sn: viewModel.userInfo.team_sn}"></bplcPopup>
</div>
</template>

<script>
    import "es6-promise/auto";
    import Vue from "vue";
    import Axios from "axios";
    import UserPopup from "../../popup/user_popup.vue";
    import BplcPopup from "../../popup/bplc_popup.vue";
    
    export default {
        components: {
            UserPopup, BplcPopup
        },
        data: function() {
            return {
                modifyMode:false,
                userPop_u:false,
                userPop_w:false,
                userPop_s1:false,
                userPop_w1:false,
                bplcPop:false,
                viewModel:{
                    bplc_use_yn:'',
                    bplc_sn:'',
                    bplc_nm:'',
                    userInfo:{},
                    data:{},
                    user_member:[],
                    worker_member:[],
                },
                searchBplcList:[]
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
            vm.bplc_nm = vm.userInfo.bplc_yn == 'Y' ? vm.userInfo.bplc_nm : '';
            vt.fnInit();
        },
        methods: {
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
            fnInit:function(){
                let vt = this;
				let vm = this.viewModel;
				
                let data = {
                    bplc_sn : vm.bplc_sn,
                    user_id : vm.userInfo.user_id
                }
                
                //조직도 초기화
                vm.data = {};
                vm.user_member = [];
                vm.worker_member = [];
                vt.modifyMode = false;

                Axios.post("/selectMauMngmtCmtCg.do", data).then(function(response) {
                    if(vm.bplc_sn != 0 && vm.bplc_sn != null){
                        if(response.data.chart == null){
                            //사용자 대표 정보 세팅
                            if(response.data.user != null){
                                vm.data = response.data.user;
                                if(vm.data.user_rprs_aprvr_path){ vm.data.user_rprs_aprvr = (vm.data.user_rprs_aprvr_path.charAt() == '/' ? vm.data.user_rprs_aprvr_path : vm.data.user_rprs_aprvr_path.substr(2)); }
                            }else if(response.data.user == null && response.data.wrkr != null){
                                alert("해당 현장에는 사용자 대표 정보가 없습니다."); //사용자대표는 현장소장 정보
                            }
    
                            //근로자 대표 당선자 여부 
                            if(response.data.wrkr != null){
                                alert("등록된 조직도가 없습니다.");
                            }else if(response.data.wrkr == null && response.data.user != null){
                                alert("해당 현장에는 당선된 근로자대표가 없습니다. \n근로자 대표 투표를 진행해주시기 바랍니다.");
                                // if(vm.userInfo.hdofc_mngr_yn != 'Y'){
                                //     window.location.href="/rawWk/mau/implPl.do#/";
                                // }
                            }

                            if(response.data.user == null && response.data.wrkr == null){
                                alert("해당 현장에는 사용자 대표 정보와 당선된 근로자대표가 없습니다.");
                            }
                        }else{
                            vm.data = response.data.chart;
                            if(response.data.memberList.length > 0){
                                for(let i=0; i<response.data.memberList.length; i++){
                                    if(response.data.memberList[i].mfcmm_se == '1'){//사용자 위원
                                        vm.user_member.push(response.data.memberList[i]);
                                    }else if(response.data.memberList[i].mfcmm_se == '2'){//근로자 위원
                                        vm.worker_member.push(response.data.memberList[i]);
                                    }
                                }
                                //사용자 위원 서명
                                for(let i=0; i<vm.user_member.length; i++){
                                    if(vm.user_member[i].user_aprvr_path != null){
                                        vm.user_member[i].user_aprvr = (vm.user_member[i].user_aprvr_path.charAt() == '/' ? vm.user_member[i].user_aprvr_path : vm.user_member[i].user_aprvr_path.substr(2)); 
                                    }
                                }
                                //근로자 위원 서명
                                for(let i=0; i<vm.worker_member.length; i++){
                                    if(vm.worker_member[i].user_aprvr_path != null){
                                        vm.worker_member[i].user_aprvr = (vm.worker_member[i].user_aprvr_path.charAt() == '/' ? vm.worker_member[i].user_aprvr_path : vm.worker_member[i].user_aprvr_path.substr(2)); 
                                    }
                                }
                                //서명 (사용자 대표, 근로자 대표, 안전관리자, 근로자 위원)
                                if(vm.data.user_rprs_aprvr_path){ vm.data.user_rprs_aprvr = (vm.data.user_rprs_aprvr_path.charAt() == '/' ? vm.data.user_rprs_aprvr_path : vm.data.user_rprs_aprvr_path.substr(2)); }
                                if(vm.data.wrkr_rprs_aprvr_path){ vm.data.wrkr_rprs_aprvr = (vm.data.wrkr_rprs_aprvr_path.charAt() == '/' ? vm.data.wrkr_rprs_aprvr_path : vm.data.wrkr_rprs_aprvr_path.substr(2)); }
                                if(vm.data.sfmngr_1man_aprvr_path){ vm.data.sfmngr_1man_aprvr = (vm.data.sfmngr_1man_aprvr_path.charAt() == '/' ? vm.data.sfmngr_1man_aprvr_path : vm.data.sfmngr_1man_aprvr_path.substr(2)); }
                                if(vm.data.wrkr_rprs_dsgn_1man_aprvr_path){ vm.data.wrkr_rprs_dsgn_1man_aprvr = (vm.data.wrkr_rprs_dsgn_1man_aprvr_path.charAt() == '/' ? vm.data.wrkr_rprs_dsgn_1man_aprvr_path : vm.data.wrkr_rprs_dsgn_1man_aprvr_path.substr(2)); }
    
                            }   
                        }
                    }
                    vt.$nextTick(function() {
                        if(vm.user_member.length == 0){
                            vm.user_member.push({}); 
                        }if(vm.worker_member.length == 0){
                            vm.worker_member.push({}); 
                        }
                    })
                });
            },
            fnModify:function(){
                let vt = this;
                if(vt.modifyMode){
                    vt.modifyMode = false;
                    window.location.reload();
                }else if(!vt.modifyMode){
                    vt.modifyMode = true;
                }
            },
            fnSave:function(){
                let vt = this;
				let vm = this.viewModel;
                let frm = new FormData();
				let data_m = [];
                let data = {
                    bplc_sn : vm.data.bplc_sn,
                    lbm_cfrnc_sn : vm.data.lbm_cfrnc_sn,
                    user_rprs : vm.data.user_rprs,
                    wrkr_rprs : vm.data.wrkr_rprs,
                    sfmngr_1man : vm.data.sfmngr_1man,
                    wrkr_rprs_dsgn_1man : vm.data.wrkr_rprs_dsgn_1man,
                    reg_id : vm.userInfo.user_id
                }
                for(let i=0; i<vm.user_member.length; i++){
                    data_m.push({
                        bplc_sn : vm.data.bplc_sn,
                        lbm_cfrnc_sn : vm.data.lbm_cfrnc_sn,
                        user_mfcmm_sn : vm.user_member[i].user_mfcmm_sn, //위원_일련번호
                        mfcmm_se : 1 , //위원구분 (1.사용자 , 2.근로자)
                        sign_yn : 'N',
                        mfcmm : vm.user_member[i].mfcmm,//사용자 위원 id
                        reg_id : vm.userInfo.user_id
                    })
                }
                for(let i=0; i<vm.worker_member.length; i++){
                    data_m.push({
                        bplc_sn : vm.data.bplc_sn,
                        lbm_cfrnc_sn : vm.data.lbm_cfrnc_sn,
                        user_mfcmm_sn : vm.worker_member[i].user_mfcmm_sn, //위원_일련번호
                        mfcmm_se : 2 , //위원구분 (1.사용자 , 2.근로자)
                        sign_yn : 'N',
                        ccpy_nm : vm.worker_member[i].ccpy_nm , //협력업체명
                        mfcmm : vm.worker_member[i].mfcmm,//근로자 위원 id
                        reg_id : vm.userInfo.user_id
                    })
                }
                
                if(vm.data.sfmngr_1man == undefined || vm.data.sfmngr_1man == null){
                    alert("안전관리자가 등록되지 않았습니다.");
                    return false;
                }else if(vm.data.wrkr_rprs_dsgn_1man == undefined || vm.data.wrkr_rprs_dsgn_1man == null){
                    alert("근로자 대표 지정 1인이 등록되지 않았습니다.");
                    return false;
                }

                for(let i=0; i<vm.user_member.length; i++){
                    if(vm.user_member[i].mfcmm == '' || vm.user_member[i].mfcmm == null){
                        alert("등록되지 않은 사용자 위원이 있습니다.");
                        return false;
                    }else if(vm.worker_member[i].mfcmm == '' || vm.worker_member[i].mfcmm == null){
                        alert("등록되지 않은 근로자 위원이 있습니다.");
                        return false;
                    }
                }
            
                if(vm.user_member.length < 0 && vm.worker_member.length < 0){
                    alert("사용자 위원과 근로자 위원 수는 1명 이상이어야 합니다.");
                    return false;
                }else{
                    if(confirm("조직도 정보를 등록 하시겠습니까?")){
                        // let sendData = {
                        //     data : data,
                        //     data_m : data_m
                        // }
                        frm.append('data', new Blob([ JSON.stringify(data) ], {type : "application/json"}));
                        frm.append('data_m', new Blob([ JSON.stringify(data_m) ], {type : "application/json"}));
    
                        Axios.post("/updateMauMngmtCmtCg.do", frm).then(function(res){
                            console.log(res);
                            if(res.data > 0){
                                alert("등록 되었습니다.");
                                window.location.reload();
                            }else{
                                alert("등록이 중단되었습니다.");
                                window.location.reload();
                            }
                        }).catch(function(ex) {
                            console.log(ex);
                        });
                    }
                }
            },
            fnDsstrAdd:function(value){
                let vt = this;
                vt.viewModel.user_member.push({});
                vt.viewModel.worker_member.push({});
            },
            fnDsstrSub:function(value){
                let vt = this;
                    if(vt.viewModel.user_member.length == 0 || vt.viewModel.worker_member.length == 0){
                        vt.viewModel.user_member = [];
                        vt.viewModel.worker_member = [];
                        return false;
                    }
                    if(vt.viewModel.user_member.length > 1 || vt.viewModel.worker_member.length > 1){
                        vt.viewModel.user_member.splice((vt.viewModel.user_member.length-1) ,1);
                        vt.viewModel.worker_member.splice((vt.viewModel.worker_member.length-1) ,1);
                    }
            },
            fnUserPopup: function(value, index){
                let vt = this;
                vt.userPop_u = false;
                vt.userPop_w = false;
                vt.userPop_s1 = false;
                vt.userPop_w1 = false;

                if(value == 'user_member'){ //사용자 위원
                    vt.userPop_u = true;
                    vt.user_mem_index = index;
                    vt.$nextTick(function() {
                        if(vt.userPop_u) {
                            vt.$refs.user_u.fnInit();
                        }
                    })
                }if(value == 'worker_member'){ //근로자 위원
                    vt.userPop_w = true;
                    vt.worker_mem_index = index;
                    vt.$nextTick(function() {
                        if(vt.userPop_w) {
                            vt.$refs.user_w.fnInit();
                        }
                    })
                }if(value == 'sfmngr_1man'){ //안전관리자 1인
                    vt.userPop_s1 = true;
                    vt.$nextTick(function() {
                        if(vt.userPop_s1) {
                            vt.$refs.user_s1.fnInit();
                        }
                    })
                }if(value == 'wrkr_rprs_dsgn_1man'){ //근로자대표 1인
                    vt.userPop_w1 = true;
                    vt.$nextTick(function() {
                        if(vt.userPop_w1) {
                            vt.$refs.user_w1.fnInit();
                        }
                    })
                }
            },
            fnMemberAdd: function(item){
                let vt = this;
                let vm = this.viewModel;

                if(vt.userPop_u || vt.userPop_s1){
                    if(item.user_id == vm.data.user_rprs){
                        alert("사용자 대표에 등록되어 추가할 수 없습니다.");
                        return false;
                    }
                    
                    if(item.user_id == vm.data.sfmngr_1man){
                        alert("안전관리자에 등록되어 추가할 수 없습니다.");
                        return false;
                    }

                    if(vm.user_member.length > 0){
                        for(let i=0; i<vm.user_member.length; i++){
                            if(vm.user_member[i].mfcmm == item.user_id){
                                alert("사용자 위원에 등록되어 추가 할 수 없습니다.");
                                return false;
                            }
                        }
                    }
                }

                if(vt.userPop_w || vt.userPop_w1){
                    if(item.user_id == vm.data.wrkr_rprs){
                        alert("근로자 대표에 등록되어 추가할 수 없습니다.");
                        return false;
                    }
                    
                    if(item.user_id == vm.data.wrkr_rprs_dsgn_1man){
                        alert("근로자 대표 지정 1인에 등록되어 추가할 수 없습니다.");
                        return false;
                    }

                    if(vm.worker_member.length > 0){
                        for(let i=0; i<vm.worker_member.length; i++){
                            if(vm.worker_member[i].mfcmm == item.user_id){
                                alert("근로자 위원에 등록되어 추가 할 수 없습니다.");
                                return false;
                            }
                        }
                    }
                }

                // if(vm.user_member.length > 0){
                //     for(let i=0; i<vm.user_member.length; i++){
                //         if(vm.user_member[i].mfcmm == item.user_id){
                //             alert("동일한 사용자 위원이 있습니다.");
                //             return false;
                //         }
                //     }
                // }if(vm.worker_member.length > 0){
                //     for(let i=0; i<vm.worker_member.length; i++){
                //         if(vm.worker_member[i].mfcmm == item.user_id){
                //             alert("동일한 근로자 위원이 있습니다.");
                //             return false;
                //         }
                //     }
                // }

                if(vt.userPop_u && !vt.userPop_w && !vt.userPop_s1 && !vt.userPop_w1){//사용자 위원
                    vm.user_member[vt.user_mem_index].mfcmm = item.user_id;
                    vm.user_member[vt.user_mem_index].user_nm = item.user_nm;
                    vm.user_member[vt.user_mem_index].ocpt_detail_nm = item.ocpt_detail_nm;
                    vt.userPop_u = false;
                }if(!vt.userPop_u && vt.userPop_w && !vt.userPop_s1 && !vt.userPop_w1){//근로자 위원
                    vm.worker_member[vt.worker_mem_index].mfcmm = item.user_id;
                    vm.worker_member[vt.worker_mem_index].user_nm = item.user_nm;
                    vm.worker_member[vt.worker_mem_index].ocpt_detail_nm = item.ocpt_detail_nm;
                    vt.userPop_w = false;
                }if(!vt.userPop_u && !vt.userPop_w && vt.userPop_s1 && !vt.userPop_w1){//안전관리자 1인
                    vm.data.sfmngr_1man = item.user_id;
                    vm.data.sfmngr_1man_nm = item.user_nm;
                    vt.userPop_s1 = false;
                }if(!vt.userPop_u && !vt.userPop_w && !vt.userPop_s1 && vt.userPop_w1){//근로자대표 1인
                    vm.data.wrkr_rprs_dsgn_1man = item.user_id;
                    vm.data.wrkr_rprs_dsgn_1man_nm = item.user_nm;
                    vt.userPop_w1 = false;
                }

            },
            fnSign:function(value, item){ //value:서명여부, item:데이터
                let vm = this.viewModel;
                if(confirm("서명하시겠습니까?")){
                    vm.sign_yn = value;
                    let data = {
                        bplc_sn : item.bplc_sn,
                        lbm_cfrnc_sn : item.lbm_cfrnc_sn,
                        user_mfcmm_sn : item.user_mfcmm_sn, 
                        mfcmm_se : item.mfcmm_se , 
                        ccpy_nm : item.ccpy_nm , 
                        mfcmm : item.mfcmm,
                        sign_yn : value,
                        reg_id : vm.userInfo.user_id
                    }

                    Axios.post("/updateMauMngmtCmtCgSign.do", data).then(function(res){
                        console.log(res);
                        if(res.data > 0){
                            alert("서명 되었습니다.");
                            window.location.reload();
                        }else{
                            alert("서명이 중단되었습니다.");
                            window.location.reload();
                        }
                    }).catch(function(ex) {
                        console.log(ex);
                    });
                }
            },
            //현장
            // fnBplcPopup: function(){
            //     let vt = this;
			// 	vt.bplcPop = true;
			// 	vt.userPop_u = false;
            //     vt.userPop_w = false;
            //     vt.userPop_s1 = false;
            //     vt.userPop_w1 = false;
                
			// 	vt.$nextTick(function() {
			// 		if(vt.bplcPop) {
			// 			vt.$refs.bplc.fnInit();
			// 		}
			// 	})
            // },
            // fnBplcAdd: function(item){
            //     let vt = this;
            //     let vm = this.viewModel;

            //     vm.bplc_sn = item.bplc_sn;
            //     vm.bplc_nm = item.bplc_nm;
                
            //     vt.$nextTick(function() {
            //         vt.fnInit();
            //     })
            // },
        }
    };
</script>