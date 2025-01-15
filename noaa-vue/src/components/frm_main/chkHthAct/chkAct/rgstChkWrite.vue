<template>
    <div>
        <div class="contents write">
            <div>
                <table class="table horizontal write">
                    <caption>점검활동 등록</caption>
                    <tbody>
                        <tr>
                            <th scope="row" class="w180 essential"><label for="">점검유형</label></th>
                            <td>
                                <ul class="input_wrap">
                                    <li v-for="(item, i) in viewModel.chkTypeList" :key="i">
                                        <label :for="'chck_clsf'+item.CODE">
                                            <input type="checkbox" :id="'chck_clsf'+item.CODE" v-model="viewModel.data.chck_clsf" :value="item.CODE" @change="fnChckTypeClick(item.CODE, $event)">{{ item.CODE_NM }}
                                         </label>
                                    </li>
                                </ul>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row" class="essential"><label for="bplc">현장명</label></th>
                            <td>
                                <div class="input_group input_btn">
                                    <input type="text" id="bplc_nm" v-model="viewModel.data.bplc_nm" readonly @click="viewModel.userInfo.bplc_yn !='Y' ? fnBplcPopup() : ''">    
                                    <input type="hidden" id="bplc" v-model="viewModel.data.bplc_sn">
                                    <label for="bplc_nm" v-if="viewModel.userInfo.bplc_yn !='Y'"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-search"></use></svg></label>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row" class="essential"><label for="">작성자</label></th>
                            <td>
                                {{viewModel.data.chck_act_sn == undefined ? viewModel.userInfo.user_name: viewModel.data.user_nm }}
                            </td> 
                        </tr>
                        <!-- <tr v-if = "viewModel.data.chck_clsf.indexOf('REC') > -1 || viewModel.data.chck_clsf.indexOf('FC') > -1" > -->
                            <tr v-if = "viewModel.data.chck_clsf.indexOf('FC') > -1" >
                            <th scope="row" class="essential"><label for="">현장팀명</label></th>
                            <td>
                                <select title="현장팀명 선택"  v-model="viewModel.data.bplc_team_sn" v-if="viewModel.data.chck_clsf.indexOf('REC') > -1" id="bplc_team" @click="fnSelectClick();">
                                    <option value="">현장팀명을 선택해주세요.</option>
                                    <option v-for="(item, i) in viewModel.teamList" :key="i" :value="item.reg_sn"><span>{{ item.work_type_nm }}_{{ item.team_nm }} ( {{ item.evl_bgng_dt|yyyyMMdd }} ~ {{ item.evl_end_dt|yyyyMMdd }})</span></option>
                                </select> 
                                <select title="팀명 선택" v-model="viewModel.data.bplc_team_sn" id="bplc_team" v-else @click="fnSelectClick();">
                                    <option value=''>선택</option>
                                    <option v-for="item in viewModel.bplcTeamList" :value="item.BPLC_TEAM_SN">{{ item.BPLC_TEAM_NM }}</option>
                                </select>
                            </td> 
                        </tr>
                        <tr>
                            <th scope="row" class="essential"><label for="chck_dt">점검일자</label></th>
                            <td>
                                <div class="datepicker_box">
                                    <input type="text" class="datepicker" id="chck_dt" placeholder="날짜" title="점검일자" readonly>
                                </div>
                            </td> 
                        </tr>
                        <tr>
                            <th scope="row" class="essential"><label for="">점검항목</label></th>
                            <td>
                                <select title="점검 장비 선택"  v-model="viewModel.data.chck_mttr" v-if="viewModel.data.chck_clsf.indexOf('FC') > -1" @change="fnHqpItemList();" id="chck_mttr" @click="fnSelectClick();">
                                    <option value="">점검 장비를 선택해주세요.</option>
                                    <option v-for="(item, i) in viewModel.fcltList" :key="i" :value="item.MANAGE_SN"><span>{{ item.HQP_MNG_NM }} ( {{ item.HQP_NO }} )</span></option>
                                </select> 
                                <input type="text" id="chck_mttr" title="점검항목" v-model="viewModel.data.chck_mttr" placeholder="점검항목을 입력하세요." v-else>
                            </td>
                        </tr>
                        <tr v-if="viewModel.data.chck_clsf.indexOf('JC') !== -1">
                            <th scope="row" class="essential"><label for="">허가서 선택</label></th>
                            <td>
                                <select title="허가서 선택"  v-model="viewModel.data.job_rpmsn_sn" @click="fnSelectClick();">
                                    <option value="">등록된 작업 허가서를 선택하세요.</option>
                                    <option v-for="(item, i) in viewModel.jobList" :key="i" :value="item.job_rpmsn_sn"><span>{{ item.job_type_nm }} | {{ item.reg_dt|yyyyMMdd }} | {{ item.reg_nm }}</span></option>
                                </select> 
                                
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div v-if="viewModel.data.chck_clsf.indexOf('FC') > -1">
                <h3>자율안전점검표</h3>
                <table class="table horizontal write">
                    <caption>점검활동 등록</caption>
                    <tbody>
                        <tr>
                            <th scope="row" class="w200 essential"><label for="">확인자</label></th>
                            <td>
                                <div class="input_group input_btn">
                                    <input type="text" id="idfr_nm" v-model="viewModel.data.idfr_nm" readonly @click="fnChckUserPopup();">    
                                    <input type="hidden" id="idfr" v-model="viewModel.data.idfr">
                                    <label for="idfr_nm"><svg class="icon"><use xlink:href="../../../img/symbol-defs.svg#icon-search"></use></svg></label>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td colspan="2" class="text-center">
                                <img :src="viewModel.data.img_path" onerror="this.src='../../img/no-img.png'">
                            </td>
                        </tr>
                    </tbody>
                </table>
                <table class="table write">
                    <caption>자율안전점검표 등록</caption>
                    <thead>
                        <tr>
                            <th scope="col" rowspan="2">번호</th>
                            <th scope="col" rowspan="2">구분</th>
                            <th scope="col" rowspan="2">자율점검항목</th>
                            <th scope="col" colspan="2">점검결과</th>
                        </tr>
                        <tr>
                            <th scope="col" class="essential">적정결과</th>
                            <th scope="col" class="essential">조치</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item,index) in viewModel.itemList">
                            <td>{{index + 1}}</td>
                            <template v-if="item.row1 == 'Y'">
                                <td :rowspan="item.row1_cnt" class="text-left">
                                    {{ item.se_cn }}
                                </td>
                            </template>
                            <td class="text-left">{{ item.artcl_cn }}</td>
                            <td>
                                <label :for="'chck_rsltY_'+index">
                                    <input type="radio" :name="'chck_rslt'+index" :id="'chck_rsltY_'+index" v-model="item.chck_rslt" @click="item.chck_rslt = $event.target.value; fnChckRsltChng(index)" value="Y">적정
                                </label>
                                <label :for="'chck_rsltN_'+index">
                                    <input type="radio" :name="'chck_rslt'+index" :id="'chck_rsltN_'+index" v-model="item.chck_rslt" @click="item.chck_rslt = $event.target.value; fnChckRsltChng(index)" value="N">부적정
                                </label>
                            </td>
                            <td>
                                <input type="text" :id="'actn_'+index" v-model="item.actn" :style="item.chck_rslt == 'Y' ? 'display:none;' : ''">
                            </td>
                        </tr>
                        <tr>
                            <th class="essential">점검의견</th>
                            <td colspan="4">
                                <textarea :id="'chck_opnn'" rows="5" v-model="viewModel.data.chck_opnn"></textarea>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <rgstChkSubWrite ref="sub" @rsltList="fnrsltList" :pass="{mode: $route.params.gbn == undefined && $route.params.sn != undefined ? 'update' : 'write'}" v-else></rgstChkSubWrite>
            <!-- <rgstChkMttrWrite ref="mttr" @mttrList="fnMttrList" :pass="{mode: $route.params.sn == undefined ? 'write' : 'update'}" v-if="mttrForm==true"></rgstChkMttrWrite> -->
            <div class="table_footer btn-right">
                <button class="btn btn-purple" @click.prevent="fnSave()"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-post-add"></use></svg>등록</button>
                <router-link :to="'/'" class="btn btn-white"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-list-back"></use></svg>목록</router-link>
            </div>
        </div>
        <user ref="user" v-if="userPop==true" :pass="{dept_sn: viewModel.userInfo.dept_sn, team_sn: viewModel.userInfo.team_sn, title:'조치자', multi:'Y', bplc_yn:'Y', bplc_sn: viewModel.data.bplc_sn}"></user>
        <chckUser ref="chckUser" v-if="chckUserPop==true" :pass="{dept_sn: viewModel.userInfo.dept_sn, team_sn: viewModel.userInfo.team_sn, title:'확인자', bplc_yn:'Y', bplc_sn: viewModel.data.bplc_sn}"></chckUser>
        <bplc ref="bplc" v-if="bplcPop==true" :pass="{dept_sn: viewModel.userInfo.dept_sn, team_sn: viewModel.userInfo.team_sn}"></bplc>
    </div>
</template>

<script>
    import "es6-promise/auto";
    import Vue from "vue";
    import Axios from "axios";
    import rgstChkSubWrite from "./rgstChkSubWrite.vue";
    import user from "../../popup/user_popup.vue";
    import chckUser from "../../popup/user_popup.vue";
    import bplc from "../../popup/bplc_popup.vue";
    import Common from '../../../../common/js/common.js';
    import Message, {messageUtil} from "../../../../common/js/message";
    import fromValidation from "../../../../common/js/fromValidation";
    import imgsfileform from '../../../../common/vue/imgsfileform2.vue';

    export default {
        data: function() {
            return {
                mttrForm:false,
                userPop: false, //사용자 팝업
                chckUserPop: false,
                bplcPop:false, //현장 팝업.
                viewModel:{
                    data:{
                        chck_clsf: [],
                        job_rpmsn_sn: '',
                        chck_mttr:'',
                        bplc_team_sn:'',
                    },
                    rsltList:[],
                    userInfo:{},
                    chkTypeList:[],
                    chkRsltList:[],
                    filelist:[],
                    jobList:[],
                    teamList:[],
                    fcltList:[],
                    formDAta:{},
                    itemList:[],
                    bplcTeamList:[],
                },
                isSaved:false,
            };
        },
        components: {
            'rgstChkSubWrite' : rgstChkSubWrite,
            'user' : user,
            'chckUser' : chckUser,
            'bplc' : bplc,
            'imgsfileform' : imgsfileform,
        },
        activated:function(){
            this.fnInit();
            calendarInput();
        },
        deactivated:function(){
            this.$destroy();
        },
        mounted: function() {
            let vm = this;
            // vm.fnInit();
            // calendarInput();
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
        methods: {
            fnInit:function(){
                let vm = this;
                vm.viewModel.userInfo = vm.$store.state.global.userInfo;

                let sn = vm.$route.params.sn;
                let gbn = vm.$route.params.gbn;

                vm.gbn = vm.$route.params.gbn;
                vm.sn = vm.$route.params.sn;
                
                if(sn != undefined && gbn == undefined){
                    vm.fnDetail(sn);
                }else{
                    //현장코드 있을 경우 그 값으로 세팅
                    vm.viewModel.data.bplc_sn = vm.viewModel.userInfo.bplc_sn == 0 ? '' : vm.viewModel.userInfo.bplc_sn;
                    vm.viewModel.data.bplc_nm = vm.viewModel.userInfo.bplc_sn == 0 ? '' : vm.viewModel.userInfo.bplc_nm;
                    
                    vm.fnWriteInfo();
                }
            },
            fnWriteInfo:function(){
                let vm = this;
                let data = {}   

                if(vm.gbn == 'fclt'){
                    data = {
                        gbn :  vm.gbn,
                        manage_sn :  vm.sn,
                        bplc_sn: vm.viewModel.data.bplc_sn,
                    }
                }else{
                    data = {
                        bplc_sn: vm.viewModel.data.bplc_sn,
                    }
                }

                Axios.post("/selectChkActWriteInfo.do", data)
                .then(function(response) {
                    vm.viewModel.chkTypeList = response.data.chkTypeList;
                    vm.viewModel.chkRsltList = response.data.chkRsltList;
                    if(vm.viewModel.data.bplc_sn != ""){
                        vm.viewModel.bplcTeamList = response.data.bplcTeamList;
                    }

                    if(vm.gbn == 'fclt'){
                        let fcltMngmtDetail = response.data.fcltMngmtDetail;
                        vm.viewModel.fcltList = response.data.fcltList;

                        if(vm.viewModel.userInfo.bplc_yn == 'N'){
                            vm.viewModel.data.bplc_sn = fcltMngmtDetail.bplc_sn;
                            vm.viewModel.data.bplc_nm = fcltMngmtDetail.bplc_nm;
                        }
                        
                        if(vm.viewModel.data.bplc_sn == fcltMngmtDetail.bplc_sn){
                            vm.viewModel.data.chck_mttr = vm.sn;
                            vm.viewModel.data.chck_clsf.push("FC");

                            vm.fnHqpItemList();
                        }else{
                            alert("현재 로그인된 현장과 qr로 접속된 현장이 다릅니다.");
                            vm.$router.push('/');
                        }
                    }else{
                        //점검결과 코드 리스트 전달
                        vm.$refs.sub.viewModel.chkRsltList = vm.viewModel.chkRsltList;
                    }
                });
            },
            fnDetail:function(sn){
                let vm = this;
                let data = {
                    user_id: vm.viewModel.userInfo.user_id, 
                    chck_act_sn: sn,
                }
                Axios.post("/selectChkActUpdate.do", data)
                .then(function(response) {
                    vm.viewModel.data = response.data.detail;
                    vm.viewModel.chkTypeList = response.data.chkTypeList;
                    vm.viewModel.chkRsltList = response.data.chkRsltList;
                    vm.viewModel.bplcTeamList = response.data.bplcTeamList;
                
                    if(vm.viewModel.data.chck_clsf.indexOf("FC") == -1){
                        vm.viewModel.jobList = response.data.jobList;
                        vm.viewModel.rsltList = response.data.rsltList;
                        vm.viewModel.filelist = response.data.fileList;
                        vm.viewModel.teamList = response.data.teamList;
                    }else{
                        vm.viewModel.fcltList = response.data.fcltList;
                        vm.viewModel.itemList = response.data.itemList;

                        vm.viewModel.data.img_path = vm.viewModel.data.img_path.charAt() == '/' ? vm.viewModel.data.img_path : vm.viewModel.data.img_path.substr(2);
                        vm.viewModel.data.chck_mttr = vm.viewModel.data.chck_mttr_org;
                    }

                    $("#chck_dt").val(Common.fnDateTimeStr(vm.viewModel.data.chck_dt));
                }).then(function(){

                    if(vm.viewModel.data.chck_clsf.indexOf("FC") == -1){
                        //점검결과 코드 리스트 전달
                        vm.$refs.sub.viewModel.chkRsltList = vm.viewModel.chkRsltList;

                        //점검사항 리스트
                        if(vm.viewModel.rsltList.length > 0){
                            vm.$refs.sub.fnLoadList(vm.viewModel.rsltList, vm.viewModel.filelist);
                        }                
                    }

                    //점검등록 체크
                    var arr = vm.viewModel.data.chck_clsf.split(',');
                    vm.viewModel.data.chck_clsf = [];
                    for(let i=0; i<arr.length; i++){
                        vm.viewModel.data.chck_clsf.push(arr[i]);
                    }
                });
            },
            fnSave:function(){
                let vm = this;
                let list = [];
                let frm = new FormData();
                for(let i=0; i<vm.viewModel.rsltList.length; i++){
                    
                    if(vm.viewModel.rsltList[i].imgfilelist != null){
                        for(let j=0; j<vm.viewModel.rsltList[i].imgfilelist.length; j++){
                            let key = vm.viewModel.rsltList[i].imgfilelist[j].file_seq;

                            if(vm.viewModel.rsltList[i].imgfilelist[j].file != null) {
                                frm.append("uploadFiles", vm.viewModel.rsltList[i].imgfilelist[j].file);
                                frm.append("sn", vm.viewModel.rsltList[i].chck_act_rslt_sn);
                                frm.append("fileTitle", vm.viewModel.rsltList[i].imgfilelist[j].file.name);
                                if(vm.viewModel.rsltList[i].imgfilelist[j].file_sn){
                                    frm.append("deleteFiles", vm.viewModel.rsltList[i].imgfilelist[j].file_sn);
                                }
                                frm.append("key", 0)
                            } else {
                                if(vm.viewModel.rsltList[i].imgfilelist[j].file == undefined){
                                    
                                }else{
                                    frm.append("fileTitle", vm.viewModel.rsltList[i].imgfilelist[j].file_title);
                                    frm.append("key", key)
                                }
                            }
                        }
                    } 

                    if(vm.viewModel.rsltList[i].imgdeletefileList != null){
                        for(let j=0; j<vm.viewModel.rsltList[i].imgdeletefileList.length; j++){
                            frm.append("deleteFiles", vm.viewModel.rsltList[i].imgdeletefileList[j]);
                            frm.append("del_sn", vm.viewModel.rsltList[i].chck_act_rslt_sn);
                        }
                    }                    
                }
                vm.fngetFileInfo(frm);
            },
            fngetFileInfo(frm){
                
                let vm = this;
                let job_type = '';

                //점검유형 필수체크
                if(vm.viewModel.data.chck_clsf.length == 0){
                    alert("점검유형을 선택해주세요.");
                    return false;
                }

                let valiData = [];
                if(vm.viewModel.data.chck_clsf.indexOf("FC") > -1){
                    valiData = [
                        {id: 'bplc_nm', type: 'input', title: '현장명'},
                        {id: 'bplc_team', type: 'select', title: '현장팀명'},
                        {id: 'chck_dt', type: 'input', title: '점검일자'},
                        {id: 'chck_mttr', type: 'select', title: '점검항목'},
                        {id: 'idfr_nm', type: 'input', title: '확인자'},
                    ];
                // }else if(vm.viewModel.data.chck_clsf.indexOf("REC") > -1){
                //     valiData = [
                //         {id: 'bplc_nm', type: 'input', title: '현장명'},
                //         {id: 'bplc_team', type: 'select', title: '현장팀명'},
                //         {id: 'chck_dt', type: 'input', title: '점검일자'},
                //         {id: 'chck_mttr', type: 'select', title: '점검항목'},
                //     ];
                }else{
                    valiData = [
                        {id: 'bplc_nm', type: 'input', title: '현장명'},
                        {id: 'chck_dt', type: 'input', title: '점검일자'},
                        {id: 'chck_mttr', type: 'input', title: '점검항목'},
                    ];
                }

                if(!fromValidation(valiData)){
                    return false;
                }

                if(vm.viewModel.data.chck_clsf.filter(data=> data == 'JC').length > 0){
                    if(vm.viewModel.data.job_rpmsn_sn == ''){
                        alert("허가서를 선택해주세요.");
                        return false;
                    }else{
                        job_type = vm.viewModel.jobList.filter(data => data.job_rpmsn_sn == vm.viewModel.data.job_rpmsn_sn)[0].job_type;
                    }
                }

                if(vm.viewModel.data.chck_clsf.indexOf("FC") > -1){
                    if(vm.viewModel.itemList.length > 0){
                        let len = vm.viewModel.itemList.length;
                        
                        for(let i=0; i<len;i++){
                            let item = vm.viewModel.itemList[i];

                            if(item.chck_rslt == "N" && (item.actn == undefined || item.actn == '')){
                                alert("조치를 등록해주세요.");
                                $("#actn_"+i).focus();
                                return false;
                            }
                        }
                    }
                }else{
                    if(vm.viewModel.rsltList.length > 0){
                        let len = vm.viewModel.rsltList.length;
                        if(len == 0){
                            alert("점검사항을 입력해주세요.");
                            return false;
                        }else{
                            for(let i=0; i<len;i++){
                                if(vm.viewModel.rsltList[i].chck_rslt == ""){
                                    alert("점검결과를 입력해주세요.");
                                    return false;
                                }
                                if((vm.viewModel.data.chck_clsf.indexOf("FC") == -1) && 
                                (vm.viewModel.rsltList[i].bplc_team_sn == "" || vm.viewModel.rsltList[i].bplc_team_sn == undefined)){
                                    alert("현장팀명을 입력해주세요.");
                                    $("#sub_bplc_team_sn_" + i).focus();
                                    return false;
                                }
                                if(vm.viewModel.rsltList[i].chck_cn == "" || vm.viewModel.rsltList[i].chck_cn == undefined){
                                    alert("점검내용을 입력해주세요.");
                                    $("#chck_cn_" + i).focus();
                                    return false;
                                }
                                if(vm.viewModel.rsltList[i].chck_rslt == "I"){  //미흡일 경우 지적, 조치자 작성
                                    if(vm.viewModel.rsltList[i].actn_mttr == "" || vm.viewModel.rsltList[i].actn_mttr == undefined){
                                        alert("지적/요청사항을 입력해주세요.");
                                        $("#actn_mttr_" + i).focus();
                                        return false;
                                    }
                                    if(vm.viewModel.rsltList[i].actn_pic_nm == "" || vm.viewModel.rsltList[i].actn_pic_nm == undefined){
                                        alert("조치자를 입력해주세요.");
                                        return false;
                                    }
                                }
                            }
                        }
                    }      
                }
                             
                let data = {
                    user_id: vm.viewModel.userInfo.user_id,
                    l_chck_clsf: vm.viewModel.data.chck_clsf,
                    bplc_sn: vm.viewModel.data.bplc_sn,
                    bplc_team: vm.viewModel.data.bplc_team_sn,
                    chck_dt: $("#chck_dt").val(),
                    chck_mttr: vm.viewModel.data.chck_mttr,
                    job_rpmsn_sn: vm.viewModel.data.chck_clsf.filter(data=> data == 'JC').length == 0 ? null : vm.viewModel.data.job_rpmsn_sn,
                    job_type: job_type = '' ? null : job_type,
                    rsltList: vm.viewModel.rsltList,
                    chck_act_sn: vm.viewModel.data.chck_act_sn,
                    delRsltList: vm.viewModel.data.chck_clsf.indexOf("FC") > -1 ?  [] : vm.$refs.sub.viewModel.delRsltList,
                    idfr: vm.viewModel.data.idfr,
                    itemList: vm.viewModel.itemList,
                    chck_opnn: vm.viewModel.data.chck_opnn,
                    img_path: vm.viewModel.data.img_path,
                };
                
                frm.append('data', new Blob([ JSON.stringify(data) ], {type : "application/json"}));
                
                frm.append("filePath", "chkAct");

                if(vm.viewModel.data.chck_act_sn == undefined){
                    if(confirm(Message.CREATE_CONFIRM)){
                        $(".loading").show();
                        $("#mask").show();
                        Axios.post("/insertChkAct.do", frm).then(function(response) {
                            if(response.data == 1){
                                vm.isSaved = true;
                                vm.$router.push('/');
                                alert("저장되었습니다.");

                                if(vm.viewModel.rsltList.length > 0) {
                                    $.each(vm.viewModel.rsltList, function(idx, item) {
                                        if(item.chck_rslt == 'I' && item.actn_pic != '') {
                                            vm.callPushAlarm(item.actn_pic);
                                        }
                                    });
                                }
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
                        Axios.post("/updateChkAct.do", frm).then(function(response) {
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
                }
            },
            fnPopup: function() {
				let vm = this;

                if(vm.viewModel.data.bplc_sn == '' || vm.viewModel.data.bplc_sn == undefined){
                    alert("현장명을 선택해주세요.");
                    return false;
                }else{
                    vm.bplcPop=false;
                    vm.chckUserPop=false;
				    vm.userPop=true;
                    vm.$nextTick(function() {
                        if(vm.userPop) {
                            vm.$refs.user.fnInit();
                        }
                    })
                }
			},
            fnMultiMemberAdd: function(list){
                let vm = this;
                vm.userPop = false;

                vm.$refs.sub.fnMemberAdd(list);
            },
            fnBplcPopup:function(){
                let vm = this;
				vm.bplcPop=true;
                vm.userPop=false;
                vm.chckUserPop=false;
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

                if(vm.viewModel.data.chck_clsf.filter(data=> data == 'JC').length > 0){
                    vm.fnGetJobList();
                    vm.fnBplcTeamList();
                }else if(vm.viewModel.data.chck_clsf.indexOf("FC") != -1){
                    vm.fnGetFcltList();
                    vm.fnBplcTeamList();
                // }else if(vm.viewModel.data.chck_clsf.indexOf("REC") != -1){
                //     vm.fnGetTeamList();
                }else{
                    vm.fnBplcTeamList();
                }
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
            fnImgFileList:function(vm){
                this.viewModel.imgfilelist = vm.viewModel.filelist;
            },
            fnImgFileDelete: function(vm){
                this.viewModel.imgdeletefileList = vm.viewModel.deletefileList;
            },
            fnrsltList:function(vm){
                this.viewModel.rsltList = vm.viewModel.rsltList;
            },
            fnChckTypeClick: function(cd, event){
                let vm = this;

                if(cd == 'JC'){ //작업허가 점검 일경우
                    if($(event.target).prop("checked")){
                        if(vm.viewModel.data.chck_clsf.indexOf("FC") > -1){
                            $(event.target).prop("checked", false);
                            alert("장비점검은 단독으로 선택 가능합니다.");
                            let len = vm.viewModel.data.chck_clsf.length;
                            vm.viewModel.data.chck_clsf.splice(len-1, 1);
                        // }else if(vm.viewModel.data.chck_clsf.indexOf("REC") > -1){
                        //     $(event.target).prop("checked", false);
                        //     alert("위험성평가등록부는 단독으로 선택 가능합니다.");
                        //     let len = vm.viewModel.data.chck_clsf.length;
                        //     vm.viewModel.data.chck_clsf.splice(len-1, 1);
                        // }
                        // if(vm.viewModel.data.bplc_sn == '' || vm.viewModel.data.bplc_sn == undefined || vm.viewModel.data.bplc_sn == null){
                            // alert("현장명을 선택해주세요.");
                        }else{
                            vm.fnGetJobList();
                        }
                    }else{
                        vm.viewModel.data.job_rpmsn_sn = '';
                    }

                }else if(cd == 'FC'){
                    if($(event.target).prop("checked")){
                        if(vm.viewModel.data.chck_clsf.length > 1){
                            $(event.target).prop("checked", false);
                            alert("장비점검은 단독으로 선택 가능합니다.");
                            let len = vm.viewModel.data.chck_clsf.length;
                            vm.viewModel.data.chck_clsf.splice(len-1, 1);
                        }else{
                            if(vm.viewModel.data.bplc_sn == '' || vm.viewModel.data.bplc_sn == undefined || vm.viewModel.data.bplc_sn == null){
                                // alert("현장명을 선택해주세요.");
                            }else{
                                vm.viewModel.data.chck_mttr = "";

                                vm.fnGetFcltList();
                            }
                        }
                    }else{
                        vm.viewModel.data.chck_mttr = "";
                        vm.viewModel.data.img_path = "";

                        vm.fnHqpRefresh();
                    }
                // }else if(cd == 'REC'){
                //     if($(event.target).prop("checked")){
                //         if(vm.viewModel.data.chck_clsf.length > 1){
                //             $(event.target).prop("checked", false);
                //             alert("위험성평가등록부는 단독으로 선택 가능합니다.");
                //             let len = vm.viewModel.data.chck_clsf.length;
                //             vm.viewModel.data.chck_clsf.splice(len-1, 1);
                //         }else{
                //             if(vm.viewModel.data.bplc_sn == '' || vm.viewModel.data.bplc_sn == undefined || vm.viewModel.data.bplc_sn == null){
                //                 // alert("현장명을 선택해주세요.");
                //                 vm.viewModel.data.bplc_team_sn = "";
                //                 return false;
                //             }else{
                //                 vm.fnGetTeamList();
                //             }
                //         }
                //     }
                }else{
                    if(vm.viewModel.data.chck_clsf.indexOf("FC") > -1){
                        $(event.target).prop("checked", false);
                        alert("장비점검은 단독으로 선택 가능합니다.");
                        let len = vm.viewModel.data.chck_clsf.length;
                        vm.viewModel.data.chck_clsf.splice(len-1, 1);
                    // }else if(vm.viewModel.data.chck_clsf.indexOf("REC") > -1){
                    //     $(event.target).prop("checked", false);
                    //     alert("위험성평가등록부는 단독으로 선택 가능합니다.");
                    //     let len = vm.viewModel.data.chck_clsf.length;
                    //     vm.viewModel.data.chck_clsf.splice(len-1, 1);
                    }else{
                        vm.fnHqpRefresh();
                    }
                }      
            },
            fnSelectClick: function(){
                let vm = this;
                if(vm.viewModel.data.bplc_sn == '' || vm.viewModel.data.bplc_sn == undefined || vm.viewModel.data.bplc_sn == null){
                    alert("현장명을 선택해주세요.");
                    return false;
                }
            },  
            fnGetTeamList: function(){
                let vm = this;

                vm.viewModel.data.bplc_team = '';
                let data = {
                    bplc_sn : vm.viewModel.data.bplc_sn
                }

                Axios.post("/selectChckTeamList.do", data)
                .then(function(response) {
                    vm.viewModel.teamList = response.data.teamList;
                });
            },
            fnGetJobList: function(){
                let vm = this;

                vm.viewModel.data.job_rpmsn_sn = '';

                let data = {
                    bplc_sn: vm.viewModel.data.bplc_sn
                }

                Axios.post("/selectChckJobList.do", data)
                .then(function(response) {
                    vm.viewModel.jobList = response.data.jobList;
                });
            },
            fnInput: function(){
                let vm = this;
                
                vm.viewModel.data.bplc_team = vm.viewModel.data.bplc_team.trim('');
            },
            fnGetFcltList: function(){
                let vm = this;

                let data = {
                    bplc_sn: vm.viewModel.data.bplc_sn
                }
                
                if(vm.viewModel.data.bplc_sn == '' || vm.viewModel.data.bplc_sn == undefined){
                    alert("현장명을 선택해주세요.");
                    return false;
                }else{
                    Axios.post("/selectChckFcltList.do", data)
                    .then(function(response) {
                        vm.viewModel.fcltList = response.data.fcltList;
                    });
                }
            },
            fnHqpItemList: function(){
                let vm = this;

                let data = {
                    manage_sn: vm.viewModel.data.chck_mttr,
                }
                
                Axios.post("/selectChckHqpFormDetail.do", data)
                .then(function(response) {
                    vm.viewModel.formData = response.data.data;
                    vm.viewModel.itemList = response.data.itemList;

                    vm.viewModel.data.img_path = vm.viewModel.formData.strg_path.charAt() == '/' ? vm.viewModel.formData.strg_path + vm.viewModel.formData.strg_file_nm : vm.viewModel.formData.strg_path.substr(2)  + vm.viewModel.formData.strg_file_nm;

                    vm.fnHqpRefresh();
                });                
            },
            fnChckUserPopup: function() {
				let vm = this;

                if(vm.viewModel.data.bplc_sn == '' || vm.viewModel.data.bplc_sn == undefined){
                    alert("현장명을 선택해주세요.");
                    return false;
                }else{
                    vm.bplcPop=false;
                    vm.userPop=false;
				    vm.chckUserPop=true;
                    vm.$nextTick(function() {
                        if(vm.chckUserPop) {
                            vm.$refs.chckUser.fnInit();
                        }
                    })
                }
			},
            fnMemberAdd: function(item){
                let vm = this;

                vm.chckUserPop = false;

                vm.viewModel.data.idfr_nm = item.user_nm;
                vm.viewModel.data.idfr = item.user_id;
            },
            fnChckRsltChng: function(index){
                let vm = this;


                if(vm.viewModel.itemList[index].chck_rslt == 'Y'){
                    vm.viewModel.itemList[index].actn = '';
                    $("#actn_"+ index).css("display", "none");
                }else{
                    $("#actn_"+ index).css("display", "");
                }
            },
            fnHqpRefresh: function(){
                let vm = this;

                // if(gbn == 'all'){
                //     vm.viewModel.data.chck_mttr = '';
                //     vm.viewModel.data.img_path = '';
                // }

                vm.viewModel.data.chck_opnn = '';
                vm.viewModel.data.idfr = '';
                vm.viewModel.data.idfr_nm = '';
                vm.viewModel.data.idfr_sign_dt = '';
                vm.viewModel.data.idfr_sign_yn = '';
            },
            callPushAlarm: function(actn_pic) {
                let vm = this;
                let send = {
                    bplc_sn : vm.viewModel.data.bplc_sn
                }
                Axios.post("/selectChkActMaxSn.do",send).then(function(rs) {
                    
                    let link = '/m/chkHthAct/chkAct/rgstChk.do#/detail/'+rs.data.CHCK_ACT_SN;

                    //console.log(' link  ::  ' , link);

                    $.ajax({
                        type: "post",
                        url:"/api/pushSendPerson.do",
                        data:{
                            // 제목 및 내용
                            title : "새로운 점검활동이 등록되었습니다.",
                            message : rs.data.CHCK_MTTR,
                            user_id : actn_pic,
                            // 클릭 시 이동 화면주소
                            link : link
                        }
                    });
                   
                });

            }
        }
    };
</script>