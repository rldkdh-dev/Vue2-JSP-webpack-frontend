<template>
	<div>
		<div id='mask' class="overlay_mask"></div>
		<div id="popupBase"  class="overlay_formbox ui-draggable" ref="draggableContainer">
	  		<div class="overlay_gen_box ui-resizable">
				<a href="javascript:void(0);" class="btn_fullscreen" onclick="btn_fullscreen();"></a>
				<a href="javascript:void(0);" class="btn_formbox_close" onclick="btn_formbox_close();"></a>
		  
				<div class="formbox_panel">
					<div class="title-area type">
						<span class="title"  @mousedown="dragMouseDown">{{ title }}</span>
					</div><!-- //title-area -->
					<div class="content-area res">
						<PDFviewer ref="PDFviewer" v-show="bool == true"></PDFviewer>
						<p class="table-title">가동전 점검 정보</p>
						<table class="table pop" v-show="bool == false">
							<tbody>
								<tr>
									<td>공정명</td>
                				    <td>{{ viewModel.list.cat1 }}</td>
                				</tr>
								<tr>
									<td>개선실행 계획</td>
                				    <td>{{ viewModel.list.cat2 }}</td>
                				</tr>
								<tr>
									<td>재해형태</td>
                				    <td>{{ viewModel.list.cat3 }}</td>
                				</tr>
								<tr>
									<td>개선대책</td>
                				    <td>{{ viewModel.list.contents1 }}</td>
                				</tr>
								<tr>
									<td>조치부서</td>
                				    <td>{{ viewModel.list.measure_dept_name }}</td>
                				</tr>
							</tbody>
						</table>
						<br>
						<p class="table-title">조치내용 등록</p>
						<table class="table pop" v-show="bool == false">
							<tbody>
								<tr>
									<td>조치담당자</td>
                				    <td>
										{{ viewModel.list.user_name }}
									</td>
                				</tr>
								<tr>
									<td>조치예정일</td>
                				    <td>
										<div class="datepicker_box">
											<input type="text" name="measure_date" class="datepicker" id="measure_date" v-model="viewModel.list.measure_date" readonly>
										</div>
									</td>
                				</tr>
								<tr>
									<td>조치내용 등록</td>
                				    <td>
										<textarea name="contents2" class="full" style="resize:vertical; height:150px;" v-model="viewModel.list.contents2"></textarea>
									</td>
                				</tr>
							</tbody>
						</table>
						<p class="table-title">첨부</p>
						<td>
							<fileform @filelist="fnFilelist" :pass="{id:'aip'}" ref="files"></fileform>
						</td>
						<div class="buttonbox">
							<a href="javascript:void(0);" class="btn btn-save btn-primary" v-on:click="fnUpdate()">저장</a>
							<a href="javascript:void(0);" class="btn btn-cancel" onclick="btn_formbox_close();">취소</a>
						</div>
					</div>
				</div>
				<div class="ui-resizable-handle ui-resizable-se of_rse" style="z-index:90; display:block;"></div>
			</div>
		</div>
	</div>
	
</template>
<style>
.close:after {content: "\00d7"; font-size:25pt;line-height:45px;}
</style>
<script>
import Axios from 'axios';
import Fileform from '../fileform.vue'

export default {
	components: {
			'fileform': Fileform,
	},
	data: function () {
		return {
			title:"",
			bool:false,
			viewModel:{
				list:[],
				keyword:"",
				pageNum:0,
				userInfo:"",
				filelist: [],
				fileGroup: ''
			},
			positions: {
				clientX: undefined,
				clientY: undefined,
				movementX: 0,
				movementY: 0
			}
		}
	},
	mounted: function (id) {
		// console.log(this)
		let vm = this;
		$("#measure_date").datepicker({ dateFormat: "yy-mm-dd" });
		vm.userInfo = vm.$store.state.global.userInfo.team_leader;
	},
	methods: {
		fnInit: function(id) {
			$("#popupBase").show();
			$("#mask").show();
			this.bool = false;
			this.title = "가동전 점검 조치내용 등록";
			this.fnSetContents(id);
		},
		fnSetContents: function(id){
    		let vm = this;

    		let senddata = {
    			mapperId: 'psm.detailprocessImprPlanList',
                uid: id,
    		};
    		Axios.post("/detail", senddata).then(function(rs) {
                vm.viewModel.list = rs.data[0];
				console.log(vm.viewModel.list);
				if(vm.viewModel.list.attach_file_result != undefined) {
					vm.$refs.files.fnFileLoad(vm.viewModel.list.attach_file_result);
				}
            });
		},
		fnUpdate: function(){
    		let vm = this; 
    		let data = {
  	 	    	mapperId : 'psm.updateprocessImprPlanpopupInfo',
				uid : vm.viewModel.list.uid,
				measure_date : $('#measure_date').val(),
				contents2 : vm.viewModel.list.contents2,
				attach_file_result : vm.viewModel.fileGroup,
  	 	    };
			
     		Axios.post("/update",data)
  			.then(function(response) {
				if(vm.viewModel.fileGroup!='') {
					vm.$refs.files.fnInsertFile()
				}
				alert("저장되었습니다.");
				window.location.reload(true);
  			});
    	},
		dragMouseDown: function (event) {
			event.preventDefault()
			// get the mouse cursor position at startup:
			this.positions.clientX = event.clientX
			this.positions.clientY = event.clientY
			document.onmousemove = this.elementDrag
			document.onmouseup = this.closeDragElement
			},
			elementDrag: function (event) {
			event.preventDefault()
			this.positions.movementX = this.positions.clientX - event.clientX
			this.positions.movementY = this.positions.clientY - event.clientY
			this.positions.clientX = event.clientX
			this.positions.clientY = event.clientY
			// set the element's new position:
			this.$refs.draggableContainer.style.top = (this.$refs.draggableContainer.offsetTop - this.positions.movementY) + 'px'
			this.$refs.draggableContainer.style.left = (this.$refs.draggableContainer.offsetLeft - this.positions.movementX) + 'px'
			},
			closeDragElement () {
			document.onmouseup = null
			document.onmousemove = null
		},
		fnFilelist: function(vm) {
				this.viewModel.filelist = vm.filelist;
				this.viewModel.fileGroup = vm.fileGroup;
		},
	}
	
};
</script>
