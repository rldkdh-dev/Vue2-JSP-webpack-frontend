import 'es6-promise/auto'
import Vue from 'vue';
import VueRouter from 'vue-router';
import Axios from 'axios';
import device from "vue-device-detector";
import store from "../../../../store";
import rgstPwSftmt from '../../../../components/frm_main/ohsms/pwSftmt/rgstPwSftmt.vue';
import rgstPwSftmtWrite from '../../../../components/frm_main/ohsms/pwSftmt/rgstPwSftmtWrite.vue';
import rgstPwSftmtDetail from '../../../../components/frm_main/ohsms/pwSftmt/rgstPwSftmtDetail.vue';

Vue.use(device)
Vue.use(VueRouter)
Vue.config.devtools = true;

const routes = [
    { path: '/', component: rgstPwSftmt},
    { path: '/write', component: rgstPwSftmtWrite},
    { path: '/write/:sn', component: rgstPwSftmtWrite},
    { path: '/detail/:sn', component: rgstPwSftmtDetail},
]

const router = new VueRouter({
    hash: false,
    routes
})

new Vue({ 
    el: '#scope-rgstPwSftmt',
    mounted: function() {
        let vm = this;
        if(vm.$device.ios != false || vm.$device.android != false){
            window.location.href= "/m" + window.location.pathname;
        }
    },
    router, store
}).$mount('#scope-rgstPwSftmt')