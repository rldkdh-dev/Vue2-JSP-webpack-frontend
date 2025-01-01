<template>
	<modal :pass="{widthObject: 800, popupTitle:'공정안전자료 보완대상 등록'}">
		<template v-slot:contents>
			<div style="position:absolute;width: calc(100% - 30px);padding-top: 10px;margin-top: -10px;background: #f2f2f2;z-index: 20;">
				<table class="light">
					<thead>
						<tr>
							<th scope="col" :class="(pass!=undefined) ? 'w65' : 'w120'">분류</th>
							<th scope="col">내용</th>
							<th scope="col" :class="(pass!=undefined) ? 'w60' : 'w110'">변경검토 대상</th>
							<th scope="col" :class="(pass!=undefined) ? 'w120' : 'w225'">책임자(책임부서)</th>
						</tr>
					</thead>
				</table>
			</div>
			<table id="tbl_checklist" class="table odd">
				<caption>공정안전자료 보완대상 등록</caption>
				<thead>
					<tr>
						<th scope="col" :class="(pass!=undefined) ? 'w65' : 'w120'">분류</th>
						<th scope="col">내용</th>
						<th scope="col" :class="(pass!=undefined) ? 'w60' : 'w110'">변경검토 대상</th>
						<th scope="col" :class="(pass!=undefined) ? 'w120' : 'w225'">책임자(책임부서)</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="(item, index) in viewModel.list" :key="index" class="item">
						<th class="break" :rowspan="item.rowspan" v-if="item.rowspan!=undefined">{{item.cat}}</th>
						<td class="tl">{{item.contents}}</td>
						<td :class="[{'yn': pass!=undefined}, 'radio-group']">
							<label class="radio_label" :for="'y'+index">Y<input type="radio" :id="'y'+index" :name="'state'+index" value="1" v-model="item.value"><span class="checkmark"></span></label>
							<label class="radio_label" :for="'n'+index">N<input type="radio" :id="'n'+index" :name="'state'+index" value="2" v-model="item.value"><span class="checkmark"></span></label>
						</td>
						<td :class="{'np': pass!=undefined}">
							<select v-model="item.mng_memberuid">
								<option value=0>--------</option>
								<option v-for="item in viewModel.mng" :key="item.uid" :value="item.uid">{{item.membername}} ({{item.dept_name}})</option>
							</select>
						</td>
					</tr>
				</tbody>
			</table>

			<div class="buttonbox">
				<input type="submit" value="저장" class="btn btn-save btn-primary" @click="fnChangeStep4">
				<input type="button" value="취소" class="btn btn-icon btn-cancel" @click="fnCancel">
			</div>
		</template>
	</modal>
</template>
<script>
import Axios from 'axios';
import Vue from 'vue'
import Pager from '../../paging.vue'
import Modal from './modal.vue'
import Message, {messageUtil} from "../../../common/message";

export default {
	props: ['pass'],
	components: {
		Pager, Modal
	},
	data: function () {
		return {
			item: {},
			viewModel:{
				list:[],
				user: null,
				mng: [],
			},
		}
	},
	mounted: function () {
		console.log('step4-popup')
	},
	methods: {
		fnInit: function(item) {
			Modal.methods.fnInit();
			this.viewModel.user = this.$store.state.global.userInfo;
			this.item = item;
			this.fnSetContents();
		},
		fnSetContents: function(){
			let vt = this;  
			let vm = this.viewModel;  
			let data = {
				mapperId: ['changes.changeStep4List', 'changes.changeMngList'],
				chk_uid: 1,
				pc_step4_uid: this.item.step4,
			};
			Axios.post("/multiList",data).then(function(rs) {
				let list = rs.data.list1
				vm.list = list;
				vm.mng = rs.data.list2
				let row = 1;
				for(let i=0; i<list.length-1; i++) {
					if(i==list.length-2) {
						if(list[i].cat == list[i+1].cat) {
							vm.list[i-(row-1)].rowspan = row+1;
						}
					} else {
						if(list[i].cat == list[i+1].cat) {
							row++
						} else {
							vm.list[i-(row-1)].rowspan = row;
							row = 1;
						}
					}

					if(list[i].value==undefined) {
						vm.list[i].value = 2;
						vm.list[i].mng_memberuid = 0;
						if(i==list.length-2) {
							vm.list[i+1].value = 2;
							vm.list[i+1].mng_memberuid = 0;
						}
					}
				}
			});
		},
		fnChangeStep4: function() {
			let vt = this;
    		let vm = this.viewModel;
            let message;
    		let senddata = {
				mapperId: (vt.item.step4 == undefined) ? 'changes.insertChangeStep4' : 'changes.updateChangeStep4',
				memberuid: vm.user.memberuid,
				pc_uid: vt.item.pc_no,
				checklist_uid: 1,
				uid: vt.item.step4,
			};
			if(vt.item.step4 == undefined) {
				if(confirm(Message.CREATE_CONFIRM)) {
					Axios.post("/insert", senddata).then(function(rs) {
						vt.fnChangeStep4Update();
						alert('등록이 완료되었습니다.');
					});
				} else {
					if(message) alert(message);
				}
			} else {
				if(confirm(Message.UPDATE_CONFIRM)) {
					Axios.post("/update", senddata).then(function(rs) {
						vt.fnChangeStep4Update();
						alert('수정이 완료되었습니다.');
					});
				} else {
					if(message) alert(message);
				}
			}
		},
		fnChangeStep4Update: function() {
			let vt = this;
			let vm = this.viewModel;
			let data = {
				mapperId: (vt.item.step4!=undefined) ? 'changes.updateChangeStep4data' : 'changes.insertChangeStep4data',
				pc_step4_uid: vt.item.step4,
				pc_uid: vt.item.pc_no,
				itemList: vm.list,
			};
			if(vt.item.step4!=undefined) {
				Axios.post("/insert", data).then(function(rs) {
					vt.fnCancel();
				});
			} else {
				Axios.post("/update", data).then(function(rs) {
					vt.fnCancel();
				});
			}
        },
		fnCancel: function() {
			this.$parent.popup = {};
			this.$parent.fnList(0)
		}
	}
};
</script>
