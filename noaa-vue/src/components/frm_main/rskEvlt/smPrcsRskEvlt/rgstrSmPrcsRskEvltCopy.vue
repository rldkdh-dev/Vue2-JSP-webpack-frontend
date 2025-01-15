<template>
    <div>
        <div class="contents write">
            <div>
                <h3>기본정보</h3>
                <table class="table horizontal write">
                    <caption>기본정보</caption>
                    <tbody>
                        <tr>
                            <th scope="row" class="w100">현장명</th>
                            <td>
                                <div class="input_group input_btn">
                                    <input type="text" id="bplc_nm" v-model="viewModel.data.bplc_nm" readonly @click="viewModel.userInfo.bplc_yn !='Y' ? fnBplcPopup() : ''">
                                    <input type="hidden" id="bplc" v-model="viewModel.data.bplc_sn">
                                    <label for="bplc_nm" v-if="viewModel.userInfo.bplc_yn !='Y'"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-search"></use></svg></label>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">팀명</th>
                            <td>
                                <!-- <input type="text" id="team_nm" v-model="viewModel.data.team_nm" oninput="this.value = this.value.toString().replace(' ', '');"> -->
                                <select title="팀명 선택" v-model="viewModel.data.bplc_team_sn" id="team_nm">
                                    <option value=''>선택</option>
                                    <option v-for="item in viewModel.bplcTeamList" :value="item.BPLC_TEAM_SN">{{ item.BPLC_TEAM_NM }}</option>
                                </select>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div>
                <table class="table horizontal">
                    <caption>공종</caption>
                    <tbody>
                        <tr v-for="idx in Math.ceil((Number(viewModel.cfnlList.length) + 1) / 6)">
                            <!-- class="w100" -->
                            <th scope="rowgroup" :rowspan="Math.ceil((Number(viewModel.cfnlList.length) + 1) / 6)" v-if="idx == 1" class="w100">공종</th>
                            <td v-for="cnt in 6">
                                <label :for="'cnfl_'+viewModel.cfnlList[ ((idx - 1) * 6) + (cnt - 1) ].work_type_sn" v-if="((idx - 1) * 6) + (cnt - 1) < viewModel.cfnlList.length">
                                    <input type="checkbox" :id="'cnfl_'+viewModel.cfnlList[ ((idx - 1) * 6) + (cnt - 1) ].work_type_sn" name="cnfl" :value="viewModel.cfnlList[ ((idx - 1) * 6) + (cnt - 1) ].work_type_sn" @change="fnGetCfnlItem(viewModel.cfnlList[ ((idx - 1) * 6) + (cnt - 1) ].work_type_sn, $event)">{{ viewModel.cfnlList[ ((idx - 1) * 6) + (cnt - 1) ].cfnl_nm }}
                                </label>
                                <label :for="'cnfl_etc'" v-if="((idx - 1) * 6) + (cnt - 1) == viewModel.cfnlList.length">
                                    <input type="checkbox" :id="'cnfl_etc'" name="cnfl" :value="'etc'" @change="fnGetCfnlItem('etc', $event)">일반작업
                                </label>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div class="table_footer btn-right">
                    <button class="btn btn-gray" @click="fnRefresh();"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-refresh"></use></svg>초기화</button>
                </div>
            </div>
            <div>
                <rgstrSmPrcsRskEvltSubWrite :ref="'sub'" @selCfnlList="fnSelCfnlList"></rgstrSmPrcsRskEvltSubWrite>
            </div>
            <div class="btn-group btn-right">
                <a href="#" class="btn btn-purple" @click.prevent="fnSave()" v-if="viewModel.selCfnlList.length > 0"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-post-add"></use></svg>등록</a>
                <router-link :to="'/'" class="btn btn-white"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-list-back"></use></svg>목록</router-link>
            </div>
        </div>
        <bplc ref="bplc" v-if="bplcPop==true" :pass="{dept_sn: viewModel.userInfo.dept_sn, team_sn: viewModel.userInfo.team_sn}"></bplc>
        <user ref="mesu" v-if="mesuPop==true" :pass="{dept_sn: viewModel.userInfo.dept_sn, team_sn: viewModel.userInfo.team_sn, bplc_yn:'Y', bplc_sn: viewModel.data.bplc_sn, multi:'Y'}"></user>
        <fstRisk ref="fst" v-if="fstPop==true"></fstRisk>
    </div>
</template>

<script>
    import "es6-promise/auto";
    import Vue from "vue";
    import Axios from "axios";
    import Message, {messageUtil} from "../../../../common/js/message";
    import fromValidation from "../../../../common/js/fromValidation";
    import user from "../../popup/user_popup.vue";
    import bplc from "../../popup/bplc_popup.vue";
    import rgstrSmPrcsRskEvltSubWrite from "./rgstrSmPrcsRskEvltSubWrite.vue";
    import fstRisk from "./popup/fstRiskPopup.vue";
    
    export default {
        // activated() {
        //     // 컴포넌트가 활성화될 때마다 데이터를 가져오기
        //     alert("activated");
        //     this.fnInit();
        // },
        components: {
            'user' : user,
            'bplc' : bplc,
            'rgstrSmPrcsRskEvltSubWrite': rgstrSmPrcsRskEvltSubWrite,
            'fstRisk': fstRisk
		},
        data: function() {
            return {
                bplcPop:false,
                aprvrPop:false,
                mesuPop:false,
                fstPop:false,
                AprvrGbn:'',
                viewModel:{
                    data:{
                        mdtr:'',
                        mdtr_nm:'',
                        dcsnr:'',
                        dcsnr_nm:'',
                        bplc_team_sn:'',
                    },
                    userInfo:{},
                    selCfnlList:[],   //선택된 공종과 정보 담
                    cfnlList:[{cfnl_nm:'', work_type_sn:''}],        //공종 리스트
                    dgdgrList:[],       //위험도 코드리스트
                    bplcTeamList:[],
                },
                isSaved:false,
            };
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
        mounted: function() {
            let vm = this;
            // vm.fnInit();
        },
        methods: {
            //기본세팅
            fnInit:function(){
                let vm = this;
                vm.viewModel.userInfo = vm.$store.state.global.userInfo;
                
                let sn = vm.$route.params.sn;

                vm.fnDetail(sn);
            },
            fnDetail: function(sn){
                let vm = this;
                let send = {
                    spcm_risk_evl_sn: sn,
                    type: 'copy'
                }
                Axios.post("/selectSmPrcsRskEvltDetail.do", send)
                .then(function(response) {
                    vm.viewModel.data = response.data.mstDetail;
                    vm.viewModel.data.bplc_team_sn = '';
                    vm.viewModel.data.wrtr = vm.$store.state.global.userInfo.user_id;

                    vm.viewModel.selCfnlList = response.data.selCfnlList;
                    vm.viewModel.bplcTeamList = response.data.bplcTeamList;

                    //코드값
                    vm.viewModel.cfnlList = response.data.cfnlList;
                    vm.viewModel.dgdgrList = response.data.dgdgrList;

                    vm.$refs.sub.fnInit(vm.viewModel.dgdgrList, vm.viewModel.selCfnlList);                    
                }).then(function(){

                    for(let i= 0; i<vm.viewModel.selCfnlList.length; i++){
                        let sn = vm.viewModel.selCfnlList[i].work_type_sn;

                        if(sn == 9999){
                            $("input:checkbox[id='cnfl_etc']").prop("checked", true);
                        }else{
                            $("input:checkbox[id='cnfl_" + sn + "']").prop("checked", true);
                        }
                    }
                    
                    
                });
            },
            fnRefresh: function(){
                let vm = this;
                
                if(vm.viewModel.selCfnlList.length > 0){
                    if(!confirm("선택된 공종과 입력된 정보가 사라집니다. 그래도 초기화 하시겠습니까?")){
                        return false;
                    }else{
                        vm.viewModel.selCfnlList = [];
                        vm.$refs.sub.viewModel.selCfnlList = [];

                        $("input[name='cnfl']").prop('checked', false);
                    }
                }
            },
            fnSave:function(){
                let vm = this;
                const valiData = [
                    {id: 'bplc_nm', type: 'select', title: '현장명'},
                    {id: 'team_nm', type: 'select', title: '팀명'},
                ];

                if(!fromValidation(valiData)){
                    return false;
                }

                vm.viewModel.selCfnlList = vm.$refs.sub.viewModel.selCfnlList;

                for(let i=0; i<vm.viewModel.selCfnlList.length; i++){
                    let cfnl_nm = vm.viewModel.selCfnlList[i].spcmDetail.cfnl_nm; //공종명

                    //우리 기준
                    if(vm.viewModel.selCfnlList[i].cfnlList.length == 0){
                        alert(cfnl_nm + "의 우리기준을 입력해주세요.");
                        return false;
                    }else{
                        for(let j=0; j<vm.viewModel.selCfnlList[i].cfnlList.length; j++){
                            let item = vm.viewModel.selCfnlList[i].cfnlList[j];

                            if(item.job_process_nm == ''){
                                alert(cfnl_nm + "의 우리기준-작업절차를 입력해주세요.");
                                $("#job_process_nm_"+ i + "_"+ j).focus();
                                return false;
                            }else if(item.main_risk_fctr == ''){
                                alert(cfnl_nm + "의 우리기준-주요위험요인을 입력해주세요.");
                                $("#main_risk_fctr_"+ i + "_"+ j).focus();
                                return false;
                            }else if(item.safe_cntrpln == ''){
                                alert(cfnl_nm + "의 우리기준-주요위험요인을 입력해주세요.");
                                $("#safe_cntrpln_"+ i + "_"+ j).focus();
                                return false;
                            }
                        }
                    }

                    //작업내용/계획 소공정 PCM
                    if(vm.viewModel.selCfnlList[i].spcmDetail.cn_type == undefined || vm.viewModel.selCfnlList[i].spcmDetail.cn_type == ''){
                        alert(cfnl_nm + '의 소공정 PCM-유형을 입력해주세요');
                        $("#cn_type_"+i).focus();
                        return false;
                    }

                    //추가 위험 및 대책
                    if(vm.viewModel.selCfnlList[i].aditRiskList.length == 0){
                    }else{
                        for(let j=0; j<vm.viewModel.selCfnlList[i].aditRiskList.length; j++){
                            let item = vm.viewModel.selCfnlList[i].aditRiskList[j];

                            if(item.ovsite_job == '' || item.ovsite_job == undefined){
                                alert(cfnl_nm + "의 추가 위험 및 대책-누락된 작업을 입력해주세요.");
                                $("#ovsite_job_"+ i + "_"+ j).focus();
                                return false;
                            }else if(item.risk_fctr == '' || item.risk_fctr == undefined){
                                alert(cfnl_nm + "의 추가 위험 및 대책-위험요인을 입력해주세요.");
                                $("#risk_fctr_"+ i + "_"+ j).focus();
                                return false;
                            }else if(item.risk_dcrs_cntrpln == '' || item.risk_dcrs_cntrpln == undefined){
                                alert(cfnl_nm + "의 추가 위험 및 대책-위험감소대책을 입력해주세요.");
                                $("#risk_dcrs_cntrpln_"+ i + "_"+ j).focus();
                                return false;
                            }else if(item.actn_term == '' || item.actn_term == undefined){
                                alert(cfnl_nm + "의 추가 위험 및 대책-조치기한 을 입력해주세요.");
                                $("#actn_term_"+ i + "_"+ j).focus();
                                return false;
                            }else if(item.pic_nm == '' || item.pic_nm == undefined){
                                alert(cfnl_nm + "의 추가 위험 및 대책-담당자를 입력해주세요.");
                                $("#pic_nm_"+ i + "_"+ j).focus();
                                return false;
                            }else if(item.dgdgr == '' || item.dgdgr == undefined){
                                alert(cfnl_nm + "의 추가 위험 및 대책-위험도를 입력해주세요.");
                                $("#dgdgr_"+ i + "_"+ j).focus();
                                return false;
                            }
                        }
                    }
                }

                let data = {
                    reg_id: vm.viewModel.userInfo.user_id,
                    bplc_sn: vm.viewModel.data.bplc_sn,
                    team_nm: vm.viewModel.data.bplc_team_sn,
                    wrtr: vm.viewModel.data.wrtr,
                    wrtr_sign_yn: 'N',
                    mdtr: '',
                    // mdtr_sign_yn: vm.viewModel.data.mdtr_sign_yn,
                    dcsnr: vm.viewModel.data.dcsnr,
                    // dcsnr_sign_yn: 'N',
                    // spcm_risk_evl_sn: vm.viewModel.data.spcm_risk_evl_sn,
                    selCfnlList: vm.viewModel.selCfnlList
                }

                let frm = new FormData();
                
                for(let i=0; i<vm.viewModel.selCfnlList.length; i++){
                    if(vm.viewModel.selCfnlList[i].imgfilelist1 != undefined && vm.viewModel.selCfnlList[i].imgfilelist1 !=''){
                        if(vm.viewModel.selCfnlList[i].imgfilelist1[0].file != undefined && vm.viewModel.selCfnlList[i].imgfilelist1[0].file != null) {
                            frm.append("fileTitle", vm.viewModel.selCfnlList[i].imgfilelist1[0].file_title);
                            frm.append("uploadFiles", vm.viewModel.selCfnlList[i].imgfilelist1[0].file);
                            frm.append("sn", vm.viewModel.selCfnlList[i].work_type_sn);
                            frm.append("file_se", 1);
                            frm.append("key", 0)
                        } else {
                            if(vm.viewModel.selCfnlList[i].imgfilelist1[0].file == undefined){
                            }else{
                                frm.append("fileTitle", vm.viewModel.selCfnlList[i].imgfilelist1[0].file_title);
                                frm.append("key", key)
                            }
                        }
                    }else{
                    }

                    if(vm.viewModel.selCfnlList[i].imgdeletefileList1 != undefined){
                        frm.append("deleteFiles", vm.viewModel.selCfnlList[i].imgdeletefileList1[0]);                    
                        frm.append("del_sn", vm.viewModel.selCfnlList[i].work_type_sn);
                        frm.append("del_file_se", 1);
                    }

                    if(vm.viewModel.selCfnlList[i].imgfilelist2 != undefined && vm.viewModel.selCfnlList[i].imgfilelist2 !=''){
                        if(vm.viewModel.selCfnlList[i].imgfilelist2[0].file != undefined && vm.viewModel.selCfnlList[i].imgfilelist2[0].file != null) {
                            frm.append("fileTitle", vm.viewModel.selCfnlList[i].imgfilelist2[0].file_title);
                            frm.append("uploadFiles", vm.viewModel.selCfnlList[i].imgfilelist2[0].file);
                            frm.append("sn", vm.viewModel.selCfnlList[i].work_type_sn);
                            frm.append("file_se", 2);
                            frm.append("key", 0)
                        } else {
                            if(vm.viewModel.selCfnlList[i].imgfilelist2[0].file == undefined){
                            }else{
                                frm.append("fileTitle", vm.viewModel.selCfnlList[i].imgfilelist2[0].file_title);
                                frm.append("key", key)
                            }
                        }
                    }
                    
                    if(vm.viewModel.selCfnlList[i].imgdeletefileList2 != undefined){
                        frm.append("deleteFiles", vm.viewModel.selCfnlList[i].imgdeletefileList2[0]); 
                        frm.append("del_sn", vm.viewModel.selCfnlList[i].work_type_sn);  
                        frm.append("del_file_se", 2);
                    }
                }

                frm.append('data', new Blob([ JSON.stringify(data) ], {type : "application/json"}));
                frm.append("filePath", "smPrcsRskEvlt");

                if(confirm(Message.CREATE_CONFIRM)){
                    $(".loading").show();
                    $("#mask").show();
                    Axios.post("/insertSmPrcsRskEvlt.do", frm).then(function(response) {
                        if(response.data == 1){
                            vm.isSaved = true;
                            vm.$router.push('/');
                            alert("저장되었습니다.");
                        }else if(response.data == 888){
                            alert("이미 등록된 팀명입니다. 수정 후 등록해주세요.");
                            $("#team_nm").focus();
                            return false;
                        }else{
                            alert(Message.ERROR);    
                        }
                        
                    }).catch(function(ex) {
                        alert(Message.ERROR);
                    }).finally(function(){
                        $(".loading").hide();
                        $("#mask").hide();
                    });
                }
            },
            fnGetCfnlItem:function(work_type_sn, event){
                //공종명에 해당하는 우리기준 가져오기 
                let vm = this;
                
                if($(event.target).prop("checked")){
                    vm.$refs.sub.fnAddCfnl(work_type_sn);
                }else{
                    vm.$refs.sub.fnDelCfnl(work_type_sn);
                }                
            },
            fnBplcPopup: function(gbn) {
				let vm = this;
                vm.bplcPop=true;
                vm.aprvrPop=false;
                vm.mesuPop=false;
                vm.fstPop=false;
				vm.$nextTick(function() {
					if(vm.bplcPop) {
						vm.$refs.bplc.fnInit();
					}
				})
			},
            fnBplcAdd: function(item){
                let vm = this;

                vm.viewModel.data.bplc_sn = item.bplc_sn;
                vm.viewModel.data.bplc_nm = item.bplc_nm;

                vm.viewModel.data.dcsnr = item.mng_user_id == undefined ? null : item.mng_user_id;
                vm.viewModel.data.dcsnr_nm = item.mng_user_nm == undefined ? null : item.mng_user_nm;

                vm.fnBplcTeamList();
            },
            fnBplcTeamList: function(){
                let vm = this;

                let send = {
                    bplc_sn: vm.viewModel.data.bplc_sn,
                }

                Axios.post("/selectBplcTeamList.do", send)
                .then(function(response) {
                    vm.viewModel.bplcTeamList = response.data.bplcTeamList;
                    vm.viewModel.data.bplc_team_sn = "";

                    if(vm.viewModel.bplcTeamList.length == 0){
                        alert("등록된 팀이 없습니다. 팀 등록후 등록 가능합니다.");
                        return false;
                    }
                })
            },
            fnCfnlAdd: function(){
                let vm = this;

                vm.viewModel.data.cfnlList.push('');
            },
            fnCfnlDel: function(idx){
                let vm = this;

                vm.viewModel.data.cfnlList.splice(idx, 1);
            },
            fnAprvrpopup: function(gbn){
                let vm = this;

                vm.AprvrGbn = gbn;      //어느 결재자 정보인지 담아두기.

                vm.bplcPop=false;
                vm.aprvrPop=false;
                vm.mesuPop=false;
                vm.fstPop=false;

                if(vm.viewModel.data.bplc_sn == '' ||  vm.viewModel.data.bplc_sn == undefined){
                    alert("현장명을 선택해주세요.");
                    return false;
                }else if(gbn == 'mdtr' && vm.viewModel.data.mdtr_sign_yn == 'Y'){
                    alert("검토자는 이미 결재를 진행하여 변경할 수 없습니다.");
                }else if(gbn == 'dcsnr' && vm.viewModel.data.dcsnr_sign_yn == 'Y'){
                    alert("소장은 이미 결재를 진행하여 변경할 수 없습니다.");
                }else{
                    vm.aprvrPop=true;
                    vm.$nextTick(function() {
                        if(vm.aprvrPop) {
                            vm.$refs.aprvr.fnInit();
                        }
                    });
                }
            },
            fnMemberAdd: function(item){
                let vm = this;

                if(vm.AprvrGbn == 'mdtr'){
                    vm.viewModel.data.mdtr = item.user_id;
                    vm.viewModel.data.mdtr_nm = item.user_nm;
                }else{
                    vm.viewModel.data.dcsnr = item.user_id;
                    vm.viewModel.data.dcsnr_nm = item.user_nm;
                }

                //결재담당자 팝업 초기화
                vm.bplcPop=false;
                vm.aprvrPop=false;
                vm.mesuPop=false;
                vm.fstPop=false;
            },
            fnSelCfnlList: function(vm){
                this.viewModel.selCfnlList = vm.viewModel.selCfnlList;
            },
            fnMesurePopup: function(){
                let vm = this;
                vm.bplcPop=false;
                vm.aprvrPop=false;
                vm.mesuPop=false;
                vm.fstPop=false;
                if(vm.viewModel.data.bplc_sn == null || vm.viewModel.data.bplc_sn == ''){
                    alert("현장명을 선택해주세요.");
                    return false;
                }else{
                    vm.mesuPop=true;

                    vm.$nextTick(function() {
                        if(vm.mesuPop) {
                            vm.$refs.mesu.fnInit();
                        }
                    });
                }
            },
            fnMultiMemberAdd: function(list){
                let vm = this;
                vm.mesuPop = false;

                vm.$refs.sub.fnMemberAdd(list);
            },
            fnInput: function(){
                let vm = this;
                
                vm.viewModel.data.team_nm = vm.viewModel.data.team_nm.replace(' ', '');
            },
            fnFstRiskPopup: function(){
                let vm = this;

                vm.bplcPop=false;
                vm.aprvrPop=false;
                vm.mesuPop=false;
                vm.fstPop=false;

                if(vm.viewModel.data.bplc_sn == null || vm.viewModel.data.bplc_sn == ''){
                    alert("현장명을 선택해주세요.");
                    return false;
                }else{
                    vm.fstPop=true;
                    vm.$nextTick(function() {
                        if(vm.fstPop) {
                            vm.$refs.fst.fnInit(vm.viewModel.data.bplc_sn);
                        }
                    });
                }
            },
            fnSelect: function(list){
                let vm = this;
                vm.$refs.sub.fnSelect(list);
                vm.fstPop=false;
            }
        }
    };
</script>