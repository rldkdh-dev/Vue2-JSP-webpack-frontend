<template>
	<modal :pass="{widthObject: 500, popupTitle:'공정 선택'}">
		<template v-slot:contents>
			<input type="text" id="name_filter" title="검색 필터" placeholder="검색 필터" class="full mt10" @keyup="fnChangeFilter()" v-model="title">
			<table class="mt10">
				<caption>변경내역</caption>
				<thead>
					<tr>
						<th scope="col">공정명</th>
						<th scope="col">선택</th>
					</tr>
				</thead>
				<tbody>
					<template v-if="viewModel.list.length != 0">
						<tr v-for="(item, i) in viewModel.list" :key="i">
							<td class="tc">{{item.title}}</td>
							<td class="w80 tc"><a href="javascript:;" @click="fnSelect(item)" class="btn sm btn-dark1">선택</a></td>
							<!-- onclick="select_psm_process(item.uid, item.title);" -->
						</tr>
					</template>
					<template v-else>
						<tr><td colspan="2">데이터가 없습니다.</td></tr>
					</template>
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

export default {
	components: {
		Pager, Modal
	},
	data: function () {
		return {
			title: '',
			viewModel:{
				list:[],
				orgList:[],
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
		fnInit: function() {
			Modal.methods.fnInit();
			this.fnSetContents();
		},
		fnSetContents: function(){
			let vt = this;  
			let vm = this.viewModel;  
			let senddata = {
				mapperId : 'safeGuideline.selectSgCat2List', 
				name: vm.keyword 
			};
			Axios.post("/list", senddata).then(function(response) {
				vm.list = response.data.list;
				vm.orgList = response.data.list;
			});
		},
		fnSelect  : function(item){
			this.$parent.viewModel.item.select_sg_busi = item.uid;		
			this.$parent.viewModel.item.title = item.title;
			
			$('.overlay_mask, .overlay_formbox').hide();
			$('body').removeClass("fix");
			
		},fnChangeFilter: function(){
			let vt = this;
			let vm = this.viewModel; 
			vm.list = vm.orgList.filter(data => data.title.includes(vt.title));
		},
	}
};
</script>
