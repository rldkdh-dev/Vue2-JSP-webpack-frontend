<template>
    <modal :pass="{popupTitle: '첨부이미지'}">
		<template v-slot:contents>
            <div>
                <imgsfileform :ref="'imgsfileform'" :pass="{id:'imgfileview', mode: 'view'}" @filelist="fnImgFileList"></imgsfileform>
            </div>
		</template>
	</modal>
</template>

<script>
    import "es6-promise/auto";
    import Vue from "vue";
    import Axios from "axios";
    import Common from "../../../common/js/common.js";
    import Modal from './modal.vue';
    import imgsfileform from '../../../common/vue/imgsfileform2.vue';

    export default {
        props: ['pass'],
        data: function() {
            return {
                viewModel:{
                    sn: null,
                    list: [],
                    userInfo:{},
                    imgfilelist:[],
                },
            };
        },
        components: {
            'imgsfileform' : imgsfileform,
            Modal
        },
        mounted: function() {
            let vm = this;
            vm.viewModel.userInfo = vm.$store.state.global.userInfo;
        },
        methods: {
            fnInit:function(sn, bplc_sn){
                let vm = this;

                Modal.methods.fnInit();
                vm.fnList(sn, bplc_sn);
            },
            fnList:function(sn,bplc_sn){
				let vm = this;
                
                Axios.post("/selectMngmtCdvscFileList.do", {sn: sn, bplc_sn:bplc_sn})
                .then(function(response) {
                    console.log(response.data)
                    for(let i=0; i<response.data.list.length; i++){
                        vm.$refs.imgsfileform.fnFileLoadList(response.data.list);
                    }
                });
            },
            fnImgFileList:function(vm){
                this.viewModel.imgfilelist = vm.viewModel.filelist;
            },
        }
    };
</script>