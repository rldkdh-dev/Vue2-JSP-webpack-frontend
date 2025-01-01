import 'es6-promise/auto'
import Vue from 'vue';
import VueRouter from 'vue-router';
import Axios from 'axios';
import device from "vue-device-detector";
import store from "../../../../store";
import rgstWkPl from '../../../../components/frm_main/rawWk/wkPl/rgstWkPl.vue';
import rgstWkPlWrite from '../../../../components/frm_main/rawWk/wkPl/rgstWkPlWrite.vue';
import rgstWkPlDetail from '../../../../components/frm_main/rawWk/wkPl/rgstWkPlDetail.vue';

Vue.use(device)
Vue.use(VueRouter)
Vue.config.devtools = true;

const routes = [
    { path: '/', component: rgstWkPl},
    { path: '/write/', component: rgstWkPlWrite, name:"rgstWkPlWrite"},
    { path: '/write/:job_actpln_sn', component: rgstWkPlWrite, name:"rgstWkPlUpdate"},
    { path: '/Detail/:job_actpln_sn', component: rgstWkPlDetail, name: "rgstWkPlDetail"},
]

const router = new VueRouter({
    hash: false,
    routes
})

new Vue({ 
    el: '#scope-rgstWkPl',
    mounted: function() {
        let vm = this;
        if(vm.$device.ios != false || vm.$device.android != false){
            window.location.href= "/m" + window.location.pathname;
        }
    },
    router, store
}).$mount('#scope-rgstWkPl')