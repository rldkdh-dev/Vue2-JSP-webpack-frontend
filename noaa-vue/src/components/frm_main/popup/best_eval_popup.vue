<template>
	<modal :pass="{widthObject: 500, popupTitle:'우수사례 평가하기'}">
		<template v-slot:contents>
			<p class="table-title">우수사례 정보</p>
			<table class="mt10">
				<caption>우수사례 정보</caption>
				<tbody>
				<tr>
					<th scope="row" style="width:120px;">제목</th>
					<td class="tl">{{ viewModel.list2.subject }}</td>
				</tr>
				<tr>
					<th scope="row" style="width:120px;">우수사례 일자</th>
					<td class="tl">{{ viewModel.list2.stc_dt }}</td>
				</tr>
				<tr>
					<th scope="row">위치</th>
					<td class="tl">{{ viewModel.list2.area_name }}</td>
				</tr>
				<tr>
					<th scope="row">내용</th>
					<td class="tl">{{ viewModel.list2.contents }}</td>
				</tr>
				<tr>
					<th scope="row">사진</th>
					<td style="padding-bottom:5px;"><img :src="viewModel.list2.file_path" style="width:auto;max-height:300px;"></td>
				</tr>
				</tbody>
			</table>

			<p class="table-title mt20">우수사례를 평가해주세요.</p>
			<table class="mt10">
				<tbody>
				<tr>
					<th scope="row"><label for="be_point">점수</label></th>
					<td class="tl" style="padding: 7px 8px 7px">
						<select id="be_point" v-model="viewModel.list2.eachpoint">
							<option value="100">100</option>
							<option value="90">90</option>
							<option value="80">80</option>
							<option value="70">70</option>
							<option value="60">60</option>
							<option value="50">50</option>
							<option value="40">40</option>
							<option value="30">30</option>
							<option value="20">20</option>
							<option value="10">10</option>
							<option value="0">0</option> 
						</select>

					</td>
				</tr>
				<tr>
					<th scope="row"><label for="be_contents">평가내용</label></th>
					<td class="tl" style="padding-bottom:8px;"><textarea id="be_contents" class="vertical" style="width:100%;height:140px;" value="" v-model="viewModel.list2.point_contents"></textarea></td>
				</tr>
				</tbody>
			</table>

			<div class="buttonbox mt15" style="text-align: center;">
				<input type="submit" value="저장" class="btn btn-save btn-primary" @click="fnInsertPoint">
				<a href="javascript:btn_formbox_close();" class="btn btn-cancel">취소</a>
			</div>
		</template>
	</modal>
</template>
<script>
import Axios from 'axios';
import Vue from 'vue'
import Pager from '../../paging.vue'
import Modal from '../popup/modal.vue'

export default {
	components: {
		Pager, Modal
	},
	data: function () {
		return {
			id : 0,
			content: "",
			viewModel:{
				list:[],
				list2:{
				},
				keyword:"",
				pageNum:0,
				pager: {
					model: {},
					pageNo: 1,
					totalSize: 0,
					rowSize:5,
					blockSize: 5,
					list: [],
					callBack: function (n) {
						this.model.fnSetContents();
					}
				},
			},
			user: {}
			
		}
	},
	mounted: function () {
	},
	methods: {
		fnInit: function(id) {
			let vm = this;
			Modal.methods.fnInit();
			// this.fnSetContents(id);
			vm.id = id;
			vm.user = vm.$store.state.global.userInfo;
			this.fnList(id);
		},
		fnList: function(){
			let vt = this;
			let vm = this.viewModel;
			let data = {
					mapperId: 'do.bestList',
					uid: vt.id,
					memberuid: vt.user.memberuid,
					pageNo:0
				};
				Axios.post("/list",data).then(function(rs) {
					vm.list2 = rs.data.list[0];
				});
		},
		fnSetContents: function(){
			let vt = this;  
			let vm = this.viewModel;  
			let senddata = {
				mapperId : 'base.selectdeptList',
				totalId : 'base.selectdeptTotalCount',
				pageNo: vm.pager.pageNo, 
				pageSize: vm.pager.rowSize,  
				name: vm.keyword 
			};
			Axios.post("/list", senddata).then(function(response) {
				vm.list = response.data.list;
				vm.pager.totalSize = response.data.totalCNT;
				Pager.props = Pager.methods.createPaging(vm.pager, vt, "list");
			});
		},
		
		fnRowClick : function(item){
			this.$parent.deptuid = item.uid;		
			this.$parent.dept = item.name;
			this.$parent.groupuid = item.group_uid;		
			this.$parent.group = item.group_name;
			
			$('.overlay_mask, .overlay_formbox').hide();
			$('body').removeClass("fix");
			
		},

		fnInsertPoint : function(){
			let vm = this;
			let senddata = {
				mapperId : 'do.bestPointDelete',
				ws_uid: parseInt(vm.viewModel.list2.uid),
				memberuid: parseInt(vm.user.memberuid),
			};

			let senddata2 = {
				mapperId : 'do.bestPointInsert',
				ws_uid: parseInt(vm.viewModel.list2.uid),
				memberuid: parseInt(vm.user.memberuid),
				point: parseInt(vm.viewModel.list2.eachpoint),
				contents: vm.viewModel.list2.point_contents
			};

			Axios.post("/delete", senddata).then(function(response) {
				Axios.post("/insert", senddata2).then(function(response) {
					vm.list = response.data.list;
					alert('저장완료');
					window.location.reload(true);
				});
			});
		}
	}
};
</script>
