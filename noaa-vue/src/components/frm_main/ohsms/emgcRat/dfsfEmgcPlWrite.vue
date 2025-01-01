<template>
    <div>
        <div class="contents">
            <div class="divide">
                <div>
                    <div>
                        <table class="table horizontal write">
                            <caption>비상사태계획서(풍수해) 등록</caption>
                            <tbody>
                                <tr>
                                    <th scope="row" class="w180 essential"><label for="ttl">매뉴얼명</label></th>
                                    <td>비상사태조치계획서(풍수해)</td>
                                </tr>
                                <tr>
                                    <th scope="row" class="essential"><label for="bplc">현장명</label></th>
                                    <td v-if="viewModel.user.bplc_yn == 'N'">
                                    <div class="input_group input_btn">
                                        <input type="text" id="bplc_nm" v-model="viewModel.data.bplc_nm" readonly>    
                                        <input type="hidden" id="bplc" v-model="viewModel.data.bplc_sn">
                                        <button @click="fnBplcPopup();" v-if="viewModel.user.bplc_yn !='Y'"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-search"></use></svg></button>
                                    </div>
                                </td>
                                <td v-else>
                                    <input type="hidden" id="bplc" v-model="viewModel.data.bplc_sn">
                                    <input type="text" id="bplc_nm" v-model="viewModel.data.bplc_nm" disabled>
                                </td>
                                </tr>
                                <tr>
                                    <th scope="row" class="essential"><label for="">첨부</label></th>
                                    <td>
                                        <fileform @filelist="fnFilelist"  @fileDelete="fnFileDelete" :pass="{id:'sc'}" ref="files"></fileform>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div class="table_footer btn-right">
                        <a href="" class="btn btn-purple" @click.prevent="fnSave()"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-post-add"></use></svg>등록</a>
                        <a href="" class="btn btn-white"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-list-back"></use></svg>목록</a>
                    </div>
                </div>
                <div class="approval">
                    <h3>결재 정보</h3>
                    <ul>
                        <li class="signed">
                            <a href="javascript:;">
                                <p class="essential">작성자</p>
                                <div class="user_img" id="1">
                                    <img :src="viewModel.data.wrtr_sign">
                                </div>
                                <span>{{ viewModel.data.wrtr_nm == "" ? "작성자 등록":viewModel.data.wrtr_nm }}</span>
                            </a>
                        </li>
                        <li :class="[viewModel.data.bplc_mngr != '' && viewModel.data.bplc_mngr_sign_yn != 'Y' ? 'set' : viewModel.data.bplc_mngr != '' && viewModel.data.bplc_mngr_sign_yn=='Y' ? 'signed' : null]" @click="fnAprvrpopup()">
                            <a href="javascript:;">
                                <p class="essential">현장소장</p>
                                <div class="user_img" id="3">
                                    <img :src="viewModel.data.bplc_mngr_sign" v-bind:style="viewModel.data.bplc_mngr_sign_yn != 'Y' ? 'display: none;' : ''">
                                </div>
                                <span>{{ viewModel.data.bplc_mngr_nm == "" ? "현장소장 등록":viewModel.data.bplc_mngr_nm }}</span>
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <bplc ref="bplc" v-if="bplcPop==true" :pass="{dept_sn: viewModel.user.dept_sn, team_sn: viewModel.user.team_sn}"></bplc>
        <user ref="aprvr" v-if="aprvrPop==true" :pass="{dept_sn: viewModel.user.dept_sn, team_sn: viewModel.user.team_sn, title:'결재자', bplc_yn:'Y', bplc_sn: viewModel.data.bplc_sn, ocpt_detail_cd:1}"></user>
    </div>
</template>
    
<script>
    import "es6-promise/auto";
    import Axios from "axios";
    import fileform from "../../../../common/vue/fileform4.vue";
    import bplc from "../../popup/bplc_popup.vue";
    import fromValidation from "../../../../common/js/fromValidation";
    import user from "../../popup/user_popup.vue";
    import Vue from "vue"
    Vue.component('fileform',fileform);
    Vue.component('bplc', bplc);
    Vue.component('user', user);

    export default {
        data: function() {
            return {
                filename:'',
                list:[],
                bplcPop:false, //현장 팝업
                aprvrPop:false,
                viewModel: {
                    user: {},
                    filelist: [],
                    fileGroup: '',
                    deletefileList: [],
                    data:{
                        bplc_nm:'',
                        bplc_sn:'',
                        reg_id:'',
                        user_id:'',
                        bplc_mngr:'',
                        bplc_mngr_nm:'',
                        bplc_mngr_sign:'',
                        wrtr:'',
                        wrtr_nm:'',
                        wrtr_sign:'',
                    }
                },
                isSaved:false,
            };
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
        mounted: function() {
            let vm = this;
            vm.fnInit();
        },
        methods: {
            fnInit: function() {
                let vm = this;	
                vm.viewModel.user = vm.$store.state.global.userInfo;

                vm.viewModel.data.bplc_sn = vm.viewModel.user.bplc_sn == 0 ? '' : vm.viewModel.user.bplc_sn;
                vm.viewModel.data.bplc_nm = vm.viewModel.user.bplc_sn == 0 ? '' : vm.viewModel.user.bplc_nm;

                vm.viewModel.data.wrtr = vm.$store.state.global.userInfo.user_id;
                vm.viewModel.data.wrtr_nm = vm.$store.state.global.userInfo.user_name;
                vm.viewModel.data.wrtr_sign = vm.$store.state.global.userInfo.aprvr_path.charAt() == '/' ? vm.$store.state.global.userInfo.aprvr_path : vm.$store.state.global.userInfo.aprvr_path.substr(2);
                
                //소장 정보 가져오기
                if(vm.$store.state.global.userInfo.mng_user_id){
                    vm.viewModel.data.bplc_mngr = vm.$store.state.global.userInfo.mng_user_id;
                    vm.viewModel.data.bplc_mngr_nm = vm.$store.state.global.userInfo.mng_user_nm;
                }
            },
            fnBplcPopup:function(){
                let vm = this;
                vm.bplcPop=true;
                vm.aprvrPop=false;
                vm.$nextTick(function() {
                    if(vm.bplcPop) {
                        vm.$refs.bplc.fnInit();
                    }
                });
            },
            fnBplcAdd: function(item){
                let vm = this;

                vm.viewModel.data.bplc_sn = item.bplc_sn;
                vm.viewModel.data.bplc_nm = item.bplc_nm;

                vm.viewModel.data.bplc_mngr = item.mng_user_id == undefined ? null : item.mng_user_id;
                vm.viewModel.data.bplc_mngr_nm = item.mng_user_nm == undefined ? null : item.mng_user_nm;
            },
            fnFileDelete: function(vm){
                this.viewModel.deletefileList = vm.deletefileList;
            },
            fnSave: function(){
                let vm = this;

                if(vm.viewModel.data.bplc_sn == '' || vm.viewModel.data.bplc_sn == null){
                    alert('현장명 선택은 필수입니다.');
                    return false;
                } else if(vm.viewModel.data.bplc_mngr == '' || vm.viewModel.data.bplc_mngr == null){
                    alert("현장소장을 선택해주세요.");
                    return false;
                }

                let frm = new FormData();
                for(let i=0; i<vm.viewModel.filelist.length; i++) {
                    let key = vm.viewModel.filelist[i].file_seq;
                    if(vm.viewModel.filelist[i].file != null) {
                        frm.append("fileTitle", vm.viewModel.filelist[i].file_title);
                        frm.append("uploadFiles", vm.viewModel.filelist[i].file);
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
                    bplc_sn:vm.viewModel.data.bplc_sn,
                    bplc_mngr:vm.viewModel.data.bplc_mngr,
                    reg_id: vm.$store.state.global.userInfo.user_id,
                    mod_id: vm.$store.state.global.userInfo.user_id,
                    mnl_se: '5',
                }
                frm.append('data', new Blob([ JSON.stringify(data) ], {type : "application/json"}));
                    
                frm.append("filePath", "stHsMna");               
                
                if(vm.viewModel.filelist.length > 0){
                    let len = vm.viewModel.filelist[0].orgnl_file_nm.lastIndexOf('.');
                    let extn= vm.viewModel.filelist[0].orgnl_file_nm.substring(len + 1, vm.viewModel.filelist[0].orgnl_file_nm.length).toLowerCase();
                    
                    console.log(extn);
                    
                    if(extn == 'pdf'){
                        if(confirm('등록하시겠습니까?')){   
                            Axios.post("/insertStHsMna.do",frm).then(function(rs){
                                vm.isSaved = true;
                                vm.$router.push('/');
                                alert('등록되었습니다.');
                                vm.callPushAlarm(vm.viewModel.data.bplc_mngr);
                            });
                        }else{
                            alert('취소되었습니다.');
                        } 
                    } else {
                        alert('pdf 파일만 업로드할 수 있습니다.');
                    }
                }else{
                    alert("첨부파일을 등록해주세요.");
                }
            },
            fnFilelist:function(vm){
                this.viewModel.filelist = vm.filelist;
                this.viewModel.fileGroup = vm.fileGroup;
            },
            fnAprvrpopup: function(){
                let vm = this;

                vm.bplcPop=false;

                if(vm.viewModel.data.bplc_sn == '' || vm.viewModel.data.bplc_sn == undefined){
                    alert("현장명을 선택해주세요.");
                    return false;
                }else{
                    vm.aprvrPop=true;
                    vm.$nextTick(function() {
                        if(vm.aprvrPop) {
                            vm.$refs.aprvr.fnInit();
                        }
                    });
                }
            },
            fnMemberAdd: function(item){
                let vm = this;

                vm.viewModel.data.bplc_mngr = item.user_id;
                vm.viewModel.data.bplc_mngr_nm = item.user_nm;

                //결재담당자 팝업 초기화
                vm.aprvrPop = false;
            },
            callPushAlarm: function(user_id) {
                let vm = this;
                    
                let link = '/m/main/index.do#/';

                $.ajax({
                    type: "post",
                    url:"/api/pushSendPerson.do",
                    data:{
                        // 제목 및 내용
                        title : "비상사태계획서(풍수해)가 등록되었습니다.",
                        message : "PC에서 확인해주세요.",
                        user_id : user_id,
                        // 클릭 시 이동 화면주소
                        link : link
                    }
                });
            }
        }
    };
</script>
