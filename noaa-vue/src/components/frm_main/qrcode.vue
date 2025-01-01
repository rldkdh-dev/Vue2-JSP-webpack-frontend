<template>
	<div :id=pass.id class="">
		<a href="javascript:;" class="btn btn-yellow" @click="onOff" style="display: flex; justify-content: center;"><span class="mi"></span> QR코드 생성</a>
		<div id="qrcode_img" class="qrcode_img" v-if="isopend==true" style="display: flex; justify-content: center;" @click="qrDiv();">
	    	<qr-code :text="value+pass.bplc_sn"	size="100" error-level="L"></qr-code>
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
            if(vm.pass.id == 'main_qr'){
                vm.value = window.location.origin + "/account/login.do#/";
            }else{
                vm.value = window.location.origin + "/m/account/join.do#/";
            }
            this.isopend = false;
        }
    },
    mounted: function() {
		let vm = this;
        if(vm.pass.id == 'main_qr'){
            vm.value = window.location.origin + "/account/login.do#/";
        }else{
            vm.value = window.location.origin + "/m/account/join.do#/";
        }
	},
    methods: {
        onOff : function(){
            let vm = this;
            
            if(vm.pass.bplc_sn == 0 && vm.pass.id != 'main_qr'){
                alert("조회현장을 등록한 후 QR을 생성하실 수 있습니다.");
            }else{
                if(vm.isopend != true){
                    vm.isopend = true;
                }else{
                    vm.isopend = false;
                }
            }
        },
        qrDiv: function(){
            let vm = this;
            let div = $('#qrcode_img > div')[0];
            html2canvas(div).then(function(canvas){
                var qrUrl= canvas.toDataURL();

                if(vm.pass.id != 'main_qr'){
                    vm.downloadURI(qrUrl, vm.pass.bplc_nm +"_QR.png");
                }else{
                    vm.downloadURI(qrUrl, "스마트 안전보건 솔루션 로그인 화면_QR.png");
                }
            });
        },
        downloadURI: function(qrUrl, name){
            let link = document.createElement("a")
            link.download = name;
            link.href = qrUrl;
            document.body.appendChild(link);
            link.click();
        }
    }
}
</script>