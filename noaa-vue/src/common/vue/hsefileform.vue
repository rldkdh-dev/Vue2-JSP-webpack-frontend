<template>
    <!-- <ul id="tbl_filelist" class="file_upload_table">
        <li v-for="(item, i) in viewModel.filelist" :key="i" :id="pass.id+i"> -->
            <!-- <div class="file-group vam">
                <input type="text" class="bf_title w200" placeholder="제목" title="파일명" v-model="viewModel.filelist[i].file_title">
                <div class="filebox">
                    <div class="filebox_input">
                        <input class="upload-name" disabled="disabled" placeholder="Drag And Drop File Here" title="원본파일명" v-model="viewModel.filelist[i].file_org_name" @drop.prevent="fnDropInputTag" @dragover.prevent="fnDragOver" :target=i>
                        <label><input type="file" :id="'file'+i" class="upload-hidden" :target=i @change="fnSetFileName(i)" title="파일" :accept="(pass.id == 'ptwRefFile') ? 'application/pdf' : ''">찾아보기</label>
                    </div>
                </div>
            </div> -->
    <ul id="tbl_filelist">
        <li v-for="(item, i) in viewModel.filelist" :key="i" :id="pass.id+i">
            <div class="upload_file_wrap">
                <div class="upload_file">
                    <div class="btn filebox" id="filebox"  @drop.prevent="fnDropInputTag" @dragover.prevent="fnDragOver" :target="i">
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
</template>
<script>
import 'es6-promise/auto'
import Vue from 'vue'
import Axios from 'axios'

export default{
    props: ['pass'],
    data: function () {
        return {
            viewModel: {
                filelist: [{seq: 0}],
                deletefileList: [],
                fileGroup: ''
            }
        }
    },
    mounted: function() {
    },
    methods: {
    	fnSetFileName: function(index) {
            let vt = this;
            let vm = this.viewModel;
            let file = new FormData();
            file = $('#'+this.pass.id+index+' #uf01'+ index);
            let filename = file.val().split('\\').pop();
            let filetitle = filename.substr(0, filename.lastIndexOf('.'));
            if(file != undefined) {
                // $('#'+this.pass.id+index+' .upload-name').val(filename);
                // $('#'+this.pass.id+index+' .bf_title').val(filetitle);
                let maxSize = 1 * 1024 * 1024 * 1024;
                
                if(file[0].files[0].size > maxSize){
                    alert("첨부파일 사이즈는 1GB 이내로 등록 가능합니다.");
                    return false;
                }else{
                    $('#'+this.pass.id+index+' #filebox').text(filename);
                    
                    vm.filelist[index].file = file[0].files[0];
                    vm.filelist[index].orgnl_file_nm = filename;
                    vm.filelist[index].file_title = filetitle;
                    if(vm.fileGroup == '') {
                        Axios.post('/filegroup.do').then((response) => {
                            vm.fileGroup = response.data;
                            vt.$emit('filelist', vm);
                        });
                    }
                }
            }
        },
        fngetFileInfo: function() {
            let vt = this;
            let vm = this.viewModel;
            let frm = new FormData();
            frm.append("fileGroup", vm.fileGroup);
            for(let i=0; i<vm.filelist.length; i++) {
                let key = vm.filelist[i].file_sn;
                if(vm.filelist[i].file != null) {
                    frm.append("fileTitle", vm.filelist[i].orgnl_file_nm);
                    frm.append("uploadFiles", vm.filelist[i].file);
                    frm.append("key", 0)
                } else {
                    if(vm.filelist[i].file == undefined){
                        
                    }else{
                        frm.append("fileTitle", vm.filelist[i].orgnl_file_nm);
                        frm.append("key", key)
                    }
                }
            }
            
            for(let i=0; i<vm.deletefileList.length; i++){
                frm.append("deleteFiles", vm.deletefileList[i]);
            }
        },
    	fnInsertFile: function(user_id,bplc_sn) {
            let vt = this;
            let vm = this.viewModel;
            let frm = new FormData();
            
            frm.append("fileGroup", vm.fileGroup);
            frm.append("user_id",user_id);
            frm.append("bplc_sn",bplc_sn);
            frm.append("mode","F");
            vt.fnAfterDelete();
            for(let i=0; i<vm.filelist.length; i++) {
                frm.append("fileTitle", vm.filelist[i].orgnl_file_nm);
                let key = vm.filelist[i].acdnt_mng_sn == null ? vm.filelist[i].seq : vm.filelist[i].acdnt_mng_sn;
                if(vm.filelist[i].file != null) {
                    frm.append("uploadFiles", vm.filelist[i].file);
                    vm.filelist[i].file_sn == undefined ? 0 : frm.append("sn",vm.filelist[i].file_sn);
                    frm.append("key", 0)
                } else {
                    frm.append("key", key);
                    frm.append("sn",0);
                }
            }
            var bool = false;
            try {
                Axios.post('/hse/file/upload.do', frm, {headers: {'Content-Type': 'multipart/form-data'}}).then((response) => {
                    // console.log(response.data);
                });
            }catch(ex){
                console.error(ex);
            }finally{
                bool = true;
            }



            return bool;
        },
        fnAddFile: function() {
            this.viewModel.filelist.push({seq: this.viewModel.filelist.length});
        },
        fnDeleteFile: function(index) {
            let vt = this;
            let vm = this.viewModel;
            let key = vm.filelist[index].seq;
            let file_sn = vm.filelist[index].file_sn;
            // console.log(vm.filelist);
            if(confirm("삭제하시겠습니까?")){
                if(vm.filelist.length > 1) {
                    vm.filelist.splice(index, 1);

                    for(let i=0; i<vm.filelist.length; i++){
                        vm.filelist[i].seq = i;
                    }
                } else {
                    vm.filelist = [{seq: 0},]
                    vm.fileGroup = '';
                    vt.$parent.viewModel.fileGroup = '';

                    
                    $('#uf01' + index).val(null);
                    $('#'+this.pass.id+index+' #filebox').text("첨부파일을 추가해 주세요.");
                }


                if(key != undefined){
                    vm.deletefileList.push(file_sn);    
                }
            }
        },
        fnAfterDelete: function() {
            let vm = this;
            // console.log(vm.viewModel.deletefileList);
            if(vm.viewModel.deletefileList.length != 0){
                for(var i=0; i<vm.viewModel.deletefileList.length; i++){
                    Axios.post("/hse/deletefile.do",{file_sn:vm.viewModel.deletefileList[i]}).then(function(){})
                }
            }
        },
        fnFileLoad: function(data) {
            let vt = this;
            let vm = this.viewModel;
            Axios.post("/filelist.do", data).then(function(rs) {
                let filelist = rs.data.filelist;
                if(filelist.length>0) {
                    vm.filelist = filelist;
                    vm.fileGroup = rs.data.acdnt_mng_sn;
                    for(let i=0; i<rs.data.filelist.length; i++) {
                        vm.filelist[i].seq = i;
                    }
                } else {
                    vm.filelist = [{seq: 0},]
                    vm.fileGroup = ''
                }
                vt.$emit('filelist', vm);
            });
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
                $('#'+this.pass.id+index+' #filebox').text(objTarget.orgnl_file_nm == undefined ? '첨부파일을 추가해 주세요.' : objTarget.orgnl_file_nm);
                $('#'+this.pass.id+(index+ud)+' #filebox').text(obj.orgnl_file_nm == undefined ? '첨부파일을 추가해 주세요.' : obj.orgnl_file_nm);

            } 
        },
        fnDropInputTag: function(e) {
            let vt = this;
            let vm = this.viewModel;
            let dataTransfer = new DataTransfer();
            Array.from(e.dataTransfer.files).forEach(file => {
                dataTransfer.items.add(file);
            });
            const targetIndex = e.target.getAttribute("target");
            let files = $(`input[type=file][target=${targetIndex}]`)[0];
            files = dataTransfer.files;

            for(let i=0; i<files.length; i++){
                let file = files[i];

                if(i != 0){
                    vt.viewModel.filelist.splice((Number(targetIndex) + Number(i)), 0, {})
                }

                if(file != undefined) {
                    let maxSize = 1 * 1024 * 1024 * 1024;

                    if(file.size > maxSize){
                        alert("첨부파일 사이즈는 1GB 이내로 등록 가능합니다.");
                        return false;
                    }else{
                        let fileName = file.name;
                        
                        $('#'+this.pass.id+((Number(targetIndex) + i))+' #filebox').text(fileName);

                        vm.filelist[(Number(targetIndex) + i)].file = file;
                        vm.filelist[(Number(targetIndex) + i)].orgnl_file_nm = fileName;
                        vm.filelist[(Number(targetIndex) + i)].file_title = fileName.substr(0, fileName.lastIndexOf('.'));

                        if(vm.fileGroup == '') {
                        Axios.post('/filegroup.do').then((response) => {
                            vm.fileGroup = response.data;
                        });

                        vt.$emit('filelist', vm);
                    }
                    }   
                }
            }
        },
        fnDragOver: function(event){
            event.stopPropagation();
            event.preventDefault();
        },
        fnFileLoadList: function(list) {
            let vm = this;

            if(list.length>0) {
                vm.viewModel.filelist = list;
                // vm.fileGroup = rs.data.file_grp_id;
                for(let i=0; i<vm.viewModel.filelist.length; i++) {
                    vm.viewModel.filelist[i].seq = i;
                }
            } else {
                vm.viewModel.filelist = [{seq: 0},]
                vm.viewModel.fileGroup = ''
            }
        },
    }
}
</script>