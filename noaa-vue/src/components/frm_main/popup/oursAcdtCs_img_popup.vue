<template>
	<modal :pass="{popupTitle: '사고 관련 사진'}">
		<template v-slot:contents>
			<div v-if="acdnt_sign!=5">
				<imgsfileform :ref="'imgsfiles'" :pass="{id:'oursAcdtCs', gbn:'oursAcdtCs'}" @filelist="fnImgFileList" @fileDelete="fnImgFileDelete"></imgsfileform>
			</div>
			<div v-else>
				<imgsfileform :ref="'imgsfiles'" :pass="{id:'oursAcdtCs', gbn:'oursAcdtCs', mode:'view'}" @filelist="fnImgFileList" @fileDelete="fnImgFileDelete"></imgsfileform>
			</div>
			<div class="btn-group" v-if="acdnt_sign!=5">
				<div class="right_side">
					<a href="javascript:void(0);" class="btn btn-purple" @click="fnImgSave()">등록</a>
				</div>
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
import imgsfileform from '../../../common/vue/imgsfileform2.vue';

export default{
	props: ['pass'],
    components: {
        Pager, Modal,  imgsfileform
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
				imgList:[],
				deleteImgList:[],
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
			vt.fileLoadList = [];
			
			vt.viewModel.userInfo = vt.$store.state.global.userInfo;
			if(value == 'img'){
				vt.imgModal = true;
				vt.fileModal = false;
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
				vt.fileLoadList = response.data.fileList;
				if(response.data.fileList.length == 0){
					vt.$refs.imgsfiles.fnFileLoadList(vt.fileLoadList);
				}else{
					if(response.data.fileList.length > 0){
						for(let i=0; i<response.data.fileList.length; i++){
							if(response.data.fileList[i].se == '2'){
								vt.$refs.imgsfiles.fnFileLoadList(vt.fileLoadList);
							}
						}
					}
				}
				vt.$forceUpdate(); 
			}).catch(function(ex) {
				console.log("error"+ex);
			});
		},
		fnImgFileList:function(vm){
			let vt = this;
			vt.viewModel.imgList = vm.viewModel.filelist;
		},
		fnImgFileDelete:function(vm){
			let vt = this;
			vt.viewModel.deleteImgList = vm.viewModel.deletefileList;
		},
		fnImgSave:function(){
			let vt = this;
			let frm = new FormData();

			for(let i=0; i<vt.viewModel.imgList.length; i++) {
				let key = vt.viewModel.imgList[i].file_seq;
				if(vt.viewModel.imgList[i].file != null) {
					frm.append("uploadFiles", vt.viewModel.imgList[i].file);
					frm.append("fileTitle", vt.viewModel.imgList[i].file.name);
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

			for(let i=0; i<vt.viewModel.deleteImgList.length; i++){
				frm.append("deleteFiles", vt.viewModel.deleteImgList[i]);
			}
			let data = {
				reg_id: vt.viewModel.userInfo.user_id,
				acdnt_sn : vt.acdnt_sn,
				file_img_se : 'img'
			}
			frm.append('data', new Blob([ JSON.stringify(data) ], {type : "application/json"}));
			
			frm.append("filePath", "oursAcdt");
			if(vt.viewModel.deleteImgList.length <= 0){
				Axios.post("/insertFileOursAcdtCs.do", frm).then(function(response) {
					if(response.data == 1){
						alert("저장되었습니다.");
						vt.fnClose();
					}
				}).catch(function(ex) {
					alert(Message.ERROR);
				});
			}if(vt.viewModel.deleteImgList.length > 0){
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