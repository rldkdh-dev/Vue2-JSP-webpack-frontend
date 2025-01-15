<template>
    <modal :pass="{popupTitle: 'ACTION PLAN 결재'}">
		<template v-slot:contents>
			<div>
                <table class="table">
                    <caption>ACTION PLAN 결재</caption>
                    <thead>
                        <tr>
                            <th colspan="2">결재</th>
                        </tr>
                    </thead>
                    <tbody>
                        <!-- <tr>
                           <td>현장소장</td>
                           <td><input type="text" v-model="viewModel.data.bplc_mngr_nm"></td>
                        </tr> -->
                        <tr>
                            <td>결재</td>
                            <td><button @click.prevent="fnSave();" class="btn btn-purple"><svg class="icon"><use xlink:href="/img/symbol-defs.svg#icon-post-add"></use></svg>결재</button></td>
                        </tr>
                    </tbody>
                </table>
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
                    userInfo:{},
                    actplnList:[],
                    data:{
                        bplc_mngr_nm:'',
                        plan_sn:0,
                        bplc_sn:0,
                   },
                },
            };
        },
        components: {
            Modal
        },
        mounted: function() {
            let vm = this;
            vm.fnInit();
        },
        methods: {
            fnInit:function(sn, id){
                let vm = this;

                //초기화
                // vm.actplnList = [];
                // $('.popup_panel').addClass('full');
                // $('.btn.btn-icon.btn_fullscreen').addClass('on');
                // $('.btn.btn-icon.btn_fullscreen').find('use').attr('xlink:href', '/img/symbol-defs.svg#icon-fullscreen-off')

                vm.viewModel.userInfo = vm.$store.state.global.userInfo;
                vm.viewModel.data.plan_sn = sn;
                vm.viewModel.data.wrtr = id;
                Modal.methods.fnInit();
            },
            
            fnSave: function(){
                let vm = this;

                if(confirm('결재하시겠습니까?')){
                    let data = {
                    bplc_sn: vm.viewModel.data.bplc_sn,
                    plan_sn: vm.viewModel.data.plan_sn,
                };
                    Axios.post("/updateAtPlAprvr.do", data).then(function(response) {
                        if(response.data == 1){
                            vm.$parent.popUp =false;
                            vm.$parent.fnList(0);
                            alert("저장되었습니다.");
                            vm.callPushAlarm(vm.viewModel.userInfo.user_id);
                        }
                    }).catch(function(ex) {
                        alert(Message.ERROR);
                    });
                } else{
                    alert('결재가 취소되었습니다.')
                }
            },
            callPushAlarm: function(user_id) {
                let vm = this;
                let send = {
                    bplc_sn : vm.viewModel.data.bplc_sn
                }
                    
                let link = '/m/main/index.do#/';

                //console.log(' link  ::  ' , link);

                $.ajax({
                    type: "post",
                    url:"/api/pushSendPerson.do",
                    data:{
                        // 제목 및 내용
                        title : "액션플랜 결재가 완료되었습니다.",
                        message : "PC에서 확인해주세요.",
                        user_id : user_id + "," + vm.viewModel.data.wrtr,
                        // 클릭 시 이동 화면주소
                        link : link
                    }
                });
            }
        }
    };
</script>