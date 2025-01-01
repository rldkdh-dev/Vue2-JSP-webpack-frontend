<template>
    <div>
        <div class="contents">
            <div class="divide">
                <div>
                    <div>
                        <h3>기본정보</h3>
                        <table class="table horizontal write">
                            <caption>계획등록</caption>
                            <tbody>
                                <tr>
                                    <th scope="row" class="w180 essential"><label for="p1">교육종류</label></th>
                                    <td>
                                        <div class="input_group">
                                            <select v-model="selectEdu" ref="clsf" @change="fnEdu_Detail_Code(selectEdu)">
                                                <option value="">선택</option>
                                                <option v-for="item in eduCodeList" :key="item" :value="item.edu_se_cd">{{ item.edu_se_nm }}</option>
                                            </select>
                                            <select v-model="selectEdu_se" ref="clsf_se" @change="fnCodeEdu_cn(selectEdu_se)" v-if="selectEdu != '' && selectEdu != 'EA04' && selectEdu != 'EA05' && selectEdu != 'EA06'">
                                                <option value="">선택</option>
                                                <option v-for="item in eduCodeDetailList" :key="item" :value="item.edu_detail_cd">{{ item.edu_detail_nm }}</option>
                                            </select>
                                            <!-- <input v-else-if="selectEdu == 'EA05'" type="text" v-model="edu_detail_etc" placeholder="물질명을 입력해주세요." ref="clsf_detail"> -->
                                            <input v-else type="text" v-model="edu_detail_etc" placeholder="입력사항이아닙니다." ref="clsf_detail" disabled>
                                        </div>
                                    </td>
                                    <!-- <td>
                                        <div class="input_group">
                                            <select v-model="selectEdu" ref="clsf" @change="fnEdu_Detail_Code(selectEdu)">
                                                <option value="">선택</option>
                                                <option v-for="item in eduCodeList" :key="item" :value="item.edu_se_cd">{{ item.edu_se_nm }}</option>
                                            </select>
                                            <select v-model="selectEdu_se" ref="clsf_se" @change="fnCodeEdu_cn(selectEdu_se)" v-if="selectEdu != 'EA05' && selectEdu != 'EA06'">
                                                <option value="">선택</option>
                                                <option v-for="item in eduCodeDetailList" :key="item" :value="item.edu_detail_cd">{{ item.edu_detail_nm }}</option>
                                            </select>
                                            <input v-else-if="selectEdu == 'EA05'" type="text" v-model="edu_detail_etc" placeholder="물질명을 입력해주세요." ref="clsf_detail">
                                            <input v-else type="text" v-model="edu_detail_etc" placeholder="입력해주세요." ref="clsf_detail">
                                        </div>
                                    </td> -->
                                    <th scope="row" class="w180 essential"><label for="p0">교육명</label></th>
                                    <td><input type="text" placeholder="입력해주세요." id="p0" v-model="edu_nm_ttl" ref="edu_nm_ttl"></td>
                                </tr>
                                <tr>
                                    <th scope="row" class="essential"><label for="bplc_nm">현장명</label></th>
                                    <td>
                                        <div class="input_btn" v-if="$store.state.global.userInfo.bplc_yn != 'N'">
                                            <input type="text" id="bplc_nm" title="현장명" v-model="bplc" ref="bplc" readonly>
                                        </div>
                                        <div class="input_btn" v-else>
                                            <input type="text" id="bplc_nm" v-model="bplc" @click="fnPopup();" readonly>
                                            <input type="hidden" id="bplc" v-model="bplc_sn" ref="bplc">
                                            <label for="bplc_nm" v-if="uid === undefined">
                                                <svg class="icon">
                                                    <use xlink:href="../../img/symbol-defs.svg#icon-search"></use>
                                                </svg>
                                            </label>
                                        </div>
                                    </td>
                                    <th scope="row" class="essential"><label for="p31">교육방법</label></th>
                                    <td><input type="text" placeholder="입력해주세요." id="p31" v-model="edu_mthd" ref="edu_mthd"></td>
                                </tr>
                                <tr>
                                    <th scope="row">
                                        <label for="p2" class="essential">교육일시</label>
                                        <div class="help_area">
                                            <svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-info-circle"></use></svg>
                                            <div class="tip"><p>교육시간 2시간 단위<br>(매월 2시간 실시_법 上 기준)</p></div>
                                        </div>
                                    </th>
                                    <td>
                                        <div class="input_group">
                                            <div class="datepicker_box w120">
                                                <input type="text" class="datepicker" id="p2" title="교육일시" placeholder="교육일시 선택" ref="edu_dt" readonly>
                                            </div>
                                            <select id="edu_bgng_hour" v-model="edu_bgng_hour" class="w80" ref="edu_bgng_hour">
                                                <option value="">선택</option>
                                                <option :value="i-1 < 10 ? 0+''+(i-1) : i-1" v-for="i in 24" :key="i">
                                                    {{ i-1 < 10 ? 0+''+(i-1) : i-1}}시
                                                </option>
                                            </select>
                                            <span>:</span>
                                            <select id="edu_bgng_min" v-model="edu_bgng_min" class="w80" ref="edu_bgng_min">
                                                <option value="">선택</option>
                                                <option :value="i-1 == 0 ? 0+''+(i-1) * 10 : (i-1) * 10" v-for="i in 6" :key="i">
                                                    {{ i-1 == 0 ? 0+''+(i-1) * 10 : (i-1) * 10 }}분
                                                </option>
                                            </select>
                                            <span>~</span>
                                            <select id="edu_end_hour" v-model="edu_end_hour" class="w80" ref="edu_end_hour">
                                                <option value="">선택</option>
                                                <option :value="i-1 < 10 ? 0+''+(i-1) : i-1" v-for="i in 24" :key="i">
                                                    {{ i-1 < 10 ? 0+''+(i-1) : i-1}}시
                                                </option>
                                            </select>
                                            <span>:</span>
                                            <select id="edu_end_min" v-model="edu_end_min" class="w80" ref="edu_end_min">
                                                <option value="">선택</option>
                                                <option :value="i-1 == 0 ? 0+''+(i-1) * 10 : (i-1) * 10" v-for="i in 6" :key="i">
                                                    {{ i-1 == 0 ? 0+''+(i-1) * 10 : (i-1) * 10 }}분
                                                </option>
                                            </select>
                                        </div>
                                    </td>
                                    <th scope="row">
                                        <label for="p4" class="essential">장소</label>
                                        <div class="help_area">
                                            <svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-info-circle"></use></svg>
                                            <div class="tip"><p>안전교육장 안전팀, 타 협력사 사용시간 <br>사전 조회 후 겹치지 않게</p></div>
                                        </div>
                                    </th>
                                    <td><input type="text" placeholder="입력해주세요." id="p4" v-model="edu_plc" ref="edu_plc"></td>
                                </tr>
                                <tr>
                                    <th scope="row">
                                        <label for="p8" class="essential">교육강사</label>
                                        <div class="help_area">
                                            <svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-info-circle"></use></svg>
                                            <div class="tip"><p>협력사 소장, EPC 시공담당, EPC 안전담당</p></div>
                                        </div>
                                    </th>
                                    <td colspan="3">
                                        <div class="input_group input_btn">
                                            <input type="text" title="검색" id="p8" v-model="edu_instr" ref="edu_instr" @click="fnInstrpopup" readonly>
                                            <label for="p8"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-search"></use></svg></label>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <th scope="row">
                                        <label for="p9" class="essential">교육내용</label>
                                        <div class="help_area">
                                            <svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-info-circle"></use></svg>
                                            <div class="tip">
                                                <p>교육 내용은 법적인 사항으로 기입된 내용에서 수정 변경하지 말 것.</p><br>(추가하는 것은 가능)
                                            </div>
                                        </div>
                                    </th>
                                    <td colspan="3"><textarea title="교육내용입력" placeholder="입력해주세요." id="" rows="13" v-model="edu_cn" ref="edu_cn">* 근로자 정기교육 </textarea></td>
                                </tr>
                                <tr v-if="selectEdu == 'EA02'">
                                    <th scope="row">
                                        <label for="p9">개별내용</label>
                                        <div class="help_area">
                                            <svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-info-circle"></use></svg>
                                            <div class="tip">
                                                <p>기타 내용은 법적인 사항으로 기입된 내용에서 수정 변경하지 말 것.</p><br>(추가하는 것은 가능)
                                            </div>
                                        </div>
                                    </th>
                                    <td colspan="3"><textarea title="교육내용입력" placeholder="입력해주세요." id="" rows="13" v-model="indiv_cn"></textarea></td>
                                </tr>
                                <tr>
                                    <th scope="row"><label for="wrtr" class="essential">교안등록</label></th>
                                    <td :colspan="3">
                                        <fileform @filelist="fnFilelist"  @fileDelete="fnFileDelete" :pass="{id:'sc'}" ref="files"></fileform>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div>
                        <table class="table horizontal write">
                            <caption>참석자 지정 여부</caption>
                            <tbody>
                                <tr>
                                    <th class="w180">
                                        참석자 지정 여부                                        
                                    </th>
                                    <td v-if="y_cnt == 0">
                                        <label :for="'assign_n'">
                                            <input type="radio" name="assing_yn" id="assign_n" value="N" v-model="assign_yn" />미지정
                                        </label>
                                        <label :for="'assign_y'">
                                            <input type="radio" name="assing_yn" id="assign_y" value="Y" v-model="assign_yn"/>지정
                                        </label>
                                    </td>
                                    <td v-else>
                                        <p>이미 서명완료한 참석자가 있어 수정이 불가합니다.</p>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div v-if="assign_yn == 'Y'">
                        <h3>참석자</h3>
                        <div class="table_top btn-right">
                            <button class="btn btn-light-purple" @click="fnParticipopup();"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-group-add"></use></svg>참석자 추가</button>
                        </div>
                        <table class="table">
                            <caption>참석자</caption>
                            <thead>
                                <tr>
                                    <th scope="col">직책</th>
                                    <th scope="col">이름</th>
                                    <th scope="col">서명</th>
                                    <th scope="col">직책</th>
                                    <th scope="col">이름</th>
                                    <th scope="col">서명</th>
                                </tr>
                            </thead>
                            <tbody>
                                <template v-for="(item,i) in nmpr" :key="i">
                                    <tr v-if="i%2==0">
                                        <template v-if="i%2==0">
                                            <td class="text-center">
                                                {{ nmpr[i].ocpt_detail_nm }}
                                            </td>
                                            <td class="text-center">
                                                {{ nmpr[i].user_nm }}
                                            </td>
                                            <td class="text-center">
                                                <!-- {{ nmpr[i].sign_yn }} -->
                                            </td>
                                            <td v-if="i < nmpr.length - 1" class="text-center">
                                                {{ nmpr[i+1].ocpt_detail_nm }}
                                            </td>
                                            <td v-else></td>
                                            <td v-if="i < nmpr.length - 1" class="text-center">
                                                {{ nmpr[i+1].user_nm }}
                                            </td>
                                            <td v-else></td>
                                            <td v-if="i < nmpr.length - 1" class="text-center">
                                            </td>
                                            <td v-else>
                                                <!-- {{ nmpr[i+1].sign_yn }} -->
                                            </td>
                                        </template>
                                    </tr>
                                </template>
                            </tbody>
                        </table>
                    </div>

                    <div class="btn-group btn-right">
                        <a @click="fnUpload()" href="javascript:;" class="btn btn-purple"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-post-add"></use></svg>{{uid !== undefined ? '수정' : '등록'}}</a>
                        <a @click="fnBack" href="javascript:;" class="btn btn-white"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-list-back"></use></svg>목록</a>
                    </div> 
                </div>
                <div class="approval">
                    <h3>결재 정보</h3>
                    <ul>
                        <li>
                            <a href="#" class="signed">
                                <p class="essential">작성자</p>
                                <div class="user_img" id="1">
                                    <img :src="aprvr1_img">
                                </div>
                                <span>{{ aprvr1_nm == "" ? "작성자 등록":aprvr1_nm }}</span>
                            </a>
                        </li>
                        <li>
                            <a href="#" :class="[aprvr2_nm&&aprvr2_atrz_yn!='Y' ? 'set':null, aprvr2_nm&&aprvr2_atrz_yn=='Y' ? 'signed':null]">
                                <p>검토자</p>
                                <div class="user_img" id="" @click="fnAprvrpopup(2)" v-bind:style="aprvr2_atrz_yn == 'Y' ? 'background: none;' : ''">
                                    <img :src="aprvr2_img">
                                </div>
                                <span>{{ aprvr2_nm == "" ? "검토자 등록":aprvr2_nm }}</span>
                            </a>
                        </li>
                        <li>
                            <a href="#" :class="[aprvr3_nm&&aprvr3_atrz_yn!='Y' ? 'set':null, aprvr3_nm&&aprvr3_atrz_yn=='Y' ? 'signed':null]">
                                <p class="essential">현장소장</p>
                                <div class="user_img" id="3" @click="fnAprvrpopup(3)" v-bind:style="aprvr3_atrz_yn == 'Y' ? 'background: none;' : ''">
                                    <img :src="aprvr3_img">
                                </div>
                                <span>{{ aprvr3_nm == "" ? "현장소장 등록":aprvr3_nm }}</span>
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
            <!--
                 잠시보류 이지만 언제든지 부활 할 수 있음 
                 문제등록 퍼블 로직 
            -->
            <!-- <div class="question_list ol_counter">
                <h3 class="question"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-question"></use></svg>문제 등록</h3>
                <table class="table horizontal write">
                    <caption>문제등록</caption>
                    <tbody>
                        <tr v-for="(item ,i) in list" :key="item">
                            <th scope="row"><label for="s1">문항</label></th>
                            <td>
                                <div>
                                    <div class="input_group">
                                        <select class="wa" id="s1" v-model="list[i].selectQuestion" @change="fnQuestionCH(i)">
                                            <option value="0">객관식</option>
                                            <option value="1">객관식 (이미지첨부)</option> 추후 업데이트
                                            <option value="2">주관식</option>
                                        </select>
                                        <textarea title="내용입력" placeholder="입력해주세요." id="" rows="1" @input="item.title = $event.target.value"></textarea>
                                        <div class="icon_box">
                                            <a @click="fnQuestionListDelete(i)" href="javascript:;" class="btn btn-icon"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-delete-circle"></use></svg></a>
                                        </div>
                                    </div>
                                    <ol v-if="item.selectQuestion == '0'">
                                        <li v-for="(items , j) in list[i].question " :key="items" :value="j">
                                            <button :class="items.active == true ? 'on':''" @click="fnAnswerCheck(i,j)"></button>
                                            <textarea title="내용입력" placeholder="입력해주세요." id="a" rows="1" @input="items.text = $event.target.value"></textarea>
                                            <div class="icon_box">
                                                <a @click="fnQuestionAdd(i,j)" href="javascript:;" class="btn btn-icon"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-add-circle"></use></svg></a>
                                                <a @click="fnQuestionDelete(i,j)" href="javascript:;" class="btn btn-icon"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-circle-minus"></use></svg></a>
                                            </div>
                                        </li>
                                    </ol>
                                    <ol v-else-if="item.selectQuestion == '1'">
                                        <li v-for="(items , j) in list[i].question " :key="items" :value="j">
                                            <button :class="items.active == true ? 'on':''" @click="fnAnswerCheck(i,j)"></button>
                                            <textarea title="내용입력" placeholder="입력해주세요." id="d" rows="1" @input="items.text = $event.target.value"></textarea>
                                            <div class="upload_file_wrap">
                                                <div class="upload_file">
                                                    <div class="btn filebox">
                                                        첨부파일을 마우스로 드래그해서 추가해 주세요.
                                                    </div>
                                                    <input type="file" hidden="" :id="f01+j">
                                                    <label :for="f01+j" class="btn btn-white"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-folder-filled"></use></svg>찾아보기</label>
                                                </div>
                                            </div>
                                            <div class="icon_box">
                                                <a @click="fnQuestionAdd(i,j)" href="javascript:;" class="btn btn-icon"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-add-circle"></use></svg></a>
                                                <a @click="fnQuestionDelete(i,j)" href="javascript:;" class="btn btn-icon"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-circle-minus"></use></svg></a>
                                            </div>
                                        </li>
                                    </ol>
                                    <ol v-else></ol>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div class="table_footer btn-left">
                    <a href="javascript:;" class="btn btn-yellow" @click="fnQuizadd"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-question-add"></use></svg>문제추가</a>
                </div>
            </div> -->
        </div>
    </div>
</template>
<script>
    import "es6-promise/auto";
    import Vue from "vue";
    import Axios from "axios";
    
    export default {
      data: function() {
        return {
            deptlist:[],
            search:"",
            selectdata:""
        };
      },
      mounted: function() {},
      methods: {
        fnInit:function(i,list){
            this.mode = i;
            console.log("TEST");
        },
        // fnClose:function(){
        //     // this.$parent.fnInit();
        //     this.$emit('close',false);
        // },
        // fndeptList:function(){
        //     let vm = this;
        //     Axios.post("/deptlist.do",{}).then(function(res){
        //         vm.deptlist = res.data.deptList;
        //     })
        // },
        // fnUserdeptList:function(sn,search,i){
        //     let vm = this;
        //     if(sn == 0) vm.dept = 0;
        //     if(search == null) vm.search="";
        //     if(vm.selectlist.length == 0){
        //         vm.selectlist =[];
        //     }
        //     if(i == 0) vm.selectlist =[];
        //     // vm.selectlist =[];
        //     Axios.post("/userdeptlist.do",{sn:vm.dept,text:vm.search}).then(function(res){
        //         vm.list = res.data.deptList;
        //     }).then(function(){
        //         if(vm.aprvrlist != ""){
        //             vm.fnSet(vm.aprvrlist);
        //         }
        //     })
        // },
        // selectAllItems:function() {
        //     // 전체 선택 버튼을 눌렀을 때, 모든 아이템의 selected 값을 selectAll의 값으로 설정합니다.
        //     let vm = this;
        //     for (var i = 0; i < vm.list.length; i++) {
        //         vm.list[i].selected = vm.selectAll;
        //     }
        // },
        // fnAdd:function(){
        //     let vm = this;
        //     let chc = vm.addChenk(1,true); // 넣을떄 체크 
            
        //     for(var i=0; i<vm.list.length; i++){
        //         if(vm.list[i].selected == true){
        //             if(vm.selectlist.length < 1){
        //                 chc != false ? vm.selectlist.push({dept_nm:vm.list[i].dept_nm
        //                 ,jbgd_nm:vm.list[i].jbgd_nm 
        //                 , user_nm: vm.list[i].user_nm
        //                 , sessID:vm.list[i].sessID
        //                 ,jbgd_sn:vm.list[i].jbgd_sn
        //                 ,team_sn:vm.list[i].team_sn
        //                 ,dept_sn:vm.list[i].dept_sn
        //                 ,user_id:vm.list[i].user_id
        //                 ,bplc_sn:vm.list[i].bplc_sn}) : 0;
        //             }else{

        //             }
        //         }else{ 
        //             continue;
        //         }
        //     }
        //     // const deletelist = vm.list.filter(item => item.selected!=true);
        //     // vm.list = deletelist;
        //     vm.addChenk(2,chc); // 넣고나서 체크 
        // },
        // fnRemove:function(){
        //     let vm = this;
        //     for(var i=0; i<vm.selectlist.length; i++){
        //         if(vm.selectlist[i].selected == true){
        //             vm.list.unshift({sessID:vm.selectlist[i].sessID
        //                 , dept_nm:vm.selectlist[i].dept_nm
        //                 , jbgd_nm:vm.selectlist[i].jbgd_nm 
        //                 , user_nm:vm.selectlist[i].user_nm
        //                 ,team_sn:vm.list[i].team_sn
        //                 ,dept_sn:vm.list[i].dept_sn
        //                 ,jbgd_sn:vm.list[i].jbgd_sn
        //                 ,user_id:vm.list[i].user_id
        //                 ,bplc_sn:vm.list[i].bplc_sn});
        //             vm.selectlist.splice(i,1);
        //         }
        //     }
        // },
        // addChenk:function(num,bool){
        //     let vm = this;
        //     if(num == 1){
        //         const checklist = vm.list.filter(item => item.selected==true);
        //         if((vm.selectlist.length + checklist.length) > 1){
        //             alert("결제자 선택은 1명이 최대입니다");
        //             return false;
        //         }
        //     }else{
        //         var checklist = vm.list.filter(item => item.selected==true);
        //         if(vm.selectlist.length >1 ){
        //             return false;
        //         }else if(vm.selectlist.length >1 && (vm.selectlist.length + checklist.length) > 1){
        //             return false;
        //         }else{
        //             if(bool == false){
        //                 return false;
        //             }else{
        //                 const deletelist = vm.list.filter(item => item.selected!=true);
        //                 vm.list = deletelist;
        //             }
        //         }
        //     }
        // },
        // fnSummit:function(){
        //     let vm =this;
        //     if(vm.selectlist.length == 0){
        //         alert("결재자를 선택해주세요.");
        //     }else{
        //         if(confirm("등록하시겠습니까?")){
        //             vm.$emit('aprvrlist',vm.selectlist,vm.mode,false);
        //             alert("등록되었습니다.");
        //         } else{
        //             return alert("등록을 취소하였습니다.");
        //         }
        //     }
                
        // },
        // fnSet:function(list){
        //     let vm = this;
        //     for(var i=0; i<list.length; i++){
        //         const deletelist = vm.list.filter(item => item.sessID != list[i].sessID);
        //         vm.list = deletelist;
        //         vm.selectlist.push({dept_nm:list[i].dept_nm
        //             ,jbgd_nm:list[i].jbgd_nm 
        //             , user_nm: list[i].user_nm
        //             , sessID:list[i].sessID
        //             ,team_sn:vm.list[i].team_sn
        //             ,dept_sn:vm.list[i].dept_sn
        //             ,jbgd_sn:vm.list[i].jbgd_sn
        //             ,user_id:vm.list[i].user_id
        //             ,bplc_sn:vm.list[i].bplc_sn});
        //     }
        // },
      },
      watch: {
        // 셀렉트박스 상태가 변화할때마다 데이터 체크
        // list: {
        //     handler() {
        //         // 전체 선택이 되어있는지 확인
        //         let vm = this; 
        //         var allSelected = true;
        //         for (var i = 0; i < vm.list.length; i++) {
        //             if (!vm.list[i].selected) {
        //                 allSelected = false;
        //                 break;
        //             }
        //         }
        //         // 전체 선택이 되어있으면 선택 버튼도 선택 상태 아니면 선택되지 않은 상태
        //         vm.selectAll = allSelected;
        //     },
        //     deep: true
        // }
      }
    };
</script>