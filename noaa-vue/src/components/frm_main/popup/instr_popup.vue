<template>
    <modal :pass="{popupTitle:'교육강사선택'}">
        <template v-slot:contents>
            <div class="divide" style="width: 1000px;"> <!-- 스타일 추후 수정 -->
                <div>
                    <h3><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-group-add"></use></svg>교육강사 목록</h3>
                    <div class="search_area">
                        <div>
                            <div class="search_container">
                                <div class="row">
                                    <select title="부서명" v-model="dept">
                                        <option value=0>선택</option>
                                        <option v-for="item in deptlist" :key="item" :value="item.dept_sn">{{ item.dept_nm }}</option>
                                    </select>
                                    <input type="text" placeholder="검색어를 입력하세요." title="검색어 입력" v-model="search" @input="search = $event.target.value">
                                </div>
                            </div>
                            <div class="btn-group">
                                <a href="javascript:;" class="btn btn-default-line" @click="fnUserdeptList(0,null)"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-refresh"></use></svg>초기화</a>
                                <a href="javascript:;" class="btn btn-default" @click="fnUserdeptList(dept,search)"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-search"></use></svg>검색</a>
                            </div>
                        </div>
                    </div>
                    <div class="overflow-y border h500">
                        <table class="table">
                            <caption>교육강사 목록</caption>
                            <thead>
                                <tr>
                                    <th scope="col"><label for="ch_all"><input type="checkbox" id="ch_all" title="전체 선택" v-model="selectAll" @change="selectAllItems">선택</label></th>
                                    <th scope="col">부서명</th>
                                    <th scope="col">직책</th>
                                    <th scope="col">성명</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="item in list" :key="item">
                                    <td><input type="checkbox" title="선택" v-model="item.selected"></td>
                                    <td>{{ item.dept_nm }}</td>
                                    <td>{{ item.jbgd_nm }}</td>
                                    <td>{{ item.user_nm }}</td>
                                </tr>
                                <tr v-if="list.length == 0"><td colspan="14">검색 결과가 없습니다.</td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div class="btn-group column">
                    <button class="btn btn-large btn-white" @click="fnAdd"><span class="chevron right"></span></button>
                    <button class="btn btn-large btn-white" @click="fnRemove"><span class="chevron left"></span></button>
                </div>
                <div class="fx column">
                    <h3><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-user-check"></use></svg>교육강사 선택</h3>
                    <div class="box list overflow-y">
                        <ul>
                            <li class="on" v-for="(item, index) in selectlist" :key="item">
                                <label :for="'bl01_'+index"><input type="checkbox" title="선택" :id="'bl01_'+index" v-model="item.selected">
                                    {{ item.dept_nm+" "+item.jbgd_nm+" "+item.user_nm }}</label>
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
                <a href="javascript:;" class="btn btn-purple" @click="fnSummit"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-post-add"></use></svg>등록</a>
            </div>
        </template>
    </modal>
</template>
<script>
    import "es6-promise/auto";
    import Vue from "vue";
    import Axios from "axios";
    import modal from './modal.vue';
    Vue.component('modal',modal);

    export default {
      data: function() {
        return {
            dept:0,
            deptlist:[],
            list:[],
            selectAll: false,
            search:"",
            selectlist:[],
            instrlist:[],
            firstYn:'Y'
        };
      },
      mounted: function() {},
      methods: {
        fnInit:function(instr){
            this.fndeptList();
            if(instr != ""){
                this.instrlist =instr;
            }
            console.log(instr);
            this.fnUserdeptList(0);

        },
        fnClose:function(){
            this.$emit('close',false);
        },
        fndeptList:function(){
            let vm = this;
            Axios.post("/deptlist.do",{}).then(function(res){
                vm.deptlist = res.data.deptList;
            })
        },
        fnUserdeptList:function(sn,search){
            let vm = this;
            if(sn == 0) vm.dept = 0;
            if(search == null) vm.search="";
            if(vm.selectlist.length == 0){
                vm.selectlist =[];
            }

            Axios.post("/userdeptlist.do",{sn:sn,text:search}).then(function(res){
                vm.list = res.data.deptList;
            }).then(function(){
                if(vm.instrlist != ""){
                    vm.fnSet(vm.instrlist);
                }
            })
        },
        selectAllItems:function() {
            let vm = this;
            for (var i = 0; i < vm.list.length; i++) {
                vm.list[i].selected = vm.selectAll;
            }
        },
        fnAdd:function(){
            let vm = this;
            let chc = vm.addChenk(1,true); // 넣을떄 체크 
            
            for(var i=0; i<vm.list.length; i++){
                if(vm.list[i].selected == true){
                    // if(vm.selectlist.length >=3){
                    //     return false;
                    // } else{
                        chc != false ? vm.selectlist.push({dept_nm:vm.list[i].dept_nm,jbgd_nm:vm.list[i].jbgd_nm , user_nm: vm.list[i].user_nm, sessID:vm.list[i].sessID}) : 0;
                    // }
                    
                }else{ 
                    continue;
                }
            }
            vm.addChenk(2,chc); // 넣고나서 체크 
        },
        fnRemove:function(){
            let vm = this;
            for(let i=vm.selectlist.length-1;i>=0;i-- ){
                if(vm.selectlist[i].selected == true){
                    vm.list.unshift({sessID:vm.selectlist[i].sessID, dept_nm:vm.selectlist[i].dept_nm, jbgd_nm:vm.selectlist[i].jbgd_nm , user_nm:vm.selectlist[i].user_nm});
                    vm.selectlist.splice(i,1);
                }
            }
        },
        addChenk:function(num,bool){
            let vm = this;

            if(num == 1){
                const checklist = vm.list.filter(item => item.selected==true);
                // if((vm.selectlist.length + checklist.length) > 3){
                //     alert("교육강사 선택은 3명이 최대입니다");
                //     return false;
                // }
            }else{
                var checklist = vm.list.filter(item => item.selected==true);
                // if(vm.selectlist.length >3 ){
                //     return false;
                // }else if(vm.selectlist.length >3 && (vm.selectlist.length + checklist.length) > 3){
                //     return false;
                // }else{
                    if(bool == false){
                        return false;
                    }else{
                        const deletelist = vm.list.filter(item => item.selected!=true);
                        vm.list = deletelist;
                    }
                // }
            }
        },
        fnSummit:function(){
            let vm =this;
            
            // if(vm.selectlist.length != 3){
            //     return alert("교육강사를 추가해주세요.");
            // }else{
                if(confirm("등록하시겠습니까?")){
                    vm.$emit('instrlist',vm.selectlist,false);
                } else{
                    return alert("등록을 취소하였습니다.");
                }
                
            // }
        },
        fnSet:function(){
            let vm = this;

            let list = [];
            if(vm.firstYn == 'Y'){
                list = vm.instrlist;
            }else{
                list = vm.selectlist;
            }
            for(var i=0; i<list.length; i++){
                if(vm.firstYn == 'Y'){
                    let sel_list = vm.list.filter(item => item.sessID == list[i]);
                    vm.selectlist.push(sel_list[0]);

                    let delindex = vm.list.findIndex(item => item.sessID == list[i]);
                    if(delindex > -1){
                        vm.list.splice(delindex,1);
                    }
                }else{
                    let delindex = vm.list.findIndex(item => item.sessID == list[i].user_id || item.sessID == list[i].sessID);
                    if(delindex > -1){
                        vm.list.splice(delindex,1);
                    }
                }
                
                // const deletelist = vm.list.filter(item => item.sessID != list[i]);
                // vm.list = deletelist;
                // vm.selectlist.push({dept_nm:deletelist[i].dept_nm,jbgd_nm:list[i].jbgd_nm , user_nm: list[i].user_nm, sessID:list[i].sessID});.

                if((list.length-1) == i){
                    vm.firstYn = 'N';
                }
            }
        },
      },
      watch: { // 리스트 데이터 변동 체크
        // 아이템들의 selected 상태가 바뀔 때마다 전체 선택 버튼 상태도 업데이트.
        list: {
            handler() {
                // 모든 아이템이 선택되어 있는지 확인.
                let vm = this; 
                var allSelected = true;
                for (var i = 0; i < vm.list.length; i++) {
                    if (!vm.list[i].selected) {
                        allSelected = false;
                        break;
                    }
                }
                // 모든 아이템이 선택되어 있으면 전체 선택 버튼도 선택 상태로, 아니면 선택되지 않은 상태로 설정.
                vm.selectAll = allSelected;
            },
            deep: true
        }
      }
    };
</script>