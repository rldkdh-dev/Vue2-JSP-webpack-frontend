<template>
    <div>
        <div class="popup modal active wp60">
            <div class="popup_panel">
                <div class="popup_header">
                    <h4 v-if="mode == 1">안전 결제자 선택</h4>
                    <h4 v-else-if="mode == 2">시공 결제자 선택</h4>
                    <h4 v-else>소장 결제자 선택</h4>
                    <div class="icon_box">
                        <!-- <button class="btn btn-icon btn_fullscreen"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-fullscreen"></use></svg></button> -->
                        <button class="btn btn-icon btn_popup_close" @click="fnClose()"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-delete"></use></svg></button>
                    </div>
                </div>
                <div class="contents popup_contents">
                    <div class="divide">
                        <div>
                            <h3 v-if="mode == 1"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-group-add"></use></svg>안전 결제자 목록</h3>
                            <h3 v-else-if="mode == 2"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-group-add"></use></svg>시공 결제자 목록</h3>
                            <h3 v-else><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-group-add"></use></svg>소장 결제자 목록</h3>
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
                                        <a href="javascript:;" class="btn btn-default-line" @click="fnUserdeptList(0,null,0)"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-refresh"></use></svg>초기화</a>
                                        <a href="javascript:;" class="btn btn-default" @click="fnUserdeptList(dept,search,1)"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-search"></use></svg>검색</a>
                                    </div>
                                </div>
                            </div>
                            <div class="overflow-y border h500">
                                <table class="table">
                                    <caption>참석자 목록</caption>
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
                            <h3 v-if="mode == 1"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-user-check"></use></svg>안전 결제자 선택</h3>
                            <h3 v-else-if="mode == 2"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-user-check"></use></svg>시공 결제자 선택</h3>
                            <h3 v-else><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-user-check"></use></svg>소장 결제자 선택</h3>
                            <div class="box list overflow-y">
                                <ul>
                                    <li class="on" v-for="item in selectlist" :key="item">
                                        <label for="bl01"><input type="checkbox" title="선택" id="bl01" v-model="item.selected">
                                            {{ item.dept_nm+" "+item.jbgd_nm+" "+item.user_nm }}</label>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div class="btn-group btn-right">
                        <a href="javascript:;" class="btn btn-purple" @click="fnSummit"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-post-add"></use></svg>등록</a>
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
    
    export default {
      data: function() {
        return {
            mode:0,
            edu_sn:0,
            dept:0,
            deptlist:[],
            list:[],
            selectAll: false,
            search:"",
            selectlist:[],
            aprvrlist:[],
        };
      },
      mounted: function() {},
      methods: {
        fnInit:function(i,list){
            this.mode = i;
            this.aprvrlist = list;
            this.fndeptList();
            this.fnUserdeptList();
        },
        fnClose:function(){
            // this.$parent.fnInit();
            this.$emit('close',false);
        },
        fndeptList:function(){
            let vm = this;
            Axios.post("/deptlist.do",{}).then(function(res){
                vm.deptlist = res.data.deptList;
            })
        },
        fnUserdeptList:function(sn,search,i){
            let vm = this;
            if(sn == 0) vm.dept = 0;
            if(search == null) vm.search="";
            if(vm.selectlist.length == 0){
                vm.selectlist =[];
            }
            if(i == 0) vm.selectlist =[];
            // vm.selectlist =[];
            Axios.post("/userdeptlist.do",{sn:vm.dept,text:vm.search}).then(function(res){
                vm.list = res.data.deptList;
            }).then(function(){
                if(vm.aprvrlist != ""){
                    vm.fnSet(vm.aprvrlist);
                }
            })
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
            let chc = vm.addChenk(1,true); // 넣을떄 체크 
            
            for(var i=0; i<vm.list.length; i++){
                if(vm.list[i].selected == true){
                    if(vm.selectlist.length < 1){
                        chc != false ? vm.selectlist.push({dept_nm:vm.list[i].dept_nm
                        ,jbgd_nm:vm.list[i].jbgd_nm 
                        , user_nm: vm.list[i].user_nm
                        , sessID:vm.list[i].sessID
                        ,jbgd_sn:vm.list[i].jbgd_sn
                        ,team_sn:vm.list[i].team_sn
                        ,dept_sn:vm.list[i].dept_sn
                        ,user_id:vm.list[i].user_id
                        ,bplc_sn:vm.list[i].bplc_sn}) : 0;
                    }else{

                    }
                }else{ 
                    continue;
                }
            }
            // const deletelist = vm.list.filter(item => item.selected!=true);
            // vm.list = deletelist;
            vm.addChenk(2,chc); // 넣고나서 체크 
        },
        fnRemove:function(){
            let vm = this;
            for(var i=0; i<vm.selectlist.length; i++){
                if(vm.selectlist[i].selected == true){
                    vm.list.unshift({sessID:vm.selectlist[i].sessID
                        , dept_nm:vm.selectlist[i].dept_nm
                        , jbgd_nm:vm.selectlist[i].jbgd_nm 
                        , user_nm:vm.selectlist[i].user_nm
                        ,team_sn:vm.list[i].team_sn
                        ,dept_sn:vm.list[i].dept_sn
                        ,jbgd_sn:vm.list[i].jbgd_sn
                        ,user_id:vm.list[i].user_id
                        ,bplc_sn:vm.list[i].bplc_sn});
                    vm.selectlist.splice(i,1);
                }
            }
        },
        addChenk:function(num,bool){
            let vm = this;
            if(num == 1){
                const checklist = vm.list.filter(item => item.selected==true);
                if((vm.selectlist.length + checklist.length) > 1){
                    alert("결제자 선택은 1명이 최대입니다");
                    return false;
                }
            }else{
                var checklist = vm.list.filter(item => item.selected==true);
                if(vm.selectlist.length >1 ){
                    return false;
                }else if(vm.selectlist.length >1 && (vm.selectlist.length + checklist.length) > 1){
                    return false;
                }else{
                    if(bool == false){
                        return false;
                    }else{
                        const deletelist = vm.list.filter(item => item.selected!=true);
                        vm.list = deletelist;
                    }
                }
            }
        },
        fnSummit:function(){
            let vm =this;
            if(vm.selectlist.length == 0){
                alert("결재자를 선택해주세요.");
            }else{
                if(confirm("등록하시겠습니까?")){
                    vm.$emit('aprvrlist',vm.selectlist,vm.mode,false);
                    alert("등록되었습니다.");
                } else{
                    return alert("등록을 취소하였습니다.");
                }
            }
                
        },
        fnSet:function(list){
            let vm = this;
            for(var i=0; i<list.length; i++){
                const deletelist = vm.list.filter(item => item.sessID != list[i].sessID);
                vm.list = deletelist;
                vm.selectlist.push({dept_nm:list[i].dept_nm
                    ,jbgd_nm:list[i].jbgd_nm 
                    , user_nm: list[i].user_nm
                    , sessID:list[i].sessID
                    ,team_sn:vm.list[i].team_sn
                    ,dept_sn:vm.list[i].dept_sn
                    ,jbgd_sn:vm.list[i].jbgd_sn
                    ,user_id:vm.list[i].user_id
                    ,bplc_sn:vm.list[i].bplc_sn});
            }
        },
      },
      watch: {
        // 셀렉트박스 상태가 변화할때마다 데이터 체크
        list: {
            handler() {
                // 전체 선택이 되어있는지 확인
                let vm = this; 
                var allSelected = true;
                for (var i = 0; i < vm.list.length; i++) {
                    if (!vm.list[i].selected) {
                        allSelected = false;
                        break;
                    }
                }
                // 전체 선택이 되어있으면 선택 버튼도 선택 상태 아니면 선택되지 않은 상태
                vm.selectAll = allSelected;
            },
            deep: true
        }
      }
    };
</script>