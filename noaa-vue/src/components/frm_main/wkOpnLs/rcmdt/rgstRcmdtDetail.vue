<template>
    <div>
        <div class="contents write">
			<div>
                <table class="table horizontal write">
                    <caption>건의사항 상세</caption>
                    <tbody>
                        <tr>
                            <th scope="row" class="w180"><label for="">분류</label></th>
                            <td>
                                {{ viewModel.data.code_nm }}
                            </td> 
                        </tr>
                        <tr>
                            <th scope="row"><label for="bplc">현장</label></th>
                            <td>
                                {{ viewModel.data.bplc_nm }}
                            </td>
                        </tr>
                        <tr>
                            <th scope="row"><label for="">작성자</label></th>
                            <td>
                                {{ viewModel.data.jbttl }} {{ viewModel.data.reg_nm }}
                            </td>
                        </tr>
                        <tr>
                            <th scope="row"><label for="">사진</label></th>
                            <td v-if="viewModel.data.strg_file_nm != null && viewModel.data.strg_file_nm != '' && viewModel.data.strg_file_nm != undefined">
                                <!-- <img :src="viewModel.data.strg_file_nm" style="width: 100px;"> -->
                                <imgsfileform :ref="'sugest_img'" :pass="{id:'sugest_img', mode:'view'}"></imgsfileform>
                            </td>
                            <!-- <td v-else>사진이 없습니다.</td> -->
                        </tr>
                        <tr>
                            <th scope="row"><label for="">의견내용</label></th>
                            <td>{{ viewModel.data.sugest_cn }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div v-if="viewModel.data.prgrs_stts == '2' || viewModel.data.prgrs_stts == '3' || viewModel.data.prgrs_stts == '4'">
                <h3>조치사항</h3>
                <table class="table horizontal write">
                    <caption>조치사항 상세</caption>
                    <tbody>
                        <tr>
                            <th scope="row" class="w180"><label for="">조치자</label></th>
                            <td>
                                {{ viewModel.data.maner_name }}
                            </td> 
                        </tr>
                        <tr>
                            <th scope="row"><label for="">조치사진</label></th>
                            <td v-if="viewModel.data.strg_file_nm2 != null && viewModel.data.strg_file_nm2 != '' && viewModel.data.strg_file_nm2 != undefined">
                                <imgsfileform :ref="'actn_img'" :pass="{id:'actn_img', mode:'view'}"></imgsfileform>
                            </td>
                            <td v-else>사진이 없습니다.</td>
                        </tr>
                        <tr>
                            <th scope="row"><label for="">조치내용</label></th>
                            <td>{{ viewModel.data.actn_cn }}</td>
                        </tr>
                        <tr>
                            <th v-if="viewModel.data.opinion_pic != null" scope="row"><label for="">본사 의견<br>({{ viewModel.data.jbttl2 }} {{ viewModel.data.opinion_pic }})</label></th>
                            <th v-else scope="row"><label for="">본사 의견</label></th>
                            <td>
                                {{ viewModel.data.opinion }}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            
            <div class="table_footer btn-right">
                <router-link :to="'/'" class="btn btn-white"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-list-back"></use></svg>목록</router-link>
            </div>
		</div>
    </div>
</template>

<script>
    import "es6-promise/auto";
    import Vue from "vue";
    import Axios from "axios";
    import imgsfileform from '../../../../common/vue/imgsfileform2.vue';

    export default {
        data: function() {
            return {
                viewModel:{
                    data:{
                        clsf_cd : '',
                        bplc_nm : '',
                        jbttl : '',
                        reg_nm : '',
                        strg_file_nm : '',
                        file_se1 : '',
                        file_se2 : '',
                        prgrs_stts : '',
                        strg_file_nm2 : '',
                        actn_cn : '',
                    },
                    rsltList:[],
                    userInfo:{},
                    fileList:[],
                    fileList2:[],
                    
                },
            };
        },
        components: {
            'imgsfileform' : imgsfileform,
        },
        mounted: function() {
            let vm = this;
            vm.fnInit();
        },
        activated:function(){
            this.fnInit();
        },
        deactivated:function(){
            this.$destroy();
        },
        methods: {
            fnInit: function(){
                let vm = this;
                vm.viewModel.userInfo = vm.$store.state.global.userInfo;

                let sn = vm.$route.params.sugest_sn;
                vm.sn = vm.$route.params.sugest_sn;
                
                vm.fnDetail(sn);
            },
            fnDetail:function(sn){
                let vm = this;
                let data = {
                    user_id: vm.viewModel.userInfo.user_id, 
                    sugest_sn: sn,
                }
                Axios.post("/selectRcmdtDetail.do", data)
                .then(function(response) {
                    vm.viewModel.rcmdt = response.data.rcmdt;
                    vm.viewModel.data = response.data.detail;
                    vm.viewModel.fileList = response.data.fileList;
                    vm.viewModel.fileList2 = response.data.fileList2;    

                }).then(function(){
                   vm.$nextTick(function() {
					if(vm.viewModel.fileList.length > 0){
                        vm.$refs.sugest_img.fnFileLoadList(vm.viewModel.fileList);
                    }
                    if(vm.viewModel.fileList2.length > 0){
                        vm.$refs.actn_img.fnFileLoadList(vm.viewModel.fileList2);
                    }
				})
                });
            },
        }
    };
</script>