<template>
	<div>
		<div id='mask' class="overlay_mask" style="opacity: 0.45; display: none;"></div>
		<div id="popupBase"  class="overlay_formbox ui-draggable" style="left: 42%; top: 15%; position: absolute; display:none;" ref="draggableContainer">
	  		<div class="overlay_gen_box ui-resizable" style="width: 500px;">
				<a href="javascript:void(0);" class="btn_fullscreen" onclick="btn_fullscreen();"></a>
				<a href="javascript:void(0);" class="btn_formbox_close" onclick="btn_formbox_close();"></a>
		  
				<div class="formbox_panel">
					<div class="title-area type">
						<span class="title"  @mousedown="dragMouseDown">정보제공 수신확인 및 안전작업 계획서 접수 내역</span>
					</div><!-- //title-area -->
					<div class="content-area res"> 
						<table class="table">
							<!-- <caption>첨부파일</caption> -->
							<thead>
							<tr>
								<th scope="col">회사명</th>
								<th scope="col">성명</th>
								<th scope="col">수신일시</th>
								<th scope="col">안전작업계획서 첨부</th>
							</tr>
							</thead>
							<tbody>
								<tr v-for = "item in viewModel.list" :key="item.uid">
									<td scope="row">{{item.company}}</td>
									<td>{{item.dname}}</td>
									<td>{{item.regdt}}</td>
									<td>
										<a href="" class="btn btn-icon btn-info2" value="item.uid" @click.prevent="fnRowClick(item.file_seq)"><span class="mi">file_download</span></a>
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
			</div><!-- //overlay_gen_box -->
		</div><!-- //overlay_formbox -->
	</div>
</template>
<script>
import Axios from 'axios';
import Vue from 'vue'
//import Pager from '../../paging.vue'
import Common from '../../common.js'

export default {
	components: {
		//Pager
	},
	props: {
		//tableId: String,
		//tableName: String,
		callback: Function
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
		console.log(this)
	},
	methods: {
		fnInit: function(id) {
			$("#popupBase").show();
			$("#mask").show();
			this.fnSetContents(id);
		},
		fnSetContents: function(id){
			console.log(id)
			let vt = this;
    		let vm = this.viewModel;
    		let senddata = {
    			mapperId: 'subcontract.popup',
                totalId : 'subcontract.getSelectsubcontractplanlistTotal',
                fileGroupid: id,
                pageNo: vm.pager.pageNo,
                pageSize: vm.pager.rowSize,
    		};
			console.log(senddata)
    		Axios.post("/list", senddata).then(function(rs) {
                vm.list = rs.data.list;
                // vm.pager.totalSize = rs.data.totalCNT;
                // Pager.props = Pager.methods.createPaging(vm.pager, vt, "list");
            });
		},
		fnRowClick : function(item){
			Common.fnOnFileDownload(item)
			
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
