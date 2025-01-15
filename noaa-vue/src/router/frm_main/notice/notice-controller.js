import 'es6-promise/auto'
import Vue from 'vue';
import VueRouter from 'vue-router';
import Axios from 'axios';
import device from "vue-device-detector";
import store from "../../../store";
import noticeList from '../../../components/frm_main/notice/noticeList.vue';
import noticeWrite from '../../../components/frm_main/notice/noticeWrite.vue';
import noticeDetail from '../../../components/frm_main/notice/noticeDetail.vue';

Vue.use(device)
Vue.use(VueRouter)
Vue.config.devtools = true;

const routes = [
    { path: '/', component: noticeList},
    { path: '/write', component: noticeWrite, name: 'noticeWrite'},
    { path: '/write/:notice_sn', component: noticeWrite, name: 'noticeUpdate'},
    { path: '/detail/:notice_sn', component: noticeDetail, name: 'noticeDetail'}
]

const router = new VueRouter({
    hash: false,
    routes
})

new Vue({ 
    router, store
}).$mount('#scope-notice')