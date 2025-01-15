import 'es6-promise/auto'
import Vue from 'vue';
import VueRouter from 'vue-router';
import Axios from 'axios';
import device from "vue-device-detector";
import store from "../../../../store";
import rgstWpRskEvlt from '../../../../components/frm_main/rskEvlt/pdWpPrcsRskEvlt/rgstWpRskEvlt.vue';
import rgstWpRskEvltWrite from '../../../../components/frm_main/rskEvlt/pdWpPrcsRskEvlt/rgstWpRskEvltWrite.vue';
import rgstWpRskEvltDetail from '../../../../components/frm_main/rskEvlt/pdWpPrcsRskEvlt/rgstWpRskEvltDetail.vue';

Vue.use(device)
Vue.use(VueRouter)
Vue.config.devtools = true;

const routes = [
    { path: '/', component: rgstWpRskEvlt},
    { path: '/write', component: rgstWpRskEvltWrite},
    { path: '/write/:sn', component: rgstWpRskEvltWrite},
    { path: '/detail/:sn', component: rgstWpRskEvltDetail},
]

const router = new VueRouter({
    hash: false,
    routes
})

new Vue({ 
    el: '#scope-rgstWpRskEvlt',
    mounted: function() {
        let vm = this;
        if(vm.$device.ios != false || vm.$device.android != false){
            window.location.href= "/m" + window.location.pathname;
        }
    },
    router, store
}).$mount('#scope-rgstWpRskEvlt')