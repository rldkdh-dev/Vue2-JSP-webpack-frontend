import 'es6-promise/auto'
import Vue from 'vue';
import VueRouter from 'vue-router';
import Axios from 'axios';
import device from "vue-device-detector";
import store from "../../../store";
import index from '../../../components/frm_main/main/index.vue';
import sign from '../../../components/frm_main/main/sign.vue';
// import menu from '../main-menu-controller.js';

Vue.use(device)
Vue.use(VueRouter)
Vue.config.devtools = true;

const routes = [
    { path: '/', component: index},
    { path: '/sign', component: sign},
]

const router = new VueRouter({
    hash: false,
    routes
})

new Vue({ 
    router, store,
    el: '#scope-index',
    mounted: function() {
        let vm = this;
        if(vm.$device.ios != false || vm.$device.android != false){
            window.location.href= "/m" + window.location.pathname;
        }
    }
});
//.$mount('#scope-index')
