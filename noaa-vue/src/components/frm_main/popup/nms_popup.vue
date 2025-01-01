<template>
	<div>
	<div id='mask' class="overlay_mask" style="opacity: 0.45; display: none;"></div>
	<div id="popupBase" class="overlay_formbox ui-draggable" ref="draggableContainer">
		<div class="overlay_gen_box ui-resizable">
			<a href="javascript:void(0);" class="btn_fullscreen" onclick="btn_fullscreen();"></a>
			<a href="javascript:void(0);" class="btn_formbox_close" onclick="btn_formbox_close();"></a>
		<div class="formbox_panel">
			<div class="title-area ui-draggable-handle">
				<span class="title">아차사고</span>
			</div><!-- // title-area -->

			<div class="content-area res danger">
				<p class="table-title">아차사고 정보</p>
				<table class="mt10">
					<tbody>
					<tr>
						<th style="width:120px;">제목</th>
						<td class="tl">{{viewModel.list.subject}}</td>
					</tr>
					<tr>
						<th style="width:120px;">일자</th>
						<td class="tl">{{viewModel.list.stc_dt}}</td>
					</tr>
					<tr>
						<th>위치</th>
						<td class="tl">{{viewModel.list.area_name}}</td>
					</tr>
					<tr>
						<th>성명</th>
						<td class="tl">{{viewModel.list.user_name}}</td>
					</tr>
					<tr>
						<th>부서</th>
						<td class="tl">{{viewModel.list.name}}</td>
					</tr>
					<tr>
						<th>내용</th>
						<td class="tl">{{viewModel.list.contents}}</td>
					</tr>
							<tr>
						<th>재발방지대책</th>
						<td class="tl">{{viewModel.list.contents2}}</td>
					</tr>
							<tr>
						<th>사진</th>
						<td style="padding-bottom:5px;">
							<img :src="viewModel.list.img_file_path">
						</td>
					</tr>
					</tbody>
				</table>
			</div><!-- // content-area -->
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

export default {
	data: function () {
		return {
			viewModel:{
				list:{},
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
			let uid = parseInt(id);
			let senddata = {
				mapperId : 'worksStaticMapper.detailList',
				pageNo: 0, 
				uid: uid,
				
			};
			Axios.post("/detail", senddata).then(function(response) {
				vm.list = response.data[0];
			});
		},
		
		
	}
};
</script>
