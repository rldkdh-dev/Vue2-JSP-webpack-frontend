<template>
    <div>
        <div class="contents">
            <div class="divide">
                <div>
                    <h3>기본정보</h3>
                    <table class="table horizontal write">
                        <caption>목표추진계획, 평가기준 등록</caption>
                        <tbody>
                            <tr>
                                <th scope="row" class="essential"><label for="bplc">현장명</label></th>
                                <td colspan="3">
                                    <div class="input_group input_btn">
                                        <input type="text" id="bplc_nm" v-model="viewModel.data.bplc_nm" readonly @click="viewModel.userInfo.bplc_yn !='Y' ? fnPopup() : ''">
                                        <input type="hidden" id="bplc" v-model="viewModel.data.bplc_sn">
                                        <label :for="'bplc_nm'" v-if="viewModel.userInfo.bplc_yn !='Y'"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-search"></use></svg></label>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <!-- <th scope="row"><label for="doc_no">문서번호</label></th>
                                <td><input type="text" :id="'doc_no'" v-model="viewModel.data.doc_no"></td> -->
                                <th scope="row" class="essential"><label>제 &middot; 개정일</label></th>
                                <td>
                                    <div class="datepicker_box" >
                                        <input type="text" class="datepicker" id="date" placeholder="날짜" title="제개정일" readonly>
                                    </div>
                                </td>
                                <th scope="row" class="essential"><label for="rvsn_no">개정번호</label></th>
                                <td>
                                    {{ viewModel.data.prtn_plan_sn != undefined ? viewModel.data.rvsn_no : '자동생성' }}
                                </td>
                            </tr>
                            <tr>
                                <th scope="row"><label>첨부</label></th>
                                <td colspan="3">
                                    <fileform @filelist="fnFilelist"  @fileDelete="fnFileDelete" :pass="{id:'sc'}" ref="files"></fileform>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="approval">
                    <h3>결재 정보</h3>
                    <ul>
                        <li class="signed">
                            <a href="javascript:;">
                                <p class="essential">작성자</p>
                                <div class="user_img" id="1">
                                    <img :src="viewModel.data.wrtr_sign" v-bind:style="viewModel.data.wrtr_sign_yn != 'Y' ? 'display: none;' : ''">
                                </div>
                                <span>{{ viewModel.data.wrtr_nm == "" ? "작성자 등록":viewModel.data.wrtr_nm }}</span>
                            </a>
                        </li>
                        <li :class="[viewModel.data.mdtr != '' && viewModel.data.mdtr != null && viewModel.data.mdtr_sign_yn != 'Y' ? 'set' : viewModel.data.mdtr && viewModel.data.mdtr_sign_yn=='Y' ? 'signed' : null]" @click="fnAprvrpopup('mdtr')">
                            <a href="javascript:;">
                                <p>검토자</p>
                                <div class="user_img" id="">
                                    <img :src="viewModel.data.mdtr_sign" v-bind:style="viewModel.data.mdtr_sign_yn != 'Y' ? 'display: none;' : ''">
                                </div>
                                <span>{{ (viewModel.data.mdtr_nm == "" || viewModel.data.mdtr_nm == null) ? "검토자 등록":viewModel.data.mdtr_nm }}</span>
                            </a>
                        </li>
                        <li :class="[viewModel.data.dcsnr != '' && viewModel.data.dcsnr != null && viewModel.data.dcsnr_sign_yn != 'Y' ? 'set' : viewModel.data.dcsnr != '' && viewModel.data.dcsnr_sign_yn=='Y' ? 'signed' : null]"  @click="fnAprvrpopup('dcsnr')">
                            <a href="javascript:;">
                                <p class="essential">현장소장</p>
                                <div class="user_img" id="3">
                                    <img :src="viewModel.data.dcsnr_sign" v-bind:style="viewModel.data.dcsnr_sign_yn != 'Y' ? 'display: none;' : ''">
                                </div>
                                <span>{{ (viewModel.data.dcsnr_nm == "" || viewModel.data.dcsnr_nm == null) ? "현장소장 등록":viewModel.data.dcsnr_nm }}</span>
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="write_area">
                <h3>안전보건목표 추진계획서</h3>
                <div class="table_top btn-right write_area">
                    <button @click.prevent="fnAddActpln()" class="btn btn-light-purple"><svg class="icon"><use xlink:href="/img/symbol-defs.svg#icon-wrap-text"></use></svg>목표추가</button>
                    <button @click.prevent="fnDelActpln()" class="btn btn-gray"><svg class="icon"><use xlink:href="/img/symbol-defs.svg#icon-trash-can"></use></svg>삭제</button>
                </div>
                <table class="table write">
                    <caption>안전보건목표 추진계획서 등록</caption>
                    <colgroup>
                        <col width="5%"/>
                        <col width="15%"/>
                        <col width="20%"/>
                        <col width="20%"/>
                        <col width="1.5%"/>
                        <col width="1.5%"/>
                        <col width="1.5%"/>
                        <col width="1.5%"/>
                        <col width="10%"/>
                        <col width="20%"/>
                        <col width="4%"/>
                    </colgroup>
                    <thead>
                        <tr>
                            <th scope="colgroup" rowspan="2" class="ws-nw">
                                <!-- <input type="checkbox" title="선택" v-model="allActplnSelected"><label for="">선택</label> -->
                            </th>
                            <th scope="colgroup" rowspan="2" class="essential">안전보건목표</th>
                            <th scope="col" colspan="2">세부추진계획</th>
                            <th scope="col" colspan="4">추진일정</th>
                            <th scope="col" rowspan="2" class="essential">실행담당자</th>
                            <th scope="col" rowspan="2">비고</th>
                            <th scope="col" rowspan="2">관리</th>
                        </tr>
                        <tr>
                            <th scope="col" class="essential">활동내용</th>
                            <th scope="col" class="w150 essential">시기/횟수</th>
                            <th scope="col">1/4</th>
                            <th scope="col">2/4</th>
                            <th scope="col">3/4</th>
                            <th scope="col">4/4</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, i) in viewModel.actplnList" :key="i">
                            <template v-if="item.row1 == 'Y'">
                                <td :rowspan="item.row1_cnt">
                                    <input type="checkbox" :name="'cbx'" :id="'actpln_check'+i" :value="item.prtn_actpln_sn" v-model="viewModel.selActplnList" title="선택">
                                </td>
                                <td :rowspan="item.row1_cnt" class="align-center">
                                    <textarea title="안전보건목표 입력" @input="item.safe_helth_goal = $event.target.value; fnInput(item.prtn_actpln_sn, i);" v-model="item.safe_helth_goal" rows="4" :id="'safe_helth_goal_'+i"></textarea>
                                </td>
                            </template>
                            <td>
                                <textarea title="활동내용 입력" v-model="item.act_cn" rows="4" :id="'act_cn_'+i"></textarea>
                            </td>
                            <td>
                                <textarea title="시기횟수 입력" v-model="item.era_nmtm" rows="4" :id="'era_nmtm_'+i"></textarea>
                            </td>
                            <td><input type="checkbox" title="선택" v-model="item.prtn_schdl_1_4" true-value="Y" false-value="N" :id="i+'_prtn_schdl_1_4'"></td>
                            <td><input type="checkbox" title="선택" v-model="item.prtn_schdl_2_4" true-value="Y" false-value="N" :id="i+'_prtn_schdl_2_4'"></td>
                            <td><input type="checkbox" title="선택" v-model="item.prtn_schdl_3_4" true-value="Y" false-value="N" :id="i+'_prtn_schdl_3_4'"></td>
                            <td><input type="checkbox" title="선택" v-model="item.prtn_schdl_4_4" true-value="Y" false-value="N" :id="i+'_prtn_schdl_4_4'"></td>
                            <td>
                                <div class="input_group input_btn">
                                    <input type="text" :id="'excn_pic'+i" :value="item.excn_pic_nm" readonly @click="fnUserPopup(i);">
                                    <label :for="'excn_pic'+i" ><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-search"></use></svg></label>
                                </div>
                            </td>
                            <td>
                                <textarea title="비고" v-model="item.actpln_rmrk" rows="4"></textarea>
                            </td>
                            <td>
                                <div class="icon_box">
                                    <button class="btn btn-icon" @click.prevent="fnItemAdd(item.prtn_actpln_sn, item.evl_crtr_sn, i)"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-add-circle"></use></svg></button>
                                    <button class="btn btn-icon" @click.prevent="fnItemDel(item.prtn_actpln_sn, item.evl_crtr_sn, i)"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-circle-minus"></use></svg></button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="write_area">
                <h3>안전보건목표 평가기준</h3>
                <table class="table write">
                    <caption>안전보건목표 평가기준 등록</caption>
                    <colgroup>
                        <col width="3%"/>
                        <col width="12%"/>
                        <col width="15%"/>
                        <col width="5%"/>
                        <col width="*"/>
                        <col width="*"/>
                        <col width="*"/>
                        <col width="*"/>
                        <col width="*"/>
                        <col width="*"/>
                    </colgroup>
                    <thead>
                        <tr>
                            <th scope="colgroup" class="ws-nw" rowspan="2">
                                <!-- <input type="checkbox" title="선택" v-model="allActplnSelected"><label for="">선택</label> -->
                            </th>
                            <th scope="colgroup" rowspan="2" class="essential">안전보건목표</th>
                            <th scope="col" rowspan="2" class="essential">세부추진계획</th>
                            <th scope="col" rowspan="2">반기구분</th>
                            <th scope="col" colspan="5">평가기준</th>
                            <th scope="col" rowspan="2">비고</th>
                        </tr>
                        <tr>
                            <th scope="col" class="essential">S</th>
                            <th scope="col" class="essential">A</th>
                            <th scope="col" class="essential">B</th>
                            <th scope="col" class="essential">C</th>
                            <th scope="col" class="essential">D</th>
                        </tr>
                    </thead>
                    <tbody>
                        <template v-for="(item, i) in viewModel.actplnList" :key="i">
                            <tr>
                                <template v-if="item.row1 == 'Y'">
                                    <td :rowspan="item.row1_cnt * 2">
                                        <input type="checkbox" :id="'actpln_check'+i" :value="item.prtn_actpln_sn" v-model="viewModel.selActplnList" title="선택">
                                    </td>
                                    <td :rowspan="item.row1_cnt * 2" class="align-center">
                                        <textarea title="안전보건목표 입력" v-model="item.safe_helth_goal" disabled rows="4"></textarea>
                                    </td>
                                </template>
                                <td rowspan="2">
                                    <textarea title="세부추진계획 입력" v-model="item.act_cn" disabled rows="4"></textarea>
                                </td>
                                <td>상반기</td>
                                <td>
                                    <textarea title="S" v-model="item.frhfyr_evl_crtr_s" rows="4" :id="'frhfyr_evl_crtr_s_'+i"></textarea>
                                </td>
                                <td>
                                    <textarea title="A" v-model="item.frhfyr_evl_crtr_a" rows="4" :id="'frhfyr_evl_crtr_a_'+i"></textarea>
                                </td>
                                <td>
                                    <textarea title="B" v-model="item.frhfyr_evl_crtr_b" rows="4" :id="'frhfyr_evl_crtr_b_'+i"></textarea>
                                </td>
                                <td>
                                    <textarea title="C" v-model="item.frhfyr_evl_crtr_c" rows="4" :id="'frhfyr_evl_crtr_c_'+i"></textarea>
                                </td>
                                <td>
                                    <textarea title="D" v-model="item.frhfyr_evl_crtr_d" rows="4" :id="'frhfyr_evl_crtr_d_'+i"></textarea>
                                </td>
                                <td>
                                    <textarea title="비고" v-model="item.frhfyr_evl_crtr_rmrk" rows="4"></textarea>
                                </td>
                            </tr>
                            <tr>
                                <td>하반기</td>
                                <td>
                                    <textarea title="S" v-model="item.shyy_evl_crtr_s" rows="4" :id="'shyy_evl_crtr_s_'+i"></textarea>
                                </td>
                                <td>
                                    <textarea title="A" v-model="item.shyy_evl_crtr_a" rows="4" :id="'shyy_evl_crtr_a_'+i"></textarea>
                                </td>
                                <td>
                                    <textarea title="B" v-model="item.shyy_evl_crtr_b" rows="4" :id="'shyy_evl_crtr_b_'+i"></textarea>
                                </td>
                                <td>
                                    <textarea title="C" v-model="item.shyy_evl_crtr_c" rows="4" :id="'shyy_evl_crtr_c_'+i"></textarea>
                                </td>
                                <td>
                                    <textarea title="D" v-model="item.shyy_evl_crtr_d" rows="4" :id="'shyy_evl_crtr_d_'+i"></textarea>
                                </td>
                                <td>
                                    <textarea title="비고" v-model="item.shyy_evl_crtr_rmrk" rows="4"></textarea>
                                </td>
                            </tr>
                        </template>
                    </tbody>
                </table>
                <div class="table_footer btn-right">
                    <button @click.prevent="fnSave();" class="btn btn-purple"><svg class="icon"><use xlink:href="/img/symbol-defs.svg#icon-post-add"></use></svg>등록</button>
                    <router-link :to="'/'" class="btn btn-white"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-list-back"></use></svg>목록</router-link>
                </div>
            </div>
        </div>
        <user ref="user" v-if="userPop==true" :pass="{dept_sn: viewModel.userInfo.dept_sn, team_sn: viewModel.userInfo.team_sn, title:'실행담당자', multi:'Y', bplc_yn:'Y', bplc_sn: viewModel.data.bplc_sn, ocpt_detail_cd:1}"></user>
        <bplc ref="bplc" v-if="bplcPop==true" :pass="{dept_sn: viewModel.userInfo.dept_sn, team_sn: viewModel.userInfo.team_sn}"></bplc>

        <user ref="aprvr" v-if="aprvrPop==true" :pass="{dept_sn: viewModel.userInfo.dept_sn, team_sn: viewModel.userInfo.team_sn, title:'결재자', bplc_yn:'Y', bplc_sn: viewModel.data.bplc_sn, ocpt_detail_cd:1}"></user>
    </div>
</template>

<script>
    import "es6-promise/auto";
    import Vue from "vue";
    import Axios from "axios";
    import fileform from "../../../../common/vue/fileform2.vue";
    import Message, {messageUtil} from "../../../../common/js/message";
    import fromValidation from "../../../../common/js/fromValidation";
    import bplc from "../../popup/bplc_popup.vue";
    import user from "../../popup/user_popup.vue";

    export default {
        components: {
            'fileform': fileform,
            'bplc' : bplc,
            'user' : user,
        },
        computed: {
            allActplnSelected: {
                //getter
                get: function() {
                    return this.viewModel.actplnList.length > 0 && this.viewModel.actplnList.length === this.viewModel.selActplnList.length;
                },
                //setter
                set: function(e) {
                    this.viewModel.selActplnList = e ? this.viewModel.actplnList : [];
                },
            },
        },
        data: function() {
            return {
                bplcPop:false,
                userPop:false,
                aprvrPop:false,
                popIndex: '',
                AprvrGbn:'',
                viewModel:{
                    data:{
                        wrtr:'',
                        wrtr_nm:'',
                        wrtr_sign:'',
                        mdtr:'',
                        mdtr_nm:'',
                        dcsnr:'',
                        dcsnr_nm:'',
                    },
                    userInfo:{},
                    filelist:[],
                    deletefileList: [],
                    //추진계획서 리스트
                    actplnList:[{
                        prtn_actpln_sn:1,
                        evl_crtr_sn:1,
                        row1:'Y',
                        row1_cnt:1,
                    }],
                    selActplnList:[],
                },
                mode: '',
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
            fnInit:function(){
                let vm = this;
                vm.viewModel.userInfo = vm.$store.state.global.userInfo;

                let sn = vm.$route.params.sn;
                
                if(sn != undefined){
                    vm.mode='update';
                    vm.fnDetail(sn);
                }else{
                    // //현장코드 있을 경우 그 값으로 세팅
                    vm.viewModel.data.bplc_sn = vm.viewModel.userInfo.bplc_sn == 0 ? '' : vm.viewModel.userInfo.bplc_sn;
                    vm.viewModel.data.bplc_nm = vm.viewModel.userInfo.bplc_sn == 0 ? '' : vm.viewModel.userInfo.bplc_nm;

                    vm.fnPreInfo();
                }

                //날짜
                calendarInput();
            },
            fnPreInfo: function(){
                let vm = this;

                let data = {
                    bplc_sn: vm.viewModel.data.bplc_sn
                }

                Axios.post("/selectGPlEvltPreInfo.do", data)
                .then(function(response) {
                    vm.mode = 'write';
                    if(response.data.sn == null){   
                        //초기화
                        $("#date").val("");
                        vm.viewModel.filelist = [];
                        vm.viewModel.actplnList = [{prtn_actpln_sn:1,evl_crtr_sn:1,row1:'Y',row1_cnt:1,}];
                        vm.viewModel.selActplnList = [];

                        vm.viewModel.data.wrtr = vm.$store.state.global.userInfo.user_id;
                        vm.viewModel.data.wrtr_nm = vm.$store.state.global.userInfo.user_name;
                        // vm.viewModel.data.wrtr_sign = vm.$store.state.global.userInfo.aprvr_path.charAt() == '/' ? vm.$store.state.global.userInfo.aprvr_path : vm.$store.state.global.userInfo.aprvr_path.substr(2);

                        if(vm.$store.state.global.userInfo.mng_user_id != null){
                            vm.viewModel.data.dcsnr = vm.$store.state.global.userInfo.mng_user_id;
                            vm.viewModel.data.dcsnr_nm = vm.$store.state.global.userInfo.mng_user_nm;
                        }else{
                            vm.viewModel.data.mdtr = '';   
                            vm.viewModel.data.mdtr_nm = '';
                        }

                        vm.$refs.files.fnFileLoadList(vm.viewModel.filelist);
                    }else{
                        vm.fnDetail(response.data.sn.prtn_plan_sn);
                    }
                    
                });
            },
            fnDetail: function(sn){
                let vm = this;
                
                let data = {
                    prtn_plan_sn: sn,
                    gbn:vm.mode,
                }
                Axios.post("/selectGPlEvltDetail.do", data)
                .then(function(response) {
                    vm.viewModel.data = response.data.detail;
                    vm.viewModel.actplnList = response.data.list;
                    vm.viewModel.filelist = response.data.fileList;

                    //제,개정일 세팅
                    $("#date").val(vm.viewModel.data.estbsh_day_rvsn_day);
                    vm.viewModel.data.wrtr_sign = vm.viewModel.data.wrtr_sign.charAt() == '/' ? vm.viewModel.data.wrtr_sign : vm.viewModel.data.wrtr_sign.substr(2);
                    vm.viewModel.data.mdtr_sign = vm.viewModel.data.mdtr_sign.charAt() == '/' ? vm.viewModel.data.mdtr_sign : vm.viewModel.data.mdtr_sign.substr(2);
                    vm.viewModel.data.dcsnr_sign = vm.viewModel.data.dcsnr_sign.charAt() == '/' ? vm.viewModel.data.dcsnr_sign : vm.viewModel.data.dcsnr_sign.substr(2);

                    vm.$refs.files.fnFileLoadList(vm.viewModel.filelist);
                }).then(function(){
                    if(vm.mode == 'write'){
                        vm.viewModel.data.wrtr_sign_yn = 'N';
                        vm.viewModel.data.dcsnr_sign_yn = 'N';
                        vm.viewModel.data.mdtr_sign_yn = 'N';
                        vm.viewModel.data.org_prtn_plan_sn = vm.viewModel.data.prtn_plan_sn;
                        vm.viewModel.data.prtn_plan_sn = undefined;

                        vm.viewModel.data.wrtr = vm.$store.state.global.userInfo.user_id;
                        vm.viewModel.data.wrtr_nm = vm.$store.state.global.userInfo.user_name;
                        // vm.viewModel.data.wrtr_sign = vm.$store.state.global.userInfo.aprvr_path.charAt() == '/' ? vm.$store.state.global.userInfo.aprvr_path : vm.$store.state.global.userInfo.aprvr_path.substr(2);
                    }
                });
            },
            fnSave:function(){
                let vm = this;

                let frm = new FormData();

                for(let i=0; i<vm.viewModel.filelist.length; i++) {
                    let key = vm.viewModel.filelist[i].file_prtn_actpln_sn;
                    if(vm.viewModel.filelist[i].file != null) {
                        frm.append("fileTitle", vm.viewModel.filelist[i].file_title);
                        frm.append("uploadFiles", vm.viewModel.filelist[i].file);
                        if(vm.viewModel.filelist[i].file_sn){
                            frm.append("deleteFiles", vm.viewModel.filelist[i].file_sn);
                        }
                        frm.append("key", 0)
                    } else {
                        if(vm.viewModel.filelist[i].file == undefined){
                            if(vm.viewModel.filelist[i].file_sn != undefined){
                                frm.append("re_sn", vm.viewModel.filelist[i].file_sn);
                            }
                        }else{
                            // frm.append("fileTitle", vm.viewModel.filelist[i].file_title);
                            // frm.append("key", key)
                        }
                    }
                }
                for(let i=0; i<vm.viewModel.deletefileList.length; i++){
                    frm.append("deleteFiles", vm.viewModel.deletefileList[i]);
                }

                vm.fnRealSave(frm);
            },
            fnRealSave: function(frm){
                let vm = this;
                const valiData = [
                    {id: 'bplc_nm', type: 'select', title: '현장명'},
                    // {id: 'doc_no', type: 'input', title: '문서번호'},
                    {id: 'date', type: 'select', title: '제 · 개정일'},
                    // {id: 'rvsn_no', type: 'input', title: '개정번호'},
                ];

                if(!fromValidation(valiData)){
                    return false;
                }

                if(vm.viewModel.data.dcsnr_nm == ''){
                    alert(messageUtil(Message.VALIDATION_REQUIRED, ['결재자 소장']))
                    return false;
                }

                if(vm.viewModel.actplnList.length > 0){
                    for(let i = 0; i<vm.viewModel.actplnList.length; i++){
                        let item = vm.viewModel.actplnList[i];

                        if(item.safe_helth_goal == '' || item.safe_helth_goal == undefined){
                            alert(messageUtil(Message.VALIDATION_REQUIRED, ['안전보건목표']))
                            $("#safe_helth_goal_"+i).focus();
                            return false;
                        }else if(item.act_cn == '' || item.act_cn == undefined){
                            alert(messageUtil(Message.VALIDATION_REQUIRED, ['활동내용']))
                            $("#act_cn_"+i).focus();
                            return false;
                        }else if(item.era_nmtm == '' || item.era_nmtm == undefined){
                            alert(messageUtil(Message.VALIDATION_REQUIRED, ['시기횟수']))
                            $("#era_nmtm_"+i).focus();
                            return false;
                        }else if(item.excn_pic_nm == '' || item.excn_pic_nm == undefined){
                            alert(messageUtil(Message.VALIDATION_REQUIRED, ['실행담당자']))
                            $("#excn_pic_nm_"+i).focus();
                            return false;
                        }else if(item.frhfyr_evl_crtr_s == '' || item.frhfyr_evl_crtr_s == undefined){
                            alert(messageUtil(Message.VALIDATION_REQUIRED, ['평가기준-S']))
                            $("#frhfyr_evl_crtr_s_"+i).focus();
                            return false;
                        }else if(item.frhfyr_evl_crtr_a == '' || item.frhfyr_evl_crtr_a == undefined){
                            alert(messageUtil(Message.VALIDATION_REQUIRED, ['평가기준-A']))
                            $("#frhfyr_evl_crtr_a_"+i).focus();
                            return false;
                        }else if(item.frhfyr_evl_crtr_b == '' || item.frhfyr_evl_crtr_b == undefined){
                            alert(messageUtil(Message.VALIDATION_REQUIRED, ['평가기준-B']))
                            $("#frhfyr_evl_crtr_b_"+i).focus();
                            return false;
                        }else if(item.frhfyr_evl_crtr_c == '' || item.frhfyr_evl_crtr_c == undefined){
                            alert(messageUtil(Message.VALIDATION_REQUIRED, ['평가기준-C']))
                            $("#frhfyr_evl_crtr_c_"+i).focus();
                            return false;
                        }else if(item.frhfyr_evl_crtr_d == '' || item.frhfyr_evl_crtr_d == undefined){
                            alert(messageUtil(Message.VALIDATION_REQUIRED, ['평가기준-D']))
                            $("#frhfyr_evl_crtr_d_"+i).focus();
                            return false;
                        }else if(item.shyy_evl_crtr_s == '' || item.shyy_evl_crtr_s == undefined){
                            alert(messageUtil(Message.VALIDATION_REQUIRED, ['평가기준-S']))
                            $("#shyy_evl_crtr_s_"+i).focus();
                            return false;
                        }else if(item.shyy_evl_crtr_a == '' || item.shyy_evl_crtr_a == undefined){
                            alert(messageUtil(Message.VALIDATION_REQUIRED, ['평가기준-A']))
                            $("#shyy_evl_crtr_a_"+i).focus();
                            return false;
                        }else if(item.shyy_evl_crtr_b == '' || item.shyy_evl_crtr_b == undefined){
                            alert(messageUtil(Message.VALIDATION_REQUIRED, ['평가기준-B']))
                            $("#shyy_evl_crtr_b_"+i).focus();
                            return false;
                        }else if(item.shyy_evl_crtr_c == '' || item.shyy_evl_crtr_c == undefined){
                            alert(messageUtil(Message.VALIDATION_REQUIRED, ['평가기준-C']))
                            $("#shyy_evl_crtr_c_"+i).focus();
                            return false;
                        }else if(item.shyy_evl_crtr_d == '' || item.shyy_evl_crtr_d == undefined){
                            alert(messageUtil(Message.VALIDATION_REQUIRED, ['평가기준-D']))
                            $("#shyy_evl_crtr_d_"+i).focus();
                            return false;
                        }
                    }
                }else{
                    alert("안전보건목표 추진계획서를 등록해주세요.");
                    return false;
                }

                let data = {
                    reg_id: vm.viewModel.userInfo.user_id,
                    bplc_sn: vm.viewModel.data.bplc_sn,
                    doc_no: vm.viewModel.data.doc_no,
                    estbsh_day_rvsn_day: $("#date").val(),
                    rvsn_no: vm.viewModel.data.rvsn_no,
                    wrtr: vm.viewModel.data.wrtr,
                    wrtr_sign_yn: vm.viewModel.data.mdtr_sign_yn,
                    mdtr: vm.viewModel.data.mdtr,
                    mdtr_sign_yn: vm.viewModel.data.mdtr_sign_yn,
                    dcsnr: vm.viewModel.data.dcsnr,
                    dcsnr_sign_yn: vm.viewModel.data.dcsnr_sign_yn,
                    list: vm.viewModel.actplnList,
                    org_prtn_plan_sn: vm.viewModel.data.org_prtn_plan_sn,
                    prtn_plan_sn: vm.viewModel.data.prtn_plan_sn,
                };

                frm.append('data', new Blob([ JSON.stringify(data) ], {type : "application/json"}));
                frm.append("filePath", "gPlEvlt");

                if(vm.viewModel.data.prtn_plan_sn == undefined){
                    if(confirm(Message.CREATE_CONFIRM)){
                        $(".loading").show();
                        $("#mask").show();
                        Axios.post("/insertGPlEvlt.do", frm).then(function(response) {
                            if(response.data == 1){
                                vm.isSaved = true;
                                vm.$router.push('/');
                                alert("저장되었습니다.");
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
                }else{
                    if(confirm(Message.UPDATE_CONFIRM)){
                        $(".loading").show();
                        $("#mask").show();
                        Axios.post("/updateGPlEvlt.do", frm).then(function(response) {
                            if(response.data == 1){
                                vm.isSaved = true;
                                vm.$router.push('/');
                                alert("저장되었습니다.");
                            }else if(response.data == 999){
                                alert("결정자가 결재를 완료하여 수정이 불가합니다.");
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
                }
            },
            fnFilelist:function(vm){
                this.viewModel.filelist = vm.filelist;
                this.viewModel.fileGroup = vm.fileGroup;
            },
            fnPopup: function(){
                let vm = this;
				vm.bplcPop=true;
                vm.userPop=false;
                vm.aprvrPop=false;

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

                vm.fnPreInfo();
            },
            fnFilelist:function(vm){
                this.viewModel.filelist = vm.filelist;
                this.viewModel.fileGroup = vm.fileGroup;
            },
            fnFileDelete: function(vm){
                this.viewModel.deletefileList = vm.deletefileList;
            },
            fnUserPopup: function(i) {
                let vm = this;
                vm.popIndex = i;
                
                if(vm.viewModel.data.bplc_sn == null || vm.viewModel.data.bplc_sn == ''){
                    alert("현장명을 선택해주세요.");
                    return false;
                }else{
                    vm.bplcPop=false;
                    vm.userPop=true;
                    vm.aprvrPop=false;

                    vm.$nextTick(function() {
                        if(vm.userPop) {
                            vm.$refs.user.fnInit();
                        }
                    })
                }
            },
            fnMultiMemberAdd: function(list){
                let vm = this;
                vm.userPop=false;

                let userNmStr = "";
                let userIdStr = "";
                for(let i=0; i<list.length; i++){
                    if(userNmStr == ""){
                        userNmStr = list[i].user_nm;
                        userIdStr = list[i].user_id;
                    }else{
                        userNmStr += "," + list[i].user_nm;
                        userIdStr += "," + list[i].user_id;
                    }
                }
                vm.viewModel.actplnList[vm.popIndex].excn_pic_nm = userNmStr;
                vm.viewModel.actplnList[vm.popIndex].excn_pic = userIdStr;

                vm.$set(vm.viewModel.actplnList, Number(vm.popIndex), vm.viewModel.actplnList[Number(vm.popIndex)]);
            },
            fnAddActpln: function(){
                let vm = this;

                vm.viewModel.actplnList.push({prtn_actpln_sn:(vm.viewModel.actplnList[Number(vm.viewModel.actplnList.length)-1].prtn_actpln_sn) + 1,evl_crtr_sn:1, row1:'Y',row1_cnt:1,});
            },
            fnDelActpln: function(){
                let vm = this;
                
                if(vm.viewModel.selActplnList.length > 0 ){
                    for(let i=(vm.viewModel.selActplnList.length-1); i>=0; i--){
                        // let index = vm.viewModel.actplnList.findIndex(data => data.prtn_actpln_sn == vm.viewModel.selActplnList[i].prtn_actpln_sn);
                        
                        let prtn_actpln_sn = vm.viewModel.selActplnList[i];

                        for(let j=vm.viewModel.actplnList.length-1; j>=0; j--){
                            if(vm.viewModel.actplnList[j].prtn_actpln_sn == prtn_actpln_sn){
                                vm.viewModel.actplnList.splice(j, 1);
                            }

                        }

                        if(i == 0){
                            if(vm.viewModel.actplnList.length == 0){
                                vm.viewModel.actplnList.push({prtn_actpln_sn:1,evl_crtr_sn:1,row1:'Y',row1_cnt:1,});
                            }
                        }
                    }

                    //삭제 리스트 초기화
                    vm.viewModel.selActplnList = [];

                    
                }else{
                    alert("삭제할 추진계획서를 선택해주세요.");
                    return false;
                }
            },
            fnAprvrpopup: function(gbn){
                let vm = this;

                vm.AprvrGbn = gbn;      //어느 결재자 정보인지 담아두기.

                vm.bplcPop=false;
                vm.userPop=false;

                if(vm.viewModel.data.bplc_sn == '' || vm.viewModel.data.bplc_sn == undefined){
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
                })
                }
            },
            fnMemberAdd: function(item){
                let vm = this;

                if(vm.AprvrGbn == 'mdtr'){
                    vm.viewModel.data.mdtr = item.user_id;
                    vm.viewModel.data.mdtr_nm = item.user_nm;
                }else if(vm.AprvrGbn == 'dcsnr'){
                    vm.viewModel.data.dcsnr = item.user_id;
                    vm.viewModel.data.dcsnr_nm = item.user_nm;
                }

                //결재담당자 팝업 초기화
                vm.aprvrPop = false;
            },
            fnInput: function(id, index){
                let vm = this;

                let safe_helth_goal = vm.viewModel.actplnList[index].safe_helth_goal
                let len = vm.viewModel.actplnList.filter(data=> data.prtn_actpln_sn == id).length;

                if(len > 0){
                    for(let i=0; i<len; i++){
                        let item = vm.viewModel.actplnList.filter(data=> data.prtn_actpln_sn == id)[i];
    
                        item.safe_helth_goal = safe_helth_goal;
                    }
                }
            },
            fnItemAdd:function(sn, e_sn, index){
                let vm = this;

                let list = vm.viewModel.actplnList.filter(data=> data.prtn_actpln_sn == sn)[0]; 
                let safe_helth_goal = '';

                if(list.safe_helth_goal != ''){
                    safe_helth_goal = list.safe_helth_goal;
                }

                let val = {
                    prtn_actpln_sn: sn,
                    safe_helth_goal: safe_helth_goal,
                    evl_crtr_sn: (e_sn+1),
                    act_cn: '',
                    row1_cnt: (vm.viewModel.actplnList[index].row1_cnt + 1),
                }

                for(let i in vm.viewModel.actplnList){
                    let item = vm.viewModel.actplnList[i];

                    if(item.prtn_actpln_sn == sn){
                        vm.viewModel.actplnList[i].row1_cnt = (vm.viewModel.actplnList[i].row1_cnt + 1);

                        if(item.evl_crtr_sn > e_sn){
                            vm.viewModel.actplnList[i].evl_crtr_sn++;
                        }
                    }
                }

                vm.viewModel.actplnList.splice((index+1), 0, val);

            },
            fnItemDel:function(sn, e_sn, index){
                let vm = this;
                
                let list = vm.viewModel.actplnList.filter(data => data.prtn_actpln_sn == sn);
                
                for(let i in vm.viewModel.actplnList){
                    let item = vm.viewModel.actplnList[i];

                    if(item.prtn_actpln_sn == sn){
                        if(item.evl_crtr_sn > e_sn){
                            vm.viewModel.actplnList[i].evl_crtr_sn--;
                        }

                        vm.viewModel.actplnList[i].row1_cnt = (vm.viewModel.actplnList[i].row1_cnt - 1);
                    }                

                    if(list.length == 1){
                        if(item.prtn_actpln_sn > sn){
                            vm.viewModel.actplnList[i].prtn_actpln_sn--;
                        }
                    }
                }
                vm.viewModel.actplnList.splice(index, 1);

                if(vm.viewModel.actplnList.length == 0){
                    vm.viewModel.actplnList.push({prtn_actpln_sn:1,evl_crtr_sn:1,row1:'Y',row1_cnt:1,});
                }else{
                    //rowspan 해야할 항목 체크
                    for(let i in vm.viewModel.actplnList){
                        let item = vm.viewModel.actplnList[i];

                        if(item.evl_crtr_sn == 1){
                            vm.viewModel.actplnList[i].row1 = 'Y';
                        }else{
                            vm.viewModel.actplnList[i].row1 = 'N';
                        }
                    }
                }

            },
        }
    };
</script>