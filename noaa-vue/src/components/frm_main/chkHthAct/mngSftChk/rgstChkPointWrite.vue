<template>
    <div>
        <div class="contents write">
            <div>
                <table class="table horizontal write">
                    <caption>경영자 안전점검 등록</caption>
                    <tbody>
                        <tr>
                            <th scope="row" class="w180 essential"><label for="">점검현장</label></th>
                            <td colspan="3" v-if="userInfo.hdofc_mngr_yn != 'Y'">
                                <div class="input_group">
                                    {{ viewModel.bplc_nm }}
                                </div>
                            </td>
                            <td colspan="3" v-if="userInfo.hdofc_mngr_yn == 'Y'">
                                <div class="input_group input_btn">
                                    <input type="text" id="bplc_nm" v-model="viewModel.bplc_nm" readonly>    
                                    <input type="hidden" v-if="viewModel.bplc_sn" id="bplc" v-model="viewModel.bplc_sn">
                                    <button @click="fnBplcPopup();" v-if="userInfo.hdofc_mngr_yn =='Y'"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-search"></use></svg></button>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row" class="essential"><label for="">점검일자</label></th>
                            <td>
                                <div class="datepicker_box">
                                    <input type="text" class="datepicker" id="" title="datepicker" readonly>
                                </div>
                            </td> 
                        </tr>
                        <tr>
                            <th scope="row" class="essential"><label for="">점검내용</label></th>
                            <td><textarea id="" rows="4" title="점검내용" v-model="viewModel.chck_cn"></textarea></td> 
                        </tr>
                        <tr>
                            <th scope="row"><label for="">점검항목</label></th>
                            <td>
                                <fileform @filelist="fnFilelist"  @fileDelete="fnFileDelete" :pass="{id:'rgstChkPoint'}" ref="files"></fileform>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div class="table_footer btn-right">
                    <a href="#" class="btn btn-purple" @click="fnSave()" v-if="state != 'detail'"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-post-add"></use></svg>{{state_k}}</a>
                    <router-link to="/" class="btn btn-white"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-list-back"></use></svg>목록</router-link>
                </div>
            </div>
        </div>
        <bplcPopup ref="bplc" v-if="bplcPop==true" :pass="{dept_sn: userInfo.dept_sn, team_sn: userInfo.team_sn}"></bplcPopup>
    </div>
</template>

<script>
    import "es6-promise/auto";
    import Vue from "vue";
    import Axios from "axios";
    import BplcPopup from "../../popup/bplc_popup.vue";
    import Fileform from "../../../../common/vue/fileform2.vue";
    
    export default {
        components: {
            BplcPopup, Fileform
        },
        data: function() {
            return {
                userInfo:{},
                bplcPop:false,
                viewModel:{
                    list:{},
                    filelist:[],
                    fileGroup:[],
                    deletefileList:[],
                },
                isSaved:false,
            };
        },
        mounted: function() {
            let vt = this;
            let vm = this.viewModel;
            
            vt.userInfo = this.$store.state.global.userInfo,
            vt.uid = window.location.href.split('/').pop();
            vt.state = window.location.href.split('/').reverse()[1];
            calendarInput();
            if(vt.state == 'update' && vt.uid != null){
                vt.state_k = '수정';
                vt.fnDetail(vt.uid);
            }else{
                vt.state_k = '등록';
                vt.fnInit();
            }
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
        activated:function(){
            this.fnInit();
        },
        deactivated:function(){
            this.$destroy();
        },
        methods: {
            fnInit:function(){
                let vt = this;
                let vm = this.viewModel;
                
                vm.bplc_sn = (vt.userInfo.bplc_sn == 0) ? '' : vt.userInfo.bplc_sn;
                vm.bplc_nm = (vt.userInfo.bplc_sn == 0) ? '' : vt.userInfo.bplc_nm;

                vt.$forceUpdate(); 
            },
            fnDetail:function(value){ //첨부파일 조회 추가 필요
                let vt = this;
                let vm = this.viewModel;
                vm.fileList = [];
                vm.actionFileList = [];
                let data = {
                    chck_sn : value
                }
                Axios.post("/selectRgstChkPointDetail.do", data).then(function(response) {
                    console.log(response.data);

                    vm.list = response.data.detail;
                    vm.bplc_nm = vm.list.bplc_nm;
                    vm.bplc_sn = vm.list.bplc_sn;
                    vm.chck_cn = vm.list.chck_cn;
                    vm.chck_dt = (vm.list.chck_dt).substring(0,10);
                    $(".datepicker").val(vm.chck_dt);

                    for(let i=0; i<response.data.fileList.length; i++){
                        if(response.data.fileList[i].file_se == '1'){ //점검항목 파일
                            vm.fileList.push(response.data.fileList[i]);
                        }
                    }
                    vt.$nextTick(function() {
                        vt.$refs.files.fnFileLoadList(vm.fileList);
                        vt.$forceUpdate(); 
					})
                });
            },
            fnBplcPopup: function(){
                let vt = this;
				vt.bplcPop = true;
				vt.$nextTick(function() {
					if(vt.bplcPop) {
						vt.$refs.bplc.fnInit();
					}
				})
            },
            fnBplcAdd: function(item){
                let vm = this.viewModel;

                vm.bplc_sn = item.bplc_sn;
                vm.bplc_nm = item.bplc_nm;
            },
            fnFilelist:function(vm){
			    let vt = this;
                vt.viewModel.filelist = vm.filelist;
                vt.viewModel.fileGroup = vm.fileGroup;
            },
            fnFileDelete: function(vm){
                let vt = this;
                vt.viewModel.deletefileList = vm.deletefileList;
            },
            fnSave:function(){
                let vt = this;
                let frm = new FormData();

                for(let i=0; i<vt.viewModel.filelist.length; i++) {
                    let key = vt.viewModel.filelist[i].file_seq;
                    if(vt.viewModel.filelist[i].file != null) {
                        frm.append("fileTitle", vt.viewModel.filelist[i].file_title);
                        frm.append("uploadFiles", vt.viewModel.filelist[i].file);
                        if(vt.viewModel.filelist[i].file_sn){
                            frm.append("deleteFiles", vt.viewModel.filelist[i].file_sn);
                        }
                        frm.append("key", 0)
                    } else {
                        if(vt.viewModel.filelist[i].file == undefined){
                            
                        }else{
                            frm.append("fileTitle", vt.viewModel.filelist[i].file_title);
                            frm.append("key", key)
                        }
                    }
                }
                if(vt.viewModel.deletefileList != null){
                    for(let i=0; i<vt.viewModel.deletefileList.length; i++){
                        frm.append("deleteFiles", vt.viewModel.deletefileList[i]);
                    }
                }
                vt.fnInsert(frm);
            },
            fnInsert:function(frm){
                let vt = this;
                let vm = this.viewModel;
                if(!vm.bplc_nm){
                    return alert("점검현장을 입력해주시기 바랍니다.");
                }
                if($(".datepicker").val() == ""){
                    return alert("점검일자를 확인해주시기 바랍니다.");
                } 
                if(!vm.chck_cn){
                    return alert("점검내용을 입력해주시기 바랍니다.");
                }
                if(confirm(vt.state_k+" 하시겠습니까?")){
                    let data = {
                        chck_sn : (isNaN(vt.uid))? -1:vt.uid,
                        bplc_sn : vm.bplc_sn,
                        chck_dt : $(".datepicker").val(),
                        chck_cn : vm.chck_cn,
                        file_se : '1', //구분(1:점검항목, 2: 조치결과)
                        reg_id : vt.userInfo.user_id
                    }

                    frm.append('data', new Blob([ JSON.stringify(data) ], {type : "application/json"}));
                    
                    frm.append("filePath", "rgstChkPoint");

                    //수정
                    if(vt.state == 'update' && (vt.uid != '' && vt.uid != null && vt.uid != undefined)){
                        Axios.post("/updateMngSftChk.do", frm).then(function(res){
                            console.log(res);
                            vt.isSaved = true;
                            vt.$router.push('/');
                        }).catch(function(ex) {
                            console.log(ex);
                        });
                    }else{//등록
                        Axios.post("/insertMngSftChk.do", frm).then(function(res){
                            console.log(res);
                            vt.isSaved = true;
                            vt.$router.push('/');
                        }).catch(function(ex) {
                            console.log(ex);
                        });
                    }
                }
            }
            
        }
    };
</script>