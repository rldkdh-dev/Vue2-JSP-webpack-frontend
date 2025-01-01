import 'es6-promise/auto'
import Vue from 'vue';
import VueRouter from 'vue-router';
import Axios from 'axios';
import device from "vue-device-detector";
import store from "../../../../store";
import rgstChkPoint from '../../../../components/frm_main/chkHthAct/mngSftChk/rgstChkPoint.vue';
import rgstChkPointWrite from '../../../../components/frm_main/chkHthAct/mngSftChk/rgstChkPointWrite.vue';
import rgstChkPointDetail from '../../../../components/frm_main/chkHthAct/mngSftChk/rgstChkPointDetail.vue';

Vue.use(device)
Vue.use(VueRouter)
Vue.config.devtools = true;

const routes = [
    { path: '/', component: rgstChkPoint},
    { path: '/write', component: rgstChkPointWrite},
    { path: '/update/:chck_sn', component: rgstChkPointWrite, name:'rgstChkPointWrite'},
    { path: '/detail/:chck_sn', component: rgstChkPointDetail, name:'rgstChkPointDetail'},
]

const router = new VueRouter({
    hash: false,
    routes
})

new Vue({ 
    el: '#scope-rgstChkPoint',
    mounted: function() {
        let vm = this;
        if(vm.$device.ios != false || vm.$device.android != false){
            window.location.href= "/m" + window.location.pathname;
        }
    },
    router, store
}).$mount('#scope-rgstChkPoint')