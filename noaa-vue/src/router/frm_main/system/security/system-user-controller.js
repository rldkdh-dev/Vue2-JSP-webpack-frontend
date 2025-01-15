import 'es6-promise/auto'
import Vue from 'vue';
import VueRouter from 'vue-router';
import Axios from 'axios';
import device from "vue-device-detector";
import store from "../../../../store";
import systemUserList from '../../../../components/frm_main/system/security/systemUserList.vue';
import systemUserDetail from '../../../../components/frm_main/system/security/systemUserDetail.vue';
import departmentPopup from '../../../../components/frm_main/popup/department_popup.vue';

Vue.use(device)
Vue.use(VueRouter)
Vue.config.devtools = true;

const routes = [
    { path: '/', component: systemUserList},
    { path: '/detail/:LOGIN_ID', component: systemUserDetail, name: 'systemUserDetail'},
    { path: '/departmentPopup', component: departmentPopup, name: 'departmentPopup'}
    // ,
    // { path: '/write', component: noticeWrite, name: 'noticeWrite'},
    // { path: '/write/:notice_sn', component: noticeWrite, name: 'noticeUpdate'},
    // { path: '/detail/:notice_sn', component: noticeDetail, name: 'noticeDetail'}
]

const router = new VueRouter({
    hash: false,
    routes
})

new Vue({ 
    router, store
}).$mount('#scope-systemUserList')