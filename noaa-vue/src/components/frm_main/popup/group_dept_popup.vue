<template>
	<modal :pass="{widthObject: 500, popupTitle:'부서 선택'}">
		<template v-slot:contents>
			<input type="text" id="name_filter" title="검색 필터" placeholder="검색 필터" class="full mt10" @keyup="fnChangeFilter()" v-model="title">
			<table class="mt10">
				<caption>부서 선택</caption>
				<thead>
					<tr>
						<th>사업장</th>
						<th>부서명</th>
						<th class="w80">선택</th>
					</tr>
				</thead>
				<tbody>
					<template v-if="viewModel.list.length != 0">
						<tr v-for="(item, i) in viewModel.list" :key="i">
							<td class="tc">{{ item.group_name }}</td>
							<td class="tc">{{ item.name }}</td>
							<td class="w80 tc"><a href="javascript:;" @click="fnSelect(item)" class="btn sm btn-dark1">선택</a></td>
						</tr>
					</template>
					<template v-else>
						<tr><td colspan="6">데이터가 없습니다.</td></tr>
					</template>
				</tbody>
			</table>
		</template>
	</modal>
</template>
<script>
import Axios from 'axios';
import Vue from 'vue'
import Modal from './modal.vue'

export default {
	components: {
		Modal
	},
	data: function () {
		return {
			user: {},
			title: '',
			viewModel:{
				list:[],
				orgList:[],
				keyword:"",
			},
		}
	},
	mounted: function () {
		let vt = this;
		vt.title = '';
	},
	methods: {
		fnInit: function() {
			let vt = this;
			vt.user = vt.$store.state.global.userInfo;
			Modal.methods.fnInit();
			vt.fnSetContents();
		},
		fnSetContents: function(){
			let vt = this;  
			let vm = this.viewModel;  
			let senddata = {
				mapperId: 'comm.selectDeptList',
				group_uid: vt.user.user_group_id,
			};
			Axios.post("/list", senddata).then(function(response) {
				vm.list = response.data.list;
				vm.orgList = response.data.list;
			});
		},
		fnSelect  : function(item){
			let vt = this;
			vt.$parent.item.dept_uid = item.uid;		
			vt.$parent.item.dept_name = item.name;

			// if(vt.gbn == "checklist"){
			// 	vt.$parent.fnChecklistData();
			// }
			
			$('.overlay_mask, .overlay_formbox').hide();
			$('body').removeClass("fix");
			
		},fnChangeFilter: function(){
			let vt = this;
			let vm = this.viewModel; 
			vm.list = vm.orgList.filter(data => data.name.includes(vt.title));
		},
	}
};
</script>
