<template>
    <modal :pass="{popupTitle: '점검활동결과'}">
		<template v-slot:contents>
            <rgstChkSubDetail ref="sub" :pass="{mode: 'popup_view', gbn:'diy', bplc_mngr: viewModel.data.bplc_mngr}" @rsltList="fnrsltList"></rgstChkSubDetail>
            <!-- <rgstChkMttrDetail ref="mttr" @rsltList="fnrsltList" :pass="{mode:'update'}"></rgstChkMttrDetail> -->
		</template>
	</modal>
</template>

<script>
    import "es6-promise/auto";
    import Vue from "vue";
    import Axios from "axios";
    import rgstChkSubDetail from "../rgstChkSubDetail.vue";
    import imgsfileform from '../../../../../common/vue/imgsfileform2.vue';
    import Modal from '../../../popup/modal.vue'
    import Message, {messageUtil} from "../../../../../common/js/message";

    export default {
        props: ['pass'],
        data: function() {
            return {
                jobYn: 'N',
                viewModel:{
                    data:{
                        chck_clsf: [],
                        chck_rslt: 'G',
                    },
                    userInfo:{},
                    imgfilelist:[],
                    chkTypeList:[],
                    chkRsltList:[],
                    mttrPrgrsList:[],
                    mttrFileList:[],
                },
            };
        },
        components: {
            'rgstChkSubDetail' : rgstChkSubDetail,
            'imgsfileform' : imgsfileform,
            Modal
        },
        mounted: function() {
            let vm = this;
            // vm.fnInit();
        },
        methods: {
            fnInit:function(sn){
                let vm = this;
                vm.viewModel.userInfo = vm.$store.state.global.userInfo;

                Modal.methods.fnInit();
                
                //초기화
                vm.viewModel.data = {};
                vm.viewModel.filelist = [];
                vm.viewModel.mttrFileList = [];

                vm.fnDetail(sn);
            },
            fnDetail: function(sn){
                let vm = this;

                let data = {
                    diary_sn: sn,
                }
                Axios.post("/selectDiyChkDetail.do", data)
                .then(function(response) {
                    vm.viewModel.data = response.data.detail;
                    
                    //점검 항목 + 파일
                    vm.viewModel.rsltList = response.data.rsltList;
                    vm.viewModel.data.chck_clsf = vm.viewModel.rsltList[0].chck_clsf
                    vm.viewModel.filelist = response.data.fileList;
                    vm.viewModel.mttrFileList = response.data.mttrFileList;

                    //서명 이미지
                    vm.viewModel.data.safe_mngr_sign = vm.viewModel.data.safe_mngr_sign.charAt() == '/' ? vm.viewModel.data.safe_mngr_sign : vm.viewModel.data.safe_mngr_sign.substr(2);
                    vm.viewModel.data.bplc_mngr_sign = vm.viewModel.data.bplc_mngr_sign.charAt() == '/' ? vm.viewModel.data.bplc_mngr_sign : vm.viewModel.data.bplc_mngr_sign.substr(2);
                }).then(function(){
                    
                    //점검결과 코드 리스트 전달
                    vm.$refs.sub.viewModel.chkRsltList = vm.viewModel.chkRsltList;
                    
                    //점검사항 리스트
                    if(vm.viewModel.rsltList.length > 0){
                        vm.$refs.sub.fnLoadList(vm.viewModel.rsltList, vm.viewModel.filelist, vm.viewModel.mttrFileList);
                    }
                })
            },
        }
    };
</script>