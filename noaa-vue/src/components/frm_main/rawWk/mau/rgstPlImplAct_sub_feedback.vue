<template v-slot:contents>
	<div :key="check_key">
		<div>
			<h3> -  의결사항 피드백</h3>
			<table class="table write" v-if="viewModel.fbConsiderList.length > 0">
				<caption>의결사항</caption>
				<thead>
					<th scope="col" width="15%">회의일자</th>
					<th scope="col" width="15%">항목</th>
					<th scope="col" width="20%">심의의결 사항</th>
					<th scope="col" width="20%">피드백 내용</th>
					<th scope="col" width="30%">사진 첨부</th>
				</thead>
				<tbody v-for="(item, i) in viewModel.fbConsiderList" :key="i">
					<tr v-for="(item, j) in viewModel.fbConsiderList[i]" :key="j">
						<td v-if="j==0" :rowspan=viewModel.fbConsiderList[i].length>{{ viewModel.fbConsiderList[i][0].mtg_dt }}</td>
						<td class="text-left">{{ item.artcl_cn }}</td>
						<td class="text-left"><p v-html="item.artcl"></p></td>
						<td v-if="mode!='view'" class="text-left"><textarea rows="7" title="피드백 내용" v-model="viewModel.fbConsiderList[i][j].fdbck_cn" ></textarea></td>
						<td v-if="mode=='view'" class="text-left"><p v-html="viewModel.fbConsiderList[i][j].fdbck_cn"></p></td>
						<td v-if="mode!='view'">
							<imgsfileform :ref="'impl_fbc_img'+i+j+''" :pass="{id:'impl_fbc_img_'+i+j, index:i, subIndex:j, gbn:'impl_fbc_img'}" @filelist="fnImgFileList" @fileDelete="fnImgFileDelete"></imgsfileform>
						</td>
						<td v-if="mode=='view'">
							<imgsfileform :ref="'impl_fbc_img'+i+j+''" :pass="{id:'impl_fbc_img_'+i+j, index:i, subIndex:j, gbn:'impl_fbc_img', mode:'view'}" @filelist="fnImgFileList" @fileDelete="fnImgFileDelete"></imgsfileform>
						</td>
					</tr>
				</tbody>
			</table>
			<table class="table write" v-else>
				<thead>
					<th scope="col" width="15%">회의일자</th>
					<th scope="col" width="15%">항목</th>
					<th scope="col" width="20%">심의의결 사항</th>
					<th scope="col" width="20%">피드백 내용</th>
					<th scope="col" width="30%">사진 첨부</th>
				</thead>
				<tr>
					<td colspan="5">의결사항이 없습니다.</td>
				</tr>
			</table>
		</div>
		<div style="padding:15px 0px 0px 0px;">
			<h3> -  건의사항 피드백</h3>
			<table class="table write" v-if="viewModel.fbSuggestList.length > 0">
				<caption>건의사항</caption>
				<thead>
					<th scope="col" width="15%">회의일자</th>
					<th scope="col" width="15%">건의자</th>
					<th scope="col" width="20%">건의 사항</th>
					<th scope="col" width="20%">피드백 내용</th>
					<th scope="col" width="30%">사진 첨부</th>
				</thead>
				<tbody v-for="(item, i) in viewModel.fbSuggestList" :key="i">
					<tr v-for="(item, j) in viewModel.fbSuggestList[i]" :key="j">
						<td v-if="j==0" :rowspan=viewModel.fbSuggestList[i].length>{{ viewModel.fbSuggestList[i][0].mtg_dt }}</td>
						<td class="text-left">{{ item.user_nm }}</td>
						<td class="text-left"><p v-html="item.cn"></p></td>
						<td v-if="mode!='view'" class="text-left"><textarea rows="7" title="피드백 내용" v-model="viewModel.fbSuggestList[i][j].fdbck_cn" ></textarea></td>
						<td v-if="mode=='view'" class="text-left"><p v-html="viewModel.fbSuggestList[i][j].fdbck_cn"></p></td>
						<td v-if="mode!='view'">
							<imgsfileform :ref="'impl_fbs_img'+i+j" :pass="{id:'impl_fbs_img_'+i+j, index:i, subIndex:j, gbn:'impl_fbs_img'}" @filelist="fnImgFileList" @fileDelete="fnImgFileDelete"></imgsfileform>
						</td>
						<td v-if="mode=='view'">
							<imgsfileform :ref="'impl_fbs_img'+i+j" :pass="{id:'impl_fbs_img_'+i+j, index:i, subIndex:j, gbn:'impl_fbs_img', mode:'view'}" @filelist="fnImgFileList" @fileDelete="fnImgFileDelete"></imgsfileform>
						</td>
					</tr>
				</tbody>
			</table>
			<table class="table write" v-else>
				<thead>
					<th scope="col" width="15%">회의일자</th>
					<th scope="col" width="15%">항목</th>
					<th scope="col" width="20%">심의의결 사항</th>
					<th scope="col" width="20%">피드백 내용</th>
					<th scope="col" width="30%">사진 첨부</th>
				</thead>
				<tr>
					<td colspan="5">건의사항이 없습니다.</td>
				</tr>
			</table>
		</div>
		<div class="table_footer btn-right" v-if="mode!='view'">
			<div class="btn-group btn-right">
				<a href="javascript:void(0);" class="btn btn-purple" @click="fnSave()" v-if="(viewModel.fbConsiderList.length > 0) || (viewModel.fbSuggestList.length > 0)"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-edit"></use></svg>{{ state_k }}</a>
				<a href="javascript:void(0);" class="btn btn-gray" @click="fnClose()"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-trash-can"></use></svg>취소</a>
			</div>
		</div>
	</div>
</template>

<script>
import 'es6-promise/auto'
import Vue from 'vue'
import Axios from 'axios'
// import Modal from './modal.vue'
import imgsfileform from '../../../../common/vue/imgsfileform2.vue';
// import fileform from "../../../common/vue/fileform3.vue";

export default{
	props: ['pass'],
    components: {
    	imgsfileform
    },
    data: function () {
        return {
			check_key : 0,
			lbm_cfrnc_sn : 0,
			bplc_sn : 0,
			mode:'',
			viewModel:{
				fbConsiderList:[],
				fbSuggestList:[],
				// imgList:[],
				fileLoadList:[],
				fbC_fileLoadList:[],
				fbS_fileLoadList:[],
				deleteImgList:[],
				userInfo:{},
			}
        }
    },
    methods: {
		fnInit: function(value) {
			let vt = this;
			let vm = this.viewModel;
			vm.userInfo = vt.$store.state.global.userInfo;
			vt.mode = (vt.pass.mode == '')? '':vt.pass.mode;
		
			vt.lbm_cfrnc_sn = value.lbm_cfrnc_mtg_sn;
			vt.bplc_sn = value.bplc_sn;
			// if(value.prgrs_sittn >= 5){
			// 	vt.state = 'update';
			// 	vt.state_k = '수정';
			// 	vt.fnDetail();
			// }
			vt.$nextTick(function() {
				vt.state_k = '등록';
				vt.fnList();
			});
		},
		fnList:function(){
			let vt = this;
			let vm = this.viewModel;
			let data = {
				lbm_cfrnc_sn : vt.lbm_cfrnc_sn,
				now_lbm_cfrnc_sn : vt.lbm_cfrnc_sn,
				bplc_sn : vt.bplc_sn,
				process : 'feedback'
			}

			Axios.post("/selectMauImplPlActDetail.do", data).then(function(response) {
				vm.fbConsiderList = response.data.feedbackConsiderList;
				vm.fbSuggestList = response.data.feedbackSuggestList;
				vm.fbC_fileLoadList = response.data.fileList_c;
				vm.fbS_fileLoadList = response.data.fileList_s;

				for(let i=0; i<vm.fbConsiderList.length; i++){
					for(let j=0; j<vm.fbConsiderList[i].length; j++){
						vm.fbConsiderList[i][j].mtg_dt = (vm.fbConsiderList[i][j].mtg_dt).substring(0,10);
						vm.fbConsiderList[i][j].artcl = (vm.fbConsiderList[i][j].artcl).replaceAll(/(\n|\r\n)/g,'<br>');
						vm.fbConsiderList[i][j].imgFileList = [];
						if(vt.mode == 'view'){
							if(vm.fbConsiderList[i][j].fdbck_cn){
								vm.fbConsiderList[i][j].fdbck_cn = vm.fbConsiderList[i][j].fdbck_cn.replaceAll(/(\n|\r\n)/g,'<br>');
							}
						}
					}
					if(vm.fbConsiderList.length > 0){
						vt.fnFileLoadList('impl_fbc_img', i);
					}
				}
				for(let i=0; i<vm.fbSuggestList.length; i++){
					for(let j=0; j<vm.fbSuggestList[i].length; j++){
						vm.fbSuggestList[i][j].mtg_dt = (vm.fbSuggestList[i][j].mtg_dt).substring(0,10);
						vm.fbSuggestList[i][j].cn = (vm.fbSuggestList[i][j].cn).replaceAll(/(\n|\r\n)/g,'<br>');
						vm.fbSuggestList[i][j].imgFileList = [];
						if(vt.mode == 'view'){
							if(vm.fbSuggestList[i][j].fdbck_cn){
								vm.fbSuggestList[i][j].fdbck_cn = vm.fbSuggestList[i][j].fdbck_cn.replaceAll(/(\n|\r\n)/g,'<br>');
							}
						}
					}
					if(vm.fbSuggestList.length > 0){
						vt.fnFileLoadList('impl_fbs_img', i);
					}
				}
			})	
			vt.$forceUpdate();
			vt.check_key += 1;
		},
		fnSave:function(){
			let vt = this;
			let vm = this.viewModel;
			
			let frm = new FormData();
			//의결사항 피드백 파일
			for(let i=0; i<vm.fbConsiderList.length; i++) {
				for(let j=0; j<vm.fbConsiderList[i].length; j++) {
					if(vm.fbConsiderList[i][j].imgFileList != undefined){
						for(let k=0; k<vm.fbConsiderList[i][j].imgFileList.length; k++) {
							if(vm.fbConsiderList[i][j].imgFileList[k].file != null) {
                                frm.append("fileModelList[0].fileTitle", vm.fbConsiderList[i][j].imgFileList[k].file.name);
                                frm.append("fileModelList[0].uploadFiles", vm.fbConsiderList[i][j].imgFileList[k].file);
                                frm.append("fileModelList[0].sn",  vm.fbConsiderList[i][j].lbm_cfrnc_sn); //노사협의체 일련변호
                                frm.append("fileModelList[0].sub_sn",  vm.fbConsiderList[i][j].dlbr_sn); //심의내용 일련변호
								frm.append("fileModelList[0].file_se", 1); //파일 구분 : 1.의결사항 파일, 2.건의사항 파일
                                if(vm.fbConsiderList[i][j].imgFileList[k].file_sn){
                                    frm.append("fileModelList[0].deleteFiles", vm.fbConsiderList[i][j].imgFileList[k].file_sn);
                                }
                                frm.append("fileModelList[0].key", 0)
							}else{
								frm.append("fileModelList[0].fileTitle", vm.fbConsiderList[i][j].imgFileList[k].file_title);
								frm.append("fileModelList[0].sn",  vm.fbConsiderList[i][j].lbm_cfrnc_sn); //노사협의체 일련변호
								frm.append("fileModelList[0].sub_sn",  vm.fbConsiderList[i][j].dlbr_sn); //심의내용 일련변호
								frm.append("fileModelList[0].file_se", 1); //파일 구분 : 1.의결사항 파일, 2.건의사항 파일
								frm.append("fileModelList[0].key", vm.fbConsiderList[i][j].imgFileList[k].file_sn);
							}
						}
					}
					if(vm.fbConsiderList[i][j].deleteImgFileList != undefined){
						for(let k=0; k<vm.fbConsiderList[i][j].deleteImgFileList.length; k++) {
							frm.append("fileModelList[0].deleteFiles", vm.fbConsiderList[i][j].deleteImgFileList[k]);
							frm.append("fileModelList[0].del_sn",  vm.fbConsiderList[i][j].lbm_cfrnc_sn); //노사협의체 일련변호
							frm.append("fileModelList[0].del_sub_sn",  vm.fbConsiderList[i][j].dlbr_sn); //심의내용 일련변호
						}
					} 
				}
			}
			//건의사항 피드백 파일
			for(let i=0; i<vm.fbSuggestList.length; i++) {
				for(let j=0; j<vm.fbSuggestList[i].length; j++) {
					if(vm.fbSuggestList[i][j].imgFileList != undefined){
						for(let k=0; k<vm.fbSuggestList[i][j].imgFileList.length; k++) {
							if(vm.fbSuggestList[i][j].imgFileList[k].file != null) {
                                frm.append("fileModelList[1].fileTitle", vm.fbSuggestList[i][j].imgFileList[k].file.name);
                                frm.append("fileModelList[1].uploadFiles", vm.fbSuggestList[i][j].imgFileList[k].file);
                                frm.append("fileModelList[1].sn",  vm.fbSuggestList[i][j].lbm_cfrnc_sn); //노사협의체 일련변호
								frm.append("fileModelList[1].sub_sn",  vm.fbSuggestList[i][j].sugest_mttr_sn); //건의사항 일련변호
								frm.append("fileModelList[1].file_se", 2); //파일 구분 : 1.의결사항 파일, 2.건의사항 파일(건의사항 테이블에서 2.피드백 파일로 파일 처리)
                                if(vm.fbSuggestList[i][j].imgFileList[k].file_sn){
                                    frm.append("fileModelList[1].deleteFiles", vm.fbSuggestList[i][j].imgFileList[k].file_sn);
                                }
                                frm.append("fileModelList[1].key", 0)
							}else{
								frm.append("fileModelList[1].fileTitle", vm.fbSuggestList[i][j].imgFileList[k].file_title);
								frm.append("fileModelList[1].sn",  vm.fbSuggestList[i][j].lbm_cfrnc_sn); //노사협의체 일련변호
								frm.append("fileModelList[1].sub_sn",  vm.fbSuggestList[i][j].sugest_mttr_sn); //건의사항 일련변호
								frm.append("fileModelList[1].file_se", 2); //파일 구분 : 1.의결사항 파일, 2.건의사항 파일(건의사항 테이블에서 2.피드백 파일로 파일 처리)
								frm.append("fileModelList[1].key", vm.fbSuggestList[i][j].imgFileList[k].file_sn);
							}
						}
					}
					if(vm.fbSuggestList[i][j].deleteImgFileList != undefined){
						for(let k=0; k<vm.fbSuggestList[i][j].deleteImgFileList.length; k++) {
							frm.append("fileModelList[1].deleteFiles", vm.fbSuggestList[i][j].deleteImgFileList[k]);
							frm.append("fileModelList[1].del_sn",  vm.fbSuggestList[i][j].lbm_cfrnc_sn); //노사협의체 일련변호
							frm.append("fileModelList[1].del_sub_sn",  vm.fbSuggestList[i][j].sugest_mttr_sn); //건의사항 일련변호
						}
					} 
				}
			}
			vt.fnInsert(frm);
		},
		fnInsert:function(frm){
			let vt = this;
			let vm = this.viewModel;
			let data_c = [];
			let data_s = [];
			
			for(var i=0; i<vm.fbConsiderList.length; i++ ){
				for(var j=0; j<vm.fbConsiderList[i].length; j++ ){
					if(!vm.fbConsiderList[i][j].fdbck_cn){
						return alert("피드백 내용을 입력해주시기 바랍니다.");
					}else{
						data_c.push({
							bplc_sn : vt.bplc_sn,
							lbm_cfrnc_sn : vm.fbConsiderList[i][j].lbm_cfrnc_sn,
							dlbr_sn : vm.fbConsiderList[i][j].dlbr_sn,
							// fdbck_sn : (vm.fbConsiderList[i][j].fdbck_sn == '')? -1:vm.fbConsiderList[i][j].fdbck_sn,
							fdbck_actn_yn : (vm.fbConsiderList[i][j].fdbck_cn != null)? 'Y':'N',
							fdbck_cn : vm.fbConsiderList[i][j].fdbck_cn,
							reg_id : vm.userInfo.user_id
						})
					}
				}
			}
			for(var i=0; i<vm.fbSuggestList.length; i++ ){
				for(var j=0; j<vm.fbSuggestList[i].length; j++ ){
					if(!vm.fbSuggestList[i][j].fdbck_cn){
						return alert("피드백 내용을 입력해주시기 바랍니다.");
					}else{
						data_s.push({
							bplc_sn : vt.bplc_sn,
							lbm_cfrnc_sn : vm.fbSuggestList[i][j].lbm_cfrnc_sn,
							sugest_mttr_sn : vm.fbSuggestList[i][j].sugest_mttr_sn,
							sugest_mttr : 2, //2.피드백
							fdbck_cn : vm.fbSuggestList[i][j].fdbck_cn,
							fdbck_yn : (vm.fbSuggestList[i][j].fdbck_cn != null)? 'Y':'N',
							reg_id : vm.userInfo.user_id
						})
					}
				}
			}
			
			frm.append('data_c', new Blob([ JSON.stringify(data_c) ], {type : "application/json"}));
			frm.append('data_s', new Blob([ JSON.stringify(data_s) ], {type : "application/json"}));
			
			frm.append("fileModelList[0].filePath", "ImplActFeedback");
			frm.append("fileModelList[1].filePath", "ImplActFeedback");
			
			// if(!vm.data.cn){
			// 	return alert("건의 의견 내용을 입력해주시기 바랍니다.");
			// }

			// if(vt.state == 'update'){
			// 	if(confirm("피드백 내용을 수정 하시겠습니까?")){ 
			// 		Axios.post("/updateMauImplActFeedback.do", frm).then(function(response) {
			// 			console.log(response.data);
			// 			if(response.date != 0){
			// 				alert("수정 되었습니다.");
			// 				vt.fnClose();
			// 			}else{
			// 				alert("수정이 중단되었습니다.");
			// 			}
			// 		})	
			// 	}
			// }else{
				if(confirm("피드백 내용을 "+vt.state_k+"하시겠습니까?")){ 
					Axios.post("/insertMauImplActFeedback.do", frm).then(function(response) {
						if(response.date != 0){
							alert(vt.state_k+" 되었습니다.");
							vt.fnClose();
						}else{
							alert(vt.state_k+"이 중단되었습니다.");
						}
					})	
				}
			// }
		},
		
		fnFileLoadList: function(param, i){
			let vt = this;
			let vm = this.viewModel;

			if(param == 'impl_fbc_img'){
				for(let j=0; j<vm.fbConsiderList[i].length; j++){
					vm.fbConsiderList[i][j].imgFileList = vm.fbC_fileLoadList[i].filter(data => data.sub_sn == vm.fbConsiderList[i][j].dlbr_sn);
					let impl_fbc_img = 'impl_fbc_img'+i.toString()+j.toString();
					vt.$nextTick(function() {
						if(vm.fbConsiderList[i][j].imgFileList != undefined){
							vt.$refs[impl_fbc_img][0].fnFileLoadList(vm.fbConsiderList[i][j].imgFileList); 
						}
					})
				}
			}else if(param == 'impl_fbs_img'){
				for(let j=0; j<vm.fbSuggestList[i].length; j++){
					vm.fbSuggestList[i][j].imgFileList = vm.fbS_fileLoadList[i].filter(data => data.sub_sn == vm.fbSuggestList[i][j].sugest_mttr_sn);
					let impl_fbs_img = 'impl_fbs_img'+i.toString()+j.toString();
					vt.$nextTick(function() {
						if(vm.fbSuggestList[i][j].imgFileList != undefined){
							vt.$refs[impl_fbs_img][0].fnFileLoadList(vm.fbSuggestList[i][j].imgFileList); 
						}
					})
				}
			}
		},
		fnImgFileList:function(prarm){
			let vt = this;
			if((prarm.viewModel.id).includes('impl_fbc_img')){
				vt.viewModel.fbConsiderList[prarm.viewModel.index][prarm.viewModel.subIndex].imgFileList = prarm.viewModel.filelist;
			}
			if((prarm.viewModel.id).includes('impl_fbs_img')){
				vt.viewModel.fbSuggestList[prarm.viewModel.index][prarm.viewModel.subIndex].imgFileList = prarm.viewModel.filelist;
			}
		},
		fnImgFileDelete:function(prarm){
			let vt = this;
			if((prarm.viewModel.id).includes('impl_fbc_img')){
				vt.viewModel.fbConsiderList[prarm.viewModel.index][prarm.viewModel.subIndex].deleteImgFileList = prarm.viewModel.deletefileList;
			}
			if((prarm.viewModel.id).includes('impl_fbs_img')){
				vt.viewModel.fbSuggestList[prarm.viewModel.index][prarm.viewModel.subIndex].deleteImgFileList = prarm.viewModel.deletefileList;
			}
		},

		fnClose:function(){
            this.$parent.fnInit();
            this.$emit('close',false);
        },
    }
}
</script>