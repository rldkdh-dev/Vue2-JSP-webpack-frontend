<template>
<div>
    <div class="contents write">
        <div>
            <table class="table horizontal write">
                <tbody>
                    <!-- <tr>
                        <th scope="row"><label for="bplc">현장명</label></th>
                        <td v-if="viewModel.user.user_roles == 'ROLE_001' && viewModel.user.user_type_code == 'ACC_0000'">
                            <div class="input_group input_btn">
                                <input type="hidden" id="bplc" v-model="viewModel.data.bplc_sn">
                                <input type="text" id="bplc_nm" v-model="viewModel.data.bplc_nm" disabled>    
                                <button @click="fnBplcPopup();" v-if="viewModel.userInfo.bplc_yn !='Y'"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-search"></use></svg></button>
                            </div>
                        </td>
                        <td v-else colspan="3">
                            <input type="hidden" id="bplc" v-model="viewModel.data.bplc_sn">
                            <input type="text" id="bplc_nm" v-model="viewModel.data.bplc_nm" disabled>
                        </td>
                    </tr> -->
                    <tr>
                        <th scope="row" class="essential"><label for="ttl">제목</label></th>
                        <td><input type="text" id="ttl" v-model="viewModel.data.ttl"></td>
                        <th scope="row" class="essential"><label for="pic">작성자</label></th>
                        <td>{{ viewModel.userInfo.user_name }}</td>
                    </tr>
                    <tr>
                        <th scope="row" class="essential"><label for="cn">내용</label></th>
                        <td colspan="4"><textarea style="height: 500px;" id="cn" v-model="viewModel.data.cn"></textarea></td>
                    </tr>
                    <tr>
                        <th scope="row"><label for="main_notice_yn">대표글 여부</label></th>
                        <td colspan="4"><input type="checkbox" id="main_notice_yn" true-value="Y" false-value="N" v-model="viewModel.data.main_notice_yn"></td>
                    </tr>
                    <tr>
                        <th scope="row"><label for="">사진 첨부</label></th>
                        <td colspan="4">
                            <imgsfileform :ref="'imgsfileform'" :pass="{id:'notice'}" @filelist="fnImgFileList" @fileDelete="fnImgFileDelete"></imgsfileform>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row"><label for="">첨부</label></th>
                        <td>
                            <fileform @filelist="fnFilelist"  @fileDelete="fnFileDelete" :pass="{id:'sc'}" ref="files"></fileform>
                        </td>
                    </tr>
                </tbody>
            </table>
                <div class="table_footer btn-right">
                    <a href="" class="btn btn-purple" @click.prevent="fnSave()"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-post-add"></use></svg>등록</a>
                    <router-link to="/" class="btn btn-white"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-list-back"></use></svg>목록</router-link>
                </div>
            </div>
        </div>
        <bplc ref="bplc" v-if="bplcPop==true" :pass="{dept_sn: viewModel.userInfo.dept_sn, team_sn: viewModel.userInfo.team_sn}"></bplc>
    </div>
</template>

<script>
    import "es6-promise/auto";
    import Axios from "axios";
    import fileform from "../../../common/vue/fileform2.vue";
    import imgsfileform from '../../../common/vue/imgsfileform2.vue';
    import fromValidation from "../../../common/js/fromValidation";
    import bplc from "../popup/bplc_popup2.vue";

    export default {
        data: function() {
            return {
                list:[],
                bplcPop:false, //현장 팝업
                viewModel: {
                    scenario: {},
                    user: {},
                    userInfo:{},
                    filelist: [],
                    imgfilelist: [],
                    fileGroup: '',
                    imgfileGroup: '',
                    deletefileList: [],
                    deleteimgfileList: [],
                    data:{
                        main_notice_yn:'',
                        notice_sn:0,
                    }
                },
                isSaved:false,
            };
        },
        components: {
            'fileform' : fileform,
            'bplc': bplc,
            'imgsfileform' : imgsfileform,
        },
        mounted: function() {
            let vm = this;
            vm.notice_sn = vm.$route.params.notice_sn;
            vm.fnInit();
            vm.fnCountMainNotice();
        },
        activated:function(){
            this.fnInit();
        },
        deactivated:function(){
            this.$destroy();
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
            fnInit: function() {
                let vm = this;	
                vm.viewModel.userInfo = vm.$store.state.global.userInfo;
                vm.viewModel.data.pic = vm.viewModel.user.user_name;
                calendarInput();

                let sn = vm.$route.params.notice_sn;

                if(sn != undefined){
                    vm.fnDetail(sn);
                }

                //현장 여부 체크 'y'면 현장명 고정
                if(vm.viewModel.user.bplc_yn == 'Y'){
                    vm.viewModel.data.bplc_sn = vm.viewModel.user.bplc_sn;
                    vm.viewModel.data.bplc_nm = vm.viewModel.user.bplc_nm;
                }
            },
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
                        vm.viewModel.totalCnt = rs.data.totalCnt;
                        vm.$refs.files.fnFileLoadList(vm.viewModel.filelist);
                        vm.$refs.imgsfileform.fnFileLoadList(vm.viewModel.imgfilelist);
				});
				
			},
            fnCountMainNotice: function(){
                let vm = this; 
                let send = {notice_sn : 1} 
                Axios.post("/countMainNotice.do",send).then(function(rs){
                    vm.viewModel.data.totalCnt = rs.data.totalCnt;
                })
            },
            fnBplcAdd: function(item){
                let vm = this;

                vm.viewModel.data.bplc_sn = item.bplc_sn;
                vm.viewModel.data.bplc_nm = item.bplc_nm;
            },
            fnFileDelete: function(vm){
                this.viewModel.deletefileList = vm.deletefileList;
            },
            fnSave: function(){
                let vm = this;
                let frm = new FormData();
                for(let i=0; i<vm.viewModel.filelist.length; i++) {
                    let key = vm.viewModel.filelist[i].file_seq;
                    if(vm.viewModel.filelist[i].file != null) {
                        frm.append("fileTitle", vm.viewModel.filelist[i].file_title);
                        frm.append("uploadFiles", vm.viewModel.filelist[i].file);
                        frm.append("key", 0)
                    } else {
                        if(vm.viewModel.filelist[i].file == undefined){
                            
                        }else{
                            frm.append("fileTitle", vm.viewModel.filelist[i].file_title);
                            frm.append("key", key)
                        }
                    }
                    
                }
                if(vm.viewModel.imgfilelist != null && vm.viewModel.imgfilelist != undefined && vm.viewModel.imgfilelist != "") {
                    for(let i=0; i<vm.viewModel.imgfilelist.length; i++) {
                        if(vm.viewModel.imgfilelist[i].file != null) {
                            frm.append("fileTitle", vm.viewModel.imgfilelist[i].file_title);
                            frm.append("uploadFiles", vm.viewModel.imgfilelist[i].file);
                            frm.append("key", 0)
                        } else {
                            if(vm.viewModel.imgfilelist[i].file == undefined){
                                
                            }else{
                                frm.append("fileTitle", vm.viewModel.imgfilelist[i].file_title);
                                frm.append("key", key)
                            }
                        }
                    }
                }
                                
                    for(let i=0; i<vm.viewModel.deletefileList.length; i++){
                        frm.append("deleteFiles", vm.viewModel.deletefileList[i]);
                    }
                    for(let i=0; i<vm.viewModel.deleteimgfileList.length; i++){
                        frm.append("deleteFiles", vm.viewModel.deleteimgfileList[i]);
                    }

                    vm.fngetFileInfo(frm);
                },

            fngetFileInfo:function(frm){
                let vm = this;
                // const valiData = [
                //     // {id: 'bplc', type: 'select', title: '현장명'},
                //     {id: 'dt', type: 'input', title: '날짜'},
                //     // {id: 'prtc_eqpmnt_nm', type: 'input', title: '보호구명'},
                //     {id: 'pic', type: 'input', title: '담당자'},
                // ];
                // if(!fromValidation(valiData)){
                //         return false;
                // }
                let data = {
                    sn:vm.viewModel.data.notice_sn, 
                    notice_sn:vm.viewModel.data.notice_sn,
                    ttl:vm.viewModel.data.ttl,
                    cn: vm.viewModel.data.cn,
                    file_sn: vm.viewModel.data.file_sn,
                    reg_id: vm.$store.state.global.userInfo.user_id,
                    mod_id: vm.$store.state.global.userInfo.user_id,
                    user_id: vm.$store.state.global.userInfo.user_id,
                    notice_sn:vm.$route.params.notice_sn,
                    main_notice_yn: vm.viewModel.data.main_notice_yn,
                    deletefileList : vm.viewModel.deletefileList,
                }


                frm.append('data', new Blob([ JSON.stringify(data) ], {type : "application/json"}));
                    
                frm.append("filePath", "notice");

                if(vm.viewModel.data.totalCnt > 2 && vm.viewModel.data.main_notice_yn == 'Y') {
                    alert('더 이상 대표글을 추가할 수 없습니다.')
                } else{
                    if(vm.notice_sn != undefined && vm.notice_sn != null && vm.notice_sn != ''){
                        if(confirm('수정하시겠습니까?')){
                            Axios.post("/updateNotice.do",frm).then(function(rs){
                                vm.isSaved = true;
                                vm.$router.push('/');
                                alert('수정되었습니다.');
                            })
                        
                        } else{alert('취소되었습니다.');
                    }
                    } else {
                        if(confirm('등록하시겠습니까?')){
                            Axios.post("/insertNotice.do",frm).then(function(rs){
                                vm.isSaved = true;
                                vm.$router.push('/');
                                alert('등록되었습니다.');
                                vm.callPushAlarm();
                            })
                        } 
                        else{
                            alert('취소되었습니다.');
                        }
                    }
                }        
            },
            fnFilelist:function(vm){
                this.viewModel.filelist = vm.filelist;
                this.viewModel.fileGroup = vm.fileGroup;
            },
            fnImgFileList:function(vm){
                this.viewModel.imgfilelist = vm.viewModel.filelist;
            },
            fnImgFileDelete: function(vm){
                this.viewModel.deleteimgfileList = vm.viewModel.deletefileList;
            },
            callPushAlarm: function() {
                let vm = this;

                Axios.post("/selectNoticeMaxSn.do",{}).then(function(rs){
                    
                    let link = '/m/notice/noticeList.do#/detail/'+rs.data.NOTICE_SN;

                    //console.log(' link  ::  ' , link);

                    $.ajax({
                        type: "post",
                        url:"/api/pushSendAll.do",
                        data:{
                            // 제목 및 내용
                            title : "공지사항 새로운 게시글",
                            message : rs.data.TTL,
                            // 클릭 시 이동 화면주소
                            link : link
                        }
                    });
                   
                });

            }
        }
    };
</script>
