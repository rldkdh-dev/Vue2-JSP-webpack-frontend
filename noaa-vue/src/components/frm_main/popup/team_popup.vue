<template>
	<modal :pass="{popupTitle: (pass.title == undefined ? '팀' : pass.title) + ' 정보'}">
		<template v-slot:contents>
			<div>
				<div class="search_area">
					<div>
						<div class="search_container">
							<div class="row input_full">
								<input type="text" placeholder="검색 필터" v-model="search" @keyup="fnFilter();" @input="search=$event.target.value">
								<button @click="fnFilter" class="btn btn-default"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-search"></use></svg>검색</button>
							</div>
						</div> 
					</div>
				</div>
			</div>
			<div>
				<table class="table">
					<caption>팀 목록</caption>
					<thead>
						<tr>
							<th scope="col" v-if="pass.multi == 'Y'">	
								<input type="checkbox" title="전체 선택" v-model="allSelected">
							</th>
							<th scope="col">부서명</th>
							<th scope="col">팀명</th>
							<th scope="col" v-if="pass.multi != 'Y'">선택</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="item in teamList">
							<td v-if="pass.multi == 'Y'">
								<input type="checkbox" title="선택" :value="item" :id="item" v-model="checkList">
							</td>
							<td>{{ item.dept_nm }}</td>
							<td>{{ item.team_nm }}</td>
							<td v-if="pass.multi != 'Y'">
								<button class="btn btn-small btn-default" @click="fnDeptAdd(item)"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-checklist"></use></svg>선택</button>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
			<div class="btn-group" v-if="pass.multi == 'Y'">
				<div class="right_side">
					<button @click="fnMultDeptAdd();" class="btn btn-purple">선택</button>
				</div>
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
			checkList:[],
			teamList:[],
			teamOrgList:[],
        }
    },
	computed: {
		allSelected: {
			//getter
			get: function() {
				return this.teamList.length != 0 ? this.teamList.length === this.checkList.length : [];
			},
			//setter
			set: function(e) {
				this.checkList = e ? this.teamList : [];
			},
		},
	}, 
    methods: {
		fnInit: function() {
			Modal.methods.fnInit();
			this.fnList();
		},
		fnList: function() {
			let vm = this;
			let data = {
				mapperId: 'comm.selectTeamList',   
			};
			Axios.post("/list.do",data).then(function(rs) {
				vm.teamList = rs.data.list;
				vm.teamOrgList = rs.data.list;
			});
		},
		fnFilter:function(){
			let vm = this;
			//일치하는 항목 필터
			vm.teamList = vm.teamOrgList.filter(data => data.team_nm.includes(vm.search));
		},
		fnTeamAdd:function(item) {
			let vm = this;
			//부모창에 선택한 값 전달
			vm.$parent.fnTeamAdd(item);
			//팝업 초기화
			vm.$parent.teamPop = false;
		},
		fnMultTeamAdd: function(){
			let vm = this;
			//부모창에 선택한 값 전달
			vm.$parent.fnMultTeamAdd(vm.checkList);
			//팝업 초기화
			vm.$parent.teamPop = false;
		},
    }
}
</script>