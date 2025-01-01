<template>
<div>
    <div class="contents write">
        <div class="policy">
            <div>
                <h3>[ 현장 안전보건방침 ]</h3>
                <div>
                    <textarea rows="4" title="현장안전보건방침" placeholder="안전보건방침을 입력해 주세요." id="polcy" v-model="viewModel.data.polcy"></textarea>
                    <!-- <textarea rows="4" title="현장안전보건방침 상세내용" placeholder="안전보건방침 상세내용을 입력해 주세요." id="polcy_detail" v-model="viewModel.data.polcy_detail"></textarea> -->
                    <div class="right_side">
                        <div class="datepicker_box">
                            <input type="text" class="datepicker" title="날짜" placeholder="작성일" id="wrt_dt" readonly>
                        </div>
                        <input type="text" id="bplc_nm" title="공사명 입력" placeholder="공사명" v-model="viewModel.data.bplc_nm" disabled>
                        <input type="text" id="bplc_mngr_nm" title="현장소장 입력" placeholder="현장소장" v-model="viewModel.data.bplc_mngr_nm" disabled>
                    </div>
                </div>
            </div>
            <div>
                <h3>[ {{ year }}년 현장 안전보건 목표 ]</h3>
                <div>
                    <textarea rows="4" title="현장안전보건목표" placeholder="안전보건 목표를 입력해 주세요." id="goal" v-model="viewModel.data.goal"></textarea>
                    <!-- <textarea rows="4" title="현장안전보건목표 상세내용" placeholder="안전보건 목표의 상세내용을 입력해 주세요." id="goal_detail" v-model="viewModel.data.goal_detail"></textarea> -->
                </div>
            </div>
        </div>
        <div class="btn-group btn-right">
            <button class="btn btn-purple" @click="fnSave();"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-post-add"></use></svg>저장</button>
            <router-link :to="'/'" class="btn btn-white"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-list-back" ></use></svg>이전</router-link>
        </div>
    </div>
</div>
</template>

<script>
    import "es6-promise/auto";
    import Vue from "vue";
    import Axios from "axios";
    import Message, {messageUtil} from "../../../../common/js/message";
    import fromValidation from "../../../../common/js/fromValidation";
    
    export default {
        components: {
        },
        data: function() {
            return {
                year:'',
                viewModel:{
                    data: {
                        bplc_mngr_nm:'',
                        bplc_mngr:'',
                    },
                    userInfo:{},
                },
                isSaved:false,
            };
        },
        mounted: function() {
            let vm = this;
            // vm.fnInit();
            // calendarInput();
            // vm.setNowDate();
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
            calendarInput();
            this.setNowDate();
        },
        deactivated:function(){
            this.$destroy();
        },
        methods: {
            fnInit:function(){
                let vm = this;
                vm.viewModel.userInfo = vm.$store.state.global.userInfo;

                let sn = vm.$route.params.sn;

                if(sn != undefined){
                    vm.fnDetail(sn);
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
                    }
                    $("#wrt_dt").val(vm.viewModel.data.wrt_dt);
                }).then(function(){
                    vm.viewModel.data.bplc_mngr = vm.viewModel.userInfo.user_id;
                    vm.viewModel.data.bplc_mngr_nm = vm.viewModel.userInfo.user_name;
                    $("#bplc_mngr_nm").val(vm.viewModel.userInfo.user_name);
                });

            },
            fnSave: function(){
                let vm = this;
                const valiData = [
                    {id: 'polcy', type: 'select', title: '안전보건방침'},
                    // {id: 'polcy_detail', type: 'input', title: '안전보건방침 상세'},
                    {id: 'wrt_dt', type: 'input', title: '작성일'},
                    {id: 'bplc_mngr_nm', type: 'input', title: '현장소장'},
                    {id: 'goal', type: 'input', title: '안전보건 목표를'},
                    // {id: 'goal_detail', type: 'input', title: '안전보건 목표 상세'},
                ];
                
                if(!fromValidation(valiData)){
                    return false;
                }

                if(confirm("저장하시겠습니까?")){
                    let data = {
                        reg_id: vm.viewModel.userInfo.user_id,
                        bplc_sn: vm.viewModel.data.bplc_sn,
                        bplc_nm: vm.viewModel.data.bplc_nm,
                        polcy:vm.viewModel.data.polcy,
                        // polcy_detail:vm.viewModel.data.polcy_detail,
                        wrt_dt:$("#wrt_dt").val(),
                        bplc_mngr:vm.viewModel.data.bplc_mngr,
                        goal:vm.viewModel.data.goal,
                        // goal_detail:vm.viewModel.data.goal_detail,
                    }

                    Axios.post("/updateHsPlc.do", data).then(function(response) {
                        if(response.data == 1){
                            vm.isSaved = true;
                            vm.$router.push('/');
                            alert("저장되었습니다.");
                        }else{
                            alert(Message.ERROR);     
                        }
                    }).catch(function(ex) {
                        alert(Message.ERROR);
                    });
                }
            },
            setNowDate(){
                let vm = this;
                let myDate = new Date();
                vm.year = String(myDate.getFullYear());
            },
            setNowDate(){
                let vm = this;
                let myDate = new Date();
                vm.year = String(myDate.getFullYear());
            },
        }
    };
</script>