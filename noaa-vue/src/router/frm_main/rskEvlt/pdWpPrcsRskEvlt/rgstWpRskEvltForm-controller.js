import 'es6-promise/auto'
import Vue from 'vue';
import VueRouter from 'vue-router';
import Axios from 'axios';
import device from "vue-device-detector";
import store from "../../../../store";
import rgstWpRskEvltForm from '../../../../components/frm_main/rskEvlt/pdWpPrcsRskEvlt/rgstWpRskEvltForm.vue';
import rgstWpRskEvltFormWrite from '../../../../components/frm_main/rskEvlt/pdWpPrcsRskEvlt/rgstWpRskEvltFormWrite.vue';
import rgstWpRskEvltFormDetail from '../../../../components/frm_main/rskEvlt/pdWpPrcsRskEvlt/rgstWpRskEvltFormDetail.vue';

Vue.use(device)
Vue.use(VueRouter)
Vue.config.devtools = true;

const routes = [
    { path: '/', component: rgstWpRskEvltForm},
    { path: '/write', component: rgstWpRskEvltFormWrite},
    { path: '/write/:sn', component: rgstWpRskEvltFormWrite},
    { path: '/detail/:sn', component: rgstWpRskEvltFormDetail},
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