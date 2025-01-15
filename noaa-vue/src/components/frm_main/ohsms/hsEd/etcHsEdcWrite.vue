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
        <instrpopup ref="Instrpopup" v-if="isinstr==true"  @close="close" @instrlist="instrlist"></instrpopup>
        <aprvrpopup ref="Aprvrpopup" v-if="isaprvr==true" :pass="{title:'결재자',bplc_yn:$store.state.global.userInfo.bplc_yn,bplc_sn:bplc_sn,ocpt_detail_cd:aprvIndex}"></aprvrpopup>
        <bplcpop ref="bplcpop" v-if="bplcPop==true" :pass="{dept_sn: $store.state.global.userInfo.dept_sn, team_sn: $store.state.global.userInfo.team_sn}"></bplcpop>
        <participopup ref="participopup" v-if="participop==true" :pass="{bplc_sn:bplc_sn}"></participopup>
    </div>
</template>
<script>
    import "es6-promise/auto";
    import Vue from "vue";
    import Axios from "axios";
    import Message, {messageUtil} from "../../../../common/js/message";
    import Instrpopup from "./popup/instr_popup.vue";
    import Participopup from "./popup/ParticiPantPopup.vue";
    import APRVRpopup from "../../popup/user_popup.vue"; 
    import bplcpop from "../../popup/bplc_popup.vue";
    import fileform from "../../../../common/vue/fileform2.vue";

    Vue.component('instrpopup',Instrpopup);
    Vue.component('aprvrpopup',APRVRpopup);
    Vue.component('participopup', Participopup);
    Vue.component('bplcpop', bplcpop);
    Vue.component('fileform', fileform);

    export default {
        data: function() {
            return {
                uid:"",
                aprvr1:'',
                aprvr1_nm:"",
                aprvr1_img:"",
                aprvr2:'',
                aprvr2_nm:"",
                aprvr2_img:"",
                aprvr3:'',
                aprvr3_nm:"",
                aprvr3_img:"",
                aprvr1popup:[],
                aprvr2popup:[],
                aprvr3popup:[],
                isinstr:false,
                isaprvr:false,
                bplcPop:false,
                participop:false,
                popupinstrlist:[],
                edu_instr_sn:"",
                edu_nm_ttl:"",
                bplc:"",
                bplc_sn:"",
                bzenty_nm:"",
                edu_mthd:"",
                edu_plc:"",
                edu_instr:"",
                edu_cn:"",
                indiv_cn:"",
                // etc_cn:"",
                // spt_cn:"",
                selectEdu:"",
                selectEdu_se:"",
                edu_detail_etc:"",
                edu_bgng_hour:"",
                edu_bgng_min:"",
                edu_end_hour:"",
                edu_end_min:"",
                aprvr1_atrz_yn:"",
                aprvr2_atrz_yn:"",
                aprvr3_atrz_yn:"",
                eduCodeDetailList:[],
                eduCodeList:[],
                list:[
                    { 
                        selectQuestion:'0',
                        title:'',
                        question:[
                            {no:0,text:'',active:false,},
                            {no:1,text:'',active:false,}
                        ]
                    },
                ],
                nmpr:[],
                aprvIndex:'',
                isSaved:false,
                assign_yn:'N',
                y_cnt:0,
                viewModel:{
                    filelist:[],
                    deletefileList: [],
                }
            };
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
            vm.uid = vm.$route.params.uid;
            if(vm.$store.state.global.userInfo.bplc_yn == 'Y'){
                vm.bplc = vm.$store.state.global.userInfo.bplc_nm;
                vm.bplc_sn = vm.$store.state.global.userInfo.bplc_sn;
                vm.fnselectaprvr(vm.bplc_sn);
            }else if(vm.$store.state.global.userInfo.bplc_yn == 'N' && vm.$store.state.global.userInfo.bplc_sn != 0){
                vm.bplc = vm.$store.state.global.userInfo.bplc_nm;
                vm.bplc_sn = vm.$store.state.global.userInfo.bplc_sn;
                vm.fnselectaprvr(vm.bplc_sn);
            }
            
            vm.aprvr1 = vm.$store.state.global.userInfo.user_id;
            vm.aprvr1_nm = vm.$store.state.global.userInfo.user_name;

            vm.fnSelectEdulist();
            if(vm.uid != "" && vm.uid != undefined){
                setTimeout(function() {
                    vm.fnEduWrite();
                }, 100);
            }else{
                vm.aprvr1_img = vm.$store.state.global.userInfo.aprvr_path.charAt() == '/' ? vm.$store.state.global.userInfo.aprvr_path : vm.$store.state.global.userInfo.aprvr_path.substr(2);
            }
        },
        deactivated:function(){
            this.$destroy();
        },
         methods: {
            fnEduWrite:function(){
                let vm = this;
                
                Axios.post("/selectEdusdcWrite.do",{edu_sn:vm.uid})
                .then(function(res){
                    vm.bplc = res.data.hsEdList[0].bplc_nm;
                    vm.bplc_sn = res.data.hsEdList[0].bplc_sn;

                    vm.selectEdu = res.data.hsEdList[0].edu_se_cd;
                    vm.fnEdu_Detail_Code(vm.selectEdu);

                    vm.edu_nm_ttl=res.data.hsEdList[0].edu_nm_ttl;
                    vm.edu_mthd=res.data.hsEdList[0].edu_mthd;
                    vm.edu_plc=res.data.hsEdList[0].edu_plc;
                    vm.edu_instr=res.data.hsEdList[0].edu_instr_nm;
                    vm.edu_instr_sn=res.data.hsEdList[0].edu_instr;
                    
                    vm.selectEdu_se = res.data.hsEdList[0].edu_detail_cd;
                    vm.edu_detail_etc = res.data.hsEdList[0].edu_detail_etc;

                    vm.assign_yn = res.data.hsEdList[0].assign_yn;
                    vm.y_cnt = res.data.hsEdList[0].y_cnt;
                    
                    
                    $(".datepicker").val(res.data.hsEdList[0].edu_dt);
                    vm.edu_bgng_hour = res.data.hsEdList[0].edu_bgng_tm.split(':')[0];
                    vm.edu_bgng_min = res.data.hsEdList[0].edu_bgng_tm.split(':')[1];
                    vm.edu_end_hour = res.data.hsEdList[0].edu_end_tm.split(':')[0];
                    vm.edu_end_min = res.data.hsEdList[0].edu_end_tm.split(':')[1];
                    
                    vm.aprvr1 = res.data.hsEdList[0].aprvr1;
                    vm.aprvr1_nm = res.data.hsEdList[0].aprvr1_nm;
                    if(res.data.hsEdList[0].aprvr2 == null){
                        vm.aprvr2 = '';
                        vm.aprvr2_nm = '';
                    }else{
                        vm.aprvr2 = res.data.hsEdList[0].aprvr2;
                        vm.aprvr2_nm = res.data.hsEdList[0].aprvr2_nm;
                    }
                    vm.aprvr3 = res.data.hsEdList[0].aprvr3;
                    vm.aprvr3_nm = res.data.hsEdList[0].aprvr3_nm;

                    vm.edu_cn=res.data.hsEdList[0].cmmn_cn;
                    vm.indiv_cn=res.data.hsEdList[0].indiv_cn;
                    
                    vm.aprvr1_atrz_yn = res.data.hsEdList[0].aprvr1_atrz_yn
                    vm.aprvr2_atrz_yn = res.data.hsEdList[0].aprvr2_atrz_yn
                    vm.aprvr3_atrz_yn = res.data.hsEdList[0].aprvr3_atrz_yn
                    if(res.data.hsEdList[0].aprvr1_atrz_yn == "Y"){
                        vm.aprvr1_img = res.data.hsEdList[0].aprvr1_img.charAt() == '/' ? res.data.hsEdList[0].aprvr1_img : res.data.hsEdList[0].aprvr1_img.substr(2);
                    }
                    if(res.data.hsEdList[0].aprvr2_atrz_yn == "Y"){
                        vm.aprvr2_img = res.data.hsEdList[0].aprvr2_img.charAt() == '/' ? res.data.hsEdList[0].aprvr2_img : res.data.hsEdList[0].aprvr2_img.substr(2);
                    }
                    if(res.data.hsEdList[0].aprvr3_atrz_yn == "Y"){
                        vm.aprvr3_img = res.data.hsEdList[0].aprvr3_img.charAt() == '/' ? res.data.hsEdList[0].aprvr3_img : res.data.hsEdList[0].aprvr3_img.substr(2);
                    }

                    let list = vm.edu_instr_sn.split(',');
                    for(let i=0; i<list.length; i++){
                        vm.popupinstrlist.push(list[i]);
                    }

                    //참석자
                    vm.nmpr = res.data.participantList;

                    vm.viewModel.filelist = res.data.fileList;

                    vm.$refs.files.fnFileLoadList(vm.viewModel.filelist);
                })
            },
            fnUpload:function(){
                let vm = this;
                
                let frm = new FormData();
                let filecnt = 0;

                for(let i=0; i<vm.viewModel.filelist.length; i++) {
                    let key = vm.viewModel.filelist[i].file_seq;
                    if(vm.viewModel.filelist[i].file != null) {
                        filecnt++;
                        frm.append("fileTitle", vm.viewModel.filelist[i].file_title);
                        frm.append("uploadFiles", vm.viewModel.filelist[i].file);
                        if(vm.viewModel.filelist[i].file_sn){
                            frm.append("deleteFiles", vm.viewModel.filelist[i].file_sn);
                        }
                        frm.append("key", 0)
                    } else {
                        if(vm.viewModel.filelist[i].file == undefined){

                            if(vm.viewModel.filelist[i].file_sn != undefined){
                                filecnt++;
                            }
                        }else{
                            frm.append("fileTitle", vm.viewModel.filelist[i].file_title);
                            frm.append("key", key)
                        }
                    }
                }
                for(let i=0; i<vm.viewModel.deletefileList.length; i++){
                    frm.append("deleteFiles", vm.viewModel.deletefileList[i]);
                }

                if(filecnt == 0){
                    alert("교안을 등록해주세요.");
                    return false;
                }
                frm.append("filePath", "hsEd");

                let send={
                    bplc_sn:vm.bplc_sn,
                    edu_se_cd:vm.selectEdu,
                    edu_detail_cd:vm.selectEdu_se,
                    edu_detail_etc:vm.edu_detail_etc,
                    edu_nm_ttl:vm.edu_nm_ttl,
                    edu_mthd:vm.edu_mthd,
                    edu_dt:$(".datepicker").val(),
                    edu_bgng_tm: vm.edu_bgng_hour + ':' + vm.edu_bgng_min,
                    edu_end_tm: vm.edu_end_hour + ':' + vm.edu_end_min,
                    edu_plc:vm.edu_plc,
                    edu_instr:vm.edu_instr_sn,
                    edu_cn:vm.edu_cn,
                    indiv_cn:vm.indiv_cn,
                    aprvr1:vm.aprvr1,
                    aprvr2:vm.aprvr2 == '' ? null : vm.aprvr2,
                    aprvr3:vm.aprvr3,
                    aprvr1_atrz_yn:'Y',
                    aprvr2_atrz_yn:vm.aprvr2 == '' ? '' : vm.aprvr2_atrz_yn == 'Y' ? 'Y' : 'N',
                    aprvr3_atrz_yn: vm.aprvr3_atrz_yn == 'Y' ? 'Y' : 'N',
                    reg_id:vm.$store.state.global.userInfo.user_id,
                    participantList: vm.nmpr,
                    assign_yn: vm.assign_yn,
                }

                if(!vm.fnEssential()) return "fail"; 
                if(vm.uid != "" && vm.uid != undefined){
                    if(confirm("수정하시겠습니까?")){
                        send.edu_sn = vm.uid;

                        frm.append('data', new Blob([ JSON.stringify(send) ], {type : "application/json"}));
                        Axios.post('/updateEduplan.do',frm).then(function(){
                            vm.isSaved = true;
                            alert("수정되었습니다.");
                            window.location.href='/ohsms/hsEd/etcHsEdc.do#/';
                        }).catch(function(ex) {
                            alert(Message.ERROR);
                        });
                    }else{
                        alert("수정을 취소하였습니다.");
                    }
                }else{
                    if(confirm("등록하시겠습니까?")){
                        frm.append('data', new Blob([ JSON.stringify(send) ], {type : "application/json"}));

                        Axios.post('/insertEduplan.do',frm).then(function(){
                            vm.isSaved = true;
                            alert("등록되었습니다.");
                            window.location.href='/ohsms/hsEd/etcHsEdc.do#/';
                        }).catch(function(ex) {
                            alert(Message.ERROR);
                        });
                    }else{
                        alert("등록을 취소하였습니다.");
                    }
                }
            },
            fnSelectEdulist:function(){
                let vm = this;
                Axios.post('/hsEd/code.do',{}).then(function(res){
                    vm.eduCodeList = res.data.hsEdList;
                })
            },
            fnEdu_Detail_Code:function(value){
                let vm = this;
                vm.edu_cn = "";
                vm.indiv_cn = "";
                vm.selectEdu_se = "";
                vm.edu_detail_etc = "";

                if(value != 'EA06'){
                    Axios.post('/hsEd/detail/code.do',{edu_se_cd:value}).then(function(res){
                        vm.eduCodeDetailList = res.data.hsEdList;
                        if(value=='EA05')vm.fnCodeEdu_cn('EA05-D01');
                        if(value=='EA04')vm.fnCodeEdu_cn('EA04-D01');
                    })    
                }
            },
            fnCodeEdu_cn:function(detail_code){
                let vm = this;
                
                var edu_cn = vm.eduCodeDetailList.filter(item => item.edu_detail_cd == detail_code);
                vm.edu_cn = edu_cn[0].cmmn_cn;
                vm.indiv_cn = edu_cn[0].indiv_cn == null ? "" : edu_cn[0].indiv_cn;
                vm.selectEdu_se = detail_code;
            },
            fnInstrpopup:function(){
                let vm = this;
                if(vm.$store.state.global.userInfo.bplc_yn == 'N' && vm.bplc == ""){
                    vm.$refs.bplc.focus();
                    return alert("현장명을 선택해주세요.");
                }
                vm.isinstr = true;
                vm.isaprvr = false;
                vm.bplcPop = false;
                vm.participop = false;
                vm.$nextTick(function() {
                    if(vm.isinstr) {
                        vm.$refs.Instrpopup.fnInit(vm.popupinstrlist,vm.bplc_sn);
                    }
                })
            },
            fnAprvrpopup:function(i){
                let vm = this;
                
                if(vm.$store.state.global.userInfo.bplc_yn == 'N' && vm.bplc == ""){
                    vm.$refs.bplc.focus();
                    return alert("현장명을 선택해주세요.");
                }
                vm.aprvIndex = i;
                vm.isaprvr = true;
                vm.isinstr = false;
                vm.bplcPop = false;
                vm.participop = false;
                vm.$nextTick(function() {
                    if(vm.isaprvr){
                        vm.$refs.Aprvrpopup.fnInit();
                    }                
                })
            },
            fnParticipopup:function(){
                let vm = this;
                
                if(vm.bplc == ""){
                    vm.$refs.bplc.focus();
                    return alert("현장명을 선택해주세요.");
                }

                vm.isaprvr = false;
                vm.isinstr = false;
                vm.bplcPop = false;
                vm.participop = true;

                vm.$nextTick(function() {
                    if(vm.participop){
                        vm.$refs.participopup.fnInit(vm.bplc_sn);
                    }                
                })
            },
            fnParticiList: function(list){
                let vm = this;
                vm.nmpr = list;
            },
            fnMemberAdd: function(item){
                let vm = this;

                if(vm.aprvIndex == 2){
                    vm.aprvr2_nm = item.user_nm;
                    vm.aprvr2 = item.user_id;
                }else if(vm.aprvIndex == 3){
                    vm.aprvr3_nm = item.user_nm;
                    vm.aprvr3 = item.user_id;
                }

                vm.close(false);
            },
            close:function(bool){
                this.isinstr = bool;
                this.isaprvr = bool;
            },
            instrlist:function(instrlist,bool){
                this.isinstr = bool;

                this.edu_instr = '';
                this.edu_instr_sn = '';

                this.popupinstrlist=[];

                for(var i=0; i<instrlist.length; i++){
                    let item = instrlist[i];
                    if(this.edu_instr == ''){
                        this.edu_instr = item.user_nm;
                        this.edu_instr_sn = item.sessID;
                    }else{
                        this.edu_instr += ',' + item.user_nm;
                        this.edu_instr_sn += ',' + item.sessID;
                    }   

                    this.popupinstrlist.push(item.sessID);
                }
            },
            aprvrlist:function(aprvrlist,mode,bool){
                this.isaprvr = bool;
                if(mode == 1){
                    this.aprvr1_nm = aprvrlist[0].user_nm;
                    this.aprvr1 = aprvrlist[0].sessID;
                    this.aprvr1_img = "";
                    this.aprvr1popup=[];
                    this.aprvr1popup.push({sessID:aprvrlist[0].sessID,dept_nm:aprvrlist[0].dept_nm,jbgd_nm:aprvrlist[0].jbgd_nm,user_nm:aprvrlist[0].user_nm});
                }else if(mode == 2){
                    this.aprvr2_nm = aprvrlist[0].user_nm;
                    this.aprvr2 = aprvrlist[0].sessID;
                    this.aprvr2_img = "";
                    this.aprvr2popup=[];
                    this.aprvr2popup.push({sessID:aprvrlist[0].sessID,dept_nm:aprvrlist[0].dept_nm,jbgd_nm:aprvrlist[0].jbgd_nm,user_nm:aprvrlist[0].user_nm});
                }else{
                    this.aprvr3_nm = aprvrlist[0].user_nm;
                    this.aprvr3 = aprvrlist[0].sessID;
                    this.aprvr3_img = "";
                    this.aprvr3popup=[];
                    this.aprvr3popup.push({sessID:aprvrlist[0].sessID,dept_nm:aprvrlist[0].dept_nm,jbgd_nm:aprvrlist[0].jbgd_nm,user_nm:aprvrlist[0].user_nm});
                }
            },
            fnBack:function(){
                // if(confirm("작성을 중단하고 목록으로 가시겠습니까?")){
                    this.$router.push("/");
                // }
            },
            fnEssential:function(){
                const success= true;
                
                if(this.selectEdu == ""){
                    this.$refs.clsf.focus();
                    return alert(messageUtil(Message.VALIDATION_SELECT_REQUIRED, ["교육종류"]));
                }else if((this.selectEdu != 'EA04' && this.selectEdu != 'EA05' && this.selectEdu != 'EA06') && this.selectEdu_se == ""){
                    this.$refs.clsf_se.focus();
                    return alert(messageUtil(Message.VALIDATION_SELECT_REQUIRED, ["교육종류"]));
                // }else if((this.selectEdu == 'EA04' || this.selectEdu == 'EA05' || this.selectEdu == 'EA06') && this.edu_detail_etc == ""){
                //     this.$refs.clsf_detail.focus();
                //     return alert(messageUtil(Message.VALIDATION_REQUIRED, ["교육종류"]));
                }else if(this.edu_nm_ttl == ""){
                    this.$refs.edu_nm_ttl.focus();
                    return alert(messageUtil(Message.VALIDATION_REQUIRED, ["교육명"]));
                }else if(this.bplc == ""){
                    this.$refs.bplc.focus();
                    return alert(messageUtil(Message.VALIDATION_SELECT_REQUIRED, ["현장명"]));
                }else if(this.edu_mthd == ""){
                    this.$refs.edu_mthd.focus();
                    return alert(messageUtil(Message.VALIDATION_REQUIRED, ["교육방법"]));
                }else if($(".datepicker").val() == ""){
                    this.$refs.edu_dt.focus();
                    return alert(messageUtil(Message.VALIDATION_SELECT_REQUIRED, ["교육일시"]));
                }else if(this.edu_bgng_hour == ""){
                    this.$refs.edu_bgng_hour.focus();
                    return alert(messageUtil(Message.VALIDATION_SELECT_REQUIRED, ["교육일시 시작 시간"]));
                }else if(this.edu_bgng_min == ""){
                    this.$refs.edu_bgng_min.focus();
                    return alert(messageUtil(Message.VALIDATION_SELECT_REQUIRED, ["교육일시 시작 분"]));
                }else if(this.edu_end_hour == ""){
                    this.$refs.edu_end_hour.focus();
                    return alert(messageUtil(Message.VALIDATION_SELECT_REQUIRED, ["교육일시 종료 시간"]));
                }else if(this.edu_end_min == ""){
                    this.$refs.edu_end_min.focus();
                    return alert(messageUtil(Message.VALIDATION_SELECT_REQUIRED, ["교육일시 종료 분"]));
                }else if(this.edu_plc == ""){
                    this.$refs.edu_plc.focus();
                    return alert(messageUtil(Message.VALIDATION_REQUIRED, ["장소"]));
                }else if(this.edu_instr == ""){
                    this.$refs.edu_instr.focus();
                    return alert(messageUtil(Message.VALIDATION_SELECT_REQUIRED, ["교육강사"]));
                }else if(this.edu_cn == ""){
                    this.$refs.edu_cn.focus();
                    return alert(messageUtil(Message.VALIDATION_SELECT_REQUIRED, ["교육내용"]));
                }else if(this.aprvr1_nm == ""){
                    return alert(messageUtil(Message.VALIDATION_SELECT_REQUIRED, ["안전 결제자"]));
                }else if(this.aprvr3_nm == ""){
                    return alert(messageUtil(Message.VALIDATION_SELECT_REQUIRED, ["소장 결제자"]));
                }

                /*
                    등록시 필수 체크 문제등록 버전 
                    추후 업데이트 할 수 있음
                */
                // console.log(this.list);
                // for(var i=0; i<this.list.length; i++){
                //     if(this.list[i].title != ''){
                //         if(this.list[i].selectQuestion =="0"){
                //             for(var j=0; j<this.list[i].question.length; j++){
                //                 if(this.list[i].question[j].text !=''){
                //                     continue;
                //                 }else{
                //                     return alert(messageUtil(Message.VALIDATION_REQUIRED_VIEW_PROBLEM, [(i+1)+".문항 "+(j+1) +"번 보기"]));        
                //                 }
                //             }
                //         }else{
                //             continue;
                //         }
                //     }else{
                //         if(this.list[i].selectQuestion == "0"){
                //             return alert(messageUtil(Message.VALIDATION_REQUIRED, [(i+1)+".문항 객관식 제목"]));
                //         }else{
                //             return alert(messageUtil(Message.VALIDATION_REQUIRED, [(i+1)+".문항 주관식 문제"]));
                //         }
                //     }
                // }
                return success;
            },
            fnPopup: function () {
                let vm = this;
                vm.bplcPop = true;
                vm.isinstr = false;
                vm.isaprvr = false;
                vm.participop = false;

                vm.$nextTick(function () {
                    if (vm.bplcPop) {
                        vm.$refs.bplcpop.fnInit();
                    }
                })
            },
            fnBplcAdd: function (item) {
                let vm = this;

                vm.bplc_sn = item.bplc_sn;
                vm.bplc = item.bplc_nm;
            },
            fnselectaprvr:function(bplc_sn){
                let vm = this;

                Axios.post('/selectaprvr.do',{bplc_sn:bplc_sn}).then(function(res){
                    if(res.data.hsEdList.length != 0){
                        vm.aprvr3 = res.data.hsEdList[0].user_id;
                        vm.aprvr3_nm = res.data.hsEdList[0].user_nm;
                    }else{
                        alert("등록된 관리자가 존재하지 않습니다.");
                    }
                })
            }
            /* 
                안전보건 교육 등록시 교육문제 관련 함수들
                아직 보류이지만 다시 추가 될 수 있음 
            */
            // 
            // fnAnswerCheck:function(ind1,ind2){
            //     let vm = this;
            //     for(var i=0; i<vm.list[ind1].question.length; i++ ){
            //         if(i == ind2){
            //             vm.list[ind1].question[ind2].active = true;
            //         }else{
            //             vm.list[ind1].question[i].active = false;
            //         }
            //     }
            // },
            // fnQuizadd:function(){
            //     this.list.push({selectQuestion:'0',title:"",question:[{no:0,text:'',active:false,},{no:1,text:'',active:false,}]});
            // },
            // fnQuestionAdd:function(i,j){
            //     if(this.list[i].question.length == 5){
            //         alert("객관식 문항의 보기는 5개가 최대입니다.");
            //     }else{
            //         this.list[i].question.push({no:this.list[i].question.length,text:'',active:false,});
            //     };
            // },
            // fnQuestionDelete:function(i,j){
            //     if(this.list[i].question.length <= 2){
            //         return alert("객관식 보기의 최소갯수는 2개입니다.");
            //     }else{
            //         this.list[i].question.splice(j,1);
            //         for(var k=0; k<this.list[i].question.length; k++){ // 문항 no 재정의
            //             this.list[i].question[k].no = i;
            //         }
            //     }
            // },
            // fnQuestionListDelete:function(i){
            //     if(this.list.length <= 1){
            //         return alert("문항은 1개 이상이여야 합니다.");
            //     }else{
            //         this.list.splice(i,1); 
            //     }
            // },
            // fnQuestionCH:function(ind){
            //     if(this.list[ind].selectQuestion!="0"){
            //         Vue.delete(this.list[ind],'question');
            //     }
            // },
            ,fnFilelist:function(vm){
                this.viewModel.filelist = vm.filelist;
                this.viewModel.fileGroup = vm.fileGroup;
            },
            fnFileDelete:function(vm){
                this.viewModel.filelist = vm.filelist;
                this.viewModel.deletefileList = vm.deletefileList;
            }
        }
    };
</script>