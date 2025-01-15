import 'es6-promise/auto'
import Vue from 'vue';
import VueRouter from 'vue-router';
import { createRouter, createWebHashHistory } from 'vue-router'
import device from "vue-device-detector";
import Axios from 'axios'
import paging from '../../../components/paging.vue';
import store from "../../../store";
import player from '../../../components/frm_admin/contents/player.vue';
import playerwrite from '../../../components/frm_admin/contents/playerwrite.vue';
// import playerdetail from '../../../components/frm_admin/contents/playerdetail.vue';

Vue.config.devtools = true;
Vue.component('pager', paging);
Vue.use(VueRouter);
Vue.use(device);

const routes = [    
    { path: '/', component: player, name: 'admin-player',meta: { keepAlive: true }},
    // { path: '/:sn', component: playerwrite, name: 'playerdetail', meta: { keepAlive: false }},
    { path: '/write', component: playerwrite, name: 'playerwrite',meta: { keepAlive: false }},
]

const router = new VueRouter({ 
    hash: false,
    routes
})

const app = new Vue({
    el: '#scope-admin-player',
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
}).$mount('#scope-admin-player')