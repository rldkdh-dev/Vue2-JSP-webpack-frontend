<template>
	<modal :pass="{widthObject: 500, popupTitle:'개선실행 계획서 조치담당자 선택'}">
		<template v-slot:contents>
			<p class="table-title">개선실행 계획서 정보</p>
			<div class="section-view">
				<table>
					<caption>개선실행 계획서 정보</caption>
					<tbody>
						<tr>
							<th scope="row" class="w150">공정(단위작업)</th>
							<td>{{viewModel.list.cat1}}</td>
						</tr>
						<tr>
							<th scope="row">코드번호</th>
							<td>{{viewModel.list.cat2}}</td>
						</tr>
						<tr>
							<th scope="row">재해형태</th>
							<td>{{viewModel.list.cat3}}</td>
						</tr>
						<tr>
							<th scope="row">조치부서</th>
							<td>{{viewModel.list.dept_name}}</td>
						</tr>
						<tr>
							<th scope="row"><label for="impr_member">조치담당자</label></th>
							<td @click="fnselectmeasureManager(viewModel.list.measure_memberuid)">
								<select id="impr_member" v-model="viewModel.list.user_uid">
									<!-- <option name="없음" value="0" selected>없음</option> -->
									<option v-for="item in viewModel.impr_member_list" :key="item" :value="item.uid">{{item.security_name}} {{item.name}}</option>
								</select>
							</td>
						</tr>
					</tbody>
				</table>

				<div class="buttonbox">
					<input type="submit" value="저장" class="btn btn-save btn-primary" @click="fnUpdate">
					<a href="javascript:void(0);" class="btn btn-cancel" onclick="btn_formbox_close();">취소</a>
				</div>
			</div>
		</template>
	</modal>
</template>
<script>
import Axios from 'axios';
import Vue from 'vue'
import Modal from './modal.vue'
import Message, {messageUtil} from "../../../common/message";
import formValidation from "../../../common/fromValidation";

export default {
	components: {
		Modal
	},
	data: function () {
		return {
			viewModel:{
				list:[],
				impr_member_list:[],
				userInfo:{},
			},
		}
	},
	mounted: function () {
		console.log('riskImprmember-popup')
		let vm = this;
		vm.viewModel.userInfo = vm.$store.state.global.userInfo;
	},
	methods: {
		fnInit: function(id) {
			Modal.methods.fnInit();
			// this.viewModel.item = item;
			//if(item.measure_memberuid==undefined) this.viewModel.item.measure_memberuid = '';
			this.fnSetContents(id);
			this.fnselectmeasureManager();
			
		},
		fnSetContents: function(id) {
			let vm = this;
			let senddata = {
				mapperId : 'riskEval.riskImprPlanDetail',
				uid: id,
				// dept: vm.measure_dept_uid
			};
			Axios.post("/detail", senddata).then(function(rs) {
				vm.viewModel.list = rs.data[0];
			});
        },
		fnselectmeasureManager:function(measure_memberuid){
            let vm = this;
			let send = {
				mapperId:'riskEval.selectmeasureManager',
				id : measure_memberuid,
				deptuid: vm.viewModel.userInfo.user_dept_id,
			}
            Axios.post("/list",send).then(function(res) {
				//list
				vm.viewModel.impr_member_list = res.data.list;
			});
        },
		fnUpdate: function() {
			let vm = this;
			let data = {
				mapperId : 'riskEval.updateriskImprPlanMemberpopupInfo',
				measure_memberuid: vm.viewModel.list.user_uid,
				uid: vm.viewModel.list.uid,
			};
			Axios.post("/adminupdate",data)
			alert("수정 되었습니다.");
			$('.overlay_mask, .overlay_formbox').hide();
            $('body').removeClass("fix");
			window.location.href="/do/riskImprPlan"
			
    	},
		fnCancel: function() {
			this.$parent.popup = {};
			this.$parent.fnList()
		}
	}
};
</script>
