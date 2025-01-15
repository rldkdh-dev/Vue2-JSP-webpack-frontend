<template>
    <div>
        <div class="contents write">
            <div>
                <caption>노사협의체 회의록</caption>
                <div>
                    <h3>회의 개요</h3>
                    <table class="table horizontal write">
                        <tbody>
                            <tr>
                                <th scope="row" class="w180"><label for="">현장</label></th>
                                <td colspan="2">{{ viewModel.data.bplc_nm }}</td>
                            </tr>
                            <tr>
                                <th scope="row"><label for="">회의 일시</label></th>
                                <td>
                                    <div class="input_group">
                                        <div>
                                            {{ viewModel.data.mtg_dt }}
                                        </div>
                                        <div>
                                            {{ viewModel.data.mtg_bgn_tm }}
                                        </div>
                                        <span>~</span>
                                        <div>
                                            {{ viewModel.data.mtg_end_tm }}
                                        </div>
                                    </div>
                                </td> 
                            </tr>
                            <tr>
                                <th scope="row"><label for="">회의 장소</label></th>
                                <td class="text-left">
                                    <div class="input_group">
                                        {{ viewModel.data.mtg_plc }}
                                    </div>
                                </td> 
                            </tr>
                            <tr>
                                <th scope="row"><label for="">회의 내용</label></th>
                                <td class="text-left"><p v-html="viewModel.data.mtg_cn"></p></td> 
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div style="padding:25px 0px 0px 0px;">
                    <h3>참석자</h3>
                    <div class="divide">
                        <div>
                            <table class="table write">
                                <thead>
                                    <tr>
                                        <th scope="col" colspan="2">사용자 위원</th>
                                    </tr>
                                    <tr>
                                        <th scope="col" style="width:50%;">성명</th>
                                        <th scope="col" style="width:50%;">서명</th>
                                    </tr>
                                </thead>
                                <!-- <tbody v-for="(item, i) in viewModel.adminList" :key="i"> -->
                                <tbody>
                                    <template v-if="viewModel.user_member.length > 0">
                                        <tr v-for="(item, i) in viewModel.user_member" :key="i">
                                            <td>{{ item.user_nm }}</td>
                                            <td>
                                                <span v-if="item.sign_yn == 'N' || item.sign_yn == null"><a href="javascript:void(0);">-</a></span>
                                                <span v-if="!item.user_aprvr && item.sign_yn == 'Y'"><a href="javascript:void(0);">서명 완료</a></span>
                                                <span v-if="item.user_aprvr && item.sign_yn == 'Y'" ><img :src="item.user_aprvr_path" style="width:35px; height:auto;"></span>
                                            </td>
                                        </tr>
                                    </template> 
                                    <template v-else>
                                        <tr>
                                            <td colspan="2">해당 현장의 사용자 위원이 없습니다.</td>
                                        </tr>
                                    </template>
                                </tbody>
                            </table>
                        </div>
                        <div>
                            <table class="table write">
                                <thead>
                                    <tr>
                                        <th scope="col" colspan="2">근로자 위원</th>
                                    </tr>
                                    <tr>
                                        <th scope="col" style="width:50%;">성명</th>
                                        <th scope="col" style="width:50%;">서명</th>
                                    </tr>
                                </thead>
                                <!-- <tbody v-for="(item, i) in viewModel.adminList" :key="i"> -->
                                <tbody>
                                    <template v-if="viewModel.worker_member.length > 0">
                                        <tr v-for="(item, i) in viewModel.worker_member" :key="i">
                                            <td>{{ item.user_nm }}</td>
                                            <td>
                                                <span v-if="item.sign_yn == 'N' || item.sign_yn == null"><a href="javascript:void(0);">-</a></span>
                                                <span v-if="!item.user_aprvr && item.sign_yn == 'Y'"><a href="javascript:void(0);">서명 완료</a></span>
                                                <span v-if="item.user_aprvr && item.sign_yn == 'Y'" ><img :src="item.user_aprvr_path" style="width:35px; height:auto;"></span>
                                            </td>
                                        </tr>
                                    </template>
                                    <template v-else>
                                        <tr>
                                            <td colspan="2">해당 현장의 근로자 위원이 없습니다.</td>
                                        </tr>
                                    </template>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div style="padding:25px 0px 0px 0px;">
                    <h3>심의∙의결 내용</h3>
                    <ConsiderSub ref="consider" :pass="{title:'심의·의결사항', mode:'view'}"></ConsiderSub>
                </div>
                <div style="padding:25px 0px 0px 0px;">
                    <h3>협의사항</h3>
                    <ConsultSub ref="consult" :pass="{title:'협의 사항', mode:'view'}"></ConsultSub>
                </div>
                <div style="padding:25px 0px 10px 0px;">
                    <h3>피드백</h3>
                    <FeedbackSub ref="feedback" :pass="{title:'피드백', mode:'view'}"></FeedbackSub>
                </div>

                <div class="table_footer btn-right">
                    <router-link to="/" class="btn btn-white"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-list-back"></use></svg>목록</router-link>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import "es6-promise/auto";
    import Vue from "vue";
    import Axios from "axios";
    import Common from "../../../../common/js/common.js";
    import Fileform from "../../fileform2.vue";
    import imgsfileform from '../../../../common/vue/imgsfileform2.vue';
    import ConsiderSub from "../mau/rgstPlImplAct_sub_consider.vue";
    import ConsultSub from "../mau/rgstPlImplAct_sub_consult.vue";
    import FeedbackSub from "../mau/rgstPlImplAct_sub_feedback.vue";
    
    
    export default {
        components: {
            Fileform, imgsfileform, ConsiderSub, ConsultSub, FeedbackSub
        },
        data: function() {
            return {
                userInfo:{},
                bplc_sn:'',
                lbm_cfrnc_mtg_sn:'',
                viewModel:{
                    data:{},
                    list:{},
                    user_member:[],
                    worker_member:[],
                }
            };
        },
        mounted: function() {
            let vt = this;
            
            vt.userInfo = this.$store.state.global.userInfo,

            vt.lbm_cfrnc_mtg_sn = vt.$route.params.sn;
            vt.bplc_sn = vt.$route.params.b_sn;
            
            // vt.$nextTick(function() {
            //     vt.fnInit();
            // })
        },
        activated:function(){
            this.fnInit();
        },
        deactivated:function(){
            this.$destroy();
        },
        methods: {
            fnInit:function(){
                let vt = this;
                let vm = this.viewModel;
                
                let data = {
                    bplc_sn : vt.bplc_sn,
                    lbm_cfrnc_mtg_sn : vt.lbm_cfrnc_mtg_sn
                }
                Axios.post("/selectMauDetail.do", data)
                .then(function(response) {
                    vm.data = response.data.list[0];
                    if(vm.data.mtg_dt != undefined && vm.data.mtg_dt != null ){
                        vm.data.mtg_dt = (Common.fnDateTimeStr(vm.data.mtg_dt));
                    }
                    if(response.data.memberList.length > 0){
                        for(let i=0; i<response.data.memberList.length; i++){
                            if(response.data.memberList[i].mfcmm_se == '1'){//사용자 위원
                                vm.user_member.push(response.data.memberList[i]);
                            }else if(response.data.memberList[i].mfcmm_se == '2'){//근로자 위원
                                vm.worker_member.push(response.data.memberList[i]);
                            }
                        }
                        //사용자 위원 서명
                        for(let i=0; i<vm.user_member.length; i++){
                            if(vm.user_member[i].user_aprvr_path != null){
                                vm.user_member[i].user_aprvr = (vm.user_member[i].user_aprvr_path.charAt() == '/' ? vm.user_member[i].user_aprvr_path : vm.user_member[i].user_aprvr_path.substr(2)); 
                            }
                        }
                        //근로자 위원 서명
                        for(let i=0; i<vm.worker_member.length; i++){
                            if(vm.worker_member[i].user_aprvr_path != null){
                                vm.worker_member[i].user_aprvr = (vm.worker_member[i].user_aprvr_path.charAt() == '/' ? vm.worker_member[i].user_aprvr_path : vm.worker_member[i].user_aprvr_path.substr(2)); 
                            }
                        }
                    }  
                    
                    vt.$nextTick(function() {
                        vt.$refs.consider.fnInit(vm.data);
                        vt.$refs.consult.fnInit(vm.data);
                        vt.$refs.feedback.fnInit(vm.data);

                        vt.$nextTick(function() {
                            vm.data.mtg_cn = vm.data.mtg_cn.replaceAll(/(\n|\r\n)/g,'<br>');
                        })
                    })
                });

                // setTimeout(()=>{
                //     vt.$refs.consider.fnInit(vm.list[0]);
                //     vt.$refs.consult.fnInit(vm.list[0]);
                //     vt.$refs.feedback.fnInit(vm.list[0]);
                // }, 100)
                vt.$forceUpdate(); 
            },
        }
    };
</script>