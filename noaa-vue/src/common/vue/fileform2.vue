<template>
    <!-- <ul id="tbl_filelist" class="file_upload_table">
        <li v-for="(item, i) in viewModel.filelist" :key="i" :id="pass.id+i"> -->
            <!-- <div class="file-group vam">
                <input type="text" class="bf_title w200" placeholder="제목" title="파일명" v-model="viewModel.filelist[i].file_title">
                <div class="filebox">
                    <div class="filebox_input">
                        <input class="upload-name" disabled="disabled" placeholder="Drag And Drop File Here" title="원본파일명" v-model="viewModel.filelist[i].orgnl_file_nm" @drop.prevent="fnDropInputTag" @dragover.prevent="fnDragOver" :target=i>
                        <label><input type="file" :id="'file'+i" class="upload-hidden" :target=i @change="fnSetFileName(i)" title="파일" :accept="(pass.id == 'ptwRefFile') ? 'application/pdf' : ''">찾아보기</label>
                    </div>
                </div>
            </div> -->
    <ul id="tbl_filelist" :id="pass.id">
        <li v-for="(item, i) in viewModel.filelist" :key="i" :id="pass.id+i" :class="{'mt5':i!=0}">
            <div class="upload_file_wrap">
                <div class="upload_file">
                    <label class="btn filebox" :id="pass.id+'_filebox'" :for="pass.id+'01'+i" @drop.prevent="fnDropInputTag" @dragover.prevent="fnDragOver" :target="i">
                        <template v-if="item.orgnl_file_nm != null">
                            {{item.orgnl_file_nm == null ? '첨부파일을 마우스로 드래그해서 추가해 주세요.' : item.orgnl_file_nm}}
                        </template>
                        <template v-else>
                            {{item.file_org_name == null ? '첨부파일을 마우스로 드래그해서 추가해 주세요.' : item.file_org_name}}
                        </template>
                    </label>
                    <input type="file" :accept="pass.type == 'video' ? '.ogm, .wmv, .mpg, .webm, .ogv, .mov, .asx, .mpeg, .mp4, .m4v, .avi, .mkv, .mts' : ''" hidden :id="pass.id+'01'+i" :target=i @change="fnSetFileName(i)">
                    <label :for="pass.id+'01'+i" class="btn btn-white"><svg class="icon"><use xlink:href="/img/symbol-defs.svg#icon-folder-filled"></use></svg>찾아보기</label>
                </div>
                <div class="icon_box">
                    <a href="#" class="btn btn-icon"><svg class="icon" @click="fnAddFile()"><use xlink:href="/img/symbol-defs.svg#icon-add-circle"></use></svg></a>
                    <a href="#" class="btn btn-icon"><svg class="icon" @click="fnDeleteFile(i)"><use xlink:href="/img/symbol-defs.svg#icon-circle-minus"></use></svg></a>
                </div>
                <div class="icon_box">
                    <a href="#" class="btn btn-icon"><svg class="icon" @click="fnMoveFile(i, -1)"><use xlink:href="/img/symbol-defs.svg#icon-arrow-up-circle"></use></svg></a>
                    <a href="#" class="btn btn-icon"><svg class="icon" @click="fnMoveFile(i, 1)"><use xlink:href="/img/symbol-defs.svg#icon-arrow-down-circle"></use></svg></a>
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
                filelist: [{seq: 0, orgnl_file_nm: null}],
                deletefileList: [],
                fileGroup: '',
                idx: this.pass.idx,
            },
        }
    },
    mounted: function() {
        let vm = this;
    },
    methods: {
    	fnSetFileName: function(index) {
            let vt = this;
            let vm = this.viewModel;
            let file = new FormData();
            file = $('#'+this.pass.id+index+' #'+this.pass.id+'01'+ index);
            
            let fileVideoType = ['ogm', 'wmv', 'mpg', 'webm', 'ogv', 'mov', 'asx', 'mpeg', 'mp4', 'm4v', 'avi', 'mkv', 'mts'];
            
            let filename = file.val().split('\\').pop();
            let filetitle = filename.substr(0, filename.lastIndexOf('.'));
            let fileExtn = filename.substr(filename.lastIndexOf('.')+1, filename.length).toLowerCase();
            
            if((fileVideoType.indexOf(fileExtn) > -1 && vt.pass.type == 'video') || vt.pass.type != 'video'){
                if(file != undefined) {
                    // $('#'+this.pass.id+index+' .upload-name').val(filename);
                    // $('#'+this.pass.id+index+' .bf_title').val(filetitle);

                    let maxSize = 0;
                    let type = "";
                    if(vt.pass.type == 'video'){
                        maxSize = 5 * 1024 * 1024 * 1024;
                        type = "video";
                    }else{
                        maxSize = 1 * 1024 * 1024 * 1024;
                    }

                    if(file[0].files[0].size > maxSize){
                        if(type == "video"){
                            alert("첨부파일 사이즈는 5GB 이내로 등록 가능합니다.");
                        }else{
                            alert("첨부파일 사이즈는 1GB 이내로 등록 가능합니다.");
                        }
                        return false;
                    }else{
                        // $('#'+this.pass.id+index+' #'+this.pass.id+'_filebox').text(filename);

                        vm.filelist[index].file = file[0].files[0];

                        vm.filelist[index].orgnl_file_nm = filename;
                        vm.filelist[index].file_title = filetitle;

                        if(vm.fileGroup == '') {
                            Axios.post('/filegroup.do').then((response) => {
                                vm.fileGroup = response.data;
                            });
                        }
                        
                        vt.$set(vm.filelist[index], 'orgnl_file_nm', vm.filelist[index].orgnl_file_nm);

                        vt.$emit('filelist', vm);
                    }   
                }
            }else{
                alert("올바르지 않은 확장자 입니다. 확인 후 등록 해 주세요.");
            }
        },
        fnAddFile: function() {
            this.viewModel.filelist.push({seq: this.viewModel.filelist.length, 'orgnl_file_nm': null});
        },
        fnDeleteFile: function(index) {
            let vt = this;
            let vm = this.viewModel;
            let key = vm.filelist[index].file_sn;

            if(confirm("삭제하시겠습니까?")){
                
                if(vm.filelist.length > 1) {
                    vm.filelist.splice(index, 1);

                    for(let i=0; i<vm.filelist.length; i++){
                        vm.filelist[i].seq = i;
                    }
                } else {
                    vm.filelist = [{seq: 0, 'orgnl_file_nm':null},]
                    vm.fileGroup = ''
                    
                    $('#'+this.pass.id+'010').val(null);
                    
                    vt.$set(vm.filelist[0], 'orgnl_file_nm', vm.filelist[0].orgnl_file_nm);
                    // $('#'+this.pass.id+0+' #'+this.pass.id+'_filebox').text("첨부파일을 마우스로 드래그해서 추가해 주세요.");
                    // $('#uf01' + 0).val(null);
                    // $('#'+this.pass.id+0+' #filebox').text("첨부파일을 마우스로 드래그해서 추가해 주세요.");
                }

                if(key != undefined){
                    vm.deletefileList.push(key);
                    vt.$emit('fileDelete', vm);
                }else{
                    vt.$emit('fileDelete', vm);
                }
            }
        },
        fnAfterDelete: function(index) {
            let vt = this;
            let vm = this.viewModel;
            if(vm.filelist.length > 1) {
                vm.filelist.splice(index, 1);
                for(let i=0; i<vm.filelist.length; i++){
                    vm.filelist[i].seq = i;
                }
            } else {
                $('#'+vt.pass.id+index+' .upload-name, #'+vt.pass.id+index+' .bf_title, #'+vt.pass.id+index+' .upload-hidden').val(null);
                vm.filelist = [{seq: 0, 'orgnl_file_nm': null},]
                vm.fileGroup = ''
            }
            vt.$emit('filelist', vm);
        },
        fnFileLoad: function(groupid) {
            let vt = this;
            let vm = this.viewModel;

            Axios.post("/filelist", {groupid: groupid}).then(function(rs) {
                let filelist = rs.data.filelist;
                if(filelist.length>0) {
                    vm.filelist = filelist;
                    vm.fileGroup = rs.data.file_grp_id;
                    for(let i=0; i<rs.data.filelist.length; i++) {
                        vm.filelist[i].seq = i;
                    }
                } else {
                    vm.filelist = [{seq: 0, 'orgnl_file_nm': null},]
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

                // $('#'+this.pass.id+index+' #filebox').text(objTarget.file_org_name == undefined ? objTarget.orgnl_file_nm : objTarget.file_org_name);
                // $('#'+this.pass.id+(index+ud)+' #filebox').text(obj.file_org_name == undefined ? obj.orgnl_file_nm : obj.file_org_name);

                $('#'+this.pass.id+index+' #'+this.pass.id+'_filebox').text(objTarget.orgnl_file_nm == undefined ? '첨부파일을 마우스로 드래그해서 추가해 주세요.' : objTarget.orgnl_file_nm);
                $('#'+this.pass.id+(index+ud)+' #'+this.pass.id+'_filebox').text(obj.orgnl_file_nm == undefined ? '첨부파일을 마우스로 드래그해서 추가해 주세요.' : obj.orgnl_file_nm);
                $('#'+this.pass.id+index+' #filebox').text(objTarget.orgnl_file_nm == undefined ? '첨부파일을 마우스로 드래그해서 추가해 주세요' : objTarget.orgnl_file_nm);
                $('#'+this.pass.id+(index+ud)+' #filebox').text(obj.orgnl_file_nm == undefined ? '첨부파일을 마우스로 드래그해서 추가해 주세요' : obj.orgnl_file_nm);

            }
        },
        fnDropInputTag: function(e) {
            let vt = this;
            let vm = this.viewModel;
            let dataTransfer = new DataTransfer();

            let fileVideoType = ['ogm', 'wmv', 'mpg', 'webm', 'ogv', 'mov', 'asx', 'mpeg', 'mp4', 'm4v', 'avi', 'mkv'];

            Array.from(e.dataTransfer.files).forEach(file => {
                dataTransfer.items.add(file);
            });
            let targetIndex = e.target.getAttribute("target");
            let files = $(`input[type=file][target=${targetIndex}]`)[0];

            files = dataTransfer.files;

            for(let i=0; i<files.length; i++){
                let file = files[i];
                let fileName = file.name;
                let fileExtn = fileName.substr(fileName.lastIndexOf('.')+1, fileName.length).toLowerCase();

                if((fileVideoType.indexOf(fileExtn) > -1 && vt.pass.type == 'video') || vt.pass.type != 'video'){

                    if(file != undefined) {
                        let maxSize = 0;
                        let type = "";
                        if(vt.pass.type == 'video'){
                            maxSize = 5 * 1024 * 1024 * 1024;
                            type = "video";
                        }else{
                            maxSize = 1 * 1024 * 1024 * 1024;
                        }

                        if(file.size > maxSize){
                            if(type == "video"){
                                alert("첨부파일 사이즈는 5GB 이내로 등록 가능합니다.");
                            }else{
                                alert("첨부파일 사이즈는 1GB 이내로 등록 가능합니다.");
                            }
                            return false;
                        }else{
                            if(i != 0){
                                vt.viewModel.filelist.splice((Number(targetIndex) + Number(i)), 0, {})
                            }else{
                                if(vt.viewModel.filelist[Number(targetIndex)].orgnl_file_nm != undefined){
                                    targetIndex++;
                                    vt.viewModel.filelist.splice((Number(targetIndex)), 0, {})
                                }
                            }
                            
                            $('li#'+this.pass.id+(Number(targetIndex) + i)+' label#'+this.pass.id+'_filebox').text(fileName);

                            vm.filelist[(Number(targetIndex) + i)].file = file;
                            vm.filelist[(Number(targetIndex) + i)].orgnl_file_nm = fileName;
                            vm.filelist[(Number(targetIndex) + i)].file_title = fileName.substr(0, fileName.lastIndexOf('.'));

                            if(vm.fileGroup == '') {
                                Axios.post('/filegroup.do').then((response) => {
                                    vm.fileGroup = response.data;
                                });
                            }
                            
                            vt.$emit('filelist', vm);
                            vt.$set(vm.filelist, (Number(targetIndex) + i), vm.filelist[(Number(targetIndex) + i)]);
                        }   
                    }
                }else{
                    alert("올바르지 않은 확장자 입니다. 확인 후 등록 해 주세요.");
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

                    vm.$set(vm.viewModel.filelist[i], 'orgnl_file_nm', vm.viewModel.filelist[i].orgnl_file_nm);
                }
            } else {
                vm.viewModel.filelist = [{seq: 0},]
                vm.viewModel.fileGroup = ''

                vm.$set(vm.viewModel.filelist[0], 'orgnl_file_nm', vm.viewModel.filelist[0].orgnl_file_nm);
                // $('#'+this.pass.id+0+' #'+this.pass.id+'_filebox').text('첨부파일을 마우스로 드래그해서 추가해 주세요.');
            }
        },
    }
}
</script>