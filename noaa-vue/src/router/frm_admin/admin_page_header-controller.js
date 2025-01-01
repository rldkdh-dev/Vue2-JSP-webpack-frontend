import 'es6-promise/auto'
import Vue from 'vue';
import Axios from 'axios';
import device from "vue-device-detector";
import store from "../../store";
Vue.config.devtools = true;
Vue.use(device)
new Vue({ 
    store,
    el: '#scope-admin-page-header',
    data: function() {
        return {
            windowpath:'',
            vuepath:'',
            pageheadurl:'',

            menulevelone: '',
            menuleveltwo: '',
            menulevelthree: '',

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
        vm.fnInit();
    },
    methods: {
        fnInit: function() {
            let vm = this;

            let sendData = {
                now_menu_url: vm.windowpath
            }

            Axios.post("/admin/menu/nowMenu.do", sendData).then(function(response) {
                let nowMenu = response.data.nowMenu;
                vm.menulevelone = nowMenu.header_title;
                vm.menuleveltwo = (nowMenu.parent_menu_id != nowMenu.header_code) ? nowMenu.parent_title : null;
                vm.menulevelthree = nowMenu.menu_name;
            });

        },
        
    }
    
});


