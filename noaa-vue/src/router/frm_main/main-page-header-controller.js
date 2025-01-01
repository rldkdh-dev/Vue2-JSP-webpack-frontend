import 'es6-promise/auto'
import Vue from 'vue';
import Axios from 'axios';
import device from "vue-device-detector";
import store from "../../store";

Vue.config.devtools = true;
Vue.use(device)
new Vue({
    store,
    el: '#scope-main-page-header',
    data: function() {
        return {
            windowpath:'',
            menuleveloneTitle:'',
            menuleveltwoTitle:'',
            menulevelthreeTitle:''
        }
    },
    mounted: function() {
        let vm = this;


        vm.getMenuList();
        
        // let menuList = vm.$store.state.global.menuList;
        // let menulevelone = menuList.menulevelone;
        // let menuleveltwo = menuList.menuleveltwo;
        // let menulevelthree = menuList.menulevelthree;
        // vm.windowpath = window.location.pathname;
        
        // //aside heder title 추출
        // $.each(menulevelone, function(idx, item) {
        //     if(item.menu_url.indexOf(vm.windowpath.split('/')[1]) > -1) vm.menuleveloneTitle = item.menu_title;
        // });
        // if(vm.windowpath.split('/')[1] != 'main'){
        //     $.each(menuleveltwo, function(idx, item) {
        //         if(item.menu_url.indexOf(vm.windowpath.split('/')[1] + '/' + vm.windowpath.split('/')[2]) > -1) vm.menuleveltwoTitle = item.menu_title;
        //     });
        //     $.each(menulevelthree, function(idx, item) {
        //         if(item.menu_url.indexOf(vm.windowpath.split('/')[3]) > -1) vm.menulevelthreeTitle = item.menu_title;
        //     });
        // }else{
        //     vm.menuleveltwoTitle = '공통서비스';
            
        //     $.each(menulevelthree, function(idx, item) {
        //         if(item.menu_url.indexOf(vm.windowpath.split('/')[2]) > -1) vm.menulevelthreeTitle = item.menu_title;
        //     });
        // }
    },
    methods: {
        getMenuList: function () {
            let vm = this;
            Axios.post("/account/MainMenu/list.do", {}).then(function(response) {

                console.log(response);
                // vm.$store.commit("global/setMenuList", response.data);
                // vm.menulevelone = response.data.menulevelone;
                // vm.menuleveltwo = response.data.menuleveltwo;
                // vm.menulevelthree = response.data.menulevelthree;
    
                // // console.log(' vm.menulevelone : ' , vm.menulevelone);
                // // console.log(' vm.menuleveltwo : ' , vm.menuleveltwo);
                // // console.log(' vm.menulevelthree : ' , vm.menulevelthree);
    
                // var nowMenulevelArr = vm.windowpath.split('/');
                // vm.nowMenulevelone = nowMenulevelArr[1];
                // vm.nowMenuleveltwo = '/' + vm.nowMenulevelone + '/' + nowMenulevelArr[2];
                // vm.nowMenulevelthree = vm.nowMenuleveltwo + '/' + nowMenulevelArr[3];
    
                // //aside heder title 추출
                // $.each(vm.menulevelone, function(idx, item) {
                //     if (item.menu_url.indexOf(vm.windowpath.split('/')[1]) > -1) vm.menuleveloneTitle = item.menu_title;
                // });
                // $.each(vm.menuleveltwo, function(idx, item) {
                //     if (item.menu_url.indexOf(vm.windowpath.split('/')[1] + '/' + vm.windowpath.split('/')[2]) > -1) vm.menuleveltwoTitle = item.menu_title;
                // });
                // $.each(vm.menulevelthree, function(idx, item) {
                //     if (item.menu_url.indexOf(vm.windowpath.split('/')[3]) > -1) vm.menulevelthreeTitle = item.menu_title;
                // });
    
                //console.log(' vm.menuleveloneTitle : ', vm.menuleveloneTitle);
                //console.log(' vm.menuleveltwoTitle : ', vm.menuleveltwoTitle);
                //console.log(' vm.menulevelthreeTitle : ', vm.menulevelthreeTitle);
    
                // vm.$store.commit("global/setMenuTitleInfo", {
                //     menuleveloneTitle : vm.menuleveloneTitle,
                //     menuleveltwoTitle : vm.menuleveltwoTitle,
                //     menulevelthreeTitle : vm.menulevelthreeTitle
                // });
    
            });
        },
        setFavoriteMenu: function() {
            let vm = this;
            let favoriteFlag = ($('.breadcrumb .favorite').hasClass('on') == false) ? 'I' : 'D';

            if(favoriteFlag == 'I') {
                $('.my_menu .favorit_list').append('<li><a href="' + vm.windowpath + '">' + vm.menulevelthreeTitle + '</a></li>');
                $('.my_menu').addClass('opened');
            } else {
                let favoriteListEl = $('.my_menu .favorit_list li a');
                $.each(favoriteListEl, function(idx, item) {
                    if($(item).text() == vm.menulevelthreeTitle) $(item).parent().remove();
                });
            }
            
            let send = {
                favoriteFlag: favoriteFlag,
                title:vm.menulevelthreeTitle,
                url:vm.windowpath,
                user_id : vm.$store.state.global.userInfo.user_id
            }

            Axios.post("/account/MainMenu/setFavoriteMenu.do", send).then(function(response) {
                if($('.my_menu .favorit_list li').length == 0) $('.my_menu').removeClass('opened');
            });
        }
    }
    
})


