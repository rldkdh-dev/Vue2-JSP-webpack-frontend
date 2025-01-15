import 'es6-promise/auto'
import Vue from 'vue';
import VueRouter from 'vue-router';
import Axios from 'axios';
import device from "vue-device-detector";
import store from "../../../../store";
import rgstWkStRht from '../../../../components/frm_main/wkOpnLs/wkStRht/rgstWkStRht.vue';
import rgstWkStRhtWrite from '../../../../components/frm_main/wkOpnLs/wkStRht/rgstWkStRhtWrite.vue';
import rgstWkStRhtDetail from '../../../../components/frm_main/wkOpnLs/wkStRht/rgstWkStRhtDetail.vue';

Vue.use(device)
Vue.use(VueRouter)
Vue.config.devtools = true;

const routes = [
    { path: '/', component: rgstWkStRht},
    { path: '/write', component: rgstWkStRhtWrite},
    { path: '/write/:sn', component: rgstWkStRhtWrite},
    { path: '/detail/:sn', component: rgstWkStRhtDetail},
]

const router = new VueRouter({
    hash: false,
    routes
})

new Vue({ 
    el: '#scope-rgstWkStRht',
    mounted: function() {
        let vm = this;
        if(vm.$device.ios != false || vm.$device.android != false){
            window.location.href= "/m" + window.location.pathname;
        }
    },
    router, store
}).$mount('#scope-rgstWkStRht')