<template>
	<modal :pass="{widthObject: 700, popupTitle: pass.popupTitle}">
		<template v-slot:contents>
			<p class="table-title">변경관리 정보</p>
			<table class="mt10">
				<caption>변경관리 정보</caption>
				<tbody>
					<tr>
						<th style="width:120px;" scope="row">변경관리 번호</th>
						<td>{{item.pc_no}}</td>
					</tr>
					<tr>
						<th scope="row">변경명</th>
						<td>{{item.title}}</td>
					</tr>
					<tr>
						<th scope="row"><label for="s_pcnt">교육인원</label></th>
						<td>
							<div class="unit_wrap"><span>명</span>
								<input type="number" id="s_pcnt" class="w150" v-model="viewModel.step.pcnt">
							</div>
						</td>
					</tr>
					<tr>
						<th scope="row"><label for="s_pdate">교육일자</label></th>
						<td>
							<div class="datepicker_box">
								<input type="text" id="s_pdate" class="datepicker" readonly>
								<button type="button" class="btn btn-icon btn4 md btn-updown" onclick="$(this).prev().val('');"><span class="mi">close</span></button>
							</div>
						</td>
					</tr>
					<tr>
						<th scope="row"><label for="">사진</label></th>
						<td>
							<imgfileform @filelist="fnImgFilelist" :pass="{id:'s6'}" ref="imgfile"></imgfileform>
						</td>
					</tr>
				</tbody>
			</table>

			<p class="table-title mt20">첨부</p>
			<table class="mt10">
				<caption>첨부</caption>
				<tbody>
					<tr>
						<td>
							<fileform @filelist="fnFilelist" :pass="{id:'step6'}" ref="files"></fileform>
						</td>
					</tr>
				</tbody>
			</table>
			<div class="buttonbox">
				<input type="submit" value="저장" class="btn btn-save btn-primary" @click="fnChangeStep">
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
import Imgfileform from '../imgfileform.vue';
import Message, {messageUtil} from "../../../common/message";
import formValidation from "../../../common/fromValidation";

export default {
	props: ['pass'],
	components: {
		Modal, Fileform, Imgfileform
	},
	data: function () {
		return {
			mode: null,
			item: {},
			viewModel:{
				step: {},
				filelist: [],
                fileGroup: '',
				imgfilelist: [],
                imgfileGroup: '',
			},
		}
	},
	mounted: function () {
		console.log('step6-popup')
	},
	methods: {
		fnInit: function(item, type) {
			Modal.methods.fnInit();
			load_datepicker();
			this.item = item;
			if(type!=undefined) {
				this.mode = 'step7'
			} else {
				this.mode = null;
			}
			this.fnDetail(item.pc_no)
		},
		fnDetail: function(id){
			let vt = this;
			let vm = this.viewModel;
			let data = {
				mapperId: (vt.mode!='step7') ? 'changes.changeStep6List' : 'changes.changeStep7List',
				pc_uid: id
			}
			Axios.post("/list", data).then(function(rs) {
				let rd = rs.data.list[0];
				if(rd!=undefined) {
					vm.step = rd;
					$('#s_pdate').val(rd.pdate)
					if(rd.attach_file != undefined) vt.$refs.files.fnFileLoad(rd.attach_file);
					if(rd.img_attach_file != undefined) vt.$refs.imgfile.fnFileLoad(rd.img_attach_file);
				} else {
					vm.step = {}
					$('#s_pdate').val('')
					vt.$refs.files.fnFileLoad(rd);
					vt.$refs.imgfile.fnFileLoad(rd);
				}
			});
		},
		fnChangeStep: function() {
            let vt = this;
    		let vm = this.viewModel;
            let message;
    		let senddata = {
				mapperId: (vt.mode!='step7') ? 'changes.insertChangeStep6' : 'changes.insertChangeStep7',
                memberuid: vt.$parent.viewModel.user.memberuid,
                pc_uid: vt.item.pc_no,
                pcnt: vm.step.pcnt,
                pdate: $('#s_pdate').val(),
                attach_file: (vm.fileGroup == '') ? null : vm.fileGroup,
                img_attach_file: (vm.imgfileGroup == '') ? null : vm.imgfileGroup,
    		};
            const valiData = [
                {id: 's_pcnt', type: 'input', title: '교육인원'},
                {id: 's_pdate', type: 'input', title: '교육일자'},
            ];
            if(formValidation(valiData) && confirm(Message.CREATE_CONFIRM)) {
				let data = {
					mapperId: (vt.mode!='step7') ? 'changes.deleteChangeStep6' : 'changes.deleteChangeStep7',
					pc_uid: vt.item.pc_no
				}
				Axios.post("/delete", data).then(function(rs) {
					Axios.post("/insert", senddata).then(function(rs) {
						if(rs.data==1) {
							if(vm.fileGroup!='') vt.$refs.files.fnInsertFile()
							if(vm.imgfileGroup!='') vt.$refs.imgfile.fnInsertFile()
							alert('입력이 완료되었습니다.');
							vt.fnCancel();
						}
					});
				});
            } else {
                if(message) alert(message);
            }
        },
		fnFilelist: function(vm) {
			this.viewModel.filelist = vm.filelist;
			this.viewModel.fileGroup = vm.fileGroup;
		},
		fnImgFilelist: function(vm) {
			this.viewModel.imgfilelist = vm.filelist;
			this.viewModel.imgfileGroup = vm.fileGroup;
		},
		fnCancel: function() {
			this.$parent.popup = {};
			this.$parent.fnList(0)
		}
	}
};
</script>
