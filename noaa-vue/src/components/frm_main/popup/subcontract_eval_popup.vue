<template>
	<modal :pass="{widthObject: 500, popupTitle: title}">
		<template v-slot:contents>
			<h2></h2>
			<div class="clearfix">
				<p class="fl">승인자 : {{ state_name }}</p>
			</div>

			<table id="tbl_checklist" class="light">
				<caption>계획평가</caption>
				<thead>
					<tr>
						<th scope="col">항목</th>
						<th scope="col" class="w50">배점</th>
						<th scope="col" class="w60">득점</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="(item , ind) in viewModel.list" :key="item.uid">
						<td class="tl">{{ item.sublist }}</td>
						<td>{{ item.point }}</td>
						<td v-if="item.regdt != undefined && item.base_point != 0" class="np">
							<select title="득점" :value="item.base_point" @change="fnpointsum(ind,$event.target.value)" :disabled="item.state1 != 0 ? true:false"> <!--disabled-->
								<option v-for="i in item.point" :key="i" :value="i">{{ i }}</option>
							</select>
						</td>
						<td v-else class="np">
							<select title="득점" :value="item.base_point" @change="fnpointsum(ind,$event.target.value)" :disabled="item.state1 != 0 ? true:false">
								<option value="0">득점</option>
								<option v-for="i in item.point" :key="i" :value="i">{{ i }}</option>
							</select>
						</td>
					</tr>
				</tbody>
				<tfoot>
					<tr>
						<td>합계</td>
						<td>100</td>
						<td><span id="dpoint_sum">{{ sum }}</span></td>
					</tr>
				</tfoot>
			</table>
			<div class="buttonbox mt10">
				<input v-if="state == 0" type="button" class="btn" value="임시저장" @click="fnsubiteminsert(0)">
				<input v-if="state == 0" type="button" class="btn btn-primary" value="승인요청" @click="fnsubiteminsert(1)">
				<input v-if="state == 1 && state_memberuid == viewModel.list[0].memberuid" type="button" class="btn btn-dark" value="승인요청취소" @click="fnrequestcancel(0)">
				<input v-if="state == 1 && state_memberuid == viewModel.list[0].state_memberuid" type="button" class="btn btn-primary" value="승인완료" @click="fndone(2)">
				<input v-if="state == 2 && state_memberuid == viewModel.list[0].state_memberuid" type="button" class="btn btn-dark" value="승인취소" @click="fndonecancel(1)">
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
			state_memberuid:0,
			state_name:"",
			test:"",
			sum:0,
			state:0,
			uid:"",
			title:"",
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
			this.state_memberuid = this.$store.state.global.userInfo.memberuid
			this.fnSetContents(id);
		},
		fnSetContents: function(){
			let vt = this;  
			let vm = this.viewModel;  
			let senddata = {
				mapperId : 'subcontract.selectsubevallist',
				totalId : 'base.selectdeptTotalCount',
				pageNo: vm.pager.pageNo, 
				pageSize: vm.pager.rowSize,  
				uid: vt.uid
			};
			vt.sum=0;
			Axios.post("/list", senddata).then(function(response) {
				vm.list = response.data.list;
				vt.title = vm.list[0].cat1;
				vt.state = vm.list[0].state1;
				vt.state_name = vm.list[0].state_name;
				for(var i=0; i<vm.list.length; i++){
					if(vm.list[i].base_point == undefined){
						vm.list[i].base_point = 0;
					}else{
						vt.sum += vm.list[i].base_point;
					}
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
		fnpointsum:function(i,n){
			let vm = this;
			var value = parseInt(n);
			for(var j=0; j<vm.viewModel.list.length; j++){
				if(j == i){
					vm.sum = vm.sum - vm.viewModel.list[j].base_point;
					vm.viewModel.list[j].base_point = value;
					vm.sum += vm.viewModel.list[j].base_point;
				}
			}
		},
		fnsubiteminsert:function(state){
			//  임시저장 승인요청 
			if(this.viewModel.list[0].regdt != undefined){
				// for(var i=0; i<this.viewModel.list.length; i++){
					var send={
						mapperId:'subcontract.subpopupupdate',
						sc_uid:this.viewModel.list[0].uid,
						score_uid:this.viewModel.list[0].score1_uid,
						// score_item_uid:this.viewModel.list[i].item_uid,
						memberuid:this.viewModel.list[0].memberuid,
						// point:this.viewModel.list[i].point,
						// title:this.viewModel.list[i].sublist,
						// base_point:this.viewModel.list[i].base_point,
						list: this.viewModel.list,
						state:state,
						uid:this.uid,
						// sub_uid:this.viewModel.list[i].sub_uid,
					}
					Axios.post("/update",send)
					.then(function(res){
						window.location.href="/do/subcontract";
					})
				// }
			}else{
				// for(var i=0; i<this.viewModel.list.length; i++){
					var send={
						mapperId:'subcontract.subpopupinsert',
						sc_uid:this.viewModel.list[0].uid,
						score_uid:this.viewModel.list[0].score1_uid,
						// score_item_uid:this.viewModel.list[i].item_uid,
						memberuid:this.viewModel.list[0].memberuid,
						// point:this.viewModel.list[i].point,
						// title:this.viewModel.list[i].sublist,
						// base_point:this.viewModel.list[i].base_point,
						list:this.viewModel.list,
						state:state,
						uid:this.uid,
					}
					Axios.post("/insert",send)
					.then(function(res){
						window.location.href="/do/subcontract";
					})
				// }
			}

			$('.overlay_mask, .overlay_formbox').hide();
			$('body').removeClass("fix");
			// window.location.href="/do/subcontract"
		},
		fnrequestcancel:function(state){
			// 요청 취소 
			let send={
				mapperId:'subcontract.subpopupcancelupdate',
				state:state,
				uid:this.uid,
			}
			Axios.post("/update",send)
			.then(function(res){
				window.location.href="/do/subcontract"
			})
			
		},
		fndone:function(state){
			let vm = this;
			//승인요청 
			let send={
				mapperId:'subcontract.subpopupdoneupdate',
				state:state,
				uid:this.uid,
			}
			Axios.post("/update",send)
			.then(function(res){
				window.location.href="/do/subcontract"
			})
		},
		fndonecancel:function(state){
			// 승인 취소 
			let send={
				mapperId:'subcontract.subpopupdonecancelupdate',
				state:state,
				uid:this.uid,
			}
			Axios.post("/update",send)
			.then(function(res){
				window.location.href="/do/subcontract"
			})
		}

	}
};
</script>
