<template>
    <modal :pass="{popupTitle:'내부심사 평가 등록',parameter:'hse'}" @close="fnClose">
        <template v-slot:contents>
            <div>
                <table class="table horizontal write">
                    <caption>내부심사 등록</caption>
                    <tbody>
                        <tr>
                            <th scope="row" class="w150"><label>현장명</label></th>
                            <td>{{ bplc_nm }}</td>
                            <th scope="row" class="w150"><label>현장소장</label></th>
                            <td>{{ bplc_mngr }}</td>
                            <th scope="row" class="w150"><label>안전담당자</label></th>
                            <td>{{ safe_pic }}</td>
                        </tr>
                        <tr>
                            <th scope="row"><label>공사기간</label></th>
                            <td>{{ cstrn_pd }}</td>
                            <th scope="row"><label>공사금액</label></th>
                            <td>{{ ctrt_amt }}</td>
                            <th scope="row"><label>출력인원</label></th>
                            <td>{{ otpt_nmpr }}</td>
                        </tr>
                        <tr>
                            <th scope="row"><label>공정율</label></th>
                            <td>{{ fair_rt+' %' }}</td>
                            <th scope="row"><label>심사자</label></th>
                            <td>{{ audofir }}</td>
                            <th scope="row"><label>심사일</label></th>
                            <td>{{ srng_dt }}</td>
                        </tr>
                        <tr>
                            <th scope="row"><label>중대재해 처벌에 따른 현장의견</label></th>
                            <td colspan="5">{{ imprtndsstr_pnish_spt_opnn }}</td>
                        </tr>
                        <tr>
                            <th scope="row"><label>원도급(공동도급) 안전수준</label></th>
                            <td colspan="5">{{ gnrcont_safelevel }}</td>
                        </tr>
                        <tr>
                            <th scope="row"><label>시정조치 요구<br>(향후 위험 포함)</label></th>
                            <td colspan="5">{{ corec_actn_demand }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div>
                <p class="title">심사결과</p>
                <table class="table">
                    <caption>내부심사결과</caption>
                    <thead>
                        <tr>
                            <th scope="col" colspan="3">점수</th>
                            <th scope="col" rowspan="2">총점</th>
                            <th scope="col" rowspan="2">등급</th>
                        </tr>
                        <tr>
                            <th scope="col">시스템 운영관리</th>
                            <th scope="col">작업장 위험관리</th>
                            <th scope="col">법규준수</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>50%</td>
                            <td>30%</td>
                            <td>20%</td>
                            <td>90 점 이상</td>
                            <td><span class="btn btn-small btn-green">녹색</span></td>
                        </tr>
                        <tr>
                            <td>50%</td>
                            <td>30%</td>
                            <td>20%</td>
                            <td>75 점 이상</td>
                            <td><span class="btn btn-small btn-yellow">황색</span></td>
                        </tr>
                        <tr>
                            <td>50%</td>
                            <td>30%</td>
                            <td>20%</td>
                            <td>75 점 미만</td>
                            <td><span class="btn btn-small btn-red">적색</span></td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div>
                <p class="title">첨부파일</p>
                <hsefile @filelist="fnFilelist" :pass="{id:'sc'}" ref="files"></hsefile>
            </div>
            <div ref="scroll">
                <ul class="tab">
                    <li :class="param == 'SYS' ? 'active':''"><button @click="fnTab(1)">시스템</button></li>
                    <li :class="param == 'WRKSHP' ? 'active':''"><button @click="fnTab(2)">작업장</button></li>
                    <li :class="param == 'LRG' ? 'active':''"><button @click="fnTab(3)">법규</button></li>
                </ul>
                <div class="tab_content">
                    <button v-if="userInfo.bplc_yn == 'N'" class="btn btn-gray tab_content_top" style="position: absolute; bottom: calc(100% + 0.5rem); right: 0;" @click="fnAllSave()">전체저장</button>
                    <button v-if="userInfo.bplc_yn == 'Y' && userInfo.ocpt_se_cd == 'MNG'" class="btn btn-gray tab_content_top" style="position: absolute; bottom: calc(100% + 0.5rem); right: 0;" @click="fnAllSave()">전체저장</button>
                    <div class="on">
                        <table class="table write">
                            <caption>시스템 평가항목 목록</caption>
                            <thead>
                                <tr>
                                    <th scope="col">번호</th>
                                    <th scope="col" colspan="2">항목</th>
                                    <th scope="col">세부내용</th>
                                    <th scope="col">배점   (점수를 눌러주세요.)</th>
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
                                        <td :rowspan="item.artcl_detail_cnt">지적<input type="checkbox" title="지적" :name="'chek'+i" v-model="syslist[i].lgstr_s" @change="fnChageChenk($event.target.checked,'s',item.ctgry_cd,item.se_cd,item.artcl_sn,item.artcl_detail_sn,item.detail_cn_sn)"></td>
                                        <td :rowspan="item.artcl_detail_cnt">권고<input type="checkbox" title="권고" :name="'chek'+i" v-model="syslist[i].lgstr_d" @change="fnChageChenk($event.target.checked,'d',item.ctgry_cd,item.se_cd,item.artcl_sn,item.artcl_detail_sn,item.detail_cn_sn)"></td>
                                        <td :rowspan="item.artcl_detail_cnt"><textarea title="조치요구사항" v-model="item.rslt_cn" @input="fnRsltValue($event.target.value,item.ctgry_cd,item.se_cd,item.artcl_sn,item.artcl_detail_sn)"></textarea></td>
                                        <td :rowspan="item.artcl_detail_cnt">{{ syslist[i].scr }}</td>
                                        <td :rowspan="item.artcl_detail_cnt"><textarea title="비고" v-model="item.rmrk" @input="fnRmrkValue($event.target.value,item.ctgry_cd,item.se_cd,item.artcl_sn,item.artcl_detail_sn)"></textarea></td>
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
                                    <th scope="col">번호</th>
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
                                    <td><input type="checkbox" title="무 = 0 / 유 = 1" true-value=1 false-value=0 v-model="wrkshplist[i].scr"></td>
                                    <template v-if="item.detail_cn_sn == 1">
                                        <td :rowspan="item.artcl_detail_cnt">지적<input type="checkbox" title="지적" :name="'chek'+i" v-model="wrkshplist[i].lgstr_s"
                                            @change="fnChageChenk($event.target.checked,'s',item.ctgry_cd,item.se_cd,item.artcl_sn,item.artcl_detail_sn,item.detail_cn_sn)"></td>
                                        <td :rowspan="item.artcl_detail_cnt">권고<input type="checkbox" title="권고" :name="'chek'+i" v-model="wrkshplist[i].lgstr_d" 
                                            @change="fnChageChenk($event.target.checked,'d',item.ctgry_cd,item.se_cd,item.artcl_sn,item.artcl_detail_sn,item.detail_cn_sn)"></td>
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
                                    <th scope="col">번호</th>
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
                                    <td><input type="checkbox" title="무 = 0 / 유 = 1" true-value=1 false-value=0 v-model="lrglist[i].scr"></td>
                                    <template v-if="item.detail_cn_sn == 1">
                                        <td :rowspan="item.artcl_detail_cnt">지적<input type="checkbox" title="지적" :name="'chek'+i" v-model="lrglist[i].lgstr_s" 
                                            @change="fnChageChenk($event.target.checked,'s',item.ctgry_cd,item.se_cd,item.artcl_sn,item.artcl_detail_sn,item.detail_cn_sn)"></td>
                                        <td :rowspan="item.artcl_detail_cnt">권고<input type="checkbox" title="권고" :name="'chek'+i" v-model="lrglist[i].lgstr_d" 
                                            @change="fnChageChenk($event.target.checked,'d',item.ctgry_cd,item.se_cd,item.artcl_sn,item.artcl_detail_sn,item.detail_cn_sn)"></td>
                                        <td :rowspan="item.artcl_detail_cnt"><textarea title="조치요구사항" v-model="item.rslt_cn" 
                                            @input="fnRsltValue($event.target.value,item.ctgry_cd,item.se_cd,item.artcl_sn,item.artcl_detail_sn)"></textarea></td>
                                        <td :rowspan="item.artcl_detail_cnt"><textarea title="비고" v-model="item.rmrk" 
                                            @input="fnRmrkValue($event.target.value,item.ctgry_cd,item.se_cd,item.artcl_sn,item.artcl_detail_sn)"></textarea></td>
                                    </template>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <div class="btn-group">
                <div class="right_side" v-if="userInfo.bplc_yn == 'N'">
                    <button @click="fnSave()" class="btn btn-purple">저장</button>
                </div>
            </div>
        </template>
    </modal>
</template>
<script>
    import "es6-promise/auto";
    import Vue from "vue";
    import Axios from "axios";
    import modal from '../../../../../common/vue/modal.vue';
    import HseFile from '../../../../../common/vue/hsefileform.vue';
    Vue.component('modal',modal);
    Vue.component('hsefile',HseFile);
    
    export default {
      data: function() {
        return {
            sn:0,
            bplc_sn:0, // 현장명 
            bplc_nm:"", // 현장명 
            bplc_mngr:"", // 현장소장
            safe_pic:"", // 안전담당자
            safe_pic_id:"", // 안전담당자 id
            cstrn_pd:"", // 공사기간 
            ctrt_amt:"",  //공사금액
            otpt_nmpr:0, // 출석인원 
            fair_rt:0,  // 공정률 
            audofir:"", // 심사자 
            audofir_id:"", // 심사자 id
            srng_dt:"", // 심사잃자
            imprtndsstr_pnish_spt_opnn:"",  // 현장의견
            gnrcont_safelevel:"", // 안전수준
            corec_actn_demand:"", // 시정조치 요구
            param:"SYS",
            distrib:"",
            hselist:[],
            syslist:[],
            wrkshplist:[],
            lrglist:[],
            artcllist:[],
            artcldtllist:[],
            ctgrylist:[],
            userInfo:{},
            viewModel: {
                filelist: [],
                fileGroup: '',
                img_filelist: [],
 				imgfileGroup: '',
                filelength:0,
			},
            sysflag : false,
            wrkshpflag : false,
            lrgflag : false,
        };
      },
      mounted: function() {},
      methods: {
        fnInit:function(sn){
            modal.methods.fnInit();
            this.sn = sn;
            this.userInfo = this.$store.state.global.userInfo;
            if(this.userInfo.bplc_yn == "N"){
                alert("전체화면으로 보시면 더욱 편하게 등록할 수 있습니다.");
            }else if(this.userInfo.bplc_yn == 'Y' && this.userInfo.ocpt_se_cd == 'MNG'){
                alert("전체화면으로 보시면 더욱 편하게 등록할 수 있습니다.");
            }else{
                alert("등록 대상이 아닙니다. \n평가 등록을 하실 수 없습니다.");
            }
            
            this.fnSelectHselist();
            this.fnHseAssementlist();
        },
        fnSelectHselist:function(){
            let vm = this;
            // let mapperId = "hse.HseFilelist"
            Axios.post("/selectHseUpdatelist.do",{inner_srng_sn:vm.sn}).then(function(res){
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
                vm.srng_dt = res.data.hseList[0].srng_dt;
                vm.imprtndsstr_pnish_spt_opnn = res.data.hseList[0].imprtndsstr_pnish_spt_opnn;
                vm.gnrcont_safelevel = res.data.hseList[0].gnrcont_safelevel;
                vm.corec_actn_demand = res.data.hseList[0].corec_actn_demand;
            })
        },
        fnHseAssementlist:function(){
            let vm = this;
            Axios.post("/selectHseAssementList.do",{ver:'0'}).then(function(res){
                
                vm.hselist = res.data.hseList;
                vm.wrkshplist = vm.hselist.filter(item => item.ctgry_cd =="WRKSHP");
                vm.lrglist = vm.hselist.filter(item => item.ctgry_cd =="LRG");
                vm.syslist = vm.hselist.filter(item => item.ctgry_cd =="SYS");
            })
        },
        fnSave:function(){
            let vm = this;
            var syslist = [];

            for(var i=0; i<vm.syslist.length; i++){
                if(vm.syslist[i].distrib == vm.syslist[i].scr){
                    syslist.push(vm.syslist[i]);
                }
            }
            
            if(vm.param == 'SYS' && vm.sysflag == false){
                if(confirm("내부심사평가 시스템 저장하시겠습니까?\n저장 후 다른 항목 평가도 할 수 있습니다.")){
                    vm.sysflag = true;
                    vm.fnHseinsert('i',syslist);
                    if(vm.sysflag&& vm.wrkshpflag&&vm.lrgflag){
                        alert("저장되었습니다.");
                        vm.$emit('close',false);
                    }else{
                        alert("저장되었습니다.");
                        vm.$refs.scroll.scrollIntoView({behavior:"smooth"});
                    }
                }
            }else if(vm.param == 'WRKSHP' && vm.wrkshpflag == false){
                if(confirm("내부심사평가 작업장 저장하시겠습니까?\n저장 후 다른 항목 평가도 할 수 있습니다.")){
                    vm.wrkshpflag = true;
                    vm.fnHseinsert('i',vm.wrkshplist);
                    if(vm.sysflag&& vm.wrkshpflag&&vm.lrgflag){
                        alert("저장되었습니다.");
                        vm.$emit('close',false);
                    }else{
                        alert("저장되었습니다.");
                        vm.$refs.scroll.scrollIntoView({behavior:"smooth"});
                    }
                }
            }else if(vm.param == 'LRG' && vm.lrgflag == false){
                if(confirm("내부심사평가 법규 저장하시겠습니까?\n저장 후 다른 항목 평가도 할 수 있습니다.")){
                    vm.lrgflag = true;
                    vm.fnHseinsert('i',vm.lrglist);
                    if(vm.sysflag&& vm.wrkshpflag&&vm.lrgflag){
                        alert("저장되었습니다.");
                        vm.$emit('close',false);
                    }else{
                        alert("저장되었습니다.");
                        vm.$refs.scroll.scrollIntoView({behavior:"smooth"});
                    }
                }

            }else if(vm.param == 'SYS' && vm.sysflag == true){
                if(confirm("내부심사평가 시스템 수정하시겠습니까?")){
                    vm.fnHseinsert('u',syslist);
                    alert("수정되었습니다.");
                    vm.$refs.scroll.scrollIntoView({behavior:"smooth"});
                }

            }else if(vm.param == 'WRKSHP' && vm.wrkshpflag == true){
                if(confirm("내부심사평가 작업장 수정하시겠습니까?")){
                    vm.fnHseinsert('u',vm.wrkshplist);
                    alert("수정되었습니다.");
                    vm.$refs.scroll.scrollIntoView({behavior:"smooth"});
                }
                
            }else if(vm.param == 'LRG' && vm.lrgflag == true){
                if(confirm("내부심사평가 법규 수정하시겠습니까?")){
                    vm.fnHseinsert('u',vm.lrglist);
                    alert("수정되었습니다.");
                    vm.$refs.scroll.scrollIntoView({behavior:"smooth"});
                }
                
            }

        },
        fnHseinsert:function(p,list){
            let vm = this;
            let send ={
                bplc_sn:vm.bplc_sn,
                inner_srng_sn:vm.sn,
                ver:vm.hselist[0].ver,
                judgelist:list,
                ctgry_cd:vm.param,
                reg_id:vm.userInfo.user_id,
            }
            // vm.param == 'SYS' ? send.syslist = list : vm.param == 'WRKSHP' ? send.wrkshplist = list : vm.param == 'LRG' ? send.lrglist = list : send.syslist = list;

            // console.log(send);
            if(p == "i"){
                Axios.post("/insertHsejudge.do",send).then(function(){})
            }else{
                Axios.post("/updateHsejudge.do",send).then(function(){})
            }
        },
        fnAllSave:function(){
            let vm = this;
            var syslist = [];
            // console.log("전체등록");
            for(var i=0; i<vm.syslist.length; i++){ // 내부심사 셀렉트 리절트 값에 대한 이슈로 점수를 한번더 가공 "굳이"
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
                reg_id:vm.userInfo.user_id,
            }
            var bool = false;
            if(confirm("등록 하시겠습니까?\n한번 등록된 평가는 수정페이지에서 수정 가능 합니다.")){
                Axios.post("/insertAllHsejudge.do",send).then(function(){
                    if(vm.viewModel.fileGroup != ''){
                        bool = vm.$refs.files.fnInsertFile(vm.userInfo.user_id,vm.bplc_sn);
                    }else{
                        bool = true;
                    }
                    if(bool){
                        alert("저장되었습니다.");
                        vm.$emit('close',false);
                    }
                }).catch(function(e){
                    console.log(e);
                });
            }else{
                alert("등록을 취소하였습니다.");
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
                    if(vm.syslist[i].ctgry_cd == ctgry_cd && vm.syslist[i].se_cd == se_cd && vm.syslist[i].artcl_sn == artcl_sn && vm.syslist[i].artcl_detail_sn == artcl_detail_sn){

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
        fndistrib:function(ctgry_cd,se_cd,artcl_sn,artcl_detail_sn,distrib){ // SYS
            let vm = this;
            for(var i=0; i<vm.syslist.length; i++){
                if(vm.syslist[i].ctgry_cd == ctgry_cd && vm.syslist[i].se_cd == se_cd && vm.syslist[i].artcl_sn == artcl_sn && vm.syslist[i].artcl_detail_sn == artcl_detail_sn){
                    vm.syslist[i].scr = distrib;
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
        fnClose:function(){
            let vm = this;
            var bool = false;
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
                reg_id:vm.userInfo.user_id,
            }

            if(vm.sysflag || vm.wrkshpflag || vm.lrgflag){
                if(confirm("저장된 평가가 있습니다.\n한번 등록된 평가는 수정페이지에서 수정 가능 합니다.\n평가등록을 그만 두시겠습니까?")){

                    Axios.post("/insertAllHsejudge.do",send).then(function(){
                        if(vm.viewModel.fileGroup != ''){
                            bool = vm.$refs.files.fnInsertFile(vm.userInfo.user_id,vm.bplc_sn);
                        }else{
                            bool = true;
                        }
                        if(bool){
                            alert("저장되었습니다.");
                            vm.$emit('close',false);
                        }
                    }).catch(function(e){
                        console.log(e);
                    });
                }   
            }else{
                if(confirm("등록 취소시 작성된 데이터는 저장 되지않습니다. \n 창을 닫으시겠습니까?")){
                    this.$emit('close',false);
                }
            }
        },
      }
    };
</script>