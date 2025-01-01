import 'es6-promise/auto'
import Vue from 'vue';
import VueRouter from 'vue-router';
import { createRouter, createWebHashHistory } from 'vue-router'
import device from "vue-device-detector";
import Axios from 'axios'
import paging from '../../../components/paging.vue';
import store from "../../../store";
import point from '../../../components/frm_admin/base/point.vue';
// import pointwrite from '../../../components/frm_admin/base/pointwrite.vue';
// import pointdetail from '../../../components/frm_admin/base/pointdetail.vue';

Vue.config.devtools = true;
Vue.component('pager', paging);
Vue.use(VueRouter);
Vue.use(device);

const routes = [    
    { path: '/', component: point, name: 'admin-point',meta: { keepAlive: true }},
    // { path: '/detail/:path', component: pointwrite, name: 'pointdetail',meta: { keepAlive: false }},
    // { path: '/write', component: pointwrite, name: 'pointwrite',meta: { keepAlive: false }},
]

const router = new VueRouter({ 
    hash: false,
    routes
})

const app = new Vue({
    el: '#scope-admin-point',
    data: function() {
        return {
        }
    },
    mounted: function() {
        let vm = this;
        if(vm.$device.ios != false || vm.$device.android != false){
            window.location.href= "/m" + window.location.pathname;
        }
    },
    methods: {
    },
    router,store
}).$mount('#scope-admin-point')