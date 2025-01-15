<template>
<div>
    <div class="contents write">
        <div>
            <table class="table horizontal write">
                <caption>기상변화 안전대책 등록</caption>
                <tbody>
                    <tr>
                        <th scope="row" class="w180 essential"><label for="wetherType">기상 유형</label></th>
                        <td>
                            <select title="기상 유형" v-model="viewModel.data.wether_type" id="wetherType">
                                <option value="" disabled>기상 유형을 선택하세요.</option>
                                <template v-for="(item, i) in viewModel.wetherTypeList" :key="i">
                                    <option :value=item.CODE>{{ item.CODE_NM }}</option>
                                </template>
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row" class="essential"><label for="sdt">등록기간</label></th>
                        <td>
                            <div class="input_group">
                                <div class="datepicker_box">
                                    <input type="text" class="datepicker" placeholder="시작일자" title="시작일자" id="sdt" readonly>
                                </div>
                                <span>~</span>
                                <div class="datepicker_box">
                                    <input type="text" class="datepicker" placeholder="종료일자" title="종료일자" id="edt" readonly>
                                </div>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row" class="essential"><label for="set_alarm">알림설정</label></th>
                        <td colspan="3">
                            <div class="input_group">
                                <div class="datepicker_box">
                                    <input type="text" class="datepicker" id="set_alarm" placeholder="알림설정" readonly>
                                </div>
                                <div>
                                    <select v-model="viewModel.thisHour">
                                        <template v-for="(item, i) in viewModel.hourList" :key="i">
                                            <option :value="item">{{ item }}</option>
                                        </template>
                                    </select>
                                </div>
                                <button class="btn btn-white" @click="fnSetAllAlarmList()"><svg class="icon">
                                        <use xlink:href="/img/symbol-defs.svg#icon-add-circle"></use>
                                    </svg>추가</button>
                            </div>
                            <div class="input_wrap tag" id="alarmList"></div>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row" class="essential"><label for="reg_id">등록자</label></th>
                        <td>
                            <input type="text" id="reg_id" v-model="viewModel.data.reg_id" disabled>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row" class="essential"><label for="title">제목</label></th>
                        <td>
                            <input type="text" id="title" v-model="viewModel.data.ttl">
                        </td>
                    </tr>
                    <tr>
                        <th scope="row"><label for="text_con">안내문</label></th>
                        <td>
                            <input type="text" id="text_con" v-model="viewModel.data.gdcc">
                        </td>
                    </tr>
                    <tr>
                        <th scope="row"><label for="">이미지 첨부</label></th>
                        <td>
                            <imgsfileform :ref="'imgsfileform'" :pass="{id:'sc'}" @filelist="fnImgFileList" @fileDelete="fnImgFileDelete"></imgsfileform>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div>
            <h3>대상 현장</h3>
            <div class="divide h320">
                <div class="overflow-y border">
                    <input type="text" v-model="searchQuery" placeholder="현장명 검색" style="height: auto; margin-bottom: 5px;margin-top: 5px;" />
                    <table class="table">
                        <caption>대상 현장 목록</caption>
                        <thead>
                            <tr>
                                <th scope="col" class="essential">
                                    <label for="chkAll"><input type="checkbox" id="chkAll" v-model="viewModel.chkAll" true-value="Y" false-value="N" @change="fnChkAll" title="선택" />선택</label>
                                </th>
                                <th scope="col">현장명</th>
                            </tr>
                        </thead>
                        <tbody>
                            <!-- <tr v-for="(item, i) in viewModel.bplcList.filter(data => data.chosen == 'N')" :key="i"> -->
                            <tr v-for="(item, i) in filteredBplcList" :key="i">
                                <td>
                                    <input type="checkbox" title="선택" v-bind:id="'chk_'+item.BPLC_SN" :value="[item.BPLC_SN,item.BPLC_NM]" v-model="viewModel.checkedBplcList">
                                </td>
                                <td><label v-bind:for="'chk_'+item.BPLC_SN">{{ item.BPLC_NM }}</label></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="btn-group column">
                    <button @click="fnAdd" class="btn btn-large btn-white"><span class="chevron right"></span></button>
                    <button @click="fnDel" class="btn btn-large btn-white"><span class="chevron left"></span></button>
                </div>
                <div class="box list overflow-y">
                    <ul>
                        <li v-for="(item, i) in viewModel.selectedBplcList" :key="i">
                            <label v-bind:for="item[0]+'_sn'"><input type="checkbox" v-bind:id="item[0]+'_sn'" :value="item" v-model="viewModel.checkedBplcList2">{{ item[1] }}</label>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="table_footer btn-group btn-right">
            <button class="btn btn-purple" @click.prevent="fnSave()">
                <svg class="icon">
                    <use xlink:href="../../img/symbol-defs.svg#icon-post-add"></use>
                </svg>
                <template v-if="typeof $route.params.sn == 'undefined'">등록</template>
                <template v-else>수정</template>
            </button>
            <router-link to="/" class="btn btn-white"><svg class="icon">
                    <use xlink:href="../../img/symbol-defs.svg#icon-list-back"></use>
                </svg>목록</router-link>
        </div>
    </div>
</div>
</template>

<script>
import "es6-promise/auto";
import Vue from "vue";
import Axios from "axios";
import imgsfileform from '../../../../common/vue/imgfileform2.vue';
import Message, {
    messageUtil
} from "../../../../common/js/message";
import fromValidation from "../../../../common/js/fromValidation";
import board from "../../../../common/js/board";

export default {
    data: function () {
        return {
            viewModel: {
                safe_cntrpln_sn: '',
                data: {
                    wether_type: ''
                },
                isUpdate: 'N',
                flag: false,
                hourList: [],
                thisHour: '00',
                bplcList: [],
                wetherTypeList: [],
                list: [],
                userInfo: {},
                filelist: [],
                fileGroup: '',
                ntcnList: [],
                imgfilelist: [],
                imgdeletefileList: [],
                alarmList: [],
                checkedBplcList: [],
                checkedBplcList2: [],
                selectedBplcList: [],
                chkAll: ''
            },
            searchQuery: '',
            isSaved:false,
        };
    },
    components: {
        'imgsfileform': imgsfileform,
        'board': board
    },
    mounted: function () {
        let vm = this;

        //메뉴 타이틀 상세 타이틀 설정(상세,등록,수정)
        //board.fnGetMenuTitle(vm);
        vm.fnInit();
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
    computed: {
        filteredBplcList() {
            if (!this.searchQuery) {
                return this.viewModel.bplcList;
            }
            return this.viewModel.bplcList.filter(item =>
                item.BPLC_NM.toLowerCase().includes(this.searchQuery.toLowerCase())
            );
        }
    },
    methods: {
        fnInit: function () {
            let vm = this;

            vm.viewModel.userInfo = vm.$store.state.global.userInfo;
            let sn = vm.$route.params.sn;

            vm.fnGetWetherType();
            calendarInput();
            vm.fnSetNowTime();
            vm.fnBplcList();

            if (sn != undefined) {
                vm.viewModel.safe_cntrpln_sn = sn;
                vm.fnDetail(sn);
                vm.viewModel.isUpdate = 'Y';
            } else {
                sn = null;
                vm.viewModel.data.reg_id = vm.viewModel.userInfo.user_name;
            }
        },
        fnSetNowTime: function () {
            let vm = this;
            for (var ii = 0; ii < 24; ii++) {
                if (ii < 10) ii = '0' + ii;
                vm.viewModel.hourList.push(ii + ":00");
            }

            //현재 날짜 및 시간 시,분
            var now = new Date();
            var thisDate = now.getFullYear() + '-' + ((now.getMonth() + 1) < 10 ? '0' + (now.getMonth() + 1) : (now.getMonth() + 1)) +
                '-' + (now.getDate() < 10 ? '0' + now.getDate() : now.getDate());

            // 주의 :: datepicker v-model :value 설정시 input event에 초기화 됨..
            $('#sdt').val(thisDate);
            $('#edt').val(thisDate);
            $('#set_alarm').val(thisDate);

            vm.viewModel.thisHour = (now.getHours() < 10 ? '0' + now.getHours() : now.getHours()) + ":00";

        },
        fnGetWetherType: function () {
            let vm = this;
            let send = {
                mapperId: 'wcSftPl.selectWetherTypeList'
            }
            Axios.post("/selectWetherTypeList.do", send).then(function (response) {
                vm.viewModel.wetherTypeList = response.data;
            });
        },
        fnChkAll: function () {
            let vm = this;
            vm.viewModel.checkedBplcList = [];
            if (vm.viewModel.chkAll == 'Y') {
                $('#chkAll').prop('checked', true);
                $.each(vm.viewModel.bplcList, function (idx, item) {
                    vm.viewModel.checkedBplcList.push([item.BPLC_SN, item.BPLC_NM]);
                });
            } else {
                $('#chkAll').prop('checked', false);
            }
        },
        fnSetAllAlarmList: function () {
            let vm = this;
            let setAlarm = $('#set_alarm').val() + ' ' + vm.viewModel.thisHour;
            let alarmDiv = '<span tabindex="0">' + setAlarm +
                '<button class="delAlarm fx fx-ac" name="' + setAlarm + '"><svg class="icon"><use xlink:href="/img/symbol-defs.svg#icon-delete"></use></svg></button></span>'; {
                {
                    $('#alarmList').append(alarmDiv);
                }
            }

            $('.delAlarm').on('click', function () {
                let thisClass = $(this).attr('name');
                $.each(vm.viewModel.alarmList, function (idx, item) {
                    if (typeof item != 'undefined') {
                        if (item == thisClass)
                            vm.viewModel.alarmList.splice(idx, 1);
                    }
                });
                $(this).parent().remove();
            });
            vm.viewModel.alarmList.push(setAlarm);

        },
        fnBplcList: function () { //사업장 리스트 추출(검색)
            let vm = this;
            let send = {
                mapperId: 'HrMngmtPrcs.selectBplcInfoList',
                dept_sn: vm.viewModel.userInfo.dept_sn,
                team_sn: vm.viewModel.userInfo.team_sn,
            };
            Axios.post("/selectBplcInfoList.do", send).then(function (response) {
                vm.viewModel.bplcList = response.data;
                vm.viewModel.bplcList.sort(function (a, b) {
                    const nameA = a.BPLC_NM.toLowerCase(); // 대소문자 구분하지 않기 위해 소문자로 변환
                    const nameB = b.BPLC_NM.toLowerCase(); // 대소문자 구분하지 않기 위해 소문자로 변환

                    if (nameA < nameB) {
                        return -1; // nameA가 nameB보다 앞에 위치
                    }
                    if (nameA > nameB) {
                        return 1; // nameA가 nameB보다 뒤에 위치
                    }
                    return 0; // nameA와 nameB가 같을 경우
                });
            });
        },
        fnDetail: function (sn) {
            let vm = this;
            let data = {
                isUser: false,
                user_roles: vm.viewModel.userInfo.user_roles,
                user_type_code: vm.viewModel.userInfo.user_type_code,
                safe_cntrpln_sn: sn
            }
            Axios.post("/selectWcSftPlDetail.do", data).then(function (response) {
                vm.viewModel.data = response.data.detail[0];
                vm.viewModel.imgfilelist = response.data.fileList;
                $('#sdt').val(vm.viewModel.data.reg_bgng_day);
                $('#edt').val(vm.viewModel.data.reg_end_day);
                if (vm.viewModel.imgfilelist.length > 0) {
                    vm.viewModel.flag = true;
                    vm.$refs.imgsfileform.fnFileLoadList(vm.viewModel.imgfilelist);
                }
                //알림정보 리스트(알림설정)
                $.each(response.data.ntcnList, function (idx, item) {
                    vm.viewModel.alarmList.push(item.SNDNG_DT);
                    let alarmDiv = '<span tabindex="0">' + item.SNDNG_DT +
                        '<button class="delAlarm fx fx-ac" name="' + item.SNDNG_DT + '"><svg class="icon"><use xlink:href="/img/symbol-defs.svg#icon-delete"></use></svg></button></span>';

                    $('#alarmList').append(alarmDiv);
                    $('.delAlarm').on('click', function () {
                        let thisClass = $(this).attr('name');
                        $.each(vm.viewModel.alarmList, function (idx, item) {
                            if (typeof item != 'undefined') {
                                if (item == thisClass)
                                    vm.viewModel.alarmList.splice(idx, 1);
                            }
                        });
                        $(this).parent().remove();
                    });
                });
                //알림정보 리스트(대상현장)
                var bplcListTemp = vm.viewModel.bplcList;
                $.each(response.data.ntcnBplcList, function (idx, item) {
                    for (var ii = 0; ii < bplcListTemp.length; ii++) {
                        if (bplcListTemp[ii].BPLC_SN == item.BPLC_SN) {
                            bplcListTemp.splice(ii, 1);
                            ii--;
                        }
                    }
                    vm.viewModel.selectedBplcList.push([item.BPLC_SN, item.BPLC_NM]);
                });

            });
        },
        fnSave: function () {

            let vm = this;
            let frm = new FormData();
            for (let i = 0; i < vm.viewModel.imgfilelist.length; i++) {
                let key = vm.viewModel.imgfilelist[i].file_seq;
                if (vm.viewModel.imgfilelist[i].file != null) {
                    frm.append("fileTitle", vm.viewModel.imgfilelist[i].file_title);
                    frm.append("uploadFiles", vm.viewModel.imgfilelist[i].file);
                    if (vm.viewModel.imgfilelist[i].file_sn) {
                        frm.append("deleteFiles", vm.viewModel.imgfilelist[i].file_sn);
                    }
                    frm.append("key", 0)
                } else {
                    if (vm.viewModel.imgfilelist[i].file == undefined) {

                    } else {
                        frm.append("fileTitle", vm.viewModel.imgfilelist[i].file_title);
                        frm.append("key", key)
                    }
                }
            }
            for (let i = 0; i < vm.viewModel.imgdeletefileList.length; i++) {
                frm.append("deleteFiles", vm.viewModel.imgdeletefileList[i]);
            }
            vm.fngetFileInfo(frm);
        },
        fngetFileInfo: function (frm) {
            let vm = this;
            const valiData = [{
                    id: 'wetherType',
                    type: 'select',
                    title: '기상유형'
                },
                // {id: 'alarmList', type: 'input', title: '알림설정'},
                {
                    id: 'reg_id',
                    type: 'input',
                    title: '등록자'
                },
                {
                    id: 'title',
                    type: 'input',
                    title: '제목'
                },
            ];

            if ($('#alarmList span').length < 1) {
                alert('알림설정은(는) 필수 입니다.');
                return;
            }

            if (vm.viewModel.selectedBplcList.length < 1) {
                alert('대상 현장을 선택해 주세요.');
                return;
            }

            if (!fromValidation(valiData)) {
                return false;
            }

            let data = {
                user_roles: vm.viewModel.userInfo.user_roles,
                user_type_code: vm.viewModel.userInfo.user_type_code,
                isUpdate: vm.viewModel.isUpdate,
                safe_cntrpln_sn: vm.viewModel.safe_cntrpln_sn,
                //safe_cntrpln_sn: vm.viewModel.data.safe_cntrpln_sn,
                //bplc_sn: vm.viewModel.userInfo.bplc_sn,
                wether_type: vm.viewModel.data.wether_type,
                reg_bgng_day: $('#sdt').val(),
                reg_end_day: $('#edt').val(),
                reg_id: vm.viewModel.data.reg_id,
                ttl: vm.viewModel.data.ttl,
                gdcc: vm.viewModel.data.gdcc,
                alarmList: vm.viewModel.alarmList,
                bplcList: vm.viewModel.selectedBplcList
            };

            frm.append('data', new Blob([JSON.stringify(data)], {
                type: "application/json"
            }));
            frm.append("filePath", "wcSftPl/user");
            if (confirm((vm.viewModel.isUpdate == 'N') ? Message.CREATE_CONFIRM : Message.UPDATE_CONFIRM)) {
                Axios.post("/updateWcSftPl.do", frm).then(function (response) {
                    if (response.data > 0) {
                        vm.fnPush();
                        vm.isSaved = true;
                        vm.$router.push('/');
                        alert("저장되었습니다.");
                    }
                }).catch(function (ex) {
                    console.log("error" + ex);
                });
            }
        },
        fnImgFileList: function (vm) {
            this.viewModel.imgfilelist = vm.viewModel.filelist;
        },
        fnImgFileDelete: function (vm) {
            this.viewModel.imgdeletefileList = vm.viewModel.deletefileList;
        },
        fnAdd: function () {
            let vm = this.viewModel;
            let checkedBplcListTemp = vm.checkedBplcList;
            let bplcListTemp = vm.bplcList;
            for (let i = 0; i < checkedBplcListTemp.length; i++) {

                for (var ii = 0; ii < bplcListTemp.length; ii++) {
                    if (bplcListTemp[ii].BPLC_SN == checkedBplcListTemp[i][0]) {
                        bplcListTemp.splice(ii, 1);
                        ii--;
                    }
                }

                vm.selectedBplcList.push(vm.checkedBplcList[i]);
            }

            //초기화 해주기
            vm.checkedBplcList = [];
        },
        fnDel: function () {
            let vm = this.viewModel;
            let selectedBplcListTemp = vm.selectedBplcList;
            let checkedBplcListTemp = vm.checkedBplcList2;
            for (let i = 0; i < checkedBplcListTemp.length; i++) {

                for (var ii = 0; ii < selectedBplcListTemp.length; ii++) {
                    if (selectedBplcListTemp[ii][0] == checkedBplcListTemp[i][0]) {
                        selectedBplcListTemp.splice(ii, 1);
                        ii--;
                    }
                }

                vm.bplcList.push({
                    'BPLC_SN': checkedBplcListTemp[i][0],
                    'BPLC_NM': checkedBplcListTemp[i][1]
                });
            }

            //초기화 해주기
            vm.checkedBplcList2 = [];
        },
        fnPush: function () {
            let vm = this;
            var bplcList = [];
            vm.viewModel.selectedBplcList.forEach(item => {
                bplcList.push(item[0]);
            });
            let data = {
                list: bplcList,
            }
            Axios.post("/selectBplcMng.do", data).then(function (res) {
                $.ajax({
                    type: "post",
                    url: "/api/pushSendPerson.do",
                    data: {
                        // 제목 및 내용
                        title: "기상변화 안전대책",
                        message: "새로운 기상변화 안전대책이 등록되었습니다, 확인바랍니다.",
                        user_id: res.data,
                        // 클릭 시 이동 화면주소
                        link: "/m/chkHthAct/wcSftPl/wcSftPlMng.do"
                    }
                });
            });

        }
    }
};
</script>
