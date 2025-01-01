<template>
    <div>
        <div class="contents">
            <div class="divide">
                <div>
                    <div>
                        <h3>기본정보</h3>
                        <table class="table horizontal write">
                            <caption>기본정보 상세</caption>
                            <tbody>
                                <tr>
                                    <th scope="row" class="w180"><label for="bplc">현장명</label></th>
                                    <td colspan="3">
                                        {{ viewModel.data.bplc_nm }}
                                    </td>
                                </tr>
                                <!-- <tr>
                                    <th scope="row"><label for="bplc_team">팀명</label></th>
                                    <td colspan="3">
                                        {{ viewModel.data.bplc_team }}
                                    </td>
                                </tr> -->
                                <tr>
                                    <th scope="row"><label for="wrt_dt">일시</label></th>
                                    <td>
                                        <div class="input_group">
                                            {{ viewModel.data.wrt_dt|yyyyMMdd }} 
                                            &nbsp;<span>{{ viewModel.data.wrt_hour }}</span>
                                            <span>:</span>
                                            <span>{{ viewModel.data.wrt_min }}</span>
                                        </div>
                                    </td>
                                    <th scope="row" class="w180"><label for="prgrs_rt">공정률(%)</label></th>
                                    <td>
                                        {{ viewModel.data.prgrs_rt }}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div>
                        <h3>현황점검표</h3>
                        <table class="table write">
                            <caption>현황점검표 등록</caption>
                            <tr>
                                <th colspan="4" scope="colgroup">출력현황</th>
                                <th colspan="2" scope="colgroup">사고현황</th>
                            </tr>
                            <tr>
                                <th scope="col" class="w270">구분</th>
                                <th scope="col" class="w270">전일누계</th>
                                <th scope="col" class="w270">금일</th>
                                <th scope="col" class="w270">총누계</th>
                                <th scope="col" class="w270">사망</th>
                                <th scope="col" class="w270">부상</th>
                            </tr>
                            <tr>
                                <th scope="row">직원</th>
                                <td>
                                    {{ viewModel.data.emp_yeday_acmtl }}
                                </td>
                                <td>
                                    {{ viewModel.data.emp_today }}
                                </td>
                                <td>
                                    {{ viewModel.data.emp_tot_acmtl }}
                                </td>
                                <td>
                                    {{ viewModel.data.emp_dth }}
                                </td>
                                <td>
                                    {{ viewModel.data.emp_inj }}
                                </td>
                            </tr>
                            <tr>
                                <th scope="row">작업자</th>
                                <td>
                                    {{ viewModel.data.oprtr_yeday_acmtl }}
                                </td>
                                <td>
                                    {{ viewModel.data.oprtr_today }}
                                </td>
                                <td>
                                    {{ viewModel.data.oprtr_tot_acmtl }}
                                </td>
                                <td>
                                    {{ viewModel.data.oprtr_dth }}
                                </td>
                                <td>
                                    {{ viewModel.data.oprtr_inj }}
                                </td>
                            </tr>
                            <tr>
                                <th scope="row">장비기사</th>
                                <td>
                                    {{ viewModel.data.driver_yeday_acmtl }}
                                </td>
                                <td>
                                    {{ viewModel.data.driver_today }}
                                </td>
                                <td>
                                    {{ viewModel.data.driver_tot_acmtl }}
                                </td>
                                <td>
                                    {{ viewModel.data.driver_dth }}
                                </td>
                                <td>
                                    {{ viewModel.data.driver_inj }}
                                </td>
                            </tr>
                            <tr>
                                <th scope="row">합계</th>
                                <td>
                                    {{ viewModel.data.sum_yeday_acmtl }}
                                </td>
                                <td>
                                    {{ viewModel.data.sum_today }}
                                </td>
                                <td>
                                    {{ viewModel.data.sum_tot_acmtl }}
                                </td>
                                <td>
                                    {{ viewModel.data.sum_dth }}
                                </td>
                                <td>
                                    {{ viewModel.data.sum_inj }}
                                </td>
                            </tr>
                        </table>
                    </div>
                    <div>
                        <h3>주요업무/확인사항</h3>
                        <table class="table write">
                            <caption>주요업무/확인사항 등록</caption>
                            <thead>
                                <tr>
                                    <th scope="col">안전관리자 금일 주요업무 / 확인사항</th>
                                    <th scope="col">안전관리자 명일 주요업무 / 확인예정사항</th>
                                </tr>
                            </thead>
                            <tbody>
                                <td>
                                    <textarea :id="'safe_mngr_today_main_task'" v-model="viewModel.data.safe_mngr_today_main_task" rows="4" disabled style="border: none; background-color: white;"></textarea>
                                </td>
                                <td>
                                    <textarea :id="'safe_mngr_tomo_main_task'" v-model="viewModel.data.safe_mngr_tomo_main_task" rows="4" disabled style="border: none; background-color: white;"></textarea>
                                </td>
                            </tbody>
                        </table>
                    </div>
                    <div>
                        <h3>점검항목/체크리스트</h3>
                        <div class="inspection_list">
                            <div class="ol_counter">
                                <h4>7대 기본사항</h4>
                                <ol>
                                    <li>
                                        <div class="title">
                                            이동통로
                                            <div class="input_group">
                                                <label :for="'passway_Y'"><input type="radio" :id="'passway_Y'" :name="'passway'" v-model="viewModel.data.mvmn_passway_rslt" value="Y" disabled>양호 /</label>
                                                <label :for="'passway_N'"><input type="radio" :id="'passway_N'" :name="'passway'" v-model="viewModel.data.mvmn_passway_rslt" value="N" disabled>미흡 /</label>
                                                <label :for="'passway_C'"><input type="radio" :id="'passway_C'" :name="'passway'" v-model="viewModel.data.mvmn_passway_rslt" value="C" disabled>해당없음</label>
                                            </div>
                                        </div>
                                        <ul class="bl_dot">
                                            <li class="input_group">
                                                <label for="">가설 이동통로 설치 개소<input type="text" class="text-right" v-model="viewModel.data.mvmn_passway_cnt" :id="'passway_cnt'" title="설치개소" disabled @change="viewModel.data.mvmn_passway_cnt = $event.target.value.replace(/[^0-9]/g, '');"> 개</label>
                                            </li>
                                            <li>설치상태 : 틈새(3cm이내), 추락방지 조치 등</li>
                                            <li>관리상태 : 미끄럼 방지 조치, 통로내 장애물 여부 등</li>
                                        </ul>
                                    </li>
                                    <li>
                                        <div class="title">
                                            안전난간/생명줄
                                            <div class="input_group">
                                                <label :for="'safe_railng_Y'"><input type="radio" :id="'safe_railng_Y'" :name="'safe_railng'" v-model="viewModel.data.safe_railing_rslt" value="Y" disabled>양호 /</label>
                                                <label :for="'safe_railng_N'"><input type="radio" :id="'safe_railng_N'" :name="'safe_railng'" v-model="viewModel.data.safe_railing_rslt" value="N" disabled>미흡 /</label>
                                                <label :for="'safe_railng_C'"><input type="radio" :id="'safe_railng_C'" :name="'safe_railng'" v-model="viewModel.data.safe_railing_rslt" value="C" disabled>해당없음</label>
                                            </div>
                                        </div>
                                        <ul class="bl_dot">
                                            <li class="input_group">
                                                <label for="">2m↑ 안전난간 및 생명줄 설치</label>
                                            </li>
                                            <li>안전난간 설치 기준 준수<br>: 상부난간 90~120cm, 임의하층 100kg이상 등</li>
                                            <li>생명줄 사용 규격: 16mm 이상 등</li>
                                        </ul>
                                    </li>
                                    <li>
                                        <div class="title">
                                            사다리
                                            <div class="input_group">
                                                <label :for="'lddr_Y'"><input type="radio" :id="'lddr_Y'" :name="'lddr'" v-model="viewModel.data.lddr_rslt" value="Y" disabled>양호 /</label>
                                                <label :for="'lddr_N'"><input type="radio" :id="'lddr_N'" :name="'lddr'" v-model="viewModel.data.lddr_rslt" value="N" disabled>미흡 /</label>
                                                <label :for="'lddr_C'"><input type="radio" :id="'lddr_C'" :name="'lddr'" v-model="viewModel.data.lddr_rslt" value="C" disabled>해당없음</label>
                                            </div>
                                        </div>
                                        <ul class="bl_dot">
                                            <li class="input_group">
                                                <label for="">사용허가 사다리<input type="text" class="text-right" v-model="viewModel.data.lddr_cnt" :id="'lddr_cnt'" title="사용허가 사다리" disabled @change="viewModel.data.lddr_cnt = $event.target.value.replace(/[^0-9]/g, '');"> 개 / 허가 적정여부</label>
                                            </li>
                                            <li>
                                                안전수칙 준수 여부<br>
                                                * 최상단 및 바로 밑단 작업 금지<br>
                                                * 승하강 시 3점 지지(손, 발)
                                            </li>
                                        </ul>
                                    </li>
                                    <li>
                                        <div class="title">
                                            작업발판
                                            <div class="input_group">
                                                <label :for="'job_foothold_Y'"><input type="radio" :id="'job_foothold_Y'" :name="'job_foothold'" v-model="viewModel.data.job_foothold_rslt" value="Y" disabled>양호 /</label>
                                                <label :for="'job_foothold_N'"><input type="radio" :id="'job_foothold_N'" :name="'job_foothold'" v-model="viewModel.data.job_foothold_rslt" value="N" disabled>미흡 /</label>
                                                <label :for="'job_foothold_C'"><input type="radio" :id="'job_foothold_C'" :name="'job_foothold'" v-model="viewModel.data.job_foothold_rslt" value="C" disabled>해당없음</label>
                                            </div>
                                        </div>
                                        <ul class="bl_dot">
                                            <li class="input_group">
                                                <label for="">사용 허가(말비계, 이동식 틀비계 등):<input type="text" class="text-right" v-model="viewModel.data.job_foothold_cnt" :id="'job_foothold_cnt'" disabled title="사용 허가(말비계, 이동식 틀비계 등)" @change="viewModel.data.job_foothold_cnt = $event.target.value.replace(/[^0-9]/g, '');"> 개</label>
                                                
                                            </li>
                                            <li>고정 상태 확인</li>
                                        </ul>
                                    </li>
                                    <li>
                                        <div class="title">
                                            인양도구
                                            <div class="input_group">
                                                <label :for="'salvage_Y'"><input type="radio" :id="'salvage_Y'" :name="'salvage'" v-model="viewModel.data.salvage_rslt" value="Y" disabled>양호 /</label>
                                                <label :for="'salvage_N'"><input type="radio" :id="'salvage_N'" :name="'salvage'" v-model="viewModel.data.salvage_rslt" value="N" disabled>미흡 /</label>
                                                <label :for="'salvage_C'"><input type="radio" :id="'salvage_C'" :name="'salvage'" v-model="viewModel.data.salvage_rslt" value="C" disabled>해당없음</label>
                                            </div>
                                        </div>
                                        <ul class="bl_dot">
                                            <li>인양계획 수립 여부</li>
                                            <li>줄걸이 상태 (슬링밸트, 샤클 등)</li>
                                            <li>체인/레버 HooK 해지 장치 설치 상태</li>
                                        </ul>
                                    </li>
                                    <li>
                                        <div class="title">
                                            접지/위험기계기구
                                            <div class="input_group">
                                                <label :for="'risk_mchn_Y'"><input type="radio" :id="'risk_mchn_Y'" :name="'risk_mchn'" v-model="viewModel.data.risk_mchn_rslt" value="Y" disabled>양호 /</label>
                                                <label :for="'risk_mchn_N'"><input type="radio" :id="'risk_mchn_N'" :name="'risk_mchn'" v-model="viewModel.data.risk_mchn_rslt" value="N" disabled>미흡 /</label>
                                                <label :for="'risk_mchn_C'"><input type="radio" :id="'risk_mchn_C'" :name="'risk_mchn'" v-model="viewModel.data.risk_mchn_rslt" value="C" disabled>해당없음</label>
                                            </div>
                                        </div>
                                        <ul class="bl_dot">
                                            <li>기계, 기구 안전조치 상태<br>: 연삭기/컷터기 덮개 등</li>
                                            <li>접지 연결 상태: 전통기계기구, 작업선 등</li>
                                        </ul>
                                    </li>
                                    <li>
                                        <div class="title">
                                            개인보호구
                                            <div class="input_group">
                                                <label :for="'indvdl_prtc_Y'"><input type="radio" :id="'indvdl_prtc_Y'" :name="'indvdl_prtc'" v-model="viewModel.data.indvdl_prtc_rslt" value="Y" disabled>양호 /</label>
                                                <label :for="'indvdl_prtc_N'"><input type="radio" :id="'indvdl_prtc_N'" :name="'indvdl_prtc'" v-model="viewModel.data.indvdl_prtc_rslt" value="N" disabled>미흡 /</label>
                                                <label :for="'indvdl_prtc_C'"><input type="radio" :id="'indvdl_prtc_C'" :name="'indvdl_prtc'" v-model="viewModel.data.indvdl_prtc_rslt" value="C" disabled>해당없음</label>
                                            </div>
                                        </div>
                                        <ul class="bl_dot">
                                            <li>적정 보호구 착용지급 및 착용 여부 <br>고소작업 안전밸트 / 유해가스 작업: 방독마스크 등</li>
                                            <li>개인보호구 상태 확인: 훼손 여부</li>
                                        </ul>
                                    </li>
                                </ol>
                            </div>
                            <div class="check_list">
                                <h4>대형(고)위험</h4>
                                <ul>
                                    <li :class="viewModel.data.rlway == 'Y' ? 'on' : ''"><label for="rlway"><input type="checkbox" id="rlway" true-value="Y" false-value="N" v-model="viewModel.data.rlway" disabled>선로 주변 작업</label></li>
                                    <li :class="viewModel.data.scaffhold == 'Y' ? 'on' : ''"><label for="scaffhold"><input type="checkbox" id="scaffhold" true-value="Y" false-value="N" v-model="viewModel.data.scaffhold" disabled>비계 작업(높이 10m이상)</label></li>
                                    <li :class="viewModel.data.retaining == 'Y' ? 'on' : ''"><label for="retaining"><input type="checkbox" id="retaining" true-value="Y" false-value="N" v-model="viewModel.data.retaining" disabled>흙막이 시설 설치/해제</label></li>
                                    <li :class="viewModel.data.salvage == 'Y' ? 'on' : ''"><label for="salvage"><input type="checkbox" id="salvage" true-value="Y" false-value="N" v-model="viewModel.data.salvage" disabled>인양 작업 (20톤 이상)</label></li>
                                    <li :class="viewModel.data.tower_crane == 'Y' ? 'on' : ''"><label for="tower_crane"><input type="checkbox" id="tower_crane" true-value="Y" false-value="N" v-model="viewModel.data.tower_crane" disabled>타워크레인 설치/인상/해체</label></li>
                                    <li :class="viewModel.data.high_worktable == 'Y' ? 'on' : ''"><label for="high_worktable"><input type="checkbox" id="high_worktable" true-value="Y" false-value="N" v-model="viewModel.data.high_worktable" disabled>고소작업대 중간발판 사용</label></li>
                                    <li :class="viewModel.data.firearm == 'Y' ? 'on' : ''"><label for="firearm"><input type="checkbox" id="firearm" true-value="Y" false-value="N" v-model="viewModel.data.firearm" disabled>화기작업(대형 화재 위험)</label></li>
                                    <li :class="viewModel.data.road == 'Y' ? 'on' : ''"><label for="road"><input type="checkbox" id="road" true-value="Y" false-value="N" v-model="viewModel.data.road" disabled>도로점용 공사</label></li>
                                    <li :class="viewModel.data.sealed_space == 'Y' ? 'on' : ''"><label for="sealed_space"><input type="checkbox" id="sealed_space" true-value="Y" false-value="N" v-model="viewModel.data.sealed_space" disabled>밀폐공간 작업</label></li>
                                    <li :class="viewModel.data.high_tention == 'Y' ? 'on' : ''"><label for="high_tention"><input type="checkbox" id="high_tention" true-value="Y" false-value="N" v-model="viewModel.data.high_tention" disabled>고압 판넬 작업</label></li>
                                    <li :class="viewModel.data.pipe_connect == 'Y' ? 'on' : ''"><label for="pipe_connect"><input type="checkbox" id="pipe_connect" true-value="Y" false-value="N" v-model="viewModel.data.pipe_connect" disabled>기존 배관 연결(Tie-in)</label></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div v-if="viewModel.data.chck_cnt > 0">
                        <rgstChkSubDetail ref="sub" :pass="{mode: 'view', gbn:'diy', bplc_mngr: viewModel.data.bplc_mngr}"></rgstChkSubDetail>
                    </div>
                    <div class="btn-group btn-right">
                        <router-link :to="'/'" class="btn btn-white"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-list-back"></use></svg>목록</router-link>
                    </div>
                </div>
                <div class="approval">
                    <h3>결재 정보</h3>
                    <ul>
                        <li :class="[viewModel.data.safe_mngr && viewModel.data.safe_mngr_sign_yn != 'Y' ? 'set' : viewModel.data.safe_mngr && viewModel.data.safe_mngr_sign_yn=='Y' ? 'signed' : null]" @click="fnSignPop('safe_mngr')">
                            <a href="javascript:;">
                                <p>안전</p>
                                <div class="user_img" id="">
                                    <img :src="viewModel.data.safe_mngr_sign" v-bind:style="viewModel.data.safe_mngr_sign_yn != 'Y' ? 'display: none;' : ''">
                                </div>
                                <span>{{ viewModel.data.safe_mngr_nm == "" ? "안전 등록":viewModel.data.safe_mngr_nm }}</span>
                            </a>
                        </li>
                        <li :class="[viewModel.data.bplc_mngr != '' && viewModel.data.bplc_mngr_sign_yn != 'Y' ? 'set' : viewModel.data.bplc_mngr != '' && viewModel.data.bplc_mngr_sign_yn=='Y' ? 'signed' : null]"  @click="fnSignPop('bplc_mngr')">
                            <a href="javascript:;">
                                <p>현장소장</p>
                                <div class="user_img" id="3">
                                    <img :src="viewModel.data.bplc_mngr_sign" v-bind:style="viewModel.data.bplc_mngr_sign_yn != 'Y' ? 'display: none;' : ''">
                                </div>
                                <span>{{ viewModel.data.bplc_mngr_nm == "" ? "현장소장 등록":viewModel.data.bplc_mngr_nm }}</span>
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
    import sign from "../../popup/diyChk_sign_popup.vue";
    import rgstChkSubDetail from "./rgstChkSubDetail.vue";

    export default {
        components: {
            'sign': sign,
            'rgstChkSubDetail' : rgstChkSubDetail,
		},
        data: function() {
            return {
                signPop:false,
                signPopSort:'',
                AprvrGbn:'',
                viewModel:{
                    chkRsltList:[],
                    rsltList:[],
                    data:{
                        safe_mngr:'',
                        safe_mngr_nm:'',
                        bplc_mngr:'',
                        bplc_mngr_nm:'',
                        wrt_hour: '',
                        wrt_min: '',
                        mvmn_passway_rslt: 'Y',
                        safe_railng_rslt: 'Y',
                        lddr_rslt: 'Y',
                        job_foothold_rslt: 'Y',
                        salvage_rslt: 'Y',
                        risk_mchn_rslt: 'Y',
                        indvdl_prtc_rslt: 'Y',
                    },
                    userInfo:{},
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

                let data = {
                    diary_sn: sn,
                }
                Axios.post("/selectDiyChkDetail.do", data)
                .then(function(response) {
                    vm.viewModel.data = response.data.detail;
                    
                    //점검 항목 + 파일
                    vm.viewModel.rsltList = response.data.rsltList;
                    if(vm.viewModel.rsltList.length != 0){
                        vm.viewModel.data.chck_clsf = vm.viewModel.rsltList[0].chck_clsf
                    }
                    vm.viewModel.filelist = response.data.fileList;
                    vm.viewModel.mttrFileList = response.data.mttrFileList;

                    //서명 이미지
                    vm.viewModel.data.safe_mngr_sign = vm.viewModel.data.safe_mngr_sign.charAt() == '/' ? vm.viewModel.data.safe_mngr_sign : vm.viewModel.data.safe_mngr_sign.substr(2);
                    vm.viewModel.data.bplc_mngr_sign = vm.viewModel.data.bplc_mngr_sign.charAt() == '/' ? vm.viewModel.data.bplc_mngr_sign : vm.viewModel.data.bplc_mngr_sign.substr(2);

                    //해당없음일 경우 빈값으로 보여지기 위해서
                    vm.viewModel.data.mvmn_passway_cnt = (vm.viewModel.data.mvmn_passway_rslt == 'C' ? "" : vm.viewModel.data.mvmn_passway_cnt);
                    vm.viewModel.data.lddr_cnt = (vm.viewModel.data.lddr_rslt == 'C' ? "" : vm.viewModel.data.lddr_cnt);
                    vm.viewModel.data.job_foothold_cnt = (vm.viewModel.data.job_foothold_rslt == 'C' ? "" : vm.viewModel.data.job_foothold_cnt);
                }).then(function(){
                    
                    //점검사항 리스트
                    if(vm.viewModel.data.chck_cnt > 0){
                        //점검결과 코드 리스트 전달
                        vm.$refs.sub.viewModel.chkRsltList = vm.viewModel.chkRsltList;

                        vm.$refs.sub.fnLoadList(vm.viewModel.rsltList, vm.viewModel.filelist, vm.viewModel.mttrFileList);
                    }
                })
            },
            fnSignPop(gbn){
                let vm = this;
                vm.signPopSort = gbn;

                let user_id = vm.viewModel.userInfo.user_id;
                
                if(gbn == 'safe_mngr' && vm.viewModel.data.safe_mngr != user_id){
                    alert("안전관리자만 결재를 진행할 수 있습니다.");
                    return false;
                }else if(gbn == 'safe_mngr' && vm.viewModel.data.safe_mngr_sign_yn == 'Y'){
                    alert("이미 결재 완료하였습니다.");
                    return false;
                }else if(gbn == 'bplc_mngr' && vm.viewModel.data.bplc_mngr != user_id){
                    alert("현장소장만 결재를 진행할 수 있습니다.");
                    return false;
                }else if(gbn == 'bplc_mngr' && vm.viewModel.data.bplc_mngr_sign_yn == 'Y'){
                    alert("이미 결재 완료하였습니다.");
                    return false;
                }else if(gbn == 'bplc_mngr' && vm.viewModel.data.safe_mngr != '' && vm.viewModel.data.safe_mngr_sign_yn != 'Y' && vm.viewModel.data.bplc_mngr == user_id){
                    alert("안전관리자 결재가 완료되지 않았습니다.")
                    return false;
                }else{
                    vm.signPop = true;
                    vm.$nextTick(function() {
                        if(vm.signPop) {
                            vm.$refs.sign.fnInit(gbn, vm.viewModel.data);
                        }
                    })
                }
            },
            fnSign: function(){
                let vm = this;
                let data = {
                    reg_id: vm.viewModel.userInfo.user_id,
                    diary_sn: vm.viewModel.data.diary_sn,
                    gbn: vm.signPopSort,
                    safe_mngr_today_main_task: vm.viewModel.data.safe_mngr_today_main_task,
                    safe_mngr_tomo_main_task: vm.viewModel.data.safe_mngr_tomo_main_task,
                    // safe_mngr_safechck_lgstr: vm.viewModel.data.safe_mngr_safechck_lgstr,
                    // safe_mngr_trgt_team: vm.viewModel.data.safe_mngr_trgt_team,
                    // safe_mngr_actn_rslt: vm.viewModel.data.safe_mngr_actn_rslt,
                    // bplc_mngr_rvw_mttr: vm.viewModel.data.bplc_mngr_rvw_mttr,
                    // bplc_mngr_safe_chck_mttr: vm.viewModel.data.bplc_mngr_safe_chck_mttr,
                    rsltList: vm.viewModel.rsltList,
                }
                
                Axios.post("/updateDiyChkAprvr.do", data)
                    .then(function(response) {
                        alert("결재가 완료되었습니다.")
                        vm.fnDetail(vm.viewModel.data.diary_sn);
                }).catch(function(ex) {
                    alert(Message.ERROR);
                });
            }
        }
    };
</script>