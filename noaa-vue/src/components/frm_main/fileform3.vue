<template>
    <ul id="tbl_filelist" :id="pass.id">
        <li v-for="(item, i) in viewModel.filelist[pass.no]" :key="i" :id="pass.id+pass.no+i" >
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
                    <input type="file" hidden :id="'uf01'+pass.no+i" :target=i @change="fnSetFileName(i)">
                    <label :for="'uf01'+pass.no+i" class="btn btn-white"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-folder-filled"></use></svg>찾아보기</label>
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
                filelist: [[{seq: 0}],[{seq: 0}],[{seq: 0}],[{seq: 0}],[{seq: 0}],[{seq: 0}],[{seq: 0}],[{seq: 0}],[{seq: 0}],],
                deletefileList: [],
                fileGroup: '',
                no : Number(this.pass.no),
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
            file = $('#'+this.pass.id+this.pass.no+index+' #uf01'+this.pass.no+ index);
            let filename = file.val().split('\\').pop();
            let filetitle = filename.substr(0, filename.lastIndexOf('.'));
            console.log(vm.filelist);
            if(file != undefined) {
                // $('#'+this.pass.id+index+' .upload-name').val(filename);
                // $('#'+this.pass.id+index+' .bf_title').val(filetitle);
                $('#'+this.pass.id+this.pass.no+index+' #filebox').text(filename);
                
                vm.filelist[this.pass.no][index].file = file[0].files[0];
                vm.filelist[this.pass.no][index].file_org_name = filename;
                vm.filelist[this.pass.no][index].file_title = filetitle;

                Axios.post('/filegroup.do').then((response) => {
                    vm.fileGroup = response.data;
                    vt.$emit('filelist', vm);
                });
                vt.$forceUpdate(); 
            }
        },
        fnAddFile: function() {
            let vm = this.viewModel;
            this.viewModel.filelist[vm.no].push({seq: this.viewModel.filelist[vm.no].length});
        },
        fnDeleteFile: function(index) {
            let vt = this;
            let vm = this.viewModel;
            let key = vm.filelist[vm.no][index].file_sn;

            if(confirm("삭제하시겠습니까?")){
                
                if(vm.filelist[vm.no].length > 1) {
                    vm.filelist[vm.no].splice(index, 1);

                    for(let i=0; i<vm.filelist[vm.no].length; i++){
                        vm.filelist[vm.no][i].seq = i;
                    }
                } else {
                    vm.filelist[vm.no] = [{seq: 0},]
                    vm.fileGroup = ''

                    $('#uf01'+vm.no+0).val(null);
                    $('#'+this.pass.id+vm.no+0+' #filebox').text('첨부파일을 추가해 주세요.');
                }

                if(key != undefined){
                    vm.deletefileList.push(key);      
                    vt.$emit('fileDelete', vm);
                }
                
            }
        },
        fnAfterDelete: function(index) {
            let vt = this;
            let vm = this.viewModel;
            if(vm.filelist[vm.no].length > 1) {
                vm.filelist[vm.no].splice(index, 1);
                for(let i=0; i<vm.filelist[vm.no].length; i++){
                    vm.filelist[vm.no][i].seq = i;
                }
            } else {
                $('#'+vt.pass.id+index+' .upload-name, #'+vt.pass.id+index+' .bf_title, #'+vt.pass.id+index+' .upload-hidden').val(null);
                vm.filelist[vm.no] = [[{seq: 0}],[{seq: 0}],[{seq: 0}],[{seq: 0}],[{seq: 0}],[{seq: 0}],[{seq: 0}],[{seq: 0}],[{seq: 0}],],
                vm.fileGroup = ''
            }
            vt.$emit('filelist', vm);
        },
        // fnFileLoad: function(groupid) {
        //     let vt = this;
        //     let vm = this.viewModel;

        //     Axios.post("/filelist.do", {groupid: groupid}).then(function(rs) {//for문?
        //         let filelist = rs.data.filelist;
        //         if(filelist.length>0) {
        //             vm.filelist = filelist;
        //             vm.fileGroup = rs.data.file_grp_id;
        //             for(let i=0; i<rs.data.filelist.length; i++) {
        //                 for(let j=0; j<rs.data.filelist[i].length; j++) {
        //                 vm.filelist[i][j].seq = j;
        //                 }
        //             }
        //         } else {
        //             vm.filelist = [[{seq: 0}],[{seq: 0}],[{seq: 0}],[{seq: 0}],[{seq: 0}],[{seq: 0}],[{seq: 0}],[{seq: 0}],[{seq: 0}],],
        //             vm.fileGroup = ''
        //         }
        //         vt.$emit('filelist', vm);
        //     });
        // },
        fnMoveFile: function(index, ud) {
            let vm = this.viewModel;
            let {objFile, objTargetFile} = new FormData();
            

            if((index!=0 && ud==-1) || (index!=vm.filelist[vm.no].length-1 && ud==1)) {
                objFile = vm.filelist[vm.no][index].file;
                objTargetFile = vm.filelist[vm.no][index+ud].file;

                let obj = JSON.parse(JSON.stringify(vm.filelist[vm.no][index]));
                let objTarget = JSON.parse(JSON.stringify(vm.filelist[vm.no][index+ud]));
    
                vm.filelist[vm.no][index] = objTarget;
                vm.filelist[vm.no][index+ud] = obj;
                
                vm.filelist[vm.no][index].file = objTargetFile;
                vm.filelist[vm.no][index+ud].file = objFile;
                
                $('#'+this.pass.id+vm.no+index+' #filebox').text(objTarget.file_org_name == undefined ? objTarget.orgnl_file_nm : objTarget.file_org_name);
                $('#'+this.pass.id+vm.no+(index+ud)+' #filebox').text(obj.file_org_name == undefined ? obj.orgnl_file_nm : obj.file_org_name);

            }
        },
        fnFileLoadList: function(list) {
            let vt = this;
            let vm = this.viewModel;
            if(list.length>0) {
                vm.filelist = list;
                // vm.fileGroup = rs.data.file_grp_id;
                for(let i=0; i<vm.filelist.length; i++) {
                    for(let j=0; j<vm.filelist[i].length; j++) {
                        vm.filelist[i][j].seq = j;
                        vt.$forceUpdate();
                    }
                    let data = new FormData;
                        data = JSON.parse(JSON.stringify(vm.filelist[i]));
                        document.getElementById('our_'+i+'').value = data;
                        console.log('#our_'+i+'');
                        console.log($('#our_'+i+'').val());
                }
            } else {
                vm.filelist = [[{seq: 0}],[{seq: 0}],[{seq: 0}],[{seq: 0}],[{seq: 0}],[{seq: 0}],[{seq: 0}],[{seq: 0}],[{seq: 0}],],
                vm.fileGroup = ''
            }
            vt.$emit('filelist', vm);
            console.log(vm.filelist);
            vt.$forceUpdate(); 
        },
        
    }
}
</script>