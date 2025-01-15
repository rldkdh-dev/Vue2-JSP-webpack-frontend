import 'es6-promise/auto'
import Vue from 'vue';
import VueRouter from 'vue-router';
import Axios from 'axios';
import device from "vue-device-detector";
import store from "../../../../store";
import rgstrBsnsAplct from '../../../../components/frm_main/rskEvlt/smPrcsRskEvlt/rgstrBsnsAplct.vue';
import rgstrBsnsAplctWrite from '../../../../components/frm_main/rskEvlt/smPrcsRskEvlt/rgstrBsnsAplctWrite.vue';
import rgstrBsnsAplctDetail from '../../../../components/frm_main/rskEvlt/smPrcsRskEvlt/rgstrBsnsAplctDetail.vue';

Vue.use(device)
Vue.use(VueRouter)
Vue.config.devtools = true;

const routes = [
    { path: '/', component: rgstrBsnsAplct},
    { path: '/write', component: rgstrBsnsAplctWrite},
    { path: '/write/:sn', component: rgstrBsnsAplctWrite},
    { path: '/detail/:sn', component: rgstrBsnsAplctDetail},
]

const router = new VueRouter({
    hash: false,
    routes
})

new Vue({ 
    el: '#scope-rgstrBsnsAplct',
    mounted: function() {
        let vm = this;
    },
    router, store
}).$mount('#scope-rgstrBsnsAplct')