import 'es6-promise/auto'
import Vue from 'vue'
import Axios from 'axios'
import vueCookies from "vue-cookies";   
import store from "../../store";

Vue.use(vueCookies);

new Vue({
    store,
    el: '#scope-login',
    data: function() {
        return {
            detailUser: {},
            isAdmin:false,
            userId: this.$cookies.get("loginId"),
            userIdSave: false,
            viewModel :{
                userNm : "",
                userBrdt : "",
            }
        }
    },
    mounted: function() {
        pageLoad(this);

        //글로벌 초기화
        this.$store.commit("global/clearUserInfo");

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
        }
        ,fnOnClickBtnLogin: function() {
            let vm = this;

            if (vm.userIdSave) {
                vm.$cookies.set("loginId", vm.detailUser.user_id);
            } else {
                vm.$cookies.remove('loginId');
            }
            
            var encPwd = CryptoJS.SHA256(vm.detailUser.user_pwd);

            $("#loginPw").val(encPwd);

            document.forms["mainForm"].submit();
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
            $("#loginPw").attr("type", "text");
            $('#loginPw + button').find('use').attr('xlink:href', '../img/symbol-defs.svg#icon-watch-fill')
            setTimeout(function(){
                $("#loginPw").attr("type", "password");
                $('#loginPw + button').find('use').attr('xlink:href', '../img/symbol-defs.svg#icon-watch-off')
			},300);
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