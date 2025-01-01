<template>
	<modal :pass="{widthObject: 500, popupTitle:list.subject}">
		<template v-slot:contents>
			<ul class="tabs">
				<li :class="{ active : coach_tap }" @click=fnTapOpen(tap_name[0])><button data-id="tab1">코칭</button></li>
				<li :class="{ active : measure_tap }" v-show="list.m_state!=0 || (list.c_state==2 && list.m_state==0)" @click=fnTapOpen(tap_name[1])><button data-id="tab2" >조치</button></li>
			</ul>
			<div id="tab1" class="tab-content" style="display: block;" v-show="coach_tap==true">
				<div class="photo-area mb10" v-show="uploadImageSrc_1!=undefined">
					<!-- <i class="photo-file-size">image size</i> -->
					<div class="fileinput-preview">
						<!-- <img :src=img.image_src alt="이미지"> -->
						<img :src="uploadImageSrc_1" >
					</div>
				</div>
				<!-- <? if($latitude && $longitude) { ?> -->
				<div class="map-area"><!--active-->
					<!-- <div class="toggle-area">위치보기</div>
					<div id="map" styl-*e="width:100%;height:350px;"></div> -->
				</div>
				<table class="light">
					<caption>코칭</caption>
					<tbody>
						<tr>
							<th scope="row">코칭명</th>
							<td colspan='3'>{{ list.subject }}</td>
						</tr>
						<tr>
							<th scope="row">진도</th>
							<td class="type">{{ list.state_type }}</td>
							<!-- <td class="type<?=get_state_code($coach['uid'])?>">=get_state_name($coach['uid'])?></td> -->
							<th scope="row">코칭유형</th>
							<td>{{ list.coach_type_name }}</td>
						</tr>
						<!-- <tr>
							<th scope="row"></th>
							<td></td>
							<th scope="row"></th>
							<td></td>
						</tr> -->
						<tr>
							<th scope="row">AREA</th>
							<td>{{ list.area_name }}</td>
							<th scope="row">조치부서</th>
							<td>{{ list.dept_name }}</td>
						</tr>
						<tr>
							<th scope="row">코칭내용</th>
							<td colspan="3" class="tl">{{ list.contents }}</td>
						</tr>
					</tbody>
				</table>
				<div v-if="evaldata_cnt >= 1">
					<p class="table-title mt20">위험성평가</p>
					<table class="mt10">
						<caption>위험성평가</caption>
						<tbody>
							<tr>
								<th scope="row" style="width:160px;">위험분류</th>
								<td>{{ eval_list.danger_type }}</td>
							</tr>
							<tr>
								<th scope="row">위험발생 상황 및 결과</th>
								<td>{{ eval_list.contents1 }}</td>
							</tr>
							<tr>
								<th scope="row">현재의 안전보건조치</th>
								<td>{{ eval_list.contents2 }}</td>
							</tr>
							<tr>
								<th scope="row">현재위험성</th>
								<td><span class="">강도({{eval_list.itns}}) X 빈도({{eval_list.freq}}) = {{eval_list.grade1}}({{eval_list.multiply1}})</span></td>
							</tr>
							<tr>
								<th scope="row">위험성 감소대책</th>
								<td>{{ eval_list.contents3 }}</td>
							</tr>
							<tr>
								<th scope="row">개선후 위험성</th>
								<td><span class="">강도({{eval_list.itns2}}) X 빈도({{eval_list.freq2}}) = {{eval_list.grade2}}({{eval_list.multiply2}})</span></td>
							</tr>
						</tbody>
					</table>
				</div>

				<!-- 코칭 등록 후 -->
				<div class="buttonbox mt10" v-if="menu_path==tap_name[0]">
					<div class="fr">
						<router-link :to="'/write/'+now_uid"><a href="" class="btn btn-icon btn-dark"><span class="mi">edit</span>&nbsp;수정</a></router-link>
						<a href="javascript:;" class="btn btn-icon btn-danger" @click.prevent="fnCoachDelete(now_uid)"><span class="mi">clear</span>&nbsp;삭제</a>
					</div>
				</div>
				<div class="buttonbox mt10" v-if="menu_path==tap_name[1] && list.m_state==0">
					<div class="fr">
						<router-link :to="'/cancel/'+now_uid"><a href="" class="btn btn2 btn-icon btn-secondary"><span class="mi">undo</span>&nbsp;반려</a></router-link>
						<router-link :to="'/measurewrite/'+now_uid"><a href="" class="btn btn-icon btn-primary"><span class="mi">edit</span>&nbsp;조치등록</a></router-link>
					</div>
				</div>
			</div>

			<div id="tab2" class="tab-content" style="display: block;" v-show="measure_tap==true">
				<template v-if="list.m_state==1">
					<div class="photo-area mb10" v-show="uploadImageSrc_2!=undefined">
						<div class="fileinput-preview">
							<img :src="uploadImageSrc_2">
						</div>
					</div>
				</template>				
				<table class="light" v-if="list.m_state!=0 || (list.c_state==2 && list.m_state==0)">
					<caption>조치</caption>
					<tbody>
						<tr v-if="list.m_state==2">
							<th scope="row" class="w100">반려사유</th>
							<td colspan="3">{{ list.m_cancel_contents }}</td>
						</tr>
						<tr v-if="list.is_coach_cancel==1">
							<th scope="row" class="w100">반려사유</th>
							<td colspan="3">{{ list.cancel_contents }}</td>
						</tr>
					</tbody>
					<tbody v-if="list.m_state==1">
						<tr>
							<th scope="row">조치부서</th>
							<td>{{ list.dept_name }}</td>
						</tr>
						<tr>
							<th scope="row">조치자</th>
							<td>{{ measure_list.user_name }}</td>
						</tr>
						<tr>
							<th scope="row">조치유형</th>
							<td>{{ measure_list.measure_name }}</td>
						</tr>
						<tr>
							<th scope="row">조치일자</th>
							<td>{{ measure_list.resultdt  }}</td>
						</tr>
						<tr>
							<th scope="row">조치내용</th>
							<td colspan="3">{{ measure_list.contents }}</td>
						</tr>
						<!-- <? if($measure['measure_filename']){
							$file_size = filesize(DATA_PATH."/file/works_file/".$measure['measure_filename']);
						?> -->
						<tr v-if="uploadFileName">
							<th scope="row">파일첨부</th>
							<td colspan="3">
								<div class="file_download" >
									<!-- <img src="" alt="파일" class="w30"> -->
									<a href="" class="ml5"></a>
									<a href="#" @click="fnFileDownload(file.filelist[0].file_seq)"><span id="exist_file">{{ uploadFileName }}</span></a>
									<!-- <a href="/file_download.php?uid=<?=$measure['uid']?>" class="ml5">$measure['measure_sourcefile']?>(get_filesize($file_size)?>)</a> -->
								</div>
							</td>
						</tr>
					</tbody>
				</table>

				<div class="buttonbox mt10" v-if="(menu_path==tap_name[0] || menu_path==tap_name[1]) && list.c_state == 2 && list.m_state == 0 && list.is_coach_cancel == 1">
					<div class="fr">
						<router-link :to="'/measurewrite/'+now_uid"><a href="" class="btn btn-icon btn-warning"><span class="mi">refresh</span>&nbsp;재조치</a></router-link>
					</div>
				</div>
				<!-- 조치 등록 후 -->
				<div class="buttonbox mt10" v-if="menu_path==tap_name[1] && ((list.c_state == 0 && list.m_state == 1) || (list.c_state == 0 && list.m_state == 2) || (list.c_state == 1 && list.m_state == 1)) ">
					<div class="fr">
						<a href="javascript:;" class="btn btn-icon btn-danger" @click=fnMeasureDel(now_uid)><span class="mi">clear</span>&nbsp;삭제</a>
						<router-link :to="'/measurewrite/'+now_uid"><a href="" class="btn btn-icon btn-primary"><span class="mi">edit</span>&nbsp;수정</a></router-link>
					</div>
				</div>
				<div class="buttonbox mt10" v-if="menu_path==tap_name[0] && ((list.c_state == 0 && list.m_state == 1) || (list.c_state == 0 && list.m_state == 2))">
					<div class="fr">
						<a href="javascript:;" class="btn btn-icon btn-warning" @click="fnResultAction(2)"><span class="mi">assignment_return</span>&nbsp;반려</a>
						<a href="javascript:;" class="btn btn-icon btn-primary" @click="fnResultAction(1)"><span class="mi">done</span>&nbsp;완료</a>
					</div>
				</div>

				<div v-if="evaldata_cnt >= 1">
					<p class="table-title mt20">위험성평가</p>
					<table class="mt10">
						<caption>위험성평가</caption>
						<tbody>
							<tr>
								<th scope="row" style="width:160px;">위험분류</th>
								<td>{{ eval_list.danger_type }}</td>
							</tr>
							<tr>
								<th scope="row">위험발생 상황 및 결과</th>
								<td>{{ eval_list.contents1 }}</td>
							</tr>
							<tr>
								<th scope="row">현재의 안전보건조치</th>
								<td>{{ eval_list.contents2 }}</td>
							</tr>
							<tr>
								<th scope="row">현재위험성</th>
								<td><span class="">강도({{eval_list.itns}}) X 빈도({{eval_list.freq}}) = {{eval_list.grade1}}({{eval_list.multiply1}})</span></td>
							</tr>
							<tr>
								<th scope="row">위험성 감소대책</th>
								<td>{{ eval_list.contents3 }}</td>
							</tr>
							<tr>
								<th scope="row">개선후 위험성</th>
								<td><span class="">강도({{eval_list.itns2}}) X 빈도({{eval_list.freq2}}) = {{eval_list.grade2}}({{eval_list.multiply2}})</span></td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
			
			<div class="form-group">
				<label for="register_opinion" class="title"></label>
			</div>

			
			<comment ref="comment"></comment>

			<form id="frm_coach_result" name="frm_coach_result" method="post" style="display:none;" v-show="result==2">
				<input type="hidden" name="type" value="">
				<div class="content-pop">
					<h3>반려사유</h3>
					<textarea name="cancel_contents" v-model="cancel_contents"></textarea>
					<div class="button_area mt10">
						<div class="fr">
							<input type="button" value="확인" class="btn btn-icon btn-save btn-primary" @click="fnMeaCancelInsert"/>
							<input type="button" value="취소" class="btn btn-icon btn-cancel ml5" onclick="btn_formbox_close();" @click="fnMeaClose"/>
						</div>
					</div>
				</div>
			</form>	
		</template>
	</modal>
</template>
<script>
	import Axios from 'axios';
	import Vue from 'vue'
	import Modal from './modal.vue'
	import Imgfileform from '../imgfileform.vue';
	import Common from '../../common.js';
	import comment from '../do/coach_comment.vue'

	export default {
		//props: ['pass'],
		components: {
			Modal, Imgfileform,
			'comment': comment
		},
		data: function () {
			return {
				commentUid: '', //댓글 수정이나 대댓글 등록할 경우
				list:{},
				measure_list:{},
				eval_list:{},
				evaldata_cnt:0,
				coach_comment:'',
				keyword:'',
				now_uid:'',
				now_id:'',
				now_dept_id:'',
				result:0,
				cancel_contents:'',
				uploadImageSrc_1:'',
				uploadImageSrc_2:'',
				uploadFileName:'',
				uploadFile:'',
				img: {
					key: null,
					filelist: null,
					fileGroup: ''
				},
				file: {
					key: null,
					filelist: [{file:'', file_org_name:'', file_title:''}],
					fileGroup: ''
				},
				menu_path : '',
				tap_name : ['coach', 'measure'],
				coach_tap: true,
				measure_tap: false,
				imgInfo:{},
				user:{},
				commentList: [],
			}
		},
		mounted: function () {
			console.log('coach-popup');
			this.user = this.$store.state.global.userInfo;
			this.menu_path = window.location.pathname.substr(4,7);
			this.fnTapOpen(this.tap_name[0]);
			//this.fnInit();
		},
		methods: {
			fnInit: function(id, now_id, now_dept_id) {
				this.fnSetContents(id);
				Modal.methods.fnInit();
				this.coach_tap = true;
				this.measure_tap = false;
				this.now_uid = id;
				this.now_id = now_id;
				this.now_dept_id = now_dept_id;
			},
			fnSetContents: function(uid){
				let vt = this;  
				let imgFile = [];
				let coachdata = {
					mapperId: 'coach.coachList',   
					uid:uid,
				};
				let measuredata = {
					mapperId: 'coach.measureDetail',   
					parent_uid:uid,
				};
				let evaldata = {
					mapperId: 'riskEval.evalDetail',   
					work_uid:uid,
				};
				let evaldata_cnt = {
					mapperId: 'riskEval.evalDetailCnt',   
					work_uid:uid,
				};
				Axios.post("/list", coachdata).then(function(rs) {
					vt.list = rs.data.list[0];

					if(vt.list.filepath != undefined){
						if(vt.list.filepath.charAt()=='/') {       //리눅스 경로때문에 사용
							vt.uploadImageSrc_1 = vt.list.filepath + vt.list.full_image;
						} else {    //아닐경우
							vt.uploadImageSrc_1 = vt.list.filepath.substr(2) + vt.list.full_image;
						}
					}

					vt.fnComment(vt.list.uid);
				});
				Axios.post("/list", measuredata).then(function(res) {
					vt.measure_list = res.data.list[0];
					
					// if(vt.measure_list.resultdt != undefined){
					// 	vt.measure_list.resultdt = (Common.fnDateTimeStrtime(vt.measure_list.resultdt)).substring(0,10);
					// }

					if(vt.measure_list.resultdt != undefined){
						if(vt.measure_list.filepath != undefined && vt.measure_list.filepath != ""){
							if(vt.measure_list.filepath.charAt()=='/') {       //리눅스 경로때문에 사용
								vt.uploadImageSrc_2 = vt.measure_list.filepath + vt.measure_list.full_image;
							} else {    //아닐경우
								vt.uploadImageSrc_2 = vt.measure_list.filepath.substr(2) + vt.measure_list.full_image;
							}
						}
						
						if(vt.measure_list.measure_sourcefile){
							vt.fnFileLoad(vt.measure_list.measure_sourcefile);
						}
					}
				});
				Axios.post("/list", evaldata_cnt).then(function(rs) {
					vt.evaldata_cnt = rs.data.list[0];
					if(vt.evaldata_cnt >= 1){
						Axios.post("/list", evaldata).then(function(rs) {
							vt.eval_list = rs.data.list[0];
							vt.fnEvalResult(vt.eval_list);
						});
					}
				});


			},
			//img load >> 코칭img, 조치img 구분을 위한 분리
			fnImgFileLoad: function(groupid, tag) {
				let vt = this;
				let vm = this.img;

				Axios.post("/filelist", {groupid: groupid}).then(function(rs) {
					if(tag == 'measure'){
						vm.filelist = rs.data.filelist[0];
						vm.fileGroup = rs.data.file_grp_id;
						if(vm.filelist.file_path.charAt()=='/') {       //리눅스 경로때문에 사용
							vt.uploadImageSrc_2 = vm.filelist.file_path + vm.filelist.file_new_name;
						} else {    //아닐경우
							vt.uploadImageSrc_2 = vm.filelist.file_path.substr(2) + vm.filelist.file_new_name;
						}
						vm.key = vm.filelist.file_seq;
					}else{
						if(rs.data.filelist[0].file_path.charAt()=='/') {       //리눅스 경로때문에 사용
							vt.uploadImageSrc_1 = rs.data.filelist[0].file_path + rs.data.filelist[0].file_new_name;
						} else {    //아닐경우
							vt.uploadImageSrc_1 = rs.data.filelist[0].file_path.substr(2) + rs.data.filelist[0].file_new_name;
						}
					}
					vt.$emit('filelist', vm);
				});
			},
			fnFileLoad: function(groupid) {
				let vt = this;
				let vm = this.file;

				Axios.post("/filelist", {groupid: groupid}).then(function(rs) {
					let filelist = rs.data.filelist;
					if(filelist.length>0) {
						vm.filelist = filelist;
						vm.fileGroup = rs.data.file_grp_id;
						for(let i=0; i<rs.data.filelist.length; i++) {
							vm.filelist[i].seq = i;
						}
					} else {
						vm.filelist = [{seq: 0},]
						vm.fileGroup = ''
					}
					vt.uploadFileName = rs.data.filelist[0].file_org_name;
					vt.uploadFile = vm.filelist[0].file_path + vm.filelist[0].file_new_name;
					vt.$emit('filelist', vm);
				});
			},
			fnCoachDelete : function(delete_uid){
				let vm = this;
				let data = {
					mapperId: 'coach.deleteCoachList', 
					uid : delete_uid
				}
				let data2 = {
					mapperId: 'coach.deleteCoachAction', 
					parent_uid : delete_uid
				}
				if(confirm("삭제하시겠습니까?")) {
					//코칭삭제
					Axios.post("/delete", data).then(function(rs) {
						//조치삭제
						Axios.post("/delete", data2).then(function(rs) {
							//목록 화면으로이동
							//vm.$router.push('/');
							$('.overlay_mask, .overlay_formbox').hide();
							$('body').removeClass("fix");

							vm.$parent.fnList(0);
						});
					});
				}
			},
			fnMeasureDel : function(delete_uid){
				let data = {
					mapperId: 'coach.deleteCoachAction', 
					parent_uid : delete_uid
				}
				if(confirm("조치사항을 정말 삭제하시겠습니까?\n코칭이 삭제되지 않습니다. 조치내역이 있을경우 조치내역만 삭제됩니다.")) {
					Axios.post("/delete", data).then(function(rs) {
					});
					alert('삭제되었습니다.');
					$('.overlay_mask, .overlay_formbox').hide();
					$('body').removeClass("fix");

					vm.$parent.fnList(0);
				}
			},
			//조치에 대한 반려 및 완료
			fnResultAction :  function(result){
				let vm = this;
				if(result == 2){ //반려
					vm.result = 2;
				}if(result == 1){ //완료 
					alert('해당 조치결과를 완료 처리 하시겠습니까?');
					let data = {
						mapperId: 'coach.updateCoachResult', 
						uid : vm.now_uid,
						state : 1,
						work_state : 1,
					}
					let data2 = {
						mapperId: 'coach.updateMeasureResult', 
						parent_uid : vm.now_uid,
						state : 1,
						work_state : 1,
					}
					Axios.post("/update", data).then(function(rs){
						Axios.post("/update", data2).then(function(rs){
							if(rs.data.success == false) {
								alert(Message.ERROR);
							}
							alert('처리되었습니다.');
							$('.overlay_mask, .overlay_formbox').hide();
							$('body').removeClass("fix");

							vm.$parent.fnList(0);
						});
					}).catch(function(ex) {
					console.log(ex);
					});
				}
			},
			fnMeaCancelInsert : function(){ 
				let vm= this;
				alert('해당 조치결과를 반려 처리 하시겠습니까?');
				vm.result = 1;
				//조치 데이터 
				let data1 = {
					mapperId: 'coach.updateMeasureCancel',   
					parent_uid : vm.now_uid,
					memberuid : 0,
					state : 0,
					// contents : '',
					cancel_type : 0,
					resultdt : '0000-00-00 00:00:00',
					name: vm.keyword
				}
				//코칭 데이터
				let data2 = {
					mapperId: 'coach.updateMeasureCancel',   
					uid : vm.now_uid,
					state : 2,
					cancel_contents : vm.cancel_contents,
					is_coach_cancel : 1,
					name: vm.keyword 
				}
				
				Axios.post("/update", data1).then(function(response) {
					Axios.post("/update", data2).then(function(response) {
						alert('처리되었습니다.');
						$('.overlay_mask, .overlay_formbox').hide();
						$('body').removeClass("fix");

						vm.$parent.fnList(0);
					});
				}).catch(function(ex) {
					console.log("error"+ex);
				});
			},
			//위험성평가
			fnEvalResult:function(eval_list){

				eval_list.multiply1 = eval_list.itns * eval_list.freq;
				eval_list.multiply2 = eval_list.itns2 * eval_list.freq2;	

				if(eval_list.multiply1 >=1 && eval_list.multiply1 <= 3){
					eval_list.grade1 = '매우낮음'
				}if(eval_list.multiply1 >=4 && eval_list.multiply1 <= 6){
					eval_list.grade1 = '낮음'
				}if(eval_list.multiply1 == 8){
					eval_list.grade1 = '보통'
				}if(eval_list.multiply1 >=9 && eval_list.multiply1 <= 12){
					eval_list.grade1 = '약간높음'
				}if(eval_list.multiply1 == 15){
					eval_list.grade1 = '높음'
				}if(eval_list.multiply1 >=16 && eval_list.multiply1 <= 20){
					eval_list.grade1 = '매우높음'
				}

				if(eval_list.multiply2 >=1 && eval_list.multiply2 <= 3){
					eval_list.grade2 = '매우낮음'
				}if(eval_list.multiply2 >=4 && eval_list.multiply2 <= 6){
					eval_list.grade2 = '낮음'
				}if(eval_list.multiply2 == 8){
					eval_list.grade2 = '보통'
				}if(eval_list.multiply2 >=9 && eval_list.multiply2 <= 12){
					eval_list.grade2 = '약간높음'
				}if(eval_list.multiply2 == 15){
					eval_list.grade2 = '높음'
				}if(eval_list.multiply2 >=16 && eval_list.multiply2 <= 20){
					eval_list.grade2 = '매우높음'
				}
			},
			fnTapOpen:function(id){
				let vm = this;
				
				if(id == 'coach'){
					vm.coach_tap = true;
					vm.measure_tap = false;
				}else if(id == 'measure'){
					vm.coach_tap = false;
					vm.measure_tap = true;
				}
			},
			fnMeaClose : function(){
				let vm= this;
				vm.result = 1;
			},
			//파일 다운로드
			fnFileDownload: function(paramSeq){
				let file_seq = parseInt(paramSeq);
        		Common.fnOnFileDownload(file_seq);
     		},
			//댓글 가져오기
			fnComment: function(uid){
				let vm = this;
				vm.$refs.comment.fnInit(uid);
			}
		}
	};
</script>
