<template>
		<div id="contents">
			<div class="box">
				<h3>시즌정보</h3>
				<div>
					<table class="table horizontal write">
						<caption>시즌정보</caption>
						<tbody>
							<tr>
								<th scope="row">년도</th>
								<td>
									<input type="text" title="년도" v-model="vm.viewModel.detail.DT_REG">
								</td>
								<th scope="row">쿠폰 시작일</th>
								<td>
									<div class="datepicker_box">
										<input type="text" class="datepicker" title="시즌 시작일" placeholder="날짜 선택" readonly>
									</div>
								</td>
								<th scope="row">쿠폰 종료일</th>
								<td>
									<div class="datepicker_box">
										<input type="text" class="datepicker" title="시즌 종료일" placeholder="날짜 선택" readonly>
									</div>
								</td>
							</tr>
						</tbody>
					</table>
					<table id="couponDetailList" class="table write">
					</table>
					<div id="pager">
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
				viewModel: {
                userInfo: {},
                detail: [],
                codeList: [],
                flagYnCode: [],
                statusCode: [],
                codeTpCode: [],
            },
			}
		},
		fnInit: function () {
            let vm = this;

            vm.viewModel.userInfo = vm.$store.state.global.userInfo;

            let searchCode = ['STATUS', 'FLAG_YN', 'CODE_TP'];

            // common.fnGetBaseCodeJson(searchCode).then(result => {
            //     vm.viewModel.statusCode = result.filter(value => value.code_category_id === 'STATUS');
            //     vm.viewModel.flagYnCode = result.filter(value => value.code_category_id === 'FLAG_YN');
            //     vm.viewModel.codeTpCode = result.filter(value => value.code_category_id === 'CODE_TP');

            // }).catch(error => {
            //     console.error('Error:', error); // 에러 처리
            // });
        },

		fnList: function (id) {
            let vm = this;

            let send = {
                code_category_id : id
            };

            Axios.post("/getCouponDetail.do", send).then (function (rs) {
				vm.viewModel.detail = rs.data;
				//console.log(vm.viewModel.detail);
                // vm.setGrid(rs.data.codeList);

            });

        },
		mounted: function () {
			this.$store.state.global.userInfo;
			this.search();

		},
		methods: {
			search: function () {

				let send = {
					sn: this.$route.query.key,
				};

				Axios.post("/getCouponDetail.do", send).then (function (_paramMap) {
					var vm = this;
					let map = _paramMap
					console.log(map.data.DT_REG);

					// vm.viewModel.detail = map.data;
				});

			},

		},
		setGrid: function (data) {
            let vm = this;



            $("#couponDetailList").jqGrid("GridUnload");

            $("#couponDetailList").jqGrid({
                dataType: 'local',
                data: data,
                colNames: ['번호', '발행처', '권종', '쿠폰값', '쿠폰명', '쿠폰용도', '적용대상'],
                colModel: [
                    {label: 'seq_cp_num', name: 'seq_cp_num', key: true},
                    {label: 'cd_cp_pyot', name: 'cd_cp_pyot'},
                    {label: 'cd_da_dvsn', name: 'cd_da_dvsn'},
                    {label: 'so_cp_val', name: 'so_cp_val'},
                    {label: 'ds_cp_use', name: 'ds_cp_use'},
                    {label: 'ds_soa', name: 'ds_soa'},

                    // {label: 'CODE_CATEGORY_ID', name: 'CODE_CATEGORY_ID', key: true},
                    // {label: 'CODE_CATEGORY_NM', name: 'CODE_CATEGORY_NM'},
                    // {label: 'STATUS', name: 'STATUS'},
                    // {label: 'CODE_CATEGORY_ID_UP', name: 'CODE_CATEGORY_ID_UP'},
                    // {label: 'MAPPING_YN', name: 'MAPPING_YN'},
                    // {label: 'USER_NM', name: 'USER_NM'},
                    // {label: 'REG_DT', name: 'REG_DT', formatter(cellValue) {
                    //     return vm.formatDate(cellValue);
                    // }},
                ],
                rowNum: 10,
                pager: '#pager',
                viewrecords: true,
                height: 'auto',
                shrinkToFit: true,
                autowidth: true,
                sortable: true,
                sortname: 'seq_cp_num',
                sortorder: 'asc'
                // onSelectRow: function (id) {
                //     // 선택된 행 데이터 가져오기
                //     var rowData = $("#codeDetailList").jqGrid('getRowData', id);

                //     // 예외 처리
                //     if (!rowData || !rowData.CODE_CATEGORY_ID) {
                //         console.error('선택된 행의 데이터가 유효하지 않습니다.');
                //         return;
                //     }

                //     var firstData = rowData.CODE_CATEGORY_ID;

                //     // Vue Router로 페이지 이동
                //     vm.$router.push({ name: 'codedetail', params: { id: firstData } });
                // }
            });
            $("#couponDetailList").setGridWidth($(".grid-container").width() - 1);
		}
	}
	</script>
