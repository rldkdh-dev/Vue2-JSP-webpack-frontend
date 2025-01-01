<template>
    <div>
        <div class="contents write">
            <table class="table horizontal write">
                <caption>종사자의견청취 등록</caption>
                <tbody>
                    <tr>
                        <th scope="row" class="w180"><label for="">현장</label></th>
                                <!-- <td colspan="3" v-if="userInfo.bplc_yn == 'Y'">{{ viewModel.BPLC_NM }}</td>
                                <td colspan="3" v-if="userInfo.bplc_yn !='Y'"> -->
                                <td colspan="2">
                                    <div class="input_group">
                                        {{ viewModel.list.bplc_nm }}
                                    </div>
                                </td>
                    </tr>
                    <tr>
                        <th scope="row"><label for="">작성자</label></th>
                        <td class="text-center" v-if="viewModel.list.ocpt_detail_nm">{{ viewModel.list.ocpt_detail_nm }}</td> 
                        <td class="text-center" v-if="!viewModel.list.ocpt_detail_nm">-</td> 
                        <td class="text-center" >{{ viewModel.list.user_nm }}</td> 
                    </tr>
                    <tr>
                        <th scope="row"><label for="">제안제목</label></th>
                        <td colspan="2">{{ viewModel.list.propse_ttl }}</td> 
                    </tr>
                    <tr>
                        <th scope="row"><label for="">제안내용</label></th>
                        <td colspan="2">
                            <p v-html="viewModel.list.propse_cn"></p>
                        </td> 
                    </tr>
                    <tr>
                        <th scope="row"><label for="">첨부사진</label></th>
                        <td colspan="2" v-if="viewModel.imgList.length > 0">
                            <imgsfileform :ref="'imgs'" :pass="{id:'idea', gbn:'idea', mode:'view'}" @filelist="fnImgFileList" @fileDelete="fnImgFileDelete"></imgsfileform>
                        </td>
                        <td colspan="2" v-if="viewModel.imgList.length <= 0"></td>
                    </tr>
                    <tr>
                        <th scope="row"><label for="">첨부파일</label></th>
                        <td colspan="2">
                            <ul>
                                <li v-for="item in viewModel.fileList" :key="item">
                                    <button class="btn-link" @click="fnFileDown(item)">{{ item.orgnl_file_nm }}</button>
                                </li>
                            </ul>
                            <!-- <fileform @filelist="fnFilelist"  @fileDelete="fnFileDelete" :pass="{id:'rgstIdea'}" ref="files"></fileform> -->
                        </td>
                    </tr>
                </tbody>
            </table>
            <div class="table_footer btn-right">
                <router-link to="/" class="btn btn-white"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-list-back"></use></svg>목록</router-link>
            </div>
        </div>
    </div>
</template>

<script>
    import "es6-promise/auto";
    import Vue from "vue";
    import Axios from "axios";
    import Fileform from "../../../../common/vue/fileform2.vue";
    import Imgsfileform from '../../../../common/vue/imgsfileform2.vue';
    
    export default {
        components: {
            Fileform, Imgsfileform
        },
        data: function() {
            return {
                state_k:'',
                viewModel:{
                    userInfo:{},
                    list:{},
                    fileList:[],
                    imgList:[],
                }
            };
        },
        mounted: function() {
            let vt = this;
            
            vt.userInfo = this.$store.state.global.userInfo,
            vt.uid = window.location.href.split('/').pop();
            
            vt.fnInit(vt.uid);
            
        },
        activated:function(){
            this.fnInit();
        },
        deactivated:function(){
            this.$destroy();
        },
        methods: {
            fnInit:function(sn){
                let vt = this;
                let vm = this.viewModel;
                vm.fileList = [];
                vm.imgList = [];
                
                Axios.post("/selectSafeIDEADetail.do", {propse_sn : sn}).then(function(res){
                    console.log(res);
                    vm.list = res.data.detail;
                    vm.list.propse_cn = vm.list.propse_cn.replaceAll(/(\n|\r\n)/g,'<br>');
                    if(res.data.fileList.length > 0){
                        for(let i=0; i<res.data.fileList.length; i++){
                            if(res.data.fileList[i].file_se == '1'){ //사진
                                vm.imgList.push(res.data.fileList[i]);
                            }if(res.data.fileList[i].file_se == '2'){ //파일
                                vm.fileList.push(res.data.fileList[i]);
                            }
                        }
                        vt.$nextTick(function() {
                            if(vm.imgList.length > 0){
                                vt.$refs.imgs.fnFileLoadList(vm.imgList);
                            }      
                        })              
                    }
                }).catch(function(ex) {
                    console.log(ex);
                }).finally(function(){
                    vt.$forceUpdate();
                })
                
            },
            fnFileDown:function(item){
                let vt = this;
                let send = {
                    // se: type,
                    sn: vt.uid,
                    file_sn: item.file_sn,
                    gbn:'safeIdea'
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