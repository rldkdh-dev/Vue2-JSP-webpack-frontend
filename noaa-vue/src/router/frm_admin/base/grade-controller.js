import 'es6-promise/auto'
import Vue from 'vue';
import VueRouter from 'vue-router';
import { createRouter, createWebHashHistory } from 'vue-router'
import device from "vue-device-detector";
import Axios from 'axios'
import paging from '../../../components/paging.vue';
import store from "../../../store";
import grade from '../../../components/frm_admin/base/grade.vue';
import GradeDetail from '../../../components/frm_admin/base/gradeDetail.vue';
// import gradewrite from '../../../components/frm_admin/base/gradewrite.vue';
// import gradedetail from '../../../components/frm_admin/base/gradedetail.vue';

Vue.config.devtools = true;
Vue.component('pager', paging);
Vue.use(VueRouter);
Vue.use(device);

const routes = [    
    { path: '/', component: grade, name: 'admin-grade',meta: { keepAlive: true }},
    { path: '/detail/:ym_calcu_basic', component: GradeDetail, name: 'gradedetail',meta: { keepAlive: false }},
    // { path: '/write', component: gradewrite, name: 'gradewrite',meta: { keepAlive: false }},
]

const router = new VueRouter({ 
    hash: false,
    routes
})

const app = new Vue({
    el: '#scope-admin-grade',
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
}).$mount('#scope-admin-grade')