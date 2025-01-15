

<template>
	<div>
		<div class="contents">
			<div class="box">
				<h3>쿠폰 발급 관리</h3>
				<div>
					<div class="table_top">
						<div class="total_count">전체 <em id="total_cnt">0</em>건</div>
						<div class="table_service">
							<router-link to="/write" class="btn btn-darkblue">등록</router-link>
						</div>
					</div>
					<table class="table" id="couponManageList">
					</table>
					<div id="pager"></div>
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
	
	
			vm.fnList();
		},
		methods: {
			fnList: function () {
				let vm = this;
	
				let senddata = {//페이징쿼리는 필요없음.JQGRID 사용....
					user_role: vm.$store.state.global.userInfo,
					nm_cp: vm.$store.state.global.userInfo,
					cd_cp_status: vm.viewModel.cd_cp_status,
					cd_cp_pyot: vm.viewModel.cd_cp_pyot
					
				};
				console.log(senddata);
	
	
				Axios.post("/getCouponManageList.do", senddata).then (function (rs) {
					vm.viewModel.list = rs.data.list;
					$("#total_cnt").text(rs.data.totalCNT);
					vm.setGrid();
				});
	
			},
			setGrid: function () {
				let vm = this;
	
				let colMod = [
					{name: 'SEQ_CP_NUM', index: 'SEQ_CP_NUM'},
					{name: 'CD_CP_PYOT', index: 'CD_CP_PYOT'},
					{name: 'NM_CP', index: 'NM_CP'},
					{name: 'NM_CP_DVSN', index: 'NM_CP_DVSN'},
					{name: 'DT_REG', index: 'DT_REG'},
					{name: 'NM_CP_STATUS', index: 'NM_CP_STATUS'},
					{name: 'ID_REG_USER', index: 'ID_REG_USER'},
					{name: 'DT_REG', index: 'DT_REG'}
				];
				
				$("#couponManageList").jqGrid({
					dataType : 'local',
					data : vm.viewModel.list,
					colNames : ['번호', '구분', '회차','기준','발급쿠폰','회원구분','회원등급','발급일자','상태','등록자','등록일자'],
					colModel : colMod,
					rowNum : vm.viewModel.pager.rowSize,
					pager : '#pager',
					sortname : 'seq_cp_num',
					viewrecords: true,
					sortable: true,
					sortorder : 'DESC',
					height : 'auto',
					autowidth: true,
					shrinkToFit: true,
					onSelectRow: function (id) {
						var rowData = $('#couponManageList').getRowData(id);
						vm.$router.push({path: '/detail/'+rowData.seqCpNum, name: 'getCouponManageDetail', params : {sn : rowData.SEQ_CP_NUM}});
					}
				})
				
			},
			fnGetString: function (code) {
				let str = "";
				switch (code) {
					case "DIAMOND":
						str = "_17";
						break;
					case "PLATINUM":
						str = "_16"
						break;
					case "BRONZE":
						str = "_15"
						break;
					case "SILVER":
						str = "_14"
						break;
					case "GOLD":
						str = "_13"
						break;
					case "VIP":
						str = "_12"
						break;
					case "VVIP":
						str = "_11"
						break;
					case "FREE":
						str = "_99"
						break;
					default:
						break;
				}
	
				return str;
			},
			fnGroupString: function (code) {
				let str = "";
				switch (code) {
					case "A":
						str = "일반";
						break;
					case "B":
						str = "블루";
						break;
					case "C":
						str = "블루패밀리 개인";
						break;
					case "D":
						str = "블루패밀리 기업";
						break;
					default:
						str = "일반";
						break;
				}
				return str;
			}
	
		}
	}
	</script>