<template>
<div class="entry-body">
    <section>
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
                        <th scope="row">사번</th>
                        <td>
                            <input type="text" name="rank" value="자동생성" disabled>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">아이디</th>
                        <td>
                            <input type="text" name="rank" value="" v-model="viewModel.detailUser.user_id" id="user_id">
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">비밀번호 초기화</th>
                        <td>
                            <button class="btn primary" @click="fnPswdReset()">초기화</button>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">성명</th>
                        <td>
                            <input type="text" name="rank" value="" v-model="viewModel.detailUser.user_name" id="user_name">
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">현장명</th>
                        <td>
                            <select v-model="viewModel.bplc_sn">
                                <option v-for="(item, i) in viewModel.bplcList" :key="i" :value="item.BPLC_SN">{{item.BPLC_NM }}</option>
                            </select>
                        </td>
                    </tr>
                    <tr v-if="viewModel.userInfo.user_roles == 'ROLE_001'">
                        <th scope="row">타현장 권한부여</th>
                        <td>
                            <button class="btn primary" @click="fnPopup()">권한부여</button>
                        </td>
                    </tr>
                    <!-- <tr>
                    <th>담당부서</th>
                    <td>
                        <select @change="fnTeamSelect()" v-model="viewModel.dept_sn" id="dept_sn">
                            <option v-for="(item, i) in viewModel.deptList" :key="i" :value="item.DEPT_SN">{{item.DEPT_NM }}</option>
                        </select>
                    </td>
                </tr>
                <tr>
                    <th>담당팀</th>
                    <td>
                        <select v-model="viewModel.team_sn">
                            <option v-for="(item, i) in viewModel.teamList" :key="i" :value="item.TEAM_SN">{{item.TEAM_NM }}</option>
                        </select>
                    </td>
                </tr> -->
                    <tr>
                        <th scope="row">직종</th>
                        <td>
                            <select @change="fnOcptSelect()" v-model="viewModel.ocpt_se_cd" id="">
                                <option v-for="item in viewModel.ocptList" :key="item" :value="item.OCPT_SE_CD">{{ item.OCPT_SE_NM }}</option>
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">세부직종</th>
                        <td>
                            <select v-model="viewModel.ocpt_detail_cd" id="">
                                <option v-for="item in viewModel.ocptDetailList" :key="item" :value="item.OCPT_DETAIL_CD">{{ item.OCPT_DETAIL_NM }}</option>
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">이메일</th>
                        <td>
                            <input type="text" name="rank" value="" v-model="viewModel.detailUser.user_email" id="user_email">
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">휴대폰</th>
                        <td>
                            <input type="text" name="rank" value="" v-model="viewModel.phone">
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="table_footer btn-right">
            <a href="#" class="btn primary" type="submit" value="저장하기" v-on:click="fnUpdate()">저장하기</a>
            <router-link to='/' class="btn line">목록으로</router-link>
        </div>
    </section>
    <!-- <addBplc ref="addBplc" v-if="addBplcPopup==true"></addBplc> -->
</div>
</template>

<script>
import 'es6-promise/auto'
import Vue from 'vue'
import Axios from 'axios'
// import addBplc from "../../sshm_main/popup/addBplcPopup.vue";
import Message, {
    messageUtil
} from "../../../common/js/message";
import fromValidation from "../../../common/js/fromValidation";

Vue.config.devtools = true;

export default {
    data: function () {
        return {
            addBplcPopup: false,
            viewModel: {
                list: [],
                // deptList: [],
                // teamList: [],
                ocptList: [],
                bplcList: [],
                userInfo: {},
                ocptDetailList: [],
                detailUser: {
                    user_type_code: 'ACC_0001',
                    user_phone: ""
                },
                phone: "",
                ocpt_se_cd: "",
                ocpt_detail_cd: "",
                regId: /^[A-Za-z0-9]{4,12}$/,
                regPass: /^[A-Za-z0-9]{8,16}$/,
                regEmail: /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i,
                regPhone: /^(01[016789]{1}|02|0[3-9]{1}[0-9]{1})[0-9]{3,4}[0-9]{4}$/,
            },
            isSaved:false,
        }
    },
    components: {
        // 'addBplc': addBplc,
    },
    mounted: function () {
        let vm = this;
        vm.viewModel.uid = vm.$route.params.path;
        vm.viewModel.userInfo = vm.$store.state.global.userInfo;
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
    methods: {
        fnInit: function () {
            let vm = this;
            // let data = {
            //     mapperId: 'base.selectBplcList',
            //     totalId: 'base.selectBplcTotalCount',
            //     pageNo: 0,
            // };

            // Axios.post("/adminlist.do", data)
            //     .then(function (response) {
            //         vm.viewModel.bplcList = response.data.list;
            //     });

            let data2 = {
                mapperId: 'base.selectOcptList',
                totalId: 'base.selectOcptTotalCount',
                pageNo: 0,
            };

            Axios.post("/adminlist.do", data2)
                .then(function (response) {
                    vm.viewModel.ocptList = response.data.list;
                });

            if (vm.$route.params.path != null && vm.$route.params.path != undefined) {
                vm.fnDetail(vm.$route.params.path);
            }
        },
        fnTeamSelect: function () {
            let vm = this;
            let data = {
                mapperId: 'base.selectTeamList',
                totalId: 'base.selectTeamTotalCount',
                dept_sn: vm.viewModel.dept_sn,
                pageNo: 0,
            };

            Axios.post("/adminlist.do", data)
                .then(function (response) {
                    vm.viewModel.teamList = response.data.list;
                });
        },
        fnOcptSelect: function () {
            let vm = this;
            let data = {
                mapperId: 'base.selectOcptDetailList',
                totalId: 'base.selectOcptDetailTotalCount',
                ocpt_se_cd: vm.viewModel.ocpt_se_cd,
                pageNo: 0,
            };

            Axios.post("/adminlist.do", data)
                .then(function (response) {
                    vm.viewModel.ocptDetailList = response.data.list;
                });
        },
        fnUpdate: function () {
            let vm = this;
            const valiData = [{
                    id: 'user_id',
                    type: 'input',
                    title: '사용자 아이디'
                },
                {
                    id: 'user_name',
                    type: 'input',
                    title: '사용자 이름'
                },
                // {
                //     id: 'user_email',
                //     type: 'input',
                //     title: '사용자 이메일'
                // },
            ];

            
            if (fromValidation(valiData) && confirm(Message.UPDATE_CONFIRM)) {
                let data = {
				user_id : vm.viewModel.detailUser.user_id,
				user_nm : vm.viewModel.detailUser.user_name,
				user_phone : vm.viewModel.phone,
				user_eml : vm.viewModel.detailUser.user_email,
				bplc_sn : vm.viewModel.bplc_sn,
				dept_sn : vm.viewModel.dept_sn,
				team_sn : vm.viewModel.team_sn,
				ocpt_se_cd : vm.viewModel.ocpt_se_cd,
				ocpt_detail_cd : vm.viewModel.ocpt_detail_cd,
				mod_id : vm.$store.state.global.userInfo.user_id,
				jbgd_sn : null,
				jbttl_sn : null,
				};
                Axios.post("/updateAccount.do", data)
                    .then(function (response) {
                        if (response.data.resultCount == 0) {
                            alert("사용자 수정에 실패하였습니다.\n 입력정보를 확인해주세요.");
                            return false;
                        } else {
                            vm.isSaved = true;
                            alert("저장이 완료되었습니다.");
							vm.$router.push('/');
                        }
                    });
            }
        },
        fnDetail: function (uid) {
            let vm = this;
            let data = {
                uid: uid,
            }
            Axios.post("/selectAccountDetail.do", data)
                .then(function (response) {
                    vm.viewModel.detailUser.user_id = response.data.USER_ID;
                    vm.viewModel.detailUser.user_name = response.data.USER_NM;
                    vm.viewModel.phone = response.data.USER_PHONE;
                    vm.viewModel.detailUser.user_email = response.data.USER_EML;
                    vm.viewModel.bplc_sn = response.data.BPLC_SN;
                    // vm.viewModel.dept_sn = response.data.DEPT_SN;
                    // vm.fnTeamSelect();
                    vm.viewModel.team_sn = response.data.TEAM_SN;
                    vm.viewModel.ocpt_se_cd = response.data.OCPT_SE_CD;
                    vm.fnOcptSelect();
                    vm.viewModel.ocpt_detail_cd = response.data.OCPT_DETAIL_CD;
                    vm.fnSetBplcList();
                });

        },
        fnPopup: function () {
            let vm = this;
            vm.addBplcPopup = true;
            vm.$nextTick(function () {
                if (vm.addBplcPopup) {
                    vm.$refs.addBplc.fnInit();
                }
            })
        },

        fnPswdReset: function () {
            let vm = this;
            let data = {
                user_id: vm.viewModel.detailUser.user_id,
                newPassword : '',
            }
            if (confirm("비밀번호를 초기화하시겠습니까?")) {
                Axios.post("/updatePasswordReset.do", data)
                    .then(function (response) {
                        if (response.data.result == 1) {
                            alert("비밀번호를 초기화 하였습니다. \n 초기화 된 비밀번호 : "+response.data.pswd);
                        }
                    });
            }
        },
        fnSetBplcList: function() {
            let vm = this;
            let data = {
                user_id: vm.viewModel.detailUser.user_id,
            }
            Axios.post("/selectAccountSetBplcList.do", data).then(function (response) {
                vm.viewModel.bplcList = response.data;
            });

        }
        

    }
}
</script>
