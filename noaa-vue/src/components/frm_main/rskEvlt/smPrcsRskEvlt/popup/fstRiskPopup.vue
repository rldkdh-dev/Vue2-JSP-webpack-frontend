<template>
   <modal :pass="{popupTitle: '최초위험성평가 조회'}">
		<template v-slot:contents>
            <div>
                <table class="table horizontal write">
                    <tbody>
                        <tr>
                            <th scope="row">사업군</th>
                            <td>{{viewModel.data.bizgroup}}</td>
                        </tr>
                        <tr>
                            <th scope="row">공종</th>
                            <td>
                                <select title="대공종" id="lrge_worktype_sn" class="wa" @change="fnLrgChange();" v-model="viewModel.data.lrge_worktype">
                                    <option value="" selected>대공종 선택</option>
                                    <option v-for="(item,i) in viewModel.lrgList" :value="item.lrge_worktype" :key="i">{{ item.lrge_worktype }}</option>
                                </select>

                                <select title="중공종" id="middl_worktype_sn" class="wa" @change="fnMddlChange();" v-model="viewModel.data.middl_worktype">
                                    <option value="" selected>중공종 선택</option>
                                    <option v-for="(item,i) in viewModel.midList" :value="item.middl_worktype" :key="i">{{ item.middl_worktype }}</option>
                                </select>

                                <select title="소공종" id="middl_worktype_sn" class="wa" @change="fnSmlChange();" v-model="viewModel.data.small_worktype">
                                    <option value="" selected>소공종 선택</option>
                                    <option v-for="(item,i) in viewModel.smlList" :value="item.small_worktype" :key="i">{{ item.small_worktype }}</option>
                                </select>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div>
                <table class="table write narrow" id="tb">
                    <thead>
                        <tr>
                            <th>
                                <input type="checkbox" v-model="allSelected">
                            </th>
                            <th scope="col">작업절차</th>
                            <th scope="col">주요위험요인</th>
                            <th scope="col">안전대책</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, idx) in viewModel.itemList" :lrge="item.lrge_worktype_sn" :middl="item.middl_worktype_sn" :small="item.small_worktype_sn" :detail="item.detail_jobcn_sn" :risk="item.risk_factor_sn">
                            <td>
                                <input type="checkbox" :id="idx" :value="item" v-model="viewModel.selList">
                            </td>
                            <td class="text-left" :rowspan="viewModel.itemList.length" v-if="idx == 0">{{ item.job_process_nm }}</td>
                            <td class="text-left">{{ item.risk_factor }}</td>
                            <td class="text-left">{{ item.cntrpln }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="table_footer btn-right">
                <button @click="fnSelect()" class="btn btn-purple"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-checklist"></use></svg>선택</button>
            </div>
        </template>
    </modal>
</template>

<script>
    import "es6-promise/auto";
    import Vue from "vue";
    import Axios from "axios";
    import Modal from '../../../popup/modal.vue'
    
    export default {
        components: {
            Modal,
		},
        data: function() {
            return {
                viewModel:{
                    data:{
                        lrge_worktype:'',
                        middl_worktype:'',
                        small_worktype:'',
                    },
                    userInfo:{},
                    lrgList:[],
                    midList:[],
                    smlList:[],
                    itemList:[],
                    selList:[]
                }
            };
        },
        computed: {
            allSelected: {
                //getter
                get: function() {
                    return this.viewModel.itemList.length != 0 ? this.viewModel.itemList.length === this.viewModel.selList.length : [];
                },
                //setter
                set: function(e) {
                    this.viewModel.selList = e ? this.viewModel.itemList : [];
                },
            },
        }, 
        mounted: function() {
            let vm = this;
            // vm.fnInit();
        },
        methods: {
            //기본세팅
            fnInit:function(sn){
                let vm = this;
                vm.viewModel.userInfo = vm.$store.state.global.userInfo;
                
                Modal.methods.fnInit();

                //현장에 해당하는 사업군 대공종 가져오기
                vm.fnFstBizGroup(sn);
            },
            fnFstBizGroup: function(sn){
                let vm = this;
                let send = {
                    bplc_sn: sn,
                }
                
                Axios.post("/selectFstLrgGroup.do", send)
                .then(function(response) {

                    if(response.data.bizGroup != null){
                        vm.viewModel.data.bizgroup = response.data.bizGroup.bizgroup;
                        vm.viewModel.data.bizgroup_sn = response.data.bizGroup.bizgroup_sn;
                        vm.viewModel.data.bplc_sn = response.data.bizGroup.bplc_sn;
                        vm.viewModel.data.evl_sn = response.data.bizGroup.evl_sn;

                        vm.viewModel.lrgList = response.data.fstLrgList;
                        
                        // vm.viewModel.lrgList =  vm.viewModel.lrgList.reduce((item, current) => {
                        //     if (!item.some(item => item.lrge_worktype === current.lrge_worktype)) {
                        //         item.push(current);
                        //     }
                        //     return item;
                        // }, []);

                    }else{
                        alert("등록된 최초 위험성평가가 없습니다.\n최초위험성평가 메뉴에서 둥록 후 조회 해주세요.");
                    }
                    
                });
            },
            fnLrgChange: function(){
                let vm = this;
                let send = {
                    bplc_sn: vm.viewModel.data.bplc_sn,
                    bizgroup_sn: vm.viewModel.data.bizgroup_sn,
                    lrge_worktype: vm.viewModel.data.lrge_worktype,
                    evl_sn: vm.viewModel.data.evl_sn

                }

                Axios.post("/selectFstMidGroup.do", send)
                .then(function(response) {
                    vm.viewModel.midList = response.data.fstMidList;
                    
                    // vm.viewModel.midList =  vm.viewModel.midList.reduce((item, current) => {
                    //     if (!item.some(item => item.middl_worktype === current.middl_worktype)) {
                    //         item.push(current);
                    //     }
                    //     return item;
                    // }, []);

                    //초기화
                    vm.viewModel.data.middl_worktype = '';
                    vm.viewModel.data.small_worktype = '';
                });
            },
            fnMddlChange: function(){
                let vm = this;
                let send = {
                    bplc_sn: vm.viewModel.data.bplc_sn,
                    bizgroup_sn: vm.viewModel.data.bizgroup_sn,
                    lrge_worktype: vm.viewModel.data.lrge_worktype,
                    middl_worktype: vm.viewModel.data.middl_worktype,
                    evl_sn: vm.viewModel.data.evl_sn,
                }

                Axios.post("/selectFstSmlGroup.do", send)
                .then(function(response) {
                    vm.viewModel.smlList = response.data.fstSmlList;

                    // vm.viewModel.smlList =  vm.viewModel.smlList.reduce((item, current) => {
                    //     if (!item.some(item => item.small_worktype === current.small_worktype)) {
                    //         item.push(current);
                    //     }
                    //     return item;
                    // }, []);

                    //초기화
                    vm.viewModel.data.small_worktype = '';
                });
            },
            fnSmlChange: function(){
                let vm = this;
                let send = {
                    bplc_sn: vm.viewModel.data.bplc_sn,
                    bizgroup_sn: vm.viewModel.data.bizgroup_sn,
                    lrge_worktype: vm.viewModel.data.lrge_worktype,
                    middl_worktype: vm.viewModel.data.middl_worktype,
                    small_worktype: vm.viewModel.data.small_worktype,
                    evl_sn: vm.viewModel.data.evl_sn,
                }

                Axios.post("/selectFstList.do", send)
                .then(function(response) {
                    vm.viewModel.itemList = response.data.itemList;
                });
            },
            fnSelect: function(){
                let vm = this;

                if(vm.viewModel.selList.length > 0){
                    vm.$parent.fnSelect(vm.viewModel.selList);

                    vm.viewModel.selList = [];
                }else{
                    alert("선택된 최초위험성평가가 없습니다.");
                }

            }
        }
    };
</script>