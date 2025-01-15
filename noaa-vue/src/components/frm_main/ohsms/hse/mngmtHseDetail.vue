<template>
    <div>
        <div class="contents">
            <div>
                <table class="table horizontal write">
                    <caption>내부심사 등록</caption>
                    <tbody>
                        <tr>
                            <th scope="row" class="w180"><label>현장명</label></th>
                            <td>{{ bplc_nm }}</td>
                            <th scope="row" class="w180"><label>현장소장</label></th>
                            <td>{{ bplc_mngr }}</td>
                            <th scope="row" class="w180"><label>안전담당자</label></th>
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
                <h3>심사결과</h3>
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
                            <td>{{ sysresult.toFixed(1) }}</td>
                            <td>{{ wrkshpresult.toFixed(1) }}</td>
                            <td>{{ lrgresult.toFixed(1) }}</td>
                            <td>{{ totalscore.toFixed(1) }}</td>
                            <td v-if="totalscore > 90 "><span class="btn btn-small btn-green">녹색</span></td>
                            <td v-else-if="totalscore > 74.9 && totalscore < 90"><span class="btn btn-small btn-yellow">황색</span></td>
                            <td v-else><span class="btn btn-small btn-red">적색</span></td>
                        </tr>
                    </tbody>
                </table>
            </div>
			<div>
                <h3>첨부파일</h3>
				<table class="table">
					<caption>파일 목록</caption>
					<thead>
						<tr>
							<th>제목</th>
							<th>등록날짜</th>
							<th class="w60">다운로드</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="item in hsefilelist" :key="item">
							<td>{{ item.orgnl_file_nm }}</td>
							<td>{{ item.reg_dt }}</td>
							<td>
								<button class="btn btn-small btn-default" @click="fnFileDown(item)"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-download"></use></svg>다운</button>
							</td>
						</tr>
                        <tr v-if="hsefilelist.length ==0"><td colspan="14">파일이 없습니다.</td></tr>
					</tbody>
				</table>
			</div>
            <div>
                <ul class="tab">
                    <li :class="param == 'SYS' ? 'active':''"><button @click="fnTab(1)">시스템</button></li>
                    <li :class="param == 'WRKSHP' ? 'active':''"><button @click="fnTab(2)">작업장</button></li>
                    <li :class="param == 'LRG' ? 'active':''"><button @click="fnTab(3)">법규</button></li>
                </ul>
                <div class="tab_content">
                    <button class="btn btn-white tab_content_top" style="position: absolute; bottom: calc(100% + 0.5rem); right: 0px;" @click="fnExcelDownload"><i class="icon_excel"></i>엑셀다운로드</button>
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
                                    <td>{{ item.distrib }}</td>
                                    <template v-if="item.detail_cn_sn == 1">
                                        <td :rowspan="item.artcl_detail_cnt"><input type="checkbox" title="지적" :name="'chek'+i" v-model="syslist[i].lgstr_s" disabled>지적</td>
                                        <td :rowspan="item.artcl_detail_cnt"><input type="checkbox" title="권고" :name="'chek'+i" v-model="syslist[i].lgstr_d" disabled>권고</td>
                                        <td :rowspan="item.artcl_detail_cnt"><textarea title="조치요구사항" v-model="item.rslt" style="width: 435px;" disabled></textarea></td>
                                        <td :rowspan="item.artcl_detail_cnt">{{ syslist[i].scr }}</td>
                                        <td :rowspan="item.artcl_detail_cnt"><textarea title="비고" v-model="item.rmrk" style="width: 435px;" disabled></textarea></td>
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
                                        <td>{{ item.scr }}</td>
                                        <td :rowspan="item.artcl_detail_cnt"><input type="checkbox" title="지적" :name="'chek'+i" v-model="wrkshplist[i].lgstr_s" disabled>지적</td>
                                        <td :rowspan="item.artcl_detail_cnt"><input type="checkbox" title="권고" :name="'chek'+i" v-model="wrkshplist[i].lgstr_d" disabled>권고</td>
                                        <td :rowspan="item.artcl_detail_cnt"><textarea title="조치요구사항" v-model="item.rslt" disabled></textarea></td>
                                        <td :rowspan="item.artcl_detail_cnt"><textarea title="비고" v-model="item.rmrk" disabled></textarea></td>
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
                                    <td>{{ item.scr }}</td>
                                    <template v-if="item.detail_cn_sn == 1">
                                        <td :rowspan="item.artcl_detail_cnt"><input type="checkbox" title="지적" :name="'chek'+i" v-model="lrglist[i].lgstr_s" disabled>지적</td>
                                        <td :rowspan="item.artcl_detail_cnt"><input type="checkbox" title="권고" :name="'chek'+i" v-model="lrglist[i].lgstr_d" disabled>권고</td>
                                        <td :rowspan="item.artcl_detail_cnt"><textarea title="조치요구사항" v-model="item.rslt" disabled></textarea></td>
                                        <td :rowspan="item.artcl_detail_cnt"><textarea title="비고" v-model="item.rmrk" disabled></textarea></td>
                                    </template>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <div class="btn-group">
                <div class="right_side">
                    <button @click="fnBack" class="btn btn-purple">목록</button>
                </div>
            </div>
        </div>
        <excelform ref="excelform"></excelform>
    </div>
</template>
<script>
    import "es6-promise/auto";
    import Vue from "vue";
    import Axios from "axios";
    import excelform from "../../excelform.vue";
    
    Vue.component('excelform',excelform);
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
            resultlist:[],
            sysresult:0,
            wrkshpresult:0,
            lrgresult:0,
            totalscore:0,
            hsefilelist:[],
        };
      },
      mounted: function() {
            this.sn = this.$route.params.sn;
            this.userInfo = this.$store.state.global.userInfo;
            this.fnSelectHseDetaillist();
            this.fnHseAssementDetaillist(this.$route.params.sn);
      },
      methods: {
        fnSelectHseDetaillist:function(){
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

                vm.hsefilelist = res.data.hsefilelist;
            })
        },
        fnHseAssementDetaillist:function(sn){
            let vm = this;
            Axios.post("/selectHseAssementDetailList.do",{inner_srng_sn:sn}).then(function(res){
                
                vm.hselist = res.data.hseList;
                vm.resultlist = res.data.hseArtclDtlList;
                


                // 심사결과 
                var sys = res.data.hseArtclList.filter(item => item.ctgry_cd == 'SYS');
                var wrkshp = res.data.hseArtclList.filter(item => item.ctgry_cd == 'WRKSHP');
                var lrg = res.data.hseArtclList.filter(item => item.ctgry_cd == 'LRG');
                
                
                if(sys.length != 0)vm.sysresult = (sys[0].scr * 100 / 87);
                if(wrkshp.length != 0)vm.wrkshpresult = (100-(wrkshp[0].wrkshp_scr / wrkshp[0].wrkshp_deduction) * 100);
                if(lrg.length != 0)vm.lrgresult = (100-(lrg[0].lrg_scr / lrg[0].lrg_deduction) * 100);
                vm.totalscore = ((vm.sysresult * 0.3)+(vm.wrkshpresult * 0.6)+(vm.lrgresult * 0.1) );


                if(isNaN(vm.wrkshpresult))vm.wrkshpresult = 0.0;
                if(isNaN(vm.lrgresult))vm.lrgresult = 0.0;
                if(isNaN(vm.totalscore))vm.totalscore = 0.0;

                /// 내부심사 디테일 
                vm.wrkshplist = vm.hselist.filter(item => item.ctgry_cd =="WRKSHP");
                vm.lrglist = vm.hselist.filter(item => item.ctgry_cd =="LRG");
                vm.syslist = vm.hselist.filter(item => item.ctgry_cd =="SYS");

                for(var i=0; i<vm.resultlist.length; i++){
                    for(var j=0; j<vm.lrglist.length; j++){
                        if(vm.lrglist[j].se_cd == vm.resultlist[i].se_cd && vm.lrglist[j].artcl_sn == vm.resultlist[i].artcl_sn 
                        && vm.lrglist[j].artcl_detail_sn == vm.resultlist[i].artcl_detail_sn && vm.lrglist[j].detail_cn_sn == vm.resultlist[i].detail_cn_sn ){
                            vm.lrglist[j].scr = vm.resultlist[i].scr == 1 ? '유' : "";
                            vm.lrglist[j].lgstr_d = vm.resultlist[i].lgstr_cd == "RCMND" ? true : false;
                            vm.lrglist[j].lgstr_s = vm.resultlist[i].lgstr_cd == "LGSTR" ? true : false;
                            vm.lrglist[j].rmrk = vm.resultlist[i].rmrk;
                            vm.lrglist[j].rslt = vm.resultlist[i].rslt_cn;
                        }
                    };

                    for(var k=0; k<vm.wrkshplist.length; k++){
                        if(vm.wrkshplist[k].se_cd == vm.resultlist[i].se_cd && vm.wrkshplist[k].artcl_sn == vm.resultlist[i].artcl_sn 
                        && vm.wrkshplist[k].artcl_detail_sn == vm.resultlist[i].artcl_detail_sn && vm.wrkshplist[k].detail_cn_sn == vm.resultlist[i].detail_cn_sn ){
                            vm.wrkshplist[k].scr = vm.resultlist[i].scr == 1 ? '유' : "";
                            vm.wrkshplist[k].lgstr_d = vm.resultlist[i].lgstr_cd == "RCMND" ? true : false;
                            vm.wrkshplist[k].lgstr_s = vm.resultlist[i].lgstr_cd == "LGSTR" ? true : false;
                            vm.wrkshplist[k].rmrk = vm.resultlist[i].rmrk;
                            vm.wrkshplist[k].rslt = vm.resultlist[i].rslt_cn;
                        }
                    };

                    for(var m=0; m<vm.syslist.length; m++){
                        if(vm.syslist[m].se_cd == vm.resultlist[i].se_cd && vm.syslist[m].artcl_sn == vm.resultlist[i].artcl_sn 
                        && vm.syslist[m].artcl_detail_sn == vm.resultlist[i].artcl_detail_sn){
                            vm.syslist[m].scr = vm.resultlist[i].scr;
                            vm.syslist[m].lgstr_d = vm.resultlist[i].lgstr_cd == "RCMND" ? true : false;
                            vm.syslist[m].lgstr_s = vm.resultlist[i].lgstr_cd == "LGSTR" ? true : false;
                            vm.syslist[m].rmrk = vm.resultlist[i].rmrk;
                            vm.syslist[m].rslt = vm.resultlist[i].rslt_cn;
                        }
                    }
                }

            })
        },
        fnBack:function(){
            if(confirm("목록으로 가시겠습니까?")){
                this.$router.push("/");
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
		fnFileDown:function(item){
			let vm = this;
			let send = {
				file_sn: item.atchmnfl_sn,
				gbn:"hse"
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
        fnExcelDownload: function(){
            let vm = this;
            let header = null;
                if(vm.param != 'SYS'){
                    header = ['번호','항목1','항목2','항목3','해당유무','지적'];
                }else{
                    header = ['번호','항목1','항목2','점수'];
                }
                
                const mapperId = 'selectExcelHseList';
                //검색조건
                let data = {
                    header:header,
                    mapperId:mapperId,
                    inner_srng_sn:vm.sn,
                    ctgry_cd:vm.param,
                    // 파일명 
                    fileName:"내부심사평가", // 스마트안전보건_년월일.xlsx
                    // 해당 화면 필요한 조건 파라미터 추가 부분
                };
                if(confirm("엑셀 출력 하시겠습니까?")){
                    this.$nextTick(function() {
                        vm.$refs.excelform.fnInit(data);
                    })
                }
        },
      }
    };
</script>