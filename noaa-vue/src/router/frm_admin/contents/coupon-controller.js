import 'es6-promise/auto'
import Vue from 'vue';
import VueRouter from 'vue-router';
import { createRouter, createWebHashHistory } from 'vue-router'
import device from "vue-device-detector";
import Axios from 'axios'
import paging from '../../../components/paging.vue';
import store from "../../../store";
import season from '../../../components/frm_admin/contents/coupon.vue';
import seasonwrite from '../../../components/frm_admin/contents/couponwrite.vue';
// import seasondetail from '../../../components/frm_admin/contents/seasondetail.vue';

Vue.config.devtools = true;
Vue.component('pager', paging);
Vue.use(VueRouter);
Vue.use(device);

const routes = [    
    { path: '/', component: season, name: 'admin-coupon',meta: { keepAlive: true }},
    { path: '/:sn', component: seasonwrite, name: 'coupondetail', meta: { keepAlive: false }},
    // { path: '/write', component: seasonwrite, name: 'seasonwrite',meta: { keepAlive: false }},
]

const router = new VueRouter({ 
    hash: false,
    routes
})

const app = new Vue({
    el: '#scope-admin-coupon',
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
}).$mount('#scope-admin-coupon')