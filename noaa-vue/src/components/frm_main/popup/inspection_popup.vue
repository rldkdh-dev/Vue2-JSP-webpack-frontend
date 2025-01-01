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
						<p class="table-title">정보</p>
						<table class="table pop" v-show="bool == false">
							<tbody>
								<tr>
									<td>안전보건점검종류</td>
                				    <td>{{ viewModel.list.subject }}</td>
                				</tr>
								<tr>
									<td>특이사항</td>
                				    <td>{{ viewModel.list.cat1 }}</td>
                				</tr>
								<tr>
									<td>사업장</td>
                				    <td>{{ viewModel.list.group_name }}</td>
                				</tr>
								<tr>
									<td>부서명</td>
                				    <td>{{ viewModel.list.dept_name }}</td>
                				</tr>
								<tr>
									<td>점검자</td>
                				    <td>{{ viewModel.list.user_name }}</td>
                				</tr>
								<tr>
									<td>점검일</td>
                				    <td>{{ viewModel.list.check_date }}</td>
                				</tr>
								<tr>
									<td>양호율</td>
                				    <td class="w300">
										<Percent :pass = "{max: viewModel.list.selection_rate_good + viewModel.list.selection_rate_bad + viewModel.list.selection_rate_none, val: viewModel.list.selection_rate_good, rest: viewModel.list.selection_rate_bad}"></Percent>
									</td>
                				</tr>
								<tr>
									<td>서명</td>
                				    <td><img :src="viewModel.list.signature_json"></td>
                				</tr>
							</tbody>
						</table>
						<br>
						<!-- <p class="table-title">점검항목</p>
						<p class="table-title">점검결과</p> -->
						<table class="table pop" v-show="bool == false">
							<thead>
								<tr>
									<td class="table-title">점검항목</td>
									<td class="table-title">점검결과</td>
								</tr>
							</thead>
							<tbody>
								<tr v-for="item in viewModel.selectlist" :key="item">
                				    <td>
										{{ item.contents }}
									</td>
									<td class="tc w50" style="width:18%" v-if="item.value == 1">
										<span class="m_state1 prt-bg">양호</span>
									</td>
									<td class="tc w50" style="width:18%" v-else-if="item.value == 2">
										<span class="m_state2 prt-bg">불량</span>
									</td>
									<td v-else>
										해당없음
									</td>
                				</tr>
							</tbody>
						</table>
						<div class="tc mt10">
							<input class="btn btn-print btn-dark" type="button" value="인쇄하기" onclick="window.print();"> 
						</div>
						<!-- <div class="buttonbox">
							<a href="javascript:void(0);" class="btn btn-save btn-primary" v-on:click="fnUpdate()">저장</a>
							<a href="javascript:void(0);" class="btn btn-cancel" onclick="btn_formbox_close();">취소</a>
						</div> -->
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
import Percent from "../../../common/percent.vue";

export default {
	components: {
        	Percent
		},
	data: function () {
		return {
			title:"",
			bool:false,
			viewModel:{
				list:[],
				selectlist:[],
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
			this.title = "보건관리자 순회점검";
			this.fnSetContents(id);
			this.fnSetSelectContents(id);
		},
		fnSetContents: function(id){
    		let vm = this;

    		let senddata = {
    			mapperId: 'inspection.selectinspectionpopupList',
                uid: id,
    		};
    		Axios.post("/detail", senddata).then(function(rs) {
                vm.viewModel.list = rs.data[0];

				if(vm.viewModel.list.signature_json != undefined){
					if(vm.viewModel.list.signature_json.charAt()=='/') {       //리눅스 경로때문에 사용
						vm.viewModel.list.signature_json = vm.viewModel.list.signature_json;
					} else {    //아닐경우
						vm.viewModel.list.signature_json = vm.viewModel.list.signature_json.substr(2);
					}
					vm.$refs.signature.fnInitCanvas(vm.viewModel.list.signature_json);
				}
            });
		},
		fnSetSelectContents: function(id){
    		let vm = this;

    		let senddata = {
    			mapperId: 'inspection.selectinsppopupList',
                uid: id,
    		};
    		Axios.post("/detail", senddata).then(function(rs) {
                vm.viewModel.selectlist = rs.data;
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
