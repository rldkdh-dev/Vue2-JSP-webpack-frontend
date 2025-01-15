<template>
    <div>
        <div class="contents write">
            <div>
                <table class="table horizontal write">
                    <caption>안전보건 기준/제도 상세</caption>
                    <tbody>
                        <tr>
                            <th scope="row" class="w180"><label for="ttl">제목</label></th>
                            <td>{{ viewModel.data.ttl }}</td>
                        </tr>
                        <tr>
                            <th scope="row"><label for="wrtr">작성자</label></th>
                            <td>{{ viewModel.data.wrtr }}</td>
                        </tr>
                        <tr>
                            <th scope="row"><label for="cn">내용</label></th>
                            <td class="pre">{{ viewModel.data.cn }}</td>
                        </tr>
                        <tr>
                            <th scope="row"><label for="wrtr">이미지 첨부파일</label></th>
                            <td>
                                <imgsfileform :ref="'imgsfileform'" :pass="{id:'sc', mode:'view'}"></imgsfileform>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row"><label for="wrtr">첨부파일</label></th>
                            <td>
                                <ul>
                                    <li v-for="item in viewModel.filelist">
                                        <button class="btn-link" @click="fnFileDown(item)">{{ item.orgnl_file_nm }}</button>
                                    </li>
                                </ul>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div class="table_footer btn-right">
                    <router-link :to="'/'" class="btn btn-white"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-list-back"></use></svg>목록</router-link>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import "es6-promise/auto";
    import Vue from "vue";
    import Axios from "axios";
    import imgsfileform from '../../../common/vue/imgsfileform2.vue';
    export default {
        data: function() {
            return {
                viewModel:{
                    data:{},
                    userInfo:{},
                    filelist:[],
                },
                menu_se:$("#menu_se").val(),
            }
        },
        components: {
            'imgsfileform' : imgsfileform,
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
                    system_sn: sn,
                    menu_se: vm.menu_se
                }

                Axios.post("/selectOhStdDetail.do", data)
                .then(function(response) {
                    vm.viewModel.data = response.data.detail;
                    vm.viewModel.filelist = response.data.fileList.filter(data=>data.file_se == 2);

                    vm.$refs.imgsfileform.fnFileLoadList(response.data.fileList.filter(data=>data.file_se == 1));
                });
            },
            fnFileDown:function(item){

                const link = document.createElement("a")
                link.href = (item.strg_path.charAt()=='/' ? item.strg_path : item.strg_path.substring(2)) + item.strg_file_nm;
                link.download = item.orgnl_file_nm
                link.click();

                // let vm = this;
                // let send = {
                //     menu_se: item.menu_se,
                //     sn: item.sn,
                //     file_sn: item.file_sn,
                //     gbn:'ohStd'
                // }
                // // $(".loading").show();
                // // $("#mask").show();
                // Axios.post("/download.do",send,{responseType: "blob",}
                // ).then(function(e) {
                //     const url = window.URL.createObjectURL(new Blob([e.data], { type: e.headers["content-type"] }))
                //     const link = document.createElement("a")
                //     link.href = url
                //     link.download = item.orgnl_file_nm
                //     link.click()
                //     window.URL.revokeObjectURL(url)
                // }).then(function(){
                //     // $(".loading").hide();
                //     // $("#mask").hide();
                // });
            }
        }
    };
</script>