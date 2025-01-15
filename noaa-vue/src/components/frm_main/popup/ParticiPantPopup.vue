<template>
    <div>
        <div class="popup modal active wp60">
            <div class="popup_panel">
                <div class="popup_header">
                    <h4>참석자 선택</h4>
                    <div class="icon_box">
                        <!-- <button class="btn btn-icon btn_fullscreen"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-fullscreen"></use></svg></button> -->
                        <button class="btn btn-icon btn_popup_close" @click="fnClose()"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-delete"></use></svg></button>
                    </div>
                </div>
                <div class="contents popup_contents">
                    <div class="divide">
                        <div>
                            <h3><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-group-add"></use></svg>참석자 목록</h3>
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
                                            <th scope="col">직책</th>
                                            <th scope="col">성명</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="item in list" :key="item">
                                            <td><input type="checkbox" title="선택" v-model="item.selected"></td>
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
                            <h3><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-user-check"></use></svg>참석자 선택</h3>
                            <div class="box list overflow-y">
                                <ul>
                                    <li class="on" v-for="(item, index) in selectlist" :key="item">
                                        <label :for="'bl01_'+index"><input type="checkbox" title="선택" :id="'bl01_'+index" v-model="item.selected">
                                            {{ item.jbgd_nm+" "+item.user_nm }}</label>
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
            edu_sn:0,
            bplc_sn:0,
            dept:0,
            deptlist:[],
            list:[],
            selectAll: false,
            search:"",
            selectlist:[],
            instrlist:[],
        };
      },
      mounted: function() {},
      methods: {
        fnInit:function(sn, bplc_sn){
            this.edu_sn = sn;
            this.bplc_sn = bplc_sn;
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
            Axios.post("/userdeptlist.do",{sn:vm.dept,text:vm.search}
            ).then(function(res){
                vm.list = res.data.deptList;
            }).then(function(){                
                if(vm.edu_sn != ""){
                    vm.fnSet(vm.edu_sn);
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
            // let chc = vm.addChenk(1,true); // 넣을떄 체크 
            
            for(var i=0; i<vm.list.length; i++){
                if(vm.list[i].selected == true){
                    // chc != false ? vm.selectlist.push({dept_nm:vm.list[i].dept_nm,jbgd_nm:vm.list[i].jbgd_nm , user_nm: vm.list[i].user_nm, sessID:vm.list[i].sessID}) : 0;
                    vm.selectlist.push({dept_nm:vm.list[i].dept_nm
                        ,jbgd_nm:vm.list[i].jbgd_nm 
                        ,user_nm: vm.list[i].user_nm
                        ,sessID:vm.list[i].sessID
                        ,jbgd_sn:vm.list[i].jbgd_sn
                        ,team_sn:vm.list[i].team_sn
                        ,dept_sn:vm.list[i].dept_sn
                        ,user_id:vm.list[i].user_id
                        ,bplc_sn:vm.list[i].bplc_sn
                        ,ocpt_detail_cd:vm.list[i].ocpt_detail_cd
                    });
                }else{ 
                    continue;
                }
            }
            const deletelist = vm.list.filter(item => item.selected!=true);
            vm.list = deletelist;
            // vm.addChenk(2,chc); // 넣고나서 체크 
        },
        fnRemove:function(){
            let vm = this;
            for(let i=vm.selectlist.length-1;i>=0;i-- ){
                if(vm.selectlist[i].selected == true){
                    vm.list.unshift({sessID:vm.selectlist[i].sessID
                        , dept_nm:vm.selectlist[i].dept_nm
                        , jbgd_nm:vm.selectlist[i].jbgd_nm 
                        , user_nm:vm.selectlist[i].user_nm
                        ,team_sn:vm.list[i].team_sn
                        ,dept_sn:vm.list[i].dept_sn
                        ,jbgd_sn:vm.list[i].jbgd_sn
                        ,user_id:vm.list[i].user_id
                        ,bplc_sn:vm.list[i].bplc_sn
                        ,ocpt_detail_cd:vm.list[i].ocpt_detail_cd});
                    vm.selectlist.splice(i,1);
                }
            }
        },
        // addChenk:function(num,bool){
        //     let vm = this;

        //     if(num == 1){
        //         const checklist = vm.list.filter(item => item.selected==true);
        //         if((vm.selectlist.length + checklist.length) > 3){
        //             alert("교육실시자 선택은 3명이 최대입니다");
        //             return false;
        //         }
        //     }else{
        //         var checklist = vm.list.filter(item => item.selected==true);
        //         if(vm.selectlist.length >3 ){
        //             return false;
        //         }else if(vm.selectlist.length >3 && (vm.selectlist.length + checklist.length) > 3){
        //             return false;
        //         }else{
        //             if(bool == false){
        //                 return false;
        //             }else{
        //                 const deletelist = vm.list.filter(item => item.selected!=true);
        //                 vm.list = deletelist;
        //             }
        //         }
        //     }
        // },
        fnSummit:function(){
            let vm =this;
            let send={
                reg_id:vm.$store.state.global.userInfo.user_id,
                participantList:vm.selectlist,
                edu_sn:vm.edu_sn,
                bplc_sn:vm.bplc_sn,

            }
            if(confirm("등록하시겠습니까?")){
                Axios.post("/insertParticiPantList.do",send).then(function(){
                    alert("등록되었습니다.");    
                }).then(function(){
                    vm.$emit('close',false);
                })
                
            } else{
                return alert("등록을 취소하였습니다.");
            }
                
        },
        fnSet:function(sn){
            let vm = this;

            Axios.post("/selectParticiPantList.do",{sn:sn}).then(function(res){
                for(var i=0; i<res.data.participantList.length; i++){
                    const deletelist = vm.list.filter(item => item.user_id != res.data.participantList[i].user_id);
                    vm.list = deletelist;
                    
                    vm.selectlist.push({dept_nm:res.data.participantList[i].dept_nm
                        , jbgd_nm: res.data.participantList[i].jbgd_nm 
                        , user_nm: res.data.participantList[i].user_nm
                        , sessID: res.data.participantList[i].edu_nmpr_sn
                        , team_sn: res.data.participantList[i].team_sn
                        , dept_sn: res.data.participantList[i].dept_sn
                        , jbgd_sn: res.data.participantList[i].jbgd_sn
                        , user_id: res.data.participantList[i].user_id
                        , bplc_sn: res.data.participantList[i].bplc_sn
                        ,ocpt_detail_cd:res.data.participantList[i].ocpt_detail_cd});
                }
            })
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