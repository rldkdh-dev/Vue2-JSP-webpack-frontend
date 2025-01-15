import 'es6-promise/auto'
import Vue from 'vue';
import VueRouter from 'vue-router';
import Axios from 'axios';
import device from "vue-device-detector";
import store from "../../../../store";
import rgstIDEA from '../../../../components/frm_main/wkOpnLs/IDEA/rgstIDEA.vue';
import rgstIDEAWrite from '../../../../components/frm_main/wkOpnLs/IDEA/rgstIDEAWrite.vue';
import rgstIDEADetail from '../../../../components/frm_main/wkOpnLs/IDEA/rgstIDEADetail.vue';

Vue.use(device)
Vue.use(VueRouter)
Vue.config.devtools = true;

const routes = [
    { path: '/', component: rgstIDEA},
    { path: '/write', component: rgstIDEAWrite},
    { path: '/update/:propse_sn', component: rgstIDEAWrite, name:'rgstIDEAWrite'},
    { path: '/detail/:propse_sn', component: rgstIDEADetail, name:'rgstIDEADetail'},
]

const router = new VueRouter({
    hash: false,
    routes
})

new Vue({ 
    el: '#scope-rgstIDEA',
    mounted: function() {
        let vm = this;
        if(vm.$device.ios != false || vm.$device.android != false){
            window.location.href= "/m" + window.location.pathname;
        }
    },
    router, store
}).$mount('#scope-rgstIDEA')