<template>
    <div>
        <div class="contents write">
            <div>
                <table class="table horizontal write">
                    <caption>미세먼지 프로그램 상세정보</caption>
                    <tbody>
                        <tr>
                            <th scope="row" class="w180"><label for="bplc_nm">현장</label></th>
                            <td>
                                {{ viewModel.data.bplc_nm }}
                            </td>
                        </tr>
                        <tr>
                            <th scope="row"><label for="user_nm">담당자</label></th>
                            <td>
                                {{ viewModel.data.user_nm }}
                            </td>
                        </tr>
                        <tr>
                            <th scope="row" class="w220"><label for="ttl">제목</label></th>
                            <td colspan="3">
                                {{ viewModel.data.ttl }}
                            </td>
                        </tr>
                        <tr>
                            <th scope="row" class="w220"><label for="cn">내용</label></th>
                            <td colspan="3">
                                {{ viewModel.data.cn }}
                            </td>
                        </tr>
                        <tr>
                            <th scope="row" class="w220"><label for="reg_dt">등록일자</label></th>
                            <td colspan="3">
                                {{ viewModel.data.reg_dt }}
                            </td>
                        </tr>
                        <tr>
                            <th scope="row"><label for="">첨부</label></th>
                            <td>
                                <ul>
                                    <li v-for="(item,i) in viewModel.filelist" :key="i">
                                        <a @click="fnFileDown(item)" class="btn-link" v-if="item.FILE_SE == '1'">{{ item.orgnl_file_nm }}</a>
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
        
        export default {
            data: function() {
                return {
                    viewModel:{
                        data:{},
                        userInfo:{},
                        filelist:[],
                    }
                };
            },
            components: {
            },
            mounted: function() {
                let vm = this;
                let sn = vm.$route.params.sn;
    
                vm.viewModel.userInfo = vm.$store.state.global.userInfo;
    
                vm.fnDetail(sn);
            },
            methods: {
                fnDetail:function(sn){
                    let vm = this;
                    let data = {
                        prgrm_sn: sn
                    }
    
                    Axios.post("/selectFdPrgrDetail.do", data)
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
                    gbn:'fdPrgr'
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
    