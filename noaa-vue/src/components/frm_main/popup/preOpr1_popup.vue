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
						<table class="table pop" v-show="bool == false">
							<thead>
								<tr>
                				    <th>제목</th>
                				    <th class="w65">타입</th>
                				    <th class="w80">용량</th>
                				    <th class="w100">등록날짜</th>
									<th class="w60">다운로드</th>
                				</tr>
							</thead>
							<tbody>
								<tr v-for="item in viewModel.list" :key="item">
                				    <td>{{ item.file_org_name }}</td>
                				    <td>
                				        <a :href="item.file_path" :class="item.file_type+'_icon'">{{ item.file_type }}</a>
                				    </td>
                				    <td>{{ item.file_size }}</td>
                				    <td>{{ item.regdt }}</td>
									<td>
										<a href="" class="btn btn-icon btn-info2" :value="item.uid" @click.prevent="fnRowClick(item.file_seq)"><span class="mi">file_download</span></a>
									</td>
                				</tr>
							</tbody>
						</table>
					</div>
				</div>
				<div class="ui-resizable-handle ui-resizable-se of_rse" style="z-index:90; display:block;"></div>
			</div>
		</div>
	</div>
	
</template>
<style>
.close:after {content: "\00d7"; font-size:25pt;line-height:45px;}
.PDF_icon {border: 1px solid #e18888;font-size: 10px;padding: 3px 4px 1px 4px;background: #f3a4a4;color: #fff;border-radius: 6px;}
.JPG_icon {border: 1px solid #a78c09;font-size: 10px;padding: 3px 4px 1px 4px;background: #c78a1a;color: #fff;border-radius: 6px;}
.XLSX_icon {border: 1px solid #0f700d;font-size: 10px;padding: 3px 4px 1px 4px;background: #388961;color: #fff;border-radius: 6px;}
</style>
<script>
import Axios from 'axios';
import { verify } from 'crypto';
import Vue from 'vue'
// import Pager from '../../paging.vue'
import PDFviewer from '../popup/PDF_popup.vue';
Vue.component('PDFviewer',PDFviewer);
export default {
	data: function () {
		return {
			title:"",
			bool:false,
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
	mounted: function (id) {
		// console.log(this)
	},
	methods: {
		fnInit: function(id) {
			$("#popupBase").show();
			$("#mask").show();
			this.bool = false;
			this.title = "첨부 파일";
			this.fnSetContents(id);
		},
		fnSetContents: function(id){
    		let vm = this;

    		let senddata = {
    			mapperId: 'psm.selectpreOprfileList',
                // totalId: 'check.selectRegListTotal',
                uid: id,
                // pageNo: vm.pager.pageNo,
                // pageSize: vm.pager.rowSize,
    		};
    		Axios.post("/detail", senddata).then(function(rs) {
                vm.viewModel.list = rs.data;
				console.log(vm.viewModel.list);
                // vm.pager.totalSize = rs.data.totalCNT;
				for(var i=0; i<vm.viewModel.list.length; i++){
                    if(vm.viewModel.list[i].file_size < 1024 * 1024){
                        vm.viewModel.list[i].file_size = parseInt(vm.viewModel.list[i].file_size / 1024).toFixed(1) + "K";
                    }
                }
            });
		},
		fileDown:function(seq){
            window.location="/file/download/"+seq
			$('.overlay_mask, .overlay_formbox').hide();
			$('body').removeClass("fix");
        },
		fnPdfView:function(path){
			this.title = 'PDF 뷰어';
			this.bool = true;
			this.$refs.PDFviewer.fnSetContents(path);
		},
		fnRowClick : function(item){
			console.log(item);
			// Common.fnOnFileDownload(item)
			window.location='/file/download/'+item;
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
