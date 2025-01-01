<template>
<modal :pass="{popupTitle:'직종 정보'}">
    <template v-slot:contents>
        <div>
            <div class="search_area">
                <div>
                    <div class="search_container">
                        <div class="row input_full">
                            <input type="text" placeholder="검색 필터" v-model="search" @keyup="fnFilter();" @input="search=$event.target.value">
                            <button @click="fnFilter" class="btn btn-default"><svg class="icon">
                                    <use xlink:href="../../img/symbol-defs.svg#icon-search"></use>
                                </svg>검색</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div>
            <label for="ocpt_cd2"><input type="radio" @change="fnList()" name="ocpt_cd" id="ocpt_cd2" value="wrk" checked>근로자</label>
            <label for="ocpt_cd3"><input type="radio" @change="fnList()" name="ocpt_cd" id="ocpt_cd3" value="drv">장비운전원</label>
			<label for="ocpt_cd"><input type="radio"  @change="fnList()" name="ocpt_cd" id="ocpt_cd" value="mng" >관리자</label>
        </div>
        <div>
            <table class="table">
                <caption>세부 직종</caption>
                <thead>
                    <tr>
                        <th scope="col">직종</th>
                        <th scope="col">선택</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item in ocptList">
                        <td class="text-left">{{ item.OCPT_DETAIL_NM }}</td>
                        <td>
                            <button class="btn btn-small btn-default" @click="fnOcptAdd(item)"><svg class="icon">
                                    <use xlink:href="../../img/symbol-defs.svg#icon-checklist"></use>
                                </svg>선택</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </template>
</modal>
</template>

<script>
import 'es6-promise/auto'
import Vue from 'vue'
import Axios from 'axios'
import Modal from './modal.vue'
import Pager from "../../paging.vue";

export default {
    components: {
        Pager,
        Modal
    },
    data: function () {
        return {
            search: '',
            ocptList: [],
            ocptOrgList: [],
            userInfo: {},
        }
    },
    methods: {
        fnInit: function () {
            Modal.methods.fnInit();
            this.fnList();
        },
        fnList: function () {
            let vm = this;

            let data = {
                mapperId: 'comm.selectOcptList',
                ocpt_se_cd: $("input[name='ocpt_cd']:checked").val(),
            };
            Axios.post("/list.do", data).then(function (rs) {
                vm.ocptList = rs.data.list;
                vm.ocptOrgList = rs.data.list;
            });
        },
        fnFilter: function () {
            let vm = this;
            //일치하는 항목 필터
            vm.ocptList = vm.ocptOrgList.filter(data => data.OCPT_DETAIL_NM.includes(vm.search));
        },
        fnOcptAdd: function (item) {
            let vm = this;
            //부모창에 선택한 값 전달
            vm.$parent.fnOcptAdd(item);
            //팝업 초기화
            vm.$parent.ocptPop = false;
        },
    }
}
</script>
