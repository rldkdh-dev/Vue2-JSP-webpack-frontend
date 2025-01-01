<template>
	<modal :pass="{popupTitle: '근로자 대표 투표'}">
		<template v-slot:contents>
			<div>
				<h3>투표자 정보</h3>
				<table class="table horizontal write" >
					<tbody>
						<tr>
							<th scope="row" class="w120">협력업체 명</th>
							<td><input type="text" id="" v-model="viewModel.vote.ccpy_nm" >    </td>
						</tr>
						<tr>
							<th scope="row">성명</th>
							<td>{{ viewModel.userInfo.user_name }}</td>
						</tr>
						<tr>
							<th scope="row">서명</th>
							<td>
								<span v-if="viewModel.vote.sign_yn == 'N'" @click="fnSign('Y')" class="btn btn-small btn-sign"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-signature"></use></svg>서명 전</span>
								<span v-if="viewModel.vote.sign_yn == 'Y'" @click="fnSign('N')" class="btn btn-small btn-sign complete"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-signature-check"></use></svg>서명 완료</span>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
			<div>
				<h3>대표자 투표</h3>
				<table class="table horizontal write" >
					<tbody>
						<tr v-for="(item, i) in viewModel.candidateList" :key="i">
							<th scope="row">
								<label :for="'r'+i"><input type="radio" :id="'r'+i" v-model="viewModel.vote.chc_cnddt_sn" :value=item.cnddt_sn></label>
								{{ i+1 }}</th>
							<td v-if="item.ocpt_detail_nm">{{ item.ocpt_detail_nm }}</td>
							<td v-if="!item.ocpt_detail_nm">직종정보 없음</td>
							<td>{{ item.user_nm }}</td>
						</tr>
					</tbody>
				</table>
			</div>
			<div class="btn-group">
				<div class="right_side">
					<a href="javascript:void(0);" class="btn btn-purple" @click="fnSave()" >투표</a>
				</div>
			</div>
		</template>
	</modal>
</template>

<script>
import 'es6-promise/auto'
import Vue from 'vue'
import Axios from 'axios'
import Modal from './modal.vue'

export default{
	props: ['pass'],
    components: {
        Modal
    },
    data: function () {
        return {
			vote_sn : 0,
			viewModel:{
				candidateList:{},
				vote:{
					sign_yn : 'N',
					chc_cnddt_sn:'',
					cnddtSnList:[],
				},
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
				vt.fnList(vote_sn);
			});
		},
		fnList:function(vote_sn){
			let vt = this;
			let vm = this.viewModel;
			vm.vote.cnddtSnList = [];

			Axios.post("/selectImplPlDetail.do", {vote_sn : vote_sn}).then(function(response) {
				console.log(response.data);
				vm.candidateList = response.data.candidateList;
				vt.$nextTick(function() {
					for(let i=0; i<vm.candidateList.length; i++){
						vm.vote.cnddtSnList.push(vm.candidateList[i].cnddt_sn);
					}	
				})
			})	
		},
		fnSave:function(){
			let vt = this;
			let vm = this.viewModel;
			let data = {
				vote_sn : vt.vote_sn,
				bplc_sn : vt.bplc_sn,
				lbm_cfrnc_sn : vm.candidateList[0].lbm_cfrnc_sn,
				// voter_sn : vm.userInfo.uid_seq,
				voter : vm.userInfo.user_id,
				chc_cnddt_sn : vm.vote.chc_cnddt_sn,
				sign_yn : vm.vote.sign_yn,
				ccpy_nm : vm.vote.ccpy_nm,
				cnddtSnList : vm.vote.cnddtSnList
			}
			if(vm.vote.sign_yn == 'N'){
				return alert("서명 확인이 되어야 투표가 가능합니다.");
			}else{
				if(!vm.vote.chc_cnddt_sn){
					return alert("투표할 대상을 선택해주기 바랍니다.");
				}else{
					if(confirm("근로자 대표에 투표 하시겠습니까?")){ 
						Axios.post("/updateMauImplPlVoteAction.do", data).then(function(response) {
							console.log(response.data);
							vm.candidateList = response.data.candidateList;
							vt.fnClose();
						})	
					}
				}
			}
		},
		fnSign:function(value){
			let vm = this.viewModel;
			vm.vote.sign_yn = value;
		},
		
		// fnClose:function(){
        //     this.$parent.fnInit();
        //     this.$emit('close',false);
        // },
		fnClose:function(){
			let vt = this;
            vt.$parent.fnList();
			vt.$parent.candidatePopup = false;
			vt.$parent.votePopup = false;
			vt.$parent.resultPopup = false;
        },
    }
}
</script>