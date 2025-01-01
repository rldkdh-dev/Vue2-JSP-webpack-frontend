<template>
	<modal :pass="{widthObject: 500, popupTitle:'예비품정보'}">
		<template v-slot:contents>
			<p class="table-title">정보</p>
			<div class="section-view">
				<table>
					<caption>예비품정보</caption>
					<tbody>
						<tr>
							<th scope="row" class="w150">장비번호 (차량번호)</th>
							<td>{{viewModel.item.em_no}}</td>
						</tr>
						<tr>
							<th scope="row">형식</th>
							<td>{{viewModel.item.em_type}}</td>
						</tr>
						<tr>
							<th scope="row">예비품명</th>
							<td>{{viewModel.item.sp_title}}</td>
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
							<td>{{viewModel.item.dept_name}}</td>
						</tr>
						<tr>
							<th scope="row">비고</th>
							<td class="tl pre">{{viewModel.item.etc}}</td>
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
import Pager from '../../paging.vue'
import Modal from './modal.vue'

export default {
	components: {
		Pager, Modal
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
		console.log('spare-popup')
	},
	methods: {
		fnInit: function(item) {
			Modal.methods.fnInit();
			this.viewModel.item = item;
		},
	}
};
</script>
