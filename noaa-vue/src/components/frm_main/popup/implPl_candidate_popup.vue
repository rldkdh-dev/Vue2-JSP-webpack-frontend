<template>
	<modal :pass="{popupTitle: '후보자'}">
		<template v-slot:contents>
			<div>
				<h3>근로자 대표 후보자 목록</h3>
				<table class="table horizontal write"  v-if="viewModel.list.length > 0">
					<tbody>
						<tr v-for="(item, i) in viewModel.list" :key="i">
							<th scope="row" class="w50">{{ i+1 }}</th>
							<td>{{ item.user_nm }}</td>
						</tr>
					</tbody>
				</table>
				<div v-if="viewModel.list.length <= 0" style="padding:15px; text-align:center;">
					등록된 후보자가 없습니다.
				</div>
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
import fileform from "../fileform2.vue";

export default{
	props: ['pass'],
    components: {
        Pager, Modal, fileform
    },
    data: function () {
        return {
			vote_sn : 0,
			
			viewModel:{
				list:{},
				userInfo:{},
			}
        }
    },
    methods: {
		fnInit: function(sn) {
			let vt = this;
			vt.viewModel.userInfo = vt.$store.state.global.userInfo;
			
			vt.vote_sn = sn;
			vt.$nextTick(function() {
				vt.fnList(sn);
			});
		},
		fnList:function(sn){
			let vt = this;
			let vm = this.viewModel;

			Axios.post("/selectImplPlDetail.do", {vote_sn : sn}).then(function(response) {
				console.log(response.data);
				vm.list = response.data.candidateList;
				
			})

			
		},
		
		
		fnClose:function(){
            this.$parent.fnInit();
            this.$emit('close',false);
        },
    }
}
</script>