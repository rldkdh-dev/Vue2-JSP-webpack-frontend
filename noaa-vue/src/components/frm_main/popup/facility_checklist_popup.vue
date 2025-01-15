<template>
	<modal :pass="{widthObject: 500, popupTitle:'점검이력'}">
		<template v-slot:contents>
			<p class="table-title">정보</p>
			<div class="section-view">
				<table>
					<caption>점검이력</caption>
					<tbody>
						<tr>
							<th scope="row" class="w120">설비번호</th>
							<td>{{ viewModel.item.fcno }}</td>
						</tr>
						<tr>
							<th scope="row">설비명</th>
							<td>{{ viewModel.item.fc_pf_name }}</td>
						</tr>
						<tr>
							<th scope="row">점검주기</th>
							<td>{{ viewModel.item.check_cycle }}</td>
						</tr>
						<tr>
							<th scope="row">사용부서</th>
							<td>{{ viewModel.item.use_dept_name }}</td>
						</tr>
						<tr>
							<th scope="row">위치</th>
							<td>{{ viewModel.item.area }}</td>
						</tr>
						<tr>
							<th scope="row">점검일자</th>
							<td><p id="check_date"></p></td>
						</tr>
						<tr>
							<th scope="row">양호율</th>
							<td>
								<div class="type<?=$state_code?>">
									<div class="percent-group" style="margin:0 0 4px;max-width:100%;">
										<percent :pass="{max: viewModel.item.total_cnt, val: viewModel.item.value1_cnt, rest:viewModel.item.value2_cnt}"></percent>
									</div>
								</div>
							</td>
						</tr>
						<tr>
							<th scope="row">특이사항</th>
							<td>{{ viewModel.item.check_etc }}</td>
						</tr>
						<tr>
							<th scope="row">서명</th>
							<td>
								<div class="fileinput-preview thumbnail">
									<img :src="viewModel.item.signature_json">
								</div>
							</td>
						</tr>
					</tbody>
				</table>
				<table class="form-table odd mt20 checklist-table">
					<caption>점검항목</caption>
					<thead>
						<tr>
							<th scope="col" class="sth">점검항목</th>
							<th scope="col" class="sth" style="width:70px;">점검결과</th>
						</tr>
					</thead>
					<tbody>
						<tr class="item" v-for="(item, index) in viewModel.resultList">
							<th class="lft">▪&nbsp;{{item.contents}}</th>
							<td class="tc w50">
								<span :class="'m_state'+item.value" style="margin-bottom:4px;">{{ item.value_name }}</span>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</template>
	</modal>
</template>
<script>
import Axios from 'axios';
import Vue from 'vue'
import Common from '../../common.js';
import Pager from '../../paging.vue'
import Modal from './modal.vue'
import Percent from '../../../common/percent.vue'

export default {
	components: {
		Pager, Modal, Percent
	},
	data: function () {
		return {
			viewModel:{
				item:{},
				resultList: [],
				keyword:"",
			},
		}
	},
	mounted: function () {
	},
	methods: {
		fnInit: function(uid) {
			Modal.methods.fnInit();
			this.fnSetContents(uid);
		},
		fnSetContents: function(uid){
			let vt = this;  
			let vm = this.viewModel;  
			let senddata = {
				mapperId : ['faci.selectFacilityCheckList','faci.selectFacilityCheckResultList'],
				uid: uid, 
			};
			Axios.post("/multiList", senddata).then(function(response) {
				vm.item = response.data.list1[0];
				vm.resultList = response.data.list2;

				$("#check_date").text(vm.item.check_date);

				if(vm.item.signature_json != undefined){
					if(vm.item.signature_json.charAt()=='/') {       //리눅스 경로때문에 사용
						vm.item.signature_json = vm.item.signature_json;
					} else {    //아닐경우
						vm.item.signature_json = vm.item.signature_json.substr(2);
					}
				}
			});
		},
		// fnRowClick : function(item){
		// 	$('.overlay_mask, .overlay_formbox').hide();
		// 	$('body').removeClass("fix");
		// },
	}
};
</script>
