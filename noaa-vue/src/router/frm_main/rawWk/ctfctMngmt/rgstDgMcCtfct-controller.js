import 'es6-promise/auto'
import Vue from 'vue';
import VueRouter from 'vue-router';
import Axios from 'axios';
import device from "vue-device-detector";
import store from "../../../../store";
import rgstDgMcCtfct from '../../../../components/frm_main/rawWk/ctfctMngmt/rgstDgMcCtfct.vue';
import rgstDgMcCtfctWrite from '../../../../components/frm_main/rawWk/ctfctMngmt/rgstDgMcCtfctWrite.vue';
import rgstDgMcCtfctDetail from '../../../../components/frm_main/rawWk/ctfctMngmt/rgstDgMcCtfctDetail.vue';

Vue.use(device)
Vue.use(VueRouter)
Vue.config.devtools = true;

const routes = [
    { path: '/', component: rgstDgMcCtfct},
    { path: '/write', component: rgstDgMcCtfctWrite, name:'rgstDgMcCtfctWrite'},
    { path: '/write/:crtfct_sn', component: rgstDgMcCtfctWrite, name:'rgstDgMcCtfctUpdate'},
    { path: '/detail/:crtfct_sn', component: rgstDgMcCtfctDetail, name:'rgstDgMcCtfctDetail'},
    // { path: '/write', component: policyWrite},
]

const router = new VueRouter({
    hash: false,
    routes
})

new Vue({ 
    el: '#scope-rgstDgMcCtfct',
    mounted: function() {
        let vm = this;
        if(vm.$device.ios != false || vm.$device.android != false){
            window.location.href= "/m" + window.location.pathname;
        }
    },
    router, store
}).$mount('#scope-rgstDgMcCtfct')