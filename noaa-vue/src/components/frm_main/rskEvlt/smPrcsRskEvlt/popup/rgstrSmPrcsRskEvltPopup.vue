<template>
   <modal :pass="{popupTitle: '소공종 참석자 확인'}">
		<template v-slot:contents>
            <div>
                <h3>기본정보</h3>
                <table class="table horizontal write">
                    <caption>기본정보</caption>
                    <tbody>
                        <tr>
                            <th scope="row" class="w100">현장명</th>
                            <td>
                                {{ viewModel.data.bplc_nm }}
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">팀명</th>
                            <td>{{viewModel.data.team_nm}}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div>
                <table class="table horizontal">
                    <caption>공종</caption>
                    <tbody>
                        <tr v-for="idx in Math.ceil((Number(viewModel.cfnlList.length) + 1) / 6)">
                            <!-- class="w100" -->
                            <th scope="rowgroup" :rowspan="Math.ceil((Number(viewModel.cfnlList.length) + 2) / 6)" v-if="idx == 1">공종</th>
                            <td v-for="cnt in 6">
                                <label :for="'cnfl_'+viewModel.cfnlList[ ((idx - 1) * 6) + (cnt - 1) ].work_type_sn" v-if="((idx - 1) * 6) + (cnt - 1) < viewModel.cfnlList.length">
                                    <input type="checkbox" :id="'cnfl_'+viewModel.cfnlList[ ((idx - 1) * 6) + (cnt - 1) ].work_type_sn" name="cnfl" :value="viewModel.cfnlList[ ((idx - 1) * 6) + (cnt - 1) ].work_type_sn" @change="fnGetCfnlItem(viewModel.cfnlList[ ((idx - 1) * 6) + (cnt - 1) ].work_type_sn, $event)" disabled>{{ viewModel.cfnlList[ ((idx - 1) * 6) + (cnt - 1) ].cfnl_nm }}
                                </label>
                                <label :for="'cnfl_etc'" v-if="((idx - 1) * 6) + (cnt - 1) == viewModel.cfnlList.length" >
                                    <input type="checkbox" :id="'cnfl_etc'" name="cnfl" :value="'etc'" @change="fnGetCfnlItem('etc', $event)" disabled>일반작업
                                </label>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div>
                <rgstrSmPrcsRskEvltSubDetail :ref="'sub'" :pass="{gbn:'popup'}"></rgstrSmPrcsRskEvltSubDetail>
            </div>
            <div class="table_footer btn-right">
                <button @click="fnAtdrn()" class="btn btn-purple" v-if="viewModel.sign_yn == 'N'"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-signature-reset"></use></svg>참석자 확인</button>
                <button @click="fnAtdrn()" class="btn btn-purple" v-if="viewModel.sign_yn == 'Y'"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-signature-reset"></use></svg>참석자 확인 취소</button>
            </div>
        </template>
    </modal>
</template>

<script>
    import "es6-promise/auto";
    import Vue from "vue";
    import Axios from "axios";
    import Modal from '../../../popup/modal.vue'
    import rgstrSmPrcsRskEvltSubDetail from "../rgstrSmPrcsRskEvltSubDetail.vue";
    
    export default {
        components: {
            Modal,
            'rgstrSmPrcsRskEvltSubDetail': rgstrSmPrcsRskEvltSubDetail
		},
        data: function() {
            return {
                viewModel:{
                    data:{
                        mdtr:'',
                        mdtr_nm:'',
                        dcsnr:'',
                        dcsnr_nm:'',
                    },
                    userInfo:{},
                    selCfnlList:[],   //선택된 공종과 정보 담
                    cfnlList:[],        //공종 리스트
                    dgdgrList:[],       //위험도 코드리스트
                    sign_yn: '',
                }
            };
        },
        computed: {
        }, 
        mounted: function() {
            let vm = this;
            // vm.fnInit();
        },
        methods: {
            //기본세팅
            fnInit:function(sn, sign_yn){
                let vm = this;
                vm.viewModel.userInfo = vm.$store.state.global.userInfo;
                
                Modal.methods.fnInit();

                vm.viewModel.sign_yn = sign_yn;
                vm.fnDetail(sn);
            },
            fnDetail: function(sn){
                let vm = this;

                let send = {
                    spcm_risk_evl_sn: sn,
                }
                Axios.post("/selectSmPrcsRskEvltDetail.do", send)
                .then(function(response) {
                    vm.viewModel.data = response.data.mstDetail;
                    vm.viewModel.selCfnlList = response.data.selCfnlList;

                    //코드값
                    vm.viewModel.cfnlList = response.data.cfnlList;
                    vm.viewModel.dgdgrList = response.data.dgdgrList;

                    vm.$refs.sub.fnInit(vm.viewModel.dgdgrList, vm.viewModel.selCfnlList, 'popup');                    
                }).then(function(){

                    for(let i= 0; i<vm.viewModel.selCfnlList.length; i++){
                        let sn = vm.viewModel.selCfnlList[i].work_type_sn;

                        if(sn == 9999){
                            $("input:checkbox[id='cnfl_etc']").prop("checked", true);
                        }else{
                            $("input:checkbox[id='cnfl_" + sn + "']").prop("checked", true);
                        }
                    }
                });
            },
            fnAtdrn: function(){
                let vm = this;

                let data = {
                    bplc_sn: vm.viewModel.data.bplc_sn,
                    spcm_risk_evl_sn: vm.viewModel.data.spcm_risk_evl_sn,
                    reg_id: vm.viewModel.userInfo.user_id,
                    reg_nm: vm.viewModel.userInfo.user_name,
                    ocpt_detail_nm: vm.viewModel.userInfo.bplc_yn == 'Y' ? vm.viewModel.userInfo.ocpt_detail_nm : vm.viewModel.userInfo.jbttl_nm,
                    sign_yn: vm.sign_yn == 'Y' ? 'N' : 'Y'
                }

                if(confirm(vm.sign_yn == 'Y' ? '참석확인 취소하시겠습니까?' : '참석확인 하시겠습니까?')){
                    Axios.post("/updateSmPrcsRskEvltAtdrn.do", data)
                    .then(function(response) {
                        
                        if(vm.sign_yn == 'Y'){
                            alert("참석확인이 취소되었습니다.");
                        }else{
                            alert("참석확인이 완료되었습니다.");
                        }
                        
                        vm.$parent.atdrnPop = false;
                        vm.$parent.fnList();
                    });
                }
            }
        }
    };
</script>