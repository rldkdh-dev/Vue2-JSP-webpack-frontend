<template>
    <div>
        <div class="contents">
            <div class="divide">
                <div>
                    <div>
                        <h3>기본정보</h3>
                        <table class="table horizontal write">
                            <caption>기본정보 등록</caption>
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
                                <!-- <tr>
                                    <th scope="row"><label for="bplc_team">팀명</label></th>
                                    <td colspan="3">
                                        <select title="팀명 선택" v-model="viewModel.data.bplc_team_sn" id="bplc_team" @change="fnGetCnt();">
                                            <option value=''>선택</option>
                                            <option v-for="item in viewModel.bplcTeamList" :value="item.BPLC_TEAM_SN">{{ item.BPLC_TEAM_NM }}</option>
                                        </select>
                                    </td>
                                </tr> -->
                                <tr>
                                    <th scope="row" class="essential"><label for="wrt_dt">일시</label></th>
                                    <td>
                                        <div class="input_group">
                                            <div class="datepicker_box w120">
                                                <input type="text" class="datepicker" id="wrt_dt" title="회의일시" readonly>
                                            </div>
                                            <select id="wrt_hour" v-model="viewModel.data.wrt_hour" class="w80">
                                                <option value="">선택</option>
                                                <option :value="i-1 < 10 ? 0+''+(i-1) : i-1" v-for="i in 24">
                                                    {{ i-1 < 10 ? 0+''+(i-1) : i-1}}시
                                                </option>
                                            </select>
                                            <span>:</span>
                                            <select id="wrt_min" v-model="viewModel.data.wrt_min" class="w80">
                                                <option value="">선택</option>
                                                <option :value="i-1 == 0 ? 0+''+(i-1) * 30 : (i-1) * 30" v-for="i in 2">
                                                    {{ i-1 == 0 ? 0+''+(i-1) * 30 : (i-1) * 30 }}분
                                                </option>
                                            </select>
                                        </div>
                                    </td>
                                    <th scope="row" class="w180"><label for="prgrs_rt">공정률(%)</label></th>
                                    <td>
                                        <input type="number" id="prgrs_rt" v-model="viewModel.data.prgrs_rt">    
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
                                <td><input type="text" name="yeday" id="emp_yeday_acmtl" v-model="viewModel.data.emp_yeday_acmtl" @input="viewModel.data.emp_yeday_acmtl = $event.target.value.replace(/[^0-9]/g, '');" @change="fnChangeVal($event); fnSumVal($event, 'yeday');"/></td>
                                <td><input type="text" name="today" id="emp_today" v-model="viewModel.data.emp_today" @input="viewModel.data.emp_today = $event.target.value.replace(/[^0-9]/g, '');" @change="fnChangeVal($event); fnSumVal($event, 'today');"/></td>
                                <td>
                                    <span name="tot" id="emp_tot_acmtl">0</span>
                                </td>
                                <td><input type="text" name="dth" id="emp_dth" v-model="viewModel.data.emp_dth" @input="viewModel.data.emp_dth = $event.target.value.replace(/[^0-9]/g, '');" @change="fnSumVal($event, 'dth');"/></td>
                                <td><input type="text" name="inj" id="emp_inj" v-model="viewModel.data.emp_inj" @input="viewModel.data.emp_inj = $event.target.value.replace(/[^0-9]/g, '');" @change="fnSumVal($event, 'inj');"/></td>
                            </tr>
                            <tr>
                                <th scope="row">작업자</th>
                                <td><input type="text" name='yeday' id="oprtr_yeday_acmtl" v-model="viewModel.data.oprtr_yeday_acmtl" @input="viewModel.data.oprtr_yeday_acmtl = $event.target.value.replace(/[^0-9]/g, '');" @change="fnChangeVal($event); fnSumVal($event, 'yeday');"/></td>
                                <td><input type="text" name='today' id="oprtr_today" v-model="viewModel.data.oprtr_today" @input="viewModel.data.oprtr_today = $event.target.value.replace(/[^0-9]/g, '');" @change="fnChangeVal($event); fnSumVal($event, 'today');"/></td>
                                <td>
                                    <span name="tot" id="oprtr_tot_acmtl">0</span>
                                </td>
                                <td><input type="text" name="dth" id="oprtr_dth" v-model="viewModel.data.oprtr_dth" @input="viewModel.data.oprtr_dth = $event.target.value.replace(/[^0-9]/g, '');" @change="fnSumVal($event, 'dth');"/></td>
                                <td><input type="text" name="inj" id="oprtr_inj" v-model="viewModel.data.oprtr_inj" @input="viewModel.data.oprtr_inj = $event.target.value.replace(/[^0-9]/g, '');" @change="fnSumVal($event, 'inj');"/></td>
                            </tr>
                            <tr>
                                <th scope="row">장비기사</th>
                                <td><input type="text" name='yeday' id="driver_yeday_acmtl" v-model="viewModel.data.driver_yeday_acmtl" @input="viewModel.data.driver_yeday_acmtl = $event.target.value.replace(/[^0-9]/g, '');" @change="fnChangeVal($event); fnSumVal($event, 'yeday');"/></td>
                                <td><input type="text" name='today' id="driver_today" v-model="viewModel.data.driver_today" @input="viewModel.data.driver_today = $event.target.value.replace(/[^0-9]/g, '');" @change="fnChangeVal($event); fnSumVal($event, 'today');"/></td>
                                <td>
                                    <span name="tot" id="driver_tot_acmtl">0</span>
                                </td>
                                <td><input type="text" name="dth" id="driver_dth" v-model="viewModel.data.driver_dth" @input="viewModel.data.driver_dth = $event.target.value.replace(/[^0-9]/g, '');" @change="fnSumVal($event, 'dth');"/></td>
                                <td><input type="text" name="inj" id="driver_inj" v-model="viewModel.data.driver_inj" @input="viewModel.data.driver_inj = $event.target.value.replace(/[^0-9]/g, '');" @change="fnSumVal($event, 'inj');"/></td>
                            </tr>
                            <tr>
                                <th scope="row">합계</th>
                                <td><span id="sum_yeday">0</span></td>
                                <td><span id="sum_today">0</span></td>
                                <td>
                                    <span id="sum_tot_acmtl">0</span>
                                </td>
                                <td><span id="sum_dth">0</span></td>
                                <td><span id="sum_inj">0</span></td>
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
                                <tr>
                                    <td>
                                        <textarea :id="'safe_mngr_today_main_task'" v-model="viewModel.data.safe_mngr_today_main_task" rows="4"></textarea>
                                    </td>
                                    <td>
                                        <textarea :id="'safe_mngr_tomo_main_task'" v-model="viewModel.data.safe_mngr_tomo_main_task" rows="4"></textarea>
                                    </td>
                                </tr>
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
                                                <label :for="'passway_Y'"><input type="radio" :id="'passway_Y'" :name="'passway'" v-model="viewModel.data.mvmn_passway_rslt" value="Y">양호 /</label>
                                                <label :for="'passway_N'"><input type="radio" :id="'passway_N'" :name="'passway'" v-model="viewModel.data.mvmn_passway_rslt" value="N">미흡 /</label>
                                                <label :for="'passway_C'"><input type="radio" :id="'passway_C'" :name="'passway'" v-model="viewModel.data.mvmn_passway_rslt" value="C" @change="fnNull('passway')">해당없음</label>
                                            </div>
                                        </div>
                                        <ul class="bl_dot">
                                            <li class="input_group">
                                                <label for="">가설 이동통로 설치 개소<input type="text" class="text-right" :disabled="viewModel.data.mvmn_passway_rslt == 'C' ? true : false" v-model="viewModel.data.mvmn_passway_cnt" :id="'passway_cnt'" title="설치개소" @input="viewModel.data.mvmn_passway_cnt = $event.target.value.replace(/[^0-9]/g, '');"> 개</label>
                                            </li>
                                            <li>설치상태 : 틈새(3cm이내), 추락방지 조치 등</li>
                                            <li>관리상태 : 미끄럼 방지 조치, 통로내 장애물 여부 등</li>
                                        </ul>
                                    </li>
                                    <li>
                                        <div class="title">
                                            안전난간/생명줄
                                            <div class="input_group">
                                                <label :for="'safe_railng_Y'"><input type="radio" :id="'safe_railng_Y'" :name="'safe_railng'" v-model="viewModel.data.safe_railing_rslt" value="Y">양호 /</label>
                                                <label :for="'safe_railng_N'"><input type="radio" :id="'safe_railng_N'" :name="'safe_railng'" v-model="viewModel.data.safe_railing_rslt" value="N">미흡 /</label>
                                                <label :for="'safe_railng_C'"><input type="radio" :id="'safe_railng_C'" :name="'safe_railng'" v-model="viewModel.data.safe_railing_rslt" value="C">해당없음</label>
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
                                                <label :for="'lddr_Y'"><input type="radio" :id="'lddr_Y'" :name="'lddr'" v-model="viewModel.data.lddr_rslt" value="Y">양호 /</label>
                                                <label :for="'lddr_N'"><input type="radio" :id="'lddr_N'" :name="'lddr'" v-model="viewModel.data.lddr_rslt" value="N">미흡 /</label>
                                                <label :for="'lddr_C'"><input type="radio" :id="'lddr_C'" :name="'lddr'" v-model="viewModel.data.lddr_rslt" value="C" @change="fnNull('lddr')">해당없음</label>
                                            </div>
                                        </div>
                                        <ul class="bl_dot">
                                            <li class="input_group">
                                                <label for="">사용허가 사다리<input type="text" class="text-right" :disabled="viewModel.data.lddr_rslt == 'C' ? true : false" v-model="viewModel.data.lddr_cnt" :id="'lddr_cnt'" title="사용허가 사다리" @input="viewModel.data.lddr_cnt = $event.target.value.replace(/[^0-9]/g, '');"> 개 / 허가 적정여부</label>
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
                                                <label :for="'job_foothold_Y'"><input type="radio" :id="'job_foothold_Y'" :name="'job_foothold'" v-model="viewModel.data.job_foothold_rslt" value="Y">양호 /</label>
                                                <label :for="'job_foothold_N'"><input type="radio" :id="'job_foothold_N'" :name="'job_foothold'" v-model="viewModel.data.job_foothold_rslt" value="N">미흡 /</label>
                                                <label :for="'job_foothold_C'"><input type="radio" :id="'job_foothold_C'" :name="'job_foothold'" v-model="viewModel.data.job_foothold_rslt" value="C" @change="fnNull('foothold')">해당없음</label>
                                            </div>
                                        </div>
                                        <ul class="bl_dot">
                                            <li class="input_group">
                                                <label for="">사용 허가(말비계, 이동식 틀비계 등):<input type="text" class="text-right" :disabled="viewModel.data.job_foothold_rslt == 'C' ? true : false" v-model="viewModel.data.job_foothold_cnt" :id="'job_foothold_cnt'" title="사용 허가(말비계, 이동식 틀비계 등)" @input="viewModel.data.job_foothold_cnt = $event.target.value.replace(/[^0-9]/g, '');"> 개</label>
                                                
                                            </li>
                                            <li>고정 상태 확인</li>
                                        </ul>
                                    </li>
                                    <li>
                                        <div class="title">
                                            인양도구
                                            <div class="input_group">
                                                <label :for="'salvage_Y'"><input type="radio" :id="'salvage_Y'" :name="'salvage'" v-model="viewModel.data.salvage_rslt" value="Y">양호 /</label>
                                                <label :for="'salvage_N'"><input type="radio" :id="'salvage_N'" :name="'salvage'" v-model="viewModel.data.salvage_rslt" value="N">미흡 /</label>
                                                <label :for="'salvage_C'"><input type="radio" :id="'salvage_C'" :name="'salvage'" v-model="viewModel.data.salvage_rslt" value="C">해당없음</label>
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
                                                <label :for="'risk_mchn_Y'"><input type="radio" :id="'risk_mchn_Y'" :name="'risk_mchn'" v-model="viewModel.data.risk_mchn_rslt" value="Y">양호 /</label>
                                                <label :for="'risk_mchn_N'"><input type="radio" :id="'risk_mchn_N'" :name="'risk_mchn'" v-model="viewModel.data.risk_mchn_rslt" value="N">미흡 /</label>
                                                <label :for="'risk_mchn_C'"><input type="radio" :id="'risk_mchn_C'" :name="'risk_mchn'" v-model="viewModel.data.risk_mchn_rslt" value="C">해당없음</label>
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
                                                <label :for="'indvdl_prtc_Y'"><input type="radio" :id="'indvdl_prtc_Y'" :name="'indvdl_prtc'" v-model="viewModel.data.indvdl_prtc_rslt" value="Y">양호 /</label>
                                                <label :for="'indvdl_prtc_N'"><input type="radio" :id="'indvdl_prtc_N'" :name="'indvdl_prtc'" v-model="viewModel.data.indvdl_prtc_rslt" value="N">미흡 /</label>
                                                <label :for="'indvdl_prtc_C'"><input type="radio" :id="'indvdl_prtc_C'" :name="'indvdl_prtc'" v-model="viewModel.data.indvdl_prtc_rslt" value="C">해당없음</label>
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
                                    <li :class="viewModel.data.rlway == 'Y' ? 'on' : ''"><label for="rlway"><input type="checkbox" id="rlway" true-value="Y" false-value="N" v-model="viewModel.data.rlway" >선로 주변 작업</label></li>
                                    <li :class="viewModel.data.scaffhold == 'Y' ? 'on' : ''"><label for="scaffhold"><input type="checkbox" id="scaffhold" true-value="Y" false-value="N" v-model="viewModel.data.scaffhold" >비계 작업(높이 10m이상)</label></li>
                                    <li :class="viewModel.data.retaining == 'Y' ? 'on' : ''"><label for="retaining"><input type="checkbox" id="retaining" true-value="Y" false-value="N" v-model="viewModel.data.retaining" >흙막이 시설 설치/해제</label></li>
                                    <li :class="viewModel.data.salvage == 'Y' ? 'on' : ''"><label for="salvage"><input type="checkbox" id="salvage" true-value="Y" false-value="N" v-model="viewModel.data.salvage" >인양 작업 (20톤 이상)</label></li>
                                    <li :class="viewModel.data.tower_crane == 'Y' ? 'on' : ''"><label for="tower_crane"><input type="checkbox" id="tower_crane" true-value="Y" false-value="N" v-model="viewModel.data.tower_crane" >타워크레인 설치/인상/해체</label></li>
                                    <li :class="viewModel.data.high_worktable == 'Y' ? 'on' : ''"><label for="high_worktable"><input type="checkbox" id="high_worktable" true-value="Y" false-value="N" v-model="viewModel.data.high_worktable" >고소작업대 중간발판 사용</label></li>
                                    <li :class="viewModel.data.firearm == 'Y' ? 'on' : ''"><label for="firearm"><input type="checkbox" id="firearm" true-value="Y" false-value="N" v-model="viewModel.data.firearm" >화기작업(대형 화재 위험)</label></li>
                                    <li :class="viewModel.data.road == 'Y' ? 'on' : ''"><label for="road"><input type="checkbox" id="road" true-value="Y" false-value="N" v-model="viewModel.data.road" >도로점용 공사</label></li>
                                    <li :class="viewModel.data.sealed_space == 'Y' ? 'on' : ''"><label for="sealed_space"><input type="checkbox" id="sealed_space" true-value="Y" false-value="N" v-model="viewModel.data.sealed_space" >밀폐공간 작업</label></li>
                                    <li :class="viewModel.data.high_tention == 'Y' ? 'on' : ''"><label for="high_tention"><input type="checkbox" id="high_tention" true-value="Y" false-value="N" v-model="viewModel.data.high_tention" >고압 판넬 작업</label></li>
                                    <li :class="viewModel.data.pipe_connect == 'Y' ? 'on' : ''"><label for="pipe_connect"><input type="checkbox" id="pipe_connect" true-value="Y" false-value="N" v-model="viewModel.data.pipe_connect" >기존 배관 연결(Tie-in)</label></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <!-- <div>
                        <h3>안전관리자</h3>
                        <table class="table write horizontal">
                            <caption>안전관리자 등록</caption>
                            <tbody>
                                <tr>
                                    <th scope="row" class="w180"><label for="">안전점검/지적 요청사항</label></th>
                                    <td>
                                        <textarea :id="'safe_mngr_safechck_lgstr'" v-model="viewModel.data.safe_mngr_safechck_lgstr" title="안전점검/지적 요청사항"></textarea>
                                    </td>
                                </tr>
                                <tr>
                                    <th scope="row"><label for="">대상팀(작업자)</label></th>
                                    <td>
                                        <textarea :id="'safe_mngr_trgt_team'" v-model="viewModel.data.safe_mngr_trgt_team" title="대상팀(작업자)"></textarea>
                                    </td>
                                </tr>
                                <tr>
                                    <th scope="row"><label for="">조치결과</label></th>
                                    <td>
                                        <textarea :id="'safe_mngr_actn_rslt'" v-model="viewModel.data.safe_mngr_actn_rslt" title="안전점검/지적 요청사항"></textarea>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div>
                        <h3>현장소장</h3>
                        <table class="table write horizontal">
                            <caption>현장소장 등록</caption>
                            <tbody>
                                <tr>
                                    <th scope="row" class="w180"><label for="">검토 및 지시사항</label></th>
                                    <td>
                                        <textarea :id="'bplc_mngr_rvw_mttr'" v-model="viewModel.data.bplc_mngr_rvw_mttr" title="검토 및 지시사항"></textarea>
                                    </td>
                                </tr>
                                <tr>
                                    <th scope="row"><label for="">현장안전점검사항</label></th>
                                    <td>
                                        <textarea :id="'bplc_mngr_safe_chck_mttr'" v-model="viewModel.data.bplc_mngr_safe_chck_mttr" title="현장안전점검사항"></textarea>  
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div> -->
                    <div class="btn-group btn-right">
                        <a href="#" class="btn btn-purple" @click.prevent="fnSave()"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-post-add"></use></svg>등록</a>
                        <router-link :to="'/'" class="btn btn-white"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-list-back"></use></svg>목록</router-link>
                    </div>
                </div>
                <div class="approval">
                    <h3>결재 정보</h3>
                    <ul>
                        <li :class="[viewModel.data.safe_mngr != '' && viewModel.data.safe_mngr != null && viewModel.data.safe_mngr_sign_yn != 'Y' ? 'set' : viewModel.data.safe_mngr != '' && viewModel.data.safe_mngr_sign_yn=='Y' ? 'signed' : null]"  @click="fnAprvrpopup('safe_mngr')">
                            <a href="javascript:;">
                                <p class="essential">안전</p>
                                <div class="user_img" id="">
                                    <img :src="viewModel.data.safe_mngr_sign" v-bind:style="viewModel.data.safe_mngr_sign_yn != 'Y' ? 'display: none;' : ''">
                                </div>
                                <span>{{ (viewModel.data.safe_mngr_nm == "" || viewModel.data.safe_mngr_nm == null) ? "안전 등록":viewModel.data.safe_mngr_nm }}</span>
                            </a>
                        </li>
                        <li :class="[viewModel.data.bplc_mngr != '' && viewModel.data.bplc_mngr != null && viewModel.data.bplc_mngr_sign_yn != 'Y' ? 'set' : viewModel.data.bplc_mngr != '' && viewModel.data.bplc_mngr_sign_yn=='Y' ? 'signed' : null]"  @click="fnAprvrpopup('bplc_mngr')">
                            <a href="javascript:;">
                                <p class="essential">현장소장</p>
                                <div class="user_img" id="3">
                                    <img :src="viewModel.data.bplc_mngr_sign" v-bind:style="viewModel.data.bplc_mngr_sign_yn != 'Y' ? 'display: none;' : ''">
                                </div>
                                <span>{{ (viewModel.data.bplc_mngr_nm == "" || viewModel.data.bplc_mngr_nm == null) ? "현장소장 등록":viewModel.data.bplc_mngr_nm }}</span>
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <bplc ref="bplc" v-if="bplcPop==true" :pass="{dept_sn: viewModel.userInfo.dept_sn, team_sn: viewModel.userInfo.team_sn}"></bplc>
        <user ref="aprvr" v-if="aprvrPop==true" :pass="{dept_sn: viewModel.userInfo.dept_sn, team_sn: viewModel.userInfo.team_sn, title:'결재자', bplc_yn:'Y', bplc_sn: viewModel.data.bplc_sn, ocpt_detail_cd:1}"></user>
    </div>
</template>

<script>
    import "es6-promise/auto";
    import Vue from "vue";
    import Axios from "axios";
    import Message, {messageUtil} from "../../../../common/js/message";
    import fromValidation from "../../../../common/js/fromValidation";
    import Common from "../../../../common/js/common.js";
    import user from "../../popup/user_popup.vue";
    import bplc from "../../popup/bplc_popup.vue";
    import { disable } from "ol/rotationconstraint.js";
    
    export default {
        components: {
            'user' : user,
            'bplc' : bplc,
		},
        data: function() {
            return {
                bplcPop:false,
                aprvrPop:false,
                AprvrGbn:'',
                viewModel:{
                    chkRsltList:[],
                    data:{
                        safe_mngr:'',
                        safe_mngr_nm:'',
                        bplc_mngr:'',
                        bplc_mngr_nm:'',
                        wrt_hour: '',
                        wrt_min: '',
                        mvmn_passway_rslt: 'C',
                        mvmn_passway_cnt: '',
                        safe_railing_rslt: 'C',
                        lddr_rslt: 'C',
                        lddr_cnt: '',
                        job_foothold_rslt: 'C',
                        job_foothold_cnt: '',
                        salvage_rslt: 'C',
                        risk_mchn_rslt: 'C',
                        indvdl_prtc_rslt: 'C',
                        bplc_team_sn:'',
                        emp_yeday_acmtl:0,
                        emp_today:0,
                        emp_dth:0,
                        emp_inj:0,
                        oprtr_yeday_acmtl:0,
                        oprtr_today:0,
                        oprtr_dth:0,
                        oprtr_inj:0,
                        driver_yeday_acmtl:0,
                        driver_today:0,
                        driver_dth:0,
                        driver_inj:0,
                    },
                    userInfo:{},
                    bplcTeamList:[],
                },
                isSaved:false,
            };
        },
        computed: {
        }, 
        activated:function(){
            this.fnInit();
            calendarInput();
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
            vm.fnInit();
            calendarInput();
        },
        methods: {
            //기본세팅
            fnInit:function(){
                let vm = this;
                vm.viewModel.userInfo = vm.$store.state.global.userInfo;
                
                let sn = vm.$route.params.sn;

                if(sn != undefined){
                    vm.fnDetail(sn);
                }else{
                    //현장코드 있을 경우 그 값으로 세팅
                    vm.viewModel.data.bplc_sn = vm.viewModel.userInfo.bplc_sn == 0 ? '' : vm.viewModel.userInfo.bplc_sn;
                    vm.viewModel.data.bplc_nm = vm.viewModel.userInfo.bplc_sn == 0 ? '' : vm.viewModel.userInfo.bplc_nm;

                    if(vm.$store.state.global.userInfo.mng_user_id != null){
                        vm.viewModel.data.bplc_mngr = vm.$store.state.global.userInfo.mng_user_id;
                        vm.viewModel.data.bplc_mngr_nm = vm.$store.state.global.userInfo.mng_user_nm;
                    }

                    vm.fnGetCnt();

                    // if(vm.viewModel.data.bplc_sn != ""){
                    //     vm.fnBplcTeamList();
                    // }
                }
            },
            // fnBplcTeamList: function(){
            //     let vm = this;

            //     let send = {
            //         bplc_sn: vm.viewModel.data.bplc_sn,
            //     }

            //     Axios.post("/selectBplcTeamList.do", send)
            //     .then(function(response) {
            //         vm.viewModel.bplcTeamList = response.data.bplcTeamList;
            //         vm.viewModel.data.bplc_team_sn = "";

            //         if(vm.viewModel.bplcTeamList.length == 0){
            //             alert("등록된 팀이 없습니다. 팀 등록후 등록 가능합니다.");
            //             return false;
            //         }
            //     })
            // },
            fnDetail: function(sn){
                let vm = this;

                let data = {
                    diary_sn: sn,
                }
                Axios.post("/selectDiyChkDetail.do", data)
                .then(function(response) {
                    vm.viewModel.data = response.data.detail;
                    vm.viewModel.bplcTeamList = response.data.bplcTeamList;

                    $("#wrt_dt").val(Common.fnConvertDateStr(vm.viewModel.data.wrt_dt, '-'));

                    $("span#emp_tot_acmtl").text(vm.viewModel.data.emp_tot_acmtl);
                    $("span#oprtr_tot_acmtl").text(vm.viewModel.data.oprtr_tot_acmtl);
                    $("span#driver_tot_acmtl").text(vm.viewModel.data.driver_tot_acmtl);
                    $("span#sum_tot_acmtl").text(vm.viewModel.data.sum_tot_acmtl);

                    $("span#sum_yeday").text(vm.viewModel.data.sum_yeday_acmtl);
                    $("span#sum_today").text(vm.viewModel.data.sum_today);
                    $("span#sum_dth").text(vm.viewModel.data.sum_dth);
                    $("span#sum_inj").text(vm.viewModel.data.sum_inj);

                    //서명 이미지
                    vm.viewModel.data.safe_mngr_sign = vm.viewModel.data.safe_mngr_sign.charAt() == '/' ? vm.viewModel.data.safe_mngr_sign : vm.viewModel.data.safe_mngr_sign.substr(2);
                    vm.viewModel.data.bplc_mngr_sign = vm.viewModel.data.bplc_mngr_sign.charAt() == '/' ? vm.viewModel.data.bplc_mngr_sign : vm.viewModel.data.bplc_mngr_sign.substr(2);

                    //해당없음일 경우 빈값으로 보여지기 위해서
                    vm.viewModel.data.mvmn_passway_cnt = (vm.viewModel.data.mvmn_passway_rslt == 'C' ? "" : vm.viewModel.data.mvmn_passway_cnt);
                    vm.viewModel.data.lddr_cnt = (vm.viewModel.data.lddr_rslt == 'C' ? "" : vm.viewModel.data.lddr_cnt);
                    vm.viewModel.data.job_foothold_cnt = (vm.viewModel.data.job_foothold_rslt == 'C' ? "" : vm.viewModel.data.job_foothold_cnt);
                });
            },
            fnBplcPopup: function() {
				let vm = this;
				vm.bplcPop=true;
				vm.aprvrPop=false;
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

                vm.viewModel.data.bplc_mngr = item.mng_user_id == undefined ? null : item.mng_user_id;
                vm.viewModel.data.bplc_mngr_nm = item.mng_user_nm == undefined ? null : item.mng_user_nm;

                // vm.fnBplcTeamList();
                vm.fnGetCnt();
            },
            fnGetCnt: function(){
                let vm = this;

                if(vm.viewModel.data.bplc_sn != '' && vm.viewModel.data.bplc_sn != undefined && vm.viewModel.data.bplc_sn != null){  
                    
                    let data = {
                        bplc_sn: vm.viewModel.data.bplc_sn,
                        bplc_team: vm.viewModel.data.bplc_team_sn,
                    }
                    Axios.post("/selectGetCntDetail.do", data)
                        .then(function(response) {
                            if(response.data.cntDetail != null){
                                vm.viewModel.data.emp_yeday_acmtl = response.data.cntDetail.emp_yeday_acmtl;
                                vm.viewModel.data.emp_today = response.data.cntDetail.emp_today;
                                vm.viewModel.data.emp_dth = response.data.cntDetail.emp_dth;
                                vm.viewModel.data.emp_inj = response.data.cntDetail.emp_inj;
                                vm.viewModel.data.oprtr_yeday_acmtl = response.data.cntDetail.oprtr_yeday_acmtl;
                                vm.viewModel.data.oprtr_today = response.data.cntDetail.oprtr_today;
                                vm.viewModel.data.oprtr_dth = response.data.cntDetail.oprtr_dth;
                                vm.viewModel.data.oprtr_inj = response.data.cntDetail.oprtr_inj;
                                vm.viewModel.data.driver_yeday_acmtl = response.data.cntDetail.driver_yeday_acmtl;
                                vm.viewModel.data.driver_today = response.data.cntDetail.driver_today;
                                vm.viewModel.data.driver_dth = response.data.cntDetail.driver_dth;
                                vm.viewModel.data.driver_inj = response.data.cntDetail.driver_inj;
                                $("span#emp_tot_acmtl").text(response.data.cntDetail.emp_tot_acmtl);
                                $("span#oprtr_tot_acmtl").text(response.data.cntDetail.oprtr_tot_acmtl);
                                $("span#driver_tot_acmtl").text(response.data.cntDetail.driver_tot_acmtl);
                                $("span#sum_yeday").text(response.data.cntDetail.sum_yeday_acmtl);
                                $("span#sum_today").text(response.data.cntDetail.sum_today);
                                $("span#sum_tot_acmtl").text(response.data.cntDetail.sum_tot_acmtl);
                                $("span#sum_dth").text(response.data.cntDetail.sum_dth);
                                $("span#sum_inj").text(response.data.cntDetail.sum_inj);
                            }else{
                                vm.viewModel.data.emp_yeday_acmtl = '';
                                vm.viewModel.data.emp_today = '';
                                vm.viewModel.data.emp_dth = '';
                                vm.viewModel.data.emp_inj = '';
                                vm.viewModel.data.oprtr_yeday_acmtl = '';
                                vm.viewModel.data.oprtr_today = '';
                                vm.viewModel.data.oprtr_dth = '';
                                vm.viewModel.data.oprtr_inj = '';
                                vm.viewModel.data.driver_yeday_acmtl = '';
                                vm.viewModel.data.driver_today = '';
                                vm.viewModel.data.driver_dth = '';
                                vm.viewModel.data.driver_inj = '';
                                $("span#emp_tot_acmtl").text(0);
                                $("span#oprtr_tot_acmtl").text(0);
                                $("span#driver_tot_acmtl").text(0);
                                $("span#sum_yeday").text(0);
                                $("span#sum_today").text(0);
                                $("span#sum_tot_acmtl").text(0);
                                $("span#sum_dth").text(0);
                                $("span#sum_inj").text(0);
                            }
                    });
                }
            },
            fnAprvrpopup: function(gbn){
                let vm = this;

                vm.AprvrGbn = gbn;      //어느 결재자 정보인지 담아두기.

                vm.bplcPop=false;
                vm.userPop=false;

                if(vm.viewModel.data.bplc_sn == '' || vm.viewModel.data.bplc_sn == undefined){
                    alert("현장명을 선택해주세요.");
                    return false;
                }else if(gbn == 'safe_mngr' && vm.viewModel.data.safe_mngr_sign_yn == 'Y'){
                    alert("안전관리자는 이미 결재를 진행하여 변경할 수 없습니다.");
                }else if(gbn == 'bplc_mngr' && vm.viewModel.data.bplc_mngr_sign_yn == 'Y'){
                    alert("현장소장은 이미 결재를 진행하여 변경할 수 없습니다.");
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

                if(vm.AprvrGbn == 'safe_mngr'){
                    vm.viewModel.data.safe_mngr = item.user_id;
                    vm.viewModel.data.safe_mngr_nm = item.user_nm;
                }else{
                    vm.viewModel.data.bplc_mngr = item.user_id;
                    vm.viewModel.data.bplc_mngr_nm = item.user_nm;
                }

                //결재담당자 팝업 초기화
                vm.aprvrPop = false;
                vm.mesuPop = false;
            },
            fnChangeVal: function(event){
                let yeday = ($(event.target).closest("tr").find("input[name='yeday']").val());
                let today = ($(event.target).closest("tr").find("input[name='today']").val());
                let sum = 0;
                yeday = (yeday == undefined ? 0 : yeday);
                today = (today == undefined ? 0 : today);

                $(event.target).closest("tr").find("span[name ='tot']").text(Number(yeday) + Number(today));

                $("span[name='tot']").each(function (index, item) {
                    sum = sum +Number($(item).text());
                });

                $("#sum_tot_acmtl").text(sum);
            },
            fnSumVal: function(event, gbn){
                let sum = 0;
                
                if(gbn == 'yeday'){
                    $("input[name='yeday']").each(function (index, item) {
                        sum = sum +Number($(item).val());
                    }); 

                    $("#sum_yeday").text(sum);
                }else if(gbn == 'today'){
                    $("input[name='today']").each(function (index, item) {
                        sum = sum +Number($(item).val());
                    }); 

                    $("#sum_today").text(sum);
                }else if(gbn == 'dth'){
                    $("input[name='dth']").each(function (index, item) {
                        sum = sum +Number($(item).val());
                    }); 

                    $("#sum_dth").text(sum);
                }else if(gbn == 'inj'){
                    $("input[name='inj']").each(function (index, item) {
                        sum = sum +Number($(item).val());
                    }); 

                    $("#sum_inj").text(sum);
                }
            },
            fnSave:function(){
                let vm = this;

                const valiData = [
                    {id: 'bplc_nm', type: 'select', title: '현장명'},
                    {id: 'wrt_dt', type: 'select', title: '일시'},
                    {id: 'wrt_hour', type: 'select', title: '일시'},
                    {id: 'wrt_min', type: 'select', title: '일시'},
                ];

                if(vm.viewModel.data.mvmn_passway_rslt != 'C'){
                    valiData.push({id: 'passway_cnt', type: 'input', title: '가설 이동통로 설치 갯수'},);
                }
                if(vm.viewModel.data.lddr_rslt != 'C'){
                    valiData.push({id: 'lddr_cnt', type: 'input', title: '사용허가 사다리'},);
                }
                if(vm.viewModel.data.job_foothold_rslt != 'C'){
                    valiData.push({id: 'job_foothold_cnt', type: 'input', title: '사용 허가(말비계, 이동식 틀비계 등)'},);
                }

                if(!fromValidation(valiData)){
                    return false;
                }

                if(vm.viewModel.data.safe_mngr_nm == ''){
                    alert(messageUtil(Message.VALIDATION_REQUIRED, ['안전관리자']))
                    return false;
                }

                if(vm.viewModel.data.bplc_mngr_nm == ''){
                    alert(messageUtil(Message.VALIDATION_REQUIRED, ['현장소장']))
                    return false;
                }

                let data = {
                    reg_id: vm.viewModel.userInfo.user_id,
                    diary_sn: vm.viewModel.data.diary_sn,
                    bplc_sn: vm.viewModel.data.bplc_sn,
                    bplc_team: vm.viewModel.data.bplc_team_sn,
                    wrt_dt: $("#wrt_dt").val(),
                    wrt_hour: vm.viewModel.data.wrt_hour,
                    wrt_min: vm.viewModel.data.wrt_min,
                    prgrs_rt: vm.viewModel.data.prgrs_rt,
                    safe_mngr_today_main_task: vm.viewModel.data.safe_mngr_today_main_task,
                    safe_mngr_tomo_main_task: vm.viewModel.data.safe_mngr_tomo_main_task,
                    safe_mngr_safechck_lgstr: vm.viewModel.data.safe_mngr_safechck_lgstr,
                    safe_mngr_trgt_team: vm.viewModel.data.safe_mngr_trgt_team,
                    safe_mngr_actn_rslt: vm.viewModel.data.safe_mngr_actn_rslt,
                    bplc_mngr_rvw_mttr: vm.viewModel.data.bplc_mngr_rvw_mttr,
                    bplc_mngr_safe_chck_mttr: vm.viewModel.data.bplc_mngr_safe_chck_mttr,
                    safe_mngr: vm.viewModel.data.safe_mngr,
                    safe_mngr_sign_yn: vm.viewModel.data.safe_mngr_sign_yn,
                    bplc_mngr: vm.viewModel.data.bplc_mngr,
                    bplc_mngr_sign_yn: vm.viewModel.data.bplc_mngr_sign_yn,

                    emp_yeday_acmtl: vm.viewModel.data.emp_yeday_acmtl,
                    emp_today: vm.viewModel.data.emp_today,
                    emp_tot_acmtl: $("span#emp_tot_acmtl").text(),
                    oprtr_yeday_acmtl: vm.viewModel.data.oprtr_yeday_acmtl,
                    oprtr_today: vm.viewModel.data.oprtr_today,
                    oprtr_tot_acmtl: $("span#oprtr_tot_acmtl").text(),
                    driver_yeday_acmtl: vm.viewModel.data.driver_yeday_acmtl,
                    driver_today: vm.viewModel.data.driver_today,
                    driver_tot_acmtl: $("span#driver_tot_acmtl").text(),
                    sum_yeday_acmtl: $("span#sum_yeday").text(),
                    sum_today: $("span#sum_today").text(),
                    sum_tot_acmtl: $("span#sum_tot_acmtl").text(),

                    emp_dth: vm.viewModel.data.emp_dth,
                    emp_inj: vm.viewModel.data.emp_inj,
                    oprtr_dth: vm.viewModel.data.oprtr_dth,
                    oprtr_inj: vm.viewModel.data.oprtr_inj,
                    driver_dth: vm.viewModel.data.driver_dth,
                    driver_inj: vm.viewModel.data.driver_inj,
                    sum_dth: $("span#sum_dth").text(),
                    sum_inj: $("span#sum_inj").text(),

                    mvmn_passway_rslt: vm.viewModel.data.mvmn_passway_rslt,
                    mvmn_passway_cnt: vm.viewModel.data.mvmn_passway_cnt,
                    safe_railing_rslt: vm.viewModel.data.safe_railing_rslt,
                    lddr_rslt: vm.viewModel.data.lddr_rslt,
                    lddr_cnt: vm.viewModel.data.lddr_cnt,
                    job_foothold_rslt: vm.viewModel.data.job_foothold_rslt,
                    job_foothold_cnt: vm.viewModel.data.job_foothold_cnt,
                    salvage_rslt: vm.viewModel.data.salvage_rslt,
                    risk_mchn_rslt: vm.viewModel.data.risk_mchn_rslt,
                    indvdl_prtc_rslt: vm.viewModel.data.indvdl_prtc_rslt,
                    
                    rlway: vm.viewModel.data.rlway,
                    scaffhold: vm.viewModel.data.scaffhold,
                    retaining: vm.viewModel.data.retaining,
                    salvage: vm.viewModel.data.salvage,
                    tower_crane: vm.viewModel.data.tower_crane,
                    high_worktable: vm.viewModel.data.high_worktable,
                    firearm: vm.viewModel.data.firearm,
                    road: vm.viewModel.data.road,
                    sealed_space: vm.viewModel.data.sealed_space,
                    high_tention: vm.viewModel.data.high_tention,
                    pipe_connect: vm.viewModel.data.pipe_connect,
                }

                if(vm.viewModel.data.diary_sn == undefined){
                    if(confirm(Message.CREATE_CONFIRM)){
                        Axios.post("/insertDiyChk.do", data).then(function(response) {
                            if(response.data == 1){
                                vm.isSaved = true;
                                vm.$router.push('/');
                                alert("저장되었습니다.");
                            }else if(response.data == 888){
                                alert("해당일자에 일치하는 일일안전점검일지가 있습니다.\n일자를 수정 후 등록해주세요.");
                                $("#bplc_team").focus();
                                return false;
                            }else{
                                alert(Message.ERROR);
                            }
                        }).catch(function(ex) {
                            alert(Message.ERROR);
                        });
                    }
                }else{
                    if(confirm(Message.UPDATE_CONFIRM)){
                        Axios.post("/updateDiyChk.do", data).then(function(response) {
                            if(response.data == 1){
                                vm.isSaved = true;
                                vm.$router.push('/');
                                alert("저장되었습니다.");
                            }else if(response.data == 999){
                                alert("현장소장이 결재를 완료하여 수정이 불가합니다.");
                                return false;
                            }else if(response.data == 888){
                                alert("해당일자에 일치하는 일일안전점검일지가 있습니다.\n일자를 수정 후 등록해주세요.");
                                $("#bplc_team").focus();
                                return false;
                            }else{
                                alert(Message.ERROR);    
                            }
                        }).catch(function(ex) {
                            alert(Message.ERROR);
                        });
                    }
                }
            },
            fnNull: function(gbn){
                let vm = this;
                if(gbn == "passway"){
                    if(vm.viewModel.data.mvmn_passway_rslt == "C"){
                        vm.viewModel.data.mvmn_passway_cnt = "";
                    }
                }else if(gbn == "lddr"){
                    if(vm.viewModel.data.lddr_rslt == "C"){
                        vm.viewModel.data.lddr_cnt = "";
                    }
                }else{
                    if(vm.viewModel.data.job_foothold_rslt == "C"){
                        vm.viewModel.data.job_foothold_cnt = "";
                    }
                }
            }
        }
    };
</script>