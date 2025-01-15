<template>
<div>
    <div class="contents">
        <div class="box">
            <h3>기본검색 
                <div class="btn-group btn-right">
                    <a href="" class="btn btn-blue" @click="fnGetSelectList(0)">검색</a>
                </div>
            </h3>
            <div class="search_contents">
                <div>
                    <ul class="input_group">
                        <li class="input_group">
                            <label for="">산정기준년월</label>
                            <div class="datepicker_box">
                                <input type="text" class="datepicker" title="멤버십기간" placeholder="멤버십기간 선택" readonly>
                            </div>
                            <span>~</span>
                            <div class="datepicker_box">
                                <input type="text" class="datepicker" title="멤버십기간" placeholder="멤버십기간 선택" readonly>
                            </div>
                        </li>
                        <li class="input_group">
                            <label for=""></label>
                            <input type="text" title="" placeholder="입력해주세요">
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="box">
            <div>
                <div class="table_top">
                    <div class="total_count">전체 <em>123,456</em>건</div>
                    <div class="table_service">
                        <button class="btn btn-darkblue">등록</button>
                    </div>
                </div>
                <table class="table">
                    <caption>회원정보</caption>
                    <thead>
                        <tr>
                            <th scope="col">아이디</th>
                            <th scope="col">멤버십번호</th>
                            <th scope="col">이름</th>
                            <th scope="col">회원구분</th>
                            <th scope="col">회원등급</th>
                            <th scope="col">회원상태</th>
                            <th scope="col">탈퇴여부</th>
                            <th scope="col">멤버십기간</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>0000000000</td>
                            <td>0000000000</td>
                            <td>홍길동</td>
                            <td>블루패밀리 기업</td>
                            <td>PLATINUM</td>
                            <td>정상 </td>
                            <td>N</td>
                            <td>2024-02-28 ~ 2024-12-31</td> 
                        </tr>
                        <tr>
                            <td>0000000000</td>
                            <td>0000000000</td>
                            <td>홍길동</td>
                            <td>블루패밀리 기업</td>
                            <td>PLATINUM</td>
                            <td>정상 </td>
                            <td>N</td>
                            <td>2024-02-28 ~ 2024-12-31</td> 
                        </tr>
                    </tbody>
                </table>
                <div class="table_footer">
                    <ul class="pagination">
                        <li><a href="" class="prev" title="이전 페이지로 이동"></a></li>
                        <li class="active"><a href="">1</a></li>
                        <li><a href="">2</a></li>
                        <li><a href="">3</a></li>
                        <li><a href="">4</a></li>
                        <li><a href="">5</a></li>
                        <li><a href="">6</a></li>
                        <li><a href="">7</a></li>
                        <li><a href="">8</a></li>
                        <li><a href="">9</a></li>
                        <li><a href="">10</a></li>
                        <li><a href="" class="next" title="다음 페이지로 이동"></a></li>
                    </ul>
                    <!-- <pager v-bind:pass="viewModel.pager"></pager> -->
                </div>
            </div>
        </div>
    </div>
    <!-- <excelform ref="excelform"></excelform>
    <resignPopup ref="resignPopup" v-if="pop==true"></resignPopup>
    <printPopup ref="printPopup" v-if="printPop==true"></printPopup> -->
</div>
</template>

<script>
import 'es6-promise/auto'
import Vue from 'vue'
import Axios from 'axios'
import Xlsx from 'xlsx'
import pager from "../../../common/vue/admin_paging.vue";
import Message, {
    messageUtil
} from "../../../common/js/message";
import excelform from "../../frm_main/excelform.vue";
// import resignPopup from "./popup/resignInfoPopup.vue";
// import printPopup from "./popup/memberPrintPopup.vue";
import printJS from 'print-js'

Vue.component("pager", pager);
Vue.config.devtools = true;

export default {
    components: {
        pager,
        'excelform': excelform,
        // 'resignPopup': resignPopup,
        // 'printPopup': printPopup,
    },
    data: function () {
        return {
            pop:false,
            printPop:false,
            excelDownload: [],
            select: "0",
            category: 'user_name',
            viewModel: {
                bplcList: [],
                userInfo: {},
                serachList: {
                    text: "",
                    select_cat: "",
                },
                list: [],
                bplc_sn: "",
                assistant_manager: [],
                ownerlist: [],
                authlist: [],
                auth_uid: "",
                user_auth_click: false,
                name: "",
                pager: {
                    model: {},
                    pageNo: 1,
                    totalSize: 0,
                    rowSize: 5,
                    blockSize: 5,
                    list: [],
                    callBack: function (n) {
                        this.model.fnGetSelectList(n);
                    }
                },
            }
        }
    },
    mounted: function () {
        let vm = this;
        // setTimeout(function () {
        vm.viewModel.userInfo = vm.$store.state.global.userInfo;
        vm.fnGetSelectList(0);
        let data = {
            mapperId: 'comm.selectAllBplcList',
            dept_sn: vm.$store.state.global.userInfo.dept_sn == 0 || vm.$store.state.global.userInfo.dept_sn == 2 ? '' : vm.$store.state.global.userInfo.dept_sn,
            team_sn: vm.$store.state.global.userInfo.team_sn == 0 ? '' : vm.$store.state.global.userInfo.team_sn,
            gbn: 'each',
            bplc_use_yn:'A'
        };
        Axios.post("/list.do", data).then(function (rs) {
            vm.viewModel.bplcList = rs.data.list;
        });
        // },100);
        vm.$router.afterEach((to, from) => {
                vm.fnGetSelectList(vm.viewModel.pager.pageNo);
            });
    },
    methods: {
        fnGetSelectList: function (paramPangeNo) {
            let vm = this;
            let bplc_sn = '';
            let user_roles = vm.$store.state.global.userInfo.user_roles;

            if (user_roles == 'ROLE_002') {
                bplc_sn = vm.$store.state.global.userInfo.bplc_sn;
            } else {
                bplc_sn = vm.viewModel.bplc_sn;
            };
            vm.viewModel.pager.pageNo = paramPangeNo == 0 ? 1 : paramPangeNo;
            let senddata = {
                pageNo: vm.viewModel.pager.pageNo,
                pageSize: vm.viewModel.pager.rowSize,
                bplc_sn: bplc_sn,
                role: 'ROLE_002',
                user_role: vm.$store.state.global.userInfo.user_roles,
                name: vm.viewModel.name,
                category: vm.category,
                ...vm.viewModel.serachList,
            };

            if(vm.viewModel.userInfo.bplc_yn == 'Y'){
                senddata.mapperId = 'base.selectmemberList';
                senddata.totalId = 'base.selectmemberTotalCount';
            }else{
                senddata.dept_sn = vm.$store.state.global.userInfo.dept_sn == 0 ? '' : vm.$store.state.global.userInfo.dept_sn;
                senddata.team_sn = vm.$store.state.global.userInfo.team_sn == 0 ? '' : vm.$store.state.global.userInfo.team_sn;
                senddata.mapperId = 'base.selectmemberList2';
                senddata.totalId = 'base.selectmemberTotalCount2';
            }

            Axios.post("/adminlist.do", senddata)
                .then(function (response) {
                    vm.viewModel.list = response.data.list;
                    let rs = response.data;
                    vm.viewModel.pager.totalSize = rs.totalCNT;
                    pager.props = pager.methods.createPaging(vm.viewModel.pager, vm, "list");

                });
        },
        fnGetChangeSelectList: function (data) {
            let vm = this;
            if (data >= null || data != 0) {
                vm.viewModel.pager.pageNo = 1;
                vm.fnGetSelectList(0);
            }
        },
        fnDelete: function (user_id) {
            let vm = this;

            let data = {
                user_id: user_id,
                mod_id: vm.$store.state.global.userInfo.user_id,
            }

            if (confirm("삭제하시겠습니까?")) {
                Axios.post("/deleteAccount.do", data).then(function (response) {
                    console.log(response.data);
                    if (response.data == 1) {
                        alert("삭제되었습니다.");
                        window.location.reload(true);
                    }
                });
            }

        },
        fnUserAuthClick: function () {
            let vm = this;
            if (vm.viewModel.list.owner == false) {
                vm.viewModel.list.owner = true;
            } else {
                vm.viewModel.list.owner = false;
            }
        },
        fnUpdateAuth: function (uid) {
            let vm = this;
            let menuauth = uid
            for (let i = 0; i < vm.viewModel.list.length; i++) {
                if (vm.viewModel.list[i].uid == menuauth) {
                    let data = {
                        mapperId: 'base.updatememberList',
                        menu_auth: vm.viewModel.list[i].menu_auth,
                        uid: menuauth
                    };
                    Axios.post("/adminupdate.do", data)
                } else {}
            }
            alert("메뉴 권한이 수정되었습니다.");
        },
        test: function (id, name) {
            // let vm = this;
            // let keyEx = $("#keyEx").val();
            // let keyM = $("#keyM").val();
            // let rsa = new RSAKey();
            // rsa.setPublic(keyM,keyEx);

            // let logininfo = new FormData();
            //     logininfo.append("user_id", id);
            //     logininfo.append("keyM", keyM);
            //     logininfo.append("keyEx", keyEx);
            //     Axios.post('/account/admin_menu/login',logininfo)
            //     .then((response) => {
            //         // console.log(response.data);
            //         // window.open(window.location.origin+response.data);
            //     });

            if (confirm("[" + name + "] 으로 로그인하시겠습니까?")) {
                var nw = window.open("about:blank");
                nw.location.href = window.location.origin + "/base/login/change?" + id;
                //location.href = "login_change.php?id="+id;
            }

            // let vm = this;

            // let rsa = new RSAKey();
            // rsa.setPublic(keyM,keyEx);
            // let encID = rsa.encrypt(id);
            // $("#encUserID").val(encID);

            // if(result){
            //     document.forms["mainForm"].submit();
            // }else{
            //     alert('계정 로그인을 취소하였습니다.');
            // }
        },
        fnPrmsnYn: function (user_id, yn) {
            let vm = this;

            if (confirm(yn == 'Y' ? "현장관리자 회원가입을 승인하시겠습니까?" : "현장관리자 회원가입을 승인 취소하시겠습니까?")) {
                let data = {
                    user_id: user_id,
                    mod_id: vm.$store.state.global.userInfo.user_id,
                    join_prmsn_yn: yn,
                }

                Axios.post("/updateJoinPrnsn.do", data).then(function (response) {
                    alert(yn == 'Y' ? "현장관리자 회원가입을 승인되었습니다." : "현장관리자 회원가입을 승인 취소되었습니다.");
                    window.location.reload(true);
                }).catch(function (ex) {
                    alert(Message.ERROR);
                });
            }
        },
        fnExcelDownload: function () {
            let vm = this;
            let bplc_sn = '';
            let user_roles = vm.$store.state.global.userInfo.user_roles;
            if (user_roles == 'ROLE_002') {
                bplc_sn = vm.$store.state.global.userInfo.bplc_sn;
            } else {
                bplc_sn = vm.viewModel.bplc_sn;
            };
            const header = ['ID',
                '성명',
                '현장명',
                '부서명',
                '직종',
                '이메일',
                '휴대폰',
                '나이',
                '신장',
                '체중',
                '혈액형',
                '혈압약복용여부',
                '당뇨유무',
                '고혈압유무',
                '요추디스크유무',
                '경추디스크유무',
                '과거산재/교통사고유무',
                '비상연락망_관계',
                '비상연락망_성명',
                '비상연락망_연락처',
                '입사일자',
                '회원가입일자'
            ];
            let excelList = [];
            let senddata = {
                header: header,
                mapperId: 'selectmemberList',
                bplc_sn: bplc_sn,
                role: 'ROLE_002',
                user_role: vm.$store.state.global.userInfo.user_roles,
                name: vm.viewModel.name,
                category: vm.category,
                ...vm.viewModel.serachList,
                // 파일명 
                fileName: "현장사용자리스트", // 스마트안전보건_년월일.xlsx
            };

            if(vm.viewModel.userInfo.bplc_yn == 'Y'){
                senddata.mapperId = 'selectmemberList';
            }else{
                senddata.dept_sn = vm.$store.state.global.userInfo.dept_sn == 0 ? '' : vm.$store.state.global.userInfo.dept_sn;
                senddata.team_sn = vm.$store.state.global.userInfo.team_sn == 0 ? '' : vm.$store.state.global.userInfo.team_sn;
                senddata.mapperId = 'selectmemberList2';
            }

            if (confirm("엑셀 출력 하시겠습니까?")) {
                this.$nextTick(function () {
                    vm.$refs.excelform.fnInit(senddata);
                })
            }
        },
        fnPopup: function(bplc_sn, user_id, gbn) {
            let vm = this;
            vm.pop=true;
            vm.printPop=false;
            vm.$nextTick(function() {
                if(vm.pop) {
                    vm.$refs.resignPopup.fnInit(bplc_sn, user_id, gbn);
                }
            })
        },
        fnPrint: function(user_id, bplc_sn){
            let vm = this;
            
            var arr = [];
            if(vm.viewModel.userInfo.bplc_yn == 'Y'){
                arr.push(bplc_sn);
            }else{
                arr = bplc_sn.split(",");
            }

            if(arr.length > 1){
                alert("현장명을 조회 후 채용서약서 인쇄가 가능합니다.");
                return false;
            }else if(bplc_sn != '' && bplc_sn != null && bplc_sn != undefined){
                vm.pop=false;
                vm.printPop=true;
                vm.$nextTick(function() {
                    if(vm.printPop) {
                        vm.$refs.printPopup.fnInit(user_id,bplc_sn);
                    }
                })
            }else if(bplc_sn == undefined){
                alert("현장 지정후 인쇄 가능합니다.");
                return false;
            }else{
                alert("현장명을 조회 후 채용서약서 인쇄가 가능합니다.");
                return false;
            }
            
        }

    }
}
</script>
