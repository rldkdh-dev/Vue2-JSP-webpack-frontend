<template>
<div>
    <div class="search_area">
        <button class="btn_toggle_search">검색</button>
        <div>
            <div class="search_container">
                <div class="row">
                    <input type="text" placeholder="회의명을 입력하세요." title="회의명 입력" v-model="viewModel.search.mtg_nm">
                </div>
            </div>
            <div class="btn-group">
                <button class="btn btn-default-line" @click="fnRefresh()"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-refresh"></use></svg>초기화</button>
                <button class="btn btn-default" @click="fnList(1)"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-search"></use></svg>검색</button>
            </div>
        </div>
    </div>
    <div class="contents">
        <div>
            <ul class="tab">
                <li class="active" @click="fnTab('mtg')"><button>주간안전회의</button></li>
                <li @click="fnTab('follow')"><button>안건 진행상황 (follow-up)</button></li>
            </ul>
            <div class="tab_content">
                <div class="on">
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
                        <caption>주간안전회의</caption>
                        <thead>
                            <tr>
                                <th scope="col" class="w50">번호</th>
                                <th scope="col">회의명</th>
                                <th scope="col">회의 일자</th>
                                <th scope="col">회의 장소</th>
                                <th scope="col">참석자 서명 여부</th>
                                <th scope="col">첨부</th>
                                <th scope="col">관리</th>
                            </tr>
                        </thead>
                        <tbody v-if="gbn=='mtg'">
                            <tr v-for="(item, i) in viewModel.list" :key="i">
                                <td>{{(viewModel.pager.pageNo==1) ? viewModel.pager.totalSize-i : viewModel.pager.totalSize-((viewModel.pager.rowSize*(viewModel.pager.pageNo-1))+i)}}</td>
                                <td class="text-left">
                                    <router-link :to="'/detail/'+item.mtg_sn" class="btn-link">{{ item.mtg_nm }}</router-link>
                                </td>
                                <td>{{ item.mtg_dt|yyyyMMdd }}</td>
                                <td class="text-left">{{ item.mtg_plc }}</td>
                                <td>
                                    <span v-if="item.atdrn_yn == 'N'"></span>
                                    <span v-else-if="item.atdrn_yn == 'Y' && item.atdrn_sign_yn == 'N'" class="btn btn-small btn-sign"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-signature"></use></svg>서명 전</span>
                                    <span v-else-if="item.atdrn_yn == 'Y' && item.atdrn_sign_yn == 'Y'" class="btn btn-small btn-sign complete"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-signature-check"></use></svg>서명 완료</span>
                                </td>
                                <td>
                                    <button v-if="item.file_cnt > 0" class="btn btn-icon" @click="fnPopup(item.mtg_sn);"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-attachment"></use></svg></button>
                                </td>
                                <td>
                                    <router-link :to="'/detail/'+item.mtg_sn" class="btn btn-icon"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-content-search"></use></svg></router-link>
                                    <template v-if="item.reg_id == viewModel.userInfo.user_id">

                                        <button class="btn btn-icon" @click="fnUpdate(item.mtg_sn, item.sign_y_cnt, item.write_y_cnt);"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-edit-contents"></use></svg></button>

                                        <!-- <router-link :to="'/write/'+item.mtg_sn" class="btn btn-icon"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-edit-contents"></use></svg></router-link> -->
                                        <button class="btn btn-icon" @click="fnDelete(item.mtg_sn)"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-delete-sweep"></use></svg></button>
                                    </template>
                                </td>
                            </tr>
                            <tr v-if="viewModel.list.length ==0"><td colspan="7">게시물이 없습니다.</td></tr>
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
                            </div>				
                            <a href="" class="btn btn-white"><i class="icon_excel"></i>엑셀업로드</a> -->
                            <router-link :to="'/write'" class="btn btn-purple"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-post-add"></use></svg>등록</router-link>
                            <!-- <a href="" class="btn btn-gray"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-trash-can"></use></svg>삭제</a> -->
                        </div>
                    </div>
                </div>
                <div>
                    <div class="table_top">
                        <div class="total_count">총 <em>{{ viewModel.pager.totalSize }}</em>건</div>
                        <select v-model="viewModel.pager.rowSize" @change="fnChangeCNTSelect(viewModel.pager.rowSize);">
                            <option value="10">10개씩 보기</option>
                            <option value="30">30개씩 보기</option>
                            <option value="50">50개씩 보기</option>
                            <option value="100">100개씩 보기</option>
                        </select>
                    </div>
                    <table class="table write">
                        <caption>안건 진행상황(follow-up) 목록</caption>
                        <thead>
                            <tr>
                                <th scope="col" rowspan="2" class="w50">번호</th>
                                <th scope="col" rowspan="2">완료여부</th>
                                <th scope="col" rowspan="2">협의사항</th>
                                <th scope="col" rowspan="2">세부사항</th>
                                <th scope="col" rowspan="2">회신 및 조치기한</th>
                                <th scope="col" rowspan="2">담당부서</th>
                                <th scope="colgroup" :colspan="viewModel.deptSize">조치결과 (진행현황 및 예정사항 포함)</th>
                                <th scope="col" rowspan="2">관리</th>
                            </tr>
                            <tr>
                                <th scope="col" v-for="dept in viewModel.deptList" :key="dept.dept_sn">
                                    {{ dept.dept_nm }}
                                </th>
                            </tr>
                        </thead>
                        <tbody v-if="gbn!='mtg'">
                            <tr v-for="(item, i) in viewModel.list" :key="i">
                                <td>{{(viewModel.pager.pageNo==1) ? viewModel.pager.totalSize-i : viewModel.pager.totalSize-((viewModel.pager.rowSize*(viewModel.pager.pageNo-1))+i)}}</td>
                                <td>
                                    {{ item.cnt == item.y_cnt ? '완료' : '미완료' }}
                                </td>
                                <td class="text-left">{{ item.cnsltn_mttr }}</td>
                                <td class="text-left">
                                    {{ item.detail_mttr }}
                                </td>
                                <td class="text-left">{{ item.rply_nd_actn_term }}</td>
                                <td class="text-left">{{ item.dept_nm }}</td>
                                <td scope="col" v-for="dept in viewModel.deptList" :key="dept.dept_sn">
                                    <template v-if="item.dept_list.length > 0">
                                        <button v-if="item.dept_list.filter(data => data == dept.dept_sn).length > 0 && viewModel.userInfo.dept_sn == dept.dept_sn" @click="fnMttrPopup(item.mtg_sn, item.cnsltn_mttr_sn, dept.dept_sn)" 
                                            :class="item.actn_rslt_list[item.dept_list.findIndex(data => data == dept.dept_sn)] == 'Y' ? 'btn btn-small btn-gray' : 'btn btn-small btn-blue'">
                                            {{ item.actn_rslt_list[item.dept_list.findIndex(data => data == dept.dept_sn)] == 'Y' ? '완료' : '미완료' }}
                                        </button>
                                       <span v-else-if="item.dept_list.filter(data => data == dept.dept_sn).length > 0">{{ item.actn_rslt_list[item.dept_list.findIndex(data => data == dept.dept_sn)] == 'Y' ? '완료' : '미완료' }}</span>
                                       <span v-else>-</span>
                                    </template>
                                    <span v-else>-</span>
                                </td>
                                <td>
                                    <button class="btn btn-icon" @click="fnMttrAllPopup(item.mtg_sn, item.cnsltn_mttr_sn)"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-content-search"></use></svg></button>
                                </td>
                            </tr>
                            <tr v-if="viewModel.list.length ==0"><td :colspan="'7'+viewModel.deptSize">게시물이 없습니다.</td></tr>
                        </tbody>
                    </table>
                    <div class="table_footer">
                        <pager :pass="viewModel.pager"></pager>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <fileViewPopup ref="fileViewPopup" v-if="fileViewPop==true"></fileViewPopup>
    <mttr ref="mttr" v-if="mttrPop==true" :pass="{title:'조치 진행상황'}"></mttr>
    <mttrAll ref="mttrAll" v-if="mttrAllPop==true" :pass="{title:'조치 진행상황 상세보기'}"></mttrAll>
</div>
</template>

<script>
    import "es6-promise/auto";
    import Vue from "vue";
    import Axios from "axios";
    import Common from '../../../../common/js/common.js';
    import Pager from "../../../../common/vue/paging.vue";
    import Message, {messageUtil} from "../../../../common/js/message";
    import fileViewPopup from '../../popup/fileViewPopup.vue'
    import mttr from "./popup/rgstPwSftmtMttrPopup.vue";
    import mttrAll from "./popup/rgstPwSftmtMttrAllPopup.vue";

    export default {
        components: {
            'pager': Pager,
            'fileViewPopup': fileViewPopup,
            'mttr': mttr,
            'mttrAll': mttrAll,
        },
        data: function() {
            return {
                fileViewPop:false,
                mttrPop:false,
                mttrAllPop:false,
                viewModel:{
                    search:{
                        // bplc_sn:''
                    },
                    userInfo:{},
                    list: [{dept_list: [{}],}],
                    deptList: [{}],
                    pager: {
                        model: {},
                        pageNo: 1,
                        totalSize: 0,
                        rowSize: 10,
                        blockSize: 10,
                        list: [],
                        callBack: function (n) {
                            try{
                                this.model.fnList(n);
                            } catch(e){
                                console.log('callback error  ' + e);
                            }
                        }
                    },
                    deptSize: 1
                },
                gbn:'mtg',
                loadYN:'N'
            };
        },
        mounted: function() {
            let vm = this;
            vm.fnInit();

            vm.$router.afterEach(function(to, from){
                vm.fnList(vm.viewModel.pager.pageNo);
            })
        },
        methods: {
            //초기화
            fnRefresh: function(){
                let vm = this;
                vm.viewModel.search = {}
            },
            fnInit: function(){
                let vm = this;
                vm.viewModel.userInfo = vm.$store.state.global.userInfo;

                vm.fnList(1);
            },
            //목록 조회
            fnList:function(paramPageNo){
                let vm = this;
                vm.viewModel.pager.pageNo = paramPageNo == undefined ? vm.viewModel.pager.pageNo : paramPageNo;
                let send = {
                    pageYn:'Y',
                    pageNo: vm.viewModel.pager.pageNo,
                    pageSize: vm.viewModel.pager.rowSize,
                    mtg_nm: vm.viewModel.search.mtg_nm,
                    user_id: vm.viewModel.userInfo.user_id,
                    gbn: vm.gbn,
                    loadYN: vm.loadYN
                }
                Axios.post("/selectPwSftmtList.do", send)
                .then(function(response) {

                    if(vm.loadYN == 'N'){
                        vm.viewModel.deptList = response.data.deptList;
                        vm.viewModel.deptSize = response.data.deptListCnt;
                    }

                    vm.viewModel.list = response.data.list;
                    vm.viewModel.pager.totalSize = response.data.totalCNT;

                    if(vm.gbn != 'mtg'){
                        for(let i=0; i<vm.viewModel.list.length; i++){
                            vm.viewModel.list[i].dept_list = [];
                            vm.viewModel.list[i].actn_rslt_list = [];
                            if(vm.viewModel.list[i].dept != null && vm.viewModel.list[i].dept != undefined){
                                let dept_list = vm.viewModel.list[i].dept.split(',');
                                let actn_rslt_list = vm.viewModel.list[i].actn_rslt.split(',');
                                for(let j=0; j<dept_list.length; j++){
                                    vm.viewModel.list[i].dept_list.push(dept_list[j]);
                                    vm.viewModel.list[i].actn_rslt_list.push(actn_rslt_list[j]);
                                }
                            }
                        }
                    }

                    //페이징세팅
                    Pager.props = Pager.methods.createPaging(vm.viewModel.pager, vm, "list");
                }).then(function(){
                    vm.loadYN = 'Y';
                });
                
            },
            //페이징 처리
            fnChangeCNTSelect: function(rowSize){
                let vm = this;
                if(rowSize != undefined || rowSize > 0){
                    vm.viewModel.pager.rowSize = rowSize
                    vm.fnList(1);
                }
            },
            fnDelete: function(sn){
                let vm = this;
                let send = {
                    mtg_sn: sn
                }

                if(confirm(Message.DELETE_CONFIRM)){
                    Axios.post("/deletePwSftmt.do", send)
                    .then(function(response) {
                        if(response.data == 1){
                            alert("삭제가 완료되었습니다.");
                            vm.fnList(vm.viewModel.pager.pageNo);
                        }
                    }).catch(function(ex){
                        alert(Message.ERROR);
                    });
                }
            },
            fnUpdate: function(sn, sign_yn_cnt, write_y_cnt){
                let vm = this;

                if(sign_yn_cnt > 0 || write_y_cnt > 0){
                    alert("참석 및 조치를 진행하여 수정이 불가합니다.");
                    return false;
                }else{
                    vm.$router.push('/write/'+sn);
                }

            },
            fnPopup: function(sn) {
				let vm = this;

                let send = {
                    mtg_sn: sn
                    , file_se: 1
                }

                Axios.post("/selectPwSftmtFileList.do", send)
                .then(function(response) {
                    vm.fileViewPop=true;
                    vm.mttrPop=false;
                    vm.mttrAllPop=false;
                    vm.$nextTick(function() {
                        if(vm.fileViewPop) {
                            vm.$refs.fileViewPopup.fnInit(response.data.fileList, 'pwSftmt');
                        }
                    })
                });				
			},
            fnMttrPopup: function(mtg_sn, cnsltn_mttr_sn, dept_sn) {
				let vm = this;
                vm.mttrPop=true;
                vm.mttrAllPop=false;
                vm.fileViewPop=false;
				vm.$nextTick(function() {
					if(vm.mttrPop) {
						vm.$refs.mttr.fnInit(mtg_sn, cnsltn_mttr_sn, dept_sn);
					}
				})			
			},
            fnMttrAllPopup: function(mtg_sn, cnsltn_mttr_sn) {
				let vm = this;
                vm.fileViewPop=false;
                vm.mttrPop=false;
                vm.mttrAllPop=true;
				vm.$nextTick(function() {
					if(vm.mttrAllPop) {
						vm.$refs.mttrAll.fnInit(mtg_sn, cnsltn_mttr_sn);
					}
				})			
			},
            fnTab: function(gbn){
                let vm = this;
                vm.gbn = gbn;

                if(gbn != 'mtg'){
                    vm.viewModel.list = [{dept_list: [{}],actn_rslt_list: [{}]}];
                }
                vm.fnList(1);
            }
        }
    };
</script>