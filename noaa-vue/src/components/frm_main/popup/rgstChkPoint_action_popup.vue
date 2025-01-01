<template>
	<modal :pass="{popupTitle: '조치현황'}">
		<template v-slot:contents>
			<div>
				<table class="table horizontal write">
					<caption>조치현황 등록</caption>
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
									<li v-for="item in viewModel.resultFileList" :key="item">
										<button class="btn-link" @click="fnFileDown(item)">{{ item.orgnl_file_nm }}</button>
									</li>
								</ul>
							</td>
						</tr>
						<tr>
							<th scope="row">점검결과</th>
							<td>
								<label for="r1"><input type="radio" id="r1" name="chkresult01" :checked="viewModel.list.chck_rslt == 'Y'?true:false" v-model="viewModel.list.chck_rslt" value="Y" disabled>양호</label>
								<label for="r2"><input type="radio" id="r2" name="chkresult01" :checked="viewModel.list.chck_rslt == 'N'?true:false" v-model="viewModel.list.chck_rslt" value="N" disabled>미흡</label>
							</td>
						</tr>
						<tr>
							<th scope="row">조치자</th>
							<td>{{ viewModel.list.maner_nm }}</td>
						</tr>
						<tr>
							<th scope="row">요청사항</th>
							<td><p v-html="viewModel.list.actn_dmnd_mttr"></p></td> 
						</tr>
						<tr>
							<th scope="row"><label for="">조치사항</label></th>
							<td v-if="viewModel.userInfo.user_id == viewModel.list.maner">
								<textarea id="" rows="4" title="조치사항" v-model="viewModel.list.actn_cn"></textarea>
							</td>
							<td v-if="viewModel.userInfo.user_id != viewModel.list.maner">
								<p v-html="viewModel.list.actn_cn_p"></p>
							</td>
						</tr>
						<tr>
							<th scope="row"><label for="">첨부파일</label></th>
							<td v-if="viewModel.userInfo.user_id == viewModel.list.maner">
								<fileform @filelist="fnFilelist"  @fileDelete="fnFileDelete" :pass="{id:'rgstChkPoint'}" ref="files"></fileform>
							</td>
							<td v-if="viewModel.userInfo.user_id != viewModel.list.maner">
								<ul>
									<li v-for="item in viewModel.actionFileList" :key="item">
										<a @click="fnFileDown(item)" style="cursor: pointer;">{{ item.orgnl_file_nm }}</a>
									</li>
								</ul>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
			<div class="btn-group">
				<div class="right_side">
					<a href="javascript:void(0);" class="btn btn-purple" @click="fnSave()" v-if="viewModel.userInfo.user_id == viewModel.list.maner">등록</a>
					<div v-if="(viewModel.userInfo.user_id != viewModel.list.maner) && viewModel.list.actn_cn == null">
						조치현황이 등록되지 않았습니다.
					</div>
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
import Pager from "../../paging.vue";
import fileform from "../fileform2.vue";

export default{
	props: ['pass'],
    components: {
        Pager, Modal, fileform
    },
    data: function () {
        return {
			chck_sn : 0,
			fileLoadList:[],
			viewModel:{
				list:{},
				userInfo:{},
				deletefileList:[],
				fileList:[],
				resultFileList:[],
				actionFileList:[],
				uploadImageSrc:[],
			}
        }
    },
    methods: {
		fnInit: function(detail, resultFileList, actionFileList, sn) {
			let vt = this;
			vt.viewModel.userInfo = vt.$store.state.global.userInfo;
			
			vt.chck_sn = sn;
			Modal.methods.fnInit(detail, resultFileList, actionFileList, sn);
			vt.$nextTick(function() {
				vt.fnList(detail, resultFileList, actionFileList, sn);
			});
		},
		fnList:function(detail, resultFileList, actionFileList, sn){
			let vt = this;
			let vm = this.viewModel;

			vm.list = detail;
			vm.list.chck_cn = vm.list.chck_cn.replaceAll(/(\n|\r\n)/g,'<br>');
			vm.list.actn_dmnd_mttr = vm.list.actn_dmnd_mttr.replaceAll(/(\n|\r\n)/g,'<br>');
			vm.list.chck_dt = (vm.list.chck_dt).substring(0,10);
			if(vm.list.actn_cn){
				vm.list.actn_cn_p = vm.list.actn_cn.replaceAll(/(\n|\r\n)/g,'<br>');
			}
			vm.resultFileList = resultFileList;
			vm.actionFileList = actionFileList;
			vm.fileList = actionFileList;
			
			vt.$nextTick(function() {
				// vt.$refs.files.viewModel.filelist = vm.fileList;
				vt.$refs.files.fnFileLoadList(vm.fileList);
				vt.$forceUpdate(); 
			})
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
		fnFilelist:function(vm){
			let vt = this;
			vt.viewModel.filelist = vm.filelist;
			vt.viewModel.fileGroup = vm.fileGroup;
		},
		fnFileDelete: function(vm){
			let vt = this;
			vt.viewModel.deletefileList = vm.deletefileList;
		},

		fnSave:function(){
			let vt = this;
			let frm = new FormData();
			console.log(vt.viewModel.filelist);
			console.log(vt.viewModel.deletefileList);
			if(vt.viewModel.filelist != undefined || vt.viewModel.filelist != null){
				for(let i=0; i<vt.viewModel.filelist.length; i++) {
					let key = vt.viewModel.filelist[i].file_seq;
					if(vt.viewModel.filelist[i].file != null) {
						frm.append("fileTitle", vt.viewModel.filelist[i].file_title);
						frm.append("uploadFiles", vt.viewModel.filelist[i].file);
						if(vt.viewModel.filelist[i].file_sn){
							frm.append("deleteFiles", vt.viewModel.filelist[i].file_sn);
						}
						frm.append("key", 0)
					} else {
						if(vt.viewModel.filelist[i].file == undefined){
							
						}else{
							frm.append("fileTitle", vt.viewModel.filelist[i].file_title);
							frm.append("key", key)
						}
					}
				}
			}
			if(vt.viewModel.deletefileList != undefined || vt.viewModel.deletefileList != null){
				for(let i=0; i<vt.viewModel.deletefileList.length; i++){
					frm.append("deleteFiles", vt.viewModel.deletefileList[i]);
				}
			}
			
			let data = {
				chck_sn : vt.viewModel.list.chck_sn,
				actn_cn : vt.viewModel.list.actn_cn,
				file_se : '2', //구분(1:점검항목, 2: 조치결과)
				bplc_sn : vt.viewModel.list.bplc_sn,
				reg_id : vt.viewModel.userInfo.user_id
			}

			frm.append('data', new Blob([ JSON.stringify(data) ], {type : "application/json"}));
			
			frm.append("filePath", "rgstChkPoint");

			if(confirm("등록 하시겠습니까?")){
				Axios.post("/insertMngSftChkAction.do", frm).then(function(response) {
					console.log(response.data);
					if(response.data != 0){
						alert("등록 되었습니다.");
					}else{
						alert("등록이 중단되었습니다.");
					}
					vt.fnClose();
				}).catch(function(ex) {
					console.log("error"+ex);
				});
			}
		},
		fnClose:function(){
			let vt = this;
            vt.$parent.fnList();
			vt.$parent.filePopup = false;
			vt.$parent.rpResultPopup = false;
			vt.$parent.rpActionPopup = false;
        },
    }
}
</script>