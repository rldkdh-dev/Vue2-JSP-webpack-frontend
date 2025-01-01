import 'es6-promise/auto'
import Vue from 'vue';
import VueRouter from 'vue-router';
import Axios from 'axios';
import device from "vue-device-detector";
import store from "../../../../store";
import rgstGPlEvlt from '../../../../components/frm_main/ohsms/gPlEvlt/rgstGPlEvlt.vue';
import rgstGPlEvltWrite from '../../../../components/frm_main/ohsms/gPlEvlt/rgstGPlEvltWrite.vue';
import rgstGPlEvltDetail from '../../../../components/frm_main/ohsms/gPlEvlt/rgstGPlEvltDetail.vue';

Vue.use(device)
Vue.use(VueRouter)
Vue.config.devtools = true;

const routes = [
    { path: '/', component: rgstGPlEvlt},
    { path: '/write', component: rgstGPlEvltWrite},
    { path: '/write/:sn', component: rgstGPlEvltWrite},
    { path: '/detail/:sn', component: rgstGPlEvltDetail},
]

const router = new VueRouter({
    hash: false,
    routes
})

new Vue({ 
    el: '#scope-rgstGPlEvlt',
    mounted: function() {
        let vm = this;
        if(vm.$device.ios != false || vm.$device.android != false){
            window.location.href= "/m" + window.location.pathname;
        }
    },
    router, store
}).$mount('#scope-rgstGPlEvlt')