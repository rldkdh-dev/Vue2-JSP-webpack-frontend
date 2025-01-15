<template>
    <div>
        <div class="contents write">
            <div>
                <table class="table horizontal write">
                    <caption>건의사항 등록</caption>
                    <tbody>
                        <tr>
                            <th scope="row" class="essential"><label for="ttl">제목</label></th>
                            <td :colspan="3"><input type="text" id="ttl" name="ttl" v-model="viewModel.data.ttl"></td>
                        </tr>
                        <tr>
                            <th scope="row" class="essential"><label for="se">구분</label></th>
                            <td>
                                <select title="구분" v-model="viewModel.data.se" id="se">
                                    <option value="">구분 선택</option>
                                    <!-- <option value="A">건의사항</option>
                                    <option value="B">오류</option> -->
                                    <option v-for="item in viewModel.sySugCdList" :value="item.CODE">{{ item.CODE_NM }}</option>
                                </select>
                            </td>
                            <th scope="row" class="essential"><label for="wrtr">작성자</label></th>
                            <td>{{viewModel.data.sugest_sn == undefined ? viewModel.userInfo.user_name: viewModel.data.reg_nm }}</td>
                        </tr>
                        <tr>
                            <th scope="row" class="essential"><label for="cn">내용</label></th>
                            <td :colspan="3"><textarea rows="5" id="cn" v-model="viewModel.data.cn" ></textarea></td>
                        </tr>
                        <tr>
                            <th scope="row"><label for="wrtr">첨부파일</label></th>
                            <td :colspan="3">
                                <fileform @filelist="fnFilelist"  @fileDelete="fnFileDelete" :pass="{id:'sc'}" ref="files"></fileform>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div class="table_footer btn-right">
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
    import fileform from "../../../../common/vue/fileform2.vue";
    import Message, {messageUtil} from "../../../../common/js/message";
    import fromValidation from "../../../../common/js/fromValidation";

    export default {
        data: function() {
            return {
                viewModel:{
                    data:{se:''},
                    userInfo:{},
                    filelist:[],
                    deletefileList: [],
                    sySugCdList:[],
                },
                isSaved:false,
            };
        },
        components: {
            'fileform' : fileform,
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
        mounted: function() {
            let vm = this;
            // vm.fnInit();
        },
        methods: {
            fnInit:function(){
                let vm = this;
                vm.viewModel.userInfo = vm.$store.state.global.userInfo;

                let sn = vm.$route.params.sn;
                
                if(sn != undefined){
                    vm.fnDetail(sn);
                }else{
                    vm.fnWriteInfo();
                }
            },
            fnWriteInfo: function(){
                let vm = this;

                Axios.post("/selectSysSugestWriteInfo.do", {})
                .then(function(response) {
                    vm.viewModel.sySugCdList = response.data.sySugCdList;
                });

            },
            fnDetail:function(sn){
                let vm = this;
                let data = {
                    sugest_sn: sn,
                }
                Axios.post("/selectSugestDetail.do", data)
                .then(function(response) {
                    vm.viewModel.data = response.data.detail;
                    vm.viewModel.filelist = response.data.fileList;

                    vm.viewModel.sySugCdList = response.data.sySugCdList;

                    vm.$refs.files.fnFileLoadList(vm.viewModel.filelist);
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
                for(let i=0; i<vm.viewModel.deletefileList.length; i++){
                    frm.append("deleteFiles", vm.viewModel.deletefileList[i]);
                }

                vm.fngetFileInfo(frm);
            },
            fngetFileInfo(frm){
                let vm = this;

                const valiData = [
					{id: 'ttl', type: 'input', title: '제목'},
					{id: 'se', type: 'select', title: '구분'},
					{id: 'cn', type: 'input', title: '내용'},
				];

                if(!fromValidation(valiData)){
                    return false;
                }

                let data = {
                    reg_id: vm.viewModel.userInfo.user_id,
                    ttl: vm.viewModel.data.ttl,
                    cn: vm.viewModel.data.cn,
                    se: vm.viewModel.data.se,
                    sugest_sn: vm.viewModel.data.sugest_sn,
                };
                
                frm.append('data', new Blob([ JSON.stringify(data) ], {type : "application/json"}));
                
                frm.append("filePath", "sugest");

                if(vm.viewModel.data.sugest_sn == undefined){
                    if(confirm(Message.CREATE_CONFIRM)){
                        Axios.post("/insertSugest.do", frm).then(function(response) {
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
                        Axios.post("/updateSugest.do", frm).then(function(response) {
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
            fnFilelist:function(vm){
                this.viewModel.filelist = vm.filelist;
                this.viewModel.fileGroup = vm.fileGroup;
            },
            fnFileDelete:function(vm){
                this.viewModel.deletefileList = vm.deletefileList;
            }
        }
    };
</script>