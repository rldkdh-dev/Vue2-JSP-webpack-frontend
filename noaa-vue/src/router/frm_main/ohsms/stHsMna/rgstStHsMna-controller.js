import 'es6-promise/auto'
import Vue from 'vue';
import VueRouter from 'vue-router';
import Axios from 'axios';
import device from "vue-device-detector";
import store from "../../../../store";
import rgstStHsMna from '../../../../components/frm_main/ohsms/stHsMna/rgstStHsMna.vue';
import rgstStHsMnaWrite from '../../../../components/frm_main/ohsms/stHsMna/rgstStHsMnaWrite.vue';

Vue.use(device)
Vue.use(VueRouter)
Vue.config.devtools = true;

const routes = [
    { path: '/', component: rgstStHsMna},
    { path: '/write', component: rgstStHsMnaWrite, name:"rgstStHsMnaWrite"},
]

const router = new VueRouter({
    hash: false,
    routes
})

new Vue({ 
    el: '#scope-rgstStHsMna',
    mounted: function() {
        let vm = this;
        if(vm.$device.ios != false || vm.$device.android != false){
            window.location.href= "/m" + window.location.pathname;
        }
    },
    router, store
}).$mount('#scope-rgstStHsMna')