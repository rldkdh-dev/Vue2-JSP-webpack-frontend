<template>
<div>
    <div class="contents write">
        <div>
            <h3>현장설정</h3>
            <table class="table horizontal write">
                <caption>현장설정</caption>
                <tbody>
                    <tr>
                        <th scope="row" class="w150"><label for="w0">현장</label></th>
                        <td>
                            <div class="input_group">
                                <select id="set_bplc_sn" v-model="viewModel.bplc_sn" v-if="user.user_roles == 'ROLE_001'">
                                    <option value="0" selected>전체</option>
                                    <option v-for="(item,i) in setBplcList" :key="i" :value="item.BPLC_SN">{{item.BPLC_NM}}</option>
                                </select>
                                <select id="set_bplc_sn" v-model="viewModel.bplc_sn" v-else>
                                    <option v-for="(item,i) in setBplcList" :key="i" :value="item.BPLC_SN">{{item.BPLC_NM}}</option>
                                </select>
                                <button @click="fnBplcSet" class="btn btn-white"><svg class="icon">
                                        <use xlink:href="/img/symbol-defs.svg#icon-settings-application"></use>
                                    </svg>적용</button>
                            </div>
                        </td>
                        
                        <th scope="row" class="w150"><label for="w01">조회현장</label></th>
                        <td>
                            <input type="text" title="현장명" id="bplc_nm" v-model="viewModel.bplc_nm" disabled>
                        </td>
                    </tr>
                    <tr v-if="user.ocpt_se_cd == 'MNG'">
                        <th scope="row"><label for="w01">현장 회원가입 QR</label></th>
                        <td>
                            <qrcode class="w300" v-bind:pass="{bplc_sn:user.bplc_sn, id:'qr'+user.bplc_sn, bplc_nm:user.bplc_nm}"></qrcode>
                        </td>
                    </tr>
                    <tr v-if="(user.bplc_yn == 'Y' && user.ocpt_se_cd == 'MNG') || user.bplc_yn == 'N'">
                        <th scope="row"><label for="w01">로그인화면 QR</label></th>
                        <td>
                            <qrcode class="w300" v-bind:pass="{id:'main_qr'}"></qrcode>
                        </td>
                        <th scope="row" class="w150"><label for="w01">상세직종</label></th>
                        <td>
                            <input type="text" title="직책" id="jbttl_nm" v-model="viewModel.jbttl_nm" disabled v-if="user.user_roles == 'ROLE_001'">
                            <input type="text" title="상세직종" id="ocpt_detail_nm" v-model="viewModel.ocpt_detail_nm" disabled v-if="user.user_roles == 'ROLE_002'">
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div>
            <h3>기본정보</h3>
            <table class="table horizontal write">
                <caption>기본정보</caption>
                <tbody>
                    <tr>
                        <th scope="row" rowspan="5" class="w150">프로필 사진 변경</th>
                        <td rowspan="5" class="w160">
                            <div class="member_info">
                                <div class="member edit">
                                    <input id="profile_img" type="file" accept="*/image" @change="fnUploadImageThumbnail" hidden />
                                    <a @click="profile_img_update">
                                        <div class="member_pic">
                                            <!-- <img :src="user_pic_path" :alt="sessionuser.user_name" onerror="this.src='../../../img/user_no-img.png'"> -->
                                            <img src="/img/user_no-img.png" :alt="sessionuser.user_name" v-if="user_pic_path == '' || user_pic_path == null">
                                            <img :src="user_pic_path" :alt="sessionuser.user_name" style="max-height: 100px;" v-else>
                                        </div>
                                        <!-- <span>

<svg class="icon">

<use xlink:href="/img/symbol-defs.svg#icon-camera"></use>

</svg>

</span> -->
                                    </a>
                                    <button class="btn btn-small btn-white" @click="profile_img_update"><svg class="icon">
                                            <use xlink:href="../../img/symbol-defs.svg#icon-camera"></use>
                                        </svg>내 사진 등록</button>
                                    <button class="btn btn-small btn-white" @click="profile_img_reset"><svg class="icon">
                                            <use xlink:href="../../img/symbol-defs.svg#icon-user-circle"></use>
                                        </svg>기본 이미지로 변경</button>
                                </div>
                            </div>
                        </td>
                        <th scope="row" class="w70"><label for="">아이디</label></th>
                        <td>
                            <input type="text" title="아이디" id="user_id" v-model="viewModel.user_id" disabled>
                        </td>
                        <th scope="row" class="w70"><label for="">생년월일</label></th>
                        <td>
                            <input type="text" title="생년월일" id="user_brdt" v-model="viewModel.user_brdt" readonly>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row"><label for="">비밀번호</label></th>
                        <td>
                            <div class="input_group">
                                <input type="password" title="비밀번호" id="user_pwd" placeholder="비밀번호 변경 시 입력하세요.">
                                <button class="btn btn-white" @click="fnNewPassword"><svg class="icon">
                                    <use xlink:href="/img/symbol-defs.svg#icon-lock-reset"></use>
                                </svg>변경</button>
                            </div>
                        </td>
                        <th scope="row"><label for="">휴대폰번호</label></th>
                        <td><input type="text" id="user_phone" title="휴대폰번호" placeholder="휴대폰번호를 입력해 주세요." v-model="viewModel.user_phone" @input="formatPhoneNumber"></td>
                    </tr>
                    <!-- <tr>

<th scope="row"><label for="">소속</label></th>

<td>

<div class="input_group input_btn">

<input type="text" id="" title="소속" placeholder="소속을 선택해주세요.">

<button><svg class="icon">

<use xlink:href="/img/symbol-defs.svg#icon-search"></use>

</svg></button>

</div>

</td>

</tr> -->
                    <tr>
                        <th scope="row"><label for="">성명</label></th>
                        <td><input type="text" id="user_nm" title="성명" placeholder="입력해주세요." v-model="viewModel.user_name"></td>
                        <th scope="row"><label for="">이메일</label></th>
                        <td><input type="text" id="user_eml" title="이메일" placeholder="example@smart.com" v-model="viewModel.user_eml" @input="fnTrim()"></td>
                    </tr>
                    <!-- <tr>

<th scope="row"><label for="">생년월일</label></th>

<td>

<div class="datepicker_box">

<input type="text" id="" class="datepicker" title="생년월일">

</div>

</td>

</tr> -->
                    <!-- <tr>

<th scope="row" rowspan="2"><label for="">주소</label></th>

<td>

<div class="input_group input_btn">

<input type="text" id="" title="소속" placeholder="우편번호 찾기">

<button><svg class="icon">

<use xlink:href="/img/symbol-defs.svg#icon-search"></use>

</svg></button>

</div>

</td>

</tr>

<tr>

<td><input type="text" id="" title="주소" placeholder="예) 종로구 사직로 161"></td>

</tr> -->
                    <tr>
                        <th scope="row"><label for="">주소</label></th>
                        <td colspan="3">
                            <div class="input_group input_btn">
                                <input type="text" id="user_addr" title="주소" placeholder="예) 종로구 사직로 161" v-model="viewModel.user_addr" disabled>
                                <button @click="daumApi()"><svg class="icon">
                                        <use xlink:href="/img/symbol-defs.svg#icon-search"></use>
                                    </svg></button>
                                <input type="text" id="user_detail_addr" title="상세주소" v-model="viewModel.user_detail_addr" placeholder="예) 101동 101호">
                            </div>
                        </td>
                        <!-- <td><input type="text" id="user_addr" title="주소" placeholder="예) 종로구 사직로 161" v-model="viewModel.user_addr" disabled></td> -->
                    </tr>
                    <tr>
                        <th scope="row"><label for="">비상연락망</label></th>
                        <td colspan="3">
                            <div class="input_group">
                                <label for="">성명:</label>
                                <input type="text" id="emgnc_nm" title="성명" placeholder="입력해주세요." v-model="viewModel.emgnc_nm">
                                <label for="">관계:</label>
                                <input type="text" id="emgnc_rel" title="성명" placeholder="입력해주세요." v-model="viewModel.emgnc_rel">
                                <label for="">연락처:</label>
                                <input type="text" id="emgnc_phone" title="성명" placeholder="-없이 입력해 주세요." v-model="viewModel.emgnc_phone">
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div v-if="viewModel.bplc_yn == 'Y'">
            <h3>건강정보</h3>
            <table class="table horizontal write">
                <caption>건강정보</caption>
                <tbody>
                    <tr>
                        <th scope="row" class="w150"><label for="height">신장</label></th>
                        <td>
                            <div class="unit_box">
                                <input class="text-right" type="number" id="height" title="신장" placeholder="입력해주세요. " v-model="helthInfo.height">
                                <span class="unit">cm</span>
                            </div>
                        </td>
                        <th scope="row" class="w150"><label for="weight">체중</label></th>
                        <td>
                            <div class="unit_box">
                                <input class="text-right" type="number" id="weight" title="체중" placeholder="입력해주세요." v-model="helthInfo.weight">
                                <span class="unit">kg</span>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row"><label for="bdp">혈액형</label></th>
                        <td>
                            <div class="unit_box">
                                <select id="bdp" title="혈액형" v-model="helthInfo.bdp">
                                    <option disabled value="" selected>혈액형 선택</option>
                                    <option value="Rh+O">O형</option>
                                    <option value="Rh+A">A형</option>
                                    <option value="Rh+B">B형</option>
                                    <option value="Rh+AB">AB형</option>
                                    <option value="Rh-O">Rh-O형</option>
                                    <option value="Rh-A">Rh-A형</option>
                                    <option value="Rh-B">Rh-B형</option>
                                    <option value="Rh-AB">Rh-AB형</option>
                                </select>
                                <!-- <input class="text-right" type="text" id="bdp" title="혈액형" placeholder="입력해주세요" oninput="handleOnInput(this)" v-model="helthInfo.bdp">
                                <span class="unit">형</span> -->
                            </div>
                        </td>
                        <th scope="row"><label for="">혈압 및 약 복용</label></th>
                        <td>
                            <label for="medicineY"><input type="radio" name="medicine" id="medicineY" :checked="helthInfo.brssr_medicn_yn == 'Y'" v-model="helthInfo.brssr_medicn_yn" value="Y">Y</label>
                            <label for="medicineN"><input type="radio" name="medicine" id="medicineN" :checked="helthInfo.brssr_medicn_yn == 'N'" v-model="helthInfo.brssr_medicn_yn" value="N">N</label>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row"><label for="smkng_qy">담배<sub>- 선택입력</sub></label></th>
                        <td>
                            <div class="unit_box">
                                <label for="">하루:</label>
                                <input class="text-right" type="number" id="smkng_qy" title="흡연량" placeholder="입력해주세요" v-model="helthInfo.smkng_qy">
                                <span class="unit">갑</span>
                            </div>
                        </td>
                        <th scope="row"><label for="">음주<sub>- 선택입력</sub></label></th>
                        <td>
                            <div class="input_group">
                                <div class="unit_box">
                                    <label for="">주:</label>
                                    <input class="text-right" type="number" id="" title="횟수" placeholder="입력" v-model="helthInfo.drnkg_nmtm">
                                    <span class="unit">회</span>
                                </div>
                                <span>/ 주량</span>
                                <div class="unit_box">
                                    <label for="">소주:</label>
                                    <input class="text-right" type="number" id="" title="갯수" placeholder="입력" v-model="helthInfo.drnkg_qy">
                                    <span class="unit">병</span>
                                </div>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row"><label for="">질병사항</label></th>
                        <td colspan="3">
                            <ul class="join" style="background:none;">
                                <li class="input_group bl_dot">
                                    <label for="glycsr">당뇨<input type="checkbox" id="glycsr" v-model="helthInfo.glycsr_yn" true-value="Y" false-value="N"></label>
                                    <label for="crdvsc">고혈압<input type="checkbox" id="crdvsc" v-model="helthInfo.crdvsc_yn" true-value="Y" false-value="N"></label>
                                    <label for="lumbar_disk">요추 디스크<input type="checkbox" id="lumbar_disk" v-model="helthInfo.lumbar_disk_yn" true-value="Y" false-value="N"></label>
                                    <label for="cervical_disk">경추 디스크<input type="checkbox" id="cervical_disk" v-model="helthInfo.cervical_disk_yn" true-value="Y" false-value="N"></label>
                                </li>
                                <li class="input_group bl_dot">
                                    <label>
                                        과거 산재, 교통사고 유무
                                        <label for="accidentY"><input type="radio" name="accident" id="accidentY" :checked="helthInfo.past_indusac_yn == 'Y'" v-model="helthInfo.past_indusac_yn" value="Y">Y</label> 
                                        <label for="accidentN"><input type="radio" name="accident" id="accidentN" :checked="helthInfo.past_indusac_yn == 'N'" v-model="helthInfo.past_indusac_yn" value="N">N</label>
                                    </label>
                                </li>
                                <li class="input_group bl_dot" v-show="helthInfo.past_indusac_yn == 'Y'">
                                    <label for="">
                                        년도
                                        <select id="inj_year" title="년도선택" v-model="helthInfo.inj_year">
                                            <option disabled value="none" selected>선택</option>
                                            <option v-for="(item, index) in yyyyList" :key="index" :value="item.value">
                                                {{ item.text }}
                                            </option>
                                        </select>
                                    </label>
                                    <label for="inj_nm">부상명<input type="text" id="inj_nm" placeholder="입력" v-model="helthInfo.inj_nm"></label>

                                </li>
                                <li class="input_group bl_dot" v-show="helthInfo.past_indusac_yn == 'Y'">
                                    <label for="">
                                    치료기간
                                        <div class="datepicker_box">
                                            <input type="text" class="datepicker" id="inj_mdlrt_bgng_dt" title="시작일" readonly>
                                        </div>
                                        <label for="">~</label>
                                        <div class="datepicker_box">
                                            <input type="text" class="datepicker" id="inj_mdlrt_end_dt" title="종료일" readonly>
                                        </div>
                                    </label>
                                </li>
                            </ul>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div class="table_footer btn-right">
            <button @click="fnSave" class="btn btn-purple"><svg class="icon">
                    <use xlink:href="/img/symbol-defs.svg#icon-post-add"></use>
                </svg>저장</button>
        </div>
        <!-- <div>

<h3>이력사항</h3>

<table class="table horizontal write">

<caption>이력사항</caption>

<tbody>

<tr>

<th scope="row" class="w70"><label for="">근무기간</label></th>

<td>

<div class="datepicker_box">

<input type="text" class="datepicker" title="근무기간">

</div>

</td>

</tr>

<tr>

<th scope="row"><label for="">현장명</label></th>

<td><input type="text" id="" title="현장명" placeholder="입력해주세요."></td>

</tr>

<tr>

<th scope="row"><label for="">근무내용</label></th>

<td><input type="text" id="" title="근무내용" placeholder="입력해주세요."></td>

</tr>

<tr>

<th scope="row"><label for="">업체명</label></th>

<td><input type="text" id="" title="업체명" placeholder="입력해주세요."></td>

</tr>

</tbody>

</table>

</div> -->
        <div>
            <h3>서명등록</h3>
            <table class="table horizontal write">
                <caption>기본정보</caption>
                <tbody>
                    <tr>
                        <th>서명등록</th>
                        <td>
                            <div class="sign_box">
                                <signature :ref="'signature'"></signature>
                            </div>
                            <button class="btn btn-white" @click="fnSign();"><svg class="icon"><use xlink:href="/img/symbol-defs.svg#icon-task-alt"></use></svg>적용</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        
    </div>
    <!-- <modal v-if="popup" refs="modal"></modal> -->
</div>
</template>

<script>
import "es6-promise/auto";
import Vue from "vue";
import Axios from "axios";
import qrcode from "../../frm_main/qrcode.vue"
import signature from "../../../common/vue/signature.vue";
// import modal from "../popup/mypage_modal.vue"

Vue.config.devtools = true;

export default {
    data: function () {
        return {
            profile: "none",
            sessionuser: {},
            setBplcList: [],
            user_pic_path: '',
            user: {},
            viewModel: {
                filelist: null,
                fileGroup: '',
                imgfileGroup: false,
                user_addr: '',
                user_brdt: '',
                user_detail_addr: '',
                bplc_sn: '',
                bplc_nm: '',
                ocpt_detail_nm : '',
                jbttl_nm : '',
            },
            helthInfo:{},
            yyyyList:[],
        };
    },
    components: {
        'qrcode': qrcode,
        'signature': signature,
    },
    mounted: function () {
        this.user = this.$store.state.global.userInfo;
        let vm = this;
        vm.fnSessionUser();
        vm.fnSetBplcList();
    },
    methods: {
        fnSessionUser: function () {
            let vm = this;
            Axios.post("/api/account/myInfo.do", {}).then(function (response) {
                vm.$store.commit("global/setUserInfo", response.data.detailUser);
                vm.sessionuser = response.data.detailUser;
                vm.viewModel = response.data.detailUser;
                if (vm.viewModel.bplc_sn == 0) vm.viewModel.bplc_nm = "전체";
                let str = response.data.detailUser.user_addr;
                
                if(str != null){
                    vm.viewModel.user_addr = str.split("|")[0];
                    vm.viewModel.user_detail_addr = str.split("|")[1];
                }
                
                if (response.data.detailUser.user_pic_path != '') {
                    if (response.data.detailUser.user_pic_path.charAt() == '/') { //리눅스 경로때문에 사용
                        vm.user_pic_path = response.data.detailUser.user_pic_path
                    } else {
                        vm.user_pic_path = response.data.detailUser.user_pic_path.substring(2)
                    }
                }

                if(vm.viewModel.aprvr_path != undefined){
                    if(vm.viewModel.aprvr_path.charAt()=='/') {       //리눅스 경로때문에 사용
                        vm.viewModel.aprvr_path = vm.viewModel.aprvr_path;
                    } else {    //아닐경우
                        vm.viewModel.aprvr_path = vm.viewModel.aprvr_path.substr(2);
                    }
                    vm.$refs.signature.fnInitCanvas(vm.viewModel.aprvr_path);
                }
                
                //현장사람일 경우만 건강정보 조회
                if(vm.viewModel.bplc_yn == 'Y'){
                    vm.fnHelthInfo();
                    vm.createdYear();
                    calendarInput();
                }
                if (response.data.detailUser == {} || response.data.detailUser == null) {
                    alert('로그인 후 이용해주세요');
                    window.location.href = '/account/login.do';
                } else {
                    // vm.fnGetFavoriteList();
                    // vm.fnGetSelectMenu();

                    // if(vm.windowpath == '/main/index.do') {
                    //     vm.map = vm.fnDrwMap();
                    //     vm.fnGetSigunguList();
                    //     vm.fnSetEvtListener();
                    // }
                }

            });
        },
        fnSetBplcList: function () {
            let vm = this;
            let data = {
                user_id: vm.user.user_id,
                user_role: vm.user.user_roles,
                dept_sn:vm.user.dept_sn,
                team_sn:vm.user.team_sn
            }
            Axios.post("/selectAccountSetBplcList.do", data).then(function (response) {
                vm.setBplcList = response.data;
            });
        },
        fnHelthInfo: function(){
            let vm = this;
            let data = {
                user_id: vm.user.user_id,
                bplc_sn: vm.sessionuser.bplc_sn,
            }
            Axios.post("/selectHelthInfo.do", data).then(function (response) {
                vm.helthInfo = response.data;

                $("#inj_mdlrt_bgng_dt").val(vm.helthInfo.inj_mdlrt_bgng_dt);
                $("#inj_mdlrt_end_dt").val(vm.helthInfo.inj_mdlrt_end_dt);
            });
        },
        fnNewPassword: function () {
            let vm = this;
            let data = {
                user_id: vm.user.user_id,
                newPassword: $("#user_pwd").val(),
            };

            if (confirm("정말 변경하시겠습니까?")) {
                Axios.post("/updatePasswordReset.do", data).then(function (response) {
                    if (response.data.result == 1) {
                        alert("정상적으로 변경되었습니다.");
                    } else {
                        alert("예기치 못한 오류 발생으로 변경이 취소되었습니다.")
                    }
                });
            }
        },
        // 프로필 업데이트
        profile_img_update: function () {
            let vm = this;
            $("#profile_img").click();

        },
        // 프로필 삭제 
        profile_img_reset: function () {
            let vm = this;
            vm.profile = "reset";
            vm.user_pic_path = '';
            vm.viewModel.imgfileGroup = false;
            let data = {
                user_id: vm.viewModel.user_id
            }
            Axios.post("/deleteUserProfileImg.do", data).then(function (response) {
                alert("정상적으로 변경되었습니다.");
            })
        },
        fnBplcSet: function () {
            let vm = this;
            let data = {
                user_id: vm.viewModel.user_id,
                bplc_sn: vm.viewModel.bplc_sn,
            }
            Axios.post("/updateUserBplcSet.do", data).then(function (response) {
                if (response.data == 1) {
                    alert("정상적으로 변경되었습니다.");
                    vm.fnSessionUser();
                } else {
                    alert("예기치 못한 오류 발생으로 변경이 취소되었습니다.")
                }
            });
        },
        fnSave: function () {
            let vm = this.viewModel;
            let vt = this;
            let cnt = 0;
            let data = {
                uid: vt.sessionuser.uid_seq,
                bplc_sn: vt.sessionuser.bplc_sn,
                user_id: vm.user_id,
                user_nm: vm.user_name,
                user_phone: vm.user_cttpc,
                user_addr: vm.user_addr + "|" + vm.user_detail_addr,
                user_eml: vm.user_eml,
                emgnc_nm: vm.emgnc_nm,
                emgnc_rel: vm.emgnc_rel,
                emgnc_phone: vm.emgnc_phone,

                //건강정보(24.01.31 추가)
                height: vt.helthInfo.height,
                weight: vt.helthInfo.weight,
                bdp: vt.helthInfo.bdp,
                brssr_medicn_yn: vt.helthInfo.brssr_medicn_yn,
                past_indusac_yn: vt.helthInfo.past_indusac_yn,
                glycsr_yn: vt.helthInfo.glycsr_yn,
                crdvsc_yn: vt.helthInfo.crdvsc_yn,
                lumbar_disk_yn: vt.helthInfo.lumbar_disk_yn,
                cervical_disk_yn: vt.helthInfo.cervical_disk_yn,
                inj_year: vt.helthInfo.inj_year,
                inj_nm: vt.helthInfo.inj_nm,
                inj_mdlrt_bgng_dt: $("#inj_mdlrt_bgng_dt").val(),
                inj_mdlrt_end_dt: $("#inj_mdlrt_end_dt").val(),
                smkng_yn: vt.helthInfo.smkng_qy != null && vt.helthInfo.smkng_qy != '' ? 'Y' : 'N',
                smkng_qy: vt.helthInfo.smkng_qy,
                drnkg_yn: vt.helthInfo.drnkg_qy != null && vt.helthInfo.drnkg_qy != '' ? 'Y' : 'N',
                drnkg_nmtm: vt.helthInfo.drnkg_nmtm,
                drnkg_qy: vt.helthInfo.drnkg_qy,
            };
            Axios.post("/selectUserProfileYn.do", data).then(function (response) {
                if (vm.imgfileGroup) {
                    if (response.data == 1) {
                        const filemapperId = "user.updateUserProfileImg";
                        vt.fnInsertFile(filemapperId, vt.sessionuser.user_id);
                    } else {
                        const filemapperId = "user.insertUserProfileImg";
                        vt.fnInsertFile(filemapperId, vt.sessionuser.user_id);
                    }
                }
            });

            Axios.post("/updateUserInfo.do", data).then(function (response) {
                if (response.data == 1) {
                    alert("정상적으로 변경되었습니다.");
                    location.reload();
                } else {
                    alert("예기치 못한 오류 발생으로 변경이 취소되었습니다.")
                }
            });

        },
        fnUploadImageThumbnail: function () {
            let vt = this;
            let vm = this.viewModel;
            let maxSize = 1 * 1024 * 1024 * 1024;

            let file = $('#profile_img')[0].files[0];
            vm.filelist = file;

            // $('#'+this.pass.id+i+' #filebox').text(filename);
            let fileUploadType = ['jpg', 'gif', 'png', 'jpeg'];

            let fileExt = file.name.split('.').pop().toLowerCase();

            if (fileUploadType.indexOf(fileExt) == -1) {
                alert(messageUtil(Message.UPLOAD_FILE_TYPE, ['이미지']));
                return;
            } else {
                if (file.size > maxSize) {
                    alert("첨부파일 사이즈는 1GB 이내로 등록 가능합니다.");
                    return false;
                } else {
                    vt.user_pic_path = URL.createObjectURL(file);
                    let img = new Image();
                    img.src = vt.user_pic_path;
                    vm.imgfileGroup = true;
                }
            }
        },
        fnInsertFile: function (mapperId, user_id) {
            let vt = this;
            let vm = this.viewModel;
            let frm = new FormData();
            frm.append("fileGroup", vm.fileGroup);
            frm.append("uploadFiles", vm.filelist);
            frm.append("mapperId", mapperId); //매퍼아이디
            frm.append("user_id", user_id);
            frm.append("mode", "I");
            vm.key == null ? '' : frm.append("sn", vm.key);
            // let key = vm.key
            if (vm.filelist.file_seq == null) {
                // if(key!=null) {
                //     Axios.post('/file/drop/'+key, key).then((response) => {
                //         // console.log(response.data)
                //     });
                // }
                Axios.post('/main/file/upload.do', frm, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }).then((response) => {
                    // console.log(response.data)
                });
            }
        },
        daumApi: function () {
            let vm = this;
            new daum.Postcode({
                oncomplete: function (data) {

                    var addr = data.address; // 최종 주소 변수

                    vm.viewModel.user_addr = addr;
                }
            }).open();
        },
        formatPhoneNumber() {
            let vm = this;
            // 숫자만 남기기
            let numericPhoneNumber = vm.viewModel.user_phone.replace(/\D/g, "");

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

            // 변경된 값 적용
            vm.viewModel.user_phone = numericPhoneNumber;
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
        fnSign: function(){
            let vm = this;
            if (confirm("서명을 등록하시겠습니까?")) {
                $("#signatureCanvas").css("border-color", "white");
                html2canvas(document.querySelector("#signatureCanvas")).then(canvas => {
                    var myImg = canvas.toDataURL("image/png");
                    Axios.post("/fileupload/sign.do", {
                            imgSrc: myImg
                        })
                        .then(function (response) {
                            vm.thumb = response.data.resultMap;

                            let data = {
                                user_id: vm.user.user_id,
                                strg_path: vm.thumb.replace(vm.thumb.split('/').reverse()[0], ""),
                                strg_file_nm: vm.thumb.split('/').reverse()[0],
                                file_extn: "jpg",
                                se_file_img: 1,
                                file_sz: 100,
                            };


                            Axios.post("/updateSignInfo.do",data).then(function(response) {
                                if (response.data == 1) {
                                    alert("정상적으로 변경되었습니다.");
                                    location.reload();
                                }else{
                                    alert("서명 등록에 실패하엿습니다.\n관리자에게 문의하세요.");
                                }
                            });
                        }).catch(function (ex) {
                            console.log("fnUpload error" + ex);
                        });
                });
            } else {
                if (message) alert(message);
            }
        },
        fnTrim: function(){
            let vm = this;

            vm.viewModel.user_eml = vm.viewModel.user_eml.replace(" ", "");
        }
    },
};
</script>
