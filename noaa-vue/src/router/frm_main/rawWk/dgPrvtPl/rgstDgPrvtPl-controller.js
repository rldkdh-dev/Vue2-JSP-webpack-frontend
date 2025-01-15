import 'es6-promise/auto'
import Vue from 'vue';
import VueRouter from 'vue-router';
import Axios from 'axios';
import device from "vue-device-detector";
import store from "../../../../store";
import rgstDgPrvtPl from '../../../../components/frm_main/rawWk/dgPrvtPl/rgstDgPrvtPl.vue';
import rgstDgPrvtPlWrite from '../../../../components/frm_main/rawWk/dgPrvtPl/rgstDgPrvtPlWrite.vue';
import rgstDgPrvtPlDetail from '../../../../components/frm_main/rawWk/dgPrvtPl/rgstDgPrvtPlDetail.vue';

Vue.use(device)
Vue.use(VueRouter)
Vue.config.devtools = true;

const routes = [
    { path: '/', component: rgstDgPrvtPl},
    { path: '/write', component: rgstDgPrvtPlWrite, name:'rgstDgPrvtPlWrite'},
    { path: '/write/:actpln_sn', component: rgstDgPrvtPlWrite, name:'rgstDgPrvtPlUpdate'},
    { path: '/detail/:actpln_sn', component: rgstDgPrvtPlDetail, name: 'rgstDgPrvtPlDetail'},

]

const router = new VueRouter({
    hash: false,
    routes
})

new Vue({ 
    el: '#scope-rgstDgPrvtPl',
    mounted: function() {
        let vm = this;
        if(vm.$device.ios != false || vm.$device.android != false){
            window.location.href= "/m" + window.location.pathname;
        }
    },
    router, store
}).$mount('#scope-rgstDgPrvtPl')