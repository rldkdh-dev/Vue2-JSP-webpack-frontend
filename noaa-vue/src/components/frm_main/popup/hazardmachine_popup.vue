<template>
	<modal :pass="{widthObject: 900, popupTitle:'유해위험기계기구 선택'}">
		<template v-slot:contents>
			<div class="search-area mb10">
                <input type="text" id="name" class="w200" v-model='viewModel.keyword' placeholder="종류를 입력하세요">
                <button type="button" id="btn_search_item" class="btn btn-dark" @click="fnSetContents();">검색</button>
            </div>

            <table>
                <caption>유해위험기계기구 목록</caption>
                <thead>
					<tr>
						<th scope="col">분류</th>
						<th scope="col">종류</th>
						<th scope="col">형식</th>
						<th scope="col">장비번호 (차량번호)</th>
						<th scope="col">점검표</th>
						<th scope="col">선택</th>
					</tr>
				</thead>
				<tbody>
					<template v-if="viewModel.list.length != 0">
						<tr v-for="item in viewModel.list" :key="item.uid">
							<td>{{item.cat1}}</td>
							<td>{{item.cat2}}</td>
							<td>{{item.em_type}}</td>
							<td>{{item.em_no}}</td>
							<td>{{item.subject}}</td>
							<td class="tc"><a href="" class="btn sm btn-dark1" :value="item.uid" @click.prevent="fnRowClick(item)">선택</a></td>
						</tr>
					</template>
					<template v-else>
						<tr><td colspan="6" v-if="viewModel.list == null">검색 결과가 없습니다.</td></tr>
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
			viewModel:{
				list:[],
				keyword:"",
			},
		}
	},
	mounted: function () {
		//console.log('hazardmachine-popup')
	},
	methods: {
		fnInit: function() {
			Modal.methods.fnInit();
			this.fnSetContents();
		},
		fnSetContents: function(){
			let vt = this;  
			let vm = this.viewModel;  
			let data = {
				mapperId: 'hazardMachine.hazardList',
				name: vm.keyword 
			};
			Axios.post("/list", data).then(function(response) {
				//console.log(response.data)
				vm.list = response.data.list;

				if(vm.keyword != ''){
					vm.list = vm.list.filter(data => data.cat2.includes(vm.keyword));
				}
			});
		},
		fnRowClick : function(item){
			this.$parent.viewModel.item.eq_uid = item.uid;
			this.$parent.viewModel.item.em_no = item.em_no;
			this.$parent.viewModel.item.em_type = item.em_type;
			this.$parent.viewModel.item.cat = item.cat1;
			
			this.$parent.isPop = false;
			$('.overlay_mask, .overlay_formbox').hide();
			$('body').removeClass("fix");
			
		},
	}
};
</script>
