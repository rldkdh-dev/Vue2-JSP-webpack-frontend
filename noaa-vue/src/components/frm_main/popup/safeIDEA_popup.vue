<template>
	<div>
		<modal :pass="{popupTitle: '담당자 의견'}">
			<template v-slot:contents>
					<div>
						<table class="table horizontal write">
							<caption>담당자 의견 등록</caption>
							<tbody>
								<tr v-if="mode != 'view'">
									<th scope="row"><label for="">담당자</label></th>
									<td v-if="viewModel.list.opnn_ocpt_detail_nm"><input type="text" id="" title="담당자 직종" v-model="viewModel.list.opnn_ocpt_detail_nm" class="text-center" disabled></td> 
									<td v-if="!viewModel.list.opnn_ocpt_detail_nm"><input type="text" id="" title="담당자 직종" placeholder="직종 정보 없음" class="text-center" disabled></td> 
									<td><input type="text" id="" title="담당자" class="text-center" v-model="viewModel.list.opnn_reg_nm" disabled></td> 
								</tr>
								<tr v-if="mode == 'view'">
									<th scope="row"><label for="">담당자</label></th>
									<td v-if="viewModel.list.opnn_ocpt_detail_nm" class="text-center">{{ viewModel.list.opnn_ocpt_detail_nm }}</td> 
									<td v-if="!viewModel.list.opnn_ocpt_detail_nm" class="text-center">직종 정보 없음</td> 
									<td>{{ viewModel.list.opnn_reg_nm }}</td> 
								</tr>
								<tr>
									<th scope="row"><label for="">의견</label></th>
									<td colspan="2" v-if="mode != 'view'"><textarea rows="10" title="제안 의견" placeholder="제안 의견" v-model="viewModel.list.opnn_cn"></textarea></td> 
									<td colspan="2" v-if="mode == 'view'"><p v-html="viewModel.list.opnn_cn"></p></td> 
								</tr>
							</tbody>
						</table>
					</div>
					<div class="btn-group">
						<div class="right_side"  v-if="mode == 'view' && viewModel.userInfo.user_id == viewModel.list.opnn_reg_id">
							<a href="javascript:void(0);" class="btn btn-purple" @click="fnUpdate()">수정</a>
						</div>
						<div class="right_side"  v-if="mode != 'view'">
							<a href="javascript:void(0);" class="btn btn-purple" @click="fnSave()">등록</a>
						</div>
					</div>
				<!-- </div> -->
			</template>
		</modal>
	</div>
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
			mode : '',
			fileLoadList:[],
			viewModel:{
				list:{},
				userInfo:{},
			}
        }
    },
    methods: {
		fnInit: function(detail, mode) {
			let vt = this;
			vt.viewModel.userInfo = vt.$store.state.global.userInfo;
			// vt.viewModel.pagination = vt.$store.state.global.pagination;
			vt.mode = mode;
			Modal.methods.fnInit(detail);
			vt.$nextTick(function() {
				vt.fnList(detail);
			});
		},
		fnList:function(detail){
			let vt = this;
			let vm = this.viewModel;

			vm.list = {};
			vm.list = detail;
			vt.opnn_cn = vm.list.opnn_cn;

			if(!detail.opnn_reg_nm){ //작성자 없을때
				vm.list.opnn_reg_nm = vt.viewModel.userInfo.user_name;
				vm.list.opnn_ocpt_detail_nm = vt.viewModel.userInfo.ocpt_detail_nm;
			}
			if(vt.mode == 'view'){
				vm.list.opnn_cn = vm.list.opnn_cn.replaceAll(/(\n|\r\n)/g,'<br>');
			}

		},
		
		
		// fnPopup:function(){
		// 	let vt = this;
		// 	vt.userPop = true;
		// 	vt.$nextTick(function() {
		// 	if(vt.userPop) {
		// 		vt.$refs.user.fnInit();
		// 	}
		// 	})
			
		// },
		
		fnSave:function(){
			let vt = this;
			let vm = this.viewModel;

			if(confirm("등록 하시겠습니까?")){
				let data = {
					propse_sn : vm.list.propse_sn,
					opnn_cn : vm.list.opnn_cn,
					opnn_reg_id : vm.userInfo.user_id
				}
				Axios.post("/insertSafeIDEAOpinion.do", data).then(function(res){
					console.log(res);
					if(res.date != 0){
						console.log(res);
						alert("등록 되었습니다.");
					}else{
						alert("등록이 중단되었습니다.");
					}
					vt.fnClose();
				}).catch(function(ex) {
					console.log(ex);
				});

			}
		},
		fnClose:function(){
			let vt = this;
            vt.$parent.fnList();
			vt.$parent.ideaPopup = false;
        },
		fnUpdate:function(){
			let vt = this;
			vt.mode = '';
			vt.viewModel.list.opnn_cn = vt.opnn_cn;
		}
    }
}
</script>