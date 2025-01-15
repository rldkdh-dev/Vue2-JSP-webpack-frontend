<template>
	<modal :pass="{widthObject: 700, popupTitle: (viewModel.gbn == 'view' ? viewModel.data.subject : (viewModel.sug_no != 3 ? viewModel.sug_no+'차 평가' : '개선조치'))}">
		<template v-slot:contents>
			<p class="table-title ">제안 정보</p>
			<table>
				<tbody class="table">
					<tr>
						<th scope="row" style="width:120px">제안명</th>
						<td colspan="3">{{ viewModel.data.subject }}</td>
					</tr>
					<tr>
						<th scope="row" style="width:120px">제안자</th>
						<td>{{ viewModel.data.user_dept_name }} {{ viewModel.data.job_name }} {{ viewModel.data.user_name }}</td>
						<th scope="row" style="width:120px">제안일</th>
						<td>{{ viewModel.data.regdt }}</td>
					</tr>
					<tr>
						<th scope="row">관련분야</th>
						<td>{{ viewModel.data.cat1 }}</td>
						<th scope="row">사례 구분</th>
						<td>{{ viewModel.data.cat2 }}</td>
					</tr>
					<tr>
						<th scope="row">장소</th>
						<td>{{ viewModel.data.area }}</td>
						<th scope="row" rowspan="4">사진</th>
						<td rowspan="4">
							<img :src="viewModel.data.file_path">
						</td>
					</tr>
					<tr>
						<th scope="row">유해위험요인</th>
						<td>{{ viewModel.data.contents1 }}</td>
					</tr>
					<tr>
						<th scope="row">위험성평가</th>
						<td>{{ viewModel.data.risk_assmn_txt }}</td>
					</tr>
					<tr>
						<th scope="row">개선방안제안</th>
						<td>{{ viewModel.data.contents2 }}</td>
					</tr>
				</tbody>
			</table> 

			<template v-for="(item,index) in evalInfoList">
				<p class="table-title mt20" v-if="item.step == 1">{{item.step}}차평가 정보</p>
				<p class="table-title mt20" v-if="item.step == 2">{{item.step}}차평가 정보#{{index}}</p>
				<table class="table">
					<tbody>
						<tr>
							<th scope="row" style="width:120px">평가자</th>
							<td class="tl">
								{{ item.user_dept_name}} {{ item.job_name }} {{ item.user_name }}
							</td>
						</tr>
						<tr>
							<th scope="row" style="width:120px">위험성평가</th>
							<td class="tl">
								{{ item.risk_assmn_txt }}
							</td>
						</tr>
						<tr>
							<th scope="row" style="width:120px">개선방안제안</th>
							<td class="tl">
								{{ item.contents }}
							</td>
						</tr>
					</tbody>
				</table>
			</template>

			<template v-if="viewModel.data.mult != null">
				<p class="table-title mt20">2차평가 판정</p>
				<table class="table">
					<tbody>
						<tr>
							<th scope="row" style="width:120px;">2차 평가 평균값</th>
							<td class="tl">
								{{ viewModel.data.data_avg }}
							</td>
						</tr>
						<tr>
							<th scope="row">판정</th>
							<td class="tl">
								{{ viewModel.data.status_name }}
							</td>
						</tr>
						<tr v-if="viewModel.data.status == 2">
							<th scope="row">반려사유</th>
							<td class="tl">
								{{ viewModel.data.contents3 }}
							</td>
						</tr>
					</tbody>
				</table>
			</template>
			<template v-if="viewModel.sug_no == 3">
				<template v-if="viewModel.gbn == 'view'">
					<p class="table-title mt20">개선조치</p>
					<table class="">
						<tbody>
							<tr>
								<th style="width:120px;">위험성평가</th>
								<td class="tl" style="padding:4px;">
									{{ viewModel.data.step3_risk_assmn_txt }}
								</td>
							</tr>
							<tr>
								<th>개선조치결과</th>
								<td class="tl">
									{{ viewModel.data.step3_contents }}
								</td>
							</tr>
							<tr>
								<th>사진</th>
								<td>
									<img :src="viewModel.data.step3_file_path">
								</td>
							</tr>
						</tbody>
					</table>
				</template>
				<template v-else>
					<p class="table-title mt20">개선조치</p>
					<table class="">
						<tbody>
							<tr>
								<th style="width:120px;">개선조치 결과</th>
								<td class="tl" style="padding:4px;">
									<textarea name="contents" class="full" style="resize:vertical; height:150px;" v-model="viewModel.data.data_contents"></textarea>
								</td>
							</tr>
							<tr>
								<th>사진</th>
								<td>
									<imgfileform @filelist="fnFilelist" :pass="{id:'bp'}" ref="imgfile"></imgfileform>
								</td>
							</tr>
							<tr>
								<th>위험성평가</th>
								<td>
									<div class="textarea-box" style="width:100px;">
										<input type="hidden" v-model="freq" title="빈도">
										<input type="hidden" v-model="itns" title="강도">
										<input type="hidden" v-model="result" title="결과">
										<input for="s_data1" id="s_data1" type="text" class="form-input w250" readonly v-model="risk_assmn_txt" @click="fnPopup()"/>
									</div>
								</td>
							</tr>
						</tbody>
					</table>
					<div class="buttonbox mt10">
						<input type="submit" value="저장" class="btn btn-save btn-primary" @click="fnSave" />
						<a href="javascript:btn_formbox_close();" class="btn btn-cancel">취소</a>
					</div>
				</template>
			</template>		

			<!-- 부서장?만 평가 판정 가능 -->
			<template v-if="viewModel.sug_no==2 && viewModel.user.user_num == viewModel.user.team_leader && viewModel.gbn != 'view'">	
				<p class="table-title mt20">2차평가 판정</p>
				<table class="table">
					<tbody>
						<tr>
							<th scope="row" style="width:120px;">2차 평가 평균값</th>
							<td class="tl">
								{{ viewModel.data.data_avg }}
							</td>
						</tr>
						<tr>
							<th scope="row">판정</th>
							<td class="tl">
								<div class="radio-group">
									<template v-for="(item, index) in cat1List">
										<label class="radio_label mr10" :for="'s_cat1_'+item.uid">{{item.cd_name}}
											<input type="radio" name="s_cat1" :id="'s_cat1_'+item.uid" :value=index v-model="viewModel.data.status">
											<span class="checkmark"></span>
										</label>
									</template>
								</div>
							</td>
						</tr>
						<!-- 판정 값이 반려일 경우 -->
						<tr v-if="viewModel.data.status == 2">
							<th scope="row">반려사유</th>
							<td class="tl">
								<textarea name="contents" class="full" style="resize:vertical; height:150px;" v-model="viewModel.data.data_rtn_contents"></textarea>
							</td>
						</tr>
						<!-- 판정 값이 해당이거나, 강제개선일 경우 -->
						<tr v-else-if="viewModel.data.status == 0 || viewModel.data.status == 1">		
							<th scope="row">개선담당자</th>
							<td class="tl">
								<div>
									<input type="text" id="eval_membername" name="eval_membername" readonly :value="eval_membername"/>
									<button type="button" @click="fnUserPopup()" class="btn btn-icon btn4 md btn-updown" style="padding: 0 4px;">
                                        <span class="mi" style="font-size:20px;;">person_search</span>
                                    </button>
								</div>
							</td>
						</tr>
					</tbody>
				</table>
				<div class="buttonbox mt10">
					<input type="button" value="2차평가 판정저장" class="btn btn-save btn-danger" @click="fnComplete();">
				</div>
			</template>
			
			<template v-if="viewModel.sug_no != 3">
				<template v-if="viewModel.gbn != 'view'">
					<p class="table-title mt20">{{viewModel.sug_no}}차평가 등록</p>
					<table class="table">
						<tbody>
							<tr>
								<th scope="row" style="width:120px;">평가자</th>
								<td class="tl">
									{{ viewModel.user.user_dept}} {{ viewModel.user.job_name }} {{ viewModel.user.user_name }}
								</td>
							</tr>
							<tr>
								<th scope="row">위험성평가</th>
								<td class="tl">
									<div class="textarea-box" style="width:100px;">
										<input type="hidden" v-model="freq" title="빈도">
										<input type="hidden" v-model="itns" title="강도">
										<input type="hidden" v-model="result" title="결과">
										<input for="s_data1" id="s_data1" type="text" class="form-input w250" readonly v-model="risk_assmn_txt" @click="fnPopup()"/>
									</div>
								</td>
							</tr>
							<tr>
								<th scope="row">개선방안제안</th>
								<td class="tl">
									<textarea name="contents" class="full" style="resize:vertical; height:150px;" v-model="viewModel.data.data_contents"></textarea>
								</td>
							</tr>
						</tbody>
					</table>
					<div class="buttonbox mt10">
						<input type="submit" value="저장" class="btn btn-save btn-primary" @click="fnSave" />
						<a href="javascript:btn_formbox_close();" class="btn btn-cancel">취소</a>
					</div>
				</template>
			</template>
		</template>
	</modal>
	
</template>

<script>
import Axios from 'axios';
import Vue from 'vue'
import Common from '../../common.js';
import Pager from '../../paging.vue'
import Modal from './modal.vue'
import Imgfileform from '../imgfileform.vue';

export default {
	components: {
		Pager,
		Modal,
		Imgfileform, 
	},
	data: function () {
		return {
			user:{},
			isPop:false,
			freq: '',		//빈도
			itns: '',		//강도
			result: '',		//결과
			risk_assmn_txt: '',
			evalInfoList: [],
			cat1List: [],
			eval_membername:'',
			eval_memberuid:'',	
			viewModel:{
				dataList:[],
				dataFList:[],
				data:{},
				keyword:"",
				sug_no:0,
				gbn:'',
				user: {},
				img_filelist: [],
				img_fileGroup: ''
			},
		}
	},
	mounted: function () {
		this.viewModel.user = this.$store.state.global.userInfo;
	},
	methods: {
		fnInit: function(uid, no, gbn) {
			let vt = this;
			let vm = this.viewModel;
			vm.sug_no = no;
			vm.gbn = gbn;
			vm.dataList = [];
			vm.dataFList = [];

			vt.user = this.$store.state.global.userInfo;

			Modal.methods.fnInit();
			vt.fnSetContents(uid);
		},
		fnSetContents: function(uid){
			let vt = this;
			let vm = this.viewModel;

			let data = {
				mapperId: ['sugg.selectSuggestList', 'sugg.selectSuggestEvalList', 'sugg.selectCatPopupList'],
				uid: uid,
				step: vm.sug_no,
			};

			Axios.post("/multiList",data).then(function(rs) {
				vm.data = rs.data.list1[0];			//기본정보
				//날짜형식 yyyy-mm-dd
				vm.data.regdt = Common.fnConvertDateStr(vm.data.regdt);
				
				//이미지
				if(vm.data.file_path != null){
					if(vm.data.file_path.charAt()=='/') {       //리눅스 경로때문에 사용
						vm.data.file_path = vm.data.file_path + vm.data.file_new_name;
					} else {    //아닐경우
						vm.data.file_path = vm.data.file_path.substr(2) + vm.data.file_new_name;
					}
				}

				//개선조치 이미지
				if(vm.data.step3_file_path != null){
					if(vm.data.step3_file_path.charAt()=='/') {       //리눅스 경로때문에 사용
						vm.data.step3_file_path = vm.data.step3_file_path + vm.data.step3_file_new_name;
					} else {    //아닐경우
						vm.data.step3_file_path = vm.data.step3_file_path.substr(2) + vm.data.step3_file_new_name;
					}
				}

				vt.evalInfoList = rs.data.list2;	//평가정보 리스트
				vt.cat1List = rs.data.list3;		//평가 판정 라디오로 보여줄 항목들
				
				//2차 평균값 구하기
				let cnt = 0;
				let sum = 0;
				for(let i = 0; i< vt.evalInfoList.length; i++){
					let item = vt.evalInfoList[i];
					if(item.step == 2){ //2차 평가인 것만
						cnt++;
						sum = sum + (Number(item.itns) * Number(item.freq));
					}
				}
				if(cnt > 0 ){
					let avg = sum / cnt;	//평균값 입력
					vm.data.data_avg = avg;
				}
			});
		},
		fnSave: function(){
			let vt = this;  
			let vm = this.viewModel;  
			let data = {
				mapperId: 'sugg.insertSuggestData',
				sg_uid: vm.data.uid,
				memberuid: vt.user.memberuid,
				step: vm.sug_no,
				itns: vt.itns,
				freq: vt.freq,
				result: vt.result,
				contents: vm.data.data_contents,
				risk_assmn_txt: vt.risk_assmn_txt,
				img_attach_file: (vm.img_fileGroup == '') ? null : vm.img_fileGroup,
			};

			if($("#s_data1").val() == ""){
				alert("위험성 평가를 입력해주세요.");
				return;
			}

			if(confirm("평가를 저장하시겠습니까?")) {
				Axios.post("/insert", data)
				.then(function(rs) {
					if(vm.img_fileGroup!='') {
						vt.$refs.imgfile.fnInsertFile()
					}
					$('.overlay_mask, .overlay_formbox').hide();
					$('body').removeClass("fix");

					//팝업들 초기화
					vt.$parent.isPop = false;
					vt.$parent.isSugPop = false;
					vt.$parent.isUserPop = false;

					vt.$parent.fnList(0);
				});
			}
		},
		fnComplete: function(){
			let vt = this;  
			let vm = this.viewModel;  
			let data = {
				mapperId: 'sugg.updateSuggestCompl',
				uid: vm.data.uid,
				memberuid: vt.user.memberuid,
				data_avg: vm.data.data_avg,
				status: vm.data.status,
				contents3: (vm.sug_no == '2') ? vm.data.data_rtn_contents : vm.data.contents3,
				eval_memberuid: (vm.sug_no == '2') ? vt.eval_memberuid : '',
			};	

			if(vm.data.data_avg == undefined){
				alert("2차평가를 등록하지 않았습니다. 2차평가 등록 후 판정을 진행해주세요.");
				return;
			};

			if(vm.data.status == undefined){
				alert("2차평가 판정을 선택해주세요.");
				return;
			}else if(vm.data.status == 2 && vm.data.data_contents == ""){
				alert("반려사유를 입력해주세요.");
				return;
			}else if((vm.data.status == 0 || vm.data.status == 1) && vt.eval_membername == ""){
				alert("개선담당자를 입력해주세요.");
				return;
			}

			if(confirm("평가판정을 저장하시겠습니까?")) {
				Axios.post("/insert", data)
				.then(function(rs) {
					$('.overlay_mask, .overlay_formbox').hide();
					$('body').removeClass("fix");

					//팝업들 초기화
					vt.$parent.isPop = false;
					vt.$parent.isSugPop = false;
					vt.$parent.isUserPop = false;

					vt.$parent.fnList(0);
				});
			}

		},
		fnPopup:function(){
			this.$parent.fnDangerPopup();
		},
		fnUserPopup:function(){
			this.$parent.fnUserPopup();
		},
		fnFilelist: function(vm) {
			this.viewModel.img_filelist = vm.filelist;
			this.viewModel.img_fileGroup = vm.fileGroup;
		},
	}
};
</script>

