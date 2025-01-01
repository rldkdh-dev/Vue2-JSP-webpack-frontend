<template>
    <div>
        <div class="contents">
            <div class="divide">
                <div>
                    <div>
                        <h3>기본정보</h3>
                        <table class="table horizontal write">
                            <caption>기본정보</caption>
                            <tbody>
                                <tr>
                                    <th scope="row" class="w100">현장명</th>
                                    <td>
                                        {{ viewModel.data.bplc_nm }}
                                    </td>
                                </tr>
                                <tr>
                                    <th scope="row">팀명</th>
                                    <td>{{viewModel.data.team_nm}}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div>
                        <table class="table horizontal">
                            <caption>공종</caption>
                            <tbody>
                                <tr v-for="idx in Math.ceil((Number(viewModel.cfnlList.length) + 1) / 6)">
                                    <th scope="rowgroup" :rowspan="Math.ceil((Number(viewModel.cfnlList.length) + 2) / 6)" v-if="idx == 1" class="w100">공종</th>
                                    <td v-for="cnt in 6">
                                        <label :for="'cnfl_'+viewModel.cfnlList[ ((idx - 1) * 6) + (cnt - 1) ].work_type_sn" v-if="((idx - 1) * 6) + (cnt - 1) < viewModel.cfnlList.length">
                                            <input type="checkbox" :id="'cnfl_'+viewModel.cfnlList[ ((idx - 1) * 6) + (cnt - 1) ].work_type_sn" name="cnfl" :value="viewModel.cfnlList[ ((idx - 1) * 6) + (cnt - 1) ].work_type_sn" @change="fnGetCfnlItem(viewModel.cfnlList[ ((idx - 1) * 6) + (cnt - 1) ].work_type_sn, $event)" disabled>{{ viewModel.cfnlList[ ((idx - 1) * 6) + (cnt - 1) ].cfnl_nm }}
                                        </label>
                                        <label :for="'cnfl_etc'" v-if="((idx - 1) * 6) + (cnt - 1) == viewModel.cfnlList.length" >
                                            <input type="checkbox" :id="'cnfl_etc'" name="cnfl" :value="'etc'" @change="fnGetCfnlItem('etc', $event)" disabled>일반작업
                                        </label>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div>
                        <rgstrBsnsAplctSubDetail :ref="'sub'" @selCfnlList="fnSelCfnlList"></rgstrBsnsAplctSubDetail>
                    </div>

                    <div>
                        <h3>참석자</h3>
                        <table class="table horizontal write">
                            <caption>참석자</caption>
                            <thead>
                                <tr>
                                    <th scope="col">직책(담당)</th>
                                    <th scope="col">성명</th>
                                    <th scope="col">서명</th>
                                </tr>
                            </thead>
                            <tbody v-if="viewModel.atdrnList.length > 0">
                                <tr v-for="item in viewModel.atdrnList" :key="item">
                                    <td>{{ item.ocpt_detail_nm }}</td>
                                    <td>{{ item.user_nm }}</td>
                                    <td>
                                        <button v-if="viewModel.userInfo.user_id == item.user_id && item.sign_yn == 'N'" @click="fnAtdrn" class="btn btn-small btn-blue" >서명확인</button>
                                        <img v-else-if="item.sign_yn == 'Y'" :src="item.user_sign" style="width: 50px;">
                                    </td>
                                </tr>
                            </tbody>
                            <tbody v-else>
                                <tr>
                                    <td colspan="3">데이터가 없습니다</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div class="btn-group btn-right">
                        <router-link :to="'/'" class="btn btn-white"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-list-back"></use></svg>목록</router-link>
                    </div>
                </div>
                <div class="approval">
                    <h3>결재 정보</h3>
                    <ul>
                        <li :class="[viewModel.data.wrtr && viewModel.data.wrtr_sign_yn != 'Y' ? 'set' : viewModel.data.wrtr && viewModel.data.wrtr_sign_yn=='Y' ? 'signed' : null]">
                            <a href="javascript:;">
                                <p>작성자</p>
                                <div class="user_img" id="1">
                                    <img :src="viewModel.data.wrtr_sign" v-bind:style="viewModel.data.wrtr_sign_yn != 'Y' ? 'display: none;' : ''">
                                </div>
                                <span>{{ viewModel.data.wrtr_nm == "" || viewModel.data.wrtr_nm == null  ? "작성자 등록":viewModel.data.wrtr_nm }}</span>
                            </a>
                        </li>
                        <li :class="[viewModel.data.mdtr && viewModel.data.mdtr_sign_yn != 'Y' ? 'set' : viewModel.data.mdtr && viewModel.data.mdtr_sign_yn=='Y' ? 'signed' : null]" @click="fnSignPop('mdtr')">
                            <a href="javascript:;">
                                <p>조정자</p>
                                <div class="user_img" id="">
                                    <img :src="viewModel.data.mdtr_sign" v-bind:style="viewModel.data.mdtr_sign_yn != 'Y' ? 'display: none;' : ''">
                                </div>
                                <span>{{ viewModel.data.mdtr_nm == "" ? "조정자 등록":viewModel.data.mdtr_nm }}</span>
                            </a>
                        </li>
                        <li :class="[viewModel.data.dcsnr != '' && viewModel.data.dcsnr_sign_yn != 'Y' ? 'set' : viewModel.data.dcsnr != '' && viewModel.data.dcsnr_sign_yn=='Y' ? 'signed' : null]"  @click="fnSignPop('dcsnr')">
                            <a href="javascript:;">
                                <p>결정자</p>
                                <div class="user_img" id="3">
                                    <img :src="viewModel.data.dcsnr_sign" v-bind:style="viewModel.data.dcsnr_sign_yn != 'Y' ? 'display: none;' : ''">
                                </div>
                                <span>{{ viewModel.data.dcsnr_nm == "" || viewModel.data.dcsnr_nm == null ? "결정자 등록":viewModel.data.dcsnr_nm }}</span>
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <sign ref="sign" v-if="signPop==true"></sign>
    </div>
</template>

<script>
    import "es6-promise/auto";
    import Vue from "vue";
    import Axios from "axios";
    import Message, {messageUtil} from "../../../../common/js/message";
    import fromValidation from "../../../../common/js/fromValidation";
    import sign from "../../popup/sign_popup.vue";
    import rgstrBsnsAplctSubDetail from "./rgstrBsnsAplctSubDetail.vue";
    
    export default {
        activated:function(){
            this.fnInit();
        },
        deactivated:function(){
            this.$destroy();
        },
        components: {
            'sign': sign,
            'rgstrBsnsAplctSubDetail': rgstrBsnsAplctSubDetail
		},
        data: function() {
            return {
                signPop:false,
                signPopSort:'',
                AprvrGbn:'',
                viewModel:{
                    data:{
                        mdtr:'',
                        mdtr_nm:'',
                        dcsnr:'',
                        dcsnr_nm:'',
                    },
                    userInfo:{},
                    selCfnlList:[],   //선택된 공종과 정보 담
                    cfnlList:[],        //공종 리스트
                    dgdgrList:[],       //위험도 코드리스트
                    atdrnList:[],
                }
            };
        },
        computed: {
        }, 
        mounted: function() {
            let vm = this;
            // vm.fnInit();
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
                    spcm_risk_evl_sn: sn,
                }
                Axios.post("/selectSmPrcsRskEvltDetail.do", send)
                .then(function(response) {
                    vm.viewModel.data = response.data.mstDetail;
                    vm.viewModel.selCfnlList = response.data.selCfnlList;
                    vm.viewModel.atdrnList = response.data.atdrnList;

                    //코드값
                    vm.viewModel.cfnlList = response.data.cfnlList;
                    vm.viewModel.dgdgrList = response.data.dgdgrList;

                    //서명 이미지
                    vm.viewModel.data.wrtr_sign = vm.viewModel.data.wrtr_sign.charAt() == '/' ? vm.viewModel.data.wrtr_sign : vm.viewModel.data.wrtr_sign.substr(2);
                    vm.viewModel.data.mdtr_sign = vm.viewModel.data.mdtr_sign.charAt() == '/' ? vm.viewModel.data.mdtr_sign : vm.viewModel.data.mdtr_sign.substr(2);
                    vm.viewModel.data.dcsnr_sign = vm.viewModel.data.dcsnr_sign.charAt() == '/' ? vm.viewModel.data.dcsnr_sign : vm.viewModel.data.dcsnr_sign.substr(2);

                    vm.$refs.sub.fnInit(vm.viewModel.dgdgrList, vm.viewModel.selCfnlList);                    
                }).then(function(){

                    for(let i= 0; i<vm.viewModel.atdrnList.length; i++){
                        vm.viewModel.atdrnList[i].user_sign = vm.viewModel.atdrnList[i].user_sign.charAt() == '/' ? vm.viewModel.atdrnList[i].user_sign : vm.viewModel.atdrnList[i].user_sign.substr(2);
                    }

                    for(let i= 0; i<vm.viewModel.selCfnlList.length; i++){
                        let sn = vm.viewModel.selCfnlList[i].work_type_sn;

                        if(sn == 9999){
                            $("input:checkbox[id='cnfl_etc']").prop("checked", true);
                        }else{
                            $("input:checkbox[id='cnfl_" + sn + "']").prop("checked", true);
                        }
                    }

                     //서명 가져오기
                     if(vm.viewModel.atdrnList.length > 0) {
                        for(let i=0; i<vm.viewModel.atdrnList.length;i++){
                            if(vm.viewModel.atdrnList[i].strg_path != null){
                                if(vm.viewModel.atdrnList[i].user_sign.charAt()=='/') {       //리눅스 경로때문에 사용
                                vm.viewModel.atdrnList[i].user_sign = vm.viewModel.atdrnList[i].user_sign;
                                }else{
                                    vm.viewModel.atdrnList[i].user_sign = vm.viewModel.atdrnList[i].user_sign.substring(2);
                                }    
                            }
                        }
                    }
                });
            },
            fnSignPop(gbn){
                let vm = this;
                vm.signPopSort = gbn;

                let user_id = vm.viewModel.userInfo.user_id;
                
                if(gbn == 'mdtr' && vm.viewModel.data.mdtr == ''){
                    alert("조정자는 없습니다.");
                    return false;
                }else if(gbn == 'mdtr' && vm.viewModel.data.mdtr != user_id){
                    alert("조정자만 결재를 진행할 수 있습니다.");
                    return false;
                }else if(gbn == 'mdtr' && vm.viewModel.data.mdtr_sign_yn == 'Y'){
                    alert("이미 결재 완료하였습니다.");
                    return false;
                }else if(gbn == 'dcsnr' && vm.viewModel.data.dcsnr != user_id){
                    alert("결정자만 결재를 진행할 수 있습니다.");
                    return false;
                }else if(gbn == 'dcsnr' && vm.viewModel.data.dcsnr_sign_yn == 'Y'){
                    alert("이미 결재 완료하였습니다.");
                    return false;
                }else if(gbn == 'dcsnr' && vm.viewModel.data.mdtr != '' && vm.viewModel.data.mdtr_sign_yn != 'Y' && vm.viewModel.data.dcsnr == user_id){
                    alert("조정자 결재가 완료되지 않았습니다.")
                    return false;
                }else if(vm.viewModel.data.sign_all_yn == 'N'){
                    alert("참석자 서명이 완료되지 않아 결재를 진행하실수 없습니다.");
                }else if(vm.viewModel.data.video_cnt == 0){
                    alert("영상등록이 진행되지 않아 결재를 진행하실 수 없습니다.");
                }else if(vm.viewModel.data.file_cnt == 0){
                    alert("소공정위험성평가표가 업로드 되지 않아 결재를 진행하실 수 없습니다.");
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
                    spcm_risk_evl_sn: vm.viewModel.data.spcm_risk_evl_sn,
                    gbn: vm.signPopSort
                }
                
                Axios.post("/updateSmPrcsRskEvltAprvr.do", data)
                    .then(function(response) {
                        alert("결재가 완료되었습니다.");
                        if(vm.signPopSort == 'wrtr'){
                            if(vm.viewModel.data.mdtr == "" || vm.viewModel.data.mdtr == null){
                                vm.sendPushNotification(vm.viewModel.data.dcsnr,"소공정위험성평가 회의록","작성자 결재가 완료되었습니다. PC에서 확인바랍니다.");
                            }else{
                                vm.sendPushNotification(vm.viewModel.data.mdtr,"소공정위험성평가 회의록","작성자 결재가 완료되었습니다. PC에서 확인바랍니다.");
                            }
                        }
                        if(vm.signPopSort == 'mdtr')vm.sendPushNotification(vm.viewModel.data.dcsnr,"소공정위험성평가 회의록","조정자 결재가 완료되었습니다. PC에서 확인바랍니다.");
                        if(vm.signPopSort == 'dcsnr'){
                            let senduser = "";
                            senduser = vm.viewModel.data.wrtr;
                            if(vm.viewModel.data.mdtr != "" && vm.viewModel.data.mdtr != null) senduser = vm.viewModel.data.mdtr+ "," + vm.viewModel.data.wrtr;
                            vm.sendPushNotification(senduser,"소공정위험성평가 회의록","회의록 결재가 종결되었습니다. PC에서 확인바랍니다.");
                        }
                        vm.fnDetail(vm.viewModel.data.spcm_risk_evl_sn);
                }).catch(function(ex) {
                    alert(Message.ERROR);
                });
            },
            fnAtdrn: function(){
                let vm = this;
                let send = {
                    spcm_risk_evl_sn: vm.viewModel.data.spcm_risk_evl_sn,
                    user_id: vm.viewModel.userInfo.user_id,
                }

                if(confirm("서명하시겠습니까?")){
                    Axios.post("/updateSmPrcsRskEvltAtdrn.do", send)
                        .then(function(response) {
                        alert("서명이 완료되었습니다.");
                        vm.fnDetail(vm.viewModel.data.spcm_risk_evl_sn);
                    });    
                }
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