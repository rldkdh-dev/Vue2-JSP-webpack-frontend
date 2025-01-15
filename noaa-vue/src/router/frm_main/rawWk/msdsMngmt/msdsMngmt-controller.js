import 'es6-promise/auto'
import Vue from 'vue';
import VueRouter from 'vue-router';
import Axios from 'axios';
import device from "vue-device-detector";
import store from "../../../../store";
import msdsMngmt from '../../../../components/frm_main/rawWk/msdsMngmt/msdsMngmt.vue';
import msdsMngmtWrite from '../../../../components/frm_main/rawWk/msdsMngmt/msdsMngmtWrite.vue';
import msdsMngmtDetail from '../../../../components/frm_main/rawWk/msdsMngmt/msdsMngmtDetail.vue';

Vue.use(device)
Vue.use(VueRouter)
Vue.config.devtools = true;

const routes = [
    { path: '/', component: msdsMngmt},
    { path: '/write', component: msdsMngmtWrite},
    { path: '/write/:sn', component: msdsMngmtWrite},
    { path: '/detail/:sn', component: msdsMngmtDetail},
]

const router = new VueRouter({
    hash: false,
    routes
})

new Vue({ 
    el: '#scope-msdsMngmt',
    mounted: function() {
        let vm = this;
        if(vm.$device.ios != false || vm.$device.android != false){
            window.location.href= "/m" + window.location.pathname;
        }
    },
    router, store
}).$mount('#scope-msdsMngmt')