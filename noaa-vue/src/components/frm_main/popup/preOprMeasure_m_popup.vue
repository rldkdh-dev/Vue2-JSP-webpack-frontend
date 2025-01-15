<template>
	<modal :pass="{widthObject: 500, popupTitle:'가동전 점검 조치담당자 선택'}">
		<template v-slot:contents>
			<p class="table-title">가동전 점검 정보</p>
			<div class="section-view">
				<table>
					<caption>가동전 점검1 정보</caption>
					<tbody>
						<tr>
							<th scope="row" class="w150">사업장명</th>
							<td>{{viewModel.list.bs_title}}</td>
						</tr>
						<tr>
							<th scope="row">부서명</th>
							<td>{{viewModel.list.sdept_name}}</td>
						</tr>
						<tr>
							<th scope="row">가동전점검명</th>
							<td>{{viewModel.list.bs_title}}</td>
						</tr>
						<tr>
							<th scope="row">가동중지 설비명</th>
							<td>{{viewModel.list.eqname}}</td>
						</tr>
						<tr>
							<th scope="row">가동중지 기간</th>
							<td>{{viewModel.list.sdt}} ~ {{ viewModel.list.edt }}</td>
						</tr>
						<tr>
							<th scope="row">가동전점검 일자</th>
							<td>{{viewModel.list.check_date}}</td>
						</tr>
						<tr>
							<th scope="row">가동전 점검팀</th>
							<td>{{viewModel.list.contents1}}</td>
						</tr>
						<tr>
							<th scope="row">조치부서</th>
							<td>{{viewModel.list.measure_dept_name}}</td>
						</tr>
					</tbody>
				</table>
                <p class="table-title mt20">조치담장자 선택</p>
                    <table class="mt10">
                        <tbody>
                            <tr>
                                <th scope="row"><label for="impr_member">조치담당자</label></th>
                                <td>
                                    <select id="impr_member" v-model="viewModel.list.measure_memberuid">
                                        <option v-for="item in viewModel.impr_member_list" :key="item" :value="item.uid">{{item.user_job}} {{item.user_name}}</option>
                                    </select>
                                </td>
                            </tr>
                        </tbody>
                    </table>
				<div class="buttonbox">
					<input type="submit" value="저장" class="btn btn-save btn-primary" @click="fnUpdate">
					<a href="javascript:void(0);" class="btn btn-cancel" onclick="btn_formbox_close();">취소</a>
				</div>
			</div>
		</template>
	</modal>
</template>
<script>
import Axios from 'axios';
import Vue from 'vue'
import Modal from './modal.vue'
import Message, {messageUtil} from "../../../common/message";
import formValidation from "../../../common/fromValidation";

export default {
	components: {
		Modal
	},
	data: function () {
		return {
			viewModel:{
				list:[],
				impr_member_list:[],
			},
		}
	},
	mounted: function () {
		console.log('preOprMeaure_m_popup');
	},
	methods: {
		fnInit: function(id) {
			Modal.methods.fnInit();
			// this.viewModel.item = item;
			//if(item.measure_memberuid==undefined) this.viewModel.item.measure_memberuid = '';
			this.fnSetContents(id);
			this.fnselectmeasureManager();
		},
		fnSetContents: function(id) {
			let vm = this;
			let senddata = {
				mapperId : 'psm.selectpreOprMeasureListdetail',
				uid: id,
				// dept: vm.measure_dept_uid
			};
			Axios.post("/detail", senddata).then(function(rs) {
				vm.viewModel.list = rs.data[0];
			});
        },
		fnselectmeasureManager:function(){
            let vm = this;
			let send = {
				mapperId:'psm.selectmeasureList',
			}
            Axios.post("/list",send).then(function(res) {
				//list
				vm.viewModel.impr_member_list = res.data.list;
			});
        },
		fnUpdate: function() {
			let vm = this;
			let data = {
				mapperId : 'psm.updatepreOprMeasurepopupInfo2',
				measure_memberuid: vm.viewModel.list.measure_memberuid,
				uid: vm.viewModel.list.uid,
			};
			Axios.post("/adminupdate",data)
			alert("수정 되었습니다.");
			$('.overlay_mask, .overlay_formbox').hide();
            $('body').removeClass("fix");
			window.location.href="/psm/preOprMeasure"
			
    	},
		fnCancel: function() {
			this.$parent.popup = {};
			this.$parent.fnList()
		}
	}
};
</script>
