<template>
	<div>
		<div id='mask' class="overlay_mask" style="opacity: 0.45; display: none;"></div>
		<div id="popupBase"  class="overlay_formbox ui-draggable" style="left: 42%; top: 15%; position: absolute; display:none;" ref="draggableContainer">
	  		<div class="overlay_gen_box ui-resizable" style="width: 500px;">
				<a href="javascript:void(0);" class="btn_fullscreen" onclick="btn_fullscreen();"></a>
				<a href="javascript:void(0);" class="btn_formbox_close" onclick="btn_formbox_close();"></a>
		  
				<div class="formbox_panel">
					<div class="title-area type">
						<span class="title"  @mousedown="dragMouseDown">{{ title }}</span>
					</div><!-- //title-area -->
					<div class="content-area res">
						<PDFviewer ref="PDFviewer" v-show="bool == true"></PDFviewer>
						<p class="table-title">위원회/협의체 정보</p>
						<table class="table pop" v-show="bool == false">
							<tbody>
								<tr>
									<td>분류</td>
                				    <td>{{ viewModel.list.cat1 }}</td>
                				</tr>
								<tr>
									<td>회의일자</td>
                				    <td>{{ viewModel.list.comm_date }}</td>
                				</tr>
								<tr>
									<td>회의 내용</td>
                				    <td>{{ viewModel.list.contents1 }}</td>
                				</tr>
								<tr>
									<td>조치부서</td>
                				    <td>{{ viewModel.list.dept_name }}</td>
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
											<input type="text" name="measure_date" class="datepicker" id="measure_date" readonly>
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
export default {
	data: function () {
		return {
			title:"",
			bool:false,
			viewModel:{
				list:{},
				keyword:"",
				pageNum:0,
				userInfo:"",
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
			this.title = "위원회/협의체 조치내용 등록";
			this.fnSetContents(id);
		},
		fnSetContents: function(id){
    		let vm = this;

    		let senddata = {
    			mapperId: 'act.selectcmttpopupList',
                uid: id,
    		};
    		Axios.post("/detail", senddata).then(function(rs) {
                vm.viewModel.list = rs.data[0];
				$('#measure_date').val(vm.viewModel.list.measure_date);
            });
		},
		fnUpdate: function(){
    		let vm = this; 
    		let data = {
  	 	    	mapperId : 'act.updatecmttpopupInfo',
				uid : vm.viewModel.list.uid,
				measure_date : $('#measure_date').val(),
				contents2 : vm.viewModel.list.contents2,
  	 	    };
     		Axios.post("/update",data)
  			.then(function(response) {
				window.location.reload(true);
				alert("저장되었습니다.");
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
		}
	}
	
};
</script>
