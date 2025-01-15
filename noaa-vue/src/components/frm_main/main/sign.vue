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
                    <li class="on"><button id="info"><span class="hidden">개인정보처리 동의서</span></button></li>
                    <li><button id="join"><span class="hidden">서명등록 </span></button></li>
                    <li><button id="complete"><span class="hidden">완료</span></button></li>
                </ul>
                <!-- 개인정보처리 동의서 -->
                <div class="jointab" id="info" style="display: block;">
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
                    <h2>서명등록</h2>
                    <div class="contents">
                        <div>
                            <h3>서명등록<h4 style="color: mediumvioletred;font-size: 15px;">*</h4></h3>
                            <div class="sign_box">
                                <signature :ref="'signature'"></signature>
                            </div>
                        </div>
                    </div>
                    <button @click="fnSave" class="btn btn-large btn-purple next" id="join"><svg class="icon">
                            <use xlink:href="../img/symbol-defs.svg#icon-task-alt"></use>
                        </svg>적용</button>
                </div>
                <!-- 완료 -->
                <div class="jointab" id="complete" style="display: none;">
                    <div class="wrap contents">
                        <ul>
                            <li>환영 합니다!</li>
                            <li>다시 로그인 하시면</li>
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
</main>
</template>

<script>
import "es6-promise/auto";
import Vue from "vue";
import Axios from "axios";
import signature from "../../../common/vue/signature.vue";
import Message, {
    messageUtil
} from "../../../common/js/message";
Vue.config.devtools = true;

export default {
    data: function () {
        return {
            drawYn: false,
            user:{},
            yyyyList: [],
            viewModel: {
                img_filelist: [],
                imgfileGroup: '',
                list: {},
                data: {},
            }
        };
    },
    components: {
        'signature': signature,
    },
    mounted: function () {
        let vm = this;
        vm.user = this.$store.state.global.userInfo;
    },
    methods: {
        fnSave: function () {
            let vt = this;
            let vm = this.viewModel;

                if (vt.checkYn()) {
                    alert();
                    if (confirm(Message.CREATE_CONFIRM)) {
                        $("#signatureCanvas").css("border-color", "white");
                        html2canvas(document.querySelector("#signatureCanvas")).then(canvas => {
                            var myImg = canvas.toDataURL("image/png");
                            Axios.post("/fileupload/sign.do", {
                                    imgSrc: myImg
                                })
                                .then(function (response) {
                                    vt.thumb = response.data.resultMap;

                                    let data = {
                                        user_id: vt.user.user_id,
                                        strg_path: vt.thumb.replace(vt.thumb.split('/').reverse()[0], ""),
                                        strg_file_nm: vt.thumb.split('/').reverse()[0],
                                        file_extn: "jpg",
                                        se_file_img: 1,
                                        file_sz: 100,
                                    };


                                    Axios.post("/updateHdofcUser.do",data).then(function(response) {
                                        $("div#join").hide();
                                        $("div#complete").show();
                                    });
                                }).catch(function (ex) {
                                    console.log("fnUpload error" + ex);
                                });
                        });
                    } else {
                        if (message) alert(message);
                    }
                }
        },
        fnImgFilelist: function (vm) {
            this.viewModel.img_filelist.push(vm.filelist);
            this.viewModel.imgfileGroup = vm.fileGroup;
        },
        checkYn: function () {
            let vm = this;
            if (!vm.drawYn) {
                alert("서명을 등록하세요.");
                return false;
            }

            return true;
        },
    }
};
</script>
