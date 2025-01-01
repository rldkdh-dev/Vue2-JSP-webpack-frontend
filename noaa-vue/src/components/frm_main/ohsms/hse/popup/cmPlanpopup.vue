<template>
	<modal :pass="{popupTitle: (pass.title == undefined ? '사용자' : pass.title) + ' 요구서',parameter:'hse'}" @close="fnClose">
		<template v-slot:contents>
            <div>
                <div>
                    <div>
                        <table class="table horizontal write">
                            <caption>조치내용 등록</caption>
                            <tbody>
                                <tr>
                                    <th scope="row"><label for="prdct_nm">현장명</label></th>
                                    <td colspan="3">
                                        {{ cmplandetaillist.bplc_nm }}
                                    </td>
                                </tr>
                                <tr>
                                    <th scope="row" rowspan="2"><label for="prdct_nm">구분항목</label></th>
                                    <td colspan="2">
                                        {{ cmplandetaillist.artcl_nm }}
                                    </td>
                                </tr>
                                <tr>
                                    <td scope="row">{{ cmplandetaillist.artcl_detail_nm }}</td>
                                </tr>
                                <tr>
                                    <th scope="row" class="essential"><label>조치예정일</label></th>
                                    <td>
                                        <div class="datepicker_box">
                                            <input type="text" :class="datepicker" id="actn_prnmnt_dt" title="조치예정일" readonly><!--:disabled="mode != 1 ? true : false"-->
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <th scope="row" class="essential"><label for="mkr">조치요구사항</label></th>
                                    <td colspan="3">
                                        <textarea rows="3" v-model="actn_demand_mttr" @input="actn_demand_mttr = $event.target.value" :disabled="mode != 1 ? true : false"></textarea>
                                    </td>
                                </tr>
                                <tr>
                                    <th scope="row"><label for="mkr">지적</label></th>
                                    <td colspan="3">
                                        {{ cmplandetaillist.lgstr_cd == 'LGSTR' ? '지적' : '권고' }}
                                    </td>
                                </tr>
                                <tr>
                                    <th scope="row" class="essential"><label for="mkr">조치담당자</label></th>
                                    <td>
                                        <div class="input_group">
                                            <select v-model="actn_pic" :disabled="mode != 1 ? true : false">
                                                <option value="">선택</option>
                                                <option v-for="item in userList" :key="item" :value="item.user_id">{{ item.jbttl_nm + ' ' +item.user_nm}}</option>
                                            </select>
                                        </div>
                                    </td>
                                </tr>

                                <tr v-if="mode != 1">
                                    <th scope="row"><label for="mkr">원인</label></th>
                                    <td colspan="3">
                                        <textarea rows="3" v-model="cause" @input="cause = $event.target.value" :disabled="mode != 2 ? true:false"></textarea>
                                    </td>
                                </tr>
                                <tr v-if="mode != 1">
                                    <th scope="row"><label for="mkr">시정조치결과</label></th>
                                    <td colspan="3">
                                        <textarea rows="3" v-model="actn_rslt" @input="actn_rslt = $event.target.value" :disabled="mode != 2 ? true:false"></textarea>
                                    </td>
                                </tr>
                                <tr v-if="mode != 1">
                                    <th scope="row"><label for="mkr">향후관리계획</label></th>
                                    <td colspan="3">
                                        <textarea rows="3" v-model="futr_mng_plan" @input="futr_mng_plan = $event.target.value" :disabled="mode != 2 ? true:false"></textarea>
                                    </td>
                                </tr>
                                <tr v-if="mode != 1">
                                    <th scope="row"><label for="mkr">향후관리계획결과</label></th>
                                    <td colspan="3">
                                        <textarea rows="3" v-model="futr_mng_plan_rslt" @input="futr_mng_plan_rslt = $event.target.value" :disabled="mode != 2 ? true:false"></textarea>
                                    </td>
                                </tr>

                                <tr v-if="mode != 1">
                                    <th scope="row"><label for="img">사진</label></th>
                                    <td colspan="3">
                                        <imgsfileform :ref="'imgsfileform'" :pass="{id:'img'}" @filelist="fnImgFileList" @fileDelete="fnImgFileDelete" v-if="mode==2"></imgsfileform>
                                        <imgsfileform :ref="'imgsfileform'" :pass="{id:'img', mode:'view'}" v-else></imgsfileform>
                                    </td>
                                </tr>

                                <tr v-if="mode != 1">
                                    <th scope="row"><label for="file">첨부파일</label></th>
                                    <td colspan="3">
                                        <fileform @filelist="fnFilelist"  @fileDelete="fnFileDelete" :pass="{id:'sc'}" ref="files" v-if="mode==2"></fileform>
                                        <ul v-else>
                                            <li v-for="item in filelist">
                                                <a @click="fnFileDown(item, '')" style="cursor: pointer;" class="btn-link">{{ item.orgnl_file_nm }}</a>
                                            </li>
                                        </ul>
                                    </td>
                                </tr>
                                <tr v-if="mode == 4">
                                    <th scope="row"><label for="mkr">확인자</label></th>
                                    <td>
                                        {{ idfr }}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <div v-if="mode != 4" class="btn-group">
                <div class="right_side">
                    <button class="btn btn-purple" @click="mode==2? fnFile() : fnAdd()">{{mode==1|| mode==2 ? '저장' : '완료'}}</button>
                </div>
            </div>
		</template>
	</modal>
</template>
<script>
import Axios from 'axios';
import Vue from 'vue'
// import Common from '../../common.js'
import Modal from '../../../../../common/vue/modal.vue'
import Message, {messageUtil} from "../../../../../common/js/message";
import fileform from "../../../../../common/vue/fileform2.vue";
import imgsfileform from "../../../../../common/vue/imgsfileform2.vue";

export default {
	props: ['pass'],
	components: {
		Modal,
        imgsfileform,
        fileform,

	},
	data: function () {
		return {
			checkList:[],
			deptList:[],
			userList:[],
			userOrgList:[],
            cmplandetaillist:{},
			select_dept:'',
			viewUserList:'',
			user_name:'',
			actn_demand_mttr:'', //조치요구사항
            actn_dept:'', // 조치부서
            actn_pic:'', // 조치 담당자
            actn_prgrs:'', //조치상황
            actn_prnmnt_dt: '' ,// 조치예정일 
            cause:'', // 원인 
            actn_rslt:'', // 시정조치결과
            futr_mng_plan:'', //향후 관리 계획
            futr_mng_plan_rslt:'', // 향우관리계획결과
            idfr:'', //확인자
			pageNum:0,
			positions: {
				clientX: undefined,
				clientY: undefined,
				movementX: 0,
				movementY: 0
			},
			search: '',
            mode:0,
            datepicker:'',
            filelist:[],
            deletefilelist:[],
            imgfilelist:[],
            imgdeletefilelist:[],
		}
	},
	mounted: function () {
	},
	methods: {
		fnInit: function(item,n) {
			Modal.methods.fnInit();
            this.mode = n;
            this.cmplandetaillist = item;
            this.datepicker="";
            if(this.mode == 1){
                $("#actn_prnmnt_dt").val("");
                this.actn_demand_mttr ="";
                this.actn_pic='';
                this.fnList();
                this.datepicker="datepicker";
            }else{
                this.fnList();
                this.fncmPlanDetaillist();
                this.datepicker="datepicker disabled";
            }
            this.$nextTick(function(){
                this.fnCalendar();
            })
		},
		fnList: function() {
			let vm = this;
			
			let data = {
                mapperId: 'hse.selectBplcUserList',
				team_sn: vm.pass.team_sn,
				dept_sn: vm.pass.dept_sn,
				bplc_yn: vm.pass.bplc_yn,
				bplc_sn: vm.pass.bplc_sn,
			};
			Axios.post("/list.do",data).then(function(rs) {
				vm.userList = rs.data.list;
				vm.userOrgList = rs.data.list;
			});
		},
        fncmPlanDetaillist:function(){
            let vm = this;

            Axios.post('/selectCmPlanDetailList.do',{actn_plan_sn: vm.cmplandetaillist.actn_plan_sn }).then(function(res){
                vm.actn_pic = res.data.hseList[0].actn_pic;
                vm.actn_demand_mttr = res.data.hseList[0].actn_demand_mttr;
                $("#actn_prnmnt_dt").val(res.data.hseList[0].actn_prnmnt_dt);
                // vm.actn_prnmnt_dt = res.data.hseList[0].actn_prnmnt_dt;

                vm.cause = res.data.hseList[0].cause;
                vm.actn_rslt = res.data.hseList[0].actn_rslt;
                vm.futr_mng_plan = res.data.hseList[0].futr_mng_plan;
                vm.futr_mng_plan_rslt = res.data.hseList[0].futr_mng_plan_rslt;

                vm.idfr = res.data.hseList[0].idfr;

                vm.filelist = res.data.fileList.filter(item=> item.file_se == 1);
                vm.imgfilelist = res.data.fileList.filter(item=> item.file_se == 2);
            }).then(function(){
                if(vm.mode == 2){
                    vm.$refs.files.fnFileLoadList(vm.filelist);
                }
                vm.$refs.imgsfileform.fnFileLoadList(vm.imgfilelist);
            });
        },
		fnAdd:function(frm) {
			let vm = this;

            let send={
                bplc_sn:vm.cmplandetaillist.bplc_sn,
                actn_plan_sn : vm.cmplandetaillist.actn_plan_sn,
                inner_srng_sn:vm.cmplandetaillist.inner_srng_sn,
                ctgry_cd:vm.cmplandetaillist.ctgry_cd,
                se_cd:vm.cmplandetaillist.se_cd,
                artcl_sn:vm.cmplandetaillist.artcl_sn,
                artcl_detail_sn:vm.cmplandetaillist.artcl_detail_sn,
                actn_demand_mttr:vm.actn_demand_mttr,
                actn_pic:vm.actn_pic,
                actn_prnmnt_dt:$("#actn_prnmnt_dt").val(),
                reg_id :vm.$store.state.global.userInfo.user_id,
            };
            if(vm.mode==1){
                if($("#actn_prnmnt_dt").val() == ""){
                    return alert(messageUtil(Message.VALIDATION_REQUIRED, ["조치예정일"]));
                }else if(vm.actn_demand_mttr == ""){
                    return alert(messageUtil(Message.VALIDATION_REQUIRED, ["조치요구사항"]));
                }else if(vm.actn_pic == ""){
                    return alert(messageUtil(Message.VALIDATION_SELECT_REQUIRED, ["조치담당자"]));
                }
                

                if(confirm("저장하시겠습니까?")){
                    Axios.post('/insertCmPlan.do',send).then(function(){
                        vm.$emit('close',false);
                    })
                }else{
                    alert("저장을 취소 하였습니다.");
                }

            }else if(vm.mode==2){
                send.cause = vm.cause;
                send.actn_rslt = vm.actn_rslt;
                send.futr_mng_plan = vm.futr_mng_plan;
                send.futr_mng_plan_rslt = vm.futr_mng_plan_rslt;

                if(vm.cause == ""){
                    return alert(messageUtil(Message.VALIDATION_REQUIRED, ["원인"]));
                }else if(vm.actn_rslt == ""){
                    return alert(messageUtil(Message.VALIDATION_REQUIRED, ["시정조치결과"]));
                }else if(vm.futr_mng_plan == ""){
                    return alert(messageUtil(Message.VALIDATION_REQUIRED, ["향후관리계획"]));
                }else if(vm.futr_mng_plan_rslt == ""){
                    return alert(messageUtil(Message.VALIDATION_REQUIRED, ["향후관리계획결과"]));
                }

                frm.append('data', new Blob([ JSON.stringify(send) ], {type : "application/json"}));
                
                frm.append("filePath", "cmPlan");

                if(confirm("저장하시겠습니까?")){
                    Axios.post('/updateCmPlan.do',frm).then(function(){
                        vm.$emit('close',false);
                    })
                }else{
                    alert("저장을 취소 하였습니다.");
                }

            }else{
                if(confirm("완료 조치하시겠습니까?")){
                    Axios.post('/updateCmPlanCheck.do',send).then(function(){
                        vm.$emit('close',false);
                    })
                }
            }
		},
        fnFile: function(){
            let vm = this;
            let frm = new FormData();
            let fileData;
            for(let j=0; j<vm.filelist.length; j++) {
                fileData = vm.filelist[j];
                let key = fileData.file_seq;
                if(fileData.file != null) {
                    frm.append("fileTitle", fileData.file_title);
                    frm.append("uploadFiles", fileData.file);
                    frm.append("file_se", 1);
                    frm.append("key", 0)
                    if(fileData.file_sn){
                        frm.append("deleteFiles", fileData.file_sn);
                    }
                } else {
                    if(fileData.file == undefined){
                    }else{
                    }
                }
            }

            for(let j=0; j<vm.deletefilelist.length; j++){
                frm.append("deleteFiles", vm.deletefilelist[j]);
            }

            for(let j=0; j<vm.imgfilelist.length; j++) {
                fileData = vm.imgfilelist[j];
                let key = fileData.file_seq;
                if(fileData.file != null) {
                    frm.append("fileTitle", fileData.file_title);
                    frm.append("uploadFiles", fileData.file);
                    frm.append("file_se", 2);
                    frm.append("key", 0)
                    if(fileData.file_sn){
                        frm.append("deleteFiles", fileData.file_sn);
                    }
                } else {
                    if(fileData.file == undefined){
                    }else{
                    }
                }
            }

            for(let j=0; j<vm.imgdeletefilelist.length; j++){
                frm.append("deleteFiles", vm.imgdeletefilelist[j]);
            }

            vm.fnAdd(frm);
        },
		fnMultUserAdd: function(){
			let vm = this;
			//부모창에 선택한 값 전달
			vm.$parent.fnMultiMemberAdd(vm.checkList);
			//팝업 초기화
			vm.$parent.userPop = false;
		},
        fnClose:function(){
            this.$emit('close',false);
            this.$destroy();
        },
        fnCalendar: function(){
            let vm = this;
            $( ".datepicker" ).datepicker({
                changeMonth: true,
                changeYear: true,
                showMonthAfterYear: true, //타이틀영역 월이전 년출력 (년/월 순)
                dayNamesMin : ['일요일','월요일','화요일','수요일','목요일','금요일','토요일'], //요일 출력텍스트(축소형)
                monthNamesShort : ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'], //달 출력텍스트
                dateFormat: "yy-mm-dd", // 표기방법
                showOtherMonths : true, //현재월에 이전,다음달 날짜표시
                showOn: "both",
                buttonImage: "/img/ic-calendar.png",
                buttonImageOnly: true,
                buttonText: "날짜선택",
                showButtonPanel: true,
                closeText: '닫기',
                yearSuffix: '년',
                minDate:vm.cmplandetaillist.srng_dt,
                beforeShow: function() {
                    $(this).datepicker("widget").removeClass("datepicker-hide-days");
                    $(this).datepicker("widget").removeClass("datepicker-year-wrap");
                    if($(this).hasClass('month')) {
                        $(this).datepicker("widget").addClass("datepicker-hide-days");
                    } else if($(this).hasClass('year')) {
                        $(this).datepicker("widget").addClass("datepicker-year-wrap");
                    }
                },
                onSelect: function(dateText) { 
                    // console.log(dateText);
                    // console.log(vm.cmplandetaillist.srng_dt);
                    // var date1 = new Date(dateText);
                    // var date2 = new Date(vm.cmplandetaillist.srng_dt);

                    // if(date1 < date2){
                    //     console.log('');
                    // }else{
                    //     $("#actn_prnmnt_dt").val("");
                    //     alert("내부심사일자 보다 조치예정일");
                    // }
                }
            });
            $( ".datepicker.disabled" ).datepicker( "option", "disabled", true );
        },
        fnFileDelete: function(vm){
            this.deletefilelist = vm.deletefileList;
        },
        fnFilelist:function(vm){
            this.filelist = vm.filelist;
        },
        fnImgFileList:function(vm){
            this.imgfilelist = vm.viewModel.filelist;
        },
        fnImgFileDelete:function(vm){
            this.imgdeletefilelist = vm.viewModel.deletefileList;
        },
        fnFileDown:function(item){
            let vm = this;
            
            let send = {
                sn: item.sn,
                file_sn: item.file_sn,
                gbn:'cmPlan'
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
