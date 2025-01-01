<template>
  <div class="upload_file">
    <div class="btn filebox" id="fileName" @drop.prevent="fnDropInputTag" @dragover.prevent="fnDragOver">
        첨부파일을 마우스로 드래그해서 추가해 주세요.
    </div>
    <input type="file" hidden id="uf01" @change="fnSetFileName();">
    <label for="uf01" class="btn btn-white"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-folder-filled"></use></svg>찾아보기</label>
    <a href="#" class="btn btn-white" @click="excel_import();"><i class="icon_excel"></i>엑셀업로드</a>
  </div>
</template>
<script>
  import "es6-promise/auto";
  import Vue from "vue";
  import Axios from "axios";
  export default{
    props:['pass'],
    mounted: function() {
      // console.log(this.pass)
    },
    data: function() {
      return {
        viewModel: {
          filelist:{},
          fileGroup:'',
        },
      };
    },
    methods:{
      fnSetFileName: function(index) {
        let vt = this;
        let vm = this.viewModel;
        let file = new FormData();
        file = $('#uf01');

        if(file[0].files.length < 1){

        }else{
          let filename = file.val().split('\\').pop();
          let filetitle = filename.substr(0, filename.lastIndexOf('.'));
          let fileExt = filename.split('.').pop().toLowerCase();
          if(fileExt != 'xlsx' && fileExt != 'xls'){
              alert("엑셀 파일만 등록해주세요.");
              return false;
          }else{
            $('#fileName').text(filename);

            vm.filelist.file = file[0].files[0];
            vm.filelist.file_org_name = filename;
            vm.filelist.file_title = filetitle;

            vt.$emit('uploadfilelist', vm);
          }
        }
      },
      excel_import:function(){
        let vt = this;
        let vm = this.viewModel;
        let frm = new FormData();

        if(vm.filelist != null && vm.filelist.file != undefined) {
          frm.append("fileTitle", vm.filelist.file_title);
          frm.append("uploadFiles", vm.filelist.file);
          frm.append("gbn", vt.pass.id);

          Axios.post('/poi/excelupload.do', frm, {headers: {'Content-Type': 'multipart/form-data'}}).then((response) => {
            //console.log(response.data)
            if(response.data == 1){
              //초기화
              vm.filelist = null;
              $('#fileName').text('첨부파일을 마우스로 드래그해서 추가해 주세요.');
              
              vt.$emit('uploadfilelist', vm);
              alert("성공적으로 업로드 하였습니다.");
              vt.$parent.fnReload();
            }else{
              alert("업로드에 실패하였습니다.\n관리자에게 문의하세요.");
            }
          });
        }else{
          alert("업로드할 파일을 선택해주세요.");
        }
        
      },
      fnDropInputTag: function(e) {
        let vt = this;
        let vm = this.viewModel;
        let dataTransfer = new DataTransfer();

        // let targetFile = $('#excel_file')[0];
        let targetFile = e.dataTransfer.files[0];

        let filename = targetFile.name;
        let filetitle = filename.substr(0, filename.lastIndexOf('.'));
        let fileExt = filename.split('.').pop().toLowerCase();

        if(fileExt != 'xlsx' && fileExt != 'xls'){
          alert("엑셀 파일만 등록해주세요.");
          return false;
        }else{
          $('#fileName').text(filename);
          vm.filelist.file = targetFile;
          vm.filelist.file_org_name = filename;
          vm.filelist.file_title = filetitle;
          vt.$emit('uploadfilelist', vm);
        }
    },
    fnDragOver: function(event){
        event.stopPropagation();
        event.preventDefault();
    },
    }
  }
</script>