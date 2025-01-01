<template>
	<modal :pass="{widthObject: 800, popupTitle:'개선현황 및 개선결과 등록'}">
		<template v-slot:contents>
			<p class="table-title">화학물질 위험성평가 정보</p>
			<div class="section-view">
				<table class="mt10">
					<caption>화학물질 위험성평가 정보</caption>
					<tbody>
						<tr>
							<th scope="row" style="width:120px;">관리번호</th>
							<td class="tl">{{ viewModel.item.docno }}</td>
						</tr>
						<tr>
							<th scope="row">화학물질명</th>
							<td class="tl">{{ viewModel.item.title }}</td>
						</tr>
						<tr>
							<th scope="row">취급공정</th>
							<td class="tl">{{ viewModel.item.cat1 }}</td>
						</tr>
					</tbody>
				</table>
			</div>

			<p class="table-title mt20">개선현황</p>
			<table class="mt10">
				<caption>개선현황</caption>
				<tbody id="list_body">
					<thead>
						<tr>
							<th class="w50 tc">개선번호</th>
							<th class="w200">개선방안</th>
							<th class="w200">개선책임자</th>
							<th class="w120 tc">개선기한</th>
							<th class="w120 tc">개선일</th>
							<th>개선결과</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="(item, index) in viewModel.evalImprvList">
							<td class="tc">{{ item.no }}</td>
							<td>{{ item.imprv_txt }}</td>
							<td>{{ item.imprv_mngr }}</td>
							<td class="tc">{{ item.imprv_date }}</td>
							<td class="tc">
								<div class="datepicker_box">
									<input type="text" :id="'cmpl_date'+index" title="달력" class="datepicker w100" readonly v-model="item.cmpl_date">
									<button type="button" class="btn btn-icon" onclick="$(this).prev().val('');"><span class="mi">close</span></button>
								</div>
							</td>
							<td><input type="button" @click="fnCmplReg(index, item.uid)" class="btn btn-primary2 sm" value="등록"></td>
						</tr>
					</tbody>
				</tbody>
			</table>

			<p class="table-title mt20">개선결과 등록</p>
			<div class="comment">
				<div class="form-group">
					<label class="title">{{ user.user_name }} {{ user.job_name }} {{ user.user_dept }}</label>
				</div>
				<div class="clearfix">
					<textarea name="comment" rows="3" required v-model="viewModel.item.eval_rmk"></textarea>
					<input type="submit" title="개선결과등록" value="의견등록" class="btn btn-dark mt10" style="width:100%;" @click.prevent="fnRmkSave()">
				</div>
			</div>
		</template>
	</modal>
</template>
<script>
import Axios from 'axios';
import Vue from 'vue'
import Message, {messageUtil} from "../../../common/message";
import Pager from '../../paging.vue'
import Modal from './modal.vue'

export default {
	components: {
		Pager, Modal
	},
	data: function () {
		return {
			user: {},
			viewModel:{
				item:{},
				evalImprvList: [],
				keyword:"",				
			},
		}
	},
	mounted: function () {
		let vt = this;
		vt.user = vt.$store.state.global.userInfo;
	},
	methods: {
		fnInit: function(uid) {
			Modal.methods.fnInit();
			this.fnSetContents(uid);

			$(document).on('focus', '.datepicker', function() {
				$(this).datepicker({ dateFormat: "yy-mm-dd" });
			});
		},
		fnSetContents: function(uid){
			let vt = this;  
			let vm = this.viewModel;  
			let senddata = {
				mapperId : 'msds.selectMsdsevalList',
				msds_uid: uid 
			};
			Axios.post("/list", senddata).then(function(response) {
				vm.item = response.data.list[0];

				let senddata = {
					mapperId : 'msds.selectMsdsevalImprvList',
					eval_uid: vm.item.uid 
				};
				Axios.post("/list", senddata).then(function(response) {
					vm.evalImprvList = response.data.list;
				});
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
		fnRmkSave: function(){
			let vt = this;
			let vm = this.viewModel;
			let data = {
				mapperId : 'msds.updateEvalRmk',
				memberuid: vt.user.memberuid,
				uid : vm.item.uid,
				eval_rmk : vm.item.eval_rmk,
			}
			if(confirm(Message.CREATE_CONFIRM)) {
				Axios.post("/update", data).then(function(response) {
					$('.overlay_mask, .overlay_formbox').hide();
					$('body').removeClass("fix");	
				}).catch(function(ex) {
					console.log("error"+ex);
				});
			} else {
				if(message) alert(message);
			}
		},
		fnCmplReg: function(index, uid){
			let vt = this;
			let vm = this.viewModel;
			let data = {
				mapperId : 'msds.updateEvalImprvCmpl',
				cmpl_date: $("#cmpl_date"+index).val(),
				uid: uid,
			}

			if(confirm(Message.CREATE_CONFIRM)) {
				Axios.post("/update", data).then(function(response) {
					$('.overlay_mask, .overlay_formbox').hide();
					$('body').removeClass("fix");
					
					vt.$parent.fnList(0);
				}).catch(function(ex) {
					console.log("error"+ex);
				});
			} else {
				if(message) alert(message);
			}
		}
	}
};
</script>
