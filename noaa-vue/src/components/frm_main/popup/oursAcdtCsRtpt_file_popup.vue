<template>
	<div>
		<modal :pass="{popupTitle: '우리사고보고서 첨부파일'}">
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
						<tbody  v-for="(item0, i) in viewModel.list" :key="i">
							<tr v-if="viewModel.list[i].length > 0">
								<td colspan="5" class="text-left" style="font-weight:bold;">{{ fileSeList[i] }}</td>
							</tr>
							<tr v-for="item in viewModel.list[i]" :key="item">
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
/* .close:after {content: "\00d7"; font-size:25pt;line-height:45px;} */
.PDF_icon {border: 1px solid #e18888;font-size: 10px;padding: 3px 4px 1px 4px;background: #f3a4a4;color: #fff;border-radius: 6px;}
.JPG_icon {border: 1px solid #a78c09;font-size: 10px;padding: 3px 4px 1px 4px;background: #c78a1a;color: #fff;border-radius: 6px;}
.PNG_icon {border: 1px solid #a78c09;font-size: 10px;padding: 3px 4px 1px 4px;background: #c78a1a;color: #fff;border-radius: 6px;}
.XLSX_icon {border: 1px solid #0f700d;font-size: 10px;padding: 3px 4px 1px 4px;background: #388961;color: #fff;border-radius: 6px;}
</style>
<script>
import Axios from 'axios';
import Vue from 'vue'
import PDFviewer from '../../../common/vue/pdfViewer.vue';
import Modal from './modal.vue'
import Common from '../../common.js'

Vue.component('PDFviewer',PDFviewer);
export default {
	props: ['pass'],
	components: {
		Modal
	},
	data: function () {
		return {
			title:"",
			popupTitle:"",
			bool:false,
			rtptFileModal:false,
			sn : 0,
			viewModel:{
				list:[],
				keyword:"",
			},
			positions: {
				clientX: undefined,
				clientY: undefined,
				movementX: 0,
				movementY: 0
			},
			gbn:'',

			fileSeList:[ "우리사고통합파일"
						,"사고상황도"
						,"목격자진술서"
						,"근로계약서"
						,"급여계약서"
						,"채용시안전교육"
						,"일일작업장위험성평가표"
						,"보호구지급대장"
						,"정기안전교육"]
		}
	},
	mounted: function () {
		// console.log(this)
	},
	methods: {
		fnInit: function(list, gbn, modal, sn) {
			Modal.methods.fnInit();
			this.rtptFileModal = modal;
			this.sn = sn;
			this.fnList(list, gbn);
		},
		fnList: function(list, gbn){
			let vm = this;
			let h = 0;
			
			vm.gbn = gbn;
			vm.viewModel.list = [[],[],[],[],[],[],[],[],[]];
			// vm.viewModel.list = list;

			for(let i=0; i<list.length; i++){
				if(list[i] != null){
					let se = (Number(list[i].se))-1;
					
					vm.viewModel.list[se][h] = list[i];
					if(i+1 < list.length){
						let nextSe = (Number(list[i+1].se))-1;
						if(se == nextSe){ h = h+1; }
						else if(se != nextSe){ h = 0; }
					}
				}
			}
		
			
			for(let i=0; i<vm.viewModel.list.length; i++){
				for(let j=0; j<vm.viewModel.list[i].length; j++){
					let item = vm.viewModel.list[i][j].strg_path;
					if(item.charAt()=='/') {       //리눅스 경로때문에 사용
						vm.viewModel.list[i][j].strg_path = item;
					}else{
						vm.viewModel.list[i][j].strg_path = item.substring(2);
					}
				}
				
			}
		},
		fnFileDown:function(item){
			let vt = this;
			let send = {
				se: item.se,
				sn: vt.sn,
				file_sn: item.file_sn,
				gbn:vt.gbn
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
		fnClose:function(){
			let vt = this;
			vt.rtptFileModal = false;
		},
		fnPdfView:function(path,type,orgnlFileNm){
			let vm = this;
			if(type == 'PDF' || type == 'pdf'){
				vm.popupTitle = 'PDF 뷰어';
			}
			vm.bool = true;
			vm.$nextTick(function () {
                if (vm.bool) {
					vm.$refs.PDFviewer.fnSetContents(path,orgnlFileNm,vm.popupTitle);
				}
            });


			// this.$emit('test',path,this.title)
		},
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
