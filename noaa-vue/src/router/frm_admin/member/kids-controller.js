import 'es6-promise/auto'
import Vue from 'vue';
import VueRouter from 'vue-router';
import { createRouter, createWebHashHistory } from 'vue-router'
import device from "vue-device-detector";
import Axios from 'axios'
import paging from '../../../components/paging.vue';
import store from "../../../store";
import kids from '../../../components/frm_admin/member/kids.vue';
import kidswrite from '../../../components/frm_admin/member/kidswrite.vue';
import kidsdetail from '../../../components/frm_admin/member/kidsdetail.vue';

Vue.config.devtools = true;
Vue.component('pager', paging);
Vue.use(VueRouter);
Vue.use(device);

const routes = [    
    { path: '/', component: kids, name: 'admin-kids',meta: { keepAlive: true }},
    { path: '/detail/:path', component: kidswrite, name: 'kidsdetail',meta: { keepAlive: false }},
    { path: '/write', component: kidswrite, name: 'kidswrite',meta: { keepAlive: false }},
]

const router = new VueRouter({ 
    hash: false,
    routes
})

const app = new Vue({
    el: '#scope-admin-kids',
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
}).$mount('#scope-admin-kids')