import 'es6-promise/auto'
import Vue from 'vue';
import VueRouter from 'vue-router';
import { createRouter, createWebHashHistory } from 'vue-router'
import device from "vue-device-detector";
import Axios from 'axios'
import paging from '../../../components/paging.vue';
import store from "../../../store";
import team from '../../../components/frm_admin/stat/team.vue';
// import teamwrite from '../../../components/frm_admin/stat/teamwrite.vue';
// import teamdetail from '../../../components/frm_admin/stat/teamdetail.vue';

Vue.config.devtools = true;
Vue.component('pager', paging);
Vue.use(VueRouter);
Vue.use(device);

const routes = [    
    { path: '/', component: team, name: 'admin-stat-team',meta: { keepAlive: true }},
    // { path: '/:sn', component: teamwrite, name: 'teamdetail', meta: { keepAlive: false }},
    // { path: '/write', component: teamwrite, name: 'teamwrite',meta: { keepAlive: false }},
]

const router = new VueRouter({ 
    hash: false,
    routes
})

const app = new Vue({
    el: '#scope-admin-team',
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
}).$mount('#scope-admin-team')