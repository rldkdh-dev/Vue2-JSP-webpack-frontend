<template>
    <div>
        <modal :pass="{popupTitle: '면담일지'}">
            <template v-slot:contents>
                <div class="btn-group btn-right">
                    <button class="btn btn-white" @click="fnExcelDownload"><i class="icon_excel"></i>엑셀다운로드</button>
                    <button class="btn btn-purple" @click="fnPrint();"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-print"></use></svg>인쇄</button>
                </div>
                <div id="printDiv">
                    <div>
                        <table class="table horizontal">
                            <caption>사용자 정보</caption>
                            <tbody>
                                <tr>
                                    <th scope="row" class="w100">현장명</th>
                                    <td colspan="7">
                                        {{ viewModel.targetUser.bplc_nm }}
                                    </td>
                                </tr>
                                <tr>
                                    <th scope="row">성명</th>
                                    <td>{{viewModel.targetUser.user_nm}}</td>
                                    <!-- <th scope="row">주민번호</th>
                                    <td></td> -->
                                    <th scope="row">직종</th>
                                    <td colspan="3">{{viewModel.targetUser.ocpt_detail_nm}}</td>
                                    <th scope="row">입사일</th>
                                    <td>{{viewModel.targetUser.jncmp_day}}</td>
                                </tr>
                                <tr>
                                    <th scope="row">주소</th>
                                    <td colspan="5">{{viewModel.targetUser.user_addr}}</td>
                                    <th scope="row">전화번호</th>
                                    <td>{{viewModel.targetUser.user_cttpc}}</td>
                                </tr>
                                <tr>
                                    <th scope="row">신장</th>
                                    <td>{{viewModel.targetUser.height}}</td>
                                    <th scope="row">체중</th>
                                    <td>{{viewModel.targetUser.weight}}</td>
                                    <th scope="row">혈액형</th>
                                    <td>{{viewModel.targetUser.bdp}}</td>
                                    <th scope="row">혈압</th>
                                    <td>{{viewModel.targetUser.systolic_brssr}} / {{viewModel.targetUser.diastolic_brssr}}</td>
                                </tr>
                                <tr>
                                    <th scope="row">담배</th>
                                    <td>
                                        {{viewModel.targetUser.smkng_yn=='Y' ? '하루 '+viewModel.targetUser.smkng_qy+'갑' : 'X'}}
                                    </td>
                                    <th scope="row">음주</th>
                                    <td>
                                        {{viewModel.targetUser.drnkg_yn=='Y' ? '주 '+viewModel.targetUser.drnkg_nmtm+'회' : 'X'}}
                                        <p v-if="viewModel.targetUser.drnkg_yn=='Y'">{{viewModel.targetUser.drnkg_qy}}병</p>
                                    </td>
                                    <th scope="row">혈압약</th>
                                    <td>{{viewModel.targetUser.brssr_medicn_yn}}</td>
                                    <th scope="row">질병</th>
                                    <td>
                                        <p>당뇨: {{viewModel.targetUser.glycsr_yn}}</p>
                                        <p>심혈관 질환: {{viewModel.targetUser.crdvsc_yn}}</p>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div>
                        <table class="table">
                            <caption>면담일지 목록</caption>
                            <thead>
                                <tr>
                                    <th scope="col">번호</th>
                                    <th scope="col">일자</th>
                                    <th scope="col">면담자</th>
                                    <th scope="col">면담내용</th>
                                    <th scope="col">조치내용(결과)</th>
                                    <th scope="col" class="none">면담일지</th>
                                    <!-- <th scope="col">채용사유서</th> -->
                                    <th scope="col" class="none">관리</th>
                                </tr>
                            </thead>
                            <tbody>
                                <template v-if="viewModel.list.length>0">
                                    <tr v-for="(item, i) in viewModel.list" :key="i">
                                        <td>{{(viewModel.pager.pageNo==1) ? viewModel.pager.totalSize-i : viewModel.pager.totalSize-((viewModel.pager.rowSize*(viewModel.pager.pageNo-1))+i)}}</td>
                                        <td>{{item.itrvw_day | yyyyMMdd}}</td>
                                        <td>{{item.itrvw_pic_nm}}</td>
                                        <td class="pre">{{item.irtvw_cn}}</td>
                                        <td class="pre">{{item.actn_cn}}</td>
                                        <td class="none">
                                            <button v-if="item.file_cnt > 0" class="btn btn-icon" @click="fnPopup(item.bplc_sn, item.user_id, item.sn);"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-attachment"></use></svg></button>
                                        </td>
                                        <!-- <td>
                                            <button v-if="item.file_cnt2 == 0" class="btn btn-small btn-blue" @click="fnPopup2(item.sn);">등록</button>
                                            <button v-else class="btn btn-small btn-gray" @click="fnPopup2(item.sn);">완료</button>
                                        </td> -->
                                        <td class="none">
                                            <template v-if="viewModel.userInfo.user_id == item.itrvw_pic">
                                                <button class="btn btn-icon" @click="fnUpdate(item.sn)"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-edit-contents"></use></svg></button>
                                                <button class="btn btn-icon" @click="fnDelete(item.sn)"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-delete-sweep"></use></svg></button>
                                            </template>
                                        </td>
                                    </tr>
                                </template>
                                <template v-else>
                                    <tr>
                                        <td colspan="8">데이터가 없습니다.</td>
                                    </tr>
                                </template>
                            </tbody>
                        </table>
                        <div class="table_footer">
                            <Pager :pass="viewModel.pager"></Pager>
                        </div>
                    </div>
                </div>
                <div>
                    <table class="table horizontal write">
                        <caption>면담일지 등록</caption>
                        <tbody>
                            <tr>
                                <th scope="row" class="w125 essential"><label>면담자</label></th>
                                <td>{{viewModel.userInfo.user_name}}</td>
                            </tr>
                            <tr>
                                <th scope="row" class="essential"><label>면담일자</label></th>
                                <td>
                                    <div class="datepicker_box">
                                        <input type="text" class="datepicker" title="조회시작일" id="dt" readonly>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <th scope="row" class="essential"><label for="irtvw_cn">면담내용</label></th>
                                <td><textarea rows="5" id="irtvw_cn" v-model="viewModel.itrvw.irtvw_cn"></textarea></td>
                            </tr>
                            <tr>
                                <th scope="row" class="essential"><label for="actn_cn">조치내용(결과)</label></th>
                                <td><textarea rows="3" id="actn_cn" v-model="viewModel.itrvw.actn_cn"></textarea></td>
                            </tr>
                            <tr>
                                <th scope="row">면담일지</th>
                                <td>
                                    <fileform @filelist="fnFilelist"  @fileDelete="fnFileDelete" :pass="{id:'sc'}" ref="files"></fileform>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div class="table_footer btn-right">
                        <button class="btn btn-white" @click="fnRefresh()">초기화</button>
                        <button class="btn btn-purple" @click="fnFileInfo()">등록</button>
                    </div>
                </div>
            </template>
        </modal>
        <imgFileView ref="imgFileView" v-if="imgFileView==true"></imgFileView>
        <fileViewPopup ref="fileViewPopup" v-if="fileViewPop==true"></fileViewPopup>
        <!-- <itrvwFilePopup ref="itrvwFilePopup" v-if="itrvwFilePop==true"></itrvwFilePopup> -->
        <excelform ref="excelform"></excelform>
    </div>
</template>

<script>
    import "es6-promise/auto";
    import Vue from "vue";
    import Axios from "axios";
    import Common from "../../../common/js/common.js";
    import Pager from "../../../common/vue/paging.vue";
    import Modal from './modal.vue';
    import printJS from 'print-js'
    import imgFileView from './imgFileViewPopup.vue';
    import fileform from "../../../common/vue/fileform2.vue";
    import Message, {messageUtil} from "../../../common/js/message";
    import fromValidation from "../../../common/js/fromValidation";
    import fileViewPopup from "./fileViewPopup.vue";
    import excelform from "../excelform.vue";
    // import itrvwFilePopup from "./itrvwFilePopup.vue";

    export default {
        props: ['pass'],
        components: {
            Pager, Modal, imgFileView
            , 'fileform': fileform
            , 'fileViewPopup': fileViewPopup
            , 'excelform': excelform
            // , 'itrvwFilePopup': itrvwFilePopup
        },
        data: function() {
            return {
                imgFileView: false,
                fileViewPop: false,
                // itrvwFilePop: false,
                viewModel:{
                    sn: null,
                    list: [],
                    userInfo:{},
                    targetUser:{
                        bplc_sn: null,
                        bplc_nm_arr: []
                    },
                    itrvw: {},
                    imgfilelist:[],
                    pager: {
                        model: {},
                        pageNo: 1,
                        totalSize: 0,
                        rowSize: 5,
                        blockSize: 5,
                        list: [],
                        callBack: function (n) {
                            try{
                                this.model.fnList(n);
                            } catch(e){
                                console.log('callback error  ' + e);
                            }
                        }
                    },
                    filelist:[],
                    deletefileList:[],
                },
                gbn:'',
                user_id:'',
                sn:'',
            };
        },
        mounted: function() {
            let vm = this;
            vm.viewModel.userInfo = vm.$store.state.global.userInfo;
        },
        methods: {
            fnRefresh: function(){
                let vm = this;
                
                vm.gbn = '';
                //초기화
                $('.datepicker').val('');
                vm.viewModel.itrvw = {};

                vm.viewModel.filelist = [];
                vm.$refs.files.fnFileLoadList(vm.viewModel.filelist);
            },
            fnInit:function(id, sn){
                let vm = this;
                
                vm.fileViewPop=false;
                vm.itrvwFilePop=false;

                calendarInput();
                Modal.methods.fnInit();

                vm.user_id = id;
                vm.sn = sn;
        
                vm.fnList(0);
            },
            fnList:function(paramPageNo){
				let vm = this;
                
                vm.fnRefresh();

                vm.viewModel.pager.pageNo = paramPageNo == 0 ? 1 : paramPageNo;

                let send = {
                    pageNo_sub: vm.viewModel.pager.pageNo,
                    pageSize_sub: vm.viewModel.pager.rowSize,
                    user_id: vm.user_id,
                    sn: vm.viewModel.sn,
                    bplc_sn: vm.sn,
                    state: '',
                }
                Axios.post("/selectMngmtCdvscList.do", send).then(function(response) {
                    vm.viewModel.targetUser = response.data.list[0];
                    vm.viewModel.list = response.data.itrvwlist;
                    vm.viewModel.pager.totalSize = response.data.totalCNT;
                    
                    //페이징세팅
                    Pager.props = Pager.methods.createPaging(vm.viewModel.pager, vm, "list");
                });
            },
            fnFileInfo: function(){
                let vm = this;
                let frm = new FormData();
                for(let i=0; i<vm.viewModel.filelist.length; i++) {
                    let key = vm.viewModel.filelist[i].file_seq;
                    if(vm.viewModel.filelist[i].file != null) {
                        frm.append("fileTitle", vm.viewModel.filelist[i].file_title);
                        frm.append("uploadFiles", vm.viewModel.filelist[i].file);
                        frm.append("file_se", 1);
                        if(vm.viewModel.filelist[i].file_sn){
                            frm.append("deleteFiles", vm.viewModel.filelist[i].file_sn);
                        }
                        frm.append("key", 0)
                    } else {
                        if(vm.viewModel.filelist[i].file == undefined){
                            
                        }else{
                            frm.append("fileTitle", vm.viewModel.filelist[i].file_title);
                            frm.append("key", key)
                        }
                    }
                }
                for(let i=0; i<vm.viewModel.deletefileList.length; i++){
                    frm.append("deleteFiles", vm.viewModel.deletefileList[i]);
                }

                vm.fnSave(frm);
            },
            fnSave:function(frm){
                let vm = this;

                const valiData = [
					{id: 'dt', type: 'input', title: '면담일자'},
					{id: 'irtvw_cn', type: 'input', title: '면담내용'},
					{id: 'actn_cn', type: 'input', title: '조치내용(결과)'},
				];

                if(!fromValidation(valiData)){
                    return false;
                }

                let data = {
                    user_id: vm.viewModel.targetUser.user_id,
                    bplc_sn: vm.viewModel.targetUser.bplc_sn,
                    itrvw_pic: vm.viewModel.userInfo.user_id,
                    itrvw_day: $('.datepicker').val(),
                    irtvw_cn: vm.viewModel.itrvw.irtvw_cn,
                    actn_cn: vm.viewModel.itrvw.actn_cn,
                    sn: vm.viewModel.itrvw.sn,
                };
                
                frm.append('data', new Blob([ JSON.stringify(data) ], {type : "application/json"}));
                
                frm.append("filePath", "hthMngmt");

                if(vm.gbn != 'update'){
                    if(confirm(Message.CREATE_CONFIRM)){
                        Axios.post("/insertItrvw.do", frm).then(function(response) {
                            if(response.data = 1){
                                alert("저장되었습니다.");
                                vm.fnList(0);
                            }else{
                                alert(Message.ERROR);
                            }
                        }).catch(function(ex) {
                            alert(Message.ERROR);
                        });
                    }
                } else{
                    if(confirm(Message.UPDATE_CONFIRM)){
                        Axios.post("/updateItrvw.do", frm).then(function(response) {
                            if(response.data = 1){
                                alert("저장되었습니다.");
                                vm.fnList(0);
                            }else{
                                alert(Message.ERROR);
                            }
                        }).catch(function(ex) {
                            alert(Message.ERROR);
                        });
                    }
                }

            },
            fnChangeBplcSN: function(event) {
                let sn = parseInt(event.target.value);
                this.viewModel.targetUser.bplc_sn = sn;
                this.viewModel.itrvw = {};
                $('.datepicker').val('');
                this.fnList(this.viewModel.targetUser.user_id, sn, 0);
            },
            fnFilelist:function(vm){
                this.viewModel.filelist = vm.filelist;
            },
            fnFileDelete: function(vm){
                this.viewModel.deletefileList = vm.deletefileList;
            },
            fnPopup: function(bplc_sn, user_id, sn) {
				let vm = this;

                let send = {
                    sn: sn
                }

                Axios.post("/selectIntrvwFileList.do", send)
                .then(function(response) {
                    vm.imgFileView=false;
                    vm.itrvwFilePop=false;
                    vm.fileViewPop=true;
                    vm.$nextTick(function() {
                        if(vm.fileViewPop) {
                            vm.$refs.fileViewPopup.fnInit(response.data.fileList, 'hthMngmt');
                        }
                    })
                });				
			},
            // fnPopup2: function(sn){
            //     let vm = this;

            //     vm.itrvwFilePop=true;
            //     vm.fileViewPop=false;
            //     vm.$nextTick(function() {
            //         if(vm.itrvwFilePop) {
            //             vm.$refs.itrvwFilePopup.fnInit(sn);
            //         }
            //     });
            // },
            fnUpdate: function(sn){
                let vm = this;
                let send = {
                    sn: sn
                }
                
                Axios.post("/selectIntrvwDetail.do", send)
                .then(function(response) {
                    vm.viewModel.itrvw = response.data.detail;
                    vm.viewModel.filelist = response.data.fileList.filter(data => data.se == 1);

                    $("#dt").val(vm.viewModel.itrvw.itrvw_day);
                }).then(function(){
                    
                    vm.$refs.files.fnFileLoadList(vm.viewModel.filelist);
                    
                    vm.gbn = 'update';
                });
            },
            fnDelete: function(sn){
                let vm = this;
                let send = {
                    sn: sn
                }

                if(confirm(Message.DELETE_CONFIRM)){
                    Axios.post("/deletetIntrvw.do", send)
                    .then(function(response) {
                        if(response.data == 1){
                            alert("삭제가 완료되었습니다.");
                            vm.fnList(0);
                        }
                    }).catch(function(ex) {
                        alert(Message.ERROR);
                    });
                }
            },
            fnPrint : function(){
                printJS({
                    printable:'printDiv',
                    type:'html',
                    css: ['/css/basic.css','/css/print.css'],
                    scanStyles : false,
                });
            },
            fnExcelDownload: function(){
                let vm = this;
                // 자바 버전
                const header = ['번호','일자','면담자','면담내용','조치내용(결과)'];
                const header2 = ["성명", "현장명", "전화번호", "주소", "직종", "입사일", "혈액형", "신장/체중", "담배", "음주","혈압(마지막등록일)", "혈압약", "질병"];
                const mapperId = 'selectItrvwList';
                
                //검색조건
                let data = {
                    header: header,
                    header2: header2,
                    mapperId: mapperId,
                    user_id: vm.user_id,
                    // sn: vm.viewModel.sn,
                    bplc_sn: vm.sn,
                    // 파일명 
                    fileName: "면담일지(" + vm.viewModel.targetUser.user_nm + ")", // 스마트안전보건_년월일.xlsx
                    // 해당 화면 필요한 조건 파라미터 추가 부분
                };
                if (confirm("엑셀 출력 하시겠습니까?")) {
                    this.$nextTick(function () {
                        vm.$refs.excelform.fnInit(data);
                    })
                }
            }
        }
    };
</script>