<template>
	<modal :pass="{widthObject: 600, popupTitle:'사고사례'}">
		<template v-slot:contents>
			<p class="table-title">사고사례 정보</p>
			<table class="mt10">
				<caption>사고사례 정보</caption>
				<tbody>
					<tr>
						<th scope="row" style="width:120px;">공장</th>
						<td class="tl">{{ s_group_name }}</td>
					</tr>
					<tr>
						<th scope="row" style="width:120px;">부서</th>
						<td class="tl">{{ s_dept_name }}</td>
					</tr>
					<tr>
						<th scope="row">설비</th>
						<td class="tl">{{ sarea }}</td>
					</tr>
					<tr>
						<th scope="row">날짜</th>
						<td class="tl">{{ case_date }}</td>
					</tr>
					<tr>
						<th scope="row">사고내용</th>
						<td class="tl">{{ contents }}</td>
					</tr>
					<tr>
						<th scope="row">재발방지대책</th>
						<td class="tl">{{ dresult }}</td>
					</tr>
					<tr>
						<th scope="row">사진</th>
						<td style="padding-bottom:5px;">
							<ul id="pop_slider">
								<li v-for="item in viewModel.fileList">
									<a class="imgpop"><img :src="item.file_path" alt="이미지"></a>
								</li>
							</ul>
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

export default {
	components: {
		Pager, Modal
	},
	data: function () {
		return {
			uid:"",
			s_group_name:"",
			s_dept_name:"",
			sarea:"",
			case_date:"",
			contents:"",
			dresult:"",
			file_path:"",
			viewModel:{
				list:[],
				fileList:[],
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
		}
	},
	mounted: function () {
		console.log('dept-popup')
	},
	methods: {
		fnInit: function(id) {
			Modal.methods.fnInit();
			this.uid = id;
			this.fnSetContents(id);
		},
		fnSetContents: function(){
			let vt = this;  
			let vm = this.viewModel;  
			let senddata = {
				mapperId : ['do.ExpopupList', 'do.ExpopupFileList'],
				// totalId : 'base.selectdeptTotalCount'
				pageNo: vm.pager.pageNo, 
				pageSize: vm.pager.rowSize,  
				uid: vt.uid,
			};
			Axios.post("/multiList", senddata).then(function(response) {
				vm.list = response.data.list1;

				vt.s_group_name = vm.list[0].s_group_name;
				vt.s_dept_name = vm.list[0].dept_name;
				vt.sarea= vm.list[0].sarea;
				vt.case_date= vm.list[0].case_date;
				vt.contents= vm.list[0].contents;
				vt.dresult= vm.list[0].dresult;

				vm.fileList = response.data.list2;

				for(let i=0; i<vm.fileList.length; i++){
					if(vm.fileList[i].file_path != undefined){
						if(vm.fileList[i].file_path.charAt()=='/') {       //리눅스 경로때문에 사용
							vm.fileList[i].file_path = vvm.fileList[i].file_path;
						} else {    //아닐경우
							vm.fileList[i].file_path = vm.fileList[i].file_path.substr(2);
						}
					}
				}
				// vt.file_path= vm.list[0].file_path;
				// vm.pager.totalSize = response.data.totalCNT;
				// Pager.props = Pager.methods.createPaging(vm.pager, vt, "list");
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
	}
};
</script>
