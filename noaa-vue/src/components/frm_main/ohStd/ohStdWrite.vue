<template>
    <div>
        <div class="contents write">
            <div>
                <table class="table horizontal write">
                    <caption>안전보건 기준/제도 등록</caption>
                    <tbody>
                        <tr>
                            <th scope="row" class="w180 essential"><label for="ttl">제목</label></th>
                            <td><input type="text" id="ttl" name="ttl" v-model="viewModel.data.ttl"></td>
                        </tr>
                        <tr>
                            <th scope="row" class="essential"><label for="wrtr">작성자</label></th>
                            <td>{{viewModel.data.system_sn == undefined ? viewModel.userInfo.user_name: viewModel.data.wrtr }}</td>
                        </tr>
                        <tr>
                            <th scope="row" class="essential"><label for="cn">내용</label></th>
                            <td><textarea rows="5" id="cn" v-model="viewModel.data.cn" ></textarea></td>
                        </tr>
                        <tr>
                            <th scope="row"><label for="wrtr">이미지 첨부파일</label></th>
                            <td>
                                <imgsfileform @filelist="fnImgFileList"  @fileDelete="fnImgFileDelete" :pass="{id:'sc'}" ref="imgsfileform"></imgsfileform>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row"><label for="wrtr">첨부파일</label></th>
                            <td>
                                <fileform @filelist="fnFilelist"  @fileDelete="fnFileDelete" :pass="{id:'sc'}" ref="files"></fileform>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div class="table_footer btn-right">
                    <p style="margin-right: 1rem;" v-if="notice_yn == 'Y'">※등록시 공지사항에 자동 등록(수정)됩니다.</p>
                    <button class="btn btn-purple" @click.prevent="fnSave()"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-post-add"></use></svg>등록</button>
                    <router-link :to="'/'" class="btn btn-white"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-list-back"></use></svg>목록</router-link>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import "es6-promise/auto";
    import Vue from "vue";
    import Axios from "axios";
    import fileform from "../../../common/vue/fileform2.vue";
    import imgsfileform from "../../../common/vue/imgsfileform2.vue";
    import Message, {messageUtil} from "../../../common/js/message";
    import fromValidation from "../../../common/js/fromValidation";

    export default {
        data: function() {
            return {
                viewModel:{
                    data:{},
                    userInfo:{},
                    filelist:[],
                    deletefileList: [],
                    imgfilelist:[],
                    imgdeletefileList:[],
                },
                menu_se:$("#menu_se").val(),
                notice_yn:$("#notice_yn").val(),
                isSaved:false,
            };
        },
        components: {
            'fileform' : fileform,
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
                
                if(sn != undefined){
                    vm.fnDetail(sn);
                }
            },
            fnDetail:function(sn){
                let vm = this;
                let data = {
                    system_sn: sn,
                    menu_se: vm.menu_se
                }
                Axios.post("/selectOhStdUpdate.do", data)
                .then(function(response) {
                    vm.viewModel.data = response.data.detail;
                    vm.viewModel.filelist = response.data.fileList.filter(data=>data.file_se == 2);
                    vm.viewModel.imgfilelist = response.data.fileList.filter(data=>data.file_se == 1);

                    vm.$refs.files.fnFileLoadList(vm.viewModel.filelist);
                    vm.$refs.imgsfileform.fnFileLoadList(vm.viewModel.imgfilelist);
                });
            },
            fnSave:function(){

                let vm = this;
                let frm = new FormData();
                for(let i=0; i<vm.viewModel.filelist.length; i++) {
                    let key = vm.viewModel.filelist[i].file_seq;
                    if(vm.viewModel.filelist[i].file != null) {
                        frm.append("fileTitle", vm.viewModel.filelist[i].file_title);
                        frm.append("uploadFiles", vm.viewModel.filelist[i].file);
                        frm.append("file_se", 2);
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

                if(vm.viewModel.imgfilelist != null){
                    for(let j=0; j<vm.viewModel.imgfilelist.length; j++){
                        let key = vm.viewModel.imgfilelist[j].file_seq;

                        if(vm.viewModel.imgfilelist[j].file != null) {
                            frm.append("uploadFiles", vm.viewModel.imgfilelist[j].file);
                            frm.append("fileTitle", vm.viewModel.imgfilelist[j].file.name);
                            frm.append("file_se", 1);
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

                for(let i=0; i<vm.viewModel.deletefileList.length; i++){
                    frm.append("deleteFiles", vm.viewModel.deletefileList[i]);
                }

                vm.fngetFileInfo(frm);
            },
            fngetFileInfo(frm){
                let vm = this;

                const valiData = [
					{id: 'ttl', type: 'input', title: '제목'},
					{id: 'cn', type: 'input', title: '내용'},
				];

                if(!fromValidation(valiData)){
                    return false;
                }

                let data = {
                    user_id: vm.viewModel.userInfo.user_id,
                    wrtr: vm.viewModel.userInfo.user_name,
                    ttl: vm.viewModel.data.ttl,
                    cn: vm.viewModel.data.cn,
                    system_sn: vm.viewModel.data.system_sn,
                    menu_se: vm.menu_se,
                    notice_yn: vm.notice_yn
                };
                
                frm.append('data', new Blob([ JSON.stringify(data) ], {type : "application/json"}));
                
                frm.append("filePath", "ohStd");

                if(vm.viewModel.data.system_sn == undefined){
                    if(confirm(Message.CREATE_CONFIRM)){
                        Axios.post("/insertOhStd.do", frm).then(function(response) {
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
                        Axios.post("/updateOhStd.do", frm).then(function(response) {
                            if(response.data == 1){
                                vm.isSaved = true;
                                alert("저장되었습니다.");
                                vm.$router.push('/');
                            }else{
                                alert(Message.ERROR);
                            }
                        }).catch(function(ex) {
                            alert(Message.ERROR);
                        });
                    }
                }
            },
            fnFilelist:function(vm){
                this.viewModel.filelist = vm.filelist;
                this.viewModel.fileGroup = vm.fileGroup;
            },
            fnFileDelete: function(vm){
                this.viewModel.deletefileList = vm.deletefileList;
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