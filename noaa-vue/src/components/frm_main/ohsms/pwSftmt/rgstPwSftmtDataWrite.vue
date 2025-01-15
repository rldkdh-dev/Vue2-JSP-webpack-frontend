<template>
    <div>
        <div class="contents write">
            <table class="table horizontal write">
                <caption>주간안전회의 자료 등록</caption>
                <tbody>
                    <tr>
                        <th scope="row" class="w180"><label>부서</label></th>
                        <td>
                            <div class="input_group">
                                {{ viewModel.data.dept_nm }}
                                <!-- <button @click="fnPopup(i);" v-if="viewModel.userInfo.bplc_yn !='Y'"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-search"></use></svg></button> -->
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row"><label>첨부</label></th>
                        <td>
                            <fileform @filelist="fnFilelist"  @fileDelete="fnFileDelete" :pass="{id:'sc'}" :ref="'files'"></fileform>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div class="table_footer btn-right">
                <button class="btn btn-purple" @click.prevent="fnSave()"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-post-add"></use></svg>등록</button>
                <router-link to="/" class="btn btn-white"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-list-back"></use></svg>목록</router-link>
            </div>
        </div>
        <bplc ref="bplc" v-if="bplcPop==true" :pass="{dept_sn: viewModel.userInfo.dept_sn, team_sn: viewModel.userInfo.team_sn}"></bplc>
    </div>    
</template>

<script>
    import "es6-promise/auto";
    import Vue from "vue";
    import Axios from "axios";
    import Common from "../../../../common/js/common.js";
    import fileform from "../../../../common/vue/fileform2.vue";
    import Message, {messageUtil} from "../../../../common/js/message";
    import fromValidation from "../../../../common/js/fromValidation";
    import bplc from '../../popup/bplc_popup.vue'
    
    export default {
        data: function() {
            return {
                bplcPop:false,
                popIndex: '',
                viewModel:{
                    data: {
                        dept_nm:'',
                    },
                    filelist:[],
                    deletefileList: [],
                    userInfo:{},
                    
                },
                mtg_sn:'',
                isSaved:false,
            };
        },
        components: {
            'fileform' : fileform,
            'bplc' : bplc,
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
        beforeRouteLeave: function(to, from, next){
            let vm = this;
            if(!vm.isSaved){
                if(!confirm("페이지를 이동할 경우 현재 페이지는 저장되지 않습니다.\n그래도 나가시겠습니까?")){
                    return false;
                } 
            }
            next();
        },
        methods: {
            fnInit:function(){
                let vm = this;
                vm.viewModel.userInfo = vm.$store.state.global.userInfo;

                let sn = vm.$route.params.sn;

                vm.mtg_sn = sn;
                vm.fnDetail(sn);

                //부서 정보가져오기
                vm.viewModel.data.dept_nm = vm.viewModel.userInfo.dept_nm                
            },
            fnDetail: function(sn){
                let vm = this;
                let data = {
                    mtg_sn: sn,
                    dept_sn: vm.viewModel.userInfo.dept_sn,
                }

                Axios.post("/selectPwSftmtDataDetail.do", data)
                .then(function(response) {
                    vm.viewModel.filelist = response.data.fileList;
                    vm.$refs.files.fnFileLoadList(vm.viewModel.filelist);
                });
            },
            fnPopup: function(i){
                let vm = this;
                vm.popIndex=i
				vm.bplcPop=true;
				vm.$nextTick(function() {
					if(vm.bplcPop) {
						vm.$refs.bplc.fnInit();
					}
				})
            },
            fnBplcAdd: function(item){
                let vm = this;

                vm.viewModel.list[vm.popIndex].bplc_sn = item.bplc_sn;
                vm.viewModel.list[vm.popIndex].bplc_nm = item.bplc_nm;
            },
            fnFilelist:function(vm){
                this.viewModel.filelist = vm.filelist;
            },
            fnFileDelete:function(vm){
                this.viewModel.deletefileList = vm.deletefileList;
            },
            fnSave: function(){
                let vm = this;
                let frm = new FormData();
                for(let i=0; i<vm.viewModel.filelist.length; i++) {
                    let key = vm.viewModel.filelist[i].file_seq;
                    if(vm.viewModel.filelist[i].file != null) {
                        frm.append("fileTitle", vm.viewModel.filelist[i].file_title);
                        frm.append("uploadFiles", vm.viewModel.filelist[i].file);
                        if(vm.viewModel.filelist[i].file_sn){
                            frm.append("deleteFiles", vm.viewModel.filelist[i].file_sn);
                        }
                        frm.append("key", 0)
                    } else {
                        if(vm.viewModel.filelist[i].file == undefined){
                            
                        }else{
                            frm.append("fileTitle", vm.viewModel.filelist[i].file_title);
                            frm.append("key", key)
                        }
                    }
                }
                for(let i=0; i<vm.viewModel.deletefileList.length; i++){
                    frm.append("deleteFiles", vm.viewModel.deletefileList[i]);
                }

                vm.fngetFileInfo(frm);
            },
            fngetFileInfo:function(frm){
                let vm = this;
                
                let data = {
                    user_id: vm.viewModel.userInfo.user_id,
                    dept_sn: vm.viewModel.userInfo.dept_sn,
                    mtg_sn: vm.mtg_sn,
                };

                frm.append('data', new Blob([ JSON.stringify(data) ], {type : "application/json"}));
                
                frm.append("filePath", "pwSftmtData");

                if(confirm(Message.CREATE_CONFIRM)){
                    Axios.post("/updateRgstPwSftmtData.do", frm).then(function(response) {
                        if(response.data = 1){
                            vm.isSaved = true;
                            vm.$router.push('/');
                            alert("저장되었습니다."); 
                        }else{
                            alert(Message.ERROR);    
                        }
                    }).catch(function(ex) {
                        alert(Message.ERROR);
                    });
                }
            },
        }
    };
</script>
