<template>
<main class="site_main" style="padding: 0">
    <div class="wrap">
        <div class="login join">
            <div class="box">
                <h1 class="logo">
                    <div class="logo_img"><img src="/img/logo.png" alt="GS네오텍 로고"></div>
                    <span>스마트 <strong>안전보건</strong> 솔루션</span>
                </h1>
                <ul class="bar_step">
                    <li class="on"><button id="safe"><span class="hidden">안전교육 및 서약서</span></button></li>
                    <li><button id="info"><span class="hidden">개인정보처리 동의서</span></button></li>
                    <li><button id="join"><span class="hidden">회원가입 </span></button></li>
                    <li><button id="complete"><span class="hidden">완료</span></button></li>
                </ul>
                <!-- 안전교육 및 서약서 -->
                <div class="jointab" id="safe" style="display: block;">
                    <h2>안전교육 및 서약서</h2>
                    <ul class="contents">
                        <li>
                            <input type="checkbox" class="chk_safe" id="j01" name="safeChk" hidden="">
                            <label for="j01">
                                <svg class="icon">
                                    <use xlink:href="../img/symbol-defs.svg#icon-check-circle"></use>
                                </svg>
                                모두 동의합니다.
                            </label>
                            <p>
                                전체 동의는 필수 및 선택정보에 동의도 포함되어 있으며, 개별적으로도 동의를 선택하실 수 있습니다. <br>
                                선택항목에 대한 동의를 거부하시는 경우에도 솔루션 이용이 가능합니다. ( 내용 확인 필요 )
                            </p>
                        </li>
                        <li>
                            <input type="checkbox" class="chk_safe" id="j02" hidden="" checked>
                            <label for="j02">
                                <svg class="icon">
                                    <use xlink:href="../img/symbol-defs.svg#icon-check-circle"></use>
                                </svg>
                                교육내용 및 물질안전보건자료에 관한 사항
                            </label>
                            <ul class="box bl_dot overflow-y">
                                <li>산업안전 및 사고 예방에 관한 사항</li>
                                <li>산업보건 및 직업병 예방에 관한 사항</li>
                                <li>산업안전보건볍령 및 산업재해보상보험 제도에 관한 사항</li>
                                <li>직무스트레스 예방 및 관리에 관한 사항</li>
                                <li>직장 내 괴롭힘, 폭언 등으로 인한 건강재해 예방 및 관리 사항</li>
                                <li>직무스트레스 예방 및 관리에 관한 사항</li>
                                <li>직장 내 괴롭힘, 폭언 등으로 인한 건강재해 예방 및 관리 사항</li>
                                <li>직무스트레스 예방 및 관리에 관한 사항</li>
                                <li>직장 내 괴롭힘, 폭언 등으로 인한 건강재해 예방 및 관리 사항</li>
                            </ul>
                        </li>
                        <li>
                            <input type="checkbox" class="chk_safe" id="j03" hidden="">
                            <label for="j03">
                                <svg class="icon">
                                    <use xlink:href="../img/symbol-defs.svg#icon-check-circle"></use>
                                </svg>
                                특별교육대상 (40가지 )
                            </label>
                            <p class="box overflow-y">
                                금속의 용접용단 / 밀폐장소 내 용접 / 화학크내부 / 맨홀작업 / 1T이상 크레인 / 75V+ 정전 활선 / 2이상 굴착 / 동바리 조립해체 / 운반/하역기계 5대 이상 비계 조립 해체 / TIC설치상승/해체 / 밀폐공간 / TC신호수 / 가연물 주변 화재위험 / 흙막이 지보공의 보강 및 동바리 설치/해체 / 게이지 압력 1kg 이상 압력용기 / 방사선 <br>
                                [주요 항목 외]<br>
                                고압실 내, 폭발성 물질 취급, 인화/폭발성 가스 취급, 교반기, 추풀기 사용/세척, 호퍼/저장크 내부, 건조작업 집자장치, 프레스기계 5대 이상 보유, 목재가공용기계 5대 이상,
                                주물 및 단조, 콘크리트 파쇄작업(2M이상)
                                터널 굴착 작업, 암석의 굴착작업(높이2M이상), 로봇작업, 선박에 짐을 취급. 건축물 골조 조립 해제,보일러설치 높이2M이상 쌓거나 무너뜨리는 작업(하역기계작업 제외), 처마높이 5M이상 건축물의 부재 조립, 콘크리트 인공구조물 해체 파괴, 석면해체 제거, 유해물질 제조/취급
                            </p>
                        </li>
                        <li>
                            <input type="checkbox" class="chk_safe" id="j04" hidden="">
                            <label for="j04">
                                <svg class="icon">
                                    <use xlink:href="../img/symbol-defs.svg#icon-check-circle"></use>
                                </svg>
                                <p>
                                    GS Neotek 현장에서 신규채용 및 특별교육을 2시간 이수하였고,현장 근무 중 안전사항을 철저히 준수함은 물론 회사가 실시하는 안전활동에 적극 참여하여 재해예방에 적극 협조하겠으며, 본인의 과실 및 서약사항 위반으로 인한 재해발생 시 산재보험법상 보상 이외 민.형사상의 제반 책임을 묻지 않을 것을 확인하며, 아래사항은 반드시 지킬 것을 서약합니다. <br>
                                    - 아래-<br>
                                    1. 작업장에서 지급된 개인보호구(안전도, 안전화, 안전벨트, 보안경, 마스크 등)는 반드시 착용한다.<br>
                                    2. 회사가 실시하는 안전보건교육 및 위험예지활동(TBM)에 솔선수범하여 참여한다.<br>
                                    3. 작업 전 안전 확인 및 파악된 위험요소는 반드시 제거 후 작업에 임한다.<br>
                                    4. 안전교육 내용 및 서약사항에 대하여 3회(단, 중요한 사항은 1회) 위반 시 회사의 어떠한 조치도 감수한다.
                                </p>
                            </label>
                        </li>
                    </ul>
                    <button class="btn btn-large btn-purple next" id="safe"><svg class="icon">
                            <use xlink:href="../img/symbol-defs.svg#icon-task-alt"></use>
                        </svg>다음</button>
                </div>
                <!-- 개인정보처리 동의서 -->
                <div class="jointab" id="info" style="display: none;">
                    <h2>개인정보처리 동의서</h2>
                    <ul class="contents">
                        <li>
                            <input type="checkbox" class="chk_info" name="infoChk" id="j05" hidden="">
                            <label for="j05">
                                <svg class="icon">
                                    <use xlink:href="../img/symbol-defs.svg#icon-check-circle"></use>
                                </svg>
                                모두 동의합니다.
                            </label>
                            <p>
                                전체 동의는 필수 및 선택정보에 동의도 포함되어 있으며, 개별적으로도 동의를 선택하실 수 있습니다. <br>
                                선택항목에 대한 동의를 거부하시는 경우에도 솔루션 이용이 가능합니다. ( 내용 확인 필요 )
                            </p>
                        </li>
                        <li>
                            <input type="checkbox" class="chk_info" id="j06" hidden="" checked>
                            <label for="j06">
                                <svg class="icon">
                                    <use xlink:href="../img/symbol-defs.svg#icon-check-circle"></use>
                                </svg>
                                [필수] 스마트 안전보건 솔루션 계정 약관
                            </label>
                            <p class="box overflow-y">
                                GS네오텍㈜(이하 “회사”)는 정보주체의 자유와 권리 보호를 위해 「개인정보 보호법」 및 관계 법령이 정한 바를 준수하여, 적법하게 개인정보를 처리하고 안전하게 관리하고
                                있습니다. 이에 「개인정보 보호법」 제30조에 따라 정보주체에게 개인정보 처리에 관한 절차 및 기준을 안내하고, 이와 관련한 고충을 신속하고 원활하게 처리할 수 있도록 하기 위하여 다음과 같이 개인정보 처리방침을 수립·공개합니다. <br>
                                회사는 개인정보처리방침을 개정하는 경우 공지사항(또는 개별공지)을 통하여 공지할 것입니다. <br>
                                ○ 본 방침은 2023년 05월 01일부터 시행됩니다.
                            </p>
                        </li>
                        <li>
                            <input type="checkbox" class="chk_info" id="j07" hidden="">
                            <label for="j07">
                                <svg class="icon">
                                    <use xlink:href="../img/symbol-defs.svg#icon-check-circle"></use>
                                </svg>
                                [필수] 개인정보 수집 및 이용 동의
                            </label>
                            <p class="box overflow-y">
                                가. 회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보처리와 관련한 정보주체의 불만처리 및 피해구제 등을 위하여 아래와 같이 개인정보보호책임자를 지정하고 있습니다. <br>
                                나. 정보주체는 「개인정보 보호법」 제35조에 따른 개인정보의 열람 청구를 아래의 부서에 할 수 있습니다. 회사는 정보주체의 개인정보 열람청구가 신속하게 처리되도록 노력하겠습니다.<br>
                                다. 정보주체는 회사의 서비스를 이용하시면서 발생한 모든 개인정보보호 관련 문의, 불만처리, 피해구제 등에 관한 사항을 개인정보 보호책임자 및 담당부서로 문의할 수 있습니다. 회사는 정보주체의 문의에 대해 지체없이 답변 및 처리해드릴 것입니다.
                            </p>
                        </li>
                        <li>
                            <input type="checkbox" class="chk_info" id="j08" hidden="">
                            <label for="j08">
                                <svg class="icon">
                                    <use xlink:href="../img/symbol-defs.svg#icon-check-circle"></use>
                                </svg>
                                [필수] 스마트 안전보건 솔루션 메시지 알림 및 메일 수신
                            </label>
                            <p class="box overflow-y">
                                회사가 제공하는 회사가 정보를 메시지로 받습니다. 스마트 안전보건 솔루션 알림 카테고리의 종사자 의견청취 대한민국 휴대전화번호를 등록하여 인증한 사용자에게 추가되며스마트 안전보건 솔루션 알림은 휴대전화번호로 변경하여도 자동으로 삭제되지 않고 유지됩니다. <br>
                                본 동의를 한 한 사용는 자동으로 메시지 또는 메일을 수신할 수 있게 됩니다. <br>
                                만약 사용자가 앞으로 알림 또는 메일 등 더 이상 수신을 원하지 않을 경우, [스마트 안전보건 솔루션 > 설정 > 내 개인정보 관리] 혹은 나의 정보관리 에서 본 동의를 철회할 수 있습니다.
                            </p>
                        </li>
                    </ul>
                    <button class="btn btn-large btn-purple next" id="info"><svg class="icon">
                            <use xlink:href="../img/symbol-defs.svg#icon-task-alt"></use>
                        </svg>다음</button>
                </div>
                <!-- 회원가입 -->
                <div class="jointab" id="join" style="display: none;">
                    <h2>회원가입</h2>
                    <div class="contents">
                        <div>
                            <h3>기본정보</h3>
                            <table class="table horizontal write">
                                <caption>기본정보</caption>
                                <tbody>
                                    <tr>
                                        <th scope="row" class="w150"><label for="user_id">아이디(ID)</label></th>
                                        <td colspan="3">
                                            <div class="input_group">
                                                <input type="text" id="user_id" name="user_id" title="아이디" value="" placeholder="아이디 입력" @change="fninputIdChk()" v-model="viewModel.data.user_id" @input="fnTrim();">
                                                <button class="btn btn-white" id="id_check_sucess"><svg class="icon">
                                                        <use xlink:href="../img/symbol-defs.svg#icon-search"></use>
                                                    </svg>중복확인</button>
                                                <input type="text" id="idCheck" value="uncheck" hidden title="아이디 확인">
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th scope="row"><label for="birth">생년월일(8자리)</label></th>
                                        <td>
                                            <div class="datepicker_box">
                                                <input type="text" id="birth" name="birth" title="생년월일" placeholder="YYYYMMDD" v-model="viewModel.data.birth" @input="fnTrim('B');" maxlength="8">
                                            </div>
                                        </td>
                                        <th scope="row" class="w150"><label for="jncmp_day">입사일자</label></th>
                                        <td>
                                            <div class="datepicker_box">
                                                <input type="text" id="jncmp_day" name="jncmp_day" class="datepicker" title="입사일자" disabled>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th scope="row"><label for="bplc_sn">현장</label></th>
                                        <td>
                                            <div class="input_group input_btn">
                                                <input type="text" id="bplc_nm" name="bplc_nm" title="현장" placeholder="현장을 선택해주세요." v-model="viewModel.data.bplc_nm" disabled>
                                                <input type="text" id="bplc_sn" name="bplc_sn" v-model="viewModel.data.bplc_sn" hidden>
                                                <button @click="fnBplcPopup();"><svg class="icon">
                                                        <use xlink:href="../img/symbol-defs.svg#icon-search"></use>
                                                    </svg></button>
                                            </div>
                                        </td>
                                        <th scope="row"><label for="user_nm">성명</label></th>
                                        <td><input type="text" id="user_nm" name="user_nm" title="성명" placeholder="입력해주세요." v-model="viewModel.data.user_nm"></td>
                                    </tr>
                                    <tr>
                                        <th scope="row"><label for="ocpt_nm">직종</label></th>
                                        <td>
                                            <div class="input_group input_btn">
                                                <input type="text" id="ocpt_nm" name="ocpt_nm" title="직종" placeholder="직종을 선택해주세요." v-model="viewModel.data.ocpt_nm" disabled>
                                                <input type="text" id="ocpt_sn" name="ocpt_sn" title="직종" placeholder="직종을 선택해주세요." hidden v-model="viewModel.data.ocpt_sn">
                                                <button @click="fnOcptPopup();"><svg class="icon">
                                                        <use xlink:href="../img/symbol-defs.svg#icon-search"></use>
                                                    </svg></button>
                                            </div>
                                        </td>
                                        <th scope="row"><label for="phone">휴대폰번호</label></th>
                                        <td><input type="text" id="phone" name="phone" title="휴대폰" placeholder="휴대폰번호를 입력해주세요." @input="formatPhoneNumber($event)"></td>
                                        <!-- <th scope="row"><label for="">직책</label></th>
                                        <td>
                                            <div class="input_group input_btn">
                                                <input type="text" id="" name="jbttl_nm" title="직책" placeholder="직책을 선택해주세요." >
                                                <input type="text" id="" name="jbttl_sn" title="직책" placeholder="직책을 선택해주세요." hidden>
                                                <button @click="fnBplcPopup();"><svg class="icon">
                                                        <use xlink:href="../img/symbol-defs.svg#icon-search"></use>
                                                    </svg></button>
                                            </div>
                                        </td> -->
                                    </tr>
                                    <!-- <tr>
                                        <th scope="row"><label for="">주소</label></th>
                                        <td colspan="3">
                                            <div class="input_group input_btn">
                                                <input type="text" id="user_addr" name="user_addr" title="주소" value="" placeholder="주소입력" v-model="viewModel.data.addr">
                                            </div>
                                        </td>
                                    </tr> -->
                                    <tr>
                                        <th scope="row"><label for="user_addr">주소</label></th>
                                        <td>
                                            <div class="input_group input_btn">
                                                <input type="text" id="user_addr" title="주소" placeholder="예) 종로구 사직로 161" v-model="viewModel.data.addr" disabled>
                                                <button @click="daumApi()"><svg class="icon">
                                                        <use xlink:href="/img/symbol-defs.svg#icon-search"></use>
                                                    </svg></button>
                                            </div>
                                        </td>
                                        <!-- <td><input type="text" id="user_addr" title="주소" placeholder="예) 종로구 사직로 161" v-model="viewModel.user_addr" disabled></td> -->
                                        <th scope="row"><label for="user_detail_addr">상세주소</label></th>
                                        <td><input type="text" id="user_detail_addr" title="상세주소" v-model="viewModel.data.detail_addr" placeholder="예) 101동 101호"></td>
                                    </tr>
                                    <tr>
                                        <th scope="row"><label for="user_eml">이메일</label></th>
                                        <td colspan="3">
                                            <div class="input_group">
                                                <input type="text" id="user_eml" name="user_eml" title="이메일" placeholder="이메일을 입력해주세요" oninput="this.value = this.value.replace(' ', '');">
                                                <label for="">@</label>
                                                <input type="text" id="user_eml2" name="user_eml2" title="이메일 도메인" oninput="this.value = this.value.replace(' ', '');">
                                                <select @change="emlChange" id="emlSelect" title="이메일 도메인 선택">
                                                    <option value="type">직접입력</option>
                                                    <option value="naver.com">naver.com</option>
                                                    <option value="google.com">google.com</option>
                                                    <option value="hanmail.com">hanmail.net</option>
                                                    <option value="nate.com">nate.com</option>
                                                    <option value="daum.com">daum.com</option>
                                                    <option value="kakao.com">kakao.com</option>
                                                </select>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th scope="row"><label for="">비상연락처</label></th>
                                        <td colspan="3">
                                            <div class="input_group input_btn">
                                                <input type="text" id="user_emgRel" name="user_emgRel" title="관계" value="" placeholder="관계">
                                                <input type="text" id="user_emgNm" name="user_emgNm" title="성명" value="" placeholder="성명">
                                                <input type="text" id="user_emgCttpc" name="user_emgCttpc" title="연락처" value="" placeholder="연락처" @input="formatPhoneNumber($event)">
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div>
                            <h3>건강</h3>
                            <table class="table horizontal write">
                                <caption>건강</caption>
                                <tbody>
                                    <tr>
                                        <th scope="row" class="w150"><label for="height">신장</label></th>
                                        <td>
                                            <div class="unit_box">
                                                <input class="text-right" type="text" id="height" title="신장" placeholder="입력해주세요. " v-model="viewModel.data.height" @input="fnTrim('H');">
                                                <span class="unit">cm</span>
                                            </div>
                                        </td>
                                        <th scope="row" class="w150"><label for="weight">체중</label></th>
                                        <td>
                                            <div class="unit_box">
                                                <input class="text-right" type="text" id="weight" title="체중" placeholder="입력해주세요." v-model="viewModel.data.weight" @input="fnTrim('W');">
                                                <span class="unit">kg</span>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th scope="row"><label for="bdp">혈액형</label></th>
                                        <td>
                                            <div class="unit_box">
                                                <select id="bdp" title="혈액형">
                                                    <option disabled value="none" selected>혈액형 선택</option>
                                                    <option value="Rh+O">O형</option>
                                                    <option value="Rh+A">A형</option>
                                                    <option value="Rh+B">B형</option>
                                                    <option value="Rh+AB">AB형</option>
                                                    <option value="Rh-O">Rh-O형</option>
                                                    <option value="Rh-A">Rh-A형</option>
                                                    <option value="Rh-B">Rh-B형</option>
                                                    <option value="Rh-AB">Rh-AB형</option>
                                                </select>
                                                <!-- <input class="text-right" type="text" id="bdp" title="혈액형" placeholder="입력해주세요" oninput="handleOnInput(this)" v-model="viewModel.data.bdp">
                                                <span class="unit">형</span> -->
                                            </div>
                                        </td>
                                        <th scope="row"><label for="">혈압 및 약 복용</label></th>
                                        <td>
                                            <label for="medicineY"><input type="radio" name="medicine" id="medicineY">Y</label>
                                            <label for="medicineN"><input type="radio" name="medicine" id="medicineN" checked>N</label>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th scope="row"><label for="smkng_qy">담배<sub>- 선택입력</sub></label></th>
                                        <td>
                                            <div class="unit_box">
                                                <label for="">하루:</label>
                                                <input class="text-right" type="number" id="smkng_qy" title="흡연량" placeholder="입력해주세요" v-model="viewModel.data.smkng_qy">
                                                <span class="unit">갑</span>
                                            </div>
                                        </td>
                                        <th scope="row"><label for="">음주<sub>- 선택입력</sub></label></th>
                                        <td>
                                            <div class="input_group">
                                                <div class="unit_box">
                                                    <label for="">주:</label>
                                                    <input class="text-right" type="number" id="" title="횟수" placeholder="입력" v-model="viewModel.data.drnkg_nmtm">
                                                    <span class="unit">회</span>
                                                </div>
                                                <span>/ 주량</span>
                                                <div class="unit_box">
                                                    <label for="">소주:</label>
                                                    <input class="text-right" type="number" id="" title="갯수" placeholder="입력" v-model="viewModel.data.drnkg_qy">
                                                    <span class="unit">병</span>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th scope="row"><label for="">질병사항</label></th>
                                        <td colspan="3">
                                            <ul>
                                                <li class="input_group bl_dot">
                                                    <label for="glycsr">당뇨<input type="checkbox" id="glycsr" v-model="viewModel.data.glycsr"></label>
                                                    <label for="crdvsc">고혈압<input type="checkbox" id="crdvsc" v-model="viewModel.data.crdvsc"></label>
                                                    <label for="lumbar_disk">요추 디스크<input type="checkbox" id="lumbar_disk" v-model="viewModel.data.lumbar_disk"></label>
                                                    <label for="cervical_disk">경추 디스크<input type="checkbox" id="cervical_disk" v-model="viewModel.data.cervical_disk"></label>
                                                </li>
                                                <li class="input_group bl_dot">
                                                    <label>
                                                        과거 산재, 교통사고 유무
                                                        <label for="accidentY"><input type="radio" name="accident" id="accidentY">Y</label>
                                                        <label for="accidentN"><input type="radio" name="accident" id="accidentN" checked>N</label>
                                                    </label>
                                                </li>
                                                <li class="input_group bl_dot" v-show="viewModel.data.accident == 'Y'">
                                                    <label for="">
                                                        년도
                                                        <select id="selYear" title="년도선택">
                                                            <option disabled value="none" selected>선택</option>
                                                            <option v-for="(item, index) in yyyyList" :key="index" :value="item.value">
                                                                {{ item.text }}
                                                            </option>
                                                        </select>
                                                    </label>
                                                    <label for="inj_nm">부상명<input type="text" id="inj_nm" placeholder="입력" v-model="viewModel.data.inj_nm"></label>

                                                </li>
                                                <li class="input_group bl_dot" v-show="viewModel.data.accident == 'Y'">
                                                    <label for="">
                                                        치료기간
                                                        <div class="datepicker_box">
                                                            <input type="text" class="datepicker" id="inj_mdlrt_bgng_dt" title="시작일" v-model="viewModel.data.inj_mdlrt_bgng_dt" disabled>
                                                        </div>
                                                        <label for="">~</label>
                                                        <div class="datepicker_box">
                                                            <input type="text" class="datepicker" id="inj_mdlrt_end_dt" title="종료일" v-model="viewModel.data.inj_mdlrt_end_dt" disabled>
                                                        </div>
                                                    </label>
                                                </li>
                                                <li class="input_group bl_dot">
                                                    <label for="health_fact_idnty_yn">확인<em>건강관리 목적으로, 위 사실이 허위인 경우 회사의 어떠한 조치도 감수하겠습니다.</em><input type="checkbox" id="health_fact_idnty_yn"></label>
                                                </li>
                                            </ul>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div>
                            <h3>보호구 지급</h3>
                            <table class="table horizontal write">
                                <caption>보호구 지급</caption>
                                <tbody>
                                    <tr>
                                        <th scope="row" class="w150"><label for="safety_helmet">안전모</label></th>
                                        <td><input type="checkbox" id="safety_helmet"></td>
                                        <th scope="row" class="w150"><label for="safety_shoe">안전화</label></th>
                                        <td><input type="checkbox" id="safety_shoe"></td>
                                    </tr>
                                    <tr>
                                        <th scope="row"><label for="safety_belt">안전대(벨트)</label></th>
                                        <td><input type="checkbox" id="safety_belt"></td>
                                        <th scope="row"><label for="mask1">마스크</label></th>
                                        <td><input type="checkbox" id="mask1"></td>
                                    </tr>
                                    <tr>
                                        <th scope="row"><label for="etc_gaiters">기타(각반)</label></th>
                                        <td colspan="3"><input type="checkbox" id="etc_gaiters"></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div>
                            <h3>프로필사진</h3>
                            <div>
                                <label>사진등록여부</label>
                                <label for="profileImgY"><input type="radio" name="profileImg" id="profileImgY">Y</label>
                                <label for="profileImgN"><input type="radio" name="profileImg" id="profileImgN" checked>N</label>
                            </div>
                            <table class="table horizontal write" v-show="viewModel.data.profileImg == 'Y'">
                                <caption>프로필사진</caption>
                                <tbody>
                                    <tr>
                                        <th scope="row"><label for="">프로필 사진등록</label></th>
                                        <td>
                                            <imgfileform @filelist="fnImgFilelist" :pass="{id:'join'}" ref="imgfile"></imgfileform>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div>
                            <h3>서명등록
                            </h3>
                            <div class="sign_box">
                                <signature :ref="'signature'"></signature>

                            </div>
                        </div>

                    </div>
                    <button @click="fnSave" class="btn btn-large btn-purple next" id="join"><svg class="icon">
                            <use xlink:href="../img/symbol-defs.svg#icon-task-alt"></use>
                        </svg>회원가입</button>
                </div>
                <!-- 완료 -->
                <div class="jointab" id="complete" style="display: none;">
                    <h2>회원가입</h2>
                    <div class="wrap contents">
                        <ul>
                            <li>환영 합니다!</li>
                            <li>스마트 안전보건 솔루션 가입이 완료되었습니다.</li>
                            <li><label for="">ID : {{ viewModel.data.user_id }} / PW : 초기비밀번호는 생년월일입니다. ex) 900101</label></li>
                            <li>GS Neotek 스마트 안전보건 솔루션 모든 서비스를 이용할 수 있습니다.</li>
                        </ul>
                        <img src="/img/join.png" alt="회원가입 완료">
                        <button class="btn btn-large btn-purple complete"><svg class="icon">
                                <use xlink:href="../img/symbol-defs.svg#icon-start"></use>
                            </svg>시작하기</button>
                    </div>
                </div>
                <footer> © NOAA SNC. &amp; UlsanSafety All Rights Reserved.</footer>
            </div>
        </div>
    </div>
    <bplc ref="bplc" v-if="bplcPop==true"></bplc>
    <ocpt ref="ocpt" v-if="ocptPop==true"></ocpt>
</main>
</template>

<script>
import "es6-promise/auto";
import Vue from "vue";
import Axios from "axios";
import bplc from "../popup/bplc_popup2.vue";
import ocpt from "../popup/ocpt_popup.vue";
import signature from "../../../common/vue/signature.vue";
import formValidation from "../../../common/js/fromValidation";
import imgfileform from '../../../common/vue/imgfileform.vue';
import Message, {
    messageUtil
} from "../../../common/js/message";
Vue.config.devtools = true;

export default {
    data: function () {
        return {
            drawYn: false,
            bplcPop: false,
            ocptPop: false,
            user: [],
            yyyyList: [],
            viewModel: {
                img_filelist: [],
                imgfileGroup: '',
                list: {},
                user_eml: "",
                data: {
                    accident: "N",
                    medicine: "N",
                    profileImg: "N",
                    bplc_sn: '',
                    bplc_nm: '',
                    addr: '',
                    phone : '',
                },
            }
        };
    },
    components: {
        'bplc': bplc,
        'signature': signature,
        'ocpt': ocpt,
        'imgfileform': imgfileform,
    },
    mounted: function () {
        let vm = this;
        $("input[name='accident']").on("click", function () {
            if ($(this).attr("id") == "accidentY") {
                vm.viewModel.data.accident = "Y";
            } else {
                vm.viewModel.data.accident = "N";
            }
        });
        $("input[name='medicine']").on("click", function () {
            if ($(this).attr("id") == "medicineY") {
                vm.viewModel.data.medicine = "Y";
            } else {
                vm.viewModel.data.medicine = "N";
            }
        });
        $("input[name='profileImg']").on("click", function () {
            if ($(this).attr("id") == "profileImgY") {
                vm.viewModel.data.profileImg = "Y";
            } else {
                vm.viewModel.data.profileImg = "N";
            }
        });
        vm.createdYear();
    },
    methods: {
        fnBplcPopup: function () {
            let vm = this;
            vm.bplcPop = true;
            vm.ocptPop = false;
            vm.$nextTick(function () {
                if (vm.bplcPop) {
                    vm.$refs.bplc.fnInit();
                }
            })
        },
        fnOcptPopup: function () {
            let vm = this;
            vm.ocptPop = true;
            vm.bplcPop = false;
            vm.$nextTick(function () {
                if (vm.ocptPop) {
                    vm.$refs.ocpt.fnInit();
                }
            })
        },
        fnSave: function () {
            let vt = this;
            let vm = this.viewModel;
            let safety_helmet;
            let safety_shoe;
            let safety_belt;
            let mask;
            let etc_gaiters;
            let atent_trgt_yn = 'N';
            let atent_info = '';
            if (vt.fnAge($("#birth").val()) > 59) {
                atent_trgt_yn = 'Y';
                atent_info = '고령군';
            } else if (vm.data.glycsr && vm.data.crdvsc) {
                atent_trgt_yn = 'Y';
                atent_info = '당뇨/고혈압';
            }
            let user_brdt = $("input#birth").val();
            let birth_pattern = /^(19[0-9][0-9]|20\d{2})(0[0-9]|1[0-2])(0[1-9]|[1-2][0-9]|3[0-1])$/;
            if (!birth_pattern.test(user_brdt)) {
                alert("생년월일 8자리를 정확하게 입력해주세요. \n ex) 19900107");
                $("input#birth").focus();
                return false;
            }
            if($("#user_eml").val() == "" && $("#user_eml2").val() != ""){
                 alert("이메일 형식이 올바르지 않습니다.") ;
                 $("input#user_eml").focus();
                 return false;
            }
            if($("#user_eml2").val() == "" && $("#user_eml").val() != ""){
                alert("이메일 형식이 올바르지 않습니다.") ;
                $("input#user_eml2").focus();
                return false;
            }
            if($("#user_eml").val() == "" && $("#user_eml2").val() == "") vm.user_eml = "";
            if($("#user_eml").val() != "" && $("#user_eml2").val() != "") vm.user_eml = $("#user_eml").val() + "@" + $("#user_eml2").val();
            const valiData = [{
                    id: 'user_id',
                    type: 'input',
                    title: '아이디'
                },
                {
                    id: 'birth',
                    type: 'input',
                    title: '생년월일'
                },
                {
                    id: 'jncmp_day',
                    type: 'input',
                    title: '입사일자'
                },
                {
                    id: 'phone',
                    type: 'input',
                    title: '연락처'
                },
                {
                    id: 'bplc_nm',
                    type: 'input',
                    title: '현장'
                },
                {
                    id: 'user_nm',
                    type: 'input',
                    title: '성명'
                },
                {
                    id: 'ocpt_nm',
                    type: 'input',
                    title: '직종'
                },
                {
                    id: 'user_addr',
                    type: 'input',
                    title: '주소'
                },
                {
                    id: 'height',
                    type: 'input',
                    title: '신장'
                },
                {
                    id: 'weight',
                    type: 'input',
                    title: '체중'
                },
                {
                    id: 'user_emgRel',
                    type: 'input',
                    title: '비상연락처'
                },
                {
                    id: 'user_emgNm',
                    type: 'input',
                    title: '비상연락처'
                },
                {
                    id: 'user_emgCttpc',
                    type: 'input',
                    title: '비상연락처'
                },
            ];

            if (formValidation(valiData)) {
                if (vt.checkYn()) {
                    if (confirm(Message.CREATE_CONFIRM)) {
                        //gs요청사항-서명시 테두리 없이 해달라고 함(23-11-13 수정)
                        $("#signatureCanvas").css("border-color", "white");
                        html2canvas(document.querySelector("#signatureCanvas")).then(canvas => {
                            var myImg = canvas.toDataURL("image/png");
                            Axios.post("/fileupload/sign.do", {
                                    imgSrc: myImg
                                })
                                .then(function (response) {
                                    if (vt.viewModel.imgfileGroup != '') {
                                        const filemapperId = "user.insertUserProfileImg";
                                        vt.$refs.imgfile.fnInsertFile(filemapperId, vm.data.user_id);
                                    };
                                    vt.thumb = response.data.resultMap;
                                    if ($("#health_fact_idnty_yn").prop("checked")) {
                                        vm.data.health_fact_idnty_yn = 'Y'
                                    } else {
                                        vm.data.health_fact_idnty_yn = 'N'
                                    }
                                    if (vm.data.glycsr) {
                                        vm.data.glycsr_yn = 'Y'
                                    } else {
                                        vm.data.glycsr_yn = 'N'
                                    }
                                    if (vm.data.crdvsc) {
                                        vm.data.crdvsc_yn = 'Y'
                                    } else {
                                        vm.data.crdvsc_yn = 'N'
                                    }
                                    if (vm.data.lumbar_disk) {
                                        vm.data.lumbar_disk_yn = 'Y'
                                    } else {
                                        vm.data.lumbar_disk_yn = 'N'
                                    }
                                    if (vm.data.cervical_disk) {
                                        vm.data.cervical_disk_yn = 'Y'
                                    } else {
                                        vm.data.cervical_disk_yn = 'N'
                                    }
                                    if ($("#safety_helmet").prop("checked")) {
                                        safety_helmet = 'Y';
                                    } else {
                                        safety_helmet = 'N';
                                    }
                                    if ($("#safety_shoe").prop("checked")) {
                                        safety_shoe = 'Y';
                                    } else {
                                        safety_shoe = 'N';
                                    }
                                    if ($("#safety_belt").prop("checked")) {
                                        safety_belt = 'Y';
                                    } else {
                                        safety_belt = 'N';
                                    }
                                    if ($("#mask1").prop("checked")) {
                                        mask = 'Y';
                                    } else {
                                        mask = 'N';
                                    }
                                    if ($("#etc_gaiters").prop("checked")) {
                                        etc_gaiters = 'Y';
                                    } else {
                                        etc_gaiters = 'N';
                                    }
                                    if (vm.data.smkng_qy != null && vm.data.smkng_qy != '') {
                                        vm.data.smkng_yn = 'Y'
                                    } else {
                                        vm.data.smkng_yn = 'N'
                                    }

                                    if (vm.data.drnkg_qy != null && vm.data.drnkg_qy != '') {
                                        vm.data.drnkg_yn = 'Y'
                                    } else {
                                        vm.data.drnkg_yn = 'N'
                                    }
                                    let data = {
                                        user_id: vm.data.user_id,
                                        strg_path: vt.thumb.replace(vt.thumb.split('/').reverse()[0], ""),
                                        strg_file_nm: vt.thumb.split('/').reverse()[0],
                                        file_extn: "jpg",
                                        se_file_img: 1,
                                        file_sz: 100,
                                        bplc_sn: vm.data.bplc_sn,
                                        ocpt_se_cd: vm.data.ocpt_se_cd,
                                        ocpt_detail_cd: vm.data.ocpt_sn,
                                        user_cttpc: $("#phone").val(),
                                        user_phone: $("#phone").val(),
                                        age: vt.fnAge($("#birth").val()),
                                        user_nm: vm.data.user_nm,
                                        user_eml: vm.user_eml,
                                        user_addr: vm.data.addr + '|' + vm.data.detail_addr,
                                        password: $("#birth").val().slice(-6),
                                        birth: $("#birth").val(),
                                        jncmp_day: $("#jncmp_day").val(),
                                        health_fact_idnty_yn: vm.data.health_fact_idnty_yn,
                                        height: vm.data.height,
                                        weight: vm.data.weight,
                                        bdp: $("select#bdp").val(),
                                        brssr_medicn_yn: vm.data.medicine,
                                        past_indusac_yn: vm.data.accident,
                                        glycsr_yn: vm.data.glycsr_yn,
                                        crdvsc_yn: vm.data.crdvsc_yn,
                                        lumbar_disk_yn: vm.data.lumbar_disk_yn,
                                        cervical_disk_yn: vm.data.cervical_disk_yn,
                                        inj_year: $("#inj_year").val(),
                                        inj_nm: $("#inj_nm").val(),
                                        inj_mdlrt_bgng_dt: $("#inj_mdlrt_bgng_dt").val(),
                                        inj_mdlrt_end_dt: $("#inj_mdlrt_end_dt").val(),
                                        safety_helmet: safety_helmet,
                                        safety_shoe: safety_shoe,
                                        safety_belt: safety_belt,
                                        mask: mask,
                                        etc_gaiters: etc_gaiters,
                                        smkng_yn: vm.data.smkng_yn,
                                        smkng_qy: vm.data.smkng_qy,
                                        drnkg_yn: vm.data.drnkg_yn,
                                        drnkg_nmtm: vm.data.drnkg_nmtm,
                                        drnkg_qy: vm.data.drnkg_qy,
                                        emgnc_rel: $("#user_emgRel").val(),
                                        emgnc_nm: $("#user_emgNm").val(),
                                        emgnc_phone: $("#user_emgCttpc").val(),
                                        atent_trgt_yn: atent_trgt_yn,
                                        atent_info: atent_info

                                    };
                                    Axios.post("/insertJoinAccount.do", data).then(function (res) {
                                        if (res.data == 0) {
                                            alert(Message.ERROR);
                                        } else {
                                            var index = $("ul.bar_step li.on").index();
                                            var next = index + 1;
                                            $("div.jointab").hide();
                                            $("li.on").removeClass("on");
                                            $("ul.bar_step li:eq(" + next + ")").addClass("on");
                                            $("div.jointab:eq(" + next + ")").show();
                                        }
                                    }).catch(function (ex) {
                                        console.log("error" + ex);
                                    });
                                }).catch(function (ex) {
                                    console.log("fnUpload error" + ex);
                                });
                        });
                    } else {
                        if (message) alert(message);
                    }
                }
            }
        },
        fnBplcAdd: function (item) {
            let vm = this;

            vm.viewModel.data.bplc_sn = item.bplc_sn;
            vm.viewModel.data.bplc_nm = item.bplc_nm;
        },
        fnOcptAdd: function (item) {
            let vm = this;

            vm.viewModel.data.ocpt_se_cd = item.OCPT_SE_CD;
            vm.viewModel.data.ocpt_sn = item.OCPT_DETAIL_CD;
            vm.viewModel.data.ocpt_nm = item.OCPT_DETAIL_NM;
        },
        fninputIdChk() {
            $("input#idCheck").attr("value", "uncheck");
        },
        fnPswdChk: function (pw, pw2) {
            if (pw == pw2) {
                let regPass = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,25}$/;
                if (!regPass.test(pw)) {
                    alert("영문, 숫자, 특수기호 조합으로 8-20자리 이상 입력해주세요.");
                    return false;
                } else {
                    return true;
                }
            } else {
                alert("비밀번호가 다릅니다.");
                $("input#password").focus();
            }
        },
        emlChange: function () {
            let vm = this;
            let eml = $("#emlSelect").val();
            if (eml == "type") {
                $("#user_eml2").removeAttr("disabled");
            } else {
                $("#user_eml2").attr("disabled", "disabled");
                $("#user_eml2").val(eml);
            }
        },
        createdYear: function () {
            const nowYear = new Date().getFullYear();
            for (let i = 0; i < 100; i++) {
                let date = nowYear - i;
                this.yyyyList.push({
                    value: date,
                    text: date
                });
            }
        },
        fnImgFilelist: function (vm) {
            this.viewModel.img_filelist.push(vm.filelist);
            this.viewModel.imgfileGroup = vm.fileGroup;
        },
        checkYn: function () {
            let vm = this;
            if ($("#idCheck").val() == "uncheck") {
                alert("아이디 중복 확인을 해주세요.");
                $("#idCheck").focus();
                return false;
            }

            if ($("#accidentY").prop("checked")) {
                if ($("#selYear").val() == null) {
                    alert("년도를 선택해주세요.");
                    $("#selYear").focus();
                    return false;
                }
                if ($("#inj_nm").val() == "") {
                    alert("부상명을 입력해주세요.");
                    $("#inj_nm").focus();
                    return false;
                }
                if ($("#inj_mdlrt_bgng_dt").val() == "") {
                    alert("치료기간을 선택해주세요.");
                    $("#inj_mdlrt_bgng_dt").focus();
                    return false;
                }
                if ($("#inj_mdlrt_end_dt").val() == "") {
                    alert("치료기간을 선택해주세요.");
                    $("#inj_mdlrt_end_dt").focus();
                    return false;
                }
            }

            if (!$("#health_fact_idnty_yn").prop("checked")) {
                alert("질병사항 확인에 동의해주세요.");
                $("#health_fact_idnty_yn").focus();
                return false;
            }

            if($("select#bdp").val() == "none"){
                alert("혈액형을 선택해 주세요.");
                $("select#bdp").focus();
                return false;
            }

            if (!vm.drawYn) {
                alert("서명을 등록하세요.");
                return false;
            }

            return true;
        },
        daumApi: function () {
            let vm = this;
            new daum.Postcode({
                oncomplete: function (data) {

                    var addr = data.address; // 최종 주소 변수

                    vm.viewModel.data.addr = addr;
                }
            }).open();
        },
        fnAge: function (birth) {
            var date = new Date();
            var year = date.getFullYear();
            var month = (date.getMonth() + 1);
            var day = date.getDate();
            if (month < 10) month = '0' + month;
            if (day < 10) day = '0' + day;
            var monthDay = month + day;
            birth = birth.replace('-', '').replace('-', '');
            var birthdayy = birth.substr(0, 4);
            var birthdaymd = birth.substr(4, 4);
            var age = monthDay < birthdaymd ? year - birthdayy - 1 : year - birthdayy;
            return age;
        },
        formatPhoneNumber(event) {
            let vm = this;
            // 숫자만 남기기
            let numericPhoneNumber = event.target.value.replace(/\D/g, "")
            
            // 길이 제한
            if (numericPhoneNumber.length > 11) {
                numericPhoneNumber = numericPhoneNumber.slice(0, 11);
            }

            // 형식 적용
            if (numericPhoneNumber.length >= 3) {
                numericPhoneNumber = numericPhoneNumber.replace(/(\d{3})(\d{0,4})(\d{0,4})/, (match, p1, p2, p3) => {
                let formattedNumber = p1;
                if (p2) formattedNumber += `-${p2}`;
                if (p3) formattedNumber += `-${p3}`;
                return formattedNumber;
                });
            }

            event.target.value = numericPhoneNumber;
        },
        fnTrim: function(type){
            let vm = this;

            if(type == 'H'){
                vm.viewModel.data.height  = vm.viewModel.data.height.replace(/[^0-9]/g, '').replace(/ /g, '');
            }else if(type == 'W'){
                vm.viewModel.data.weight  = vm.viewModel.data.weight.replace(/[^0-9]/g, '').replace(/ /g, '');
            }else if(type == 'B'){
                $("input#birth").val($("input#birth").val().replace(/[^0-9]/g, '').replace(/ /g, ''));
            }else{
                vm.viewModel.data.user_id = vm.viewModel.data.user_id.replace(/[^a-z0-9]/g, '').replace(/ /g, '');
            }
        }
    }
};
</script>
