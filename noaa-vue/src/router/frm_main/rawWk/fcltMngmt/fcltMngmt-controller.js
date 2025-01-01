import 'es6-promise/auto'
import Vue from 'vue';
import VueRouter from 'vue-router';
import Axios from 'axios';
import device from "vue-device-detector";
import store from "../../../../store";
import fcltMngmt from '../../../../components/frm_main/rawWk/fcltMngmt/fcltMngmt.vue';
import fcltMngmtWrite from '../../../../components/frm_main/rawWk/fcltMngmt/fcltMngmtWrite.vue';
import fcltMngmtDetail from '../../../../components/frm_main/rawWk/fcltMngmt/fcltMngmtDetail.vue';

Vue.use(device)
Vue.use(VueRouter)
Vue.config.devtools = true;

const routes = [
    { path: '/', component: fcltMngmt},
    { path: '/write', component: fcltMngmtWrite},
    { path: '/write/:sn', component: fcltMngmtWrite},
    { path: '/detail/:sn', component: fcltMngmtDetail},
]

const router = new VueRouter({
    hash: false,
    routes
})

new Vue({ 
    el: '#scope-fcltMngmt',
    mounted: function() {
        let vm = this;
        if(vm.$device.ios != false || vm.$device.android != false){
            window.location.href= "/m" + window.location.pathname;
        }
    },
    router, store
}).$mount('#scope-fcltMngmt')