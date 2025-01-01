<template>
	<modal :pass="{popupTitle: '노사 합동점검'}">
		<template v-slot:contents>
			<div  v-for="(item, i) in viewModel.chckList" :key="i">
				<div class="mb10">
					<h3>점검/조치사항 {{ i+1 }}</h3>
					<table class="table horizontal write" >
						<tbody>
							<tr>
								<th scope="row" class="w170">점검항목</th>
								<td>{{ item[0].chck_mttr }}</td>
							</tr>
							<tr>
								<th scope="row">점검일자</th>
								<td>{{ (item[0].chck_dt).substring(0,10) }}</td>
							</tr>
						</tbody>
					</table>
				</div>
				<div>
					<!-- <h3>점검/조치사항</h3> -->
					<table class="table horizontal write" >
						<tbody  v-for="(item, j) in viewModel.chckList[i]" :key="j" :id="'tbody'+ j">
							<tr>
								<th scope="row" :rowspan="item.chck_rslt == 'I' ? 9 : 4" class="text-center w50">
									{{ j+1 }}
								</th>
								<th scope="row" class="w120"><label for="">점검결과</label></th>
								<td>
									{{ item.chck_rslt_nm }}
								</td> 
							</tr>
							<tr>
								<th scope="row"><label for="">현장팀명</label></th>
								<td>
									{{ item.bplc_team }}
								</td> 
							</tr>
							<tr>
								<th scope="row"><label for="">사진</label></th>
								<td>
									<imgsfileform :ref="'imgsfileform'" :pass="{id:'chckRslt'+i+j, index:j, gbn:'chckRslt', mode:'view'}" @filelist="fnImgFileList" @fileDelete="fnImgFileDelete"></imgsfileform>
								</td>
							</tr>
							<tr>
								<th scope="row"><label for="">점검내용</label></th>
								<td><textarea title="점검내용" id="chck_cn" v-model="item.chck_cn" style="border: none; background-color: white;" disabled ></textarea></td> 
							</tr>
							<tr v-if="item.chck_rslt == 'I'">
								<th scope="row" class=""><label for="">지적/요청사항</label></th>
								<td>
									<textarea id="actn_mttr" title="지적/요청사항" v-model="item.actn_mttr" style="border: none; background-color: white;" disabled></textarea>
								</td>
							</tr>
							<tr v-if="item.chck_rslt == 'I'">
								<th scope="row" class=""><label for="">조치자</label></th>
								<td>
									{{ item.actn_pic_nm }}
								</td>
							</tr>
							<tr v-show="item.chck_rslt == 'I'">
								<th scope="row" class=""><label for="">사진</label></th>
								<td>
									<imgsfileform :pass="{id:'mttr'+i+j, index:j, gbn:'mttr', mode:'view'}" @filelist="fnImgFileList" @fileDelete="fnImgFileDelete"  :ref="'mttr_imgsfileform'"></imgsfileform>
								</td>
							</tr>
							<tr v-if="item.chck_rslt == 'I'">
								<th scope="row" class=""><label for="">조치내용</label></th>
								<td>
									<textarea style="border: none; background-color: white;" disabled >{{ item.actn_sttus }}</textarea>
								</td>
							</tr>
							<tr v-if="item.chck_rslt == 'I'">
								<th scope="row" class=""><label for="">진행현황</label></th>
								<td>
									<!-- <div v-if="item.mttr_yn == 'Y'">
										<template v-for="(cd_item, cd_i) in viewModel.mttrPrgrsList" :key="cd_i">
											<label :for="'actn_prgrs'+i+'_'+cd_item.CODE"><input type="radio" :id="'actn_prgrs'+i+'_'+cd_item.CODE" :name="'radio_btn02'+i" v-model="item.actn_prgrs" :value="cd_item.CODE">{{ cd_item.CODE_NM }}</label>
										</template>
									</div> -->
									<span>{{ item.actn_prgrs_nm }}</span>
								</td>
							</tr>
						</tbody>
					</table>
				</div>
				</div>
		</template>
	</modal>
</template>

<script>
import 'es6-promise/auto'
import Vue from 'vue'
import Axios from 'axios'
import Modal from './modal.vue'
import imgsfileform from '../../../common/vue/imgsfileform2.vue';
import Common from "../../../common/js/common.js";

export default{
	props: ['pass'],
    components: {
        Modal, imgsfileform, Common
    },
    data: function () {
        return {
			viewModel:{
				fileList:[],
				imgfilelist:[],
				mttrFileList:[],
				chckList:[],
				userInfo:{},
			}
        }
    },
    methods: {
		fnInit: function(value) {
			let vt = this;
			let vm = this.viewModel;

			vm.userInfo = vt.$store.state.global.userInfo;
			console.log(value);
			vm.lbm_cfrnc_sn = value.lbm_cfrnc_sn;
			vt.$nextTick(function() {
				vt.fnList(value);
			});
		},
		fnList:function(value){
			let vt = this;
			let vm = this.viewModel;
			let chck_day = new Date(value.mtg_dt);
			
			let data = {
				bplc_sn : value.bplc_sn,
				bng_dt : value.mtg_dt,
				end_dt : (value.dt_next != null) ? value.dt_next : (chck_day.setMonth(chck_day.getMonth() +2))
			}
			
			Axios.post("/selectMauImplPlActChckDetail.do", data).then(function(response) {
				vm.chckList = [];
				vm.fileList = [];
				vm.mttrFileList = [];
				vm.imgfilelist = [];
				vm.mttrImgfilelist = [];

				vm.chckList = response.data.chckList;
				vm.fileList = response.data.fileList;
				vm.mttrFileList = response.data.mttrFileList;

				for(let i=0; i<vm.chckList.length; i++){
					for(let j=0; j<vm.chckList[i].length; j++){
						vm.chckList[i][j].imgfilelist = vm.fileList[i].filter(data => data.sub_sn == vm.chckList[i][j].chck_act_rslt_sn);
						vm.chckList[i][j].mttrImgfilelist = vm.mttrFileList[i].filter(data => data.sub_sn == vm.chckList[i][j].chck_act_rslt_sn);
	
						vt.$nextTick(function() {
							vt.fnFileLoadList(i, j)
						});
					}
                }
			})	
			vt.$forceUpdate(); 
		},
		fnFileLoadList: function(i, j){
			let vt = this;
			let vm = this.viewModel;

			if(vm.chckList[i][j] != undefined && vm.chckList[i][j].imgfilelist != null){
				vt.$refs.imgsfileform[i+j].fnFileLoadList(vm.chckList[i][j].imgfilelist);

			}
			if(vm.chckList[i][j] != undefined && vm.chckList[i][j].mttrImgfilelist != null){
				vt.$refs.mttr_imgsfileform[i+j].fnFileLoadList(vm.chckList[i][j].mttrImgfilelist);
			}
		},
		fnClose:function(){
			let vt = this;
            vt.$parent.fnList();
			vt.$parent.signPopup = false;
			vt.$parent.chckPopup = false;
			vt.$parent.suggestPopup = false;
			vt.$parent.meetingPopup = false;
        },
    }
}
</script>