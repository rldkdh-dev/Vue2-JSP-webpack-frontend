import 'es6-promise/auto'
import Vue from 'vue';
import VueRouter from 'vue-router';
import Axios from 'axios';
import device from "vue-device-detector";
import store from "../../../../store";
import sugest from '../../../../components/frm_main/system/sugest/sugest.vue';
import sugestWrite from '../../../../components/frm_main/system/sugest/sugestWrite.vue';
import sugestReply from '../../../../components/frm_main/system/sugest/sugestReply.vue';
import sugestDetail from '../../../../components/frm_main/system/sugest/sugestDetail.vue';

Vue.use(device)
Vue.use(VueRouter)
Vue.config.devtools = true;

const routes = [
    { path: '/', component: sugest},
    { path: '/write', component: sugestWrite},
    { path: '/write/:sn', component: sugestWrite},
    { path: '/reply/:sn', component: sugestReply},
    { path: '/detail/:sn', component: sugestDetail},
]

const router = new VueRouter({
    hash: false,
    routes
})

new Vue({ 
    el: '#scope-sugest',
    mounted: function() {
        let vm = this;
        if(vm.$device.ios != false || vm.$device.android != false){
            window.location.href= "/m" + window.location.pathname;
        }
    },
    router, store
}).$mount('#scope-sugest')