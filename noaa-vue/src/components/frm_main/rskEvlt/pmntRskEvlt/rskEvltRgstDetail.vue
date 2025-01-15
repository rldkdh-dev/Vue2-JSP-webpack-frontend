<template>
    <div>
        <div class="contents write">
            <div>
                <h3>기본정보</h3>
                <table class="table horizontal write">
                    <caption>기본정보</caption>
                    <tbody>
                        <tr>
                            <th scope="row" class="w180"><label for="bplc">현장명</label></th>
                            <td>
                                {{ viewModel.data.bplc_nm }}
                            </td>
                        </tr>
                        <tr>
                            <th scope="row"><label for="work_type_nm">공종명</label></th>
                            <td>
                                {{ viewModel.data.work_type_nm }}
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">평가기간</th>
                            <td>
                                {{ viewModel.data.evl_bgng_dt|yyyyMMdd }} - {{ viewModel.data.evl_end_dt|yyyyMMdd }}
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">작성일자</th>
                            <td>
                                {{ viewModel.data.wrt_dt|yyyyMMdd }}
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">회차</th>
                            <td>
                                {{ viewModel.data.month }}<span v-if="viewModel.data.month != null">월</span> {{ viewModel.data.ngr }}<span v-if="viewModel.data.ngr != null">회차</span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div>
                <ul class="accordion">
                    <template v-for="(item1, idx) in viewModel.detailList" >
                        <li>
                            <button class="title">
                                팀명 : {{ item1.teamInfo.bplc_team_nm }}
                            </button>
                            <div class="contents" style="max-height: 100%;">
                                <div>
                                    <h3>위험성평가 등록부 단위작업</h3>
                                    <table class="table write">
                                        <caption>위험성평가 등록부 단위작업</caption>
                                        <thead>
                                            <tr>
                                                <th :rowspan="2">고위험(상)</th>
                                                <!-- <th :rowspan="2">팀명</th> -->
                                                <th :rowspan="2">작업절차[중공정]</th>
                                                <th :rowspan="2">사용장비</th>
                                                <th :rowspan="2">작업일정</th>
                                                <th :rowspan="2">위험요인</th>
                                                <th :rowspan="2">위험유형</th>
                                                <th :rowspan="2">안전대책</th>
                                                <th>평가 결과</th>
                                                <th :rowspan="2">재평가<br>결과</th>
                                                <th :rowspan="2">이행담당자</th>
                                            </tr>
                                            <tr>
                                                <th>이행상태</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="(item2, i) in item1.itemList">
                                                <td :rowspan="item1.itemList.length" v-if="i == 0">
                                                    상등급
                                                </td>
                                                <!-- <td v-if="index === 0 || item2.spcm_risk_evl_sn !== item1.itemList[(index - 1)].spcm_risk_evl_sn" :rowspan="fnRowSpan(item2, index)">{{ item2.bplc_team_nm }}</td> -->
                                                <td class="text-left">{{ item2.unit_work }}</td>
                                                <td class="text-left">{{ item2.using_tool }}</td>
                                                <td>{{ item2.term_bgng_dt|yyyyMMdd }} ~ {{ item2.term_end_dt|yyyyMMdd }}</td>
                                                <td class="text-left">
                                                    <p style="white-space: pre-wrap">{{ item2.risk_fctr }}</p>
                                                </td>
                                                <td class="text-left">{{ item2.risk_type }}</td>
                                                <td class="text-left">
                                                    <p style="white-space: pre-wrap">{{ item2.safe_cntrpln }}</p>
                                                </td>
                                                <td>{{ item2.now_mng_level_nm }}</td>
                                                <td>{{ item2.re_evl_nm }}</td>
                                                <td class="text-left">{{ item2.pic_nm }}</td>
                                            </tr>
                                            <tr v-if="item1.itemList.length == 0"><td :colspan="'10'">데이터가 없습니다.</td></tr>
                                        </tbody>
                                    </table>
                                </div>
                                <rgstChkSubDetail :ref="'sub'" :pass="{id:'chckSubDetail', mode: 'risk_view', gbn:'risk', idx: idx}" v-if="item1.rsltList.length > 0"></rgstChkSubDetail>
                            </div>
                        </li>
                    </template>
                </ul>
            </div>
            
            <div class="btn-group btn-right">
                <router-link to="/" class="btn btn-white"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-list-back"></use></svg>목록</router-link>
            </div>
        </div>
    </div>    
</template>

<script>
    import "es6-promise/auto";
    import Vue from "vue";
    import Axios from "axios";
    import Common from "../../../../common/js/common.js";
    import Message, {messageUtil} from "../../../../common/js/message";
    import fromValidation from "../../../../common/js/fromValidation";
    import rgstChkSubDetail from "../../chkHthAct/chkAct/rgstChkSubDetail.vue"
    
    export default {
        data: function() {
            return {
                deptPop:false,
                atdrnPop:false,
                popIndex: 0,
                viewModel:{
                    data:{
                    },
                    userInfo:{},
                    detailList:[],
                    chkRsltList:[],
                },
            };
        },
        components: {
            'rgstChkSubDetail': rgstChkSubDetail
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
                    reg_sn: sn,
                }

                Axios.post("/selectRskEvltRgstDetail.do", send)
                .then(function(response) {
                    vm.viewModel.data = response.data.detail;
                    vm.viewModel.chkRsltList = response.data.chkRsltList;
                    
                    vm.viewModel.detailList = response.data.detailList;
                    vm.viewModel.data.chck_clsf = 'REC'
                }).then(function(){
                    
                    if(vm.$refs.sub != undefined){
                        vm.$refs.sub.forEach((data) => {
                            let idx = data.pass.idx;
                            let detail = vm.viewModel.detailList[idx];

                            vm.$nextTick(function() {
                                vm.$set(data.viewModel, 'chkRsltList', vm.viewModel.chkRsltList);
                                data.fnLoadList(detail.rsltList, detail.fileList, detail.mttrFileList);
                            });
                        });
                    }
                });
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
