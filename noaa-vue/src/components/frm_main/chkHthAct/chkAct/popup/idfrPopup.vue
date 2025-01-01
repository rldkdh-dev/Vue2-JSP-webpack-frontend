<template>
    <modal :pass="{popupTitle: '점검활동 ' + (viewModel.data.idfr_sign_yn == 'Y' ? '확인취소' : '확인')}">
		<template v-slot:contents>
			<div>
                <table class="table horizontal write">
                    <caption>점검활동 상세</caption>
                    <tbody>
                        <tr>
                            <th scope="row"><label for="">점검유형</label></th>
                            <td>
                                <ul class="input_wrap">
                                    <li v-for="(item, i) in viewModel.chkTypeList" :key="i">
                                        <label :for="'chck_clsf'+item.CODE">
                                            <input type="checkbox" :id="'chck_clsf'+item.CODE" v-model="viewModel.data.chck_clsf" :value="item.CODE" disabled>{{ item.CODE_NM }}
                                         </label>
                                    </li>
                                </ul>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row"><label for="bplc">현장명</label></th>
                            <td>
                                {{ viewModel.data.bplc_nm }}
                            </td>
                        </tr>
                        <tr>
                            <th scope="row"><label for="">작성자</label></th>
                            <td>
                                {{viewModel.data.user_nm}}
                            </td> 
                        </tr>
                        <tr>
                            <th scope="row"><label for="">현장팀명</label></th>
                            <td>
                                {{viewModel.data.bplc_team}}
                            </td> 
                        </tr>
                        <tr>
                            <th scope="row"><label for="chck_dt">점검일자</label></th>
                            <td>
                                {{ viewModel.data.chck_dt|yyyyMMdd }}
                            </td> 
                        </tr>
                        <tr>
                            <th scope="row"><label for="">점검항목</label></th>
                            <td>
                                <div class="input_group">
                                    <input type="text" id="chck_mttr" title="점검항목" disabled v-model="viewModel.data.chck_mttr">
                                </div>
                            </td> 
                        </tr>
                    </tbody>
                </table>
            </div>
            <div>
                <h3>자율안전점검표</h3>
                <table class="table horizontal write">
                    <caption>점검활동 등록</caption>
                    <tbody>
                        <tr>
                            <th scope="row" class="w200"><label for="">확인자</label></th>
                            <td>
                                {{ viewModel.data.idfr_nm }}
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
                            <th scope="col">적정결과</th>
                            <th scope="col">조치</th>
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
                                {{ item.chck_rslt == 'Y' ? '적정' : '부적정' }}
                            </td>
                            <td class="text-left">
                                {{ item.actn }}
                            </td>
                        </tr>
                        <tr>
                            <th>점검의견</th>
                            <td colspan="4">
                                <textarea :id="'chck_opnn'" v-model="viewModel.data.chck_opnn" rows="4" style="border: none; background-color: white;" disabled></textarea>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="table_footer btn-right">
                <button class="btn btn-purple" @click.prevent="fnIdfr()"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-post-add"></use></svg>{{ viewModel.data.idfr_sign_yn == 'Y' ? '확인취소' : '확인' }}</button>
            </div>
		</template>
	</modal>
</template>

<script>
    import "es6-promise/auto";
    import Vue from "vue";
    import Axios from "axios";
    import Modal from '../../../popup/modal.vue'
    import Message, {messageUtil} from "../../../../../common/js/message";

    export default {
        props: ['pass'],
        data: function() {
            return {
                jobYn: 'N',
                viewModel:{
                    data:{
                        chck_clsf: [],
                        chck_rslt: 'G',
                    },
                    userInfo:{},
                    imgfilelist:[],
                    chkTypeList:[],
                    chkRsltList:[],
                    mttrPrgrsList:[],
                    mttrFileList:[],
                },
            };
        },
        components: {
            Modal
        },
        mounted: function() {
            let vm = this;
            // vm.fnInit();
        },
        methods: {
            fnInit:function(sn){
                let vm = this;
                vm.viewModel.userInfo = vm.$store.state.global.userInfo;

                Modal.methods.fnInit();
                
                vm.fnDetail(sn);
            },
            fnDetail:function(sn){
                let vm = this;
                let data = {
                    user_id: vm.viewModel.userInfo.user_id, 
                    chck_act_sn: sn,
                }
                Axios.post("/selectChkActDetail.do", data)
                .then(function(response) {
                    vm.viewModel.data = response.data.detail;
                    vm.viewModel.chkTypeList = response.data.chkTypeList;

                    vm.viewModel.itemList = response.data.itemList;

                    vm.viewModel.data.img_path = vm.viewModel.data.img_path.charAt() == '/' ? vm.viewModel.data.img_path : vm.viewModel.data.img_path.substr(2);
                    
                    //점검등록 체크
                    var arr = vm.viewModel.data.chck_clsf.split(',');
                    vm.viewModel.data.chck_clsf = [];
                    for(let i=0; i<arr.length; i++){
                        vm.viewModel.data.chck_clsf.push(arr[i]);
                    }
                });
            },
            fnIdfr(){
                let vm = this;

                let data = {
                    reg_id: vm.viewModel.userInfo.user_id,
                    chck_act_sn: vm.viewModel.data.chck_act_sn,
                    idfr_sign_yn: vm.viewModel.data.idfr_sign_yn == 'Y' ? 'N' : 'Y',
                };

                if(confirm(vm.viewModel.data.idfr_sign_yn == 'Y' ? "확인취소하시겠습니까?" : "확인하시겠습니까?")){
                    Axios.post("/updateIdfrSign.do", data).then(function(response) {
                        if(response.data == 1){
                            vm.$parent.fnList();
                            vm.$parent.idfrPop = false;
                            alert("저장되었습니다.");
                        }else{
                            alert(Message.ERROR);
                        }
                    }).catch(function(ex) {
                        alert(Message.ERROR);
                    });
                }
            },
        }
    };
</script>