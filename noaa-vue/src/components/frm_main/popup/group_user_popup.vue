<template>
    <modal :pass="{widthObject: 800, popupTitle: '사원 선택'}">
		<template v-slot:contents>
            <div class="search-area mb10">
                <input type="text" id="name" class="w200" v-model='viewModel.keyword'>
                <button type="button" id="btn_search_item" class="btn btn-dark" @click="fnSetContents();">검색</button>
            </div>

            <table>
                <caption>사원 목록</caption>
                <thead>
                    <tr>
                        <th scope="col"><a>사업장</a></th>
                        <th scope="col"><a>부서</a></th>
                        <th scope="col"><a>직급</a></th>
                        <th scope="col"><a>이름</a></th>
                        <th scope="col"><a>아이디</a></th>
                        <th scope="col">선택</th>
                    </tr>
                </thead>
                <tbody>
                <tr v-for = "item in viewModel.list" :key="item.uid">
                        <td>{{item.groupname}}</td>
                        <td>{{item.deptname}}</td>
                        <td>{{item.jobname}}</td>
                        <td>{{item.user_name}}</td>
                        <td>{{item.user_id}}</td>
                        <td>
                            <a href="" class="btn md btn-icon" value="item.uid" @click.prevent="fnRowClick(item)">선택</a>
                        </td>
                        <td colspan="3" v-if="viewModel.list == null">게시물이 없습니다.</td>
                    </tr>
                </tbody>
            </table>

            <div class="table_footer">
                <pager v-bind:pass="viewModel.pager"></pager>
            </div>
        </template>
    </modal>
</template>

<script>
import 'es6-promise/auto'
import Vue from 'vue'
import Axios from 'axios'
import Modal from './modal.vue'
import pager from "../../paging.vue";

Vue.component("pager", pager);

export default{
    components: {
        pager, Modal
    },
    data: function () {
        return {
            viewModel:{
                list:[],
                deptuid:'',
                mng_name : '',
                searchView : false,
                deptlist:[],
                name:"",
                componentname:"",
                pageNum:0,
                pager: {
                    model: {},
                    pageNo: 1,
                    totalSize: 0,
                    rowSize:10,
                    blockSize: 5,
                    list: [],
                    callBack: function (n) {
                        this.model.fnSetContents();
                    }
                },
            }	
        }
    },
    methods: {
        fnInit: function(item) {
			Modal.methods.fnInit();
			this.fnSetContents();
		},
        fnSetContents: function(componentname){
            let vt = this;
            let vm = this.viewModel;
            let senddata = {
                mapperId : 'base.selectmemberList',
                totalId : 'base.selectmemberTotalCount',
                pagingYN : 'Y',
                pageNo: vm.pager.pageNo, 
                pageSize: vm.pager.rowSize,  
            };
            Axios.post("/list", senddata).then(function(response) {
                let rs = response.data;
                vm.list = rs.list;
                for (let i=0;i<vm.list.length;i++){
                    if(vm.list[i].owner != 0){
                        if(vm.list[i].owner == vm.list[i].team_leader){
                            vm.list[i].owner = true;
                        } else {
                            vm.list[i].owner = false;
                        } 

                    } else {
                        vm.list[i].owner = false;
                    }
                }
                
                vm.pager.totalSize = rs.totalCNT;
                pager.props = pager.methods.createPaging(vm.pager, vt, "list");
                
            });
        },
        fnRowClick : function(item){
            this.$parent.useruid = item.team_leader;	
            this.$parent.userName = item.user_name +' ('+ item.deptname +')';
            $('.overlay_mask, .overlay_formbox').hide();
            $('body').removeClass("fix");
        }
        
    }
}
</script>