import 'es6-promise/auto'
import Vue from 'vue';
import VueRouter from 'vue-router';
import { createRouter, createWebHashHistory } from 'vue-router'
import device from "vue-device-detector";
import Axios from 'axios'
import paging from '../../../components/paging.vue';
import store from "../../../store";
import code from "../../../components/frm_admin/sys/code.vue";
import codedetail from "../../../components/frm_admin/sys/codedetail.vue";

Vue.config.devtools = true;
Vue.component('pager', paging);
Vue.use(VueRouter);
Vue.use(device);

const routes = [    
    { path: '/', component: code, name: 'code',meta: { keepAlive: true }},
    { path: '/:id', component: codedetail, name: 'codedetail', meta: { keepAlive: false }},
    // { path: '/write', component: codewrite, name: 'codewrite',meta: { keepAlive: false }},
]

const router = new VueRouter({ 
    hash: false,
    routes
})

const app = new Vue({
    el: '#scope-admin-base-code',
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
}).$mount('#scope-admin-base-code')