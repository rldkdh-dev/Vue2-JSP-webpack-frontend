import 'es6-promise/auto'
import Vue from 'vue';
import VueRouter from 'vue-router';
import Axios from 'axios';
import device from "vue-device-detector";
import store from "../../../store";
import sign from '../../../components/frm_main/main/sign.vue';

Vue.use(device)
Vue.use(VueRouter)
Vue.config.devtools = true;

const routes = [
    { path: '/', component: sign},
    // { path: '/write', component: signWrite},
]

const router = new VueRouter({
    hash: false,
    routes
})

new Vue({ 
    el: '#scope-sign',
    mounted: function() {
        let vm = this;
        if(vm.$device.ios != false || vm.$device.android != false){
            window.location.href= "/m" + window.location.pathname;
        }
    },
    router, store
});
//.$mount('#scope-sign')