<template>
    <div>
        <h3>점검/조치 사항</h3>
         <table class="table horizontal write">
             <caption>점검사항 상세</caption>
             <tbody v-for="(item, i) in viewModel.rsltList" :key="i">
                <tr>
                    <th scope="row" :rowspan="item.chck_rslt == 'I' ? 10 : 5" class="text-center w50" v-if="pass.gbn=='risk'">
                        {{ item.chck_dt|yyyyMMdd }}
                    </th>
                    <th scope="row" :rowspan="item.chck_rslt == 'I' ? 9 : 4" class="text-center w50" v-else-if="pass.gbn=='chk'">
                        {{ i+1 }}
                    </th>
                    <th scope="row" :rowspan="item.chck_rslt == 'I' ? 11 : 6" class="text-center w50" v-else-if="pass.gbn=='diy'">
                        {{ i+1 }}
                    </th>
                    <th scope="row" :rowspan="item.chck_rslt == 'I' ? 10 : 5" class="text-center w50" v-else>
                    </th>
                    <th scope="row" class="w130" ><label for="">점검결과</label></th>
                    <td >
                        {{ item.chck_rslt_nm }}
                    </td>
                </tr>
                <tr v-if="pass.gbn != 'chk'">
                    <th scope="row" class="w130"><label for="">점검자</label></th>
                    <td>
                        {{ item.reg_nm }} ( {{ item.jbttl_nm }} )
                    </td>
                </tr>
                <tr v-if ="chck_clsf.indexOf('FC') == -1 && item.bplc_team != null" >
                <!-- <tr v-if ="chck_clsf.indexOf('REC') == -1 && chck_clsf.indexOf('FC') == -1" > -->
                    <th scope="row"><label for="">현장팀명</label></th>
                    <td>
                        {{ item.bplc_team }}
                    </td> 
                </tr>
                <!-- <tr v-if="pass.mode=='risk_view' || pass.se == 'diychk'">
                    <th scope="row" class="w130"><label for="">점검결과</label></th>
                    <td>
                        {{ item.chck_rslt_nm }}
                    </td> 
                </tr> -->
                <tr>
                    <th scope="row"><label for="">사진등록</label></th>
                    <td>
                        <imgsfileform :ref="'imgsfileform'" :pass="{id:'chckRslt'+i, index:i, gbn:'chckRslt', mode:'view'}" @filelist="fnImgFileList" @fileDelete="fnImgFileDelete"></imgsfileform>
                    </td>
                </tr>
                <tr>
                    <th scope="row"><label for="">점검내용</label></th>
                    <td class="pre">{{item.chck_cn}}</td> 
                </tr>
                <tr v-if="item.chck_rslt == 'I'">
                    <th scope="row" class=""><label for="">지적/요청사항</label></th>
                    <td class="pre">{{item.actn_mttr}}</td>
                </tr>
                <tr v-if="item.chck_rslt == 'I'">
                    <th scope="row" class=""><label for="">조치자</label></th>
                    <td>
                        {{ item.actn_pic_nm }}
                    </td>
                </tr>
                <tr v-show="item.chck_rslt == 'I'">
                    <th scope="row" class=""><label for="">사진등록</label></th>
                    <td>
                        <imgsfileform :pass="{id:'mttr'+i, index:i, gbn:'mttr'}" @filelist="fnImgFileList" @fileDelete="fnImgFileDelete" v-if="pass.mode=='update' && item.mttr_yn == 'Y'" :ref="'mttr_imgsfileform'"></imgsfileform>
                        <imgsfileform :pass="{id:'mttr'+i, index:i, gbn:'mttr', mode:'view'}" @filelist="fnImgFileList" @fileDelete="fnImgFileDelete" v-else :ref="'mttr_imgsfileform'"></imgsfileform>
                    </td>
                </tr>
                <tr v-if="item.chck_rslt == 'I'">
                    <th scope="row" :class="{'essential': pass.mode=='update' && item.mttr_yn == 'Y'}"><label for="">조치내용</label></th>
                    <td v-if="pass.mode=='update' && item.mttr_yn == 'Y'">
                        <textarea id="actn_sttus" title="조치내용" v-model="item.actn_sttus"></textarea>
                    </td>
                    <td v-else class="pre">{{ item.actn_sttus }}</td>
                </tr>
                <tr v-if="item.chck_rslt == 'I'">
                    <th scope="row" :class="{'essential': pass.mode=='update' && item.mttr_yn == 'Y'}"><label for="">진행현황</label></th>
                    <td>
                        <div v-if="pass.mode=='update' && item.mttr_yn == 'Y'">
                            <template v-for="(cd_item, cd_i) in viewModel.mttrPrgrsList" :key="cd_i">
                                <label :for="'actn_prgrs'+i+'_'+cd_item.CODE"><input type="radio" :id="'actn_prgrs'+i+'_'+cd_item.CODE" :name="'radio_btn02'+i" v-model="item.actn_prgrs" :value="cd_item.CODE">{{ cd_item.CODE_NM }}</label>
                            </template>
                        </div>
                        <span v-else>{{ item.actn_prgrs_nm }}</span>
                    </td>
                </tr>
                <tr v-if="pass.gbn == 'diy' && pass.bplc_mngr != item.reg_id">
                    <th scope="row" class=""><label for="">검토 및 지시사항</label></th>
                    <td v-if="pass.mode == 'mngr_update'">
                        <textarea :id="'rvw_mttr_'+i" v-model="item.rvw_mttr" rows="5"></textarea>
                    </td>
                    <td v-else class="pre">{{ item.rvw_mttr }}</td>
                </tr>
                <!-- <tr v-if="pass.se == 'diychk'">
                    <th scope="row" class=""><label for="">현장 안전점검사항</label></th>
                    <td v-if="pass.mode == 'mngr_update'">
                        <textarea :id="'safe_chck_mttr_'+i" v-model="item.safe_chck_mttr" rows="5"></textarea>
                    </td>
                    <td v-else class="pre">{{ item.safe_chck_mttr }}</td>
                </tr> -->
             </tbody>
         </table>
     </div>
 </template>
 
 <script>
     import "es6-promise/auto";
     import Vue from "vue";
     import Axios from "axios";
     import imgsfileform from '../../../../common/vue/imgsfileform2.vue';
 
     export default {
         props: ['pass'],
         data: function() {
             return {
                chck_clsf: this.pass.mode == 'popup_view' || this.pass.mode == 'update' ? this.$parent.$parent.viewModel.data.chck_clsf : this.$parent.viewModel.data.chck_clsf,
                imgShow: false,
                popIndex: '',
                viewModel:{
                    rsltList:[],
                    delItemList:[],
                    mttrPrgrsList:[],
                    userInfo:{},
                    chkRsltList:[],
                    delRsltList:[],
                },
             };
         },
         components:{
             'imgsfileform' : imgsfileform,
         },
         mounted: function() {
            let vm = this
            vm.viewModel.userInfo = vm.$store.state.global.userInfo;
         },
         methods: {
            fnLoadList:function(list, fileList, mttrFileList) {
                let vm = this;
                //리스트 초기화
                vm.viewModel.rsltList = [];
                vm.viewModel.rsltList = list;
                for(let i=0; i<vm.viewModel.rsltList.length; i++){
                    vm.viewModel.rsltList[i].imgfilelist = fileList.filter(data => data.sub_sn == vm.viewModel.rsltList[i].chck_act_rslt_sn && data.sn == vm.viewModel.rsltList[i].chck_act_sn);
                    vm.viewModel.rsltList[i].mttr_imgfilelist = mttrFileList.filter(data => data.sub_sn == vm.viewModel.rsltList[i].chck_act_rslt_sn && data.sn == vm.viewModel.rsltList[i].chck_act_sn);

                    vm.$nextTick(function() {
                        vm.fnFileLoadList(i)
                    });
                }

                vm.chck_clsf = this.pass.mode == 'popup_view' || this.pass.mode == 'update' ? this.$parent.$parent.viewModel.data.chck_clsf : this.$parent.viewModel.data.chck_clsf

            },
            fnFileLoadList: function(i){
                let vm = this;
                if(vm.viewModel.rsltList != undefined && vm.viewModel.rsltList[i].imgfilelist != null){
                    vm.$refs.imgsfileform[i].fnFileLoadList(vm.viewModel.rsltList[i].imgfilelist);
                }
                if(vm.viewModel.rsltList != undefined && vm.viewModel.rsltList[i].mttr_imgfilelist != null){
                    vm.$refs.mttr_imgsfileform[i].fnFileLoadList(vm.viewModel.rsltList[i].mttr_imgfilelist);
                }
            },
            fnImgFileList:function(vm){
                this.viewModel.rsltList[vm.viewModel.index].mttr_imgfilelist = vm.viewModel.filelist;
                this.fnWrite();
            },
            fnImgFileDelete:function(vm){
                this.viewModel.rsltList[vm.viewModel.index].mttr_imgdeletefileList = vm.viewModel.deletefileList;
                this.fnWrite();
            },
            fnWrite:function(){
                let vm = this;
                vm.$emit('rsltList', vm);
            },
         }
     };
 </script>