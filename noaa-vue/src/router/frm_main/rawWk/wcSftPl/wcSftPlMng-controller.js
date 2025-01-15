import 'es6-promise/auto'
import Vue from 'vue';
import VueRouter from 'vue-router';
import Axios from 'axios';
import device from "vue-device-detector";
import store from "../../../../store";
import wcSftPlMng from '../../../../components/frm_main/rawWk/wcSftPl/wcSftPlMng.vue';
import wcSftPlWrite from '../../../../components/frm_main/rawWk/wcSftPl/wcSftPlWrite.vue';
import wcSftPlDetail from '../../../../components/frm_main/rawWk/wcSftPl/wcSftPlDetail.vue';

Vue.use(device);
Vue.use(VueRouter);
Vue.config.devtools = true;

const routes = [
    { path: '/', component: wcSftPlMng},
    { path: '/write', component: wcSftPlWrite},
    { path: '/write/:sn', component: wcSftPlWrite},
    { path: '/detail/:sn', component: wcSftPlDetail}
];

const router = new VueRouter({
    hash: false,
    routes
});

new Vue({
    el: '#scope-wcSftPlMng',
    mounted: function() {
        let vm = this;
        if(vm.$device.ios != false || vm.$device.android != false) {
            window.location.href= "/m" + window.location.pathname;
        }
    },
    router, store
});
//.$mount('#scope-wcSftPlMng');