<template>
	<modal :pass="{popupTitle: '건의 사항'}">
		<template v-slot:contents>
					<div>
						<table class="table horizontal write">
							<caption>건의 사항</caption>
							<tbody>
								<tr>
									<th scope="row"><label for="">현장</label></th>
									<td>{{ viewModel.data.bplc_nm }}</td> 
								</tr>
								<tr>
									<th scope="row"><label for="">작성자</label></th>
									<td>{{ viewModel.data.reg_nm }}</td> 
								</tr>
								<tr>
									<th scope="row"><label for="">사진등록</label></th>
									<td>
										<imgsfileform :ref="'impl_imgs'" :pass="{id:'impl_img'}" @filelist="fnImgFileList" @fileDelete="fnImgFileDelete"></imgsfileform>
									</td>
								</tr>
								<tr>
									<th scope="row"><label for="">의견내용</label></th>
									<td>
										<textarea id="actn_cn" rows="5" title="의견내용" v-model="viewModel.data.cn"></textarea>
									</td>
								</tr>
							</tbody>
						</table>
					</div>
					
					<div class="btn-group btn-right">
						<a href="javascript:void(0);" class="btn btn-purple" @click="fnSave()"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-edit"></use></svg>{{ state_k }}</a>
						<a href="javascript:void(0);" class="btn btn-gray" @click="fnClose()"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-trash-can"></use></svg>취소</a>
					</div>
		</template>
	</modal>
</template>

<script>
import 'es6-promise/auto'
import Vue from 'vue'
import Axios from 'axios'
import Modal from './modal.vue'
import imgsfileform from '../../../common/vue/imgsfileform2.vue';

export default{
	props: ['pass'],
    components: {
        Modal, imgsfileform
    },
    data: function () {
        return {
			state:'',
			state_k:'',
			viewModel:{
				data:{
					sugest_mttr_sn : '',
					lbm_cfrnc_sn : 0,
					bplc_sn : 0,
					bplc_nm : '',
					reg_nm : '',
				},
				imgList:[],
				fileLoadList:[],
				deleteImgList:[],
				adminList:{},
				userInfo:{},
			}
        }
    },
    methods: {
		fnInit: function(value) {
			let vt = this;
			let vm = this.viewModel;
			vm.userInfo = vt.$store.state.global.userInfo;
		
			vm.data = {};
			vm.data.lbm_cfrnc_sn = value.lbm_cfrnc_mtg_sn;
			vm.data.bplc_sn = value.bplc_sn;
			vm.data.bplc_nm = value.bplc_nm;
			vm.data.reg_nm = vm.userInfo.user_name;
			vt.state_k = '등록';

			vt.$nextTick(function() {
				if(value.prgrs_sittn >= 4 && vm.data.lbm_cfrnc_sn != null){
					vt.fnDetail();
				}
			});
		},
		fnDetail:function(){
			let vt = this;
			let vm = this.viewModel;
			let data = {
				lbm_cfrnc_sn : vm.data.lbm_cfrnc_sn,
				bplc_sn : vm.data.bplc_sn,
				user_id : vm.userInfo.user_id,
				file_se : '1', //1.건의사항 2. 피드백
				process : 'suggest'
			}

			Axios.post("/selectMauImplPlActDetail.do", data).then(function(response) {
				if(response.data.suggestDetail){
					vm.data = response.data.suggestDetail;
					vm.fileLoadList = response.data.fileList;
					vt.$refs.impl_imgs.fnFileLoadList(vm.fileLoadList);
	
					if(vm.userInfo.user_id == vm.data.reg_id){
						vt.state = 'update';
						vt.state_k = '수정';
					}
				}
				vt.$forceUpdate(); 
			})	
		},
		fnSave:function(){
			let vt = this;
			let vm = this.viewModel;
			
			let frm = new FormData();

			for(let i=0; i<vm.imgList.length; i++) {
				let key = vm.imgList[i].file_seq;
				if(vm.imgList[i].file != null) {
					frm.append("uploadFiles", vm.imgList[i].file);
					frm.append("fileTitle", vm.imgList[i].file.name);
					// frm.append("sn",  vm.data.lbm_cfrnc_sn); //노사협의체 일련변호
					// frm.append("sub_sn",  vm.data.sugest_mttr_sn); //건의사항 일련변호
					frm.append("file_se", 1); //1.건의사항 2. 피드백
					if(vm.imgList[i].file_sn){
						frm.append("deleteFiles", vm.imgList[i].file_sn);
					}
					frm.append("key", 0)
				} else {
					if(vm.imgList[i].file == undefined){
						
					}else{
						frm.append("fileTitle", vm.imgList[i].file_title);
						frm.append("key", key)
					}
				}
			}
			if(vm.deleteImgList != null){
				for(let i=0; i<vm.deleteImgList.length; i++){
					frm.append("deleteFiles", vm.deleteImgList[i]);
				}   
			}
			vt.fnInsert(frm);
		},
		fnInsert:function(frm){
			let vt = this;
			let vm = this.viewModel;
			
			let data = {
				sugest_mttr_sn : (vm.data.sugest_mttr_sn == '' || vm.data.sugest_mttr_sn == undefined)? -1:vm.data.sugest_mttr_sn,
				bplc_sn : vm.data.bplc_sn,
				lbm_cfrnc_sn : vm.data.lbm_cfrnc_sn,
				sugest_mttr : 1, //분류 1.건의 2.피드백
				cn : vm.data.cn,
				fdbck_yn : 'N',
				reg_id : vm.userInfo.user_id
				
			}
			frm.append('data', new Blob([ JSON.stringify(data) ], {type : "application/json"}));
			
			frm.append("filePath", "ImplActSuggest");
			
			if(!vm.data.cn){
				return alert("건의 의견 내용을 입력해주시기 바랍니다.");
			}

			if(vt.state == 'update'){
				if(confirm("건의 사항을 수정 하시겠습니까?")){ 
					Axios.post("/updateMauImplActSuggest.do", frm).then(function(response) {
						if(response.date != 0){
							alert("수정 되었습니다.");
							vt.fnClose();
						}else{
							alert("수정이 중단되었습니다.");
						}
					})	
				}
			}else{
				if(confirm("건의 사항을 저장 하시겠습니까?")){ 
					Axios.post("/insertMauImplActSuggest.do", frm).then(function(response) {
						if(response.date != 0){
							alert("저장 되었습니다.");
							vt.fnClose();
						}else{
							alert("저장이 중단되었습니다.");
						}
					})	
				}
			}
		},
		fnImgFileList:function(vm){
			let vt = this;
			vt.viewModel.imgList = vm.viewModel.filelist;
		},
		fnImgFileDelete:function(vm){
			let vt = this;
			vt.viewModel.deleteImgList = vm.viewModel.deletefileList;
		},
		fnClose:function(){
            this.$parent.fnInit();
            this.$emit('close',false);
        },
    }
}
</script>