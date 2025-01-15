<template>
	<modal :pass="{widthObject: 610, popupTitle:'변경등급판정 등록'}">
		<template v-slot:contents>
			<table id="tbl_checklist" class="light">
				<caption>변경등급판정 등록</caption>
				<thead>
					<tr>
						<th scope="col" rowspan="2">No</th>
						<th scope="col" rowspan="2">변경등급판정 기준</th>
						<th scope="col" colspan="2">평가자</th>
					</tr>
					<tr>
						<th scope="col" class="w50">1차 평가<br>변경발의부서<br>담당자</th>
						<th scope="col" class="w60">2차 평가<br>변경발의부서<br>팀장</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="(item, index) in viewModel.list" :key="index" :class="'item level'+item.level_type">
						<td class="tc">{{index+1}}</td>
						<td class="tl">{{item.contents}}</td>
						<template v-if="data.pc_dept_uid == viewModel.user.user_dept_id">
							<td class="" style="white-space: nowrap;">
								<label class="radio_label" :for="'state1Y'+index">Y<input type="radio" :name="'state1'+index" :id="'state1Y'+index" value="1" v-model="item.state1" :disabled="state!=1"><span class="checkmark"></span></label>
								<label class="radio_label ml10" :for="'state1N'+index">N<input type="radio" :name="'state1'+index" :id="'state1N'+index" value="2" v-model="item.state1" :disabled="state!=1"><span class="checkmark"></span></label>
							</td>
							<td class="" style="white-space: nowrap;">
								<label class="radio_label" :for="'state2Y'+index">Y<input type="radio" :name="'state2'+index" :id="'state2Y'+index" value="1" v-model="item.state2" :disabled="state!=2"><span class="checkmark"></span></label>
								<label class="radio_label ml10" :for="'state2N'+index">N<input type="radio" :name="'state2'+index" :id="'state2N'+index" value="2" v-model="item.state2" :disabled="state!=2"><span class="checkmark"></span></label>
							</td>
						</template>
						<template v-else>
							<td class="" style="white-space: nowrap;">
								<label class="radio_label" :for="'state1Y'+index">Y<input type="radio" :name="'state1'+index" :id="'state1Y'+index" value="1" disabled v-model="item.state1"><span class="checkmark"></span></label>
								<label class="radio_label ml10" :for="'state1N'+index">N<input type="radio" :name="'state1'+index" :id="'state1N'+index" value="2" disabled v-model="item.state1"><span class="checkmark"></span></label>
							</td>
							<td class="" style="white-space: nowrap;">
								<label class="radio_label" :for="'state2Y'+index">Y<input type="radio" :name="'state2'+index" :id="'state2Y'+index" value="1" disabled v-model="item.state2"><span class="checkmark"></span></label>
								<label class="radio_label ml10" :for="'state2N'+index">N<input type="radio" :name="'state2'+index" :id="'state2N'+index" value="2" disabled v-model="item.state2"><span class="checkmark"></span></label>
							</td>
						</template>
						
					</tr>
				</tbody>
				<tfoot>
					<tr>
						<td>비고</td>
						<td colspan="3">
							<textarea class="full h50" name="etc" style="color:#000;" v-model="viewModel.step1_etc"></textarea>
						</td>
					</tr>
				</tfoot>
			</table>
			<div class="buttonbox">
				<input type="submit" value="저장" class="btn btn-save btn-primary" @click="fnChangeStep1">
				<input type="button" value="취소" class="btn btn-icon btn-cancel" onclick="btn_formbox_close()">
			</div>
		</template>
	</modal>
</template>
<script>
import Axios from 'axios';
import Vue from 'vue'
import Modal from './modal.vue'
import Message, {messageUtil} from "../../../common/message";

export default {
	components: {
		Modal
	},
	data: function () {
		return {
			mode: '',
			state: 1,
			data: {},
			viewModel:{
				list:[],
				user: null,
				step1_etc: '',
			},
		}
	},
	mounted: function () {
		console.log('step1-popup')
	},
	methods: {
		fnInit: function(data) {
			Modal.methods.fnInit();
			this.viewModel.user = this.$store.state.global.userInfo;
			// if(this.viewModel.user.user_num==this.viewModel.user.team_leader) this.state=2;
			this.data = data;
			this.fnSetContents();
		},
		fnSetContents: function(){
    		let vm = this;
    		let senddata = {
    			mapperId: 'changes.changeStep1List',
                chk_uid: 1,
				pc_step1_uid: vm.data.step1,
				pc_uid: (vm.data.step1 == undefined) ? null : vm.data.pc_no
    		};
    		Axios.post("/list", senddata).then(function(rs) {
				let result = rs.data.list
				vm.viewModel.list = result;
				if(result.length==0 || result[0].state1==undefined) {
					for(let i=0; i<result.length; i++) {
						vm.viewModel.list[i].state1 = '2'
					}
				}
				if(result.length==0 || result[0].state2==undefined) {
					for(let i=0; i<result.length; i++) {
						vm.viewModel.list[i].state2 = '2'
					}
				}
				if(vm.viewModel.user.team_leader!=vm.viewModel.user.user_num){
					vm.state = 1;
				}else{
					vm.state = 2;
				}
				vm.viewModel.step1_etc = result[0].step1_etc
			});
    	},
		fnChangeStep1: function() {
			let vt = this;
    		let vm = this.viewModel;
            let message;
    		let senddata = {
				mapperId: (vt.data.step1 == undefined) ? 'changes.insertChangeStep1' : 'changes.updateChangeStep1',
				memberuid: vm.user.memberuid,
				pc_uid: vt.data.pc_no,
				checklist_uid: 1,
				step1_etc: vm.step1_etc,
				uid: vt.data.step1,
			};
			if(vt.data.step1 == undefined) {
				if(confirm(Message.CREATE_CONFIRM)) {
					Axios.post("/insert", senddata).then(function(rs) {
						vt.fnChangeStep1Update();
						alert('입력이 완료되었습니다');
					});
				} else {
					if(message) alert(message);
				}
			} else {
				if(confirm(Message.UPDATE_CONFIRM)) {
					Axios.post("/update", senddata).then(function(rs) {
						vt.fnChangeStep1Update();
						alert('수정이 완료되었습니다');
					});
				} else {
					if(message) alert(message);
				}
			}
		},
		fnChangeStep1Update: function() {
			let vt = this;
			let vm = this.viewModel;
			let data = {
				mapperId: 'changes.deleteChangeStep1data',
				pc_step1_uid: vt.data.step1,
				pc_uid: vt.data.pc_no,
				itemList: vm.list,
				state: vt.state,
			};
			Axios.post("/delete", data).then(function(rs) {
				data.mapperId = 'changes.insertChangeStep1data';
				Axios.post("/insert", data).then(function(rs) {
					vt.fnCancel();
				});
			});
        },
		fnCancel: function() {
			this.$parent.popup = {};
			this.$parent.fnList(0)
		}
	}
};
</script>
