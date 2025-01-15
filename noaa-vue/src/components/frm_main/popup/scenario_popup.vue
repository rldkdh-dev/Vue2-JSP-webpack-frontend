<template>
	<div>
		<div id='mask' class="overlay_mask"></div>
		<div id="popupBase"  class="overlay_formbox ui-draggable" ref="draggableContainer">
	  		<div class="overlay_gen_box ui-resizable" style="width: 800px;">
				<a href="javascript:void(0);" class="btn_fullscreen" onclick="btn_fullscreen();"></a>
				<a href="javascript:void(0);" class="btn_formbox_close" onclick="btn_formbox_close();"></a>
		  
				<div class="formbox_panel">
					<div class="title-area type">
						<span class="title"  @mousedown="dragMouseDown">시나리오 선택</span>
					</div>
					<div class="content-area res"> 
						<div class="search-area mb10">
							<input type="text" name="sw" class="w200"  v-model="viewModel.keyword">
							<button type="button" class="btn btn-dark" @click="fnSetContents();">검색</button>
						</div>

						<table>
							<caption>시나리오</caption>
							<thead>
								<tr>
									<th scope="col"><a>사업장명</a></th>
									<th scope="col"><a>부서명</a></th>
									<th scope="col"><a>공정명</a></th>
									<th scope="col"><a>설비명</a></th>
									<th scope="col"><a>비상상황(시나리오)</a></th>
									<th scope="col">선택</th>
								</tr>
							</thead>
							<tbody>
								<tr v-for = "item in viewModel.list" :key="item.uid">
									<td scope="row">{{item.sgroup_name}}</td>
									<td>{{item.sdept_name}}</td>
									<td>{{item.work_name}}</td>
									<td>{{item.eqname}}</td>
									<td>{{item.title}}</td>
									<td>
										<a href="javascript:void(0);" class="btn btn2 btn-icon" value="item.uid" v-on:click="fnRowClick(item)">선택</a>
									</td>
									<td colspan="6" v-if="viewModel.list == null">게시물이 없습니다.</td>
								</tr>
							</tbody>
						</table>
					
						<div class="table_footer">
							<pager v-bind:pass="viewModel.pager"></pager>
						</div>
					</div>
				</div>
				<div class="ui-resizable-handle ui-resizable-se of_rse" style="z-index:90; display:block;"></div>
			</div>
		</div>
	</div>
</template>
<script>
import Axios from 'axios';
import Vue from 'vue';
import Pager from '../../paging.vue'

export default {
	components: {
		Pager
	},
	data: function () {
		return {
			viewModel:{
				list:[],
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
			positions: {
				clientX: undefined,
				clientY: undefined,
				movementX: 0,
				movementY: 0
			}
		}
	},
	mounted: function () {
		console.log('scenario-popup')
	},
	methods: {
		fnInit: function() {
			$("#popupBase").show();
			$("#mask").show();
			this.fnSetContents();
		},
		fnSetContents: function(){
			let vt = this;  
			let vm = this.viewModel;  
			let senddata = {
				mapperId: 'scenario.scenarioList',   
				totalId: 'scenario.scenarioListCNT',
				pageNo: vm.pager.pageNo, 
				pageSize: vm.pager.rowSize,  
				keyword: (vm.keyword == '') ? null : vm.keyword,
			};
			Axios.post("/list", senddata).then(function(response) {
				vm.list = response.data.list;
				vm.pager.totalSize = response.data.totalCNT;
				Pager.props = Pager.methods.createPaging(vm.pager, vt, "list");
			});
		},
		fnRowClick : function(item){
			this.$parent.scenariouid = item.uid;		
			this.$parent.scenarioName = item.title;
			
			$('.overlay_mask, .overlay_formbox').hide();
			$('body').removeClass("fix");
			
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
