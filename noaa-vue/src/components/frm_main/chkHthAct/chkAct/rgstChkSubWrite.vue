<template>
    <div>
         <h3>점검/조치 사항</h3>
         <div class="table_top btn-right">
            <button class="btn btn-light-purple" @click="fnAdd();"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-wrap-text"></use></svg>점검사항 추가</button>
            <button class="btn btn-gray" @click="fnDel();"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-trash-can"></use></svg>삭제</button>
        </div>
         <table class="table horizontal write">
             <caption>점검사항 등록</caption>
             <tbody v-for="(item, i) in viewModel.rsltList" :key="i">
                <tr>
                    <th scope="row" :rowspan="item.chck_rslt == 'I' ? 6 : 4" class="text-center w50">
                        <input type="checkbox" :id="'check'+i" :value="i" v-model="viewModel.delItemList" title="선택">
                    </th>
                    <th scope="row" class="w130 essential"><label for="">점검결과</label></th>
                    <td>
                        <div class="input_group">
                            <template v-for="(cd_item, cd_i) in viewModel.chkRsltList" :key="cd_i">
                                <label :for="'chck_rslt'+i+'_'+cd_item.CODE"><input type="radio" :id="'chck_rslt'+i+'_'+cd_item.CODE" :name="'radio_btn02'+i" v-model="item.chck_rslt" :value="cd_item.CODE" @change="fnChckRsltChange(i)">{{ cd_item.CODE_NM }}</label>
                            </template>
                        </div>
                    </td> 
                </tr>
                <!-- <tr v-if = "$parent.viewModel.data.chck_clsf.indexOf('REC') == -1 && $parent.viewModel.data.chck_clsf.indexOf('FC') == -1" > -->
                    <tr v-if = "$parent.viewModel.data.chck_clsf.indexOf('FC') == -1" >
                    <th scope="row" class="essential"><label for="">현장팀명</label></th>
                    <td>
                        <select title="팀명 선택" v-model="item.bplc_team_sn" :id="'sub_bplc_team_sn_'+i" @click="$parent.fnSelectClick();">
                            <option value=''>선택</option>
                            <option v-for="item in $parent.viewModel.bplcTeamList" :value="item.BPLC_TEAM_SN">{{ item.BPLC_TEAM_NM }}</option>
                        </select>
                    </td> 
                </tr>
                <tr>
                    <th scope="row"><label for="">사진등록</label></th>
                    <td>
                        <imgsfileform :ref="'imgsfileform'" :pass="{id:'chckRslt'+i, index:i, gbn:'chckRslt'}" @filelist="fnImgFileList" @fileDelete="fnImgFileDelete"></imgsfileform>
                    </td>
                </tr>
                <tr>
                    <th scope="row" class="essential"><label for="">점검내용</label></th>
                    <td><textarea title="점검내용" rows="5" v-model="item.chck_cn" @input="fnWrite" :id="'chck_cn_'+i"></textarea></td> 
                </tr>
                <tr v-if="item.chck_rslt == 'I'">
                    <th scope="row" class="essential"><label for="">지적/요청사항</label></th>
                    <td>
                        <textarea title="지적/요청사항" v-model="item.actn_mttr" @keyup="fnWrite" :id="'actn_mttr_'+i"></textarea>
                    </td>
                </tr>
                <tr v-if="item.chck_rslt == 'I'">
                    <th scope="row" class="essential"><label for="">조치자</label></th>
                    <td>
                        <div class="input_group input_btn">
                            <input type="text" :id="'actn_pic_nm'+i" :value="item.actn_pic_nm" readonly @click="fnPopup(i);">
                            <label :for="'actn_pic_nm'+i"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-search"></use></svg></label>
                        </div>
                    </td>
                </tr>
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

            vm.viewModel.chkRsltList = vm.$parent.viewModel.chkRsltList;

            if(vm.pass.mode == 'write'){   //신규작성일 경우 초기화
                vm.viewModel.rsltList.push({chck_rslt:'G', chck_act_rslt_sn: 1, imgfilelist:[], actn_pic_nm:'',bplc_team_sn:''});

                vm.fnWrite();
            }else{
                if(vm.viewModel.rsltList.length == 0){   
                    vm.viewModel.rsltList.push({chck_rslt:'G', chck_act_rslt_sn: 1, imgfilelist:[], actn_pic_nm:'',bplc_team_sn:''});
                    vm.fnWrite();
                }
            }
         },
         methods: {
             fnAdd: function(){
                let vm = this;

                let maxSn = 1;
                if(vm.viewModel.rsltList.length > 0){
                    maxSn = (vm.viewModel.rsltList[vm.viewModel.rsltList.length-1].chck_act_rslt_sn) + 1;
                }
                
                vm.viewModel.rsltList.push({chck_rslt:'G', chck_act_rslt_sn: maxSn, imgfilelist:[], actn_pic_nm:'',bplc_team_sn:''});

                vm.fnWrite();
             },
             fnDel: function(){
                let vm = this;

                vm.viewModel.delItemList.sort();

                console.log("vm.viewModel.delItemList > " + vm.viewModel.delItemList)
                if(vm.viewModel.delItemList.length > 0 ){

                    for(let i=vm.viewModel.delItemList.length; i>0; i--){
                        let index = vm.viewModel.delItemList[i-1];

                        console.log("index > " + index)
                        vm.viewModel.delRsltList.push(vm.viewModel.rsltList[index].chck_act_rslt_sn);
                        
                        vm.viewModel.rsltList.splice(index, 1);                        

                        //점검사항 하나도 없을 경우는 새로 하나 생성
                        if(vm.viewModel.rsltList.length == 0){
                            vm.viewModel.rsltList.push({chck_rslt:'G', chck_act_rslt_sn: 1, imgfilelist:[], actn_pic_nm:'',bplc_team_sn:''});
                            //no-img class 적용시키기                            

                            vm.$refs.imgsfileform[0].viewModel.filelist = [];
                            vm.$refs.imgsfileform[0].viewModel.uploadImageSrc = [];

                            $(".img_area.img_upload").addClass("no-img");
                        }                     
                    }
                }else{
                    alert("삭제할 점검사항을 선택해주세요.");
                    return false;
                }
                
                
                for(let i=0; i<vm.viewModel.rsltList.length; i++){
                    vm.fnFileLoadList(i);
                }

                //삭제 리스트 초기화
                vm.viewModel.delItemList = [];

                vm.fnWrite();
             },
            fnPopup: function(i) {
                let vm = this;
                vm.popIndex = i;
                vm.$parent.fnPopup();
            },
            fnMemberAdd: function(list){
                let vm = this;

                let userNmStr = "";
                let userIdStr = "";
                for(let i=0; i<list.length; i++){
                    if(userNmStr == ""){
                        userNmStr = list[i].user_nm;
                        userIdStr = list[i].user_id;
                    }else{
                        userNmStr += "," + list[i].user_nm;
                        userIdStr += "," + list[i].user_id;
                    }
                }
                vm.viewModel.rsltList[vm.popIndex].actn_pic_nm = userNmStr;
                vm.viewModel.rsltList[vm.popIndex].actn_pic = userIdStr;

                vm.fnWrite();
            },
            fnWrite:function(){
                let vm = this;
                vm.$emit('rsltList', vm);
            },
            fnLoadList:function(list, fileList) {
                let vm = this;
                vm.viewModel.rsltList = list;
            
                for(let i=0; i<vm.viewModel.rsltList.length; i++){
                    vm.viewModel.rsltList[i].imgfilelist = fileList.filter(data => data.sub_sn == vm.viewModel.rsltList[i].chck_act_rslt_sn);

                    vm.$nextTick(function() {
                        vm.fnFileLoadList(i)
                    });
                }
            },
            fnFileLoadList: function(i){
                let vm = this;
                if(vm.viewModel.rsltList[i] != undefined && vm.viewModel.rsltList[i].imgfilelist != null){
                    vm.$refs.imgsfileform[i].fnFileLoadList(vm.viewModel.rsltList[i].imgfilelist);
                }
            },
            fnImgFileList:function(vm){
                this.viewModel.rsltList[vm.viewModel.index].imgfilelist = vm.viewModel.filelist;
                this.fnWrite();
            },
            fnImgFileDelete:function(vm){
                this.viewModel.rsltList[vm.viewModel.index].imgdeletefileList = vm.viewModel.deletefileList;
                this.fnWrite();
            },
            fnChckRsltChange:function(index){
                let vm = this;
                //초기화
                vm.viewModel.rsltList[index].actn_mttr = '';
                vm.viewModel.rsltList[index].actn_pic = '';
                vm.viewModel.rsltList[index].actn_pic_nm = '';
                
                vm.fnWrite();
            },
         }
     };
 </script>