<template>
    <div>
        <div class="contents write">
            <div>
				<h3>안전보건 교육관리 등록</h3>
                <table class="table horizontal write">
                    <caption>안전보건 교육관리 등록</caption>
                    <tbody>
                        <tr>
                            <th scope="row" class="essential"><label for="">교육분류</label></th>
                            <td>
                                <select title="교육분류" id="edu_clsf" v-model="viewModel.data.edu_clsf" @change="fnChangeSelect(viewModel.data.edu_clsf)" style="width: 25%;">
                                    <option value="" disabled selected>교육분류 선택</option>
                                    <option v-for="(item,i) in viewModel.list.eduList" :key="i" :value="item.CODE">{{item.CODE_NM}}</option>
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row" class="essential"><label for="bplc">현장명</label></th>
                            <td colspan="3">
                                <div class="input_group">
                                    <input type="text" id="bplc_nm" v-model="viewModel.data.bplc_nm" disabled style="margin-left: 0; width: 40%;" readonly>    
                                    <input type="hidden" id="bplc" v-model="viewModel.data.bplc_sn">
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row" class="essential"><label for="">성명</label></th>
                            <td><input type="text" id="" title="교육명" v-model="viewModel.data.user_nm" style="width: 15%;" readonly></td> 
                        </tr>
                        <tr>
                            <th scope="row" class="essential"><label for="">유효기간</label></th>
                            <td>
                                <div class="input_group">
                                        <input type="text" id="vld_pd_bgnde" v-model="viewModel.data.vld_pd_bgnde" v-if="viewModel.data.edu_clsf == 'CB'">
                                        <input type="text" id="vld_pd_bgnde" v-model="viewModel.data.vld_pd_bgnde" readonly v-else>
                                    <label>~</label>
                                        <input type="text" id="vld_pd_endde" v-model="viewModel.data.vld_pd_endde" readonly>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row"><label for="">교육이수증</label></th>
                            <td>
                                <fileform @filelist="fnFilelist"  @fileDelete="fnFileDelete" :pass="{id:'sc'}" ref="files"></fileform>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div class="table_footer btn-right">
                    <button class="btn btn-purple" @click.prevent="fnSave()"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-post-add"></use></svg>등록</button>
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
    import Fileform from '../../../../common/vue/fileform2.vue'
    import Message, {messageUtil} from "../../../../common/js/message";
    import fromValidation from "../../../../common/js/fromValidation";
    import moment from 'moment' ;

    export default {
        components: {
            'fileform': Fileform
        },
        data: function() {
            return {
                tabNm : "elt",
                viewModel:{
                    userInfo:{},
                    filelist:[],
                    fileGroup:'',
                    data:{
                        edu_clsf : "",
                    },
                    list :{
                        eduList : [],
                    },
                },
                mode: '',
                isSaved:false,
            };
        },
        mounted: function() {
            let vm = this;
            vm.viewModel.userInfo = vm.$store.state.global.userInfo;
            calendarInput();
            vm.fnInit();
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
                if(sn != undefined){
                    vm.fnDetail(sn);
                }
            },
            fnSearch:function(){
                let vm = this;
                let data = {
                    code_group : "QLFC_EDU",
                    code_user : vm.viewModel.data.qlfc_knd,
                }
                Axios.post("/selectHsPsQlfcList.do",data)
                .then(function(response) {
                    vm.viewModel.list.eduList = response.data.list;

                });
            },
            fnDetail:function(sn){
                let vm = this;
                let data = {
                    sn: sn,
                    tabNm : "edc",
                    file_se : "2"
                }
                Axios.post("/selectHsPsWrite.do", data)
                .then(function(response) {
                    vm.viewModel.data = response.data.result;
                    vm.viewModel.data.vld_pd_bgnde = vm.viewModel.data.apnt_dt;

                    vm.fnSearch();
                    vm.viewModel.filelist = response.data.fileList;

                    vm.$refs.files.fnFileLoadList(vm.viewModel.filelist);
                });
            },
            fnFileDelete: function(vm){
                this.viewModel.deletefileList = vm.deletefileList;
            },
            fnSave: function(){
                let vm = this;
                let frm = new FormData();
                if(vm.viewModel.filelist != null && vm.viewModel.filelist != undefined){
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
                    if(vm.viewModel.deletefileList != null && vm.viewModel.deletefileList != undefined){
                        for(let i=0; i<vm.viewModel.deletefileList.length; i++){
                            frm.append("deleteFiles", vm.viewModel.deletefileList[i]);
                        }
                    }
                 }
                vm.fngetFileInfo(frm);
            },
            fngetFileInfo:function(frm){
                let vm = this;
                const valiData = [
                    {id: 'edu_clsf', type: 'input', title: '교육분류'},
                    {id: 'vld_pd_bgnde', type: 'input', title: '유효기간-시작'},
                    {id: 'vld_pd_endde', type: 'input', title: '유효기간-끝'},
                ];
                
                if(!fromValidation(valiData)){
                    return false;
                }

                let data = {
                    user_id: vm.viewModel.userInfo.user_id,
                    edu_clsf: $("#edu_clsf").val(),
                    vld_pd_bgnde: $("#vld_pd_bgnde").val(),
                    vld_pd_endde: $("#vld_pd_endde").val(),
                    apnt_mng_sn: vm.$route.params.sn,
                    gbn : "edc",
                    atchmnfl : "2",
                    bplc_sn : vm.viewModel.data.bplc_sn,
                };

                frm.append('data', new Blob([ JSON.stringify(data) ], {type : "application/json"}));
                
                frm.append("filePath", "hsPs");

                if(confirm(Message.UPDATE_CONFIRM)){
                        Axios.post("/updateHsPs.do", frm).then(function(response) {
                            if(response.data == 1){
                                vm.isSaved = true;
                                vm.$router.push('/');
                                alert("저장되었습니다.");
                            }
                            
                        }).catch(function(ex) {
                            console.log("error"+ex);
                        });
                }
            },
            fnFilelist:function(vm){
                this.viewModel.filelist = vm.filelist;
                this.vie,wModel.fileGroup = vm.fileGroup;
            },

            fnChangeSelect:function(clsf){
                let vm = this;

                if(clsf.slice(-1) == "A"){
                    vm.viewModel.data.vld_pd_endde = moment(vm.viewModel.data.apnt_dt).add(3, 'months').format('YYYY-MM-DD');
                }else{
                    vm.viewModel.data.vld_pd_endde = moment(vm.viewModel.data.apnt_dt).add(2, 'years').format('YYYY-MM-DD');
                }
                
            }
        }
    };
</script>