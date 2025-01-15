import 'es6-promise/auto'
import Vue from 'vue';
import Axios from 'axios';
import device from "vue-device-detector";
import store from "../../store";
Vue.config.devtools = true;
Vue.use(device)
new Vue({ 
    store,
    el: '#scope-admin-header',
    data: function() {
        return {
            userInfo:{},
        }
    },
    mounted: function() {
        let vm = this;
    
        vm.userInfo = vm.$store.state.global.userInfo;
        
        if(vm.userInfo == null){
            vm.fnSessionUser();
        }
    },
    methods: {
        fnSessionUser: function() {
            let vm = this;
            Axios.post("/api/admin/myInfo.do", {}).then(function(response) {
                vm.userInfo = response.data;
            });
        },
    }
    
});


