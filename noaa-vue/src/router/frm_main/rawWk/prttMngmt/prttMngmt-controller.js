import 'es6-promise/auto'
import Vue from 'vue';
import VueRouter from 'vue-router';
import Axios from 'axios';
import device from "vue-device-detector";
import store from "../../../../store";
import prttMngmt from '../../../../components/frm_main/rawWk/prttMngmt/prttMngmt.vue';
import prttMngmtWrite from '../../../../components/frm_main/rawWk/prttMngmt/prttMngmtWrite.vue';
import prttMngmtDetail from '../../../../components/frm_main/rawWk/prttMngmt/prttMngmtDetail.vue';

Vue.use(device)
Vue.use(VueRouter)
Vue.config.devtools = true;

const routes = [
    { path: '/', component: prttMngmt, name: 'prttMngmt'},
    { path: '/write', component: prttMngmtWrite, name: 'prttMngmtWrite'},
    { path: '/write/:prtc_eqpmnt_sn', component: prttMngmtWrite, name: 'prttMngmtUpdate'},
    { path: '/detail/:prtc_eqpmnt_sn', component: prttMngmtDetail, name: 'prttMngmtDetail'},
]

const router = new VueRouter({
    hash: false,
    routes
})

new Vue({ 
    el: '#scope-prttMngmt',
    mounted: function() {
        let vm = this;
        if(vm.$device.ios != false || vm.$device.android != false){
            window.location.href= "/m" + window.location.pathname;
        }
    },
    router, store
}).$mount('#scope-prttMngmt')