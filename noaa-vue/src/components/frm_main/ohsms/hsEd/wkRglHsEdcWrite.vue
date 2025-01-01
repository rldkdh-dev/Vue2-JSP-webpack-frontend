<template>
    <modal :pass="{popupTitle:'안전보건 교육자료 등록'}">
        <template v-slot:contents>
            <div>
                <table class="table horizontal write">
                    <caption>안전보건 교육자료 등록</caption>
                    <tbody>
                        <tr>
                            <th scope="row"><label for="">종류</label></th>
                            <td>
                                <select v-model="selectEdu">
                                    <option value="">선택</option>
                                    <option v-for="item in eduCodeList" :key="item" :value="item.edu_se_cd">{{ item.edu_se_nm }}</option>
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row"><label for="">교육명</label></th>
                            <td><input type="text" id="" v-model="edu_nm_ttl" @input="edu_nm_ttl = $event.target.value"></td>
                        </tr>
                        <tr>
                            <th scope="row"><label for="">교육일시</label></th>
                            <td>
                                <div class="datepicker_box">
                                    <input type="text" class="datepicker" id="" title="datepicker" placeholder="교육일시선택" readonly>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row"><label for="">작성자</label></th>
                            <td><input type="text" id="" v-model="reg_id" @input="reg_id = $event.target.value" disabled></td>
                        </tr>
                        <tr>
                            <th scope="row"><label for="">첨부파일</label></th>
                            <td>
                                <ul id="tbl_filelist">
                                    <li v-for="(item, i) in viewModel.filelist" :key="i" :id="'sc'+i">
                                        <div class="upload_file_wrap">
                                            <div class="upload_file">
                                                <div class="btn filebox" id="filebox">
                                                    <template v-if="item.orgnl_file_nm != null">
                                                        {{item.orgnl_file_nm == null ? '첨부파일을 추가해 주세요.' : item.orgnl_file_nm}}
                                                    </template>
                                                    <template v-else>
                                                        {{item.file_org_name == null ? '첨부파일을 추가해 주세요.' : item.file_org_name}}
                                                    </template>
                                                </div>
                                                <input type="file" hidden :id="'uf01'+i" :target=i @change="fnSetFileName(i)">
                                                <label :for="'uf01'+i" class="btn btn-white"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-folder-filled"></use></svg>찾아보기</label>
                                            </div>
                                            <div class="icon_box">
                                                <a href="#" class="btn btn-icon"><svg class="icon" @click="fnAddFile()"><use xlink:href="../../img/symbol-defs.svg#icon-add-circle"></use></svg></a>
                                                <a href="#" class="btn btn-icon"><svg class="icon" @click="fnDeleteFile(i)"><use xlink:href="../../img/symbol-defs.svg#icon-circle-minus"></use></svg></a>
                                            </div>
                                            <div class="icon_box">
                                                <a href="#" class="btn btn-icon"><svg class="icon" @click="fnMoveFile(i, -1)"><use xlink:href="../../img/symbol-defs.svg#icon-arrow-up-circle"></use></svg></a>
                                                <a href="#" class="btn btn-icon"><svg class="icon" @click="fnMoveFile(i, 1)"><use xlink:href="../../img/symbol-defs.svg#icon-arrow-down-circle"></use></svg></a>
                                            </div>
                                        </div>
                                    </li>
                                </ul>
                            </td>
                        </tr>
                    </tbody>
                </table>                    
            </div>
            <div class="btn-group">
                <div class="right_side">
                    <a href="#" class="btn btn-purple" @click="fnUpload">저장</a>
                </div>
            </div>
        </template>
    </modal>
</template>
<script>
    import "es6-promise/auto";
    import Vue from "vue";
    import Axios from "axios";
    import Message, {messageUtil} from "../../../../common/js/message";
    import modal from '../../../../common/vue/modal.vue';
    Vue.component('modal',modal);
    export default {
      data: function() {
        return {
            isAlert:false,
            uid:"",
            selectEdu:"",
            edu_nm_ttl:"",
            reg_id:"",
            edu_sn :0,
            eduCodeList:[],
            viewModel:{
                filelist:[{seq: 0}],
                fileGroup: '',
                deletefileList: [],
            }
        };
      },
      mounted: function() {
      },
      methods: {
        fnInit:function(sn){
            let vm = this;
            // vm.edu_instr = vm.$store.state.global.userInfo.user_name;
            modal.methods.fnInit();
            calendarInput();
            vm.uid = sn;
            vm.reg_id = vm.$store.state.global.userInfo.user_id;
            vm.fnSelectEdulist();
            if(sn != "" && sn != undefined){
                vm.fnwkRglHsEdc(sn);
            }
        },
        fnwkRglHsEdc:function(sn){
            let vm = this;

            Axios.post('/selectWkRglHsEdcWrite.do',{edu_sn:sn}).then(function(res){
                if(res.data.hsEdList[0].cnt > 0){
                    vm.fnFileLoad(res.data.hsEdList[0].edu_sn);
                }else{
                    alert("등록된 파일이 없습니다.");
                }
                $(".datepicker").val(res.data.hsEdList[0].edu_dt);
                vm.selectEdu = res.data.hsEdList[0].edu_se_cd;
                vm.edu_nm_ttl = res.data.hsEdList[0].edu_nm_ttl;
                vm.reg_id = res.data.hsEdList[0].reg_id;
                vm.edu_sn = res.data.hsEdList[0].edu_sn;
            });
        },
        fnUpload:function(){
            let vm = this;

            let send={
                edu_se_cd:vm.selectEdu,
                edu_nm_ttl:vm.edu_nm_ttl,
                reg_id:vm.reg_id,
                bplc_sn:vm.$store.state.global.userInfo.bplc_sn,
                edu_dt:$(".datepicker").val(),
            }
            if(vm.selectEdu == "") return alert(messageUtil(Message.VALIDATION_SELECT_REQUIRED, ["분류"]));
            if(vm.reg_id == "") return alert(messageUtil(Message.VALIDATION_REQUIRED, ["작성자"]));
            if(vm.edu_nm_ttl == "") return alert(messageUtil(Message.VALIDATION_REQUIRED, ["교육명"]));
            if($(".datepicker").val() == "") return alert(messageUtil(Message.VALIDATION_SELECT_REQUIRED, ["교육일시"]));
            if(vm.uid != "" && vm.uid != undefined){
                if(confirm("수정하시겠습니까?")){
                    send.edu_sn = vm.edu_sn;
                    Axios.post('/updateWkRglHsEdc.do',send).then(function(response){
                        vm.fnInsertFile(response.data);
                    }).then(function(){
                        alert("수정 되었습니다.");
                        vm.fnClose();
                    })
                }else{
                    alert("수정을 취소하였습니다.");
                }
            }else{
                if(confirm("등록하시겠습니까?")){
                    Axios.post('/insertWkRglHsEdc.do',send).then(function(response){
                        vm.fnInsertFile(response.data);
                    }).then(function(){
                        alert("등록 되었습니다.");
                        vm.fnClose();
                    })
                }else{
                    alert("등록을 취소하였습니다.");
                }
            }
        },
        fnSelectEdulist:function(){
            let vm = this;
            Axios.post('/hsEd/code.do',{}).then(function(res){
                vm.eduCodeList = res.data.hsEdList;
            });
        },
        fnBack:function(){
            if(confirm("작성을 중단하고 목록으로 가시겠습니까?")){
                this.$router.push("/");
            }
        },
    	fnSetFileName: function(index) { //file start
            let vt = this;
            let vm = this.viewModel;
            let file = new FormData();
            const maxSize = 1 * 1024 * 1024 * 1024; //30 MB
            file = $('#sc'+index+' #uf01'+ index);
            let filename = file.val().split('\\').pop();
            let filetitle = filename.substr(0, filename.lastIndexOf('.'));
            console.log(file[0].files[0].size);
            if(file != undefined) {
                const filesize = file[0].files[0].size;
                // $('#'+this.pass.id+index+' .upload-name').val(filename);
                // $('#'+this.pass.id+index+' .bf_title').val(filetitle);
                /**
                 * 파일 용량체크 기본설정 30MB 추후 변경가능
                 * 
                 */
                if(filesize > maxSize){
                    $('#uf01' + index).val(null);
                    $('#sc'+index+' #filebox').text("첨부파일을 추가해 주세요.");
                    return alert("파일첨부 사이즈는 1GB 이내로 가능합니다.");
                }
                $('#sc'+index+' #filebox').text(filename);
                
                vm.filelist[index].file = file[0].files[0];
                vm.filelist[index].orgnl_file_nm = filename;
                vm.filelist[index].file_title = filetitle;
                
                if(vm.fileGroup == '') {
                    Axios.post('/filegroup.do').then((response) => {
                        vm.fileGroup = response.data;
                        // vt.$emit('filelist', vm);
                    });
                }
            }
        },
        fnAddFile: function() {
            this.viewModel.filelist.push({seq: this.viewModel.filelist.length});
        },
        fnDeleteFile: function(index) {
            let vt = this;
            let vm = this.viewModel;
            let key = vm.filelist[index].seq;
            let atchmnfl_sn = vm.filelist[index].file_sn;
            
            if(confirm("삭제하시겠습니까?")){
                if(vm.filelist.length > 1) {
                    vm.filelist.splice(index, 1);

                    for(let i=0; i<vm.filelist.length; i++){
                        vm.filelist[i].seq = i;
                    }
                } else {
                    vm.filelist = [{seq: 0},]
                    vm.fileGroup = '';
                    // vt.$parent.viewModel.fileGroup = '';

                    
                    $('#uf01' + index).val(null);
                    $('#sc'+index+' #filebox').text("첨부파일을 추가해 주세요.");
                }
                if(key != undefined){
                    vm.deletefileList.push(atchmnfl_sn);
                    // vt.$emit('fileDelete', vm);         
                }
            }
        },
        fnAfterDelete: function() {
            let vm = this;
            if(vm.viewModel.deletefileList.length != 0){
                for(var i=0; i<vm.viewModel.deletefileList.length; i++){
                    Axios.post("/hsEd/deletefile.do",{file_sn:vm.viewModel.deletefileList[i]}).then(function(){})
                }
            }
        },
        fnMoveFile: function(index, ud) {
            let vm = this.viewModel;
            let {objFile, objTargetFile} = new FormData();

            if(index!=0 && ud==-1 || index!=vm.filelist.length-1 && ud==1) {
                objFile = vm.filelist[index].file;
                objTargetFile = vm.filelist[index+ud].file;

                let obj = JSON.parse(JSON.stringify(vm.filelist[index]));
                let objTarget = JSON.parse(JSON.stringify(vm.filelist[index+ud]));
                

                vm.filelist[index] = objTarget;
                vm.filelist[index+ud] = obj;
                
                vm.filelist[index].file = objTargetFile;
                vm.filelist[index+ud].file = objFile;

                $('#sc'+index+' #filebox').text(objTarget.orgnl_file_nm == undefined ? '첨부파일을 추가해 주세요.' : objTarget.orgnl_file_nm);
                $('#sc'+(index+ud)+' #filebox').text(obj.orgnl_file_nm == undefined ? '첨부파일을 추가해 주세요.' : obj.orgnl_file_nm);

            } 
        },
        fnFileLoad: function(groupid) {
            let vt = this;
            let vm = this.viewModel;

            Axios.post("/hsEdFilelist.do",{groupid:groupid}).then(function(rs) {
                let filelist = rs.data.filelist;
                if(filelist.length>0) {
                    vm.filelist = filelist;
                    vm.fileGroup = rs.data.atchmnfl_sn;
                    for(let i=0; i<rs.data.filelist.length; i++) {
                        vm.filelist[i].seq = i;
                    }
                } else {
                    vm.filelist = [{seq: 0},]
                    vm.fileGroup = ''
                }
                // vt.$emit('filelist', vm);
            });
        },
    	fnInsertFile: function(edu_sn) { // file end
            let vt = this;
            let vm = this.viewModel;
            let frm = new FormData();
            
            frm.append("fileGroup", vm.fileGroup);
            frm.append("reg_id",vt.$store.state.global.userInfo.user_id);
            frm.append("file_se",1);
            frm.append("bplc_sn",vt.$store.state.global.userInfo.bplc_sn);
            frm.append("edu_sn",edu_sn);
            // frm.append("blpc_sn",vt.$store.state.global.userInfo.bplc_sn);
            vt.fnAfterDelete();
            for(let i=0; i<vm.filelist.length; i++) {
                frm.append("fileTitle", vm.filelist[i].orgnl_file_nm);
                
                let key = vm.filelist[i].edu_sn == undefined ? vm.filelist[i].seq : vm.filelist[i].edu_sn;
                if(vm.filelist[i].file != undefined) {
                    vm.filelist[i].atchmnfl_sn == undefined ? frm.append("deletekey",0) : frm.append("deletekey",vm.filelist[i].atchmnfl_sn);
                    frm.append("uploadFiles", vm.filelist[i].file);
                    frm.append("key", 0);

                    // Axios.post("/hsEd/deletefile.do",{file_sn:vm.filelist[i].atchmnfl_sn}).then(function(){})
                    
                } else {
                    frm.append("key", key);
                    frm.append("deletekey",0);
                }
            }
            Axios.post('/hsEd/file/upload.do', frm, {headers: {'Content-Type': 'multipart/form-data'}}).then((response) => {
            }).catch(function(ex){
                console.error("error : "+ex);
            });
        },
        fnClose:function(){
            this.$parent.fnInit();
            this.$emit('close',false);
        },
      }
    };
</script>