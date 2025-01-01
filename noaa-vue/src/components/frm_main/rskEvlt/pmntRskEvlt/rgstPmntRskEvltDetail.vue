<template>
    <div>
        <div class="contents" style="width: calc(-15rem + 100vw);">
            <div class="divide">
                <div>
                    <div>
                        <h3>기본정보</h3>
                        <table class="table horizontal write">
                            <caption>상시 위험성평가 등록</caption>
                            <tbody>
                                <tr>
                                    <th scope="row" class="w180"><label for="bplc">현장명</label></th>
                                    <td colspan="3">
                                        {{ viewModel.data.bplc_nm }}
                                    </td>
                                </tr>
                                <tr>
                                    <th scope="row"><label for="work_type_nm">공종명</label></th>
                                <td>
                                        {{ viewModel.data.work_type_nm }}
                                    </td>
                                </tr>
                                <tr>
                                    <th scope="row">평가기간</th>
                                    <td>
                                        {{ viewModel.data.evl_bgng_dt|yyyyMMdd }} ~ {{ viewModel.data.evl_end_dt|yyyyMMdd }}
                                    </td>
                                </tr>
                                <tr>
                                    <th scope="row">작성일자</th>
                                    <td>
                                        {{ viewModel.data.wrt_dt|yyyyMMdd }}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div>
                        <ul class="accordion">
                            <template v-for="(detail, idx) in viewModel.detailListInfo" >
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
                                                    </tr>
                                                    <tr>
                                                        <th scope="col">위험도</th>
                                                        <th scope="col">이행상태</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr v-for="(item, i) in detail.artclList.filter(data=>data.se == 1)">
                                                        <td :rowspan="detail.artclList.filter(data=>data.se == 1).length" v-if="i == 0">소공정<br/>위험성평가</td>
                                                        <!-- <td class="td_wrap" v-if="i === 0 || item.spcm_risk_evl_sn !== viewModel.chckArtclList[(i - 1)].spcm_risk_evl_sn" :rowspan="fnRowSpan('spcm', item, i)">{{ item.bplc_team_nm }}</td> -->
                                                        <td  class="td_wrap text-left">{{ item.job_process_nm }}</td>
                                                        <td class="text-left td_wrap">
                                                            {{ item.eqpment }}
                                                        </td>
                                                        <td class="td_wrap">
                                                            {{ item.job_bgng_dt|yyyyMMdd }} ~ {{ item.job_end_dt|yyyyMMdd }}
                                                        </td>
                                                        <td class="text-left td_wrap">{{ item.main_risk_fctr }}</td>
                                                        <td class="text-left td_wrap">
                                                            {{ item.risk_type }}
                                                        </td>
                                                        <td class="td_wrap text-left">{{ item.safe_cntrpln }}</td>
                                                        <td>{{ item.dgdgr_uml_nm }}</td>
                                                        <td class="td_wrap">
                                                            {{ item.now_mng_level_nm }}
                                                        </td>
                                                        <td class="td_wrap">
                                                            {{item.re_evl_nm}}
                                                        </td>
                                                    </tr>
                                                    <tr v-for="(item, i) in detail.artclList.filter(data=>data.se == 2)">
                                                        <td :rowspan="detail.artclList.filter(data=>data.se == 2).length" v-if="i == 0">추가<br/>위험성평가</td>
                                                        <!-- <td class="td_wrap" v-if="i === 0 || item.spcm_risk_evl_sn !== viewModel.addArtclList[(i - 1)].spcm_risk_evl_sn" :rowspan="fnRowSpan('add', item, i)">{{ item.bplc_team_nm }}</td> -->
                                                        <td class="text-left td_wrap">{{ item.job_process_nm }}</td>
                                                        <td class="text-left td_wrap">
                                                            {{ item.eqpment }}
                                                        </td>
                                                        <td class="td_wrap">
                                                            {{ item.job_bgng_dt|yyyyMMdd }} ~ {{ item.job_end_dt|yyyyMMdd }}
                                                        </td>
                                                        <td class="text-left td_wrap">{{ item.main_risk_fctr }}</td>
                                                        <td class="text-left td_wrap">
                                                            {{ item.risk_type }}
                                                        </td>
                                                        <td class="text-left td_wrap">{{ item.safe_cntrpln }}</td>
                                                        <td>{{ item.dgdgr_uml_nm }}</td>
                                                        <td class="td_wrap">
                                                            {{ item.now_mng_level_nm }}
                                                        </td>
                                                        <td class="td_wrap">
                                                            {{ item.re_evl_nm }}
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <th colspan="1">아차사고사례(경험)</th>
                                                        <td colspan="6">
                                                            <textarea v-model="detail.detail.acdnt_case" :id="'acdnt_case'" style="border: none; background-color: white;" disabled></textarea>
                                                        </td>
                                                        <th>지적</th>
                                                        <td colspan="2">{{ detail.detail.chck_cnt }}</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                        <div class="overflow-x overflow-y" style="width: 100%; max-height: 500px;">
                                            <table class="table write">
                                                <thead>
                                                    <tr>
                                                        <th scope="col" rowspan="3">장소내용</th>
                                                        <th scope="col" rowspan="3">작업절차<br>[중공정]</th>
                                                        <th scope="col" rowspan="3">작업일정</th>
                                                        <th scope="col" colspan="2">위험성평가</th>
                                                        <th scope="col" rowspan="3">위험도</th>
                                                        <th scope="col" rowspan="3">검토의견</th>
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
                                                        <td class="td_wrap text-left">{{ item.plc_cn }}</td>
                                                        <td class="td_wrap text-left">{{ item.job_process_nm }}</td>
                                                        <td class="td_wrap">
                                                            {{ item.job_bgng_dt|yyyyMMdd }} ~ {{ item.job_end_dt|yyyyMMdd }}
                                                        </td>
                                                        <td class="td_wrap text-left">
                                                            {{ item.main_risk_fctr }}
                                                        </td>
                                                        <td class="td_wrap text-left">
                                                            {{ item.safe_cntrpln }}
                                                        </td>
                                                        <td class="td_wrap">
                                                            {{ item.dgdgr_uml_nm }}
                                                        </td>
                                                        <td :rowspan="detail.aditList.length" v-if="i == 0" class="td_wrap">
                                                            <textarea v-model="detail.aditList[0].rvw_opnn" :id="'rvw_opnn'" style="border: none; background-color: white;" disabled></textarea>
                                                        </td>
                                                    </tr>
                                                    <tr v-if="detail.aditList.length == 0"><td :colspan="'7'">데이터가 없습니다.</td></tr>
                                                    <tr>
                                                        <th colspan="1">건의사항</th>
                                                        <td colspan="8">
                                                            <textarea v-model="detail.detail.sugest_mttr" :id="'sugest_mttr'" style="border: none; background-color: white;" disabled></textarea>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </li>
                            </template>
                        </ul>
                    </div>
                    <div class="btn-group btn-right">
                        <router-link :to="'/'" class="btn btn-white"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-list-back"></use></svg>목록</router-link>
                    </div>
                </div>
                <div class="approval">
                    <h3>결재 정보</h3>
                    <ul>
                        <li class="signed">
                            <a href="javascript:;">
                                <p>작성자</p>
                                <div class="user_img" id="1">
                                    <img :src="viewModel.data.wrtr_sign">
                                </div>
                                <span>{{ viewModel.data.wrtr_nm == "" ? "작성자 등록":viewModel.data.wrtr_nm }}</span>
                            </a>
                        </li>
                        <li :class="[viewModel.data.rvwr && viewModel.data.rvwr_sign_yn != 'Y' ? 'set' : viewModel.data.rvwr && viewModel.data.rvwr_sign_yn=='Y' ? 'signed' : null]" @click="fnSignPop('rvwr')">
                            <a href="javascript:;">
                                <p>검토자</p>
                                <div class="user_img" id="">
                                    <img :src="viewModel.data.rvwr_sign" v-bind:style="viewModel.data.rvwr_sign_yn != 'Y' ? 'display: none;' : ''">
                                </div>
                                <span>{{ viewModel.data.rvwr_nm == "" ? "검토자 등록":viewModel.data.rvwr_nm }}</span>
                            </a>
                        </li>
                        <li :class="[viewModel.data.dcsnr != '' && viewModel.data.dcsnr_sign_yn != 'Y' ? 'set' : viewModel.data.dcsnr != '' && viewModel.data.dcsnr_sign_yn=='Y' ? 'signed' : null]"  @click="fnSignPop('dcsnr', viewModel.data.wrt_cmpl_yn)">
                            <a href="javascript:;">
                                <p>결정자</p>
                                <div class="user_img" id="3">
                                    <img :src="viewModel.data.dcsnr_sign" v-bind:style="viewModel.data.dcsnr_sign_yn != 'Y' ? 'display: none;' : ''">
                                </div>
                                <span>{{ viewModel.data.dcsnr_nm == "" ? "결정자 등록":viewModel.data.dcsnr_nm }}</span>
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <sign ref="sign" v-if="signPop==true"></sign>
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
    import sign from "../../popup/sign_popup.vue";
    import Message, {messageUtil} from "../../../../common/js/message";
    import fromValidation from "../../../../common/js/fromValidation";
    
    export default {
        components: {
            'sign': sign,
		},
        data: function() {
            return {
                seq: 0,
                teamChk: [],
                signPop:false,
                viewPop:false,
                signPopSort:'',
                AprvrGbn:'',
                viewModel:{
                    data:{
                        rvwr:'',
                        rvwr_nm:'',
                        dcsnr:'',
                        dcsnr_nm:'',
                    },
                    userInfo:{},
                    detailListInfo:[],
                    teamList:[],
                    itemList:[],
                    dgdgrList:[],       //위험도 코드리스트
                    chckArtclList:[],   //소공정 리스트
                    addArtclList:[],    //추가위험성평가 리스트
                    addOrgArtclList:[{seq: 0}]    //추가위험성평가 리스트_원본
                }
            };
        },
        computed: {
        }, 
        activated:function(){
            this.fnInit();
        },
        deactivated:function(){
            this.$destroy();
        },
        mounted: function() {
            let vm = this;
            // vm.fnInit();
            // calendarInput();
        },
        methods: {
            //기본세팅
            fnInit:function(){
                let vm = this;
                vm.viewModel.userInfo = vm.$store.state.global.userInfo;
                
                let sn = vm.$route.params.sn;

                vm.fnDetail(sn);
            },
            fnDetail: function(sn){
                let vm = this;

                let send = {
                    ordtm_risk_evl_sn: sn,
                }

                Axios.post("/selectPmntRskEvltDetail.do", send)
                .then(function(response) {
                    vm.viewModel.data = response.data.detail;
                    // vm.viewModel.chckArtclList = response.data.artclList.filter(data=>data.se == 1);
                    // vm.viewModel.addArtclList = response.data.artclList.filter(data=>data.se == 2);
                    // vm.viewModel.addOrgArtclList = response.data.aditList;
                    vm.viewModel.detailListInfo = response.data.detailListInfo;
                    //코드값
                    vm.viewModel.dgdgrList = response.data.dgdgrList;

                    //서명 이미지
                    vm.viewModel.data.wrtr_sign = vm.viewModel.data.wrtr_sign.charAt() == '/' ? vm.viewModel.data.wrtr_sign : vm.viewModel.data.wrtr_sign.substr(2);
                    vm.viewModel.data.rvwr_sign = vm.viewModel.data.rvwr_sign.charAt() == '/' ? vm.viewModel.data.rvwr_sign : vm.viewModel.data.rvwr_sign.substr(2);
                    vm.viewModel.data.dcsnr_sign = vm.viewModel.data.dcsnr_sign.charAt() == '/' ? vm.viewModel.data.dcsnr_sign : vm.viewModel.data.dcsnr_sign.substr(2);                    
                });
            },
            fnSignPop(gbn, yn){
                let vm = this;
                vm.signPopSort = gbn;

                vm.viewPop = false;
                let user_id = vm.viewModel.userInfo.user_id;
                
                if(gbn == 'rvwr' && vm.viewModel.data.rvwr == ''){
                    alert("검토자는 없습니다.");
                    return false;
                }else if(gbn == 'rvwr' && vm.viewModel.data.rvwr != user_id){
                    alert("검토자만 결재를 진행할 수 있습니다.");
                    return false;
                }else if(gbn == 'rvwr' && vm.viewModel.data.rvwr_sign_yn == 'Y'){
                    alert("이미 결재 완료하였습니다.");
                    return false;
                }else if(gbn == 'dcsnr' && vm.viewModel.data.dcsnr != user_id){
                    alert("결정자만 결재를 진행할 수 있습니다.");
                    return false;
                }else if(gbn == 'dcsnr' && vm.viewModel.data.dcsnr_sign_yn == 'Y'){
                    alert("이미 결재 완료하였습니다.");
                    return false;
                }else if(gbn == 'dcsnr' && vm.viewModel.data.rvwr != '' && vm.viewModel.data.rvwr_sign_yn != 'Y' && vm.viewModel.data.dcsnr == user_id){
                    alert("결정자 결재가 완료되지 않았습니다.")
                    return false;
                }else if(yn == 'N'){
                    alert("이행상태, 재평가 입력되지 않은 데이터가 있습니다.");
                    return false;
                }else{
                    vm.signPop = true;
                    vm.$nextTick(function() {
                        if(vm.signPop) {
                            vm.$refs.sign.fnInit(gbn);
                        }
                    })
                }
            },
            fnSign: function(){
                let vm = this;
                let data = {
                    reg_id: vm.viewModel.userInfo.user_id,
                    ordtm_risk_evl_sn: vm.viewModel.data.ordtm_risk_evl_sn,
                    gbn: vm.signPopSort
                }
                
                Axios.post("/updatePmntRskEvltAprvr.do", data)
                    .then(function(response) {
                        alert("결재가 완료되었습니다.");
                        if(vm.signPopSort == 'wrtr'){
                            if(vm.viewModel.data.mdtr == "" || vm.viewModel.data.mdtr == null){
                                vm.sendPushNotification(vm.viewModel.data.dcsnr,"상시 위험성평가","작성자 결재가 완료되었습니다. PC에서 확인바랍니다.");
                            }else{
                                vm.sendPushNotification(vm.viewModel.data.mdtr,"상시 위험성평가","작성자 결재가 완료되었습니다. PC에서 확인바랍니다.");
                            }
                        }
                        if(vm.signPopSort == 'mdtr')vm.sendPushNotification(vm.viewModel.data.dcsnr,"상시 위험성평가","조정자 결재가 완료되었습니다. PC에서 확인바랍니다.");
                        if(vm.signPopSort == 'dcsnr'){
                            let senduser = "";
                            senduser = vm.viewModel.data.wrtr;
                            if(vm.viewModel.data.mdtr != "" && vm.viewModel.data.mdtr != null) senduser = vm.viewModel.data.mdtr+ "," + vm.viewModel.data.wrtr;
                            vm.sendPushNotification(senduser,"상시 위험성평가","상시 위험성평가 결재가 종결되었습니다. PC에서 확인바랍니다.");
                        }
                        vm.fnDetail(vm.viewModel.data.ordtm_risk_evl_sn);
                }).catch(function(ex) {
                    alert(Message.ERROR);
                });
            },
            fnViewPopup: function(sn){
                let vm = this;
                vm.viewPop = true;
                vm.signPop = false;
                vm.$nextTick(function() {
                    if(vm.viewPop) {
                        vm.$refs.viewPopup.fnInit(sn);
                    }
                })
            },
            fnRowSpan: function(type, item, i){
                let rs = 1;
                if(type == 'spcm'){
                    while (
                        i + rs < this.viewModel.chckArtclList.length &&
                        this.viewModel.chckArtclList[i + rs].spcm_risk_evl_sn === item.spcm_risk_evl_sn
                    ) {
                        rs++;
                    }
                }else{
                    while (
                        i + rs < this.viewModel.addArtclList.length &&
                        this.viewModel.addArtclList[i + rs].spcm_risk_evl_sn === item.spcm_risk_evl_sn
                    ) {
                        rs++;
                    }
                }
                return rs;
            },
            sendPushNotification(user_id, title, message) {
                $.ajax({
                    type: "post",
                    url:"/api/pushSendPerson.do",
                    data:{
                        // 제목 및 내용
                        title : title,
                        message :  message,
                        user_id : user_id,
                        // 클릭 시 이동 화면주소
                        link : "/main/index.do"
                    }
                });
            },
        }
    };
</script>