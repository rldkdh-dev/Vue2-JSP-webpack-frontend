<template>
	<modal :pass="{widthObject: 600, popupTitle:'개선실행계획 조치내용 등록'}">
		<template v-slot:contents>
			<p class="table-title">개선실행계획 정보</p>
			<table class="mt10">
				<caption>개선실행계획 정보</caption>
				<tbody>
					<tr>
						<th scope="row" class="w150">자체감사 구분</th>
						<td>{{viewModel.item.cat1}}</td>
					</tr>
					<tr>
						<th scope="row">감사일자</th>
						<td>{{viewModel.item.comm_date}}</td>
					</tr>
					<tr>
						<th scope="row">PSM 구분</th>
						<td>{{viewModel.item.cat2}}</td>
					</tr>
					<tr>
						<th scope="row">자체감사 부적합 사항</th>
						<td>{{viewModel.item.contents1}}</td>
					</tr>
					<tr>
						<th scope="row">조치부서</th>
						<td>{{viewModel.item.measure_dept_name}}</td>
					</tr>
				</tbody>
			</table>

			<p class="table-title mt20">조치내용 등록</p>
			<table class="mt10">
				<tbody>
					<tr>
						<th scope="row">조치담당자</th>
						<td class="tl">{{viewModel.item.measure_dept_name}} {{viewModel.item.measure_member_name}}</td>
					</tr>
					<tr>
						<th scope="row" class="w150"><label for="aip_measure_date">조치예정일</label></th>
						<td class="tl" style="padding: 10px 5px 5px;">
							<div class="datepicker_box w200">
								<input type="text" id="aip_measure_date" class="datepicker" readonly>
							</div>
						</td>
					</tr>
					<tr>
						<th><label for="aip_measure_measure_result">조치내용 등록</label></th>
						<td class="tl" style="padding:4px;">
							<textarea id="aip_measure_measure_result" class="full" style="resize:vertical;height:150px;" v-model="viewModel.item.measure_result"></textarea>
						</td>
					</tr>
				</tbody>
			</table>

			<p class="table-title mt20">첨부</p>
			<table class="mt10">
				<tbody>
					<tr>
						<td>
							<fileform @filelist="fnFilelist" :pass="{id:'aip'}" ref="files"></fileform>
						</td>
					</tr>
				</tbody>
			</table>
			
			<div class="buttonbox">
				<input type="submit" value="저장" class="btn btn-save btn-primary" @click="fnUpdateContents" v-if="viewModel.item.measure_memberuid==viewModel.user.memberuid">
				<input type="button" value="취소" class="btn btn-icon btn-cancel" @click="fnCancel">
			</div>
		</template>
	</modal>
</template>
<style>
.mobile .w150 {width: 150px !important;}
</style>
<script>
import Axios from 'axios';
import Vue from 'vue'
import Modal from './modal.vue'
import Fileform from '../fileform.vue';
import Message, {messageUtil} from "../../../common/message";
import formValidation from "../../../common/fromValidation";

export default {
	components: {
		Modal,
		'fileform': Fileform
	},
	data: function () {
		return {
			viewModel:{
				item: {},
				user: {},
				list:[],
				filelist: [],
                fileGroup: '',
			},
		}
	},
	mounted: function () {
		console.log('imprcontnets-popup')
		this.viewModel.user = this.$store.state.global.userInfo;
	},
	methods: {
		fnInit: function(item) {
			Modal.methods.fnInit();
			load_datepicker();
			this.viewModel.item = item;
			$('#aip_measure_date').val(item.measure_date);
			if(item.attach_file_result != undefined) {
				this.$refs.files.fnFileLoad(item.attach_file_result);
			}
		},
		fnFilelist: function(vm) {
			this.viewModel.filelist = vm.filelist;
			this.viewModel.fileGroup = vm.fileGroup;
		},
		fnUpdateContents: function() {
			let vt = this;
			let vm = this.viewModel;
			let message;
			let senddata = {
				mapperId : 'audit.updateAuditImprContents',
				measure_date: $('#aip_measure_date').val(),
				measure_result: vm.item.measure_result,
				attach_file_result: (vm.fileGroup == '') ? null : vm.fileGroup,
				uid: vm.item.uid
			};
			const valiData = [
                {id: 'aip_measure_date', type: 'input', title: '조치예정일'},
                {id: 'aip_measure_measure_result', type: 'input', title: '조치내용'},
            ];
			if(formValidation(valiData) && confirm(Message.CREATE_CONFIRM)) {
				Axios.post("/update", senddata).then(function(response) {
					if(vm.fileGroup!='') {
						vt.$refs.files.fnInsertFile()
					}
					alert('등록이 완료되었습니다.')
					vt.fnCancel();
				});
            } else {
                if(message) alert(message);
            }
        },
		fnCancel: function() {
			this.$parent.popup = {};
			this.$parent.fnList()
		}
	}
};
</script>
