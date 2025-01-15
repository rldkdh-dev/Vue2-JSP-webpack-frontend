import 'es6-promise/auto'
import Vue from 'vue';
import VueRouter from 'vue-router';
import { createRouter, createWebHashHistory } from 'vue-router'
import device from "vue-device-detector";
import Axios from 'axios'
import paging from '../../../components/paging.vue';
import store from "../../../store";
import week from '../../../components/frm_admin/stat/week.vue';
// import weekwrite from '../../../components/frm_admin/stat/weekwrite.vue';
// import weekdetail from '../../../components/frm_admin/stat/weekdetail.vue';

Vue.config.devtools = true;
Vue.component('pager', paging);
Vue.use(VueRouter);
Vue.use(device);

const routes = [    
    { path: '/', component: week, name: 'admin-stat-week',meta: { keepAlive: true }},
    // { path: '/:sn', component: weekwrite, name: 'weekdetail', meta: { keepAlive: false }},
    // { path: '/write', component: weekwrite, name: 'weekwrite',meta: { keepAlive: false }},
]

const router = new VueRouter({ 
    hash: false,
    routes
})

const app = new Vue({
    el: '#scope-admin-week',
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
}).$mount('#scope-admin-week')