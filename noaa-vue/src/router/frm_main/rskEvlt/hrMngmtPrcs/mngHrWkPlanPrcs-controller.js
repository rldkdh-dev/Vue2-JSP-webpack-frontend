import 'es6-promise/auto'
import Vue from 'vue';
import VueRouter from 'vue-router';
import Axios from 'axios';
import device from "vue-device-detector";
import store from "../../../../store";
import mngHrWkPlanPrcs from '../../../../components/frm_main/rskEvlt/hrMngmtPrcs/mngHrWkPlanPrcs.vue';
import mngHrWkPlanPrcsWrite from '../../../../components/frm_main/rskEvlt/hrMngmtPrcs/mngHrWkPlanPrcsWrite.vue';
import mngHrWkPlanPrcsDetail from '../../../../components/frm_main/rskEvlt/hrMngmtPrcs/mngHrWkPlanPrcsDetail.vue';
import mngHrWkPlanPrcsPreview from '../../../../components/frm_main/rskEvlt/hrMngmtPrcs/mngHrWkPlanPrcsPreview.vue';

Vue.use(device);
Vue.use(VueRouter);
Vue.config.devtools = true;

const routes = [
    { path: '/', component: mngHrWkPlanPrcs},
    { path: '/write', component: mngHrWkPlanPrcsWrite},
    { path: '/write/:sn', component: mngHrWkPlanPrcsWrite},
    { path: '/detail/:sn', component: mngHrWkPlanPrcsDetail},
    { path: '/preview', component: mngHrWkPlanPrcsPreview},
    { path: '/preview/:sn', component: mngHrWkPlanPrcsPreview}
];

const router = new VueRouter({
    hash: false,
    routes
})

new Vue({ 
    el: '#scope-mngHrWkPlanPrcs',
    mounted: function() {
        let vm = this;
        if(vm.$device.ios != false || vm.$device.android != false) {
            window.location.href= "/m" + window.location.pathname;
        }
    },
    router, store
});
//.$mount('#scope-rgstHrMngmtPrcs');