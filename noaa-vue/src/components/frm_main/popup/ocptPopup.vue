<template>
<modal :pass="{popupTitle:'현장 권한정보'}" @close="fnParent()">
    <template v-slot:contents>
        <div style="float: left; width: 50%; padding: 1em;">
            <div>
                <table class="table">
                    <caption>직종 그룹</caption>
                    <thead>
                        <tr>
                            <th scope="col">코드</th>
                            <th scope="col">코드명</th>
                            <th scope="col">관리</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in groupList" :key="item.OCPT_SE_CD">
                            <td class="text-left">{{ item.OCPT_SE_CD }}</td>
                            <td class="text-left">{{ item.OCPT_SE_NM }}</td>
                            <td>
                                <button class="btn btn-small btn-default" @click="fnSetOcptDelete(item.OCPT_SE_CD)"><svg class="icon">
                                        <use xlink:href="../../img/symbol-defs.svg#icon-checklist"></use>
                                    </svg>삭제</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <div style="float: right; width: 50%; padding: 1em;">
            <div>
                <table class="table">
                    <thead>
                        <tr>
                            <th colspan="4" scope="col">직종 추가</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <th scope="row" class="w150"><label for="ocpt_se_cd">코드</label></th>
                            <td colspan="3">
                                <div class="input_group">
                                    <input type="text" id="ocpt_se_cd" name="ocpt_se_cd" title="코드" value="" placeholder="코드 입력" v-model="ocpt_se_cd">
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row" class="w150"><label for="ocpt_se_nm">코드명</label></th>
                            <td colspan="3">
                                <div class="input_group">
                                    <input type="text" id="ocpt_se_nm" name="ocpt_se_nm" title="코드명" value="" placeholder="코드명 입력" v-model="ocpt_se_nm">
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row" class="w150"><label for="sort_num">정렬순서</label></th>
                            <td colspan="3">
                                <div class="input_group">
                                    <input type="number" id="sort_num" name="sort_num" title="정렬순서" value="" placeholder="정렬순서 입력" v-model="sort_num">
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td colspan="3"></td>
                            <td colspan="1">
                                <div class="table_footer btn-right">
                                    <a href="#" class="btn primary" @click="fnSetOcptInsert()">추가하기</a>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </template>
</modal>
</template>

<script>
import 'es6-promise/auto'
import Vue from 'vue'
import Axios from 'axios'
import Modal from './modal.vue'
import Pager from "../../paging.vue";

export default {
    components: {
        Pager,
        Modal
    },
    data: function () {
        return {
            groupList: [],
            ocpt_se_cd : "",
            ocpt_se_nm : "",
            sort_num : "",
        }
    },
    methods: {
        fnInit: function () {
            Modal.methods.fnInit();
            this.fnSetList();
        },
        fnParent: function () {
            this.$parent.fnGetSelectList();
        },
        fnSetList: function () {
            let vm = this;
            let senddata = {
                mapperId: 'base.selectOcptMngGroupList'
            };
            Axios.post("/admindetail.do", senddata)
                .then(function (response) {
                    vm.groupList = response.data;
                });
        },
        fnSetOcptDelete: function(ocpt_cd){
            let vm = this;
            let data = {
                ocpt_se_cd : ocpt_cd,
                mapperId: 'base.deleteOcpt'
            }
            if(confirm("직종그룹을 정말 삭제하시겠습니까? 포함된 하위직종코드도 삭제됩니다.")){
            Axios.post("/admindelete.do", data)
                   .then(function(response) {
                    if(response.data == 1){
                        Axios.post("/admindelete.do", {ocpt_se_cd: ocpt_cd, mapperId: 'base.deleteOcpt2'})
                        .then(function(response) {
                                alert("삭제되었습니다.")
                                vm.fnSetList();
                        })
                   }
                })
            }
        },
        fnSetOcptInsert: function(){
            let vm = this;
            if(vm.ocpt_se_cd == "" || vm.ocpt_se_nm == "" || vm.sort_num == "")return alert("빈 값이 있습니다.");
            let data = {
                ocpt_se_cd : vm.ocpt_se_cd,
                ocpt_se_nm : vm.ocpt_se_nm,
                sort_num : vm.sort_num,
                mapperId: 'base.insertOcptMng'
            }
            if(confirm("직종그룹을 추가하시겠습니까?")){
            Axios.post("/admininsert.do", data)
                   .then(function(response) {
                    if(response.data == 1){
                       alert("추가되었습니다.")
                       vm.fnSetList();
                   }else{
                    alert("코드는 중복될 수 없습니다.");
                   }
                })
            }
        }
    }
}
</script>
