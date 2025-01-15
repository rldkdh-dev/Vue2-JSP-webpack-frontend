<template>
	<modal :pass="{widthObject: 720, popupTitle:'변경요구서 등록'}">
		<template v-slot:contents>
			<p class="table-title">변경관리 정보</p>
			<table class="mt10">
				<caption>변경관리정보</caption>
				<tbody>
					<tr>
						<th scope="row" style="width:120px;">변경관리 번호</th>
						<td>{{item.pc_no}}</td>
					</tr>
					<tr>
						<th scope="row">변경명</th>
						<td>{{item.title}}</td>
					</tr>
					<tr>
						<th scope="row">변경 내용</th>
						<td class="pre">{{item.contents}}</td>
					</tr>
					<tr>
						<th scope="row">변경발의 부서명</th>
						<td>{{item.dept_name}}</td>
					</tr>
					<tr>
						<th scope="row">사업장명</th>
						<td>{{item.group_name}}</td>
					</tr>
					<tr>
						<th scope="row">공정명</th>
						<td>{{item.psm_busi_name}}</td>
					</tr>
					<tr>
						<th scope="row">설비명</th>
						<td>{{item.pf_name}}</td>
					</tr>
					<tr>
						<th scope="row">변경종류</th>
						<td>{{item.status}}</td>
					</tr>
				</tbody>
			</table>
			<p class="table-title mt20">첨부</p>
			<table class="mt10">
				<caption>첨부</caption>
				<tbody>
					<tr>
						<td>
							<fileform @filelist="fnFilelist" :pass="{id:'step2'}" ref="files"></fileform>
						</td>
					</tr>
				</tbody>
			</table>
			<div class="buttonbox">
				<input type="submit" value="저장" class="btn btn-save btn-primary" @click="fnChangeStep2">
				<input type="button" value="취소" class="btn btn-icon btn-cancel" @click="fnCancel">
			</div>
		</template>
	</modal>
</template>
<script>
import Axios from 'axios';
import Vue from 'vue'
import Modal from './modal.vue'
import Fileform from '../fileform.vue';
import Message, {messageUtil} from "../../../common/message";
import formValidation from "../../../common/fromValidation";

export default {
	components: {
		Modal, Fileform
	},
	data: function () {
		return {
			item: {},
			viewModel:{
				filelist: [],
                fileGroup: '',
			},
		}
	},
	mounted: function () {
		console.log('step2-popup')
	},
	methods: {
		fnInit: function(item) {
			Modal.methods.fnInit();
			this.item = item;
			this.fnDetail(item.pc_no)
		},
		fnDetail: function(id){
			let vt = this;
			let vm = this.viewModel;
			Axios.post("/list",{mapperId: 'changes.changeStep2List', pc_uid: id}).then(function(rs) {
				let rd = rs.data.list[0];
				if(rd!=undefined) {
					let file = rd.attach_file;
					if(file != undefined) {
						vt.$refs.files.fnFileLoad(file);
					}
				} else {
					vt.$refs.files.fnFileLoad(rd);
				}
			});
		},
		fnChangeStep2: function() {
            let vt = this;
    		let vm = this.viewModel;
            let message;
    		let senddata = {
				mapperId: 'changes.insertChangeStep2',
                memberuid: vt.$parent.viewModel.user.memberuid,
                pc_uid: vt.item.pc_no,
                attach_file: (vm.fileGroup == '') ? null : vm.fileGroup,
    		};
            const valiData = [
                {id: 'file', type: 'input', title: '첨부파일'},
            ];
            if(formValidation(valiData) && confirm(Message.CREATE_CONFIRM)) {
				if(vt.item.pc_no!=undefined) {
					let data = {
						mapperId: 'changes.deleteChangeStep2',
						uid: vt.item.pc_no
					}
					Axios.post("/delete", data).then(function(rs) {
						console.log(rs.data)
						Axios.post("/insert", senddata).then(function(rs) {
							if(vm.fileGroup!='') {
								vt.$refs.files.fnInsertFile()
							}
							alert('등록이 완료되었습니다.');
							vt.fnCancel();
						});
					});
				}
            } else {
                if(message) alert(message);
            }
        },
		fnFilelist: function(vm) {
			this.viewModel.filelist = vm.filelist;
			this.viewModel.fileGroup = vm.fileGroup;
		},
		fnCancel: function() {
			this.$parent.popup = {};
			this.$parent.fnList(0)
		}
	}
};
</script>
