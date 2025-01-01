<template>
    <div>
        <div class="contents write">
            <div>
                <table class="table horizontal write">
                    <caption>건의사항 등록</caption>
                    <tbody>
                        <tr>
                            <th scope="row" class="w180 essential"><label for="code_nm">분류</label></th>
                            <td>
                                <select title="분류" v-model="viewModel.data.clsf_cd">
                                    <option value="">분류 선택</option>
                                    <option v-for="(item, i) in viewModel.codeList" :key="i" :value="item.CODE">{{ item.CODE_NM }}</option>
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row" class="essential"><label for="bplc">현장명</label></th>
                            <td>
                                <div class="input_group input_btn">
                                    <input type="text" id="bplc_nm" v-model="viewModel.data.bplc_nm" disabled>    
                                    <input type="hidden" id="bplc" v-model="viewModel.data.bplc_sn">
                                    <button @click="fnBplcPopup();" v-if="viewModel.userInfo.bplc_yn !='Y'"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-search"></use></svg></button>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row" class="essential"><label for="">작성자</label></th>
                            <td> 
                                    {{ viewModel.userInfo.jbttl_nm }} {{ viewModel.userInfo.user_name }}
                            </td> 
                        </tr>
                        <tr>
                            <th scope="row"><label for="">사진등록</label></th>
                            <td>
                                <imgsfileform :ref="'imgsfileform'" :pass="{id:'rcmdt'}" @filelist="fnImgFileList" @fileDelete="fnImgFileDelete"></imgsfileform>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row" class="essential"><label for="">의견내용</label></th>
                            <td>
                                <textarea id="sugest_cn" rows="5" title="지적/요청사항" v-model="viewModel.data.sugest_cn"></textarea>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="table_footer btn-right">
                <button class="btn btn-purple" @click.prevent="fnSave()"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-post-add"></use></svg>등록</button>
                <router-link :to="'/'" class="btn btn-white"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-list-back"></use></svg>목록</router-link>
            </div>
        </div>
        <bplc ref="bplc" v-if="bplcPop==true" :pass="{dept_sn: viewModel.userInfo.dept_sn, team_sn: viewModel.userInfo.team_sn}"></bplc>
    </div>
</template>

<script>
    import "es6-promise/auto";
    import Vue from "vue";
    import Axios from "axios";
    import Message, {messageUtil} from "../../../../common/js/message";
    // import fromValidation from "../../../common/vue/fromValidation";
    import imgsfileform from '../../../../common/vue/imgsfileform2.vue';
    import bplc from "../../popup/bplc_popup2.vue";

    export default {
        data: function() {
            return {
                mttrForm:false,
                bplcPop:false, //현장 팝업
                viewModel:{
                    codeList:[],
                    data:{
                        risk_se: [],
                        clsf_cd: '',
                    },
                    rsltList:[],
                    userInfo:{},
                    rcmdt:[],
                    imgfilelist:[],
                    imgdeletefileList:[],
                },
                isSaved:false,
            };
        },
        components: {
            'bplc' : bplc,
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

                let sn = vm.$route.params.sugest_sn;
                vm.sn = vm.$route.params.sugest_sn;
                
                if(sn != undefined){
                    vm.fnDetail(sn);
                }else{
                    vm.fnWriteInfo();

                vm.viewModel.data.bplc_sn = vm.viewModel.userInfo.bplc_sn == 0 ? '' : vm.viewModel.userInfo.bplc_sn;
                vm.viewModel.data.bplc_nm = vm.viewModel.userInfo.bplc_sn == 0 ? '' : vm.viewModel.userInfo.bplc_nm;
                }
            },
            fnWriteInfo:function(){
                let vm = this;
                let data = {}

                Axios.post("/selectRcmdtWriteInfo.do", data)
                .then(function(response) {
                    vm.viewModel.codeList = response.data.codeList;
                    console.log(response.data.codeList);
                });
              
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
                    vm.viewModel.codeList = response.data.codeList;
                    vm.viewModel.imgfilelist = response.data.fileList;
                    vm.viewModel.data.bplc_nm = response.data.detail.bplc_nm;
                    console.log(response.data);
                                        
                    vm.$refs.imgsfileform.fnFileLoadList(vm.viewModel.imgfilelist);
                });
            },
            fnSave:function(){
                let vm = this;
                let list = [];
                let frm = new FormData();
                    
                if(vm.viewModel.imgfilelist != null){
                    for(let j=0; j<vm.viewModel.imgfilelist.length; j++){
                        let key = vm.viewModel.imgfilelist[j].file_seq;

                        if(vm.viewModel.imgfilelist[j].file != null) {
                            frm.append("uploadFiles", vm.viewModel.imgfilelist[j].file);
                            frm.append("fileTitle", vm.viewModel.imgfilelist[j].file.name);
                            if(vm.viewModel.imgfilelist[j].file_sn){
                                frm.append("deleteFiles", vm.viewModel.imgfilelist[j].file_sn);
                            }
                            frm.append("key", 0)
                        } else {
                            if(vm.viewModel.imgfilelist[j].file == undefined){
                                
                            }else{
                                frm.append("fileTitle", vm.viewModel.imgfilelist[j].file_title);
                                frm.append("key", key)
                            }
                        }
                    }
                } 

                if(vm.viewModel.imgdeletefileList != null){
                    for(let j=0; j<vm.viewModel.imgdeletefileList.length; j++){
                        frm.append("deleteFiles", vm.viewModel.imgdeletefileList[j]);
                    }
                }                    
                vm.fngetFileInfo(frm);
            },
            fngetFileInfo(frm){
                let vm = this;

                if(vm.viewModel.data.prgrs_stts == '2'){
                    alert("이미 조치가 완료하여 수정이 불가합니다.");
                    return false;
                }

                // if(vm.viewModel.data.bplc_nm == '' || vm.viewModel.data.bplc_nm == undefined){
                //     alert("현장명을 선택해주세요.");
                //     return false;
                // }

                if(vm.viewModel.data.clsf_cd == '' || vm.viewModel.data.clsf_cd == null){
                    alert("분류를 선택해주세요.");
                    return false;
                }

                if(vm.viewModel.data.sugest_cn == '' || vm.viewModel.data.sugest_cn == undefined){
                        alert("의견 내용을 입력해주세요.");
                        return false;
                }

                let data = {
                    user_id: vm.viewModel.userInfo.user_id,
                    bplc_sn: vm.viewModel.data.bplc_sn,
                    bplc_nm: vm.viewModel.data.bplc_nm,
                    clsf_cd: vm.viewModel.data.clsf_cd,
                    sugest_cn: vm.viewModel.data.sugest_cn,
                    sugest_sn: vm.viewModel.data.sugest_sn
                };
                
                frm.append('data', new Blob([ JSON.stringify(data) ], {type : "application/json"}));
                
                frm.append("filePath", "rcmdt");

                if(vm.viewModel.data.sugest_sn == undefined){
                    if(confirm(Message.CREATE_CONFIRM)){
                        if(vm.viewModel.data.bplc_sn == '' || vm.viewModel.data.bplc_sn == null){
                            alert('현장명 선택은 필수입니다.');
                            return false;
                    } else{
                            Axios.post("/insertRcmdt.do", frm).then(function(response) {
                                vm.isSaved = true;
                                vm.$router.push('/');
                                alert("저장되었습니다.");
                            }).catch(function(ex) {
                                alert(Message.ERROR);
                            });
                        }
                    }
                }else{
                    if(confirm(Message.UPDATE_CONFIRM)){
                        Axios.post("/updateRcmdt.do", frm).then(function(response) {
                            vm.isSaved = true;
                            vm.$router.push('/');
                            alert("저장되었습니다.");
                        }).catch(function(ex) {
                            alert(Message.ERROR);
                        });
                    }
                }
            },
            fnBplcPopup:function(){
                let vm = this;
				vm.bplcPop=true;
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
            fnImgFileList:function(vm){
                this.viewModel.imgfilelist = vm.viewModel.filelist;
            },
            fnImgFileDelete: function(vm){
                this.viewModel.imgdeletefileList = vm.viewModel.deletefileList;
            },
            fnRiskSeClick:function(cd){
                let vm = this;
                
                if(cd == 'ETC'){
                    if($('#riskNmList_ETC').is(':checked')){
                        $("#risk_se_etc").prop("disabled", false);
                    }else{
                        //기타 input disabled;
                        $("#risk_se_etc").prop("disabled", true);
                        vm.viewModel.data.risk_cn = '';
                    }
                }
            }
        }
    };
</script>