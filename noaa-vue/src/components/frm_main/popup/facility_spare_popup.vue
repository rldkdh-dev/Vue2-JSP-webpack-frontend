<template>
	<modal :pass="{widthObject: 500, popupTitle:'예비품 정보'}">
		<template v-slot:contents>
			<p class="table-title">정보</p>
			<table>
				<caption>예비품정보</caption>
				<tbody>
					<tr>
						<th scope="row">설비번호</th>
						<td>{{ viewModel.item.pf_uid }}</td>
					</tr>
					<tr>
						<th scope="row">설비명</th>
						<td>{{ viewModel.item.fc_pf_name }}</td>
					</tr>
					<tr>
						<th scope="row">예비품명</th>
						<td>{{ viewModel.item.sp_title }}</td>
					</tr>
					<tr>
						<th scope="row">예비품 목록번호</th>
						<td>{{viewModel.item.sp_no}}</td>
					</tr>
					<tr>
						<th scope="row">형식번호</th>
						<td>{{viewModel.item.type_no}}</td>
					</tr>
					<tr>
						<th scope="row">모델번호</th>
						<td>{{viewModel.item.model_no}}</td>
					</tr>
					<tr>
						<th scope="row">연간재고수량</th>
						<td>{{viewModel.item.year_count}}</td>
					</tr>
					<tr>
						<th scope="row">현재보유량</th>
						<td>{{viewModel.item.curr_count}}</td>
					</tr>
					<tr>
						<th scope="row">보관장소</th>
						<td>{{viewModel.item.save_loc}}</td>
					</tr>
					<tr>
						<th scope="row">보관대 번호</th>
						<td>{{viewModel.item.save_no}}</td>
					</tr>
					<tr>
						<th scope="row">관리부서</th>
						<td>{{viewModel.item.sp_dept_name}}</td>
					</tr>
					<tr>
						<th scope="row">비고</th>
						<td class="tl">{{viewModel.item.etc}}</td>
					</tr>
				</tbody>
			</table>
		</template>
	</modal>
</template>
<script>
import Axios from 'axios';
import Vue from 'vue'
import Pager from '../../paging.vue'
import Modal from './modal.vue'
import Imgfileform from '../imgfileform.vue';

export default {
	components: {
		Pager, Modal, Imgfileform
	},
	data: function () {
		return {
			viewModel:{
				item:{},
			},
		}
	},
	mounted: function () {
	},
	methods: {
		fnInit: function(id) {
			Modal.methods.fnInit();
			this.fnSetContents(id);
		},
		fnSetContents: function(id){
			let vt = this;  
			let vm = this.viewModel;  
			let data = {
				mapperId: 'faci.selectFacilitySpare',
				pageNo: 0,
				uid: id,
			};
			Axios.post("/list",data).then(function(rs) {
				vm.item = rs.data.list[0];
			});
		},
		fnRowClick : function(item){			
			$('.overlay_mask, .overlay_formbox').hide();
			$('body').removeClass("fix");
			
		},
	}
};
</script>
