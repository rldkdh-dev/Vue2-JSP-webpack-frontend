import 'es6-promise/auto'
import Vue from 'vue';
import VueRouter from 'vue-router';
import { createRouter, createWebHashHistory } from 'vue-router'
import device from "vue-device-detector";
import Axios from 'axios'
import paging from '../../../components/paging.vue';
import member from '../../../components/frm_admin/member/member.vue';
import store from "../../../store";
import memberwrite from '../../../components/frm_admin/member/memberwrite.vue';
import memberdetail from '../../../components/frm_admin/member/memberdetail.vue';

Vue.config.devtools = true;
Vue.component('pager', paging);
Vue.use(VueRouter);
Vue.use(device);

const routes = [    
    { path: '/', component: member, name: 'admin-member',meta: { keepAlive: true }},
    { path: '/detail/:path', component: memberwrite, name: 'memberdetail',meta: { keepAlive: false }},
    { path: '/write', component: memberwrite, name: 'memberwrite',meta: { keepAlive: false }},
]

const router = new VueRouter({ 
    hash: false,
    routes
})

const app = new Vue({
    el: '#scope-admin-member',
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
}).$mount('#scope-admin-member')