<template>
	<modal :pass="{popupTitle: title}">
		<template v-slot:contents>
			<div>
				<ConsiderSub ref="consider" v-if="considerPopup==true" @close="fnClose" :pass="{title:'심의·의결사항'}"></ConsiderSub>
				<ConsultSub ref="consult" v-if="consultPopup==true" @close="fnClose" :pass="{title:'협의 사항'}"></ConsultSub>
				<FeedbackSub ref="feedback" v-if="feedbackPopup==true" @close="fnClose" :pass="{title:'피드백'}"></FeedbackSub>
			</div>
		</template>
	</modal>
</template>

<script>
import 'es6-promise/auto'
import Vue from 'vue'
import Axios from 'axios'
import Modal from './modal.vue'
import ConsiderSub from "../rawWk/mau/rgstPlImplAct_sub_consider.vue";
import ConsultSub from "../rawWk/mau/rgstPlImplAct_sub_consult.vue";
import FeedbackSub from "../rawWk/mau/rgstPlImplAct_sub_feedback.vue";

export default{
	props: ['pass'],
    components: {
        Modal, ConsiderSub, ConsultSub, FeedbackSub
    },
    data: function () {
        return {
			title:'',
			lbm_cfrnc_sn : 0,
			bplc_sn : 0,
			considerPopup : false,
			consultPopup : false,
			feedbackPopup : false,
			viewModel:{
				list:[],
				adminList:{},
				userInfo:{},
			}
        }
    },
	// beforeCreate(){
	// 	console.log('meeting');
	// },
    methods: {
		fnInit: function(item, value) {
			let vt = this;
			let vm = this.viewModel;
			vm.userInfo = vt.$store.state.global.userInfo;
		
			vm.lbm_cfrnc_sn = item.lbm_cfrnc_mtg_sn;
			vm.bplc_sn = item.bplc_sn;
			// vt.$forceUpdate();
			vt.$nextTick(function() {
				vt.fnPopup(item, value);
				// vt.fnList();
			});
		},
		//팝업
		fnPopup:function(item, value){
			let vt = this;
			let vm = this.viewModel;
			vm.lbm_cfrnc_mtg_sn = item.lbm_cfrnc_mtg_sn;
			vt.considerPopup = false;
			vt.consultPopup = false;
			vt.feedbackPopup = false;

			setTimeout(()=>{
				if(value == 'consider'){//consider
					vt.considerPopup = true;
					vt.title = '심의·의결사항';
					vt.$nextTick(function() {
						if(vt.considerPopup) {
							vt.$refs.consider.fnInit(item);
						}
					})
				}if(value == 'consult'){//consult
					vt.consultPopup = true;
					vt.title = '협의 사항';
					vt.$nextTick(function() {
						if(vt.consultPopup) {
							vt.$refs.consult.fnInit(item);
						}
					})
				}if(value == 'feedback'){//feedback
					vt.feedbackPopup = true;
					vt.title = '피드백';
					vt.$nextTick(function() {
						if(vt.feedbackPopup) {
							vt.$refs.feedback.fnInit(item);
						}
					})
				}
				vt.$forceUpdate();
			}, 10)
				
		},
		
		fnClose:function(){
            this.$parent.fnInit();
            this.$emit('close',false);
        },
    }
}
</script>