<template>
	<modal :pass="{widthObject: 500, popupTitle:'개선실행계획 조치담당자 선택'}">
		<template v-slot:contents>
			<p class="table-title">개선실행계획 정보</p>
			<div class="section-view">
				<table>
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
						<tr>
							<th scope="row"><label for="impr_member">조치담당자</label></th>
							<td>
								<select id="impr_member" v-model="viewModel.item.measure_memberuid">
									<option value="" selected>전체</option>
									<option v-for="item in viewModel.list" :key="item.uid" :value="item.uid">{{item.job_name}} {{item.user_name}}</option>
								</select>
							</td>
						</tr>
					</tbody>
				</table>

				<div class="buttonbox">
					<input type="submit" value="저장" class="btn btn-save btn-primary" @click="fnUpdateCharge">
					<input type="button" value="취소" class="btn btn-icon btn-cancel" @click="fnCancel">
				</div>
			</div>
		</template>
	</modal>
</template>
<script>
import Axios from 'axios';
import Vue from 'vue'
import Modal from './modal.vue'
import Message, {messageUtil} from "../../../common/message";
import formValidation from "../../../common/fromValidation";

export default {
	components: {
		Modal
	},
	data: function () {
		return {
			viewModel:{
				item: {},
				list:[],
			},
		}
	},
	mounted: function () {
		console.log('imprmember-popup')
	},
	methods: {
		fnInit: function(item) {
			Modal.methods.fnInit();
			this.viewModel.item = item;
			if(item.measure_memberuid==undefined) this.viewModel.item.measure_memberuid = '';
			this.fnSetContents(item);
		},
		fnSetContents: function(item) {
			let vm = this.viewModel;
			vm.list = [];
			let senddata = {
				mapperId : 'comm.selectUserList',
				dept: item.measure_dept_uid
			};
			Axios.post("/list", senddata).then(function(response) {
				vm.list = response.data.list;
			});
        },
		fnUpdateCharge: function() {
			let vt = this;
			let vm = this.viewModel;
			let message;
			let senddata = {
				mapperId : 'audit.updateAuditImprCharge',
				measure_memberuid: vm.item.measure_memberuid,
				uid: vm.item.uid
			};
			const valiData = [
                {id: 'impr_member', type: 'input', title: '조치담당자'},
            ];
			if(formValidation(valiData) && confirm(Message.CREATE_CONFIRM)) {
				Axios.post("/update", senddata).then(function(response) {
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
