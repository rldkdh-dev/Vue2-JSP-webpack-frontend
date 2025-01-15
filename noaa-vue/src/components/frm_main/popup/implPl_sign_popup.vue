<template>
	<modal :pass="{popupTitle: '회의 참석자 서명'}">
		<template v-slot:contents>
			<div>
				<h3>참석자 서명</h3>
				<table class="table horizontal write" >
					<tbody>
						<tr>
							<th scope="row" class="w100">성명</th>
							<td>{{ viewModel.userInfo.user_name }}</td>
						</tr>
						<tr>
							<th scope="row">서명</th>
							<td>
								<span v-if="viewModel.sign_yn == 'N'" @click="fnSign('Y')" class="btn btn-small btn-sign"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-signature"></use></svg>서명 전</span>
								<span v-if="viewModel.sign_yn == 'Y'" @click="fnSign('N')" class="btn btn-small btn-sign complete"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-signature-check"></use></svg>서명 완료</span>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
			
			<div class="btn-group">
				<div class="right_side">
					<a href="javascript:void(0);" class="btn btn-purple" @click="fnSave()" >서명</a>
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
			lbm_cfrnc_sn : 0,
			viewModel:{
				sign_yn : 'N',
				userInfo:{},
			}
        }
    },
    methods: {
		fnInit: function(sn) {
			let vt = this;
			let vm = this.viewModel;
			vm.userInfo = vt.$store.state.global.userInfo;
			
			vm.lbm_cfrnc_sn = sn;
			vt.$nextTick(function() {
				// vt.fnList(sn);
			});
		},
		fnList:function(sn){
			let vt = this;
			let vm = this.viewModel;
			vm.vote.cnddtSnList = [];

			Axios.post("/selectImplPlDetail.do", {lbm_cfrnc_sn : sn}).then(function(response) {
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
				bplc_sn : vm.userInfo.bplc_sn,
				lbm_cfrnc_sn : vm.lbm_cfrnc_sn,
				sign_yn : vm.sign_yn,
				atdrn_id : vm.userInfo.user_id
			}
			if(vm.sign_yn == 'N'){
				return alert("서명 확인이 되어야합니다.");
			}else{
				if(confirm("회의 참석자 서명을 하시겠습니까?")){ 
					Axios.post("/insertMauImplActSign.do", data).then(function(response) {
						if(response.date != 0){
                                alert("서명이 완료 되었습니다.");
                                vt.$router.push('/').catch(()=>{});
                            }else{
                                alert("서명이 중단되었습니다.");
                            }
						vt.fnClose();
					})	
				}
			}
		},
		fnSign:function(value){
			let vm = this.viewModel;
			vm.sign_yn = value;
		},
		
		// fnClose:function(){
        //     this.$parent.fnInit();
        //     this.$emit('close',false);
        // },
		fnClose:function(){
			let vt = this;
            vt.$parent.fnList();
			vt.$parent.signPopup = false;
			vt.$parent.chckPopup = false;
			vt.$parent.suggestPopup = false;
			vt.$parent.meetingPopup = false;
        },
    }
}
</script>