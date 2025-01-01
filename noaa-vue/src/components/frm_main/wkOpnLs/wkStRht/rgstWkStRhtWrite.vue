<template>
    <div>
        <div class="contents write">
            <div>
                <table class="table horizontal write">
                    <caption>작업중지권 등록</caption>
                    <tbody>
                        <tr>
                            <th scope="row" class="w180 essential"><label for="">작업중지 요청자</label></th>
                            <td>
                                <template v-if="viewModel.data.stpge_sn != undefined">
                                    {{ viewModel.data.rqstr_jbttl_nm }} {{ viewModel.data.rqstr_nm }}
                                </template>
                                <template v-else>
                                    <template v-if="viewModel.userInfo.bplc_yn == 'Y'">
                                        {{ viewModel.userInfo.ocpt_detail_nm }} {{ viewModel.userInfo.user_name }}
                                    </template>
                                    <template v-else>
                                        {{ viewModel.userInfo.jbttl_nm }} {{ viewModel.userInfo.user_name }}
                                	</template>
                                </template>
                            </td> 
                        </tr>
                        <tr>
                            <th scope="row" class="essential"><label for="bplc">현장명</label></th>
                            <td>
                                <div class="input_group input_btn">
                                    <input type="text" id="bplc_nm" v-model="viewModel.data.bplc_nm" readonly @click="viewModel.userInfo.bplc_yn !='Y' ? fnBplcPopup() : ''">    
                                    <input type="hidden" id="bplc" v-model="viewModel.data.bplc_sn">
                                    <label for="bplc_nm" v-if="viewModel.userInfo.bplc_yn !='Y'"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-search"></use></svg></label>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row" class="essential"><label for="">위험명</label></th>
                            <td>
                                <ul class="input_wrap">
                                    <li v-for="(item, i) in viewModel.riskNmList" :key="i">
                                        <label :for="'riskNmList_'+item.CODE" @change="fnRiskSeClick(item.CODE);">
                                            <input type="checkbox" :id="'riskNmList_'+item.CODE" v-model="viewModel.data.risk_se" :value="item.CODE">{{ item.CODE_NM }}
                                         </label>
                                         <input v-if="item.CODE == 'ETC'" type="text" v-model="viewModel.data.risk_cn" :id="'risk_se_etc'"  :disabled="viewModel.data.risk_se.includes('ETC') ?  false : true">
                                    </li>
                                </ul>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row"><label for="">중지사진</label></th>
                            <td>
                                <imgsfileform :ref="'imgsfileform'" :pass="{id:'wkStRht'}" @filelist="fnImgFileList" @fileDelete="fnImgFileDelete"></imgsfileform>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row" class="essential"><label for="">요청내용</label></th>
                            <td>
                                <textarea id="dmnd_cn" rows="5" title="지적/요청사항" v-model="viewModel.data.dmnd_cn"></textarea>
                            </td>
                        </tr>
                        <tr v-if="viewModel.userInfo.ocpt_se_cd == 'MNG' && viewModel.userInfo.bplc_yn == 'Y'">
                            <th scope="row"><label for="bplc">조치자</label></th>
                            <td>
                                <div class="input_group input_btn">
                                    <input type="text" id="maner_nm" v-model="viewModel.data.maner_nm" readonly @click="fnUserPopup();">    
                                    <input type="hidden" id="maner" v-model="viewModel.data.maner">
                                    <label :for="'maner_nm'"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-search"></use></svg></label>
                                </div>
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
        <user ref="user" v-if="userPop==true" :pass="{dept_sn: viewModel.userInfo.dept_sn, team_sn: viewModel.userInfo.team_sn, title:'조치자', bplc_yn:'Y', bplc_sn: viewModel.data.bplc_sn}"></user>
    </div>
</template>

<script>
    import "es6-promise/auto";
    import Vue from "vue";
    import Axios from "axios";
    import Message, {messageUtil} from "../../../../common/js/message";
    import fromValidation from "../../../../common/js/fromValidation";
    import imgsfileform from '../../../../common/vue/imgsfileform2.vue';
    import bplc from "../../popup/bplc_popup.vue";
    import user from "../../popup/user_popup.vue";

    export default {
        data: function() {
            return {
                mttrForm:false,
                bplcPop:false, //현장 팝업
                userPop: false,
                viewModel:{
                    data:{
                        risk_se: [],
                    },
                    rsltList:[],
                    userInfo:{},
                    riskNmList:[],
                    imgfilelist:[],
                    imgdeletefileList:[],
                },
                isSaved:false,
            };
        },
        components: {
            'bplc' : bplc,
            'user' : user,
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
                vm.sn = vm.$route.params.sn;
                
                if(sn != undefined){
                    vm.fnDetail(sn);
                }else{
                    vm.fnWriteInfo();

                    //현장코드 있을 경우 그 값으로 세팅
                    vm.viewModel.data.bplc_sn = vm.viewModel.userInfo.bplc_sn == 0 ? '' : vm.viewModel.userInfo.bplc_sn;
                    vm.viewModel.data.bplc_nm = vm.viewModel.userInfo.bplc_sn == 0 ? '' : vm.viewModel.userInfo.bplc_nm;
                }
            },
            fnWriteInfo:function(){
                let vm = this;
                let data = {}

                Axios.post("/selectwkStRhtWriteInfo.do", data)
                .then(function(response) {
                    vm.viewModel.riskNmList = response.data.riskNmList;
                });
            },
            fnDetail:function(sn){
                let vm = this;
                let data = {
                    user_id: vm.viewModel.userInfo.user_id, 
                    stpge_sn: sn,
                }
                Axios.post("/selectWkStRhtUpdate.do", data)
                .then(function(response) {
                    vm.viewModel.riskNmList = response.data.riskNmList;

                    vm.viewModel.data = response.data.detail;
                    vm.viewModel.rsltList = response.data.rsltList;
                    vm.viewModel.imgfilelist = response.data.fileList;

                    var arr = vm.viewModel.data.risk_se.split(',');
                    vm.viewModel.data.risk_se = [];
                    for(let i=0; i<arr.length; i++){
                        vm.viewModel.data.risk_se.push(arr[i]);
                    }
                    
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

                if(vm.viewModel.data.actn_yn == 'Y'){
                    alert("이미 조치가 완료하여 수정이 불가합니다.");
                    return false;
                }

                if(vm.viewModel.data.bplc_nm == '' || vm.viewModel.data.bplc_nm == undefined){
                    alert("현장명을 선택해주세요.");
                    return false;
                }

                if(vm.viewModel.data.risk_se.length == 0){
                    alert("위험명을 선택해주세요.");
                    return false;
                }

                if(vm.viewModel.data.risk_se.filter(data => data == 'ETC').length > 0){

                    if(vm.viewModel.data.risk_cn == '' || vm.viewModel.data.risk_cn == undefined){
                        alert("위험명의 기타내용을 입력해주세요.");
                        return false;
                    }
                }

                if(vm.viewModel.data.dmnd_cn == '' || vm.viewModel.data.dmnd_cn == undefined){
                    alert("요청내용을 입력해주세요.");
                    return false;
                }

                let data = {
                    user_id: vm.viewModel.userInfo.user_id,
                    bplc_sn: vm.viewModel.data.bplc_sn,
                    l_risk_se: vm.viewModel.data.risk_se,
                    risk_cn: vm.viewModel.data.risk_cn,
                    dmnd_cn: vm.viewModel.data.dmnd_cn,
                    maner: vm.viewModel.data.maner,
                    stpge_sn: vm.viewModel.data.stpge_sn
                };
                
                frm.append('data', new Blob([ JSON.stringify(data) ], {type : "application/json"}));
                
                frm.append("filePath", "wkStRht");

                if(vm.viewModel.data.stpge_sn == undefined){
                    if(confirm(Message.CREATE_CONFIRM)){
                        $(".loading").show();
                        $("#mask").show();
                        Axios.post("/insertWkStRht.do", frm).then(function(response) {
                            if(response.data.result == 1){
                                vm.isSaved = true;
                                vm.$router.push('/');
                                alert("저장되었습니다.");
                                if(vm.viewModel.data.maner != undefined){
                                    vm.callPushAlarm(response.data, vm.viewModel.data.maner);
                                }
                            }else{
                                alert(Message.ERROR);    
                            }
                        }).catch(function(ex) {
                            alert(Message.ERROR);
                        }).finally(function(){
                            $(".loading").hide();
                            $("#mask").hide();
                        });
                    }
                }else{
                    if(confirm(Message.UPDATE_CONFIRM)){
                        $(".loading").show();
                        $("#mask").show();
                        Axios.post("/updateWkStRht.do", frm).then(function(response) {
                            if(response.data == 1){
                                vm.isSaved = true;
                                vm.$router.push('/');
                                alert("저장되었습니다.");
                            }else{
                                alert(Message.ERROR);    
                            }
                        }).catch(function(ex) {
                            alert(Message.ERROR);
                        }).finally(function(){
                            $(".loading").hide();
                            $("#mask").hide();
                        });
                    }
                }
            },
            fnBplcPopup:function(){
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
            fnUserPopup:function(){
                let vm = this;

                if(vm.viewModel.data.bplc_sn == '' || vm.viewModel.data.bplc_sn == undefined){
                    alert("현장명을 선택해주세요.");
                    return false;
                }else{
                    vm.userPop=true;
                    vm.bplcPop=false;
                    vm.$nextTick(function() {
                        if(vm.userPop) {
                            vm.$refs.user.fnInit();
                        }
                    })
                }
            },
            fnMemberAdd: function(item){
                let vm = this;

                vm.viewModel.data.maner = item.user_id;
                vm.viewModel.data.maner_nm = item.user_nm;
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
                        $("#risk_se_etc").val("");
                    }
                }
            },
            callPushAlarm: function(data, user_id) {
                let vm = this;
                
                let link = '/m/wkOpnLs/wkStRht/rgstWkStRht.do#/detail/'+data.stpge_sn;

                $.ajax({
                    type: "post",
                    url:"/api/pushSendPerson.do",
                    data:{
                        // 제목 및 내용
                        title : "작업중지권이 등록되었습니다. 조치해주세요.",
                        message : data.dmnd_cn,
                        user_id : user_id,
                        // 클릭 시 이동 화면주소
                        link : link
                    }
                });
            }
        }
    };
</script>