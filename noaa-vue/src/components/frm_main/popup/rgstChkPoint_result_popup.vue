<template>
	<div>
		<modal :pass="{popupTitle: '점검결과'}">
			<template v-slot:contents>
					<div>
						<table class="table horizontal write">
							<caption>점검결과 등록</caption>
							<tbody>
								<tr>
									<th scope="row">점검현장</th>
									<td>{{ viewModel.list.bplc_nm }}</td>
								</tr>
								<tr>
									<th scope="row">점검일자</th>
									<td>{{ viewModel.list.chck_dt }}</td> 
								</tr>
								<tr>
									<th scope="row">점검내용</th>
									<td><p v-html="viewModel.list.chck_cn"></p></td> 
								</tr>
								<tr>
									<th scope="row">점검항목</th>
									<td>
										<ul>
											<li v-for="item in viewModel.fileList" :key="item">
												<button class="btn-link" @click="fnFileDown(item)">{{ item.orgnl_file_nm }}</button>
											</li>
										</ul>
									</td>
								</tr>
								<tr>
									<th scope="row" class="essential"><label for="">점검결과</label></th>
									<td>
										<label for="r1"><input type="radio" id="r1" name="chkresult01" :checked="viewModel.list.chck_rslt == 'Y'?true:false" v-model="viewModel.list.chck_rslt" value="Y">양호</label>
										<label for="r2"><input type="radio" id="r2" name="chkresult01" :checked="viewModel.list.chck_rslt == 'N'?true:false" v-model="viewModel.list.chck_rslt" value="N">미흡</label>
									</td>
								</tr>
								<tr v-if="viewModel.list.chck_rslt == 'N'">
									<th scope="row" class="essential"><label for="">조치자</label></th>
									<td>
										<div class="input_group input_btn">
											<input type="text" id="" title="조치자" disabled v-model="viewModel.list.maner_nm">
											<button @click="fnPopup()"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-search"></use></svg></button>
										</div>
									</td>
								</tr>
								<tr v-if="viewModel.list.chck_rslt == 'N'">
									<th scope="row"><label for="">요청사항</label></th>
									<td>
										<textarea id="" rows="4" title="요청사항" v-model="viewModel.list.actn_dmnd_mttr"></textarea>
									</td>
								</tr>
							</tbody>
						</table>
					</div>
					<div class="btn-group">
						<div class="right_side">
							<a href="javascript:void(0);" class="btn btn-purple" @click="fnSave()">등록</a>
						</div>
					</div>
				<!-- </div> -->
			</template>
		</modal>
		<userPopup ref="user" v-if="userPop==true" :pass="{title:'조치자', bplc_yn:'Y', bplc_sn : viewModel.list.bplc_sn}"></userPopup>
		<!-- <userPopup ref="user" v-if="userPop==true" :pass="{title:'조치자'}"></userPopup> -->
	</div>
</template>

<script>
import 'es6-promise/auto'
import Vue from 'vue'
import Axios from 'axios'
import Modal from './modal.vue'
import fileform from "../fileform2.vue";
import userPopup from "../popup/user_popup.vue";

export default{
	props: ['pass'],
    components: {
        Modal, fileform, userPopup
    },
    data: function () {
        return {
			chck_sn : 0,
			userPop : false,
			fileLoadList:[],
			viewModel:{
				list:{},
				userInfo:{},
				deletefileList:[],
				fileList:[],
				uploadImageSrc:[],
			}
        }
    },
	mounted: function() {
		let vt = this;
		vt.userPop = false;
	},
    methods: {
		fnInit: function(detail, fileList, sn) {
			let vt = this;
			vt.viewModel.userInfo = vt.$store.state.global.userInfo;
			
			vt.chck_sn = sn;
			Modal.methods.fnInit(detail, fileList, sn);
			vt.$nextTick(function() {
				vt.fnList(detail, fileList, sn);
			});
		},
		fnList:function(detail, fileList, sn){
			let vt = this;
			let vm = this.viewModel;

			vm.list = detail;
			vm.list.chck_cn = vm.list.chck_cn.replaceAll(/(\n|\r\n)/g,'<br>');
			vm.list.chck_dt = (vm.list.chck_dt).substring(0,10);
			vm.fileList = fileList;

		},
		fnFileDown:function(item){
                let vt = this;
                let send = {
                    // se: type,
                    sn: vt.chck_sn,
                    file_sn: item.file_sn,
                    gbn:'rgstChkPoint'
                }
				
				$(".loading").show();
                $("#mask").show();

                Axios.post("/download.do",send,{responseType: "blob",}
                ).then(function(e) {
                    const url = window.URL.createObjectURL(new Blob([e.data], { type: e.headers["content-type"] }))
                    const link = document.createElement("a")
                    link.href = url
                    link.download = item.orgnl_file_nm
                    link.click()
                    window.URL.revokeObjectURL(url)
                }).then(function(){
                    $(".loading").hide();
                    $("#mask").hide();
                });
                    
		},
		fnPopup:function(){
			let vt = this;
			vt.userPop = true;
			vt.$nextTick(function() {
				if(vt.userPop) {
					vt.$refs.user.fnInit();
				}
			})
			
		},
		fnMemberAdd: function(item){
			let vt = this;
			let vm = this.viewModel;
			vm.list.maner = item.user_id;
			vm.list.maner_nm = item.user_nm;
			vt.userPop = false;
		},
		fnSave:function(){
			let vt = this;
			let vm = this.viewModel;
			
			if(vm.list.chck_rslt == 'N' && vm.list.maner == null){
				alert("점검결과(미흡)에 따른 조치자 선택이 필요합니다.");
			}else{
				if(confirm("등록 하시겠습니까?")){
					let data = {
						chck_sn : vt.chck_sn,
						chck_rslt : vm.list.chck_rslt,
						maner : (vm.list.chck_rslt == 'Y') ? null:vm.list.maner,
						actn_dmnd_mttr : vm.list.actn_dmnd_mttr,
						mod_id : vm.userInfo.user_id
					}
					
					Axios.post("/insertMngSftChkResult.do", data).then(function(res){
						if(res.date != 0){
							if(vt.viewModel.list.chck_rslt == 'N')vt.callPushAlarm(vt.viewModel.list.maner);
							alert("등록 되었습니다.");
						}else{
							alert("등록이 중단되었습니다.");
						}
						vt.fnClose();
					}).catch(function(ex) {
						console.log(ex);
					});
				}
			}
			
		},
		fnClose:function(){
			let vt = this;
            vt.$parent.fnList();
			vt.$parent.filePopup = false;
			vt.$parent.rpResultPopup = false;
			vt.$parent.rpActionPopup = false;
        },
		callPushAlarm: function (actn_pic) {
            let link = '/main/index.do';

            $.ajax({
                type: "post",
                url: "/api/pushSendPerson.do",
                data: {
                    // 제목 및 내용
                    title: "경영자 안전점검 관리 조치자 지정 알림",
                    message: "경영자 안전점검 관리 조치자로 지정되었습니다, PC에서 확인바랍니다.",
                    user_id: actn_pic,
                    // 클릭 시 이동 화면주소
                    link: link
                }
            });

        }
    }
}
</script>