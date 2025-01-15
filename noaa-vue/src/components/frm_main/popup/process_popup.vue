<template>
    <modal :pass="{popupTitle: '공정 선택'}">
		<template v-slot:contents>
            <div class="search-area mb10">
                <input type="text" id="name" class="w200" v-model='viewModel.keyword'>
                <button type="button" id="btn_search_item" class="btn btn-dark" @click="fnSetContents();">검색</button>
            </div>

            <table>
                <caption>공정 목록</caption>
                <thead>
					<tr>
						<th scope="col">공정명</th>
						<th scope="col">선택</th>
					</tr>
				</thead>
				<tbody>
					<template v-if="viewModel.list.length != 0">
						<tr v-for="item in viewModel.list" :key="item.uid">
							<td>{{item.title}}</td>
							<td class="tc"><a href="" class="btn sm btn-dark1" value="item.uid" @click.prevent="fnRowClick(item)">선택</a></td>
						</tr>
					</template>
					<template v-else>
						<tr><td colspan="3" v-if="viewModel.list == null">검색 결과가 없습니다.</td></tr>
					</template>
				</tbody>
            </table>
        </template>
    </modal>
</template>

<script>
import 'es6-promise/auto'
import Vue from 'vue'
import Axios from 'axios'
import Modal from './modal.vue'

export default{
	props: ['pass'],
    components: {
        Modal
    },
    data: function () {
        return {
			viewModel:{
				list:[],
				keyword:"",
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

			let data = {
				mapperId:'psm.selectOutlineList',
				pagingYN:'N',
			}
			Axios.post("/list", data).then(function(response) {
				vm.list = response.data.list;
			});
        },
        fnRowClick : function(item){
            this.$parent.processuid = item.uid;		
			this.$parent.processName = item.title;
			this.$parent.popup = {};

            $('.overlay_mask, .overlay_formbox').hide();
            $('body').removeClass("fix");
        }
    }
}
</script>