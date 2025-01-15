<template>
    <modal :pass="{popupTitle:'참석자 선택'}">
        <template v-slot:contents>
            <div class="divide" style="width: 1000px;">
                <div>
                    <h3><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-group-add"></use></svg>참석자 목록</h3>
                    <div class="search_area">
                        <div>
                            <div class="search_container">
                                <div class="row">
                                    <select title="작업(조)팀 명" v-model="bplc_team_sn">
                                        <option value=0>선택</option>
                                        <option v-for="item in teamList" :key="item" :value="item.BPLC_TEAM_SN">{{ item.BPLC_TEAM_NM }}</option>
                                    </select>
                                    <input type="text" placeholder="이름을 입력하세요." title="이름 입력" v-model="user_nm" @input="user_nm = $event.target.value">
                                </div>
                            </div>
                            <div class="btn-group">
                                <a href="javascript:;" class="btn btn-default-line" @click="fnReset()"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-refresh"></use></svg>초기화</a>
                                <a href="javascript:;" class="btn btn-default" @click="fnBplcTeamMemList()"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-search"></use></svg>검색</a>
                            </div>
                        </div>
                    </div>
                    <div class="overflow-y border h500">
                        <table class="table">
                            <caption>참석자 목록</caption>
                            <thead>
                                <tr>
                                    <th scope="col"><label for="ch_all"><input type="checkbox" id="ch_all" title="전체 선택" v-model="selectAll" @change="selectAllItems">선택</label></th>
                                    <th scope="col">직책</th>
                                    <th scope="col">성명</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="item in list.filter(data=>data.chkYn != 'Y')" :key="item">
                                    <td><input type="checkbox" title="선택" v-model="item.selected"></td>
                                    <td>{{ item.ocpt_detail_nm }}</td>
                                    <td>{{ item.user_nm }}</td>
                                </tr>
                                <tr v-if="list.length == 0"><td colspan="3">검색 결과가 없습니다.</td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div class="btn-group column">
                    <button class="btn btn-large btn-white" @click="fnAdd"><span class="chevron right"></span></button>
                    <button class="btn btn-large btn-white" @click="fnRemove"><span class="chevron left"></span></button>
                </div>
                <div class="fx column">
                    <p style="text-align: right;">※이미 서명이 완료된 참석자를 제외할 수 없습니다.</p>
                    <h3><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-user-check"></use></svg>참석자 선택</h3>
                    <div class="box list overflow-y">
                        <ul>
                            <li class="on" v-for="(item, index) in selectlist" :key="item">
                                <label :for="'bl01_'+index"><input type="checkbox" title="선택" :id="'bl01_'+index" v-model="item.selected" :disabled="item.sign_yn == 'Y' ? true : false ">
                                    {{ item.ocpt_detail_nm+" "+item.user_nm }}</label>
                            </li>
                        </ul>
                        <!-- <ul>
                            <li><label for="bl01"><input type="checkbox" title="선택" id="bl01">중대재해예방지원 Part1 대리 차안전</label></li>
                            <li><label for="bl02"><input type="checkbox" title="선택" id="bl02">중대재해예방지원 Part1 대리 차안전</label></li>
                            <li class="on"><label for="bl03"><input type="checkbox" title="선택" id="bl03" checked>중대재해예방지원 Part1 대리 차안전</label></li>
                            <li><label for="bl04"><input type="checkbox" title="선택" id="bl04">중대재해예방지원 Part1 대리 차안전</label></li>
                        </ul> -->
                    </div>
                </div>
            </div>
            <div class="btn-group btn-right">
                <a href="#" class="btn btn-purple" @click="fnSummit"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-post-add"></use></svg>등록</a>
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
    
    export default {
      data: function() {
        return {
            edu_sn:0,
            bplc_sn:0,
            bplc_team_sn:0,
            teamList:[],
            list:[],
            selectAll: false,
            user_nm:"",
            selectlist:[],
            instrlist:[],
        };
      },
      mounted: function() {},
      methods: {
        fnInit:function(bplc_sn){
            modal.methods.fnInit();
            // this.edu_sn = sn;
            this.bplc_sn = bplc_sn;
            this.selectlist = JSON.parse(JSON.stringify(this.$parent.nmpr));
            this.fnBplcTeamList();
            this.fnBplcTeamMemList();
        },
        fnClose:function(){
            this.$emit('close',false);
        },
        fnBplcTeamList:function(){
            let vm = this;
            
            let senddata = {
                mapperId: 'base.selectBplcTeamList',
                // bplc_team_nm: vm.viewModel.search.text,
                bplc_sn: vm.bplc_sn,
            };

            Axios.post("/admindetail.do", senddata)
                .then(function (response) {
                    vm.teamList = response.data;
                });
        },
        fnBplcTeamMemList:function(){
            let vm = this;
            
            let senddata = {
                mapperId: 'comm.selectBplcTeamMemList',
                bplc_sn: vm.bplc_sn,
                bplc_team_sn: vm.bplc_team_sn,
                user_nm: vm.user_nm
            };

            Axios.post("/admindetail.do", senddata)
                .then(function (response) {
                    vm.list = response.data;
                }).finally(function (response){
                    vm.fnSet();
                });
        },
        fnReset:function(){
            let vm = this;

            vm.bplc_team_sn = 0;
            vm.user_nm = "";
        },
        selectAllItems:function() {
            // 전체 선택 버튼을 눌렀을 때, 모든 아이템의 selected 값을 selectAll의 값으로 설정합니다.
            let vm = this;
            for (var i = 0; i < vm.list.length; i++) {
                vm.list[i].selected = vm.selectAll;
            }
        },
        fnAdd:function(){
            let vm = this;
            // let chc = vm.addChenk(1,true); // 넣을떄 체크 
            
            let list = vm.list.filter(data=> data.selected == true);

            list.forEach(data=>{
                data.chkYn = 'Y';

                let index = vm.selectlist.findIndex(item => item.user_id == data.user_id);

                if(index == -1){
                    vm.selectlist.push({
                        user_id:data.user_id
                        ,user_nm:data.user_nm
                        ,ocpt_detail_cd:data.ocpt_detail_cd
                        ,ocpt_detail_nm:data.ocpt_detail_nm
                    });
                }
            });

            // vm.list = vm.list.filter(data=> data.selected == false);
        },
        fnRemove:function(){
            let vm = this;
            let flag = true;
            let orgList = vm.selectlist;
            let list = orgList.filter(data=> data.selected == true);
            
            list.forEach(data=>{
                let index = vm.list.findIndex(item => item.user_id == data.user_id);

                if(data.sign_yn == 'Y'){
                    flag = false;
                    data.selected = false;
                }else{
                    if(index > -1){
                        vm.$set(vm.list[index], 'chkYn', 'N');
                    }
                }
            });

            if(!flag){
                alert("이미 서명이 완료한 참석자는 선택 취소가 불가합니다.");
            }

            // vm.selectlist = orgList.filter(data=> data.selected != true);

            vm.selectlist = orgList.filter(data=> data.selected != true).map(item => {
                return {user_id:item.user_id
                        ,user_nm:item.user_nm
                        ,ocpt_detail_cd:item.ocpt_detail_cd
                        ,ocpt_detail_nm:item.ocpt_detail_nm
                        ,sign_yn:item.sign_yn}
            });

        },
        fnSet: function(){
            //이미 selectlist에 있는 값은 안 보이도록 처리 필요
            let vm = this;
            
            vm.list.forEach((data, index)=>{
                let idx = vm.selectlist.findIndex(item => item.user_id == data.user_id);

                if(idx > -1){
                    vm.$set(data, 'chkYn', 'Y');
                }
            });

        },
        fnSummit:function(){
            let vm =this;

            vm.$parent.fnParticiList(vm.selectlist);
            //팝업 초기화
            vm.$parent.participop = false;
        },
      },
      watch: {
        // 아이템들의 selected 상태가 바뀔 때마다 전체 선택 버튼 상태도 업데이트합니다.
        list: {
            handler() {
                // 모든 아이템이 선택되어 있는지 확인합니다.
                let vm = this; 
                var allSelected = true;
                for (var i = 0; i < vm.list.length; i++) {
                    if (!vm.list[i].selected) {
                        allSelected = false;
                        break;
                    }
                }
                // 모든 아이템이 선택되어 있으면 전체 선택 버튼도 선택 상태로, 아니면 선택되지 않은 상태로 설정합니다.
                vm.selectAll = allSelected;
            },
            deep: true
        }
      }
    };
</script>