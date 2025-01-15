<template v-slot:contents>
	<div>
		<div>
			<table class="table write">
				<caption>심의 의결</caption>
				<thead>
					<th scope="col" class="w300">항목</th>
					<th scope="col">심의의결 내용</th>
					<th scope="col">심의의결 결과</th>
					<th scope="col">피드백 필요항목</th>
				</thead>
				<tbody v-if="mode!='view'">
					<tr v-for="(item, i) in viewModel.adminList" :key="i">
						<td class="text-left ">{{ item.artcl_cn }}</td>
						<td><textarea rows="5" title="심의의결 내용" v-model="viewModel.list[i].artcl" ></textarea></td>
						<td>
							<div class="input_group">
								<label>찬성 : </label>
								<input type="text" class="w50" name="" v-model="viewModel.list[i].apprvl" oninput="this.value = this.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '');">
							</div>
							<div class="input_group mt10">
								<label>반대 : </label>
								<input type="text" class="w50" name="" v-model="viewModel.list[i].opps" oninput="this.value = this.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '');">
							</div>
						</td>
						<td><input type="checkbox" name="" v-model="viewModel.list[i].fb_ck" :value=i></td>
					</tr>
				</tbody>
				<tbody v-if="mode=='view'">
					<tr v-for="(item, i) in viewModel.adminList" :key="i">
						<td class="text-left" width="30%">{{ item.artcl_cn }}</td>
						<td class="text-left" width="35%"><p v-html="viewModel.list[i].artcl"></p></td> 
						<td class="text-center" width="25%">
							<div class="input_group">
								<label>찬성 : </label>
								{{ viewModel.list[i].apprvl }}
							</div>
							<div class="input_group mt10">
								<label>반대 : </label>
								{{ viewModel.list[i].opps }}
							</div>
						</td>
						<td width="10%"><input type="checkbox" name="" v-model="viewModel.list[i].fb_ck" :value=i checked onclick="return false"></td>
					</tr>
				</tbody>
			</table>
		</div>
		<div class="table_footer btn-right" v-if="mode!='view'">
			<div class="btn-group btn-right">
				<a href="javascript:void(0);" class="btn btn-purple" v-if="state == 'update'" @click="fnSave()"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-edit"></use></svg>수정</a>
				<a href="javascript:void(0);" class="btn btn-purple" v-else @click="fnSave()"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-edit"></use></svg>저장</a>
				<a href="javascript:void(0);" class="btn btn-gray" @click="fnClose()"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-trash-can"></use></svg>취소</a>
			</div>
		</div>
	</div>
</template>

<script>
import 'es6-promise/auto'
import Vue from 'vue'
import Axios from 'axios'
// import Modal from './modal.vue'

export default{
	props: ['pass'],
    components: {
    },
    data: function () {
        return {
			lbm_cfrnc_sn : 0,
			bplc_sn : 0,
			prgrs_sittn : 0,
			mode:'',
			state:'',
			viewModel:{
				list:[],
				adminList:{},
				userInfo:{},
			}
        }
    },
	computed: {

	},
    methods: {
		fnInit: function(value) {
			let vt = this;
			let vm = this.viewModel;
			vm.userInfo = vt.$store.state.global.userInfo;
			vt.mode = (vt.pass.mode == '')? '':vt.pass.mode;
		
			vt.lbm_cfrnc_sn = value.lbm_cfrnc_mtg_sn;
			vt.bplc_sn = value.bplc_sn;
			vt.prgrs_sittn = value.prgrs_sittn;
			vt.$nextTick(function() {
				if(vt.prgrs_sittn >= 2 || vt.mode == 'view'){
					vt.state = 'update';
					vt.fnDetail();
					vt.$forceUpdate(); 
				}else{
					vt.fnList();
				}
			});
		},
		fnList:function(){
			let vt = this;
			let vm = this.viewModel;
			let data = {
				lbm_cfrnc_sn : vt.lbm_cfrnc_sn,
				process : 'consider'
			}

			Axios.post("/selectMauImplPlActDetail.do", data).then(function(response) {
				vm.adminList = response.data.adminConsiderList;
				for(let i=0; i<vm.adminList.length; i++){
					vm.list[i] = {
						artcl:'',
						apprvl:'',
						opps:'',
						fb_ck:false,
					}
				}
			})	
		},
		fnDetail:function(){
			let vt = this;
			let vm = this.viewModel;
			let data = {
				lbm_cfrnc_sn : vt.lbm_cfrnc_sn,
				bplc_sn : vt.bplc_sn,
				process : 'consider'
			}
			Axios.post("/selectMauImplPlActDetail.do", data).then(function(response) {
				vm.adminList = response.data.adminConsiderList;
				vm.list = response.data.considerDetail;
				for(let i=0; i<vm.list.length; i++){
					if(vm.list[i].fdbck_yn == 'Y'){
						vm.list[i].fb_ck = true;
					}else{
						vm.list[i].fb_ck = false;
					}
					if(vt.mode == 'view'){
						vm.list[i].artcln = vm.list[i].artcl.replaceAll(/(\n|\r\n)/g,'<br>');
					}
				}
				vt.$forceUpdate(); 
			})	
		},
		fnSave:function(){
			let vt = this;
			let vm = this.viewModel;
			let dataList = [];
			for(let i=0; i<vm.list.length; i++){
				vm.list[i].bplc_sn = vt.bplc_sn;
				vm.list[i].lbm_cfrnc_sn = vt.lbm_cfrnc_sn;
				vm.list[i].reg_id = vm.userInfo.user_id;
			}
			if(vt.state == 'update'){
				if(confirm("심의·의결 사항을 수정 하시겠습니까?")){ 
					Axios.post("/updateMauImplActConsider.do", vm.list).then(function(response) {
						if(response.date != 0){
							alert("수정 되었습니다.");
							vt.fnClose();
						}else{
							alert("수정이 중단되었습니다.");
						}
					})	
				}
			}else{
				if(confirm("심의·의결 사항을 저장 하시겠습니까?")){ 
					Axios.post("/insertMauImplActConsider.do", vm.list).then(function(response) {
						if(response.date != 0){
							alert("저장 되었습니다.");
							vt.fnClose();
						}else{
							alert("저장이 중단되었습니다.");
						}
					})	
				}
			}
		},
		
		
		fnClose:function(){
            this.$parent.fnInit();
            this.$emit('close',false);
        },
    }
}
</script>