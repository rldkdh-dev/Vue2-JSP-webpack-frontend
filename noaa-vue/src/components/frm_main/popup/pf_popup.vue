<template>
	<modal :pass="{widthObject: 800, popupTitle:'설비 선택'}">
		<template v-slot:contents>
			<input type="text" id="name_filter" title="설비명 검색 필터" placeholder="설비명 검색 필터" class="full mt10" @keyup="fnChangeFilter()" v-model="title">
			<table class="mt10">
				<caption>설비 선택</caption>
				<thead>
					<tr>
						<th class="w200">대분류</th>
						<th class="w200">소분류</th>
						<th class="w100">설비번호</th>
						<th>설비명</th>
						<th>점검표</th>
						<th class="w80">선택</th>
					</tr>
				</thead>
				<tbody>
					<template v-if="viewModel.list.length != 0">
						<tr v-for="(item, i) in viewModel.list" :key="i">
							<td class="tc">{{ item.cat1 }}</td>
							<td class="tc">{{ item.cat2 }}</td>
							<td>{{ item.fcno }}</td>
							<td class="tl">{{ item.title }}</td>
							<td class="w120">{{ item.checklist_items }}</td>
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
			gbn: '',
			title: '',
			viewModel:{
				list:[],
				orgList:[],
				keyword:"",
			},
		}
	},
	mounted: function () {
		
	},
	methods: {
		fnInit: function(gbn) {
			let vt = this;
			Modal.methods.fnInit();
			vt.fnSetContents();
			vt.gbn = gbn;
		},
		fnSetContents: function(){
			let vt = this;  
			let vm = this.viewModel;  
			let senddata = {
				mapperId : 'faci.selectFacilityList' 
			};
			Axios.post("/list", senddata).then(function(response) {
				vm.list = response.data.list;
				vm.orgList = response.data.list;
			});
		},
		fnSelect  : function(item){
			let vt = this;
			vt.$parent.viewModel.item.pf_uid = item.uid;		
			vt.$parent.viewModel.item.fc_pf_name = item.title;
			vt.$parent.viewModel.item.check_cycle = item.check_cycle;
			vt.$parent.viewModel.item.repair_type = item.repair_type;
			vt.$parent.viewModel.item.use_dept_name = item.use_dept_name;
			vt.$parent.viewModel.item.area = item.area;

			if(vt.gbn == "checklist"){
				vt.$parent.fnChecklistData();
			}
			
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
