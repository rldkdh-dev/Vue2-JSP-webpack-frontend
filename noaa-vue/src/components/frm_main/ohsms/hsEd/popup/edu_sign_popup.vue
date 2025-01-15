<template>
    <modal :pass="{popupTitle:'참석자 확인'}">
        <template v-slot:contents>
            <div>
                <h3>교육 정보</h3>
                <table class="table horizontal write">
                    <caption>계획등록</caption>
                    <tbody>
                        <tr>
                            <th scope="row"><label for="p1">교육종류</label></th>
                            <td>
                                {{ data.edu_se_nm }} {{ data.edu_se_cd != 'EA04' && data.edu_se_cd != 'EA05' && data.edu_se_cd != 'EA06' ? '-' + data.edu_detail_nm : '' }}
                            </td>
                            <th scope="row"><label for="p0">교육명</label></th>
                            <td>
                                {{ data.edu_nm_ttl }}
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">
                                <label for="p2">교육일시</label>
                            </th>
                            <td colspan="3">
                                {{ data.edu_dt }} {{ data.edu_bgng_tm }} ~ {{ data.edu_end_tm }}
                            </td>
                        </tr>
                        <tr>
                            <th scope="row"><label for="p31">교육방법</label></th>
                            <td>{{ data.edu_mthd }}</td>
                            <th scope="row">
                                <label for="p4">장소</label>
                            </th>
                            <td>
                                {{ data.edu_plc }}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="btn-group">
                <div class="right_side">
                    <!-- <a href="javascript:;" @click="upload" class="btn btn-purple">등록</a> -->
                    <a href="javascript:;" @click="upload" class="btn btn-purple" v-if="sign_yn == 'N'"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-signature-reset"></use></svg>참석자 확인</a>
                    <a href="javascript:;" @click="upload" class="btn btn-purple" v-if="sign_yn == 'Y'"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-signature-reset"></use></svg>참석자 확인 취소</a>
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
    Vue.component('modal',modal);
    // import imgsfile from "../../frm_main/imgsfileform2.vue"

    // Vue.component('imgfile',imgsfile);
    
    export default {
      data: function() {
        return {
            data:{},
            userInfo:{},
            edu_sn: '',
            sign_yn: ''
        };
      },
      mounted: function() {},
      methods: {
        fnInit:function(sn, sign_yn){
            modal.methods.fnInit();
            this.edu_sn = sn;
            this.sign_yn = sign_yn;
            this.userInfo = this.$store.state.global.userInfo
            this.fnDetail(sn);
        },
        fnClose:function(){
            if(confirm(" 창을 닫으시겠습니까? \n 창을 닫으면 저장되지 않는 참석확인은 저장되지 않습니다.")){
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
                bplc_sn: vm.data.bplc_sn,
                edu_sn: vm.edu_sn,
                user_id: vm.userInfo.user_id,
                ocpt_detail_cd: vm.userInfo.ocpt_detail_cd,
                sign_yn: vm.sign_yn == 'Y' ? 'N' : 'Y',
                assign_yn: vm.data.assign_yn
            }

            if(confirm(vm.sign_yn == 'Y' ? '참석확인 취소하시겠습니까?' : '참석확인 하시겠습니까?')){
                Axios.post("/updateEduSign.do", data)
                .then(function(response) {
                    if(response.data != 999){
                        if(vm.sign_yn == 'Y'){
                            alert("참석확인이 취소되었습니다.");
                        }else{
                            alert("참석확인이 완료되었습니다.");
                        }

                        vm.$emit('close',false);
                    }else{
                        alert("교육완료 처리하여 참석확인이 불가합니다.");
                        return false;
                    }
                    
            });
            }
            
        }
      }
    };
</script>