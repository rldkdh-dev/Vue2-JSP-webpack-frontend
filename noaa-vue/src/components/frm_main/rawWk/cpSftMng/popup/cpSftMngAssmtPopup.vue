<template>
	<div class="modal_wrap assmt">
		<div class="popup modal">
			<div class="popup_panel">
				<div class="popup_header">
					<h4>현장소장 업체 평가</h4>
					<div class="icon_box">
						<button class="btn btn-icon btn_fullscreen"><svg class="icon"><use xlink:href="/img/symbol-defs.svg#icon-fullscreen"></use></svg></button>
						<button class="btn btn-icon btn_popup_close" @click="fnClose($event);"><svg class="icon"><use xlink:href="/img/symbol-defs.svg#icon-delete"></use></svg></button>
					</div>
				</div>
				<div class="contents popup_contents">
					<div>
						<p class="title">승인자 : {{ userInfo.user_id }}</p>
						<table class="table write">
							<caption>현장소장 업체평가</caption>
							<thead>
								<tr>
									<th scope="col">항목</th>
									<th scope="col" class="w80">배점</th>
									<th scope="col" class="w100">득점</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td class="text-left">원청과 하청사업주의 안전보건방침 부합 여부</td>
									<td>5</td>
									<td>
										<select title="득점" v-model="viewModel.score.step1" @change="fnScoreSum">
											<option disabled="" value="0">선택</option>
											<option v-for="(i) in 5" :value="i">{{ i }}</option>
										</select>
									</td>
								</tr>
								<tr>
									<td class="text-left">원청의 산업재해예방 활동에 대한 하청의 이행계획 부합여부</td>
									<td>10</td>
									<td>
										<select title="득점" v-model="viewModel.score.step2" @change="fnScoreSum">
											<option disabled="" value="0">선택</option>
											<option v-for="(i) in 10" :value="i">{{ i }}</option>
										</select>
									</td>
								</tr>
								<tr>
									<td class="text-left">도급작업의 위험성평가 결과에 대한 이해수준 및 자체 유해위험요인 평가 수준</td>
									<td>5</td>
									<td>
										<select title="득점" v-model="viewModel.score.step3" @change="fnScoreSum">
											<option disabled="" value="0">선택</option>
											<option v-for="(i) in 5" :value="i">{{ i }}</option>
										</select>
									</td>
								</tr>
								<tr>
									<td class="text-left">이행계획 추진을 위한 구성원의 역할 분담(본사, 현장)</td>
									<td>5</td>
									<td>
										<select title="득점" v-model="viewModel.score.step4" @change="fnScoreSum">
											<option disabled="" value="0">선택</option>
											<option v-for="(i) in 5" :value="i">{{ i }}</option>
										</select>
									</td>
								</tr>
								<tr>
									<td class="text-left">안전점검 및 모니터링(보호구 착용 확인 포함)</td>
									<td>10</td>
									<td>
										<select title="득점" v-model="viewModel.score.step5" @change="fnScoreSum">
											<option disabled="" value="0">선택</option>
											<option v-for="(i) in 10" :value="i">{{ i }}</option>
										</select>
									</td>
								</tr>
								<tr>
									<td class="text-left">안전조치 이행여부 확인(원청의 지도조언에 대한 이행 포함)</td>
									<td>10</td>
									<td>
										<select title="득점" v-model="viewModel.score.step6" @change="fnScoreSum">
											<option disabled="" value="0">선택</option>
											<option v-for="(i) in 10" :value="i">{{ i }}</option>
										</select>
									</td>
								</tr>
								<tr>
									<td class="text-left">안전보건교육 계획 및 기록관리</td>
									<td>5</td>
									<td>
										<select title="득점" v-model="viewModel.score.step7" @change="fnScoreSum">
											<option disabled="" value="0">선택</option>
											<option v-for="(i) in 5" :value="i">{{ i }}</option>
										</select>
									</td>
								</tr>
								<tr>
									<td class="text-left">유해위험작업에 대한 안전작업허가 이행 수준</td>
									<td>10</td>
									<td>
										<select title="득점" v-model="viewModel.score.step8" @change="fnScoreSum">
											<option disabled="" value="0">선택</option>
											<option v-for="(i) in 10" :value="i">{{ i }}</option>
										</select>
									</td>
								</tr>
								<tr>
									<td class="text-left">원청/하청간 신호체계, 연락체계</td>
									<td>10</td>
									<td>
										<select title="득점" v-model="viewModel.score.step9" @change="fnScoreSum">
											<option disabled="" value="0">선택</option>
											<option v-for="(i) in 10" :value="i">{{ i }}</option>
										</select>
									</td>
								</tr>
								<tr>
									<td class="text-left">유해위험 물질 및 취급 기계,기구 및 설비의 안전성 확인</td>
									<td>5</td>
									<td>
										<select title="득점" v-model="viewModel.score.step10" @change="fnScoreSum">
											<option disabled="" value="0">선택</option>
											<option v-for="(i) in 5" :value="i">{{ i }}</option>
										</select>
									</td>
								</tr>
								<tr>
									<td class="text-left">비상시 대피 및 피해최소화 대책(고용부, 소방서, 병원 포함)</td>
									<td>5</td>
									<td>
										<select title="득점" v-model="viewModel.score.step11" @change="fnScoreSum">
											<option disabled="" value="0">선택</option>
											<option v-for="(i) in 5" :value="i">{{ i }}</option>
										</select>
									</td>
								</tr>
								<tr>
									<td class="text-left">최근 3년간 산업재해 발생현황</td>
									<td>20</td>
									<td>
										<select title="득점" v-model="viewModel.score.step12" @change="fnScoreSum">
											<option disabled="" value="0">선택</option>
											<option v-for="(i) in 20" :value="i">{{ i }}</option>
										</select>
									</td>
								</tr>
							</tbody>
							<tfoot>
								<tr>
									<td class="text-right"><strong>합계</strong></td>
									<td>100</td>
									<td>{{ viewModel.sum }}</td>
								</tr>
							</tfoot>
						</table>
					</div>
					<div class="btn-group btn-right">
						<a href="javascript:void(0)" class="btn btn-purple" @click="fnSave"><svg class="icon"><use xlink:href="/img/symbol-defs.svg#icon-post-add"></use></svg>등록</a>
						<a href="javascript:void(0)" class="btn btn-white" @click="fnClose($event);"><svg class="icon"><use xlink:href="/img/symbol-defs.svg#icon-list-back"></use></svg>목록</a>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import Axios from 'axios';
import Vue from 'vue';
import Message, {messageUtil} from "../../../../../common/js/message";

export default {
	data: function () {
		return {
			userInfo:{},
			viewModel:{
				bplc_sn:'',
				sfmng_sn:'',
				score:{
					step1:0,
					step2:0,
					step3:0,
					step4:0,
					step5:0,
					step6:0,
					step7:0,
					step8:0,
					step9:0,
					step10:0,
					step11:0,
					step12:0
				},
				scoresArr:[],
				sum:0,
				list:[]
			}
		}
	},
	mounted: function () {
		
	},
	methods: {
		fnInit: function(sn) {
			let vm = this;

			$(".modal_wrap").show();
			vm.userInfo = vm.$store.state.global.userInfo;
			vm.viewModel.bplc_sn = sn[0];
			vm.viewModel.sfmng_sn = sn[1];
			vm.fnDetail(sn);
		},
		addComma: function(obj) {
			if(obj != null) obj = obj.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
			return obj;
		},
		fnScoreSum: function() {
			let vm = this;
			let stepScore = vm.viewModel.score;
			let sum = 0;
			for (const [key, value] of Object.entries(stepScore)) {
				sum = sum + Number(value);
			}
			vm.viewModel.sum = sum;
		},
		fnDetail:function(sn) {
			let vm = this;
			let send = {
				bplc_sn: sn[0],
				sfmng_sn: sn[1]
			};

			Axios.post("/selectBplcMngrEvlInfo.do", send).then(function(response) {
				vm.viewModel.list = response.data;

				let data = vm.viewModel.list;
				if(data.length > 0) {
					$.each(data, function(idx, item) {
						if(item.artcl_sn == 1) vm.viewModel.score.step1 = item.gtsr;
						else if(item.artcl_sn == 2) vm.viewModel.score.step2 = item.gtsr;
						else if(item.artcl_sn == 3) vm.viewModel.score.step3 = item.gtsr;
						else if(item.artcl_sn == 4) vm.viewModel.score.step4 = item.gtsr;
						else if(item.artcl_sn == 5) vm.viewModel.score.step5 = item.gtsr;
						else if(item.artcl_sn == 6) vm.viewModel.score.step6 = item.gtsr;
						else if(item.artcl_sn == 7) vm.viewModel.score.step7 = item.gtsr;
						else if(item.artcl_sn == 8) vm.viewModel.score.step8 = item.gtsr;
						else if(item.artcl_sn == 9) vm.viewModel.score.step9 = item.gtsr;
						else if(item.artcl_sn == 10) vm.viewModel.score.step10 = item.gtsr;
						else if(item.artcl_sn == 11) vm.viewModel.score.step11 = item.gtsr;
						else if(item.artcl_sn == 12) vm.viewModel.score.step12 = item.gtsr;
					});
				}
				vm.fnScoreSum();

				//console.log('parent : ' , vm.$parent);
			});
		},
		fnGetscores : function() {
			let vm = this;
			for (const [key, value] of Object.entries(vm.viewModel.score)) {
				vm.viewModel.scoresArr.push({
					artcl_sn: key.slice(4),
					gtsr: value
				});
			}
		},
		fnSave:function(){
			let vm = this;
			vm.fnGetscores();
			let send = {
				bplc_sn: vm.viewModel.bplc_sn,
				sfmng_sn: vm.viewModel.sfmng_sn,
				reg_id: vm.userInfo.user_id,
				scores : vm.viewModel.scoresArr
			};

			if(confirm(Message.CREATE_CONFIRM)){
				Axios.post("/updateBplcMngrEvl.do", send).then(function(response) {
					alert("등록 되었습니다.");
					$('.modal_wrap').hide();
					vm.$parent.fnList(0);
					//vm.$router.push('/');

					//vm.$parent.viewModel.scoreSum = vm.viewModel.sum;
					//팝업 초기화..
					//location.href = '/rawWk/cpSftMng/cpSftMng.do';
				}).catch(function(ex) {
					alert(Message.ERROR);
				});
			}
		},
		fnClose :function(event){
			//popup 닫기
			$(event.target).closest('.modal_wrap').hide();
		}
	}
};
</script>
