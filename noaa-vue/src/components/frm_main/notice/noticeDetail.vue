<template>
<div>
    <div class="contents write">
        <div>
            <table class="table horizontal write">
                <caption>공지사항 상세</caption>
                <tbody>
                    <tr>
                        <th scope="row"><label for="ttl">제목</label></th>
                        <td colspan="3">
                            {{ viewModel.data.ttl }}
                        </td>
                    </tr>
                    <tr>
                        <th scope="row"><label for="reg_nm">작성자</label></th>
                        <td colspan="3">
                            {{ viewModel.data.reg_nm }}
                        </td>
                    </tr>
                    <tr>
                        <th scope="row"><label for="dt">작성일</label></th>
                        <td colspan="3">
                            {{ viewModel.data.reg_dt }}
                        </td>
                    </tr>
                    <tr>
                        <th scope="row"><label for="cn">내용</label></th>
                        <td colspan="3">
                            <div style="width:60%" v-html="contents"></div>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row"><label for="">사진</label></th>
                            <td id="img_on">
                                <imgsfileform ref="noticeimg" :pass="{id:'noticeimg', mode:'view'}"/>
                            </td>
                            <td id="img_off">
                                첨부된 사진이 없습니다.
                            </td>

                    </tr>
                <!-- <tr>
                        <th scope="row"><label for="prtc_eqpmnt_nm">보호구 명</label></th>
                        <td colspan="3">
                            {{ viewModel.data.prtc_eqpmnt_nm }}
                        </td>
                    </tr> -->
                    <tr>
                        <th scope="row"><label for="">첨부</label></th>
                        <td v-if="viewModel.filelist.length > 0">

                            <!-- <fileform @filelist="fnFilelist"  @getFileInfo="fngetFileInfo" :pass="{id:'sc'}" ref="files"></fileform> -->
                            <ul>
                                <li v-for="item in viewModel.filelist">
                                    <b><a @click="fnFileDown(item)" style="cursor: pointer;">{{ item.orgnl_file_nm }}</a></b>
                                </li>
                            </ul>
                        </td>
                        <td v-else>
                            첨부된 파일이 없습니다.
                        </td>
                    </tr>
                </tbody>
            </table>
            <div class="table_footer btn-right">
                <router-link to="/" class="btn btn-white"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-list-back"></use></svg>목록</router-link>
            </div>
        </div>
    </div>
    <dept ref="dept" v-if="deptPop==true" :pass="{group_id: viewModel.userInfo.user_group_id}"></dept>
</div>
</template>

<script>
    import "es6-promise/auto";
    import Vue from "vue";
    import Axios from "axios";
    import dept from "../popup/dept_popup.vue";
    import imgsfileform from '../../../common/vue/imgsfileform2.vue';
    
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
				}
            };
        },
        components: {
            'imgsfileform' : imgsfileform,
        },
        mounted: function() {
            let vm = this;
            vm.notice_sn = vm.$route.params.notice_sn;
            vm.viewModel.userInfo = vm.$store.state.global.userInfo;
			//vm.$nextTick(function () {
            vm.fnDetail(vm.notice_sn);
            //});
            
        },
        computed: {
            contents() {
                let vm = this;
                if(vm.viewModel.data.cn != null){
                    return vm.viewModel.data.cn.replace(/(?:\r\n|\r|\n)/g, "<br />")
                }
            }
        },
        methods: {
            fnDetail: function(notice_sn){
				let vm = this;
                vm.viewModel.filelist = [];
                vm.viewModel.imgfilelist = [];

				let send = {
					notice_sn: notice_sn,
                    mng_sn:notice_sn
				};

                Axios.post("/detailNoticeList.do",send).then(function(rs) {
                    vm.viewModel.data = rs.data.detail;
                    vm.viewModel.filelist = rs.data.fileList;
                    vm.viewModel.imgfilelist = rs.data.imgFileList;
                    vm.viewModel.data.main_notice_yn = rs.data.detail.main_notice_yn;
                    if(vm.viewModel.imgfilelist.length > 0){
                        vm.$refs.noticeimg.fnFileLoadList(vm.viewModel.imgfilelist);
                        $("#img_on").show();
                        $("#img_off").hide();
                    } else{
                        $("#img_on").hide();
                        $("#img_off").show();
                    }
				});
			},
            fnImgFileList:function(vm){
                this.viewModel.imgfilelist = vm.viewModel.filelist;
            },
            fnFileDown:function(item){
                let vm = this;
                let send = {
                    sn: item.sn,
                    file_sn: item.file_sn,
                    gbn:'notice'
                }

                $(".loading").show();
                $("#mask").show();

                Axios.post("/download.do",send,{responseType: "blob",}
                ).then(function(e) {
                    const url = window.URL.createObjectURL(new Blob([e.data], { type: e.headers["content-type"] }))
                    const link = document.createElement("a")
                    link.href = url
                    link.download = item.orgnl_file_nm
                    link.click()
                    window.URL.revokeObjectURL(url)
                }).then(function(){
                    $(".loading").hide();
                    $("#mask").hide();
                });
           },
        }
    };
</script>
