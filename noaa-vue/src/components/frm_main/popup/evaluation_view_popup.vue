<template>
	<div>
		<div id='mask' class="overlay_mask" style="opacity: 0.45; display: none;"></div>
		<div id="popupBase"  class="overlay_formbox ui-draggable" ref="draggableContainer">
	  		<div class="overlay_gen_box ui-resizable">
				<a href="javascript:void(0);" class="btn_fullscreen" onclick="btn_fullscreen();"></a>
				<a href="javascript:void(0);" class="btn_formbox_close" onclick="btn_formbox_close();"></a>
		  
				<div class="formbox_panel">
					<div class="title-area type">
						<span class="title"  @mousedown="dragMouseDown">{{ title }}</span>
					</div><!-- //title-area -->
					<div class="content-area res">
                        <div class=" mb10">
							<h2></h2>
							<p>피평가자 : {{ tgt_membername }}</p>
						</div>

						<div class="fr mb10" v-if="eval_date != null" >
							<span>평가일 : {{ eval_date }}</span>
							<span>{{ eval_membername }}</span>
							<span></span>
							<span></span>
						</div>
						<input type="hidden" name="eval_uid" value="">
						<table id="tbl_checklist" class="">
							<thead>
							<tr>
								<!--<th>선택</th>-->
								<th>항목</th>
								<th class="w50">배점</th>
								<th class="w60">득점</th>
							</tr>
							</thead>
							<tbody >
								<tr v-for="item in viewModel.list" :key="item.uid">
									<td class="tl">{{ item.title }}</td>
									<td>{{ item.point }}</td>
									<td class="np">{{ item.base_point }}</td>
								</tr>
							</tbody>
							<tfoot>
								<tr>
									<td>합계</td>
									<td>100</td>
									<td><span id="dpoint_sum">{{ sum }}</span></td>
								</tr>
							</tfoot>
						</table>

                        <p class="table-title mt30 prt-bg">개선 정보</p>
                        <div class="section-view">
                            <table>
                                <tbody>
                                    <tr>
                                        <th class="w180">개선계획</th>
                                        <td>{{ contents1 }}</td>
                                    </tr>
                                    <tr>
                                        <th>개선 결과</th>
                                        <td>{{ contents2 }}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
					</div>
				</div>
				<div class="ui-resizable-handle ui-resizable-se of_rse" style="z-index:90; display:block;"></div>
			</div><!-- //overlay_gen_box -->
		</div><!-- //overlay_formbox -->
	</div>
	
</template>
<script>
import Axios from 'axios';
import { verify } from 'crypto';
import Vue from 'vue'
// import Pager from '../../paging.vue'
export default {
	data: function () {
		return {
            contents1:"",
            contents2:"",
			point:0,
			sum:0,
			eval_date:null,
			tgt_membername:"",
			eval_membername:"",
			eval_memberuid:"",
			title:"",
			base_point:0,
			viewModel:{
				list:[],
				keyword:"",
				pageNum:0,
			},
			positions: {
				clientX: undefined,
				clientY: undefined,
				movementX: 0,
				movementY: 0
			}
		}
	},
	mounted: function () {
		// console.log(this)
		
	},
	methods: {
		fnInit: function(uid) {
			$("#popupBase").show();
			$("#mask").show();
			// this.title = "테스트";
			this.fnSetContents(uid);
		},
		fnSetContents: function(uid){
			let vm = this;
            vm.sum = 0;
    		let senddata = {
    			mapperId: 'check.modalevaluation',
                totalId: 'check.selectRegListTotal',
                eval_uid: uid,
                pageNo: 1,
                pageSize: 10,
    		};
    		Axios.post("/list", senddata).then(function(rs) {
                vm.viewModel.list = rs.data.list;
				vm.tgt_membername = vm.viewModel.list[0].tgt_membername;
				vm.eval_date = vm.viewModel.list[0].eval_date;
				vm.eval_memberuid = vm.viewModel.list[0].eval_memberuid;
				vm.eval_membername = vm.viewModel.list[0].eval_membername;
                vm.title = vm.viewModel.list[0].evaluation_name;
                vm.contents1 = vm.viewModel.list[0].contents1;
                vm.contents2 = vm.viewModel.list[0].contents2;
				if(vm.viewModel.list[0].eval_date != null){
					for(var i=0; i<vm.viewModel.list.length; i++){
						vm.sum += vm.viewModel.list[i].base_point;
					}
					
				}
				// for(var i=0; i<vm.viewModel.list.length; i++){

                // }
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
