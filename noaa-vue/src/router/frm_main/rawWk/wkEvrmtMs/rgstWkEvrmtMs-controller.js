import 'es6-promise/auto'
import Vue from 'vue';
import VueRouter from 'vue-router';
import Axios from 'axios';
import device from "vue-device-detector";
import store from "../../../../store";
import rgstWkEvrmtMs from '../../../../components/frm_main/rawWk/wkEvrmtMs/rgstWkEvrmtMs.vue';
import rgstWkEvrmtMsWrite from '../../../../components/frm_main/rawWk/wkEvrmtMs/rgstWkEvrmtMsWrite.vue';
import rgstWkEvrmtMsDetail from '../../../../components/frm_main/rawWk/wkEvrmtMs/rgstWkEvrmtMsDetail.vue';


Vue.use(device)
Vue.use(VueRouter)
Vue.config.devtools = true;

const routes = [
    { path: '/', component: rgstWkEvrmtMs},
    { path: '/write', component: rgstWkEvrmtMsWrite, name: 'rgstWkEvrmtMsWrite'},
    { path: '/write/:msrmt_sn', component: rgstWkEvrmtMsWrite, name: 'rgstWkEvrmtMsUpdate'},
    { path: '/detail/:msrmt_sn', component: rgstWkEvrmtMsDetail, name: 'rgstWkEvrmtMsDetail'},

]

const router = new VueRouter({
    hash: false,
    routes
})

new Vue({ 
    el: '#scope-rgstWkEvrmtMs',
    mounted: function() {
        let vm = this;
        if(vm.$device.ios != false || vm.$device.android != false){
            window.location.href= "/m" + window.location.pathname;
        }
    },
    router, store
}).$mount('#scope-rgstWkEvrmtMs')