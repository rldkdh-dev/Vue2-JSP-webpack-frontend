<template>
    <div>
        <div class="contents write">
            <div>
                <table class="table horizontal write">
                    <caption>경영자 안전점검 등록</caption>
                    <tbody>
                        <tr>
                            <th scope="row" class="w180"><label for="">점검현장</label></th>
                            <!-- <td><input type="text" id="" title="점검현장"></td> -->
                            <td colspan="3" >{{ viewModel.list.bplc_nm }}</td>
                        </tr>
                        <tr>
                            <th scope="row"><label for="">점검일자</label></th>
                            <td>{{ viewModel.list.chck_dt }}</td> 
                        </tr>
                        <tr>
                            <th scope="row"><label for="">점검내용</label></th>
                            <td><p v-html="viewModel.list.chck_cn"></p></td> 
                        </tr>
                        <tr>
                            <th scope="row"><label for="">점검항목</label></th>
                            <td>
                                <ul>
                                    <li v-for="item in viewModel.fileList" :key="item">
                                        <button class="btn-link" @click="fnFileDown(item)">{{ item.orgnl_file_nm }}</button>
                                    </li>
                                </ul>
                                <!-- <fileform @filelist="fnFilelist"  @fileDelete="fnFileDelete" :pass="{id:'rgstChkPoint'}" ref="files"></fileform> -->
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
    import Fileform from "../../fileform2.vue";
    
    export default {
        components: {
            Fileform
        },
        data: function() {
            return {
                userInfo:{},
                bplcPop:false,
                viewModel:{
                    list:{},
                    fileList:[],
                    fileGroup:[],
                    deletefileList:[],
                }
            };
        },
        mounted: function() {
            let vt = this;
            
            vt.userInfo = this.$store.state.global.userInfo,
            vt.uid = window.location.href.split('/').pop();
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
                
                vt.fnDetail(vt.uid);
                vt.$forceUpdate(); 
            },
            fnDetail:function(value){ 
                let vt = this;
                let vm = this.viewModel;
                vm.fileList = [];
                vm.actionFileList = [];
                let data = {
                    chck_sn : value
                }
                Axios.post("/selectRgstChkPointDetail.do", data).then(function(response) {
                    console.log(response.data);

                    vm.list = response.data.detail;
                    vm.list.chck_cn = vm.list.chck_cn.replaceAll(/(\n|\r\n)/g,'<br>');
                    vm.list.chck_dt = (vm.list.chck_dt).substring(0,10);
                    for(let i=0; i<response.data.fileList.length; i++){
                        if(response.data.fileList[i].file_se == '1'){ //점검항목 파일
                            vm.fileList.push(response.data.fileList[i]);
                        }
                    }
                });
            },
            fnFileDown:function(item){
                let vt = this;
                let send = {
                    // se: type,
                    sn: vt.uid,
                    file_sn: item.file_sn,
                    gbn:'rgstChkPoint'
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