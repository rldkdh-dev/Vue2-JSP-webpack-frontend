<template>
	<div class="modal_wrap write">
		<div class="popup modal">
			<div class="popup_panel w960">
				<div class="popup_header" ref="draggableContainer">
					<h4>{{ viewModel.popupTitle }}</h4>
					<div class="icon_box">
						<button class="btn btn-icon btn_fullscreen"><svg class="icon"><use xlink:href="/img/symbol-defs.svg#icon-fullscreen"></use></svg></button>
						<button class="btn btn-icon btn_popup_close" @click="fnClose($event);"><svg class="icon"><use xlink:href="/img/symbol-defs.svg#icon-delete"></use></svg></button>
					</div>
				</div>
				<div class="contents popup_contents">
					<div class="divide">
						<div>
							<h3>기상안내문</h3>
							<div class="box overflow-y weather_info" style="min-height:0">
								<template v-if="viewModel.info_files.length < 1">{{ viewModel.data.gdcc }}</template>
								<template v-else>
								<ul v-if="viewModel.info_files.length > 0" style="width:100%;height:100%">
									<li v-for="(file, index) in viewModel.info_files" :key="index" style="width:100%;height:100%">
										<img :src="file.preview" alt="이미지" style="width:100%;height:100%">
									</li>
								</ul>
								</template>
							</div>
						</div>
						<div class="standards">
							<h3>관리기준</h3>
							<div v-if="viewModel.data.wether_type == 'HR'">
								<table class="table">
									<caption>폭우에 따른 강수량별 관리기준</caption>
									<tbody>
										<tr>
											<th scope="row">항목</th>
											<th><b>일반<br>1mm 이상</b></th>
											<th class="warn"><b>주의<br>6~10mm 이상</b></th>
											<th class="danger"><b>위험<br>11~30mm</b></th>
											<th class="severe"><b>매우위험<br>30mm 이상</b></th>
										</tr>
										<tr>
											<th scope="row">폭우 hr</th>
											<td>{{ viewModel.optObj.opt1 }}</td>
											<td>{{ viewModel.optObj.opt2 }}</td>
											<td>{{ viewModel.optObj.opt3 }}</td>
											<td>{{ viewModel.optObj.opt4 }}</td>
										</tr>
									</tbody>
								</table>
								<p><sup>주1</sup>{{ viewModel.optObj.opt5 }}</p>
								<p><sup>주2</sup>{{ viewModel.optObj.opt6 }}</p>
							</div>
							<div v-if="viewModel.data.wether_type == 'HS'">
								<table class="table">
									<caption>폭설에 따른 강수량별 관리기준</caption>
									<tbody>
										<tr>
											<th scope="row">항목</th>
											<th><b>일반<br>1mm 이상</b></th>
											<th class="warn"><b>주의<br>6~10mm 이상</b></th>
											<th class="danger"><b>위험<br>11~30mm</b></th>
											<th class="severe"><b>매우위험<br>30mm 이상</b></th>
										</tr>
										<tr>
											<th scope="row">폭설 hr</th>
											<td>{{ viewModel.optObj.opt1 }}</td>
											<td>{{ viewModel.optObj.opt2 }}</td>
											<td>{{ viewModel.optObj.opt3 }}</td>
											<td>{{ viewModel.optObj.opt4 }}</td>
										</tr>
									</tbody>
								</table>
								<p><sup>주1</sup>{{ viewModel.optObj.opt5 }}</p>
								<p><sup>주2</sup>{{ viewModel.optObj.opt6 }}</p>
							</div>
							<div v-if="viewModel.data.wether_type == 'TP'">
								<table class="table">
									<caption>태풍에 따른 풍속별, 강수량별 관리기준</caption>
									<tbody>
										<tr>
											<th scope="row">항목</th>
											<th><b>일반<br>7m 이하</b></th>
											<th class="warn"><b>주의<br>7~10m</b></th>
											<th class="danger"><b>위험<br>10~20m</b></th>
											<th class="severe"><b>매우위험<br>20m 이상</b></th>
										</tr>
										<tr>
											<th scope="row">풍속 sec</th>
											<td>{{ viewModel.optObj.opt1 }}</td>
											<td>{{ viewModel.optObj.opt2 }}</td>
											<td>{{ viewModel.optObj.opt3 }}</td>
											<td>{{ viewModel.optObj.opt4 }}</td>
										</tr>
									</tbody>
									<tbody>
										<tr>
											<th scope="row">항목</th>
											<th><b>일반<br>1mm 이상</b></th>
											<th class="warn"><b>주의<br>6~10mm 이상</b></th>
											<th class="danger"><b>위험<br>11~30mm</b></th>
											<th class="severe"><b>매우위험<br>30mm 이상</b></th>
										</tr>
										<tr>
											<th scope="row">폭우 hr</th>
											<td>{{ viewModel.optObj.opt5 }}</td>
											<td>{{ viewModel.optObj.opt6 }}</td>
											<td>{{ viewModel.optObj.opt7 }}</td>
											<td>{{ viewModel.optObj.opt8 }}</td>
										</tr>
									</tbody>
								</table>
								<p><sup>주1</sup>{{ viewModel.optObj.opt9 }}</p>
								<p><sup>주2</sup>{{ viewModel.optObj.opt10 }}</p>
							</div>
							<div v-if="viewModel.data.wether_type == 'HW'">
								<table class="table">
									<caption>폭염에 따른 온도별 관리기준</caption>
									<tbody>
										<tr>
											<th colspan="2" scope="row">Class</th>
											<td class="warn"><b>주의</b></td>
											<td class="alert"><b>경고</b></td>
											<td class="danger"><b>위험</b></td>
											<td class="severe"><b>매우위험</b></td>
										</tr>
										<tr>
											<th colspan="2" scope="row">(WBGT) 체감온도</th>
											<td class="warn"><b>{{ viewModel.optObj.opt1 }} &deg;C</b></td>
											<td class="alert"><b>{{ viewModel.optObj.opt2 }} &deg;C</b></td>
											<td class="danger"><b>{{ viewModel.optObj.opt3 }} &deg;C</b></td>
											<td class="severe"><b>{{ viewModel.optObj.opt4 }} &deg;C 이상</b></td>
										</tr>
										<tr>
											<th colspan="2" scope="row">(TA) 기온</th>
											<td class="warn ws-nw"><b>{{ viewModel.optObj.opt5 }} &deg;C</b></td>
											<td class="alert"><b>{{ viewModel.optObj.opt6 }} &deg;C</b></td>
											<td class="danger"><b>{{ viewModel.optObj.opt7 }} &deg;C</b></td>
											<td class="severe"><b>{{ viewModel.optObj.opt8 }} &deg;C 이상</b></td>
										</tr>
										<tr>
											<th rowspan="2" scope="rowgroup">작업시간 (휴식)</th>
											<th scope="row">실내</th>
											<td rowspan="2">일상작업</td>
											<td rowspan="2">{{ viewModel.optObj.opt9 }}</td>
											<td>{{ viewModel.optObj.opt10 }}</td>
											<td>{{ viewModel.optObj.opt11 }}</td>
										</tr>
										<tr>
											<th scope="row">실외</th>
											<td>{{ viewModel.optObj.opt12 }}</td>
											<td>{{ viewModel.optObj.opt13 }}</td>
										</tr>
										<tr>
											<th rowspan="2" colspan="2" scope="row">수분</th>
											<td colspan="4" class="text-left">{{ viewModel.optObj.opt14 }}</td>
										</tr>
										<tr>
											<td>{{ viewModel.optObj.opt15 }}</td>
											<td colspan="2">{{ viewModel.optObj.opt16 }}</td>
											<td>{{ viewModel.optObj.opt17 }}</td>
										</tr>
										<tr>
											<th colspan="2" scope="row">식염 포도당</th>
											<td>{{ viewModel.optObj.opt18 }}</td>
											<td colspan="3">{{ viewModel.optObj.opt19 }}</td>
										</tr>
									</tbody>
								</table>
							</div>
						</div>
					</div>
					<div>
						<h3>현황 및 점검결과</h3>
						<table class="table horizontal write" v-if="viewModel.data.wether_type == 'HR' || viewModel.data.wether_type == 'HS'">
							<caption>폭우, 장마 현황 및 점검결과 등록</caption>
							<tbody>
								<tr>
									<th scope="row" class="w100"><label for="w0">강수량</label></th>
									<td><input type="text" placeholder="입력해주세요." id="w0" v-model="viewModel.data.artcl1" ></td>
								</tr>
								<tr>
									<th scope="row"><label for="w1">피해유무</label></th>
									<td>
										<label for="wy"><input type="radio" id="wy" value="Y" v-model="viewModel.data.artcl2" @change="fnDetailStts">유</label>
										<label for="wn"><input type="radio" id="wn" value="N" v-model="viewModel.data.artcl2" @change="fnDetailStts">무</label>
									</td>
								</tr>
								<tr>
									<th rowspan="2" scope="rowgroup"><label for="w2">피해현황</label></th>
									<td><textarea id="w2" rows="5" placeholder="입력해주세요" v-model="viewModel.data.artcl3"></textarea></td>
								</tr>
								<tr>
									<td>
										<div class="upload_file_wrap">
											<div class="img_area img_upload box">
												<ul>
													<li v-for="(file, index) in viewModel.files" :key="index">
														<img :src="file.preview" alt="이미지">
														<button class="close" @click="fileDeleteButton('',file.number)" >
															<svg class="icon"><use xlink:href="/img/symbol-defs.svg#icon-delete-circle"></use></svg>
														</button>
													</li>
													<li>
														<label for="img_upload_hr" class="img_control">
															<input type="file" id="img_upload_hr" ref="files" @change="imageUpload('')" multiple hidden/>
															<svg class="icon"><use xlink:href="/img/symbol-defs.svg#icon-plus-small"></use></svg>
														</label>
													</li>
												</ul>
											</div>
										</div>
									</td>
								</tr>
								<tr>
									<th scope="row"><label for="w3">실외작업</label></th>
									<td><input type="text" placeholder="입력해주세요." id="w3" v-model="viewModel.data.artcl4"></td>
								</tr>
							</tbody>
						</table>
						<table class="table horizontal write" v-if="viewModel.data.wether_type == 'TP'">
							<caption>태풍 현황 및 점검결과 등록</caption>
							<tbody>
								<tr>
									<th scope="row" class="w100"><label for="t0">풍속</label></th>
									<td><input type="text" placeholder="입력해주세요." v-model="viewModel.data.artcl1" id="t0"></td>
								</tr>
								<tr>
									<th scope="row"><label for="t1">강수량</label></th>
									<td><input type="text" placeholder="입력해주세요." v-model="viewModel.data.artcl3" id="t1"></td>
								</tr>
								<tr>
									<th scope="row"><label for="t2">피해유무</label></th>
									<td>
										<label for="wy"><input type="radio" name="wck" value="Y" v-model="viewModel.data.artcl2" @change="fnDetailStts" id="wy">유</label>
										<label for="wn"><input type="radio" name="wck" value="N" v-model="viewModel.data.artcl2" @change="fnDetailStts" id="wn">무</label>
									</td>
								</tr>
								<tr>
									<th rowspan="2" scope="rowgroup"><label for="t3">피해현황</label></th>
									<td><textarea id="t3" rows="5" v-model="viewModel.data.artcl4" placeholder="입력해주세요"></textarea></td>
								</tr>
								<tr>
									<td>
										<div class="upload_file_wrap">
											<div class="img_area img_upload box">
												<!-- <label for="img_upload_01" class="btn btn-white">
													<input type="file" id="img_upload_01" multiple hidden>
													<svg class="icon"><use xlink:href="/img/symbol-defs.svg#icon-camera"></use></svg>사진올리기
												</label> -->
												<ul>
													<li v-for="(file, index) in viewModel.files" :key="index">
														<img :src="file.preview" alt="이미지">
														<button class="close" @click="fileDeleteButton('',file.number)" >
															<svg class="icon"><use xlink:href="/img/symbol-defs.svg#icon-delete-circle"></use></svg>
														</button>
													</li>
													<li>
														<label for="img_upload_tp" class="img_control">
															<input type="file" id="img_upload_tp" ref="files" @change="imageUpload('')" multiple hidden/>
															<svg class="icon"><use xlink:href="/img/symbol-defs.svg#icon-plus-small"></use></svg>
														</label>
													</li>
												</ul>
											</div>
										</div>
									</td>
								</tr>
								<tr>
									<th scope="row"><label for="t4">실외작업</label></th>
									<td><input type="text" placeholder="입력해주세요." id="t4"></td>
								</tr>
							</tbody>
						</table>
						<table class="table horizontal write" v-if="viewModel.data.wether_type == 'HW'">
							<caption>폭염 현황 및 점검결과 등록</caption>
							<tbody>
								<tr>
									<th scope="row" class="w120"><label for="">WBGT (실외)</label></th>
									<td><input type="text" placeholder="입력해주세요." v-model="viewModel.data.artcl1"></td>
									<th scope="row" class="w120"><label for="">TA (실외)</label></th>
									<td><input type="text" placeholder="입력해주세요." v-model="viewModel.data.artcl2"></td>
									<th scope="row" class="w120"><label for="">폭염기준 (실외)</label></th>
									<td>
										<select v-model="viewModel.data.artcl3">
											<option value="">작업없음</option>
											<option value="1">주의: 일상작업</option>
											<option value="2">경고: 50분 작업 10분 휴식</option>
											<option value="3">위험(실외): 30분 작업 10분 휴식</option>
											<option value="4">매우위험(실외): 20분 작업 10분 휴식</option>
										</select>
									</td>
								</tr>
								<tr>
									<th scope="row"><label for="">WBGT (실내)</label></th>
									<td><input type="text" placeholder="입력해주세요." v-model="viewModel.data.artcl4"></td>
									<th scope="row"><label for="">TA (실내)</label></th>
									<td><input type="text" placeholder="입력해주세요." v-model="viewModel.data.artcl5"></td>
									<th scope="row"><label for="">폭염기준 (실내)</label></th>
									<td>
										<select v-model="viewModel.data.artcl6">
											<option value="">작업없음</option>
											<option value="1">주의: 일상작업</option>
											<option value="2">경고: 50분 작업 10분 휴식</option>
											<option value="3">위험(실내): 45분 작업 15분 휴식</option>
											<option value="4">매우위험(실내): 30분 작업 10분 휴식</option>
										</select>
									</td>
								</tr>
								<tr>
									<th scope="row"><label for="">사진첨부</label></th>
									<td colspan="5">
										<div class="upload_file_wrap">
											<div class="img_area img_upload box">
												<!-- <label for="img_upload_01" class="btn btn-white">
													<input type="file" id="img_upload_01" multiple hidden>
													<svg class="icon"><use xlink:href="/img/symbol-defs.svg#icon-camera"></use></svg>사진올리기
												</label> -->
												<ul>
													<li v-for="(file, index) in viewModel.files" :key="index">
														<img :src="file.preview" alt="이미지">
														<button class="close" @click="fileDeleteButton('',file.number)" >
															<svg class="icon"><use xlink:href="/img/symbol-defs.svg#icon-delete-circle"></use></svg>
														</button>
													</li>
													<li>
														<label for="img_upload_hw" class="img_control">
															<input type="file" id="img_upload_hw" ref="files" @change="imageUpload('')" multiple hidden/>
															<svg class="icon"><use xlink:href="/img/symbol-defs.svg#icon-plus-small"></use></svg>
														</label>
													</li>
												</ul>
											</div>
										</div>
									</td>
								</tr>
							</tbody>
						</table>
					</div>
					<div>
						<h3>재해대비 조치사항</h3>
						<!-- <div class="table_top btn-right">
							<a href="javascript:void(0)" class="btn btn-light-purple"><svg class="icon"><use xlink:href="/img/symbol-defs.svg#icon-wrap-text"></use></svg>조치사항 추가</a>
							<a href="javascript:void(0)" class="btn btn-gray"><svg class="icon"><use xlink:href="/img/symbol-defs.svg#icon-trash-can"></use></svg>삭제</a>
						</div> -->
						<textarea id="w2" rows="5" placeholder="입력해주세요" v-model="viewModel.data.artcl7" class="mb10"></textarea>
						<div class="upload_file_wrap">
							<div class="img_area img_upload box">
								<!-- <label for="" class="btn btn-white">
									<input type="file" id="img_upload_01" multiple hidden>
									<svg class="icon"><use xlink:href="/img/symbol-defs.svg#icon-camera"></use></svg>사진올리기
								</label> -->
								<ul>
									<li v-for="(file, index) in viewModel.jc_files" :key="index">
										<img :src="file.preview" alt="이미지">
										<!-- <button class="img_control"></button> -->
										<button class="close" @click="fileDeleteButton('jc',file.number)" >
											<svg class="icon"><use xlink:href="/img/symbol-defs.svg#icon-delete-circle"></use></svg>
										</button>
									</li>
									<li>
										<label for="img_upload_jc" class="img_control">
											<input type="file" id="img_upload_jc" ref="jc_files" @change="imageUpload('jc')" multiple hidden/>
											<svg class="icon"><use xlink:href="/img/symbol-defs.svg#icon-plus-small"></use></svg>
										</label>
									</li>
								</ul>
							</div>
						</div>
					</div>
					<div class="btn-group">
						<div class="right_side">
							<a href="javascript:void(0)" @click.prevent="fnSave()" class="btn btn-purple">저장</a>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import Axios from 'axios';
import Vue from 'vue';
import Message, {messageUtil} from "../../../../../common/js/message";

export default {
	data: function () {
		return {
			userInfo:{},
			viewModel:{
				popupTitle:'',
				optObj:{},
				bplc_sn:'',
				fileList:[],
				safe_cntrpln_sn: '',
				ntcn_sn: '',
				isSave:'',
				data:{},
				imageIdx: 0,
				files: [],
				jc_files: [],
				jc_imageIdx: 0,
				dsst_jc:'',
				artcl3List:[],
				artcl6List:[],
				info_files:[]
			}
		}
	},
	mounted: function () {
		
	},
	methods: {
		fnInit: function(sn) {
			let vm = this;
			vm.userInfo = vm.$store.state.global.userInfo;

			vm.viewModel.bplc_sn = sn[0];
			vm.viewModel.safe_cntrpln_sn = sn[1];
			vm.viewModel.ntcn_sn = sn[2];
			vm.viewModel.isSave = sn[3];

			vm.viewModel.data = {};
			vm.viewModel.fileList = [];
			vm.viewModel.files = [];
			vm.viewModel.jc_files = [];
			vm.viewModel.deleteFiles = [];
			vm.viewModel.jc_deleteFiles = [];
			vm.viewModel.info_files = [];

			vm.fnDetail();
		},
		fnList:function(){
			let vm = this;
			let send = {
				wether_type: vm.viewModel.data.wether_type
			}
			
			Axios.post("/admin/selectWcSftPlList.do", send).then(function(response) {
				vm.viewModel.optObj = response.data;
			});
		},
		fnDetail:function() {
			let vm = this;
			let send = {
				//mapperId: 'wcSftPl.selectWcSftPlList',
				//pageYn: 'N',
				isUser: true,
				user_type_code: vm.userInfo.user_type_code,
				bplc_sn: vm.viewModel.bplc_sn,
				safe_cntrpln_sn: vm.viewModel.safe_cntrpln_sn,
				ntcn_sn: vm.viewModel.ntcn_sn,
				isSave: vm.viewModel.isSave
			};

			Axios.post("/selectWcSftPlDetail.do", send).then(function(response) {
				vm.viewModel.data = response.data.detail;
				vm.viewModel.fileList = response.data.fileList;
				vm.viewModel.imageList = response.data.imageList;

				// 관리기준 데이터매핑
				vm.fnList();

				//console.log(' data : ' , vm.viewModel.data);
				// console.log(' fileList : ' , vm.viewModel.fileList);
				// console.log(' fileList len : ' , vm.viewModel.fileList.length);
				let wether_type = (vm.viewModel.data.wether_type == 'HW') ? '폭염' : 
								  (vm.viewModel.data.wether_type == 'HR') ? '폭우,장마' :
								  (vm.viewModel.data.wether_type == 'TP') ? '태풍' : '폭설';
				vm.viewModel.popupTitle = '기상변화 안전대책 상세보기(' + wether_type + ')';

				// if(vm.viewModel.data.wether_type == 'HW') {
				// 	vm.viewModel.artcl3List = [
				// 		{key: '', value : '작업없음'},
				// 		{key: '1', value : '주의: 일상작업'},
				// 		{key: '2', value : '경고: 50분 작업 10분 휴식'},
				// 		{key: '3', value : '위험(실외): 30분 작업 10분 휴식'},
				// 		{key: '4', value : '매우위험(실외): 20분 작업 10분 휴식'}
				// 	];
				// }

				//기상 안내문 이미지
				if(vm.viewModel.fileList.length > 0) vm.fnUploadImage('F');

				//피해현황 및 재해대비 조치사항 이미지
				if(vm.viewModel.imageList.length > 0) vm.fnUploadImage('I');
			});
		},
		fnDetailStts: function() {
			let vm = this;
			if((vm.viewModel.data.wether_type == 'HR' || vm.viewModel.data.wether_type == 'HS') && vm.viewModel.data.artcl2 == 'Y') {
				$('.contents.popup_contents table tr:nth-child(3) textarea').attr('disabled',false);
				$('.contents.popup_contents table tr:nth-child(4) .img_area').css('background-color','#FFFFFF');
				$('.contents.popup_contents table tr:nth-child(4) .img_area ul>li>label').show();
				$('.contents.popup_contents table tr:nth-child(5) input[type=text]').attr('disabled',false);
			} else if((vm.viewModel.data.wether_type == 'HR' || vm.viewModel.data.wether_type == 'HS') && vm.viewModel.data.artcl2 == 'N'){
				$('.contents.popup_contents table tr:nth-child(3) textarea').attr('disabled',true);
				$('.contents.popup_contents table tr:nth-child(4) .img_area').css('background-color','#EFF0FA');
				$('.contents.popup_contents table tr:nth-child(4) .img_area ul>li>label').hide();
				$('.contents.popup_contents table tr:nth-child(5) input[type=text]').attr('disabled',true);
			}

			if(vm.viewModel.data.wether_type == 'TP' && vm.viewModel.data.artcl2 == 'Y') {
				$('.contents.popup_contents table tr:nth-child(4) textarea').attr('disabled',false);
				$('.contents.popup_contents table tr:nth-child(5) .img_area').css('background-color','#FFFFFF');
				$('.contents.popup_contents table tr:nth-child(5) .img_area ul>li>label').show();
				$('.contents.popup_contents table tr:nth-child(6) input[type=text]').attr('disabled',false);
			} else if(vm.viewModel.data.wether_type == 'TP' && vm.viewModel.data.artcl2 == 'N') {
				$('.contents.popup_contents table tr:nth-child(4) textarea').attr('disabled',true);
				$('.contents.popup_contents table tr:nth-child(5) .img_area').css('background-color','#EFF0FA');
				$('.contents.popup_contents table tr:nth-child(5) .img_area ul>li>label').hide();
				$('.contents.popup_contents table tr:nth-child(6) input[type=text]').attr('disabled',true);
			}
		},
		fnUploadImage: function(flag) {
			let vm = this;
			let fileList = null;
			if(flag == 'I') fileList = vm.viewModel.imageList;
			else fileList = vm.viewModel.fileList;

			//let imgSrc = 'wcSftPl/user/';

			for (let i = 0; i < fileList.length; i++) {
				if(flag == 'I') {
					if(fileList[i].fileGroup == 'f01') {
						vm.viewModel.files.push({
							file: fileList[i].strg_path + fileList[i],
							preview: (fileList[i].strg_path.charAt() == '/') ? fileList[i].strg_path + fileList[i].strg_file_nm : fileList[i].strg_path.substring(2) + fileList[i].strg_file_nm,
							//number: i + (vm.viewModel.imageIdx + 1)
							number: fileList[i].artcl_sn
						});
					}
					else {
						vm.viewModel.jc_files.push({
							file: fileList[i].strg_path + fileList[i],
							preview: (fileList[i].strg_path.charAt() == '/') ? fileList[i].strg_path + fileList[i].strg_file_nm : fileList[i].strg_path.substring(2) + fileList[i].strg_file_nm,
							//number: i + (vm.viewModel.jc_imageIdx + 1)
							number: fileList[i].artcl_sn
						});
					}
				} else {
					vm.viewModel.info_files.push({
						preview: (fileList[i].strg_path.charAt() == '/') ? fileList[i].strg_path + fileList[i].strg_file_nm : fileList[i].strg_path.substring(2) + fileList[i].strg_file_nm
					});
				}
			}
		},
		imageUpload: function(flag) {
			let vm = this;
			
			if(flag == 'jc') { //조치사항
				for (let i = 0; i < vm.$refs.jc_files.files.length; i++) {
					vm.viewModel.jc_files.push({
						file: vm.$refs.jc_files.files[i],
						preview: URL.createObjectURL(vm.$refs.jc_files.files[i]),
						number: i + vm.viewModel.jc_imageIdx
					});
				}
				vm.viewModel.jc_imageIdx = vm.viewModel.jc_imageIdx + 1;
			} else {
				for (let i = 0; i < vm.$refs.files.files.length; i++) {
					vm.viewModel.files.push({
						file: vm.$refs.files.files[i],
						preview: URL.createObjectURL(vm.$refs.files.files[i]),
						number: i + vm.viewModel.imageIdx
					});
				}
				vm.viewModel.imageIdx = vm.viewModel.imageIdx + 1;
			}

			//console.log(' files : ' , vm.viewModel.files);
			
		},
		fileDeleteButton: function(flag,num) {
			let vm = this;
			if(flag == 'jc') {
				vm.viewModel.jc_files = vm.viewModel.jc_files.filter(data => data.number != Number(num));
				vm.viewModel.jc_deleteFiles.push(num);
			}
			else {
				vm.viewModel.files = vm.viewModel.files.filter(data => data.number != Number(num));
				vm.viewModel.deleteFiles.push(num);
			}
			
		},
		fnSave: function(){
			let vm = this;
			let frm = new FormData();

			//피해현황 이미지파일 등록
			if(vm.viewModel.files.length > 0) {
				for(let i=0; i<vm.viewModel.files.length; i++) {
					if(vm.viewModel.files[i].file != null && typeof(vm.viewModel.files[i].file) == 'object') {
						frm.append("fileTitle", vm.viewModel.files[i].file.name);
						frm.append("uploadFiles", vm.viewModel.files[i].file);
						frm.append("fileGroup", "f01");
					} else {
						vm.viewModel.files[i] = null;
					}
				}
			}

			//재해대비 조치사항 이미지파일 등록
			if(vm.viewModel.jc_files.length > 0) {
				for(let i=0; i<vm.viewModel.jc_files.length; i++) {
					if(vm.viewModel.jc_files[i].file != null && typeof(vm.viewModel.jc_files[i].file) == 'object') {
						frm.append("fileTitle", vm.viewModel.jc_files[i].file.name);
						frm.append("uploadFiles", vm.viewModel.jc_files[i].file);
						frm.append("fileGroup", 'f02');
					} else {
						vm.viewModel.jc_files[i] = null;
					}
				}
			}

			if(vm.viewModel.deleteFiles.length > 0) {
				frm.append("deleteFiles", vm.viewModel.deleteFiles);
				frm.append("fileGroup", "f01");
			}

			if(vm.viewModel.jc_deleteFiles.length > 0) {
				frm.append("jc_deleteFiles", vm.viewModel.jc_deleteFiles);
				frm.append("fileGroup", "f02");
			}
			
			vm.fngetFileInfo(frm);
		},
		fngetFileInfo:function(frm) {
			let vm = this;
			// const valiData = [
			// 	{id: 'wetherType', type: 'select', title: '기상유형'},
			// 	{id: 'alarmList', type: 'input', title: '알림설정'},
			// 	{id: 'reg_id', type: 'input', title: '등록자'},
			// 	{id: 'title', type: 'input', title: '제목'},
			// 	{id: 'text_con', type: 'input', title: '안내문'}
			// ];
			
			// if(!fromValidation(valiData)) {
			// 	return false;
			// }

			let data = {
				user_roles: vm.userInfo.user_roles,
				user_type_code: vm.userInfo.user_type_code,
				safe_cntrpln_sn: vm.viewModel.data.safe_cntrpln_sn,
				bplc_sn: vm.viewModel.bplc_sn,
				ntcn_sn: vm.viewModel.ntcn_sn,
				isSave: vm.viewModel.isSave,
				artcl1: vm.viewModel.data.artcl1,
				artcl2: vm.viewModel.data.artcl2,
				artcl3: vm.viewModel.data.artcl3,
				artcl4: vm.viewModel.data.artcl4,
				artcl5: vm.viewModel.data.artcl5,
				artcl6: vm.viewModel.data.artcl6,
				artcl7: vm.viewModel.data.artcl7
			};

			frm.append('data', new Blob([ JSON.stringify(data) ], {type : "application/json"}));
			frm.append("filePath", "wcSftPl/user");
			
			if(confirm(Message.CREATE_CONFIRM)) {
				Axios.post("/updateWcSftPl.do", frm).then(function(response) {
					if(response.data > 0) {
						alert("저장 되었습니다.");
						//Modal.methods.fnClose();
						$('.modal_wrap').hide();
						vm.$parent.fnList(0);
					}
				}).catch(function(ex) {
					console.log("error"+ex);
				});
			}
		},
		fnClose :function(event){
			//popup 닫기
			$(event.target).closest('.modal_wrap').hide();
		}
	}
};
</script>
