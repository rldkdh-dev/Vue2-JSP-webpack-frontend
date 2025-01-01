<template>
	<modal :pass="{widthObject: 800, popupTitle: '자체감사 등급환산표'}">
		<template v-slot:contents>
			<table id="tbl_checklist" class="light score">
				<thead>
					<tr>
						<th scope="col" style="width: 300px">항목</th>
						<th scope="col">최고 실배점</th>
						<th scope="col">환산계수</th>
						<th scope="col">최고 환산계수</th>
						<th scope="col">받은 점수</th>
						<th scope="col">환산 점수</th>
					</tr>
				</thead>
				<tbody>
					<tr class="item" v-for="(item, i) in viewModel.list" :key="i">
						<td class="tl">{{item.subject}}</td>
						<td class="tc">{{item.point}}</td>
						<td class="tc">{{item.arg}}</td>
						<td class="tc">{{item.max_arg}}</td>
						<td class="tc">
							<input type="text" class="rpoint" v-model="item.rpoint" @input="fnCalCpoint(i)">
						</td>
						<td class="tc">
							<input type="text" class="cpoint" v-model="item.cpoint" readonly>
						</td>
					</tr>
				</tbody>
				<tfoot>
					<tr class="multi">
						<td>합계</td>
						<td>{{viewModel.sum_point|moneyFilter}}</td>
						<td>-</td>
						<td>{{viewModel.sum_max_arg}}</td>
						<td><span id="sum_rpoint">{{sum_rpoint|moneyFilter}}</span></td>
						<td><span id="sum_cpoint">{{sum_cpoint}}</span></td>
					</tr>
					<tr class="multi">
						<td class="fsi14 pbi10" colspan="6">등급 결과 : <input type="text" v-model="viewModel.item.result_grade" style="color: #000;height: 24px;width: 50px;min-width: unset;vertical-align: unset;"> 등급</td>
					</tr>
				</tfoot>
			</table>
			<div class="buttonbox">
				<input type="submit" value="저장" class="btn btn-save btn-primary" @click="fnAuditStep3Insert" />
				<input type="button" value="취소" class="btn btn-icon btn-cancel" onclick="btn_formbox_close()">
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
import fromValidation from "../../../common/fromValidation";

export default {
	props: ['pass'],
	components: {
        Modal
    },
	data: function () {
		return {
			mode: '',
			sum_cpoint: 0,
			viewModel:{
				sum_point: null,
				sum_max_arg: null,
				item: {},
				list:[],
			},
		}
	},
	computed: {
		sum_rpoint: function() {
			let sum=0;
			let point=0;
			for(let i=0; i<this.viewModel.list.length; i++) {
				let rp = this.viewModel.list[i].rpoint;
				if(rp!=undefined && isNaN(rp)) {
					alert('숫자만 입력 가능합니다')
					point = 0;
				} else if(rp!=undefined) {
					point = parseInt(rp)
					sum += point
				}
			}
			return sum
		},
	},
	methods: {
		fnInit: function(item) {
			Modal.methods.fnInit();
			this.fnSetContents(item);
		},
		fnSetContents: function(item){
			let vt = this;
    		let vm = this.viewModel;
			vm.item = item;
			let data = {
				mapperId: 'audit.auditChecklistItems',
				chk_uid: 1,
				pa_step3_uid: (item.step3 == undefined) ? null : item.step3
			}
    		Axios.post("/list", data).then(function(rs) {
                vm.list = rs.data.list;
				let point =0;
				let maxarg =0;
				for(let i=0; i<rs.data.list.length; i++) {
					point += rs.data.list[i].point
					maxarg += rs.data.list[i].max_arg
				}
				vm.sum_point = point
				vm.sum_max_arg = maxarg;
				vt.fnSumCpoint();
            });
		},
		fnAuditStep3Insert: function() {
            let vt = this;
    		let vm = this.viewModel;
            let message;
    		let senddata = {
                memberuid: this.$parent.viewModel.user.user_num,
                pa_uid: vm.item.uid,
                checklist_uid: 1,
                result_grade: vm.item.result_grade,
    		};

			for(let i=0; i<vm.list.length; i++){
				let item = vm.list[i];
				if(item.rpoint > item.point){
					alert(item.subject + "의 항목이 최고 실배점보다 높게 입력되었습니다.");
					return false;
				}
			}
            if(confirm(Message.CREATE_CONFIRM)) {
				if(vm.item.step3!=undefined) {
					senddata.mapperId= 'audit.updateAuditStep3';
					Axios.post("/update", senddata).then(function(rs) {
						
					}).then(function(){
						for(let i=0; i<vm.list.length; i++) {
							vt.fnAuditStep3ItemsInsert(i)
						}
					});
				} else {
					senddata.mapperId= 'audit.insertAuditStep3';
					Axios.post("/insert", senddata).then(function(rs) {
					}).then(function(){
						for(let i=0; i<vm.list.length; i++) {
							vt.fnAuditStep3ItemsInsert(i)
						}
					});
				}
            } else {
                if(message) alert(message);
            }
        },
		fnAuditStep3ItemsInsert: function(i) {
    		let vm = this.viewModel;
    		let senddata = {
				pa_uid: vm.item.uid,
                pa_step3_uid: vm.item.step3,
				checklist_uid: 1,
				checkitem_uid: vm.list[i].uid,
				rpoint: (vm.list[i].rpoint == undefined) ? 0 : parseInt(vm.list[i].rpoint),
				cpoint: (vm.list[i].cpoint == undefined) ? 0 : vm.list[i].cpoint,
    		};
			console.log(senddata)
			if(vm.list[i].data_pk!=undefined) {
				senddata.mapperId= 'audit.updateAuditStep3Items';
				senddata.uid= vm.list[i].data_pk;
				Axios.post("/update", senddata).then(function(rs) {
					console.log(rs.data)
					console.log('수정')
				});
			} else {
				senddata.mapperId= 'audit.insertAuditStep3Items';
				Axios.post("/insert", senddata).then(function(rs) {
					console.log(rs.data)
					console.log('등록')
				});
			}
			btn_formbox_close();
			this.$parent.fnList(0)
        },
		fnCalCpoint: function(i) {
			let vm = this.viewModel;
			let cal = vm.list[i].rpoint * vm.list[i].arg;
			if(cal > vm.list[i].max_arg || vm.list[i].point == vm.list[i].rpoint) {
				cal = vm.list[i].max_arg
			}
			vm.list[i].cpoint = parseFloat(cal)
			this.fnSumCpoint();
		},
		fnSumCpoint: function() {
			let sum=0;
			let point=0;
			for(let i=0; i<this.viewModel.list.length; i++) {
				(this.viewModel.list[i].cpoint!=undefined) ? point = this.viewModel.list[i].cpoint : point = 0;
				sum += point
			}
			this.sum_cpoint = Math.round(sum * 100) /100
		},
	}
};
</script>
