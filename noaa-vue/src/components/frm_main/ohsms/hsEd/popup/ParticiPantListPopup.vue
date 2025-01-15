<template>
    <div>
        <modal :pass="{popupTitle:'참석자 명단'}">
            <template v-slot:contents>
                <div class="btn-group btn-right">
                    <button class="btn btn-white" @click="fnExcelDownload"><i class="icon_excel"></i>엑셀다운로드</button>
                </div>
                <div>
                    <table class="table">
                        <caption>참석자 명단</caption>
                        <thead>
                            <tr>
                                <th scope="col">직책</th>
                                <th scope="col">이름</th>
                                <th scope="col">서명여부</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="item in list" :key="item">
                                <td>{{ item.ocpt_detail_nm }}</td>
                                <td>{{ item.user_nm }}</td>
                                <td>{{ item.sign_yn }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </template>
        </modal>
        <excelform ref="excelform"></excelform>
    </div>
</template>
<script>
    import "es6-promise/auto";
    import Vue from "vue";
    import Axios from "axios";
    import modal from '../../../../../common/vue/modal.vue';
    import excelform from "../../../excelform.vue";
    Vue.component('modal',modal);
    Vue.component('excelform',excelform);

    export default {
        data: function() {
            return {
                edu_sn:0,
                list:[],
                detail:{}
            };
        },
        mounted: function() {},
        methods: {
            fnInit:function(sn){
                this.edu_sn = sn;
                modal.methods.fnInit();
                this.fnSet(sn);
            },
            fnClose:function(){
                // this.$parent.fnInit();
                this.$emit('close',false);
            },
            fnSet:function(sn){
                let vm = this;

                Axios.post("/selectParticiPantList.do",{sn:sn}).then(function(res){
                    vm.list = res.data.participantList;
                    vm.detail = res.data.hsEdList[0];
                })
            },
            fnExcelDownload: function(){
                let vm = this;
                // 자바 버전
                const header = ['직책','이름','서명여부'];
                const mapperId = 'selectParticiPantList';
                
                //검색조건
                let data = {
                    header: header,
                    mapperId: mapperId,
                    sn: vm.edu_sn,
                    fileName: vm.detail.edu_se_nm + (vm.detail.edu_se_cd != 'EA04' && vm.detail.edu_se_cd != 'EA05' && vm.detail.edu_se_cd != 'EA06' ? '-' + vm.detail.edu_detail_nm : '') + '_' + vm.detail.edu_nm_ttl + '_참석자명단'
                };
                if (confirm("엑셀 출력 하시겠습니까?")) {
                    vm.$nextTick(function () {
                        vm.$refs.excelform.fnInit(data);
                    })
                }
            }
      }
    };
</script>