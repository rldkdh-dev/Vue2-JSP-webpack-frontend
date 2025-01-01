<template>
	<div>
	<div id='mask' class="overlay_mask" style="opacity: 0.45; display: none;"></div>
	<div id="popupBase" class="overlay_formbox ui-draggable" style="position: absolute; display: none; " ref="draggableContainer">
		<div class="overlay_gen_box ui-resizable">
			<a href="javascript:void(0);" class="btn_fullscreen" onclick="btn_fullscreen();"></a>
			<a href="javascript:void(0);" class="btn_formbox_close" onclick="btn_formbox_close();"></a>
			<div class="formbox_panel">
		<div class="title-area ui-draggable-handle">
			<span class="title">비차량계</span>
		</div><!-- // title-area -->

			<div class="content-area res danger">
				<p class="table-title prt-bg">정보</p>
				<div class="section-view">
					<template  v-if="viewModel.list.length != 0">
						<table>
							<tbody>
								<tr>
									<th class="w180">분류</th>
									<td>{{ viewModel.list.cat1 }}</td>
								</tr>
								<tr>
									<th>종류</th>
									<td>{{ viewModel.list.cat2 }}</td>
								</tr>
								<tr>
									<th>장비번호</th>
									<td>{{ viewModel.list.em_no }}</td>
								</tr>
								<tr>
									<th>운전자명</th>
									<td>{{ viewModel.list.driver }}</td>
								</tr>
								
								<tr>
									<th>안전교육 여부</th>
									<td v-if="viewModel.list.is_safe_edu==0">해당없음</td>
									<td v-if="viewModel.list.is_safe_edu==1">예</td>
									<td v-if="viewModel.list.is_safe_edu==2">아니오</td>
								</tr>

								<tr>
									<th>안전작업계획서 작성 여부</th>
									<td v-if="viewModel.list.is_safe_plan==0">해당없음</td>
									<td v-if="viewModel.list.is_safe_plan==1">예</td>
									<td v-if="viewModel.list.is_safe_plan==2">아니오</td>
								</tr>

								<tr>
									<th>부서명</th>
									<td>{{ viewModel.list.name }}</td>
								</tr>
								<tr>
									<th>점검자</th>
									<td>{{ viewModel.list.user_name }}</td>
								</tr>
								<tr>
									<th>점검일자</th>
									<td>{{ viewModel.list.check_date }}</td>
								</tr>
								<tr>
									<th>양호율</th>
									<td>
										<div class="type prt-bg">
											<percent :pass="{max: viewModel.list.max, val: viewModel.list.val, rest: viewModel.list.rest}"></percent>
										</div>
									</td>
								</tr>
								<tr>
									<th>특이사항</th>
									<td>{{ viewModel.list.check_etc }}</td>
								</tr>
								<tr>
									<th>서명</th>
									<td><img :src="viewModel.list.signature_json" style="width:50%;padding:10px;"></td>
								</tr>
							</tbody>
						</table>
					</template>
					<table class="form-table odd mt20 checklist-table">
						<tbody>
						<tr>
							<th class="sth prt-bg">점검항목</th>
							<th class="sth prt-bg" style="width:70px;">점검결과</th>
						</tr>
						<tr class="item" v-for="(item, i) in viewModel.dataList" :key="i">
							<th class="lft" >
								&nbsp;▪️ <span v-html="item.contents"></span>
							</th>
							<td class="tc w50">
								<span v-if="item.radiovalue==1" class="m_state1 prt-bg" style="margin-bottom:4px;">양호</span>
								<span v-if="item.radiovalue==2" class="m_state2 prt-bg" style="margin-bottom:4px;">불량</span>
								<span v-if="item.radiovalue==0" class="m_state3 prt-bg" style="margin-bottom:4px;">해당없음</span>
								<div class="checklist_photo photo_info" style="margin-top:5px;" v-if="item.file!=''">
									<a href="javascript:void(0)"><img :src=item.file_path></a>
									<p class="shot_time2">{{item.update_date}}</p>
								</div>
							</td>
						</tr>
									
						</tbody>
					</table>
				</div>
			</div>
		</div>
				<div class="ui-resizable-handle ui-resizable-se of_rse" style="z-index: 90; display: block;">
			</div>
		</div>
		</div>
	</div>
</template>
<script>
import Axios from 'axios';
import Vue from 'vue'
import percent from "../../../common/percent.vue";

export default {
	components: {
		'percent': percent,
	},
	data: function () {
		return {
			viewModel:{
				list:{},
				dataList:[]
			},
		}
	},
	mounted: function () {
		//console.log('popup')
	},
	methods: {
		fnInit: function(id) {
			let vm = this;
			$("#popupBase").show();
			$("#mask").show();
			vm.fnSetContents(id);
		},
		fnSetContents: function(id){
			let vt = this;  
			let vm = this.viewModel;  
			let d_id = parseInt(id);
			let senddata = {
				mapperId : 'machineChecklist.Checklist',
				pageNo: 0, 
				d_id: d_id,
				
			};
			Axios.post("/detail", senddata).then(function(response) {
				vm.list = response.data[0];
			});
			let senddata2 = {
				mapperId : 'machineChecklist.ChecklistData',
				checklist_uid: d_id
			};
			Axios.post("/detail", senddata2).then(function(response) {
				vm.dataList = response.data;
				vm.dataList.forEach(function(item){
					if (item.contents !== "" && item.contents !== null) {
						item.contents= item.contents.replace(/\r\n/g, "<br>\n");
					}
				});	
			});
		},
		
		
	}
};
</script>
