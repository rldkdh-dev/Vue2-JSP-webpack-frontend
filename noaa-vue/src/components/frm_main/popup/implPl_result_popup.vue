<template>
	<modal :pass="{popupTitle: '근로자 대표 투표 결과'}" @close="fnClose">
		<template v-slot:contents>
			<div>
				<h3>투표 결과</h3>
				<table class="table horizontal write" v-if="viewModel.list.length == 1">
					<tbody v-for="(item, i) in viewModel.list" :key="i" >
						<tr>
							<th scope="row" class="w100">투표 기간</th>
							<td>{{ item.vote_bgn_dt }} ~ {{ item.vote_end_dt }}</td>
						</tr>
						<tr>
							<th scope="row" style="width:35%;">투표자 수 / 근로자 수</th>
							<td>
								{{ item.vote_cnt }} 명 / {{ item.bplc_mem_cnt }} 명 
								<br>
								( 투표자 비율 : {{ item.rate }}% )
							</td>
						</tr>
						<tr>
							<th scope="row">당선자</th>
							<td>{{ item.user_nm }}</td>
						</tr>
						<tr>
							<th scope="row">득표수</th>
							<td>{{ item.elect_max_cnt }}</td>
						</tr>
					</tbody>
				</table>
				<span v-else-if="viewModel.list.length == 0">
					투표 결과가 없습니다.
				</span>
				<span v-else>
					결과가 동률이라 당선자가 없습니다.
				</span>
			</div>
			
		</template>
	</modal>
</template>

<script>
import 'es6-promise/auto'
import Vue from 'vue'
import Axios from 'axios'
import Modal from './modal.vue'
import Pager from "../../paging.vue";
import fileform from "../fileform2.vue";

export default{
	props: ['pass'],
    components: {
        Pager, Modal, fileform
    },
    data: function () {
        return {
			vote_sn : 0,
			
			viewModel:{
				list:{},
				userInfo:{},
			}
        }
    },
    methods: {
		fnInit: function(vote_sn, bplc_sn) {
			let vt = this;
			vt.viewModel.userInfo = vt.$store.state.global.userInfo;
			
			vt.vote_sn = vote_sn;
			vt.bplc_sn = bplc_sn;
			vt.$nextTick(function() {
				vt.fnList(vote_sn, bplc_sn);
			});
		},
		fnList:function(vote_sn, bplc_sn){
			let vt = this;
			let vm = this.viewModel;

			let data = {
				vote_sn : vote_sn,
				bplc_sn : bplc_sn,
				user_id : vt.viewModel.userInfo.user_id
			}
			//결과 조회
			Axios.post("/selectImplPlDetail.do", data).then(function(response) {
				vm.list = response.data.electedList;
				vm.list[0].rate = ((parseInt(vm.list[0].vote_cnt)/parseInt(vm.list[0].bplc_mem_cnt))*100).toFixed(2);

				//투표 종료 처리
				// if(vm.list[0].vote_end_yn == 'N'){
				// 	Axios.post("/updateMauImplPlVote.do", data).then(function(res){
				// 		console.log(res);
				// 	}).catch(function(ex) {
				// 		console.log(ex);
				// 	});
				// }
			})
		},
		fnClose:function(param){
            let vt = this;
			if(param == 'close'){
				// this.$emit('close', '');
				vt.$parent.fnList();
				vt.$parent.candidatePopup = false;
				vt.$parent.votePopup = false;
				vt.$parent.resultPopup = false;
			} 
        },
    }
}
</script>