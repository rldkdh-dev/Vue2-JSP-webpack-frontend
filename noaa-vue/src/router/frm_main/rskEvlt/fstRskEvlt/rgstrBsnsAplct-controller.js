import 'es6-promise/auto'
import Vue from 'vue';
import VueRouter from 'vue-router';
import Axios from 'axios';
import device from "vue-device-detector";
import store from "../../../../store";
import rgstrBsnsAplct from '../../../../components/frm_main/rskEvlt/fstRskEvlt/rgstrBsnsAplct.vue';
import rgstrBsnsAplctWrite from '../../../../components/frm_main/rskEvlt/fstRskEvlt/rgstrBsnsAplctWrite.vue';
import rgstrBsnsAplctDetail from '../../../../components/frm_main/rskEvlt/fstRskEvlt/rgstrBsnsAplctDetail.vue';

Vue.use(device)
Vue.use(VueRouter)
Vue.config.devtools = true;

const routes = [
    { path: '/', component: rgstrBsnsAplct,meta: { keepAlive: true }},
    { path: '/write', component: rgstrBsnsAplctWrite,meta: { keepAlive: false }},
    { path: '/write/:bplc_sn', component: rgstrBsnsAplctWrite,meta: { keepAlive: false }},
    { path: '/write/:bplc_sn/:mtg_sn', component: rgstrBsnsAplctWrite,meta: { keepAlive: false }},
    { path: '/detail/:bplc_sn/:mtg_sn', component: rgstrBsnsAplctDetail,meta: { keepAlive: false }},
]

const router = new VueRouter({
    hash: false,
    routes
})

new Vue({ 
    el: '#scope-fstRgstrBsnsAplct',
    mounted: function() {
        let vm = this;
        if(vm.$device.ios != false || vm.$device.android != false){
            window.location.href= "/m" + window.location.pathname;
        }
    },
    router, store
}).$mount('#scope-fstRgstrBsnsAplct')