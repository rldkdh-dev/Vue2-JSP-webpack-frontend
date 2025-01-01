<template>
    <modal :pass="{popupTitle: '양식 삭제 사유'}">
		<template v-slot:contents>
            <div>
                <div class="contents">
                    <div>
                        <table class="table horizontal write">
                            <caption>양식 삭제 사유</caption>
                            <tbody>
                                <tr>
                                    <th scope="row" class="w180"><label for="bplc">현장명</label></th>
                                    <td>
                                        {{ viewModel.data.bplc_nm }}
                                    </td>
                                </tr>
                                <tr>
                                    <th scope="row"><label for="job_dt">작업일자</label></th>
                                    <td>
                                        {{ viewModel.data.job_dt|yyyyMMdd }}
                                    </td>
                                </tr>
                                <tr>
                                    <th scope="row"><label for="ordtm_risk_evl">팀명</label></th>
                                    <td>
                                        {{ viewModel.data.bplc_team_nm }}
                                    </td>
                                </tr>
                                <tr>
                                    <th scope="row"><label for="del_cd">삭제 사유</label></th>
                                    <td>
                                        <div class="input_group">
                                            <select title="삭제 사유 선택" v-model="viewModel.data.del_cd" id="del_cd" class="wa" @change="fnCdChange()">
                                                <option value=''>선택</option>
                                                <option v-for="item in viewModel.codeList" :value="item.CODE">{{ item.CODE_NM }}</option>
                                            </select>
                                            <input type="text" v-model="viewModel.data.del_cn" id="del_cn" :disabled="viewModel.data.del_cd != 'ETC'">
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div class="btn-group btn-right">
                        <button class="btn btn-purple" @click.prevent="fndelete()"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-delete-sweep"></use></svg>삭제</button>
                    </div>
                </div>
            </div>
		</template>
	</modal>
</template>

<script>
    import "es6-promise/auto";
    import Vue from "vue";
    import Axios from "axios";
    import Modal from '../../../popup/modal.vue'
    import fromValidation from "../../../../../common/js/fromValidation.js";
    import Message, {messageUtil} from "../../../../../common/js/message";
import { disable } from "ol/rotationconstraint.js";

    export default {
        props: ['pass'],
        data: function() {
            return {
                year: '',
                viewModel:{
                    codeList:[],
                    data:{},
                    userInfo:{},
                    itemList:[],
                },
            };
        },
        components: {
            Modal
        },
        mounted: function() {
            let vm = this;
        },
        methods: {
            fnInit:function(sn){
                let vm = this;
                vm.viewModel.userInfo = vm.$store.state.global.userInfo;

                Modal.methods.fnInit();
                
                vm.fnDetail(sn);
                vm.fnCodeList();
            },
            fnDetail: function(sn){
                let vm = this;

                let send = {
                    wrkshp_risk_evl_sn: sn,
                }

                Axios.post("/selectWpRskEvltFormDetail.do", send)
                .then(function(response) {
                    vm.viewModel.data = response.data.detail;
                    vm.viewModel.itemList = response.data.itemList;

                    vm.viewModel.data.del_cd = ''; // 초기화
                });
            },
            fnCdChange: function(){
                let vm = this;

                if(vm.viewModel.data.del_cd != 'ETC'){
                    vm.viewModel.data.del_cn = '';
                }
            },
            fnCodeList: function(){
                let vm = this;

                let send = {
                    CODE_GROUP: 'DEL_CD',
                }

                Axios.post("/selectCodeList.do", send)
                .then(function(response) {
                    vm.viewModel.codeList = response.data.codeList;
                });
            },
            fndelete: function(){
                let vm = this;

                let data = {
                    wrkshp_risk_evl_sn : vm.viewModel.data.wrkshp_risk_evl_sn,
                    del_cd : vm.viewModel.data.del_cd,  //양식 삭제 사유 코드(기입실수, 작업안함)
                    del_cn: vm.viewModel.data.del_cn,
                }

                const valiData = [
                    {id: 'del_cd', type: 'select', title: '삭제 사유'},
                ];
                
                if(!fromValidation(valiData)){
                    return false;
                }

                if(vm.viewModel.data.del_cd == 'ETC'){
                    if(vm.viewModel.data.del_cn == '' || vm.viewModel.data.del_cn == undefined){
                        alert("기타사유는 필수 입니다.")
                        $("#del_cn").focus();
                        return false;
                    }
                }

                if(confirm(Message.DELETE_CONFIRM)){
                    Axios.post("/deleteWpRskEvltForm.do", data)
                    .then(function(response) {
                        if(response.data == 1){
                            vm.$parent.fnList(1);
                            vm.$parent.delPop = false;
                            alert("삭제가 완료되었습니다.");
                        }
                    }).catch(function(ex){
                        alert(Message.ERROR);
                    });
                }
            }
        }
    };
</script>