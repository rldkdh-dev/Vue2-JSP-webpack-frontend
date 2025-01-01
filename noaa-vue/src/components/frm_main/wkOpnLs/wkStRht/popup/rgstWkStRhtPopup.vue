<template>
    <modal :pass="{popupTitle: '작업중지권 조치사항'}">
		<template v-slot:contents>
			<div>
                <table class="table horizontal write">
                    <caption>작업중지권 상세</caption>
                    <tbody>
                        <tr>
                            <th scope="row" class="w150"><label for="">작업중지 요청자</label></th>
                            <td>
                                {{ viewModel.data.rqstr_jbttl_nm }} {{ viewModel.data.rqstr_nm }}
                            </td> 
                        </tr>
                        <tr>
                            <th scope="row"><label for="bplc">현장명</label></th>
                            <td>
                                {{ viewModel.data.bplc_nm }}
                            </td>
                        </tr>
                        <tr>
                            <th scope="row"><label for="">위험명</label></th>
                            <td>
                                <ul class="input_wrap">
                                    <li v-for="(item, i) in viewModel.riskNmList" :key="i">
                                        <label :for="'riskNmList_'+item.CODE" @change="fnRiskSeClick(item.CODE);">
                                            <input type="checkbox" :id="'riskNmList_'+item.CODE" v-model="viewModel.data.risk_se" :value="item.CODE" disabled>{{ item.CODE_NM }}
                                         </label>
                                         <input v-if="item.CODE == 'ETC'" type="text" v-model="viewModel.data.risk_cn" :id="'risk_se_etc'" disabled>
                                    </li>
                                </ul>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row"><label for="">중지사진</label></th>
                            <td>
                                <imgsfileform :ref="'rqstr_img'" :pass="{id:'rqstr_img', mode:'view'}"></imgsfileform>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row"><label for="">요청내용</label></th>
                            <td class="pre">{{ viewModel.data.dmnd_cn }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div>
                <h3>조치사항</h3>
                <table class="table horizontal write">
                    <caption>조치사항 등록</caption>
                    <tbody>
                        <tr>
                            <th scope="row" class="w150 essential"><label for="">조치자</label></th>
                            <td>
                                <template v-if="viewModel.data.actn_yn == 'Y'">
                                    {{ viewModel.data.maner_jbttl_nm }} {{ viewModel.data.maner_nm }}
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
                            <th scope="row" class="essential"><label for="">조치 구분</label></th>
                            <td>
                                <div>
                                    <label :for="item.CODE" v-for="item in viewModel.mttrPrgrsList">
                                        <input type="radio" v-model="viewModel.data.actn_yn" :value="item.CODE" :name="'mttrPrgrs'" :id="item.CODE"> {{ item.CODE_NM }} 
                                    </label>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row"><label for="">조치사진</label></th>
                            <td>
                                <imgsfileform :ref="'maner_img'" :pass="{id:'maner_img'}" @filelist="fnImgFileList" @fileDelete="fnImgFileDelete"></imgsfileform>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row" class="essential"><label for="">조치내용</label></th>
                            <td>
                                <textarea id="actn_cn" title="조치내용" v-model="viewModel.data.actn_cn"></textarea>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            
            <div class="table_footer btn-right">
                <button class="btn btn-purple" @click.prevent="fnSave()"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-post-add"></use></svg>등록</button>
            </div>
		</template>
	</modal>
</template>

<script>
    import "es6-promise/auto";
    import Vue from "vue";
    import Axios from "axios";
    import Message, {messageUtil} from "../../../../../common/js/message";
    import fromValidation from "../../../../../common/js/fromValidation";
    import imgsfileform from '../../../../../common/vue/imgsfileform2.vue';
    import Modal from '../../../popup/modal.vue'

    export default {
        data: function() {
            return {
                viewModel:{
                    data:{
                        risk_se: [],
                    },
                    mttrPrgrsList:[],   //조치현황코드
                    rsltList:[],
                    userInfo:{},
                    riskNmList:[],
                    stpgeFileList:[],
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
                
                vm.fnDetail(sn);
            },
            fnDetail:function(sn){
                let vm = this;
                let data = {
                    user_id: vm.viewModel.userInfo.user_id, 
                    stpge_sn: sn,
                }
                Axios.post("/selectWkStRhtDetail.do", data)
                .then(function(response) {
                    vm.viewModel.riskNmList = response.data.riskNmList;

                    vm.viewModel.data = response.data.detail;
                    vm.viewModel.rsltList = response.data.rsltList;
                    vm.viewModel.stpgeFileList = response.data.fileList;
                    vm.viewModel.imgfilelist = response.data.fileList2;
                    vm.viewModel.mttrPrgrsList = response.data.mttrPrgrsList;

                    var arr = vm.viewModel.data.risk_se.split(',');
                    vm.viewModel.data.risk_se = [];
                    for(let i=0; i<arr.length; i++){
                        vm.viewModel.data.risk_se.push(arr[i]);
                    }
                    
                    vm.$refs.rqstr_img.fnFileLoadList(vm.viewModel.stpgeFileList);
                    vm.$refs.maner_img.fnFileLoadList(vm.viewModel.imgfilelist);
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

                let data = {
                    user_id: vm.viewModel.userInfo.user_id,
                    actn_cn: vm.viewModel.data.actn_cn,
                    stpge_sn: vm.viewModel.data.stpge_sn,
                    bplc_sn: vm.viewModel.data.bplc_sn,
                    actn_yn: vm.viewModel.data.actn_yn,
                };
                
                frm.append('data', new Blob([ JSON.stringify(data) ], {type : "application/json"}));
                
                frm.append("filePath", "wkStRht");

                if(confirm("조치 등록 하시겠습니까?")){
                    Axios.post("/updateWkStRhtMttr.do", frm).then(function(response) {
                        if(response.data == 1){
                            vm.$parent.fnList();
                            vm.$parent.mttrPop = false;
                            alert("저장되었습니다.");
                        }else{
                            alert(Message.ERROR);    
                        }
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