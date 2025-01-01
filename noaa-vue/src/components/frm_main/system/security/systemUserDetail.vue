<template>
<div>
    <div class="contents write">
        <div>
            <table class="table horizontal write">
                <caption>사용자 정보 상세</caption>
                <tbody>
                    <tr>
                        <th scope="row"><label for="ttl">이름</label></th>
                        <td colspan="3">
                            {{ viewModel.data.USER_NM }}
                        </td>
                    </tr>
                    <tr>
                        <th scope="row"><label for="reg_nm">ID</label></th>
                        <td colspan="3">
                            {{ viewModel.data.LOGIN_ID }}
                        </td>
                    </tr>
                    <tr>
                        <th scope="row"><label for="dt">사용자 권한</label></th>
                        <td>
                            {{ viewModel.data.reg_dt }}
                        </td>
                    </tr>
                    <tr>
                        <th scope="row"><label for="cn">직책</label></th>
                        <td colspan="2">
                            <div style="width:60%">
                                <select id="detail_DUTY_CD" v-model="viewModel.data.DUTY_CD">
                                    <option value="50">팀장</option>
                                    <option value="60">과장</option>
                                    <option value="70">대리</option>
                                    <option value="80">사원</option>
                                </select>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row"><label for="cn">부서</label></th>
                        <td colspan="3">
                            <!-- <a href="javascript:fnOpenDepartmentPopup();" title="search" class="ub-control button imgBtn img-search" id="searchDept" name="searchDept"><span>@@</span></a> -->
                            <div style="width:60%">{{ viewModel.data.DEPT_NM }}<button @click="fnOpenDepartmentPopup()">검색</button></div>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row"><label for="cn">핸드폰 번호</label></th>
                        <td colspan="3">
                            <div style="width:60%">{{ viewModel.data.MOBILE_NO }}</div>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row"><label for="cn">이메일</label></th>
                        <td colspan="3">
                            <div style="width:60%">{{ viewModel.data.EMAIL_DS }}</div>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row"><label for="cn">재직구분</label></th>
                        <td colspan="3">
                            <div style="width:60%">{{ viewModel.data.INCUMBENT_CD=='E'? '재직' : viewModel.data.INCUMBENT_CD=='D'? '퇴직':'휴직' }}</div>
                        </td>
                    </tr>
                    <!-- <tr>
                        <th scope="row"><label for="">사진</label></th>
                            /*<td id="img_on">
                                <imgsfileform ref="noticeimg" :pass="{id:'noticeimg', mode:'view'}"/>
                            </td> */
                            <td id="img_off">
                                첨부된 사진이 없습니다.
                            </td>

                    </tr> -->
                <!-- <tr>
                        <th scope="row"><label for="prtc_eqpmnt_nm">보호구 명</label></th>
                        <td colspan="3">
                            {{ viewModel.data.prtc_eqpmnt_nm }}
                        </td>
                    </tr> -->
                    <!-- <tr>
                        <th scope="row"><label for="">첨부</label></th>
                        <td v-if="viewModel.filelist.length > 0">

                            //<fileform @filelist="fnFilelist"  @getFileInfo="fngetFileInfo" :pass="{id:'sc'}" ref="files"></fileform>
                            <ul>
                                <li v-for="item in viewModel.filelist">
                                    <b><a @click="fnFileDown(item)" style="cursor: pointer;">{{ item.orgnl_file_nm }}</a></b>
                                </li>
                            </ul>
                        </td>
                        <td v-else>
                            첨부된 파일이 없습니다.
                        </td>
                    </tr> -->
                </tbody>
            </table>
            <div class="table_footer btn-right">
                <router-link to="/" class="btn btn-white"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-list-back"></use></svg>목록</router-link>
            </div>
        </div>
    </div>
    <!-- <dept ref="dept" v-if="deptPop==true" :pass="{group_id: viewModel.userInfo.user_group_id}"></dept> -->
    <!-- <departmentpopup ref="Departmentpopup" v-if="isDepartPopup==true" :pass="{title:'부서관리',LOGIN_ID:$route.params.LOGIN_ID}"></departmentpopup> -->
</div>
</template>

<script>
    import "es6-promise/auto";
    import Vue from "vue";
    import Axios from "axios";
    import departmentPopup from "../../popup/department_popup.vue"; 
    // import dept from "../popup/dept_popup.vue";
    // import imgsfileform from '../../../common/vue/imgsfileform2.vue';

    Vue.component('departmentpopup',departmentPopup);
    
    export default {
        data: function() {
            return {
                viewModel: {
                    img:'',
					scenario: {},
					user: {},
					filelist: [],
                    imgfilelist: [],
					fileGroup: '',
                    deletefileList: [],
                    data:{},
				},
                isDepartPopup : false
            };
        },
        components: {
            // 'imgsfileform' : imgsfileform,
            departmentPopup
        },
        mounted: function() {
            let vm = this;
            vm.login_id = vm.$route.params.LOGIN_ID;
            vm.viewModel.userInfo = vm.$store.state.global.userInfo;
            vm.fnDetail(vm.login_id);
            // vm.notice_sn = vm.$route.params.notice_sn;
            // vm.viewModel.userInfo = vm.$store.state.global.userInfo;
			// //vm.$nextTick(function () {
            // vm.fnDetail(vm.notice_sn);
            //});
            
        },
        computed: {
            // contents() {
            //     let vm = this;
            //     if(vm.viewModel.data.cn != null){
            //         return vm.viewModel.data.cn.replace(/(?:\r\n|\r|\n)/g, "<br />")
            //     }
            // }
        },
        methods: {
            fnDetail: function (login_id) {
                let vm = this;
                let send = {
                    mapperId:'securityUser.selectSecurityUserList',
                    pageYn:'N',
                    login_id: login_id
                }

                Axios.post("/detailUser.do", send).then(function (res) {
                    vm.viewModel.data = res.data.detail[0];
                });
            },
            fnOpenDepartmentPopup: function () {
                let vm = this;
                vm.isDepartPopup = true;
                vm.$nextTick(function () {
                    vm.$refs.Departmentpopup.fnInit();
                })
            }
        //     fnDetail: function(notice_sn){
		// 		let vm = this;
        //         vm.viewModel.filelist = [];
        //         vm.viewModel.imgfilelist = [];

		// 		let send = {
		// 			notice_sn: notice_sn,
        //             mng_sn:notice_sn
		// 		};

        //         Axios.post("/detailNoticeList.do",send).then(function(rs) {
        //             vm.viewModel.data = rs.data.detail;
        //             vm.viewModel.filelist = rs.data.fileList;
        //             vm.viewModel.imgfilelist = rs.data.imgFileList;
        //             vm.viewModel.data.main_notice_yn = rs.data.detail.main_notice_yn;
        //             if(vm.viewModel.imgfilelist.length > 0){
        //                 vm.$refs.noticeimg.fnFileLoadList(vm.viewModel.imgfilelist);
        //                 $("#img_on").show();
        //                 $("#img_off").hide();
        //             } else{
        //                 $("#img_on").hide();
        //                 $("#img_off").show();
        //             }
		// 		});
		// 	},
        //     fnImgFileList:function(vm){
        //         this.viewModel.imgfilelist = vm.viewModel.filelist;
        //     },
        //     fnFileDown:function(item){
        //         let vm = this;
        //         let send = {
        //             sn: item.sn,
        //             file_sn: item.file_sn,
        //             gbn:'notice'
        //         }

        //         $(".loading").show();
        //         $("#mask").show();

        //         Axios.post("/download.do",send,{responseType: "blob",}
        //         ).then(function(e) {
        //             const url = window.URL.createObjectURL(new Blob([e.data], { type: e.headers["content-type"] }))
        //             const link = document.createElement("a")
        //             link.href = url
        //             link.download = item.orgnl_file_nm
        //             link.click()
        //             window.URL.revokeObjectURL(url)
        //         }).then(function(){
        //             $(".loading").hide();
        //             $("#mask").hide();
        //         });
        //    },
        }
    };
</script>
