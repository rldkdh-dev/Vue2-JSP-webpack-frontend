import 'es6-promise/auto'
import Vue from 'vue';
import VueRouter from 'vue-router';
import { createRouter, createWebHashHistory } from 'vue-router'
import device from "vue-device-detector";
import Axios from 'axios'
import paging from '../../../components/paging.vue';
import store from "../../../store";
import game from '../../../components/frm_admin/stat/game.vue';
import gamewrite from '../../../components/frm_admin/stat/gamewrite.vue';
// import gamedetail from '../../../components/frm_admin/stat/gamedetail.vue';

Vue.config.devtools = true;
Vue.component('pager', paging);
Vue.use(VueRouter);
Vue.use(device);

const routes = [    
    { path: '/', component: game, name: 'admin-stat-game',meta: { keepAlive: true }},
    { path: '/:sn', component: gamewrite, name: 'gamedetail', meta: { keepAlive: false }},
    // { path: '/write', component: gamewrite, name: 'gamewrite',meta: { keepAlive: false }},
]

const router = new VueRouter({ 
    hash: false,
    routes
})

const app = new Vue({
    el: '#scope-admin-game',
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
}).$mount('#scope-admin-game')