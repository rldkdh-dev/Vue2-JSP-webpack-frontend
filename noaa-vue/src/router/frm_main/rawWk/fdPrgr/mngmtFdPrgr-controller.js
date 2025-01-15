import 'es6-promise/auto'
import Vue from 'vue';
import VueRouter from 'vue-router';
import Axios from 'axios';
import device from "vue-device-detector";
import store from "../../../../store";
import mngmtFdPrgr from '../../../../components/frm_main/rawWk/fdPrgr/mngmtFdPrgr.vue';
import mngmtFdPrgrWrite from '../../../../components/frm_main/rawWk/fdPrgr/mngmtFdPrgrWrite.vue';
import mngmtFdPrgrDetail from '../../../../components/frm_main/rawWk/fdPrgr/mngmtFdPrgrDetail.vue';

Vue.use(device)
Vue.use(VueRouter)
Vue.config.devtools = true;

const routes = [
    { path: '/', component: mngmtFdPrgr},
    { path: '/write', component: mngmtFdPrgrWrite},
    { path: '/write/:sn', component: mngmtFdPrgrWrite,name:"write"},
    { path: '/detail/:sn', component: mngmtFdPrgrDetail,name:"detail"},
]

const router = new VueRouter({
    hash: false,
    routes
})

new Vue({ 
    el: '#scope-mngmtFdPrgr',
    mounted: function() {
        let vm = this;
        if(vm.$device.ios != false || vm.$device.android != false){
            window.location.href= "/m" + window.location.pathname;
        }
    },
    router, store
}).$mount('#scope-mngmtFdPrgr')