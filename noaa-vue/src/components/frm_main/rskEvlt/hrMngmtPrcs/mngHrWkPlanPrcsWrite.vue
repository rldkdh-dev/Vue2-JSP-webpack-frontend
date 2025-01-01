<template>
<div>
    <div class="contents write">
        <div>
            <table class="table horizontal write">
                <caption>대형(고)위험 작업관리 등록</caption>
                <tbody>
                    <tr>
                        <th scope="row" class="essential"><label>위험구분</label></th>
                        <td colspan="3">
                            <label for="hgh_risk"><input type="radio" id="hgh_risk" name="risk_se" @change="fnJobTypeEvt()" v-model="viewModel.data.risk_se" value="LGZ_RISK">대형</label>
                            <label for="lgz_risk"><input type="radio" id="lgz_risk" name="risk_se" @change="fnJobTypeEvt()" v-model="viewModel.data.risk_se" value="HGH_RISK">고</label>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row" class="essential"><label>작업유형</label></th>
                        <td :colspan="(viewModel.data.job_type == 'ETC') ? 3 : 1">
                            <select title="작업유형" v-model="viewModel.data.job_type" id="job_type" style="width:200px">
                                <option value="" disabled>작업유형 선택</option>
                                <template v-for="(item, i) in viewModel.jobTypeList" :key="i">
                                <option :value=item.CODE>{{ item.CODE_NM }}</option>
                                </template>
                            </select>
                            <input type="text" id="text_etc" v-if="viewModel.data.job_type == 'ETC'" v-model="viewModel.data.job_type_etc" style="width:calc(100% - 205px)">
                        </td>
                    </tr>
                    <tr>
                        <th scope="row" class="essential"><label>위험명</label></th>
                        <td colspan="3">
                            <ul class="input_wrap">
                                <template v-for="(item, i) in viewModel.riskCodeList" :key="i">
                                    <li v-if="item.CODE == 'ETC'"><label :for="'chk_'+item.CODE"><input type="checkbox" :id="'chk_'+item.CODE" v-model="viewModel.data.risk_nm" :value="item.CODE_NM" @change="fnEtcToggleSelect()" >{{ item.CODE_NM }}</label>
                                        <input type="text" id="text_etc" :disabled="viewModel.isEtc == false" :value=viewModel.data.risk_nm_etc v-model="viewModel.data.risk_nm_etc"></li>
                                    <li v-else><label :for="'chk_'+item.CODE"><input type="checkbox" :id="'chk_'+item.CODE" v-model="viewModel.data.risk_nm" :value="item.CODE_NM">{{ item.CODE_NM }}</label></li>
                                </template>
                                <!-- <li><label for="chk_dr"><input type="checkbox" id="chk_dr" v-model="viewModel.data.risk_nm" value="추락">추락</label></li>
                                <li><label for="chk_cd"><input type="checkbox" id="chk_cd" v-model="viewModel.data.risk_nm" value="전도">전도</label></li>
                                <li><label for="chk_fa"><input type="checkbox" id="chk_fa" v-model="viewModel.data.risk_nm" value="낙하">낙하</label></li>
                                <li><label for="chk_cl"><input type="checkbox" id="chk_cl" v-model="viewModel.data.risk_nm" value="붕괴">붕괴</label></li>
                                <li><label for="chk_nr"><input type="checkbox" id="chk_nr" v-model="viewModel.data.risk_nm" value="협착">협착</label></li>
                                <li><label for="chk_fr"><input type="checkbox" id="chk_fr" v-model="viewModel.data.risk_nm" value="화재">화재</label></li>
                                <li><label for="chk_sc"><input type="checkbox" id="chk_sc" v-model="viewModel.data.risk_nm" value="질식">질식</label></li>
                                <li><label for="chk_etc"><input type="checkbox" id="chk_etc" v-model="viewModel.data.risk_nm" value="기타" @change="fnEtcToggleSelect()" >기타</label><input type="text" id="text_etc" :disabled="viewModel.isEtc == false" :value=viewModel.data.risk_nm_etc v-model="viewModel.data.risk_nm_etc"></li> -->
                            </ul>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row" class="essential"><label>대상현장</label></th>
                        <td>
                            <!-- <input type="text" id="bplcSn" v-model="viewModel.data.bplc_sn"> -->
                            <select title="사업장" id="bplcSn" v-model="viewModel.data.bplc_sn" disabled>
                                <option value="" disabled>사업장 선택</option>
                                <template v-for="(item, i) in viewModel.bplcList" :key="i">
                                <option :value=item.BPLC_SN>{{ item.BPLC_NM }}</option>
                                </template>
                            </select>
                        </td>
                        <!-- <th scope="row"><label>일정</label></th>
                        <td>
                            <div class="datepicker_box" style="float:left;width:33%;padding: 0 5px 5px 0;">
                                <input type="text" class="datepicker" id="jobStrtDate" placeholder="시작일정" value="">
                                <img class="ui-datepicker-trigger" src="/img/ic-calendar.png" alt="시작날짜선택" title="시작날짜선택">
                            </div>
                            <div class="datepicker_box" style="float:left;width:33%;padding: 0 5px 0 0;">
                                <input type="text" class="datepicker" id="jobEndDate" placeholder="종료일정" value="">
                                <img class="ui-datepicker-trigger" src="/img/ic-calendar.png" alt="종료날짜선택" title="종료날짜선택">
                            </div>
                            <div style="float:left;width:10%">
                                <button @click="fnSetAllJobWeek()" class="btn btn-small btn-blue" style="height:29px">추가</button>
                            </div>
                            <div id="jobDate" style="width:100%;float:left"></div>
                        </td> -->
                    </tr>
                    <tr>
                        <th scope="row" class="essential"><label>일정</label></th>
                        <td colspan="3">
                            <div class="input_group">
                                <div class="datepicker_box">
                                    <input type="text" class="datepicker" id="jobStrtDate" placeholder="시작일정" readonly>
                                </div>
                                <div class="datepicker_box">
                                    <input type="text" class="datepicker" id="jobEndDate" placeholder="종료일정" readonly>
                                </div>
                                <button class="btn btn-white" @click="fnSetAllJobWeek()"><svg class="icon"><use xlink:href="/img/symbol-defs.svg#icon-add-circle"></use></svg>추가</button>
                            </div>
                            <div class="input_wrap tag" id="jobDate">
                                <!-- <span tabindex="0">2023-08-14 ~ 2023-08-16 <button class="fx fx-ac"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-delete"></use></svg></button></span>
                                <span tabindex="0">2023-08-14 ~ 2023-08-16 <button class="fx fx-ac"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-delete"></use></svg></button></span> -->
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row" class="essential"><label>야간작업 여부</label></th>
                        <td>
                            <label for="nightY"><input type="radio" value="Y" v-model="viewModel.data.job_se" id="nightY">Y</label>
                            <label for="nightN"><input type="radio" value="N" v-model="viewModel.data.job_se" id="nightN">N</label>
                        </td>
                        <th scope="row"><label>라이브캠</label></th>
                        <td><label for="livecam_yn"><input type="checkbox" id="livecam_yn" true-value="Y" false-value="N" v-model="viewModel.data.livecam_yn" ></label></td>
                    </tr>
                    <tr>
                        <th scope="row" class="essential"><label>작업위치</label></th>
                        <td colspan="3"><textarea id="job_risk_factor" v-model="viewModel.data.job_risk_factor"></textarea></td>
                    </tr>
                    <tr>
                        <th scope="row" class="essential"><label>작업내용</label></th>
                        <td colspan="3"><textarea id="job_cn" v-model="viewModel.data.job_cn"></textarea></td>
                    </tr>
                    <tr>
                        <th scope="row" class="essential"><label>핵심이행사항</label></th>
                        <td colspan="3"><textarea id="atrz_stts" v-model="viewModel.data.atrz_stts"></textarea></td>
                    </tr>
                    <tr>
                        <th scope="row" class="essential"><label>점검자</label></th>
                        <td colspan="3"><input type="text" id="insctr" v-model="viewModel.data.insctr"></td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="btn-group btn-right">
            <a href="javascript:void(0)" class="btn btn-purple" @click.prevent="fnSave()"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-post-add"></use></svg>등록</a>
            <a href="#/" class="btn btn-white"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-list-back"></use></svg>목록</a>
        </div>
    </div>
</div>
</template>

<script>
    import "es6-promise/auto";
    import Vue from "vue";
    import Axios from "axios";
    import Message, {messageUtil} from "../../../../common/js/message";
    import fromValidation from "../../../../common/js/fromValidation";
    import board from "../../../../common/js/board";
    //import common from "../../../common";

    export default {
        components: {
            'board' : board
        },
        data: function() {
            return {
                imgsrc:'',
                viewModel:{
                    userInfo:{},
                    jobTypeList:[],
                    bplcList:[],
                    riskCodeList:[],
                    list: [],
                    isUpdate: 'N',
                    bplc_sn_key:'',
                    job_plan_sn_key:'',
                    isEtc:false,
                    weekList:[1,2,3,4,5],
                    data:{
                        bplc_sn:'',
                        risk_se:'LGZ_RISK',
                        risk_nm:[],
                        risk_nm_etc:'',
                        job_type:'',
                        job_type_etc:'',
                        jobDateList:[],
                        //jobWeek:'',
                        job_se:'N',
                        livecam_yn:'N',
                        job_risk_factor:'',
                        job_cn:'',
                        atrz_stts:'',
                        insctr:''
                    }
                },
                isSaved:false,
            };
        },
        watch:{ 
            //특수문자 입력
            // 'viewModel.data.job_risk_factor': function(){
            //     return this.viewModel.data.job_risk_factor =  this.viewModel.data.job_risk_factor.toString().replace(/[^0-9a-zA-Zㄱ-ㅎㅏ-ㅣ가-힣\]!@#$%^&*()_+\-=|,.<>/?{};:'"~`\n[ ]/g, '');
            // },
            // 'viewModel.data.job_cn': function(){
            //     return this.viewModel.data.job_cn =  this.viewModel.data.job_cn.toString().replace(/[^0-9a-zA-Zㄱ-ㅎㅏ-ㅣ가-힣\]!@#$%^&*()_+\-=|,.<>/?{};:'"~`\n[ ]/g, '');
            // },
            // 'viewModel.data.atrz_stts': function(){
            //     return this.viewModel.data.atrz_stts =  this.viewModel.data.atrz_stts.toString().replace(/[^0-9a-zA-Zㄱ-ㅎㅏ-ㅣ가-힣\]!@#$%^&*()_+\-=|,.<>/?{};:'"~`\n[ ]/g, '');
            // }
        },
        activated:function(){
            this.fnInit();
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

            //메뉴 타이틀 상세 타이틀 설정(상세,등록,수정)
            //board.fnGetMenuTitle(vm);

        },
        methods: {
             fnInit:function() {
                let vm = this;
                vm.viewModel.userInfo = vm.$store.state.global.userInfo;

                if(vm.viewModel.userInfo.bplc_sn != null) vm.viewModel.data.bplc_sn = vm.viewModel.userInfo.bplc_sn;

                let sn = vm.$route.params.sn;

                //위험명 리스트
                vm.fnRiskCodeList();

                if(sn != undefined) {
                    vm.viewModel.bplc_sn_key = sn.split(',')[0];
                    vm.viewModel.job_plan_sn_key = sn.split(',')[1];
                    vm.fnDetail();
                    vm.viewModel.isUpdate = 'Y';
                } else {
                    //작업유형 리스트
                    vm.fnJobTypeList();
                }

                //vm.fnGetWeek();

                //v-model로 바인딩하면 다른 input 입력시 초기값으로 돌아옴...
                //$('.datepicker').val(common.fnDateTimeStr(new Date()));
                calendarInput();

                vm.fnBplcList();
            },
            fnJobTypeEvt: function() {
                let vm = this;
                vm.viewModel.data.job_type = '';
                vm.fnJobTypeList();
            },
            fnEtcToggleSelect: function() {
                let vm = this;
                var riskNmArr = vm.viewModel.data.risk_nm;
                let isEtc = false;
                if(riskNmArr.length > 0) {
                    $.each(riskNmArr, function(idx, item) {
                        if(item.trim() == '기타') isEtc = true;
                    });
                }

                vm.viewModel.isEtc = isEtc;
                if(!isEtc) vm.viewModel.data.risk_nm_etc = '';
            },
            fnRiskCodeList: function() {
                let vm = this;
                let send = {
                    mapperId:'HrMngmtPrcs.selectRiskCodeList'
                };
                Axios.post("/selectRiskCodeList.do", send).then(function(response) {
                    vm.viewModel.riskCodeList = response.data;
                });
            },
            fnJobTypeList: function() {
                let vm = this;
                let send = {
                    mapperId:'HrMngmtPrcs.selectJobTypeList',
                    jobType: vm.viewModel.data.risk_se
                };

                Axios.post("/selectJobTypeList.do", send).then(function(response) {
                    vm.viewModel.jobTypeList = response.data;
                });
            },
            fnBplcList: function() { //사업장 리스트 추출(검색)
                let vm = this;
                let send = {
                    mapperId:'HrMngmtPrcs.selectBplcInfoList'
                };
                Axios.post("/selectBplcInfoList.do", send).then(function(response) {
                    vm.viewModel.bplcList = response.data;
                });
            },
            fnDetail:function() {
                let vm = this;

                let data = {
                    mapperId_LIST:'HrMngmtPrcs.selectHrWkPlanPrcsDetail',
                    mapperId_RVW:'HrMngmtPrcs.selectHrWkPlanPrcsRvwDetail',
                    bplc_sn_key: vm.viewModel.bplc_sn_key,
                    job_plan_sn_key: vm.viewModel.job_plan_sn_key
                }
                
                Axios.post("/selectHrWkPlanPrcsDetail.do", data).then(function(response) {
                    var resData = response.data.detail[0];
                    var detailRvw = response.data.detailRvw;
                    vm.viewModel.data.risk_se = resData.risk_se;

                    if(resData.job_type.indexOf('ETC') > -1) {
                        let job_type_etcArr = resData.job_type.split('\(');
                        vm.viewModel.data.job_type = job_type_etcArr[0];
                        vm.viewModel.data.job_type_etc = job_type_etcArr[1].replace('\)','');
                    } else {
                        vm.viewModel.data.job_type = resData.job_type;
                    }
                        

                    //console.log(' detailRvw : ' , detailRvw );

                    //위험명 데이터 바인딩..
                    var riskArr = resData.risk.split(',');
                    $.each(riskArr, function(idx, item) {
                        console.log("item.trim() " + item.trim());
                        let riskData = vm.viewModel.riskCodeList.filter(data=> data.CODE_NM == item.trim());
                        $('#chk_' + riskData.CODE).prop('checked', true);

                        if(item.trim().indexOf('기타(') > -1){
                            vm.viewModel.data.risk_nm.push('기타');
                            vm.viewModel.data.risk_nm_etc = item.trim().replace('(','').replace('기타','').replace(')','');
                        }else{
                            
                            vm.viewModel.data.risk_nm.push(item.trim());
                        }
                    });

                    vm.viewModel.data.bplc_sn = resData.bplc_sn;//대상현장 바인딩
                    vm.viewModel.data.job_risk_factor = resData.job_risk_factor;
                    vm.viewModel.data.job_cn = resData.job_cn;
                    vm.viewModel.data.atrz_stts = resData.atrz_stts;
                    vm.viewModel.data.insctr = resData.insctr;
                    vm.viewModel.data.livecam_yn = resData.livecam_yn;

                    //작업일정 상세 리스트..
                    $.each(detailRvw, function(idx, item) {
                        var jobDateStr = item.cstrn_bgng_dt + '~' + item.cstrn_end_dt;
                        let jobDateDiv = '<span tabindex="0">' + jobDateStr +
                                '<button class="delJobDate fx fx-ac" style="padding-left:5px" name="' + jobDateStr + '"><svg class="icon"><use xlink:href="/img/symbol-defs.svg#icon-delete"></use></svg></button></span>';

                        $('#jobDate').append(jobDateDiv);
                        
                        $('.delJobDate').on('click', function() {
                            let thisClass = $(this).attr('name');
                            $.each(vm.viewModel.data.jobDateList,function(idx,item) {
                                if(typeof item != 'undefined') {
                                    if(item == thisClass)
                                        vm.viewModel.data.jobDateList.splice(idx,1);
                                }
                            });
                            $(this).parent().remove();
                        });

                        vm.viewModel.data.jobDateList.push(jobDateStr);
                    });

                    //작업유형 리스트
                    vm.fnJobTypeList();
                });

                //기타 체크박스 toggle 상태
                setTimeout(function(){vm.fnEtcToggleSelect();},100);
            },
            fnGetWeek: function() {
                $(".datepicker").datepicker({
                    dateFormat: "yy-mm-dd",
                    regional: "ko"
                });
                // $(".datepicker").datepicker({
                //     regional: "ko"
                //     ,closeText: "닫기", prevText: "이전달", nextText: "다음달", currentText: "오늘", 
                //     dateFormat: 'yy-mm-dd' //Input Display Format 변경
                //     ,showOtherMonths: true //빈 공간에 현재월의 앞뒤월의 날짜를 표시
                //     ,showMonthAfterYear:true //년도 먼저 나오고, 뒤에 월 표시
                //     ,changeYear: true //콤보박스에서 년 선택 가능
                //     ,changeMonth: true //콤보박스에서 월 선택 가능                
                //     /*,showOn: "text"*/ //button:버튼을 표시하고,버튼을 눌러야만 달력 표시 ^ both:버튼을 표시하고,버튼을 누르거나 input을 클릭하면 달력 표시  
                //     ,buttonImage: "http://jqueryui.com/resources/demos/datepicker/images/calendar.gif" //버튼 이미지 경로
                //     ,buttonImageOnly: true //기본 버튼의 회색 부분을 없애고, 이미지만 보이게 함
                //     ,buttonText: "선택" //버튼에 마우스 갖다 댔을 때 표시되는 텍스트                
                //     ,yearSuffix: "년" //달력의 년도 부분 뒤에 붙는 텍스트
                //     ,monthNamesShort: ['1','2','3','4','5','6','7','8','9','10','11','12'] //달력의 월 부분 텍스트
                //     ,monthNames: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'] //달력의 월 부분 Tooltip 텍스트
                //     ,dayNamesMin: ['일','월','화','수','목','금','토'] //달력의 요일 부분 텍스트
                //     ,dayNames: ['일요일','월요일','화요일','수요일','목요일','금요일','토요일'] //달력의 요일 부분 Tooltip 텍스트
                //     //,minDate: "1d" //최소 선택일자(-1D:하루전, -1M:한달전, -1Y:일년전)
                //     //,maxDate: "+60d" //최대 선택일자(+1D:하루후, -1M:한달후, -1Y:일년후) 
                //     ,yearRange: "c-99:c+99"
                //     ,showButtonPanel: false
                // });
            },
            fnSetAllJobWeek: function() {
                let vm = this;

                if($('#jobStrtDate').val() == ""){
                    alert("일정의 시작일을 선택하고 추가를 눌러 주세요.");
                    $('#jobStrtDate').focus();
                    return false;
                }else if($('#jobEndDate').val() == ""){
                    alert("일정의 종료일을 선택하고 추가를 눌러 주세요.");
                    $('#jobEndDate').focus();
                    return false;
                }
                var jobDateTemp = $('#jobStrtDate').val() + '~' + $('#jobEndDate').val();
                let jobDateDiv = '<span tabindex="0">' + jobDateTemp +
                                '<button class="delJobDate fx fx-ac" style="padding-left:5px" name="' + jobDateTemp + '"><svg class="icon"><use xlink:href="/img/symbol-defs.svg#icon-delete"></use></svg></button></span>';
                
                $('#jobDate').append(jobDateDiv);
                
                $('.delJobDate').on('click', function() {
                    let thisClass = $(this).attr('name');
                    $.each(vm.viewModel.data.jobDateList,function(idx,item) {
                        if(typeof item != 'undefined') {
                            if(item == thisClass)
                                vm.viewModel.data.jobDateList.splice(idx,1);
                        }
                    });
                    $(this).parent().remove();
                });

                vm.viewModel.data.jobDateList.push(jobDateTemp);
            },
            fnSave: function() {
                let vm = this;
                let frm = new FormData();

                if(vm.viewModel.data.risk_se == '') {
                    alert('위험구분을 선택해 주세요.');
                    return;
                }
                if(vm.viewModel.data.risk_nm.length < 1) {
                    alert('위험명을 체크해 주세요.');
                    return;
                } else {
                    
                }

                if(vm.viewModel.data.job_se == '') {
                    alert('야간작업 여부를 체크해 주세요.');
                    return;
                }

                const valiData = [
                    {id: 'job_type', type: 'select', title: '작업유형'},
                    {id: 'bplcSn', type: 'select', title: '대상현장'},
                    //{id: 'jobDate', type: 'input', title: '일정'},
                    //{id: 'jobWeek', type: 'select', title: '주차'},
                    {id: 'job_risk_factor', type: 'input', title: '작업위치'},
                    {id: 'job_cn', type: 'input', title: '작업내용'},
                    {id: 'atrz_stts', type: 'input', title: '핵심이행사항'},
                    {id: 'insctr', type: 'input', title: '점검자'}
                ];
                
                if(!fromValidation(valiData)) {
                    return false;
                }

                if($('#jobDate span').length < 1) {
                    alert('일정은(는) 필수 입니다.');
                    return;
                }

                //vm.viewModel.data.jobDate = $('#jobDate').val();

                if(vm.viewModel.data.risk_nm_etc.length > 0 ) {
                    function findEtc(el) {
                        if(el == '기타') return true;
                    }

                    var etc = vm.viewModel.data.risk_nm.find(findEtc);
                    etc = etc + '(' + vm.viewModel.data.risk_nm_etc + ')';

                    for(var ii = 0; ii < vm.viewModel.data.risk_nm.length; ii++) {
                        if(vm.viewModel.data.risk_nm[ii] == '기타') {
                            vm.viewModel.data.risk_nm.splice(ii,1);
                            ii--;
                        }
                    }

                    vm.viewModel.data.risk_nm.push(etc);
                }
                
                let data = {
                    mapperId_ILIST:'HrMngmtPrcs.insertHrWkPlanPrcs',    
                    mapperId_IRVW:'HrMngmtPrcs.insertHrWkPlanPrcRvw',
                    mapperId_ULIST:'HrMngmtPrcs.updateHrWkPlanPrcs',
                    mapperId_DRVW:'HrMngmtPrcs.deleteHrWkPlanPrcsRvw',
                    isUpdate: vm.viewModel.isUpdate,
                    bplc_sn_key: vm.viewModel.bplc_sn_key,
                    job_plan_sn_key: vm.viewModel.job_plan_sn_key,
                    user_id: vm.viewModel.userInfo.user_id,
                    risk_se: vm.viewModel.data.risk_se,
                    risk_nm: vm.viewModel.data.risk_nm,
                    job_type: (vm.viewModel.data.job_type == 'ETC') 
                                ? vm.viewModel.data.job_type + '(' + vm.viewModel.data.job_type_etc + ')'
                                : vm.viewModel.data.job_type,
                    bplc_sn: vm.viewModel.data.bplc_sn,
                    jobDateList: vm.viewModel.data.jobDateList,
                    //jobWeek: vm.viewModel.data.jobWeek,
                    job_se: vm.viewModel.data.job_se,
                    livecam_yn: vm.viewModel.data.livecam_yn,
                    job_risk_factor: vm.viewModel.data.job_risk_factor,
                    job_cn: vm.viewModel.data.job_cn,
                    atrz_stts: vm.viewModel.data.atrz_stts,
                    insctr: vm.viewModel.data.insctr
                };

                //console.log(' data : ' , data );

                if(vm.viewModel.isUpdate == 'N') { //등록
                    if(confirm(Message.CREATE_CONFIRM)) {
                        Axios.post("/insertHrWkPlanPrcs.do", data).then(function(response) {
                            if(response.data > 0) {
                                vm.isSaved = true;
                                vm.$router.push('/');
                                alert(Message.CREATE_MESSAGE);
                            } else alert(Message.ERROR);
                        }).catch(function(ex) {
                            alert(Message.ERROR);
                        });
                    }
                } else {
                    if(confirm(Message.UPDATE_CONFIRM)) { //수정
                        Axios.post("/updateHrWkPlanPrcs.do", data).then(function(response) {
                            if(response.data > 0){
                                vm.isSaved = true;
                                vm.$router.push('/');
                                alert(Message.UPDATE_MESSAGE);
                            } else alert(Message.ERROR);
                        }).catch(function(ex) {
                            alert(Message.ERROR);
                        });
                    }
                }
            
            },
            fnInsert: function(){
                let regPass = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9])(?=.*[ㄱ-ㅎㅏ-ㅣ])$/;
                if (!regPass.test(pw)) {
                    alert
                    return false;
                } else {
                    return true;
                }
            }
        }
    };
</script>