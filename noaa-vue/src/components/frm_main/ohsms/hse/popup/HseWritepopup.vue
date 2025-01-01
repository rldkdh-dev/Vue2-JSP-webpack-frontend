<template>
    <modal :pass="{popupTitle: mode == 1 ? '안전담당자 선택' : '심사자 선택'}">
        <template v-slot:contents>
            <div>
                <div class="search_area">
                    <div>
                        <div class="search_container">
                            <div class="row input_full">
                                <input type="text" placeholder="설명을 입력해주세요." v-model="search" @keyup="fnFilter();" @input="search=$event.target.value">
                                <button @click="fnFilter" class="btn btn-default"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-search"></use></svg>검색</button>
                            </div>
                        </div> 
                    </div>
                </div>
            </div>
            <div>
                <table class="table">
                    <caption>위험성평가 결과에 대한 근로자 의견</caption>
                    <thead>
                        <tr>
                            <th scope="col">선택</th>
                            <th scope="col">소속</th>
                            <th scope="col">직종/직급</th>
                            <th scope="col">성명</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in userlist" :key="item">
                            <td>
                                <input type="checkbox" id="" title="선택" v-model="item.selected">
                            </td>
                            <td>{{ item.bplc_nm }}</td>
                            <td>{{ item.ocpt_detail_nm+" "+item.jbgd_nm }}</td>
                            <td>{{ item.user_nm }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="btn-group">
                <div class="right_side">
                    <button class="btn btn-purple" @click="fnSelect">선택</button>
                </div>
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
            search:"",
            userInfo:"",
            list:[],
            userlist:[],
            userlist2:[],
            mode:'',
            bplc_sn:"",
            selectAll: false,
        };
      },
      mounted: function() {
            
      },
      methods: {
        fnInit:function(i,bplc_sn){
            
            modal.methods.fnInit();
            this.userInfo = this.$store.state.global.userInfo;
            this.mode= i;
            this.bplc_sn = bplc_sn;
            this.fnreviewerList();
        },
        fnreviewerList:function(){
            let vm = this;
            let send = {
                bplc_sn: vm.bplc_sn,
            }
            Axios.post('/selectReviewerList.do',send).then(function(res){
                vm.userlist = res.data.hseList;
                vm.userlist2 = res.data.hseList;
            })
        },
        fnSelect:function(){
            let vm = this;
            var user_nm ="";
            var user_id ="";

            if(confirm("선택하시겠습니까?")){
                if(vm.mode == 1){
                    let selectlist = vm.userlist.filter(item => item.selected == true);
                    if(selectlist.length == 1){
                        vm.$emit('result',vm.mode,selectlist[0].user_nm,selectlist[0].user_id,false);
                    }else{
                        for(var i=0; i<selectlist.length; i++){
                            let item = selectlist[i];
                            if(user_nm == ""){
                                user_nm = item.user_nm;
                                user_id = item.user_id;
                            }else{
                                user_nm += ',' + item.user_nm;
                                user_id += ',' + item.user_id;
                            }

                        }

                        vm.$emit('result',vm.mode,user_nm,user_id,false);
                    }
                }else{
                    let selectlist = vm.userlist.filter(item => item.selected == true);
                    if(selectlist.length > 1){
                        alert("심사자는 1명만 선택할 수 있습니다.");
                    }else{
                        vm.$emit('result',vm.mode,selectlist[0].user_nm,selectlist[0].user_id,false);
                    }
                }
            }else{
                alert("선택을 취소하였습니다.");
            }




        },
        fnFilter:function(){
			let vm = this;
			//일치하는 항목 필터
			vm.userlist = vm.userlist2.filter(data => data.user_nm.includes(vm.search));
        },
        fnClose:function(){
            this.$emit('close',false);
        },
      },
      watch: {
        userlist: {
            handler() {
                let vm = this; 
                var allSelected = true;
                for (var i = 0; i < vm.userlist.length; i++) {
                    if (!vm.userlist[i].selected) {
                        allSelected = false;
                        break;
                    }
                }
                vm.selectAll = allSelected;
            },
            deep: true
        }
      }
    };
</script>