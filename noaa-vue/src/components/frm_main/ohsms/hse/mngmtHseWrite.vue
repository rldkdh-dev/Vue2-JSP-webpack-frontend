<template>
    <div>
        <div class="contents write">
            <div>
                <table class="table horizontal write">
                    <caption>내부심사 등록</caption>
                    <tbody>
                        <tr>
                            <th scope="row" class="w180 essential"><label>현장명</label></th>
                            <td>
                                <div class="input_group">
                                    <select v-model="bplc_sn" @change="fnbplcselect($event.target.value)" ref="bplc_sn">
                                        <option value=0>선택</option>
                                        <option v-for="item in bplclist" :key="item" :value="item.bplc_sn">{{ item.bplc_nm }}</option>
                                    </select>
                                </div>
                            </td>
                            <th scope="row" class="w180"><label>현장소장</label></th>
                            <td>{{ bplc_mngr }}</td>
                            <th scope="row" class="w180 essential"><label for="safe_pic">안전담당자</label></th>
                            <td>
                                <div class="input_group input_btn">
                                    <input id="safe_pic" type="text" title="검색" v-model="safe_pic" ref="safe_pic" @click="fnreviewer(1)" readonly>
                                    <label for="safe_pic"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-search"></use></svg></label>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row"><label>공사기간</label></th>
                            <td>{{ cstrn_pd }}</td>
                            <th scope="row"><label>공사금액</label></th>
                            <td>{{ ctrt_amt +" 만원"}}</td>
                            <th scope="row"><label>출력인원</label></th>
                            <td>{{ otpt_nmpr+" 명" }}</td>
                        </tr>
                        <tr>
                            <th scope="row"><label>공정율</label></th>
                            <td>
                                <div class="unit_box">
                                    <input type="text" class="text-right" v-model="fair_rt" maxlength="3" step="0.1" ref="fair_rt">
                                    <span class="unit">%</span>
                                </div>
                            </td>
                            <th scope="row" class="essential"><label for="audofir">심사자</label></th>
                            <td>
                                <div class="input_group input_btn">
                                    <input type="text" id="audofir" title="검색" v-model="audofir" ref="audofir" readonly>
                                    <!-- <label for="audofir"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-search"></use></svg></label> -->
                                </div>
                            </td>
                            <th scope="row" class="essential"><label>심사일</label></th>
                            <td>
                                <div class="datepicker_box">
                                    <input type="text" class="datepicker" title="심사일" ref="srng_dt" readonly>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row"><label>중대재해 처벌에 따른 현장의견</label></th>
                            <td colspan="5"><textarea rows="3" v-model="imprtndsstr_pnish_spt_opnn" @input="imprtndsstr_pnish_spt_opnn = $event.target.value" ref="imprtndsstr_pnish_spt_opnn"></textarea></td>
                        </tr>
                        <tr>
                            <th scope="row"><label>원도급(공동도급) 안전수준</label></th>
                            <td colspan="5"><textarea rows="3" v-model="gnrcont_safelevel" @input="gnrcont_safelevel = $event.target.value" ref="gnrcont_safelevel"></textarea></td>
                        </tr>
                        <tr ref="scroll">
                            <th scope="row"><label>시정조치 요구<br>(향후 위험 포함)</label></th>
                            <td colspan="5"><textarea rows="3" v-model="corec_actn_demand" @input="corec_actn_demand = $event.target.value" ref="corec_actn_demand"></textarea></td>
                        </tr>
                        <tr v-show="$route.params.sn !== undefined && resultlist.length != 0">
                            <th scope="row"><label>첨부파일</label></th>
                            <td colspan="5">
                                <hsefile @filelist="fnFilelist" :pass="{id:'sc'}" ref="files"></hsefile>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <template v-if="$route.params.sn !== undefined && resultlist.length != 0">
                <div id="scroll">
                    <ul class="tab">
                        <li :class="param == 'SYS' ? 'active':''"><button @click="fnTab(1)">시스템</button></li>
                        <li :class="param == 'WRKSHP' ? 'active':''"><button @click="fnTab(2)">작업장</button></li>
                        <li :class="param == 'LRG' ? 'active':''"><button @click="fnTab(3)">법규</button></li>
                    </ul>
                    <div class="tab_content">
                        <button class="btn btn-gray tab_content_top" style="position: absolute; bottom: calc(100% + 0.5rem); right: 180px;" @click="fnAllSave()"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-post-add"></use></svg>평가전체수정</button>
                        <button class="btn btn-purple tab_content_top" style="position: absolute; bottom: calc(100% + 0.5rem); right: 90px;" @click="fnSave()"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-post-add"></use></svg>{{ $route.params.sn !== undefined ? '수정' : '등록'}}</button>
                        <button class="btn btn-white tab_content_top" style="position: absolute; bottom: calc(100% + 0.5rem); right: 0px;" @click="fnBack"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-list-back"></use></svg>목록</button>
                        <div class="on">
                            <table class="table write">
                                <caption>시스템 평가항목 목록</caption>
                                <thead>
                                    <tr>
                                        <th scope="col" class="w50">번호</th>
                                        <th scope="col" colspan="2">항목</th>
                                        <th scope="col">세부내용</th>
                                        <th scope="col">배점</th>
                                        <th scope="col" colspan="2">지적</th>
                                        <th scope="col">지적/관찰내용</th>
                                        <th scope="col">점수</th>
                                        <th scope="col">비고</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(item ,i) in syslist" :key="item">
                                        <td v-if="item.detail_cn_sn == 1" :rowspan="item.artcl_detail_cnt">{{ item.hse_row }}</td>
                                        <td v-if="item.artcl_detail_sn==1 && item.detail_cn_sn == 1" :rowspan="item.artcl_cnt">{{ item.artcl_nm }}</td> <!-- 1 개-->
                                        <td v-if="item.detail_cn_sn == 1" :rowspan="item.artcl_detail_cnt">{{ item.artcl_detail_nm }}</td> <!-- 1 개-->
                                        <td class="text-left">{{ item.detail_cn }}</td>
                                        <td @click="fndistrib(item.ctgry_cd,item.se_cd,item.artcl_sn,item.artcl_detail_sn,item.distrib)" style="cursor:pointer;">{{ item.distrib }}</td>
                                        <template v-if="item.detail_cn_sn == 1">
                                            <td :rowspan="item.artcl_detail_cnt"><input type="checkbox" title="지적" :name="'chek'+i" v-model="syslist[i].lgstr_s" 
                                                @change="fnChageChenk(syslist[i].lgstr_s=$event.target.checked,'s',item.ctgry_cd,item.se_cd,item.artcl_sn,item.artcl_detail_sn,item.detail_cn_sn)">지적</td>
                                            <td :rowspan="item.artcl_detail_cnt"><input type="checkbox" title="권고" :name="'chek'+i" v-model="syslist[i].lgstr_d" 
                                                @change="fnChageChenk(syslist[i].lgstr_d=$event.target.checked,'d',item.ctgry_cd,item.se_cd,item.artcl_sn,item.artcl_detail_sn,item.detail_cn_sn)">권고</td>
                                            <td :rowspan="item.artcl_detail_cnt"><textarea title="지적/관찰내용" v-model="item.rslt_cn" style="width: 335px;" 
                                                @input="fnRsltValue(item.rslt_cn=$event.target.value,item.ctgry_cd,item.se_cd,item.artcl_sn,item.artcl_detail_sn)"></textarea></td>
                                            <td :rowspan="item.artcl_detail_cnt">{{ syslist[i].scr }}</td>
                                            <td :rowspan="item.artcl_detail_cnt"><textarea title="비고" v-model="item.rmrk" style="width: 335px;" 
                                                @input="fnRmrkValue(item.rmrk=$event.target.value,item.ctgry_cd,item.se_cd,item.artcl_sn,item.artcl_detail_sn)"></textarea></td>
                                        </template>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div>
                            <table class="table write">
                                <caption>작업장 평가항목 목록</caption>
                                <thead>
                                    <tr>
                                        <th scope="col" class="w50">번호</th>
                                        <th scope="col">구분</th>
                                        <th scope="col" colspan="2">항목</th>
                                        <th scope="col">세부내용</th>
                                        <th scope="col">해당유무</th>
                                        <th scope="col" colspan="2">지적</th>
                                        <th scope="col">위반내용</th>
                                        <th scope="col">법적기준</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(item,i) in wrkshplist" :key="item">
                                        <td :rowspan="item.artcl_detail_cnt">{{ item.hse_row }}</td>
                                        <td v-if="item.artcl_detail_sn==1 && item.detail_cn_sn == 1" :rowspan="item.artcl_cnt">{{ item.se_nm }}</td>
                                        <td v-if="item.artcl_detail_sn==1 && item.detail_cn_sn == 1" :rowspan="item.artcl_cnt">{{ item.artcl_nm }}</td>
                                        <td v-if="item.detail_cn_sn == 1" :rowspan="item.artcl_detail_cnt">{{ item.artcl_detail_nm }}</td>
                                        <td class="text-left">{{ item.detail_cn }}</td>
                                        <template v-if="item.detail_cn_sn == 1">
                                            <td><input type="checkbox" title="무 = 0 / 유 = 1" true-value=1 false-value=0 v-model="item.scr"></td>
                                            <td :rowspan="item.artcl_detail_cnt"><input type="checkbox" title="지적" :name="'chek'+i" v-model="wrkshplist[i].lgstr_s"
                                                @change="fnChageChenk(wrkshplist[i].lgstr_s=$event.target.checked,'s',item.ctgry_cd,item.se_cd,item.artcl_sn,item.artcl_detail_sn,item.detail_cn_sn)">지적</td>
                                            <td :rowspan="item.artcl_detail_cnt"><input type="checkbox" title="권고" :name="'chek'+i" v-model="wrkshplist[i].lgstr_d"
                                                @change="fnChageChenk(wrkshplist[i].lgstr_d=$event.target.checked,'d',item.ctgry_cd,item.se_cd,item.artcl_sn,item.artcl_detail_sn,item.detail_cn_sn)">권고</td>
                                            <td :rowspan="item.artcl_detail_cnt"><textarea title="조치요구사항" v-model="item.rslt_cn" @input="item.rslt_cn = $event.target.value"></textarea></td>
                                            <td :rowspan="item.artcl_detail_cnt"><textarea title="비고" v-model="item.rmrk" @input="item.rmrk = $event.target.value"></textarea></td>
                                        </template>
                                    </tr>  
                                </tbody>
                            </table>
                        </div>
                        <div>
                            <table class="table write">
                                <caption>법규 평가항목 목록</caption>
                                <thead>
                                    <tr>
                                        <th scope="col" class="w50">번호</th>
                                        <th scope="col">구분</th>
                                        <th scope="col" colspan="2">항목</th>
                                        <th scope="col">세부내용</th>
                                        <th scope="col">해당유무</th>
                                        <th scope="col" colspan="2">지적</th>
                                        <th scope="col">지적/관찰내용</th>
                                        <th scope="col">비고</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(item,i ) in lrglist" :key="item">
                                        <td v-if="item.detail_cn_sn == 1" :rowspan="item.artcl_detail_cnt">{{ item.hse_row }}</td>
                                        <td v-if="item.artcl_detail_sn==1 && item.detail_cn_sn == 1" :rowspan="item.artcl_cnt">{{ item.se_nm }}</td>
                                        <td v-if="item.artcl_detail_sn==1 && item.detail_cn_sn == 1" :rowspan="item.artcl_cnt">{{ item.artcl_nm }}</td>
                                        <td v-if="item.detail_cn_sn == 1" :rowspan="item.artcl_detail_cnt">{{ item.artcl_detail_nm }}</td>
                                        <td class="text-left">{{ item.detail_cn }}</td>
                                        <td><input type="checkbox" title="무 = 0 / 유 = 1" true-value=1 false-value=0 v-model="item.scr"></td>
                                        <template v-if="item.detail_cn_sn == 1">
                                            <td :rowspan="item.artcl_detail_cnt"><input type="checkbox" title="지적" :name="'chek'+i" v-model="lrglist[i].lgstr_s"
                                                @change="fnChageChenk(lrglist[i].lgstr_s=$event.target.checked,'s',item.ctgry_cd,item.se_cd,item.artcl_sn,item.artcl_detail_sn,item.detail_cn_sn)">지적</td>
                                            <td :rowspan="item.artcl_detail_cnt"><input type="checkbox" title="권고" :name="'chek'+i" v-model="lrglist[i].lgstr_d"
                                                @change="fnChageChenk(lrglist[i].lgstr_d=$event.target.checked,'d',item.ctgry_cd,item.se_cd,item.artcl_sn,item.artcl_detail_sn,item.detail_cn_sn)">권고</td>
                                            <td :rowspan="item.artcl_detail_cnt"><textarea title="조치요구사항" v-model="item.rslt_cn"
                                                @input="fnRsltValue(item.rslt_cn=$event.target.value,item.ctgry_cd,item.se_cd,item.artcl_sn,item.artcl_detail_sn)"></textarea></td>
                                            <td :rowspan="item.artcl_detail_cnt"><textarea title="비고" v-model="item.rmrk"
                                                @input="fnRmrkValue(item.rmrk=$event.target.value,item.ctgry_cd,item.se_cd,item.artcl_sn,item.artcl_detail_sn)"></textarea></td>
                                        </template>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </template>
            <div class="table_footer btn-right">
                <button v-if="$route.params.sn !== undefined && resultlist.length != 0" class="btn btn-purple" @click="fnHseSave()"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-post-add"></use></svg>평가수정</button>
                <button class="btn btn-purple" @click="fnSave()"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-post-add"></use></svg>{{ $route.params.sn !== undefined ? '수정' : '등록'}}</button>
                <a href="javascript:;" class="btn btn-white" id="router" @click="fnBack"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-list-back"></use></svg>목록</a>
            </div>
        </div>
        <reviewerpopup ref="reviewer" v-if="isreviewer==true"  @close="close" @result="result"></reviewerpopup>
    </div>
</template>

<script>
    import "es6-promise/auto";
    import Vue, { isShallow } from "vue";
    import Axios from "axios";
    import reviewerpopup from "./popup/HseWritepopup.vue";
    import HseFile from '../../../../common/vue/hsefileform.vue';
    import Message, {messageUtil} from "../../../../common/js/message";

    Vue.component('reviewerpopup',reviewerpopup);
    Vue.component('hsefile',HseFile);

    export default {
        data: function() {
            return {
                isreviewer:false,
                bplc_nm:"", // 현장명 
                bplc_sn:0, //현장 일련번호
                bplc_mngr:"현장명을 선택해주세요.", // 현장소장
                safe_pic:"", // 안전담당자
                safe_pic_id:"", // 안전담당자 id
                cstrn_pd:"현장명을 선택해주세요.", // 공사기간 
                ctrt_amt:"",  //공사금액
                otpt_nmpr:0, // 출석인원 
                fair_rt:0,  // 공정률 
                audofir:"", // 심사자 
                audofir_id: this.$store.state.global.userInfo.user_id, // 심사자 id
                srng_dt:"", // 심사잃자
                imprtndsstr_pnish_spt_opnn:"",  // 현장의견
                gnrcont_safelevel:"", // 안전수준
                corec_actn_demand:"", // 시정조치 요구
                viewModel: {
                    userInfo:{},
                    filelist: [],
                    fileGroup: '',
                    img_filelist: [],
                    imgfileGroup: '',
                    filelength:0,
                },
                mode: '',
                sn:0,
                bplclist:[],
                param:"SYS",
                hselist:[],
                resultlist:[],
                wrkshplist : [],
                lrglist : [],
                syslist : [],
                sysflag:false,
                wrkshpflag:false,
                lrgflag:false,
                hsefilelist:[],
                isSaved:false,
            };
        },
		watch:{
			fair_rt : function(e){
                if(e > 100){
                    this.fair_rt = 0;
                    return alert("100을 넘길수는 없습니다.");
                }else if(e == ''){
                    this.fair_rt = 0;
                }
				return this.fair_rt == 0 ? 0 : this.fair_rt = this.fair_rt.toString().replace(/[^0-9]/g, '').replace(/(^0+)/, '');
			},
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
        mounted: function() {
            let vm = this;

            calendarInput();
            vm.viewModel.userInfo = vm.$store.state.global.userInfo;
            if(vm.$route.params.sn != "" && vm.$route.params.sn != undefined){
                vm.sn = vm.$route.params.sn;
                vm.fnWrite();
                vm.fnHseAssementDetaillist();
                setTimeout(function(){
                    vm.fnDetail();            
                },100);
                
                
            }else{
                vm.fnWrite();
            }
        },
        deactivated:function(){
            this.$destroy();
        },
        methods: {
            fnDetail: function(){
                let vm = this;
                
                let data = {
                    groupid:vm.sn,
                    mapperId : "hse.mngmtHseFile",
                    se:'F',
                }
                Axios.post("/selectHseUpdatelist.do",{inner_srng_sn : vm.sn}).then(function(res){
                    // console.log(res.data);
                    vm.hsefilelist = res.data.hsefilelist;
                    vm.bplc_nm = res.data.hseList[0].bplc_nm;
                    vm.bplc_sn = res.data.hseList[0].bplc_sn;
                    vm.bplc_mngr = res.data.hseList[0].spt_hdch;
                    vm.safe_pic = res.data.hseList[0].safe_pic_nm;
                    vm.safe_pic_id = res.data.hseList[0].safe_pic;
                    vm.cstrn_pd = res.data.hseList[0].cstrn_pd;
                    vm.ctrt_amt = res.data.hseList[0].cstrn_amt;
                    vm.otpt_nmpr = res.data.hseList[0].otpt_nmpr;
                    vm.fair_rt = res.data.hseList[0].fair_rt;
                    vm.audofir = res.data.hseList[0].audofir_nm;
                    vm.audofir_id = res.data.hseList[0].audofir;
                    $(".datepicker").val(res.data.hseList[0].srng_dt);
                    vm.imprtndsstr_pnish_spt_opnn = res.data.hseList[0].imprtndsstr_pnish_spt_opnn;
                    vm.gnrcont_safelevel = res.data.hseList[0].gnrcont_safelevel;
                    vm.corec_actn_demand = res.data.hseList[0].corec_actn_demand;
                    
                    vm.$nextTick(function() { 
                        if(vm.hsefilelist.length != 0){
                            vm.$refs.files.fnFileLoad(data);
                        }        
                    });   

                })
            },
            fnWrite:function(){
                let vm = this;

                Axios.post("/selectHseWrite.do",{bplc_sn:vm.viewModel.userInfo.bplc_sn,dept_sn:vm.viewModel.userInfo.dept_sn,team_sn:vm.viewModel.userInfo.team_sn}).then(function(res){
                    vm.bplclist = res.data.hseList;
                    vm.audofir = vm.viewModel.userInfo.user_name;
                });
            },
            fnHseAssementDetaillist:function(){
                let vm = this;
                Axios.post("/selectHseAssementDetailList.do",{inner_srng_sn:vm.sn}).then(function(res){
                    
                    vm.hselist = res.data.hseList;
                    vm.resultlist = res.data.hseArtclDtlList;

                    /// 내부심사 디테일 
                    vm.wrkshplist = vm.hselist.filter(item => item.ctgry_cd =="WRKSHP");
                    vm.lrglist = vm.hselist.filter(item => item.ctgry_cd =="LRG");
                    vm.syslist = vm.hselist.filter(item => item.ctgry_cd =="SYS");
                    
                    for(var i=0; i<vm.resultlist.length; i++){
                        for(var j=0; j<vm.lrglist.length; j++){
                            if(vm.lrglist[j].se_cd == vm.resultlist[i].se_cd && vm.lrglist[j].artcl_sn == vm.resultlist[i].artcl_sn 
                            && vm.lrglist[j].artcl_detail_sn == vm.resultlist[i].artcl_detail_sn && vm.lrglist[j].detail_cn_sn == vm.resultlist[i].detail_cn_sn ){
                                // vm.lrglist[j].scr = vm.resultlist[i].scr == 1 ? '유' : "";
                                vm.lrglist[j].scr = vm.resultlist[i].scr;
                                vm.lrglist[j].lgstr_d = vm.resultlist[i].lgstr_cd == "RCMND" ? true : false;
                                vm.lrglist[j].lgstr_s = vm.resultlist[i].lgstr_cd == "LGSTR" ? true : false;
                                vm.lrglist[j].lgstr_cd = vm.resultlist[i].lgstr_cd;
                                vm.lrglist[j].rmrk = vm.resultlist[i].rmrk;
                                vm.lrglist[j].rslt_cn = vm.resultlist[i].rslt_cn;
                            }
                        };

                        for(var k=0; k<vm.wrkshplist.length; k++){
                            if(vm.wrkshplist[k].se_cd == vm.resultlist[i].se_cd && vm.wrkshplist[k].artcl_sn == vm.resultlist[i].artcl_sn 
                            && vm.wrkshplist[k].artcl_detail_sn == vm.resultlist[i].artcl_detail_sn && vm.wrkshplist[k].detail_cn_sn == vm.resultlist[i].detail_cn_sn ){
                                // vm.wrkshplist[k].scr = vm.resultlist[i].scr == 1 ? true : false;
                                vm.wrkshplist[k].scr = vm.resultlist[i].scr;
                                vm.wrkshplist[k].lgstr_d = vm.resultlist[i].lgstr_cd == "RCMND" ? true : false;
                                vm.wrkshplist[k].lgstr_s = vm.resultlist[i].lgstr_cd == "LGSTR" ? true : false;
                                vm.wrkshplist[k].lgstr_cd = vm.resultlist[i].lgstr_cd;
                                vm.wrkshplist[k].rmrk = vm.resultlist[i].rmrk;
                                vm.wrkshplist[k].rslt_cn = vm.resultlist[i].rslt_cn;
                            }
                        };

                        for(var m=0; m<vm.syslist.length; m++){
                            if(vm.syslist[m].se_cd == vm.resultlist[i].se_cd && vm.syslist[m].artcl_sn == vm.resultlist[i].artcl_sn 
                            && vm.syslist[m].artcl_detail_sn == vm.resultlist[i].artcl_detail_sn){
                                vm.syslist[m].scr = vm.resultlist[i].scr;
                                vm.syslist[m].lgstr_d = vm.resultlist[i].lgstr_cd == "RCMND" ? true : false;
                                vm.syslist[m].lgstr_s = vm.resultlist[i].lgstr_cd == "LGSTR" ? true : false;
                                vm.syslist[m].lgstr_cd = vm.resultlist[i].lgstr_cd;
                                vm.syslist[m].rmrk = vm.resultlist[i].rmrk;
                                vm.syslist[m].rslt_cn = vm.resultlist[i].rslt_cn;
                            }
                        }
                    }

                })
            },
            fnbplcselect:function(e){
                let vm = this;
                
                vm.safe_pic = "";
                vm.bplc_nm = "";
                vm.bplc_sn = 0;
                vm.bplc_mngr = "현장명을 선택해주세요.";
                vm.cstrn_pd = "현장명을 선택해주세요.";
                vm.ctrt_amt = "";
                vm.otpt_nmpr = "";
                for(var i=0; i<vm.bplclist.length; i++){
                    if(e == vm.bplclist[i].bplc_sn){
                        vm.bplc_nm = vm.bplclist[i].bplc_nm;
                        vm.bplc_sn = vm.bplclist[i].bplc_sn;
                        vm.bplc_mngr = vm.bplclist[i].bplc_mngr; 
                        vm.cstrn_pd = vm.bplclist[i].cstrn_pd;
                        vm.ctrt_amt = vm.bplclist[i].ctrt_amt;
                        vm.otpt_nmpr = vm.bplclist[i].otpt_nmpr;
                    }
                }
                
            },
            fnSave:function(){
                let vm = this;
                let send = {
                    bplc_nm:vm.bplc_nm, 
                    bplc_sn:vm.bplc_sn,
                    spt_hdch:vm.bplc_mngr, 
                    safe_pic:vm.safe_pic_id, 
                    cstrn_pd:vm.cstrn_pd,  
                    cstrn_amt:vm.ctrt_amt, 
                    otpt_nmpr:vm.otpt_nmpr, 
                    fair_rt:vm.fair_rt,   
                    audofir:vm.audofir_id, 
                    srng_dt:$(".datepicker").val(),
                    imprtndsstr_pnish_spt_opnn:vm.imprtndsstr_pnish_spt_opnn,
                    gnrcont_safelevel:vm.gnrcont_safelevel,
                    corec_actn_demand:vm.corec_actn_demand,
                    reg_id:vm.viewModel.userInfo.user_id 
                }
                if(vm.bplc_sn == 0){
                    vm.$refs.bplc_sn.focus();
                    return alert(messageUtil(Message.VALIDATION_REQUIRED, ["현장명"]));
                }else if(vm.safe_pic_id == ""){
                    vm.$refs.safe_pic.focus();
                    return alert(messageUtil(Message.VALIDATION_SELECT_REQUIRED, ["안전담당자"]));
                }else if(vm.audofir_id == ""){
                    vm.$refs.safe_pic.focus();
                    return alert(messageUtil(Message.VALIDATION_SELECT_REQUIRED, ["심사자"]));
                }else if($(".datepicker").val() == ""){
                    vm.$refs.srng_dt.focus();
                    return alert(messageUtil(Message.VALIDATION_REQUIRED, ["심사일자"]));
                }
                // else if(vm.imprtndsstr_pnish_spt_opnn == ""){
                //     vm.$refs.imprtndsstr_pnish_spt_opnn.focus();
                //     return alert(messageUtil(Message.VALIDATION_REQUIRED, ["중대재해 처벌에 따른 현장의견"]));
                // }else if(vm.gnrcont_safelevel == ""){
                //     vm.$refs.gnrcont_safelevel.focus();
                //     return alert(messageUtil(Message.VALIDATION_REQUIRED, ["원도급 안전수준"]));
                // }else if(vm.corec_actn_demand == ""){
                //     vm.$refs.corec_actn_demand.focus();
                //     return alert(messageUtil(Message.VALIDATION_REQUIRED, ["시정조치 요구"]));
                // }

                let message = '';
                var bool = false;

                if(vm.$route.params.sn !== undefined && vm.resultlist.length != 0){
                    message = '평가표는 수정되지않습니다.\n수정하시겠습니까?'
                }else{
                    message = '등록하시겠습니까?'
                } 

                if(confirm(message)){
                    if(vm.$route.params.sn != "" && vm.$route.params.sn != undefined){
                        send.inner_srng_sn = vm.sn;
                        Axios.post("/updateHseWrite.do",send).then(function(res){
                            
                            if(vm.viewModel.fileGroup != ''){
                                bool = vm.$refs.files.fnInsertFile(vm.viewModel.userInfo.user_id,vm.bplc_sn);
                            }else{
                                bool = true;
                            }
                            if(bool){
                                vm.isSaved = true;
                                alert("수정되었습니다.");
                                vm.$router.push('/');
                            }
                        })

                    }else{
                        Axios.post("/insertHseWrite.do",send).then(function(res){
                            vm.isSaved = true;
                            alert("등록되었습니다.");
                            vm.$router.push('/');
                        })
                    }
                }else{
                    alert("등록을 취소하였습니다.");
                }
            },
            fnAllSave:function(){
                let vm = this;
                var syslist = [];
                for(var i=0; i<vm.syslist.length; i++){
                    if(vm.syslist[i].distrib == vm.syslist[i].scr){
                        syslist.push(vm.syslist[i]);
                    }
                }

                let send={
                    bplc_sn:vm.bplc_sn,
                    ver:vm.hselist[0].ver,
                    inner_srng_sn:vm.sn,
                    syslist:syslist,
                    lrglist:vm.lrglist,
                    wrkshplist:vm.wrkshplist,
                    reg_id:vm.viewModel.userInfo.user_id,
                }
                var bool = false;
                if(confirm("수정하시겠습니까? 평가표만 전체 수정됩니다.")){
                    Axios.post("/insertAllHsejudge.do",send).then(function(res){
                        if(res.data != 0){
                            bool = true;
                        }else{
                            bool = false;
                        }
                        if(bool){
                            vm.isSaved = true;
                            alert("수정되었습니다.");
                            vm.$router.push('/');
                        }
                    }).catch(function(e){
                        console.log(e);
                    });
                }else{
                    alert("수정을 취소하였습니다.");
                }
            }, 
            fnHseSave:function(){
                let vm = this;
                var syslist = [];

                for(var i=0; i<vm.syslist.length; i++){
                    if(vm.syslist[i].distrib == vm.syslist[i].scr){
                        syslist.push(vm.syslist[i]);
                    }
                }

                if(vm.param == 'SYS'){
                    if(confirm("평가표의 내용만을 수정합니다.\n내부심사평가 시스템 수정하시겠습니까?")){
                        vm.fnHseinsert(syslist);
                    }

                }else if(vm.param == 'WRKSHP'){
                    if(confirm("평가표의 내용만을 수정합니다.\n내부심사평가 작업장 수정하시겠습니까?")){
                        vm.fnHseinsert(vm.wrkshplist);
                    }

                }else if(vm.param == 'LRG'){
                    if(confirm("평가표의 내용만을 수정합니다.\n내부심사평가 법규 수정하시겠습니까?")){
                        vm.fnHseinsert(vm.lrglist);
                    }

                }
            },
            fnHseinsert:function(list){
                let vm = this;
                let send ={
                    bplc_sn:vm.bplc_sn,
                    inner_srng_sn:vm.sn,
                    ver:vm.hselist[0].ver,
                    judgelist:list,
                    ctgry_cd:vm.param,
                    reg_id:vm.viewModel.userInfo.user_id,
                }

                Axios.post("/updateHsejudge.do",send).then(function(){
                    vm.$refs.scroll.scrollIntoView({behavior:"smooth", block: "end"});
                    alert("수정되었습니다.");
                })
            },
            fnreviewer:function(i){
                let vm = this;
                
                if(vm.$store.state.global.userInfo.bplc_yn == 'N' && vm.bplc_sn == 0){
                    vm.$refs.bplc_sn.focus();
                    return alert("현장명을 선택해주세요.");
                }

                vm.isreviewer = true;
                vm.$nextTick(function() {
                    if(vm.isreviewer){
                        vm.$refs.reviewer.fnInit(i,vm.bplc_sn);
                    }                
                })
            },
            close:function(bool){
                this.isreviewer = bool;
            },
            result:function(mode,name,id,bool){
                this.isreviewer = bool;
                if(mode == 1){
                    this.safe_pic = name;
                    this.safe_pic_id = id;
                }else{
                    this.audofir = name;
                    this.audofir_id = id;
                }

            },
            fndistrib:function(ctgry_cd,se_cd,artcl_sn,artcl_detail_sn,distrib){ // SYS
                let vm = this;
                for(var i=0; i<vm.syslist.length; i++){
                    if(vm.syslist[i].ctgry_cd == ctgry_cd && vm.syslist[i].se_cd == se_cd && vm.syslist[i].artcl_sn == artcl_sn && vm.syslist[i].artcl_detail_sn == artcl_detail_sn){
                        vm.syslist[i].scr = distrib;
                    }
                }
            },
            fnChageChenk:function(checked,e,ctgry_cd,se_cd,artcl_sn,artcl_detail_sn,detail_cn_sn){ 
                let vm = this;
                if(vm.param == 'WRKSHP'){
                    for(var i=0; i<vm.wrkshplist.length; i++){
                        if(vm.wrkshplist[i].ctgry_cd == ctgry_cd && vm.wrkshplist[i].se_cd == se_cd && vm.wrkshplist[i].artcl_sn == artcl_sn 
                        && vm.wrkshplist[i].artcl_detail_sn == artcl_detail_sn && vm.wrkshplist[i].detail_cn_sn == detail_cn_sn){

                            if(e == 's' && checked == true){
                                vm.wrkshplist[i].lgstr_d = false;
                                vm.wrkshplist[i].lgstr_cd = 'LGSTR';
                            }else if(e == 'd' && checked == true){
                                vm.wrkshplist[i].lgstr_s = false;
                                vm.wrkshplist[i].lgstr_cd = 'RCMND';
                            }else{
                                vm.wrkshplist[i].lgstr_s = false;
                                vm.wrkshplist[i].lgstr_d = false;
                                vm.wrkshplist[i].lgstr_cd = '';
                            }

                        }
                    }
                }else if(vm.param == 'LRG'){
                    for(var i=0; i<vm.lrglist.length; i++){
                        if(vm.lrglist[i].ctgry_cd == ctgry_cd && vm.lrglist[i].se_cd == se_cd && vm.lrglist[i].artcl_sn == artcl_sn 
                        && vm.lrglist[i].artcl_detail_sn == artcl_detail_sn && vm.lrglist[i].detail_cn_sn == detail_cn_sn){

                            if(e == 's' && checked == true){
                                vm.lrglist[i].lgstr_d = false;
                                vm.lrglist[i].lgstr_cd = 'LGSTR';
                            }else if(e == 'd' && checked == true){
                                vm.lrglist[i].lgstr_s = false;
                                vm.lrglist[i].lgstr_cd = 'RCMND';
                            }else{
                                vm.lrglist[i].lgstr_s = false;
                                vm.lrglist[i].lgstr_d = false;
                                vm.lrglist[i].lgstr_cd = '';
                            }

                        }
                    }
                }else{
                    for(var i=0; i<vm.syslist.length; i++){
                        if(vm.syslist[i].ctgry_cd == ctgry_cd && vm.syslist[i].se_cd == se_cd && vm.syslist[i].artcl_sn == artcl_sn 
                        && vm.syslist[i].artcl_detail_sn == artcl_detail_sn){

                            if(e == 's' && checked == true){
                                vm.syslist[i].lgstr_d = false;
                                vm.syslist[i].lgstr_s = true;
                                vm.syslist[i].lgstr_cd = 'LGSTR';
                            }else if(e == 'd' && checked == true){
                                vm.syslist[i].lgstr_s = false;
                                vm.syslist[i].lgstr_d = true;
                                vm.syslist[i].lgstr_cd = 'RCMND';
                            }else{
                                vm.syslist[i].lgstr_s = false;
                                vm.syslist[i].lgstr_d = false;
                                vm.syslist[i].lgstr_cd = '';
                            }

                        }
                    }
                }
                
            },
            fnRmrkValue:function(rmrk,ctgry_cd,se_cd,artcl_sn,artcl_detail_sn){
                let vm = this;

                if(vm.param == 'WRKSHP'){
                    for(var i=0; i<vm.wrkshplist.length; i++){
                        if(vm.wrkshplist[i].ctgry_cd == ctgry_cd && vm.wrkshplist[i].se_cd == se_cd && vm.wrkshplist[i].artcl_sn == artcl_sn && vm.wrkshplist[i].artcl_detail_sn == artcl_detail_sn){
                            vm.wrkshplist[i].rmrk = rmrk;
                        }
                    }
                }else if(vm.param == 'SYS'){
                    for(var i=0; i<vm.syslist.length; i++){
                        if(vm.syslist[i].ctgry_cd == ctgry_cd && vm.syslist[i].se_cd == se_cd && vm.syslist[i].artcl_sn == artcl_sn && vm.syslist[i].artcl_detail_sn == artcl_detail_sn){
                            vm.syslist[i].rmrk = rmrk;
                        }
                    }
                }else{
                    for(var i=0; i<vm.lrglist.length; i++){
                        if(vm.lrglist[i].ctgry_cd == ctgry_cd && vm.lrglist[i].se_cd == se_cd && vm.lrglist[i].artcl_sn == artcl_sn && vm.lrglist[i].artcl_detail_sn == artcl_detail_sn){
                            vm.lrglist[i].rmrk = rmrk;
                        }
                    }
                }
            },
            fnRsltValue:function(rslt,ctgry_cd,se_cd,artcl_sn,artcl_detail_sn){
                let vm = this;

                if(vm.param == 'WRKSHP'){
                    for(var i=0; i<vm.wrkshplist.length; i++){
                        if(vm.wrkshplist[i].ctgry_cd == ctgry_cd && vm.wrkshplist[i].se_cd == se_cd && vm.wrkshplist[i].artcl_sn == artcl_sn && vm.wrkshplist[i].artcl_detail_sn == artcl_detail_sn){
                            vm.wrkshplist[i].rslt_cn = rslt;
                        }
                    }
                }else if(vm.param == 'SYS'){
                    for(var i=0; i<vm.syslist.length; i++){
                        if(vm.syslist[i].ctgry_cd == ctgry_cd && vm.syslist[i].se_cd == se_cd && vm.syslist[i].artcl_sn == artcl_sn && vm.syslist[i].artcl_detail_sn == artcl_detail_sn){
                            vm.syslist[i].rslt_cn = rslt;
                        }
                    }
                }else{
                    for(var i=0; i<vm.lrglist.length; i++){
                        if(vm.lrglist[i].ctgry_cd == ctgry_cd && vm.lrglist[i].se_cd == se_cd && vm.lrglist[i].artcl_sn == artcl_sn && vm.lrglist[i].artcl_detail_sn == artcl_detail_sn){
                            vm.lrglist[i].rslt_cn = rslt;
                        }
                    }
                }
            },
            fnTab:function(i){
                let vm = this;
                if(i == 1){
                    vm.param ="SYS"
                }else if(i == 2){
                    vm.param ="WRKSHP"
                }else{
                    vm.param ="LRG"
                }
            },
            fnFilelist: function(vm) {
                this.viewModel.filelist = vm.filelist;
                this.viewModel.fileGroup = vm.fileGroup;
            },
            fnBack:function(){
                if(this.$route.params.sn !== undefined && this.resultlist.length != 0){
                    // if(confirm("수정작업을 중단하고 목록으로 가시겠습니까?")){
                        this.$router.push("/");
                    // }
                }else{
                    // if(confirm("작성을 중단하고 목록으로 가시겠습니까?")){
                        this.$router.push("/");
                    // }
                }
            },
        }
    };
</script>