import 'es6-promise/auto'
import Vue from 'vue';
import VueRouter from 'vue-router';
import Axios from 'axios';
import device from "vue-device-detector";
import store from "../../../../store";
import rgstPlImplAct from '../../../../components/frm_main/rawWk/mau/rgstPlImplAct.vue';
import rgstPlImplActWrite from '../../../../components/frm_main/rawWk/mau/rgstPlImplActWrite.vue';
import rgstPlImplActDetail from '../../../../components/frm_main/rawWk/mau/rgstPlImplActDetail.vue';

Vue.use(device)
Vue.use(VueRouter)
Vue.config.devtools = true;

const routes = [
    { path: '/', component: rgstPlImplAct},
    { path: '/write', component: rgstPlImplActWrite},
    { path: '/detail/:sn/:b_sn', component: rgstPlImplActDetail, name:'rgstPlImplActDetail'},
]

const router = new VueRouter({
    hash: false,
    routes
})

new Vue({ 
    el: '#scope-rgstPlImplAct',
    mounted: function() {
        let vm = this;
        if(vm.$device.ios != false || vm.$device.android != false){
            window.location.href= "/m" + window.location.pathname;
        }
    },
    router, store
}).$mount('#scope-rgstPlImplAct')