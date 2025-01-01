<template>
    <div>
        <div class="contents write">
            <div>
                <table class="table horizontal write">
                    <caption>종사자의견청취 등록</caption>
                    <tbody>
                        <tr>
                            <th scope="row" class="w180 essential"><label for="">현장</label></th>
                            <!-- <td colspan="2" v-if="userInfo.hdofc_mngr_yn != 'Y'">{{ viewModel.list.bplc_nm }}</td>
                            <td colspan="2" v-if="userInfo.hdofc_mngr_yn =='Y'">
                                <div class="input_group">
                                    <input type="text"   v-if="!viewModel.list.bplc_sn" id="bplc" v-model="viewModel.list.bplc_nm">
                                    <input type="hidden" v-if="viewModel.list.bplc_sn" id="bplc" v-model="viewModel.list.bplc_sn">
                                    <input type="text" id="bplc_nm" v-if="viewModel.list.bplc_nm && viewModel.list.bplc_sn" v-model="viewModel.list.bplc_nm" disabled>    
                                    <button @click="fnBplcPopup();" v-if="userInfo.hdofc_mngr_yn =='Y'"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-search"></use></svg></button>
                                </div>
                            </td> -->

                            <td colspan="2" v-if="userInfo.hdofc_mngr_yn != 'Y'">
                                <div class="input_group">
                                    {{ viewModel.bplc_nm }}
                                </div>
                            </td>
                            <td colspan="2" v-if="userInfo.hdofc_mngr_yn == 'Y'">
                                <div class="input_btn">
                                    <input type="text" id="bplc_nm" v-model="viewModel.bplc_nm" disabled>    
                                    <input type="hidden" v-if="viewModel.bplc_sn" id="bplc" v-model="viewModel.bplc_sn">
                                    <button @click="fnBplcPopup();" v-if="userInfo.hdofc_mngr_yn =='Y'"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-search"></use></svg></button>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row" class="essential"><label for="">작성자</label></th>
                            <td v-if="viewModel.list.ocpt_detail_nm"><input type="text" id="" title="작성자 직종" v-model="viewModel.list.ocpt_detail_nm" class="text-center" disabled></td> 
                            <td v-if="!viewModel.list.ocpt_detail_nm"><input type="text" id="" title="작성자 직종" placeholder="직종 정보 없음" class="text-center" disabled></td> 
                            <td><input type="text" id="" title="작성자" class="text-center" v-model="viewModel.list.user_nm" disabled></td> 
                        </tr>
                        <tr>
                            <th scope="row" class="essential"><label for="">제안제목</label></th>
                            <td colspan="2"><input type="text" id="" title="제안제목" placeholder="제안제목" v-model="viewModel.list.propse_ttl"></td> 
                        </tr>
                        <tr>
                            <th scope="row" class="essential"><label for="">제안내용</label></th>
                            <td colspan="2"><textarea rows="10" title="제안내용" placeholder="제안내용" v-model="viewModel.list.propse_cn"></textarea></td> 
                        </tr>
                        <tr>
                            <th scope="row"><label for="">첨부사진</label></th>
                            <td colspan="2">
                                <imgsfileform :ref="'imgs'" :pass="{id:'idea', gbn:'idea'}" @filelist="fnImgFileList" @fileDelete="fnImgFileDelete"></imgsfileform>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row"><label for="">첨부파일</label></th>
                            <td colspan="2">
                                <fileform @filelist="fnFileList"  @fileDelete="fnFileDelete" :pass="{id:'safeIdea'}" ref="files"></fileform>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div class="table_footer btn-right">
                    <a href="#" class="btn btn-purple" @click="fnSave()"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-post-add"></use></svg>{{state_k}}</a>
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
    import Imgsfileform from '../../../../common/vue/imgsfileform2.vue';
    
    export default {
        components: {
            BplcPopup, Fileform, Imgsfileform
        },
        data: function() {
            return {
                state_k:'',
                bplcPop:false,
                userInfo:{},
                uid:0,
                state_k:'',
                viewModel:{
                    list:{},
                    imgList:[],
                    deleteImgList:[],
                    fileGroup:[],
                    fileList:[],
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
            if(vt.state == 'update' && vt.uid != null){
                vt.state_k = '수정';
                vt.fnDetail(vt.uid);
            }else{
                vt.state_k = '등록';
                vt.fnInit();
            }
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
                let vt = this;
                let vm = this.viewModel;
                
                vm.bplc_sn = (vt.userInfo.bplc_sn == 0) ? '' : vt.userInfo.bplc_sn;
                vm.bplc_nm = (vt.userInfo.bplc_sn == 0) ? '' : vt.userInfo.bplc_nm;
                
                vm.list.user_nm = vt.userInfo.user_name
                vm.list.ocpt_detail_nm = vt.userInfo.ocpt_detail_nm;
                vt.$forceUpdate(); 
            },
            fnDetail:function(sn){
                let vt = this;
                let vm = this.viewModel;
                vm.fileList = [];
                vm.imgList = [];
                console.log(vt.userInfo);

                
                Axios.post("/selectSafeIDEADetail.do", {propse_sn : sn}).then(function(res){
                    console.log(res);
                    vm.list = res.data.detail;
                    
                    for(let i=0; i<res.data.fileList.length; i++){
                        if(res.data.fileList[i].file_se == '1'){ //사진
                            vm.imgList.push(res.data.fileList[i]);
                        }if(res.data.fileList[i].file_se == '2'){ //파일
                            vm.fileList.push(res.data.fileList[i]);
                        }
                    }
                    vt.$nextTick(function() {
                        vt.$refs.files.fnFileLoadList(vm.fileList);
                        vt.$refs.imgs.fnFileLoadList(vm.imgList);
                    });

                    vt.viewModel.bplc_nm = res.data.detail.bplc_nm;
                    vt.viewModel.bplc_sn = res.data.detail.bplc_sn;
                }).catch(function(ex) {
                    console.log(ex);
                }).finally(function(){
                    vt.$forceUpdate();
                })
                
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
            fnImgFileList:function(vm){
                let vt = this;
                vt.viewModel.imgList = vm.viewModel.filelist;
            },
            fnImgFileDelete:function(vm){
                let vt = this;
                vt.viewModel.deleteImgList = vm.viewModel.deletefileList;
            },
            fnFileList:function(vm){
			    let vt = this;
                vt.viewModel.fileList = vm.filelist;
                vt.viewModel.fileGroup = vm.fileGroup;
            },
            fnFileDelete: function(vm){
                let vt = this;
                vt.viewModel.deletefileList = vm.deletefileList;
            },
            fnBplcAdd: function(item){
                let vm = this.viewModel;

                vm.bplc_sn = item.bplc_sn;
                vm.bplc_nm = item.bplc_nm;
            },
            fnSave:function(){
                let vt = this;
                let frm = new FormData();

                //이미지 (file_se:1)
                for(let i=0; i<vt.viewModel.imgList.length; i++) {
                    let key = vt.viewModel.imgList[i].file_seq;
                    if(vt.viewModel.imgList[i].file != null) {
                        frm.append("fileTitle", vt.viewModel.imgList[i].file.name);
                        frm.append("uploadFiles", vt.viewModel.imgList[i].file);
                        frm.append("file_se", 1); //구분(1:사진, 2: 파일)
                        if(vt.viewModel.imgList[i].file_sn){
                            frm.append("deleteFiles", vt.viewModel.imgList[i].file_sn);
                        }
                        frm.append("key", 0)
                    } else {
                        if(vt.viewModel.imgList[i].file == undefined){
                            
                        }else{
                            frm.append("fileTitle", vt.viewModel.imgList[i].file_title);
                            frm.append("key", key)
                        }
                    }
                }
                if(vt.viewModel.deleteImgList != null){
                    for(let i=0; i<vt.viewModel.deleteImgList.length; i++){
                        frm.append("deleteFiles", vt.viewModel.deleteImgList[i]);
                    }   
                }

                //첨부파일 (file_se:2)
                for(let i=0; i<vt.viewModel.fileList.length; i++) {
                    let key = vt.viewModel.fileList[i].file_seq;
                    if(vt.viewModel.fileList[i].file != null) {
                        frm.append("fileTitle", vt.viewModel.fileList[i].file_title);
                        frm.append("uploadFiles", vt.viewModel.fileList[i].file);
                        frm.append("file_se", 2); //구분(1:사진, 2: 파일)
                        if(vt.viewModel.fileList[i].file_sn){
                            frm.append("deleteFiles", vt.viewModel.fileList[i].file_sn);
                        }
                        frm.append("key", 0)
                    } else {
                        if(vt.viewModel.fileList[i].file == undefined){
                            
                        }else{
                            frm.append("fileTitle", vt.viewModel.fileList[i].file_title);
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
                    return alert("현장명을 입력해주시기 바랍니다.");
                }
                if(!vm.list.propse_ttl || !vm.list.propse_cn){
                    return alert("제안 제목 및 내용을 입력해주시기 바랍니다.");
                }
                
                if(confirm(vt.state_k+" 하시겠습니까?")){
                    let data = {
                        propse_sn : (isNaN(vt.uid))? -1:vt.uid, //숫자일 때 false
                        // propse_sn : vm.list.propse_sn,
                        bplc_sn : vm.bplc_sn,
                        propse_ttl : vm.list.propse_ttl,
                        propse_cn : vm.list.propse_cn,
                        reg_id : vt.userInfo.user_id
                    }

                    frm.append('data', new Blob([ JSON.stringify(data) ], {type : "application/json"}));
                    
                    frm.append("filePath", "safeIdea");

                    //수정
                    if(vt.state == 'update' && (vt.uid != '' && vt.uid != null && vt.uid != undefined)){
                        Axios.post("/updateSafeIDEA.do", frm).then(function(res){
                            if(res.date != 0){
                                vt.isSaved = true;
                                console.log(res);
                                alert(vt.state_k+" 되었습니다.");
                                vt.$router.push('/');
                            }else{
                                alert(vt.state_k+"이 중단되었습니다.");
                            }
                        }).catch(function(ex) {
                            console.log(ex);
                        });
                    }else{//등록
                        Axios.post("/insertSafeIDEA.do", frm).then(function(res){
                            if(res.date != 0){
                                vt.isSaved = true;
                                console.log(res);
                                alert(vt.state_k+" 되었습니다.");
                                vt.$router.push('/');
                            }else{
                                alert(vt.state_k+"이 중단되었습니다.");
                            }
                        }).catch(function(ex) {
                            console.log(ex);
                        });
                    }
                }
            }
        }
    };
</script>