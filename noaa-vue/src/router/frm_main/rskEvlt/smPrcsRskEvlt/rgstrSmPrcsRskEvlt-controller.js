import 'es6-promise/auto'
import Vue from 'vue';
import VueRouter from 'vue-router';
import Axios from 'axios';
import device from "vue-device-detector";
import store from "../../../../store";
import rgstrSmPrcsRskEvlt from '../../../../components/frm_main/rskEvlt/smPrcsRskEvlt/rgstrSmPrcsRskEvlt.vue';
import rgstrSmPrcsRskEvltWrite from '../../../../components/frm_main/rskEvlt/smPrcsRskEvlt/rgstrSmPrcsRskEvltWrite.vue';
import rgstrSmPrcsRskEvltCopy from '../../../../components/frm_main/rskEvlt/smPrcsRskEvlt/rgstrSmPrcsRskEvltCopy.vue';
import rgstrSmPrcsRskEvltDetail from '../../../../components/frm_main/rskEvlt/smPrcsRskEvlt/rgstrSmPrcsRskEvltDetail.vue';

Vue.use(device)
Vue.use(VueRouter)
Vue.config.devtools = true;

const routes = [
    { path: '/', component: rgstrSmPrcsRskEvlt, name:'rgstrSmPrcsRskEvlt'},
    { path: '/write', component: rgstrSmPrcsRskEvltWrite, name:'rgstrSmPrcsRskEvltWrite'},
    { path: '/write/:sn', component: rgstrSmPrcsRskEvltWrite, name:'rgstrSmPrcsRskEvltWrite'},
    { path: '/copy/:sn', component: rgstrSmPrcsRskEvltCopy, name:'rgstrSmPrcsRskEvltCopy'},
    { path: '/detail/:sn', component: rgstrSmPrcsRskEvltDetail, name:'rgstrSmPrcsRskEvltDetail'},
]

const router = new VueRouter({
    hash: false,
    routes
})

new Vue({ 
    el: '#scope-rgstrSmPrcsRskEvlt',
    mounted: function() {
        let vm = this;
        if(vm.$device.ios != false || vm.$device.android != false){
            window.location.href= "/m" + window.location.pathname;
        }
    },
    router, store
}).$mount('#scope-rgstrSmPrcsRskEvlt')