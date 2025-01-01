import 'es6-promise/auto'
import Vue from 'vue';
import VueRouter from 'vue-router';
import Axios from 'axios';
import device from "vue-device-detector";
import store from "../../../../store";
import mngmtSlpAcdtCs from '../../../../components/frm_main/rskEvlt/slpAcdtCs/mngmtSlpAcdtCs.vue';
import mngmtSlpAcdtCsWrite from '../../../../components/frm_main/rskEvlt/slpAcdtCs/mngmtSlpAcdtCsWrite.vue';
import mngmtSlpAcdtCsUpdate from '../../../../components/frm_main/rskEvlt/slpAcdtCs/mngmtSlpAcdtCsWrite.vue';
import mngmtSlpAcdtCsDetail from '../../../../components/frm_main/rskEvlt/slpAcdtCs/mngmtSlpAcdtCsDetail.vue';

Vue.use(device)
Vue.use(VueRouter)
Vue.config.devtools = true;

const routes = [
    { path: '/', component: mngmtSlpAcdtCs},
    { path: '/write', component: mngmtSlpAcdtCsWrite},
    { path: '/write/:uid/:atchmnfl', component: mngmtSlpAcdtCsUpdate,name:'mngmtSlpAcdtCsupdate'},
    { path: '/detail/:uid', component: mngmtSlpAcdtCsDetail,name:'mngmtSlpAcdtCsDetail'},
]

const router = new VueRouter({
    hash: false,
    routes
})

new Vue({ 
    el: '#scope-mngmtSlpAcdtCs',
    mounted: function() {
        let vm = this;
        if(vm.$device.ios != false || vm.$device.android != false){
            window.location.href= "/m" + window.location.pathname;
        }
    },
    router, store
})
// .$mount('#scope-mngmtSlpAcdtCs')