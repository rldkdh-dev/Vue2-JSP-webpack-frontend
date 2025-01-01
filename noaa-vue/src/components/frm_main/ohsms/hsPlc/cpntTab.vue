<template>
<div>
    <div class="search_area opened" style="padding-right: 21.5rem !important" v-if="viewModel.userInfo.bplc_yn == 'N'">
        <div>
            <select id="list" v-model="viewModel.search.bplc_use_yn" class="wp10">
                <option value="A">전체</option>
                <option value="Y" selected="selected">운영</option>
                <option value="N">종료</option>
            </select>
            <select title="현장명 선택" class="wp20" v-model="viewModel.search.bplc_sn">
                <option value="" disabled>현장명 선택</option>
                <option v-for="(item, i) in viewModel.bplcList" :key="i" :value="item.bplc_sn">{{ item.bplc_nm }}</option>
            </select>
            <button @click="fnSearch()" class="btn btn-default" style="width: 5%; display:inline-flex;" ><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-search"></use></svg>조회</button>
        </div>
    </div>
    <div class="contents write">
        <div class="policy" v-if="viewModel.data.polcy != undefined">
            <div>
                <h3>[ 현장 안전보건방침 ]</h3>
                <div>
                    <p><strong>{{ viewModel.data.polcy }}</strong></p>
                    <!-- <p>{{ viewModel.data.polcy_detail }}</p> -->
                    <div class="right_side">
                        <p><strong>{{ viewModel.data.wrt_dt|yyyyMMdd }}</strong></p>
                        <p>{{ viewModel.data.bplc_nm }}</p>
                        <p class="sign_box">
                            현장소장<span>{{viewModel.data.bplc_mngr_nm}}</span>
                            <img :src="viewModel.data.sign_file_path" alt="서명" style="width:80px;">
                        </p>
                    </div>
                </div>
            </div>
            <div>
                <h3>[ {{ year }}년 현장 안전보건 목표 ]</h3>
                <div>
                    <p>
                        <strong>{{ viewModel.data.goal }}</strong>
                    </p>
                    <!-- <p>{{ viewModel.data.goal_detail }}</p> -->
                </div>
            </div>
        </div>
        <div class="policy" v-else-if="viewModel.userInfo.bplc_yn == 'Y'">
            <div>
                <h3>안전보건 방침/목표를 등록해주세요.</h3>
            </div>
        </div>
        <div class="policy" v-else-if="viewModel.userInfo.bplc_yn == 'N'">
            <div>
                <h3>현장을 선택해주세요.</h3>
            </div>
        </div>
        <!-- 현장소장, 안전관리자만 수정가능 -->
        <div class="btn-group btn-right" v-if="viewModel.userInfo.ocpt_detail_cd == 'MNG-01'">
            <router-link :to="'/update/'+viewModel.data.bplc_sn" class="btn btn-purple"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-edit"></use></svg>편집</router-link>
        </div>
    </div>
</div>
</template>

<script>
    import "es6-promise/auto";
    import Vue from "vue";
    import Axios from "axios";
    
    export default {
        components: {
        },
        data: function() {
            return {
                year:'', 
                viewModel:{
                    userInfo:{},
                    data:{},
                    search:{
                        bplc_sn:'',
                        bplc_use_yn:''
                    },
                    bplcList:[],
                }
            };
        },
        watch: {
            'viewModel.search.bplc_use_yn': {
                handler() {
                    let vm = this;
                    if(vm.viewModel.userInfo.user_roles == 'ROLE_001'){
                        vm.fnGetBplcList();
                    }
                }
            }
        },
        mounted: function() {
            let vm = this;
            vm.fnInit();
            vm.setNowDate();

            vm.$router.afterEach(function(to, from){
                vm.fnDetail(vm.viewModel.search.bplc_sn);
            })
        },
        methods: {
            fnInit:function(){
                let vm = this;
                vm.viewModel.userInfo = vm.$store.state.global.userInfo;
                vm.viewModel.search.bplc_use_yn = vm.viewModel.userInfo.bplc_yn == 'N' ? 'Y' : 'A';
                vm.viewModel.search.bplc_sn = (vm.viewModel.userInfo.bplc_yn == 'N' && (vm.viewModel.userInfo.bplc_sn == 0 || vm.viewModel.userInfo.bplc_use_yn == 'N')) ? '': vm.viewModel.userInfo.bplc_sn;

                if(vm.viewModel.search.bplc_sn != ''){
                    vm.fnDetail(vm.viewModel.userInfo.bplc_sn);
                }
                
            },
            fnDetail:function(sn){
                let vm = this;
                let data = {
                    bplc_sn: sn
                }
                Axios.post("/selectHsPlcDetail.do", data)
                .then(function(response) {
                    
                    if(response.data.detail != null){
                        vm.viewModel.data = response.data.detail;                
                        
                        if(vm.viewModel.data.wrt_dt == null){
                            if(vm.viewModel.userInfo.bplc_yn == 'N'){
                                alert("조회결과가 없습니다");
                            }
                        }else{
                            if(vm.viewModel.data.sign_file_path != null && vm.viewModel.data.sign_file_path != undefined){
                                if(vm.viewModel.data.sign_file_path.charAt()=='/') {       //리눅스 경로때문에 사용
                                    vm.viewModel.data.sign_file_path = vm.viewModel.data.sign_file_path;
                                } else {    //아닐경우
                                    vm.viewModel.data.sign_file_path = vm.viewModel.data.sign_file_path.substr(2);
                                }
                            }
                        }
                    }
                });
            },
            fnGetBplcList:function(){
                let vm = this;
                let data = {
                    bplc_use_yn: vm.viewModel.search.bplc_use_yn,
                    dept_sn: vm.viewModel.userInfo.dept_sn,
                    team_sn: vm.viewModel.userInfo.team_sn,
                };

                Axios.post("/selectHsPlcBplcList.do", data)
                .then(function(response) {
                    vm.viewModel.bplcList = response.data.bplcList;                

                    vm.viewModel.search.bplc_sn = '';
                    if(vm.viewModel.userInfo.bplc_use_yn == 'Y' && vm.viewModel.search.bplc_use_yn == 'Y'){
                        vm.viewModel.search.bplc_sn = vm.viewModel.userInfo.bplc_sn == 0 ? '' : vm.viewModel.userInfo.bplc_sn;
                    }
                });
            },
            fnSearch: function(){
                let vm = this;

                vm.fnDetail(vm.viewModel.search.bplc_sn);
            },
            setNowDate(){
                let vm = this;
                let myDate = new Date();
                vm.year = String(myDate.getFullYear());
            },
        }
    };
</script>