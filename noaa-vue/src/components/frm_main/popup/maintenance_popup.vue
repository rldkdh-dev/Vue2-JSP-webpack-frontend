<template>
	<modal :pass="{widthObject: 550, popupTitle:'정비이력'}">
		<template v-slot:contents>
			<p class="table-title">정보</p>
			<div class="section-view">
				<table>
					<caption>정비이력</caption>
					<tbody>
						<tr>
							<th scope="row" class="w150">정비일자</th>
							<td>{{viewModel.item.mdate}}</td>
						</tr>
						<tr>
							<th scope="row">장비번호 (차량번호)</th>
							<td>{{viewModel.item.em_no}}</td>
						</tr>
						<tr>
							<th scope="row">형식</th>
							<td>{{viewModel.item.em_type}}</td>
						</tr>
						<tr>
							<th scope="row">정비구분</th>
							<td>{{viewModel.item.cat}}</td>
						</tr>
						<tr>
							<th scope="row">점검자</th>
							<td>{{viewModel.item.inspector_dept}} {{viewModel.item.inspector_name}}</td>
						</tr>
						<tr>
							<th scope="row">정비 내용</th>
							<td class="pre">{{viewModel.item.contents}}</td>
						</tr>
						<tr>
							<th scope="row">판정(점검결과)</th>
							<td>{{viewModel.item.pass}}</td>
						</tr>
						<tr>
							<th scope="row">사진</th>
							<td>
								<img style="width:400px;" alt="이미지" :src="img" v-if="img!=''">
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
import Pager from '../../paging.vue'
import Modal from './modal.vue'

export default {
	components: {
		Pager, Modal
	},
	data: function () {
		return {
			img: '',
			viewModel:{
				item: {},
				list:[],
				keyword:"",
			},
		}
	},
	methods: {
		fnInit: function(item) {
			Modal.methods.fnInit();
			this.img = '';
			this.viewModel.item = item;
			this.fnSetContents(item);
		},
		fnSetContents: function(item){
			let vt = this;
			if(item.attach_file!=undefined) {
				Axios.post("/filelist", {groupid: item.attach_file}).then(function(rs) {
					let filelist = rs.data.filelist;
					if(filelist.length>0) {
						vt.img = rs.data.filelist[0].file_path.substr(2) + rs.data.filelist[0].file_new_name
					}
				});
			}
		},
	}
};
</script>
