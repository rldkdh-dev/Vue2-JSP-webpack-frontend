<template>
	<modal :pass="{widthObject: 1000, popupTitle:'정비이력'}">
		<template v-slot:contents>
			<p class="table-title">정보</p>
			<table>
				<caption>정비이력</caption>
				<colgroup>
					<col width="10%">
					<col width="90%">
				</colgroup>
				<tbody>
					<tr>
						<th scope="row">정비일자</th>
						<td>{{ viewModel.item.work_date }}</td>
					</tr>
					<tr>
						<th scope="row">설비번호</th>
						<td>{{ viewModel.item.fcno }}</td>
					</tr>
					<tr>
						<th scope="row">설비명</th>
						<td>{{ viewModel.item.fc_pf_name }}</td>
					</tr>
					<tr>
						<th scope="row">정비구분</th>
						<td>{{ viewModel.item.repair_type }}</td>
					</tr>
					<tr>
						<th scope="row">점검자</th>
						<td>{{ viewModel.item.user_dpet_name }} {{ viewModel.item.user_name }}</td>
					</tr>
					<tr>
						<th scope="row">정비 내용</th>
						<td>{{ viewModel.item.contents }}</td>
					</tr>
					<tr>
						<th scope="row">판정<br/>(점검결과)</th>
						<td>{{ viewModel.item.status_name }}</td>
					</tr>
					<tr>
						<th scope="row">사진</th>
						<td>
							<imgsfileform @filelist="fnFilelist" :pass="{id:'fr', mode:'view'}" ref="imgfile"></imgsfileform>
						<!-- <? if($view['filename']){ ?><img style="width:400px;" src="<?=DATA_URL."/file/psm_facility_repair/".$view['filename']?>" alt="사진"><? } ?> -->
						</td>
					</tr>
				</tbody>
			</table>
		</template>
	</modal>
</template>
<script>
import Axios from 'axios';
import Vue from 'vue'
import Pager from '../../paging.vue'
import Modal from './modal.vue'
import imgsfileform from '../imgsfileform.vue';

export default {
	components: {
		Pager, Modal, imgsfileform
	},
	data: function () {
		return {
			viewModel:{
				item:{},
			},
		}
	},
	mounted: function () {
	},
	methods: {
		fnInit: function(id) {
			Modal.methods.fnInit();
			this.fnSetContents(id);
		},
		fnSetContents: function(id){
			let vt = this;  
			let vm = this.viewModel;  
			let data = {
				mapperId: 'faci.selectFacilityRepair',
				pageNo: 0,
				uid: id,
			};
			Axios.post("/list",data).then(function(rs) {
				vm.item = rs.data.list[0];

				let file = vm.item.img_attach_file;
				if(file != undefined) {
					vt.$refs.imgfile.fnFileLoad(file);
				}else{
					vt.$refs.imgfile.fnInit();
				}
			});
		},
		fnRowClick : function(item){
			$('.overlay_mask, .overlay_formbox').hide();
			$('body').removeClass("fix");
			
		},
	}
};
</script>
