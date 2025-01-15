<template>
	<modal :pass="{widthObject: 720, popupTitle:'변경기술검토 등록'}">
		<template v-slot:contents>
			<p class="table-title">변경관리 정보</p>
			<table class="mt10">
				<caption>변경관리 정보</caption>
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

			<p class="table-title mt20">변경위원회 정보</p>
			<table class="mt10">
				<caption>변경위원회 정보</caption>
				<tbody>
					<tr>
						<th scope="row" style="width:120px;">변경위원</th>
						<td></td>
					</tr>
					<tr>
						<th scope="row">변경검토서<br>변경위원회 결과</th>
						<td class="tl" style="padding:4px;">
							<textarea class="full" v-model="viewModel.step3.contents" id="cs3_contents" title="변경검토서,변경위원회결과" style="resize:vertical;height:150px;"></textarea>
						</td>
					</tr>
				</tbody>
			</table>

			<p class="table-title mt20">첨부 (회의록)</p>
			<table class="mt10">
				<caption>첨부</caption>
				<tbody>
					<tr>
						<td>
							<fileform @filelist="fnFilelist" :pass="{id:'step3'}" ref="files"></fileform>
						</td>
					</tr>
				</tbody>
			</table>

			<p class="table-title mt20">승인</p>
			<table class="mt10">
				<tbody>
					<tr>
						<th style="width:120px;">승인</th>
						<td class="radio-group">
							<label class="radio_label">승인
								<input type="radio" name="status" value="승인" checked="checked" v-model="viewModel.step3.status">
								<span class="checkmark"></span>
							</label>
							<label class="radio_label">반려
								<input type="radio" name="status" value="반려" v-model="viewModel.step3.status">
								<span class="checkmark"></span>
							</label>
							<label class="radio_label">취소
								<input type="radio" name="status" value="취소" v-model="viewModel.step3.status">
								<span class="checkmark"></span>
							</label>
							<label class="radio_label">해당무
								<input type="radio" name="status" value="해당무" v-model="viewModel.step3.status">
								<span class="checkmark"></span>
							</label>
						</td>
					</tr>
				</tbody>
			</table>

			<div class="buttonbox">
				<input type="submit" value="저장" class="btn btn-save btn-primary" @click="fnChangeStep3">
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
				step3: {status: '승인'},
				filelist: [],
                fileGroup: '',
			},
		}
	},
	mounted: function () {
		console.log('step3-popup')
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
			Axios.post("/list",{mapperId: 'changes.changeStep3List', pc_uid: id}).then(function(rs) {
				let rd = rs.data.list[0];
				if(rd!=undefined) {
					vm.step3 = rd;
					let file = rd.attach_file;
					if(file != undefined) {
						vt.$refs.files.fnFileLoad(file);
					}
				} else {
					vt.$refs.files.fnFileLoad(rd);
				}
			});
		},
		fnChangeStep3: function() {
            let vt = this;
    		let vm = this.viewModel;
            let message;
    		let senddata = {
				mapperId: 'changes.insertChangeStep3',
                memberuid: vt.$parent.viewModel.user.memberuid,
                pc_uid: vt.item.pc_no,
                contents: vm.step3.contents,
                status: vm.step3.status,
                attach_file: (vm.fileGroup == '') ? null : vm.fileGroup,
    		};
            const valiData = [
                {id: 'cs3_contents', type: 'input', title: '변경위원회 정보'},
            ];
            if(formValidation(valiData) && confirm(Message.CREATE_CONFIRM)) {
				if(vt.item.pc_no!=undefined) {
					let data = {
						mapperId: 'changes.deleteChangeStep3',
						pc_uid: vt.item.pc_no
					}
					Axios.post("/delete", data).then(function(rs) {
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
