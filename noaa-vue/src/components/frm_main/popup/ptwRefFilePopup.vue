<template>
    <modal :pass="{popupTitle: '작업허가서 첨부자료 검색', heightObject:'500'}">
		<template v-slot:contents>
            <div class="top">
				<div>
					<select name="cat1" v-model="search.cat1">
						<option value="">전체</option>
						<option 
							v-for="items in cat1List" 
							:key="items.uid"
							:value="items.cd_name">
							{{ items.cd_name }}
						</option>
					</select>
					<input type="text" id="subject" style="width:200px;"  v-model="search.subject">
					<button type="button" id="btn_search" class="btn btn-dark" style="margin:0;vertical-align:top;" @click.prevent="fnSetContents()">검색</button>
				</div>
			</div>
			<div id="sch_contents" class="scontents">
				<table class="table mt10">
					<thead>
						<tr>
							<th class="w150">분류</th>
							<th>제목</th>
							<th class="w80">선택</th>
						</tr>
					</thead>
					<tbody>
						<template v-if="list.length != 0">
							<tr v-for="(item, index) in list">
								<td>{{ item.cat1 }}</td>
								<td>{{ item.subject }}</td>
								<td class="w80">
									<button type="button" class="btn btn-dark btn-icon only" style="padding: 0 0px 0 2px;" @click="fnRowClick(item);">
										<span class="mi">done</span>
									</button>
								</td>
							</tr>
						</template>
						<template v-else>
							<tr>
								<td colspan="3" class="empty">검색된 데이터가 없습니다.</td>
							</tr>
						</template>
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

export default{
	props: ['pass'],
    components: {
        Pager, Modal
    },
    data: function () {
        return {
			search: {
				cat1: '',
				keyword: '',
			},
			cat1List: [],
			list: [],
        }
    },
    methods: {
		fnInit: function() {
			let vm = this;
			Modal.methods.fnInit();
			vm.fnCatList();
			//this.fnSetContents();
		},
		fnCatList: function(){
			let vm = this;
			let data = {
				mapperId: 'ptw.selectCatList'   
			};

			Axios.post("/list",data).then(function(rs) {
				vm.cat1List = rs.data.list;
			});
			
		},
        fnSetContents: function() {
			let vm = this;
			let data = {
				mapperId: 'ptw.selectPtwRefFileList',   
				cat1: (vm.search.cat1 == '') ? null : vm.search.cat1,
				keyword: (vm.search.keyword == '') ? null : vm.search.keyword,
			};
				
			Axios.post("/list",data).then(function(rs) {
				vm.list = rs.data.list;
			});
        },
        fnRowClick : function(item){
			let vm = this;
			vm.$emit('refFileList', item);
            $('.overlay_mask, .overlay_formbox').hide();
            $('body').removeClass("fix");
        }
    }
}
</script>