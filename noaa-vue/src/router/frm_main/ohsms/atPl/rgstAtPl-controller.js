import 'es6-promise/auto'
import Vue from 'vue';
import VueRouter from 'vue-router';
import Axios from 'axios';
import device from "vue-device-detector";
import store from "../../../../store";
import rgstAtPl from '../../../../components/frm_main/ohsms/atPl/rgstAtPl.vue';
import rgstAtPlWrite from '../../../../components/frm_main/ohsms/atPl/rgstAtPlWrite.vue';
import rgstAtPlDetail from '../../../../components/frm_main/ohsms/atPl/rgstAtPlDetail.vue';


Vue.use(device)
Vue.use(VueRouter)
Vue.config.devtools = true;

const routes = [
    { path: '/', component: rgstAtPl},
    { path: '/write', component: rgstAtPlWrite, name:'rgstAtplWrite'},
    { path: '/write/:plan_sn', component: rgstAtPlWrite, name:'rgstAtplUpdate'},
    { path: '/detail/:plan_sn', component: rgstAtPlDetail, name:'rgstAtplDetail'},
    // { path: '/write', component: policyWrite},
]

const router = new VueRouter({
    hash: false,
    routes
})

new Vue({ 
    el: '#scope-rgstAtPl',
    mounted: function() {
        let vm = this;
        if(vm.$device.ios != false || vm.$device.android != false){
            window.location.href= "/m" + window.location.pathname;
        }
    },
    router, store
}).$mount('#scope-rgstAtPl')