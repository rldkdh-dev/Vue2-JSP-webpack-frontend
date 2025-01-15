import 'es6-promise/auto'
import Vue from 'vue';
import VueRouter from 'vue-router';
import device from "vue-device-detector";
import Axios from 'axios'
import paging from '../../../components/paging.vue';
import store from "../../../store";
import manage from '../../../components/frm_admin/contents/manage.vue';
import managedetail from '../../../components/frm_admin/contents/managedetail.vue';

Vue.config.devtools = true;
Vue.component('pager', paging);
Vue.use(VueRouter);
Vue.use(device);

const routes = [
    { path: '/', component: manage, name: 'manage',meta: { keepAlive: true }},
    { path: '/detail', component: managedetail, name: 'managedetail', meta: { keepAlive: false }},
    //{ path: '/write', component: managewrite, name: 'managewrite',meta: { keepAlive: false }},
]

const router = new VueRouter({
    hash: false,
    routes
})

const app = new Vue({
    el: '#scope_coupon-manage',
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
}).$mount('#scope_coupon-manage')
