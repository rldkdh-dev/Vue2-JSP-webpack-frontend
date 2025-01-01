<template>
	<modal :pass="{widthObject: pass.widthObject, popupTitle: pass.popupTitle+' 등록'}">
		<template v-slot:contents>
			<p class="table-title">{{pass.popupTitle}} 정보</p>
			<table class="mt10">
				<caption>{{pass.popupTitle}}</caption>
				<tbody>
					<tr>
						<th style="width:120px;">자체감사 구분</th>
						<td>{{viewModel.item.cat1}}</td>
					</tr>
					<tr>
						<th>사업장명</th>
						<td>{{viewModel.item.group_name}}</td>
					</tr>
					<tr>
						<th>자체감사 기간</th>
						<td>{{viewModel.item.sdt}} ~ {{viewModel.item.edt}}</td>
					</tr>
				</tbody>
			</table>

			<p class="table-title mt20">첨부</p>
			<table class="mt10">
				<tbody>
				<tr>
					<td>
						<fileform @filelist="fnFilelist" :pass="{id:'auditstep'}" ref="files"></fileform>
					</td>
				</tr>
				</tbody>
			</table>
			<div class="buttonbox">
				<input type="submit" value="저장" class="btn btn-save btn-primary" @click="fnAuditStepInsert" />
				<input type="button" value="취소" class="btn btn-icon btn-cancel" onclick="btn_formbox_close()">
			</div>
		</template>
	</modal>
</template>
<script>
import Axios from 'axios';
import Vue from 'vue'
import Fileform from '../fileform.vue';
import Modal from '../popup/modal.vue'
import Message, {messageUtil} from "../../../common/message";
import formValidation from "../../../common/fromValidation";

export default {
	props: ['pass'],
	components: {
        'fileform': Fileform, Modal
    },
	data: function () {
		return {
			stepId: '',
			mode: '',
			viewModel:{
				item: {},
				user: {},
				filelist: [],
                fileGroup: '',
				step1: [],
			},
		}
	},
	mounted: function () {
		console.log(this.pass)
	},
	methods: {
		fnInit: function(id, item) {
			Modal.methods.fnInit();
			this.viewModel.user = this.$store.state.global.userInfo;
			this.viewModel.item = item;
			this.fnDetail(id, item.uid)
			this.mode = id
		},
		fnDetail: function(id, uid){
			let vt = this;
			let vm = this.viewModel;
			let data = {
				uid: uid,
			};
			vt.stepId = id;
			if(id=='step1') {
				data.mapperId= 'audit.auditStep1List';
			} else if(id=='step2') {
				data.mapperId= 'audit.auditStep2List';
			} else {
				data.mapperId= 'audit.auditStep4List';
			}

			Axios.post("/list",data).then(function(rs) {
				let rd = rs.data.list[0];
				if(rd!=undefined) {
					vm.step1 = rd;
					let file = rd.attach_file;
					if(file != undefined) {
						vt.$refs.files.fnFileLoad(file);
					}
				} else {
					vt.$refs.files.fnFileLoad(rd);
				}
			});
		},
		fnFilelist: function(vm) {
			this.viewModel.filelist = vm.filelist;
			this.viewModel.fileGroup = vm.fileGroup;
		},
		fnAuditStepInsert: function() {
            let vt = this;
    		let vm = this.viewModel;
            let message;
    		let senddata = {
                memberuid: vm.user.user_num,
                pa_uid: vm.item.uid,
                attach_file: (vm.fileGroup == '') ? null : vm.fileGroup,
    		};
            // const valiData = [
            //     {id: 'file', type: 'input', title: '첨부파일'},
            // ];
			for(let i=0; i<vm.filelist.length;i++){
				if(vm.filelist[i].file_title == '' || vm.filelist[i].file_title == undefined){
					alert("첨부파일은 필수 등록 사항입니다.");
					return false;
				}
			}

            if(confirm(Message.CREATE_CONFIRM)) {
				if(this.mode=='step1') {
					senddata.mapperId= 'audit.insertAuditStep1';
				} else if(this.mode=='step2') {
					senddata.mapperId= 'audit.insertAuditStep2';
				} else {
					senddata.mapperId= 'audit.insertAuditStep4';
				}

				if(vt.stepId == 'step1') {
					Axios.post("/delete", {mapperId: 'audit.deleteAuditStep1', pa_uid: vm.item.uid}).then(function(rs) {
						console.log(rs.data)
					});
				} else if(vt.stepId == 'step2') {
					Axios.post("/delete", {mapperId: 'audit.deleteAuditStep2', pa_uid: vm.item.uid}).then(function(rs) {
						console.log(rs.data)
					});
				} else if(vt.stepId == 'step3') {
					Axios.post("/delete", {mapperId: 'audit.deleteAuditStep4', pa_uid: vm.item.uid}).then(function(rs) {
						console.log(rs.data)
					});
				}
                Axios.post("/insert", senddata).then(function(rs) {
					if(vm.fileGroup!='') {
						vt.$refs.files.fnInsertFile()
					}
					btn_formbox_close();
					vt.$parent.fnList(0)
                });
            } else {
                if(message) alert(message);
            }
        },
	}
};
</script>
