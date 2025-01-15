<template>
    <div style="float: inline-end;height: 0px;">
        <template v-if="job_type_no == '1'">
            <div class="contents write">
                <div class="btn-group btn-right">
                    <button class="btn btn-white" @click="fnDownlaod(list.job_type)"><svg class="icon"><use xlink:href="/img/symbol-defs.svg#icon-download"></use></svg>다운로드</button>
                    <button @click="fnPrint('viewDiv1')" class="btn btn-purple"><svg class="icon"><use xlink:href="/img/symbol-defs.svg#icon-print"></use></svg>인쇄</button>
                </div>
                <div class="print_page contents" id="viewDiv1" ref="viewDiv1">
                    <div class="print_title">
                        <div class="logo">
                            <div class="logo_img"><img src="/img/logo.png" alt="GS네오텍 로고"></div>
                            <span>스마트 <strong>안전보건</strong> 솔루션</span>
                        </div>
                        <p>사다리 사용 작업 허가서</p>
                    </div>
                    <div>
                        <h3>사다리 사용 작업 허가서</h3>
                        <table class="table horizontal">
                            <caption>사다리 사용 작업 허가서 등록</caption>
                            <tbody>
                                <tr>
                                    <th scope="row" class="w180"><label>작업조명</label></th>
                                    <td>{{ list.job_team }}</td>
                                </tr>
                                <tr>
                                    <th scope="row"><label>작업일시</label></th>
                                    <td>{{ list.job_bgng_day }}</td>
                                </tr>
                                <tr>
                                    <th scope="row"><label>작성자 (작업조장)</label></th>
                                    <td>{{ list.wrtr_nm }}</td>
                                </tr>
                                <tr>
                                    <th scope="row"><label>작업위치</label></th>
                                    <td>{{ list.job_place }}</td>
                                </tr>
                                <tr>
                                    <th scope="row"><label>사용수량</label></th>
                                    <td>{{ list.lddr_use_qy }}</td>
                                </tr>
                                <tr>
                                    <th scope="row"><label>사용사유</label></th>
                                    <td>{{ list.lddr_use_rsn }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div>
                        <h3>확인자</h3>
                        <table class="table horizontal">
                            <caption>확인자 서명</caption>
                            <tbody>
                                <tr>
                                    <th scope="rowgroup" colspan="8" class="text-center">작업장(사진) 검토결과, 사다리 사용이 불가피한 장소임을 확인 합니다.</th>
                                </tr>
                                <tr>
                                    <th scope="row" class="w180 th2"><label>안전</label></th>
                                    <td>
                                        <div>
                                            {{ list.safe_mngr_nm }}
                                        </div>
                                    </td>
                                    <th scope="row" class="w150 th2"><label for="">서명</label></th>
                                    <td>
                                        <img v-if="list.safe_mngr_sign_yn == 'Y'" :src="safe_mngr_sign" class="sign_img">
                                        <div v-else class="unit_box">
                                            <p></p>
                                            <span>(서명)</span>
                                        </div>
                                    </td>
                                    <th scope="row" class="w180 th2"><label>현장소장</label></th>
                                    <td>
                                        <div>
                                            {{ list.bplc_mngr_nm }}
                                        </div>
                                    </td>
                                    <th scope="row" class="w150 th2"><label for="">서명</label></th>
                                    <td>
                                        <img v-if="list.bplc_mngr_sign_yn == 'Y'" :src="bplc_mngr_sign" class="sign_img">
                                        <div v-else class="unit_box">
                                            <p></p>
                                            <span>(서명)</span>
                                        </div>
                                    </td>
                                </tr>
                                <!-- <tr>
                                    <th scope="row" class="th2"><label>팀장</label></th>
                                    <td>
                                        <div>
                                            {{ list.timhder_nm }}
                                        </div>
                                    </td>
                                    <th scope="row" class="th2"><label for="">서명</label></th>
                                    <td>
                                        <img v-if="list.timhder_sign_yn == 'Y'" :src="list.timhder_sign" class="sign_img">
                                        <div v-else class="unit_box">
                                            <p></p>
                                            <span>(서명)</span>
                                        </div>
                                    </td>
                                    <th scope="row" class="th2"><label>사업부장</label></th>
                                    <td>
                                        <div>
                                            {{ list.biz_depthder_nm }}
                                        </div>
                                    </td>
                                    <th scope="row" class="th2"><label for="">서명</label></th>
                                    <td>
                                        <img v-if="list.biz_depthder_sign_yn == 'Y'" :src="list.biz_depthder_sign" class="sign_img">
                                        <div v-else class="unit_box">
                                            <p></p>
                                            <span>(서명)</span>
                                        </div>
                                    </td>
                                </tr> -->
                                <tr>
                                    <th scope="rowgroup" colspan="8" class="text-center">상기 작성자는 아래의 안전기준을 준수함을 확인합니다.</th>
                                </tr>
                                <tr>
                                    <th scope="row" class="th2"><label>작성자</label></th>
                                    <td>{{ list.wrtr_nm }}</td>
                                    <th scope="row" class="th2"><label for="">서명</label></th>
                                    <td>
                                        <img v-if="list.wrtr_sign_yn == 'Y'" :src="list.wrtr_sign" class="sign_img">
                                        <div v-else class="unit_box">
                                            <p></p>
                                            <span>(서명)</span>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div>
                        <h3>기타사항</h3>
                        <table class="table write">
                            <tr>
                                <td class="pre text-left">{{ list.etc_cn }}</td>
                            </tr>
                        </table>
                    </div>
                    <div>
                        <h3>안전 내용</h3>
                        <div class="box"><!--standards_ladder-->
                            <div class="divide">
                                <div>
                                    <h4>■ A형 사다리를 작업용으로 사용시 안전기준</h4>
                                    <div>
                                        <ul>
                                            <li>
                                                <b>1. 사용장소</b>
                                                고소작업대, (틀)비계설치 어려운 협소장소
                                            </li>
                                            <li>
                                                <b>2. 높이별 사용기준</b>
                                                <div>
                                                    <table class="table split">
                                                        <caption>높이별 사용기준</caption>
                                                        <tbody>
                                                            <tr>
                                                                <td></td>
                                                                <th scope="row" class="lv4 w135">3.5m이상</th>
                                                                <td class="text-left">
                                                                    <ul class="bl_dot">
                                                                        <li>3.5m 이상 작업 금지</li>
                                                                    </ul>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td><img src="/img/ladder_lv3.png" alt="사다리 높이 lv3"></td>
                                                                <th scope="row" class="lv3">3.5m (12단) 미만</th>
                                                                <td class="text-left">
                                                                    <ul class="bl_dot">
                                                                        <li>생명줄 설치, 안전대 고리 체결 또는 안전사다리 사용</li>
                                                                    </ul>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td><img src="/img/ladder_lv2.png" alt="사다리 높이 lv2"></td>
                                                                <th scope="row" class="lv2">2m (6단) 미만</th>
                                                                <td class="text-left">
                                                                    <ul class="bl_dot">
                                                                        <li>아우트리거 설치</li>
                                                                        <li>2인 1조 작업</li>
                                                                    </ul>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td><img src="/img/ladder_lv1.png" alt="사다리 높이 lv1"></td>
                                                                <th scope="row" class="lv1">1.2m (4단) 미만</th>
                                                                <td class="text-left">
                                                                    <ul class="bl_dot">
                                                                        <li>평탄, 견고, 미끄럼 없는 바닥</li>
                                                                        <li>최상부 발판와 바로 밑 하단 에서 작업금지</li>
                                                                        <li>승하강시 3점지지</li>
                                                                        <li class="dep2">
                                                                            <p>- 손에 물건잡고 이동금지</p>
                                                                            <p>- 사다리 등지고 승하강 금지</p>
                                                                            <p>- 내려오며 디딤 발판 확인</p>
                                                                        </li>
                                                                    </ul>
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <div>
                                    <div>
                                        <h4>■ 사다리 종류별 사용용도 제한</h4>
                                        <div>
                                            <table class="table">
                                                <caption>사다리 종류별 사용용도 제한</caption>
                                                <thead>
                                                    <tr>
                                                        <th scope="col">종류</th>
                                                        <th scope="col">이동통로</th>
                                                        <th scope="col">작업용</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td>일자형</td>
                                                        <td>O</td>
                                                        <td>X</td>
                                                    </tr>
                                                    <tr>
                                                        <td>A형</td>
                                                        <td>O</td>
                                                        <td>O</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                            <em>※ A형 일자로 펴서사용 금지</em>
                                        </div>
                                    </div>
                                    <div>
                                        <h4>■ 그 밖의 주의사항</h4>
                                        <div>
                                            <ul>
                                                <li>1. 지반 안전도 확인</li>
                                                <li>2. 최상부 발판 및 바로 밑 하단에서 작업금지</li>
                                                <li>
                                                    3. 승하강시 3점 지지
                                                    <div class="dep2">
                                                        <p>- 손에 물건잡고 이동금지</p>
                                                        <p>- 사다리 등지고 승/하강 금지</p>
                                                    </div>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                    
                                </div>
                            </div>
                            <div>
                                <h4>■ A형 사다리를 작업용으로 사용시 안전기준</h4>
                                <div>
                                    <ul class="input_group">
                                        <li>
                                            <img src="/img/ladder_case1.png" alt="사다리 안전기준 case1">
                                            <p>(Case 1) 등지고 내려오던 중 미끄러짐</p>
                                        </li>
                                        <li>
                                            <img src="/img/ladder_case2.png" alt="사다리 안전기준 case2">
                                            <p>(Case 2) 내려오던 중 발을 헛딛고 떨어짐</p>
                                        </li>
                                        <li>
                                            <img src="/img/ladder_case3.png" alt="사다리 안전기준 case3">
                                            <p>(Case 3) 하단에서 몸을 틀면서 내려오다 발을 헛디딤</p>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </template>
        <template v-else-if="job_type_no == '2'">
            <div class="contents write">
                <div class="btn-group btn-right">
                    <button class="btn btn-white" @click="fnDownlaod(list.job_type)"><svg class="icon"><use xlink:href="/img/symbol-defs.svg#icon-download"></use></svg>다운로드</button>
                    <button class="btn btn-purple" @click="fnPrint('viewDiv2')"><svg class="icon"><use xlink:href="/img/symbol-defs.svg#icon-print"></use></svg>인쇄</button>
                </div>
                <div class="print_page contents" id="viewDiv2" ref="viewDiv2">
                    <div class="print_title">
                        <div class="logo">
                            <div class="logo_img"><img src="/img/logo.png" alt="GS네오텍 로고"></div>
                            <span>스마트 <strong>안전보건</strong> 솔루션</span>
                        </div>
                        <p>화재위험작업 승인 허가서</p>
                    </div>
                    <div>
                        <h3>화재위험작업 승인/허가서</h3>
                        <table class="table horizontal">
                            <caption>화재위험작업 승인/허가서 등록</caption>
                            <tbody>
                                <tr>
                                    <th scope="row" class="w180"><label>작업팀</label></th>
                                    <td colspan="2">{{ list.job_team }}</td>
                                    <th scope="row" class="w180"><label>작성자</label></th>
                                    <td colspan="3">{{ list.wrtr_nm }}</td>
                                </tr>
                                <tr>
                                    <th scope="row"><label>작업장소</label></th>
                                    <td colspan="2">{{ list.job_place }}</td>
                                    <th scope="row"><label>작업인원</label></th>
                                    <td colspan="3">
                                        <div class="unit_box">
                                            <p>{{ flist.job_nmpr }}</p>
                                            <span class="unit">명</span>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <th scope="row"><label>작업내용</label></th>
                                    <td colspan="2">{{ list.job_cn }}</td>
                                    <th scope="row"><label>사용장비</label></th>
                                    <td colspan="3">
                                        <div>
                                            <label><input type="checkbox" :checked="flist.welding_yn =='Y' ? true:false" disabled>용접기</label>
                                            <label><input type="checkbox" :checked="flist.cutting_yn =='Y' ? true:false" disabled>산소절단기</label>
                                            <label><input type="checkbox" :checked="flist.grinder_yn =='Y' ? true:false" disabled>그라인더</label>
                                            <label><input type="checkbox" :checked="flist.fscutting_yn =='Y' ? true:false" disabled>고속절단기</label>
                                            <div class="input_group">
                                                <label><input type="checkbox" :checked="flist.etc_yn =='Y' ? true:false" disabled>기타</label>
                                                <input type="text" class="w200" :value="flist.etc_yn == 'Y' ? flist.etc_cn : ''" disabled>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <th scope="rowgroup" rowspan="2"><label>작업반장</label></th>
                                    <th scope="row" class="th2 w100">성명</th>
                                    <td>{{ flist.job_asdrtor_nm }}</td>
                                    <th scope="rowgroup" rowspan="2"><label>작업기간<br>(허가 유효기간 최대 7일)</label></th>
                                    <td colspan="3">{{ list.job_bgng_day }}</td>
                                </tr>
                                <tr>
                                    <th scope="row" class="th2">연락처</th>
                                    <td>{{ flist.job_asdrtor_phone }}</td>
                                    <td colspan="3">{{ list.job_end_day }}</td>
                                </tr>
                                <tr>
                                    <th scope="row" colspan="2"><label>화재감시자 배치 대상 (용접, 용단 작업)</label></th>
                                    <td>{{ flist.fire_watcher_yn == 'Y' ? '유' : '무' }}</td>
                                    <th scope="row" rowspan="2"><label>화재감시자의 업무<br>안전보건교육 이수 여부</label></th>
                                    <th scope="col" class="th2 w150"><label for="">확성기</label></th>
                                    <th scope="col" class="th2 w150"><label for="">휴대용 조명기구</label></th>
                                    <th scope="col" class="th2 w150"><label for="">방연마스크</label></th>
                                </tr>
                                <tr>
                                    <th scope="rowgroup" rowspan="2"><label>화재 감시자</label></th>
                                    <th scope="row" class="th2"><label>성명</label></th>
                                    <td>{{ flist.fire_watcher_nm }}</td>
                                    <td>
                                        <div class="unit_box">
                                            <p>{{ flist.loudspeaker_qy }}</p>
                                            <span class="unit">개</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div class="unit_box">
                                            <p>{{ flist.lght_fixture_qy }}</p>
                                            <span class="unit">개</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div class="unit_box">
                                            <p>{{ flist.smoke_prev_mask_qy }}</p>
                                            <span class="unit">개</span>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <th scope="row" class="th2"><label>연락처</label></th>
                                    <td>{{ flist.fire_watcher_phone }}</td>
                                    <td>{{ flist.fire_watcher_edu_dt != "" ? "이수" : "교육 이수 요청" }}</td>
                                    <td>
                                        <div>
                                            <img v-if="flist.loudspeaker_sign_yn == 'Y'" :src="flist.fire_watcher_sign" class="sign_img">
                                        </div>
                                    </td>
                                    <td>
                                        <div>
                                            <img v-if="flist.lght_fixture_sign_yn == 'Y'" :src="flist.fire_watcher_sign" class="sign_img">
                                        </div>
                                    </td>
                                    <td>
                                        <div>
                                            <img v-if="flist.smoke_prev_mask_sign_yn == 'Y'" :src="flist.fire_watcher_sign" class="sign_img">
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div>
                        <h3><strong>※ 화재감시자의 업무 : </strong> 화재의 위험을 감시하고 화재 발생 시 사업장 내 근로자의 대피를 유도하는 업무만을 담당</h3>
                        <table class="table">
                            <caption>화재감시자의 업무</caption>
                            <tbody>
                                <tr>
                                    <th scope="col" colspan="3">화재 위험작업 [작업장 주변 여건]</th>
                                    <th scope="col" colspan="3">특이사항 [ 발생시 기입]</th>
                                </tr>
                                <tr>
                                    <td colspan="3">
                                        <ul class="text-left">
                                            <li>
                                                <label>
                                                    <input type="checkbox" :checked="flist.artcl1_chck_yn == 'Y' ? true:false" disabled>
                                                    작업반경 11m 이내 가연성물질이 있는 장소의 작업
                                                </label>
                                            </li>
                                            <li>
                                                <label>
                                                    <input type="checkbox" :checked="flist.artcl2_chck_yn == 'Y' ? true:false" disabled>
                                                    불꽃에 의해 쉽게 발화 될 우려가 있는 장소의 작업
                                                </label>
                                            </li>
                                            <li>
                                                <label>
                                                    <input type="checkbox" :checked="flist.artcl3_chck_yn == 'Y' ? true:false" disabled>
                                                    열전도, 열복사에 의해 발화될 우려가 있는 장소의 작업
                                                </label>
                                            </li>
                                            <li>
                                                <label>
                                                    <input type="checkbox" :checked="flist.artcl4_chck_yn == 'Y' ? true:false" disabled>
                                                    용접 및 용단 작업
                                                </label>
                                            </li>
                                            <li>
                                                <label>
                                                    <input type="checkbox" :checked="flist.artcl5_chck_yn == 'Y' ? true:false" disabled>
                                                    금속 절단 및 연마 작업
                                                </label>
                                            </li>
                                            <li>
                                                <label>
                                                    <input type="checkbox" :checked="flist.artcl6_chck_yn == 'Y' ? true:false" disabled>
                                                    기타 화재 위험이 있는 작업
                                                </label>
                                                <label>
                                                    <input v-if="flist.artcl6_chck_yn == 'Y'" type="text" v-model="flist.artcl6_cn" disabled>
                                                </label>
                                            </li>
                                        </ul>
                                    </td>
                                    <td colspan="3" class="text-left">{{ flist.excptn_mttr }}</td>
                                </tr>
                                <tr>
                                    <th scope="row" class="w180"><label>검토자(시공담당)</label></th>
                                    <td>
                                        <div class="sign_box ">
                                            {{ list.cnstrct_pic_nm }}
                                        </div>
                                    </td>
                                    <th scope="row" class="w180"><label>검토자(안전관리자)</label></th>
                                    <td>
                                        <div class="input_btn">
                                            {{ list.safe_mngr_nm }}
                                        </div>
                                    </td>
                                    <th scope="row" class="w180"><label>검토자(현장소장)</label></th>
                                    <td>
                                        <div class="input_btn">
                                            {{ list.bplc_mngr_nm }}
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <th scope="row" class="w150 th2"><label>검토자(시공담당) 서명</label></th>
                                    <td>
                                        <img v-if="list.cnstrct_pic_sign_yn == 'Y'" :src="list.cnstrct_pic_sign" class="sign_img">                              
                                    </td>
                                    <th scope="row" class="w150 th2"><label>검토자(안전관리자) 서명</label></th>
                                    <td>
                                        <img v-if="list.safe_mngr_sign_yn == 'Y'" :src="list.safe_mngr_sign" class="sign_img">
                                    </td>
                                    <th scope="row" class="w150 th2"><label>검토자(현장소장) 서명</label></th>
                                    <td>
                                        <img v-if="list.bplc_mngr_sign_yn == 'Y'" :src="list.bplc_mngr_sign" class="sign_img">
                                    </td>
                                </tr>
                                <tr>
                                    <th scope="row"><label>작업일시</label></th>
                                    <td>
                                        <div class="datepicker_box">
                                            
                                        </div>
                                    </td>
                                    <th scope="row"><label>작업 시작전 확인 (시간)</label></th>
                                    <td>
                                        <div class="input_group">
                                            
                                        </div>
                                    </td>
                                    <th scope="row"><label>작업 종료 후 확인 (시간)</label></th>
                                    <td>
                                        <div class="input_group">

                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div>
                        <h3>주요준수사항</h3>
                        <table class="table">
                            <caption>주요준수사항</caption>
                            <thead>
                                <tr>
                                    <th scope="col" colspan="2" rowspan="2">주요준수사항</th>
                                    <th scope="col" colspan="2">점검결과</th>
                                    <th scope="col" rowspan="2">조치결과</th>
                                </tr>
                                <tr>
                                    <th scope="col">적정</th>
                                    <th scope="col">미흡</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td rowspan="7">작업전</td>
                                    <td class="text-left">1. 주변 자재 정리정돈 및 가연성 물질 제거 또는 방호 조치</td>
                                    <td>
                                        <input type="checkbox" disabled>
                                    </td>
                                    <td>
                                        <input type="checkbox" disabled>
                                    </td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td class="text-left">2. 화기작업구간 적정 능력 이상의 소화기, 방화수 등 비치</td>
                                    <td>
                                        <input type="checkbox" disabled>
                                    </td>
                                    <td>
                                        <input type="checkbox" disabled>
                                    </td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td class="text-left">3. 용접불티 비산방지덮개, 용접방화포 등 불꽃, 불티 비산방치조치</td>
                                    <td>
                                        <input type="checkbox" disabled>
                                    </td>
                                    <td>
                                        <input type="checkbox" disabled>
                                    </td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td class="text-left">4. 인화성 액체의 증기 및 인화성 가스 환기 조치</td>
                                    <td>
                                        <input type="checkbox" disabled>
                                    </td>
                                    <td>
                                        <input type="checkbox" disabled>
                                    </td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td class="text-left">5. 작업자 보호구 착용(보안면, 용접 장갑, 용접용 앞치마 등)</td>
                                    <td>
                                        <input type="checkbox" disabled>
                                    </td>
                                    <td>
                                        <input type="checkbox" disabled>
                                    </td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td class="text-left">6. 작업자에 대한 화재예방 및 피난교육 등 비상조치</td>
                                    <td>
                                        <input type="checkbox" disabled>
                                    </td>
                                    <td>
                                        <input type="checkbox" disabled>
                                    </td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td class="text-left">7. 용접, 용단, 가열 및 연마작업 기계, 기구의 점검</td>
                                    <td>
                                        <input type="checkbox" disabled>
                                    </td>
                                    <td>
                                        <input type="checkbox" disabled>
                                    </td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td rowspan="3">작업종료</td>
                                    <td class="text-left">8. 용접기, 그라인드 등 전원 OFF 상태 확인 점검</td>
                                    <td>
                                        <input type="checkbox" disabled>
                                    </td>
                                    <td>
                                        <input type="checkbox" disabled>
                                    </td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td class="text-left">9. 산소, LPG, 알곤 등 용기 고정 및 OFF 상태 확인 점검</td>
                                    <td>
                                        <input type="checkbox" disabled>
                                    </td>
                                    <td>
                                        <input type="checkbox" disabled>
                                    </td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td class="text-left">10. 작업 종료 후 잔여 불씨 확인 점검</td>
                                    <td>
                                        <input type="checkbox" disabled>
                                    </td>
                                    <td>
                                        <input type="checkbox" disabled>
                                    </td>
                                    <td></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div>
                        <h3>확인자</h3>
                        <table class="table horizontal">
                            <caption>확인자</caption>
                            <tbody>
                                <tr>
                                    <th scope="row">시공 담당</th>
                                    <td>
                                        <div class="unit_box">
                                            <p></p>
                                            <span>(서명)</span>
                                        </div>
                                    </td>
                                    <th scope="row">안전관리자</th>
                                    <td>
                                        <div class="unit_box">
                                            <p></p>
                                            <span>(서명)</span>
                                        </div>
                                    </td>
                                    <th scope="row">현장소장</th>
                                    <td>
                                        <div class="unit_box">
                                            <p></p>
                                            <span>(서명)</span>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </template>
        <template v-else>
            <div class="contents write">
                <div class="btn-group btn-right">
                    <button class="btn btn-white" @click="fnDownlaod(list.job_type)"><svg class="icon"><use xlink:href="/img/symbol-defs.svg#icon-download"></use></svg>다운로드</button>
                    <button class="btn btn-purple" @click="fnPrint('viewDiv3')"><svg class="icon"><use xlink:href="/img/symbol-defs.svg#icon-print"></use></svg>인쇄</button>
                </div>
                <div class="print_page contents" id="viewDiv3">
                    <div class="print_title">
                        <div class="logo">
                            <div class="logo_img"><img src="/img/logo.png" alt="GS네오텍 로고"></div>
                            <span>스마트 <strong>안전보건</strong> 솔루션</span>
                        </div>
                        <p>밀폐공간작업 승인 허가서</p>
                    </div>
                    <div>
                        <h3>밀폐공간작업 승인 허가서</h3>
                        <table class="table horizontal">
                            <caption>밀폐공간작업 승인 허가서 등록</caption>
                            <tbody>
                                <tr>
                                    <th scope="rowgroup" rowspan="3" class="w100"><label>신청인</label></th>
                                    <th scope="row" class="th2 w100"><label>소속</label></th>
                                    <td></td>
                                </tr>
                                <tr>
                                    <th scope="row" class="th2"><label>직책</label></th>
                                    <td>{{ list.jbttl_nm }}</td>
                                </tr>
                                <tr>
                                    <th scope="row" class="th2"><label>성명</label></th>
                                    <td>{{ list.wrtr_nm }}</td>
                                </tr>
                                <tr>
                                    <th scope="row" colspan="2"><label>작업일시</label></th>
                                    <td>{{ list.job_bgng_day }}</td>
                                </tr>
                                <tr>
                                    <th scope="row" colspan="2"><label>작업내용</label></th>
                                    <td>{{ list.job_cn }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div>
                        <h3>출입자(투입근로자)</h3>
                        <table class="table">
                            <caption>출입자(투입근로자)</caption>
                            <thead>
                                <tr>
                                    <th scope="col">소속</th>
                                    <th scope="col">성명</th>
                                    <th scope="col">안전교육 이수여부</th>
                                    <th scope="col">서명</th>
                                    <th scope="col">소속</th>
                                    <th scope="col">성명</th>
                                    <th scope="col">안전교육 이수여부</th>
                                    <th scope="col">서명</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(item,i) in clist" :key="item">
                                    <template v-if="i%2==0">
                                        <td>{{ item.belong_nm }}</td>
                                        <td>{{ item.cgpn_nm }}</td>
                                        <td>{{ item.safe_edu_dt }}</td>
                                        <td><img :src="item.cgpn_sign" class="sign_img"></td>

                                        <td v-if="i < clist.length - 1">{{ clist[i+1].belong_nm }}</td>
                                        <td v-else></td>
                                        <td v-if="i < clist.length - 1">{{ clist[i+1].cgpn_nm }}</td>
                                        <td v-else></td>
                                        <td v-if="i < clist.length - 1">{{ clist[i+1].safe_edu_dt }}</td>
                                        <td v-else></td>
                                        <td v-if="i < clist.length - 1"><img :src="clist[i+1].cgpn_sign" class="sign_img"></td>
                                        <td v-else></td>
                                    </template>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div>
                        <h3>안전조치 요구사항</h3>
                        <table class="table">
                            <caption>안전조치 요구사항</caption>
                            <thead>
                                <tr>
                                    <th scope="col">확인항목</th>
                                    <th scope="col">조치여부</th>
                                    <th scope="col">조치여부 확인</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td class="text-left">1. 안전담당자 지정 및 감시인 배치</td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td class="text-left">2. 산소농도 (계속)측정</td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td class="text-left">3. 환기시설 설치</td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td class="text-left">4. 전화 및 무선기기 구비</td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td class="text-left">5. 소화기 비치</td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td class="text-left">6. 안전장구 구비</td>
                                    <td></td>
                                    <td></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div>
                        <h3>산소농도 측정결과</h3>
                        <table class="table">
                            <caption>산소농도 측정결과</caption>
                            <thead>
                                <tr>
                                    <th scope="col" class="w50">순번</th>
                                    <th scope="col">산소측정농도</th>
                                    <th scope="col">측정시간</th>
                                    <th scope="col">측정자</th>
                                    <th scope="col">측정자 확인</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td class="text-center">1</td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td class="text-center">2</td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td class="text-center">3</td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td class="text-center">4</td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td class="text-center">5</td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td class="text-center">6</td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div class="print_footer">
                        <p>위 기재 내용의 작업을 작성된 조건 및 관리 하에서만 허가함</p>
                        <p class="date">
                            <span>2023</span>년
                            <span></span>월
                            <span></span>일
                        </p>
                        <p>최종허가자<span></span>(인)</p>
                    </div>
                </div>
            </div>
        </template>
    </div>
</template>
    <script>
        import "es6-promise/auto";
        import Vue from "vue";
        import Axios from "axios";
        import dept from "../../popup/dept_popup.vue";
        import fileform from "../../fileform.vue";
        import board from "../../../../common/js/board";
        import printJS from 'print-js';
        import { scale } from 'ol/size';
        import Eventbus from "../../../../common/js/eventbus.js";
        
        export default {
            data: function() {
                return {
                    list:[],
                    flist:[],
                    clist:[],
                    hide:true,
                    job_rpmsn_sn:"",
                    job_type_no:"",
                    viewModel: {
                        scenario: {},
                        user: {},
                        filelist: [],
                        fileGroup: '',
                        deletefileList: [],
                    }
                };
            },
            mounted: function() {
                let vm = this;
                Eventbus.$on('pdf-download',function(job_rpmsn_sn,job_type_no){
                    vm.job_rpmsn_sn = job_rpmsn_sn;
                    vm.job_type_no = job_type_no;

                    vm.fnDetail(vm.job_rpmsn_sn);

                })
                
                
            },
            beforeDestroy(){
                Eventbus.$off('pdf-download');
            },
            methods: {
                fnDetail: function(job_rpmsn_sn){
                    let vm = this;
                    let send = {
                        job_rpmsn_sn: job_rpmsn_sn,
                        job_type:vm.job_type_no, 
                    };

                    Axios.post("/detailwkPmsList.do",send).then(function(rs) {
                        vm.list = rs.data.detail[0];
                        // console.log(vm.list.wrtr_sign);
                        
                        if(vm.job_type_no =='2'){
                            vm.flist = rs.data.fdetail[0];
                            // console.log(vm.flist);
                        }else if(vm.job_type_no =='3'){
                            vm.clist = rs.data.cdetail;
                            // console.log(vm.clist);
                        }

                        vm.$nextTick(function() { 
                            vm.fnDownlaod(vm.job_type_no);
                        });
                        
                    });
                    
                },
                fnFileDown:function(item){
                    let vm = this;
                    let send = {
                        menu_se: item.menu_se,
                        sn: item.sn,
                        file_sn: item.file_sn,
                        gbn:'rawWk'
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
                fnPrint : function(divName){
                    try{
                        printJS({
                            printable:divName,
                            type:'html',
                            css: ['/css/basic.css','/css/print.css'],
                            scanStyles : false,
                        });
                    }catch(ex){
                        console.log(ex);
                        alert("서명 이미지를 확인해주세요.");
                    }
                  
                },
                fnDownlaod: function(job_type){
                    let vm = this;
                    
                    let doc = new jsPDF('p', 'mm','a4');
                    html2canvas($('#viewDiv'+job_type)[0],{scale:2}).then(function(canvas) {
                        let imgData = canvas.toDataURL('image/jpeg');
                        var pageWidth = doc.internal.pageSize.width; 
                        var pageHeight = doc.internal.pageSize.height; 
                        var imageWidth = pageWidth - 20; 
                        var imageHeight = (imageWidth / canvas.width) * canvas.height;
                        doc.addImage(imgData, 'JPEG', 10, 10, imageWidth, imageHeight);

                        doc.save('('+vm.list.job_type_no+').pdf');   
                    });

                
                },
                fnDownreturn(){
                    return this.$refs.viewDiv1;
                }
            }
        };
    </script>
    