<template>
	<div class="popup active">
		<div class="popup_panel">
			<div class="popup_header">
				<h4>결재</h4>
				<div class="icon_box">
					<button class="btn btn-icon btn_fullscreen"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-fullscreen"></use></svg></button>
					<button class="btn btn-icon btn_popup_close" @click="fnClose"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-delete"></use></svg></button>
				</div>
			</div>
			<div class="contents popup_contents">
				<table class="table horizontal">
					<tbody v-show="viewModel.gbn == 'safe_mngr'">
						<tr>
							<th scope="row"><label for="bplc">안전관리자 금일 주요업무 / 확인사항</label></th>
							<td>
								<textarea :id="'safe_mngr_today_main_task'" v-model="viewModel.data.safe_mngr_today_main_task" rows="5"></textarea>
							</td>
						</tr>
						<tr>
							<th scope="row"><label for="bplc_team">안전관리자 명일 주요업무 / 확인예정사항</label></th>
							<td>
								<textarea :id="'safe_mngr_tomo_main_task'" v-model="viewModel.data.safe_mngr_tomo_main_task" rows="5"></textarea>
							</td>
						</tr>
						<!-- <tr>
							<th scope="row"><label for="bplc_team">안전점검 지적/요청사항</label></th>
							<td>
								<textarea :id="'safe_mngr_safechck_lgstr'" v-model="viewModel.data.safe_mngr_safechck_lgstr" rows="5"></textarea>
							</td>
						</tr>
						<tr>
							<th scope="row"><label for="bplc_team">대상팀(작업자)</label></th>
							<td>
								<textarea :id="'safe_mngr_trgt_team'" v-model="viewModel.data.safe_mngr_trgt_team" rows="5"></textarea>
							</td>
						</tr>
						<tr>
							<th scope="row"><label for="bplc_team">조치결과</label></th>
							<td>
								<textarea :id="'safe_mngr_actn_rslt'" v-model="viewModel.data.safe_mngr_actn_rslt" rows="5"></textarea>
							</td>
						</tr> -->
					</tbody>
						<!-- <tr>
							<th scope="row"><label for="bplc">검토 및 지시사항</label></th>
							<td>
								<textarea :id="'bplc_mngr_rvw_mttr'" v-model="viewModel.data.bplc_mngr_rvw_mttr" rows="5"></textarea>
							</td>
						</tr>
						<tr>
							<th scope="row"><label for="bplc_team">현장 안전점검사항</label></th>
							<td>
								<textarea :id="'bplc_mngr_safe_chck_mttr'" v-model="viewModel.data.bplc_mngr_safe_chck_mttr" rows="5"></textarea>
							</td>
						</tr> -->
				</table>
				<div v-if="$parent.viewModel.data.chck_cnt > 0 && viewModel.gbn == 'bplc_mngr'">
					<rgstChkSubDetail ref="sub2" :pass="{mode: 'mngr_update', gbn:'diy', bplc_mngr: viewModel.data.bplc_mngr}"></rgstChkSubDetail>
				</div>
				
				<div class="table_footer btn-group">
					<div class="right_side">
						<a href="javascript:void(0);" class="btn btn-primary" @click="fnSignApproval()"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-check-circle"></use></svg>결재</a>
						<!-- <a href="javascript:void(0);" class="btn btn-white" @click="fnSignReturn(signPopSort)"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-newsfeed"></use></svg>반려</a> -->
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import 'es6-promise/auto'
import Vue from 'vue'
import Axios from 'axios'
import Modal from './modal.vue'
import rgstChkSubDetail from "../chkHthAct/chkAct/rgstChkSubDetail.vue";

export default{
	props: ['pass'],
    components: {
         Modal
		  , 'rgstChkSubDetail' : rgstChkSubDetail,
    },
    data: function () {
        return {
			viewModel:{
				gbn: '',
				data:{

				}
			}
        }
    },
    methods: {
		fnInit: function(gbn, data) {
			let vm = this;

			Modal.methods.fnInit();

			vm.viewModel.gbn = gbn;
			vm.viewModel.data = data;
			vm.$nextTick(function() {
				vm.$refs.sub2.fnLoadList(vm.$parent.viewModel.rsltList, vm.$parent.viewModel.filelist, vm.$parent.viewModel.mttrFileList);
			});
		},
		fnSignApproval: function(){
			if(confirm("결재하시겠습니까?")){
				
				let vm = this;
				//부모창에 선택한 값 전달
				vm.$parent.fnSign();
				//팝업 초기화
				vm.$parent.signPop = false;
			}
		},
		fnClose: function(){
			let vm = this;

			vm.$parent.signPop = false;
		}
    }
}
</script>