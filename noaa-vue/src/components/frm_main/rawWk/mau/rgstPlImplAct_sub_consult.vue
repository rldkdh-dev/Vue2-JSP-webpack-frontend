<template v-slot:contents>
	<div>
		<div>
			<table class="table write">
				<caption>협의</caption>
				<thead>
					<th scope="col" class="w300">항목</th>
					<th scope="col">협의 내용</th>
					<th scope="col">협의 결과</th>
				</thead>
				<tbody v-if="mode!='view'">
					<tr v-for="(item, i) in viewModel.adminList" :key="i">
						<td class="text-left">{{ item.artcl_cn }}</td>
						<td><textarea rows="5" title="협의 내용" v-model="viewModel.list[i].cn" ></textarea></td>
						<td><textarea rows="5" title="협의 결과" v-model="viewModel.list[i].rslt" ></textarea></td>
					</tr>
				</tbody>
				<tbody v-if="mode=='view'">
					<tr v-for="(item, i) in viewModel.adminList" :key="i">
						<td class="text-left" width="30%">{{ item.artcl_cn }}</td>
						<td class="text-left" width="35%"><p v-html="viewModel.list[i].cn"></p></td> 
						<td class="text-left" width="35%"><p v-html="viewModel.list[i].rslt"></p></td> 
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
				if(vt.prgrs_sittn >= 3 || vt.mode == 'view'){
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
				process : 'consult'
			}

			Axios.post("/selectMauImplPlActDetail.do", data).then(function(response) {
				vm.adminList = response.data.adminConsultList;
				for(let i=0; i<vm.adminList.length; i++){
					vm.list[i] = {};
				}
			})	
		},
		fnDetail:function(){
			let vt = this;
			let vm = this.viewModel;
			let data = {
				lbm_cfrnc_sn : vt.lbm_cfrnc_sn,
				bplc_sn : vt.bplc_sn,
				process : 'consult'
			}

			Axios.post("/selectMauImplPlActDetail.do", data).then(function(response) {
				vm.adminList = response.data.adminConsultList;
				vm.list = response.data.consultDetail;
				if(vt.mode == 'view'){
					for(let i=0; i<vm.list.length; i++){
						vm.list[i].cn = vm.list[i].cn.replaceAll(/(\n|\r\n)/g,'<br>');
						vm.list[i].rslt = vm.list[i].rslt.replaceAll(/(\n|\r\n)/g,'<br>');
					}
				}
				vt.$forceUpdate(); 
			})	
		},
		fnSave:function(){
			let vt = this;
			let vm = this.viewModel;
			for(let i=0; i<vm.list.length; i++){
				vm.list[i].bplc_sn = vt.bplc_sn;
				vm.list[i].lbm_cfrnc_sn = vt.lbm_cfrnc_sn;
				vm.list[i].reg_id = vm.userInfo.user_id;
			}
			if(vt.state == 'update'){
				if(confirm("협의 사항을 수정 하시겠습니까?")){ 
					Axios.post("/updateMauImplActConsult.do", vm.list).then(function(response) {
						if(response.date != 0){
							alert("수정 되었습니다.");
							vt.fnClose();
						}else{
							alert("수정이 중단되었습니다.");
						}
					}).catch(function(){
						alert("저장이 중단되었습니다.");
					})	
				}
			}else{
				if(confirm("협의 사항을 저장 하시겠습니까?")){ 
					Axios.post("/insertMauImplActConsult.do", vm.list).then(function(response) {
						if(response.date != 0){
							alert("저장 되었습니다.");
							vt.fnClose();
						}else{
							alert("저장이 중단되었습니다.");
						}
					}).catch(function(){
						alert("저장이 중단되었습니다.");
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