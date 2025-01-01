<template>
	<main class="site_main">
		<div class="wrap">
		<a href="http://localhost:8080/account/login" class="btn sm" style="margin-bottom: 10px;float: right;">내부직원용으로 의견작성</a>

			<div class="fx-s" style="width:100%;">
				<ul class="cc-form">
					<li>
						<input id="cname" name="cname" type="text" class="form-input" placeholder="성명 (필수)" v-model="info.reg_user_nm">
					</li>
					<li>
						<input id="ctel" name="ctel" type="number" class="form-input" placeholder="연락처 (필수)" v-model="info.phone_num">
					</li>
					<li>
						<div class="textarea-box">
							<div class="radio-group">
								<label class="radio_label b-type">
									<input type="radio" name="contents_type" value="1" checked="">
									<span class="checkmark">종사자의견 청취</span>
								</label>
								<!-- <label class="radio_label b-type">
									<input type="radio" name="contents_type" value="2">
									<span class="checkmark">작업중지</span>
								</label> -->
							</div>
							<textarea id="contents" name="contents" class="form-input" placeholder="종사자 의견 (내용입력)" v-model="info.contents1"></textarea>
						</div>
					</li>
					<li>
						<label>자동입력 방지 문자</label>
						<div class="captcha_form">
							<div class="captcha_row">
								<!-- <img id="uploadImg" :src="uploadImageSrc_num" style="width:80px">
									 -->
									<img title="캡차이미지" src="/captchaImg" alt="캡차이미지" id="captcha"/>
									<input type="button" @click="getTextImg();" value="새로 고침" tabindex="-1" class="btn btn-light">
							</div>
							<div class="input_row"><input type="number" name="captcha" required="" placeholder="위 자동입력 방지 문자를 입력해주세요." v-model="info.num"></div>
						</div>
					</li>
				</ul><!-- } cc-form -->
				<div class="photo-control-area">
					<div class="photo-area fileinput" data-provides="fileinput">
						<i class="photo-file-size"></i>
						<div id="imgfileinput" style="position:relative;">
							<div class="fileinput-preview thumbnail" id="fileinput-preview">
								<img id="uploadImg" :src="uploadImageSrc">
							</div>
						</div>
						<div class="button-area">
							<span class="btn btn-file btn-light"><span class="fileinput-news"><img src="/design/main_asset/asset/img/mobile/photo.png">사진첨부</span>
								<input type="file" id="coach_img" name="c_img" @change="fnUploadImageThumbnail(this)" accept="image/png, image/jpeg">
							</span>
							<button type="button" id="editclear" class="btn btn-reset btn-danger" ><img src="/design/main_asset/asset/img/mobile/refresh_white.png">초기화
							</button>
							<button type="button" id="editable" class="btn btn-edit btn-info" style="display:none;"><img src="/design/main_asset/asset/img/mobile/edit_white.png">편집모드</button>
						</div>
						<div id="signature-pad" class="m-signature-pad" :class="{'drag-success': uploadImageSrc!=''}" style="position: absolute;">
							<div id="sign">
								<canvas id="signatureCanvas"></canvas>
							</div>
						</div>
					</div>
					<imgEditing ref="imgEdit" @editInfo="fnEditInfo"></imgEditing>
				</div>
			</div><!-- } fx -->

			<div class="form-group">
				<div class="fx">
					<label class="check_label">개인정보 수집 ‧ 이용 ‧ 제공 동의
						<input type="checkbox" name="agree1" id="agree1" v-model="info.agree1">
						<span class="checkmark"></span>
					</label>
					<a href="javascript:void(0);" class="btn_pop">자세히 보기</a>
				</div>
			</div>
			<input type="submit" value="종사자 의견 제출하기" class="btn-submit" @click="fnSave();">
		</div><!-- } wrap -->

		<div class="overlay_mask"></div>
		<div class="overlay_formbox pop_agree">
			<div class="title_box"><h1>개인정보 수집 ‧ 이용 ‧ 제공 동의서</h1><a href="javascript:void(0);" class="btn_formbox_close"></a></div>
			<div class="formbox_panel">
				<p>본인은 종사자의견을 개진함에 있어 [개인정보 보호법] 제15조 및 제17조에 따라 아래의 내용으로 개인정보를 수집, 이용 및 제공하는데 동의합니다.</p>
				<p>&nbsp;</p>
				<h2>1. 개인정보의 수집 및 이용에 관한 사항</h2>
				<p>- 수집하는 개인정보 항목 : 성명, 전화번호 </p>
				<p>- 개인정보의 이용 목적 : 수집된 개인정보를 사업장 종사자 의견 및 작업중지에 관한 상세 내용을 확인하기 위해 연락의 용도로 활용하며, 목적 외의 용도로는 사용하지 않습니다. </p>
				<p>&nbsp;</p>
				<h2>2. 개인정보의 보관 및 이용 기간</h2>
				<p>- 귀하의 개인정보를 다음과 같이 보관하며, 수집, 이용 및 제공 목적이 달성된 경우 [개인정보 보호법] 제21조에 따라 처리합니다.</p>
				<p>&nbsp;</p>
				<p>2023년 01월 18일</p>
			</div>
		</div>
	</main>
</template>

<script>
import 'es6-promise/auto'
import Vue from 'vue'
import Axios from 'axios'
import fromValidation from "../../../common/fromValidation";
import Message, {messageUtil} from "../../../common/message";
import Common from '../../common.js';
import imgEditing from "../imgEditing.vue";

export default{
	components : {
		'imgEditing':imgEditing,
	},
    data: function () {
        return {
			uploadImageSrc_num : '',
			uploadImageSrc : '',
			num : '',	
			mode: '',
			filelist: [],
			originImg:'',
			originImg:'',
			uid: '',
			info:{},
			user: {},
        }
    },
    mounted: function() {
		let vm = this;
		vm.user = this.$store.state.global.userInfo;
		$('.btn_pop').click(function(){
			$('body').addClass("fixed");
			$(".overlay_mask").show();
			$(".overlay_formbox").show();
		});
		$('.btn_formbox_close').click(function(){
			$('body').removeClass("fixed");
			$(".overlay_mask").hide();
			$(".overlay_formbox").hide();
		});
		$('.overlay_mask').click(function(){
			$('body').removeClass("fixed");
			$(this).hide();
			$(".overlay_formbox").hide();
		});
    },
    methods: {
		getTextImg(){
			let vm = this;
			var url = '/captchaImg';
			document.querySelector('#captcha').setAttribute('src', url);
			vm.info.num = '';
		},
		//이미지, 편집기능으로 공통기능과 구분
		fnUploadImageThumbnail: function(param){
			let vm = this;
			let file = $('#coach_img')[0].files[0];
			var reader = new FileReader();
			
			vm.filelist = file;
			reader.readAsDataURL(vm.filelist);
			reader.onload = function(){
				vm.originImg = reader.result;
				// console.log(reader.result.replace('data:', '').replace(/^.+,/, ''));
			} 
			
			if(file.length > 0) {
				let fileUploadType = ['jpg', 'gif', 'png', 'jpeg'];
				let fileExt = file.name.split('.').pop();
				if(fileUploadType.indexOf(fileExt) == -1){
					alert(messageUtil(Message.UPLOAD_FILE_TYPE, ['이미지']));
					return;
				}
			}
			
			vm.uploadImageSrc = URL.createObjectURL(file);
			console.log(vm.filelist);

			// let img = new Image();
			// img.src = vm.uploadImageSrc;
			$('#editable').show();

			$("#editable").removeClass("active");
			vm.$refs.imgEdit.fnResizeCanvas();
			vm.$refs.imgEdit.fnEditable_close();
			vm.$refs.imgEdit.signaturePad.clear();

			if(vm.fileGroup == '') {
				Axios.post('/filegroup').then((response) => {
					vm.fileGroup = response.data;
				});
			}
		},
		fnSave : function(){
			let vm= this;
			let file = $('#coach_img')[0].files[0];

			let data = {
				mapperId: 'opin.insertOpin', 
				reg_user_nm: vm.info.reg_user_nm, 
				phone_num: vm.info.phone_num, 
				contents1 : vm.info.contents1,
			}
			
			const valiData = [
				{id: 'cname', type: 'input', title: '성명'},
				{id: 'ctel', type: 'input', title: '연락처'},
				{id: 'contents', type: 'input', title: '종사자의견'},
			];
			
			if(fromValidation(valiData)) {
				if(!vm.uploadImageSrc){
					alert("사진을 선택해주세요.");
					return false;
				}

				if(!vm.info.num){
					alert("자동입력 방지문자를 입력해주세요.");
					return false;
				}

				let dataKey = {
					answer: vm.info.num
				};
				
				Axios.post("/captchaCheck", dataKey).then(function(res) {
					if(res.data == 300){
						alert('자동입력 방지 문자가 틀렸습니다.');
						vm.getTextImg();
						return false;
					}
					if(!vm.info.agree1){
						alert("개인정보 수집 ‧ 이용 ‧ 제공 동의를 하셔야 제출이 가능합니다.");
						return false;
					}
					
					if(confirm(Message.CREATE_CONFIRM)){
						let dataKey = {
							mapperId: 'opin.getOpinSeq',
						};
		
						Axios.post("/list", dataKey).then(function(rs) {
							data.uid = rs.data.list[0];
							vm.uid = rs.data.list[0];
							Axios.post("/insert", data).then(function(res){
								if(res.data == 1){
									vm.$refs.imgEdit.fnImging(vm.originImg,"opin");
								}
							});
						});
					}else{
						vm.getTextImg();
					}
				});
				
			}
		},
		fnFileCmpl:function(){
			let vm = this;
			alert("정상적으로 제출이 완료되었습니다.");
			vm.$router.go(0);
		},
    }
}
</script>
