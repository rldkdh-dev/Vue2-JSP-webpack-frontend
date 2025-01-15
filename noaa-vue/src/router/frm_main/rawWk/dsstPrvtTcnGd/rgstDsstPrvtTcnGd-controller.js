import 'es6-promise/auto'
import Vue from 'vue';
import VueRouter from 'vue-router';
import Axios from 'axios';
import device from "vue-device-detector";
import store from "../../../../store";
import rgstDsstPrvtTcnGd from '../../../../components/frm_main/rawWk/dsstPrvtTcnGd/rgstDsstPrvtTcnGd.vue';
import rgstDsstPrvtTcnGdWrite from '../../../../components/frm_main/rawWk/dsstPrvtTcnGd/rgstDsstPrvtTcnGdWrite.vue';
import rgstDsstPrvtTcnGdDetail from '../../../../components/frm_main/rawWk/dsstPrvtTcnGd/rgstDsstPrvtTcnGdDetail.vue';

Vue.use(device)
Vue.use(VueRouter)
Vue.config.devtools = true;

const routes = [
    { path: '/', component: rgstDsstPrvtTcnGd},
    { path: '/write', component: rgstDsstPrvtTcnGdWrite, name:'rgstDsstPrvtTcnGdWrite'},
    { path: '/write/:tchnlgy_cch_sn', component: rgstDsstPrvtTcnGdWrite, name:'rgstDsstPrvtTcnGdUpdate'},
    { path: '/detail/:tchnlgy_cch_sn', component: rgstDsstPrvtTcnGdDetail, name: 'rgstDsstPrvtTcnGdDetail'},

]

const router = new VueRouter({
    hash: false,
    routes
})

new Vue({ 
    el: '#scope-rgstDsstPrvtTcnGd',
    mounted: function() {
        let vm = this;
        if(vm.$device.ios != false || vm.$device.android != false){
            window.location.href= "/m" + window.location.pathname;
        }
    },
    router, store
}).$mount('#scope-rgstDsstPrvtTcnGd')