<template>
<main class="site_main" style="padding: 0">
    <div class="wrap">
        <div class="login auth">
            <div class="contents">
                <div>
                    <h2>2단계 인증</h2>
                    <div class="btn-group auth_group">
                        <a href="" class="btn auth_email">
                            <span>이메일<em>abcd@m***.***</em></span>
                        </a>
                        <a href="" class="btn auth_mobile">
                            <span>휴대폰<em>010-****-1234</em></span>
                        </a>
                    </div>
                </div>
                <div>
                    <h2>인증번호 입력하기</h2>
                    <div class="input_group">
                        <div class="input_field">
                            <input type="text" id="userId" placeholder="인증번호를 입력해주세요">
                            <label for="userId">인증번호</label>
                        </div>
                        <button class="btn btn-blue">재전송</button>
                    </div>
                    <div class="btn-group">
                        <a href="" class="btn btn-login">로그인</a>
                    </div>
                </div>
                <div class="box">
                    <p class="title">휴대폰 번호나 이메일 주소에 오류가 있어 인증 코드 수신이 불가능한 경우, 관리자에게 문의해 주시기 바랍니다.</p>
                    <ol>
                        <li>인증번호를 확인한 후 해당 번호를 입력해 주십시오.</li>
                        <li>통신 환경에 따라 수신이 지연될 수 있으니 양해 부탁드립니다.</li>
                        <li>문자나 메일을 받지 못한 경우, 스팸함 확인, 메일함 용량 초과 여부, 차단 설정 등을 점검해 보시기 바랍니다.</li>
                    </ol>
                </div>
                <p class="text-center">다른 수단으로 인증받으실려면 <a href="" class="btn-link">여기를 선택해주시길 바랍니다.</a></p>
            </div>
        </div>
    </div>
</main>
</template>

<script>
import "es6-promise/auto";
import Vue from "vue";
import Axios from "axios";
import Message, {
    messageUtil
} from "../../../common/js/message";
Vue.config.devtools = true;

export default {
    data: function () {
        return {
            viewModel: {
                },
            }
    },
    mounted: function () {

    },
    methods: {
        
    }
};
</script>
