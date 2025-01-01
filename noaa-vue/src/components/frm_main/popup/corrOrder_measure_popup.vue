<template>
	<modal :pass="{widthObject: 600, popupTitle:'시정명령조치 조치내용 등록'}">
		<template v-slot:contents>
			<p class="table-title">시정명령조치 정보</p>
			<table class="mt10">
				<caption>시정명령조치 정보</caption>
				<tbody>
					<tr>
						<th scope="row" class="w120">분류</th>
						<td>{{ viewModel.item.cat1 }}</td>
					</tr>
					<tr>
						<th scope="row">기관</th>
						<td>{{ viewModel.item.cat2 }}</td>
					</tr>
					<tr>
						<th scope="row">시정명령일</th>
						<td>{{ viewModel.item.comply_date }}</td>
					</tr>
					<tr>
						<th scope="row">시정명령 내용</th>
						<td>{{ viewModel.item.contents1 }}</td>
					</tr>
					<tr>
						<th scope="row">조치부서</th>
						<td>{{ viewModel.item.dept }}</td>
					</tr>
				</tbody>
			</table>

			<p class="table-title mt20">조치내용 등록</p>
			<table class="mt10">
				<tbody>
					<tr>
						<th scope="row">조치담당자</th>
						<td class="tl">{{viewModel.item.owner}}</td>
					</tr>
					<tr>
						<th scope="row" class="w150"><label for="aip_measure_date">조치예정일</label></th>
						<td class="tl" style="padding: 10px 5px 5px;">
							<div class="datepicker_box w200">
								<input type="text" id="aip_measure_date" class="datepicker" readonly>
							</div>
						</td>
					</tr>
					<tr>
						<th><label for="aip_measure_measure_result">조치내용 등록</label></th>
						<td class="tl" style="padding:4px;">
							<textarea id="aip_measure_measure_result" class="full" style="resize:vertical;height:150px;" v-model="viewModel.item.contents2"></textarea>
						</td>
					</tr>
				</tbody>
			</table>

			<p class="table-title mt20">첨부</p>
			<table class="mt10">
				<tbody>
					<tr>
						<td>
							<fileform @filelist="fnFilelist" :pass="{id:'aip'}" ref="files"></fileform>
						</td>
					</tr>
				</tbody>
			</table>
			
			<div class="buttonbox">
				<input type="submit" value="저장" class="btn btn-save btn-primary" @click="fnUpdateContents">
				<a href="javascript:btn_formbox_close();" class="btn btn-cancel">취소</a>
			</div>
		</template>
	</modal>
</template>
<style>
.mobile .w150 {width: 150px !important;}
</style>
<script>
import Axios from 'axios';
import Vue from 'vue'
import Modal from './modal.vue'
import Fileform from '../fileform.vue';
import Message, {messageUtil} from "../../../common/message";
import formValidation from "../../../common/fromValidation";

export default {
	components: {
		Modal,
		'fileform': Fileform
	},
	data: function () {
		return {
			viewModel:{
				item: {},
				user: {},
				list:[],
				filelist: [],
                fileGroup: '',
			},
		}
	},
	mounted: function () {
		this.viewModel.user = this.$store.state.global.userInfo;
	},
	methods: {
		fnInit: function(uid) {
			Modal.methods.fnInit();
			load_datepicker();
			this.fnDetail(uid);
		},
		fnDetail: function(uid){
			let vm = this;

			let send = {
				mapperId:'check.selectCorrOrderWriteList',
				uid:uid
			}
			Axios.post("/list",send).then(function(res) {
				//list
				vm.viewModel.item = res.data.list[0];
			}).then(function(){
				if(vm.viewModel.item.measure_date != undefined){
					$('#aip_measure_date').val(vm.viewModel.item.measure_date);
				}
				if(vm.viewModel.item.measure_file_grp_id != undefined) {
					vm.$refs.files.fnFileLoad(vm.viewModel.item.measure_file_grp_id);
				}
			});
		},
		fnFilelist: function(vm) {
			this.viewModel.filelist = vm.filelist;
			this.viewModel.fileGroup = vm.fileGroup;
		},
		fnUpdateContents: function() {
			let vm = this;
			let message;
			let senddata = {
				mapperId : 'check.updateCorrOrderMeaserInfo',
				measure_date: $('#aip_measure_date').val(),
				contents2: vm.viewModel.item.contents2,
				attach_file_result: (vm.viewModel.fileGroup == '') ? null : vm.viewModel.fileGroup,
				uid: vm.viewModel.item.uid
			};

			const valiData = [
                {id: 'aip_measure_date', type: 'input', title: '조치예정일'},
                {id: 'aip_measure_measure_result', type: 'input', title: '조치내용'},
            ];
			if(formValidation(valiData) && confirm(Message.CREATE_CONFIRM)) {
				Axios.post("/update", senddata).then(function(response) {
					if(vm.viewModel.fileGroup!='') {
						vm.$refs.files.fnInsertFile()
					}
					vm.$parent.fnselectcorrOrder();
					btn_formbox_close();
				});
            } else {
                if(message) alert(message);
            }
        },
	}
};
</script>
