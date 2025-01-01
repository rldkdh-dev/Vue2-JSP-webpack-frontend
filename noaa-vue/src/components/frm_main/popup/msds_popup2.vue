<template>
    <modal :pass="{popupTitle: 'MSDS 선택'}">
		<template v-slot:contents>
            <div class="search-area mb10">
                <input type="text" id="name" class="w200" v-model='viewModel.keyword'>
                <button type="button" id="btn_search_item" class="btn btn-dark" @click="fnSetContents();">검색</button>
            </div>

            <table>
                <caption>MSDS 목록</caption>
                <thead>
					<tr>
						<th scope="col">관리번호</th>
						<th scope="col">분류</th>
						<th scope="col">관리부서</th>
						<th scope="col">화학물질명</th>
						<th scope="col">용도</th>
						<th scope="col">최종일</th>
						<th scope="col">구분</th>
						<th scope="col">선택</th>
					</tr>
				</thead>
				<tbody>
					<template v-if="viewModel.list.length != 0">
						<tr v-for="item in viewModel.list" :key="item.uid" :class="{'active': pass!=undefined && pass.dept == item.uid}">
							<td scope="row">{{item.docno}}</td>
							<td>{{item.cat1}}</td>
							<td>{{item.dept}}</td>
							<td>{{item.title}}</td>
							<td>{{item.cat2}}</td>
							<td>{{item.data_dt}}</td>
							<td v-if="item.use_yn != 'Y'">폐기</td>
							<td v-else>사용</td>
							<td class="tc"><a href="" class="btn sm btn-dark1" value="item.uid" @click.prevent="fnRowClick(item.title)">선택</a></td>
						</tr>
					</template>
					<template v-else>
						<tr><td colspan="3" v-if="viewModel.list == null">검색 결과가 없습니다.</td></tr>
					</template>
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
import Pager from "../../paging.vue";

export default{
	props: ['pass'],
    components: {
        Pager, Modal
    },
    data: function () {
        return {
			viewModel:{
				list:[],
				keyword:"",
				pageNum:0,
				pager: {
					model: {},
					pageNo: 1,
					totalSize: 0,
					rowSize:5,
					blockSize: 5,
					list: [],
					callBack: function (n) {
						this.model.fnSetContents();
					}
				},
			},
        }
    },
    methods: {
		fnInit: function() {
			Modal.methods.fnInit();
			this.fnSetContents();
		},
        fnSetContents: function() {
			let vm = this.viewModel;
			vm.list = [];
			let senddata = {
				mapperId : 'psm.selectHazardPopupList',
				name: vm.keyword,
			};
			Axios.post("/list", senddata).then(function(response) {
				vm.list = response.data.list;
			});
        },
        fnRowClick : function(item){
			console.log(item);
			this.$emit("titleInit",item);

            $('.overlay_mask, .overlay_formbox').hide();
            $('body').removeClass("fix");
        }
    }
}
</script>