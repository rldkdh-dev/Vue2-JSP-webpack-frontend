<template>
	<div class="modal_wrap detail">
		<div class="popup modal">
			<div class="popup_panel">
				<div class="popup_header" ref="draggableContainer">
					<h4>협력업체 안전보건 현황</h4>
					<div class="icon_box">
						<button class="btn btn-icon btn_fullscreen"><svg class="icon"><use xlink:href="/img/symbol-defs.svg#icon-fullscreen"></use></svg></button>
						<button class="btn btn-icon btn_popup_close" @click="fnClose($event);"><svg class="icon"><use xlink:href="/img/symbol-defs.svg#icon-delete"></use></svg></button>
					</div>
				</div>
				<div class="contents popup_contents">
					<div>
						<h3>기본정보</h3>
						<table class="table horizontal write">
							<caption>기본 정보</caption>
							<tbody>
								<tr>
									<th scope="row">협력사명</th>
									<td>{{ viewModel.data.ccpy_nm }}</td>
									<th scope="row">사업자등록번호</th>
									<td colspan="2">{{ viewModel.data.brno }}</td>
									<th scope="row">대표자명</th>
									<td>{{ viewModel.data.rprsv_nm }}</td>
								</tr>
							</tbody>
						</table>
					</div>
					<div style="margin-top: 10px;">
						<h3>일반</h3>
						<table class="table horizontal  write">
							<caption>일반</caption>
							<tbody>
								<tr>
									<th scope="row" class="w220">회사설립연도</th>
									<td>{{ viewModel.data.gnrl_co_fndn_year != null ? viewModel.data.gnrl_co_fndn_year.substr(0,4) + '/' + viewModel.data.gnrl_co_fndn_year.substr(4,2) : '' }}</td>
									<th scope="row" class="w275">업면허 보유현황</th>
									<td>{{ viewModel.data.gnrl_bnsty_lcns_hold_sttus }}개</td>
								</tr>
								<tr>
									<th scope="row">동일공사 경험기간</th>
									<td>{{ viewModel.data.gnrl_samenss_cstrn_exprnc_pd != null ? viewModel.data.gnrl_samenss_cstrn_exprnc_pd.substr(0,4) + '/' + viewModel.data.gnrl_samenss_cstrn_exprnc_pd.substr(4,2) : '' }}</td>
									<th scope="row">GS네오텍 시공실적</th>
									<td>{{ viewModel.data.gnrl_gs_cnstrct_prfmnc }}회</td>
								</tr>
								<tr>
									<th scope="col" colspan="4" class="text-center">1군 건설사 시공실적</th>
								</tr>
								<tr>
									<td colspan="4">
										<textarea disabled rows="5" title="1군 건설사 시공실적">{{ viewModel.data.gnrl_fstcls_cnstrc_cnstrct_prfmnc }}</textarea>
									</td>
								</tr>
								<tr>
									<th scope="row">보유 기술</th>
									<td>{{ viewModel.data.gnrl_hold_tchnlgy }}</td>
									<th scope="row">대외 수상 경력</th>
									<td>{{ viewModel.data.gnrl_extrnl_wnpz_career }}</td>
								</tr>
								<tr>
									<th scope="row">안전보건경영시스템 인증</th>
									<td>{{ viewModel.data.gnrl_safe_helth_mngmt_sys_cert }}</td>
									<th scope="row">안전보건경영방침 및 목표<br></th>
									<td>{{ viewModel.data.gnrl_safe_helth_mngmt_polcy_nd_goal }}</td>
								</tr>
								<tr>
									<th scope="row">안전보건 예산 및 시설 투자<br></th>
									<td colspan="3">
										<div class="input_group">
											<div class="unit_box wp100">
												<input type="text" style="text-align:center;padding-right:0 !important" disabled :value=addComma(viewModel.data.gnrl_safe_helth_bgt_nd_fclt_invt1)>
												<span>원</span>
											</div>
											<div class="unit_box wp100">
												<input type="text" style="text-align:center;padding-right:0 !important" disabled :value=addComma(viewModel.data.gnrl_safe_helth_bgt_nd_fclt_invt2)>
												<span>원</span>
											</div>
											<div class="unit_box wp100">
												<input type="text" style="text-align:center;padding-right:0 !important" disabled :value=addComma(viewModel.data.gnrl_safe_helth_bgt_nd_fclt_invt3)>
												<span>원</span>
											</div>
											<div class="unit_box wp100">
												<input type="text" style="text-align:center;padding-right:0 !important" disabled :value=addComma(viewModel.data.gnrl_safe_helth_bgt_nd_fclt_invt4)>
												<span>원</span>
											</div>
										</div>
									</td>
								</tr>
								<tr>
									<th scope="row">최근 3개년 재해율<br></th>
									<td>
										<div class="unit_box">
											{{ viewModel.data.gnrl_recent_3year_dsstr_rt }}
											<span>%</span>
										</div>
									</td>
									<th scope="row">최근 5개년 산업재해 발생건수</th>
									<td>
										<div class="unit_box">
											{{ viewModel.data.gnrl_recent_5year_inlc_ocrn_nocs }}
											<span>건</span>
										</div>
									</td>
								</tr>
								<tr>
									<th scope="col" colspan="4" class="text-center">재해발생시 보고체계 및 원인 분석, 재발방지대책 수립여부</th>
								</tr>
								<tr>
									<td colspan="4">
										{{ viewModel.data.gnrl_recr_prvn_cntrpln_foundng_yn == 'Y' ? '예' : '아니오' }}
									</td>
								</tr>
							</tbody>
						</table>
					</div>
					<div style="margin-top: 10px;">
						<h3>기술자 보유 현황 - &nbsp;<strong>현장소장</strong>&nbsp;보유 인원수</h3>
						<!-- <div class="message info">
							<h3><svg class="icon"><use xlink:href="/img/symbol-defs.svg#icon-info-circle"></use></svg>주의</h3>
							<div class="ol_counter">
								<ol>
									<li><span></span>기술인협회 경력확인서</li>
									<li><span></span>4대 보험가입자 명부</li>
									<li><span></span>현재 GS네오텍 공사중인 경우 각 현장 개인별 건강보험 득실 확인서 사본 첨부</li>
								</ol>
							</div>
						</div> -->
						<table class="table write">
							<caption>기술자 보유현황-현장소장 보유 인원수</caption>
							<thead>
								<tr>
									<th scope="col" class="w245">경력\근속</th>
									<th scope="col" class="w245">10년 이상</th>
									<th scope="col" class="w245">5년 ~ 10년</th>
									<th scope="col" class="w245">1년 ~ 5년</th>
									<th scope="col" class="w245">1년 미만</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td>10년 이상</td>
									<td>
										<div class="unit_box">
											{{ viewModel.data.spt_hdch_hold_1_1 }}
											<span >명</span>
										</div>
									</td>
									<td>
										<div class="unit_box">
											{{ viewModel.data.spt_hdch_hold_1_2 }}
											<span >명</span>
										</div>
									</td>
									<td>
										<div class="unit_box">
											{{ viewModel.data.spt_hdch_hold_1_3 }}
											<span >명</span>
										</div>
									</td>
									<td>
										<div class="unit_box">
											{{ viewModel.data.spt_hdch_hold_1_4 }}
											<span >명</span>
										</div>
									</td>
								</tr>
								<tr>
									<td>5년 ~ 10년</td>
									<td>
										<div class="unit_box">
											{{ viewModel.data.spt_hdch_hold_2_1 }}
											<span >명</span>
										</div>
									</td>
									<td>
										<div class="unit_box">
											{{ viewModel.data.spt_hdch_hold_2_2 }}
											<span >명</span>
										</div>
									</td>
									<td>
										<div class="unit_box">
											{{ viewModel.data.spt_hdch_hold_2_3 }}
											<span >명</span>
										</div>
									</td>
									<td>
										<div class="unit_box">
											{{ viewModel.data.spt_hdch_hold_2_4 }}
											<span >명</span>
										</div>
									</td>
								</tr>
								<tr>
									<td>1년 ~ 5년</td>
									<td>
										<div class="unit_box">
											{{ viewModel.data.spt_hdch_hold_3_1 }}
											<span >명</span>
										</div>
									</td>
									<td>
										<div class="unit_box">
											{{ viewModel.data.spt_hdch_hold_3_2 }}
											<span >명</span>
										</div>
									</td>
									<td>
										<div class="unit_box">
											{{ viewModel.data.spt_hdch_hold_3_3 }}
											<span >명</span>
										</div>
									</td>
									<td>
										<div class="unit_box">
											{{ viewModel.data.spt_hdch_hold_3_4 }}
											<span >명</span>
										</div>
									</td>
								</tr>
								<tr>
									<td>1년 미만</td>
									<td>
										<div class="unit_box">
											{{ viewModel.data.spt_hdch_hold_4_1 }}
											<span >명</span>
										</div>
									</td>
									<td>
										<div class="unit_box">
											{{ viewModel.data.spt_hdch_hold_4_2 }}
											<span >명</span>
										</div>
									</td>
									<td>
										<div class="unit_box">
											{{ viewModel.data.spt_hdch_hold_4_3 }}
											<span >명</span>
										</div>
									</td>
									<td>
										<div class="unit_box">
											{{ viewModel.data.spt_hdch_hold_4_4 }}
											<span >명</span>
										</div>
									</td>
								</tr>
							</tbody>
						</table>
					</div>
					<div style="margin-top: 10px;">
						<h3>기술자 보유 현황 - &nbsp;<strong>작업반장</strong>&nbsp;보유 인원수</h3>
						<!-- <div class="message info">
							<h3><svg class="icon"><use xlink:href="/img/symbol-defs.svg#icon-info-circle"></use></svg>주의</h3>
							<div class="ol_counter">
								<ol>
									<li><span></span>기술인협회 경력확인서</li>
									<li><span></span>4대 보험가입자 명부</li>
									<li><span></span>현재 GS네오텍 공사중인 경우 각 현장 개인별 건강보험 득실 확인서 사본 첨부</li>
								</ol>
							</div>
						</div> -->
						<table class="table write">
							<caption>기술자 보유현황-현장소장 보유 인원수</caption>
							<thead>
								<tr>
									<th scope="col" class="w245">경력\근속</th>
									<th scope="col" class="w245">10년 이상</th>
									<th scope="col" class="w245">5년 ~ 10년</th>
									<th scope="col" class="w245">1년 ~ 5년</th>
									<th scope="col" class="w245">1년 미만</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td>10년 이상</td>
									<td>
										<div class="unit_box">
											{{ viewModel.data.job_asdrtor_hold_1_1 }}
											<span >명</span>
										</div>
									</td>
									<td>
										<div class="unit_box">
											{{ viewModel.data.job_asdrtor_hold_1_2 }}
											<span >명</span>
										</div>
									</td>
									<td>
										<div class="unit_box">
											{{ viewModel.data.job_asdrtor_hold_1_3 }}
											<span >명</span>
										</div>
									</td>
									<td>
										<div class="unit_box">
											{{ viewModel.data.job_asdrtor_hold_1_4 }}
											<span >명</span>
										</div>
									</td>
								</tr>
								<tr>
									<td>5년 ~ 10년</td>
									<td>
										<div class="unit_box">
											{{ viewModel.data.job_asdrtor_hold_2_1 }}
											<span >명</span>
										</div>
									</td>
									<td>
										<div class="unit_box">
											{{ viewModel.data.job_asdrtor_hold_2_2 }}
											<span >명</span>
										</div>
									</td>
									<td>
										<div class="unit_box">
											{{ viewModel.data.job_asdrtor_hold_2_3 }}
											<span >명</span>
										</div>
									</td>
									<td>
										<div class="unit_box">
											{{ viewModel.data.job_asdrtor_hold_2_4 }}
											<span >명</span>
										</div>
									</td>
								</tr>
								<tr>
									<td>1년 ~ 5년</td>
									<td>
										<div class="unit_box">
											{{ viewModel.data.job_asdrtor_hold_3_1 }}
											<span >명</span>
										</div>
									</td>
									<td>
										<div class="unit_box">
											{{ viewModel.data.job_asdrtor_hold_3_2 }}
											<span >명</span>
										</div>
									</td>
									<td>
										<div class="unit_box">
											{{ viewModel.data.job_asdrtor_hold_3_3 }}
											<span >명</span>
										</div>
									</td>
									<td>
										<div class="unit_box">
											{{ viewModel.data.job_asdrtor_hold_3_4 }}
											<span >명</span>
										</div>
									</td>
								</tr>
								<tr>
									<td>1년 미만</td>
									<td>
										<div class="unit_box">
											{{ viewModel.data.job_asdrtor_hold_4_1 }}
											<span >명</span>
										</div>
									</td>
									<td>
										<div class="unit_box">
											{{ viewModel.data.job_asdrtor_hold_4_2 }}
											<span >명</span>
										</div>
									</td>
									<td>
										<div class="unit_box">
											{{ viewModel.data.job_asdrtor_hold_4_3 }}
											<span >명</span>
										</div>
									</td>
									<td>
										<div class="unit_box">
											{{ viewModel.data.job_asdrtor_hold_4_4 }}
											<span >명</span>
										</div>
									</td>
								</tr>
							</tbody>
						</table>
					</div>
					<div style="margin-top: 10px;">
						<h3>본사</h3> 
						<table class="table horizontal write">
							<caption>본사</caption>
							<tbody>
								<tr>
									<th scope="col" colspan="4" class="text-center">안전조직 유무</th>
								</tr>
								<tr>
									<th scope="row" class="th2 w400">독립된 안전조직 구성, 안전관련 자격증 소유자 2명 이상</th>
									<td class="bl_dot" style="text-align:center">
										{{ viewModel.data.hdofc_safe_ognz_yn_chc_no == 1 ? '예' : '아니오' }}
									</td>
									<th scope="row" class="th2 w415">독립된 안전조직 구성, 안전관련 자격증 소유자 1명 이상</th>
									<td class="bl_dot" style="text-align:center">
										{{ viewModel.data.hdofc_safe_ognz_yn_chc_no == 2 ? '예' : '아니오' }}
									</td>
								</tr>
								<tr>
									<th scope="row" class="th2">별도 안전 조직이 없으나, 안전관련 자격증 소유자가 안전업무는 겸임</th>
									<td class="bl_dot" style="text-align:center">
										{{ viewModel.data.hdofc_safe_ognz_yn_chc_no == 3 ? '예' : '아니오' }}
									</td>
									<th scope="row" class="th2">별도 안전 조직이 없으나, 안전관련 자격이 없는 인원이 안전업무는 겸임</th>
									<td class="bl_dot" style="text-align:center">
										{{ viewModel.data.hdofc_safe_ognz_yn_chc_no == 4 ? '예' : '아니오' }}
									</td>
								</tr>
								<tr>
									<th scope="row" class="th2">현장 전담 안전관리자 인원수</th>
									<td colspan="3">
										<div class="unit_box w170">
											{{ viewModel.data.hdofc_spt_ecshg_sfmngr_nope }}
											<span >명</span>
										</div>
									</td>
								</tr>
								<tr>
									<th scope="col" colspan="4" class="text-center">본사 안전점검</th>
								</tr>
								<tr>
									<th scope="row" class="th2">최근 1년간 본사주관 현장 안전점검 실적 (총 20회 이상)</th>
									<td style="text-align:center">
										{{ viewModel.data.hdofc_safe_chck_nmtm1_chc_no == 1 ? '예' : '아니오' }}
									</td>
									<th scope="row" class="th2">최근 1년간 본사주관 현장 안전점검 실적 (총 10회 이상)</th>
									<td style="text-align:center">
										{{ viewModel.data.hdofc_safe_chck_nmtm1_chc_no == 2 ? '예' : '아니오' }}
									</td>
								</tr>
								<tr>
									<th scope="row" class="th2">최근 1년간 본사주관 현장 안전점검 실적 (총 5회 이상)</th>
									<td style="text-align:center">
										{{ viewModel.data.hdofc_safe_chck_nmtm1_chc_no == 3 ? '예' : '아니오' }}
									</td>
									<th scope="row" class="th2">최근 1년간 본사주관 현장 안전점검 실적 (총 5회 미만)</th>
									<td style="text-align:center">
										{{ viewModel.data.hdofc_safe_chck_nmtm1_chc_no == 4 ? '예' : '아니오' }}
									</td>
								</tr>
								<tr>
									<th scope="col" colspan="4" class="text-center">기타 본사 안전활동 </th>
								</tr>
								<tr>
									<th scope="row" class="th2">교육</th>
									<td>
										<div class="unit_box">
											<span>{{ viewModel.data.hdofc_safe_act_edu }}</span>
											<span >회</span>
										</div>
									</td>
									<th scope="row" class="th2">임원이상 특별점검</th>
									<td>
										<div class="unit_box">
											<span>{{ viewModel.data.hdofc_safe_act_specl_chck }}</span>
											<span >회</span>
										</div>
									</td>
								</tr>
								<tr>
									<th scope="row" class="th2">기타 지원사항</th>
									<td colspan="3">
										<div class="unit_box w170">
											<span>{{ viewModel.data.hdofc_safe_act_etc_sprt_mttr }}</span>
											<span >회</span>
										</div>
									</td>
								</tr>
								<tr>
									<th scope="col" colspan="4" class="text-center">시공계획
										- (*고위험 작업계획) 수립 <strong>(고위험이란 공사중 사고발생시
										최악의 상황 예상시 사망 또는 중상이상 가능성 있는 작업 )</strong>
									</th>
								</tr>
								<tr>
									<th scope="row" class="th2">기타 지원사항</th>
									<td colspan="3">
										<span>{{ viewModel.data.hdofc_cnstrct_plan }}</span>
									</td>
								</tr>
							</tbody>
						</table>
					</div>
					<div style="margin-top: 10px;">
						<h3>현장 조직</h3> 
						<table class="table horizontal write">
							<caption>현장조직</caption>
							<tbody>
								<tr>
									<th scope="row" rowspan="3" class="w215">현장조직 인적사항</th>
								</tr>
								<tr>
									<th scope="row" class="th2 w165">성명</th>
									<td>{{ viewModel.data.bplc_mngr_nm }}</td>
									<th scope="row" class="th2 w165">경력</th>
									<td>
										<div class="unit_box">
											{{ viewModel.data.bplc_mngr_career }}
											<span>년</span>
										</div>
									</td>
								</tr>
								<tr>
									<th scope="row" class="th2">근속연수</th>
									<td>
										<div class="unit_box">
											{{ viewModel.data.bplc_mngr_cnwk_sdytrn }}
											<span>년</span>
										</div>
									</td>
									<th scope="row" class="th2">위험성평가 실시 경험</th>
									<td class="bl_dot" style="padding:10px;text-align:center">
										{{ viewModel.data.bplc_mngr_risk_evl_act_yn == 'Y' ? '유' : '무' }}
									</td>
								</tr>
								<tr>
									<th scope="row" rowspan="3">안전담당자 인적사항</th>
								</tr>
								<tr>
									<th scope="row" class="th2">성명</th>
									<td>{{ viewModel.data.safe_pic_nm }}</td>
									<th scope="row" class="th2">경력</th>
									<td>
										<div class="unit_box">
											{{ viewModel.data.safe_pic_career }}
											<span>년</span>
										</div>
									</td>
								</tr>
								<tr>
									<th scope="row" class="th2">근속연수</th>
									<td>
										<div class="unit_box">
											{{ viewModel.data.safe_pic_cnwk_sdytrn }}
											<span>년</span>
										</div>
									</td>
									<th scope="row" class="th2">위험성평가 실시 경험</th>
									<td class="bl_dot" style="padding:10px;text-align:center">
										{{ viewModel.data.safe_pic_risk_evl_act_yn == 'Y' ? '유' : '무' }}
									</td>
								</tr>
								<tr>
									<th scope="row" rowspan="3">작업반장 인적사항</th>
								</tr>
								<tr>
									<th scope="row" class="th2">성명</th>
									<td>{{ viewModel.data.wrk_leadr_nm }}</td>
									<th scope="row" class="th2">경력</th>
									<td>
										<div class="unit_box">
											{{ viewModel.data.wrk_leadr_career }}
											<span>년</span>
										</div>
									</td>
								</tr>
								<tr>
									<th scope="row" class="th2">근속연수</th>
									<td>
										<div class="unit_box">
											{{ viewModel.data.wrk_leadr_cnwk_sdytrn }}
											<span>년</span>
										</div>
									</td>
									<th scope="row" class="th2">위험성평가 실시 경험</th>
									<td class="bl_dot" style="padding:10px;text-align:center">
										{{ viewModel.data.wrk_leadr_risk_evl_act_yn == 'Y' ? '유' : '무' }}
									</td>
								</tr>
								<tr>
									<th scope="row">작업 투입 인원</th>
									<th scope="row" class="th2">최대인원수</th>
									<td colspan="3">
										<div class="unit_box w305">
											{{ viewModel.data.wrk_inpt_nmpr }}
											<span>년</span>
										</div>
									</td>
								</tr>
							</tbody>
						</table>
					</div>
					<div style="margin-top: 10px;">
						<h3>첨부파일</h3>
						<table class="table horizontal write">
							<caption>첨부파일</caption>
							<tbody>
								<tr v-if="viewModel.fileList.length > 0" v-for="(file, index) in viewModel.fileList" :key="index">
									<th scope="row" class="w220">{{ file.group_id }}</th>
									<td>
										<div class="upload_file_wrap">
											<a href="javascript:void(0)" title="다운로드" @click="fnFileDown(file)" >{{ file.orgnl_file_nm }}</a>
										</div>
									</td>
								</tr>
							</tbody>
						</table>
					</div>
					<div style="margin-top: 10px;">
						<h3>담당자</h3>
						<table class="table horizontal write">
							<caption>담당자</caption>
							<tbody>
								<tr>
									<th scope="row" class="w120">성명</th>
									<td>{{ viewModel.data.pic_nm }}</td>
									<th scope="row">연락처</th>
									<td colspan="2">{{ viewModel.data.pic_phone }}</td>
									<th scope="row">일자</th>
									<td>
										<div class="datepicker_box">
											{{ viewModel.data.reg_dt }}
										</div>
									</td>
								</tr>
							</tbody>
						</table>
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
				bplc_sn:'',
				sfmng_sn:'',
				popupTitle:'',
				data:{}
			}
		}
	},
	mounted: function () {
		
	},
	methods: {
		fnInit: function(sn) {
			$(".modal_wrap").show();
			let vm = this;
			vm.userInfo = vm.$store.state.global.userInfo;
			vm.viewModel.bplc_sn = sn[0];
			vm.viewModel.sfmng_sn = sn[1];
			vm.fnDetail(sn);
		},
		addComma: function(obj) {
			if(obj != null) obj = obj.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
			return obj;
		},
		fnDetail:function(sn) {
			let vm = this;
			let send = {
				bplc_sn: sn[0],
				sfmng_sn: sn[1]
			};

			Axios.post("/selectCpSftMngInfo.do", send).then(function(response) {
				vm.viewModel.data = response.data.detail;
				vm.viewModel.fileList = response.data.fileList;
			});
		},
		fnFileDown:function(item){
			let vm = this;
			let send = {
                gbn: 'cpSftMng',
				bplc_sn: item.bplc_sn,
				sfmng_sn: vm.viewModel.sfmng_sn,
				file_sn: item.file_sn,
				orgnl_file_nm: item.orgnl_file_nm
			}

			$(".loading").show();
			$("#mask").show();

			Axios.post("/download.do",send,{responseType: "blob",}).then(function(e) {
				const url = window.URL.createObjectURL(new Blob([e.data], { type: e.headers["content-type"] }));
				const link = document.createElement("a");
				link.href = url;
				link.download = item.orgnl_file_nm;
				link.click();
				window.URL.revokeObjectURL(url);
			}).then(function(){
				$(".loading").hide();
				$("#mask").hide();
			});
				
        },
		fnClose :function(event){
			//popup 닫기
			$(event.target).closest('.modal_wrap').hide();
		}
	}
};
</script>
