<template>
	<modal :pass="{widthObject: 500, popupTitle:'시정명령조치 조치담당자 선택'}">
		<template v-slot:contents>
			<p class="table-title">시정명령조치 정보</p>
			<div class="section-view">
				<table>
					<caption>시정명령조치 정보</caption>
					<tbody>
						<tr>
							<th scope="row" class="w120">분류</th>
							<td>{{ data.cat1 }}</td>
						</tr>
						<tr>
							<th scope="row">기관</th>
							<td>{{ data.cat2 }}</td>
						</tr>
						<tr>
							<th scope="row">시정명령일</th>
							<td>{{ data.comply_date }}</td>
						</tr>
						<tr>
							<th scope="row">시정명령 내용</th>
							<td>{{ data.contents1 }}</td>
						</tr>
						<tr>
							<th scope="row">조치부서</th>
							<td>{{ data.dept }}</td>
						</tr>
						<tr>
							<th scope="row">조치담당자</th>
							<td>
								<select id="impr_member" v-model="data.measure_memberuid">
									<option value="" selected>없음</option>
									<option v-for="item in userList" :key="item.uid" :value="item.uid">{{item.job_name}} {{item.user_name}}</option>
								</select>
							</td>
						</tr>
					</tbody>
				</table>
				<div class="buttonbox">
					<div class="fr">
						<input type="submit" value="저장" class="btn btn-save btn-primary" @click="fnSave();">
						<a href="javascript:btn_formbox_close();" class="btn btn-cancel">취소</a>
					</div>
				</div>
			</div>
		</template>
	</modal>
</template>
<script>
import Axios from 'axios';
import Vue from 'vue'
import Common from '../../common.js';
import Pager from '../../paging.vue'
import Modal from './modal.vue'
import Percent from '../../../common/percent.vue'

export default {
	components: {
		Pager, Modal, Percent
	},
	data: function () {
		return {
			data:{},
			userList: [],
		}
	},
	mounted: function () {
	},
	methods: {
		fnInit: function(uid) {
			Modal.methods.fnInit();
			this.fnDetail(uid);
		},
		fnDetail:function(uid){
            let vm = this;

            let send = {
                mapperId:'check.selectCorrOrderWriteList',
                uid:uid
            }
            // console.log(vm.$refs);
            Axios.post("/list",send).then(function(res) {
                //list
                vm.data = res.data.list[0];

				//조치담당자 비어있다면 없음으로 표시되도록 처리
				if(vm.data.measure_memberuid == undefined){
					vm.data.measure_memberuid = ''	
				}
            }).then(function(){ 
				//해당 부서인 사용자 가져오기
				// let vm = this;
				let data = {
					mapperId: 'comm.selectUserList',   
					dept: (vm.data.measure_dept_uid == '') ? null : vm.data.measure_dept_uid,
				};
				Axios.post("/list",data).then(function(rs) {
					vm.userList = rs.data.list;
				});
			});
        },
		fnSave: function(){
			let vm = this;
			//조치담당자 수정
			let data = {
				mapperId:'check.updateCorrOrderMeaserMem',
				measure_memberuid : (vm.data.measure_memberuid == '') ? null : vm.data.measure_memberuid,
				uid : vm.data.uid
			}
			Axios.post("/update", data).then(function(response) {		
				if(response.data == 1){
					vm.$parent.fnselectcorrOrder();
					btn_formbox_close();
				}else{
				}	
			}).catch(function(ex) {
				console.log("error"+ex);
			});	
		},
	}
};
</script>
