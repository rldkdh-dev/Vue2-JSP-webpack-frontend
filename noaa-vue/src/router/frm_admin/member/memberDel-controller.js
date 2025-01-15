import 'es6-promise/auto'
import Vue from 'vue';
import VueRouter from 'vue-router';
import { createRouter, createWebHashHistory } from 'vue-router'
import device from "vue-device-detector";
import Axios from 'axios'
import paging from '../../../components/paging.vue';
import store from "../../../store";
import memberDel from '../../../components/frm_admin/member/memberDel.vue';
import memberDelwrite from '../../../components/frm_admin/member/memberDelwrite.vue';
import memberDeldetail from '../../../components/frm_admin/member/memberDeldetail.vue';

Vue.config.devtools = true;
Vue.component('pager', paging);
Vue.use(VueRouter);
Vue.use(device);

const routes = [    
    { path: '/', component: memberDel, name: 'admin-memberDel',meta: { keepAlive: true }},
    { path: '/detail/:path', component: memberDelwrite, name: 'memberDeldetail',meta: { keepAlive: false }},
    { path: '/write', component: memberDelwrite, name: 'memberDelwrite',meta: { keepAlive: false }},
]

const router = new VueRouter({ 
    hash: false,
    routes
})

const app = new Vue({
    el: '#scope-admin-memberDel',
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
}).$mount('#scope-admin-memberDel')