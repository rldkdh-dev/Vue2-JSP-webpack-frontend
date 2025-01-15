<template>
	<modal :pass="{widthObject: 800, popupTitle:'설비등급 평가'}">
		<template v-slot:contents>
			<table class="mt10">
				<caption>설비등급 평가</caption>
				
				<thead>
					<tr>
						<th>번호</th>
						<th>평가항목</th>
						<th>평가항근거</th>
						<th>평가</th>
					</tr>
				</thead>
				<tbody >
					<tr v-for="(item, i) in viewModel.list" :key="item">
						<td>{{ (i + 1) }}</td>
						<td>{{ item.title }}</td>
						<td><textarea style="border: none; width: 100%; height: 100%; overflow-y: hidden; padding: 5px;" disabled>{{ item.contents }}</textarea></td>
						<td>
							
							<div class="radio-group">
								<template v-for="(items, j) in 5">
									<label class="radio_label mr10" :for="'fr_status'+i+'_'+(10 - (2 * j))">{{10 - (2 * j)}}점
										<input type="radio" :id="'fr_status'+i+'_'+(10 - (2 * j))" :name="'status'+i" :value="10 - (2 * j)" v-model="item.point" @change="fnSumPoint()">
											<span class="checkmark"></span>
									</label><br />
								</template>
							</div>
						</td>
					</tr>
				</tbody>
				<tfoot>
					<tr>
						<td colspan="2">합계</td>
						<td>{{viewModel.list.length * 10}}</td>
						<td><span id="dpoint_sum">{{ sum }}</span></td>
					</tr>
				</tfoot>
			</table>
			<div class="buttonbox mt10">
				<input type="submit" class="btn btn-primary" value="평가저장" @click.prevent="fnPointSave()">
			</div>
		</template>
	</modal>
</template>

<script>
import Axios from 'axios';
import Vue from 'vue'
import Common from '../../common.js';
import Pager from '../../paging.vue'
import Modal from './modal.vue'
import Percent from '../../../common/percent.vue'

export default {
	components: {
		Pager, Modal, Percent
	},
	data: function () {
		return {
			sum:0,
			viewModel:{
				uid: '',
				rank: '',
				list:[],
				resultList: [],
				keyword:"",
			},
		}
	},
	mounted: function () {
	},
	methods: {
		fnInit: function(uid, rank) {
			let vt = this;
			let vm = this.viewModel;
			vm.uid = uid;
			vm.rank = rank;
			Modal.methods.fnInit();
			vt.fnSetContents(uid, rank);
		},
		fnSetContents: function(uid, rank){
			let vt = this;  
			let vm = this.viewModel;
			let mapperId = "";
			if(rank == ""){		//기존 저장된 값이 없을 경우
				mapperId = 'faci.selectChecklistGradeItem';
			}else{	//있을 경우
				mapperId = 'faci.selectChecklistRatingData';
			}
			let senddata = {
				mapperId: mapperId,
				uid: uid,
			};
			Axios.post("/list", senddata).then(function(res) {
				vm.list = res.data.list;

				vt.fnSumPoint();
			});
		},
		fnRowClick : function(item){
			$('.overlay_mask, .overlay_formbox').hide();
			$('body').removeClass("fix");
		},
		fnSumPoint: function(){
			let vt = this;
			let vm = this.viewModel;

			let sumPoint = 0;
			for(let i = 0; i < vm.list.length; i++){
				if(vm.list[i].point != undefined){
					sumPoint = sumPoint + Number(vm.list[i].point);
				}
				
			}
			vt.sum = sumPoint;
		},
		fnPointSave:function (){
			let vm = this.viewModel;
			let vt = this;
			
			let send = {
				uid : vm.uid,
				list : vm.list,
				sum : vt.sum,
				totalSum: (vm.list.length * 10),
			}

			for(let i=0; i<vm.list.length; i++){
				if(vm.list[i].point == "" || vm.list[i].point  == undefined ){alert((i+1)+".평가점수를 클릭해주세요."); return;}
			}
			Axios.post("/insertRaitingData", send).then(function(res) {
				if(res.data.rank == null){
					alert(Message.ERROR);
				}else{
					$('.overlay_mask, .overlay_formbox').hide();
					$('body').removeClass("fix");

					vt.$parent.fnRankUpdt();
				}
			});
		},

	}
};
</script>
