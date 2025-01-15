<template>
	<modal :pass="{popupTitle: '현장조사 첨부파일'}">
		<template v-slot:contents>
			<div v-if="acdnt_sign!=5">
				<div>
					<fileform @filelist="fnFilelist"  @fileDelete="fnFileDelete" :pass="{id:'our_report'}" ref="files"></fileform>
				</div>
				<div class="btn-group">
					<div class="right_side">
						<a href="javascript:void(0);" class="btn btn-purple" @click.prevent="fnFileSave()">등록</a>
					</div>
				</div>
			</div>
			<div>
				<table class="table">
						<caption>첨부파일</caption>
						<thead>
							<tr>
								<th scope="col">제목</th>
								<th scope="col">용량</th>
								<th scope="col">등록날짜</th>
								<th scope="col">다운로드</th>
								<th scope="col">삭제</th>
							</tr>
						</thead>
						<tbody>
							<template v-if="fileLoadList.length != 0">
								<tr v-for = "(item, i) in fileLoadList" :key="i">
									<td scope="row">{{item.orgnl_file_nm}}</td>
									<td>{{item.file_sz}}</td>
									<td>{{(item.reg_dt).substring(0,16)}}</td>
									<td>
										<button class="btn btn-small btn-default" @click="fnFileDown(item, '1')"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-download"></use></svg>다운</button>
									</td>
									<td>
										<button class="btn btn-small btn-default" @click="fnFileDrop(item, i)"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-caution"></use></svg>삭제</button>
									</td>
								</tr>
							</template>
							<template v-if="fileLoadList[0] == null">
								<tr><td colspan="5" >파일이 없습니다.</td></tr>
							</template>
					</tbody>
				</table>
			</div>
		</template>
	</modal>
</template>

<script>
import 'es6-promise/auto'
import Vue from 'vue'
import Axios from 'axios'
import Modal from './modal.vue'
import Pager from "../../paging.vue";
import fileform from "../../../common/vue/fileform2.vue";

export default{
	props: ['pass'],
    components: {
        Pager, Modal, fileform
    },
    data: function () {
        return {
			acdnt_sn : 0,
			acdnt_sign : 0,
			fileModal : false,
			imgModal : false,
			fileLoadList:[],
			viewModel:{
				userInfo:{},
				deletefileList:[],
				filelist:[],
				uploadImageSrc:[],
			}
        }
    },
	mounted: function () {
		let vt = this;
		vt.imgModal = false;
		vt.fileModal = false;
	},
    methods: {
		fnInit: function(value, sn, sign) {
			let vt = this;
			vt.viewModel.userInfo = vt.$store.state.global.userInfo;
			if(value == 'file'){
				vt.fileModal = true;
				vt.imgModal = false;
			}
			vt.acdnt_sn = sn;
			vt.acdnt_sign = sign;
			Modal.methods.fnInit(value, sn);
			vt.$nextTick(function() {
				vt.fnList(value, sn);
			});
		},
		fnList:function(value, sn){
			let vt = this;
			Axios.post("/selectOursAcdtCsAttachlist.do", {file_se:value, sn:sn}).then(function(response) {
				console.log(response);
				console.log(vt.pass);
				vt.fileLoadList = response.data.fileList;
				for(let i=0; i<response.data.fileList.length; i++){
					if(response.data.fileList[i].se == '1'){
						vt.viewModel.filelist = response.data.fileList;
					}
				}
			}).catch(function(ex) {
				console.log("error"+ex);
			});
		},
		// fnFilter:function(){
		// 	let vm = this;
		// 	//일치하는 항목 필터
		// 	vm.bplcList = vm.bplcOrgList.filter(data => data.bplc_nm.includes(vm.search));
		// },
		fnFilelist:function(vm){
			let vt = this;
			vt.viewModel.filelist = vm.filelist;
			vt.viewModel.fileGroup = vm.fileGroup;
		},
		fnFileDelete: function(vm){
			let vt = this;
			vt.viewModel.deletefileList = vm.deletefileList;
		},
		fnFileSave:function(){
			let vt = this;
			let frm = new FormData();
			for(let i=0; i<vt.viewModel.filelist.length; i++) {
				let key = vt.viewModel.filelist[i].file_seq;
				if(vt.viewModel.filelist[i].file != null) {
					frm.append("fileTitle", vt.viewModel.filelist[i].file_title);
					frm.append("uploadFiles", vt.viewModel.filelist[i].file);
					if(vt.viewModel.filelist[i].file_sn){
						frm.append("deleteFiles", vt.viewModel.filelist[i].file_sn);
					}
					frm.append("key", 0)
				} else {
					if(vt.viewModel.filelist[i].file == undefined){
						
					}else{
						frm.append("fileTitle", vt.viewModel.filelist[i].file_title);
						frm.append("key", key)
					}
				}
			}
			// console.log(vt.viewModel.filelist);
			// console.log(vt.viewModel.deletefileList);
			for(let i=0; i<vt.viewModel.deletefileList.length; i++){
				frm.append("deleteFiles", vt.viewModel.deletefileList[i]);
			}
			
			let data = {
				reg_id: vt.viewModel.userInfo.user_id,
				acdnt_sn : vt.acdnt_sn,
				file_img_se : 'file'
			}

			frm.append('data', new Blob([ JSON.stringify(data) ], {type : "application/json"}));
			
			frm.append("filePath", "oursAcdt");
			if(vt.viewModel.deletefileList.length <= 0){
				Axios.post("/insertFileOursAcdtCs.do", frm).then(function(response) {
					if(response.data == 1){
						alert("저장되었습니다.");
						vt.fnClose();
					}
				}).catch(function(ex) {
					console.log("error"+ex);
				});
			}if(vt.viewModel.deletefileList.length > 0 || vt.fileLoadList > 0){
				Axios.post("/updateFileOursAcdtCs.do", frm).then(function(response) {
					if(response.data == 1){
						alert("수정되었습니다.");
						vt.fnClose();
					}
				}).catch(function(ex) {
					console.log("error"+ex);
				});
			}
		},
		
		fnFileDown:function(item, type){//type : 1=file, 2=img
			let vt = this;
			let send = {
				se: type,
				sn: vt.acdnt_sn,
				file_sn: item.file_sn,
				gbn:'oursAcdtCs'
			}
			$(".loading").show();
			$("#mask").show();
			Axios.post("/download.do",send,{responseType: "blob",}
			).then(function(e) {
				const url = window.URL.createObjectURL(new Blob([e.data], { type: e.headers["content-type"] }))
				const link = document.createElement("a")
				link.href = url
				link.download = item.orgnl_file_nm
				link.click()
				window.URL.revokeObjectURL(url)
			}).then(function(){
				$(".loading").hide();
				$("#mask").hide();
			});
				
		},
		fnFileDrop:function(item, index){
			if(confirm("삭제하시겠습니까?")){
				let vt = this;
				let key = vt.viewModel.filelist[index].file_sn;
				if(vt.viewModel.filelist.length > 1) {
					vt.viewModel.filelist.splice(index, 1);
					for(let i=0; i<vt.viewModel.filelist.length; i++){
						vt.viewModel.filelist[i].seq = i;
					}
				}
				if(key != undefined){
					vt.viewModel.deletefileList.push(key);      
					// vt.$emit('fileDelete', vm);
				}
				vt.fnFileSave();
			}
		},
		fnClose:function(){
			let vt = this;
            vt.$parent.fnList();
			vt.$parent.rtptFileModal = false;
			vt.$parent.fileModal = false;
			vt.$parent.imgModal = false;
        },
    }
}
</script>