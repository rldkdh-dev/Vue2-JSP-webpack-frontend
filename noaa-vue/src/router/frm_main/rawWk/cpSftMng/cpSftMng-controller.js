import 'es6-promise/auto'
import Vue from 'vue';
import VueRouter from 'vue-router';
import Axios from 'axios';
import device from "vue-device-detector";
import store from "../../../../store";
import cpSftMng from '../../../../components/frm_main/rawWk/cpSftMng/cpSftMng.vue';
//import actplnPg from '../../../../components/frm_main/rawWk/cpSftMng/actplnPg.vue';

Vue.use(device)
Vue.use(VueRouter)
Vue.config.devtools = true;

const routes = [
    { path: '/', component: cpSftMng}
    // { path: '/urlCntnCdPg/:bplc_nm', component: actplnPg},
    //{ path: '/actplnPg/:bplc_sn', component: actplnPg}
];

const router = new VueRouter({
    hash: false,
    routes
});

new Vue({ 
    el: '#scope-cpSftMng',
    mounted: function() {
        // let vm = this;
        // if(vm.$device.ios != false || vm.$device.android != false){
        //     window.location.href= "/m" + window.location.pathname;
        // }

    },
    router, store
});
//.$mount('#scope-cpSftMng');