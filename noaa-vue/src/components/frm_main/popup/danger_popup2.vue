<template>
	<div>
		<div id='mask1' class="overlay_mask" style="opacity: 0.45; display: none;"></div>
		<div id="popupBase1"  class="overlay_formbox ui-draggable" style="left: 42%; top: 15%; display:none;" ref="draggableContainer">
	  		<div class="overlay_gen_box ui-resizable" style="width: 500px;">
				<a href="javascript:void(0);" class="btn_fullscreen" onclick="btn_fullscreen();"></a>
				<a href="javascript:void(0);" class="btn_formbox_close" @click="fnFormBoxClose();"></a>
		  
				<div class="formbox_panel">
					<div class="title-area type">
						<span class="title"  @mousedown="dragMouseDown2">위험성평가 척도 선택</span>
					</div>
					<div class="content-area res" id="popupContnetArea">
						<h3 class="table-title">5X4 위험성 추정기준</h3>
						<table class="normal dg-table">
							<tbody>
								<tr>
									<td colspan="2" rowspan="2" class="gy"></td>
									<td colspan="4" class="gy">중대성(강도)</td>
								</tr>
								<tr>
									<td class="gy">최대(4)</td>
									<td class="gy">대(3)</td>
									<td class="gy">중(2)</td>
									<td class="gy">소(1)</td>
								</tr>
								<tr>
									<td rowspan="5" class="gy">가능성<br>(빈도)</td>
									<td class="gy">최상(5)</td>
									<td class="danger20 danger_val" @click="fnClick(5,4,'매우높음')">매우높음<br>(20)</td>
									<td class="danger15 danger_val" @click="fnClick(5,3,'높음')">높음<br>(15)</td>
									<td class="danger10 danger_val" @click="fnClick(5,2,'약간높음')">약간높음<br>(10)</td>
									<td class="danger5 danger_val" @click="fnClick(5,1,'낮음')">낮음<br>(5)</td>
								</tr>
								<tr>
									<td class="gy">상(4)</td>
									<td class="danger16 danger_val" @click="fnClick(4,4,'매우높음')">매우높음<br>(16)</td>
									<td class="danger12 danger_val" @click="fnClick(4,3,'약간높음')">약간높음<br>(12)</td>
									<td class="danger8 danger_val"  @click="fnClick(4,2,'보통')">보통<br>(8)</td>
									<td class="danger4 danger_val"  @click="fnClick(4,1,'낮음')">낮음<br>(4)</td>
								</tr>
								<tr>
									<td class="gy">중(3)</td>
									<td class="danger12 danger_val" @click="fnClick(3,4,'약간높음')">약간높음<br>(12)</td>
									<td class="danger9 danger_val" @click="fnClick(3,3,'약간높음')">약간높음<br>(9)</td>
									<td class="danger6 danger_val" @click="fnClick(3,2,'낮음')" data-freq="3" data-itns="2">낮음<br>(6)</td>
									<td class="danger3 danger_val" @click="fnClick(3,1,'매우낮음')">매우낮음<br>(3)</td>
								</tr>
								<tr>
									<td class="gy">하(2)</td>
									<td class="danger8 danger_val" @click="fnClick(2,4,'보통')">보통<br>(8)</td>
									<td class="danger6 danger_val" @click="fnClick(2,3,'낮음')">낮음<br>(6)</td>
									<td class="danger4 danger_val" @click="fnClick(2,2,'낮음')">낮음<br>(4)</td>
									<td class="danger2 danger_val" @click="fnClick(2,1,'매우낮음')">매우낮음<br>(2)</td>
								</tr>
								<tr>
									<td class="gy">최하(1)</td>
									<td class="danger4 danger_val" @click="fnClick(1,4,'낮음')">낮음<br>(4)</td>
									<td class="danger3 danger_val" @click="fnClick(1,3,'매우낮음')">매우낮음<br>(3)</td>
									<td class="danger2 danger_val" @click="fnClick(1,2,'매우낮음')">매우낮음<br>(2)</td>
									<td class="danger1 danger_val" @click="fnClick(1,1,'매우낮음')">매우낮음<br>(1)</td>
								</tr>
							</tbody>
						</table>

						<table class="normal mt20">
							<thead>
								<tr>
									<td colspan="2" class="gy w100">위험성 수준</td>
									<td class="gy w100">허용 가능 여부</td>
									<td class="gy">개선방법</td>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td class="danger16">16 ~ 20</td>
									<td class="danger16">매우높음</td>
									<td class="" rowspan="4">허용 불가능</td>
									<td class="">즉시 개선</td>
								</tr>
								<tr>
									<td class="danger15">15</td>
									<td class="danger15">높음</td>
									<td class="">신속하게 개선</td>
								</tr>
								<tr>
									<td class="danger9">9 ~ 12</td>
									<td class="danger9">약간높음</td>
									<td class="">가급적 빨리 개선</td>
								</tr>
								<tr>
									<td class="danger8">8</td>
									<td class="danger8">보통</td>
									<td class="">계획적으로 계선</td>
								</tr>
								<tr>
									<td class="danger4">4 ~ 6</td>
									<td class="danger4">낮음</td>
									<td class="" rowspan="4">허용 가능</td>
									<td class="" rowspan="2">필요에 따라 개선</td>
								</tr>
								<tr>
									<td class="danger1">1 ~ 3</td>
									<td class="danger1">매우낮음</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
				<div class="ui-resizable-handle ui-resizable-se of_rse" style="z-index:90; display:block;"></div>
			</div><!-- //overlay_gen_box -->
		</div><!-- //overlay_formbox -->
	</div>
</template>

<script>
import Axios from 'axios';
import Vue from 'vue'
import Common from '../../common.js';
import Modal from './modal.vue'

export default {
	components: {
		Modal,
	},
	data: function () {
		return {
			mode: '',
			viewModel:{
				item: {},
				list: [{seq: 0},],
				filelist: [],
				fileGroup: ''
			},
			positions: {
				clientX: undefined,
				clientY: undefined,
				movementX: 0,
				movementY: 0
			}
		}
	},
	mounted: function () {
		
	},
	methods: {
		fnInit: function() {
			//Modal.methods.fnInit();
			$("#popupBase1").show();
			$("#mask1").show();
		},
		fnClick: function(freq, itns, result) {
			this.$parent.freq = freq;
			this.$parent.itns = itns;
			this.$parent.result = result;
			this.$parent.isPop = false;

			this.$parent.fnResult();

			this.fnFormBoxClose();
		},
		dragMouseDown2: function (event) {
			event.preventDefault()
			// get the mouse cursor position at startup:
			this.positions.clientX = event.clientX
			this.positions.clientY = event.clientY
			document.onmousemove = this.elementDrag
			document.onmouseup = this.closeDragElement
			},
			elementDrag: function (event) {
			event.preventDefault()
			this.positions.movementX = this.positions.clientX - event.clientX
			this.positions.movementY = this.positions.clientY - event.clientY
			this.positions.clientX = event.clientX
			this.positions.clientY = event.clientY
			// set the element's new position:
			this.$refs.draggableContainer.style.top = (this.$refs.draggableContainer.offsetTop - this.positions.movementY) + 'px'
			this.$refs.draggableContainer.style.left = (this.$refs.draggableContainer.offsetLeft - this.positions.movementX) + 'px'
			},
			closeDragElement () {
			document.onmouseup = null
			document.onmousemove = null
		},
		fnFormBoxClose: function(){
			$("#popupBase1").hide();
			$("#mask1").hide();
		}
		
	
	}
};
</script>
