<template>
	<modal :pass="{popupTitle: (pass.title == undefined ? '사용자' : pass.title) + ' 정보'}">
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
				<table class="table" v-if="pass.bplc_yn == 'Y'">
					<caption>사용자 목록</caption>
					<thead>
						<tr>
							<th scope="col" v-if="pass.multi == 'Y'">	
								<input type="checkbox" title="전체 선택" v-model="allSelected">
							</th>
							<!-- <th scope="col">현장명</th>
							<th scope="col">팀명</th> -->
							<th scope="col">이름</th>
							<!-- <th scope="col">직급</th> -->
							<th scope="col">직책</th>
							<th scope="col" v-if="pass.multi != 'Y'"></th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="item in userList" :key="item">
							<td v-if="pass.multi == 'Y'">
								<input type="checkbox" title="선택" :value="item" :id="item" v-model="checkList">
							</td>
							<!-- <td>{{ item.dept_nm }}</td>
							<td>{{ item.team_nm }}</td> -->
							<td>{{ item.user_nm }}</td>
							<!-- <td>{{ item.jbgd_nm }}</td> -->
							<td>{{ item.jbttl_nm }}</td>
							<td v-if="pass.multi != 'Y'">
								<button class="btn btn-small btn-default" @click="fnUserAdd(item)"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-checklist"></use></svg>선택</button>
							</td>
						</tr>
					</tbody>
				</table>
				<table class="table" v-else>
					<caption>사용자 목록</caption>
					<thead>
						<tr>
							<th scope="col" v-if="pass.multi == 'Y'">	
								<input type="checkbox" title="전체 선택" v-model="allSelected">
							</th>
							<th scope="col">부서명</th>
							<th scope="col">팀명</th>
							<th scope="col">이름</th>
							<!-- <th scope="col">직급</th> -->
							<th scope="col">직책</th>
							<th scope="col" v-if="pass.multi != 'Y'"></th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="item in userList" :key="item">
							<td v-if="pass.multi == 'Y'">
								<input type="checkbox" title="선택" :value="item" :id="item" v-model="checkList">
							</td>
							<td>{{ item.dept_nm }}</td>
							<td>{{ item.team_nm }}</td>
							<td>{{ item.user_nm }}</td>
							<!-- <td>{{ item.jbgd_nm }}</td> -->
							<td>{{ item.jbttl_nm }}</td>
							<td v-if="pass.multi != 'Y'">
								<button class="btn btn-small btn-default" @click="fnUserAdd(item)"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-checklist"></use></svg>선택</button>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
			<div class="btn-group" v-if="pass.multi == 'Y'">
				<div class="right_side">
					<button @click="fnMultUserAdd();" class="btn btn-purple">선택</button>
				</div>
			</div>
		</template>
	</modal>
</template>
<script>
import Axios from 'axios';
import Vue from 'vue'
import Common from '../../common.js'
import Modal from './modal.vue'

export default {
	props: ['pass'],
	components: {
		Modal
	},
	data: function () {
		return {
			checkList:[],
			deptList:[],
			userList:[],
			userOrgList:[],
			select_dept:'',
			viewUserList:'',
			user_name:'',
			keyword:"",
			pageNum:0,
			positions: {
				clientX: undefined,
				clientY: undefined,
				movementX: 0,
				movementY: 0
			},
			search: '',
		}
	},
	computed: {
		allSelected: {
			//getter
			get: function() {
				return this.userList.length != 0 ? this.userList.length === this.checkList.length : [];
			},
			//setter
			set: function(e) {
				this.checkList = e ? this.userList : [];
			},
		},
	}, 
	mounted: function () {
	},
	methods: {
		fnInit: function() {
			Modal.methods.fnInit();
			// console.log(this.pass.bplc_sn);
			this.fnList();
		},
		fnList: function() {
			let vm = this;
			let mapperNm = '';

			if(vm.pass.bplc_yn == 'Y'){
				mapperNm = 'comm.selectBplcUserList';
			}else{
				mapperNm = 'comm.selectUserList';
			}
			
			let data = {
				mapperId: mapperNm,
				team_sn: vm.pass.team_sn,
				dept_sn: vm.pass.dept_sn,
				bplc_yn: vm.pass.bplc_yn,
				bplc_sn: vm.pass.bplc_sn,
				edu_yn: vm.pass.edu_yn,
				wrk_yn: vm.pass.wrk_yn
			};
			if(vm.pass.ocpt_detail_cd == 3){
				data.ocpt_detail_cd = 'Y';
				data.bplc_yn = '';
				data.edu_yn = 'Y';
			}else if(vm.pass.ocpt_detail_cd == 2){
				data.ocpt_detail_cd = 'Y';
				data.bplc_yn = '';
				data.edu_yn = 'Y';
			}else if(vm.pass.ocpt_detail_cd == 1){	//현장관리자만 조회
				data.ocpt_detail_cd = 'Y';
			}else if(vm.pass.ocpt_detail_cd == 4){	//~~~반장만으로 조회
				data.ocpt_detail_cd = '4';
			}else if(vm.pass.ocpt_detail_cd == 5){	//팀원(근로자, 장비운전원)만 조회
				data.ocpt_detail_cd = '5';
			}

			//본사관리자
			if(vm.pass.hdofc_mngr_yn != null){
				data.hdofc_mngr_yn = vm.pass.hdofc_mngr_yn;
			}
			
			Axios.post("/list.do",data).then(function(rs) {
				vm.userList = rs.data.list;
				vm.userOrgList = rs.data.list;
			});
		},
		fnFilter:function(){
			let vm = this;
			//일치하는 항목 필터
			vm.userList = vm.userOrgList.filter(data => data.user_nm.includes(vm.search));
		},
		fnUserAdd:function(item) {
			let vm = this;
			//부모창에 선택한 값 전달
			vm.$parent.fnMemberAdd(item);
			//팝업 초기화
			vm.$parent.userPop = false;
		},
		fnMultUserAdd: function(){
			let vm = this;
			//부모창에 선택한 값 전달
			vm.$parent.fnMultiMemberAdd(vm.checkList);
			//팝업 초기화
			vm.$parent.userPop = false;
		},
	}
	
};
</script>
