<template>
	<modal :pass="{widthObject: 1000, popupTitle:'공정안전자료 보완결과 등록'}">
		<template v-slot:contents>
			<table id="tbl_checklist" class="light">
				<caption>공정안전자료 보완결과 등록</caption>
				<thead>
					<tr>
						<th scope="col" :class="(pass!=undefined) ? 'w30' : 'w120'">분류</th>
						<th scope="col">내용</th>
						<th scope="col" class="w50" v-if="pass==undefined">변경검토 대상</th>
						<th scope="col" class="w60" v-if="pass==undefined">책임자(책임부서)</th>
						<th scope="col" class="w60">보완내용</th>
						<th scope="col" class="w60">보완완료일</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="(item, i) in viewModel.list" :key="i" class="item">
						<th :rowspan="item.rowspan" v-if="item.rowspan!=undefined" class="word-vertical"><p>{{item.cat}}</p></th>
						<td class="tl">{{item.contents}}</td>
						<td style="white-space: nowrap;" v-if="pass==undefined">{{(item.value==1) ? '변경검토 대상' : ''}}</td>
						<td style="white-space: nowrap;" v-if="pass==undefined">{{item.mng_user_name}}{{(item.dept_name!=undefined) ? '('+item.dept_name+')' : ''}}</td>
						<td :class="{'np': pass!=undefined}">
							<textarea title="보완내용" v-model="item.result_txt" v-if="item.mng_user_num==viewModel.user.user_num" :class="{'w80': pass!=undefined}"></textarea>
							<p class="pre" v-else>{{item.result_txt}}</p>
						</td>
						<td :class="[{'np': pass!=undefined}, 'tc']">
							<div class="datepicker_box" v-if="item.mng_user_num==viewModel.user.user_num">
								<input type="text" :id="'result_date'+i" title="달력" :class="[(pass!=undefined) ? 'w80' : 'w110', 'datepicker']" readonly>
								<button type="button" class="btn btn-icon" onclick="$(this).prev().val('');"><span class="mi">close</span></button>
							</div>
							<p v-else>{{item.result_date|yyyyMMdd}}</p>
						</td>
					</tr>
				</tbody>
			</table>
			<div class="buttonbox">
				<input type="submit" value="저장" class="btn btn-save btn-primary" @click="fnChangeStep5">
				<input type="button" value="취소" class="btn btn-icon btn-cancel" @click="fnCancel">
			</div>
		</template>
	</modal>
</template>
<script>
import Axios from 'axios';
import Vue from 'vue'
import Common from '../../common.js';
import Modal from './modal.vue'
import Message, {messageUtil} from "../../../common/message";

export default {
	props: ['pass'],
	components: {
		Modal
	},
	data: function () {
		return {
			item: {},
			viewModel:{
				list:[],
				user: null,
			},
		}
	},
	mounted: function () {
		console.log('step5-popup')
	},
	methods: {
		fnInit: function(item) {
			Modal.methods.fnInit();
			this.viewModel.user = this.$store.state.global.userInfo;
			this.item = item;
			$(document).on('focus', '.datepicker', function() {
				$(this).datepicker({ dateFormat: "yy-mm-dd" });
			})
			this.fnSetContents();
		},
		fnSetContents: function(){
			let vt = this;  
			let vm = this.viewModel;  
			let data = {
				mapperId: 'changes.changeStep4List',
				chk_uid: 1,
				pc_step4_uid: this.item.step4,
				pc_step5_uid: this.item.step5,
			};
			Axios.post("/list",data).then(function(rs) {
				let list = rs.data.list
				vm.list = list;
				
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

					if(list[i].result_date!=undefined) {
						vt.$nextTick(function() {
							$('#result_date'+i).val(list[i].result_date)
						})
					}
				}
			});
		},
		fnChangeStep5: function() {
			let vt = this;
    		let vm = this.viewModel;
            let message;
    		let senddata = {
				mapperId: (vt.item.step5 == undefined) ? 'changes.insertChangeStep5' : 'changes.updateChangeStep5',
				memberuid: vm.user.memberuid,
				pc_uid: vt.item.pc_no,
				uid: vt.item.step5,
			};
			if(vt.item.step5 == undefined) {
				if(confirm(Message.CREATE_CONFIRM)) {
					Axios.post("/insert", senddata).then(function(rs) {
						vt.fnChangeStep5Update();
						alert('입력이 완료되었습니다.');
					});
				} else {
					if(message) alert(message);
				}
			} else {
				if(confirm(Message.UPDATE_CONFIRM)) {
					Axios.post("/update", senddata).then(function(rs) {
						vt.fnChangeStep5Update();
						alert('수정이 완료되었습니다.');
					});
				} else {
					if(message) alert(message);
				}
			}
		},
		fnChangeStep5Update: function() {
			let vt = this;
			let vm = this.viewModel;
			let data = {
				mapperId: 'changes.deleteChangeStep5data',
				pc_step5_uid: vt.item.step5,
				pc_uid: vt.item.pc_no,
				itemList: vm.list,
			};
			
			Axios.post("/delete", data).then(function(rs) {
				data.mapperId = 'changes.insertChangeStep5data';
				for(let i=0; i<vm.list.length; i++) {
					data.itemList[i].result_date = $('#result_date'+i).val()
				}
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
