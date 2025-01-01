<template>
    <div>
        <div class="contents">
            <div class="divide">
                <div>
                    <div>
                        <h3>액션플랜 등록자 정보</h3>
                        <table class="table horizontal write">
                            <caption>목표추진계획, 평가기준 등록</caption>
                            <tbody>
                                <tr>
                                    <th scope="row">이름</th>
                                    <td>
                                        {{ viewModel.data.reg_nm }}
                                    </td>
                                </tr>
                                <tr>
                                    <th scope="row"><label for="bplc">현장명</label></th>
                                    <td colspan="5">
                                        {{ viewModel.data.bplc_nm }}
                                    </td>                            
                                </tr>
                                <tr>
                                    <th>직위</th>
                                    <td>
                                        {{ viewModel.data.wrtr_dty_type }}
                                    </td>
                                </tr>
                                <tr>
                                    <!-- <th>사번</th>
                                    <td>
                                        {{ viewModel.data.wrtr_empno }}
                                    </td>
                                </tr>
                                <tr>
                                    <th>직무유형</th>
                                    <td>
                                        {{ viewModel.data.wrtr_dty_type }}
                                    </td> -->
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div>
                        <div>
                            <h3>ActionPlan 평가 계획</h3>
                            <table class="table">
                                <caption>안전보건목표 추진계획서 등록</caption>
                                <thead>
                                    <tr>
                                        <th scope="colgroup">View<br>Point</th>
                                        <th scope="colgroup">KFS</th>
                                        <th scope="col">세부 목표</th>
                                        <th scope="col">%</th>
                                        <th scope="col">1/4분기</th>
                                        <th scope="col">2/4분기</th>
                                        <th scope="col">3/4분기</th>
                                        <th scope="col">4/4분기</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(item, i) in viewModel.actplnList" :key="i">
                                        <td id="safety" :rowspan="viewModel.actplnList.length" v-if="i == 0">
                                                안전보건
                                        </td>
                                        <td>
                                            {{ item.kfs }}
                                        </td>
                                        <td>
                                            {{ item.detail_goal }}
                                        </td>
                                        <td>
                                            {{ item.pt }}
                                        </td>
                                        <td>
                                            {{ item.one_qu }}
                                        </td>
                                        <td>
                                            {{ item.two_qu }}
                                        </td>
                                        <td>
                                            {{ item.three_qu }}
                                        </td>
                                        <td>
                                            {{ item.four_qu }}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div>
                        <div>
                            <h3>ActionPlan 평가 기준표</h3>
                            <table class="table">
                                <caption>안전보건목표 평가기준 등록</caption>
                                <thead>
                                    <tr>
                                        <th scope="colgroup" rowspan="2">View<br>Point</th>
                                        <th scope="colgroup" rowspan="2">KFS</th>
                                        <th scope="col" rowspan="2">세부 목표</th>
                                        <th scope="col" rowspan="2">반기구분</th>
                                        <th scope="col" colspan="5">평가기준</th>
                                        <th scope="col" rowspan="2">결과첨부</th>
                                    </tr>
                                    <tr>
                                        <th scope="col">S</th>
                                        <th scope="col">A</th>
                                        <th scope="col">B</th>
                                        <th scope="col">C</th>
                                        <th scope="col">D</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <template v-for="(item, i) in viewModel.actplnList2" :key="i">
                                        <tr>
                                            <td :rowspan="Number(viewModel.actplnList2.length) * 2" v-if="i == 0">
                                                안전보건
                                            </td>
                                            <td rowspan="2">
                                                {{ item.kfs }}
                                            </td>
                                            <td rowspan="2">
                                                {{ item.detail_goal }}
                                            </td>
                                            <td>
                                                상
                                            </td>
                                            <td> 
                                                {{ item.frhfyr_evl_crtr_s }}
                                            </td>
                                            <td>
                                                {{ item.frhfyr_evl_crtr_a }}
                                            </td>
                                            <td>
                                                {{ item.frhfyr_evl_crtr_b }}
                                            </td>
                                            <td>
                                                {{ item.frhfyr_evl_crtr_c }}                                
                                            </td>
                                            <td>
                                                {{ item.frhfyr_evl_crtr_d }}                                
                                            </td>
                                            <td class="text-left">
                                                <ul>
                                                    <li v-for="data in item.frhfyrfilelist">
                                                        <a class="btn-link" @click="fnFileDown(data, '1')">{{ data.orgnl_file_nm }}</a>
                                                    </li>
                                                </ul>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                하
                                            </td>
                                            <td>
                                                {{ item.shyy_evl_crtr_s }}
                                            </td>
                                            <td>
                                                {{ item.shyy_evl_crtr_a }}
                                            </td>
                                            <td>
                                                {{ item.shyy_evl_crtr_b }}
                                            </td>
                                            <td>
                                                {{ item.shyy_evl_crtr_c }}
                                            </td>
                                            <td>
                                                {{ item.shyy_evl_crtr_d }}
                                            </td>
                                            <td class="text-left">
                                                <ul>
                                                    <li v-for="data in item.shyyfilelist">
                                                        <a class="btn-link" @click="fnFileDown(data, '2')">{{ data.orgnl_file_nm }}</a>
                                                    </li>
                                                </ul>
                                            </td>
                                        </tr>
                                    </template>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div class="btn-group btn-right">
                        <router-link :to="'/'" class="btn btn-white"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-list-back"></use></svg>목록</router-link>
                    </div>
                </div>
                <div class="approval">
                    <h3>결재 정보</h3>
                    <ul>
                        <li class="signed">
                            <a href="javascript:;">
                                <p>작성자</p>
                                <div class="user_img" id="1">
                                    <img :src="viewModel.data.wrtr_sign">
                                </div>
                                <span>{{ viewModel.data.wrtr_nm == "" ? "작성자 등록":viewModel.data.wrtr_nm }}</span>
                            </a>
                        </li>
                        <li :class="[viewModel.data.dcsnr != '' && viewModel.data.bplc_mngr_sign_yn != 'Y' ? 'set' : viewModel.data.bplc_mngr_sign_yn != '' && viewModel.data.bplc_mngr_sign_yn=='Y' ? 'signed' : null]">
                            <a href="javascript:;">
                                <p>현장소장</p>
                                <div class="user_img" id="3">
                                    <img :src="viewModel.data.dcsnr_sign" v-bind:style="viewModel.data.bplc_mngr_sign_yn != 'Y' ? 'display: none;' : ''">
                                </div>
                                <span>{{ viewModel.data.dcsnr_nm == "" ? "현장소장 등록":viewModel.data.dcsnr_nm }}</span>
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <sign ref="sign" v-if="signPop==true"></sign>
    </div>
</template>

<script>
    import "es6-promise/auto";
    import Vue from "vue";
    import Axios from "axios";
    import sign from "../../popup/sign_popup.vue";

    export default {
        components: {
            'sign': sign,
        },
        data: function() {
            return {
                AprvrGbn:'',
                viewModel:{
                    data:{
                        dcsnr:'',
                        dcsnr_nm:'',
                    },
                    userInfo:{},
                    fileList1:[],
                    fileList2:[],
                    //추진계획서 리스트
                    actplnList:[{seq:1}],
                    actplnList2:[{seq2:1}],
                    selActplnList:[],
                },
                signPop: false,
                signPopSort: ''
            };
        },
        mounted: function() {
            let vm = this;
            vm.fnInit();
        },
        activated:function(){
            this.fnInit();
        },
        deactivated:function(){
            this.$destroy();
        },
        methods: {
            fnInit:function(){
                let vm = this;
                vm.viewModel.userInfo = vm.$store.state.global.userInfo;

                let sn = vm.$route.params.plan_sn;
                
                vm.fnDetail(sn);
            },
            fnDetail: function(sn){
                let vm = this;
                
                let data = {
                    plan_sn: sn
                }
                Axios.post("/selectAtPlDetail.do", data)
                .then(function(response) {
                    vm.viewModel.data = response.data.detail;
                    vm.viewModel.actplnList = response.data.list;
                    vm.viewModel.actplnList2 = response.data.list2;
                    vm.viewModel.fileList1 = response.data.fileList1;
                    vm.viewModel.fileList2 = response.data.fileList2;

                    //제,개정일 세팅
                    vm.viewModel.data.wrtr_sign = vm.viewModel.data.wrtr_sign.charAt() == '/' ? vm.viewModel.data.wrtr_sign : vm.viewModel.data.wrtr_sign.substr(2);
                    vm.viewModel.data.dcsnr_sign = vm.viewModel.data.dcsnr_sign.charAt() == '/' ? vm.viewModel.data.dcsnr_sign : vm.viewModel.data.dcsnr_sign.substr(2);
                }).then(function(){
                    for(let i=0; i<vm.viewModel.actplnList2.length; i++){
                        let item = vm.viewModel.actplnList2[i];

                        vm.viewModel.actplnList2[i].frhfyrfilelist = vm.viewModel.fileList1.filter(data=>  data.sub_sn == item.kfs_sn);
                        vm.viewModel.actplnList2[i].shyyfilelist = vm.viewModel.fileList2.filter(data=>  data.sub_sn == item.kfs_sn);
                    }
                });
            },   
            fnFileDown:function(item, file_se){
                let vm = this;
                let send = {};
                send = {
                    sn: item.sn,
                    sub_sn: item.sub_sn,
                    file_sn: item.file_sn,
                    gbn:'atPl'
                }

                $(".loading").show();
                $("#mask").show();

                Axios.post("/download.do",send,{responseType: "blob",}
                ).then(function(e) {
                    const url = window.URL.createObjectURL(new Blob([e.data], { type: e.headers["content-type"] }))
                    const link = document.createElement("a")
                    link.href = url
                    link.download = item.orgnl_file_nm
                    link.click()
                    window.URL.revokeObjectURL(url)
                }).then(function(){
                    $(".loading").hide();
                    $("#mask").hide();
                });
            },
        }
    };
</script>