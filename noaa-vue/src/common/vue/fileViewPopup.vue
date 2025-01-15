<template>
	<div>
		<modal :pass="{popupTitle:'파일 팝업'}">
			<template v-slot:contents>
				<div>
					<table class="table">
						<caption>파일 목록</caption>
						<thead>
							<tr>
								<th>제목</th>
								<th class="w65">타입</th>
								<th class="w80">용량</th>
								<th class="w95">등록날짜</th>
								<th class="w60">다운로드</th>
							</tr>
						</thead>
						<tbody>
							<tr v-for="item in viewModel.list" :key="item">
								<td>{{ item.orgnl_file_nm }}</td>
								<td>
									<button class="imgpop" :href="item.strg_path+item.strg_file_nm" v-if="item.file_extn == 'JPG' || item.file_extn == 'PNG' || item.file_extn == 'GIF' || item.file_extn == 'jpg' || item.file_extn == 'png' || item.file_extn == 'gif'">
										<!-- <a @click="fnImgView($event)" class="btn btn-small btn-white">{{ item.file_extn }}</a>  -->
										<a data-magnify="gallery":href="item.strg_path+item.strg_file_nm" class="btn btn-small btn-white">
											<img :src="item.strg_path+item.strg_file_nm" style="display: none;">
											{{ item.file_extn }}
										</a>
									</button>
									<button v-else-if="item.file_extn == 'pdf' || item.file_extn == 'PDF'" @click="fnPdfView(item.strg_path+item.strg_file_nm,item.file_extn, item.orgnl_file_nm)" class="btn btn-small btn-white">{{ item.file_extn }}</button> <!-- pdf 뷰어 -->
									<button v-else>{{ item.file_extn }}</button>
								</td>
								<td>{{ item.file_sz|filesize }}</td>
								<td>{{ item.reg_dt|yyyyMMdd }}</td>
								<td>
									<button class="btn btn-small btn-default" @click="fnFileDown(item)"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-download"></use></svg>다운</button>
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</template>
		</modal>
		<PDFviewer ref="PDFviewer" v-if="bool == true"></PDFviewer>
	</div>
</template>
<style>
.close:after {content: "\00d7"; font-size:25pt;line-height:45px;}
.PDF_icon {border: 1px solid #e18888;font-size: 10px;padding: 3px 4px 1px 4px;background: #f3a4a4;color: #fff;border-radius: 6px;}
.JPG_icon {border: 1px solid #a78c09;font-size: 10px;padding: 3px 4px 1px 4px;background: #c78a1a;color: #fff;border-radius: 6px;}
.PNG_icon {border: 1px solid #a78c09;font-size: 10px;padding: 3px 4px 1px 4px;background: #c78a1a;color: #fff;border-radius: 6px;}
.XLSX_icon {border: 1px solid #0f700d;font-size: 10px;padding: 3px 4px 1px 4px;background: #388961;color: #fff;border-radius: 6px;}
</style>
<script>
import Axios from 'axios';
import Vue from 'vue'
// import Pager from '../../paging.vue'
import PDFviewer from './pdfViewer.vue';
import Modal from './modal.vue'
import common from '../../common/js/common.js'

Vue.component('PDFviewer',PDFviewer);
export default {
	props: ['pass'],
	components: {
		Modal,
		// 'PDFviewer' : PDFviewer
	},
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
			},
			gbn:'',
		}
	},
	mounted: function () {
		// console.log(this)
	},
	methods: {
		fnInit: function(list, gbn) {
			Modal.methods.fnInit();
			this.fnList(list, gbn);
			this.bool=false;
		},
		fnList: function(list, gbn){
			let vm = this;
			
			vm.gbn = gbn;
			vm.viewModel.list = list;

			for(let i=0; i<vm.viewModel.list.length; i++){
				let item = vm.viewModel.list[i].strg_path;
				if(item.charAt()=='/') {       //리눅스 경로때문에 사용
					vm.viewModel.list[i].strg_path = item;
				}else{
					vm.viewModel.list[i].strg_path = item.substring(2);
				}
			}
		},
		fnFileDown:function(item){
			let vm = this;
			let send = {
				menu_se: item.menu_se,
				file_se: item.file_se,
				sn: item.sn,
				file_sn: item.file_sn,
				gbn:vm.gbn
			}
			
			$(".loading").show();
			$("#mask").show();
			Axios.post("/download.do",send,{responseType: "blob",}
			).then(function(e) {
				const url = window.URL.createObjectURL(new Blob([e.data], { type: e.headers["content-type"] }))
				const link = document.createElement("a")
				link.href = url
				link.download = item.orgnl_file_nm
				link.click()
				window.URL.revokeObjectURL(url)
			}).then(function(){
				$(".loading").hide();
				$("#mask").hide();
			});
				
        },
		fnPdfView:function(path,type, orgFileNm){
			if(type.toLowerCase() == 'pdf'){
				this.popupTitle = 'PDF 뷰어';
			}
			this.bool = true;
			this.$nextTick(function () {
                if (this.bool) {
					this.$refs.PDFviewer.fnSetContents(path,orgFileNm, this.popupTitle);
				}
            });


			// this.$emit('test',path,this.title)
		},
		// dragMouseDown: function (event) {
		// 	event.preventDefault()
		// 	// get the mouse cursor position at startup:
		// 	this.positions.clientX = event.clientX
		// 	this.positions.clientY = event.clientY
		// 	document.onmousemove = this.elementDrag
		// 	document.onmouseup = this.closeDragElement
		// 	},
		// 	elementDrag: function (event) {
		// 	event.preventDefault()
		// 	this.positions.movementX = this.positions.clientX - event.clientX
		// 	this.positions.movementY = this.positions.clientY - event.clientY
		// 	this.positions.clientX = event.clientX
		// 	this.positions.clientY = event.clientY
		// 	// set the element's new position:
		// 	this.$refs.draggableContainer.style.top = (this.$refs.draggableContainer.offsetTop - this.positions.movementY) + 'px'
		// 	this.$refs.draggableContainer.style.left = (this.$refs.draggableContainer.offsetLeft - this.positions.movementX) + 'px'
		// 	},
		// 	closeDragElement () {
		// 	document.onmouseup = null
		// 	document.onmousemove = null
		// },
		// fnImgView: function(event){
		// 	console.log(event);
		// 	event.preventDefault();

		// 	$('.imgpop').magnificPopup({
		// 		type: 'image',
		// 		closeOnContentClick: true,
		// 		mainClass: 'mfp-img-mobile',
		// 		// image: {
		// 		//     verticalFit: true
		// 		// },
		// 		gallery: {
		// 			enabled: true
		// 		},
		// 	});
		// },
	}
	
};
</script>
