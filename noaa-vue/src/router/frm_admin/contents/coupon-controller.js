import 'es6-promise/auto'
import Vue from 'vue';
import VueRouter from 'vue-router';
import { createRouter, createWebHashHistory } from 'vue-router'
import device from "vue-device-detector";
import Axios from 'axios'
import paging from '../../../components/paging.vue';
import store from "../../../store";
import coupon from '../../../components/frm_admin/contents/coupon.vue';
import coupondetail from '../../../components/frm_admin/contents/coupondetail.vue';
import couponwrite from '../../../components/frm_admin/contents/couponwrite.vue';
Vue.config.devtools = true;
Vue.component('pager', paging);
Vue.use(VueRouter);
Vue.use(device);

const routes = [
    { path: '/', component: coupon, name: 'coupon',meta: { keepAlive: true }},
	{ path: '/:sn', component: coupondetail, name: 'coupondetail',meta: { keepAlive: false }},
    { path: '/write', component: couponwrite, name: 'couponwrite' ,meta: { keepAlive: false }}, //쿠폰 등록 로직 뷰
    //{ path: '/detail', component:coupondetail, name: 'coupondetail', meta: { keepAlive: false }}, //쿠폰 등록 상세 뷰
];wwwwwww

const router = new VueRouter({
    mode: history,
    routes
})

const app = new Vue({
    el: '#scope_admin-coupon',
    data: function() {
        return {
	router,store
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
}).$mount('#scope_admin-coupon');

/*const coupondetail = new Vue({
    el: '#scope_coupon-detail',
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
    router,contents
}).$mount('#scope_coupon-detail')

const couponwrite = new Vue({
    el: '#scope_coupon-write',
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
    router,contents
}).$mount('#scope_coupon-write')
*/
