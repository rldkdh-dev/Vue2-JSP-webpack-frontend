<template>
	<modal :pass="{widthObject: 500, popupTitle:'test'}">
		<template v-slot:contents>
			<table>
				<caption>도급업체안전보건관리</caption>
				<tbody>
					<tr>
						<th scope="row" style="width:110px;">공사명(품의명)</th>
						<td>{{ subject }}</td>
						<th scope="row" style="width:120px;">분류</th>
						<td>{{ cat }}</td>
					</tr>
					<tr>
						<th scope="row">업체명</th>
						<td>{{ company_name }}</td>
						<th scope="row">사업자등록번호</th>
						<td>{{ docno }}</td>
					</tr>
					<tr>
						<th scope="row">계약일</th>
						<td>{{ contract_date }}</td>
						<th scope="row">계약담당자</th>
						<td>{{ contract_name }}</td>
					</tr>
					<tr>
						<th scope="row">품의일</th>
						<td></td>
						<th scope="row">공사기간 종료일</th>
						<td></td>
					</tr>
					<tr>
						<th scope="row">공사비</th>
						<td>{{ price_contract }}</td>
						<th scope="row">산업안전관리비</th>
						<td>{{ price_safety }}</td>
					</tr>
					<tr>
						<th scope="row">계획승인자</th>
						<td colspan="3">{{ state_name }}</td>
					</tr>
					<tr>
						<th scope="row">실적승인자</th>
						<td colspan="3">{{ state_name }}</td>
					</tr>
				</tbody>
			</table>
			
			<!-- <ul class="tabs mt20 state<?=$view['state2']?>"> -->
			<ul class="tabs mt20">				
				<li v-if="state1 != 0" rel="tab1" :class="active1"><button type="button" @click="fntabclick(0)">계획평가</button></li>
				<li v-if="state2 != 0" rel="tab2" :class="active2"><button type="button" @click="fntabclick(1)">실적평가</button></li>
			</ul>

			<div v-if="state1 != 0 && active1 == 'active'" id="tab1" class="tab_content">
				<table>
					<thead>
					<tr>
						<th>항목</th>
						<th class="w50">배점</th>
						<th class="w60">득점</th>
					</tr>
					</thead>
					<tbody>
					<tr v-for="item in list1" :key="item.title">
						<td class="tl">{{ item.title }}</td>
						<td>{{ item.point }}</td>
						<td>{{ item.base_point }}</td>
					</tr>
					</tbody>
					<tfoot>
						<tr>
							<td>합계</td>
							<td>100</td>
							<td><span id="dpoint_sum">{{ sum1 }}</span></td>
						</tr>
					</tfoot>
				</table>
				<!-- <div class="tc"><a href="e01_data_export.php?uid=<?=$uid?>&type=1" class="btn btn-icon btn-light mt15"><img src="/_asset/img/common_x/icon_excel.png"  class="inline-block" style="width:23px;height: 23px;margin-top: 2px;margin-right: 6px;"><span class="inline-block vat">계획평가 출력</span></a></div> -->
			</div>

			<div v-if="state2 != 0 && active2 == 'active'" id="tab2" class="tab_content">
				<table>
					<thead>
					<tr>
						<th>항목</th>
						<th class="w50">배점</th>
						<th class="w60">득점</th>
					</tr>
					</thead>
					<tbody>
					<tr v-for="items in list2" :key="items.title">
						<td class="tl">{{ items.title }}</td>
						<td>{{ items.point }}</td>
						<td>{{ items.base_point }}</td>
					</tr>
					</tbody>
					<tfoot>
						<tr>
							<td>합계</td>
							<td>100</td>
							<td><span id="dpoint_sum">{{ sum2 }}</span></td>
						</tr>
					</tfoot>
				</table>
				<!-- <div class="tc"><a href="e01_data_export.php?uid=<?=$uid?>&type=2" class="btn btn-icon btn-light mt15"><img src="" class="inline-block" style="width:23px;height: 23px;margin-top: 2px;margin-right: 6px;"><span class="inline-block vat">실적평가 출력</span></a></div> -->
			</div>
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
			sum1:0,
			sum2:0,
			list:[],
			list1:[],
			list2:[],
			active1:"active",
			active2:"",
			uid:"",
			subject:"",
			docno:"",
			cat:"",
			company_name:"",
			contract_date:"",
			start_date:"",
			end_date:"",
			price_contract:0,
			price_safety:0,
			state_name:"",
			contract_name:"",
			state1:0,
			state2:0,
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
			this.uid = id;
			this.fnSetContents(id);
		},
		fnSetContents: function(){
			let vt = this;  
			let vm = this.viewModel;  
			let senddata = {
				mapperId : 'subcontract.selectsubpopup3',
				totalId : 'base.selectdeptTotalCount',
				pageNo: vm.pager.pageNo, 
				pageSize: vm.pager.rowSize,  
				uid: vt.uid,
			};
			Axios.post("/list", senddata).then(function(response) {
				vm.list = response.data.list;
				vt.docno = vm.list[0].docno;
				vt.subject = vm.list[0].subject;
				vt.cat = vm.list[0].cat;
				vt.company_name = vm.list[0].company_name;
				vt.contract_date = vm.list[0].contract_date;
				vt.start_date = vm.list[0].start_date;
				vt.end_date = vm.list[0].end_date;
				vt.price_contract =vm.list[0].price_contract;
				vt.price_safety = vm.list[0].price_safety;
				vt.state_name = vm.list[0].state_name;
				vt.contract_name = vm.list[0].contract_name;
				vt.state1 = vm.list[0].state1;
				vt.state2 = vm.list[0].state2;
				if(vm.list[0].state1!=0){
					vt.fnstatelistitem();
				}
				if(vm.list[0].state2!=0){
					vt.fncontractlistitem();
				}
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
		fnstatelistitem:function(){
			let vm = this;

			let senddata = {
				mapperId : 'subcontract.selectsubpopup3list',
				totalId : 'base.selectdeptTotalCount',
				pageNo: 1, 
				pageSize: 10,  
				sc_uid: vm.uid,
				score_uid:vm.viewModel.list[0].score1_uid,
			};

			Axios.post("/list", senddata).then(function(response) {
				vm.list1 = response.data.list;
				for(var i=0; i<vm.list1.length; i++){
					vm.sum1 += vm.list1[i].base_point;
				}
				
			});
		},
		fncontractlistitem:function(){
			let vm = this;

			let senddata = {
				mapperId : 'subcontract.selectsubpopup3list',
				totalId : 'base.selectdeptTotalCount',
				pageNo: 1, 
				pageSize: 10,  
				sc_uid: vm.uid,
				score_uid:vm.viewModel.list[0].score2_uid,
			};

			Axios.post("/list", senddata).then(function(response) {
				vm.list2 = response.data.list;

				for(var i=0; i<vm.list2.length; i++){
					vm.sum2 += vm.list2[i].base_point;
				}
			});
		},
		fntabclick:function(ac){
			let vm = this;
			if(ac == 0){
				vm.active1 = "active"
				vm.active2 = ""
			}else if(ac == 1){
				vm.active2 = "active"
				vm.active1 = ""
			}
			
		}
	}
};
</script>
