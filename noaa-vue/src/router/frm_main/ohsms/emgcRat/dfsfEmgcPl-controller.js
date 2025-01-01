import 'es6-promise/auto'
import Vue from 'vue';
import VueRouter from 'vue-router';
import Axios from 'axios';
import device from "vue-device-detector";
import store from "../../../../store";
import dfsfEmgcPl from '../../../../components/frm_main/ohsms/emgcRat/dfsfEmgcPl.vue';
import dfsfEmgcPlWrite from '../../../../components/frm_main/ohsms/emgcRat/dfsfEmgcPlWrite.vue';

Vue.use(device)
Vue.use(VueRouter)
Vue.config.devtools = true;

const routes = [
    { path: '/', component: dfsfEmgcPl},
    { path: '/write', component: dfsfEmgcPlWrite},
]

const router = new VueRouter({
    hash: false,
    routes
})

new Vue({ 
    el: '#scope-dfsfEmgcPl',
    mounted: function() {
        let vm = this;
        if(vm.$device.ios != false || vm.$device.android != false){
            window.location.href= "/m" + window.location.pathname;
        }
    },
    router, store
}).$mount('#scope-dfsfEmgcPl')