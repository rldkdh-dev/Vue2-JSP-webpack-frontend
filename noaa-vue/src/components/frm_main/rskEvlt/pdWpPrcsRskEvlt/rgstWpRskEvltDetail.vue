<template>
    <div>
        <div class="contents write">
            <div>
                <h3>기본정보</h3>
                <table class="table horizontal write">
                    <caption>일일 작업장 위험성평가 등록</caption>
                    <tbody>
                        <tr>
                            <th scope="row" class="w200"><label for="bplc">현장명</label></th>
                            <td>
                               {{ viewModel.data.bplc_nm }}
                            </td>
                        </tr>
                        <tr>
                            <th scope="row"><label for="bplc">작성자</label></th>
                            <td>
                                {{ viewModel.data.reg_nm }}
                            </td>
                        </tr>
                        <tr>
                            <th scope="row"><label for="chck_dt">점검일자</label></th>
                            <td>
                                {{ viewModel.data.chck_dt|yyyyMMddd }}
                            </td>
                        </tr>
                        <tr>
                            <th scope="row"><label for="ordtm_risk_evl">일일 작업장 위험성평가</label></th>
                            <td>
                                {{ viewModel.data.team_nm }} ( {{ viewModel.data.job_dt|yyyyMMdd}} )
                            </td>
                        </tr>
                        <tr>
                            <th scope="row"><label for="">점검항목</label></th>
                            <td>
                                일일작업장 위험성평가
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">일일작업장 위험성평가표 첨부</th>
                            <td>
                                <imgsfileform :ref="'imgsfileform'" :pass="{id:'wpRisk', mode:'view'}"></imgsfileform>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div v-if="viewModel.rsltList.length > 0">
                <rgstChkSubDetail ref="sub" :pass="{gbn:'wp'}"></rgstChkSubDetail>
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
    import imgsfileform from '../../../../common/vue/imgsfileform2.vue';
    import rgstChkSubDetail from "../../chkHthAct/chkAct/rgstChkSubDetail.vue";

    export default {
        data: function() {
            return {
                viewModel:{
                    data:{},
                    userInfo:{},
                    filelist:[],
                    deletefileList: [],
                    chkRsltList:[],
                    rsltList:[],
                    chckfilelist:[],
                    mttrFileList:[],
                },
            };
        },
        components: {
            'imgsfileform' : imgsfileform,
            'rgstChkSubDetail': rgstChkSubDetail
        },
        mounted: function() {
            let vm = this;
            // vm.fnInit();
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
                
                let sn = vm.$route.params.sn;

                vm.fnDetail(sn);
            },
            fnDetail: function(sn){
                let vm = this;

                let send = {
                    chck_sn: sn,
                }

                Axios.post("/selectWpRskEvltDetail.do", send)
                .then(function(response) {
                    vm.viewModel.data = response.data.detail;
                    vm.viewModel.filelist = response.data.fileList;
                    vm.$refs.imgsfileform.fnFileLoadList(vm.viewModel.filelist);
                    
                    vm.viewModel.chkRsltList = response.data.chkRsltList;
                    vm.viewModel.rsltList = response.data.rsltList;
                    if(vm.viewModel.rsltList.length > 0){
                        vm.viewModel.data.chck_clsf = vm.viewModel.rsltList[0].chck_clsf
                    }
                    vm.viewModel.chckfilelist = response.data.chckfilelist;
                    vm.viewModel.mttrFileList = response.data.mttrFileList;
                }).then(function(){
                    //점검사항 리스트
                    if(vm.viewModel.rsltList.length > 0){
                        //점검결과 코드 리스트 전달
                        vm.$refs.sub.viewModel.chkRsltList = vm.viewModel.chkRsltList;

                        vm.$refs.sub.fnLoadList(vm.viewModel.rsltList, vm.viewModel.chckfilelist, vm.viewModel.mttrFileList);
                    }
                });
            },
            // fnFileDown:function(item){
            //     let vm = this;
            //     let send = {
            //         sn: item.sn,
            //         sub_sn: item.sub_sn,
            //         file_sn: item.file_sn,
            //         gbn:'pdWpPrcsRskEvlt'
            //     }

            //     $(".loading").show();
            //     $("#mask").show();
            //     Axios.post("/download.do",send,{responseType: "blob",}
            //     ).then(function(e) {
            //         const url = window.URL.createObjectURL(new Blob([e.data], { type: e.headers["content-type"] }))
            //         const link = document.createElement("a")
            //         link.href = url
            //         link.download = item.orgnl_file_nm
            //         link.click()
            //         window.URL.revokeObjectURL(url)
            //     }).then(function(){
            //     $(".loading").hide();
            //     $("#mask").hide();
            // });
                    
            // },
        }
    };
</script>
