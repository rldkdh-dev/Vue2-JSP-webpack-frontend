import 'es6-promise/auto'
import Vue from 'vue';
import VueRouter from 'vue-router';
import Axios from 'axios';
import device from "vue-device-detector";
import store from "../../../../store";
import etcHsEdc from '../../../../components/frm_main/ohsms/hsEd/etcHsEdc.vue';
import etcHsEdcWrite from '../../../../components/frm_main/ohsms/hsEd/etcHsEdcWrite.vue';
import etcHsEdcUpdate from '../../../../components/frm_main/ohsms/hsEd/etcHsEdcWrite.vue';
import etcHsEdcDetail from '../../../../components/frm_main/ohsms/hsEd/etcHsEdcDetail.vue';

Vue.use(device)
Vue.use(VueRouter)
Vue.config.devtools = true;

const routes = [
    { path: '/', component: etcHsEdc},
    { path: '/write', component: etcHsEdcWrite},
    { path: '/write/:uid', component: etcHsEdcUpdate,name:"etcHsEdcUpdate"},
    { path: '/detail/:uid/:edu_se_cd/:edu_detail_cd', component: etcHsEdcDetail,name:"etcHsEdcDetail"},
]

const router = new VueRouter({
    hash: false,
    routes
})

new Vue({ 
    el: '#scope-etcHsEdc',
    mounted: function() {
        let vm = this;
        if(vm.$device.ios != false || vm.$device.android != false){
            window.location.href= "/m" + window.location.pathname;
        }
    },
    router, store
})