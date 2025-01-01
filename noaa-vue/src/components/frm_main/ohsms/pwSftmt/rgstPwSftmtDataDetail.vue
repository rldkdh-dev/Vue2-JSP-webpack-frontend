<template>
    <div>
        <div class="contents write">
            <table class="table horizontal write">
                <caption>주간안전회의 자료 등록</caption>
                <template v-if="viewModel.deptList.length > 0">
                    <tbody v-for="(item, index) in viewModel.deptList">
                        <tr>
                            <th scope="row"><label>부서명</label></th>
                            <td>
                                {{ item.dept_nm }}
                            </td>
                        </tr>
                        <tr>
                            <th scope="row"><label>첨부</label></th>
                            <td>
                                <ul>
                                    <li v-for="file in item.filelist">
                                        <a @click="fnFileDown(file)" style="cursor: pointer;" class="btn-link">{{ file.orgnl_file_nm }}</a>
                                    </li>
                                </ul>
                            </td>
                        </tr>
                    </tbody>
                </template>
                <template v-else>
                    <tbody>
                        <tr>
                            <th scope="row">
                                등록된 자료가 없습니다.
                            </th>
                        </tr>
                    </tbody>
                </template>
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
    import Common from "../../../../common/js/common.js";
    
    export default {
        data: function() {
            return {
                bplcPop:false,
                popIndex: '',
                viewModel:{
                    deptList: [{
                        filelist:[],
                        dept_sn:'',
                        dept_nm:'',
                    }],
                    fileList:[],
                    userInfo:{},
                    
                },
                mtg_sn:'',
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

                vm.mtg_sn = sn;
                vm.fnDetail(sn);                
            },
            fnDetail: function(sn){
                let vm = this;
                let data = {
                    mtg_sn: sn,
                }

                Axios.post("/selectPwSftmtDataTotDetail.do", data)
                .then(function(response) {
                    vm.viewModel.deptList = response.data.deptList;
                    vm.viewModel.fileList = response.data.fileList;
                    
                    for(let i=0; i<vm.viewModel.deptList.length; i++){
                        vm.viewModel.deptList[i].filelist = vm.viewModel.fileList.filter(data=> data.sub_sn == vm.viewModel.deptList[i].dept_sn);
                    }
                });
            },
            fnFileDown:function(item){
                let vm = this;
                let send = {
                    mtg_sn: vm.mtg_sn,
                    bplc_sn: item.bplc_sn,
                    file_sn: item.file_sn,
                    gbn:'pwSftmtData'
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
