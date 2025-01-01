<template>
	<modal :pass="{widthObject: 500, popupTitle:'우수사례'}">
		<template v-slot:contents>
			<p class="table-title">우수사례 정보</p>
			<table class="mt10">
				<caption>우수사례 정보</caption>
				<tbody>
				<tr>
					<th scope="row" style="width:120px;">제목</th>
					<td class="tl">{{ viewModel.list2.subject }}</td>
				</tr>
				<tr>
					<th scope="row" style="width:120px;">일자</th>
					<td class="tl">{{ viewModel.list2.stc_dt }}</td>
				</tr>
				<tr>
					<th scope="row">위치</th>
					<td class="tl">{{ viewModel.list2.area_name }}</td>
				</tr>
				<tr>
					<th scope="row">성명</th>
					<td class="tl">{{ viewModel.list2.user_name }}</td>
				</tr>
				<tr>
					<th scope="row">부서</th>
					<td class="tl">{{ viewModel.list2.dept_name }}</td>
				</tr>
				<tr>
					<th scope="row">내용</th>
					<td class="tl">{{ viewModel.list2.contents }}</td>
				</tr>
				<tr>
					<th scope="row">사진</th>
					<td style="padding-bottom:5px;">
						<img :src="viewModel.list2.file_path " style="width:auto;max-height:300px;">
					</td>
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
import Modal from '../popup/modal.vue'

export default {
	components: {
		Pager, Modal
	},
	data: function () {
		return {
			id : 0,
			viewModel:{
				list:[],
				list2:{},
				keyword:"",
				pageNum:0,
				pager: {
					model: {},
					pageNo: 1,
					totalSize: 0,
					rowSize:5,
					blockSize: 5,
					list: [],
					callBack: function (n) {
						this.model.fnSetContents();
					}
				},
			},
		}
	},
	mounted: function () {
	},
	methods: {
		fnInit: function(id) {
			let vm = this;
			Modal.methods.fnInit();
			// this.fnSetContents(id);
			vm.id = id;
			this.fnList(id);
		},
		fnList: function(){
			let vt = this;
			let vm = this.viewModel;
			let data = {
					mapperId: 'do.bestList',
					uid: vt.id,
					pageNo:0
				};
				Axios.post("/list",data).then(function(rs) {
					vm.list2 = rs.data.list[0];
				});
		},
		fnSetContents: function(){
			let vt = this;  
			let vm = this.viewModel;  
			let senddata = {
				mapperId : 'base.selectdeptList',
				totalId : 'base.selectdeptTotalCount',
				pageNo: vm.pager.pageNo, 
				pageSize: vm.pager.rowSize,  
				name: vm.keyword 
			};
			Axios.post("/list", senddata).then(function(response) {
				vm.list = response.data.list;
				vm.pager.totalSize = response.data.totalCNT;
				Pager.props = Pager.methods.createPaging(vm.pager, vt, "list");
			});
		},
		
		fnRowClick : function(item){
			this.$parent.deptuid = item.uid;		
			this.$parent.dept = item.name;
			this.$parent.groupuid = item.group_uid;		
			this.$parent.group = item.group_name;
			
			$('.overlay_mask, .overlay_formbox').hide();
			$('body').removeClass("fix");
			
		},
	}
};
</script>
