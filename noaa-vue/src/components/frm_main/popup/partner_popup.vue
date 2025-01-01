<template>
	<modal :pass="{widthObject: 500, popupTitle: company_name}">
		<template v-slot:contents>
			<table class="table pop">
				<tbody>
					<tr>
						<th scope="row">상주여부</th>
						<td>{{ cat1 }}</td>
					</tr>
					<tr>
						<th scope="row">업체명</th>
						<td>{{ company_name }}</td>
					</tr>
					<tr>
						<th scope="row">사업장관리번호</th>
						<td>{{ business_work_no }}</td>
					</tr>
					<tr>
						<th scope="row">사업자개시번호</th>
						<td>{{ business_no }}</td>
					</tr>
					<tr>
						<th scope="row">현장대표</th>
						<td>{{ owner }}</td>
					</tr>
					<tr>
						<th scope="row">대표자 연락처</th>
						<td>{{ hp }}</td>
					</tr>
					<tr>
						<th scope="row">주소</th>
						<td>{{ addr }}</td>
					</tr>
					<tr>
						<th scope="row">이메일 주소</th>
						<td>{{ email }}</td>
					</tr>
					<tr>
						<th scope="row">근로자 수</th>
						<td colspan="3">{{ work_count }}</td>
					</tr>
				</tbody>
			</table>
		</template>
	</modal>
</template>
<style>
.close:after {content: "\00d7"; font-size:25pt;line-height:45px;}
.PDF_icon {border: 1px solid #e18888;font-size: 10px;padding: 3px 4px 1px 4px;background: #f3a4a4;color: #fff;border-radius: 6px;}
.JPG_icon {border: 1px solid #a78c09;font-size: 10px;padding: 3px 4px 1px 4px;background: #c78a1a;color: #fff;border-radius: 6px;}
.XLSX_icon {border: 1px solid #0f700d;font-size: 10px;padding: 3px 4px 1px 4px;background: #388961;color: #fff;border-radius: 6px;}
</style>
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
			cat1 :"",
			company_name:"",
			business_work_no:"",
			business_no:"",
			owner:"",
			hp:"",
			addr:"",
			email:"",
			work_count:0,
			viewModel:{
				uid:"",
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
		console.log('partner-popup')
	},
	methods: {
		fnInit: function(id) {
			Modal.methods.fnInit();
			this.viewModel.uid = id;
			this.fnSetContents(id);
		},
		fnSetContents: function(){
			let vt = this;  
			let vm = this.viewModel;  
			let senddata = {
				mapperId : 'subcontract.partnerPopupList',
				totalId : 'base.selectdeptTotalCount',
				pageNo: 1, 
				pageSize: 10,  
				uid: vm.uid 
			};
			Axios.post("/list", senddata).then(function(response) {
				vm.list = response.data.list;
				console.log(vm.list);
				vt.cat1 = vm.list[0].cat1;
				vt.company_name = vm.list[0].company_name;
				vt.business_work_no= vm.list[0].business_work_no;
				vt.business_no= vm.list[0].business_no;
				vt.owner= vm.list[0].owner;
				vt.hp= vm.list[0].hp;
				vt.addr= vm.list[0].addr;
				vt.email= vm.list[0].email;
				vt.work_count= vm.list[0].work_count;
				// vm.pager.totalSize = response.data.totalCNT;
				// Pager.props = Pager.methods.createPaging(vm.pager, vt, "list");
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
