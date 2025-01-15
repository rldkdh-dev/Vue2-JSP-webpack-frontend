<template>
	<div class="modal_wrap aprv">
		<div class="popup modal">
			<div class="popup_panel">
				<div class="popup_header" ref="draggableContainer">
					<h4>사업부승인 파일 등록</h4>
					<div class="icon_box">
						<button class="btn btn-icon btn_fullscreen"><svg class="icon"><use xlink:href="/img/symbol-defs.svg#icon-fullscreen"></use></svg></button>
						<button class="btn btn-icon btn_popup_close" @click="fnClose($event);"><svg class="icon"><use xlink:href="/img/symbol-defs.svg#icon-delete"></use></svg></button>
					</div>
				</div>
				<div class="contents popup_contents">
					<div>
						<div style="padding-bottom:5px">
							<label>승인 : </label>
							<input type="radio" id="aprvY" v-model="viewModel.data.bizdept_aprv_stts" value="Y"><label for="aprvY" style="padding-left:5px">완료</label>
							<input type="radio" id="aprvN" v-model="viewModel.data.bizdept_aprv_stts" value="N"><label for="aprvN" style="padding-left:5px">보류</label>
						</div>
						<div style="padding-bottom:5px">
							<label for="">사유</label>
							<textarea v-model="viewModel.data.bizdept_aprv_rs">{{ viewModel.data.bizdept_aprv_rs }}</textarea>
						</div>
						<aprvFileform @filelist="fnFilelist"  @fileDelete="fnFileDelete" :pass="{id:'ap'}" :ref="'files'"></aprvFileform>
					</div>
					<div class="btn-group">
						<div class="left_side" v-show="isAttchFile">
							<a href="javascript:void(0)" @click="fnDownload" class="btn btn-purple">다운로드</a>
						</div>
						<div class="right_side">
							<a href="javascript:void(0)" @click="fnClose($event)" class="btn btn-purple">취소</a>
							<a href="javascript:void(0)" @click="fnSave" class="btn btn-purple">등록</a>
						</div>
					</div>
				</div>
				<fileViewPopup ref="fileViewPopup" v-show="fileViewPop"></fileViewPopup>
			</div>
		</div>
	</div>
</template>
<script>
import Axios from 'axios';
import Vue from 'vue';
import Message, {messageUtil} from "../../../../../common/js/message";
import aprvFileform from "../../../../../common/vue/fileform2";
import fileViewPopup from '../../../../../common/vue/fileViewPopupCp.vue';

export default {
	components: {
		'aprvFileform' : aprvFileform,
		'fileViewPopup': fileViewPopup
	},
	data: function () {
		return {
			userInfo:{},
			isAttchFile:false,
			fileViewPop:false,
			viewModel:{
				bplc_sn:'',
				sfmng_sn:'',
				fileList:[],
				deletefileList:[],
				data:{}
			}
		}
	},
	mounted: function () {
		
	},
	methods: {
		fnInit: function(sn) {
			let vm = this;

			$(".modal_wrap").show();
			vm.userInfo = vm.$store.state.global.userInfo;
			vm.viewModel.bplc_sn = sn[0];
			vm.viewModel.sfmng_sn = sn[1];

			//파일 리스트 초기화
			// vm.viewModel.fileList = [];
			// vm.$refs.files.viewModel.filelist = [{seq: 0}];
			// vm.$refs.files.viewModel.deletefileList = [];

			vm.fnDetail(sn);
		},
		fnDetail:function(sn) {
			let vm = this;
			vm.isAttchFile = false;
			vm.fileViewPop = false;
			let send = {
				bplc_sn: sn[0],
				sfmng_sn: sn[1],
				file_se: '9'
			};

			Axios.post("/selectCpSftMngFileList.do", send).then(function(response) {
				vm.viewModel.data = response.data.sfMngInfo;
				vm.viewModel.fileList = response.data.fileList;
				vm.$refs.files.fnFileLoadList(vm.viewModel.fileList);
				if(vm.viewModel.fileList.length > 0 ) vm.isAttchFile = true;
			});
		},
		fnFilelist:function(vm){
			this.viewModel.fileList = vm.filelist;
		},
		fnFileDelete:function(vm){
			this.viewModel.deletefileList = vm.deletefileList;
		},
		fnSave: function(){
			let vm = this;
			let frm = new FormData();

			for(let i=0; i<vm.viewModel.fileList.length; i++) {
				let key = vm.viewModel.fileList[i].file_seq;
				if(vm.viewModel.fileList[i].file != null) {
					frm.append("fileTitle", vm.viewModel.fileList[i].file_title);
					frm.append("uploadFiles", vm.viewModel.fileList[i].file);
					if(vm.viewModel.fileList[i].file_sn){
						frm.append("deleteFiles", vm.viewModel.fileList[i].file_sn);
					}
					frm.append("key", 0);
				} else {
					if(vm.viewModel.fileList[i].file != undefined){
						frm.append("fileTitle", vm.viewModel.fileList[i].file_title);
						frm.append("key", key);
					}
				}
			}
			for(let i=0; i<vm.viewModel.deletefileList.length; i++){
				frm.append("deleteFiles", vm.viewModel.deletefileList[i]);
			}

			vm.fngetFileInfo(frm);
		},
		fngetFileInfo:function(frm){
			let vm = this;
			let send = {
				bplc_sn: vm.viewModel.bplc_sn,
				sfmng_sn: vm.viewModel.sfmng_sn,
				file_se: '9',
				bizdept_aprv_stts: vm.viewModel.data.bizdept_aprv_stts,
				bizdept_aprv_rs: vm.viewModel.data.bizdept_aprv_rs,
				reg_id: vm.userInfo.user_id
			};

			frm.append('data', new Blob([ JSON.stringify(send) ], {type : "application/json"}));
			frm.append("filePath", "cpSftMng");

			if(confirm(Message.CREATE_CONFIRM)){
				Axios.post("/updateCpSftMng.do", frm).then(function(response) {
					alert("등록 되었습니다.");
					$('.modal_wrap').hide();
					vm.$parent.fnList(0);
					//vm.$router.push('/');

					//팝업 초기화..
					//location.href = '/rawWk/cpSftMng/cpSftMng.do';
				}).catch(function(ex) {
					alert(Message.ERROR);
				});
			}
		},
		fnClose :function(event){
			//팝업 초기화..
			//location.href = '/rawWk/cpSftMng/cpSftMng.do';
			//popup 닫기
			$(event.target).closest('.modal_wrap').hide();
		},
		fnDownload: function() {
			let vm = this;
			vm.fileViewPop=true;
			vm.$nextTick(function() {
                if(vm.fileViewPop) {
					vm.$refs.fileViewPopup.fnInit(vm.viewModel.fileList, 'cpSftPlan');
				}
            });
		}
	}
};
</script>
