<template>
    <div>
        <div class="contents write">
            <div id="viewDiv1" class="print_page contents">
                <table class="table horizontal write">
                    <caption>아차사고 이력 관리</caption>
                    <tbody>
                        <tr>
                            <th scope="row" class="w180"><label for="prdct_nm">발생일시</label></th>
                            <td colspan="3">
                                {{ viewModel.data.ocrn_dt }}
                            </td>
                        </tr>
                        <tr>
                            <th scope="row"><label for="prdct_nm">현장명</label></th>
                            <td colspan="3">
                                {{ viewModel.data.bplc_nm }}
                            </td>
                        </tr>
                        <tr>
                            <th scope="row"><label for="prdct_nm">사고명</label></th>
                            <td colspan="3">
                                {{ viewModel.data.ttl }}
                            </td>
                        </tr>
                        <tr>
                            <th scope="row"><label for="pstn">위치</label></th>
                            <td colspan="3">
                                {{ viewModel.data.pstn }}
                            </td>
                        </tr>
                        <tr>
                            <th scope="row"><label for="mkr">아차사고내용</label></th>
                            <td colspan="3">
                                {{viewModel.data.cn}}
                            </td>
                        </tr>
                        <tr>
                            <th scope="row"><label for="mkr">재발방지대책</label></th>
                            <td colspan="3">
                                {{viewModel.data.recr_prvn_cntrpln}}
                            </td>
                        </tr>
                        <tr>
                            <th scope="row"><label for="mkr">사진</label></th>
                            <td>
                                <img :src="viewModel.img" style="width:500px" v-if="viewModel.img != ''" @error="imageLoadError"/>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row"><label for="file">첨부</label></th>
                            <td>
                                <ul>
                                    <li v-for="item in viewModel.filelist" :key="item">
                                        <button class="btn-link" @click="fnFileDown(item)">{{ item.orgnl_file_nm }}</button>
                                    </li>
                                </ul>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div class="table_footer btn-right">
                    <button @click="fnPrint('viewDiv1')" class="btn btn-purple btn-print"><svg class="icon"><use xlink:href="/img/symbol-defs.svg#icon-print"></use></svg>인쇄</button>
                    <button class="btn btn-white" @click="fnBack()"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-list-back"></use></svg>목록</button>
                </div>
            </div>
        </div>
    </div>
    </template>
    
    <script>
        import "es6-promise/auto";
        import Vue from "vue";
        import Axios from "axios";
        import printJS from 'print-js';
        
        export default {
            data: function() {
                return {
                    viewModel:{
                        data:[],
                        userInfo:{},
                        filelist:[],
                        img:"",
                        flag:false,
                    }
                };
            },
            mounted: function() {
                let vm = this;
                let uid = vm.$route.params.uid;
                vm.viewModel.userInfo = vm.$store.state.global.userInfo;
                vm.fnDetail(uid);
            },
            methods: {
                fnDetail:function(sn){
                    let vm = this;
                    let data = {
                        acdnt_mng_sn: sn
                    }
    
                    Axios.post("/selectMngmtSlpAcdtCsDetail.do", data).then(function(response) {
                        vm.viewModel.data = response.data.detail[0];
                        vm.viewModel.filelist = response.data.fileList;
                        var imglist = vm.viewModel.filelist.filter(item => item.file_se == "I");
                        if(vm.viewModel.filelist.length != 0){
                            const strg_path = imglist[0].strg_path;
                            const strg_file_nm = imglist[0].strg_file_nm;
                            vm.viewModel.img = strg_path+strg_file_nm;
                        }else{
                            alert("첨부된 파일이 없습니다.");
                        }
                    });
    
                },
                fnFileDown:function(item){
                    let vm = this;
                    let send = {
                        menu_se: item.menu_se,
                        sn: item.sn,
                        file_sn: item.file_sn,
                        gbn:'mngmt'
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
                fnBack:function(){
                    this.$router.push('/');
                },
                fnPrint : function(divName){
                    
                    // if(!this.viewModel.flag){
                        printJS({
                            printable:divName,
                            type:'html',
                            css: ['/css/basic.css','/css/print.css'],
                            scanStyles : false,
                        });
                    // }else{
                    //     alert("이미지를 찾을 수 없습니다.\n인쇄할 수 없습니다.");
                    // }
                    
                },
                imageLoadError:function(){
                    this.viewModel.flag = true;
                    this.viewModel.img = '';
                }
            }
        };
    </script>
    