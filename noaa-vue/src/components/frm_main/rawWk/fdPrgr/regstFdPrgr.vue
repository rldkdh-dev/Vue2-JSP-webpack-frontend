<template>
<div>
    <div class="search_area opened">
        <div class="search_container">
            <div class="input_group" v-if="viewModel.userInfo.user_roles == 'ROLE_001'">
                <select id="" v-model="viewModel.bplc_use_yn" class="wp28">
                    <option value="A">전체</option>
                    <option value="Y" selected>운영</option>
                    <option value="N">종료</option>
                </select>
                <select id="list" v-model="viewModel.bplc_sn" title="조회현장">
                    <option disabled="" selected="">현장선택</option>
                    <option :value="item.bplc_sn" v-for="(item,i) in viewModel.bplcList" :key="i">{{ item.bplc_nm }}</option>
                </select>
            </div>
            <select id="list" v-model="viewModel.bplc_sn" title="조회현장" disabled v-else>
                <option :value="viewModel.bplc_sn">{{ viewModel.bplc_nm }}</option>
            </select>
        </div>
    </div>
    <!-- <div v-if="viewModel.userInfo.user_roles == 'ROLE_001'" style="max-width: 80%; padding: 10px;">
        <label for="numbers">조회현장 선택</label>
        <select id="list" v-model="viewModel.bplc_sn">
            <option :value="item.bplc_sn" v-for="(item,i) in viewModel.bplcList" :key="i">{{ item.bplc_nm }}</option>
        </select>
    </div> -->
    <div class="contents">
        <div class="divide">
            <div id="fullCalendar"></div>
            <div class="info_board box">
                <div>
                    <h3>{{sidoNm}} {{ sigunguNm }} 미세먼지 현황</h3>
                    <div class="range-slider_wrapper">
                        <span class="slider-bar"></span>
                        <input type="range" class="rangeInput" id="rangeInput" min="0" max="200" value="0">
                        <p class="tooltip"><span id="range_value" class="range_value"></span>㎍/㎥</p>
                    </div>
                    <ul class="divide">
                        <li id="pm10" class="lv2">
                            <span><svg class="icon">
                                    <use xlink:href="../../img/symbol-defs.svg#icon-dust"></use>
                                </svg>미세먼지</span>
                            <p>보통<span class="btn btn-ellipse btn-small ">{{ pm10 }} ㎍/㎥</span></p>
                        </li>
                        <li id="pm25" class="lv3">
                            <span><svg class="icon">
                                    <use xlink:href="../../img/symbol-defs.svg#icon-fine-dust"></use>
                                </svg>초미세먼지</span>
                            <p>보통<span class="btn btn-ellipse btn-small">{{ pm25 }} ㎍/㎥</span></p>
                        </li>
                    </ul>
                </div>
                <div>
                    <p class="text-right mt5 mb5">미세먼지 기준</p>
                    <div>
                        <span class="btn btn-ellipse btn-small lv1">0~30 좋음</span>
                        <span class="btn btn-ellipse btn-small lv2">31~80 보통</span>
                        <span class="btn btn-ellipse btn-small lv3">81~150 나쁨</span>
                        <span class="btn btn-ellipse btn-small lv4">151~ 매우나쁨</span>
                    </div>
                    <p class="text-right mt5 mb5">초미세먼지 기준</p>
                    <div>
                        <span class="btn btn-ellipse btn-small lv1">0~15 좋음</span>
                        <span class="btn btn-ellipse btn-small lv2">16~35 보통</span>
                        <span class="btn btn-ellipse btn-small lv3">36~75 나쁨</span>
                        <span class="btn btn-ellipse btn-small lv4">76~ 매우나쁨</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <calendarPopup ref="calendarPopup" v-if="calendarPopup==true"></calendarPopup>
</div>
</template>

<script>
import "es6-promise/auto";
import Vue from "vue";
import Axios from "axios";
import Pager from "../../../paging.vue";
import calendarPopup from "../../popup/calendar_popup.vue";
import Message, {
    messageUtil
} from "../../../../common/js/message.js";

export default {

    components: {
        'pager': Pager,
        'calendarPopup': calendarPopup,
    },
    data: function () {
        return {
            calendarPopup: false,
            pvsn_day: "",
            calendarId: "",
            sidoNm: "",
            sigunguNm: "",
            pm10: "0",
            pm25: "0",
            pm10Stat: "",
            pm25Stat: "",
            imgsrc: '',
            viewModel: {
                filelist: [],
                userInfo: {},
                bplcList: [],
                bplc_use_yn:'',
                bplc_sn: "",
                bplc_nm: "",
                pager: {
                    model: {},
                    pageNo: 1,
                    totalSize: 0,
                    rowSize: 10,
                    blockSize: 10,
                    list: []
                },
                calendarList: [],
            }
        };
    },
    mounted: function () {
        let vm = this;

        vm.fnInit();

    },
    watch: {
        'viewModel.bplc_use_yn': {
            handler() {
                let vm = this;
                if(vm.viewModel.userInfo.user_roles == 'ROLE_001'){
                    vm.fnBplcList();
                }
            }
        }
    },
    methods: {
        fnBplcList: function() { //사업장 리스트 추출(검색)
            let vm = this;

            let data = {
                mapperId: 'comm.selectAllBplcList',
                bplc_use_yn: vm.viewModel.bplc_use_yn,
                dept_sn: vm.viewModel.userInfo.dept_sn,
                team_sn: vm.viewModel.userInfo.team_sn,
            };
            Axios.post("/list.do", data).then(function (rs) {
                vm.viewModel.bplcList = rs.data.list;

                vm.viewModel.bplc_sn = '';
                if(vm.viewModel.userInfo.bplc_use_yn == 'Y' && vm.viewModel.bplc_use_yn == 'Y'){
                    vm.viewModel.bplc_sn = vm.viewModel.userInfo.bplc_sn == 0 ? '' : vm.viewModel.userInfo.bplc_sn;
                }

            }).finally(function(){
                $('#list').select2();

                $("#list").on("change", function () {
                    vm.fnSelect();
                });
            });
        },
        fnInit: function () {
            let vm = this;
            vm.viewModel.userInfo = vm.$store.state.global.userInfo;
            vm.viewModel.bplc_use_yn = vm.viewModel.userInfo.bplc_yn == 'N' ? 'Y' : 'A';
            vm.viewModel.bplc_sn = (vm.viewModel.userInfo.bplc_yn == 'N' && (vm.viewModel.userInfo.bplc_sn == 0 || vm.viewModel.userInfo.bplc_use_yn == 'N')) ? '' : vm.viewModel.userInfo.bplc_sn;
            vm.viewModel.bplc_nm = vm.viewModel.userInfo.bplc_nm;
            // if (vm.viewModel.userInfo.user_roles == 'ROLE_001') {
            //     vm.viewModel.bplc_nm = $("#list option:selected").text();
            //     let data = {
            //         mapperId: 'comm.selectAllBplcList'
            //     };
            //     Axios.post("/list.do", data).then(function (rs) {
            //         vm.viewModel.bplcList = rs.data.list;

            //         $("#list").on("change", function () {
            //             vm.fnSelect();
            //         });
            //     });
            // }

            if(vm.viewModel.bplc_sn != ''){

                let data = {
                    bplc_sn: vm.viewModel.bplc_sn,
                }
                if (vm.viewModel.userInfo.bplc_sn != null && vm.viewModel.userInfo.bplc_sn != undefined) {
                    Axios.post("/api/selectBplcFineDust.do", data).then(function (res) {
                        vm.sidoNm = res.data.SIDO_NM;
                        vm.sigunguNm = res.data.SIGUNGU_NM;
                        let pm10 = res.data.PM10 == null ? 0 : Number(res.data.PM10);
                        let pm25 = res.data.PM25 == null ? 0 : Number(res.data.PM25);
                        vm.pm10 = pm10;
                        $("#rangeInput").val(pm10);
                        $('.slider-bar').css('width', (pm10 * ($('.rangeInput').width() / 200)));
                        $('.range-slider_wrapper .tooltip').css('left', (pm10 * ($('.rangeInput').width() / 200) - 32));
                        $("#range_value").text(pm10);
                        if (pm10 < 31) {
                            $('.range-slider_wrapper').attr('class', 'range-slider_wrapper lv1');
                            $("#pm10").attr('class', 'lv1');
                            $("#pm10 p").html('좋음<span class="btn btn-ellipse btn-small">' + pm10 + '㎍/㎥</span>');
                            $('.slider-bar').css('background', '#0169B4');
                        } else if (pm10 < 81) {
                            $('.range-slider_wrapper').attr('class', 'range-slider_wrapper lv2');
                            $("#pm10").attr('class', 'lv2');
                            $("#pm10 p").html('보통<span class="btn btn-ellipse btn-small">' + pm10 + '㎍/㎥</span>');
                            $('.slider-bar').css('background', '#8EC54A');
                        } else if (pm10 < 151) {
                            $('.range-slider_wrapper').attr('class', 'range-slider_wrapper lv3');
                            $("#pm10").attr('class', 'lv3');
                            $("#pm10 p").html('나쁨<span class="btn btn-ellipse btn-small">' + pm10 + '㎍/㎥</span>');
                            $('.slider-bar').css('background', '#F9B001');
                        } else {
                            $('.range-slider_wrapper').attr('class', 'range-slider_wrapper lv4');
                            $("#pm10").attr('class', 'lv4');
                            $("#pm10 p").html('매우나쁨<span class="btn btn-ellipse btn-small">' + pm10 + '㎍/㎥</span>');
                            $('.slider-bar').css('background', '#BB121A');
                        }
    
                        vm.pm25 = pm25;
                        if (pm25 < 16) {
                            $("#pm25").attr('class', 'lv1');
                            $("#pm25 p").html('좋음<span class="btn btn-ellipse btn-small">' + pm25 + '㎍/㎥</span>');
                        } else if (pm25 < 36) {
                            $("#pm25").attr('class', 'lv2');
                            $("#pm25 p").html('보통<span class="btn btn-ellipse btn-small">' + pm25 + '㎍/㎥</span>');
                        } else if (pm25 < 76) {
                            $("#pm25").attr('class', 'lv3');
                            $("#pm25 p").html('나쁨<span class="btn btn-ellipse btn-small">' + pm25 + '㎍/㎥</span>');
                        } else {
                            $("#pm25").attr('class', 'lv4');
                            $("#pm25 p").html('매우나쁨<span class="btn btn-ellipse btn-small">' + pm25 + '㎍/㎥</span>');
                        }
    
                        vm.fnRender();
    
                    });
                }
            }

        },
        fnPopup: function () {
            let vm = this;
            vm.calendarPopup = true;
            vm.$nextTick(function () {
                if (vm.calendarPopup) {
                    vm.$refs.calendarPopup.fnInit();
                }
            })
        },
        fnInsert: function (frm) {
            let vm = this;
            if (confirm(Message.CREATE_CONFIRM)) {
                Axios.post("/insertFdPrgrMask.do", frm).then(function (response) {
                    if (response.data == 1) {
                        alert("저장되었습니다.");
                        //팝업 초기화
                        vm.calendarPopup = false;
                        vm.fnRender();
                    }
                }).catch(function (ex) {
                    alert(Message.ERROR);
                });
            }
        },
        fnUpdate: function (frm) {
            let vm = this;
            if (confirm(Message.UPDATE_CONFIRM)) {
                Axios.post("/updateFdPrgrMask.do", frm).then(function (response) {
                    if (response.data == 1) {
                        alert("저장되었습니다.");
                        //팝업 초기화
                        vm.calendarPopup = false;
                        vm.fnRender();
                    }
                }).catch(function (ex) {
                    alert(Message.ERROR);
                });
            }
        },
        fnRender: function () {
            let vm = this;
            let data = {
                mask: "mask",
                bplc_sn: vm.viewModel.bplc_sn,
                role_id: vm.viewModel.userInfo.user_roles,
                sidoNm: vm.sidoNm,
                sigunguNm: vm.sigunguNm,
            }
            Axios.post("/selectFdPrgrMask.do", data).then(function (res) {
                vm.viewModel.calendarList = res.data.list;
                res.data.list2.forEach(function (result) {
                    result.pm10 = result.pm10 == null ? 0 : Number(result.pm10);
                    result.pm25 = result.pm25 == null ? 0 : Number(result.pm25);
                    if (result.pm10 < 31) {
                        result.emoji = "좋음";
                        result.title = "미세먼지 " + result.pm10 + "㎍/㎥ 좋음 😊 \n";
                        result.backgroundColor = "#0169B4",
                        result.borderColor = "#0169B4"
                    } else if (30 < result.pm10 && result.pm10 < 82) {
                        result.emoji = "보통";
                        result.title = "미세먼지 " + result.pm10 + "㎍/㎥ 보통 😐 \n";
                        result.backgroundColor = "#8EC54A",
                        result.borderColor = "#8EC54A"
                    } else if (81 < result.pm10 && result.pm10 < 151) {
                        result.emoji = "나쁨";
                        result.title = "미세먼지 " + result.pm10 + "㎍/㎥ 나쁨 😷 \n";
                        result.backgroundColor = "#F9B001",
                        result.borderColor = "#F9B001"
                    } else {
                        result.emoji = "매우나쁨";
                        result.title = "미세먼지 " + result.pm10 + "㎍/㎥ 매우나쁨 😷 \n";
                        result.backgroundColor = "#BB121A",
                        result.borderColor = "#BB121A"
                    }

                    if (result.pm25 < 16) {
                        result.title += "초미세먼지 " + result.pm25 + "㎍/㎥ 좋음 😊";
                    } else if (15 < result.pm25 && result.pm25 < 36) {
                        result.title += "초미세먼지 " + result.pm25 + "㎍/㎥ 보통 😐";
                        if(result.backgroundColor == "#0169B4"){
                            result.backgroundColor = "#8EC54A",
                            result.borderColor = "#8EC54A"
                        }
                    } else if (35 < result.pm25 && result.pm25 < 76) {
                        result.title += "초미세먼지 " + result.pm25 + "㎍/㎥ 나쁨 😷";
                        if(result.backgroundColor == "#0169B4" || result.backgroundColor == "#8EC54A"){
                            result.backgroundColor = "#F9B001",
                            result.borderColor = "#F9B001"
                        }
                    } else {
                        result.title += "초미세먼지 " + result.pm25 + "㎍/㎥ 매우나쁨 😷";
                        if(result.backgroundColor == "#0169B4" || result.backgroundColor == "#8EC54A" || result.backgroundColor == "#F9B001"){
                            result.backgroundColor = "#BB121A",
                            result.borderColor = "#BB121A"
                        }
                    }
                })

                vm.viewModel.calendarList.push(...res.data.list2);
            }).then(function () {
                var calendarEl = document.getElementById('fullCalendar');
                var calendar = new FullCalendar.Calendar(calendarEl, {
                    initialView: 'dayGridMonth',
                    locale: 'ko',
                    height: '720px',
                    headerToolbar: {
                        left: 'today',
                        center: 'prev,title,next',
                        right: ''
                    },
                    navLinks: true, // can click day/week names to navigate views
                    selectable: true,
                    selectMirror: true,
                    select: function (arg) {
                        vm.viewModel.bplc_nm = $("#list option:selected").text();
                        vm.pvsn_day = arg.startStr;
                        var nowDate = vm.getCurrentDate();
                        if(nowDate < vm.pvsn_day) return alert("과거부터 현재까지 선택 가능합니다.");
                        vm.calendarId = "";
                        vm.fnPopup();
                        calendar.unselect()
                    },
                    eventClick: function (arg) {
                        if (arg.event._def.extendedProps.emoji == null) {
                            vm.pvsn_day = arg.startStr;
                            vm.calendarId = arg.event.id;
                            vm.fnPopup();
                        }
                    },
                    editable: false,
                    events: vm.viewModel.calendarList,
                });
                calendar.render();
            });

        },
        fnSelect: function () {
            let vm = this;
            
            vm.viewModel.bplc_sn = $("#list").val();
            vm.viewModel.bplc_nm = $("#list option:selected").text();

            if(vm.viewModel.bplc_sn != null){
                let data = {
                    bplc_sn: vm.viewModel.bplc_sn,
                }
                if (vm.viewModel.bplc_sn != null && vm.viewModel.bplc_sn != "") {
                    Axios.post("/api/selectBplcFineDust.do", data).then(function (res) {
                        vm.sidoNm = res.data.SIDO_NM;
                        vm.sigunguNm = res.data.SIGUNGU_NM;
                        let pm10 = res.data.PM10 == null ? 0 : Number(res.data.PM10);
                        let pm25 = res.data.PM25 == null ? 0 : Number(res.data.PM25);
                        vm.pm10 = pm10;
                        vm.pm25 = pm25;
                        $("#rangeInput").val(pm10);
                        $('.slider-bar').css('width', (pm10 * ($('.rangeInput').width() / 200)));
                        $('.range-slider_wrapper .tooltip').css('left', (pm10 * ($('.rangeInput').width() / 200) - 32));
                        $("#range_value").text(pm10);
                        if (pm10 < 31) {
                            $('.range-slider_wrapper').attr('class', 'range-slider_wrapper lv1');
                            $("#pm10").attr('class', 'lv1');
                            $("#pm10 p").html('좋음<span class="btn btn-ellipse btn-small">' + pm10 + '㎍/㎥</span>');
                            $('.slider-bar').css('background', '#0169B4');
                        } else if (30 < pm10 < 81) {
                            $('.range-slider_wrapper').attr('class', 'range-slider_wrapper lv2');
                            $("#pm10").attr('class', 'lv2');
                            $("#pm10 p").html('보통<span class="btn btn-ellipse btn-small">' + pm10 + '㎍/㎥</span>');
                            $('.slider-bar').css('background', '#8EC54A');
                        } else if (80 < pm10 < 151) {
                            $('.range-slider_wrapper').attr('class', 'range-slider_wrapper lv3');
                            $("#pm10").attr('class', 'lv3');
                            $("#pm10 p").html('나쁨<span class="btn btn-ellipse btn-small">' + pm10 + '㎍/㎥</span>');
                            $('.slider-bar').css('background', '#F9B001');
                        } else {
                            $('.range-slider_wrapper').attr('class', 'range-slider_wrapper lv4');
                            $("#pm10").attr('class', 'lv4');
                            $("#pm10 p").html('매우나쁨<span class="btn btn-ellipse btn-small">' + pm10 + '㎍/㎥</span>');
                            $('.slider-bar').css('background', '#BB121A');
                        }

                        vm.pm25 = pm25;
                        if (pm25 < 16) {
                            $("#pm25").attr('class', 'lv1');
                            $("#pm25 p").html('좋음<span class="btn btn-ellipse btn-small">' + pm25 + '㎍/㎥</span>');
                        } else if (15 < pm25 < 36) {
                            $("#pm25").attr('class', 'lv2');
                            $("#pm25 p").html('보통<span class="btn btn-ellipse btn-small">' + pm25 + '㎍/㎥</span>');
                        } else if (35 < pm25 < 76) {
                            $("#pm25").attr('class', 'lv3');
                            $("#pm25 p").html('나쁨<span class="btn btn-ellipse btn-small">' + pm25 + '㎍/㎥</span>');
                        } else {
                            $("#pm25").attr('class', 'lv4');
                            $("#pm25 p").html('매우나쁨<span class="btn btn-ellipse btn-small">' + pm25 + '㎍/㎥</span>');
                        }

                        vm.fnRender();
                    });
                }
            }else{

            }
        },
        getCurrentDate : function() {
        const now = new Date();
        
        // 년, 월, 일을 가져와서 각각의 값을 얻습니다.
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');  // 월은 0부터 시작하므로 1을 더하고, 1자리 수일 경우 앞에 0을 추가
        const day = String(now.getDate()).padStart(2, '0');  // 1자리 수일 경우 앞에 0을 추가

        // YYYY-MM-DD 형식으로 조합하여 반환합니다.
        const formattedDate = `${year}-${month}-${day}`;

        return formattedDate;
        }
    }
};
</script>
