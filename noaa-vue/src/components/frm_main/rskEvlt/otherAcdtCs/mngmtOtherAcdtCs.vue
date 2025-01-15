<template>
<div>
    <div class="search_area">
        <button class="btn_toggle_search">검색</button>
        <div>
            <div class="search_container">
                <div class="row">
                    <div class="datepicker_box">
                        <input type="text" class="datepicker" id="datepicker_s" placeholder="조회시작일" title="조회시작일" readonly>
                    </div>
                    <span>~</span>
                    <div class="datepicker_box">
                        <input type="text" class="datepicker" id="datepicker_e" placeholder="조회종료일" title="조회종료일" readonly>
                    </div>
                    <select title="사망사고 여부" v-model="viewModel.DCSC_YN" >
                        <option disabled value="" selected>사망사고 여부 선택</option>
                        <option value="">사망사고 여부</option>
                        <option value="Y">사망 발생</option>
                        <option value="N">사망 없음</option>
                    </select>
                    <select title="사고 유형" v-model="viewModel.PUBLIC_PRVATE_SE" >
                        <option disabled value="" selected>사고 유형 선택</option>
                        <option value="">전체</option>
                        <option value="공공">공공</option>
                        <option value="민간">민간</option>
                    </select>
                    <div> <input type="text" id="01" placeholder="공종" v-model="viewModel.ACDNT_CLSF_CFNL_LCLSF" ></div>
                    <div> <input type="text" id="01" placeholder="객체" v-model="viewModel.ACDNT_CLSF_ACDNT_OBJECT_LCLSF" ></div>
                    <!-- <select title="공종 분류" v-model="viewModel.searchCfnl" >
                        <option disabled value="" selected>공종 선택</option>
                        <option value="">전체</option>
                        <option :value=item v-for="item in searchCfnlList" :key="item">{{ item }}</option>
                    </select>
                    <select title="객체 분류" v-model="viewModel.searchObject" >
                        <option disabled value="" selected>객체 선택</option>
                        <option value="">전체</option>
                        <option :value=item v-for="item in searchObjectList" :key="item">{{ item }}</option>
                    </select> -->
                </div>
            </div>
            <div class="btn-group">
                <a href="javascript:void(0);" class="btn btn-default-line" @click="fnReset()"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-refresh"></use></svg>초기화</a>
                <a href="javascript:void(0);" class="btn btn-default" @click="fnInit()"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-search"></use></svg>검색</a>
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
                <select title="개수 선택" v-model="viewModel.pager.rowSize"  @change="fnRowSize(viewModel.pager.rowSize)">
                    <option :value="10">10개씩 보기</option>
                    <option :value="30">30개씩 보기</option>
                    <option :value="50">50개씩 보기</option>
                    <option :value="100">100개씩 보기</option>
                </select>
            </div>
            <table class="table">
                <thead>
                    <tr>
                        <th scope="col" class="w50">번호</th>
                        <th scope="col">사고명</th>
                        <th scope="col">발생일시</th>
                        <th scope="col">사고유형</th>
                        <th scope="col">사고 공종 분류</th>
                        <th scope="col">사고 객체 분류</th>
                        <!-- <th scope="col">사고 관련 사진</th> -->
                        <th scope="col">첨부</th>
                        <th scope="col">관리</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, i) in list" :key="i">
                        <td>{{ item.rownum }}</td>
                        <td class="text-left"><router-link class="btn-link" :to="'/detail/'+item.OTHCMPNY_ACDNT_SN">{{ item.ACDNT_NM }}</router-link></td>
                        <td>{{ item.OCRN_DT }}</td>
                        <td v-if="item.PUBLIC_PRVATE_SE">{{ item.PUBLIC_PRVATE_SE }}</td> <td v-else>-</td>
                        <td v-if="item.ACDNT_CLSF_CFNL_LCLSF">{{ item.ACDNT_CLSF_CFNL_LCLSF }}</td> <td v-else>-</td>
                        <td v-if="item.ACDNT_CLSF_ACDNT_OBJECT_LCLSF">{{ item.ACDNT_CLSF_ACDNT_OBJECT_LCLSF }}</td> <td v-else>-</td>
                        <!-- <td><a href="" class="btn btn-small btn-white" >사진</a></td> -->
                        <td><a v-if="item.file_ck == 'true'" href="javascript:void(0);" class="btn btn-icon" @click="fnPopup(item.OTHCMPNY_ACDNT_SN);"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-attachment"></use></svg></a></td>
                        <td>
                            <div class="icon_box">
                                <router-link :to="'/detail/'+item.OTHCMPNY_ACDNT_SN" class="btn btn-icon"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-content-search"></use></svg></router-link>
                                <router-link :to="'/update/'+item.OTHCMPNY_ACDNT_SN" class="btn btn-icon" v-if="item.REG_ID == viewModel.userInfo.user_id"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-edit-contents"></use></svg></router-link>
                                <a href="#" class="btn btn-icon" v-if="item.REG_ID == viewModel.userInfo.user_id" @click="fnOtherCaseDelete(item.OTHCMPNY_ACDNT_SN)"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-delete-sweep"></use></svg></a>

                                <!-- <a href="" class="btn btn-icon"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-content-search"></use></svg></a>
                                <a href="" class="btn btn-icon"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-edit-contents"></use></svg></a> -->
                                <!-- <a href="" class="btn btn-icon"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-delete-sweep"></use></svg></a> -->
                            </div>
                        </td>
                    </tr>
                    <tr v-if="list.length == 0"><td colspan="10">게시물이 없습니다.</td></tr>
                </tbody>
            </table>
            <div class="table_footer">
                <pager :pass="viewModel.pager"></pager>
                <div class="btn-group"> 
                    <!-- <div class="upload_file">
                        <div class="btn filebox">
                            첨부파일을 마우스로 드래그해서 추가해 주세요.
                        </div>
                        <input type="file" hidden id="uf01">
                        <label for="uf01" class="btn btn-white"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-folder-filled"></use></svg>찾아보기</label>
                        <a href="" class="btn btn-white"><i class="icon_excel"></i>엑셀업로드</a>
                    </div> -->

                    <!-- 본사, 현장관리자만 타사사고사례 등록 -->
                    <router-link to="/write" class="btn btn-purple" v-if="viewModel.userInfo.hdofc_mngr_yn == 'Y' || viewModel.userInfo.ocpt_se_cd == 'MNG'"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-post-add"></use></svg>등록</router-link>
                </div>
            </div>
        </div>
    </div>
    <fileViewPopup ref="fileViewPopup" v-if="fileViewPop==true"></fileViewPopup>
 </div>
</template>

<script>
    import "es6-promise/auto";
    import Vue from "vue";
    import Axios from "axios";
    import Pager from "../../../../common/vue/paging.vue";
    import Common from "../../../../common/js/common.js";
    import fileViewPopup from "../../popup/fileViewPopup.vue";
    
    export default {
        components: {
            'pager': Pager,
            'fileViewPopup':fileViewPopup,
        },
        data: function() {
            return {
                fileViewPop:false,
                imgsrc:'',
                list: [],
                searchCfnlList:[],
                searchObjectList:[],
                viewModel:{
                    userInfo:{},
                    OCRN_DT_S:'',
                    OCRN_DT_E:'',
                    PUBLIC_PRVATE_SE:'',
                    DCSC_YN:'',
                    ACDNT_CLSF_CFNL_LCLSF:'',
                    ACDNT_CLSF_ACDNT_OBJECT_LCLSF:'',
                    // searchCfnl:'',
                    // searchObject:'',
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
            let vt = this;
            vt.fnInit();
            vt.$router.afterEach((to, from) => {
                vt.fnList(vt.viewModel.pager.pageNo);
            });
        },
        methods: {
            fnInit:function(){
                let vt = this;
                vt.viewModel.userInfo = vt.$store.state.global.userInfo;
                vt.fnList(0);
            },
            fnList:function(paramPageNo){
				let vt = this;
                let vm = this.viewModel;
				
                vm.pager.pageNo = paramPageNo == 0 ? 1 : paramPageNo;
                if(($("#datepicker_s").val() && !$("#datepicker_e").val()) || (!$("#datepicker_s").val() && $("#datepicker_e").val())){
                    alert("조회시작일과 종료일을 모두 선택해야합니다.");
                    return false;
                }if($("#datepicker_s").val() > $("#datepicker_e").val()){
                    alert("조회시작일이 종료일보다 큽니다.");
                    return false;
                }
                vm.OCRN_DT_S = $("#datepicker_s").val();
                vm.OCRN_DT_E = $("#datepicker_e").val();
                
                let send = {
                    OCRN_DT_S:(vm.OCRN_DT_S == '') ? null:vm.OCRN_DT_S,
                    OCRN_DT_E:(vm.OCRN_DT_E == '') ? null:vm.OCRN_DT_E,
                    PUBLIC_PRVATE_SE : (vm.PUBLIC_PRVATE_SE == '') ? null:vm.PUBLIC_PRVATE_SE,
                    DCSC_YN : (vm.DCSC_YN == '') ? null:vm.DCSC_YN,
                    ACDNT_CLSF_CFNL_LCLSF: (vm.ACDNT_CLSF_CFNL_LCLSF == '') ? null:vm.ACDNT_CLSF_CFNL_LCLSF,
                    ACDNT_CLSF_ACDNT_OBJECT_LCLSF:(vm.ACDNT_CLSF_ACDNT_OBJECT_LCLSF == '') ? null:vm.ACDNT_CLSF_ACDNT_OBJECT_LCLSF,
                    // user_id:vt.viewModel.userInfo.user_id,
                    pageNo: vm.pager.pageNo,
					pageSize: vm.pager.rowSize,
                }
                Axios.post("/selectOtherAcdtCsList.do", send)
                .then(function(response) {
                    // vm.imgsrc = response.data.list[0].contents;
                    // editor.setData('\''+text+'\'');
                    // editor.setData(text);
                    // $('.image').css('width', '44.41%');
                    console.log(response);

                    vt.list = response.data.otherAcdtCsList;
					vm.pager.totalSize = response.data.totalCount;
                    for(let i=0; i<vt.list.length; i++){
						vt.list[i].OCRN_DT = (Common.fnDateTimeStrtime(vt.list[i].OCRN_DT)).substring(0,16);
                    }
                    // vt.searchCfnlList = response.data.otherSearch.otherCfnl;
                    // vt.searchObjectList  = response.data.otherSearch.otherObject;
                    //페이징세팅
                    Pager.props = Pager.methods.createPaging(vm.pager, vt, "list");
                });
                vt.$forceUpdate(); 
            },
            fnOtherCaseDelete(param){
                let vt = this;
                if(confirm("삭제하시겠습니까?")){ 
                    
                    let data = {
                        OTHCMPNY_ACDNT_SN : param,
                        user_id : vt.viewModel.userInfo.user_id
                    }
                    Axios.post("/deleteOthersAcdtCs.do", data).then(function(res){
                        console.log(res);
                    }).catch(function(ex) {
                        console.log(ex);
                    });

                    window.location.reload(); 
                }
            },
            fnReset:function(){
                let vt = this;
                $("#datepicker_s").val('');
                $("#datepicker_e").val('');
                vt.viewModel.PUBLIC_PRVATE_SE = '';
                vt.viewModel.DCSC_YN = '';
                // vt.viewModel.searchCfnl = '';
                // vt.viewModel.searchObject = '';
                vt.viewModel.ACDNT_CLSF_CFNL_LCLSF = '';
                vt.viewModel.ACDNT_CLSF_ACDNT_OBJECT_LCLSF = '';

            },
            fnRowSize:function(value){
                let vt = this;
                if(value != undefined || value != '' || value > 0){
                    vt.viewModel.pager.rowSize = value
                    vt.fnList(0);
                }
            },
            fnPopup: function(sn) {
				let vt = this;
                Axios.post("/selectOthersAcdtCsAttachlist.do", {OTHCMPNY_ACDNT_SN: sn})
                .then(function(response) {
                    console.log(response.data);
                    vt.fileViewPop=true;
                    vt.$nextTick(function() {
                        if(vt.fileViewPop) {
                            vt.$refs.fileViewPopup.fnInit(response.data.fileList, 'otherAcdtCs');
                        }
                    })
                });
			},
        }
    };
</script>