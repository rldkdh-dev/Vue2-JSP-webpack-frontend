<template>
    <div>
        <div class="contents write">
                <div>
                    <h3>작업허가서 등록</h3>
                    <table class="table horizontal write">
                        <caption>작업허가서 등록</caption>
                        <tbody>
                            <tr>
                                <th scope="row" class="w180"><label for="bplc_nm">현장명</label></th>
                                <td>
                                    <div class="input_btn" v-if="$store.state.global.userInfo.bplc_sn != 0">
                                        <input type="text" id="bplc_nm" title="위치" v-model="bplc_nm" readonly>
                                    </div>
                                    <div class="input_btn" v-else>
                                        <input type="text" id="bplc_nm" v-model="bplc_nm" @click="fnPopup();" readonly>
                                        <input type="hidden" id="bplc" v-model="bplc_sn">
                                        <label for="bplc_nm" v-if="uid === undefined">
                                            <svg class="icon">
                                                <use xlink:href="/img/symbol-defs.svg#icon-search"></use>
                                            </svg>
                                        </label>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <th scope="row"><label>작업허가서 유형</label></th>
                                <td>
                                    <label name="pms">
                                        <input type="radio" v-model="viewModel.job_type" value="1" @click="fnEvt($event.target.value)" name="job_type" id="ladder" :disabled="viewModel.job_rpmsn_sn !== undefined ? true : false"><label for="ladder" style="padding-left:5px">사다리 사용 작업 허가서</label>
                                    </label>
                                    <label name="pms">
                                        <input type="radio" v-model="viewModel.job_type" value="2" @click="fnEvt($event.target.value)" name="job_type" id="fire" :disabled="viewModel.job_rpmsn_sn !== undefined ? true : false"><label for="fire" style="padding-left:5px">화재위험작업 승인 허가서</label>
                                    </label>
                                    <label name="pms">
                                        <input type="radio" v-model="viewModel.job_type" value="3" @click="fnEvt($event.target.value)" name="job_type" id="approve" :disabled="viewModel.job_rpmsn_sn !== undefined ? true : false"><label for="approve" style="padding-left:5px">밀폐공간작업 승인 허가서</label>
                                    </label>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <template v-if="viewModel.job_type == '1'">
                    <div>
                        <h3>사다리 사용 작업 허가서</h3>
                        <table class="table horizontal write">
                            <caption>사다리 사용 작업 허가서 등록</caption>
                            <tbody>
                                <tr>
                                    <th scope="row" class="w180 essential"><label for="job_team">작업조명</label></th>
                                    <td>
                                        <input type="text" id="job_team" v-model="job_team">
                                    </td>
                                </tr>
                                <tr>
                                    <th scope="row" class="essential"><label for="p2">작업일시</label></th>
                                    <td>
                                        <div class="datepicker_box">
                                            <input type="text" class="datepicker" id="p2" title="작업일시" placeholder="작업일시 선택" readonly>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <th scope="row" class="essential"><label for="wrtr">작성자 (작업조장)</label></th>
                                    <td>
                                        <input type="text" id="wrtr" v-model="wrtr_nm" disabled>
                                    </td>
                                </tr>
                                <tr>
                                    <th scope="row" class="essential"><label for="job_place">작업위치</label></th>
                                    <td>
                                        <input type="text" id="job_place" v-model="job_place">
                                    </td>
                                </tr>
                                <tr>
                                    <th scope="row" class="essential"><label for="lddr_use_qy">사용수량</label></th>
                                    <td>
                                        <input type="text" id="lddr_use_qy" v-model="lddr_use_qy">
                                    </td>
                                </tr>
                                <tr>
                                    <th scope="row" class="essential"><label for="lddr_use_rsn">사용사유</label></th>
                                    <td>
                                        <textarea rows="3" id="lddr_use_rsn" v-model="lddr_use_rsn"></textarea>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div>
                        <h3>확인자</h3>
                        <table class="table horizontal write">
                            <caption>확인자 서명</caption>
                            <tbody>
                                <tr>
                                    <th scope="rowgroup" colspan="8" class="text-center">작업장(사진) 검토결과, 사다리 사용이 불가피한 장소임을 확인 합니다.</th>
                                </tr>
                                <tr>
                                    <th scope="row" class="w180 th2 essential"><label for="safe_mngr">안전</label></th>
                                    <td>
                                        <div class="input_btn">
                                            <input type="text" id="safe_mngr" v-model="safe_mngr_nm" @click="fnuserpopup(1)" readonly>
                                            <label for="safe_mngr"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-search"></use></svg></label>
                                        </div>
                                    </td>
                                    <th scope="row" class="w150 th2"><label for="safe_mngr_sign">서명</label></th>
                                    <td>
                                        <template v-if="safe_mngr_sign_yn == 'N'">
                                            <button class="btn btn-small btn-white" id="safe_mngr_sign" @click="fnsafe_mngr_sign()">서명하기</button>
                                        </template>
                                        <template v-else>
                                            <img :src="safe_mngr_sign" class="sign_img">
                                        </template>
                                    </td>
                                    <th scope="row" class="w180 th2 essential"><label for="bplc_mngr">현장소장</label></th>
                                    <td>
                                        <div class="input_btn">
                                            <input type="text" id="bplc_mngr" v-model="bplc_mngr_nm" @click="fnuserpopup(2)" readonly>
                                            <label for="bplc_mngr"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-search"></use></svg></label>
                                        </div>
                                    </td>
                                    <th scope="row" class="w150 th2"><label for="bplc_mngr_sign">서명</label></th>
                                    <td>
                                        <template v-if="bplc_mngr_sign_yn == 'N'">
                                            <button class="btn btn-small btn-white" id="bplc_mngr_sign" @click="fnbplc_mngr_sign()">서명하기</button>
                                        </template>
                                        <template v-else>
                                            <img :src="bplc_mngr_sign" class="sign_img">
                                        </template>
                                    </td>
                                </tr>
                                <!-- <tr>
                                    <th scope="row" class="th2"><label for="timhder">팀장</label></th>
                                    <td>
                                        <div class="input_btn">
                                            <input type="text" id="timhder" v-model="timhder_nm" @click="fnuserpopup(3)" readonly>
                                            <label for="timhder"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-search"></use></svg></label>
                                        </div>
                                    </td>
                                    <th scope="row" class="th2"><label for="timhder_sign">서명</label></th>
                                    <td>
                                        <template v-if="timhder_sign_yn == 'N'">
                                            <button class="btn btn-small btn-white" id="timhder_sign" @click="fntimhder_sign()">서명하기</button>
                                        </template>
                                        <template v-else>
                                            <img :src="timhder_sign" class="sign_img">
                                        </template>
                                    </td>
                                    <th scope="row" class="th2"><label for="biz_depthder">사업부장</label></th>
                                    <td>
                                        <div class="input_btn">
                                            <input type="text" id="biz_depthder" v-model="biz_depthder_nm" @click="fnuserpopup(4)" readonly>
                                            <label for="biz_depthder"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-search"></use></svg></label>
                                        </div>
                                    </td>
                                    <th scope="row" class="th2"><label for="biz_depthder_sign">서명</label></th>
                                    <td>
                                        <template v-if="biz_depthder_sign_yn == 'N'">
                                            <button class="btn btn-small btn-white" id="biz_depthder_sign" @click="fnbiz_depthder_sign()">서명하기</button>
                                        </template>
                                        <template v-else>
                                            <img :src="biz_depthder_sign" class="sign_img">
                                        </template>
                                    </td>
                                </tr> -->
                                <tr>
                                    <th scope="rowgroup" colspan="8" class="text-center">상기 작성자는 아래의 안전기준을 준수함을 확인합니다.</th>
                                </tr>
                                <tr>
                                    <th scope="row" class="th2 essential"><label for="wrtr_name">작성자</label></th>
                                    <td>
                                        <div class="input_btn">
                                            <input type="text" v-model="wrtr_nm" disabled>
                                        </div>
                                    </td>
                                    <th scope="row" class="th2"><label for="rpmsn_sign">서명</label></th>
                                    <td>
                                        <div v-if="viewModel.job_rpmsn_sn !== undefined">
                                            <img :src="wrtr_aprvr_path" class="sign_img"/>
                                        </div>
                                        <div v-else>
                                            <img :src="$store.state.global.userInfo.aprvr_path" class="sign_img"/>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div>
                        <h3>기타사항</h3>
                        <textarea rows="5" v-model="etc_cn"></textarea>
                    </div>
                </template>
                <template v-else-if="viewModel.job_type == '2'">
                    <div>
                        <h3>화재위험작업 승인/허가서</h3>
                        <table class="table horizontal write">
                            <caption>화재위험작업 승인/허가서 등록</caption>
                            <tbody>
                                <tr>
                                    <th scope="row" class="w180 essential"><label for="job_team">작업팀</label></th>
                                    <td colspan="2">
                                        <input type="text" id="job_team" v-model="job_team">
                                    </td>
                                    <th scope="row" class="w180"><label for="bplc_nm">작성자</label></th>
                                    <td colspan="3">
                                        <div class="input_btn">
                                            <input type="text" id="bplc_nm" v-model="wrtr_nm" disabled>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <th scope="row" class="essential"><label for="job_place">작업장소</label></th>
                                    <td colspan="2">
                                        <input type="text" id="job_place" v-model="job_place">
                                    </td>
                                    <th scope="row" class="essential"><label for="job_nmpr">작업인원</label></th>
                                    <td colspan="3">
                                        <div class="unit_box">
                                            <input type="text" class="text-right" id="job_nmpr" v-model="job_nmpr">
                                            <span class="unit">명</span>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <th scope="row" class="essential"><label for="job_cn">작업내용</label></th>
                                    <td colspan="2">
                                        <textarea id="job_cn" v-model="job_cn"></textarea>
                                    </td>
                                    <th scope="row"><label for="equipment">사용장비</label></th>
                                    <td colspan="3">
                                        <div>
                                            <label><input type="checkbox" v-model="welding" @click="equipmentCheck(1,$event.target.checked)" true-value="Y" false-value="N">용접기</label>
                                            <label><input type="checkbox" v-model="oxygencut" @click="equipmentCheck(2,$event.target.checked)" true-value="Y" false-value="N">산소절단기</label>
                                            <label><input type="checkbox" v-model="grindstone" @click="equipmentCheck(3,$event.target.checked)" true-value="Y" false-value="N">그라인더</label>
                                            <label><input type="checkbox" v-model="hscm" @click="equipmentCheck(4,$event.target.checked)" true-value="Y" false-value="N">고속절단기</label>
                                            <div class="input_group">
                                                <label><input type="checkbox" v-model="etc_btn" @click="equipmentCheck(5,$event.target.checked)">기타</label>
                                                <input type="text" class="w200" v-model="f_etc" @input="f_etc = $event.target.value" true-value="Y" false-value="N" :disabled="fireetc">
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <th scope="rowgroup" rowspan="2"><label for="job_asdrtor">작업반장</label></th>
                                    <th scope="row" class="th2 essential"><label for="job_asdrtor">성명</label></th>
                                    <td>
                                        <div class="input_btn">
                                            <input type="text" id="job_asdrtor" v-model="job_asdrtor_nm" @click="fnuserpopup(5)" readonly>
                                            <input type="hidden" v-model="job_asdrtor_id" readonly>
                                            <label for="job_asdrtor"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-search"></use></svg></label>
                                        </div>
                                    </td>
                                    <th scope="rowgroup" rowspan="2" class="essential"><label for="sdt">작업기간<br>(허가 유효기간 최대 7일)</label></th>
                                    <td colspan="3">
                                        <div class="datepicker_box">
                                            <input type="text" class="datepicker" id="sdt" title="시작일" placeholder="시작일 선택" readonly>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <th scope="row" class="th2 essential">연락처</th>
                                    <td>
                                        <input type="text" id="job_asdrtor_phone" v-model="job_asdrtor_phone" disabled>
                                    </td>
                                    <td colspan="3">
                                        <div class="datepicker_box">
                                            <input type="text" class="datepicker" id="edt" title="종료일" placeholder="종료일 선택" readonly>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <th scope="row" colspan="2" class="essential"><label for="fire_watcher_yn">화재감시자 배치 대상 (용접, 용단 작업)</label></th>
                                    <td>
                                        <label><input type="radio" name="yn" id="fire_watcher_yn" v-model="fire_watcher_yn" value="Y">유</label>
                                        <label><input type="radio" name="yn" id="fire_watcher_yn" v-model="fire_watcher_yn" value="N">무</label>
                                    </td>
                                    <th scope="row" rowspan="2" class="essential"><label for="">화재감시자의 업무<br>안전보건교육 이수 여부</label></th>
                                    <th scope="col" class="th2 w150 text-center"><label for="loudspeaker">확성기</label></th>
                                    <th scope="col" class="th2 w150 text-center"><label for="lght">휴대용 조명기구</label></th>
                                    <th scope="col" class="th2 w150 text-center"><label for="smoke">방연마스크</label></th>
                                </tr>
                                <tr>
                                    <th scope="rowgroup" rowspan="2"><label for="fire_watcher">화재 감시자</label></th>
                                    <th scope="row" class="th2 essential"><label for="fire_watcher">성명</label></th>
                                    <td>
                                        <div class="input_btn">
                                            <input type="text" id="fire_watcher" v-model="fire_watcher_nm" @click="fnenepopup(2,'f')" readonly>
                                            <label for="fire_watcher"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-search"></use></svg></label>
                                        </div>
                                    </td>
                                    <td>
                                        <div class="unit_box">
                                            <input type="text" class="text-right" v-model="loudspeaker_qy">
                                            <span class="unit">개</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div class="unit_box">
                                            <input type="text" class="text-right" v-model="lght_fixture_qy">
                                            <span class="unit">개</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div class="unit_box">
                                            <input type="text" class="text-right" v-model="smoke_prev_mask_qy">
                                            <span class="unit">개</span>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <th scope="row" class="th2 essential"><label for="fire_watcher_phone">연락처</label></th>
                                    <td>
                                        <input type="text" v-model="fire_watcher_phone" disabled>
                                    </td>
                                    <td>
                                        <input type="text" v-model="sign_yn" disabled>
                                    </td>
                                    <td>
                                        <template v-if="fire_watcher == viewModel.user.user_id && loudspeaker_sign_yn == 'N'">
                                            <div class="input_btn">
                                                <button class="btn btn-small btn-white" @click="fnfire_watcher_sign('loudspeaker')">서명하기</button>
                                            </div>
                                        </template>
                                        <template v-else-if="fire_watcher == viewModel.user.user_id && loudspeaker_sign_yn == 'Y'">
                                            <img :src="fire_watcher_sign" class="sign_img"/>
                                        </template>
                                    </td>
                                    <td>
                                        <template v-if="fire_watcher == viewModel.user.user_id && lght_fixture_sign_yn == 'N'">
                                            <div class="input_btn">
                                                <button class="btn btn-small btn-white" @click="fnfire_watcher_sign('lght')">서명하기</button>
                                            </div>
                                        </template>
                                        <template v-else-if="fire_watcher == viewModel.user.user_id && lght_fixture_sign_yn == 'Y'">
                                            <img :src="fire_watcher_sign" class="sign_img"/>
                                        </template>
                                    </td>
                                    <td>
                                        <template v-if="fire_watcher == viewModel.user.user_id && smoke_prev_mask_sign_yn == 'N'">
                                            <div class="input_btn">
                                                <button class="btn btn-small btn-white" @click="fnfire_watcher_sign('smoke')">서명하기</button>
                                            </div>
                                        </template>
                                        <template v-else-if="fire_watcher == viewModel.user.user_id && smoke_prev_mask_sign_yn == 'Y'">
                                            <img :src="fire_watcher_sign" class="sign_img"/>
                                        </template>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div>
                        <h3><strong>※ 화재감시자의 업무 : </strong> 화재의 위험을 감시하고 화재 발생 시 사업장 내 근로자의 대피를 유도하는 업무만을 담당</h3>
                        <table class="table write">
                            <caption>화재감시자의 업무</caption>
                            <tbody>
                                <tr>
                                    <th scope="col essential" colspan="3">화재 위험작업 [작업장 주변 여건]</th>
                                    <th scope="col" colspan="3">특이사항 [ 발생시 기입]</th>
                                </tr>
                                <tr>
                                    <td colspan="3">
                                        <ul class="text-left">
                                            <li>
                                                <label>
                                                    <input type="checkbox" v-model="artcl1_chck_yn" true-value="Y" false-value="N">
                                                    작업반경 11m 이내 가연성물질이 있는 장소의 작업
                                                </label>
                                            </li>
                                            <li>
                                                <label>
                                                    <input type="checkbox" v-model="artcl2_chck_yn" true-value="Y" false-value="N">
                                                    불꽃에 의해 쉽게 발화 될 우려가 있는 장소의 작업
                                                </label>
                                            </li>
                                            <li>
                                                <label>
                                                    <input type="checkbox" v-model="artcl3_chck_yn" true-value="Y" false-value="N">
                                                    열전도, 열복사에 의해 발화될 우려가 있는 장소의 작업
                                                </label>
                                            </li>
                                            <li>
                                                <label>
                                                    <input type="checkbox" v-model="artcl4_chck_yn" true-value="Y" false-value="N">
                                                    용접 및 용단 작업
                                                </label>
                                            </li>
                                            <li>
                                                <label>
                                                    <input type="checkbox" v-model="artcl5_chck_yn" true-value="Y" false-value="N">
                                                    금속 절단 및 연마 작업
                                                </label>
                                            </li>
                                            <li>
                                                <label>
                                                    <input type="checkbox" v-model="artcl6_chck_yn" true-value="Y" false-value="N">
                                                    기타 화재 위험이 있는 작업
                                                </label>
                                                <label>
                                                    <input v-if="artcl6_chck_yn == 'Y'" type="text" v-model="artcl6_cn" @input="artcl6_cn = $event.target.value">
                                                </label>
                                            </li>
                                        </ul>
                                    </td>
                                    <td colspan="3">
                                        <textarea id="excptn_mttr" v-model="excptn_mttr" @input="excptn_mttr = $event.target.value"></textarea>
                                    </td>
                                </tr>
                                <tr>
                                    <th scope="row" class="w180 essential"><label for="cnstrct_pic">검토자(시공담당)</label></th>
                                    <td>
                                        <div class="input_btn">
                                            <input type="text" id="cnstrct_pic" v-model="cnstrct_pic_nm" @click="fnuserpopup(3)" readonly>
                                            <label for="cnstrct_pic"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-search"></use></svg></label>
                                        </div>
                                    </td>
                                    <th scope="row" class="w180 essential"><label for="safe_mngr">검토자(안전관리자)</label></th>
                                    <td>
                                        <div class="input_btn">
                                            <input type="text" id="safe_mngr" v-model="safe_mngr_nm" @click="fnuserpopup(1)" readonly>
                                            <label for="safe_mngr"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-search"></use></svg></label>
                                        </div>
                                    </td>
                                    <th scope="row" class="w180 essential"><label for="bplc_mngr">검토자(현장소장)</label></th>
                                    <td>
                                        <div class="input_btn">
                                            <input type="text" id="bplc_mngr" v-model="bplc_mngr_nm" @click="fnuserpopup(4)" readonly>
                                            <label for="bplc_mngr"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-search"></use></svg></label>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <th scope="row" class="w180 th2"><label for="cnstrct_pic_sign">검토자(시공담당) 서명</label></th>
                                    <td>
                                        <template v-if="cnstrct_pic_sign_yn == 'N'">
                                            <button class="btn btn-small btn-white" id="cnstrct_pic_sign" @click="fncnstrct_pic_sign()">서명하기</button>
                                        </template>
                                        <template v-else>
                                            <img :src="cnstrct_pic_sign" class="sign_img">
                                        </template>                                        
                                    </td>
                                    <th scope="row" class="w180 th2"><label for="safe_mngr_sign">검토자(안전관리자) 서명</label></th>
                                    <td>
                                        <template v-if="safe_mngr_sign_yn == 'N'">
                                            <button class="btn btn-small btn-white" id="safe_mngr_sign" @click="fnsafe_mngr_sign()">서명하기</button>
                                        </template>
                                        <template v-else>
                                            <img :src="safe_mngr_sign" class="sign_img">
                                        </template>
                                    </td>
                                    <th scope="row" class="w180 th2"><label for="bplc_mngr_sign">검토자(현장소장) 서명</label></th>
                                    <td>
                                        <template v-if="bplc_mngr_sign_yn == 'N'">
                                            <button class="btn btn-small btn-white" id="bplc_mngr_sign" @click="fnbplc_mngr_sign()">서명하기</button>
                                        </template>
                                        <template v-else>
                                            <img :src="bplc_mngr_sign" class="sign_img">
                                        </template>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </template>
                <template v-else-if="viewModel.job_type == '3'">
                    <div>
                        <h3>밀폐공간작업 승인 허가서</h3>
                        <table class="table horizontal write">
                            <caption>밀폐공간작업 승인 허가서 등록</caption>
                            <tbody>
                                <tr>
                                    <th scope="rowgroup" rowspan="3" class="w80 essential"><label for="dept_nm">신청인</label></th>
                                    <th scope="row" class="th2 w100"><label for="dept_nm">소속</label></th>
                                    <td>
                                        <input type="text" id="dept_nm" v-model="dept_nm" @input="dept_nm = $event.target.value">
                                    </td>
                                </tr>
                                <tr>
                                    <th scope="row" class="th2"><label>직책</label></th>
                                    <td>
                                        <input type="text" v-model="jbttl_nm" disabled>
                                    </td>
                                </tr>
                                <tr>
                                    <th scope="row" class="th2"><label>성명</label></th>
                                    <td>
                                        <div class="input_btn">
                                            <input type="text" v-model="wrtr_nm" disabled>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <th scope="row" colspan="2" class="essential"><label for="sdt">작업일시</label></th>
                                    <td>
                                        <div class="input_group">
                                            <div class="datepicker_box">
                                                <input type="text" class="datepicker" id="sdt" title="작업일시" placeholder="작업일시 선택" readonly>
                                            </div>
                                            <span>~</span>
                                            <div class="datepicker_box">
                                                <input type="text" class="datepicker" id="edt" title="작업일시" placeholder="작업일시 선택" readonly>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <th scope="row" colspan="2" class="essential"><label for="job_cnn">작업내용</label></th>
                                    <td>
                                        <textarea rows="2" id="job_cnn" v-model="job_cn"></textarea>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div>
                        <h3>출입자(투입근로자)</h3>
                        <div class="table_top btn-right">
                            <a href="javascript:;" v-if="wrtr == $store.state.global.userInfo.user_id" class="btn btn-light-purple" @click="fnEaebtn"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-group-add"></use></svg>추가</a>
                            <a href="javascript:;" v-if="wrtr == $store.state.global.userInfo.user_id" class="btn btn-gray" @click="fnEaedelete"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-trash-can"></use></svg>삭제</a>
                        </div>
                        <table class="table write">
                            <caption>출입자(투입근로자)</caption>
                            <thead>
                                <tr>
                                    <th scope="col" class="essential">소속</th>
                                    <th scope="col" class="essential">성명</th>
                                    <th scope="col" class="essential">안전교육 이수여부</th>
                                    <th scope="col">서명</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(item , i) in eneList" :key="item">
                                    <td><input type="text" v-model="item.belong_nm" disabled></td>
                                    <td><input type="text" v-model="item.cgpn_nm" disabled></td>
                                    <td><input type="text" v-model="item.safe_edu_dt" disabled></td>
                                    <td>
                                        <template v-if="viewModel.job_rpmsn_sn !== undefined && item.cgpn == $store.state.global.userInfo.user_id">
                                            <button v-if="item.sign_yn=='N'" class="btn btn-small btn-white" @click="fncpgnsign(item)">서명하기</button>
                                            <img v-else :src="item.cgpn_sign" class="sign_img"/>
                                        </template>
                                        <template v-else>
                                            <button class="btn btn-small btn-white" @click="fnenepopup(i,'c')">출입자 등록</button>
                                        </template>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </template>
                <div v-else class="jobTypeDiv" style="width: 100%;height: 500px;border: 1px solid #ccc;margin-top: 10px;text-align: center;">
                    <b style="position: relative;top: 50%;font-size: 25px;">작업허가서 유형을 선택하세요.</b>
                </div>
                <div class="table_footer btn-right">
                    <a href="javascript:;" class="btn btn-purple" v-if="wrtr == $store.state.global.userInfo.user_id" @click.prevent="fnSave()"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-post-add"></use></svg>{{ viewModel.job_rpmsn_sn !== undefined ? '수정' : '등록' }}</a>
                    <a href="javascript:;" class="btn btn-white" @click="fnBack"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-list-back"></use></svg>목록</a>
                </div>
        </div>
        <aprvrpopup ref="aprvrpopup" v-if="isuser==true" :pass="{title:title,bplc_yn:'Y',bplc_sn:$store.state.global.userInfo.bplc_sn,edu_yn:'Y',}"></aprvrpopup>
        <enepopup ref="enepopup" v-if="isene==true" :pass="{title:title,bplc_sn:$store.state.global.userInfo.bplc_sn,mode:mode}"></enepopup>
        <bplc ref="bplc" v-if="bplcPop==true" :pass="{dept_sn: viewModel.user.dept_sn, team_sn: viewModel.user.team_sn}"></bplc>
    </div>
    </template>
    
    <script>
        import "es6-promise/auto";
        import Axios from "axios";
        import board from "../../../../common/js/board";
        import fromValidation from "../../../../common/js/fromValidation";
        import aprvrpopup from "../../popup/user_popup.vue";
        import enepopup from "../../popup/user_edu_popup.vue";
        import bplc from "../../popup/bplc_popup.vue";
        
        export default {
            components: {
                'board' : board,
                'aprvrpopup':aprvrpopup,
                'enepopup':enepopup,
                'bplc': bplc,
            },
            data: function() {
                return {
                    list:[],
                    title:"확인자",
                    bplc_sn:"",
                    bplcPop:false,
                    isuser:false,
                    isene:false,
                    fireetc:true,
                    etc_btn:false,
                    issign:false,
                    sign_yn:"",
                    mode:"",
                    edu_bgng_hour:"",
                    edu_bgng_min:"",
                    edu_end_hour:"",
                    edu_end_min:"",
                    sdt:"",
                    edt:"",
                    dept_sn:"",
                    dept_nm:"",
                    jbttl_sn:"",
                    jbttl_nm:"",
                    wrtr_aprvr_path:"",
                    index:0,
                    bplc_nm:"",
                    bplc_id:"",
                    viewModel: {
                        job_rpmsn_sn: '',
                        job_type:'',
                        user: {},
                        data:{}
                    },
                    job_bgng_day:"",
                    job_end_day:"",
                    job_team:"",
                    job_place:"",
                    lddr_use_qy:0,
                    lddr_use_rsn:"",
                    safe_mngr:"",
                    safe_mngr_nm:"",
                    safe_mngr_sign_yn:"N",
                    safe_mngr_sign:"",
                    bplc_mngr:"", 
                    bplc_mngr_nm:"",
                    bplc_mngr_sign_yn:"N",
                    bplc_mngr_sign:"",
                    // timhder:"",  
                    // timhder_nm:"",
                    // timhder_sign_yn:"N",
                    // timhder_sign:"",
                    // biz_depthder:"", 
                    // biz_depthder_nm:"",
                    // biz_depthder_sign_yn:"N",
                    // biz_depthder_sign:"",
                    wrtr:"", 
                    wrtr_nm:"",
                    wrtr_phone:"",
                    job_team:"",
                    job_asdrtor_nm:"",
                    job_asdrtor_id:"",
                    job_place:"",
                    job_cn:"",
                    cnstrct_pic:"",
                    cnstrct_pic_nm:"",
                    cnstrct_pic_sign_yn:"N",
                    cnstrct_pic_sign:"",
                    job_nmpr:0,
                    job_asdrtor_phone:"",
                    fire_watcher:"",
                    fire_watcher_yn:"",
                    fire_watcher_edu_dt:"",
                    fire_watcher_nm:"",
                    fire_watcher_phone:"",
                    fire_watcher_sign:"",
                    excptn_mttr:"", 
                    welding:"N",
                    oxygencut:"N",
                    grindstone:"N", 
                    hscm:"N",
                    f_etc:"",
                    artcl1_chck_yn:"N", 
                    artcl2_chck_yn:"N",
                    artcl3_chck_yn:"N",
                    artcl4_chck_yn:"N",
                    artcl5_chck_yn:"N",
                    artcl6_chck_yn:"N",
                    artcl6_cn:"",
                    loudspeaker_qy:0,
                    loudspeaker_sign_yn:"N",
                    lght_fixture_qy:0, 
                    lght_fixture_sign_yn:"N", 
                    smoke_prev_mask_qy:0, 
                    smoke_prev_mask_sign_yn:"N",
                    eneList:[{
                        cgpn:""
                        ,cgpn_nm:""
                        ,cgpn_sn:0
                        ,cgpn_sign:"N"
                        ,safe_edu_dt:""
                        ,sign_yn:""
                        ,belong:""
                        ,belong_nm:""
                    }],
                    isSaved:false,
                };
            },
            activated:function(){
                this.viewModel.job_rpmsn_sn = this.$route.params.job_rpmsn_sn;
                this.viewModel.job_type = this.$route.params.job_rpmsn_no;
                this.bplc_nm = this.$store.state.global.userInfo.bplc_nm;
                this.bplc_sn = this.$store.state.global.userInfo.bplc_sn;
                // console.log(this.$store.state.global.userInfo);
                this.fnInit();
                this.fnEvt(this.viewModel.job_type);
            },
            deactivated:function(){
                this.$destroy();
            },
            mounted: function() {
                // let vm = this;
                // vm.viewModel.job_rpmsn_sn = vm.$route.params.job_rpmsn_sn;
                // vm.viewModel.job_type = vm.$route.params.job_rpmsn_no;
                // vm.bplc_nm = vm.$store.state.global.userInfo.bplc_nm;
                // vm.bplc_sn = vm.$store.state.global.userInfo.bplc_sn;
                // // console.log(vm.$store.state.global.userInfo);
                // vm.fnInit();
                // vm.fnEvt(vm.viewModel.job_type);
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
            methods: {
                fnInit: function() {
                    let vm = this;
                    vm.viewModel.user = vm.$store.state.global.userInfo;
                },
                fnEvt: function(event) {
                    let vm = this;
                    vm.viewModel.job_type = event;
                    setTimeout(function() {
                        if(event != "2"){
                            calendarInput();
                        }else{
                            calendarInput2();
                        }
                        
                    },100);
                    if(typeof vm.viewModel.job_rpmsn_sn != 'undefined'){
                        vm.fnDetail();
                    }else{
                        
                        if(vm.viewModel.job_type == "1"){
                            vm.wrtr = vm.$store.state.global.userInfo.user_id;
                            vm.wrtr_nm = vm.$store.state.global.userInfo.user_name;
                        }else if(vm.viewModel.job_type == "2"){
                            vm.wrtr = vm.$store.state.global.userInfo.user_id;
                            vm.wrtr_nm = vm.$store.state.global.userInfo.user_name;
                            vm.wrtr_phone = vm.$store.state.global.userInfo.user_phone;
                        }else{
                            vm.wrtr = vm.$store.state.global.userInfo.user_id;
                            vm.wrtr_nm = vm.$store.state.global.userInfo.user_name;
                            if(vm.$store.state.global.userInfo.bplc_yn == 'Y'){
                                vm.jbttl_sn=vm.$store.state.global.userInfo.ocpt_detail_cd;
                                vm.jbttl_nm=vm.$store.state.global.userInfo.ocpt_detail_nm;
                            }else{
                                vm.jbttl_sn=vm.$store.state.global.userInfo.jbttl_sn;
                                vm.jbttl_nm=vm.$store.state.global.userInfo.jbttl_nm;
                            }
                        }
                    }
                },
                fnDetail: function(){
                    let vm = this;
                    let send = {
                        job_rpmsn_sn: vm.viewModel.job_rpmsn_sn,
                        job_type:vm.viewModel.job_type,
                    };

                    Axios.post("/detailwkPmsList.do",send).then(function(rs) {
                        vm.viewModel.data = rs.data.detail;
                        vm.bplc_nm = rs.data.detail[0].bplc_nm;
                        vm.bplc_sn = rs.data.detail[0].bplc_sn;
                        if(vm.viewModel.job_type == "2"){
                            vm.wrtr=rs.data.detail[0].wrtr 
                            vm.wrtr_nm=rs.data.detail[0].wrtr_nm
                            vm.job_team=rs.data.detail[0].job_team 
                            vm.job_place=rs.data.detail[0].job_place
                            vm.job_cn=rs.data.detail[0].job_cn 
                            vm.job_nmpr = rs.data.fdetail[0].job_nmpr
                            
                            vm.job_asdrtor_id = rs.data.fdetail[0].job_asdrtor 
                            vm.job_asdrtor_nm = rs.data.fdetail[0].job_asdrtor_nm 
                            vm.job_asdrtor_phone = rs.data.fdetail[0].job_asdrtor_phone 

                            $("#sdt").val(rs.data.detail[0].job_bgng_day);
                            $("#edt").val(rs.data.detail[0].job_end_day);

                            vm.fire_watcher_yn = rs.data.fdetail[0].fire_watcher_yn; 
                            vm.fire_watcher = rs.data.fdetail[0].fire_watcher; 
                            vm.fire_watcher_nm = rs.data.fdetail[0].fire_watcher_nm;
                            vm.fire_watcher_phone = rs.data.fdetail[0].fire_watcher_phone; 
                            vm.fire_watcher_sign = rs.data.fdetail[0].fire_watcher_sign; 
                            vm.sign_yn = rs.data.fdetail[0].fire_watcher != null ? "Y" : "N";

                            vm.loudspeaker_qy = rs.data.fdetail[0].loudspeaker_qy; 
                            vm.lght_fixture_qy = rs.data.fdetail[0].lght_fixture_qy; 
                            vm.smoke_prev_mask_qy = rs.data.fdetail[0].smoke_prev_mask_qy; 

                            vm.loudspeaker_sign_yn = rs.data.fdetail[0].loudspeaker_sign_yn; 
                            vm.lght_fixture_sign_yn = rs.data.fdetail[0].lght_fixture_sign_yn; 
                            vm.smoke_prev_mask_sign_yn = rs.data.fdetail[0].smoke_prev_mask_sign_yn;


                            vm.artcl1_chck_yn = rs.data.fdetail[0].artcl1_chck_yn;
                            vm.artcl2_chck_yn = rs.data.fdetail[0].artcl2_chck_yn;
                            vm.artcl3_chck_yn = rs.data.fdetail[0].artcl3_chck_yn;
                            vm.artcl4_chck_yn = rs.data.fdetail[0].artcl4_chck_yn;
                            vm.artcl5_chck_yn = rs.data.fdetail[0].artcl5_chck_yn;
                            vm.artcl6_chck_yn = rs.data.fdetail[0].artcl6_chck_yn;
                            vm.artcl6_cn = rs.data.fdetail[0].artcl6_cn;

                            vm.excptn_mttr = rs.data.fdetail[0].excptn_mttr; 
                            vm.cnstrct_pic = rs.data.detail[0].cnstrct_pic ;
                            vm.cnstrct_pic_nm = rs.data.detail[0].cnstrct_pic_nm ;
                            vm.safe_mngr = rs.data.detail[0].safe_mngr ;
                            vm.safe_mngr_nm = rs.data.detail[0].safe_mngr_nm ;
                            vm.bplc_mngr = rs.data.detail[0].bplc_mngr ;
                            vm.bplc_mngr_nm = rs.data.detail[0].bplc_mngr_nm ;

                            vm.welding = rs.data.fdetail[0].welding_yn ;
                            vm.oxygencut = rs.data.fdetail[0].cutting_yn; 
                            vm.grindstone = rs.data.fdetail[0].grinder_yn;
                            vm.hscm = rs.data.fdetail[0].fscutting_yn;
                            vm.f_etc = rs.data.fdetail[0].etc_cn ;
                            vm.fireetc = rs.data.fdetail[0].etc_yn == "Y" ? false : true;
                            vm.etc_btn = rs.data.fdetail[0].etc_yn == "Y" ? true : false;

                            
                        }else if(vm.viewModel.job_type == "3"){

                            vm.dept_nm = rs.data.detail[0].job_team;
                            vm.jbttl_nm = rs.data.detail[0].jbttl_nm 
                            vm.wrtr = rs.data.detail[0].wrtr 
                            vm.wrtr_nm = rs.data.detail[0].wrtr_nm
                            vm.job_cn = rs.data.detail[0].job_cn 
                            $("#sdt").val(rs.data.detail[0].job_bgng_day); 
                            $("#edt").val(rs.data.detail[0].job_end_day); 
                            vm.eneList = rs.data.cdetail 
                        }else{
                            vm.job_team=rs.data.detail[0].job_team 
                            vm.job_place=rs.data.detail[0].job_place 
                            $("#p2").val(rs.data.detail[0].job_bgng_day)
                            vm.lddr_use_qy=rs.data.detail[0].lddr_use_qy 
                            vm.lddr_use_rsn=rs.data.detail[0].lddr_use_rsn 

                            vm.safe_mngr=rs.data.detail[0].safe_mngr 
                            vm.safe_mngr_nm=rs.data.detail[0].safe_mngr_nm 
                            vm.safe_mngr_sign = rs.data.detail[0].safe_mngr_sign 
                            vm.safe_mngr_sign_yn = rs.data.detail[0].safe_mngr_sign_yn 

                            vm.bplc_mngr=rs.data.detail[0].bplc_mngr 
                            vm.bplc_mngr_nm=rs.data.detail[0].bplc_mngr_nm 
                            vm.bplc_mngr_sign = rs.data.detail[0].bplc_mngr_sign
                            vm.bplc_mngr_sign_yn = rs.data.detail[0].bplc_mngr_sign_yn 

                            vm.etc_cn = rs.data.detail[0].etc_cn

                            // vm.timhder=rs.data.detail[0].timhder 
                            // vm.timhder_nm=rs.data.detail[0].timhder_nm  
                            // vm.timhder_sign = rs.data.detail[0].timhder_sign 
                            // vm.timhder_sign_yn = rs.data.detail[0].timhder_sign_yn
                            
                            // vm.biz_depthder=rs.data.detail[0].biz_depthder 
                            // vm.biz_depthder_nm=rs.data.detail[0].biz_depthder_nm  
                            // vm.biz_depthder_sign = rs.data.detail[0].biz_depthder_sign 
                            // vm.biz_depthder_sign_yn = rs.data.detail[0].biz_depthder_sign_yn 

                            vm.wrtr=rs.data.detail[0].wrtr 
                            vm.wrtr_nm=rs.data.detail[0].wrtr_nm 
                            vm.wrtr_aprvr_path = rs.data.detail[0].wrtr_sign 
                        }
                    });
                    
                },
                fnSave: function(){
                    let vm = this;
                    let valiData = []
                    if(vm.viewModel.job_type == "1"){
                        valiData = [
                            {id: 'job_team', type: 'input', title: '작업조명'},
                            {id: 'p2', type: 'input', title: '작업일시'},
                            {id: 'job_place', type: 'input', title: '작업위치'},
                            {id: 'lddr_use_qy', type: 'input', title: '사용수량'},
                            {id: 'lddr_use_rsn', type: 'input', title: '사용사유'},
                            {id: 'safe_mngr', type: 'input', title: '안전소장명'},
                            {id: 'bplc_mngr', type: 'input', title: '현장소장명'},
                            // {id: 'timhder', type: 'input', title: '팀장명'},
                            // {id: 'biz_depthder', type: 'input', title: '사업부장명'},
                            {id: 'wrtr', type: 'input', title: '작성자명'},
                        ];
                    }else if(vm.viewModel.job_type == "2"){
                        valiData=[
                            {id: 'job_team', type: 'input', title: '작업조명'},
                            {id: 'job_place', type: 'input', title: '작업위치'},
                            {id: 'sdt', type: 'input', title: '시작일'},
                            {id: 'edt', type: 'input', title: '종료일'},
                            {id: 'job_cn', type: 'input', title: '작업내용'},
                            {id: 'job_nmpr', type: 'input', title: '작업인원'},
                            {id: 'fire_watcher_yn', type: 'input', title: '화재감시자 배치 대상'},
                            {id: 'fire_watcher', type: 'input', title: '화재 감시자'},
                            {id: 'cnstrct_pic', type: 'input', title: '시공담당자'},
                            {id: 'safe_mngr', type: 'input', title: '안전관리자'},
                            {id: 'bplc_mngr', type: 'input', title: '현장소장명'},
                        ]
                    }else{
                        valiData=[
                            {id: 'dept_nm', type: 'input', title: '소속'},
                            {id: 'sdt', type: 'input', title: '시작일'},
                            {id: 'edt', type: 'input', title: '종료일'},
                            {id: 'job_cnn', type: 'input', title: '작업내용'},
                        ]
                        if(vm.eneList[0].cgpn == "") return alert("출입자는 한명이상 등록하셔야합니다.");
                    }
                    
                    if(!fromValidation(valiData)) {
                        return false;
                    };

                    if(vm.viewModel.job_type == "1"){

                        let send={
                            bplc_sn : vm.bplc_sn,
                            job_type:vm.viewModel.job_type,
                            job_team:vm.job_team,
                            job_place:vm.job_place, 
                            job_bgng_day:$("#p2").val(),
                            lddr_use_qy:vm.lddr_use_qy, 
                            lddr_use_rsn:vm.lddr_use_rsn,
                            safe_mngr:vm.safe_mngr, 
                            safe_mngr_sign_yn:vm.safe_mngr_sign_yn, 
                            bplc_mngr:vm.bplc_mngr, 
                            bplc_mngr_sign_yn:vm.bplc_mngr_sign_yn, 
                            // timhder:vm.timhder, 
                            // timhder_sign_yn:vm.timhder_sign_yn, 
                            // biz_depthder:vm.biz_depthder, 
                            // biz_depthder_sign_yn:vm.biz_depthder_sign_yn, 
                            wrtr:vm.wrtr,  
                            wrtr_sign_yn:"Y",
                            etc_cn: vm.etc_cn
                        }


                        if(typeof vm.viewModel.job_rpmsn_sn != 'undefined') {
                            send.job_rpmsn_sn = vm.viewModel.job_rpmsn_sn;
                            if(confirm('수정하시겠습니까?')) {
                                Axios.post("/updateWkPms.do",send).then(function(rs) {
                                    vm.isSaved = true;
                                    alert('수정되었습니다.');
                                    vm.$router.push('/');
                                });
                            };
                        } else {
                            if(confirm('등록하시겠습니까?')) {
                                Axios.post("/insertWkPms.do",send).then(function(rs) {
                                    vm.isSaved = true;
                                    alert('등록되었습니다.');
                                    vm.$router.push('/');
                                });
                            }
                        } 
                    }else if(vm.viewModel.job_type == "2"){ 
                        let send={
                            bplc_sn:vm.bplc_sn,
                            job_asdrtor:vm.job_asdrtor_id,
                            job_asdrtor_nm:vm.job_asdrtor_nm, 
                            job_asdrtor_phone:vm.job_asdrtor_phone,
                            job_type:vm.viewModel.job_type,
                            job_team:vm.job_team, 
                            job_place:vm.job_place, 
                            job_bgng_day:$("#sdt").val(),
                            job_end_day:$("#edt").val(), 
                            job_cn:vm.job_cn,
                            job_nmpr:vm.job_nmpr,
                            fire_watcher_yn:vm.fire_watcher_yn,
                            fire_watcher:vm.fire_watcher,
                            fire_watcher_phone:vm.fire_watcher_phone,
                            fire_watcher_nm:vm.fire_watcher_nm,
                            fire_watcher_edu_dt:vm.fire_watcher_edu_dt,
                            loudspeaker_qy:vm.loudspeaker_qy,
                            lght_fixture_qy:vm.lght_fixture_qy,
                            smoke_prev_mask_qy:vm.smoke_prev_mask_qy,
                            loudspeaker_sign_yn:vm.loudspeaker_sign_yn,
                            lght_fixture_sign_yn:vm.lght_fixture_sign_yn,
                            smoke_prev_mask_sign_yn:vm.smoke_prev_mask_sign_yn, 
                            wrtr:vm.wrtr, //작성자
                            welding_yn:vm.welding,
                            cutting_yn:vm.oxygencut,
                            grinder_yn:vm.grindstone,
                            fscutting_yn:vm.hscm,
                            etc_yn:vm.f_etc != "" ? "Y" : "N", 
                            etc_cn:vm.f_etc,
                            artcl1_chck_yn:vm.artcl1_chck_yn, 
                            artcl2_chck_yn:vm.artcl2_chck_yn,
                            artcl3_chck_yn:vm.artcl3_chck_yn,
                            artcl4_chck_yn:vm.artcl4_chck_yn,
                            artcl5_chck_yn:vm.artcl5_chck_yn,
                            artcl6_chck_yn:vm.artcl6_chck_yn,
                            artcl6_cn:vm.artcl6_cn,
                            excptn_mttr:vm.excptn_mttr, 
                            cnstrct_pic:vm.cnstrct_pic, 
                            safe_mngr:vm.safe_mngr,
                            bplc_mngr:vm.bplc_mngr, 
                            cnstrct_pic_sign_yn:vm.cnstrct_pic_sign_yn,
                            safe_mngr_sign_yn:vm.safe_mngr_sign_yn,
                            bplc_mngr_sign_yn:vm.bplc_mngr_sign_yn,
                        }
                        if(typeof vm.viewModel.job_rpmsn_sn != 'undefined') {
                            send.job_rpmsn_sn = vm.viewModel.job_rpmsn_sn;
                            if(confirm('수정하시겠습니까?')) {
                                Axios.post("/updateWkPms.do",send).then(function(rs) {
                                    vm.isSaved = true;
                                    alert('수정되었습니다.');
                                    vm.$router.push('/');
                                });
                            };
                        } else {
                            if(confirm('등록하시겠습니까?')) {
                                Axios.post("/insertWkPms.do",send).then(function(rs) {
                                    vm.isSaved = true;
                                    alert('등록되었습니다.');
                                    vm.$router.push('/');
                                });
                            }
                        } 

                    }else{
                        let send = {
                            bplc_sn : vm.bplc_sn,
                            job_type:vm.viewModel.job_type,
                            dept_nm: vm.dept_nm,
                            wrtr:vm.wrtr,
                            job_bgng_day:$("#sdt").val(), 
                            job_end_day:$("#edt").val(), 
                            job_cn:vm.job_cn, 
                            eneList:vm.eneList, 
                        }

                        if(typeof vm.viewModel.job_rpmsn_sn != 'undefined') {
                            send.job_rpmsn_sn = vm.viewModel.job_rpmsn_sn;
                            if(confirm('수정하시겠습니까?')) {
                                Axios.post("/updateWkPms.do",send).then(function(rs) {
                                    vm.isSaved = true;
                                    alert('수정되었습니다.');
                                    vm.$router.push('/');
                                });
                            };
                        } else {
                            if(confirm('등록하시겠습니까?')) {
                                
                                Axios.post("/insertWkPms.do",send).then(function(rs) {
                                    vm.isSaved = true;
                                    alert('등록되었습니다.');
                                    vm.$router.push('/');
                                });
                            }
                        } 
                    }
                },
                equipmentCheck:function(i,checked){
                    let vm = this;
                    
                    if(i == 1){
                        vm.welding = checked == true ? "Y" : "N"
                    }else if(i == 2){
                        vm.oxygencut = checked == true ? "Y" : "N"
                    }else if(i == 3){
                        vm.grindstone = checked == true ? "Y" : "N"
                    }else if(i == 4){
                        vm.hscm = checked == true ? "Y" : "N"
                    }else if(i == 5){
                        vm.fireetc = checked == true ? false : true;
                    }
                },
                fnuserpopup:function(i){
                    let vm = this;
                    vm.isuser = true;
                    vm.isene = false;
                    vm.bplcPop = false;
                    vm.index = i;

                    if(vm.viewModel.job_type == '2' && i == 5){
                        vm.title = '작업반장';
                    }else if(vm.viewModel.job_type == '2' && i != 5){
                        vm.title = '검토자';
                    }else{
                        vm.title = '확인자';
                    }

                    vm.$nextTick(function() {
                        if(vm.isuser){
                            vm.$refs.aprvrpopup.fnInit();
                        }
                    })
                },
                fnenepopup:function(i,mode){
                    let vm = this;
                    vm.isuser = false;
                    vm.isene = true;
                    vm.bplcPop = false;
                    vm.index = i;
                    vm.mode = mode;
                    if(mode == 'f'){
                        vm.title = '화재 감시자'
                    }else{
                        vm.title = '출입자'
                    };
                    vm.$nextTick(function() {
                        if(vm.isene){
                            vm.$refs.enepopup.fnInit();
                        }                
                    })
                },
                fnMemberAdd: function(item){
                    let vm = this;
                    if(vm.viewModel.job_type == "1"){
                        if(vm.index == 1){
                            vm.safe_mngr_nm = item.user_nm;
                            vm.safe_mngr = item.user_id;
                        }else if(vm.index == 2){
                            vm.bplc_mngr_nm = item.user_nm;
                            vm.bplc_mngr = item.user_id;
                        }else if(vm.index == 3){
                            // vm.timhder_nm = item.user_nm;
                            // vm.timhder = item.user_id;
                        }else{
                            // vm.biz_depthder_nm = item.user_nm;
                            // vm.biz_depthder = item.user_id;
                        }
                    }else if(vm.viewModel.job_type == "2"){ 
                        if(vm.index == 1){
                            vm.safe_mngr_nm = item.user_nm;
                            vm.safe_mngr = item.user_id;
                        }else if(vm.index == 2){
                            vm.fire_watcher = item.user_id;
                            vm.fire_watcher_nm = item.user_nm;
                            vm.fire_watcher_phone = item.user_phone;
                            vm.fire_watcher_edu_dt = item.reg_dt;
                            vm.sign_yn = item.sign_yn;
                        }else if(vm.index == 3){
                            vm.cnstrct_pic = item.user_id;
                            vm.cnstrct_pic_nm = item.user_nm;
                        }else if(vm.index == 4){
                            vm.bplc_mngr_nm = item.user_nm;
                            vm.bplc_mngr = item.user_id;
                        }else{
                            vm.job_asdrtor_nm = item.user_nm;
                            vm.job_asdrtor_id = item.user_id;
                            vm.job_asdrtor_phone = item.user_phone;
                        }
                    }else{ 
                        vm.$set(vm.eneList[vm.index],"cgpn",item.user_id);
                        vm.$set(vm.eneList[vm.index],"cgpn_sn",(vm.index + 1));
                        vm.$set(vm.eneList[vm.index],"cgpn_nm",item.user_nm);
                        vm.$set(vm.eneList[vm.index],"cgpn_sign",item.aprvr1_img);
                        vm.$set(vm.eneList[vm.index],"safe_edu_dt",item.reg_dt);
                        vm.$set(vm.eneList[vm.index],"sign_yn","N");
                        vm.$set(vm.eneList[vm.index],"belong",item.dept_sn);
                        vm.$set(vm.eneList[vm.index],"belong_nm",item.dept_nm);
                    }

                    vm.close(false);
                },
                fnEaebtn:function(){
                    let vm = this;
                    if(vm.eneList.length >= 6){
                        return alert("최대 6명까지 출입자 등록이 가능합니다.");
                    }else{
                        vm.eneList.push({cgpn:"",cgpn_nm:"",cgpn_sn:0,cgpn_sign:"N",safe_edu_dt:"",sign_yn:"N",belong:"",belong_nm:""});
                    }
                },
                fnEaedelete:function(){
                    let vm = this;

                    if(confirm("출입자를 삭제하시겠습니까?")){
                        if(vm.eneList.length == 1){
                            return alert("최소 1명까지 출입자 등록이 가능합니다.");
                        }else{
                            vm.eneList.splice((vm.eneList.length-1),1);
                            for (let index = 0; index < vm.eneList.length; index++) {
                                vm.$set(vm.eneList[index],'cgpn_sn',(index + 1))
                            }
                            alert("삭제되었습니다.");
                        }
                    }

                },

                fnbiz_depthder_sign:function(){
                    
                    let vm = this;
                    let send={
                        job_rpmsn_sn : vm.viewModel.job_rpmsn_sn,
                        job_type : vm.viewModel.job_type,
                    }
                    if(vm.viewModel.job_rpmsn_sn === undefined){
                        alert("등록후 서명이 가능합니다.");
                        return false;
                    }
                    if(vm.biz_depthder == vm.$store.state.global.userInfo.user_id){
                        if(confirm("서명하시겠습니까?")){
                            Axios.post('/rgstWkPmsBizSign.do',send).then(function(){
                                alert("서명을 완료했습니다.");
                                vm.fnDetail();
                            })
                        }
                    }else{
                        return alert("서명대상이 아닙니다.");
                    }
                },
                fntimhder_sign:function(){
                    let vm = this;
                    let send={
                        job_rpmsn_sn : vm.viewModel.job_rpmsn_sn,
                        job_type : vm.viewModel.job_type,
                    }
                    if(vm.viewModel.job_rpmsn_sn === undefined){
                        alert("등록후 서명이 가능합니다.");
                        return false;
                    }
                    if(vm.timhder == vm.$store.state.global.userInfo.user_id){
                        if(confirm("서명하시겠습니까?")){
                            Axios.post('/rgstWkPmsTimSign.do',send).then(function(){
                                alert("서명을 완료했습니다.");
                                vm.fnDetail();
                            })
                        }
                    }else{
                        return alert("서명대상이 아닙니다.");
                    }
                },
                fnbplc_mngr_sign:function(){
                    let vm = this;
                    let send={
                        job_rpmsn_sn : vm.viewModel.job_rpmsn_sn,
                        job_type : vm.viewModel.job_type,
                    }
                    if(vm.viewModel.job_rpmsn_sn === undefined){
                        alert("등록후 서명이 가능합니다.");
                        return false;
                    }
                    if(vm.bplc_mngr == vm.$store.state.global.userInfo.user_id){
                        if(confirm("서명하시겠습니까?")){
                            Axios.post('/rgstWkPmsBplcSign.do',send).then(function(){
                                alert("서명을 완료했습니다.");
                                vm.fnDetail();
                            })
                        }
                    }else{
                        return alert("서명대상이 아닙니다.");
                    }
                },
                fnsafe_mngr_sign:function(){
                    let vm = this;
                    let send={
                        job_rpmsn_sn : vm.viewModel.job_rpmsn_sn,
                        job_type : vm.viewModel.job_type,
                    }
                    if(vm.viewModel.job_rpmsn_sn === undefined){
                        alert("등록후 서명이 가능합니다.");
                        return false;
                    }
                    if(vm.safe_mngr == vm.$store.state.global.userInfo.user_id){
                        if(confirm("서명하시겠습니까?")){
                            Axios.post('/rgstWkPmsSafeSign.do',send).then(function(){
                                alert("서명을 완료했습니다.");
                                vm.fnDetail();
                            })
                        }
                    }else{
                        return alert("서명대상이 아닙니다.");
                    }
                },
                fncnstrct_pic_sign:function(){
                    let vm = this;
                    let send={
                        job_rpmsn_sn : vm.viewModel.job_rpmsn_sn,
                        job_type : vm.viewModel.job_type,
                    }
                    if(vm.viewModel.job_rpmsn_sn === undefined){
                        alert("등록후 서명이 가능합니다.");
                        return false;
                    }
                    if(vm.cnstrct_pic == vm.$store.state.global.userInfo.user_id){
                        if(confirm("서명하시겠습니까?")){
                            Axios.post('/rgstWkPmsCnstrctSign.do',send).then(function(){
                                alert("서명을 완료했습니다.");
                                vm.fnDetail();
                            })
                        }
                    }else{
                        return alert("서명대상이 아닙니다.");
                    }
                },
                fnfire_watcher_sign:function(type){
                    let vm = this;

                    let send = {
                        job_rpmsn_sn : vm.viewModel.job_rpmsn_sn,
                        job_type : type,
                    }
                    if(vm.viewModel.job_rpmsn_sn === undefined){
                        alert("등록후 서명이 가능합니다.");
                        return false;
                    }
                    if(confirm("서명하시겠습니까?")){
                        Axios.post('/firewatchersign.do',send).then(function(res){
                            
                            if(res.data != 9999){
                                alert("서명되었습니다.");
                                vm.fnDetail();
                            }else{
                                alert("서명되지 않았습니다.");
                            }
                        })
                    }
                    
                },
                fncpgnsign:function(item){
                    let vm = this;

                    let send={
                        job_rpmsn_sn : vm.viewModel.job_rpmsn_sn,
                        cgpn_sn : item.cgpn_sn,
                    }
                    if(vm.viewModel.job_rpmsn_sn === undefined){
                        alert("등록후 서명이 가능합니다.");
                        return false;
                    }
                    if(confirm("서명하시겠습니까?")){
                        Axios.post('/rgstWkPmsCgpnSign.do',send).then(function(res){
                            
                            if(res.data != 9999){
                                alert("서명되었습니다.");
                                vm.fnDetail();
                            }else{
                                alert("서명되지 않았습니다.");
                            }
                        })
                    }
                    
                },
                close:function(bool){
                    this.isuser = bool;
                    this.isene = bool;
                },
                fnPopup: function () {
                    let vm = this;
                    vm.bplcPop = true;
                    vm.isuser = false;
                    vm.isene = false;
                    vm.$nextTick(function () {
                        if (vm.bplcPop) {
                            vm.$refs.bplc.fnInit();
                        }
                    })
                },
                fnBplcAdd: function (item) {
                    let vm = this;

                    vm.bplc_sn = item.bplc_sn;
                    vm.bplc_nm = item.bplc_nm;
                },
                fnBack:function(){
                    let vm = this;
                    // if(vm.viewModel.job_rpmsn_sn !== undefined){
                    //     if(confirm("수정작업을 중단하고 목록으로 가시겠습니까?")){
                            vm.$router.push("/");
                    //     }
                    // }else{
                    //     if(confirm("작성을 중단하고 목록으로 가시겠습니까?")){
                            vm.$router.push("/");
                    //     }
                    // }
                },
            },
            watch:{ 
                lddr_use_qy : function(e){
                    return this.lddr_use_qy = this.lddr_use_qy === undefined ? 0 : this.lddr_use_qy == 0 ? 0 : this.lddr_use_qy.toString().replace(/[^0-9]/g, '').replace(/(^0+)/, '');
                },
                job_nmpr : function(){
                    return this.job_nmpr = this.job_nmpr === undefined ? 0 : this.job_nmpr == 0 ? 0 : this.job_nmpr.toString().replace(/[^0-9]/g, '').replace(/(^0+)/, '');
                },
                loudspeaker_qy : function(){
                    return this.loudspeaker_qy = this.loudspeaker_qy === undefined ? 0 : this.loudspeaker_qy == 0 ? 0 : this.loudspeaker_qy.toString().replace(/[^0-9]/g, '').replace(/(^0+)/, '');
                },
                lght_fixture_qy : function(){
                    return this.lght_fixture_qy = this.lght_fixture_qy === undefined ? 0 : this.lght_fixture_qy == 0 ? 0 : this.lght_fixture_qy.toString().replace(/[^0-9]/g, '').replace(/(^0+)/, '');
                },
                smoke_prev_mask_qy : function(){
                    return this.smoke_prev_mask_qy = this.smoke_prev_mask_qy === undefined ? 0 : this.smoke_prev_mask_qy == 0 ? 0 : this.smoke_prev_mask_qy.toString().replace(/[^0-9]/g, '').replace(/(^0+)/, '');
                },
                artcl6_chck_yn: function(){
                    if(this.artcl6_chck_yn == 'N') this.artcl6_cn = "";
                }
            },
        };
    </script>
    