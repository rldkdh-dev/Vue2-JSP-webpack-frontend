<template>
	<modal :pass="{widthObject: 500, popupTitle: (viewModel.ptw_no != 4 ? viewModel.ptw_no+'차 승인' : '작업완료')}">
		<template v-slot:contents>
			<div v-if="viewModel.ptw_no != 4">
				<p class="table-title">{{viewModel.ptw_no}}차승인</p>
				<table class="table">
					<tbody>
						<tr>
							<th scope="row" style="width:120px;">승인자</th>
							<td>{{ user.user_dept }} {{ user.job_name }} {{ user.user_name }}</td>
						</tr>
						<tr>
							<th scope="row">승인</th>
							<td>
								<div v-if="viewModel.data.step == viewModel.ptw_no">
									<input type="button" value="승인취소" class="btn btn-danger" @click="fnCancel(viewModel.ptw_no)">
								</div>
								<div v-else-if="(viewModel.data.step+1) == viewModel.ptw_no">
									<input type="button" value="승인" class="btn btn-save btn-primary"  @click="fnAppr(viewModel.ptw_no)">
								</div>
								<div v-else>
									<span>승인완료</span>
								</div>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
			<div v-else>
				<p class="table-title">작업완료</p>
				<table class="table">
					<tbody v-if="viewModel.data.step == viewModel.ptw_no">
						<tr>
							<th scope="row" style="width:120px;">승인자</th>
							<td>{{ viewModel.dataFList[0].dept_name }} {{ viewModel.dataFList[0].job_name }} {{ viewModel.dataFList[0].user_name }}</td>
						</tr>
						<tr>
							<th scope="row">승인</th>
							<td>
								<input type="button" value="승인취소" class="btn btn-danger" @click="fnCancel(viewModel.ptw_no)">
							</td>
						</tr>
						<tr>
							<th scope="row">승인완료시간</th>
							<td>
								{{ viewModel.dataFList[0].regdt }}
							</td>
						</tr>
					</tbody>
					<tbody v-else-if="viewModel.data.step != viewModel.ptw_no">
						<tr>
							<th scope="row" style="width:120px;">승인자</th>
							<td>{{ user.user_dept }} {{ user.job_name }} {{ user.user_name }}</td>
						</tr>
						<tr>
							<th scope="row">승인</th>
							<td>
								<input type="button" value="승인" class="btn btn-save btn-primary"  @click="fnAppr(viewModel.ptw_no)">
							</td>
						</tr>
					</tbody>
					<!-- <tbody>
						<tr>
							<th scope="row" style="width:120px;">승인자</th>
							<td>{{ user.user_dept }} {{ user.job_name }} {{ user.user_name }}</td>
						</tr>
						<tr>
							<th scope="row">승인</th>
							<td>
								<div v-if="viewModel.data.step == viewModel.ptw_no">
									<input type="button" value="승인취소" class="btn btn-danger" @click="fnCancel(viewModel.ptw_no)">
								</div>
								<div v-else-if="viewModel.data.step != viewModel.ptw_no">
									<input type="button" value="승인" class="btn btn-save btn-primary"  @click="fnAppr(viewModel.ptw_no)">
								</div>
								<div v-else>
									<span>승인완료</span>
								</div>
							</td>
						</tr>
					</tbody> -->
				</table>
			</div>
			<div v-for="(item, index) in viewModel.dataList" :key="item">
				<p class="table-title mt20">{{item.step}}차승인 정보</p>
				<table class="table">
					<tbody>
						<tr>
							<th scope="row" style="width:120px;">승인자</th>
							<td>{{ item.user_name }}</td>
						</tr>
						<tr>
							<th scope="row">승인완료시간</th>
							<td>{{ item.regdt }}</td>
						</tr>
					</tbody>
				</table>
			</div>

			<p class="table-title mt20">작업허가신청 정보</p>
			<table>
				<tbody class="table">
					<tr>
						<th scope="row">작업명</th>
						<td colspan="3">{{ viewModel.data.title }}</td>
					</tr>
					<tr>
						<th scope="row" style="width:120px;">작업허가서</th>
						<td>{{ viewModel.data.subject }}</td>
						<th scope="row" style="width:120px;">설비명</th>
						<td>{{ viewModel.data.plant }}</td>
					</tr>
					<tr>
						<th scope="row">작업 수행일</th>
						<td colspan="3">{{ viewModel.data.sdt }} {{ viewModel.data.stime }} ~ {{ viewModel.data.edt }} {{ viewModel.data.etime }}</td>
					</tr>
					<tr>
						<th scope="row">작업자 투입 인력</th>
						<td>{{ viewModel.data.pcount }}명</td>
						<th scope="row">협력업체명</th>
						<td>{{ viewModel.data.partner }}</td>
					</tr>
					<tr>
						<th scope="row">작업 내용</th>
						<td colspan="3">{{ viewModel.data.contents }}</td>
					</tr>
					<tr>
						<th scope="row">비상대피소</th>
						<td colspan="3">{{  viewModel.data.exit_name }}</td>
					</tr>
				</tbody>
			</table> 
		</template>
	</modal>
</template>
<script>
import Axios from 'axios';
import Vue from 'vue'
import Common from '../../common.js';
import Pager from '../../paging.vue'
import Modal from './modal.vue'

export default {
	components: {
		Pager, Modal
	},
	data: function () {
		return {
			user:{},
			viewModel:{
				dataList:[],
				dataFList:[],
				data:{},
				keyword:"",
				pageNum:0,
				ptw_no:0,
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
		fnInit: function(item, no) {
			let vt = this;
			let vm = this.viewModel;
			vm.ptw_no = no;
			vm.dataList = [];
			vm.dataFList = [];

			vt.user = this.$store.state.global.userInfo;

			Modal.methods.fnInit();
			vt.fnSetContents(item);
		},
		fnSetContents: function(item){
			let vt = this;
			let vm = this.viewModel;

			let data = {
				mapperId: ['ptw.selectPtwList', 'ptw.selectPtwDataList'],
				uid: item.uid,
				pm_uid: item.docno,
				step: vm.ptw_no
			};

			Axios.post("/multiList",data).then(function(rs) {
				vm.data = rs.data.list1[0];
				let tempList = rs.data.list2;

				for(var i=0;i<tempList.length;i++){
					tempList[i].regdt = Common.fnConvertDateTimeStr(tempList[i].regdt);
					if(tempList[i].step == 4){
						vm.dataFList.push(tempList[i]);
					}else{
						vm.dataList.push(tempList[i]);
					}
				}
			});
		},
		fnRowClick : function(item){			
			$('.overlay_mask, .overlay_formbox').hide();
			$('body').removeClass("fix");
			
		},
		fnCancel: function(step){
			let vt = this;  
			let vm = this.viewModel;  
			let data = {
				mapperId: 'ptw.deletePtwData',
				pm_uid: vm.data.docno,
				step: vm.ptw_no,
			};
			if(confirm("삭제하시겠습니까?")) {
				Axios.post("/delete", data)
				.then(function(rs) {
					$('.overlay_mask, .overlay_formbox').hide();
					$('body').removeClass("fix");

					vt.$parent.fnList(0);
				});
			}
		},
		fnAppr: function(step){
			let vt = this;  
			let vm = this.viewModel;  
			let data = {
				mapperId: 'ptw.insertPtwData',
				pm_uid: vm.data.docno,
				step: vm.ptw_no,
				memberuid: vt.user.memberuid
			};
			if(confirm("승인하시겠습니까?")) {
				Axios.post("/insert", data)
				.then(function(rs) {
					$('.overlay_mask, .overlay_formbox').hide();
					$('body').removeClass("fix");

					vt.$parent.fnList(0);
				});
			}
		}
	}
};
</script>

