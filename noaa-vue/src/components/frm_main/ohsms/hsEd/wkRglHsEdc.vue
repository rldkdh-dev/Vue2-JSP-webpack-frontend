<template>
<div>
    <div class="search_area">
        <button class="btn_toggle_search">검색</button>
        <div>
            <div class="search_container">
                <div class="row">
                    <select title="분류" v-model="selectEdu">
                        <option value="">분류 선택</option>
                        <option v-for="item in eduCodeList" :key="item" :value="item.edu_se_cd">{{ item.edu_se_nm }}</option>
                    </select>
                    <input type="text" placeholder="사고명을 입력하세요." title="사고명 입력" v-model="edu_nm_ttl" @input="edu_nm_ttl = $event.target.value">
                </div>
            </div>
            <div class="btn-group">
                <button class="btn btn-default-line" @click="fnreset"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-refresh"></use></svg>초기화</button>
                <button class="btn btn-default" @click="fnInit"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-search"></use></svg>검색</button>
            </div>
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
                <select v-model="viewModel.pager.rowSize" @change="fnGetChangeSelectList(viewModel.pager.rowSize);">
                        <option :value="10" >10개</option>
                        <option :value="30" >30개</option>
                        <option :value="50" >50개</option>
                        <option :value="100" >100개</option>
                </select>
            </div>
            <table class="table">
                <caption>근로자 정기 안전보건교육</caption>
                <thead>
                    <tr>
                        <th scope="col" class="w50">NO</th>
                        <th scope="col">분류</th>
                        <th scope="col">작성자</th>
                        <th scope="col">교육명</th>
                        <th scope="col">교육일시</th>
                        <th scope="col">작성일</th>
                        <th scope="col">첨부</th>
                        <th scope="col">관리</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item,i) in viewModel.list" :key="item">
                        <td>{{(viewModel.pager.pageNo==1) ? viewModel.pager.totalSize-i : viewModel.pager.totalSize-((viewModel.pager.rowSize*(viewModel.pager.pageNo-1))+i)}}</td>
                        <td>{{ item.edu_se_nm }}</td>
                        <td>{{ item.reg_id }}</td>
                        <td class="text-left"><button class="btn-link" @click="fnDetailPopup(item.edu_sn);">{{ item.edu_nm_ttl }}</button></td>
                        <td>{{ item.edu_dt }}</td>
                        <td>{{ item.reg_dt }}</td>
                        <td>
                            <a v-if="item.cnt > 0" href="javascript:;" class="btn btn-icon" @click="fnPopup(item.edu_sn);"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-attachment"></use></svg></a>
                        </td>
                        <td>
                            <a v-if="viewModel.userInfo.user_id == item.reg_id" @click="fnWritepopup(item.edu_sn)" href="javascript:;" class="btn btn-icon"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-edit-contents"></use></svg></a>
                            <a v-if="viewModel.userInfo.user_id == item.reg_id" href="javascript:;" class="btn btn-icon" @click="fndelete(item.edu_sn)"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-delete-sweep"></use></svg></a>
                        </td>
                    </tr>
                    <tr v-if="viewModel.list.length ==0"><td colspan="14">게시물이 없습니다.</td></tr>
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
                    <a href="javascript:;" class="btn btn-purple" @click="fnWritepopup()"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-post-add"></use></svg>등록</a>
                    <!-- <a href="" class="btn btn-gray"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-trash-can"></use></svg>삭제</a>
                     -->
                </div>
            </div>
        </div>
    </div>
    <fileViewPopup ref="fileViewPopup" v-if="fileViewPop==true"></fileViewPopup>
    <write ref="writepopup" v-if="writepop==true" @close="close"></write>
    <dtl ref="dtlpopup" v-if="dtlpop==true"></dtl>
</div>
</template>

<script>
    import "es6-promise/auto";
    import Vue from "vue";
    import Axios from "axios";
    import Pager from "../../../paging.vue";
    import fileViewPopup from "../../popup/fileViewPopup.vue";
    import writepop from "./wkRglHsEdcWrite.vue";
    import dtlpop from "./wkRglHsEdcDetail.vue";
    Vue.component('fileViewPopup',fileViewPopup);
    Vue.component('write',writepop);
    Vue.component('dtl',dtlpop);
    
    export default {
        components: {
            'pager': Pager,
        },
        data: function() {
            return {
                dtlpop:false,
                writepop:false,
                fileViewPop:false,
                selectEdu:"",
                edu_nm_ttl:"",
                eduCodeList:[],
                viewModel:{
                    list:[],
                    userInfo:{},
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
                }
            };
        },
        mounted: function() {
            let vm = this;
            vm.fnSelectEdulist();
            vm.fnInit();
        },
        methods: {
            fnInit:function(){
                let vm = this;
                vm.viewModel.userInfo = vm.$store.state.global.userInfo;
                vm.fnList(0)
            },
            fnList:function(paramPageNo){
				let vm = this;
				
                vm.viewModel.pager.pageNo = paramPageNo == 0 ? 1 : paramPageNo;
                
                let send = {
                    pageNo:vm.viewModel.pager.pageNo,
                    pageSize:vm.viewModel.pager.rowSize,
                    edu_se_cd:vm.selectEdu,
                    edu_nm_ttl:vm.edu_nm_ttl,
                }
                Axios.post("/selectWkRglHsEdcList.do", send)
                .then(function(response) {
                    vm.viewModel.list = response.data.hsEdList;
                    vm.viewModel.pager.totalSize = response.data.totalCount;
                    //페이징세팅
                    Pager.props = Pager.methods.createPaging(vm.viewModel.pager, vm, "list");
                });
            },
            fndelete:function(sn){
                let vm = this;
                if(confirm("삭제하시겠습니까?")){
                    Axios.post("/deleteWkRglHsEdc.do",{edu_sn:sn}).then(function(){
                        vm.fnInit();
                        alert("삭제를 완료하였습니다.");
                    })
                }else{
                    alert("삭제를 취소하였습니다.");
                }
            },
            fnSelectEdulist:function(){
                let vm = this;
                Axios.post('/hsEd/code.do',{}).then(function(res){
                    vm.eduCodeList = res.data.hsEdList;
                });
            },
            fnGetChangeSelectList: function(data){
                let vm = this;
                if(data >= null || data != 0){
                    vm.viewModel.pager.pageNo = 1;
                    vm.fnInit();
                }
            },
            fnreset:function(){
                this.selectEdu="";
                this.edu_nm_ttl="";
            },
            fnPopup: function(sn) {
				let vm = this;
                Axios.post("/selectWkRglHsEdcFileList.do", {sn: sn})
                .then(function(response) {
                    vm.fileViewPop=true;
                    vm.writepop = false;
                    vm.dtlpop = false;
                    vm.$nextTick(function() {
                        if(vm.fileViewPop) {
                            vm.$refs.fileViewPopup.fnInit(response.data.fileList, 'wkRgl');
                        }
                    })
                });
			},
            fnWritepopup:function(sn){
                let vm = this;
                vm.writepop = true;
                vm.fileViewPop = false;
                vm.dtlpop = false;
                vm.$nextTick(function() {
                    if(vm.writepop) {
                        vm.$refs.writepopup.fnInit(sn);
                    }
                })
            },
            close:function(bool){
                this.writepop = bool;
            },
            fnDetailPopup:function(sn){
                let vm = this;
                vm.writepop = false;
                vm.fileViewPop = false;
                vm.dtlpop = true;
                vm.$nextTick(function() {
                    if(vm.dtlpop) {
                        vm.$refs.dtlpopup.fnInit(sn);
                    }
                });
            }
        }
    };
</script>