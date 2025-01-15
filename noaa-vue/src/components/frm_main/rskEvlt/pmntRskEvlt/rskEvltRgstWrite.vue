<template>
    <div>
        <div class="contents write">
            <div>
                <h3>기본정보</h3>
                <table class="table horizontal write">
                    <caption>기본정보</caption>
                    <tbody>
                        <tr>
                            <th scope="row" class="w180 essential"><label for="bplc">현장명</label></th>
                            <td>
                                {{ viewModel.data.bplc_nm }}
                            </td>
                        </tr>
                        <tr>
                            <th scope="row"><label for="work_type_nm">공종명</label></th>
                            <td>
                                {{ viewModel.data.work_type_nm }}
                            </td>
                        </tr>
                        <tr>
                            <th scope="row" class="essential">평가기간</th>
                            <td>
                                {{ viewModel.data.evl_bgng_dt|yyyyMMdd }} - {{ viewModel.data.evl_end_dt|yyyyMMdd }}
                            </td>
                        </tr>
                        <tr>
                            <th scope="row" class="essential">회차</th>
                            <td>
                                <select title="월" v-model="viewModel.data.month" class="w120" style="position:relative" id="month">
                                    <option value=''>월 선택</option>
                                    <option :value=" i < 10 ? 0+''+i : i " v-for="i in 12">
                                        {{ i < 10 ? 0+''+i : i }}월
                                    </option>
                                </select>
                                <input type="text" v-model="viewModel.data.ngr" :id="'ngr'" oninput="this.value = this.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');" placeholder="차수" class="w120"/>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div class="table_footer btn-right">
                    <!-- <button class="btn btn-gray" @click="fnRefresh();"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-refresh"></use></svg>초기화</button> -->
                </div>
            </div>

            <div>
                <ul class="accordion">
                    <template v-for="(item1, idx) in viewModel.detailList" >
                        <li>
                            <button class="title">
                                팀명 : {{ item1.teamInfo.bplc_team_nm }}
                            </button>
                            <div class="contents" style="max-height: 100%;">
                                <div>
                                    <h3>위험성평가 등록부 단위작업</h3>
                                    <div class="table_top btn-right" style="padding-right: 0px; margin-top: 0.25rem">
                                        <button class="btn btn-light-purple" @click="fnItemAdd(idx);"><svg class="icon"><use xlink:href="../../../img/symbol-defs.svg#icon-wrap-text"></use></svg>추가</button>
                                    </div>
                                    <table class="table write">
                                        <caption>위험성평가 등록부 단위작업</caption>
                                        <thead>
                                            <tr>
                                                <th :rowspan="2">고위험(상)</th>
                                                <!-- <th :rowspan="2">팀명</th> -->
                                                <th :rowspan="2" class="essential">작업절차[중공정]</th>
                                                <th :rowspan="2" class="essential">사용장비</th>
                                                <th :rowspan="2" class="essential">작업일정</th>
                                                <th :rowspan="2" class="essential">위험요인</th>
                                                <th :rowspan="2" class="essential">위험유형</th>
                                                <th :rowspan="2" class="essential">안전대책</th>
                                                <th>평가 결과</th>
                                                <th :rowspan="2">재평가<br>결과</th>
                                                <th :rowspan="2" class="essential">이행담당자</th>
                                                <th :rowspan="2"></th>
                                            </tr>
                                            <tr>
                                                <th>이행상태</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="(item2, i) in item1.itemList">
                                                <td :rowspan="item1.itemList.length" v-if="i == 0">
                                                    상등급
                                                </td>
                                                <!-- <td v-if="index === 0 || item.spcm_risk_evl_sn !== viewModel.itemList[(index - 1)].spcm_risk_evl_sn" :rowspan="fnRowSpan(item, index)">{{ item.bplc_team_nm }}</td> -->
                                                <td>
                                                    <input type="text" v-model="item2.unit_work" :id="'unit_work_'+idx + '_' + i" style="height: 1.875rem;" placeholder="작업절차"/>
                                                </td>
                                                <td>
                                                    <input type="text" v-model="item2.using_tool" placeholder="사용장비" :id="'using_tool_'+idx + '_' + i" style="height: 1.875rem;"/>
                                                </td>
                                                <td>
                                                    <div class="input_group">
                                                        <div class="datepicker_box w120">
                                                            <input type="text" class="datepicker" :id="'term_bgng_dt_'+idx + '_' + i" title="기한시작일" placeholder="기한시작일" readonly name="term_bgng_dt"/>
                                                        </div>
                                                        <span>~</span>
                                                        <div class="datepicker_box w120">
                                                            <input type="text" class="datepicker" :id="'term_end_dt_'+idx + '_' + i" title="기한종료일" placeholder="기한종료일" readonly name="term_end_dt"/>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <textarea type="text" v-model="item2.risk_fctr" :id="'risk_fctr_'+idx + '_' + i" rows="4"></textarea>
                                                </td>
                                                <td>
                                                    <input type="text" v-model="item2.risk_type" placeholder="위험유형 입력" :id="'risk_type_'+idx + '_' + i" style="height: 1.875rem;"/>
                                                </td>
                                                <td>
                                                    <textarea type="text" v-model="item2.safe_cntrpln" :id="'safe_cntrpln_'+idx + '_' + i" rows="4"></textarea>
                                                </td>
                                                <td>
                                                    <select title="이행상태 선택" v-model="item2.now_mng_level" :id="'now_mng_level_'+idx + '_' + i" style="height: 1.875rem;">
                                                        <option value="">이행상태 선택</option>
                                                        <option v-for="item in viewModel.prfrmList" :key="item" :value="item.CODE">{{ item.CODE_NM }}</option>
                                                    </select>
                                                </td>
                                                <td>
                                                    <select title="재평가 선택" v-model="item2.re_evl" :id="'re_evl_'+idx + '_' + i" style="height: 1.875rem;">
                                                        <option value="">재평가 선택</option>
                                                        <option v-for="item in viewModel.dgdgrList" :key="item" :value="item.CODE">{{ item.CODE_NM }}</option>
                                                    </select>
                                                </td>
                                                <td>
                                                    <div class="input_group input_btn">
                                                        <input type="text" :id="'pic_nm_'+idx + '_' + i" :value="item2.pic_nm" readonly @click="fnPopup(idx, i);">
                                                        <label :for="'pic_nm_'+idx + '_' + i"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-search"></use></svg></label>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div class="icon_box">
                                                        <button class="btn btn-icon" @click.prevent="fnItemDel(idx, i)"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-circle-minus"></use></svg></button>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr v-if="item1.itemList.length == 0"><td :colspan="'11'">데이터가 없습니다.</td></tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </li>
                    </template>
                </ul>
            </div>

            <div class="btn-group btn-right">
                <button class="btn btn-purple" @click.prevent="fnSave()"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-post-add"></use></svg>등록</button>
                <router-link to="/" class="btn btn-white"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-list-back"></use></svg>목록</router-link>
            </div>
        </div>
        <user ref="user" v-if="userPop==true" :pass="{dept_sn: viewModel.userInfo.dept_sn, team_sn: viewModel.userInfo.team_sn, title:'담당자', multi:'Y', bplc_yn:'Y', bplc_sn: viewModel.data.bplc_sn}"></user>
    </div>    
</template>

<script>
    import "es6-promise/auto";
    import Vue from "vue";
    import Axios from "axios";
    import Common from "../../../../common/js/common.js";
    import Message, {messageUtil} from "../../../../common/js/message";
    import fromValidation from "../../../../common/js/fromValidation";
    import user from "../../popup/user_popup.vue";

    
    export default {
        data: function() {
            return {
                userPop:false,
                listIndex: 0,
                popIndex: 0,
                viewModel:{
                    data:{
                        month:'',
                    },
                    userInfo:{},
                    detailList:[],
                    dgdgrList:[],       //위험도 코드리스트
                    prfrmList:[],       //이행상태 코드리스트
                },
                isSaved:false,
            };
        },
        components: {
            'user' : user,
        },
        activated:function(){
            this.fnInit();
        },
        deactivated:function(){
            this.$destroy();
        },
        mounted: function() {
            let vm = this;
            // vm.fnInit();
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
        methods: {
            fnInit:function(){
                let vm = this;
                vm.viewModel.userInfo = vm.$store.state.global.userInfo;
                
                let sn = vm.$route.params.sn;

                vm.fnDetail(sn);
                calendarInput();
            },
            fnDetail: function(sn){
                let vm = this;

                let send = {
                    reg_sn: sn,
                }

                Axios.post("/selectRskEvltRgstDetail.do", send)
                .then(function(response) {
                    vm.viewModel.data = response.data.detail;
                    vm.viewModel.chkRsltList = response.data.chkRsltList;
                    
                    vm.viewModel.dgdgrList = response.data.dgdgrList;
                    vm.viewModel.prfrmList = response.data.prfrmList;

                    vm.viewModel.detailList = response.data.detailList;
                    vm.viewModel.data.chck_clsf = 'REC'
                }).then(function(){
                    vm.$nextTick(function() {
                        vm.viewModel.detailList.forEach((data, index)=>{
                            data.itemList.forEach((data2, index2)=>{
                                data2.term_bgng_dt != null ? $("#term_bgng_dt_"+index + '_' + index2).val(Common.fnConvertDateStr(data2.term_bgng_dt, '-')) : ""; 
                                data2.term_end_dt != null ? $("#term_end_dt_"+index + '_' + index2).val(Common.fnConvertDateStr(data2.term_end_dt, '-')) : ""; 
                            });
                        })
                        vm.fnCalendar();
                    //     for(let i=0; i<vm.viewModel.itemList.length; i++){
                    //         vm.viewModel.itemList[i].term_bgng_dt != null ? $("#term_bgng_dt_"+i).val(Common.fnConvertDateStr(vm.viewModel.itemList[i].term_bgng_dt, '-')) : "";
                    //         vm.viewModel.itemList[i].term_end_dt != null ? $("#term_end_dt_"+i).val(Common.fnConvertDateStr(vm.viewModel.itemList[i].term_end_dt, '-')) : "";
                    //     }
                    //     
                    });
                });
            },
            fnItemAdd: function(idx) {
                let vm = this;
                let list = vm.viewModel.detailList[idx];

                list.itemList.push({now_mng_level:'', re_evl:'', spcm_risk_evl_sn: list.teamInfo.spcm_risk_evl_sn});

                vm.$nextTick(function() {
                    vm.fnCalendar();
                });
            },
            fnItemDel: function(idx, idx2) {
                let vm = this;
                vm.viewModel.detailList[idx].itemList.splice(idx2, 1);
            },
            fnSave: function(){
                let vm = this;

                const valiData = [
                    {id: 'month', type: 'select', title: '회차-달'},
                    {id: 'ngr', type: 'input', title: '회차-차수'},
                ];

                if(!fromValidation(valiData)){
                    return false;
                }

                let flag = true;
                vm.viewModel.detailList.some((data, idx) =>{
                    if(data.itemList.length == 0){
                        alert("위험성평가 등록부 단위작업을 입력해주세요.");
                        flag = false;
                    }else{
                        data.itemList.some((data2, idx2) =>{
                            let teamNm = data.teamInfo.bplc_team_nm;
                            if(data2.unit_work == '' || data2.unit_work == null || data2.unit_work ==undefined){
                                alert(teamNm + "의 작업절차를 입력해주세요.");
                                $("#unit_work_"+idx+'_'+idx2).focus();
                                flag =  false;
                                return true;
                            }else if(data2.using_tool == '' || data2.using_tool == null || data2.using_tool ==undefined){
                                alert(teamNm + "의 사용장비를 입력해주세요.");
                                $("#using_tool_"+idx+'_'+idx2).focus();
                                flag =  false;
                                return true;
                            }else if(data2.term_bgng_dt == '' || data2.term_bgng_dt == null || data2.term_bgng_dt ==undefined){
                                alert(teamNm + "의 작업일정을 입력해주세요.");
                                $("#term_bgng_dt_"+idx+'_'+idx2).focus();
                                flag =  false;
                                return true;
                            }else if(data2.term_end_dt == '' || data2.term_end_dt == null || data2.term_end_dt ==undefined){
                                alert(teamNm + "의 작업일정을 입력해주세요.");
                                $("#term_end_dt_"+idx+'_'+idx2).focus();
                                flag =  false;
                                return true;
                            }else if(data2.risk_fctr == '' || data2.risk_fctr == null || data2.risk_fctr ==undefined){
                                alert(teamNm + "의 위험요인을 입력해주세요.");
                                $("#risk_fctr_"+idx+'_'+idx2).focus();
                                flag =  false;
                                return true;
                            }else if(data2.risk_type == '' || data2.risk_type == null || data2.risk_type ==undefined){
                                alert(teamNm + "의 위험유형을 입력해주세요.");
                                $("#risk_type_"+idx+'_'+idx2).focus();
                                flag =  false;
                                return true;
                            }else if(data2.safe_cntrpln == '' || data2.safe_cntrpln == null || data2.safe_cntrpln ==undefined){
                                alert(teamNm + "의 안전대책을 입력해주세요.");
                                $("#safe_cntrpln_"+idx+'_'+idx2).focus();
                                flag =  false;
                                return true;
                            }else if(data2.pic_nm == '' || data2.pic_nm == null || data2.pic_nm ==undefined){
                                alert(teamNm + "의 이행담당자를 선택해주세요.");
                                $("#pic_nm_"+idx+'_'+idx2).focus();
                                flag =  false;
                                return true;
                            }
                        });
                    }

                    if(!flag){
                        return true;
                    }
                });

                if(!flag){
                    return false;
                }

                let data = {
                    reg_id: vm.viewModel.userInfo.user_id,                    
                    reg_sn: vm.viewModel.data.reg_sn,
                    bplc_sn: vm.viewModel.data.bplc_sn,
                    month:vm.viewModel.data.month,
                    ngr:vm.viewModel.data.ngr,
                    ordtm_risk_evl_sn: vm.viewModel.data.ordtm_risk_evl_sn,
                    detailList: vm.viewModel.detailList
                }

                if(confirm(Message.UPDATE_CONFIRM)){
                    $(".loading").show();
                    $("#mask").show();
                    Axios.post("/updateRskEvltRgst.do", data).then(function(response) {
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
                        let id = $(this).attr('id');
                        let arr = id.split('_');

                        // 마지막 두 요소 추출
                        let idx = arr[arr.length - 2];
                        let idx2 = arr[arr.length - 1];
                        $("input[name='" + $(this).attr("name") +"']").each(function(index) {
                            if($(this).attr('id') == id){

                                if($(this).attr("name") == 'term_bgng_dt'){
                                    vm.viewModel.detailList[idx].itemList[idx2].term_bgng_dt = dateText;
                                }else if($(this).attr("name") == 'term_end_dt'){
                                    vm.viewModel.detailList[idx].itemList[idx2].term_end_dt = dateText;
                                }
                              
                                if(vm.viewModel.detailList[idx].itemList[idx2].term_bgng_dt != undefined && vm.viewModel.detailList[idx].itemList[idx2].term_end_dt != undefined){
                                    var date1 = vm.viewModel.detailList[idx].itemList[idx2].term_bgng_dt;
                                    var date2 = vm.viewModel.detailList[idx].itemList[idx2].term_end_dt;
                                    
                                    if(date1 != "" &&  date2 != ""){
                                        if(date1 > date2){
                                            alert("시작일이 종료일보다 클 수 없습니다.");
                                            vm.viewModel.detailList[idx].itemList[idx2].term_end_dt = '';
                                            $("#term_end_dt_"+ idx+'_'+idx2).val("");
                                        }
                                    }
                                }
                            }
                        });  
                    }
                });
                $( ".datepicker.disabled" ).datepicker( "option", "disabled", true );	
            },
            fnPopup: function(idx,idx2) {
                let vm = this;
                
                vm.listIndex = idx;
                vm.popIndex = idx2;
                
                if(vm.viewModel.data.bplc_sn == null){
                    alert("현장명을 선택해주세요.");
                    return false;
                }else{
                    vm.userPop=true;

                    vm.$nextTick(function() {
                        if(vm.userPop) {
                            vm.$refs.user.fnInit();
                        }
                    })
                }
            },
            fnMultiMemberAdd: function(list){
                let vm = this;
                vm.userPop=false;

                let userNmStr = "";
                let userIdStr = "";
                for(let i=0; i<list.length; i++){
                    if(userNmStr == ""){
                        userNmStr = list[i].user_nm;
                        userIdStr = list[i].user_id;
                    }else{
                        userNmStr += "," + list[i].user_nm;
                        userIdStr += "," + list[i].user_id;
                    }
                }
                vm.viewModel.detailList[vm.listIndex].itemList[vm.popIndex].pic_nm = userNmStr;
                vm.viewModel.detailList[vm.listIndex].itemList[vm.popIndex].pic = userIdStr;

                vm.$set(vm.viewModel.detailList[vm.listIndex].itemList, Number(vm.popIndex), vm.viewModel.detailList[vm.listIndex].itemList[Number(vm.popIndex)]);
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
            }
            // fnRefresh: function(){
            //     let vm = this;
                
                
            //     if(!confirm("상시 위험성평가에서 데이터를 가져옵니다. 초기화하시겠습니까?")){
            //         return false;
            //     }else{
            //         let send = {
            //             ordtm_risk_evl_sn: vm.viewModel.data.ordtm_risk_evl_sn,
            //             reg_sn: vm.viewModel.data.reg_sn,
            //         }

            //         Axios.post("/selectRgstPmntRskEvltItemList.do", send)
            //         .then(function(response) {
            //             vm.viewModel.itemList = response.data.itemList;
            //         }).then(function(){
            //             vm.$nextTick(function() {
            //                 for(let i=0; i<vm.viewModel.itemList.length; i++){
            //                     vm.viewModel.itemList[i].term_bgng_dt != null ? $("#term_bgng_dt_"+i).val(Common.fnConvertDateStr(vm.viewModel.itemList[i].term_bgng_dt, '-')) : $("#term_bgng_dt_"+i).val("");
            //                     vm.viewModel.itemList[i].term_end_dt != null ? $("#term_end_dt_"+i).val(Common.fnConvertDateStr(vm.viewModel.itemList[i].term_end_dt, '-')) : $("#term_bgng_dt_"+i).val("");
            //                 }
            //                 vm.fnCalendar();
            //             });
            //         });
            //     }
            // },
        }
    };
</script>
