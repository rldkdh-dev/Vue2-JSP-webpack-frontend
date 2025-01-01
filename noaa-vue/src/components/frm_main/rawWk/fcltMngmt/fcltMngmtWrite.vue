<template>
    <div>
        <div class="contents write">
            <div>
                <table class="table horizontal write">
                    <caption>중장비 관리 등록</caption>
                    <tbody>
                        <tr>
                            <th scope="row essential" class="w180 essential"><label for="bplc">현장명</label></th>
                            <td>
                                <div class="input_group input_btn">
                                    <input type="text" id="bplc_nm" v-model="viewModel.data.bplc_nm" readonly @click="viewModel.userInfo.bplc_yn !='Y' ? fnBplcPopup() : ''">
                                    <input type="hidden" id="bplc" v-model="viewModel.data.bplc_sn">
                                    <label :for="'bplc_nm'" v-if="viewModel.userInfo.bplc_yn !='Y'"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-search"></use></svg></label>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row" class="essential"><label for="hqp_sn">장비구분</label></th>
                            <td>
                                <select title="장비구분" v-model="viewModel.data.hqp_sn" id="hqp_sn">
                                    <option disabled selected value="">장비구분 선택</option>
                                    <option v-for="(item, i) in viewModel.hqpList" :key="i" :value="item.hqp_sn">{{ item.hqp_nm }}</option>
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row" class="essential"><label for="hqp_mng_nm">장비명</label></th>
                            <td>
                                <input type="text" id="hqp_mng_nm" v-model="viewModel.data.hqp_mng_nm">
                            </td>
                        </tr>
                        <tr>
                            <th scope="row" class="essential"><label for="hqp_no">장비번호</label></th>
                            <td>
                                <input type="text" id="hqp_no" v-model="viewModel.data.hqp_no">
                            </td>
                        </tr>
                        <tr>
                            <th scope="row"><label for="lcns_no">차량번호</label></th>
                            <td>
                                <input type="text" id="lcns_no" v-model="viewModel.data.lcns_no">
                            </td>
                        </tr>
                        <tr>
                            <th scope="row"><label for="pic_nm">담당자</label></th>
                            <td>
                                <div class="input_group input_btn">
                                    <input type="text" :id="'pic_nm'" :value="viewModel.data.pic_nm" readonly @click="fnUserPopup();">
                                    <label for="pic_nm" ><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-search"></use></svg></label>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row" class="essential"><label for="">안전검사 유효기간</label></th>
                            <td>
                                <div class="datepicker_box">
                                    <input type="text" class="datepicker" id="safe_chck_vld_pd" placeholder="날짜" title="안전검사 유효기간" readonly>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row" class="essential"><label for="">안전작업계획서 작성일</label></th>
                            <td>
                                <div class="datepicker_box">
                                    <input type="text" class="datepicker" id="safe_work_actpln_wrt_dt" placeholder="날짜" title="안전작업계획서 작성일" readonly>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row"><label for="">안전인증서</label></th>
                            <td>
                                <fileform @filelist="fnFilelist"  @fileDelete="fnFileDelete" :pass="{id:'sc1'}" ref="files1"></fileform>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row"><label for="">보험서류</label></th>
                            <td>
                                <fileform @filelist="fnFilelist2"  @fileDelete="fnFileDelete2" :pass="{id:'sc2'}" ref="files2"></fileform>
                            </td>
                        </tr>
                    </tbody>
                </table>
                
                <div class="table_footer btn-right">
                    <button class="btn btn-purple" @click.prevent="fnFileIfno()"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-post-add"></use></svg>등록</button>
                    <router-link to="/" class="btn btn-white"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-list-back"></use></svg>목록</router-link>
                </div>
            </div>
        </div>
        <user ref="user" v-if="userPop==true" :pass="{dept_sn: viewModel.userInfo.dept_sn, team_sn: viewModel.userInfo.team_sn, title:'담당자', multi:'Y', bplc_yn:'Y', bplc_sn: viewModel.data.bplc_sn}"></user>
        <bplc ref="bplc" v-if="bplcPop==true" :pass="{dept_sn: viewModel.userInfo.dept_sn, team_sn: viewModel.userInfo.team_sn}"></bplc>
    </div>
    </template>
    
    <script>
        import "es6-promise/auto";
        import Vue from "vue";
        import Axios from "axios";
        import fileform from "../../../../common/vue/fileform2.vue";
        import Message, {messageUtil} from "../../../../common/js/message";
        import fromValidation from "../../../../common/js/fromValidation";
        import user from "../../popup/user_popup.vue";
        import bplc from "../../popup/bplc_popup.vue";
        import common from "../../../../common/js/common.js";
        
        export default {
            data: function() {
                return {
                    userPop: false, //사용자 팝업
                    bplcPop:false, //현장 팝업
                    viewModel:{
                        data:{
                            hqp_sn:''
                        },
                        userInfo:{},
                        hqpList:[],
                        filelist1:[],
                        deletefileList1: [],
                        filelist2:[],
                        deletefileList2: [],
                    },
                    isSaved:false,
                };
            },
            components: {
                'user' : user,
                'bplc' : bplc,
                'fileform' : fileform,
            },
            activated:function(){
                this.fnInit();
                calendarInput();
            },
            deactivated:function(){
                this.$destroy();
            },
            mounted: function() {
                let vm = this;
                // vm.fnInit();
                // calendarInput();
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
                    }else{
                        vm.fnGetWriteInfo();

                        //현장코드 있을 경우 그 값으로 세팅
                        vm.viewModel.data.bplc_sn = vm.viewModel.userInfo.bplc_sn == 0 ? '' : vm.viewModel.userInfo.bplc_sn;
                        vm.viewModel.data.bplc_nm = vm.viewModel.userInfo.bplc_sn == 0 ? '' : vm.viewModel.userInfo.bplc_nm;
                    }
                },
                fnGetWriteInfo:function(){
                    let vm = this;

                    let send = {}

                    Axios.post("/selectFcltMngmtWriteInfo.do", send)
                    .then(function(response) {
                        vm.viewModel.hqpList = response.data.hqpList;
                    });
                },
                fnDetail:function(sn){
                    let vm = this;
                    let data = {
                        manage_sn: sn
                    }
                    Axios.post("/selectFcltMngmtDetail.do", data)
                    .then(function(response) {
                        vm.viewModel.data = response.data.detail;
                        vm.viewModel.hqpList = response.data.hqpList;

                        vm.viewModel.filelist1 = response.data.fileList.filter(data => data.file_se == 1);
                        vm.viewModel.filelist2 = response.data.fileList.filter(data => data.file_se == 2);

                        $("#safe_chck_vld_pd").val(common.fnDateTimeStr(vm.viewModel.data.safe_chck_vld_pd));
                        $("#safe_work_actpln_wrt_dt").val(common.fnDateTimeStr(vm.viewModel.data.safe_work_actpln_wrt_dt));

                        vm.$refs.files1.fnFileLoadList(vm.viewModel.filelist1);
                        vm.$refs.files2.fnFileLoadList(vm.viewModel.filelist2);
                    });
                },
                fnFileIfno: function(){
                    let vm = this;
                    let frm = new FormData();

                    // 안전인증서
                    for(let i=0; i<vm.viewModel.filelist1.length; i++) {
                        let key = vm.viewModel.filelist1[i].file_seq;
                        if(vm.viewModel.filelist1[i].file != null) {
                            frm.append("fileTitle", vm.viewModel.filelist1[i].file_title);
                            frm.append("uploadFiles", vm.viewModel.filelist1[i].file);
                            frm.append("file_se", 1);
                            if(vm.viewModel.filelist1[i].file_sn){
                                frm.append("deleteFiles", vm.viewModel.filelist1[i].file_sn);
                            }
                            frm.append("key", 0)
                        } else {
                            if(vm.viewModel.filelist1[i].file == undefined){
                                
                            }else{
                                frm.append("fileTitle", vm.viewModel.filelist1[i].file_title);
                                frm.append("key", key)
                            }
                        }
                    }
                    for(let i=0; i<vm.viewModel.deletefileList1.length; i++){
                        frm.append("deleteFiles", vm.viewModel.deletefileList1[i]);
                    }
                    
                    // 보험서류
                    for(let i=0; i<vm.viewModel.filelist2.length; i++) {
                        let key = vm.viewModel.filelist2[i].file_seq;
                        if(vm.viewModel.filelist2[i].file != null) {
                            frm.append("fileTitle", vm.viewModel.filelist2[i].file_title);
                            frm.append("uploadFiles", vm.viewModel.filelist2[i].file);
                            frm.append("file_se", 2);
                            if(vm.viewModel.filelist2[i].file_sn){
                                frm.append("deleteFiles", vm.viewModel.filelist2[i].file_sn);
                            }
                            frm.append("key", 0)
                        } else {
                            if(vm.viewModel.filelist2[i].file == undefined){
                                
                            }else{
                                frm.append("fileTitle", vm.viewModel.filelist2[i].file_title);
                                frm.append("key", key)
                            }
                        }
                    }
                    for(let i=0; i<vm.viewModel.deletefileList2.length; i++){
                        frm.append("deleteFiles", vm.viewModel.deletefileList2[i]);
                    }

                    vm.fnSave(frm);
                },
                fnSave:function(frm){
                    let vm = this;

                    const valiData = [
                        {id: 'bplc_nm', type: 'select', title: '현장명'},
                        {id: 'hqp_sn', type: 'input', title: '장비구분'},
                        {id: 'hqp_mng_nm', type: 'input', title: '장비명'},
                        {id: 'hqp_no', type: 'input', title: '장비번호'},
                        {id: 'safe_chck_vld_pd', type: 'input', title: '안전검사 유효기간'},
                        {id: 'safe_work_actpln_wrt_dt', type: 'input', title: '안전작업계획서 작성일'},
                    ];
                    
                    if(!fromValidation(valiData)){
                        return false;
                    }
    
                    let data = {
                        reg_id: vm.viewModel.userInfo.user_id,
                        bplc_sn: vm.viewModel.data.bplc_sn,
                        hqp_sn: vm.viewModel.data.hqp_sn,
                        hqp_mng_nm: vm.viewModel.data.hqp_mng_nm,
                        hqp_no: vm.viewModel.data.hqp_no,
                        lcns_no: vm.viewModel.data.lcns_no,
                        pic: vm.viewModel.data.pic,
                        safe_chck_vld_pd: $("#safe_chck_vld_pd").val(),
                        safe_work_actpln_wrt_dt: $("#safe_work_actpln_wrt_dt").val(),
                        manage_sn: vm.viewModel.data.manage_sn,
                    };
    
                    frm.append('data', new Blob([ JSON.stringify(data) ], {type : "application/json"}));
                
                    frm.append("filePath", "fcltMngmt");

                    if(vm.viewModel.data.manage_sn == undefined){
                        if(confirm(Message.CREATE_CONFIRM)){
                            Axios.post("/insertFcltMngmt.do", frm).then(function(response) {
                                if(response.data == 1){
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
                    }else{
                        if(confirm(Message.UPDATE_CONFIRM)){
                            Axios.post("/updateFcltMngmt.do", frm).then(function(response) {
                                if(response.data == 1){
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
                    }
                },
                fnBplcPopup: function(){
                    let vm = this;
                    vm.bplcPop=true;
                    vm.userPop=false;
                    vm.$nextTick(function() {
                        if(vm.bplcPop) {
                            vm.$refs.bplc.fnInit();
                        }
                    })
                },
                fnBplcAdd: function(item){
                    let vm = this;
    
                    vm.viewModel.data.bplc_sn = item.bplc_sn;
                    vm.viewModel.data.bplc_nm = item.bplc_nm;
                },
                fnUserPopup: function(i) {
                    let vm = this;
                    if(vm.viewModel.data.bplc_sn == '' || vm.viewModel.data.bplc_sn == undefined){
                        alert("현장명을 선택해주세요.");
                        return false;
                    }else{
                        vm.bplcPop=false;
                        vm.userPop=true;
                        vm.$nextTick(function() {
                            if(vm.userPop) {
                                vm.$refs.user.fnInit();
                            }
                        })
                    }
                },
                fnMultiMemberAdd : function(list){
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
                    vm.viewModel.data.pic_nm = userNmStr;
                    vm.viewModel.data.pic = userIdStr;
                },
                fnFilelist:function(vm){
                    this.viewModel.filelist1 = vm.filelist;
                },
                fnFileDelete: function(vm){
                    this.viewModel.deletefileList1 = vm.deletefileList;
                },
                fnFilelist2:function(vm){
                    this.viewModel.filelist2 = vm.filelist;
                },
                fnFileDelete2: function(vm){
                    this.viewModel.deletefileList2 = vm.deletefileList;
                },
            }
        };
    </script>
    