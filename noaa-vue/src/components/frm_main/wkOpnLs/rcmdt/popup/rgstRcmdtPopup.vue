<template>
    <modal :pass="{popupTitle: '건의사항 조치사항'}">
		<template v-slot:contents>
            <div>
                <h3>건의사항 조치</h3>
                <table class="table horizontal write">
                    <caption>조치사항 등록</caption>
                    <tbody>
                        <tr>
                            <th scope="row" class="w130"><label for="">건의사항 조치자</label></th>
                            <td v-if="viewModel.data.prgrs_stts == '1'">
                                {{ viewModel.userInfo.jbttl_nm }} {{ viewModel.userInfo.user_name }}
                            </td>
                            <td v-else>
                                {{ viewModel.data.jbttl }} {{ viewModel.data.maner_name }}
                            </td>
                        </tr>
                        <tr>
                            <th scope="row" class="essential"><label for="">조치 구분</label></th>
                            <td>
                                <div v-if="(viewModel.userInfo.ocpt_se_cd == 'MNG' || viewModel.userInfo.bplc_yn == 'N')">
                                    <label for="measure">
                                        <input type="radio" v-model="viewModel.selectedValue" value="2" name="radio" id="measure"> 조치 
                                    </label>
                                    <label for="escalation">
                                        <input type="radio" v-model="viewModel.selectedValue" value="3" name="radio" id="escalation" > 이관 
                                    </label>
                                    <label for="hold">
                                        <input type="radio" v-model="viewModel.selectedValue" value="4" name="radio" id="hold"> 보류 
                                    </label>
                                </div>
                                <div v-else>
                                    <label for="measure">
                                        <input type="radio" v-model="viewModel. selectedValue" value="2" name="radio" id="measure" disabled> 조치 
                                    </label>
                                    <label for="escalation">
                                        <input type="radio" v-model="viewModel.selectedValue" value="3" name="radio" id="escalation" disabled> 이관 
                                    </label>
                                    <label for="hold">
                                        <input type="radio" v-model="viewModel.selectedValue" value="4" name="radio" id="hold" disabled> 보류 
                                    </label>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row" class="essential"><label for="">조치내용</label></th>
                            <td>
                                <textarea id="actn_cn" title="조치내용" v-model="viewModel.data.actn_cn"></textarea>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row"><label for="">조치사진</label></th>
                            <!-- 여러개의 건의사항으로 조치를 한번에 저장 못할 경우가 있어 수정이 가능하도록 변경 -->
                            <td>
                                <imgsfileform ref="imgsfileform" :pass="{id:'rcmdt'}" @filelist="fnImgFileList" @fileDelete="fnImgFileDelete"></imgsfileform>
                            </td>
                            <!-- <td v-else-if="viewModel.data.strg_file_nm2 != null && viewModel.data.strg_file_nm2 != undefined && viewModel.data.strg_file_nm2 != ''">
                                <imgsfileform :ref="'actn_img'" :pass="{id:'actn_img', mode:'view'}"></imgsfileform>
                            </td>
                            <td v-else>
                                사진이 없습니다.
                            </td> -->
                        </tr>
                        <tr v-if="viewModel.data.prgrs_stts == '3' || viewModel.data.prgrs_stts == '4'">
                            <th v-if="viewModel.data.opinion_pic != null" scope="row"><label for="">본사 의견<br>({{ viewModel.data.jbttl2 }} {{ viewModel.data.opinion_pic }})</label></th>
                            <th v-else scope="row"><label for="">본사 의견</label></th>
                            <td v-if="viewModel.userInfo.bplc_yn == 'N' && (viewModel.data.prgrs_stts == '3' || viewModel.data.prgrs_stts == '4')">
                                <textarea id="opinion" title="본사 의견" v-model="viewModel.data.opinion"></textarea>
                            </td>
                            <td v-else>
                                {{ viewModel.data.opinion }}
                            </td>
                        </tr>
                        <tr v-else>
                            <th v-if="viewModel.data.opinion_pic != null" scope="row"><label for="">본사 의견<br>({{ viewModel.data.jbttl2 }} {{ viewModel.data.opinion_pic }})</label></th>
                            <th v-else scope="row"><label for="">본사 의견</label></th>
                            <td>
                                {{ viewModel.data.opinion }}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            
            <div class="table_footer btn-right">
                <button v-if="(viewModel.userInfo.bplc_yn == 'N' || viewModel.userInfo.ocpt_se_cd == 'MNG')" class="btn btn-purple" @click.prevent="fnSave()"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-post-add"></use></svg>등록</button>
            </div>
		</template>
	</modal>
</template>

<script>
    import "es6-promise/auto";
    import Vue from "vue";
    import Axios from "axios";
    import Message, {messageUtil} from "../../../../../common/js/message";
    // import fromValidation from "../../../../../common/fromValidation";
    import imgsfileform from '../../../../../common/vue/imgsfileform2.vue';
    import Modal from '../../../../../common/vue/modal.vue'

    export default {
        data: function() {
            return {
                viewModel:{
                    selectedValue:'',
                    data:{
                        risk_se: [],
                    },
                    rsltList:[],
                    userInfo:{},
                    riskNmList:[],
                    imgfilelist:[],
                    imgdeletefileList:[],
                },
            };
        },
        components: {
            'imgsfileform' : imgsfileform,
            Modal
        },
        mounted: function() {
            let vm = this;
        },
        methods: {
            fnInit: function(sn){
                let vm = this;
                vm.viewModel.userInfo = vm.$store.state.global.userInfo;

                Modal.methods.fnInit();

                vm.sn = sn;
                
                vm.fnDetail(vm.sn);
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
                    vm.viewModel.imgfilelist = response.data.fileList2;
                    vm.viewModel.selectedValue = response.data.detail.prgrs_stts;
                    vm.code = response.data.detail.clsf_cd;
                    
                    
                }).then(function(){
                   vm.$nextTick(function() {
					// if(vm.viewModel.data.prgrs_stts != '2'){
                        vm.$refs.imgsfileform.fnFileLoadList(vm.viewModel.imgfilelist);
                    // }
                    // else if(vm.viewModel.data.strg_file_nm2 != null && vm.viewModel.data.strg_file_nm2 != undefined && vm.viewModel.data.strg_file_nm2 != ''){
                    //     vm.$refs.actn_img.fnFileLoadList(vm.viewModel.imgfilelist);
                    // }
				})
                });
            },
            fnSave:function(){
                let vm = this;
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

                if(vm.viewModel.data.actn_cn == '' || vm.viewModel.data.actn_cn == undefined){
                    alert("조치내용을 입력해주세요.");
                    return false;
                }
                if(vm.viewModel.selectedValue == "1"){
                    alert("조치 구분을 선택해주세요.")
                    return false;
                }

                let data = {
                    user_id: vm.viewModel.data.maner_name == null ? vm.viewModel.userInfo.user_id : vm.viewModel.data.maner_id,
                    actn_cn: vm.viewModel.data.actn_cn,
                    sugest_sn: vm.viewModel.data.sugest_sn,
                    prgrs_stts: vm.viewModel.selectedValue,
                    bplc_sn: vm.viewModel.data.bplc_sn,
                    opinion: vm.viewModel.data.opinion == null ? '' : vm.viewModel.data.opinion,
                    opinion_pic : vm.viewModel.userInfo.user_id,
                };
                
                frm.append('data', new Blob([ JSON.stringify(data) ], {type : "application/json"}));
                
                frm.append("filePath", "rcmdt");               
                if(confirm("조치 등록 하시겠습니까?")){
                    Axios.post("/updateRcmdtMttr.do", frm).then(function(response) {
                        vm.$parent.fnList(0);
                        vm.$parent.mttrPop = false;
                        alert("저장되었습니다.");
                    }).catch(function(ex) {
                        alert(Message.ERROR);
                    });
                }
            
            },
            fnImgFileList:function(vm){
                this.viewModel.imgfilelist = vm.viewModel.filelist;
            },
            fnImgFileDelete: function(vm){
                this.viewModel.imgdeletefileList = vm.viewModel.deletefileList;
            },
        }
    };
</script>