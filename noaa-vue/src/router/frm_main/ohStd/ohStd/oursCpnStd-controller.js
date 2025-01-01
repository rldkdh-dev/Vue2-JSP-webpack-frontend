import 'es6-promise/auto'
import Vue from 'vue';
import VueRouter from 'vue-router';
import Axios from 'axios';
import device from "vue-device-detector";
import store from "../../../../store";
import oursCpnStd from '../../../../components/frm_main/ohStd/ohStd/oursCpnStd.vue';
import ohStdWrite from '../../../../components/frm_main/ohStd/ohStdWrite.vue';
import ohStdDetail from '../../../../components/frm_main/ohStd/ohStdDetail.vue';

Vue.use(device)
Vue.use(VueRouter)
Vue.config.devtools = true;

const routes = [
    { path: '/', component: oursCpnStd},
    { path: '/write/', component: ohStdWrite},
    { path: '/write/:sn', component: ohStdWrite},
    { path: '/detail/:sn', component: ohStdDetail},
]

const router = new VueRouter({
    hash: false,
    routes
})

new Vue({ 
    el: '#scope-oursCpnStd',
    mounted: function() {
        let vm = this;
        if(vm.$device.ios != false || vm.$device.android != false){
            window.location.href= "/m" + window.location.pathname;
        }
    },
    router, store
}).$mount('#scope-oursCpnStd')