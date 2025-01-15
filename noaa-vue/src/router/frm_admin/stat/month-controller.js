import 'es6-promise/auto'
import Vue from 'vue';
import VueRouter from 'vue-router';
import { createRouter, createWebHashHistory } from 'vue-router'
import device from "vue-device-detector";
import Axios from 'axios'
import paging from '../../../components/paging.vue';
import store from "../../../store";
import month from '../../../components/frm_admin/stat/month.vue';
// import monthwrite from '../../../components/frm_admin/stat/monthwrite.vue';
// import monthdetail from '../../../components/frm_admin/stat/monthdetail.vue';

Vue.config.devtools = true;
Vue.component('pager', paging);
Vue.use(VueRouter);
Vue.use(device);

const routes = [    
    { path: '/', component: month, name: 'admin-stat-month',meta: { keepAlive: true }},
    // { path: '/:sn', component: monthwrite, name: 'monthdetail', meta: { keepAlive: false }},
    // { path: '/write', component: monthwrite, name: 'monthwrite',meta: { keepAlive: false }},
]

const router = new VueRouter({ 
    hash: false,
    routes
})

const app = new Vue({
    el: '#scope-admin-month',
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
}).$mount('#scope-admin-month')