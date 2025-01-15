<template>
<section class="entry-body">
    <div class="section-header">
        <h3>사원 등록</h3>
    </div>
    <div class="form-box">
        <table class="table-1 top-line th-left">
            <caption>사원 입력폼</caption>
            <colgroup>
                <col width="15%">
                <col width="">
            </colgroup>
            <tbody>
                <tr>
                    <th>권한</th>
                    <td>
                        <label class="check_label mr30">작업중지 문자수신
                            <input type="checkbox" name="is_work_stop" v-model="viewModel.list.workstop">
                            <span class="checkmark"></span>
                        </label>

                        <label class="check_label mr30">비상대응 인원소집
                            <input type="checkbox" name="is_emergency" v-model="viewModel.list.emergency">
                            <span class="checkmark"></span>
                        </label>

                        <label class="check_label mr30">작업허가 승인권한
                            <input type="checkbox" name="is_permit" v-model="viewModel.list.permit">
                            <span class="checkmark"></span>
                        </label>

                        <label class="check_label mr30">종사자의견 Staff
                            <input type="checkbox" name="is_staff" v-model="viewModel.list.staff">
                            <span class="checkmark"></span>
                        </label>

                        <label class="check_label mr30">모든사업장보기 권한
                            <input type="checkbox" name="is_all_auth" v-model="viewModel.list.allauth">
                            <span class="checkmark"></span>
                        </label>
                    </td>
                </tr>
                <tr>
                    <th>일정관리 권한</th>
                    <td>
                        <label class="check_label mr30">일정-모든사업장전체현황
                            <input type="checkbox" name="is_sch_all_auth" v-model="viewModel.list.schallauth">
                            <span class="checkmark"></span>
                        </label>

                        <label class="check_label mr30">일정-내사업장전체현황
                            <input type="checkbox" name="is_sch_group_auth" v-model="viewModel.list.schgroupauth">
                            <span class="checkmark"></span>
                        </label>
                    </td>
                </tr>
                <tr>
                    <th>파일다운로드 불가</th>
                    <td>
                        <label class="check_label mr30">파일다운로드 불가 권한
                            <input type="checkbox" name="no_filedown" v-model="viewModel.list.nofiledown">
                            <span class="checkmark"></span>
                        </label>
                    </td>
                </tr>
                <tr>
                    <th scope="row">사번</th>
                    <td>
                        <input type="text" name="rank" value="" v-model="viewModel.list.uid" disabled>
                    </td>
                </tr>
                <tr>
                    <th scope="row">아이디</th>
                    <td>
                        <input type="text" name="rank" value="" v-model="viewModel.list.user_id" disabled>
                    </td>
                </tr>
                <tr>
                    <th scope="row">비밀번호 초기화</th>
                    <td>
                        <div class="add-on">
                            초기화
                        </div>
                    </td>
                </tr>
                <tr>
                    <th scope="row">성명</th>
                    <td>
                        <input type="text" name="rank" value="" v-model="viewModel.list.user_name" id="user_name">
                    </td>
                </tr>
                <tr>
                    <th scope="row">안전직무</th>
                    <td>
                        <select v-model="viewModel.list.secucode" id="security_code">
                            <option name="없음" value="0">없음</option>
                            <option v-for="item in viewModel.securitylist" :key="item" :value="item.security_code">{{ item.security_name }}</option>
                        </select>
                    </td>
                </tr>
                <tr>
                    <th scope="row">사업장</th>
                    <td>
                        <select v-model="viewModel.list.group_uid" @change="fnGroupChange();" id="group">
                            <option v-for="item in viewModel.grouplist" :key="item" :value="item.uid">{{ item.name }}</option>
                        </select>
                    </td>
                </tr>
                <tr>
                    <th scope="row">부서</th>
                    <!-- <td @click="fnGetSelectDept(viewModel.list.group_uid)"> -->
                    <td>
                        <select v-model="viewModel.list.user_dept" id="dept">
                            <option v-for="item in viewModel.filterDeptList" :key="item" :value="item.uid">{{ item.name }}</option>
                        </select>
                    </td>
                </tr>
                <tr>
                    <th scope="row">직급</th>
                    <td>
                        <select v-model="viewModel.list.job_id" id="job">
                            <option v-for="item in viewModel.joblist" :key="item" :value="item.uid">{{ item.name }}</option>
                        </select>
                    </td>
                </tr>
                <tr>
                    <th scope="row">이메일</th>
                    <td>
                        <input type="text" name="rank" value="" v-model="viewModel.list.user_email" id="user_email">
                    </td>
                </tr>
                <tr>
                    <th scope="row">휴대폰</th>
                    <td>
                        <input type="text" name="rank" value="" style="width:200px;" v-model="viewModel.list.user_phone">
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
    <div class="align-right">
        <a href="#" class="btn primary" type="submit" value="저장하기" v-on:click="fnUpdateAuth()">저장하기</a>
        <router-link :to="'/'" class="btn line">목록으로</router-link>
    </div>
</section>
</template>

<script>
import 'es6-promise/auto'
import Vue from 'vue'
import Axios from 'axios'
import Message, {
    messageUtil
} from "../../../common/js/message";
import fromValidation from "../../../common/js/fromValidation";

export default {
    data: function () {
        return {
            viewModel: {
                list: [],
                authlist: [],
                workstop: "",
                emergency: "",
                permit: "",
                staff: "",
                allauth: "",
                schallauth: "",
                schgroupauth: "",
                nofiledown: "",
                grouplist: [],
                deptlist: [],
                filterDeptList: [],
                joblist: [],
                securitylist: [],
                detailUser: {
                    user_type_code: 'ACC_0001'
                },
                checkedItem: "ROLE_002",
                pwd1: "",
                pwd2: "",
                phone1: "",
                phone2: "",
                phone3: "",
                site_uid: 0,
                owner: 0,
                name: "",
                contents: "",
                secucode: "",
                rank: 999,
                is_use: 1,
                regdt: "",
                regId: /^[A-Za-z0-9]{4,12}$/,
                regPass: /^[A-Za-z0-9]{8,16}$/,
                regEmail: /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i,
                regPhone: /^(01[016789]{1}|02|0[3-9]{1}[0-9]{1})-[0-9]{3,4}-[0-9]{4}$/,
            },
            user_pwd: '',
        }
    },
    mounted: function () {
        let vm = this;
        vm.fnGetSelectAuthList();
        vm.fnGetSelectGroup();
        vm.fnGetSelectJob();
        vm.fnGetSelectSecurityList();
        vm.fnGetSelectList();

    },
    methods: {
        fnGetSelectAuthList: function () {
            console.log('Authlist')
            let vm = this;
            let senddata = {
                mapperId: 'base.selectmenuTypeAuthDetail',
                uid: parseInt(vm.$route.params.path)
            };
            Axios.post("/admindetail", senddata)
                .then(function (response) {
                    vm.viewModel.authlist = response.data;

                });
        },
        fnGetSelectList: function () {
            let vm = this;
            let senddata = {
                mapperId: 'base.selectmemberListDetail',
                uid: parseInt(vm.$route.params.path)
            };
            Axios.post("/admindetail", senddata)
                .then(function (response) {
                    vm.viewModel.list = response.data[0];
                    console.log(response.data[0]);
                }).then(function () {
                    vm.fnGetSelectDept();
                });
        },
        fnGetSelectGroup: function () {
            let vm = this;
            let senddata = {
                mapperId: 'base.selectdeptWriteList'
            };
            Axios.post("/admindetail", senddata)
                .then(function (response) {
                    vm.viewModel.grouplist = response.data;
                });
        },
        fnGetSelectDept: function () {
            let vm = this;
            let senddata = {
                mapperId: 'base.selectmemberdept',
                id: vm.viewModel.group_uid
            };
            Axios.post("/admindetail", senddata)
                .then(function (response) {
                    vm.viewModel.deptlist = response.data;
                }).then(function () {
                    vm.fnGroupChange();
                });
        },
        fnGetSelectJob: function () {
            let vm = this;
            let senddata = {
                mapperId: 'base.selectmemberjob'
            };
            Axios.post("/admindetail", senddata)
                .then(function (response) {
                    vm.viewModel.joblist = response.data;
                });
        },
        fnGetSelectSecurityList: function () {
            let vm = this;
            let senddata = {
                mapperId: 'base.selectmembersecurityList'
            };
            Axios.post("/admindetail", senddata)
                .then(function (response) {
                    vm.viewModel.securitylist = response.data;
                });
        },
        fnUpdateAuth: function () {
            let vm = this;

            const valiData = [{
                    id: 'user_name',
                    type: 'input',
                    title: '사용자 이름'
                },
                {
                    id: 'user_email',
                    type: 'input',
                    title: '사용자 이메일'
                },
                {
                    id: 'security_code',
                    type: 'select',
                    title: '안전직무'
                },
                {
                    id: 'group',
                    type: 'select',
                    title: '사업장'
                },
                {
                    id: 'dept',
                    type: 'select',
                    title: '부서'
                },
                {
                    id: 'job',
                    type: 'select',
                    title: '직급'
                },
            ];

            if (vm.viewModel.list.workstop != false) {
                vm.viewModel.list.is_work_stop = 1;
            } else {
                vm.viewModel.list.is_work_stop = 0;
            };
            if (vm.viewModel.list.emergency != false) {
                vm.viewModel.list.is_emergency = 1;
            } else {
                vm.viewModel.list.is_emergency = 0;
            };
            if (vm.viewModel.list.permit != false) {
                vm.viewModel.list.is_permit = 1;
            } else {
                vm.viewModel.list.is_permit = 0;
            };
            if (vm.viewModel.list.staff != false) {
                vm.viewModel.list.is_staff = 1;
            } else {
                vm.viewModel.list.is_staff = 0;
            };
            if (vm.viewModel.list.allauth != false) {
                vm.viewModel.list.is_all_auth = 1;
            } else {
                vm.viewModel.list.is_all_auth = 0;
            };
            if (vm.viewModel.list.schallauth != false) {
                vm.viewModel.list.is_sch_all_auth = 1;
            } else {
                vm.viewModel.list.is_sch_all_auth = 0;
            };
            if (vm.viewModel.list.schgroupauth != false) {
                vm.viewModel.list.is_sch_group_auth = 1;
            } else {
                vm.viewModel.list.is_sch_group_auth = 0;
            };
            if (vm.viewModel.list.nofiledown != false) {
                vm.viewModel.list.no_filedown = 1;
            } else {
                vm.viewModel.list.no_filedown = 0;
            };

            if (fromValidation(valiData) && confirm(Message.CREATE_CONFIRM)) {
                let data = {
                    mapperId: 'base.updatememberauthdetail',
                    user_id: vm.viewModel.list.user_id,
                    user_name: vm.viewModel.list.user_name,
                    user_dept: vm.viewModel.list.user_dept,
                    job_id: vm.viewModel.list.job_id,
                    user_email: vm.viewModel.list.user_email,
                    user_phone: vm.viewModel.list.user_phone,
                    is_work_stop: vm.viewModel.list.is_work_stop,
                    is_emergency: vm.viewModel.list.is_emergency,
                    is_permit: vm.viewModel.list.is_permit,
                    is_staff: vm.viewModel.list.is_staff,
                    is_all_auth: vm.viewModel.list.is_all_auth,
                    is_sch_all_auth: vm.viewModel.list.is_sch_all_auth,
                    is_sch_group_auth: vm.viewModel.list.is_sch_group_auth,
                    no_filedown: vm.viewModel.list.no_filedown,
                    security_code: vm.viewModel.list.secucode,
                };
                Axios.post("/adminupdate", data).then(function () {
                    let senddata = {
                        user_id: vm.viewModel.list.user_id,
                        user_pwd: vm.viewModel.user_pwd,
                    };
                    // let result = confirm("비밀번호를 변경하시겠습니까?");
                    // if(result){
                    if (vm.viewModel.user_pwd != undefined) {
                        Axios.post("/api/account/pwd/update", {
                                detail: senddata
                            })
                            .then(function (response) {
                                alert("저장이 완료되었습니다.");
                                window.location.reload(true);
                            });
                    } else {
                        alert("저장이 완료되었습니다.");
                        window.location.reload(true);
                    }

                });
            }
        },
        fnGroupChange: function () {
            let vm = this;
            vm.viewModel.filterDeptList = vm.viewModel.deptlist.filter(data => data.group_uid == vm.viewModel.list.group_uid);
        }

    }
}
</script>
