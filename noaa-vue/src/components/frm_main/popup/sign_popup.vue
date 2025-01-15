<template>
	<div class="popup active">
		<div class="popup_panel">
			<div class="popup_header">
				<h4>결재</h4>
				<div class="icon_box">
					<button class="btn btn-icon btn_fullscreen"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-fullscreen"></use></svg></button>
					<button class="btn btn-icon btn_popup_close" @click="fnClose"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-delete"></use></svg></button>
				</div>
			</div>
			<div class="contents popup_contents">
				<div class="btn-group">
					<div class="right_side">
						<a href="javascript:void(0);" class="btn btn-primary" @click="fnSignApproval()"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-check-circle"></use></svg>결재</a>
						<!-- <a href="javascript:void(0);" class="btn btn-white" @click="fnSignReturn(signPopSort)"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-newsfeed"></use></svg>반려</a> -->
					</div>
				</div>
			</div>
		</div>
	</div>
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
        }
    },
    methods: {
		fnInit: function() {
			let vm = this;

			Modal.methods.fnInit();
		},
		fnSignApproval: function(){
			if(confirm("결재하시겠습니까?")){
				
				let vm = this;
				//부모창에 선택한 값 전달
				vm.$parent.fnSign();
				//팝업 초기화
				vm.$parent.signPop = false;
			}
		},
		fnClose: function(){
			let vm = this;

			vm.$parent.signPop = false;
		}
    }
}
</script>