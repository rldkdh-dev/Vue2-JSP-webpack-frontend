<template>
    <div>
        <div class="contents" style="width: calc(-15rem + 100vw);">
            <div class="divide">
                <div>
                    <div>
                        <h3>기본정보</h3>
                        <table class="table horizontal write">
                            <caption>기본정보</caption>
                            <tbody>
                                <tr>
                                    <th scope="row" class="w180 essential"><label for="bplc">현장명</label></th>
                                    <td colspan="3">
                                        <div class="input_group input_btn">
                                            <input type="text" id="bplc_nm" v-model="viewModel.data.bplc_nm" readonly @click="viewModel.userInfo.bplc_yn !='Y' ? fnBplcPopup() : ''">
                                            <input type="hidden" id="bplc" v-model="viewModel.data.bplc_sn">
                                            <label for="bplc_nm" v-if="viewModel.userInfo.bplc_yn !='Y'"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-search"></use></svg></label>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <th scope="row"><label for="work_type_nm">공종명</label></th>
                                    <td>
                                        {{ viewModel.data.work_type_nm }}
                                    </td>
                                </tr>
                                <tr>
                                    <th scope="row" class="essential">평가기간</th>
                                    <td>
                                        <div class="input_group">
                                            <div class="datepicker_box w120">
                                                <input type="text" class="datepicker" id="sdt" title="평가시작일" placeholder="평가시작일" readonly name="sdt" v-model="viewModel.data.evl_bgng_dt">
                                            </div>
                                            <span>~</span>
                                            <div class="datepicker_box w120">
                                                <input type="text" class="datepicker" id="edt" title="평가종료일" placeholder="평가종료일" readonly name="edt" v-model="viewModel.data.evl_end_dt">
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <th scope="row" class="essential">작성일자</th>
                                    <td>
                                        <div class="datepicker_box">
                                            <input type="text" class="datepicker" id="wrt_dt" placeholder="작성일자" title="작성일자" readonly>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div v-if="viewModel.teamList.length > 0">
                        <table class="table horizontal">
                            <caption>공종</caption>
                            <tbody>
                                <tr v-for="idx in Math.ceil((Number(viewModel.teamList.length)) / 6)">
                                    <!-- class="w100" -->
                                    <th scope="rowgroup" :rowspan="Math.ceil((Number(viewModel.teamList.length) ) / 6)" v-if="idx == 1" class="w100">팀명</th>
                                    <td v-for="cnt in (Number(viewModel.teamList.length) > 6 ? 6 : Number(viewModel.teamList.length))">
                                        <label :for="'cnfl_'+viewModel.teamList[ ((idx - 1) * 6) + (cnt - 1) ].SPCM_RISK_EVL_SN" v-if="((idx - 1) * 6) + (cnt - 1) < viewModel.teamList.length">
                                            <input type="checkbox" :id="'cnfl_'+viewModel.teamList[ ((idx - 1) * 6) + (cnt - 1) ].SPCM_RISK_EVL_SN" name="cnfl" :value="viewModel.teamList[ ((idx - 1) * 6) + (cnt - 1) ].SPCM_RISK_EVL_SN" @change="fnGetCfnlItem(viewModel.teamList[ ((idx - 1) * 6) + (cnt - 1) ], $event)" v-model="teamChk">{{ viewModel.teamList[ ((idx - 1) * 6) + (cnt - 1) ].TEAM_NM }}
                                        </label>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <div class="table_footer btn-right">
                            <button class="btn btn-purple" @click="fnPrevInfo();"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-manage-search"></use></svg>이전회차 정보 가져오기</button>
                            <button class="btn btn-purple" @click="fnPrint();"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-print"></use></svg>인쇄</button>
                            <button class="btn btn-gray" @click="fnRefresh();"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-refresh"></use></svg>초기화</button>
                        </div>
                    </div>

                    <div v-if="viewModel.detailListInfo.length != 0 || mode=='update'" class="contents">
                        <ul class="accordion">
                            <template v-for="(detail, idx) in viewModel.detailListInfo">
                                <li style="width: calc(100vw - 41rem);">
                                    <button class="title">
                                        팀명 : {{ detail.teamInfo.TEAM_NM }}
                                    </button>
                                    <div class="contents" style="max-height: 100%;">
                                        <div class="overflow-x overflow-y" style="width: 100%; max-height: 500px;">
                                            <table class="table write">
                                                <caption>상시 위험성평가 양식 등록</caption>
                                                <thead>
                                                    <tr>
                                                        <th scope="col" rowspan="2">위험발주</th>
                                                        <!-- <th scope="col" rowspan="2">팀명</th> -->
                                                        <th scope="col" rowspan="2">작업절차</th>
                                                        <th scope="col" rowspan="2">사용장비</th>
                                                        <th scope="col" rowspan="2">작업일정</th>
                                                        <th scope="col" rowspan="2">위험요인</th>
                                                        <th scope="col" rowspan="2">위험유형</th>
                                                        <th scope="col" rowspan="2">안전대책</th>
                                                        <th scope="col" colspan="2">평가관리</th>
                                                        <th scope="col" rowspan="2">재평가</th>
                                                        <th scope="col" rowspan="2">삭제</th>
                                                    </tr>
                                                    <tr>
                                                        <th scope="col">위험도</th>
                                                        <th scope="col">이행상태</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr v-for="(item, i) in detail.artclList.map((data, index) => ({ ...data, orgIndex: index })).filter(data => data.se == 1)" >
                                                        <td :rowspan="detail.artclList.filter(data=>data.se == 1).length" v-if="i == 0">소공정<br/>위험성평가</td>
                                                        <!-- <td class="td_wrap" v-if="i === 0 || item.spcm_risk_evl_sn !== viewModel.chckArtclList[(i - 1)].spcm_risk_evl_sn" :rowspan="fnRowSpan('spcm', item, i)">{{ item.bplc_team_nm }}</td> -->
                                                        <td  class="td_wrap text-left">{{ item.job_process_nm }}</td>
                                                        <td class="text-left td_wrap">
                                                            <input type="text" v-model="detail.artclList[item.orgIndex].eqpment" placeholder="사용장비 입력" :id="'eqpment_'+idx+'_'+i" class="wa"/>
                                                        </td>
                                                        <td class="td_wrap">
                                                            <div class="input_group w280">
                                                                <div class="datepicker_box w120">
                                                                    <input type="text" class="datepicker" :id="'job_bgng_dt_'+idx+'_'+i" title="시작일" placeholder="시작일" readonly name="job_bgng_dt" v-model="item.job_bgng_dt"/>
                                                                </div>
                                                                <span>~</span>
                                                                <div class="datepicker_box w120">
                                                                    <input type="text" class="datepicker" :id="'job_end_dt_'+idx+'_'+i" title="종료일" placeholder="종료일" readonly name="job_end_dt" v-model="item.job_end_dt"/>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td class="text-left td_wrap">{{ item.main_risk_fctr }}</td>
                                                        <td class="text-left td_wrap">
                                                            <input type="text" v-model="detail.artclList[item.orgIndex].risk_type" placeholder="위험유형 입력" :id="'risk_type_'+idx+'_'+i" class="wa"/>
                                                        </td>
                                                        <td class="td_wrap text-left">{{ item.safe_cntrpln }}</td>
                                                        <td>{{ item.dgdgr_uml_nm }}</td>
                                                        <td class="td_wrap">
                                                            <select class="wa" title="이행상태 선택" v-model="detail.artclList[item.orgIndex].now_mng_level" :id="'now_mng_level_'+idx+'_'+i"  :disabled="viewModel.data.file_cnt == 0 || viewModel.data.file_cnt == undefined">
                                                                <option value="">이행상태 선택</option>
                                                                <option v-for="item in viewModel.prfrmList" :key="item" :value="item.CODE">{{ item.CODE_NM }}</option>
                                                            </select>
                                                        </td>
                                                        <td class="td_wrap">
                                                            <select class="wa" title="재평가 선택" v-model="detail.artclList[item.orgIndex].re_evl" :id="'re_evl_'+idx+'_'+i"  :disabled="viewModel.data.file_cnt === 0 || viewModel.data.file_cnt == undefined">
                                                                <option value="">재평가 선택</option>
                                                                <option v-for="item in viewModel.dgdgrList" :key="item" :value="item.CODE">{{ item.CODE_NM }}</option>
                                                            </select>
                                                        </td>
                                                        <td class="td_wrap">
                                                            <div class="icon_box">
                                                                <button class="btn btn-icon" @click.prevent="fnItemDel(idx, item.orgIndex)"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-circle-minus"></use></svg></button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                    <tr v-for="(item, i) in detail.artclList.map((data, index) => ({ ...data, orgIndex: index })).filter(data => data.se == 2)" >
                                                        <td :rowspan="detail.artclList.filter(data=>data.se == 2).length" v-if="i == 0">추가<br/>위험성평가</td>
                                                        <td class="text-left td_wrap">{{ item.job_process_nm }}</td>
                                                        <td class="text-left td_wrap">
                                                            <input type="text" v-model="detail.artclList[item.orgIndex].eqpment" placeholder="사용장비 입력" :id="'eqpment_'+idx+'_'+i" class="wa"/>
                                                        </td>
                                                        <td class="td_wrap">
                                                            {{ item.job_bgng_dt|yyyyMMdd }} ~ {{ item.job_end_dt|yyyyMMdd }}
                                                        </td>
                                                        <td class="text-left td_wrap">{{ item.main_risk_fctr }}</td>
                                                        <td class="text-left td_wrap">
                                                            <input type="text" v-model="detail.artclList[item.orgIndex].risk_type" placeholder="위험유형 입력" :id="'risk_type_'+idx+'_'+i" class="wa"/>
                                                        </td>
                                                        <td class="text-left td_wrap">{{ item.safe_cntrpln }}</td>
                                                        <td>{{ item.dgdgr_uml_nm }}</td>
                                                        <td class="td_wrap">
                                                            <select class="wa" title="이행상태 선택" v-model="detail.artclList[item.orgIndex].now_mng_level" :id="'now_mng_level_'+idx+'_'+i" :disabled="viewModel.data.file_cnt == 0 || viewModel.data.file_cnt == undefined">
                                                                <option value="">이행상태 선택</option>
                                                                <option v-for="item in viewModel.prfrmList" :key="item" :value="item.CODE">{{ item.CODE_NM }}</option>
                                                            </select>
                                                        </td>
                                                        <td class="td_wrap">
                                                            <select class="wa" title="재평가 선택" v-model="detail.artclList[item.orgIndex].re_evl" :id="'re_evl_'+idx+'_'+i" :disabled="viewModel.data.file_cnt == 0 || viewModel.data.file_cnt == undefined">
                                                                <option value="">재평가 선택</option>
                                                                <option v-for="item in viewModel.dgdgrList" :key="item" :value="item.CODE">{{ item.CODE_NM }}</option>
                                                            </select>
                                                        </td>
                                                        <td class="td_wrap">
                                                            <div class="icon_box">
                                                                <button class="btn btn-icon" @click.prevent="fnItemDel(idx, item.orgIndex)"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-circle-minus"></use></svg></button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <th colspan="1">아차사고사례(경험)</th>
                                                        <td colspan="6">
                                                            <textarea v-model="detail.detail.acdnt_case" :id="'acdnt_case_'+ idx"></textarea>
                                                        </td>
                                                        <th>지적</th>
                                                        <td colspan="2"><input type="number" :id="'chck_cnt_'+idx"  v-model="detail.detail.chck_cnt"/></td>
                                                        <td></td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                        <div class="table_top btn-right" style="padding-right: 0px; margin-top: 0.25rem">
                                            <button class="btn btn-white" @click="fnFstRiskPopup(idx);"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-search"></use></svg>최초위험성찾기</button>
                                            <button class="btn btn-light-purple" @click="fnOrgItemAdd(idx);"><svg class="icon"><use xlink:href="../../../img/symbol-defs.svg#icon-wrap-text"></use></svg>추가</button>
                                        </div>
                                        <div>
                                            <table class="table write">
                                                <thead>
                                                    <tr>
                                                        <th scope="col" rowspan="3">장소내용</th>
                                                        <th scope="col" rowspan="3">작업절차<br>[중공정]</th>
                                                        <th scope="col" rowspan="3">작업일정</th>
                                                        <th scope="col" colspan="2">위험성평가</th>
                                                        <th scope="col" rowspan="3">위험도</th>
                                                        <th scope="col" rowspan="3">검토의견</th>
                                                        <th scope="col" rowspan="3" colspan="2">관리</th>
                                                    </tr>
                                                    <tr>
                                                        <th scope="col" colspan="2">[누락된작업, 추가된위험, 정한대로 할 수 없는것, 점검 결과 실행이 안되는 사항 작성]</th>
                                                    </tr>
                                                    <tr>
                                                        <th scope="col">추가 위험요인</th>
                                                        <th scope="col">위험방지대책</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr v-for="(item, i) in detail.aditList">
                                                        <td class="td_wrap text-left"><input type="text" v-model="item.plc_cn" :id="'org_plc_cn_'+idx+'_'+i"/></td>
                                                        <td><input type="text" v-model="item.job_process_nm" :id="'org_job_process_nm_'+idx+'_'+i"/></td>
                                                        <td class="td_wrap">
                                                            <div class="input_group">
                                                                <div class="datepicker_box">
                                                                    <input type="text" class="datepicker" :id="'org_job_bgng_dt_'+idx+'_'+i" name="org_job_bgng_dt" placeholder="작업시작일" title="작업시작일" readonly v-model="item.job_bgng_dt" :ref="'org_job_bgng_dt'">
                                                                </div>
                                                                <span>~</span>
                                                                <div class="datepicker_box">
                                                                    <input type="text" class="datepicker" :id="'org_job_end_dt_'+idx+'_'+i" name="org_job_end_dt" placeholder="작업종료일" title="작업종료일" readonly v-model="item.job_end_dt" :ref="'org_job_bgng_dt'">
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td class="td_wrap text-left">
                                                            <input type="text" v-model="item.main_risk_fctr" :id="'org_main_risk_fctr_'+idx+'_'+i"/>
                                                        </td>
                                                        <td class="td_wrap text-left">
                                                            <input type="text" v-model="item.safe_cntrpln" :id="'org_safe_cntrpln_'+idx+'_'+i"/>
                                                        </td>
                                                        <td class="td_wrap">
                                                            <select title="위험도 선택" v-model="item.dgdgr_uml" :id="'org_dgdgr_'+idx+'_'+i" @change="fnChngDgdgr(idx, i)">
                                                                <option value="undefined">위험도 선택</option>
                                                                <option v-for="item in viewModel.dgdgrList" :key="item" :value="item.CODE">{{ item.CODE_NM }}</option>
                                                            </select>
                                                        </td>
                                                        <td :rowspan="detail.aditList.length" v-if="i == 0" class="td_wrap">
                                                            <textarea v-model="detail.aditList[0].rvw_opnn" :id="'rvw_opnn'+idx"></textarea>
                                                        </td>
                                                        <td>
                                                            <button :class="'btn btn-small btn-blue'" @click="fnAdd(idx,i)">등록</button>
                                                        </td>
                                                        <td>
                                                            <div class="icon_box">
                                                                <button class="btn btn-icon" @click.prevent="fnOrgItemDel(idx,i)"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-circle-minus"></use></svg></button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                    <tr v-if="detail.aditList.length == 0"><td :colspan="'8'">데이터가 없습니다.</td></tr>
                                                    <tr>
                                                        <th colspan="1">건의사항</th>
                                                        <td colspan="8">
                                                            <textarea v-model="detail.detail.sugest_mttr" :id="'sugest_mttr'+idx"></textarea>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </li>
                            </template>
                        </ul>
                        <div class="table_footer btn-right">
                            <a href="#" class="btn btn-purple" @click.prevent="fnSave()"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-post-add"></use></svg>등록</a>
                            <router-link :to="'/'" class="btn btn-white"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-list-back"></use></svg>목록</router-link>
                        </div>
                    </div>
                </div>
                <div class="approval">
                    <h3>결재 정보</h3>
                    <ul>
                        <li class="signed">
                            <a href="javascript:;">
                                <p class="essential">작성자</p>
                                <div class="user_img" id="1">
                                    <img :src="viewModel.data.wrtr_sign">
                                </div>
                                <span>{{ viewModel.data.wrtr_nm == "" ? "작성자 등록":viewModel.data.wrtr_nm }}</span>
                            </a>
                        </li>
                        <li :class="[viewModel.data.rvwr != '' && viewModel.data.rvwr != null && viewModel.data.rvwr_sign_yn != 'Y' ? 'set' : viewModel.data.rvwr && viewModel.data.rvwr_sign_yn=='Y' ? 'signed' : null]" @click="fnAprvrpopup('rvwr')">
                            <a href="javascript:;">
                                <p>검토자</p>
                                <div class="user_img" id="">
                                    <img :src="viewModel.data.rvwr_sign" v-bind:style="viewModel.data.rvwr_sign_yn != 'Y' ? 'display: none;' : ''">
                                </div>
                                <span>{{ (viewModel.data.rvwr_nm == "" || viewModel.data.rvwr_nm == null) ? "검토자 등록":viewModel.data.rvwr_nm }}</span>
                            </a>
                        </li>
                        <li :class="[viewModel.data.dcsnr != '' && viewModel.data.dcsnr != null && viewModel.data.dcsnr_sign_yn != 'Y' ? 'set' : viewModel.data.dcsnr != '' && viewModel.data.dcsnr_sign_yn=='Y' ? 'signed' : null]"  @click="fnAprvrpopup('dcsnr')">
                            <a href="javascript:;">
                                <p class="essential">결정자</p>
                                <div class="user_img" id="3">
                                    <img :src="viewModel.data.dcsnr_sign" v-bind:style="viewModel.data.dcsnr_sign_yn != 'Y' ? 'display: none;' : ''">
                                </div>
                                <span>{{ (viewModel.data.dcsnr_nm == "" || viewModel.data.dcsnr_nm == null)? "결정자 등록":viewModel.data.dcsnr_nm }}</span>
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>     
        <viewPopup ref="viewPopup" v-if="viewPop==true"></viewPopup>     
        <bplc ref="bplc" v-if="bplcPop==true" :pass="{dept_sn: viewModel.userInfo.dept_sn, team_sn: viewModel.userInfo.team_sn}"></bplc>
        <user ref="aprvr" v-if="aprvrPop==true" :pass="{dept_sn: viewModel.userInfo.dept_sn, team_sn: viewModel.userInfo.team_sn, title:'결재자', bplc_yn:'Y', bplc_sn: viewModel.data.bplc_sn, ocpt_detail_cd:1}"></user>
        <fstRisk ref="fst" v-if="fstPop==true"></fstRisk>
    </div>
</template>

<style>
    td.td_wrap {
        white-space: nowrap;
    }
</style>
<script>
    import "es6-promise/auto";
    import Vue from "vue";
    import Axios from "axios";
    import Common from "../../../../common/js/common";
    import Message, {messageUtil} from "../../../../common/js/message";
    import fromValidation from "../../../../common/js/fromValidation";
    import user from "../../popup/user_popup.vue";
    import bplc from "../../popup/bplc_popup.vue";
    import fstRisk from "../smPrcsRskEvlt/popup/fstRiskPopup.vue";
    import viewPopup from "./popup/rgstPmntRskEvltViewPopup.vue";
import { containsCoordinate } from "ol/extent";

    export default {
        components: {
            'user' : user,
            'bplc' : bplc,
            'fstRisk': fstRisk,
            'viewPopup': viewPopup
		},
        data: function() {
            return {
                seq: 0,
                idx: 0,
                teamChk: [],
                mode: 'write',
                bplcPop:false,
                aprvrPop:false,
                fstPop:false,
                viewPop:false,
                AprvrGbn:'',
                viewModel:{
                    data:{
                        rvwr:'',
                        rvwr_nm:'',
                        dcsnr:'',
                        dcsnr_nm:'',
                    },
                    userInfo:{},
                    teamList:[],
                    itemList:[],
                    dgdgrList:[],       //위험도 코드리스트
                    prfrmList:[],       //이행상태 코드리스트
                    chckArtclList:[],   //소공정 리스트
                    addArtclList:[],    //추가위험성평가 리스트
                    addOrgArtclList:[],    //추가위험성평가 리스트_원본
                    detailListInfo:[],
                },
                isSaved:false,
            };
        },
        computed: {
        },
        activated:function(){
            this.fnInit();
            this.fnCalendar();
        },
        deactivated:function(){
            this.$destroy();
        },
        beforeRouteLeave: function(to, from, next){
            let vm = this;
            if(!vm.isSaved){
                if(!confirm("페이지를 이동할 경우 현재 페이지는 저장되지 않습니다.\n그래도 나가시겠습니까?")){
                    return false;
                } 
            }
            next();
        },
        mounted: function() {
            let vm = this;
            // vm.fnInit();
            // vm.fnCalendar();
        },
        methods: {
            //기본세팅
            fnInit:function(){
                let vm = this;
                vm.viewModel.userInfo = vm.$store.state.global.userInfo;
                
                let sn = vm.$route.params.sn;

                if(sn != undefined){
                    vm.fnDetail(sn);
                    vm.mode = 'update';
                }else{
                    vm.fnGetWriteInfo();

                    //작성자 결재정보 추가
                    vm.viewModel.data.wrtr = vm.$store.state.global.userInfo.user_id;
                    vm.viewModel.data.wrtr_nm = vm.$store.state.global.userInfo.user_name;
                    vm.viewModel.data.wrtr_sign = vm.$store.state.global.userInfo.aprvr_path.charAt() == '/' ? vm.$store.state.global.userInfo.aprvr_path : vm.$store.state.global.userInfo.aprvr_path.substr(2);

                    if(vm.$store.state.global.userInfo.mng_user_id != null){
                        vm.viewModel.data.dcsnr = vm.$store.state.global.userInfo.mng_user_id;
                        vm.viewModel.data.dcsnr_nm = vm.$store.state.global.userInfo.mng_user_nm;
                    }

                    //현장코드 있을 경우 그 값으로 세팅
                    vm.viewModel.data.bplc_sn = vm.viewModel.userInfo.bplc_sn == 0 ? '' : vm.viewModel.userInfo.bplc_sn;
                    vm.viewModel.data.bplc_nm = vm.viewModel.userInfo.bplc_sn == 0 ? '' : vm.viewModel.userInfo.bplc_nm;
                }
            },
            fnGetWriteInfo:function(){
                let vm = this;

                let send = {
                    bplc_sn: vm.viewModel.userInfo.bplc_sn
                }
                Axios.post("/selectPmntRskEvltWriteInfo.do", send)
                .then(function(response) {
                    vm.viewModel.teamList = response.data.teamList != undefined ? response.data.teamList : [];
                    vm.viewModel.itemList = response.data.itemList;
                    vm.viewModel.dgdgrList = response.data.dgdgrList;
                    vm.viewModel.prfrmList = response.data.prfrmList;

                    // vm.$refs.sub.fnInit(vm.viewModel.dgdgrList);

                    if(vm.viewModel.data.bplc_sn != 0){
                        vm.fnBplcChg();
                    }
                });
            },
            fnDetail: function(sn){
                let vm = this;

                let send = {
                    ordtm_risk_evl_sn: sn,
                }

                Axios.post("/selectPmntRskEvltDetail.do", send)
                .then(function(response) {
                    vm.viewModel.data = response.data.detail;
                    vm.viewModel.teamList = response.data.teamList != undefined ? response.data.teamList : [];
                    
                    vm.viewModel.detailListInfo = response.data.detailListInfo;
                        
                    vm.fnBplcChg();

                    //코드값
                    vm.viewModel.dgdgrList = response.data.dgdgrList;
                    vm.viewModel.prfrmList = response.data.prfrmList;

                    //서명 이미지
                    vm.viewModel.data.wrtr_sign = vm.viewModel.data.wrtr_sign.charAt() == '/' ? vm.viewModel.data.wrtr_sign : vm.viewModel.data.wrtr_sign.substr(2);
                    vm.viewModel.data.rvwr_sign = vm.viewModel.data.rvwr_sign.charAt() == '/' ? vm.viewModel.data.rvwr_sign : vm.viewModel.data.rvwr_sign.substr(2);
                    vm.viewModel.data.dcsnr_sign = vm.viewModel.data.dcsnr_sign.charAt() == '/' ? vm.viewModel.data.dcsnr_sign : vm.viewModel.data.dcsnr_sign.substr(2);

                    $("#sdt").val(Common.fnConvertDateStr(vm.viewModel.data.evl_bgng_dt, '-'));
                    $("#edt").val(Common.fnConvertDateStr(vm.viewModel.data.evl_end_dt, '-'));
                    $("#wrt_dt").val(Common.fnConvertDateStr(vm.viewModel.data.wrt_dt, '-'));

                }).then(function(){    
                    vm.$nextTick(function() {
                        for(let i=0; i<vm.viewModel.chckArtclList.length; i++){
                            $("#job_bgng_dt_"+i).val(Common.fnConvertDateStr(vm.viewModel.chckArtclList[i].job_bgng_dt, '-'));
                            $("#job_end_dt_"+i).val(Common.fnConvertDateStr(vm.viewModel.chckArtclList[i].job_end_dt, '-'));
                        }
    
                        for(let i=0; i<vm.viewModel.addOrgArtclList.length; i++){
                            $("#org_job_bgng_dt_"+i).val(Common.fnConvertDateStr(vm.viewModel.addOrgArtclList[i].job_bgng_dt, '-'));
                            $("#org_job_end_dt_"+i).val(Common.fnConvertDateStr(vm.viewModel.addOrgArtclList[i].job_end_dt, '-'));
                        }

                        vm.fnCalendar();
                    });
                    
                    
                });
            },
            fnRefresh: function(){
                let vm = this;
                
                if(vm.teamChk.length > 0){
                    if(!confirm("선택된 공종과 입력된 정보가 사라집니다. 그래도 초기화 하시겠습니까?")){
                        return false;
                    }else{
                        vm.seq = 0;
                        vm.teamChk = [];
                        vm.viewModel.detailListInfo = [];
                    }
                }else{
                    if(!confirm("입력된 정보가 사라집니다. 그래도 초기화 하시겠습니까?")){
                        return false;
                    }else{
                        vm.seq = 0;
                        vm.teamChk = [];
                        vm.viewModel.detailListInfo = [];
                    }
                }
            },
            fnSave:function(){
                let vm = this;
                const valiData = [
                    {id: 'bplc_nm', type: 'select', title: '현장명'},
                    {id: 'sdt', type: 'input', title: '평가시작일자'},
                    {id: 'edt', type: 'input', title: '평가종료일자'},
                    {id: 'wrt_dt', type: 'input', title: '작성일자'},
                ];

                if(!fromValidation(valiData)){
                    return false;
                }

                if(vm.viewModel.data.dcsnr_nm == '' || vm.viewModel.data.dcsnr_nm == null){
                    alert(messageUtil(Message.VALIDATION_REQUIRED, ['결재자 소장']))
                    return false;
                }

                let flag = true;
                vm.viewModel.detailListInfo.some((data, index) =>{
                    data.aditList.some((data2, index2) =>{
                        let teamNm = data.teamInfo.TEAM_NM;
                        if(data2.plc_cn == '' || data2.plc_cn == undefined){
                            alert(teamNm + "의 장소내용을 입력해주세요.");
                            $("#org_plc_cn_" + index + '_' + index2).focus();
                            flag = false;
                            return true;
                        }else if(data2.job_process_nm == '' || data2.job_process_nm == undefined){
                            alert(teamNm + "의 작업절자[중공정]을 입력해주세요.");
                            $("#org_job_process_nm_" + index + '_' + index2).focus();
                            flag = false;
                            return true;
                        }else if(data2.job_bgng_dt == '' || data2.job_bgng_dt == undefined){
                            alert(teamNm + "의 작업일정을 입력해주세요.");
                            $("#org_job_bgng_dt_" + index + '_' + index2).focus();
                            flag = false;
                            return true;
                        }else if(data2.job_end_dt == '' || data2.job_end_dt == undefined){
                            alert(teamNm + "의 작업일정을 입력해주세요.");
                            $("#org_job_end_dt_" + index + '_' + index2).focus();
                            flag = false;
                            return true;
                        }else if(data2.main_risk_fctr == '' || data2.main_risk_fctr == undefined){
                            alert(teamNm + "의 추가 위험요인을 입력해주세요.");
                            $("#org_main_risk_fctr_" + index + '_' + index2).focus();
                            flag = false;
                            return true;
                        }else if(data2.safe_cntrpln == '' || data2.safe_cntrpln == undefined){
                            alert(teamNm + "의 위험방지대책을 입력해주세요.");
                            $("#org_safe_cntrpln_" + index + '_' + index2).focus();
                            flag = false;
                            return true;
                        }else if(data2.dgdgr_uml == '' || data2.dgdgr_uml == undefined){
                            alert(teamNm + "의 위험도를 입력해주세요.");
                            $("#org_dgdgr_" + index + '_' + index2).focus();
                            flag = false;
                            return true;
                        }
                    });

                    if(!flag){
                        return true;
                    }
                });

                if(!flag){
                    return false;
                }

                let data = {
                    reg_id: vm.viewModel.userInfo.user_id,
                    bplc_sn: vm.viewModel.data.bplc_sn,
                    work_type_nm:vm.viewModel.data.work_type_nm,
                    evl_bgng_dt: $("#sdt").val(),
                    evl_end_dt: $("#edt").val(),
                    wrt_dt: $("#wrt_dt").val(),
                    wrtr: vm.viewModel.data.wrtr,
                    wrtr_sign_yn: 'Y',
                    rvwr: vm.viewModel.data.rvwr,
                    rvwr_sign_yn: vm.viewModel.data.rvwr_sign_yn,
                    dcsnr: vm.viewModel.data.dcsnr,
                    dcsnr_sign_yn: vm.viewModel.data.dcsnr_sign_yn,
                    acdnt_case: vm.viewModel.data.acdnt_case,
                    chck_cnt: vm.viewModel.data.chck_cnt,
                    sugest_mttr: vm.viewModel.data.sugest_mttr,
                    ordtm_risk_evl_sn : vm.viewModel.data.ordtm_risk_evl_sn,

                    detailListInfo: vm.viewModel.detailListInfo
                    // chckArtclList: vm.viewModel.chckArtclList,
                    // addArtclList: vm.viewModel.addArtclList,
                    // addOrgArtclList: vm.viewModel.addOrgArtclList,
                }

                if(vm.viewModel.data.ordtm_risk_evl_sn == undefined){
                    if(confirm(Message.CREATE_CONFIRM)){
                        $(".loading").show();
                        $("#mask").show();
                        Axios.post("/insertPmntRskEvlt.do", data).then(function(response) {
                            if(response.data == 1){
                                vm.isSaved = true;
                                vm.$router.push('/');
                                alert("저장되었습니다.");
                            }else{
                                alert(Message.ERROR);    
                            }
                            
                        }).catch(function(ex) {
                            alert(Message.ERROR);
                        }).finally(function(){
                            $(".loading").hide();
                            $("#mask").hide();
                        });
                    }
                }else{
                    if(confirm(Message.UPDATE_CONFIRM)){
                        $(".loading").show();
                        $("#mask").show();
                        Axios.post("/updatePmntRskEvlt.do", data).then(function(response) {
                            if(response.data == 1){
                                vm.isSaved = true;
                                vm.$router.push('/');
                                alert("저장되었습니다.");
                            }else if(response.data == 999){
                                alert("결정자가 결재를 완료하여 수정이 불가합니다.");
                                return false;
                            }else{
                                alert(Message.ERROR);
                            }
                        }).catch(function(ex) {
                            alert(Message.ERROR);
                        }).finally(function(){
                            $(".loading").hide();
                            $("#mask").hide();
                        });
                    }
                }
            },
            fnGetCfnlItem:function(item, event){
                //공종명에 해당하는 우리기준 가져오기 
                let vm = this;
                
                let sdt = $("#sdt").val();
                let edt = $("#edt").val();

                // let len = vm.viewModel.chckArtclList.length;
                if($(event.target).prop("checked")){
                    let list = vm.viewModel.itemList.filter(data => data.spcm_risk_evl_sn == item.SPCM_RISK_EVL_SN);
                    let artclList = [];

                    for(let i=0; i<list.length; i++){
                        artclList.push(list[i]);

                        vm.$set(artclList[i], 'job_bgng_dt', sdt);
                        vm.$set(artclList[i], 'job_end_dt', edt);
                    }

                    vm.viewModel.detailListInfo.push({"artclList": artclList, "teamInfo": item, "detail": {}, "aditList" : []});
                    
                    vm.$nextTick(function() {
                        vm.fnCalendar();
                    });
                }else{
                    let idx = vm.viewModel.detailListInfo.findIndex(data => data.teamInfo.SPCM_RISK_EVL_SN == item.SPCM_RISK_EVL_SN);
                    vm.viewModel.detailListInfo.splice(idx, 1);
                }   
            },
            fnBplcPopup: function() {
				let vm = this;
				vm.bplcPop=true;
				vm.aprvrPop=false;
				vm.mesuPop=false;
                vm.fstPop=false;
                vm.viewPop=false;
				vm.$nextTick(function() {
					if(vm.bplcPop) {
						vm.$refs.bplc.fnInit();
					}
				})
			},
            fnBplcAdd: function(item){
                let vm = this;

                vm.viewModel.data.bplc_sn = item.bplc_sn;
                vm.viewModel.data.bplc_nm = item.bplc_nm;

                vm.viewModel.data.dcsnr = item.mng_user_id == undefined ? null : item.mng_user_id;
                vm.viewModel.data.dcsnr_nm = item.mng_user_nm == undefined ? null : item.mng_user_nm;

                vm.viewModel.detailListInfo = [];
                vm.fnBplcChg();
            },
            fnBplcChg: function(){
                //현장에 따른 팀명 가져오기
                
                let vm = this;

                let send = {
                    bplc_sn: vm.viewModel.data.bplc_sn,
                    gbn: 'pmnt',
                }

                //초기화
                vm.teamChk = [];
                
                Axios.post("/selectSpcmTeamList.do", send)
                .then(function(response) {
                    vm.viewModel.teamList = response.data.teamList;
                    vm.viewModel.itemList = response.data.itemList;

                    if(vm.mode=='write'){
                        vm.viewModel.chckArtclList = [];
                        
                        if(response.data.bizInfo != undefined || response.data.bizInfo != null){
                            vm.viewModel.data.work_type_nm = response.data.bizInfo.bizgroup;
                        }else{
                            vm.viewModel.data.work_type_nm = '';
                        }
                    }else{
                        //공종 존재 할경우 체크하기
                        for(let i=0; i<vm.viewModel.teamList.length;i++){
                            let item = vm.viewModel.teamList[i];
                            let list = vm.viewModel.detailListInfo.filter(data=> data.teamInfo.SPCM_RISK_EVL_SN == item.SPCM_RISK_EVL_SN);

                            if(list.length > 0){
                                $("input[id='cnfl_" + vm.viewModel.teamList[i].SPCM_RISK_EVL_SN + "']").prop("checked", "checked");
                                vm.teamChk.push(vm.viewModel.teamList[i].SPCM_RISK_EVL_SN);
                            }
                        }
                    }
                    
                    if(vm.viewModel.teamList.length == 0){
                        alert("등록된 소공정이없거나 결재가 완료되지 않습니다.");

                        if(vm.viewModel.userInfo.bplc_sn == 0){
                            vm.viewModel.data.bplc_sn = '';
                            vm.viewModel.data.bplc_nm = '';
                            vm.viewModel.data.dcsnr = '';
                            vm.viewModel.data.dcsnr_nm = '';
                        }
                        vm.viewModel.itemList = [];
                    }
                });
            },
            fnAprvrpopup: function(gbn){
                let vm = this;

                vm.AprvrGbn = gbn;      //어느 결재자 정보인지 담아두기.

                vm.bplcPop = false
                vm.aprvrPop=false;
                vm.fstPop=false;
                vm.viewPop=false;

                if(vm.viewModel.data.bplc_sn == '' || vm.viewModel.data.bplc_sn == undefined){
                    alert("현장명을 선택해주세요.");
                    return false;
                }else if(gbn == 'rvwr' && vm.viewModel.data.rvwr_sign_yn == 'Y'){
                    alert("검토자는 이미 결재를 진행하여 변경할 수 없습니다.");
                }else if(gbn == 'dcsnr' && vm.viewModel.data.dcsnr_sign_yn == 'Y'){
                    alert("소장은 이미 결재를 진행하여 변경할 수 없습니다.");
                }else{
                    vm.aprvrPop=true;
                    vm.$nextTick(function() {
                    if(vm.aprvrPop) {
                        vm.$refs.aprvr.fnInit();
                    }
                })
                }
            },
            fnMemberAdd: function(item){
                let vm = this;

                if(vm.AprvrGbn == 'rvwr'){
                    vm.viewModel.data.rvwr = item.user_id;
                    vm.viewModel.data.rvwr_nm = item.user_nm;
                }else{
                    vm.viewModel.data.dcsnr = item.user_id;
                    vm.viewModel.data.dcsnr_nm = item.user_nm;
                }

                //결재담당자 팝업 초기화
                vm.aprvrPop = false;
            },
            fnItemDel:function(idx, i){
                let vm = this;

                vm.viewModel.detailListInfo[idx].artclList.splice(i,1);

                for(let i=0; i<vm.viewModel.detailListInfo[idx].artclList.length; i++){
                    let item = vm.viewModel.detailListInfo[idx].artclList[i];
                    item.job_bgng_dt != '' && item.job_bgng_dt != undefined ? $("#job_bgng_dt_"+idx+'_'+i).val(Common.fnConvertDateStr(item.job_bgng_dt, '-')) : '';
                    item.job_end_dt != '' && item.job_end_dt != undefined ? $("#job_end_dt_"+idx+'_'+i).val(Common.fnConvertDateStr(item.job_end_dt, '-')) : '';
                }
            },
            fnAdd:function(idx,i){
                //추가위험성평가에 추가
                let vm = this;

                let item = vm.viewModel.detailListInfo[idx].aditList[i];

                if(item.job_process_nm == '' || item.job_process_nm == undefined){
                    alert("작업절자 중공정을 입력해주세요.");
                    $("#org_job_process_nm_" + index).focus();
                    return false;
                }else if(item.job_bgng_dt == '' || item.job_bgng_dt == undefined){
                    alert("작업일정을 입력해주세요.");
                    $("#org_job_bgng_dt_" + index).focus();
                    return false;
                }else if(item.job_end_dt == '' || item.job_end_dt == undefined){
                    alert("작업일정을 입력해주세요.");
                    $("#org_job_end_dt_" + index).focus();
                    return false;
                }else if(item.main_risk_fctr == '' || item.main_risk_fctr == undefined){
                    alert("추가 위험요인을 입력해주세요.");
                    $("#org_main_risk_fctr_" + index).focus();
                    return false;
                }else if(item.safe_cntrpln == '' || item.safe_cntrpln == undefined){
                    alert("위험방지대책을 입력해주세요.");
                    $("#org_safe_cntrpln_" + index).focus();
                    return false;
                }else if(item.dgdgr_uml == '' || item.dgdgr_uml == undefined){
                    alert("위험도를 입력해주세요.");
                    $("#org_dgdgr_" + index).focus();
                    return false;
                }else{
                    let len = vm.viewModel.detailListInfo[idx].artclList.length;

                    vm.viewModel.detailListInfo[idx].artclList.push({
                        job_process_nm: item.job_process_nm
                        , job_bgng_dt: item.job_bgng_dt
                        , job_end_dt: item.job_end_dt
                        , main_risk_fctr: item.main_risk_fctr
                        , safe_cntrpln: item.safe_cntrpln
                        , dgdgr_uml: item.dgdgr_uml
                        , dgdgr_uml_nm: item.dgdgr_uml_nm
                        , now_mng_level: ''
                        , re_evl: ''
                        , spcm_risk_evl_sn: vm.viewModel.detailListInfo[idx].teamInfo.SPCM_RISK_EVL_SN
                        , se: '2'
                    }) ;

                    vm.$set(vm.viewModel.detailListInfo[idx].artclList, len-1, vm.viewModel.detailListInfo[idx].artclList[len-1]);
                }
            },
            fnOrgItemAdd: function(idx){
                let vm = this;
                
                let len = vm.viewModel.detailListInfo[idx].aditList.length;
                let rownum = (len + 1) ;
                vm.viewModel.detailListInfo[idx].aditList.push({'seq': rownum, job_bgng_dt:'', job_end_dt:''});

                vm.$nextTick(function() {
                    vm.fnCalendar();
                });
                
                for(let i=0; i<vm.viewModel.detailListInfo[idx].aditList.length; i++){
                    let item = vm.viewModel.detailListInfo[idx].aditList[i];
                    item.job_bgng_dt != '' && item.job_bgng_dt != undefined ? $("#org_job_bgng_dt_"+idx+'_'+i).val(Common.fnConvertDateStr(item.job_bgng_dt, '-')) : '';
                    item.job_end_dt != '' && item.job_end_dt != undefined ? $("#org_job_end_dt_"+idx+'_'+i).val(Common.fnConvertDateStr(item.job_end_dt, '-')) : '';
                }
            },
            fnOrgItemDel: function(idx, i){
                let vm = this;
                vm.viewModel.detailListInfo[idx].aditList.splice(i, 1);

                vm.$nextTick(function() {
                    vm.fnCalendar();
                });
                
                for(let i=0; i<vm.viewModel.detailListInfo[idx].aditList.length; i++){
                    let item = vm.viewModel.detailListInfo[idx].aditList[i];
                    item.job_bgng_dt != '' && item.job_bgng_dt != undefined ? $("#org_job_bgng_dt_"+idx+'_'+i).val(Common.fnConvertDateStr(item.job_bgng_dt, '-')) : '';
                    item.job_end_dt != '' && item.job_end_dt != undefined ? $("#org_job_end_dt_"+idx+'_'+i).val(Common.fnConvertDateStr(item.job_end_dt, '-')) : '';
                }
            },
            fnCalendar: function(){
                let vm = this;
                $( ".datepicker" ).datepicker({
                    changeMonth: true,
                    changeYear: true,
                    showMonthAfterYear: true, //타이틀영역 월이전 년출력 (년/월 순)
                    dayNamesMin : ['일요일','월요일','화요일','수요일','목요일','금요일','토요일'], //요일 출력텍스트(축소형)
                    monthNamesShort : ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'], //달 출력텍스트
                    dateFormat: "yy-mm-dd", // 표기방법
                    showOtherMonths : true, //현재월에 이전,다음달 날짜표시
                    showOn: "both",
                    buttonImage: "/img/ic-calendar.png",
                    buttonImageOnly: true,
                    buttonText: "날짜선택",
                    showButtonPanel: true,
                    closeText: '닫기',
                    yearSuffix: '년',
                    beforeShow: function() {
                        $(this).datepicker("widget").removeClass("datepicker-hide-days");
                        $(this).datepicker("widget").removeClass("datepicker-year-wrap");
                        if($(this).hasClass('month')) {
                            $(this).datepicker("widget").addClass("datepicker-hide-days");
                        } else if($(this).hasClass('year')) {
                            $(this).datepicker("widget").addClass("datepicker-year-wrap");
                        }
                    },
                    onSelect: function(dateText, inst) { 
                        let id = $(this).attr('id');
                        let arr = id.split('_');

                        // 마지막 두 요소 추출
                        let idx = arr[arr.length - 2];
                        let idx2 = arr[arr.length - 1];
                        $("input[name='" + $(this).attr("name") +"']")(function(index) {
                            if($(this).attr('id') == id){
                                if($(this).attr("name") == 'sdt'){
                                    vm.viewModel.data.evl_bgng_dt = dateText;
                                }else if($(this).attr("name") == 'edt'){
                                    vm.viewModel.data.evl_end_dt = dateText;
                                }else if($(this).attr("name") == 'org_job_bgng_dt'){
                                    vm.viewModel.detailListInfo[idx].aditList[idx2].job_bgng_dt = dateText;
                                }else if($(this).attr("name") == 'org_job_end_dt'){
                                    vm.viewModel.detailListInfo[idx].aditList[idx2].job_end_dt = dateText;
                                }else if($(this).attr("name") == 'job_bgng_dt'){
                                    vm.viewModel.detailListInfo[idx].artclList[idx2].job_bgng_dt = dateText;
                                }else if($(this).attr("name") == 'job_end_dt'){
                                    vm.viewModel.detailListInfo[idx].artclList[idx2].job_end_dt = dateText;
                                }

                                if($(this).attr("name") == 'sdt' || $(this).attr("name") == 'edt'){
                                    if(vm.viewModel.data.evl_bgng_dt != undefined && vm.viewModel.data.evl_end_dt != undefined){
                                        var date1 = vm.viewModel.data.evl_bgng_dt;
                                        var date2 = vm.viewModel.data.evl_end_dt;
                                        
                                        if(date1 != "" &&  date2 != ""){
                                            if(date1 > date2){
                                                alert("시작일이 종료일보다 클 수 없습니다.");
                                                vm.viewModel.data.evl_end_dt = '';
                                                $("#edt").val("");
                                            }
                                        }
                                    }

                                    if($(this).attr("name") == 'sdt'){
                                        // for(let i=0; i<vm.viewModel.chckArtclList.length; i++){
                                        //     vm.viewModel.chckArtclList[i].job_bgng_dt = vm.viewModel.data.evl_bgng_dt;
                                        // }
                                        vm.viewModel.detailListInfo.map(data => {
                                            data.artclList.filter(item=>item.se == 1).map(data2 => {
                                                data2.job_bgng_dt = vm.viewModel.data.evl_bgng_dt;

                                                return data2;
                                            })
                                            return data;
                                        });
                                    }else{
                                        // for(let i=0; i<vm.viewModel.chckArtclList.length; i++){
                                        //     vm.viewModel.chckArtclList[i].job_end_dt = vm.viewModel.data.evl_end_dt;
                                        // }

                                        vm.viewModel.detailListInfo.map(data => {
                                            data.artclList.filter(item=>item.se == 1).map(data2 => {
                                                data2.job_end_dt = vm.viewModel.data.evl_end_dt;

                                                return data2;
                                            })
                                            return data;
                                        });
                                    }
                                }else if($(this).attr("name") == 'org_job_bgng_dt' || $(this).attr("name") == 'org_job_end_dt'){
                                    if(vm.viewModel.detailListInfo[idx].aditList[index].job_bgng_dt != undefined && vm.viewModel.detailListInfo[idx].aditList[index].job_end_dt != undefined){
                                        var date1 = vm.viewModel.detailListInfo[idx].aditList[index].job_bgng_dt;
                                        var date2 = vm.viewModel.detailListInfo[idx].aditList[index].job_end_dt;
                                        
                                        if(date1 != "" &&  date2 != ""){
                                            if(date1 > date2){
                                                alert("시작일이 종료일보다 클 수 없습니다.");
                                                vm.viewModel.detailListInfo[idx].aditList[index].job_end_dt = '';
                                                $("#org_job_end_dt_"+ idx + '_' + index).val("");
                                            }
                                        }
                                    }
                                }else{
                                    if(vm.viewModel.detailListInfo[idx].artclList[index].job_bgng_dt != undefined && vm.viewModel.detailListInfo[idx].artclList[index].job_end_dt != undefined){
                                        var date1 = vm.viewModel.detailListInfo[idx].artclList[index].job_bgng_dt;
                                        var date2 = vm.viewModel.detailListInfo[idx].artclList[index].job_end_dt;
                                        
                                        if(date1 != "" &&  date2 != ""){
                                            if(date1 > date2){
                                                alert("시작일이 종료일보다 클 수 없습니다.");
                                                vm.viewModel.detailListInfo[idx].artclList[index].job_end_dt = '';
                                                $("#job_end_dt_"+ idx + '_' + index).val("");
                                            }
                                        }
                                    }
                                }
                            }
                        });  
                    }
                });
                $( ".datepicker.readonly" ).datepicker( "option", "readonly", true );	
            },
            fnChngDgdgr: function(idx, i){
                let vm = this;

                let dgdgr_uml = vm.viewModel.detailListInfo[idx].aditList[i].dgdgr_uml;
                let list = vm.viewModel.dgdgrList.filter(data=> data.CODE == dgdgr_uml);
                vm.viewModel.detailListInfo[idx].aditList[i].dgdgr_uml_nm = list[0].CODE_NM;
            },
            fnInputNum: function(idx){
                let vm = this;
                
                let val = $("#chck_cnt_" + idx).val().replace(/[^0-9]/g, '');
                vm.viewModel.detailListInfo[idx].detail.chck_cnt = val;
                $("#chck_cnt_" + idx).val(val);
            },
            fnFstRiskPopup: function(index){
                let vm = this;

                vm.idx = index;

                vm.bplcPop = false
                vm.aprvrPop=false;
                vm.fstPop=false;
                vm.viewPop=false;

                if(vm.viewModel.data.bplc_sn == null){
                    alert("현장명을 선택해주세요.");
                    return false;
                }else{
                    vm.fstPop=true;
                    vm.$nextTick(function() {
                        if(vm.fstPop) {
                            vm.$refs.fst.fnInit(vm.viewModel.data.bplc_sn);
                        }
                    });
                }
            },
            fnSelect:function(list){
                let vm = this;
                vm.fstPop=false;

                let len = vm.viewModel.detailListInfo[vm.idx].aditList.length;

                for(let i=0; i<list.length; i++){
                    let val = {
                        seq: len == 0 ? 0 : (vm.viewModel.detailListInfo[vm.idx].aditList[len-1].seq + 1),
                        job_process_nm: list[i].job_process_nm,
                        main_risk_fctr: list[i].risk_factor,
                        safe_cntrpln: list[i].cntrpln,
                    }

                    vm.viewModel.detailListInfo[vm.idx].aditList.push(val);
                }

                vm.$nextTick(function() {
                    vm.fnCalendar();
                });
            },
            fnPrevInfo: function(){
                let vm = this;

                if(vm.viewModel.data.bplc_sn == '' || vm.viewModel.data.bplc_sn == undefined){
                    alert("현장명을 선택해주세요.");
                    return false;
                }else if($("#sdt").val() == "" || $("#edt").val() == ""){
                    alert("평가기간을 입력해주세요.");
                    return false;
                }else if(vm.teamChk.length == 0){
                    alert("팀명을 선택해주세요.");
                }else{
                    
                    let sdt = $("#sdt").val();
                    let edt = $("#edt").val();
                    
                    let data = {
                        bplc_sn: vm.viewModel.data.bplc_sn,
                        // ordtm_risk_evl_sn: vm.viewModel.data.ordtm_risk_evl_sn,
                        teamChk: vm.teamChk,

                        // work_type_nm: vm.viewModel.data.work_type_nm,
                    }

                    

                    Axios.post("/selectPmntPrevInfo.do", data)
                    .then(function(response) {
                        let teamNm = [];
                        if(response.data.artclList != null){
                            let list = response.data.artclList.filter(data=>data.se == 1).map(data => {
                                data.dgdgr_uml = data.re_evl;
                                data.dgdgr_uml_nm = data.re_evl_nm;
                                data.now_mng_level = '';
                                data.now_mng_level_nm = '';
                                data.re_evl = '';
                                data.re_evl_nm = '';

                                data.job_bgng_dt = sdt;
                                data.job_end_dt = edt;

                                return data;
                            });

                            vm.viewModel.detailListInfo.map(data => {
                                let artclList = list.filter(item=> item.spcm_risk_evl_sn == data.teamInfo.SPCM_RISK_EVL_SN);

                                if(artclList.length > 0){
                                    data.artclList = artclList;
                                }else{
                                    teamNm.push(data.teamInfo.TEAM_NM);
                                }
                                return data;
                            })
                            
                            // $("input[name='cnfl']").prop("checked", false);

                            // for(let i=0; i<response.data.spcmList.length; i++){
                            //     let spcm = response.data.spcmList[i].spcm_risk_evl_sn
                            //     $("input[id='cnfl_" + spcm + "']").prop("checked", true);
                            // }
                            
                            vm.$nextTick(function() {
                                vm.fnCalendar();
                            });

                            if(teamNm.length > 0){
                                alert(teamNm + '의 일치하는 이전회차정보가 없습니다.');
                            }
                        }else{
                            alert("일치하는 이전회차정보가 없습니다.");
                        }
                        
                    });
                }
            },
            fnPrint: function(){
                let vm = this;

                vm.bplcPop = false
                vm.aprvrPop=false;
                vm.fstPop=false;
                if(vm.teamChk.length == 0){
                    alert("팀명을 선택해주세요.");
                    return false;
                }else{
                    vm.viewPop=true;

                    vm.$nextTick(function() {
                        if(vm.viewPop) {
                            let copyList = JSON.parse(JSON.stringify(vm.viewModel.detailListInfo));
                            vm.$refs.viewPopup.fnInit2(vm.viewModel.data, copyList, $("#wrt_dt").val());
                        }
                    });
                }
            },
            // fnRowSpan: function(item, i){
            //     let rs = 1;
            //     while (
            //         i + rs < this.viewModel.chckArtclList.length &&
            //         this.viewModel.chckArtclList[i + rs].spcm_risk_evl_sn === item.spcm_risk_evl_sn
            //     ) {
            //         rs++;
            //     }
            //     return rs;
            // }
        }
    };
</script>