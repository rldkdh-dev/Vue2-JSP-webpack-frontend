import 'es6-promise/auto'
import Vue from 'vue';
import Axios from 'axios';
import device from "vue-device-detector";
import store from "../../store";
Vue.config.devtools = true;
Vue.use(device)
new Vue({
    store,
    el: '#scope-admin-menu',
    data: function() {
        return {
            windowpath:'',
            vuepath:'',
            pageheadurl:'',
            sessionuser: {},

            timerCount:10800,
            sessiontime:'',
            isClick:true,
            bbsmenu:[],
            headerdata:{},
            menulevelone:[],
            menuleveltwo:[],
            menulevelthree:[],
            menulevelthreeTemp:[],
            nowMenu:{},

        }
    },
    watch: {
        timerCount: {
            handler(value) {
                if (value > 0) {
                    setTimeout(() => {
                        this.timerCount--;
                        let hour, min, sec
                        hour = parseInt(this.timerCount/3600);
                        min = parseInt((this.timerCount%3600)/60);
                        sec = this.timerCount%60;
                        if (hour.toString().length==1) hour = "0" + hour;
                        if (min.toString().length==1) min = "0" + min;
                        if (sec.toString().length==1) sec = "0" + sec;
                        this.sessiontime=hour + "시간 " + min + "분 " + sec + "초";
                    }, 1000);
                }
            },
            immediate: true
        }
    },

    mounted: function() {
        let vm = this;
        vm.windowpath = window.location.pathname;
        vm.vuepath = window.location.pathname + window.location.hash;
        vm.pageheadurl = window.location.pathname.split('/')[1];
        if(vm.$device.ios != false || vm.$device.android != false){
            window.location.href= "/m" + window.location.pathname;
        }else{
            // vm.fnSessionUser();
        }
        vm.fnSetMenu();
    },
    updated() {
        this.$nextTick(function () {
            // 화면구성이 모두 끝난 후 (((라우터 글쓰기 페이지 새로고침 시 불러오기 )))
            let rlink = window.location.hash.split('/')[2];
            if(rlink == 'write'){
                let path = window.location.pathname + window.location.hash.replace('/write', '');
                let link = "a[href$='"+path+"']";
                let link2 = "span[name$='"+path+"']";
                $('.menulevel_two_titles').hide();
                $('.submenu').children('li').removeClass('active');
                $(link).parent().addClass('active');
                $(link2).show();
            }else if(rlink == 'datail'){
                let path = window.location.pathname +'#/'+ window.location.hash.split('/')[1];
                let link = "a[href$='"+path+"']";
                let link2 = "span[name$='"+path+"']";
                $('.menulevel_two_titles').hide();
                $('.submenu').children('li').removeClass('active');
                $(link).parent().addClass('active');
                $(link2).show();
            }

        })
      },
    methods: {
        fnSessionUser: function() {
            let vm = this;
            Axios.get("/api/admin/myInfo.do", {}).then(function(response) {
                vm.$store.commit("global/setUserInfo", response.data.detailUser);
                vm.sessionuser = response.data.detailUser;

             /*   if(vm.sessionuser == null || vm.sessionuser == ''){
                    alert('세션이 만료되어 로그아웃 되었습니다. 다시 로그인 해주세요.');
                    window.location.href="/admin/login.do";
                }else if((vm.sessionuser.user_roles == 'ROLE_001' && vm.sessionuser.hdofc_mngr_yn == 'Y') || (vm.sessionuser.user_roles == 'ROLE_002' && vm.sessionuser.ocpt_se_cd == 'MNG') ){
                    vm.sessionuser.menu_use_type = 'ADMIN'
                }else if(vm.sessionuser.user_roles != 'ROLE_001' || vm.sessionuser.hdofc_mngr_yn == 'N'){
                    vm.sessionuser.menu_use_type = 'USER'
                    alert('관리자 권한이 아닙니다. 사용자 페이지로 이동합니다.');
                    window.location.href="/main/index.do";
                }*/
				window.location.href="/main/index.do";
                vm.fnGetSelectMenu();
            });
        },
        fnSetMenu: function() {
            let vm = this;
            let menu_code = ''
            if(vm.pageheadurl == 'member'){menu_code='MENU9342'}
            else if(vm.pageheadurl == 'base'){menu_code='MENU9343'}
            else if(vm.pageheadurl == 'contents'){menu_code='MENU9344'}
            else if(vm.pageheadurl == 'stat'){menu_code='MENU9345'}
           if(vm.pageheadurl == 'sys'){menu_code='MENU0099'}

            vm.fnGetSelectMenu(menu_code);
        },
        fnGetSelectMenu: function(menu_code) {
            let vm = this;

            let sendData = {
                // role_id : vm.sessionuser.user_roles,
                // menu_use_type : vm.sessionuser.menu_use_type,
                menu_code : menu_code,
                now_menu_url: vm.windowpath
            }

            Axios.get("/admin/menu/list.do", sendData).then(function(response) {
                vm.menulevelone = response.data.menulevelone;
                vm.menuleveltwo = response.data.menuleveltwo;
                vm.menulevelthreeTemp = response.data.menulevelthree;
                vm.nowMenu = response.data.nowMenu;
                vm.headerdata.header_code = menu_code;
                vm.headerdata.header_title = vm.menuleveltwo[0].header_title;
                vm.fnMidMenuClick(vm.nowMenu.parent_menu_id)
            });

        },
        fnMenuClick: function(menu_id) {
            let vm = this;
            vm.fnGetSelectMenu(menu_id)
        },
        fnMidMenuClick: function(menu_id) {
            let vm = this;
            $('#'+menu_id).toggleClass('opened').siblings().removeClass('opened');
            vm.menulevelthree = vm.menulevelthreeTemp.filter(data => data.parent_menu_id == menu_id)
        },


        adminMainLogin:function(){
            let vm = this;
            var nw = window.open("about:blank");

            //console.log(' sessionuser : ' , vm.sessionuser);
            let href = "/account/login.do";

            if((vm.sessionuser.user_roles != '' && vm.sessionuser.hdofc_mngr_yn != ''
                && vm.sessionuser.user_roles == "ROLE_001" && vm.sessionuser.hdofc_mngr_yn == "Y")
                || (vm.sessionuser.user_roles != '' && vm.sessionuser.ocpt_se_cd != ''
                && vm.sessionuser.user_roles == "ROLE_002" && vm.sessionuser.ocpt_se_cd == "MNG")
            ) {
                href = '/main/index.do';
            }

            nw.location.href = window.location.origin+href;
                //location.href = "login_change.php?id="+id;
        }


    }

});


