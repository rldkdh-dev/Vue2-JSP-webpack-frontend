<template>
	<div :id=pass.id class="qrcode" >
		<a href="javascript:;" class="btn btn-icon btn4 mb10" @click="onOff"><span class="mi"></span> QR코드 생성</a>
		<div id="qrcode_img" class="qrcode_img" v-if="isopend==true" style="display: flex; justify-content: center;">
	    	<qr-code :text="value"	size="100" error-level="L"></qr-code>
		</div>									
	</div>
</template>
<script>
import 'es6-promise/auto'
import Vue from 'vue'
import Axios from 'axios'
import VueQRCodeComponent from 'vue-qrcode-component'
Vue.component('qr-code', VueQRCodeComponent)
export default{

    props:['pass'],
    data: function () {
        return {
            isopend: false,
			value: '',
        }
    }, 
    // route 에서 path 나 fullPath 변경 시 value 를 바꾸어 qr 코드 생성
    // 초기마운트는 해줘야하기때문에 마운트에도 선언
    watch: {
        '$route.path'(newPath) {
            let vm = this;
            // vm.value = window.location.host + "/m/account/join.do#/"+ vm.pass.bplc_sn;
            this.isopend = false;
        }
    },
    mounted: function() {
		let vm = this;
        vm.value = window.location.origin + "/m/account/join.do#/"+ vm.pass.bplc_sn;
	},
    methods: {
        onOff : function(){
            let vm = this;
            
            if(vm.isopend != true){
                vm.isopend = true;
            }else{
                vm.isopend = false;
            }
        },
    }
}
</script>