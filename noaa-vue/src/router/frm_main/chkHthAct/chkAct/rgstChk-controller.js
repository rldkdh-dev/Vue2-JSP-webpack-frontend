import 'es6-promise/auto'
import Vue from 'vue';
import VueRouter from 'vue-router';
import Axios from 'axios';
import device from "vue-device-detector";
import store from "../../../../store";
import rgstChk from '../../../../components/frm_main/chkHthAct/chkAct/rgstChk.vue';
import rgstChkWrite from '../../../../components/frm_main/chkHthAct/chkAct/rgstChkWrite.vue';
import rgstChkDetail from '../../../../components/frm_main/chkHthAct/chkAct/rgstChkDetail.vue';

Vue.use(device)
Vue.use(VueRouter)
Vue.config.devtools = true;

const routes = [
    { path: '/', component: rgstChk},
    { path: '/write', component: rgstChkWrite},
    { path: '/write/:sn', component: rgstChkWrite},
    { path: '/write/:gbn/:sn', component: rgstChkWrite},
    { path: '/detail/:sn', component: rgstChkDetail},
]

const router = new VueRouter({
    hash: false,
    routes
})

new Vue({ 
    el: '#scope-rgstChk',
    mounted: function() {
        let vm = this;
        if(vm.$device.ios != false || vm.$device.android != false){
            window.location.href= "/m" + window.location.pathname;
        }
    },
    router, store
}).$mount('#scope-rgstChk')