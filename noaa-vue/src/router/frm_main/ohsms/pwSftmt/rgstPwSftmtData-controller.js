import 'es6-promise/auto'
import Vue from 'vue';
import VueRouter from 'vue-router';
import Axios from 'axios';
import device from "vue-device-detector";
import store from "../../../../store";
import rgstPwSftmtData from '../../../../components/frm_main/ohsms/pwSftmt/rgstPwSftmtData.vue';
import rgstPwSftmDatatWrite from '../../../../components/frm_main/ohsms/pwSftmt/rgstPwSftmtDataWrite.vue';
import rgstPwSftmtDattDetail from '../../../../components/frm_main/ohsms/pwSftmt/rgstPwSftmtDataDetail.vue';

Vue.use(device)
Vue.use(VueRouter)
Vue.config.devtools = true;

const routes = [
    { path: '/', component: rgstPwSftmtData},
    // { path: '/write', component: rgstPwSftmtWrite},
    { path: '/write/:sn', component: rgstPwSftmDatatWrite},
    { path: '/detail/:sn', component: rgstPwSftmtDattDetail},
]

const router = new VueRouter({
    hash: false,
    routes
})

new Vue({ 
    el: '#scope-rgstPwSftmtData',
    mounted: function() {
        let vm = this;
        if(vm.$device.ios != false || vm.$device.android != false){
            window.location.href= "/m" + window.location.pathname;
        }
    },
    router, store
}).$mount('#scope-rgstPwSftmtData')