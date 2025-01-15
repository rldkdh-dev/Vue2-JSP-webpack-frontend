<template>
    <div class="contents">
        <div class="divide">
            <div>
                <h3>기본정보</h3>
                <table class="table horizontal write">
                    <caption>계획등록</caption>
                    <tbody>
                        <tr>
                            <th scope="row" colspan="3"><label for="oac01">현장명</label></th>
                            <td colspan="3">{{ viewModel.bplc_nm }}</td>
                            <th scope="row"><label for="oac02">현장소장</label></th>
                            <td>{{ viewModel.bplc_mngr }}</td>
                        </tr>
                        <tr>
                            <th scope="row" colspan="3"><label for="oac03">현장주소</label></th>
                            <td colspan="3">{{ viewModel.bplc_addr }}</td>
                            <th scope="row"><label for="oac04">현장전화</label></th>
                            <td>{{ viewModel.bplc_telno }}</td>
                        </tr>
                        <tr>
                            <th scope="row" colspan="3"><label for="oac05">도급관계</label></th>
                            <td colspan="5">{{ viewModel.outsrc_rel }}</td>
                        </tr>
                        <tr>
                            <th scope="row" colspan="3"><label for="oca_date">사고일자</label></th>
                            <td colspan="5">
                                <div class="datepicker_box">{{ viewModel.acdnt_dt }}</div>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row" colspan="3"><label for="oac06">사고개요</label></th>
                            <!-- <td colspan="5">{{ viewModel.acdnt_sumry }}</td> -->
                            <td colspan="5">
                                <p v-html="viewModel.acdnt_sumry"></p>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row" colspan="3"><label for="oac07">사고원인</label></th>
                            <td colspan="5">{{ viewModel.acdnt_cause }}</td>
                        </tr>
                        <tr>
                            <th scope="row" colspan="3"><label for="oac08">기인물</label></th>
                            <td colspan="5">{{ viewModel.org_cause_mtrl }}</td>
                        </tr>
                        <tr>
                            <th scope="rowgroup" rowspan="3" class="w80">목격자</th>
                            <th scope="row" colspan="2" class="th2"><label for="">성명</label></th>
                            <td colspan="3">{{ viewModel.wtn_nm }}</td>
                            <th scope="row" class="th2"><label for="">전화</label></th>
                            <td>{{ viewModel.wtn_tel }}</td>
                        </tr>
                        <tr>
                            <th scope="row" colspan="2" class="th2"><label for="">주소</label></th>
                            <td colspan="3">{{ viewModel.wtn_addr }}</td>
                            <th scope="row" class="th2"><label for="">소속</label></th>
                            <td>{{ viewModel.wtn_ogdp }}</td>
                        </tr>
                        <tr>
                            <th scope="row" colspan="2" class="th2"><label for="">목격경위</label></th>
                            <td colspan="3">{{ viewModel.wtn_crcmstncs }}</td>
                            <th scope="row" class="th2"><label for="">직종</label></th>
                            <td>{{ viewModel.wtn_ocpt }}</td>
                        </tr>
                        <tr>
                            <th scope="rowgroup" rowspan="3">안전조직</th>
                            <th scope="row" colspan="2" class="th2"><label for="">현장소장</label></th>
                            <td colspan="3">{{ viewModel.safe_ognz_spt_hdch }}</td>
                            <th scope="row" rowspan="3" class="th2"><label for="">특기사항</label></th>
                            <td rowspan="3">{{ viewModel.safe_ognz_spcabl_mttr }}</td>
                        </tr>
                        <tr>
                            <th scope="row" colspan="2" class="th2"><label for="">작업책임자</label></th>
                            <td colspan="3">{{ viewModel.safe_ognz_job_rbprsn }}</td>
                        </tr>
                        <tr>
                            <th scope="row" colspan="2" class="th2"><label for="">안전관리자</label></th>
                            <td colspan="3">{{ viewModel.safe_ognz_sfmngr }}</td>
                        </tr>
                        <tr>
                            <th scope="rowgroup" rowspan="9" class="bb0">첨부</th>
                            <th scope="row" colspan="2" class="th2"><label for="">통합본</label></th>
                            <td colspan="5">
                                <ul>
                                    <li v-for="item in viewModel.filelist[0]" :key="item">
                                        <a @click="fnFileDown(item, '1')" style="cursor: pointer;">{{ item.orgnl_file_nm }}</a>
                                    </li>
                                </ul>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row" colspan="2" class="th2"><label for="">사고상황도</label></th>
                            <td colspan="5">
                                <ul>
                                    <li v-for="item in viewModel.filelist[1]" :key="item">
                                        <a @click="fnFileDown(item, '2')" style="cursor: pointer;">{{ item.orgnl_file_nm }}</a>
                                    </li>
                                </ul>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row" colspan="2" class="th2"><label for="">목격자 진술서</label></th>
                            <td colspan="5">
                                <ul>
                                    <li v-for="item in viewModel.filelist[2]" :key="item">
                                        <a @click="fnFileDown(item, '3')" style="cursor: pointer;">{{ item.orgnl_file_nm }}</a>
                                    </li>
                                </ul>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row" colspan="2" class="th2"><label for="">근로계약서</label></th>
                            <td colspan="5">
                                <ul>
                                    <li v-for="item in viewModel.filelist[3]" :key="item">
                                        <a @click="fnFileDown(item, '4')" style="cursor: pointer;">{{ item.orgnl_file_nm }}</a>
                                    </li>
                                </ul>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row" colspan="2" class="th2"><label for="">급여명세서</label></th>
                            <td colspan="5">
                                <ul>
                                    <li v-for="item in viewModel.filelist[4]" :key="item">
                                        <a @click="fnFileDown(item, '5')" style="cursor: pointer;">{{ item.orgnl_file_nm }}</a>
                                    </li>
                                </ul>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row" colspan="2" class="th2"><label for="">채용 시 안전교육</label></th>
                            <td colspan="5">
                                <ul>
                                    <li v-for="item in viewModel.filelist[5]" :key="item">
                                        <a @click="fnFileDown(item, '6')" style="cursor: pointer;">{{ item.orgnl_file_nm }}</a>
                                    </li>
                                </ul>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row" colspan="2" class="th2 w100"><label for="">일일작업장 위험성평가표</label></th>
                            <td colspan="5">
                                <ul>
                                    <li v-for="item in viewModel.filelist[6]" :key="item">
                                        <a @click="fnFileDown(item, '7')" style="cursor: pointer;">{{ item.orgnl_file_nm }}</a>
                                    </li>
                                </ul>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row" colspan="2" class="th2"><label for="">보호구지급대장</label></th>
                            <td colspan="5">
                                <ul>
                                    <li v-for="item in viewModel.filelist[7]" :key="item">
                                        <a @click="fnFileDown(item, '8')" style="cursor: pointer;">{{ item.orgnl_file_nm }}</a>
                                    </li>
                                </ul>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row" colspan="2" class="th2"><label for="">정기안전교육</label></th>
                            <td colspan="5">
                                <ul>
                                    <li v-for="item in viewModel.filelist[8]" :key="item">
                                        <a @click="fnFileDown(item, '9')" style="cursor: pointer;">{{ item.orgnl_file_nm }}</a>
                                    </li>
                                </ul>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="approval">
                <h3>결재 정보</h3>
                <ul>
                    <li>
                        <a href="javascript:void(0);" class="signed">
                            <p>담당자</p>
                            <div class="user_img">
                                 <!-- <img src="../../img/user1.png" alt="차안전">  -->
                                 <!-- <img v-if="viewModel.pic_picture" :src="viewModel.pic_picture_path">  -->
                                 <img v-if="viewModel.pic_approval" :src="viewModel.pic_aprvr_path"> 
                            </div>
                            <span>{{ viewModel.pic_nm }}</span> <!-- 담당자 -->
                        </a>
                    </li>
                    <li>
                        <a href="javascript:void(0);" @click="fnSignPop('MDTR');" :class="[viewModel.mdtr_id&&viewModel.mdtr_atrz_yn!='Y' ? 'set':null, viewModel.mdtr_id&&viewModel.mdtr_atrz_yn=='Y' ? 'signed':null]">
                            <p>조정자</p>
                            <div class="user_img">
                                <img v-if="viewModel.mdtr_atrz_yn!='Y' && viewModel.mdtr_picture" :src="viewModel.mdtr_picture_path"> 
                                <img v-if="viewModel.mdtr_atrz_yn=='Y' && viewModel.mdtr_approval" :src="viewModel.mdtr_aprvr_path"> 
                            </div>
                            <span v-if="!viewModel.mdtr_id">조정자 등록</span> <!-- 조정자 -->
                            <span v-if="viewModel.mdtr_id">{{ viewModel.mdtr_nm }}</span> 
                        </a>
                    </li>
                    <li>
                        <a href="javascript:void(0);" @click="fnSignPop('DCSN');" :class="[viewModel.dcsn_id&&viewModel.dcsn_atrz_yn!='Y' ? 'set':null, viewModel.dcsn_id&&viewModel.dcsn_atrz_yn=='Y' ? 'signed':null]">
                            <p>결정자</p>
                            <div class="user_img">
                                <img v-if="viewModel.dcsn_atrz_yn!='Y' && viewModel.dcsn_picture" :src="viewModel.dcsn_picture_path"> 
                                <img v-if="viewModel.dcsn_atrz_yn=='Y' && viewModel.dcsn_approval" :src="viewModel.dcsn_aprvr_path"> 
                            </div>
                            <span v-if="!viewModel.dcsn_id">결정자 등록</span> <!-- 결정자 -->
                            <span v-if="viewModel.dcsn_id">{{ viewModel.dcsn_nm }}</span>
                        </a>
                    </li>
                </ul>
            </div>
        </div>
        <div class="write_area">
            <div v-if="viewModel.dsstr_man.length > 0 && (userInfo.hdofc_mngr_yn == 'Y' || viewModel.reg_id == userInfo.user_id)">
                <h3>재해자 정보</h3>
                <div class="table_top btn-right write_area">
                    <a href="javascript:void(0);" class="btn btn-light-purple" @click="fnDsstrAdd()" v-if="state != 'detail'"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-group-add"></use></svg>재해자 추가</a>
                    <a href="javascript:void(0);" class="btn btn-gray" @click="fnDsstrSub()" v-if="state != 'detail'"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-trash-can"></use></svg>삭제</a>
                </div>
                <table class="table horizontal write">
                    <tbody v-for="(item, i) in viewModel.dsstr_man" :key="index">
                        <tr>
                            <th rowspan="14" class="text-center w50">{{ i+1 }}</th>
                            <th scope="rowgroup" rowspan="8" class="w80">재해자 </th>
                            <th scope="row" colspan="2" class="th2"><label for="">성명</label></th>
                            <td>{{ item.dsstr_man_nm }}</td>
                            <th scope="row" class="th2"><label for="">주민번호</label></th>
                            <td>{{ item.dsstr_man_ihidnum }}</td>
                            <th scope="row" class="th2"><label for="">소속</label></th>
                            <td>{{ item.dsstr_man_ogdp }}</td>
                        </tr>
                        <tr>
                            <th scope="row" colspan="2" class="th2"><label for="">주소</label></th>
                            <td colspan="3">{{ item.dsstr_man_addr }}</td>
                            <th scope="row" class="th2"><label for="">전화</label></th>
                            <td>{{ item.dsstr_man_telno }}</td>
                        </tr>
                        <tr>
                            <th scope="row" colspan="2" class="th2"><label for="">고용일자</label></th>
                            <td> {{ item.dsstr_man_emplym_dt }}</td>
                            <th scope="row" class="th2"><label for="">직종</label></th>
                            <td>{{ item.dsstr_man_ocpt }}</td>
                            <th scope="row" class="th2"><label for="">근무형태</label></th>
                            <td>{{ item.dsstr_man_work_stle }}</td>
                        </tr>
                        <tr>
                            <th scope="row" colspan="2" class="th2"><label for="">경력</label></th>
                            <td>{{ item.dsstr_man_career }}</td>
                            <th scope="row" class="th2"><label for="">일당</label></th>
                            <td>{{ item.dsstr_man_day_salary }}</td>
                            <th scope="row" class="th2"><label for="">기왕증</label></th>
                            <td>{{ item.dsstr_man_anrx }}</td>
                        </tr>
                        <tr>
                            <th scope="row" colspan="2" class="th2"><label for="">취업구분</label></th>
                            <td colspan="5">{{ item.dsstr_man_empymn_se_cd }}</td>
                        </tr>
                        <tr>
                            <th scope="rowgroup" rowspan="3" class="th2 w80"><label for="">외주업체</label></th>
                            <th scope="row" class="th2 w50"><label for="">상호</label></th>
                            <td colspan="5">{{ item.outord_bzenty_conm }}</td>
                        </tr>
                        <tr>
                            <th scope="row" class="th2"><label for="">대표</label></th>
                            <td colspan="5">{{ item.outord_bzenty_rprs }}</td>
                        </tr>
                        <tr>
                            <th scope="row" class="th2"><label for="">전화</label></th>
                            <td colspan="5">{{ item.outord_bzenty_telno }}</td>
                        </tr>
                        <tr>
                            <th scope="rowgroup" rowspan="6">재해상태</th>
                            <th scope="row" colspan="2" class="th2"><label for="">병원명</label></th>
                            <td colspan="3">{{ item.dsstr_stts_hsptl_nm }}</td>
                            <th scope="row" class="th2"><label for="">전화</label></th>
                            <td>{{ item.dsstr_stts_hsptl_tel }}</td>
                        </tr>
                        <tr>
                            <th scope="row" colspan="2" class="th2"><label for="">병원주소</label></th>
                            <td colspan="5">{{ item.dsstr_stts_hsptl_addr }}</td>
                        </tr>
                        <tr>
                            <th scope="row" colspan="2" class="th2"><label for="">재해정도</label></th>
                            <td colspan="3">{{ item.dsstr_stts_dgree }}</td>
                            <th scope="row" class="th2"><label for="">요양기간</label></th>
                            <td>{{ item.dsstr_stts_rcper_pd }}</td>
                        </tr>
                        <tr>
                            <th scope="row" colspan="2" class="th2"><label for="">의사소견</label></th>
                            <td colspan="5">{{ item.dsstr_stts_dr_opin }}</td>
                        </tr>
                        <tr>
                            <th scope="rowgroup" rowspan="2" class="th2">물적피해</th>
                            <th scope="row" class="th2"><label for="">재산명</label></th>
                            <td colspan="5">{{ item.dsstr_stts_mtrl_dmge_prprty_nm }}</td>
                        </tr>
                        <tr>
                            <th scope="row" class="th2"><label for="">손해액</label></th>
                            <td colspan="5">{{ item.dsstr_stts_mtrl_dmge_dmage_amt }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="table_footer btn-right">
                <!-- <a href="" class="btn btn-purple"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-post-add"></use></svg>등록</a> -->
                <a href="#" class="btn btn-purple" @click="fnOurCaseInsert()" v-if="state != 'detail'"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-post-add"></use></svg>{{state_k}}</a>
                <router-link to="/" class="btn btn-white"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-list-back"></use></svg>목록</router-link>
            </div>
            <div class="popup active" v-if="signPop">
                <div class="popup_panel">
                    <div class="popup_header">
                        <h4>결재</h4>
                        <div class="icon_box">
                            <button class="btn btn-icon btn_fullscreen"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-fullscreen"></use></svg></button>
                            <button class="btn btn-icon btn_popup_close" @click="signPop=false"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-delete"></use></svg></button>
                        </div>
                    </div>
                    <div class="contents popup_contents">
                        <div class="btn-group">
                            <div class="right_side">
                                <a href="javascript:void(0);" class="btn btn-primary" @click="fnSignApproval(signPopSort)"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-check-circle"></use></svg>결재</a>
                                <a href="javascript:void(0);" class="btn btn-white" @click="fnSignReturn(signPopSort)"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-newsfeed"></use></svg>반려</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import "es6-promise/auto";
    import Vue from "vue";
    import Axios from "axios";
    import Fileform from "../../../../common/vue/fileform3.vue";
    import Common from "../../../../common/js/common.js";
    
    export default {
        components: {
            'fileform' : Fileform
        },
        data: function() {
            return {
                regDate : /^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/,
                imgsrc:'',
                uid:'',
                state:'',
                state_k:'',
                signPop:false,
                signPopSort:'',
                userInfo:'',
                today:'',
                tIndex:0,
                viewModel:{
                    // dsstr_man:[{dsstr_man_nm:'', DSSTR_INDEX: 0, DSSTR_BLEAN : false}],
                    dsstr_man:[{}],
                    acdnt_sumry:'',
                    acdnt_cause:'',
                    org_cause_mtrl:'',
                    dsstr_stts_dr_opin:'',
                    safe_ognz_spcabl_mttr:'',

                    filelist:[],
                }
            };
        },
        filter:{
            
        },
        mounted: function() {
            let vt = this;
            
            vt.userInfo = this.$store.state.global.userInfo,
            vt.uid = window.location.href.split('/').pop();
            vt.state = window.location.href.split('/').reverse()[1];
            let date = new Date();
            vt.today = (date.getFullYear()) 
                        + ((date.getMonth()+1)<10? "0" + (date.getMonth()+1) : date.getMonth()+1) 
                        + (date.getDate()<10? "0"+(date.getDate()) : date.getDate()) 
                        + (date.getHours<10? "0"+(date.getHours()) : date.getHours()) 
                        + (date.getMinutes<10? "0"+(date.getMinutes()) : date.getMinutes()) 
                        + (date.getSeconds<10? "0"+(date.getSeconds()) : date.getSeconds());
            if((vt.state == 'detail' || vt.state == 'update')&& vt.uid != null){
                if(vt.state == 'update'){
                    vt.state_k = '수정';
                }
                vt.fnInit(vt.uid);
            }
	    },
        activated:function(){
            this.fnInit();
        },
        deactivated:function(){
            this.$destroy();
        },
        methods: {
            fnInit:function(value){ //첨부파일 조회 추가 필요
                let vt = this;
                let h = 0;
                let data = {
                    acdnt_sn : value
                }
                Axios.post("/selectOursAcdtCsDetailList.do", data).then(function(response) {
                   
                    console.log(response.data);
                    
                    vt.viewModel = response.data.oursAcdtCsRptp;
                    vt.viewModel.dsstr_man = response.data.oursAcdtCsDsstrList;
                    vt.viewModel.filelist = [[],[],[],[],[],[],[],[],[]];
                    vt.viewModel.acdnt_dt = vt.viewModel.acdnt_dt.substring(0,10);
                    vt.viewModel.acdnt_sumry = vt.viewModel.acdnt_sumry.replaceAll(/(\n|\r\n)/g,'<br>');
                    
                    //서명 및 사진
                    if(vt.viewModel.pic_aprvr_path){ vt.viewModel.pic_approval = vt.viewModel.pic_aprvr_path.charAt() == '/' ? vt.viewModel.pic_aprvr_path : vt.viewModel.pic_aprvr_path.substr(2); }
                    if(vt.viewModel.mdtr_aprvr_path){ vt.viewModel.mdtr_approval = vt.viewModel.mdtr_aprvr_path.charAt() == '/' ? vt.viewModel.mdtr_aprvr_path : vt.viewModel.mdtr_aprvr_path.substr(2); }
                    if(vt.viewModel.dcsn_aprvr_path){ vt.viewModel.dcsn_approval = vt.viewModel.dcsn_aprvr_path.charAt() == '/' ? vt.viewModel.dcsn_aprvr_path : vt.viewModel.dcsn_aprvr_path.substr(2); }
                    if(vt.viewModel.pic_picture_path){ vt.viewModel.pic_picture = vt.viewModel.pic_picture_path.charAt() == '/' ? vt.viewModel.pic_picture_path : vt.viewModel.pic_picture_path.substr(2); }
                    if(vt.viewModel.mdtr_picture_path){  vt.viewModel.mdtr_picture = vt.viewModel.mdtr_picture_path.charAt() == '/' ? vt.viewModel.mdtr_picture_path : vt.viewModel.mdtr_picture_path.substr(2); }
                    if(vt.viewModel.dcsn_picture_path){ vt.viewModel.dcsn_picture = vt.viewModel.dcsn_picture_path.charAt() == '/' ? vt.viewModel.dcsn_picture_path : vt.viewModel.dcsn_picture_path.substr(2); }

                    for(let i=0; i<response.data.fileList.length; i++){
                        if(response.data.fileList[i] != null){
                            let se = (Number(response.data.fileList[i].se))-1;
                            
                            vt.viewModel.filelist[se][h] = response.data.fileList[i];
                            if(i+1 < response.data.fileList.length){
                                let nextSe = (Number(response.data.fileList[i+1].se))-1;
                                if(se == nextSe){ h = h+1; }
                                else if(se != nextSe){ h = 0; }
                            }
                        }
                    }
                    for(var i=0; i<vt.viewModel.dsstr_man.length; i++ ){
                        vt.viewModel.dsstr_man[i].dsstr_man_emplym_dt = (Common.fnDateTimeStr(vt.viewModel.dsstr_man[i].dsstr_man_emplym_dt));
                        vt.viewModel.dsstr_man[i].dsstr_man_day_salary = (vt.viewModel.dsstr_man[i].dsstr_man_day_salary).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                        vt.viewModel.dsstr_man[i].dsstr_stts_mtrl_dmge_dmage_amt = (vt.viewModel.dsstr_man[i].dsstr_stts_mtrl_dmge_dmage_amt).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                        vt.fnDataMask(vt.viewModel.dsstr_man[i].dsstr_man_emplym_dt, i);
                    }
                }).catch(function(ex) {
                    console.log(ex);
                });;
            },
            fnDataMask:function(value, i){
                console.log(value+" "+i);
                let vm = this.viewModel;
                let inputDate = value.replaceAll('-','');
                let d_mask = value;

                if(inputDate.length>4 && inputDate.length<=6){
                    d_mask = null;
                    d_mask = inputDate.substring(0,4);
                    d_mask += '-';
                    d_mask += inputDate.substring(4,6);
                }else if(inputDate.length>6 && inputDate.length<=8){
                    d_mask = null;
                    d_mask = inputDate.substring(0,4);
                    d_mask += '-';
                    d_mask += inputDate.substring(4,6);
                    d_mask += '-';
                    d_mask += inputDate.substring(6);
                } 
                vm.dsstr_man[i].dsstr_man_emplym_dt = d_mask;
            },
            // fnDsstrAdd:function(){
            //     let vt = this;
            //     let vm = this.viewModel;
            //     let dml = vm.dsstr_man.length;
            //     let val = {dsstr_man_nm:' ', DSSTR_INDEX : vt.tIndex++, DSSTR_BLEAN : false}
            //     let obj = document.getElementsByName("cd");
                
            //     // vt.fnCheckDsstr(p);
            //     vm.dsstr_man.push(val);
            //     console.log(vm.dsstr_man.length);
                
            //     // obj[dml-1].checked = false;
            //     if(vt.state != 'update'){
            //         for(var i=0; i<dml; i++){
            //             obj[i].checked = false;+
            //             console.log(i+" : " +obj[i].checked);
            //         }
            //         console.log(obj);
            //     }if(vt.state == 'update'){
            //         vt.$forceUpdate(); 
            //     }
            // },
            fnDsstrSub:function(index){
                let vt = this;
                let vm = this.viewModel;
                let p = null;
                if(vm.dsstr_man.length == 0){
                    return false;
                }if(vm.dsstr_man.length > 1){
                    let obj = document.getElementsByName("cd");
                    for(var i=0; i<obj.length; i++){
                        if(obj[i].checked == true){
                            vm.dsstr_man.splice(i ,1);
                        }
                        console.log(obj[i].checked);
                    }
                    vt.fnCheckDsstr(p);
                }
            },
            fnCheckDsstr:function(param){
                let vt = this;
                // let obj = document.getElementsByName("cd");
                console.log("param");
                console.log(param);
                if(param != null & param != undefined)
                {
                    vt.viewModel.dsstr_man.forEach(item => {
                        item.DSSTR_BLEAN = false;
                    })

                    param.DSSTR_BLEAN = true;
                }
                vt.$forceUpdate(); 
                // for(var i=0; i<obj.length; i++){
                //     if(i != param){
                //         obj[i].checked = false;
                //     }
                //     console.log(obj[i].checked);
                // }
            },
            fnSignPop(value){
                let vt = this;
                if(value=='DCSN'){
                    if(vt.viewModel.mdtr_id != null && vt.viewModel.mdtr_atrz_yn != 'Y'){
                        alert("조정자 결재가 완료되지 않았습니다.")
                        return false;
                    }
                }
                vt.signPop = true;
                vt.signPopSort = value;
            },
            fnSignApproval(value){
                let vt = this;
                if(value == 'MDTR'){
                    if(vt.viewModel.mdtr_id == vt.userInfo.user_id){
                        if(confirm("조정자 결재를 진행하시겠습니까?")){
                            Axios.post("/updateOursAcdtCsSign.do", { acdnt_sn : vt.uid, mdtr_atrz_yn:'Y', dcsn_atrz_yn:'N' }).then(function(response) {
                            });
                            vt.sendPushNotification(vt.viewModel.dcsn_id,"우리사고 이력 관리","조정자 결재가 완료되었습니다. PC에서 확인해 주세요.");
                            alert("조정자 결재가 완료되었습니다.");
                        }
                    }else{
                        alert("현재 계정은 설정된 조정자 계정이 아닙니다.");
                        return false;
                    }
                   
                }if(value == 'DCSN'){
                    if(vt.viewModel.dcsn_id == vt.userInfo.user_id){
                        if(confirm("결재자 결재를 진행하시겠습니까?")){
                            Axios.post("/updateOursAcdtCsSign.do", { acdnt_sn : vt.uid, dcsn_atrz_yn:'Y' }).then(function(response) {});
                            let senduser = "";
                            senduser = vt.viewModel.pic_id;
                            if(vt.viewModel.mdtr_id != "" && vt.viewModel.mdtr_id != null) senduser = vt.viewModel.mdtr_id+ "," + vt.viewModel.pic_id;
                            vt.sendPushNotification(senduser,"우리사고 이력 관리","우리 사고 이력 관리 내역이 결재 종결되었습니다. PC에서 확인해 주세요.");
                            alert("결재자 결재가 완료되었습니다.");
                        }
                    }else{
                        alert("현재 계정은 설정된 결재자 계정이 아닙니다.");
                        return false;
                    }
                    
                }
                vt.signPop = false;
                // vt.fnInit(vt.uid);
                window.history.go(0);
            },
            fnSignReturn(value){
                let vt = this;
                if(value == 'MDTR'){
                    if(vt.viewModel.mdtr_id == vt.userInfo.user_id){
                        if(confirm("조정자 반려를 진행하시겠습니까?")){
                            Axios.post("/updateOursAcdtCsSign.do", { acdnt_sn : vt.uid, mdtr_atrz_yn:'R', dcsn_atrz_yn:'N' }).then(function(response) {
                            });
                            vt.sendPushNotification(vt.viewModel.pic_id,"우리사고 이력 관리","조정자에 의해 반려되었습니다. PC에서 확인해 주세요.");
                            alert("조정자 반려가 완료되었습니다.");
                        }
                    }else{
                        alert("현재 계정은 설정된 조정자 계정이 아닙니다.");
                        return false;
                    }
                    
                }if(value == 'DCSN'){
                    if(vt.viewModel.dcsn_id == vt.userInfo.user_id){
                        if(confirm("결재자 반려를 진행하시겠습니까?")){
                            Axios.post("/updateOursAcdtCsSign.do", { acdnt_sn : vt.uid, dcsn_atrz_yn:'R' }).then(function(response) {
                            });
                            let senduser = "";
                            senduser = vt.viewModel.pic_id;
                            if(vt.viewModel.mdtr_id != "" && vt.viewModel.mdtr_id != null) senduser = vt.viewModel.mdtr_id+ "," + vt.viewModel.pic_id;
                            vt.sendPushNotification(senduser,"우리사고 이력 관리","결정자에 의해 반려되었습니다. PC에서 확인해 주세요.");
                            alert("결재자 반려가 완료되었습니다.");
                        }
                    }else{
                        alert("현재 계정은 설정된 결재자 계정이 아닙니다.");
                        return false;
                    }
                    
                }
                vt.signPop = false;
                // vt.fnInit(vt.uid);
                window.history.go(0);
            },
            fnFileDown:function(item, type){//type : 1=file, 2=img
                let vt = this;
                let send = {
                    se: type,
                    sn: vt.uid,
                    file_sn: item.file_sn,
                    gbn:'oursAcdtCsRptp'
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
            sendPushNotification(user_id, title, message) {
                $.ajax({
                    type: "post",
                    url:"/api/pushSendPerson.do",
                    data:{
                        // 제목 및 내용
                        title : title,
                        message :  message,
                        user_id : user_id,
                        // 클릭 시 이동 화면주소
                        link : "/main/index.do"
                    }
                });
            },
	    } 
    };
</script>