<template>
    <div>
        <div class="contents write">
            <div>
                <h3>투표 현장</h3>
                <table class="table horizontal write">
                    <tbody>
                        <tr>
                            <th scope="row" class="w180 essential"><label for="">현장</label></th>
                            <td colspan="2" v-if="userInfo.hdofc_mngr_yn != 'Y'">
                                <div class="input_group">
                                    {{ viewModel.bplc_nm }}
                                </div>
                            </td>
                            <td colspan="2" v-if="userInfo.hdofc_mngr_yn == 'Y'">
                                <div class="input_btn">
                                    <input type="text" id="bplc_nm" v-model="viewModel.bplc_nm" disabled>
		                            <input type="hidden" v-if="viewModel.bplc_sn" id="bplc" v-model="viewModel.bplc_sn">
                                    <button @click="fnBplcPopup();" v-if="userInfo.hdofc_mngr_yn =='Y'"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-search"></use></svg></button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div>
                <div>
                    <h3>투표기간</h3>
                    <table class="table horizontal write">
                        <tbody>
                            <tr>
                                <th scope="row" class="w180 essential"><label for="vote_bgn_dt">투표 시작일</label></th>
                                <td >
                                    <div class="datepicker_box">
                                        <input type="text" class="datepicker" id="vote_bgn_dt" title="datepicker" placeholder="투표 시작일" readonly>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <th scope="row" class="essential"><label for="vote_end_dt">투표 종료일</label></th>
                                <td >
                                    <div class="datepicker_box">
                                        <input type="text" class="datepicker" id="vote_end_dt" title="datepicker" placeholder="투표 종료일" readonly>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div>
                <div>
                    <div style="padding: 20px 0px 0px 0px;">
                        <h3>후보자</h3>
                        <div class="table_top btn-right" style="padding: 20px 0px 0px 0px;">
                            <button class="btn btn-light-purple" @click="fnCnddtAdd()" ><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-group-add"></use></svg>후보자 추가</button>
                        </div>
                        <table class="table horizontal write">
                            <tbody>
                                <tr v-for="(item, i) in viewModel.cnddtList" :key="index">
                                    <th scope="row" class="w180 essential">{{ i+1 }}</th>
                                    <td>
                                        <div class="input_group">
                                            <div class="input_btn">
                                                <input type="text" title="후보자" placeholder="후보자 선택" @click="fnUserPopup(i)" v-model="item.cnddt_nm" :id="item.cnddt_nm + i" readonly>
                                                <label :for="item.cnddt_nm + i"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-search"></use></svg></label>
                                            </div>
                                            <button class="btn btn-gray" @click="fnCnddtSub(i)" v-if="state != 'detail'"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-trash-can"></use></svg>삭제</button>
                                        </div>
                                    </td> 
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div class="table_footer btn-right">
                    <a href="#" class="btn btn-purple" @click="fnSave()" v-if="state != 'detail'"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-post-add"></use></svg>등록</a>
                    <router-link to="/" class="btn btn-white"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-list-back"></use></svg>목록</router-link>
                </div>
            </div>
        </div>
        <userPopup ref="user" v-if="userPop==true" :pass="{title:'후보자', bplc_yn:'Y', bplc_sn : viewModel.bplc_sn}"></userPopup>
        <bplcPopup ref="bplc" v-if="bplcPop==true" :pass="{dept_sn: userInfo.dept_sn, team_sn: userInfo.team_sn}"></bplcPopup>
    </div>
</template>

<script>
    import "es6-promise/auto";
    import Vue from "vue";
    import Axios from "axios";
    import UserPopup from "../../popup/user_popup.vue";
    import BplcPopup from "../../popup/bplc_popup.vue";
    
    export default {
        components: {
            UserPopup, BplcPopup
        },
        data: function() {
            return {
                userInfo:{},
                userPop:false,
                bplcPop:false,
                viewModel:{
                    cnddtIndex:0,
                    cnddtList:[{}],
                    list:{},
                },
                isSaved:false,
            };
        },
        mounted: function() {
            let vt = this;
            let vm = this.viewModel;
            
            vt.userInfo = this.$store.state.global.userInfo,
            vt.uid = window.location.href.split('/').pop();
            vm.bplc_sn = (vt.userInfo.bplc_sn == 0) ? '' : vt.userInfo.bplc_sn;
            vm.bplc_nm = (vt.userInfo.bplc_sn == 0) ? '' : vt.userInfo.bplc_nm;
            calendarInput();
            
        },
        beforeRouteLeave: function(to, from, next){
            let vm = this;
            if(!vm.isSaved){
                if(!confirm("페이지를 이동할 경우 현재 페이지는 저장되지 않습니다.\n그래도 나가시겠습니까?")){
                    return false;
                } 
            }
            next();
        },
        activated:function(){
            this.fnInit();
        },
        deactivated:function(){
            this.$destroy();
        },
        methods: {
            fnInit:function(){
                let vt = this;
                
                vt.$forceUpdate(); 
            },
            fnSave:function(){
                let vt = this;
                let vm = this.viewModel;
                let cnddtList = [];
                
                if(vm.bplc_sn == 0 || vm.bplc_sn == null){
                    return alert("투표 현장을 선택해주시기 바랍니다.");
                }
                if( !$("#vote_bgn_dt").val() || !$("#vote_end_dt").val()){
                    return alert("투표 시작일 또는 종료일을 선택해주시기 바랍니다.");
                }
                if( $("#vote_bgn_dt").val() > $("#vote_end_dt").val()){
                    return alert("투표 시작일보다 종료일이 클 수 없습니다.");
                }
                if(vm.cnddtList.length < 1){
                    return alert("후보자를 1명 이상 선택해주시기 바랍니다.");
                }

                if(confirm("등록 하시겠습니까?")){
                    for(var i=0; i<vm.cnddtList.length; i++ ){
                        cnddtList.push(vm.cnddtList[i].cnddt_id)
                    }
                    let data = {
                        bplc_sn : vm.bplc_sn,
                        vote_bgn_dt :  $("#vote_bgn_dt").val(),
                        vote_end_dt :  $("#vote_end_dt").val(),
                        cnddtList : cnddtList,
                        reg_id : vt.userInfo.user_id
                    }

                    Axios.post("/insertMauImplPlVote.do", data).then(function(res){
                        console.log(res);
                        if(res.date != 0){
                            vt.isSaved = true;
                            alert("등록 되었습니다.");
                            vt.$router.push('/');
                        }else{
                            alert("등록이 중단되었습니다.");
                        }
                    }).catch(function(ex) {
                        console.log(ex);
                    });
                }
            },
            fnCnddtAdd:function(){
                let vt = this;
                let vm = this.viewModel;

                vm.cnddtList.push({cnddtIndex : vm.cnddtIndex++});
            },
            fnCnddtSub:function(index){
                let vt = this;
                let vm = this.viewModel;

                if(vm.cnddtList.length == 0){
                    return false;
                }if(vm.cnddtList.length > 1){
                    vm.cnddtList.splice(index ,1);
                }
            },
            fnUserPopup:function(index){
                let vt = this;
                let vm = this.viewModel;
                
                if(vm.bplc_sn == 0 || vm.bplc_sn == null){
                    alert("투표 현장을 선택해주시기 바랍니다.");
                    return false;
                }
				vt.bplcPop = false;
                vt.userPop = true;
                vt.userIndex = index;
                vt.$nextTick(function() {
                    if(vt.userPop) {
                        vt.$refs.user.fnInit();
                    }
                })
            },
            fnMemberAdd: function(item){
                let vt = this;
                let vm = this.viewModel;

                if(vm.cnddtList.length > 0){
                    for(let i=0; i<vm.cnddtList.length; i++){
                        if(vm.cnddtList[i].cnddt_id == item.user_id){
                            alert("동일한 후보자가 있습니다.");
                            return false;
                        }
                    }
                }
                vm.cnddtList[vt.userIndex].cnddt_id = item.user_id;
                vm.cnddtList[vt.userIndex].cnddt_nm = item.user_nm;
                vt.userPop = false;
            },
            fnBplcPopup: function(){
                let vt = this;
				vt.bplcPop = true;
				vt.userPop = false;
				vt.$nextTick(function() {
					if(vt.bplcPop) {
						vt.$refs.bplc.fnInit();
					}
				})
            },
            fnBplcAdd: function(item){
                let vm = this.viewModel;

                vm.bplc_sn = item.bplc_sn;
                vm.bplc_nm = item.bplc_nm;
            },
        }
    };
</script>