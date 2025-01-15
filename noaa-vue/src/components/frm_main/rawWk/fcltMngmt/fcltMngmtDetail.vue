<template>
    <div>
        <div class="contents write">
            <div>
                <table class="table horizontal write">
                    <caption>중장비 관리 상세</caption>
                    <tbody>
                        <tr>
                            <th scope="row" class="w180"><label for="bplc">현장명</label></th>
                            <td>
                                {{ viewModel.data.bplc_nm }}
                            </td>
                        </tr>
                        <tr>
                            <th scope="row"><label for="hqp_sn">장비구분</label></th>
                            <td>
                                {{ viewModel.data.hqp_nm }}
                            </td>
                        </tr>
                        <tr>
                            <th scope="row"><label for="hqp_mng_nm">장비명</label></th>
                            <td>
                                {{ viewModel.data.hqp_mng_nm }}
                            </td>
                        </tr>
                        <tr>
                            <th scope="row"><label for="hqp_no">장비번호</label></th>
                            <td>
                                {{ viewModel.data.hqp_no }}
                            </td>
                        </tr>
                        <tr>
                            <th scope="row"><label for="lcns_no">차량번호</label></th>
                            <td>
                                {{ viewModel.data.lcns_no }}
                            </td>
                        </tr>
                        <tr>
                            <th scope="row"><label for="pic_nm">담당자</label></th>
                            <td>
                                {{ viewModel.data.pic_nm }}
                            </td>
                        </tr>
                        <tr>
                            <th scope="row"><label for="">안전검사 유효기간</label></th>
                            <td>
                                {{ viewModel.data.safe_chck_vld_pd|yyyyMMdd }}
                            </td>
                        </tr>
                        <tr>
                            <th scope="row"><label for="">안전작업계획서 작성일</label></th>
                            <td>
                                {{ viewModel.data.safe_work_actpln_wrt_dt|yyyyMMdd }}
                            </td>
                        </tr>
                        <tr>
                            <th scope="row"><label for="">안전인증서</label></th>
                            <td>
                                <ul>
                                    <li v-for="item in viewModel.filelist1">
                                        <a class="btn-link" @click="fnFileDown(item)">{{ item.orgnl_file_nm }}</a>
                                    </li>
                                </ul>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row"><label for="">보험서류</label></th>
                            <td>
                                <ul>
                                    <li v-for="item in viewModel.filelist2">
                                        <a class="btn-link" @click="fnFileDown(item)">{{ item.orgnl_file_nm }}</a>
                                    </li>
                                </ul>
                            </td>
                        </tr>
                    </tbody>
                </table>
                
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
    import Message, {messageUtil} from "../../../../common/js/message";
    import fromValidation from "../../../../common/js/fromValidation";
    
    export default {
        data: function() {
            return {
                viewModel:{
                    data:{
                        hqp_sn:''
                    },
                    userInfo:{},
                    hqpList:[],
                    filelist1:[],
                    filelist2:[],
                }
            };
        },
        components: {
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
            fnDetail:function(sn){
                let vm = this;
                let data = {
                    manage_sn: sn
                }
                Axios.post("/selectFcltMngmtDetail.do", data)
                .then(function(response) {
                    vm.viewModel.data = response.data.detail;

                    vm.viewModel.filelist1 = response.data.fileList.filter(data => data.file_se == 1);
                    vm.viewModel.filelist2 = response.data.fileList.filter(data => data.file_se == 2);
                });
            },
            fnFileDown:function(item){
                let vm = this;
                let send = {
                    sn: item.sn,
                    file_sn: item.file_sn,
                    gbn:'fcltMngmt'
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
