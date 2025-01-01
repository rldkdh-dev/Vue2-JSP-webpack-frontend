import 'es6-promise/auto'
import Vue from 'vue';
import VueRouter from 'vue-router';
import Axios from 'axios';
import device from "vue-device-detector";
import store from "../../../../store";
import fstRskEvltRgstrList from '../../../../components/frm_main/rskEvlt/fstRskEvlt/fstRskEvltRgstrList.vue';
import fstRskEvltRgstr from '../../../../components/frm_main/rskEvlt/fstRskEvlt/fstRskEvltRgstr.vue';
import fstRskEvltRgstrWrite from '../../../../components/frm_main/rskEvlt/fstRskEvlt/fstRskEvltRgstrWrite.vue';

Vue.use(device)
Vue.use(VueRouter)
Vue.config.devtools = true;

const routes = [
    { path: '/', component: fstRskEvltRgstrList,meta: { keepAlive: true }},
    { path: '/detail/:bplc_sn/:evl_sn', component: fstRskEvltRgstr,meta: { keepAlive: false }},
    { path: '/write/:bplc_sn/:evl_sn', component: fstRskEvltRgstrWrite,meta: { keepAlive: false }},
    { path: '/write/:bplc_sn', component: fstRskEvltRgstrWrite,meta: { keepAlive: false }},
]

const router = new VueRouter({
    hash: false,
    routes
})

new Vue({ 
    el: '#scope-fstRskEvltRgstr',
    mounted: function() {
        let vm = this;
        if(vm.$device.ios != false || vm.$device.android != false){
            window.location.href= "/m" + window.location.pathname;
        }
    },
    router, store
}).$mount('#scope-fstRskEvltRgstr')