import 'es6-promise/auto'
import Vue from 'vue';
import VueRouter from 'vue-router';
import Axios from 'axios';
import device from "vue-device-detector";
import store from "../../../../store";
import wkRglHsEdc from '../../../../components/frm_main/ohsms/hsEd/wkRglHsEdc.vue';
// import wkRglHsEdcWrite from '../../../../components/frm_main/ohsms/hsEd/wkRglHsEdcWrite.vue';
// import wkRglHsEdcUpdate from '../../../../components/frm_main/ohsms/hsEd/wkRglHsEdcWrite.vue';

Vue.use(device)
Vue.use(VueRouter)
Vue.config.devtools = true;

const routes = [
    { path: '/', component: wkRglHsEdc},
    // { path: '/write', component: wkRglHsEdcWrite},
    // { path: '/write/:uid', component: wkRglHsEdcUpdate,name:'wkRglHsEdcupdate'},
]

const router = new VueRouter({
    hash: false,
    routes
})

new Vue({ 
    el: '#scope-wkRglHsEdc',
    mounted: function() {
        let vm = this;
        if(vm.$device.ios != false || vm.$device.android != false){
            window.location.href= "/m" + window.location.pathname;
        }
    },
    router, store
}).$mount('#scope-wkRglHsEdc')