<template>
	<div>
		<modal :pass="{popupTitle:'교안'}">
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
								<td class="text-left">{{ item.orgnl_file_nm }}</td>
								<td>
									<button class="imgpop" :href="item.strg_path+item.strg_file_nm" v-if="item.file_extn.toUpperCase() == 'JPG' || item.file_extn.toUpperCase() == 'PNG' || item.file_extn.toUpperCase() == 'GIF' || item.file_extn.toUpperCase() == 'JPEG'">
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
								<td class="ws-nw">{{ item.reg_dt|yyyyMMdd }}</td>
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
import PDFviewer from '../../../../../common/vue/pdfViewer.vue';
import Modal from '../../../../../common/vue/modal.vue';
import common from '../../../../../common/js/common.js';

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
	mounted: function() {
    },
	methods: {
		fnInit: function(sn) {
			Modal.methods.fnInit();

            if(sn != null){
                this.fnFileLoad(sn);
            }
            this.bool=false;
		},
		fnFileLoad: function(groupid) {
            let vm = this;

            $("#mask").show();
            $(".loading").show();
            Axios.post("/hsEdFilelist.do",{groupid:groupid, file_se: 1}).then(function(rs) {
                let filelist = rs.data.filelist.filter(items => items.file_se !="2");
                if(filelist.length>0) {
                    vm.viewModel.list = filelist;
                    
                    for(let i=0; i<vm.viewModel.list.length; i++){
                        let item = vm.viewModel.list[i].strg_path;
                        if(item.charAt()=='/') {       //리눅스 경로때문에 사용
                            vm.viewModel.list[i].strg_path = item;
                        }else{
                            vm.viewModel.list[i].strg_path = item.substring(2);
                        }
                    }
                } else {
                    vm.viewModel.list = [{seq: 0},]
                    vm.fileGroup = ''
                }
            }).catch(function(ex){
                $("#mask").hide();
                $(".loading").hide();
            }).finally(function(){
                $(".loading").hide();
                $("#mask").hide();
            });
        },
		fnFileDown:function(item){
			
			const link = document.createElement("a")
			link.href = (item.strg_path.charAt()=='/' ? item.strg_path : item.strg_path.substring(2)) + item.strg_file_nm;
			link.download = item.orgnl_file_nm
			link.click();
        },
		fnPdfView:function(path,type,orgfileNm){
			if(type.toLowerCase() == 'pdf'){
				this.popupTitle = 'PDF 뷰어';
			}
			this.bool = true;
			this.$nextTick(function () {
                if (this.bool) {
					this.$refs.PDFviewer.fnSetContents(path,orgfileNm,this.popupTitle);
				}
            });


			// this.$emit('test',path,this.title)
		},
	}
	
};
</script>
