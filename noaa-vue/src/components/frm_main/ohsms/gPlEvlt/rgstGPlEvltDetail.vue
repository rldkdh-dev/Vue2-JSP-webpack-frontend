<template>
    <div>
        <div class="contents">
            <div class="divide">
                <div>
                    <h3>기본정보</h3>
                    <table class="table horizontal write">
                        <caption>목표추진계획, 평가기준 등록</caption>
                        <tbody>
                            <tr>
                                <th scope="row"><label for="bplc">현장명</label></th>
                                <td colspan="3">
                                    {{ viewModel.data.bplc_nm }}
                                </td>
                            </tr>
                            <tr>
                                <!-- <th scope="row"><label>문서번호</label></th>
                                <td>
                                    {{ viewModel.data.doc_no }}
                                </td> -->
                                <th scope="row"><label>제 &middot; 개정일</label></th>
                                <td>
                                    {{ viewModel.data.estbsh_day_rvsn_day }}
                                </td>
                                <th scope="row"><label>개정번호</label></th>
                                <td>
                                    {{ viewModel.data.rvsn_no }}
                                </td>
                            </tr>
                            <tr>
                                <th scope="row"><label>첨부</label></th>
                                <td colspan="3">
                                    <ul>
                                        <li v-for="item in viewModel.filelist">
                                            <a @click="fnFileDown(item, '')" style="cursor: pointer;" class="btn-link">{{ item.orgnl_file_nm }}</a>
                                        </li>
                                    </ul>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="approval">
                    <h3>결재 정보</h3>
                    <ul>
                        <li :class="[viewModel.data.wrtr != '' && viewModel.data.wrtr_sign_yn != 'Y' ? 'set' : viewModel.data.wrtr != '' && viewModel.data.wrtr_sign_yn=='Y' ? 'signed' : null]"  @click="fnSignPop('wrtr')">
                            <a href="javascript:;">
                                <p>작성자</p>
                                <div class="user_img" id="1">
                                    <img :src="viewModel.data.wrtr_sign" v-bind:style="viewModel.data.wrtr_sign_yn != 'Y' ? 'display: none;' : ''">
                                </div>
                                <span>{{ viewModel.data.wrtr_nm == "" ? "작성자 등록":viewModel.data.wrtr_nm }}</span>
                            </a>
                        </li>
                        <li :class="[viewModel.data.mdtr && viewModel.data.mdtr_sign_yn != 'Y' ? 'set' : viewModel.data.mdtr && viewModel.data.mdtr_sign_yn=='Y' ? 'signed' : null]" @click="fnSignPop('mdtr')">
                            <a href="javascript:;">
                                <p>검토자</p>
                                <div class="user_img" id="">
                                    <img :src="viewModel.data.mdtr_sign" v-bind:style="viewModel.data.mdtr_sign_yn != 'Y' ? 'display: none;' : ''">
                                </div>
                                <span>{{ viewModel.data.mdtr_nm == "" ? "검토자 등록":viewModel.data.mdtr_nm }}</span>
                            </a>
                        </li>
                        <li :class="[viewModel.data.dcsnr != '' && viewModel.data.dcsnr_sign_yn != 'Y' ? 'set' : viewModel.data.dcsnr != '' && viewModel.data.dcsnr_sign_yn=='Y' ? 'signed' : null]"  @click="fnSignPop('dcsnr')">
                            <a href="javascript:;">
                                <p>현장소장</p>
                                <div class="user_img" id="3">
                                    <img :src="viewModel.data.dcsnr_sign" v-bind:style="viewModel.data.dcsnr_sign_yn != 'Y' ? 'display: none;' : ''">
                                </div>
                                <span>{{ viewModel.data.dcsnr_nm == "" ? "현장소장 등록":viewModel.data.dcsnr_nm }}</span>
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="write_area">
                <h3>안전보건목표 추진계획서</h3>
                <table class="table write">
                    <caption>안전보건목표 추진계획서 등록</caption>
                    <colgroup>
                        <col width="15%"/>
                        <col width="25%"/>
                        <col width="20%"/>
                        <col width="2.5%"/>
                        <col width="2.5%"/>
                        <col width="2.5%"/>
                        <col width="2.5%"/>
                        <col width="10%"/>
                        <col width="20%"/>
                    </colgroup>
                    <thead>
                        <tr>
                            <th scope="colgroup" rowspan="2">안전보건목표</th>
                            <th scope="col" colspan="2">세부추진계획</th>
                            <th scope="col" colspan="4">추진일정</th>
                            <th scope="col" rowspan="2">실행담당자</th>
                            <th scope="col" rowspan="2">비고</th>
                        </tr>
                        <tr>
                            <th scope="col">활동내용</th>
                            <th scope="col" class="w150">시기/횟수</th>
                            <th scope="col">1/4</th>
                            <th scope="col">2/4</th>
                            <th scope="col">3/4</th>
                            <th scope="col">4/4</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, i) in viewModel.actplnList" :key="i">
                            <template v-if="item.row1 == 'Y'">
                                <td :rowspan="item.row1_cnt" class="align-center">
                                    <textarea title="안전보건목표 입력" v-model="item.safe_helth_goal" disabled rows="4" style="border: none; background-color: white;"></textarea>
                                </td>
                            </template>
                            <td>
                                <textarea title="활동내용 입력" v-model="item.act_cn" style="border: none; background-color: white;" disabled rows="4"></textarea>
                            </td>
                            <td>
                                <textarea title="시기횟수 입력" v-model="item.era_nmtm" style="border: none; background-color: white;" disabled rows="4"></textarea>
                            </td>
                            <td><input type="checkbox" title="선택" v-model="item.prtn_schdl_1_4" disabled></td>
                            <td><input type="checkbox" title="선택" v-model="item.prtn_schdl_2_4" disabled></td>
                            <td><input type="checkbox" title="선택" v-model="item.prtn_schdl_3_4" disabled></td>
                            <td><input type="checkbox" title="선택" v-model="item.prtn_schdl_4_4" disabled></td>
                            <td>
                                {{ item.excn_pic_nm }}
                            </td>
                            <td>
                                <textarea title="비고" v-model="item.actpln_rmrk" style="border: none; background-color: white;" disabled rows="4"></textarea>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="write_area">
                <h3>안전보건목표 평가기준</h3>
                <table class="table write">
                    <caption>안전보건목표 평가기준 등록</caption>
                    <colgroup>
                        <col width="12%"/>
                        <col width="18%"/>
                        <col width="5%"/>
                        <col width="*"/>
                        <col width="*"/>
                        <col width="*"/>
                        <col width="*"/>
                        <col width="*"/>
                        <col width="*"/>
                    </colgroup>
                    <thead>
                        <tr>
                            <th scope="colgroup" rowspan="2">안전보건목표</th>
                            <th scope="col" rowspan="2">세부추진계획</th>
                            <th scope="col" rowspan="2">반기구분</th>
                            <th scope="col" colspan="5">평가기준</th>
                            <th scope="col" rowspan="2">결과 첨부파일</th>
                            <th scope="col" rowspan="2">비고</th>
                        </tr>
                        <tr>
                            <th scope="col">S</th>
                            <th scope="col">A</th>
                            <th scope="col">B</th>
                            <th scope="col">C</th>
                            <th scope="col">D</th>
                        </tr>
                    </thead>
                    <tbody>
                        <template v-for="(item, i) in viewModel.actplnList" :key="i">
                            <tr>
                                <template v-if="item.row1 == 'Y'">
                                    <td :rowspan="item.row1_cnt * 2" class="align-center">
                                        <textarea title="안전보건목표 입력" v-model="item.safe_helth_goal" disabled rows="4" style="border: none; background-color: white;"></textarea>
                                    </td>
                                </template>
                                <td rowspan="2">
                                    <textarea title="세부추진계획 입력" v-model="item.act_cn" style="border: none; background-color: white;" disabled rows="4"></textarea>
                                </td>
                                <td>
                                    상반기
                                </td>
                                <td>
                                    <textarea title="S" v-model="item.frhfyr_evl_crtr_s" style="border: none; background-color: white;" disabled rows="4"></textarea>
                                </td>
                                <td>
                                    <textarea title="A" v-model="item.frhfyr_evl_crtr_a" style="border: none; background-color: white;" disabled rows="4"></textarea>
                                </td>
                                <td>
                                    <textarea title="B" v-model="item.frhfyr_evl_crtr_b" style="border: none; background-color: white;" disabled rows="4"></textarea>
                                </td>
                                <td>
                                    <textarea title="C" v-model="item.frhfyr_evl_crtr_c" style="border: none; background-color: white;" disabled rows="4"></textarea>
                                </td>
                                <td>
                                    <textarea title="D" v-model="item.frhfyr_evl_crtr_d" style="border: none; background-color: white;" disabled rows="4"></textarea>
                                </td>
                                <td class="text-left">
                                    <ul>
                                        <li v-for="data in item.filelist">
                                            <a class="btn-link" @click="fnFileDown(data, 'rslt')">{{ data.orgnl_file_nm }}</a>
                                        </li>
                                    </ul>
                                </td>
                                <td>
                                    <textarea title="비고" v-model="item.frhfyr_evl_crtr_rmrk" style="border: none; background-color: white;" disabled rows="4"></textarea>
                                </td>
                            </tr>
                            <tr>
                                <td>하반기</td>
                                <td>
                                    <textarea title="S" v-model="item.shyy_evl_crtr_s" style="border: none; background-color: white;" disabled rows="4" :id="'shyy_evl_crtr_s_'+i"></textarea>
                                </td>
                                <td>
                                    <textarea title="A" v-model="item.shyy_evl_crtr_a" style="border: none; background-color: white;" disabled rows="4" :id="'shyy_evl_crtr_a_'+i"></textarea>
                                </td>
                                <td>
                                    <textarea title="B" v-model="item.shyy_evl_crtr_b" style="border: none; background-color: white;" disabled rows="4" :id="'shyy_evl_crtr_b_'+i"></textarea>
                                </td>
                                <td>
                                    <textarea title="C" v-model="item.shyy_evl_crtr_c" style="border: none; background-color: white;" disabled rows="4" :id="'shyy_evl_crtr_c_'+i"></textarea>
                                </td>
                                <td>
                                    <textarea title="D" v-model="item.shyy_evl_crtr_d" style="border: none; background-color: white;" disabled rows="4" :id="'shyy_evl_crtr_d_'+i"></textarea>
                                </td>
                                <td class="text-left">
                                    <ul>
                                        <li v-for="data in item.filelist2">
                                            <a class="btn-link" @click="fnFileDown(data, 'rslt')">{{ data.orgnl_file_nm }}</a>
                                        </li>
                                    </ul>
                                </td>
                                <td>
                                    <textarea title="비고" v-model="item.shyy_evl_crtr_rmrk" style="border: none; background-color: white;" disabled rows="4"></textarea>
                                </td>
                            </tr>
                        </template>
                    </tbody>
                </table>
                <div class="table_footer btn-right">
                    <router-link :to="'/'" class="btn btn-white"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-list-back"></use></svg>목록</router-link>
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
    import sign from "../../popup/sign_popup.vue";

    export default {
        components: {
            'sign': sign,
        },
        data: function() {
            return {
                AprvrGbn:'',
                viewModel:{
                    data:{
                        mdtr:'',
                        mdtr_nm:'',
                        dcsnr:'',
                        dcsnr_nm:'',
                    },
                    userInfo:{},
                    filelist:[],
                    //추진계획서 리스트
                    actplnList:[{seq:1}],
                    selActplnList:[],
                    crtrFileList:[],            //결과에서 등록한 첨부파일.
                },
                signPop: false,
                signPopSort: ''
            };
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
        },
        methods: {
            fnInit:function(){
                let vm = this;
                vm.viewModel.userInfo = vm.$store.state.global.userInfo;

                let sn = vm.$route.params.sn;
                
                vm.fnDetail(sn);
            },
            fnDetail: function(sn){
                let vm = this;
                
                let data = {
                    prtn_plan_sn: sn,
                    gbn:'update',
                }
                Axios.post("/selectGPlEvltDetail.do", data)
                .then(function(response) {
                    vm.viewModel.data = response.data.detail;
                    vm.viewModel.actplnList = response.data.list;
                    vm.viewModel.filelist = response.data.fileList;
                    vm.viewModel.crtrFileList = response.data.crtrFileList;

                    //제,개정일 세팅
                    $("#date").val(vm.viewModel.data.estbsh_day_rvsn_day);
                    vm.viewModel.data.wrtr_sign = vm.viewModel.data.wrtr_sign.charAt() == '/' ? vm.viewModel.data.wrtr_sign : vm.viewModel.data.wrtr_sign.substr(2);
                    vm.viewModel.data.mdtr_sign = vm.viewModel.data.mdtr_sign.charAt() == '/' ? vm.viewModel.data.mdtr_sign : vm.viewModel.data.mdtr_sign.substr(2);
                    vm.viewModel.data.dcsnr_sign = vm.viewModel.data.dcsnr_sign.charAt() == '/' ? vm.viewModel.data.dcsnr_sign : vm.viewModel.data.dcsnr_sign.substr(2);

                    for(let i=0; i<vm.viewModel.actplnList.length; i++){
                        let data = vm.viewModel.actplnList[i];

                        data.prtn_schdl_1_4 = data.prtn_schdl_1_4 == 'Y' ? true : false;
                        data.prtn_schdl_2_4 = data.prtn_schdl_2_4 == 'Y' ? true : false;
                        data.prtn_schdl_3_4 = data.prtn_schdl_3_4 == 'Y' ? true : false;
                        data.prtn_schdl_4_4 = data.prtn_schdl_4_4 == 'Y' ? true : false;
                    }
                }).then(function(){
                    for(let i=0; i<vm.viewModel.actplnList.length; i++){
                        let item = vm.viewModel.actplnList[i];

                        vm.viewModel.actplnList[i].filelist = vm.viewModel.crtrFileList.filter(data=>  data.sub_sn == item.prtn_actpln_sn && data.thrd_sn == item.evl_crtr_sn && data.file_se == 1);
                        vm.viewModel.actplnList[i].filelist2 = vm.viewModel.crtrFileList.filter(data=>  data.sub_sn == item.prtn_actpln_sn && data.thrd_sn == item.evl_crtr_sn && data.file_se == 2);
                    }
                });
            },
            fnFileDown:function(item, gbn){
                let vm = this;
                let send = {};
                if(gbn == 'rslt'){
                    send = {
                        sn: item.sn,
                        sub_sn: item.sub_sn,
                        thrd_sn: item.thrd_sn,
                        file_sn: item.file_sn,
                        gbn:'gPlEvlt_rslt'
                    }
                }else{
                    send = {
                        sn: item.sn,
                        file_sn: item.file_sn,
                        gbn:'gPlEvlt'
                    }
                }

                $(".loading").show();
                $("#mask").show();
                Axios.post("/download.do",send,{responseType: "blob",}
                ).then(function(e) {
                    const url = window.URL.createObjectURL(new Blob([e.data], { type: e.headers["content-type"] }))
                    const link = document.createElement("a")
                    link.href = url
                    link.download = item.orgnl_file_nm
                    link.click()
                    window.URL.revokeObjectURL(url)
                }).then(function(){
                    $(".loading").hide();
                    $("#mask").hide();
                });
            },
            fnSignPop(gbn){
                let vm = this;
                vm.signPopSort = gbn;

                let user_id = vm.viewModel.userInfo.user_id;
                
                if(gbn == 'wrtr' && vm.viewModel.data.wrtr != user_id){
                    alert("작성자만 결재를 진행할 수 있습니다.");
                    return false;
                }else if(gbn == 'wrtr' && vm.viewModel.data.wrtr_sign_yn == 'Y'){
                    alert("이미 결재 완료하였습니다.");
                    return false;
                }else if(gbn == 'mdtr' && vm.viewModel.data.mdtr == ''){
                    alert("검토자는 없습니다.");
                    return false;
                }else if(gbn == 'mdtr' && vm.viewModel.data.mdtr != user_id){
                    alert("검토자만 결재를 진행할 수 있습니다.");
                    return false;
                }else if(gbn == 'mdtr' && vm.viewModel.data.mdtr_sign_yn == 'Y'){
                    alert("이미 결재 완료하였습니다.");
                    return false;
                }else if(gbn == 'mdtr' && vm.viewModel.data.wrtr_sign_yn != 'Y' && vm.viewModel.data.mdtr == user_id){
                    alert("작성자 결재가 완료되지 않았습니다.")
                    return false;
                }else if(gbn == 'dcsnr' && vm.viewModel.data.dcsnr != user_id){
                    alert("소장만 결재를 진행할 수 있습니다.");
                    return false;
                }else if(gbn == 'dcsnr' && vm.viewModel.data.dcsnr_sign_yn == 'Y'){
                    alert("이미 결재 완료하였습니다.");
                    return false;
                }else if(gbn == 'dcsnr' && vm.viewModel.data.mdtr != '' && vm.viewModel.data.mdtr_sign_yn != 'Y' && vm.viewModel.data.dcsnr == user_id){
                    alert("검토 결재가 완료되지 않았습니다.")
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
                    prtn_plan_sn: vm.viewModel.data.prtn_plan_sn,
                    gbn: vm.signPopSort,
                    rvsn_no: vm.viewModel.data.rvsn_no
                }

                Axios.post("/updateGPlEvltAprvr.do", data)
                    .then(function(response) {
                        alert("결재가 완료되었습니다.")
                        vm.fnDetail(vm.viewModel.data.prtn_plan_sn);
                        
                            Axios.post("/selectGPlEvltDetail.do", data)
                                .then(function(response) {
                                    if(response.data.detail.mdtr_sign_yn != null && response.data.detail.mdtr_sign_yn != undefined && response.data.detail.mdtr_sign_yn != '') {
                                        if(response.data.detail.wrtr_sign_yn == "Y" && response.data.detail.mdtr_sign_yn == "N" && response.data.detail.dcsnr_sign_yn == "N") {
                                            vm.callPushAlarm(vm.viewModel.data.mdtr, 0);
                                        } else if(response.data.detail.wrtr_sign_yn == "Y" && response.data.detail.mdtr_sign_yn == "Y" && response.data.detail.dcsnr_sign_yn == "N"){
                                            vm.callPushAlarm(vm.viewModel.data.dcsnr, 0);
                                        } else if(response.data.detail.wrtr_sign_yn == "Y" && response.data.detail.mdtr_sign_yn == "Y" && response.data.detail.dcsnr_sign_yn == "Y"){
                                            vm.callPushAlarm(vm.viewModel.data.wrtr + "," + vm.viewModel.data.mdtr + "," + vm.viewModel.data.dcsnr, 1);
                                        }
                                    } else {
                                        if(response.data.detail.wrtr_sign_yn == "Y" && response.data.detail.dcsnr_sign_yn == "N") {
                                            vm.callPushAlarm(vm.viewModel.data.mdtr, 0);
                                        } else if(response.data.detail.wrtr_sign_yn == "Y" && response.data.detail.dcsnr_sign_yn == "Y"){
                                            vm.callPushAlarm(vm.viewModel.data.wrtr + "," + vm.viewModel.data.dcsnr, 1);
                                        }
                                    }
                                })
                }).catch(function(ex) {
                    alert(Message.ERROR);
                });
            },
            callPushAlarm: function(user_id, apprv) {
                let vm = this;
                let send = {
                    bplc_sn : vm.viewModel.data.bplc_sn
                }
                    
                let link = '/m/main/index.do#/';

                //console.log(' link  ::  ' , link);

                $.ajax({
                    type: "post",
                    url:"/api/pushSendPerson.do",
                    data:{
                        // 제목 및 내용
                        title : apprv == 0 ? "새로운 목표 추진 계획, 평가기준이 등록되었습니다." : "목표 추진 계획, 평가기준의 결재가 완료되었습니다.",
                        message : "PC에서 확인해주세요.",
                        user_id : user_id,
                        // 클릭 시 이동 화면주소
                        link : link
                    }
                });
            }
        }
    };
</script>