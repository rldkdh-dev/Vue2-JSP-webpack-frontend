<template>
    <div>
        <div class="search_area">
            <button class="btn_toggle_search">검색</button>
            <div>
                <div class="search_container">
                    <div class="row">
                        <div class="input_group" style="width:20rem">
                            <select id="list" v-model="viewModel.bplc_use_yn" class="wp28">
                                <option value="A">전체</option>
                                <option value="Y" selected="selected">운영</option>
                                <option value="N">종료</option>
                            </select>
                            <select title="현장명" v-model="viewModel.bplc_sn_key">
                                <option value=''>현장명 선택</option>
                                <template v-for="(item, i) in viewModel.bplcList" :key="i">
                                    <option :value=item.bplc_sn>{{ item.bplc_nm }}</option>
                                </template>
                            </select>
                        </div>
                        <!-- <div class="input_group">
                            <div class="datepicker_box">
                                <input type="text" class="datepicker" id="" title="datepicker" placeholder="공사시작일" readonly>
                            </div>
                            <label>~</label>
                            <div class="datepicker_box">
                                <input type="text" class="datepicker" id="" title="datepicker" placeholder="공사종료일" readonly>
                            </div>
                        </div>
                        <input type="text" placeholder="검색어를 입력하세요." title="검색어 입력" v-model="viewModel.search.text" v-on:keyup.enter="fnChangeJobWeek"> -->
                    </div>
                </div>
                <div class="btn-group">
                    <a href="javascript:void(0)" class="btn btn-default-line" @click="fnInitSearchLine"><svg class="icon"><use xlink:href="/img/symbol-defs.svg#icon-refresh"></use></svg>초기화</a>
                    <a href="javascript:void(0)" class="btn btn-default" @click="fnChangeJobWeek"><svg class="icon"><use xlink:href="/img/symbol-defs.svg#icon-search"></use></svg>검색</a>
                </div>
            </div>
        </div>
        <div class="contents">
            <div>
                <div class="table_top">
                    <div></div>
                    <button class="btn btn-white" @click="fnDownload" style="margin-right:1rem"><i class="icon_pdf"></i>PDF다운로드</button>
                    <select title="" class="w140" v-model="viewModel.selectedJobWeek" @change="fnChangeJobWeek()">
                        <template v-for="(item, i) in viewModel.jobWeekList" :key="i">
                        <!-- <option :value="item.JOB_YEAR+'년 '+item.JOB_MONTH+'월 '+item.JOB_WEEK+'주차'">{{ item.JOB_YEAR }}년 {{ item.JOB_MONTH }}월 {{ item.JOB_WEEK }}주차</option> -->
                        <option :value="[item.JOB_YEAR,item.JOB_MONTH,item.JOB_WEEK]">{{ item.JOB_YEAR }}-{{ item.JOB_MONTH }}({{ item.JOB_WEEK }}주차)</option>
                        </template>
                    </select>
                </div>
                <div id="viewDiv"  class="a4">
                    <table class="table"  v-if="viewModel.data.length > 0">
                        <caption>대형(고)위험 주차별 상세보기</caption>
                        <thead>
                            <tr>
                                <th scope="col" rowspan="2">대상현장</th>
                                <th scope="col" rowspan="2">위험구분</th>
                                <th scope="col" rowspan="2">위험명</th>
                                <th scope="col" rowspan="2">라이브캠</th>
                                <th scope="col" rowspan="2">야간작업</th>
                                <th scope="col" rowspan="2">작업유형</th>
                                <th scope="col" rowspan="2">작업위치</th>
                                <th scope="col" rowspan="2">작업내용</th>
                                <th scope="colgroup" colspan="7">일정 - {{ viewModel.data[0].job_month }}월 {{ viewModel.data[0].job_week }}주차</th>
                                <th scope="col" rowspan="2">핵심이행사항</th>
                                <th scope="col" rowspan="2" class="w160">점검자</th>
                            </tr>
                            <tr class="calendar_week">
                                <th v-for="(item, i) in viewModel.data.rvwArr" :key="i" scope="col" :class="i==(viewModel.data.rvwArr.length-1) ? 'sun' : (i==(viewModel.data.rvwArr.length-2) ? 'sat' : '')">{{ item }}</th>
                            </tr>
                        </thead>
                        <tbody class="calendar_week">
                            <tr v-for="(itemA, A) in viewModel.data" :key="A">
                                <td class="text-left">{{ itemA.bplc_nm }}</td>
                                <td>{{ itemA.risk_nm }}</td>
                                <td>{{ itemA.risk }}</td>
                                <td>{{ itemA.livecam_yn == 'Y' ? '유' : '무' }}</td>
                                <td>{{ itemA.job_se == 'Y' ? '유' : '무' }}</td>
                                <td class="text-left">{{ itemA.job_type_text }}</td>
                                <td class="text-left pre">{{ itemA.job_risk_factor }}</td>
                                <td class="text-left pre">{{ itemA.job_cn }}</td>
                                <td v-for="(itemB, B) in viewModel.data.rvwArr" :key="B">
                                    <div v-for="(itemC, C) in viewModel.rvwData" 
                                    :class="(itemA.bplc_sn == itemC.bplc_sn && itemA.job_plan_sn == itemC.job_plan_sn) ? 
                                    (itemB==Number(itemC.cstrn_bgng_dt.split('-')[2]) ? 'bar x'+itemC.bgng_end_between_days : '') : ''"></div>
                                </td>
                                <td class="text-left pre">{{ itemA.atrz_stts }}</td>
                                <td>{{ itemA.insctr }}</td>
                            </tr>
                        </tbody>
                    </table>
                    <table class="table" v-else>
                        <thead>
                            <tr>
                                <th scope="col" rowspan="2">대상 현장</th>
                                <th scope="col" rowspan="2">위험명</th>
                                <th scope="col" rowspan="2">라이브<br>촬영</th>
                                <th scope="col" rowspan="2">작업 및 위험요소</th>
                                <th scope="col" rowspan="2">작업내용</th>
                                <th scope="colgroup" colspan="7">일정 - 월 주차</th>
                                <th scope="col" rowspan="2">핵심이행사항</th>
                                <th scope="col" rowspan="2" class="w160">점검자</th>
                            </tr>
                        </thead>
                        <tbody class="calendar_week">
                            <tr><td colspan="14">조회된 데이터가 없습니다.</td></tr>
                        </tbody>
                    </table>
                </div>
                <div class="table_footer btn-right">
                    <div class="btn-group"> 
                        <router-link to="/" class="btn btn-white"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-list-back"></use></svg>목록</router-link>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
    
<script>
    import "es6-promise/auto";
    import Vue from "vue";
    import Axios from "axios";
    import board from "../../../../common/js/board";
    
    export default {
        data: function() {
            return {
                viewModel:{
                    list: [],
                    searchBplcList: [],
                    chkTypeList: [],
                    pager: {
                        model: {},
                        pageNo: 1,
                        totalSize: 0,
                        rowSize: 10,
                        blockSize: 10,
                        list: [],
                        callBack: function (n) {
                            try{
                                this.model.fnList(n);
                            } catch(e){
                                console.log('callback error  ' + e);
                            }
                        }
                    },
                    userInfo:{},
                    search:{
                        bplc_sn:'',
                        text:''
                    },
                    data:[],
                    bplc_use_yn:'',
                    bplc_sn_key:'',
                    job_plan_sn_key:'',
                    bplcList:[],
                    rvwData:[],
                    rowspanCnt:0,
                    jobWeekList:[],
                    selectedJobWeek:[],
                    jobWeekObj:{}
                }
            };
        },
        components: {
        },
        watch:{
            'viewModel.bplc_use_yn':{
                handler() {
                    let vm = this;
                    if(vm.viewModel.userInfo.user_roles == 'ROLE_001'){
                        vm.fnBplcList();
                    }
                }
            }
        },
        mounted: function() {
            let vm = this;
            let sn = vm.$route.params.sn;
            vm.viewModel.userInfo = vm.$store.state.global.userInfo;

            //console.log(' sn : ' , sn );

            //캘린더
            calendarInput();

            if(typeof sn != 'undefined') {
                vm.viewModel.bplc_sn_key = sn.split(',')[0];
                vm.viewModel.job_plan_sn_key = sn.split(',')[1];
            } else {
                vm.viewModel.bplc_sn_key = '';
                vm.viewModel.job_plan_sn_key = '';
            }

            //메뉴 타이틀 상세 타이틀 설정(상세,등록,수정)
            //board.fnGetMenuTitle(vm);
            vm.fnInitSearchLine();
            // vm.fnBplcList();
            vm.fnGetJobWeekList();
        },
        methods: {
            fnBplcList: function(){
                let vm = this;
                let data = {
                    mapperId: 'comm.selectAllBplcList',
                    bplc_use_yn: vm.viewModel.bplc_use_yn,
                    dept_sn: vm.viewModel.userInfo.dept_sn,
                    team_sn: vm.viewModel.userInfo.team_sn,
                };
                Axios.post("/list.do", data).then(function (rs) {
                    vm.viewModel.bplcList = rs.data.list;

                    vm.viewModel.bplc_sn_key = '';
                    if(vm.viewModel.userInfo.bplc_use_yn == 'Y' && vm.viewModel.bplc_use_yn == 'Y'){
                        vm.viewModel.bplc_sn_key = vm.viewModel.userInfo.bplc_sn == 0 ? '' : vm.viewModel.userInfo.bplc_sn;
                    }

                });
            },
            fnInitSearchLine : function() {
                let vm = this;
                
                vm.viewModel.bplc_sn_key =  (vm.viewModel.userInfo.bplc_yn == 'N' && (vm.viewModel.userInfo.bplc_sn == 0 || vm.viewModel.userInfo.bplc_use_yn == 'N')) ? '' : vm.viewModel.userInfo.bplc_sn;
                vm.viewModel.bplc_use_yn = vm.viewModel.userInfo.bplc_yn == 'N' ? 'Y' : 'A';
            },
            fnChangeJobWeek: function() {
                let vm = this;
                let selectedJobWeekTemp = typeof vm.viewModel.selectedJobWeek == 'undefined' ? {} : vm.viewModel.selectedJobWeek;
                
                //console.log(' selectedJobWeekTemp : ' , selectedJobWeekTemp);

                vm.viewModel.jobWeekObj = {
                    JOB_YEAR: selectedJobWeekTemp[0],
                    JOB_MONTH: selectedJobWeekTemp[1],
                    JOB_WEEK: selectedJobWeekTemp[2]
                };

                vm.fnDetail();
            },
            fnGetJobWeekList: function() {
                let vm = this;
                let send = {
                    mapperId:'HrMngmtPrcs.selectJobWeekList',
                    bplc_use_yn:vm.viewModel.bplc_use_yn,
                    dept_sn: vm.viewModel.userInfo.dept_sn,
                    team_sn: vm.viewModel.userInfo.team_sn,
                };
                Axios.post("/selectJobWeekList.do", send).then(function(response) {
                    // const today = new Date();
                    // const year = today.getFullYear();
                    // const month = ('0' + (today.getMonth() + 1)).slice(-2);
                    // const getWeek = (today) => {
                    //     const currentDate = today.getDate();
                    //     const firstDay = new Date(today.setDate(1)).getDay();

                    //     return Math.ceil((currentDate + firstDay) / 7);
                    // };

                    // const week = getWeek(new Date(today));
                    // //const jobWeek = year + '년 ' + month + '월 ' + week + '주차';

                    

                    vm.viewModel.jobWeekList = response.data;
                    let jobWeekListTemp = vm.viewModel.jobWeekList;

                    vm.viewModel.selectedJobWeek = [jobWeekListTemp[0].JOB_YEAR,jobWeekListTemp[0].JOB_MONTH,jobWeekListTemp[0].JOB_WEEK];
                    vm.viewModel.jobWeekObj = {
                        JOB_YEAR: jobWeekListTemp[0].JOB_YEAR,
                        JOB_MONTH: jobWeekListTemp[0].JOB_MONTH,
                        JOB_WEEK: jobWeekListTemp[0].JOB_WEEK
                    };

                    vm.fnDetail();
                });
            },
            fnDetail:function(){
                let vm = this;
                let data = {
                    mapperId_LIST:'HrMngmtPrcs.selectHrWkPlanPrcsDetail',
                    mapperId_RVW:'HrMngmtPrcs.selectHrWkPlanPrcsRvwDetail',
                    bplc_sn_key: vm.viewModel.bplc_sn_key,
                    job_plan_sn_key: vm.viewModel.job_plan_sn_key,
                    job_year: vm.viewModel.jobWeekObj.JOB_YEAR,
                    job_month: vm.viewModel.jobWeekObj.JOB_MONTH,
                    job_week: vm.viewModel.jobWeekObj.JOB_WEEK,
                    bplc_use_yn: vm.viewModel.bplc_use_yn,
                    dept_sn: vm.viewModel.userInfo.dept_sn,
                    team_sn: vm.viewModel.userInfo.team_sn,
                }

                Axios.post("/selectHrWkPlanPrcsDetail.do", data).then(function(response) {
                    vm.viewModel.data = response.data.detail;
                    vm.viewModel.rvwData = response.data.detailRvw;

                    //console.log('rvwData : ' , vm.viewModel.rvwData);

                    if(vm.viewModel.rvwData.length > 0)
                        vm.viewModel.data.rvwArr = vm.viewModel.rvwData[0].bgng_end_between_daysArr;
                    else
                        vm.viewModel.data.rvwArr = ['-','-','-','-','-','-','-'];
                    
                    //주차 날짜 생성..
                    // let thisYear = Number(vm.viewModel.jobWeekObj.JOB_YEAR);
                    // let thisMonth = Number(vm.viewModel.jobWeekObj.JOB_MONTH)-1;
                    // let thisWeek = Number(vm.viewModel.jobWeekObj.JOB_WEEK)-1;

                    // let weekObjArr = vm.searchPeriodCalculation(thisYear,thisMonth);
                    // let thisWeekDate = weekObjArr[thisWeek];

                    // var frstDayOfWeek = Number(thisWeekDate.weekStartDate.split('-')[2]);
                    // var lastDayOfWeek = Number(thisWeekDate.weekEndDate.split('-')[2]);

                    // var rvwArr = [];
                    // for(var ii = frstDayOfWeek; ii <= lastDayOfWeek; ii++) {
                    //     rvwArr.push(ii);
                    // }
                    // vm.viewModel.data.rvwArr = rvwArr;
                });

            },
            numberPad: function(num, width) {
                num = String(num);
                return num.length >= width ? num : new Array(width - num.length + 1).join("0") + num;
            },
            searchPeriodCalculation: function(cYear,cMonth) {
                let vm = this;
                // let cYear = document.getElementById("choiceYear").value;
                // let cMonth = document.getElementById("choiceMonth").value.replace(/(^0+)/, "") - 1;
                // 날짜형으로 데이트 포맷
                let date = new Date(cYear, cMonth);

                // 월요일을 중심으로한 주차 구하기( JS기준 : 일요일 0 월요일 1 ~ 토요일 6 )
                let firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
                let lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
                let weekObj = null;
                let weekObjArray = new Array();
                let weekStand = 8;  // 월요일 고정
                let firstWeekEndDate = true;
                let thisMonthFirstWeek = firstDay.getDay();
                for(var num = 1; num <= 6; num++) {
                    // 마지막월과 첫번째월이 다른경우 빠져나온다.
                    if(lastDay.getMonth() != firstDay.getMonth()) {
                        break;
                    }
                    weekObj = new Object();
                    // 한주의 시작일은 월의 첫번째 월요일로 설정
                    if(firstDay.getDay() <= 1) {
                        // 한주의 시작일이 일요일이라면 날짜값을 하루 더해준다.
                        if(firstDay.getDay() == 0) { firstDay.setDate(firstDay.getDate() + 1); }
                        weekObj.weekStartDate =
                            firstDay.getFullYear().toString()
                            + "-"
                            + vm.numberPad((firstDay.getMonth() + 1).toString(), 2)
                            + "-"
                            + vm.numberPad(firstDay.getDate().toString() , 2);
                    }

                    if(weekStand > thisMonthFirstWeek) {
                        if(firstWeekEndDate) {
                            if((weekStand - firstDay.getDay()) == 1) {
                                firstDay.setDate(firstDay.getDate() + (weekStand - firstDay.getDay()) - 1);
                            }
                            if((weekStand - firstDay.getDay()) > 1) {
                                firstDay.setDate(firstDay.getDate() + (weekStand - firstDay.getDay()) - 1)
                            }
                            firstWeekEndDate = false;
                        } else {
                            firstDay.setDate(firstDay.getDate() + 6);
                        }
                    } else {
                        firstDay.setDate(firstDay.getDate() + (6 - firstDay.getDay()) + weekStand);
                    }

                    // 월요일로 지정한 데이터가 존재하는 경우에만 마지막 일의 데이터를 담는다.
                    if(typeof weekObj.weekStartDate !== "undefined") {
                        weekObj.weekEndDate =
                            firstDay.getFullYear().toString()
                            + "-"
                            + vm.numberPad((firstDay.getMonth() + 1).toString(), 2)
                            + "-"
                            + vm.numberPad(firstDay.getDate().toString(), 2);
                        weekObjArray.push(weekObj);
                    }
                    firstDay.setDate(firstDay.getDate() + 1);
                }
                //console.log( weekObjArray );
                return weekObjArray;
            },
            fnDownload: function(){
                let vm = this;
                
                if(vm.viewModel.data.length == 0){
                    alert("조회된 데이터가 없습니다.");
                    return false;
                }
                let imgDataList = [];
                $('#viewDiv.a4').each(function (index, item) {
                    html2canvas(item, {
                        scale: 3
                    }).then(function (canvas) {
                        // 캔버스를 이미지로 변환
                        let imgData = canvas.toDataURL('image/jpeg');

                        imgDataList.push({'img':imgData});

                        let data = {
                            fileNm: '대형(고)위험작업계획관리_' + vm.viewModel.data[0].job_year + '-' + vm.viewModel.data[0].job_month + '(' + vm.viewModel.data[0].job_week + '주차).pdf',
                            imgData: imgDataList,
                            type: 'l'
                        };

                        $(".loading").show();
                        $("#mask").show();

                        Axios.post("/downloadPdf.do",data, {
                            responseType: 'blob',
                        }).then(function(e) {
                            const url = window.URL.createObjectURL(new Blob([e.data], { type: e.headers["content-type"] }))
                            const link = document.createElement("a")
                            link.href = url
                            link.download = '대형(고)위험작업계획관리_' + vm.viewModel.data[0].job_year + '-' + vm.viewModel.data[0].job_month + '(' + vm.viewModel.data[0].job_week + '주차).pdf'
                            link.click()
                            window.URL.revokeObjectURL(url)
                        }).finally(function(){
                            $(".loading").hide();
                            $("#mask").hide();
                        });
                    });
                });
            },
        }
    };
</script>;