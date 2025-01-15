<template>
    <div>
        <div class="popup modal active">
            <div class="popup_panel">
                <div class="popup_header">
                    <h4>결재 승인</h4>
                    <div class="icon_box">
                        <!-- <button class="btn btn-icon btn_fullscreen"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-fullscreen"></use></svg></button> -->
                        <button class="btn btn-icon btn_popup_close" @click="fnClose()"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-delete"></use></svg></button>
                    </div>
                </div>
                <div class="contents popup_contents">
                    <div>
                        <h3>기본정보</h3>
                        <table class="table horizontal write">
                            <caption>계획등록</caption>
                            <tbody>
                                <tr>
                                    <th scope="row"><label for="p1">교육종류</label></th>
                                    <td>
                                        {{ data.edu_se_nm }} - {{ data.edu_detail_cd != 'EA05' && data.edu_detail_cd != 'EA06' ?  data.edu_detail_nm : data.edu_detail_etc}}
                                    </td>
                                    <th scope="row"><label for="p0">교육명</label></th>
                                    <td>
                                        {{ data.edu_nm_ttl }}
                                    </td>
                                </tr>
                                <tr>
                                    <th scope="row"><label for="p3">현장명</label></th>
                                    <td>
                                        {{ data.bplc }}
                                    </td>
                                    <th scope="row"><label for="p31">교육방법</label></th>
                                    <td>{{ data.edu_mthd }}</td>
                                </tr>
                                <tr>
                                    <th scope="row">
                                        <label for="p2">교육일시</label>
                                    </th>
                                    <td> {{ data.edu_dt }} {{ data.edu_bgng_tm }} ~ {{ data.edu_end_tm }}</td>
                                    <th scope="row">
                                        <label for="p4">장소</label>
                                    </th>
                                    <td> {{ data.edu_plc }}</td>
                                </tr>
                                <tr>
                                    <th scope="row">
                                        <label for="p8">교육강사</label>
                                    </th>
                                    <td colspan="3">
                                        {{ data.edu_instr_nm }}
                                    </td>
                                </tr>
                                <tr>
                                    <th scope="row">
                                        <label for="p9">교육내용</label>
                                    </th>
                                    <td colspan="3">
                                        <textarea title="교육내용입력" placeholder="입력해주세요." id="" rows="13" v-model="data.cmmn_cn" ref="edu_cn" style="border: none; background-color: white;" disabled></textarea>
                                    </td>
                                </tr>
                                <tr v-if="selectEdu == 'EA02'">
                                    <th scope="row">
                                        <label for="p9">개별내용</label>
                                    </th>
                                    <td colspan="3">
                                        <textarea title="교육내용입력" placeholder="입력해주세요." id="" rows="13" v-model="data.indiv_cn" ref="indiv_cn" style="border: none; background-color: white;" disabled></textarea>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div class="btn-group">
                        <div class="right_side">
                            <a href="javascript:;" @click="upload" class="btn btn-purple">결재</a>
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
    import Message, {messageUtil} from "../../../common/message";
    // import imgsfile from "../../frm_main/imgsfileform2.vue"

    // Vue.component('imgfile',imgsfile);
    
    export default {
      data: function() {
        return {
            data:{},
            userInfo:{},
            edu_sn: '',
        };
      },
      mounted: function() {},
      methods: {
        fnInit:function(sn, no){
            this.edu_sn = sn;
            this.aprvr_to_no = no;
            this.userInfo = this.$store.state.global.userInfo;
            this.fnDetail(this.edu_sn);
        },
        fnClose:function(){
            if(confirm(" 창을 닫으시겠습니까? \n 창을 닫으면 저장되지 않는 승인은 저장되지 않습니다.")){
                this.$emit('close',false);
            }
        },
        fnDetail: function(sn){
            let vm = this;
            let send = {
                edu_sn:sn,
            }

            Axios.post("/selectEduDetail.do",send).then(function(res){
                vm.data = res.data.hsEdList[0];
            });
        },
        upload: function(){
            let vm = this;
            
            

            let data = {
                edu_sn: vm.edu_sn,
                aprvr_to_no: vm.aprvr_to_no,
                user_id: vm.userInfo.user_id
            }

            if(confirm('결재 하시겠습니까?')){
                Axios.post("/updateEduAprvr.do", data)
                .then(function(response) {
                    alert("결재가 완료되었습니다.");
                    vm.$emit('close',false);
                }).catch(function(ex) {
                    alert(Message.ERROR);
                });
            }
            
        }
      }
    };
</script>