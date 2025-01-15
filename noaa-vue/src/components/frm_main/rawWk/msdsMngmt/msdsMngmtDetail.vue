<template>
<div>
    <div class="contents write">
        <div>
            <table class="table horizontal write">
                <caption>MSDS 관리 등록</caption>
                <tbody>
                    <tr>
                        <th scope="row" class="w180"><label for="prdct_nm">현장명</label></th>
                        <td>
                            {{ viewModel.data.bplc_nm }}
                        </td>
                    </tr>
                    <tr>
                        <th scope="row"><label for="prdct_nm">제품명</label></th>
                        <td>
                            {{ viewModel.data.prdct_nm }}
                        </td>
                    </tr>
                    <tr>
                        <th scope="row"><label for="mkr">제조사</label></th>
                        <td>
                            {{viewModel.data.mkr}}
                        </td>
                    </tr>
                    <tr>
                        <th scope="row"><label for="">첨부</label></th>
                        <td>
                            <!-- <fileform @filelist="fnFilelist"  @getFileInfo="fngetFileInfo" :pass="{id:'sc'}" ref="files"></fileform> -->
                            <ul>
                                <li v-for="item in viewModel.filelist">
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
    <dept ref="dept" v-if="deptPop==true" :pass="{group_id: viewModel.userInfo.user_group_id}"></dept>
</div>
</template>

<script>
    import "es6-promise/auto";
    import Vue from "vue";
    import Axios from "axios";
    
    export default {
        data: function() {
            return {
                viewModel:{
                    data:{
                        clsf:'',
                        fair_nm:'',
                        usg:'',
                        se:'',
                    },
                    userInfo:{},
                    filelist:[],
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
        },
        methods: {
            fnInit: function(){
                let vm = this;
                let sn = vm.$route.params.sn;

                vm.viewModel.userInfo = vm.$store.state.global.userInfo;
                vm.fnDetail(sn);
            },
            fnDetail:function(sn){
                let vm = this;

                
                let data = {
                    mng_sn: sn
                }

                Axios.post("/selectMsdsMngmtDetail.do", data)
                .then(function(response) {
                    vm.viewModel.data = response.data.detail;
                    vm.viewModel.filelist = response.data.fileList;
                });

            },
            fnFileDown:function(item){
                let vm = this;
                let send = {
                    menu_se: item.menu_se,
                    sn: item.sn,
                    file_sn: item.file_sn,
                    gbn:'rawWk'
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
