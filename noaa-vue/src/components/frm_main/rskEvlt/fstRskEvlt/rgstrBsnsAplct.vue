<template>
    <div>
        <div class="search_area opened">
            <div>
                
                <div class="input_group" v-if="viewModel.userInfo.user_roles == 'ROLE_001'">
                    <select id="list" v-model="viewModel.bplc_use_yn" style="width: 10%;">
                        <option value="A">전체</option>
                        <option value="Y" selected="selected">운영</option>
                        <option value="N">종료</option>
                    </select>
                    <select id="list" v-model="viewModel.bplc_sn" style="width: 20%;" v-if="viewModel.userInfo.user_roles == 'ROLE_001'">
                        <option value="0" selected="">현장명 선택</option>
                        <option :value="item.bplc_sn" v-for="(item,i) in viewModel.bplcList" :key="i">{{ item.bplc_nm }}</option>
                    </select>
                    <a @click="fnSelect" class="btn btn-default" style="width: 5%; display:inline-flex;" v-if="viewModel.userInfo.user_roles == 'ROLE_001'"><svg class="icon">
                    <use xlink:href="../../img/symbol-defs.svg#icon-search"></use>
                </svg>검색</a>
                </div>
                <input type="text" v-model="viewModel.userInfo.bplc_nm" v-else disabled />
            </div>
        </div>
        <div class="contents">
    
            <div>
                <div class="table_top">
                    <div class="total_count">총 <em>{{ viewModel.pager.totalSize }}</em>건</div>
                    <!-- <div class="icon_box">
                        <button class="btn btn-white"><i class="icon_pdf"></i></button>
                        <button class="btn btn-white"><i class="icon_word"></i></button>
                        <button class="btn btn-white"><i class="icon_ppt"></i></button>
                        <button class="btn btn-white"><i class="icon_excel"></i></button>
                    </div> -->
                    <select v-model="viewModel.pager.rowSize" @change="fnChangeCNTSelect(viewModel.pager.rowSize);">
                        <option value="10">10개씩 보기</option>
                        <option value="30">30개씩 보기</option>
                        <option value="50">50개씩 보기</option>
                        <option value="100">100개씩 보기</option>
                    </select>
                </div>
                <table class="table">
                    <caption>회의록 등록</caption>
                    <thead>
                        <tr>
                            <th scope="col" rowspan="2" class="w50">번호</th>
                            <th scope="col" rowspan="2" v-if="viewModel.userInfo.user_roles == 'ROLE_001'">현장명</th>
                            <th scope="col" rowspan="2">회의일시</th>
                            <th scope="col" rowspan="2">회의장소</th>
                            <th scope="col" rowspan="2">회의록</th>
                            <th scope="colgroup" colspan="3">결재</th>
                            <th scope="col" rowspan="2">첨부</th>
                            <th scope="col" rowspan="2">관리</th>
                        </tr>
                        <tr>
                            <th scope="col">작성자</th>
                            <th scope="col">조정자</th>
                            <th scope="col">결정자</th>
                            <!-- <th>회의참석자</th> -->
                        </tr>
                    </thead>
                    <tbody v-if="viewModel.list.length > 0">
                        <tr v-for="(item,i) in viewModel.list" :key="i">
                            <td>{{(viewModel.pager.pageNo==1) ? viewModel.pager.totalSize-i : viewModel.pager.totalSize-((viewModel.pager.rowSize*(viewModel.pager.pageNo-1))+i)}}</td>
                            <td class="text-left" v-if="viewModel.userInfo.user_roles == 'ROLE_001'">{{item.bplc_nm}}</td>
                            <td>{{item.mtg_dt|yyyyMMdd}}</td>
                            <td class="text-left">{{ item.mtg_plc }}</td>
                            <td><button class="btn btn-small btn-white" @click="fnViewPopup(item.mtg_sn,item.bplc_sn)">보기</button></td>
                            <td v-if="item.wrtr_sign_yn == 'Y'"><button class="btn btn-small btn-blue">완료</button></td>
                            <td v-else-if="item.wrtr_sign_yn == 'N' && item.wrtr == viewModel.userInfo.user_id"><button class="btn btn-small btn-purple" @click="fnSignBtn(item.bplc_sn,item.mtg_sn,'wrtr',i)">결재</button></td>
                            <td v-else><button class="btn btn-small btn-gray">해당없음</button></td>
                            <td v-if="item.mdtr_sign_yn == 'Y'"><button class="btn btn-small btn-blue">완료</button></td>
                            <td v-else-if="item.mdtr_sign_yn == 'N' && item.mdtr == viewModel.userInfo.user_id"><button class="btn btn-small btn-purple" @click="fnSignBtn(item.bplc_sn,item.mtg_sn,'mdtr',i)">결재</button></td>
                            <td v-else><button class="btn btn-small btn-gray">해당없음</button></td>
                            <td v-if="item.dcsn_sign_yn == 'Y'"><button class="btn btn-small btn-blue">완료</button></td>
                            <td v-else-if="item.dcsn_sign_yn == 'N' && item.dcsn == viewModel.userInfo.user_id"><button class="btn btn-small btn-purple" @click="fnSignBtn(item.bplc_sn,item.mtg_sn,'dcsn',i)">결재</button></td>
                            <td v-else><button class="btn btn-small btn-gray">해당없음</button></td>
                            <!-- <td v-if="viewModel.mtgUser.SIGN_YN == 'N' && viewModel.mtgUser.ATDRN == viewModel.userInfo.user_id"><button class="btn btn-small btn-purple">서명</button></td>
                            <td v-else-if="viewModel.mtgUser.SIGN_YN == 'Y' && viewModel.mtgUser.ATDRN == viewModel.userInfo.user_id"><button class="btn btn-small btn-blue">완료</button></td>
                            <td v-else><button class="btn btn-small btn-gray">해당없음</button></td> -->
                            <td>
                                <button v-if="item.file_cnt > 0" class="btn btn-icon" @click="fnPopup(item.mtg_sn);"><svg class="icon">
                                        <use xlink:href="../../img/symbol-defs.svg#icon-attachment"></use>
                                    </svg></button>
                            </td>
                            <td>
                                <router-link :to="'/detail/'+item.bplc_sn+'/'+item.mtg_sn" href="javacript:;" class="btn btn-icon"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-content-search"></use></svg></router-link>
                                <router-link :to="'/write/'+item.bplc_sn+'/'+item.mtg_sn" class="btn btn-icon" v-if="item.dcsn_sign_yn == 'N' && (item.wrtr == viewModel.userInfo.user_id || viewModel.userInfo.user_roles == 'ROLE_001')"><svg class="icon">
                                        <use xlink:href="../../img/symbol-defs.svg#icon-edit-contents"></use>
                                    </svg></router-link>
                                <button class="btn btn-icon" v-if="item.dcsn_sign_yn == 'N' && (item.wrtr == viewModel.userInfo.user_id || viewModel.userInfo.user_roles == 'ROLE_001')" @click="fnDelete(item.bplc_sn,item.mtg_sn)"><svg class="icon">
                                        <use xlink:href="../../img/symbol-defs.svg#icon-delete-sweep"></use>
                                    </svg></button>
                            </td>
                        </tr>
                    </tbody>
                    <tbody v-else>
                        <tr>
                            <td :colspan="viewModel.userInfo.user_roles == 'ROLE_001' ? '10' : '9'" >등록된 데이터가 없습니다.</td>
                        </tr>
                    </tbody>
                </table>
                <div class="table_footer">
                    <pager :pass="viewModel.pager"></pager>
                    <div class="btn-group">
                        <!-- <div class="upload_file">
                            <div class="btn filebox">
                                첨부파일을 마우스로 드래그해서 추가해 주세요.
                                <svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-mouse"></use></svg>
                            </div>
                        </div>		 -->
                        <!-- <a href="" class="btn btn-white"><i class="icon_excel"></i>엑셀업로드</a> -->
                        <router-link :to="'/write/'+viewModel.bplc_sn" class="btn btn-purple" v-if="viewModel.bplc_sn !=0 && viewModel.bplc_sn != ''"><svg class="icon">
                                <use xlink:href="../../img/symbol-defs.svg#icon-post-add"></use>
                            </svg>등록</router-link>
                        <!-- <a href="" class="btn btn-gray"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-trash-can"></use></svg>삭제</a> -->
                    </div>
                </div>
            </div>
        </div>
        <viewPopup ref="viewPopup" v-if="viewPopup==true"></viewPopup>
        <fileViewPopup ref="fileViewPopup" v-if="fileViewPop==true"></fileViewPopup>
    </div>
    </template>
    
    <script>
    import "es6-promise/auto";
    import Vue from "vue";
    import Axios from "axios";
    import Pager from "../../../paging.vue";
    import viewPopup from "./popup/rgstrBsnsAplctViewPopup.vue";
    import fileViewPopup from '../../popup/fileViewPopup.vue';
    
    export default {
        components: {
            'pager': Pager,
            'viewPopup': viewPopup,
            'fileViewPopup': fileViewPopup,
        },
        data: function () {
            return {
                viewPopup: false,
                fileViewPop:false,
                imgsrc: '',
                viewModel: {
                    bplc_use_yn:'',
                    bplc_sn: 0,
                    bplcList: [],
                    userInfo: {},
                    list: [],
                    // mtgUser: {
                    //     SIGN_YN: "",
                    //     ATDRN: ""
                    // },
                    pager: {
                        model: {},
                        pageNo: 1,
                        totalSize: 0,
                        rowSize: 10,
                        blockSize: 10,
                        list: [],
                        callBack: function (n) {
                            try {
                                this.model.fnList(n);
                            } catch (e) {
                                console.log('callback error  ' + e);
                            }
                        }
                    },
                }
            };
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
        mounted: function () {
            let vm = this;
            vm.fnInit();
            
            vm.$router.afterEach((to, from) => {
                vm.fnList(vm.viewModel.pager.pageNo);
            });
        },
        methods: {
            fnInit: function () {
                let vm = this;
                vm.viewModel.userInfo = vm.$store.state.global.userInfo;
                vm.viewModel.bplc_use_yn = vm.viewModel.userInfo.bplc_yn == 'N' ? 'Y' : 'A';
                vm.viewModel.bplc_sn = (vm.viewModel.userInfo.bplc_yn == 'N' && (vm.viewModel.userInfo.bplc_sn == 0 || vm.viewModel.userInfo.bplc_use_yn == 'N')) ? '0': vm.viewModel.userInfo.bplc_sn;

            
                vm.fnList(0);
            },
            fnList: function (paramPageNo) {
                let vm = this;
                vm.viewModel.pager.pageNo = paramPageNo == 0 ? 1 : paramPageNo;
                let data = {};
                // if (vm.viewModel.userInfo.user_roles == 'ROLE_001') {
                //     data = {
                //         mapperId: 'comm.selectAllBplcList'
                //     };
                //     Axios.post("/list.do", data).then(function (rs) {
                //         vm.viewModel.bplcList = rs.data.list;
                //     });
    
                    data = {
                        pageYn: 'Y',
                        pageNo: vm.viewModel.pager.pageNo,
                        pageSize: vm.viewModel.pager.rowSize,
                        bplc_sn: vm.viewModel.bplc_sn,
                        user_id: vm.viewModel.userInfo.user_id,
                        bplc_use_yn: vm.viewModel.bplc_use_yn,
                        dept_sn: vm.viewModel.userInfo.dept_sn,
                        team_sn: vm.viewModel.userInfo.team_sn,
                    }
    
                    Axios.post("/selectFstRskEvltMtgList.do", data)
                        .then(function (response) {
                            vm.viewModel.list = response.data.list;
                            // vm.viewModel.mtgUser = response.data.mtgUser;
                            vm.viewModel.pager.totalSize = response.data.totalCNT;
                            //페이징세팅
                            Pager.props = Pager.methods.createPaging(vm.viewModel.pager, vm, "list");
                        });
                // } else {
                //     data = {
                //         pageYn: 'Y',
                //         pageNo: vm.viewModel.pager.pageNo,
                //         pageSize: vm.viewModel.pager.rowSize,
                //         bplc_sn: vm.viewModel.bplc_sn,
                //         user_id: vm.viewModel.userInfo.user_id,
                //     }
    
                //     Axios.post("/selectFstRskEvltMtgList.do", data)
                //         .then(function (response) {
                //             vm.viewModel.list = response.data.list;
                //             // vm.viewModel.mtgUser = response.data.mtgUser;
                //             vm.viewModel.pager.totalSize = response.data.totalCNT;
                //             //페이징세팅
                //             Pager.props = Pager.methods.createPaging(vm.viewModel.pager, vm, "list");
                //         });
                // }
            },
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
                    
                    vm.viewModel.bplc_sn = '0';
                    if(vm.viewModel.userInfo.bplc_use_yn == 'Y' && vm.viewModel.bplc_use_yn == 'Y'){
                        vm.viewModel.bplc_sn = vm.viewModel.userInfo.bplc_sn == 0 ? '0' : vm.viewModel.userInfo.bplc_sn;
                    }

                });
            },
            //페이징 처리
            fnChangeCNTSelect: function (rowSize) {
                let vm = this;
                if (rowSize != undefined || rowSize > 0) {
                    vm.viewModel.pager.rowSize = rowSize
                    vm.fnList(0);
                }
            },
            fnSelect: function () {
                let vm = this;
    
                let data = {
                    pageYn: 'Y',
                    pageNo: vm.viewModel.pager.pageNo,
                    pageSize: vm.viewModel.pager.rowSize,
                    bplc_sn: vm.viewModel.bplc_sn,
                    user_id: vm.viewModel.userInfo.user_id,
                    bplc_use_yn: vm.viewModel.bplc_use_yn,
                    dept_sn: vm.viewModel.userInfo.dept_sn,
                    team_sn: vm.viewModel.userInfo.team_sn,
                }
    
                Axios.post("/selectFstRskEvltMtgList.do", data)
                    .then(function (response) {
                        vm.viewModel.list = response.data.list;
                        // vm.viewModel.mtgUser = response.data.mtgUser;
                        vm.viewModel.pager.totalSize = response.data.totalCNT;
                        //페이징세팅
                        Pager.props = Pager.methods.createPaging(vm.viewModel.pager, vm, "list");
                    });
            },
            fnSignBtn: function (bplc_sn, mtg_sn, gbn, i) {
                let vm = this;
                if (gbn == 'dcsn'){
                    if(vm.viewModel.list[i].wrtr_sign_yn == "N") return alert("작성자 결재 후 결재가능합니다.");
                    if(vm.viewModel.list[i].mdtr != "" && vm.viewModel.list[i].mdtr_sign_yn == "N") return alert("조정자 결재 후 결재가능합니다.");
                }
    
                if (gbn == 'mdtr'){
                    if(vm.viewModel.list[i].wrtr_sign_yn == "N") return alert("작성자 결재 후 결재가능합니다.");
                }
                let data = {
                    bplc_sn: bplc_sn,
                    mtg_sn: mtg_sn,
                    gbn: gbn,
                }
                if (confirm("서명하시겠습니까?")) {
                    Axios.post("/updateFstRskEvltSign.do", data).then(function (res) {
                        if (res.data.result == 1) {
                            alert("서명이 완료되었습니다.");
                            if (gbn == 'wrtr'){
                                vm.viewModel.list[i].wrtr_sign_yn = 'Y';
                            } 
                            if (gbn == 'mdtr'){
                                vm.viewModel.list[i].mdtr_sign_yn = 'Y';
                                $.ajax({
                                    type: "post",
                                    url:"/api/pushSendPerson.do",
                                    data:{
                                        // 제목 및 내용
                                        title : "최초위험성평가 회의록",
                                        message :  "조정자 결재가 완료되었습니다. PC에서 확인바랍니다.",
                                        user_id : vm.viewModel.list[i].dcsn,
                                        // 클릭 시 이동 화면주소
                                        link : "/main/index.do"
                                    }
                                });
                            } 
                            if (gbn == 'dcsn'){
                                vm.viewModel.list[i].dcsn_sign_yn = 'Y';
                                let sendUser = "";
                                sendUser = vm.viewModel.list[i].mdtr + "," + vm.viewModel.list[i].wrtr;
                                if(vm.viewModel.list[i].mdtr == "" || vm.viewModel.list[i].mdtr == null) sendUser = vm.viewModel.list[i].wrtr;
                                $.ajax({
                                    type: "post",
                                    url:"/api/pushSendPerson.do",
                                    data:{
                                        // 제목 및 내용
                                        title : "최초위험성평가 회의록",
                                        message :  "결재 종결되었습니다. PC에서 확인바랍니다.",
                                        user_id : sendUser,
                                        // 클릭 시 이동 화면주소
                                        link : "/main/index.do"
                                    }
                                });
                            } 
                        } else {
                            alert("예기치 못한 오류 발생!!");
                        }
                    })
                }
            },
            fnViewPopup: function (mtg_sn, bplc_sn) {
                let vm = this;
                vm.fileViewPop= false;
                vm.viewPopup = true;
                vm.$nextTick(function () {
                    if (vm.viewPopup) {
                        vm.$refs.viewPopup.fnInit(mtg_sn, bplc_sn);
                    }
                })
            },
            fnPopup: function(sn) {
                    let vm = this;
    
                    let send = {
                        mtg_sn: sn
                        , file_se: 1
                    }
    
                    Axios.post("/selectFstRskEvltMtgFileList.do", send)
                    .then(function(response) {
                        vm.viewPopup = false;
                        vm.fileViewPop=true;
                        vm.$nextTick(function() {
                            if(vm.fileViewPop) {
                                vm.$refs.fileViewPopup.fnInit(response.data.fileList, 'bsnsAplct');
                            }
                        })
                    });				
                },
            fnDelete: function (bplc_sn, mtg_sn) {
                let vm = this;
    
                let data = {
                    bplc_sn: bplc_sn,
                    mtg_sn: mtg_sn
                }
                if (confirm("정말 삭제하시겠습니까?")) {
                    Axios.post("/deleteFstRskEvltMtg.do", data).then(function (res) {
                        if (res.data.result == 1) {
                            alert("삭제되었습니다.");
                            vm.fnSelect();
                        }
                    })
                }
    
            }
        }
    };
    </script>
    