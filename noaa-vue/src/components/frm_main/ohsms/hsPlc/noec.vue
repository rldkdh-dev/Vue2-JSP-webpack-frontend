<template>
	<div class="page_contents" style="background: #ffffff;">
		<div class="w_box sms_area">
			<div class="sms_section clearfix">
				<div class="phone_area" style="background: url(/img/phone_b.png) no-repeat 0 0;">
					<span class="txt_phonenumber">010-0000-1234</span>
					<div id="sms_area" class="sms_area">
						<div class="top"></div>
						<div id="sms_contents">
							<textarea id="sms_msg" name="sms_msg" v-model="msmpick"></textarea>
						</div>
						<div class="bottom"><span id="msglen" class="txt_byte">LMS (137/2000byte)</span></div>
					</div>
				</div>
				<div class="sentence">
					<div class="top">
						<h1>저장된 문구</h1>
						<!--
						<input type="submit" value="문구저장" class="btn btn-dark">
						-->
					</div>
					<div class="sentence_list">
						<div class="item">
							<input type="button" value="문구선택" class="btn" @click="clickm(slist.msg1)" style="background: #374169;">
							<textarea v-model="slist.msg1" name="msg1" readonly></textarea>
						</div>
						<div class="item">
							<input type="button" value="문구선택" class="btn" @click="clickm(slist.msg2)" style="background: #374169;">
							<textarea v-model="slist.msg2" name="msg2" readonly></textarea>
						</div>
						<div class="item">
							<input type="button" value="문구선택" class="btn" @click="clickm(slist.msg3)" style="background: #374169;">
							<textarea v-model="slist.msg3" name="msg3" readonly></textarea>
						</div>
						<div class="item">
							<input type="button" value="문구선택" class="btn" @click="clickm(slist.msg4)" style="background: #374169;">
							<textarea v-model="slist.msg4" name="msg4" readonly></textarea>
						</div>
						<div class="item">
							<input type="button" value="문구선택" class="btn" @click="clickm(slist.msg5)" style="background: #374169;">
							<textarea v-model="slist.msg5" name="msg5" readonly></textarea>
						</div>
						<div class="item">
							<input type="button" value="문구선택" class="btn" @click="clickm(slist.msg6)" style="background: #374169;">
							<textarea v-model="slist.msg6" name="msg6" readonly></textarea>
						</div>
					</div>
				</div>
				<div class="s_list">
					<!--
					<div class="btn_area2">
						<a href="" class="btn btn-icon btn-info">문자 발송 내역</a>
					</div>
					-->
					<table class="table">
						<caption>받는사람</caption>
						<thead>
							<tr>
								<th scope="col" colspan="2"><h3>받는 사람</h3></th>
							</tr>
							<tr>
								<th scope="col">
									<label for="chk_mymember" class="check_label">본사
										<input type="checkbox" id="chk_mymember" v-model="allChecked">
										<span class="checkmark"></span>
									</label>
								</th>
								<th scope="col">
									<label for="chk_together" class="check_label">현장
										<input type="checkbox" id="chk_together" v-model="allChecked2">
										<span class="checkmark"></span>
									</label>
								</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td>
									<ul id="mymember">
										<li v-for="item in ulist" :key="item.uid">
											<label class="check_label">
												{{ item.dname }} {{ item.user_nm }}
												<input type="checkbox" :name="'num['+item.uid+']'" :value="item.hp" class="emergency" v-model="checkedList" :disabled="item.hp == null || item.hp == ''" :checked="item.is_emergency == 1 && emergencyChecked">
												<span class="checkmark"></span>
											</label>
										</li>
									</ul>
								</td>
								<td>
									<ul id="together">
										<li v-for="item in plist" :key="item.uid">
											<label class="check_label">
												{{ item.bname }} {{ item.user_nm }}
												<input type="checkbox" :name="'num['+item.uid+']'" :value="item.hp" class="emergency" v-model="checkedList" :disabled="item.hp == null || item.hp == ''" :checked="item.is_emergency == 1 && emergencyChecked">
												<span class="checkmark"></span>
											</label>
										</li>
									</ul>
								</td>
							</tr>
						</tbody>
						<tfoot>
							<tr>
								<td>
									<label for="chk_select03" class="check_label">비상대응 인원소집
										<input type="checkbox" id="chk_select03" v-model="emergencyChecked">
										<span class="checkmark"></span>
									</label>
								</td>
								
								<td>
									<span>총 <span id="chk_num" class="num">{{ checkedCount }}</span>명 선택</span>
								</td>
							</tr>
						</tfoot>
					</table>
					<div class="tit_form">
						<label for="mobile_sms_subject">제목</label><input type="text" id="mobile_sms_subject" value="긴급 비상연락 문자">
					</div>
					<div class="btn_area1">
						<input type="button" value="문자 발송" class="btn btn_send btn-icon btn-primary" @click="send_sms" style="background: #374169;">
					</div>

				</div>
			</div><!-- } sms_area -->

		</div><!-- } w_box -->
	</div><!-- } page_contents -->
</template>

<script>
    import "es6-promise/auto";
    import Vue from "vue";
    import Axios from "axios";
    
    export default {
	data: function() {
		return {
			emergencyChecked: false,
			allChecked: false,
			allChecked2: false,
			ulist:{},
			plist:{},
			slist:{},
			directData:{},
			msmpick:'',
			checkedNum:{},
			checkedList:[],
			pcheckedList:[],
			subject:'긴급 비상연락 문자',
			sname:'',
		};
	},
	mounted: function() {
		this.fnStart();

	},
	watch: {
		emergencyChecked(val) {
			if (val) {
				this.checkedList = this.ulist.filter(item => item.is_emergency === 1).map(item => item.hp);
				this.pcheckedList = this.plist.filter(item => item.is_emergency === 1).map(item => item.hp);
			} else {
				this.checkedList = [];
				this.pcheckedList = [];
			}
		},
    	allChecked(val) {
			if (val) {
				this.checkedList = this.ulist.filter(item => item.hp).map(item => item.hp);
			} else {
				this.checkedList = this.checkedList.filter(item => !this.ulist.find(x => x.hp === item));
			}
		},
		allChecked2(val) {
			if (val) {
				this.pcheckedList = this.plist.filter(item => item.hp).map(item => item.hp);
			} else {
				this.pcheckedList = this.pcheckedList.filter(item => !this.plist.find(x => x.hp === item));
			}
		}
	},
	computed: {
		selectedPhoneNumbers() {
			return this.checkedList;
		},
		checkedCount() {
			return this.checkedList.length + this.pcheckedList.length;
		},
		isAllChecked: {
			get() {
				return this.isCheckedAll
			},
			set(value) {
				this.isCheckedAll = value
				if (value) {
					// isCheckedAll이 true이면 모든 체크박스를 선택합니다.
					this.checkAll()
				} else {
					// isCheckedAll이 false이면 모든 체크박스를 선택 해제합니다.
					this.checkedList = []
				}
			}
		},
	},
	methods: {
		fnStart:function(){
			this.fnGetuser();
			this.fnGetsms();
			this.fnGetpartner();
		},
		saveMessages:function() {
			let vm = this;
			
			let sendData = {
				mapperId : 'noec.updateSms',
				sms_msg1: vm.slist.msg1,
				sms_msg2: vm.slist.msg2,
				sms_msg3: vm.slist.msg3,
				sms_msg4: vm.slist.msg4,
				sms_msg5: vm.slist.msg5,
				sms_msg6: vm.slist.msg6,
			}
			Axios.post("/update.do",sendData).then(function(res){
				if(res.data.success == false) {
					alert("저장실패");
				}else{
					alert("저장완료");
					vt.$router.back()
				}
			})
		},
		checkAll() {
			this.checkedList = this.ulist.map(item => item.user_phone)
		},
		fnGetuser:function(){
			let vm = this;
            let sendData = {
                mapperId : 'noec.selectUser' ,
            }
			Axios.post("/list.do",sendData)
			.then(function(response) {
				vm.ulist = response.data.list;
				
			});
			let sendData3 = {
                mapperId : 'Site.SelectSms' ,
            };
			Axios.post("/admindetail.do",sendData3)
			.then(function(response) {
				vm.directData = response.data[0];
			});
		},
		fnGetpartner:function(){
			let vm = this;
            let sendData = {
                mapperId : 'noec.selectBplcUser' ,
            }
			Axios.post("/list.do",sendData)
			.then(function(response) {
				vm.plist = response.data.list;
				
			});
		},
		fnGetsms:function(){
			let vm = this;
            let sendData = {
                mapperId : 'noec.selectSms' ,
            }
			Axios.post("/list.do",sendData)
			.then(function(response) {
				vm.slist = response.data.list[0];
				
			});
		},
		clickm:function(ms){
			let vm = this;
			vm.msmpick = '';
			vm.msmpick = ms;
		},
		send_sms: function() {
			let vm = this;
            Axios({
                    method: 'post',
                    url: '/sendSms.do',
                    }).then((response) => {
                            if(response.data == 0){
                                alert("정상적으로 발송되었습니다.")
                            }else{
                                alert("발송실패!! \n 관리자에게 문의바랍니다.")
                            }
                        }
                    );

			if(vm.pcheckedList.length == 0 ){
				vm.checkedList.forEach(function(phone) {
					let senddata4 = {
						num1: phone,
						Content: vm.msmpick,
						subject:vm.subject,
						sname: vm.sname,
						senderData: vm.directData.directsend_sender,
						usernameData: vm.directData.directsend_id,
						keyData: vm.directData.directsend_key,
						use_directsend : vm.directData.use_directsend
					};
					Axios.post("/sms.do", senddata4).then(function(rss) {
						if(rss.data.success == false) {
							alert("전송실패");
						}else{
							alert("전송완료");
							window.location.reload();
						}
					});
				});
			}else{
				vm.checkedList.forEach(function(phone) {
					let senddata5 = {
						num1: phone,
						Content: vm.msmpick,
						subject: vm.subject,
						sname: vm.sname,
						senderData: vm.directData.directsend_sender,
						usernameData: vm.directData.directsend_id,
						keyData: vm.directData.directsend_key,
						use_directsend : vm.directData.use_directsend
					};
					Axios.post("/sms.do", senddata5).then(function(rss) {
					});
				}).then(function(){
					vm.pcheckedList.forEach(function(phone) {
						let senddata = {
						num1: phone,
						Content: vm.msmpick,
						subject: vm.subject,
						sname: vm.sname,
						};
						Axios.post("/sms.do", senddata).then(function(rss) {
							if(rss.data.success == false) {
								alert("전송실패");
							}else{
								alert("전송완료");
								window.location.reload();
							}
						});
					});
				});
			}
		},
	  }
    };
</script>