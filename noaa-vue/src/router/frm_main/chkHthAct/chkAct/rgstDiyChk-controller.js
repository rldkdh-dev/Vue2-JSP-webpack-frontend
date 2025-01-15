import 'es6-promise/auto'
import Vue from 'vue';
import VueRouter from 'vue-router';
import Axios from 'axios';
import device from "vue-device-detector";
import store from "../../../../store";
import rgstDiyChk from '../../../../components/frm_main/chkHthAct/chkAct/rgstDiyChk.vue';
import rgstDiyChkWrite from '../../../../components/frm_main/chkHthAct/chkAct/rgstDiyChkWrite.vue';
import rgstDiyChkDetail from '../../../../components/frm_main/chkHthAct/chkAct/rgstDiyChkDetail.vue';

Vue.use(device)
Vue.use(VueRouter)
Vue.config.devtools = true;

const routes = [
    { path: '/', component: rgstDiyChk},
    { path: '/write', component: rgstDiyChkWrite},
    { path: '/write/:sn', component: rgstDiyChkWrite},
    { path: '/detail/:sn', component: rgstDiyChkDetail},
]

const router = new VueRouter({
    hash: false,
    routes
})

new Vue({ 
    el: '#scope-rgstDiyChk',
    mounted: function() {
        let vm = this;
        if(vm.$device.ios != false || vm.$device.android != false){
            window.location.href= "/m" + window.location.pathname;
        }
    },
    router, store
}).$mount('#scope-rgstDiyChk')