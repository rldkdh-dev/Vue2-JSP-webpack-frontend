<template>
    <modal :pass="{popupTitle: '작업허가서 점검결과'}">
		<template v-slot:contents>
			<div>
                <table class="table horizontal write">
                    <caption>작업허가서 점검결과 상세</caption>
                    <tbody>
                        <tr v-for="(item, index) in viewModel.list">
                            <th :rowspan="item.min_rslt_sn == item.chck_act_rslt_sn ? item.cnt_rslt : 0" v-if="item.min_rslt_sn != '0'" scope="row" class="w150">
                                {{ item.chck_dt|yyyyMMdd }}
                            </th>
                            <td>
                                <imgsfileform :ref="'imgsfileform'" :pass="{id:'chckRslt'+index, index:index, gbn:'chckRslt', mode:'view'}"></imgsfileform>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
		</template>
	</modal>
</template>

<script>
    import "es6-promise/auto";
    import Vue from "vue";
    import Axios from "axios";
    import imgsfileform from '../../../../../common/vue/imgsfileform2.vue';
    import Modal from '../../../popup/modal.vue'
    import Message, {messageUtil} from "../../../../../common/js/message";

    export default {
        props: ['pass'],
        data: function() {
            return {
                viewModel:{
                    list:[],
                    fileList:[],
                },
            };
        },
        components: {
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

                vm.fnDetail(sn);
            },
            fnDetail:function(sn){
                let vm = this;
                let data = {
                    job_rpmsn_sn: sn,
                }
                Axios.post("/selectWkPmsChkRsltList.do", data)
                .then(function(response) {
                    vm.viewModel.list = response.data.list;
                    vm.viewModel.fileList = response.data.fileList;

                    for(let i=0; i<vm.viewModel.list.length; i++){
                        vm.viewModel.list[i].imgfilelist = vm.viewModel.fileList.filter(data => data.sn == vm.viewModel.list[i].chck_act_sn && data.sub_sn == vm.viewModel.list[i].chck_act_rslt_sn);
                    } 
                }).then(function(){
                    vm.$nextTick(function() {
                        for(let i=0; i<vm.viewModel.list.length; i++){
                            vm.$refs.imgsfileform[i].fnFileLoadList(vm.viewModel.list[i].imgfilelist);
                        }
                    });

                });
            },
        }
    };
</script>