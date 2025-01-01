<template>
	<modal :pass="{widthObject: 850, popupTitle:'안전보건 예산 실적'}">
		<template v-slot:contents>
			<p class="table-title">안전보건 예산 정보</p>
			<table class="mt10">
				<caption>안전보건 예산 정보</caption>
				<tbody>
					<tr>
						<th scope="row" style="width:120px;">년도</th>
						<td class="tl">{{viewModel.item.year}}</td>
					</tr>
					<tr>
						<th scope="row">사업장</th>
						<td class="tl">{{viewModel.item.group_name}}</td>
					</tr>
					<tr>
						<th scope="row">부서명</th>
						<td class="tl">{{viewModel.item.dept_name}}</td>
					</tr>
					<tr>
						<th scope="row">대분류</th>
						<td class="tl">{{viewModel.item.cd_name}}</td>
					</tr>
					<tr>
						<th scope="row">소분류</th>
						<td class="tl">{{viewModel.item.cat2}}</td>
					</tr>
					<tr>
						<th scope="row">편성예산</th>
						<td class="tl">{{viewModel.item.price|moneyFilter}} 원</td>
					</tr>
					<tr>
						<th scope="row">예산실적 담당자</th>
						<td class="tl">{{viewModel.item.group_name}} {{viewModel.item.dept_name}} {{viewModel.item.mng_member}}</td>
					</tr>
					<tr>
						<th scope="row">상세내용</th>
						<td class="tl pre">{{viewModel.item.contents}}</td>
					</tr>
				</tbody>
			</table>
			<p class="table-title mt20">실적 정보 등록</p>
			<table class="mt10" id="pop_sub_list">
				<caption>실적 정보 등록</caption>
				<thead>
					<tr>
						<th scope="col" class="w110">날짜</th>
						<th scope="col" class="w200">품의번호</th>
						<th scope="col">상세내역</th>
						<th scope="col" class="w150">집행금액(원)</th>
						<th scope="col" v-if="mode==''">관리</th>
					</tr>
				</thead>
				<tbody v-if="mode==''">
					<tr v-for="(item, i) in viewModel.list" :key="i">
						<td>
							<div class="datepicker_box full">
								<input type="text" :id="'sub_date'+i" title="달력" class="datepicker w100" readonly>
							</div>
						</td>
						<td><input type="text" title="품의번호" class="full" v-model="item.sub_docno"></td>
						<td><input type="text" title="상세내역" class="w250" v-model="item.sub_contents"></td>
						<td>
							<div class="unit_wrap"><span>원</span>
								<input type="number" title="집행금액" class="w120 tr" v-model="item.sub_price" :value="(String(item.sub_price).charAt(0)=='0' && String(item.sub_price).length > 1) ? item.sub_price = String(item.sub_price).substr(1) : item.sub_price" @input="fnCheck(i)">
							</div>
						</td>
						<td class="w85">
							<button type="button" class="btn btn-icon only btn-secondary2" @click="fnAdd()"><span class="mi">add</span></button>
							<button type="button" class="btn btn-icon only btn-danger2" @click="fnDelete(i)"><span class="mi">close</span></button>
						</td>
					</tr>
				</tbody>
				<tbody v-else>
					<template v-if="viewModel.list[0].seq == undefined">
						<tr v-for="(item, i) in viewModel.list" :key="i">
							<td class="tc"><span>{{item.sub_date}}</span></td>
							<td class="tc"><span>{{item.sub_docno}}</span></td>
							<td><span>{{item.sub_contents}}</span></td>
							<td class="tr"><span>{{item.sub_price|moneyFilter}} 원</span></td>
						</tr>
					</template>
					<template v-else>
						<tr><td colspan="4" class="tc">데이터가 없습니다.</td></tr>
					</template>
				</tbody>
			</table>

			<p class="table-title mt20">첨부</p>
			<table class="mt10">
				<caption>첨부</caption>
				<tbody v-if="mode==''">
					<tr>
						<td colspan="4">
							<fileform @filelist="fnFilelist" :pass="{id:'bga'}" ref="files"></fileform>
						</td>
					</tr>
				</tbody>
				<template v-else>
					<thead>
						<tr>
							<th scope="col">제목</th>
							<th scope="col" class="w80">용량</th>
							<th scope="col" class="w105">등록날짜</th>
							<th scope="col" class="w80">다운로드</th>
						</tr>
					</thead>
					<tbody>
						<template v-if="viewModel.filelist.length > 0">
							<tr v-for="(item, i) in viewModel.filelist" :key="i">
								<td>{{item.file_title}}</td>
								<td class="tr">{{item.file_size}}</td>
								<td>{{item.create_date|yyyyMMdd}}</td>
								<td class="tc">
									<a href="" class="btn btn-icon btn-info2" @click.prevent="fnDownload(item.file_seq)" style="padding: 4px 2px 0px 2px;line-height: 17px;height: auto;margin-top: -4px;margin-bottom: 0px;"><span class="mi">file_download</span></a>
								</td>
							</tr>
						</template>
						<template v-else>
							<tr><td colspan="4" class="tc">데이터가 없습니다.</td></tr>
						</template>	
					</tbody>
				</template>
			</table>
			<div class="buttonbox" v-show="mode == ''">
				<input type="submit" value="저장" class="btn btn-save btn-primary" @click="fnBudgetUpdate" />
				<input type="button" value="취소" class="btn btn-icon btn-cancel" onclick="btn_formbox_close()">
			</div>
		</template>
	</modal>
</template>
<script>
import "es6-promise/auto";
import Axios from 'axios';
import Vue from 'vue'
import Common from '../../common.js';
import Pager from '../../paging.vue'
import Modal from './modal.vue'
import Fileform from '../fileform.vue';
import Message, {messageUtil} from "../../../common/message";
import formValidation from "../../../common/fromValidation";

export default {
	components: {
		Pager, Modal, Fileform
	},
	data: function () {
		return {
			mode: '',
			viewModel:{
				item: {},
				list: [{seq: 0},],
				filelist: [],
				fileGroup: ''
			},
		}
	},
	mounted: function () {
		console.log('budget-popup')
	},
	methods: {
		fnCheck: function(i) {
			if (String(this.viewModel.list[i].sub_price).length > 16) {
				alert("금액이 너무 큽니다.");
				this.viewModel.list[i].sub_price=0
			}
		},
		fnInit: function(id, mode) {
			Modal.methods.fnInit();
			(mode==undefined) ? this.mode ='' : this.mode = mode;
			$(document).on('focus', '.datepicker', function() {
				$(this).datepicker({ dateFormat: "yy-mm-dd" });
			})
			this.fnSetContents(id);
		},
		fnSetContents: function(id){
			let vt = this;  
			let vm = this.viewModel;  
			let data = {
				mapperId: 'plan.budgetAnnList',
				pageNo: 0,
				uid: id,
			};
			Axios.post("/list", data).then(function(rs) {
				vm.item = rs.data.list[0];
				let file = rs.data.list[0].attach_file;
				if(vt.mode=='') {
					vt.$refs.files.fnFileLoad(file);
				} else {
					if(file != undefined) {
						vt.fnFileLoad(file);
					} else {
						vm.filelist.length = 0;
						vm.fileGroup = ''
					}
				}
				vt.fnSetdata(rs.data.list[0].uid)
			});
		},
		fnSetdata: function(id){
			let vt = this;  
			let vm = this.viewModel;  
			let data = {
				mapperId: 'plan.budgetAnnDataList',
				pb_uid: id,
			};
			Axios.post("/list", data).then(function(rs) {
				vm.list = rs.data.list;
				vt.$nextTick(function() {
					if(rs.data.list.length != 0) {
						for(let i=0; i<rs.data.list.length; i++) {
							$('#sub_date'+i).val(rs.data.list[i].sub_date)
						}
					} else {
						$('.datepicker').val('')
					}
				})
				if(rs.data.list.length == 0) {
					vm.list = [{seq: 0},]
				}
			});
			for(let i=0; i<vm.list.length; i++) {
				$('#sub_date'+i).val(vm.list[i].sub_date)
			}
		},
		fnAdd: function() {
            this.viewModel.list.push({seq: this.viewModel.list.length});
        },
        fnDelete: function(index) {
            let vm = this.viewModel;
			if(confirm('삭제하시겠습니까?')) {
				if(vm.list.length > 1) {
					vm.list.splice(index, 1);
					for(let i=0; i<vm.list.length; i++){
						vm.list[i].seq = i;
					}
				} else {
					vm.list = [{seq: 0},]
				}
			}
        },
		fnBudgetUpdate: function() {
			let vt = this;
    		let vm = this.viewModel;
            let message;
    		let senddata = {
                uid: vm.item.uid,
                attach_file: (vm.fileGroup == '') ? null : vm.fileGroup,
    		};
            if(confirm(Message.CREATE_CONFIRM)) {
				senddata.mapperId= 'plan.updateBudgetAnnFile';
                Axios.post("/update", senddata).then(function(rs) {
					console.log(rs.data)
					if(vm.fileGroup!='') {
						vt.$refs.files.fnInsertFile()
					}
					vt.fnBudgetDataUpdate();
					alert('입력완료');
				});
            } else {
                if(message) alert(message);
            }
		},
		fnBudgetDataUpdate: function() {
			let vt = this;
			let vm = this.viewModel;
			let data = {
				mapperId: 'plan.deleteBudgetAnnData',
				pb_uid: vm.item.uid
    		};
			Axios.post("/delete", data).then(function(rs) {
				console.log(rs.data)
				console.log('삭제')
				let senddata = {
					mapperId: 'plan.insertBudgetAnnData',
					pb_uid: vm.item.uid,
					memberuid: vt.$parent.viewModel.user.user_num,
					itemList: vm.list,
				};
				for(let i=0; i<vm.list.length; i++) {
					senddata.itemList[i].sub_date = $('#sub_date'+i).val()
				}
				console.log(senddata)
				Axios.post("/insert", senddata).then(function(rs) {
					console.log(rs.data)
					console.log('등록')
					btn_formbox_close();
					vt.$parent.fnList(0)
				});
			});
        },
		fnFilelist: function(vm) {
			this.viewModel.filelist = vm.filelist;
			this.viewModel.fileGroup = vm.fileGroup;
		},
		fnFileLoad: function(groupid) {
            let vt = this;
            let vm = this.viewModel;

            Axios.post("/filelist", {groupid: groupid}).then(function(rs) {
                let filelist = rs.data.filelist;
                if(filelist.length>0) {
                    vm.filelist = filelist;
                    vm.fileGroup = rs.data.file_grp_id;
                    for(let i=0; i<rs.data.filelist.length; i++) {
                        vm.filelist[i].seq = i;
                    }
                }
            });
        },
		fnDownload : function(item){
			Common.fnOnFileDownload(item)
		},
	}
};
</script>
