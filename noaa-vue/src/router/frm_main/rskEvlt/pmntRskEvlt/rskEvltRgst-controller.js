import 'es6-promise/auto'
import Vue from 'vue';
import VueRouter from 'vue-router';
import Axios from 'axios';
import device from "vue-device-detector";
import store from "../../../../store";
import rskEvltRgst from '../../../../components/frm_main/rskEvlt/pmntRskEvlt/rskEvltRgst.vue';
import rskEvltRgstWrite from '../../../../components/frm_main/rskEvlt/pmntRskEvlt/rskEvltRgstWrite.vue';
import rskEvltRgstDetail from '../../../../components/frm_main/rskEvlt/pmntRskEvlt/rskEvltRgstDetail.vue';

Vue.use(device)
Vue.use(VueRouter)
Vue.config.devtools = true;

const routes = [
    { path: '/', component: rskEvltRgst},
    { path: '/write/:sn', component: rskEvltRgstWrite},
    { path: '/detail/:sn', component: rskEvltRgstDetail},
]

const router = new VueRouter({
    hash: false,
    routes
})

new Vue({ 
    el: '#scope-rskEvltRgst',
    mounted: function() {
        let vm = this;
        if(vm.$device.ios != false || vm.$device.android != false){
            window.location.href= "/m" + window.location.pathname;
        }
    },
    router, store
}).$mount('#scope-rskEvltRgst')