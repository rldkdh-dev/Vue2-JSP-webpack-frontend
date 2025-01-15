<template>
   <div>
        <h3>조치사항</h3>
        <div class="table_top btn-right">
            <button class="btn btn-light-purple" @click="fnAdd();"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-wrap-text"></use></svg>조치사항 추가</button>
            <button class="btn btn-gray" @click="fnDel();"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-trash-can"></use></svg>삭제</button>
        </div>

        <table class="table horizontal write">
            <caption>조치사항 등록</caption>
            <tbody v-for="(item, i) in viewModel.mttrList" :key="i">
                <tr>
                    <th scope="row" rowspan="2" class="text-center">
                        <input type="checkbox" :id="'check'+i" :value="i" v-model="viewModel.delItemList" title="선택">
                    </th>
                    <th scope="row" class=""><label for="">지적/요청사항</label></th>
                    <td>
                        <textarea id="actn_mttr" title="지적/요청사항" v-model="item.actn_mttr" @keyup="fnWrite"></textarea>
                    </td>
                </tr>
                <tr>
                    <th scope="row" class=""><label for="">조치자</label></th>
                    <td>
                        <div class="input_group input_btn">
                            <input type="text" :id="'actn_pic_nm'+i" :value="item.actn_pic_nm" disabled>
                            <button @click="fnPopup(i);"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-search"></use></svg></button>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
    import "es6-promise/auto";
    import Vue from "vue";
    import Axios from "axios";

    export default {
        props: ['pass'],
        data: function() {
            return {
                popIndex: '',
                viewModel:{
                    mttrList:[{actn_mttr:'', actn_pic_nm:''}],
                    delItemList:[],
                },
            };
        },
        mounted: function() {
            let vm = this;
        },
        methods: {
            fnAdd: function(){
                let vm = this;
                vm.viewModel.mttrList.push({actn_mttr:'', actn_pic_nm:''});

                vm.fnWrite();
            },
            fnDel: function(){
                let vm = this;

                vm.viewModel.delItemList.sort();

                if(vm.viewModel.delItemList.length > 0 ){

                    for(let i=vm.viewModel.delItemList.length-1; i>=0; i--){
                        let index = vm.viewModel.delItemList[i];
                        vm.viewModel.mttrList.splice(index, 1);
                    }
                    
                }else{
                    alert("삭제할 조치사항을 선택해주세요.");
                }

                //조치사항 하나도 없을 경우는 새로 하나 생성
                // if(vm.viewModel.mttrList.length == 0){
                //     vm.viewModel.mttrList.push({actn_mttr:'', actn_pic_nm:''});
                // }

                //삭제 리스트 초기화
                vm.viewModel.delItemList = [];

                vm.fnWrite();
            },
            fnPopup: function(i) {
				let vm = this;
                vm.popIndex = i;
                vm.$parent.fnPopup();
			},
            fnMemberAdd: function(item){
                let vm = this;

                vm.viewModel.mttrList[vm.popIndex].actn_pic_nm = item.user_nm;
                vm.viewModel.mttrList[vm.popIndex].actn_pic = item.user_id;

                vm.fnWrite();
            },
            fnWrite:function(){
                let vm = this;
                vm.$emit('mttrList', vm);
            },
            fnLoadList:function(list){
                let vm = this;
                vm.viewModel.mttrList = list;
            }
        }
    };
</script>