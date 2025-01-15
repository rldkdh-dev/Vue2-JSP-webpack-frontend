import 'es6-promise/auto'
import Vue from 'vue';
import VueRouter from 'vue-router';
import Axios from 'axios';
import device from "vue-device-detector";
import store from "../../../../store";
import mngmtHse from '../../../../components/frm_main/ohsms/hse/mngmtHse.vue';
import mngmtHseWrite from '../../../../components/frm_main/ohsms/hse/mngmtHseWrite.vue';
import mngmtHseUpdate from '../../../../components/frm_main/ohsms/hse/mngmtHseWrite.vue';
import mngmtHseDetail from '../../../../components/frm_main/ohsms/hse/mngmtHseDetail.vue';

Vue.use(device)
Vue.use(VueRouter)
Vue.config.devtools = true;

const routes = [
    { path: '/', component: mngmtHse},
    { path: '/write', component: mngmtHseWrite},
    { path: '/write/:sn', component: mngmtHseUpdate,name:'mngmtHseUpdate'},
    { path: '/detail/:sn', component: mngmtHseDetail,name:'mngmtHseDetail'},
]

const router = new VueRouter({
    hash: false,
    routes
})

new Vue({ 
    el: '#scope-mngmtHse',
    mounted: function() {
        let vm = this;
        if(vm.$device.ios != false || vm.$device.android != false){
            window.location.href= "/m" + window.location.pathname;
        }
    },
    router, store
})
// .$mount('#scope-mngmtHse')