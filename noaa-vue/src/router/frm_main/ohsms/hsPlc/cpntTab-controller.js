import 'es6-promise/auto'
import Vue from 'vue';
import VueRouter from 'vue-router';
import Axios from 'axios';
import device from "vue-device-detector";
import store from "../../../../store";
import cpntTab from '../../../../components/frm_main/ohsms/hsPlc/cpntTab.vue';
import cpntTabUpdate from '../../../../components/frm_main/ohsms/hsPlc/cpntTabUpdate.vue';

Vue.use(device)
Vue.use(VueRouter)
Vue.config.devtools = true;

const routes = [
    { path: '/', component: cpntTab},
    { path: '/update/:sn', component: cpntTabUpdate},
]

const router = new VueRouter({
    hash: false,
    routes
})

new Vue({ 
    el: '#scope-cpntTab',
    mounted: function() {
        let vm = this;
        if(vm.$device.ios != false || vm.$device.android != false){
            window.location.href= "/m" + window.location.pathname;
        }
    },
    router, store
}).$mount('#scope-cpntTab')