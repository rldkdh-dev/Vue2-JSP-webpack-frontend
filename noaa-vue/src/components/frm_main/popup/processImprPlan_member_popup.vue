<template>
	<modal :pass="{widthObject: 500, popupTitle:'개선실행 계획서 조치담당자 선택'}">
		<template v-slot:contents>
			<p class="table-title">개선실행 계획서 정보</p>
			<div class="section-view">
				<table>
					<caption>개선실행 계획서 정보</caption>
					<tbody>
						<tr>
							<th scope="row" class="w150">공정명</th>
							<td>{{viewModel.list.cat1}}</td>
						</tr>
						<tr>
							<th scope="row">개선실행 계획</th>
							<td>{{viewModel.list.cat2}}</td>
						</tr>
						<tr>
							<th scope="row">재해형태</th>
							<td>{{viewModel.list.cat3}}</td>
						</tr>
						<tr>
							<th scope="row">개선대책</th>
							<td>{{viewModel.list.contents1}}</td>
						</tr>
						<tr>
							<th scope="row">조치부서</th>
							<td>{{viewModel.list.measure_dept_name}}</td>
						</tr>
					</tbody>
				</table>
			</div>
			<p class="table-title">조치담당자 선택</p>
			<div class="section-view">
				<table>
					<tbody>
						<tr>
							<th scope="row" class="w150"><label for="impr_member">조치담당자</label></th>
							<td>
								<select id="impr_member" v-model="viewModel.measure">
									<option value="" selected>전체</option>
									<option v-for="item in viewModel.impr_member_list" :key="item" :value="item.uid">{{item.user_job}} {{item.user_name}}</option>
								</select>
							</td>
						</tr>
					</tbody>
				</table>

				<div class="buttonbox">
					<input type="submit" value="저장" class="btn btn-save btn-primary" @click="fnUpdateCharge">
					<a href="javascript:void(0);" class="btn btn-cancel" onclick="btn_formbox_close();">취소</a>
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
				list:[],
				impr_member_list:[],
				measure : '',
			},
		}
	},
	mounted: function () {
		console.log('processImprPlanmember-popup')
	},
	methods: {
		fnInit: function(id) {
			Modal.methods.fnInit();
			// this.viewModel.item = item;
			//if(item.measure_memberuid==undefined) this.viewModel.item.measure_memberuid = '';\
			this.fnmeasureList();
			this.fnSetContents(id);
			
		},
		fnSetContents: function(id) {
			let vm = this.viewModel;
			vm.list = [];
			let senddata = {
				mapperId : 'psm.detailprocessImprPlanList',
				uid: id,
				// dept: vm.measure_dept_uid
			};
			Axios.post("/detail", senddata).then(function(rs) {
				vm.list = rs.data[0];
				console.log(vm.list);
				vm.measure = vm.list.measure_memberuid;
			});
        },
		fnUpdateCharge: function() {
			let vt = this;
			let vm = this.viewModel;
			let message;
			let senddata = {
				mapperId : 'psm.updateProcessImprCharge',
				measure_memberuid: vm.measure,
				uid: vm.list.uid
			};
			const valiData = [
                {id: 'impr_member', type: 'input', title: '조치담당자'},
            ];
			if(formValidation(valiData) && confirm(Message.CREATE_CONFIRM)) {
				Axios.post("/update", senddata).then(function(response) {
					alert('등록완료')
					window.location.reload(true);
				});
            } else {
                if(message) alert(message);
            }
        },
		fnCancel: function() {
			this.$parent.popup = {};
			this.$parent.fnList()
		},
		fnmeasureList:function(){
			let vm = this;

			let send = {
				mapperId:'psm.selectmeasureList'
			}
            Axios.post("/list",send).then(function(res) {
				//list
				vm.viewModel.impr_member_list = res.data.list;
			});
		}

	}
};
</script>
