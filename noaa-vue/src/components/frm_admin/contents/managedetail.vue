<template>
	<div id="managedetail">
		<div class="contents">
			<div class="box">
				<h3>쿠폰 발급관리 상세</h3>
				<div>
					<table class="table horizontal write">
						<!-- <caption>시즌정보</caption> -->
						<tbody>
							<tr>
								<th scope="row" readonly>번호</th>
								<td>
									<input type="text" title="번호" readonly v-model="viewModel.list.SEQ_CP_NUM">
								</td>
							</tr>
							<tr>
								<th scope="row" >발급방법</th>
								<td>
									<input type="text" title="발급방법" readonly v-model="viewModel.list.SEQ_CP_NUM">
								</td>

								<th scope="row" >발급수량</th>
								<td>
									<input type="text" title="발급수량" readonly v-model="viewModel.list.SEQ_CP_NUM">
								</td>
							</tr>
							<tr>
								<th scope="row" >발급구분</th>
									<td>
										<div class="datepicker_box">
											<input type="text" class="datepicker" title="발급구분" placeholder="" >
										</div>
									</td>
								<th scope="row">발급수량</th>
								<td>
									<div class="datepicker_box">
										<input type="text" class="datepicker" title="발급수량" placeholder="" >
									</div>
								</td>
							</tr>
							<tr>
								<th scope="row" >발급기준</th>
									<td>
										<div class="datepicker_box">
											<input type="text" class="datepicker" title="발급기준" placeholder="" >
										</div>
									</td>
								<th scope="row">발급쿠폰</th>
								<td>
									<div class="datepicker_box">
										<input type="text" class="datepicker" title="발급쿠폰" placeholder="" >
									</div>
								</td>
							</tr>
							<tr>
								<th scope="row" >출석시작일자</th>
									<td>
										<div class="datepicker_box">
											<input type="text" class="datepicker" title="출석시작일자" placeholder="" >
										</div>
									</td>
								<th scope="row">출석종료일자</th>
								<td>
									<div class="datepicker_box">
										<input type="text" class="datepicker" title="출석종료일자" placeholder="" >
									</div>
								</td>
							</tr>
							<tr>
								<th scope="row" >회원구분</th>
									<td>
										<div class="datepicker_box">
											<input type="text" class="datepicker" title="회원구분" placeholder="" >
										</div>
									</td>
								<th scope="row">회원등급</th>
								<td>
									<div class="datepicker_box">
										<input type="text" class="datepicker" title="회원등급" placeholder="" >
									</div>
								</td>
							</tr>
							<tr>
								<th scope="row" >상태</th>
									<td>
										<div class="datepicker_box">
											<input type="text" class="datepicker" title="출석시작일자" placeholder="" >
										</div>
									</td>							
							</tr>
							<tr>
								<th scope="row" >등록자</th>
									<td>
										<div class="datepicker_box">
											<input type="text" class="datepicker" title="회원구분" placeholder="" >
										</div>
									</td>
								<th scope="row">등록일자</th>
								<td>
									<div class="datepicker_box">
										<input type="text" class="datepicker" title="회원등급" placeholder="" >
									</div>
								</td>
							</tr>
							<tr>
								<th scope="row" >회원구분</th>
									<td>
										<div class="datepicker_box">
											<input type="text" class="datepicker" title="회원구분" placeholder="" >
										</div>
									</td>
								<th scope="row">수정자</th>
								<td>
									<div class="datepicker_box">
										<input type="text" class="datepicker" title="수정일자" placeholder="" >
									</div>
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		</div>
	</div>
	</template>
	
	<script>
	import 'es6-promise/auto'
	import Vue from 'vue'
	import Axios from 'axios'
	import Xlsx from 'xlsx'
	import pager from "../../../common/vue/admin_paging.vue";
	import couponwrite from '../../../components/frm_admin/contents/couponwrite.vue';
	import Message, {messageUtil} from "../../../common/js/message";
	import excelform from "../../frm_main/excelform.vue";
	import printJS from 'print-js'
	
	Vue.component("pager", pager);
	Vue.config.devtools = true;
	
	export default {
		components: {
			pager,
			'excelform': excelform,
		},
		data: function () {
			return {
				pop:false,
				printPop:false,
				excelDownload: [],
				select: "0",
				category: 'user_name',
				viewModel: {
					userInfo: {},
					serachList: {
						text: "",
						select_cat: "",
					},
					list: [],
					bplc_sn: "",
					assistant_manager: [],
					ownerlist: [],
					authlist: [],
					auth_uid: "",
					user_auth_click: false,
					name: "",
					pager: {
						model: {},
						pageNo: 1,
						totalSize: 0,
						rowSize: 5,
						blockSize: 5,
						list: [],
						callBack: function (n) {
							this.model.fnGetSelectList(n);
						}
					},
				}
			}
		},
		mounted: function () {
			let vm = this;
			vm.viewModel.userInfo = vm.$store.state.global.userInfo;
			vm.$router.afterEach((to, from) => {
				vm.fnInit(vm.viewModel.pager.pageNo);
			});
	
			vm.fnInit();
		},
		methods: {
			fnInit: function(){
				let vm = this;
				let sn = vm.$router.params.sn;
	
				console.log(sn)
				vm.fnList(sn);
			},
			fnList: function (sn) {
				let vm = this.resultList
	
				let send = {
					sn: vm.$route.query.key
				};
	
				Axios.post("/getCouponDetail.do", send).then (function (rs) {
					vm.viewModel.list = rs.data.list;
					console.log(rs.data.list)
	
				});
	
			},
	
		}
	}
	</script>
	