<template>
	<modal :pass="{widthObject: 500, popupTitle:'변경내역'}">
		<template v-slot:contents>
			<input type="text" id="name_filter" title="검색 필터" placeholder="검색 필터" class="full mt10" autocomplete="no">
			<table class="mt10">
				<caption>변경내역</caption>
				<thead>
					<tr>
						<th scope="col">사유</th>
						<th scope="col">변경자</th>
						<th scope="col" class="w100">변경일</th>
					</tr>
				</thead>
				<tbody>
					<!-- <?php foreach ($list['list'] as $row) { ?> -->
					<tr>
						<td class="tl"><?=nl2br($row['content'])?></td>
						<td class="tc"><?=$row['dept_name']?> <?=$row['mb_name']?></td>
						<td class="tc"><?=convertDatetime($row['regdt'], "Y-m-d")?></td>
					</tr>
				</tbody>
				<tfoot>
					<tr><td colspan="3">데이터가 없습니다.</td></tr>
				</tfoot>
			</table>
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
				list:[],
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
		console.log('dept-popup')
	},
	methods: {
		fnInit: function(id) {
			Modal.methods.fnInit();
			this.fnSetContents(id);
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
