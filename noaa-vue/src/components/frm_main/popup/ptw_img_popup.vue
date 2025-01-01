<template>
	<modal :pass="{widthObject: 800, heightObject: 580, popupTitle: '작업허가서 허가서 이미지 등록'}">
		<template v-slot:contents>
			<p class="table-title">작업허가서 정보</p>
			<table>
				<tbody class="table">
					<tr>
						<th scope="row">작업명</th>
						<td colspan="3">{{ viewModel.data.title }}</td>
					</tr>
					<tr>
						<th scope="row" style="width:120px;">허가서번호</th>
						<td colspan="3">{{ viewModel.data.docno }}</td>
					</tr>
					<tr>
						<th scope="row">작업 수행일</th>
						<td colspan="3">{{ viewModel.data.sdt }} {{ viewModel.data.stime }} ~ {{ viewModel.data.edt }} {{ viewModel.data.etime }}</td>
					</tr>
					<tr>
						<th scope="row">설비명</th>
						<td colspan="3">{{ viewModel.data.plant }}</td>
				
					</tr>
					<tr>
						<th scope="row">발행부서</th>
						<td>{{ viewModel.data.s_dept1_nm }}</td>
						<th scope="row">소관부서</th>
						<td>{{ viewModel.data.s_dept2_nm }}</td>
					</tr>
				</tbody>
			</table> 

			<p class="table-title mt20">허가서 이미지 등록</p>
			<table>
				<tbody class="table">
					<tr>
						<th scope="row">사진</th>
						<td>
							<imgsfileform @filelist="fnFilelist" :pass="{id:'fr'}" ref="imgfile"></imgsfileform>
						</td>
					</tr>
				</tbody>
			</table> 

			<div class="table_footer">
				<div class="buttonbox">
					<input type="submit" value="저장" class="btn btn-save btn-primary" @click="fnSave()">
					<input type="button" @click="fnCancel()" class="btn btn-icon btn-cancel" value="취소">
				</div>
			</div>
		</template>
	</modal>
</template>
<script>
import Axios from 'axios';
import Vue from 'vue'
import Common from '../../common.js';
import Modal from './modal.vue'
import imgsfileform from '../imgsfileform.vue'

export default {
	components: {
		Modal,
		'imgsfileform': imgsfileform,
	},
	data: function () {
		return {
			user:{},
			viewModel:{
				data:{},
				keyword:"",
				img_filelist: [],
				img_fileGroup: '',
			},
		}
	},
	mounted: function () {
	},
	methods: {
		fnInit: function(uid) {
			let vt = this;
			let vm = this.viewModel;
			vt.user = this.$store.state.global.userInfo;

			Modal.methods.fnInit();
			vt.fnSetContents(uid);
		},
		fnFilelist: function(vm) {
			this.viewModel.img_filelist = vm.filelist;
			this.viewModel.img_fileGroup = vm.fileGroup;
		},
		fnSetContents: function(uid){
			let vt = this;
			let vm = this.viewModel;

			let data = {
				mapperId: 'ptw.selectPtwList',
				uid: uid,
			};

			Axios.post("/list",data).then(function(rs) {
				vm.data = rs.data.list[0];
				let file = vm.data.permit_attach_file;
				if(file != undefined) {
					vt.$refs.imgfile.fnFileLoad(file);
				}else{
					vt.$refs.imgfile.fnInit();
				}
			});
		},
		fnRowClick : function(item){			
			$('.overlay_mask, .overlay_formbox').hide();
			$('body').removeClass("fix");
		},
		fnCancel: function() {
			$('.overlay_mask, .overlay_formbox').hide();
			$('body').removeClass("fix");
		},
		fnSave: function(){
			let vt = this;
			let vm = this.viewModel;

			let data = {
				mapperId: 'ptw.updatePtwImg',
				uid: vm.data.uid,
				permit_attach_file: (vm.img_fileGroup == '') ? null : vm.img_fileGroup,
			};

			Axios.post("/update", data).then(function(res){
				if(res.data.success == false) {
					alert(Message.ERROR);
				}else{
					if(vm.img_fileGroup!='') {
						vt.$refs.imgfile.fnInsertFile()
						vt.$parent.fnCmpl();
					}
				}
			}).catch(function(ex) {
				console.log(ex);
			});			
		}
	}
};
</script>
