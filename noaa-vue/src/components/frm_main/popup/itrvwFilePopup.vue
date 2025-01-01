<template>
    <modal :pass="{popupTitle: '채용사유서'}">
		<template v-slot:contents>
            <div>
                <fileform @filelist="fnFilelist1"  @fileDelete="fnFileDelete1" :pass="{id:'sc1'}" ref="files"></fileform>
            </div>
            <div class="btn-group">
                <div class="right_side">
                    <button class="btn btn-purple" @click.prevent="fnSave()">등록</button>
                </div>
            </div>

			<div>
				<table class="table">
						<caption>첨부파일</caption>
						<thead>
							<tr>
								<th scope="col">제목</th>
								<th scope="col">용량</th>
								<th scope="col">등록날짜</th>
								<th scope="col">다운로드</th>
							</tr>
						</thead>
						<tbody>
							<template v-if="viewModel.fileViewList.length != 0">
								<tr v-for = "(item, i) in viewModel.fileViewList" :key="i">
									<td scope="row">{{item.orgnl_file_nm}}</td>
									<td>{{item.file_sz|filesize }}</td>
									<td>{{ item.reg_dt|yyyyMMdd }}</td>
									<td>
										<button class="btn btn-small btn-default" @click="fnFileDown(item)"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-download"></use></svg>다운</button>
									</td>
								</tr>
							</template>
							<template v-else>
								<tr><td colspan="5" >파일이 없습니다.</td></tr>
							</template>
					</tbody>
				</table>
			</div>
		</template>
	</modal>
</template>

<script>
    import "es6-promise/auto";
    import Vue from "vue";
    import Axios from "axios";
    import fileform from "../../../common/vue/fileform2.vue";
    import Modal from './modal.vue'
	import common from "../../../common/js/common";
    import Message, {messageUtil} from "../../../common/js/message";

    export default {
        props: ['pass'],
        data: function() {
            return {
                viewModel:{
                    data:{},
                    userInfo:{},
                    filelist1: [],
                    fileViewList: [],
                    deletefileList1: [],
                },
            };
        },
        components: {
            Modal,
            'fileform':fileform,
        },
        mounted: function() {
            let vm = this;
        },
        methods: {
            fnInit:function(user_id, bplc_sn){
                let vm = this;
                vm.viewModel.userInfo = vm.$store.state.global.userInfo;

                Modal.methods.fnInit();

				vm.viewModel.data.user_id = user_id;
				vm.viewModel.data.bplc_sn = bplc_sn;

				vm.fnDetail();
            },
            fnDetail: function(){
                let vm = this;

                let send = {
                    user_id: vm.viewModel.data.user_id,
                    bplc_sn: vm.viewModel.data.bplc_sn,
                }

                Axios.post("/selectMdexmnFileList.do", send)
                .then(function(response) {
                    vm.viewModel.filelist1 = response.data.fileList;
                    vm.viewModel.fileViewList = response.data.fileViewList;
                    vm.$refs.files.fnFileLoadList(vm.viewModel.filelist1);
                });
            },
            fnFilelist1:function(vm){
                this.viewModel.filelist1 = vm.filelist;
            },
            fnFileDelete1: function(vm){
                this.viewModel.deletefileList1 = vm.deletefileList;
            },
            fnSave: function(){
                let vm = this;
                let frm = new FormData();
                for(let i=0; i<vm.viewModel.filelist1.length; i++) {
                    let key = vm.viewModel.filelist1[i].file_seq;
                    if(vm.viewModel.filelist1[i].file != null) {
                        frm.append("fileTitle", vm.viewModel.filelist1[i].file_title);
                        frm.append("uploadFiles", vm.viewModel.filelist1[i].file);
                        if(vm.viewModel.filelist1[i].file_sn){
                            frm.append("deleteFiles", vm.viewModel.filelist1[i].file_sn);
                        }
                        frm.append("key", 0)
                    } else {
                        if(vm.viewModel.filelist1[i].file == undefined){
                            
                        }else{
                            frm.append("fileTitle", vm.viewModel.filelist1[i].file_title);
                            frm.append("key", key)
                        }
                    }
                }

                for(let i=0; i<vm.viewModel.deletefileList1.length; i++){
                    frm.append("deleteFiles", vm.viewModel.deletefileList1[i]);
                }

                let data = {
                    reg_id: vm.viewModel.userInfo.user_id,
                    bplc_sn: vm.viewModel.data.bplc_sn,
					user_id: vm.viewModel.data.user_id,
                    sn: vm.viewModel.data.sn,
                };

                frm.append('data', new Blob([ JSON.stringify(data) ], {type : "application/json"}));

                frm.append("filePath", "mdexmn");
                if(confirm(Message.CREATE_CONFIRM)){
                    Axios.post("/updateMdexmnFile.do", frm).then(function(response) {
                        if(response.data == 1){
                            alert("저장되었습니다.");
                            vm.$parent.itrvwFilePop = false;
                            vm.$parent.fnList();
                        }else{
                            alert(Message.ERROR);    
                        }
                    }).catch(function(ex) {
                        alert(Message.ERROR);
                    });
                }
            },
			fnFileDown:function(item){//type : 1=file, 2=img
				let vm = this;
				let send = {
					bplc_sn: item.bplc_sn,
					user_id: item.user_id,
					file_sn: item.file_sn,
					gbn:'mdexmn'
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
        }
    };
</script>