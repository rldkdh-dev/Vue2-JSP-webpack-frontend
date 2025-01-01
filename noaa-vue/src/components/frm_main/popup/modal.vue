<template>
	<div class="modal_wrap">
		<div class="popup modal">
			<div class="popup_panel">
				<div class="popup_header" ref="draggableContainer">
					<h4>{{pass.popupTitle}}</h4>
					<div class="icon_box">
						<button class="btn btn-icon btn_fullscreen"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-fullscreen"></use></svg></button>
						<button class="btn btn-icon btn_popup_close" @click="fnClose($event);"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-delete"></use></svg></button>
					</div>
				</div>
				<div class="contents popup_contents" id="contents">
					<slot name="contents"></slot>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import Axios from 'axios';
import Vue from 'vue'

export default {
  props: ['pass'],
  components: {
	},
  data: function() {
    return {
      	positions: {
			clientX: undefined,
			clientY: undefined,
			movementX: 0,
			movementY: 0
		}
    }
  },
  mounted: function(){
  },
  methods: {
	fnInit: function() {
		//popup 열기
		$(".modal_wrap").show();
	},
	fnClose :function(event){
		//popup 닫기
		$(event.target).closest('.modal_wrap').hide();
		//popup 닫은 후 작업위해
		this.$emit('close', 'close');
	}
  }
}
</script>
