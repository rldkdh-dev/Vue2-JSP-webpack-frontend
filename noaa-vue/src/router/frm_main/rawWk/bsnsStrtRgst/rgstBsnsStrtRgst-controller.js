import 'es6-promise/auto'
import Vue from 'vue';
import VueRouter from 'vue-router';
import Axios from 'axios';
import device from "vue-device-detector";
import store from "../../../../store";
import rgstBsnsStrtRgst from '../../../../components/frm_main/rawWk/bsnsStrtRgst/rgstBsnsStrtRgst.vue';
import rgstBsnsStrtRgstWrite from '../../../../components/frm_main/rawWk/bsnsStrtRgst/rgstBsnsStrtRgstWrite.vue';
import rgstBsnsStrtRgstDetail from '../../../../components/frm_main/rawWk/bsnsStrtRgst/rgstBsnsStrtRgstDetail.vue';

Vue.use(device)
Vue.use(VueRouter)
Vue.config.devtools = true;

const routes = [
    { path: '/', component: rgstBsnsStrtRgst},
    { path: '/write', component: rgstBsnsStrtRgstWrite, name:'rgstBsnsStrtRgstWrite'},
    { path: '/write/:acdnt_strt_dclr_sn', component: rgstBsnsStrtRgstWrite, name:'rgstBsnsStrtRgstUpdate'},
    { path: '/detail/:acdnt_strt_dclr_sn', component: rgstBsnsStrtRgstDetail, name: 'rgstBsnsStrtRgstDetail'},

]

const router = new VueRouter({
    hash: false,
    routes
})

new Vue({ 
    el: '#scope-rgstBsnsStrtRgst',
    mounted: function() {
        let vm = this;
        if(vm.$device.ios != false || vm.$device.android != false){
            window.location.href= "/m" + window.location.pathname;
        }
    },
    router, store
}).$mount('#scope-rgstBsnsStrtRgst')