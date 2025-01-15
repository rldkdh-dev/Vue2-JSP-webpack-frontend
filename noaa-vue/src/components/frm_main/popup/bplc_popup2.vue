<template>
	<modal :pass="{popupTitle:'현장 정보'}">
		<template v-slot:contents>
			<div>
				<div class="search_area">
					<div>
						<div class="search_container">
							<div class="row input_full">
								<input type="text" placeholder="검색 필터" v-model="search" @keyup="fnFilter();" @input="search=$event.target.value" >
								<button @click="fnFilter" class="btn btn-default"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-search"></use></svg>검색</button>
							</div>
						</div> 
					</div>
				</div>
			</div>
			<div>
				<table class="table">
					<caption>현장 목록</caption>
					<thead>
						<tr>
							<th scope="col">현장명</th>
							<th scope="col">선택</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="item in bplcList">
							<td class="text-left">{{ item.bplc_nm }}</td>
							<td>
								<button class="btn btn-small btn-default" @click="fnBplcAdd(item)"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-checklist"></use></svg>선택</button>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</template>
	</modal>
</template>

<script>
import 'es6-promise/auto'
import Vue from 'vue'
import Axios from 'axios'
import Modal from './modal.vue'
import Pager from "../../paging.vue";

export default{
	props: ['pass'],
    components: {
        Pager, Modal
    },
    data: function () {
        return {
			search:'',
			bplcList:[],
			bplcOrgList:[],
			userInfo:{},
        }
    },
    methods: {
		fnInit: function() {
			Modal.methods.fnInit();
			this.fnList();
		},
		fnList: function() {
			let vm = this;

			let data = {
				mapperId: 'comm.selectAllBplcList',
				team_sn: vm.pass.team_sn,
				dept_sn: vm.pass.dept_sn
			};
			Axios.post("/list.do",data).then(function(rs) {
				vm.bplcList = rs.data.list;
				vm.bplcOrgList = rs.data.list;
			});
		},
		fnFilter:function(){
			let vm = this;
			//일치하는 항목 필터
			vm.bplcList = vm.bplcOrgList.filter(data => data.bplc_nm.includes(vm.search));
		},
		fnBplcAdd:function(item) {
			let vm = this;
			//부모창에 선택한 값 전달
			vm.$parent.fnBplcAdd(item);
			//팝업 초기화
			vm.$parent.bplcPop = false;
		},
    }
}
</script>