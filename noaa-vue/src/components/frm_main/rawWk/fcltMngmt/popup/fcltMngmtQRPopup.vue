<template>
    <modal :pass="{popupTitle: '중장비 QR코드'}">
		<template v-slot:contents>
            <div class="btn-group btn-right">
                <button class="btn btn-light-purple" @click="fnPrint();"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-print"></use></svg>인쇄</button>
            </div>

            <div id="viewDiv" style="display: flex; justify-content: center;" >
                <qr-code :text="value"	size="300" error-level="L"></qr-code>
            </div>
		</template>
	</modal>
</template>

<script>
    import "es6-promise/auto";
    import Vue from "vue";
    import Axios from "axios";
    import Modal from '../../../popup/modal.vue'
    import printJS from 'print-js'
    import VueQRCodeComponent from 'vue-qrcode-component'
    Vue.component('qr-code', VueQRCodeComponent)

    export default {
        props: ['pass'],
        data: function() {
            return {
                value: '',
                viewModel:{
                    userInfo:{},
                    filepath:'',
                    data:{},
                    detail:{},
                    itemList:[],
                }
            };
        },
        components: {
            Modal,
        },
        mounted: function() {
        },
        methods: {
            fnInit:function(sn){
                let vm = this;

                Modal.methods.fnInit();
                
                vm.value = window.location.origin + "/m/chkHthAct/chkAct/rgstChk.do#/write/fclt/" + sn ;
            },
            fnPrint : function(){
                printJS({
                    printable:'viewDiv',
                    type:'html',
                    css: ['/css/basic.css','/css/print.css'],
                    scanStyles : false,
                });
            },
        }
    };
</script>
