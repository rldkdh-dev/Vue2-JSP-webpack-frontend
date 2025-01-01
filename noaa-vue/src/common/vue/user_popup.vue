<template>
	<div>
		<div id='mask' class="overlay_mask" style="opacity: 0.45; display: none;"></div>
		<div id="popupBase"  class="overlay_formbox ui-draggable" style="left: 42%; top: 15%; position: absolute; display:none;" ref="draggableContainer">
	  		<div class="overlay_gen_box ui-resizable"  :style="widthObject">
				<a href="javascript:void(0);" class="btn_fullscreen" onclick="btn_fullscreen();"></a>
				<a href="javascript:void(0);" class="btn_formbox_close" onclick="btn_formbox_close();"></a>
		  
				<div class="formbox_panel">
					<div class="title-area type">
						<span class="title"  @mousedown="dragMouseDown">{{popupTitle}}</span>
					</div><!-- //title-area -->
					<div class="content-area res" id="popupContnetArea"> 
						<coachpopup ref="coachpopup" v-show="popupType == 'coachpopup'"/> 
						<deptpopup ref="deptpopup" v-show="popupType == 'deptpopup'"/>
						<memberpopup ref="memberpopup" v-show="popupType == 'memberpopup'"/> 
						<dangerpopup ref="dangerpopup" v-show="popupType == 'dangerpopup'"/> 
						<inspectionpopup ref="inspectionpopup" v-show="popupType == 'inspectionpopup'"/> 
						<scenariopopup ref="scenariopopup" v-show="popupType == 'scenariopopup'"/> 
						<filepopup ref="filepopup" v-show="popupType == 'filepopup'"/> 
						<regpopup ref="regpopup" v-show="popupType == 'regpopup'"/>
						<changestep1 ref="changestep1" v-show="popupType == 'changestep1'"/>
						<changestep2 ref="changestep2" v-show="popupType == 'changestep2'"/>
						<changestep3 ref="changestep3" v-show="popupType == 'changestep3'"/>
						<changestep4 ref="changestep4" v-show="popupType == 'changestep4'"/>
						<changestep5 ref="changestep5" v-show="popupType == 'changestep5'"/>
						<changestep6 ref="changestep6" v-show="popupType == 'changestep6'"/>
						<changestep7 ref="changestep7" v-show="popupType == 'changestep7'"/>
						<auditstep1 ref="auditstep1" v-show="popupType == 'auditstep1'"/>
						<auditstep2 ref="auditstep2" v-show="popupType == 'auditstep2'"/>
						<auditstep3 ref="auditstep3" v-show="popupType == 'auditstep3'"/>
						<auditstep4 ref="auditstep4" v-show="popupType == 'auditstep4'"/>
						<businesspopup ref="businesspopup" v-show="popupType == 'businesspopup'"/>
						<pfpopup ref="pfpopup" v-show="popupType == 'pfpopup'"/>
						<userpopup ref="userpopup" v-show="popupType == 'userpopup'"/>
						<qmspopup ref="qmspopup" v-show="popupType == 'qmspopup'"/>
					</div>
				</div><!-- //formbox_panel -->
				<div class="ui-resizable-handle ui-resizable-se of_rse" style="z-index:90; display:block;"></div>
			</div><!-- //overlay_gen_box -->
		</div><!-- //overlay_formbox -->
	</div>
</template>
<script>
	import Axios from 'axios';
	import Vue from 'vue'
	//import coachpopup from './popup/coach_popup.vue';
	import deptpopup from './popup/dept_popup.vue';
	//import memberpopup from './popup/member_popup.vue';
	//import dangerpopup from './popup/danger_popup.vue';
	//import inspectionpopup from './popup/inspection_popup.vue';
	//import scenariopopup from './popup/scenario_popup.vue';
	import filepopup from './popup/file_popup.vue';
	//import regpopup from './popup/reg_popupl.vue';
	//import changestep1 from './popup/changestep1_popup.vue';
	//import changestep2 from './popup/changestep2_popup.vue';
	//import changestep3 from './popup/changestep3_popup.vue';
	//import changestep4 from './popup/changestep4_popup.vue';
	// import changestep5 from './popup/changestep5_popup.vue';
	//import changestep6 from './popup/changestep6_popup.vue';
	// import changestep7 from './popup/changestep7_popup.vue';
	import auditstep1 from './popup/auditstep1_popup.vue';
	//import auditstep2 from './popup/auditstep2_popup.vue';
	//import auditstep3 from './popup/auditstep3_popup.vue';
	//import auditstep4 from './popup/auditstep4_popup.vue';
	//import businesspopup from './popup/business_popup.vue';
	//import pfpopup from './popup/pf_popup.vue';
	import userpopup from './popup/user_popup.vue';
	import qmspopup from './popup/qms_popup.vue';



	//Vue.component('coachpopup',coachpopup);
	Vue.component('deptpopup',deptpopup);
	//Vue.component('memberpopup',memberpopup);
	//Vue.component('dangerpopup',dangerpopup);
	//Vue.component('inspectionpopup',inspectionpopup);
	//Vue.component('scenariopopup',scenariopopup);
	Vue.component('filepopup',filepopup);
	//Vue.component('regpopup',regpopup);
	//Vue.component('changestep1',changestep1);
	//Vue.component('changestep2',changestep2);
	//Vue.component('changestep3',changestep3);
	//Vue.component('changestep4',changestep4);
	// Vue.component('changestep5',changestep5);
	//Vue.component('changestep6',changestep6);
	// Vue.component('changestep7',changestep7);
	Vue.component('auditstep1',auditstep1);
	//Vue.component('auditstep2',auditstep2);
	//Vue.component('auditstep3',auditstep3);
	//Vue.component('auditstep4',auditstep4);
	//Vue.component('businesspopup',businesspopup);
	//Vue.component('pfpopup',pfpopup);
	Vue.component('userpopup',userpopup);
	Vue.component('qmspopup',qmspopup);
	

  	export default {
		components: {
		},
		data: function () {
			return {
				test: "header",
				popupTitle : "팝업타이틀",
				popupType : "user",
				showFlag : false,
				paramUserCd:'',
				widthObject:{},
				positions: {
				clientX: undefined,
				clientY: undefined,
				movementX: 0,
				movementY: 0
				}

			}
		},
		created: function () {
			// console.log("created");
		},
		mounted: function () {
		},
		methods: {
			fnSetPopupTypeAndContents : function(popuptype, detailData, etcData){

				console.log(' popuptype :: ' , popuptype);

				this.widthObject = {};
				$("#popupBase").show();
				$("#mask").show();
				this.popupType = popuptype;
				switch (popuptype) {
					case "coachpopup":
						this.popupTitle = "안전보건코칭";
						this.widthObject = {width:"500px"}; 
						this.$refs.coachpopup.fnSetContents(detailData, etcData);
						break;
					case "deptpopup":
						this.popupTitle = "부서 선택";
						this.widthObject = {width:"500px"}; 
						this.$refs.deptpopup.fnSetContents(detailData, etcData);
						break;
					case "memberpopup":
						this.popupTitle = "사원 검색 ";
						this.widthObject = {width:"700px"}; 
						this.$refs.memberpopup.fnSetContents(detailData);
						break;	
					case "dangerpopup":
						this.popupTitle = "위험성평가 척도 선택";
						this.widthObject = {width:"700px"}; 
						this.$refs.dangerpopup.fnSetContents(detailData);
						break;			
					case "inspectionpopup":
						this.popupTitle = "보건관리자 순회점검";
						this.widthObject = {width:"700px"}; 
						this.$refs.inspectionpopup.fnSetContents(detailData);
						break;
					case "scenariopopup":
						this.popupTitle = "시나리오 선택";
						this.widthObject = {width:"800px"}; 
						this.$refs.scenariopopup.fnSetContents(detailData);
						break;
					case "filepopup":
						this.popupTitle = "첨부파일";
						this.widthObject = {width:"500px"};
						this.$refs.filepopup.fnSetContents(detailData);
						break;
					case "regpopup":
						this.popupTitle = "법규대장관리";
						this.widthObject = {width:"700px"}; 
						this.$refs.regpopup.fnSetContents(etcData);
						break;							
					case "changestep1":
						this.popupTitle = "변경등급판정 등록";
						this.widthObject = {width:"610px"}; 
						this.$refs.changestep1.fnSetContents(detailData);
						break;
					case "changestep2":
						this.popupTitle = "변경요구서 등록";
						this.widthObject = {width:"720px"}; 
						this.$refs.changestep2.fnSetContents(detailData);
						break;
					case "changestep3":
						this.popupTitle = "변경기술검토 등록";
						this.widthObject = {width:"720px"}; 
						this.$refs.changestep3.fnSetContents(detailData);
						break;
					case "changestep4":
						this.popupTitle = "공정안전자료 보완대상 등록";
						this.widthObject = {width:"800px"}; 
						this.$refs.changestep4.fnSetContents(detailData);
						break;
					case "changestep5":
						this.popupTitle = "공정안전자료 보완결과 등록";
						this.widthObject = {width:"1000px"}; 
						this.$refs.changestep5.fnSetContents(detailData);
						break;
					case "changestep6":
						this.popupTitle = "변경요소 교육";
						this.widthObject = {width:"720px"}; 
						this.$refs.changestep6.fnSetContents(detailData);
						break;
					case "changestep7":
						this.popupTitle = "가동전점검";
						this.widthObject = {width:"700px"}; 
						this.$refs.changestep7.fnSetContents(detailData);
						break;
					case "auditstep1":
						this.popupTitle = "자체감사계획 등록";
						this.widthObject = {width:"700px"}; 
						this.$refs.auditstep1.fnSetContents(detailData);
						break;
					case "auditstep2":
						this.popupTitle = "자체감사결과 등록";
						this.widthObject = {width:"700px"}; 
						this.$refs.auditstep2.fnSetContents(detailData);
						break;
					case "auditstep3":
						this.popupTitle = "자체감사 등급환산표";
						this.widthObject = {width:"750px"}; 
						this.$refs.auditstep3.fnSetContents(detailData);
						break;
					case "auditstep4":
						this.popupTitle = "교육결과 등록";
						this.widthObject = {width:"700px"}; 
						this.$refs.auditstep4.fnSetContents(detailData);
						break;
					case "businesspopup":
						this.popupTitle = "공정 선택";
						this.widthObject = {width:"500px"}; 
						this.$refs.businesspopup.fnSetContents(detailData);
						break;
					case "pfpopup":
						this.popupTitle = "설비선택";
						this.widthObject = {width:"900px"}; 
						this.$refs.pfpopup.fnSetContents(detailData);
						break;
					case "userpopup":
						this.popupTitle = "사원 선택";
						this.widthObject = {width:"800px"}; 
						this.$refs.userpopup.fnSetContents(detailData);
						break;
					case "qmspopup":
						this.popupTitle = "첨부파일";
						this.widthObject = {width:"700px"}; 
						this.$refs.qmspopup.fnSetContents(etcData);
						break;					
					default:						
						break;
				}
			},
			// Popup Draggable 
			dragMouseDown: function (event) {
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
					}
		}
		
  	};

</script>
