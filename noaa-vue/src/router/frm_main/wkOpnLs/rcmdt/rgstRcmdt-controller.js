import 'es6-promise/auto'
import Vue from 'vue';
import VueRouter from 'vue-router';
import Axios from 'axios';
import device from "vue-device-detector";
import store from "../../../../store";
import rgstRcmdt from '../../../../components/frm_main/wkOpnLs/rcmdt/rgstRcmdt.vue';
import rgstRcmdtWrite from '../../../../components/frm_main/wkOpnLs/rcmdt/rgstRcmdtWrite.vue';
import rgstRcmdtDetail from '../../../../components/frm_main/wkOpnLs/rcmdt/rgstRcmdtDetail.vue';

Vue.use(device)
Vue.use(VueRouter)
Vue.config.devtools = true;

const routes = [
    { path: '/', component: rgstRcmdt},
    { path: '/write', component: rgstRcmdtWrite, name:"rgstRcmdtWrite"},
    { path: '/write/:sugest_sn', component: rgstRcmdtWrite, name:"rgstRcmdtUpdate"},
    { path: '/detail/:sugest_sn', component: rgstRcmdtDetail, name:"rgstRcmdtDetail"},
    // { path: '/write', component: policyWrite},
]

const router = new VueRouter({
    hash: false,
    routes
})

new Vue({ 
    el: '#scope-rgstRcmdt',
    mounted: function() {
        let vm = this;
        if(vm.$device.ios != false || vm.$device.android != false){
            window.location.href= "/m" + window.location.pathname;
        }
    },
    router, store
}).$mount('#scope-rgstRcmdt')