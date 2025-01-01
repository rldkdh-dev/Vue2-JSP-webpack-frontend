import 'es6-promise/auto'
import Vue from 'vue';
import VueRouter from 'vue-router';
import { createRouter, createWebHashHistory } from 'vue-router'
import device from "vue-device-detector";
import Axios from 'axios'
import paging from '../../../components/paging.vue';
import store from "../../../store";
import delivery from '../../../components/frm_admin/delivery/delivery.vue';
import deliverywrite from '../../../components/frm_admin/delivery/deliverywrite.vue';
import deliverydetail from '../../../components/frm_admin/delivery/deliverydetail.vue';

Vue.config.devtools = true;
Vue.component('pager', paging);
Vue.use(VueRouter);
Vue.use(device);

const routes = [    
    { path: '/', component: delivery, name: 'admin-delivery',meta: { keepAlive: true }},
    { path: '/detail/:path', component: deliverywrite, name: 'deliverydetail',meta: { keepAlive: false }},
    { path: '/write', component: deliverywrite, name: 'deliverywrite',meta: { keepAlive: false }},
]

const router = new VueRouter({ 
    hash: false,
    routes
})

const app = new Vue({
    el: '#scope-admin-delivery',
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
}).$mount('#scope-admin-delivery')