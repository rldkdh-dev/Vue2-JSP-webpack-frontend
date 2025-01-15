<template>
    <div>

        <div class="contents">
            <div class="divide">
                <div>
                    <h3>기본정보</h3>
                    <table class="table horizontal write">
                        <caption>우리사고 기본정보 등록</caption>
                        <tbody>
                            <tr>
                                <th scope="row" colspan="3"><label for="oac01">현장명</label></th>
                                <!-- <td colspan="3" v-if="viewModel.SPT_NM">{{ viewModel.SPT_NM }}</td> -->
                                <!-- <td colspan="3" v-if="userInfo.bplc_yn == 'Y'">{{ viewModel.bplc_nm }}</td>
                                <td colspan="3" v-if="userInfo.bplc_yn !='Y'">
                                    <div class="input_btn">
                                        <input type="text"   v-if="!viewModel.bplc_sn" id="bplc" v-model="viewModel.bplc_nm">
                                        <input type="hidden" v-if="viewModel.bplc_sn" id="bplc" v-model="viewModel.bplc_sn">
                                        <input type="text" id="bplc_nm" v-if="viewModel.bplc_nm && viewModel.bplc_sn" v-model="viewModel.bplc_nm" disabled>    
                                        <button @click="fnBplcPopup();" v-if="userInfo.bplc_yn !='Y'"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-search"></use></svg></button>
                                    </div>
                                </td> -->

                                <td colspan="3" v-if="userInfo.hdofc_mngr_yn != 'Y'">
                                    <div class="input_group">
                                        {{ viewModel.bplc_nm }}
                                    </div>
                                </td>
                                <td colspan="3" v-if="userInfo.hdofc_mngr_yn == 'Y'">
                                    <div class="input_btn">
                                        <input type="text" id="bplc_nm" v-model="viewModel.bplc_nm">
                                        <input type="hidden" v-if="viewModel.bplc_sn" id="bplc" v-model="viewModel.bplc_sn">
                                        <button @click="fnBplcPopup();" v-if="userInfo.hdofc_mngr_yn =='Y'"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-search"></use></svg></button>
                                    </div>
                                </td>
                                <th scope="row"><label for="oac02">현장소장</label></th>
                                <td><input type="text" id="oac02" v-model="viewModel.bplc_mngr" ></td>
                            </tr>
                            <tr>
                                <th scope="row" colspan="3"><label for="oac03">현장주소</label></th>
                                <td colspan="3"><input type="text" id="oac03" v-model="viewModel.bplc_addr" ></td>
                                <th scope="row"><label for="oac04">현장전화</label></th>
                                <td><input type="text" id="oac04" v-model="viewModel.bplc_telno" oninput="this.value = this.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1').replace(/^(\d{2,3})(\d{3,4})(\d{4})$/, `$1-$2-$3`);"></td>
                            </tr>
                            <tr>
                                <th scope="row" colspan="3"><label for="oac05">도급관계</label></th>
                                <td colspan="5">
                                    <!-- <input type="text" id="oac05" v-model="viewModel.outsrc_rel" > -->
                                    <select title="도급관계" v-model="viewModel.outsrc_rel" >
                                        <option disabled value="" selected>도급관계 선택</option>
                                        <option value="">전체</option>
                                        <option value="원도급">원도급</option>
                                        <option value="하도급">하도급</option>
                                        <option value="외주/용역/위탁">외주/용역/위탁</option>
                                    </select>
                                </td>
                            </tr>
                            <tr>
                                <th scope="row" colspan="3" class="essential"><label for="oca_date">사고일자</label></th>
                                <td colspan="5">
                                    <div class="datepicker_box">
                                        <input type="text" class="datepicker" id="" title="datepicker" placeholder="사고일자"  readonly>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <th scope="row" colspan="3" class="essential"><label for="oac06">사고개요</label></th>
                                <td colspan="5"><textarea rows="10" title="사고개요" v-model="viewModel.acdnt_sumry" placeholder="사고개요 (6하 원칙 : 언제/어디서/누가/무엇을/어떻게/왜)" id="acdnt_sumry"></textarea></td>
                            </tr>
                            <tr>
                                <th scope="row" colspan="3" class="essential"><label for="oac07">사고원인</label></th>
                                <td colspan="5"><textarea title="사고원인" v-model="viewModel.acdnt_cause" id="acdnt_cause"></textarea></td>
                            </tr>
                            <tr>
                                <th scope="row" colspan="3" class="essential"><label for="oac08">기인물</label></th>
                                <td colspan="5"><input type="text" v-model="viewModel.org_cause_mtrl" id="org_cause_mtrl"></td>
                            </tr>
                            <tr>
                                <th scope="rowgroup" rowspan="3" class="w80">목격자</th>
                                <th scope="row" colspan="2" class="th2"><label for="">성명</label></th>
                                <td colspan="3">
                                    <div class="input_btn">
                                        <input type="text" id="wtn_nm" v-model="viewModel.wtn_nm">
                                        <button @click="fnUserPopup('WTN');" ><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-search"></use></svg></button>
                                    </div>
                                </td>
                                <th scope="row" class="th2"><label for="">전화</label></th>
                                <td><input type="text" id="" v-model="viewModel.wtn_tel" oninput="this.value = this.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1').replace(/^(\d{2,3})(\d{3,4})(\d{4})$/, `$1-$2-$3`);"></td>
                            </tr>
                            <tr>
                                <th scope="row" colspan="2" class="th2"><label for="">주소</label></th>
                                <td colspan="3"><input type="text" id="" v-model="viewModel.wtn_addr" ></td>
                                <th scope="row" class="th2"><label for="">소속</label></th>
                                <td><input type="text" id="" v-model="viewModel.wtn_ogdp" ></td>
                            </tr>
                            <tr>
                                <th scope="row" colspan="2" class="th2"><label for="">목격경위</label></th>
                                <td colspan="3"><input type="text" id="" v-model="viewModel.wtn_crcmstncs" ></td>
                                <th scope="row" class="th2"><label for="">직종</label></th>
                                <td><input type="text" id="" v-model="viewModel.wtn_ocpt" ></td>
                            </tr>
                            <tr>
                                <th scope="rowgroup" rowspan="3">안전조직</th>
                                <th scope="row" colspan="2" class="th2"><label for="">현장소장</label></th>
                                <td colspan="3">
                                    <div class="input_btn">
                                        <input type="text" id="" v-model="viewModel.safe_ognz_spt_hdch">
                                        <button @click="fnUserPopup('SO_SPT');" ><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-search"></use></svg></button>
                                    </div>
                                </td>
                                <th scope="row" rowspan="3" class="th2"><label for="">특기사항</label></th>
                                <td rowspan="3"><textarea rows="5" v-model="viewModel.safe_ognz_spcabl_mttr" ></textarea></td>
                            </tr>
                            <tr>
                                <th scope="row" colspan="2" class="th2"><label for="">작업책임자</label></th>
                                <td colspan="3">
                                    <div class="input_btn">
                                        <input type="text" id="" v-model="viewModel.safe_ognz_job_rbprsn">
                                        <button @click="fnUserPopup('SO_JOB');" ><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-search"></use></svg></button>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <th scope="row" colspan="2" class="th2"><label for="">안전관리자</label></th>
                                <td colspan="3">
                                    <div class="input_btn">
                                        <input type="text" id="" v-model="viewModel.safe_ognz_sfmngr">
                                        <button @click="fnUserPopup('SO_SFMNGR');" ><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-search"></use></svg></button>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <th scope="rowgroup" rowspan="9" class="bb0">첨부</th>
                                <th scope="row" colspan="2" class="th2"><label for="">통합본</label></th>
                                <td colspan="5"><fileform id="our_0" @filelist="fnFilelist"  @fileDelete="fnFileDelete" :pass="{id:'our_0', no:0}" v-bind="viewModel.filelist[id]" ref="files_0"></fileform></td>
                            </tr>
                            <tr>
                                <th scope="row" colspan="2" class="th2"><label for="">사고상황도</label></th>
                                <td colspan="5"><fileform id="our_1" @filelist="fnFilelist"  @fileDelete="fnFileDelete" :pass="{id:'our_1', no:1}" v-bind="viewModel.filelist[id]" ref="files_1"></fileform></td>
                            </tr>
                            <tr>
                                <th scope="row" colspan="2" class="th2"><label for="">목격자 진술서</label></th>
                                <td colspan="5"><fileform id="our_2" @filelist="fnFilelist"  @fileDelete="fnFileDelete" :pass="{id:'our_2', no:2}" v-bind="viewModel.filelist[id]" ref="files_2"></fileform></td>
                            </tr>
                            <tr>
                                <th scope="row" colspan="2" class="th2"><label for="">근로계약서</label></th>
                                <td colspan="5"><fileform id="our_3" @filelist="fnFilelist"  @fileDelete="fnFileDelete" :pass="{id:'our_3', no:3}" v-bind="viewModel.filelist[id]" ref="files_3"></fileform></td>
                            </tr>
                            <tr>
                                <th scope="row" colspan="2" class="th2"><label for="">급여명세서</label></th>
                                <td colspan="5"><fileform id="our_4" @filelist="fnFilelist"  @fileDelete="fnFileDelete" :pass="{id:'our_4', no:4}" v-bind="viewModel.filelist[id]" ref="files_4"></fileform></td>
                            </tr>
                            <tr>
                                <th scope="row" colspan="2" class="th2"><label for="">채용 시 안전교육</label></th>
                                <td colspan="5"><fileform id="our_5" @filelist="fnFilelist"  @fileDelete="fnFileDelete" :pass="{id:'our_5', no:5}" v-bind="viewModel.filelist[id]" ref="files_5"></fileform></td>
                            </tr>
                            <tr>
                                <th scope="row" colspan="2" class="th2 w100"><label for="">일일작업장 위험성평가표</label></th>
                                <td colspan="5"><fileform id="our_6" @filelist="fnFilelist"  @fileDelete="fnFileDelete" :pass="{id:'our_6', no:6}" v-bind="viewModel.filelist[id]" ref="files_6"></fileform></td>
                            </tr>
                            <tr>
                                <th scope="row" colspan="2" class="th2"><label for="">보호구지급대장</label></th>
                                <td colspan="5"><fileform id="our_7" @filelist="fnFilelist"  @fileDelete="fnFileDelete" :pass="{id:'our_7', no:7}" v-bind="viewModel.filelist[id]" ref="files_7"></fileform></td>
                            </tr>
                            <tr>
                                <th scope="row" colspan="2" class="th2"><label for="">정기안전교육</label></th>
                                <td colspan="5"><fileform id="our_8" @filelist="fnFilelist"  @fileDelete="fnFileDelete" :pass="{id:'our_8', no:8}" v-bind="viewModel.filelist[id]" ref="files_8"></fileform></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="approval">
                    <h3>결재 정보</h3>
                    <ul>
                        <li>
                            <a href="javascript:void(0);" :class="[viewModel.pic_id&&viewModel.pic_atrz_yn!='Y' ? 'set':null, viewModel.pic_id&&viewModel.pic_atrz_yn=='Y' ? 'signed':null]">
                                <p class="essential">담당자</p>
                                <div class="user_img">
                                     <!-- <img src="../../img/user1.png" alt="차안전">  -->
                                     <img v-if="user_picture" :src="user_picture"> 
                                </div>
                                <span v-if="!viewModel.pic_id">{{ userInfo.user_name }}</span> <!-- 담당자 -->
                                <span v-if="viewModel.pic_id">{{ viewModel.pic_nm }}</span>
                            </a>
                        </li>
                        <li>
                            <a href="javascript:void(0);" @click="fnUserPopup('MDTR', viewModel.mdtr_atrz_yn);" :class="[viewModel.mdtr_id&&viewModel.mdtr_atrz_yn!='Y' ? 'set':null, viewModel.mdtr_id&&viewModel.mdtr_atrz_yn=='Y' ? 'signed':null]">
                                <p>조정자</p>
                                <div class="user_img">
                                    <!-- <img src="../../img/user1.png" alt="차안전"> -->
                                </div>
                                <span v-if="!viewModel.mdtr_id">조정자 등록</span> <!-- 조정자 -->
                                <span v-if="viewModel.mdtr_id">{{ viewModel.mdtr_nm }}</span> 
                            </a>
                        </li>
                        <li>
                            <a href="javascript:void(0);" @click="fnUserPopup('DCSN');" :class="[viewModel.dcsn_id&&viewModel.dcsn_atrz_yn!='Y' ? 'set':null, viewModel.dcsn_id&&viewModel.dcsn_atrz_yn=='Y' ? 'signed':null]">
                                <p class="essential">결정자</p>
                                <div class="user_img">
                                    <!-- <img src="../../img/user1.png" alt="차안전"> -->
                                </div>
                                <span v-if="!viewModel.dcsn_id">결정자 등록</span> <!-- 결정자 -->
                                <span v-if="viewModel.dcsn_id">{{ viewModel.dcsn_nm }}</span>
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="write_area">
                <h3>재해자 정보</h3>
                <div class="table_top btn-right write_area">
                    <a href="javascript:void(0);" class="btn btn-light-purple" @click="fnDsstrAdd()" v-if="state != 'detail'"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-group-add"></use></svg>재해자 추가</a>
                    <a href="javascript:void(0);" class="btn btn-gray" @click="fnDsstrSub()" v-if="state != 'detail'"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-trash-can"></use></svg>삭제</a>
                </div>
                <table class="table horizontal write">
                    <tbody v-for="(item, i) in viewModel.dsstr_man" :key="index">
                        <tr>
                            <th rowspan="14" class="text-center"><input type="checkbox" title="재해자 선택" name="cd" :id="'cd_'+i" :value=i v-model="item.dsstr_blean" @click="fnCheckDsstr(item)"></th>
                            <th scope="rowgroup" rowspan="8">재해자 {{ i+1 }}</th>
                            <th scope="row" colspan="2" class="th2"><label for="">성명</label></th>
                            <td>
                                <div class="input_btn">
                                    <input type="text" id="" v-model="item.dsstr_man_nm">
                                    <button @click="fnUserPopup('DSSTR_MAN', null, i);" ><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-search"></use></svg></button>
                                </div>
                            </td>
                            <th scope="row" class="th2"><label for="">주민번호</label></th>
                            <td><input type="text" id="" v-model="item.dsstr_man_ihidnum" ></td>
                            <th scope="row" class="th2"><label for="">소속</label></th>
                            <td><input type="text" id="" v-model="item.dsstr_man_ogdp" ></td>
                        </tr>
                        <tr>
                            <th scope="row" colspan="2" class="th2"><label for="">주소</label></th>
                            <td colspan="3"><input type="text" id="" v-model="item.dsstr_man_addr" ></td>
                            <th scope="row" class="th2"><label for="">전화</label></th>
                            <td><input type="text" id="" v-model="item.dsstr_man_telno" oninput="this.value = this.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1').replace(/^(\d{2,3})(\d{3,4})(\d{4})$/, `$1-$2-$3`);"></td>
                        </tr>
                        <tr>
                            <th scope="row" colspan="2" class="th2 essential"><label for="">고용일자</label></th>
                            <td>
                                <div class="datepicker_box" :id="'datepicker_box_'+i" name="datepicker_box">
                                    <!-- <input type="text" id="" placeholder="고용일자 (예:20230101)" v-model="item.dsstr_man_emplym_dt" oninput="this.value = this.value.replace(/[^0-9]/g, '').replace(/(\..*)\./g, '$1');" maxlength="10" @keyup="fnDataMask(item.dsstr_man_emplym_dt, i)" > -->
                                    <input type="text" class="datepicker" name="datepicker" :id="'datepicker_'+i" placeholder="고용일자" readonly>
                                </div>
                            </td>
                            <th scope="row" class="th2"><label for="">직종</label></th>
                            <td><input type="text" id="" v-model="item.dsstr_man_ocpt" ></td>
                            <th scope="row" class="th2"><label for="">근무형태</label></th>
                            <td><input type="text" id="" v-model="item.dsstr_man_work_stle" ></td>
                        </tr>
                        <tr>
                            <th scope="row" colspan="2" class="th2"><label for="">경력</label></th>
                            <td><input type="text" oninput="this.value = this.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');" placeholder="숫자 입력 (년 단위)" id="" v-model="item.dsstr_man_career" ></td>
                            <th scope="row" class="th2"><label for="">일당</label></th>
                            <td><input type="text" oninput="this.value = this.value.replace(/[^0-9.]/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',');" placeholder="숫자 입력 (원 단위)" id="" v-model="item.dsstr_man_day_salary" ></td>
                            <th scope="row" class="th2"><label for="">기왕증</label></th>
                            <td><input type="text" id="" v-model="item.dsstr_man_anrx" ></td>
                        </tr>
                        <tr>
                            <th scope="row" colspan="2" class="th2"><label for="">취업구분</label></th>
                            <td colspan="5"><input type="text" id="" v-model="item.dsstr_man_empymn_se_cd" ></td>
                        </tr>
                        <tr>
                            <th scope="rowgroup" rowspan="3" class="th2"><label for="">외주업체</label></th>
                            <th scope="row" class="th2"><label for="">상호</label></th>
                            <td colspan="5"><input type="text" id="" v-model="item.outord_bzenty_conm" ></td>
                        </tr>
                        <tr>
                            <th scope="row" class="th2"><label for="">대표</label></th>
                            <td colspan="5"><input type="text" id="" v-model="item.outord_bzenty_rprs" ></td>
                        </tr>
                        <tr>
                            <th scope="row" class="th2"><label for="">전화</label></th>
                            <td colspan="5"><input type="text" id="" v-model="item.outord_bzenty_telno" oninput="this.value = this.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1').replace(/^(\d{2,3})(\d{3,4})(\d{4})$/, `$1-$2-$3`);"></td>
                        </tr>
                        <tr>
                            <th scope="rowgroup" rowspan="6">재해상태</th>
                            <th scope="row" colspan="2" class="th2"><label for="">병원명</label></th>
                            <td colspan="3"><input type="text" id="" v-model="item.dsstr_stts_hsptl_nm" ></td>
                            <th scope="row" class="th2"><label for="">전화</label></th>
                            <td><input type="text" id="" v-model="item.dsstr_stts_hsptl_tel" oninput="this.value = this.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1').replace(/^(\d{2,3})(\d{3,4})(\d{4})$/, `$1-$2-$3`);"></td>
                        </tr>
                        <tr>
                            <th scope="row" colspan="2" class="th2"><label for="">병원주소</label></th>
                            <td colspan="5"><input type="text" id="" v-model="item.dsstr_stts_hsptl_addr" ></td>
                        </tr>
                        <tr>
                            <th scope="row" colspan="2" class="th2"><label for="">재해정도</label></th>
                            <td colspan="3"><input type="text" id="" v-model="item.dsstr_stts_dgree" ></td>
                            <th scope="row" class="th2"><label for="">요양기간</label></th>
                            <td><input type="text" oninput="this.value = this.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');" placeholder="숫자 입력 (주 단위)" id="" v-model="item.dsstr_stts_rcper_pd" ></td>
                        </tr>
                        <tr>
                            <th scope="row" colspan="2" class="th2"><label for="">의사소견</label></th>
                            <td colspan="5"><input type="text" id="" v-model="item.dsstr_stts_dr_opin" ></td>
                        </tr>
                        <tr>
                            <th scope="rowgroup" rowspan="2" class="th2">물적피해</th>
                            <th scope="row" class="th2"><label for="">재산명</label></th>
                            <td colspan="5"><input type="text" id="" v-model="item.dsstr_stts_mtrl_dmge_prprty_nm" ></td>
                        </tr>
                        <tr>
                            <th scope="row" class="th2"><label for="">손해액</label></th>
                            <td colspan="5"><input type="text" oninput="this.value = this.value.replace(/[^0-9.]/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',');" placeholder="숫자 입력 (원 단위)" id="" v-model="item.dsstr_stts_mtrl_dmge_dmage_amt" ></td>
                        </tr>
                    </tbody>
                </table>
                <div class="table_footer btn-right">
                    <!-- <a href="" class="btn btn-purple"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-post-add"></use></svg>등록</a> -->
                    <a href="#" class="btn btn-purple" @click="fnOurCaseSave()" v-if="state != 'detail'"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-post-add"></use></svg>{{state_k}}</a>
                    <router-link to="/" class="btn btn-white"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-list-back"></use></svg>목록</router-link>
                </div>
            </div>
        </div>
        <!-- 조정자/목격자/작업책임자/재해자:현장, 결재자/현장소장:현장소장or없으면 본사사람, 안전관리자:안전보건팀 -->
        <bplcPopup ref="bplc" v-if="bplcPop==true" :pass="{dept_sn: userInfo.dept_sn, team_sn: userInfo.team_sn}"></bplcPopup>
        <userPopup ref="user_m" v-if="userPop_m==true" :pass="{title:'조정자', bplc_yn:'Y', bplc_sn: viewModel.bplc_sn}"></userPopup>
        <userPopup ref="user_d" v-if="userPop_d==true" :pass="{title:'결재자', hdofc_mngr_yn:'Y'}"></userPopup>
        <userPopup ref="user_w" v-if="userPop_w==true" :pass="{title:'목격자', bplc_yn:'Y', bplc_sn: viewModel.bplc_sn}"></userPopup>
        <userPopup ref="user_so_spt" v-if="userPop_so_spt==true" :pass="{title:'안전조직 현장소장', hdofc_mngr_yn:'Y'}"></userPopup>
        <userPopup ref="user_so_job" v-if="userPop_so_job==true" :pass="{title:'안전조직 작업책임자', bplc_yn:'Y', bplc_sn: viewModel.bplc_sn}"></userPopup>
        <userPopup ref="user_so_mng" v-if="userPop_so_mng==true" :pass="{title:'안전조직 안전관리자', dept_sn:2}"></userPopup>
        <userPopup ref="user_d_man" v-if="userPop_d_man==true" :pass="{title:'재해자', bplc_yn:'Y', bplc_sn: viewModel.bplc_sn}"></userPopup>
    </div>
</template>

<script>
    import "es6-promise/auto";
    import Vue from "vue";
    import Axios from "axios";
    import Fileform from "../../../../common/vue/fileform3.vue";
    import bplcPopup from "../../popup/bplc_popup.vue";
    import userPopup from "../../popup/user_popup.vue";
    import Common from "../../../../common/js/common.js";
    
    export default {
        components: {
            'fileform' : Fileform,
            'bplcPopup' : bplcPopup,
            'userPopup' : userPopup
        },
        data: function() {
            return {
                regDate : /^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/,
                imgsrc:'',
                today:'',
                uid:'',
                state:'',
                state_k:'',
                userInfo:'',
                user_picture:'',
                tIndex:0,
                bplcPop:false,
                userPop_m:false,
                userPop_d:false,
                userPop_w:false,
                userPop_so_spt:false,
                userPop_so_job:false,
                userPop_so_mng:false,
                userPop_d_man:false,
                d_man_index:0,
                user_bplc:{},
                searchBplcList: [],
                viewModel:{
                    // dsstr_man:[{dsstr_man_nm:'', dsstr_index: 0, dsstr_blean : false}],
                    dsstr_man:[{}],
                    acdnt_sumry:'',
                    acdnt_cause:'',
                    org_cause_mtrl:'',
                    dsstr_stts_dr_opin:'',
                    safe_ognz_spcabl_mttr:'',
                    outsrc_rel:'',
                    bplc_sn:'',
                    bplc_nm:'',

                    filelist:[[{seq: 0}],[{seq: 0}],[{seq: 0}],[{seq: 0}],[{seq: 0}],[{seq: 0}],[{seq: 0}],[{seq: 0}],[{seq: 0}],],
                    // fileGroup:[],
                    deletefileList: [],
                },
                isSaved:false,
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
            let vt = this;
            let vm = this.viewModel;
            let date = new Date();
            
            vt.userInfo = this.$store.state.global.userInfo;
            // vt.$store.commit("global/setPageInfo", {page:1});
            vt.today = Common.fnDateTimeStr(date);
            
            if(vt.userInfo.aprvr_path){
                vt.user_picture = vt.userInfo.aprvr_path.charAt() == '/' ? vt.userInfo.aprvr_path.aprvr_path : vt.userInfo.aprvr_path.substr(2);
            }
            
            vt.uid = window.location.href.split('/').pop();
            vt.state = window.location.href.split('/').reverse()[1];
            calendarInput();
            
            vt.$nextTick(function() {
                if(vt.state == 'update' && vt.uid != null){
                    vt.state_k = '수정';
                    vt.fnDetail(vt.uid);
                }else{
                    vt.viewModel = {
                        dsstr_man:[{}],
                        acdnt_sumry:'',
                        acdnt_cause:'',
                        org_cause_mtrl:'',
                        dsstr_stts_dr_opin:'',
                        safe_ognz_spcabl_mttr:'',
                        outsrc_rel:'',
                        bplc_sn:'',
                        bplc_nm:'',
                        filelist:[[{seq: 0}],[{seq: 0}],[{seq: 0}],[{seq: 0}],[{seq: 0}],[{seq: 0}],[{seq: 0}],[{seq: 0}],[{seq: 0}],],
                        // fileGroup:[],
                        deletefileList: [],
                    };
                    vt.state_k = '등록';
                    
                    
                    vt.fnInit();
                }
            })
	    },
        activated:function(){
            this.fnInit();
        },
        deactivated:function(){
            this.$destroy();
        },
        methods: {
            fnInit:function(){ 
                let vt = this;
                let vm = this.viewModel;
                
                vm.bplc_sn = (vt.userInfo.bplc_sn == 0) ? '' : vt.userInfo.bplc_sn;
                vm.bplc_nm = (vt.userInfo.bplc_sn == 0) ? '' : vt.userInfo.bplc_nm;
                vt.$nextTick(function() {
                    if(vm.bplc_sn != 0){
                        vt.fnBplcInfo();
                        vt.fnOcptInfo();
                    }
                })
                vt.$forceUpdate(); 
            },
            fnDetail:function(value){
                let vt = this;
                let h = 0;
                let data = {
                    acdnt_sn : value
                }
                Axios.post("/selectOursAcdtCsDetailList.do", data).then(function(response) {

                    vt.viewModel = response.data.oursAcdtCsRptp;
                    vt.viewModel.dsstr_man = response.data.oursAcdtCsDsstrList;
                    vt.viewModel.filelist = [[{seq: 0}],[{seq: 0}],[{seq: 0}],[{seq: 0}],[{seq: 0}],[{seq: 0}],[{seq: 0}],[{seq: 0}],[{seq: 0}],];
                    vt.viewModel.deletefileList = [];

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
                    vt.$nextTick(function() { //항목별 파일 리스트 데이터 
                        vt.$refs.files_0.viewModel.filelist = vt.viewModel.filelist;
                        vt.$refs.files_1.viewModel.filelist = vt.viewModel.filelist;
                        vt.$refs.files_2.viewModel.filelist = vt.viewModel.filelist;
                        vt.$refs.files_3.viewModel.filelist = vt.viewModel.filelist;
                        vt.$refs.files_4.viewModel.filelist = vt.viewModel.filelist;
                        vt.$refs.files_5.viewModel.filelist = vt.viewModel.filelist;
                        vt.$refs.files_6.viewModel.filelist = vt.viewModel.filelist;
                        vt.$refs.files_7.viewModel.filelist = vt.viewModel.filelist;
                        vt.$refs.files_8.viewModel.filelist = vt.viewModel.filelist;
					})
                    
                    $(".datepicker").val(vt.viewModel.acdnt_dt.substring(0,10));
                    
                    vt.$nextTick(function() {
                        vt.fnCalendarInput();
                        vt.$nextTick(function() {
                            if(vt.viewModel.dsstr_man.length > 0 && vt.viewModel.dsstr_man[0].dsstr_man_nm != null){
                                for(var i=0; i<vt.viewModel.dsstr_man.length; i++ ){
                                    $('#datepicker_'+i).val(vt.viewModel.dsstr_man[i].dsstr_man_emplym_dt.substring(0,10));
                                }
                            }
                        })
                    })
                    if(vt.viewModel.dsstr_man.length == 0){
                        vt.viewModel.dsstr_man = [{}];
                        $('#datepicker_0').val("");
                    }
                        
                }).catch(function(ex) {
                    console.log(ex);
                });;
            },
            fnOurCaseSave: function(){
                let vt = this;
                let frm = new FormData();
                for(let i=0; i<vt.viewModel.filelist.length; i++) {
                    // if(vt.viewModel.filelist[i] != undefined){
                        for(let j=0; j<vt.viewModel.filelist[i].length; j++) {
                            // if(vt.viewModel.filelist[i][j] != undefined){ 
                                let key = (vt.viewModel.filelist[i][j].file_sn==null)? vt.viewModel.filelist[i][j].seq:vt.viewModel.filelist[i][j].file_sn;
                                // console.log(key);
                                if(vt.viewModel.filelist[i][j].file != null) {
                                    frm.append("fileTitle["+i+"]", vt.viewModel.filelist[i][j].file_title);
                                    frm.append("uploadFiles["+i+"]", vt.viewModel.filelist[i][j].file);
                                    frm.append("file_se["+i+"]", i+1); //파일 구분 1~9
                                    frm.append("file_se_sn["+i+"]", j+1); //파일 구분별 순서
                                    // if(vt.viewModel.filelist[i][j].file_sn){
                                    //     frm.append("deleteFiles["+i+"]", vt.viewModel.filelist[i][j].file_sn);
                                    // }
                                    frm.append("key["+i+"]", 0)
                                // } else {
                                //     if(vt.viewModel.filelist[i][j].file == undefined){
                                        
                                    }else{
                                        // frm.append("file_se["+i+"]", i+1); //파일 구분 1~9
                                        // frm.append("file_se_sn["+i+"]", j+1); //파일 구분별 순서
                                        // frm.append("key["+i+"]", 0)
                                //     }
                                // }
                                }
                        }
                }
                if(vt.viewModel.deletefileList != null){
                    for(let i=0; i<vt.viewModel.deletefileList.length; i++){
                        frm.append("deleteFiles", vt.viewModel.deletefileList[i]);
                        // frm.append("del_sn", vt.viewModel.deletefileList[i]);
                    }
                }
                vt.fnOurCaseInsert(frm);
            },
            fnOurCaseInsert:function(frm){
                let vt = this;
                let vm = this.viewModel;
                let vm_dm = this.viewModel.dsstr_man; 
                
                if(!vm.acdnt_sumry){
                    alert("사고개요를 입력해주시기 바랍니다.");
                    $("#acdnt_sumry").focus();
                    return false;
                }else if(!vm.acdnt_cause){
                    alert("사고원인을 입력해주시기 바랍니다.");
                    $("#acdnt_cause").focus();
                    return false;
                }else if(!vm.org_cause_mtrl){
                    alert("기인물 정보를 입력해주시기 바랍니다.");
                    $("#org_cause_mtrl").focus();
                    return false;
                }
                if($(".datepicker").val() == ""){
                    return alert("사고일자를 확인해주시기 바랍니다.");
                }
                if($(".datepicker").val() > vt.today){
                    return alert("사고일자는 오늘일자보다 클 수 없습니다.");
                }
                if(vm_dm.length >= 1 && vm_dm[0].dsstr_man_nm != null){
                    for(var i=0; i<vm_dm.length; i++){
                        if($('#datepicker_'+i).val() == ""){
                            return alert("재해자 고용일자를 확인해주시기 바랍니다.");
                        }
                    }
                }
                if(!vm.dcsn_id){
                    alert("결재자를 선택해주시기 바랍니다.");
                    return false;
                }
                if(confirm(vt.state_k+" 하시겠습니까?")){
                    let data = {};
                    let data_d = {};
                    let data_dm = [];

                    data = {
                        acdnt_sn : (isNaN(vt.uid))? -1:vt.uid,
                        bplc_sn : vm.bplc_sn,
                        bplc_nm : vm.bplc_nm,
                        bplc_mngr : vm.bplc_mngr,
                        bplc_addr : vm.bplc_addr,
                        bplc_telno : vm.bplc_telno,
                        outsrc_rel : vm.outsrc_rel,
                        acdnt_dt : $(".datepicker").val(),
                        dsstrman_cnt : (vm_dm.length >= 1 && vm_dm[0].dsstr_man_nm != null && vm_dm[0].dsstr_man_nm != " ") ? vm_dm.length:null,
                        pic_id : vt.userInfo.user_id,
                        mdtr_id : vm.mdtr_id,
                        dcsn_id : vm.dcsn_id,
                        reg_id : vt.userInfo.user_id,
                        mod_id : vt.userInfo.user_id,
                    }
                    data_d = {
                        acdnt_sn : (isNaN(vt.uid))? null:vt.uid,
                        acdnt_sumry : vm.acdnt_sumry,
                        acdnt_cause : vm.acdnt_cause,
                        org_cause_mtrl : vm.org_cause_mtrl,
                        wtn_nm : vm.wtn_nm,
                        wtn_tel : vm.wtn_tel,
                        wtn_addr : vm.wtn_addr,
                        wtn_ogdp : vm.wtn_ogdp,
                        wtn_crcmstncs : vm.wtn_crcmstncs,
                        wtn_ocpt : vm.wtn_ocpt,
                        safe_ognz_spt_hdch : vm.safe_ognz_spt_hdch,
                        safe_ognz_spcabl_mttr : vm.safe_ognz_spcabl_mttr,
                        safe_ognz_job_rbprsn : vm.safe_ognz_job_rbprsn,
                        safe_ognz_sfmngr : vm.safe_ognz_sfmngr,
                    };
                    if(vm_dm.length >= 1 && vm_dm[0].dsstr_man_nm != null){
                        for(var i=0; i<vm_dm.length; i++ ){
                            data_dm.push({
                                acdnt_sn : (isNaN(vt.uid))? null:vt.uid,
                                dsstr_info_sn : i+1,
                                dsstr_man_nm : vm_dm[i].dsstr_man_nm,
                                dsstr_man_ihidnum : vm_dm[i].dsstr_man_ihidnum,
                                dsstr_man_ogdp : vm_dm[i].dsstr_man_ogdp,
                                dsstr_man_addr : vm_dm[i].dsstr_man_addr,
                                dsstr_man_telno : vm_dm[i].dsstr_man_telno,
                                // dsstr_man_emplym_dt : ($('#datepicker_'+i).val() == "") ? $('#datepicker_'+i).val(Common.fnDateTimeStr(date)) : $('#datepicker_'+i).val(), //date
                                dsstr_man_emplym_dt : $('#datepicker_'+i).val(),
                                dsstr_man_ocpt : vm_dm[i].dsstr_man_ocpt,
                                dsstr_man_work_stle : vm_dm[i].dsstr_man_work_stle,
                                dsstr_man_career : (vm_dm[i].dsstr_man_career == '' || vm_dm[i].dsstr_man_career == null)? 0 : vm_dm[i].dsstr_man_career, //int
                                dsstr_man_day_salary : (vm_dm[i].dsstr_man_day_salary == null)? 0 : vm_dm[i].dsstr_man_day_salary.replace(/[^0-9.]/g, ''), //int
                                dsstr_man_anrx : vm_dm[i].dsstr_man_anrx,
                                dsstr_man_empymn_se_cd : vm_dm[i].dsstr_man_empymn_se_cd,
                                outord_bzenty_conm : vm_dm[i].outord_bzenty_conm,
                                outord_bzenty_rprs : vm_dm[i].outord_bzenty_rprs,
                                outord_bzenty_telno : vm_dm[i].outord_bzenty_telno,
    
                                dsstr_stts_hsptl_nm : vm_dm[i].dsstr_stts_hsptl_nm,
                                dsstr_stts_hsptl_tel : vm_dm[i].dsstr_stts_hsptl_tel,
                                dsstr_stts_hsptl_addr : vm_dm[i].dsstr_stts_hsptl_addr,
                                dsstr_stts_dgree : vm_dm[i].dsstr_stts_dgree,
                                dsstr_stts_rcper_pd : (vm_dm[i].dsstr_stts_rcper_pd == '' || vm_dm[i].dsstr_stts_rcper_pd == null)? 0 : vm_dm[i].dsstr_stts_rcper_pd, //int
                                dsstr_stts_dr_opin : vm_dm[i].dsstr_stts_dr_opin,
                                dsstr_stts_mtrl_dmge_prprty_nm : vm_dm[i].dsstr_stts_mtrl_dmge_prprty_nm,
                                dsstr_stts_mtrl_dmge_dmage_amt : (vm_dm[i].dsstr_stts_mtrl_dmge_dmage_amt == null)? 0 : vm_dm[i].dsstr_stts_mtrl_dmge_dmage_amt.replace(/[^0-9.]/g, ''), //int
                            })
                        }
                    }
                    let send = {
                        oursAcdtCs : data,  
                        oursAcdtCsRptp : data_d, 
                        // oursAcdtCsDsstrList : null
                    };
                    if(vm_dm.length >= 1 && vm_dm[0].dsstr_man_nm != null && vm_dm[0].dsstr_man_nm != " "){
                        send.oursAcdtCsDsstrList = data_dm;
                    }
                    
                    frm.append('data', new Blob([ JSON.stringify(send) ], {type : "application/json"}));
                    frm.append("filePath", "oursAcdt");
                    
                    if(vt.state == 'update' && (vt.uid != '' && vt.uid != null && vt.uid != undefined)){
                        Axios.post("/updateOursAcdtCs.do", frm).then(function(res){
                            if(res.date != 0){
                                vt.isSaved = true;
                                alert("수정 되었습니다.");
                                vt.$router.push('/');
                            }else{
                                alert("수정이 중단되었습니다.");
                            }
                        }).catch(function(ex) {
                            console.log(ex);
                        });
                    }else{
                        //우리사고
                        Axios.post("/insertOursAcdtCs.do", frm).then(function(res){
                            if(res.date != 0){
                                vt.isSaved = true;
                                alert("등록 되었습니다.");
                                vt.$router.push('/');
                            }else{
                                alert("등록이 중단되었습니다.");
                            }
                        }).catch(function(ex) {
                            console.log(ex);
                        });
                    }
                }
            },
            
            fnDsstrAdd:function(){
                let vt = this;
                let vm = this.viewModel;
                let dml = vm.dsstr_man.length;
                let val = {dsstr_man_nm:' ', dsstr_index : vt.tIndex++, dsstr_blean : false}
                let obj = document.getElementsByName("cd");
                
                vm.dsstr_man.push(val);
                
                // obj[dml-1].checked = false;
                if(vt.state != 'update'){
                    for(var i=0; i<dml; i++){
                        obj[i].checked = false;
                        // console.log(i+" : " +obj[i].checked);
                    }
                }if(vt.state == 'update'){
                    vt.$forceUpdate(); 
                }
                $(function(){
                    
                })
                vt.$nextTick(function() {
                    vt.fnCalendarInput();
                    // for(let i=1; i<vm.dsstr_man.length; i++){
                        // $('#datepicker_'+i+'').addClass("hasDatepicker");
                        // let dp = document.getElementById('datepicker_box_'+i+'');
                        // let html = '<img class="ui-datepicker-trigger" src="/img/ic-calendar.png" alt="날짜선택" title="날짜선택">';
                        
                        // dp.insertAdjacentHTML('beforeend', html);
                        // vt.$forceUpdate(); 
                    // }
                })
            },
            fnCalendarInput:function() {
                $( ".datepicker" ).datepicker({
                    changeMonth: true,
                    changeYear: true,
                    showMonthAfterYear: true, //타이틀영역 월이전 년출력 (년/월 순)
                    dayNamesMin : ['일요일','월요일','화요일','수요일','목요일','금요일','토요일'], //요일 출력텍스트(축소형)
                    monthNamesShort : ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'], //달 출력텍스트
                    dateFormat: "yy-mm-dd", // 표기방법
                    showOtherMonths : true, //현재월에 이전,다음달 날짜표시
                    showOn: "both",
                    buttonImage: "/img/ic-calendar.png",
                    buttonImageOnly: true,
                    buttonText: "날짜선택",
                    showButtonPanel: true,
                    closeText: '닫기',
                    yearSuffix: '년',
                    beforeShow: function() {
                        $(this).datepicker("widget").removeClass("datepicker-hide-days");
                        $(this).datepicker("widget").removeClass("datepicker-year-wrap");
                        if($(this).hasClass('month')) {
                            $(this).datepicker("widget").addClass("datepicker-hide-days");
                        } else if($(this).hasClass('year')) {
                            $(this).datepicker("widget").addClass("datepicker-year-wrap");
                        }
                    },
                });
                $( ".datepicker.disabled" ).datepicker( "option", "disabled", true );	
            },
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
                            for(var j=i; j<obj.length; j++){
                                $('#datepicker_'+j).val($('#datepicker_'+(j+1)).val());
                            }
                        }
                    }
                    vt.fnCheckDsstr(p);
                }
            },
            fnCheckDsstr:function(param){
                let vt = this;
                // let obj = document.getElementsByName("cd");
                if(param != null & param != undefined)
                {
                    vt.viewModel.dsstr_man.forEach(item => {
                        item.dsstr_blean = false;
                    })

                    param.dsstr_blean = true;
                }
                vt.$forceUpdate(); 
                // for(var i=0; i<obj.length; i++){
                //     if(i != param){
                //         obj[i].checked = false;
                //     }
                //     console.log(obj[i].checked);
                // }
            },
            fnBplcPopup: function(){
                let vt = this;
				vt.bplcPop = true;
                vt.userPop_m = false;
                vt.userPop_d = false;
				vt.$nextTick(function() {
					if(vt.bplcPop) {
						vt.$refs.bplc.fnInit();
					}
				})
            },
            fnBplcAdd: function(item){
                let vt = this;
                let vm = this.viewModel;

                vm.bplc_sn = item.bplc_sn;
                vm.bplc_nm = item.bplc_nm;
                vt.$nextTick(function() {
                    vt.fnBplcInfo();
                    vt.fnOcptInfo();
                })
                vt.$forceUpdate(); 
            },
            fnBplcInfo:function(){
                let vt = this;
                let vm = this.viewModel;
                
                Axios.post("/selectOursAcdtCsBplcInfo.do", {bplc_sn : vm.bplc_sn}).then(function(res){
                    vm.bplc_mngr = res.data.oursAcdtCs.bplc_mngr 
                    vm.bplc_addr = res.data.oursAcdtCs.bplc_addr
                    vm.bplc_telno = res.data.oursAcdtCs.bplc_telno
                    if(res.data.oursAcdtCs.outsrc_rel != null){
                        vm.outsrc_rel = res.data.oursAcdtCs.outsrc_rel
                    }
                    vt.$forceUpdate(); 
                }).catch(function(ex) {
                    console.log(ex);
                });
            },
            fnOcptInfo:function(){
                let vt = this;
                let vm = this.viewModel;
                
                Axios.post("/selectOursAcdtCsOcptInfo.do", {bplc_sn : vm.bplc_sn}).then(function(res){
                    if(res.data != null){
                        vm.dcsn_id = res.data.user_id;
                        vm.dcsn_nm = res.data.user_nm;
                        vm.mdtr_id = null;
                        vm.mdtr_nm = null;
                        vm.safe_ognz_spt_hdch = res.data.user_nm;
                    }
                    vt.$forceUpdate(); 
                }).catch(function(ex) {
                    console.log(ex);
                });
            },
            fnUserPopup: function(value, mdtr_yn, d_man_index){
                let vt = this;
                vt.bplcPop = false;
                vt.userPop_d = false;
                vt.userPop_m = false;
                vt.userPop_w = false;
                vt.userPop_so_spt = false;
                vt.userPop_so_job = false;
                vt.userPop_so_mng = false;
                vt.userPop_d_man = false;
                
                if(value == 'MDTR'){ //조정자
                    if(mdtr_yn == 'N' || !mdtr_yn){
                        vt.userPop_m = true;
                        
                        vt.$nextTick(function() {
                            if(vt.userPop_m) {
                                vt.$refs.user_m.fnInit();
                            }
                        })
                    }
                }if(value == 'DCSN'){ //결정자
                    vt.userPop_d = true;
                    
                    vt.$nextTick(function() {
                        if(vt.userPop_d) {
                            vt.$refs.user_d.fnInit();
                        }
                    })
                }if(value == 'WTN'){ //목격자
                    vt.userPop_w = true;
                    
                    vt.$nextTick(function() {
                        if(vt.userPop_w) {
                            vt.$refs.user_w.fnInit();
                        }
                    })
                }if(value == 'SO_SPT'){//안전조직_현장소장
                    vt.userPop_so_spt = true;
                    
                    vt.$nextTick(function() {
                        if(vt.userPop_so_spt) {
                            vt.$refs.user_so_spt.fnInit();
                        }
                    })
                }if(value == 'SO_JOB'){//안전조직_작업책임자
                    vt.userPop_so_job = true;
                    
                    vt.$nextTick(function() {
                        if(vt.userPop_so_job) {
                            vt.$refs.user_so_job.fnInit();
                        }
                    })
                }if(value == 'SO_SFMNGR'){//안전조직_안전관리자
                    vt.userPop_so_mng = true;
                    
                    vt.$nextTick(function() {
                        if(vt.userPop_so_mng) {
                            vt.$refs.user_so_mng.fnInit();
                        }
                    })
                }if(value == 'DSSTR_MAN'){ //재해자
                    vt.d_man_index = d_man_index;
                    vt.userPop_d_man = true;

                    vt.$nextTick(function() {
                        if(vt.userPop_d_man) {
                            vt.$refs.user_d_man.fnInit();
                        }
                    })
                }
            },
            fnMemberAdd: function(item){
                let vt = this;
                let vm = this.viewModel;
                // vm.mttrList[vm.popIndex].actn_pic_nm = item.user_nm;
                // vm.mttrList[vm.popIndex].actn_pic = item.user_id;
                if(vt.userPop_m && !vt.userPop_d && !vt.userPop_w && !vt.userPop_so_spt && !vt.userPop_so_job && !vt.userPop_so_mng && !vt.userPop_d_man){ //조정자
                    vm.mdtr_id = item.user_id;
                    vm.mdtr_nm = item.user_nm;
                    vt.userPop_m = false;
                }if(vt.userPop_d && !vt.userPop_m && !vt.userPop_w && !vt.userPop_so_spt && !vt.userPop_so_job && !vt.userPop_so_mng && !vt.userPop_d_man){ //결정자
                    vm.dcsn_id = item.user_id;
                    vm.dcsn_nm = item.user_nm;
                    vt.userPop_d = false;
                }if(vt.userPop_w && !vt.userPop_d && !vt.userPop_m && !vt.userPop_so_spt && !vt.userPop_so_job && !vt.userPop_so_mng && !vt.userPop_d_man){ //목격자
                    vm.wtn_nm = item.user_nm;
                    vm.wtn_tel = item.user_phone;
                    vm.wtn_addr = item.user_addr;
                    vm.wtn_ogdp = item.bplc_nm;
                    vm.wtn_ocpt = item.ocpt_detail_nm;
                    vt.userPop_w = false;
                }if(vt.userPop_so_spt && !vt.userPop_m && !vt.userPop_d && !vt.userPop_w && !vt.userPop_so_job && !vt.userPop_so_mng && !vt.userPop_d_man){ //안전조직_현장소장
                    vm.safe_ognz_spt_hdch = item.user_nm;
                    vt.userPop_so_spt = false;
                }if(vt.userPop_so_job && !vt.userPop_m && !vt.userPop_d && !vt.userPop_w && !vt.userPop_so_spt && !vt.userPop_so_mng && !vt.userPop_d_man){ //안전조직_작업책임자
                    vm.safe_ognz_job_rbprsn = item.user_nm;
                    vt.userPop_so_job = false;
                }if(vt.userPop_so_mng && !vt.userPop_m && !vt.userPop_d && !vt.userPop_w && !vt.userPop_so_spt && !vt.userPop_so_job && !vt.userPop_d_man){ //안전조직_안전관리자
                    vm.safe_ognz_sfmngr = item.user_nm;
                    vt.userPop_so_mng = false;
                }if(vt.userPop_d_man && !vt.userPop_m && !vt.userPop_d && !vt.userPop_w && !vt.userPop_so_spt && !vt.userPop_so_job && !vt.userPop_so_mng){//재해자
                    //주소, 소속, 전화, 직종
                    vm.dsstr_man[vt.d_man_index].dsstr_man_nm = item.user_nm;
                    vm.dsstr_man[vt.d_man_index].dsstr_man_telno = item.user_phone;
                    vm.dsstr_man[vt.d_man_index].dsstr_man_addr = item.user_addr;
                    vm.dsstr_man[vt.d_man_index].dsstr_man_ogdp = item.bplc_nm;
                    vm.dsstr_man[vt.d_man_index].dsstr_man_ocpt = item.ocpt_detail_nm;
                    vt.userPop_d_man = false;
                }
            },
            fnFilelist:function(value){
                let vt = this;
                let vm = this.viewModel;
                let no = Number(value.no);
                vm.filelist[no] = value.filelist[no];

                // if(vm.fileGroup[no] == '' || vm.fileGroup[no] == undefined ){
                //     vm.fileGroup[no] = value.fileGroup;
                // }
            },
            fnFileDelete: function(value){
                let vm = this.viewModel;
                
                vm.deletefileList.push(value.deletefileList);
            },
            fnFileLoad:function(value){
                let vm = this.viewModel;
                if(value.viewModel.filelist.length>0) {
                    vm.filelist = value.viewModel.filelist;
                    for(let i=0; i<vm.filelist.length; i++) {
                        for(let j=0; j<vm.filelist[i].length; j++) {
                        vm.filelist[i][j].seq = j;
                        }
                    }
                }
            }
	    } 
    };
</script>
