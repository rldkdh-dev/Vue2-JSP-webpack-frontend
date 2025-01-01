import 'es6-promise/auto'
import Vue from 'vue';
import VueRouter from 'vue-router';
import Axios from 'axios';
import device from "vue-device-detector";
import store from "../../../../store";
import mngmtOtherAcdtCs from '../../../../components/frm_main/rskEvlt/otherAcdtCs/mngmtOtherAcdtCs.vue';
import rgstOtherAcdtCs from '../../../../components/frm_main/rskEvlt/otherAcdtCs/rgstOtherAcdtCs.vue';
import rgstOtherAcdtCsDetail from '../../../../components/frm_main/rskEvlt/otherAcdtCs/rgstOtherAcdtCsDetail.vue';

Vue.use(device)
Vue.use(VueRouter)
Vue.config.devtools = true;

const routes = [
    { path: '/', component: mngmtOtherAcdtCs},
    { path: '/write', component: rgstOtherAcdtCs},
    { path: '/update/:othcmpny_acdnt_sn', component: rgstOtherAcdtCs, name:'rgstOtherAcdtCsUpdate'},
    { path: '/detail/:othcmpny_acdnt_sn', component: rgstOtherAcdtCsDetail, name:'rgstOtherAcdtCsDetail'},
]

const router = new VueRouter({
    hash: false,
    routes
})

new Vue({ 
    el: '#scope-mngmtOtherAcdtCs',
    mounted: function() {
        let vm = this;
        if(vm.$device.ios != false || vm.$device.android != false){
            window.location.href= "/m" + window.location.pathname;
        }
    },
    router, store
}).$mount('#scope-mngmtOtherAcdtCs')