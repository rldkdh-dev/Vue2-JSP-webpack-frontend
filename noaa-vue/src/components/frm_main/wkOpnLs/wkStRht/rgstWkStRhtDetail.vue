<template>
    <div>
        <div class="contents write" id="printDiv">
            <div class="btn-group btn-right none" >
                <button class="btn btn-purple" @click="fnPrint();"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-print"></use></svg>인쇄</button>
            </div>
			<div>
                <table class="table horizontal write">
                    <caption>작업중지권 상세</caption>
                    <tbody>
                        <tr>
                            <th scope="row" class="w180"><label for="">작업중지 요청자</label></th>
                            <td>
                                {{ viewModel.data.rqstr_jbttl_nm }} {{ viewModel.data.rqstr_nm }}
                            </td> 
                        </tr>
                        <tr>
                            <th scope="row"><label for="bplc">현장명</label></th>
                            <td>
                                {{ viewModel.data.bplc_nm }}
                            </td>
                        </tr>
                        <tr>
                            <th scope="row"><label for="">위험명</label></th>
                            <td>
                                <ul class="input_wrap">
                                    <li v-for="(item, i) in viewModel.riskNmList" :key="i">
                                        <!-- <label :for="'riskNmList_'+item.CODE" @change="fnRiskSeClick(item.CODE);">
                                            <input type="checkbox" :id="'riskNmList_'+item.CODE" v-model="viewModel.data.risk_se" :value="item.CODE" disabled>{{ item.CODE_NM }}
                                         </label>
                                         <input v-if="item.CODE == 'ETC'" type="text" v-model="viewModel.data.risk_cn" :id="'risk_se_etc'" disabled> -->
                                         <div class="input_group">
                                            <label :for="'riskNmList_'+item.CODE" @change="fnRiskSeClick(item.CODE);">
                                                <input type="checkbox" :id="'riskNmList_'+item.CODE" v-model="viewModel.data.risk_se" :value="item.CODE" disabled>{{ item.CODE_NM }}
                                            </label>
                                            <input v-if="item.CODE == 'ETC'" type="text" v-model="viewModel.data.risk_cn" :id="'risk_se_etc'" disabled>
                                        </div>
                                    </li>
                                </ul>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row"><label for="">중지사진</label></th>
                            <td>
                                <imgsfileform :ref="'rqstr_img'" :pass="{id:'rqstr_img', mode:'view'}"></imgsfileform>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row"><label for="">요청내용</label></th>
                            <td class="pre">{{ viewModel.data.dmnd_cn }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div>
                <h3>조치사항</h3>
                <table class="table horizontal write">
                    <caption>조치사항 상세</caption>
                    <tbody>
                        <tr>
                            <th scope="row" class="w180"><label for="">조치자</label></th>
                            <td>
                                {{ viewModel.data.maner_jbttl_nm }} {{ viewModel.data.maner_nm }}
                            </td> 
                        </tr>
                        <tr>
                            <th scope="row"><label for="">조치 구분</label></th>
                            <td>
                               {{ viewModel.data.actn_yn_nm }}
                            </td>
                        </tr>
                        <tr>
                            <th scope="row"><label for="">조치사진</label></th>
                            <td>
                                <imgsfileform :ref="'maner_img'" :pass="{id:'maner_img', mode:'view'}"></imgsfileform>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row"><label for="">조치내용</label></th>
                            <td class="pre">{{viewModel.data.actn_cn}}</td>
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
    import printJS from 'print-js'

    export default {
        data: function() {
            return {
                viewModel:{
                    data:{
                        risk_se: [],
                    },
                    rsltList:[],
                    userInfo:{},
                    riskNmList:[],
                    stpgeFileList:[],
                    imgfilelist:[],
                    imgdeletefileList:[],
                },
            };
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
            // vm.fnInit();
        },
        methods: {
            fnInit: function(){
                let vm = this;
                vm.viewModel.userInfo = vm.$store.state.global.userInfo;

                let sn = vm.$route.params.sn;
                vm.sn = vm.$route.params.sn;
                
                vm.fnDetail(sn);
            },
            fnDetail:function(sn){
                let vm = this;
                let data = {
                    user_id: vm.viewModel.userInfo.user_id, 
                    stpge_sn: sn,
                }
                Axios.post("/selectWkStRhtDetail.do", data)
                .then(function(response) {
                    vm.viewModel.riskNmList = response.data.riskNmList;

                    vm.viewModel.data = response.data.detail;
                    vm.viewModel.rsltList = response.data.rsltList;
                    vm.viewModel.stpgeFileList = response.data.fileList;
                    vm.viewModel.imgfilelist = response.data.fileList2;

                    var arr = vm.viewModel.data.risk_se.split(',');
                    vm.viewModel.data.risk_se = [];
                    for(let i=0; i<arr.length; i++){
                        vm.viewModel.data.risk_se.push(arr[i]);
                    }
                    
                    vm.$refs.rqstr_img.fnFileLoadList(vm.viewModel.stpgeFileList);
                    vm.$refs.maner_img.fnFileLoadList(vm.viewModel.imgfilelist);
                });
            },
            fnPrint : function(){
                printJS({
                    printable:'printDiv',
                    type:'html',
                    css: ['/css/basic.css','/css/print.css'],
                    scanStyles : false,
                });
            },
        }
    };
</script>