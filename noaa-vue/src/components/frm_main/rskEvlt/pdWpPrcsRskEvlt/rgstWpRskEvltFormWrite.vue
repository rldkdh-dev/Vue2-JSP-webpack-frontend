<template>
    <div>
        <div class="contents write">
            <div>
                <h3>기본정보</h3>
                <table class="table horizontal write">
                    <caption>일일 작업장 위험성평가 등록</caption>
                    <tbody>
                        <tr>
                            <th scope="row" class="w180 essential"><label for="bplc">현장명</label></th>
                            <td>
                                <div class="input_group input_btn">
                                    <input type="text" id="bplc_nm" v-model="viewModel.data.bplc_nm" readonly @click="viewModel.userInfo.bplc_yn !='Y' ? fnBplcPopup() : ''">
                                    <input type="hidden" id="bplc" v-model="viewModel.data.bplc_sn">
                                    <label :for="'bplc_nm'" v-if="viewModel.userInfo.bplc_yn !='Y'"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-search"></use></svg></label>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row" class="essential">구분</th>
                            <td>
                                <label class="radio_label">소공정
                                    <input type="radio" :value="'SPCM'" name="type" v-model="type" @change="fnBplcChg">
                                    <span class="checkmark"></span>
                                </label>
                                <label class="radio_label">상시
                                    <input type="radio" :value="'PMNT'" name="type" v-model="type" @change="fnBplcChg">
                                    <span class="checkmark"></span>
                                </label>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row" class="essential"><label for="job_dt">작업일자</label></th>
                            <td>
                                <div class="datepicker_box">
                                    <input type="text" class="datepicker" id="job_dt" placeholder="작업일자" readonly>
                                </div>
                            </td>
                        </tr>
                        <tr v-if="type == 'PMNT'">
                            <th scope="row" class="essential"><label for="ordtm_risk_evl">상시위험성평가 선택</label></th>
                            <td>
                                <select title="상시위험성평가명" v-model="viewModel.data.ordtm_risk_evl_sn" @change="fnChangeOrdtm()" id="ordtm_risk_evl">
                                    <option value="">상시위험성평가 선택</option>
                                    <option v-for="(item, i) in viewModel.ordtmRiskList" :key="i" :value="item.ordtm_risk_evl_sn" >{{ item.work_type_nm }}_{{ item.team_nm }} ( {{ item.evl_bgng_dt|yyyyMMdd }} ~ {{ item.evl_end_dt|yyyyMMdd }} )</option>
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row" class="essential"><label for="bplc_team">팀명</label></th>
                            <td>
                                <select title="팀명 선택" v-model="viewModel.data.team_nm_sn" id="bplc_team" v-if="type=='SPCM'"  @change="fnGetCfnlItem()" >
                                    <option value=''>선택</option>
                                    <option v-for="item in viewModel.teamList" :value="item.TEAM_NM_SN">{{ item.TEAM_NM }}</option>
                                </select>
                                <select title="팀명 선택" v-model="viewModel.data.team_nm_sn" id="bplc_team" @change="fnTeamClick();" v-else>
                                    <option value=''>선택</option>
                                    <option v-for="item in viewModel.bplcTeamList" :value="item.BPLC_TEAM_SN">{{ item.BPLC_TEAM_NM }}</option>
                                </select>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- <div v-if="viewModel.teamList.length > 0" class="contents">
                <div>
                    <table class="table horizontal">
                        <caption>공종</caption>
                        <tbody>
                            <tr v-for="idx in Math.ceil((Number(viewModel.teamList.length)) / 6)">
                                <th scope="rowgroup" :rowspan="Math.ceil((Number(viewModel.teamList.length) ) / 6)" v-if="idx == 1" class="w100">공종</th>
                                <td v-for="cnt in 6">
                                    <label :for="'cnfl_'+viewModel.teamList[ ((idx - 1) * 6) + (cnt - 1) ].SPCM_RISK_EVL_SN" v-if="((idx - 1) * 6) + (cnt - 1) < viewModel.teamList.length">
                                        <input type="checkbox" :id="'cnfl_'+viewModel.teamList[ ((idx - 1) * 6) + (cnt - 1) ].SPCM_RISK_EVL_SN" name="cnfl" :value="viewModel.teamList[ ((idx - 1) * 6) + (cnt - 1) ].TEAM_NM" @change="fnGetCfnlItem(viewModel.teamList[ ((idx - 1) * 6) + (cnt - 1) ].SPCM_RISK_EVL_SN, $event)" v-model="teamChk">{{ viewModel.teamList[ ((idx - 1) * 6) + (cnt - 1) ].TEAM_NM }}
                                    </label>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="table_footer btn-right">
                    <button class="btn btn-gray" @click="fnRefresh();"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-refresh"></use></svg>초기화</button>
                </div>
            </div> -->

            <div>
                <h3>상시/소공정 위험성평가 위험성 감소대책 이행/점검 </h3>
                <div class="table_top btn-right">
                    <button class="btn btn-light-purple" @click="fnItemAdd();"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-wrap-text"></use></svg>추가</button>
                    <button class="btn btn-light-purple" @click="fnPrevInfo();"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-manage-search"></use></svg>이전정보가져오기</button>
                </div>
                <table class="table write">
                    <caption>추가 위험 및 대책 등록</caption>
                    <thead>
                        <th>팀명</th>
                        <th class="essential">단위작업</th>
                        <th class="essential">장비 공구</th>
                        <th class="essential">위험요소</th>
                        <th class="essential">안전대책</th>
                        <th></th>
                    </thead>
                    <tbody>
                        <tr v-for="(item, index) in viewModel.itemList">
                            <td v-if="index === 0 || item.spcm_risk_evl_sn !== viewModel.itemList[(index - 1)].spcm_risk_evl_sn" :rowspan="fnRowSpan(item, index)">
                                {{ item.bplc_team_nm }}
                            </td>
                            <td>
                                <textarea type="text" v-model="item.unit_job" :id="'unit_job_'+index"></textarea>
                            </td>
                            <td>
                                <textarea type="text" v-model="item.eqpmnt" :id="'eqpmnt_'+index"></textarea>
                            </td>
                            <td>
                                <textarea type="text" v-model="item.risk_factor" :id="'risk_factor_'+index"></textarea>
                            </td>
                            <td>
                                <textarea type="text" v-model="item.safe_cntrpln" :id="'safe_cntrpln_'+index"></textarea>
                            </td>
                            <td>
                                <div class="icon_box">
                                    <button @click.prevent="fnItemDel(index)" class="btn btn-icon"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-circle-minus"></use></svg></button>
                                </div>
                            </td>
                        </tr>
                        <tr v-if="viewModel.itemList.length == 0"><td :colspan="'5'">데이터가 없습니다.</td></tr>
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
    import Common from "../../../../common/js/common.js";
    import Message, {messageUtil} from "../../../../common/js/message";
    import fromValidation from "../../../../common/js/fromValidation";
    import bplc from "../../popup/bplc_popup.vue";
    
    export default {
        data: function() {
            return {
                type:'PMNT',
                bplcPop:false,
                popIndex: 0,
                mode:'',
                teamChk:[],
                viewModel:{
                    data:{
                        ordtm_risk_evl_sn:'',
                        team_nm_sn:'',
                    },
                    userInfo:{},
                    itemOrgList:[],
                    itemList:[],
                    orgItemList:[],
                    teamList:[],
                    ordtmRiskList:[],
                    bplcTeamList:[],
                },
                isSaved:false,
            };
        },
        components: {
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
                    vm.mode='update';
                    vm.fnDetail(sn);
                }else{
                    vm.mode='write';
                    //현장코드 있을 경우 그 값으로 세팅
                    vm.viewModel.data.bplc_sn = vm.viewModel.userInfo.bplc_sn == 0 ? '' : vm.viewModel.userInfo.bplc_sn;
                    vm.viewModel.data.bplc_nm = vm.viewModel.userInfo.bplc_sn == 0 ? '' : vm.viewModel.userInfo.bplc_nm;

                    if(vm.viewModel.data.bplc_sn != ''){
                        //vm.fnBplcTeamList();
                    }
                }
            },
            // fnBplcTeamList: function(){
            //     let vm = this;

            //     let send = {
            //         bplc_sn: vm.viewModel.data.bplc_sn,
            //     }

            //     Axios.post("/selectBplcTeamList.do", send)
            //     .then(function(response) {
            //         vm.viewModel.bplcTeamList = response.data.bplcTeamList;
            //         vm.viewModel.data.team_nm_sn = "";

            //         if(vm.viewModel.bplcTeamList.length == 0){
            //             alert("등록된 팀이 없습니다. 팀 등록후 등록 가능합니다.");
            //             return false;
            //         }
            //     })
            // },
            fnDetail: function(sn){
                let vm = this;

                let send = {
                    wrkshp_risk_evl_sn: sn,
                }

                Axios.post("/selectWpRskEvltFormDetail.do", send)
                .then(function(response) {
                    vm.viewModel.data = response.data.detail;
                    vm.viewModel.itemList = response.data.itemList;
                    vm.viewModel.ordtmRiskList = response.data.ordtmRiskList
                    
                    if(vm.viewModel.data.ordtm_risk_evl_sn == 0){
                        vm.type = 'SPCM';
                        vm.viewModel.orgItemList = response.data.smRiskListItem;
                        vm.viewModel.teamList = response.data.teamList;
                    }else{
                        vm.type = 'PMNT';
                        vm.viewModel.itemOrgList = response.data.ordtmRiskListItem;
                        vm.viewModel.bplcTeamList = response.data.bplcTeamList;
                    }
                }).then(function(){
                    vm.viewModel.data.ordtm_risk_evl_sn = vm.viewModel.data.ordtm_risk_evl_sn;
                    $("#job_dt").val(Common.fnConvertDateStr(vm.viewModel.data.job_dt, '-'));
                });
            },
            fnItemAdd: function() {
                let vm = this;
                vm.viewModel.itemList.push({});
            },
            fnItemDel: function(index) {
                let vm = this;
                vm.viewModel.itemList.splice(index, 1);
            },
            fnSave: function(){
                let vm = this;

                const valiData = [
                    {id: 'bplc_nm', type: 'select', title: '현장명'},
                    {id: 'job_dt', type: 'select', title: '작업일자'},
                    {id: 'bplc_team', type: 'select', title: '팀명'},
                ];
                
                if(vm.type == 'SPCM'){
                }else{
                    valiData.push({id: 'ordtm_risk_evl', type: 'select', title: '상시위험성평가'},)
                }

                if(!fromValidation(valiData)){
                    return false;
                }
                
                for(let i=0; i<vm.viewModel.itemList.length; i++){
                    if(vm.viewModel.itemList[i].length == 0){
                        alert("이행/점검할 항목을 입력해주세요.");
                        return false;
                    }else{
                        
                        let item = vm.viewModel.itemList[i];

                        if(item.unit_job == '' || item.unit_job == null || item.unit_job ==undefined){
                            alert("단위작업을 입력해주세요.");
                            $("#unit_job_"+i).focus();
                            return false;
                        }else if(item.eqpmnt == '' || item.eqpmnt == null || item.eqpmnt ==undefined){
                            alert("장비 공구를 입력해주세요.");
                            $("#eqpmnt_"+i).focus();
                            return false;
                        }else if(item.risk_factor == '' || item.risk_factor == null || item.risk_factor ==undefined){
                            alert("위험요소를 입력해주세요.");
                            $("#risk_factor_"+i).focus();
                            return false;
                        }else if(item.safe_cntrpln == '' || item.safe_cntrpln == null || item.safe_cntrpln ==undefined){
                            alert("안전대책을 입력해주세요.");
                            $("#safe_cntrpln_"+i).focus();
                            return false;
                        }
                    }
                }

                let data = {
                    reg_id: vm.viewModel.userInfo.user_id,
                    bplc_sn: vm.viewModel.data.bplc_sn,
                    job_dt: $("#job_dt").val(),
                    team_nm: vm.viewModel.data.team_nm_sn,
                    ordtm_risk_evl_sn: vm.viewModel.data.ordtm_risk_evl_sn,
                    wrkshp_risk_evl_sn: vm.viewModel.data.wrkshp_risk_evl_sn,
                    itemList: vm.viewModel.itemList
                }

                if(vm.viewModel.data.wrkshp_risk_evl_sn == undefined){
                    if(confirm(Message.CREATE_CONFIRM)){
                        $(".loading").show();
                        $("#mask").show();
                        Axios.post("/insertWpRskEvltForm.do", data).then(function(response) {
                            if(response.data == 1){
                                vm.isSaved = true;
                                vm.$router.push('/');
                                alert("저장되었습니다.");
                            }else if(response.data == 888){
                                let list = [];
                                if(vm.type == 'SPCM'){
                                    list = vm.viewModel.teamList.filter(item => item.TEAM_NM_SN == vm.viewModel.data.team_nm_sn);
                                    alert(list[0].TEAM_NM + "은 해당일자에 양식이 존재합니다.");
                                }else{
                                    list = vm.viewModel.bplcTeamList.filter(item => item.BPLC_TEAM_SN == vm.viewModel.data.team_nm_sn);
                                    alert(list[0].BPLC_TEAM_NM + "은 해당일자에 양식이 존재합니다.");
                                }
                            }else{
                                alert("?");
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
                        Axios.post("/updateWpRskEvltForm.do", data).then(function(response) {
                            if(response.data == 1){
                                vm.isSaved = true;
                                vm.$router.push('/');
                                alert("저장되었습니다.");
                            }else if(response.data == 999){
                                alert("등록된 일일 작업장 위험성평가가 존재하여 수정이 불가능합니다.");
                                return false;
                            }else if(response.data == 888){
                                let list = [];
                                if(vm.type == 'SPCM'){
                                    list = vm.viewModel.teamList.filter(item => item.TEAM_NM_SN == vm.viewModel.data.team_nm_sn);
                                    alert(list[0].TEAM_NM + "은 해당일자에 양식이 존재합니다.");
                                }else{
                                    list = vm.viewModel.bplcTeamList.filter(item => item.BPLC_TEAM_SN == vm.viewModel.data.team_nm_sn);
                                    alert(list[0].BPLC_TEAM_NM + "은 해당일자에 양식이 존재합니다.");
                                }
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
                }
            },
            fnBplcPopup: function() {
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

                if($("#job_dt").val() != ''){
                    vm.fnChngJobDt();
                }

                vm.fnBplcChg();
            },
            fnBplcChg: function(){
                //현장에 따른 팀명 가져오기
                
                let vm = this;

                //초기화
                vm.teamList = [];
                vm.viewModel.itemList = [];
                vm.viewModel.teamList = [];
                vm.viewModel.orgItemList = [];

                if(vm.viewModel.data.bplc_sn == '' || vm.viewModel.data.bplc_sn == undefined){
                    alert("현장을 선택해주세요.");
                    return false;
                }

                if(vm.type == 'SPCM'){
                    vm.viewModel.data.ordtm_risk_evl_sn = '';

                    let send = {
                        bplc_sn: vm.viewModel.data.bplc_sn,
                        gbn: 'wp',
                    }

                    //초기화
                    vm.teamChk = [];
                    vm.viewModel.orgItemList = [];

                    Axios.post("/selectSpcmTeamList.do", send)
                    .then(function(response) {
                        vm.viewModel.teamList = response.data.teamList;
                        vm.viewModel.orgItemList = response.data.itemList;
                        //vm.viewModel.bplcTeamList = response.data.bplcTeamList;

                        vm.viewModel.data.team_nm_sn = '';
                        if(vm.viewModel.teamList.length == 0){
                            alert("등록된 소공정이없거나 결재가 완료되지 않습니다.");
                        }
                    });
                }else{
                    //상시 select 초기화
                    vm.viewModel.data.ordtm_risk_evl_sn = '';
                }
                
            },
            fnChangeOrdtm: function(){
                let vm = this;

                let send = {
                    ordtm_risk_evl_sn: vm.viewModel.data.ordtm_risk_evl_sn,
                }

                Axios.post("/selectOrdtmRiskItemList.do", send)
                .then(function(response) {
                    vm.viewModel.itemList = response.data.ordtmRiskListItem
                    vm.viewModel.itemOrgList = response.data.ordtmRiskListItem;
                    vm.viewModel.bplcTeamList = response.data.bplcTeamList;

                    vm.viewModel.data.team_nm_sn = '';
                });
            },
            fnChngJobDt: function(){
                //작업일자 선택하면 상시위험성
                let vm = this;


                if(vm.type == 'PMNT'){
                    if(vm.viewModel.data.bplc_sn == '' || vm.viewModel.data.bplc_sn == undefined){
                        alert("현장을 선택해주세요.");
                        return false;
                    }

                    let send = {
                        bplc_sn: vm.viewModel.data.bplc_sn,
                        job_dt: $("#job_dt").val(),
                    }

                    Axios.post("/selectOrdtmRiskList.do", send)
                    .then(function(response) {
                        vm.viewModel.ordtmRiskList = response.data.ordtmRiskList
                        vm.viewModel.data.ordtm_risk_evl_sn = '';

                        if(vm.viewModel.ordtmRiskList.length == 0){
                            alert("등록된 상시위험성평가가 없습니다.");
                            vm.viewModel.ordtmRiskList = [];
                        }
                    });
                }
                
            },
            fnCalendar: function(){
                let vm = this;
                $( "#job_dt" ).datepicker({
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
                        vm.fnChngJobDt();
                    }
                });
                $( ".datepicker.disabled" ).datepicker( "option", "disabled", true );	
            },
            fnGetCfnlItem:function(){
                //공종명에 해당하는 우리기준 가져오기 
                let vm = this;
                
                let idx = vm.viewModel.teamList.findIndex(item => item.TEAM_NM_SN === vm.viewModel.data.team_nm_sn);

                vm.viewModel.itemList = [];
                let list = vm.viewModel.orgItemList.filter(data => data.spcm_risk_evl_sn == vm.viewModel.teamList[idx].SPCM_RISK_EVL_SN);

                for(let i=0; i<list.length; i++){
                    vm.viewModel.itemList.push(
                        {'unit_job': list[i].job_process_nm,
                        'risk_factor':list[i].main_risk_fctr,
                        'safe_cntrpln':list[i].safe_cntrpln,
                        'spcm_risk_evl_sn':list[i].spcm_risk_evl_sn,
                        'bplc_team_nm':list[i].bplc_team_nm}
                    );
                }



                // if($(event.target).prop("checked")){
                //     let list = vm.viewModel.orgItemList.filter(data => data.spcm_risk_evl_sn == spcm_risk_evl_sn);

                //     for(let i=0; i<list.length; i++){
                //         vm.viewModel.itemList.push(
                //             {'unit_job': list[i].job_process_nm,
                //             'risk_factor':list[i].main_risk_fctr,
                //             'safe_cntrpln':list[i].safe_cntrpln,
                //             'spcm_risk_evl_sn':list[i].spcm_risk_evl_sn,
                //             'bplc_team_nm':list[i].bplc_team_nm}
                //         );
                //     }

                // }else{
                //     for(let i=vm.viewModel.itemList.length-1; i>=0; i--){
                //         let sn = vm.viewModel.itemList[i].spcm_risk_evl_sn;

                //         if(spcm_risk_evl_sn == sn){
                //             vm.viewModel.itemList.splice(i, 1)
                //         }
                //     }
                // }   
            },
            fnRefresh: function(){
                let vm = this;
                
                if(vm.teamChk.length > 0){
                    if(!confirm("선택된 공종과 입력된 정보가 사라집니다. 그래도 초기화 하시겠습니까?")){
                        return false;
                    }else{
                        vm.teamChk = [];
                        vm.viewModel.itemList = [];
                    }
                }
            },
            fnTeamClick:function(){
                let vm = this;
                
                if(vm.viewModel.data.team_nm_sn != '' && vm.viewModel.data.team_nm_sn != null && vm.viewModel.data.team_nm_sn != undefined){
                    let item = vm.viewModel.bplcTeamList.filter(data=>data.BPLC_TEAM_SN == vm.viewModel.data.team_nm_sn)[0];

                    vm.viewModel.itemList = []; //초기화
                    vm.viewModel.itemList = vm.viewModel.itemOrgList.filter(data=> data.spcm_risk_evl_sn == item.SPCM_RISK_EVL_SN);
                }else{
                    vm.viewModel.itemList = vm.viewModel.itemOrgList;
                }
            },
            fnRowSpan: function(item, i){
                let rs = 1;
                while (
                    i + rs < this.viewModel.itemList.length &&
                    this.viewModel.itemList[i + rs].spcm_risk_evl_sn === item.spcm_risk_evl_sn
                ) {
                    rs++;
                }
                return rs;
            },
            fnPrevInfo: function(){
                let vm = this;

                if(vm.viewModel.data.bplc_sn == '' || vm.viewModel.data.bplc_sn == undefined){
                    alert("현장명을 선택해주세요.");
                    return false;
                }else if($("#job_dt").val() == ""){
                    alert("작업일자를 입력해주세요.");
                    return false;
                }else if(vm.type == "PMNT" && (vm.viewModel.data.ordtm_risk_evl_sn == '' || vm.viewModel.data.ordtm_risk_evl_sn == undefined)){
                    alert("상시위험성평가를 선택해주세요.");
                    return false;
                }else if(vm.viewModel.data.team_nm_sn == '' || vm.viewModel.data.team_nm_sn == undefined){
                    alert("팀명을 선택해주세요.");
                    return false;
                }else{
                    let data = {
                        bplc_sn: vm.viewModel.data.bplc_sn,
                        type: vm.type,
                        ordtm_risk_evl_sn: vm.viewModel.data.ordtm_risk_evl_sn,
                        team_nm_sn: vm.viewModel.data.team_nm_sn,
                        // work_type_nm: vm.viewModel.data.work_type_nm,
                    }

                    Axios.post("/selectWpRskPrevInfo.do", data)
                    .then(function(response) {
                        if(response.data.list.length != 0){
                            vm.viewModel.itemList = response.data.list
                        }else{
                            alert("일치하는 이전정보가 없습니다.");
                        }
                        
                    });
                }
            },
        }
    };
</script>
