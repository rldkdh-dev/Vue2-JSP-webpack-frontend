import 'es6-promise/auto'
import Vue from 'vue';
import VueRouter from 'vue-router';
import Axios from 'axios';
import device from "vue-device-detector";
import store from "../../../../store";
import mngmtOursAcdtCs from '../../../../components/frm_main/rskEvlt/oursAcdtCs/mngmtOursAcdtCs.vue';
import rgstOursAcdtCs from '../../../../components/frm_main/rskEvlt/oursAcdtCs/rgstOursAcdtCs.vue';
import rgstOursAcdtCsDetail from '../../../../components/frm_main/rskEvlt/oursAcdtCs/rgstOursAcdtCsDetail.vue';

Vue.use(device)
Vue.use(VueRouter)
Vue.config.devtools = true;

const routes = [
    { path: '/', component: mngmtOursAcdtCs},
    { path: '/write', component: rgstOursAcdtCs},
    { path: '/update/:acdnt_sn', component: rgstOursAcdtCs, name:'rgstOursAcdtCsUpdate'},
    { path: '/detail/:acdnt_sn', component: rgstOursAcdtCsDetail, name:'rgstOursAcdtCsDetail'},
]

const router = new VueRouter({
    hash: false,
    routes
})

new Vue({ 
    el: '#scope-mngmtOursAcdtCs',
    mounted: function() {
        let vm = this;
        if(vm.$device.ios != false || vm.$device.android != false){
            window.location.href= "/m" + window.location.pathname;
        }
    },
    router, store
}).$mount('#scope-mngmtOursAcdtCs')