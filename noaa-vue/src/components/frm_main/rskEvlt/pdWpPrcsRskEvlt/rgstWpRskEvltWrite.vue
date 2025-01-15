<template>
    <div>
        <div class="contents write">
            <div>
                <h3>기본정보</h3>
                <table class="table horizontal write">
                    <caption>일일 작업장 위험성평가 등록</caption>
                    <tbody>
                        <tr>
                            <th scope="row" class="w200 essential"><label for="bplc">현장명</label></th>
                            <td>
                                <div class="input_group input_btn">
                                    <input type="text" id="bplc_nm" v-model="viewModel.data.bplc_nm" readonly @click="viewModel.userInfo.bplc_yn !='Y' ? fnPopup() : ''">
                                    <input type="hidden" id="bplc" v-model="viewModel.data.bplc_sn">
                                    <label :for="'bplc_nm'" v-if="viewModel.userInfo.bplc_yn !='Y'"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-search"></use></svg></label>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row" class="essential"><label for="bplc">작성자</label></th>
                            <td>
                                {{ viewModel.data.reg_nm == undefined ? viewModel.userInfo.user_name : viewModel.data.reg_nm }}
                            </td>
                        </tr>
                        <tr>
                            <th scope="row" class="essential"><label for="chck_dt">점검일자</label></th>
                            <td>
                                <div class="datepicker_box">
                                    <input type="text" class="datepicker" id="chck_dt" placeholder="점검일자" title="chck_dt" readonly>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row" class="essential"><label for="ordtm_risk_evl">일일위험성평가 선택</label></th>
                            <td>
                                <select title="일일위험성평가명" v-model="viewModel.data.wrkshp_risk_evl_sn" id="wrkshp_risk_evl_sn" @click="fnSelectClick();">
                                    <option value="">일일위험성평가 선택</option>
                                    <option v-for="(item, i) in viewModel.teamList" :key="i" :value="item.wrkshp_risk_evl_sn" >{{ item.team_nm }} ( {{ item.job_dt|yyyyMMdd }} )</option>
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row" class="essential"><label for="team_nm">점검항목</label></th>
                            <td>
                                일일작업장 위험성평가
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">일일작업장 위험성평가표 첨부</th>
                            <td>
                                <imgsfileform :ref="'imgsfileform'" :pass="{id:'wpRisk'}" @filelist="fnImgFileList" @fileDelete="fnImgFileDelete"></imgsfileform>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="btn-group btn-right">
                <button class="btn btn-purple" @click.prevent="fnSave()"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-post-add"></use></svg>등록</button>
                <router-link to="/" class="btn btn-white"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-list-back"></use></svg>목록</router-link>
            </div>
        </div>
        <bplc ref="bplc" v-if="bplcPop==true" :pass="{dept_sn: viewModel.userInfo.dept_sn, team_sn: viewModel.userInfo.team_sn}"></bplc>
    </div>    
</template>

<script>
    import "es6-promise/auto";
    import Vue from "vue";
    import Axios from "axios";
    // import fileform from "../../../../common/vue/fileform2.vue";
    import imgsfileform from "../../../../common/vue/imgsfileform2.vue";
    import Common from "../../../../common/js/common.js";
    import Message, {messageUtil} from "../../../../common/js/message";
    import fromValidation from "../../../../common/js/fromValidation";
    import bplc from "../../popup/bplc_popup.vue";
    
    export default {
        data: function() {
            return {
                bplcPop:false,
                viewModel:{
                    data:{
                        wrkshp_risk_evl_sn:'',
                    },
                    userInfo:{},
                    teamList:[],
                    imgfilelist:[],
                    imgdeletefileList:[],
                    teamList:[]
                },
                isSaved:false,
            };
        },
        components: {
            'imgsfileform' : imgsfileform,
            'bplc' : bplc,
        },
        activated:function(){
            this.fnInit();
            this.fnCalendar();
        },
        deactivated:function(){
            this.$destroy();
        },
        beforeRouteLeave: function(to, from, next){
            let vm = this;
            if(!vm.isSaved){
                if(!confirm("페이지를 이동할 경우 현재 페이지는 저장되지 않습니다.\n그래도 나가시겠습니까?")){
                    return false;
                } 
            }
            next();
        },
        mounted: function() {
            let vm = this;
            // vm.fnInit();
            // vm.fnCalendar();
        },
        methods: {
            fnInit:function(){
                let vm = this;
                vm.viewModel.userInfo = vm.$store.state.global.userInfo;
                
                let sn = vm.$route.params.sn;

                if(sn != undefined){
                    vm.fnDetail(sn);
                }else{
                    //현장 여부 체크 'y'면 현장명 고정
                    vm.viewModel.data.bplc_sn = vm.viewModel.userInfo.bplc_sn == 0 ? '' : vm.viewModel.userInfo.bplc_sn;
                    vm.viewModel.data.bplc_nm = vm.viewModel.userInfo.bplc_sn == 0 ? '' : vm.viewModel.userInfo.bplc_nm;
                }

                
            },
            fnDetail: function(sn){
                let vm = this;

                let send = {
                    chck_sn: sn,
                }

                Axios.post("/selectWpRskEvltDetail.do", send)
                .then(function(response) {
                    vm.viewModel.data = response.data.detail;
                    vm.viewModel.imgfilelist = response.data.fileList;
                    vm.viewModel.teamList = response.data.teamList
                    // vm.viewModel.teamList = response.data.teamList;
                    console.log(vm.viewModel.imgfilelist);
                    vm.$refs.imgsfileform.fnFileLoadList(vm.viewModel.imgfilelist);
                }).then(function(){
                    $("#chck_dt").val(vm.viewModel.data.chck_dt);
                });
            },
            // fnFilelist:function(vm){
            //     this.viewModel.filelist = vm.filelist;
            //     this.viewModel.fileGroup = vm.fileGroup;
            // },
            // fnFileDelete: function(vm){
            //     this.viewModel.deletefileList = vm.deletefileList;
            // },
            fnImgFileList:function(vm){
                this.viewModel.imgfilelist = vm.viewModel.filelist;
            },
            fnImgFileDelete: function(vm){
                this.viewModel.imgdeletefileList = vm.viewModel.deletefileList;
            },
            fnSave: function(){
                let vm = this;

                let frm = new FormData();
                for(let i=0; i<vm.viewModel.imgfilelist.length; i++) {
                    let key = vm.viewModel.imgfilelist[i].file_seq;
                    if(vm.viewModel.imgfilelist[i].file != null) {
                        frm.append("fileTitle", vm.viewModel.imgfilelist[i].file_title);
                        frm.append("uploadFiles", vm.viewModel.imgfilelist[i].file);
                        if(vm.viewModel.imgfilelist[i].file_sn){
                            frm.append("deleteFiles", vm.viewModel.imgfilelist[i].file_sn);
                        }
                        frm.append("key", 0)
                    } else {
                        if(vm.viewModel.imgfilelist[i].file == undefined){
                            
                        }else{
                            frm.append("fileTitle", vm.viewModel.imgfilelist[i].file_title);
                            frm.append("key", key)
                        }
                    }
                }
                for(let i=0; i<vm.viewModel.imgdeletefileList.length; i++){
                    frm.append("deleteFiles", vm.viewModel.imgdeletefileList[i]);
                }

                const valiData = [
                    {id: 'bplc_nm', type: 'select', title: '현장명'},
                    {id: 'wrkshp_risk_evl_sn', type: 'select', title: '일일위험성평가'},
                    {id: 'chck_dt', type: 'select', title: '점검일자'},
                ];

                if(!fromValidation(valiData)){
                    return false;
                }

                let data = {
                    reg_id: vm.viewModel.userInfo.user_id,
                    bplc_sn: vm.viewModel.data.bplc_sn,
                    team_nm: vm.viewModel.teamList.filter(data=>data.wrkshp_risk_evl_sn == vm.viewModel.data.wrkshp_risk_evl_sn)[0].team_nm,
                    ordtm_risk_evl_sn: vm.viewModel.teamList.filter(data=>data.wrkshp_risk_evl_sn == vm.viewModel.data.wrkshp_risk_evl_sn)[0].ordtm_risk_evl_sn,
                    chck_dt: $("#chck_dt").val(),
                    wrkshp_risk_evl_sn: vm.viewModel.data.wrkshp_risk_evl_sn,
                    chck_sn: vm.viewModel.data.chck_sn,
                }

                frm.append('data', new Blob([ JSON.stringify(data) ], {type : "application/json"}));
                
                frm.append("filePath", "pdWpPrcsRskEvlt");

                if(vm.viewModel.data.chck_sn == undefined){
                    $(".loading").show();
                    $("#mask").show();
                    if(confirm(Message.CREATE_CONFIRM)){
                        Axios.post("/insertWpRskEvlt.do", frm).then(function(response) {
                            if(response.data == 1){
                                vm.isSaved = true;
                                vm.$router.push('/');
                                alert("저장되었습니다.");
                            }else{
                                alert(Message.ERROR);
                            }
                        }).catch(function(ex) {
                            alert(Message.ERROR);
                        }).finally(function(){
                            $(".loading").hide();
                            $("#mask").hide();
                        });
                    }
                }else{
                    if(confirm(Message.UPDATE_CONFIRM)){
                        $(".loading").show();
                        $("#mask").show();
                        Axios.post("/updateWpRskEvlt.do", frm).then(function(response) {
                            if(response.data == 1){
                                vm.isSaved = true;
                                vm.$router.push('/');
                                alert("저장되었습니다.");
                            }
                        }).catch(function(ex) {
                            alert(Message.ERROR);
                        }).finally(function(){
                            $(".loading").hide();
                            $("#mask").hide();
                        });
                    }
                }
                
            },
            fnPopup: function(){
                let vm = this;
				vm.bplcPop=true;
				vm.$nextTick(function() {
					if(vm.bplcPop) {
						vm.$refs.bplc.fnInit();
					}
				})
            },
            fnBplcAdd: function(item){
                let vm = this;

                vm.viewModel.data.bplc_sn = item.bplc_sn;
                vm.viewModel.data.bplc_nm = item.bplc_nm;

                if($("#chck_dt").val() != ''){
                    vm.fnChngChckDt();
                }
            },
            fnChngChckDt: function(){
                //현장에 따른 팀명 가져오기
                let vm = this;

                if(vm.viewModel.data.bplc_sn == '' || vm.viewModel.data.bplc_sn == undefined){
                    // alert("현장을 선택해주세요.");
                    return false;
                }

                let send = {
                    bplc_sn: vm.viewModel.data.bplc_sn,
                    chck_dt: $("#chck_dt").val(),
                }

                Axios.post("/selectWpTeamList.do", send)
                .then(function(response) {
                    vm.viewModel.teamList = response.data.list
                    vm.viewModel.data.wrkshp_risk_evl_sn = '';

                    if(vm.viewModel.teamList.length == 0){
                        alert("일일작업장위험성평가 양식이 없습니다.");
                    }
                });
            },
            fnCalendar: function(){
                let vm = this;
                $( "#chck_dt" ).datepicker({
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
                    beforeShow: function() {
                        $(this).datepicker("widget").removeClass("datepicker-hide-days");
                        $(this).datepicker("widget").removeClass("datepicker-year-wrap");
                        if($(this).hasClass('month')) {
                            $(this).datepicker("widget").addClass("datepicker-hide-days");
                        } else if($(this).hasClass('year')) {
                            $(this).datepicker("widget").addClass("datepicker-year-wrap");
                        }
                    },
                    onSelect: function(dateText, inst) { 
                        vm.fnChngChckDt();
                    }
                });
                $( ".datepicker.readonly" ).datepicker( "option", "readonly", true );	
            },
            fnSelectClick: function(){
                let vm = this;
                if(vm.viewModel.data.bplc_sn == '' || vm.viewModel.data.bplc_sn == undefined || vm.viewModel.data.bplc_sn == null){
                    alert("현장명을 선택해주세요.");
                    return false;
                }else if($("#chck_dt").val() == ""){
                    alert("점검일자를 선택해주세요.");
                    return false;
                }
            },  
        }
    };
</script>
