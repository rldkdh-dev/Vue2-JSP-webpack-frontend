import 'es6-promise/auto'
import Vue from 'vue';
import VueRouter from 'vue-router';
import Axios from 'axios';
import device from "vue-device-detector";
import store from "../../../../store";
import sftAdmElt from '../../../../components/frm_main/rawWk/hsPs/sftAdmElt.vue';
import sftAdmEltWrite from '../../../../components/frm_main/rawWk/hsPs/sftAdmEltWrite.vue';
import sftAdmEdcWrite from '../../../../components/frm_main/rawWk/hsPs/sftAdmEdcWrite.vue';
import sftAdmEltDetail from '../../../../components/frm_main/rawWk/hsPs/sftAdmEltDetail.vue';

Vue.use(device)
Vue.use(VueRouter)
Vue.config.devtools = true;

const routes = [
    { path: '/', component: sftAdmElt,name : 'tabNm',meta: { keepAlive: true }},
    { path: '/eltWrite', component: sftAdmEltWrite,meta: { keepAlive: false }},
    { path: '/eltWrite/:sn', component: sftAdmEltWrite,name:'eltWrite',meta: { keepAlive: false }},
    { path: '/edcWrite', component: sftAdmEdcWrite,meta: { keepAlive: false }},
    { path: '/edcWrite/:sn', component: sftAdmEdcWrite,name:'edcWrite',meta: { keepAlive: false }},
    { path: '/detail/:sn', component: sftAdmEltDetail,name:'detail',meta: { keepAlive: false }},
]

const router = new VueRouter({
    hash: false,
    routes
})

new Vue({ 
    el: '#scope-sftAdmElt',
    mounted: function() {
        let vm = this;
        if(vm.$device.ios != false || vm.$device.android != false){
            window.location.href= "/m" + window.location.pathname;
        }
    },
    router, store
}).$mount('#scope-sftAdmElt')