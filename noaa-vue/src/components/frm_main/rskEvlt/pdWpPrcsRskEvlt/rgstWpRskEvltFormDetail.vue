<template>
    <div>
        <div class="contents write">
            <div class="btn-group btn-right">
                <button class="btn btn-light-purple" @click="fnViewPopup();"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-manage-search"></use></svg>미리보기</button>
            </div>
            <div>
                <h3>기본정보</h3>
                <table class="table horizontal write">
                    <caption>일일 작업장 위험성평가 등록</caption>
                    <tbody>
                        <tr>
                            <th scope="row" class="w180"><label for="bplc">현장명</label></th>
                            <td>
                                {{ viewModel.data.bplc_nm }}
                            </td>
                        </tr>
                        <tr>
                            <th scope="row"><label for="job_dt">작업일자</label></th>
                            <td>
                                {{ viewModel.data.job_dt|yyyyMMdd }}
                            </td>
                        </tr>
                        <tr v-if="type == 'PMNT'">
                            <th scope="row"><label for="ordtm_risk_evl">상시위험성평가</label></th>
                            <td>
                                {{ viewModel.data.work_type_nm }} ( {{ viewModel.data.evl_bgng_dt|yyyyMMdd }} ~ {{ viewModel.data.evl_end_dt|yyyyMMdd }} )
                            </td>
                        </tr>
                        <tr>
                            <th scope="row"><label for="ordtm_risk_evl">팀명</label></th>
                            <td>
                                {{ viewModel.data.bplc_team_nm }}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div>
                <h3>상시/소공정 위험성평가 위험성 감소대책 이행/점검 </h3>
                <table class="table write">
                    <caption>추가 위험 및 대책 등록</caption>
                    <thead>
                        <th>팀명</th>
                        <th>단위작업</th>
                        <th>장비 공구</th>
                        <th>위험요소</th>
                        <th>안전대책</th>
                    </thead>
                    <tbody>
                        <tr v-for="(item, index) in viewModel.itemList">
                            <td v-if="index === 0 || item.spcm_risk_evl_sn !== viewModel.itemList[(index - 1)].spcm_risk_evl_sn" :rowspan="fnRowSpan(item, index)">
                                {{ item.bplc_team_nm }}
                            </td>
                            <td>
                                <textarea type="text" v-model="item.unit_job" :id="'unit_job_'+index" yle="border: none; background-color: white;" disabled></textarea>
                            </td>
                            <td>
                                <textarea type="text" v-model="item.eqpmnt" :id="'eqpmnt_'+index" yle="border: none; background-color: white;" disabled></textarea>
                            </td>
                            <td>
                                <textarea type="text" v-model="item.risk_factor" :id="'risk_factor_'+index" yle="border: none; background-color: white;" disabled></textarea>
                            </td>
                            <td>
                                <textarea type="text" v-model="item.safe_cntrpln" :id="'safe_cntrpln_'+index" yle="border: none; background-color: white;" disabled></textarea>
                            </td>
                        </tr>
                        <tr v-if="viewModel.itemList.length == 0"><td :colspan="'4'">게시물이 없습니다.</td></tr>
                    </tbody>
                </table>
            </div>
            <div class="btn-group btn-right">
                <router-link to="/" class="btn btn-white"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-list-back"></use></svg>목록</router-link>
            </div>
        </div>
        <viewPopup ref="viewPopup" v-if="viewPop==true"></viewPopup>
    </div>    
</template>

<script>
    import "es6-promise/auto";
    import Vue from "vue";
    import Axios from "axios";
    import Common from "../../../../common/js/common.js";
    import viewPopup from "./popup/rgstWpRskEvltFormViewPopup.vue";
    
    export default {
        data: function() {
            return {
                viewPop: false,
                viewModel:{
                    data:{
                    },
                    userInfo:{},
                    itemList:[],
                },
            };
        },
        components: {
            'viewPopup': viewPopup,
        },
        activated:function(){
            this.fnInit();
        },
        deactivated:function(){
            this.$destroy();
        },
        mounted: function() {
            let vm = this;
            // vm.fnInit();
        },
        methods: {
            fnInit:function(){
                let vm = this;
                vm.viewModel.userInfo = vm.$store.state.global.userInfo;
                
                let sn = vm.$route.params.sn;

                vm.fnDetail(sn);
            },
            fnDetail: function(sn){
                let vm = this;

                let send = {
                    wrkshp_risk_evl_sn: sn,
                    type: vm.type,
                }

                Axios.post("/selectWpRskEvltFormDetail.do", send)
                .then(function(response) {
                    vm.viewModel.data = response.data.detail;
                    vm.viewModel.itemList = response.data.itemList;

                    if(vm.viewModel.data.ordtm_risk_evl_sn == 0){
                        vm.type = 'SPCM';
                    }else{
                        vm.type = 'PMNT';
                    }
                });
            },
            fnViewPopup: function(){
                let vm = this;

                vm.viewPop = true;
                vm.$nextTick(function() {
                    if(vm.viewPop) {
                        vm.$refs.viewPopup.fnInit(vm.viewModel.data.wrkshp_risk_evl_sn);
                    }
                })
            },
            fnRowSpan: function(item, i){
                let rs = 1;
                while (
                    i + rs < this.viewModel.itemList.length &&
                    this.viewModel.itemList[i + rs].spcm_risk_evl_sn === item.spcm_risk_evl_sn
                ) {
                    rs++;
                }
                return rs;
            }
        }
    };
</script>
