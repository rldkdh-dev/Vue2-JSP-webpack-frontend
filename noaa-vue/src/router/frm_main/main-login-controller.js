import 'es6-promise/auto'
import Vue from 'vue'
import Axios from 'axios'
import vueCookies from "vue-cookies";

Vue.use(vueCookies);

new Vue({
    el: '#scope-login',
    data: function() {
        return {
            detailUser: {},
            isAdmin:false,
            userId: this.$cookies.get("userId"),
            userIdSave: false,
            viewModel :{
                userNm : "",
                userBrdt : "",
            }
        }
    },
    mounted: function() {
        pageLoad(this);

   		$("#findId").on("click",function(){
   			$("#mainForm").hide();
   			$("#findForm").show();
   		})
   		
   		$("#before").on("click",function(){
   			$("#findForm").hide();
   			$("#mainForm").show();
   		})
    },
    methods: {
        fnPageInit: function() {
            let vm = this;

            //console.log('userId : ' , vm.userId );

            if(vm.userId != null) {
                vm.userIdSave = true;
                vm.detailUser.user_id = vm.userId;
            }

            // Axios.post("/api/admin/user/init/check.do", {}).then(function(response) {
            //     if(response.data.resultCount == 0){
            //         vm.isAdmin = true;
            //         alert("관리자 계정이 없습니다.\n관리자 계정을 생성하세요");
            //         window.location.href="/admin/login.do";
            //     }else{
            //         vm.isAdmin = false;
            //     }
            // }).catch(function(ex) {
            //     console.log(ex);
            // });
        }
        ,fnOnClickBtnLogin: function() {
            let vm = this;
            // let keyEx = $("#keyEx").val();
            // let keyM = $("#keyM").val();
            // let rsa = new RSAKey();
            // rsa.setPublic(keyM,keyEx);
            // let encID = rsa.encrypt(vm.detailUser.user_id);
            // let encPwd = rsa.encrypt(vm.detailUser.user_pwd);

            if (vm.userIdSave) {
                vm.$cookies.set("userId", vm.detailUser.user_id);
            } else {
                vm.$cookies.remove('userId');
            }
            
            let encID = vm.fnEncryptAES(vm.detailUser.user_id);
            let encPwd = vm.fnEncryptAES(vm.detailUser.user_pwd);

            $("#encUserID").val(encID);
            $("#encUserPwd").val(encPwd);

            
            
            //document.forms["mainForm"].submit();
        }
        ,fnOnCreateAdmin: function() {
            let vm = this;

            if(vm.detailUser.user_id == null || vm.detailUser.user_id == ""){
                alert("사용자 아이디를 입력하세요");
                return false;
            }
            if(vm.detailUser.user_pwd == null || vm.detailUser.user_pwd == ""){
                alert("사용자 비밀번호를 입력하세요");
                return false;
            }

            Axios.post("/api/account/admin/create.do", {detail:vm.detailUser})
            .then(function(response) {
                vm.fnPageInit();
            }).catch(function(ex) {
                console.log(ex);
            });
        },
        fnPwShow:function(){
            $("#password").attr("type", "text");
            $('#password + button').find('use').attr('xlink:href', '../img/symbol-defs.svg#icon-watch-fill')
            setTimeout(function(){
                $("#password").attr("type", "password");
                $('#password + button').find('use').attr('xlink:href', '../img/symbol-defs.svg#icon-watch-off')
			},300);
            
            //input type 확인
            // let type = $("#password").attr("type");
            // if(type=='text'){   //text일 경우 password로
            //     $("#password").attr("type", "password");
            // }else{   //password일 경우 text로
            //     $("#password").attr("type", "text");
            // }
        },
        fnPwEmpty: function() {
            $('#password').val('').siblings('.close').hide();
        },
        fnEncryptAES: function(plaintext) {
            if($('#keyModule').val() == "" && $('#keyExponent').val() == "") {
                $('#keyModule').val(CryptoJS.lib.WordArray.random(128/8).toString(CryptoJS.enc.Hex));
                $('#keyExponent').val(CryptoJS.lib.WordArray.random(128/8).toString(CryptoJS.enc.Hex));
            }
            
            var keySize = 128;
            var iterationCount = 10000;
            var passPhrase = "1234";
            
            // PBKDF2 키 생성 
            var key128Bits100Iterations = CryptoJS.PBKDF2(passPhrase, CryptoJS.enc.Hex.parse($('#keyExponent').val()),
                    { keySize: keySize/32, iterations: iterationCount });
                
            var encrypted = CryptoJS.AES.encrypt(plaintext,key128Bits100Iterations,
                    { iv: CryptoJS.enc.Hex.parse($('#keyModule').val()) });
            
            return encrypted;
        },
        fnFindId: function(){
            let vm = this;
            let data = {
                userNm : vm.viewModel.userNm,
                userBrdt : vm.viewModel.userBrdt,
            }

            Axios.post("/account/findUserId.do",data).then(function(res){
                let result = res.data;
                var msg = "";
                if(result.list.length > 0){
                    result.list.forEach(function(item){
                        msg += "\n• "+item.USER_ID;
                    })
                    alert("입력하신 정보로 조회된 아이디"+msg);
                }else{
                    alert("가입정보가 없습니다.");
                }
            })

        }
    }
});