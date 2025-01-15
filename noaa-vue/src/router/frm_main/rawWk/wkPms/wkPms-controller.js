import 'es6-promise/auto'
import Vue from 'vue';
import VueRouter from 'vue-router';
import Axios from 'axios';
import device from "vue-device-detector";
import store from "../../../../store";
import wkPms from '../../../../components/frm_main/rawWk/wkPms/wkPms.vue';
import wkPmsWrite from '../../../../components/frm_main/rawWk/wkPms/wkPmsWrite.vue';
import wkPmsDetail from '../../../../components/frm_main/rawWk/wkPms/wkPmsDetail.vue';


Vue.use(device);
Vue.use(VueRouter);
Vue.config.devtools = true;

const routes = [
    { path: '/', component: wkPms},
    { path: '/write/', component: wkPmsWrite, name:"wkPmsWrite"},
    { path: '/write/:job_rpmsn_sn/:job_rpmsn_no', component: wkPmsWrite, name:"wkPmsUpdate"},
    { path: '/detail/:job_rpmsn_sn/:job_rpmsn_no', component: wkPmsDetail, name: "wkPmsDetail"},
];

const router = new VueRouter({
    hash: false,
    routes
});

new Vue({ 
    el: '#scope-wkPms',
    mounted: function() {
        let vm = this;
        if(vm.$device.ios != false || vm.$device.android != false){
            window.location.href= "/m" + window.location.pathname;
        }
    },
    router, store
});
//.$mount('#scope-rgstWkPms')