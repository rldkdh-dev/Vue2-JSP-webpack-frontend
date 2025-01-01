<template>
    <modal :pass="{popupTitle: (pass.title == undefined ? '사용자' : pass.title) + ' 선택'}">
		<template v-slot:contents>
            <div class="divide">
                <div>
                    <h3><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-group-add"></use></svg>선택된 참석자 목록</h3>
                    <div class="search_area">
                        <div>
                            <div class="search_container">
                                <div class="row">
                                    <select title="부서명" v-model="viewModel.search.dept_sn">
                                        <option value="">부서명 선택</option>
                                        <option v-for="item in viewModel.deptList" :key="item.dept_sn" :value="item.dept_sn">{{ item.dept_nm }}</option>
                                    </select>
                                    <input type="text" placeholder="성명을 입력하세요." title="성명 입력" v-model="viewModel.search.user_nm">
                                </div>
                            </div>
                            <div class="btn-group">
                                <button @click="fnRefresh" class="btn btn-default-line"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-refresh"></use></svg>초기화</button>
                                <button @click="fnGetInfo" class="btn btn-default"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-search"></use></svg>검색</button>
                            </div>
                        </div>
                    </div>
                    <div class="overflow-y border h500">
                        <table class="table w400">
                            <caption>참석자 목록</caption>
                            <thead>
                                <tr>
                                    <th scope="col">
                                        <label for="ch_all"><input type="checkbox" id="ch_all" title="전체 선택" v-model="allSelected">선택</label>
                                    </th>
                                    <th scope="col">부서명</th>
                                    <th scope="col">팀명</th>
                                    <th scope="col">직책</th>
                                    <th scope="col">성명</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="item in viewModel.userList.filter(data => data.atdrn_yn == 'N')" :key="item.user_id">
                                    <td>
                                        <input type="checkbox" title="선택" :value="item" :id="item" v-model="viewModel.checkList">
                                    </td>
                                    <td>{{ item.dept_nm }}</td>
                                    <td>{{ item.team_nm }}</td>
                                    <td>{{ item.jbttl_nm }}</td>
                                    <td>{{ item.user_nm }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div class="btn-group column">
                    <button @click="fnAdd" class="btn btn-large btn-white"><span class="chevron right"></span></button>
                    <button @click="fnDel" class="btn btn-large btn-white"><span class="chevron left"></span></button>
                </div>
                <div class="fx column w400">
                    <h3><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-user-check"></use></svg>참석자 선택</h3>
                    <div class="box list overflow-y">
                        <ul>
                            <li v-for="(item, index) in viewModel.userSelectList" :key="item.user_id">
                                <label :for="'bl01_'+index">
                                    <input type="checkbox" title="선택" :value="item" v-model="viewModel.checkList2" :id="'bl01_'+index">{{ item.dept_nm }} {{ item.team_nm }} {{ item.jbttl_nm }} {{ item.user_nm }}
                                </label>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <div class="btn-group btn-right">
                <button @click="fnSave();" class="btn btn-purple"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-post-add"></use></svg>등록</button>
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
                viewModel:{
                    search:{
                        dept_sn:'',
                        user_nm:'',
                    },
                    deptList:[],
                    userList:[],
                    userSelectList:[],
                    checkList:[],
                    checkList2:[],
                },
            };
        },
        components: {
            Modal
        },
        computed: {
            allSelected: {
                //getter
                get: function() {
                    return this.viewModel.userList.length != 0 ? this.viewModel.userList.length === this.viewModel.checkList.length : [];
                },
                //setter
                set: function(e) {
                    this.viewModel.checkList = e ? this.viewModel.userList : [];
                },
            },
        }, 
        mounted: function() {
            let vm = this;
        },
        methods: {
            fnInit:function(){
                let vm = this;
                vm.viewModel.userInfo = vm.$store.state.global.userInfo;

                Modal.methods.fnInit();

                vm.fnGetInfo();
            },
            fnGetInfo:function(){
                let vm = this;
                let data = {
                    dept_sn: vm.viewModel.search.dept_sn,
                    user_nm: vm.viewModel.search.user_nm,
                    bplc_yn: 'N',
                }

                Axios.post("/selectPwSftmtAtdrnInfo.do", data)
                .then(function(response) {
                    vm.viewModel.deptList = response.data.deptList;
                    vm.viewModel.userList = response.data.userList.filter(data=> data.user_id != 'system');                    
                }).then(function(){
                    for(let i = 0; i<vm.viewModel.userSelectList.length; i++){
                        let index = vm.viewModel.userList.findIndex(data => data.user_id == vm.viewModel.userSelectList[i].user_id);

                        if(index > -1){
                            vm.viewModel.userList[index].atdrn_yn = 'Y';
                        }
                    }
                });
            },
            //초기화
            fnRefresh: function(){
                let vm = this;
                vm.viewModel.search = {dept_sn:'',user_nm:''};
            },
            fnAdd:function(){
                let vm = this;

                for(let i = 0; i<vm.viewModel.checkList.length; i++){
                    let index = vm.viewModel.userList.findIndex(data => data.user_id == vm.viewModel.checkList[i].user_id);

                    let list = vm.viewModel.userSelectList.filter(data=> data.user_id == vm.viewModel.checkList[i].user_id);
                    
                    if(list.length == 0){
                        vm.viewModel.userSelectList.push(vm.viewModel.checkList[i]);
                    }

                    if(index > -1){
                        vm.viewModel.userList[index].atdrn_yn = 'Y';
                    }
                }

                //초기화 해주기
                vm.viewModel.checkList = []
            },
            fnDel: function(){
                let vm = this;
                for(let i = 0; i<vm.viewModel.checkList2.length; i++){
                    let index = vm.viewModel.userSelectList.findIndex(data => data.user_id ==vm.viewModel.checkList2[i].user_id);
                    vm.viewModel.userSelectList.splice(index, 1);

                    let ul_index = vm.viewModel.userList.findIndex(data => data.user_id ==vm.viewModel.checkList2[i].user_id);
                    if(ul_index > -1){
                        vm.viewModel.userList[ul_index].atdrn_yn = 'N';
                    }
                }

                //초기화 해주기
                vm.viewModel.checkList2 = []
            },
            fnSave:function(){
                let vm = this;
                //부모창에 선택한 값 전달
                vm.$parent.fnAtdrnList(vm.viewModel.userSelectList);
                //팝업 초기화
                vm.$parent.atdrnPop = false;
            }
        }
    };
</script>