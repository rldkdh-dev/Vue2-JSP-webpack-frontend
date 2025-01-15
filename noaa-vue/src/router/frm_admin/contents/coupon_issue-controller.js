import 'es6-promise/auto'
import Vue from 'vue';
import VueRouter from 'vue-router';
import { createRouter, createWebHashHistory } from 'vue-router'
import device from "vue-device-detector";
import Axios from 'axios'
import paging from '../../../components/paging.vue';
import store from "../../../store";
import issue from '../../../components/frm_admin/contents/issue.vue';
import issuedetail from '../../../components/frm_admin/contents/issuedetail.vue';

Vue.config.devtools = true;
Vue.component('pager', paging);
Vue.use(VueRouter);
Vue.use(device);

const routes = [
    { path: '/', component: issue, name: 'issue',meta: { keepAlive: true }},
    { path: '/detail', component: issuedetail, name: 'issuedetail', meta: { keepAlive: false }},
    //{ path: '/write', component: issuewrite, name: 'issuewrite',meta: { keepAlive: false }},
]

const router = new VueRouter({
    hash: false,
    routes
})

const app = new Vue({
    el: '#scope_issue-coupon',
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
}).$mount('#scope_issue-coupon')
