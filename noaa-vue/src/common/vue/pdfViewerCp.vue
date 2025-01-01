<template>
    <div id="cpView">
		<div class="popup modal">
			<div class="popup_panel">
				<div class="popup_header" ref="draggableContainer">
					<h4>{{pass.popupTitle}}</h4>
					<div class="icon_box">
						<button class="btn btn-icon btn_fullscreen"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-fullscreen"></use></svg></button>
						<button class="btn btn-icon btn_popup_close" @click="fnClose($event,pass.parameter);"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-delete"></use></svg></button>
					</div>
				</div>
				<div class="contents popup_contents" id="contents">
					<!-- <slot name="contents"></slot> -->
                    <!-- <div id="pdf_viewer" width="1500px"></div> -->
                    <vue-pdf-app style="height: 1300px; width:1500px" :pdf="path" :file-name="orgfileNm" page-scale="100"></vue-pdf-app>
				</div>
			</div>
		</div>
	</div>
	<!-- <modal :pass="{popupTitle: pass.popupTitle}">
		<template v-slot:contents>
            <div id="pdf_viewer" width="1500px"></div>
		</template>
	</modal> -->
</template>


<style>
.pdfobject-container {height: 100%; width: 1500px; border: 1rem solid #eee; }
.pdfobject {min-height: calc(80vh);}
</style>
<script>
    import "es6-promise/auto";
    import Vue from "vue";
    import Axios from "axios";
    import VuePdfApp from 'vue-pdf-app'
    // import PDFObject from "pdfobject";
    //import Modal from './modal.vue'

    export default {
        data: function() {
            return {
                pass:{
                    popupTitle:'',
                },
                path:"",
                orgfileNm:"",
                positions: {
                clientX: undefined,
                clientY: undefined,
                movementX: 0,
                movementY: 0
                }
            };
        },
        components: {
            //Modal,
            // 'PDFviewer' : PDFviewer
            VuePdfApp
        },
        mounted: function() {
            //let vm = this;
        },
        methods: {
            fnSetContents:function(path, orgfileNm,popupTitle){
                let vm = this;
                $("#cpView").show();
                //console.log(' popupTitle : ' , popupTitle );

                //Modal.methods.fnInit();
                // $('.pdfView_wrap').show();
                // vm.path = path;
                // // vm.$parent.bool = true;
                // vm.pass.popupTitle=popupTitle;
                // PDFObject.embed(vm.path, "#pdf_viewer", {
                //     height: "100%",
                //     pdfOpenParams: { view: 'FitV', page: '2' },
                //     forcePDFJS: true
                // });

                // Modal.methods.fnInit();
                vm.path = path;
                vm.orgfileNm = orgfileNm;
                // vm.$parent.bool = true;
                vm.pass.popupTitle=popupTitle;
            },
            fnClose :function(event,parameter){
                //popup 닫기

                // console.log(' event : ' , event );
                // console.log(' parameter : ' , parameter );

                $("#cpView").hide();
                // $(event.target).closest('.modal_wrap').hide();
                
                // if(parameter == 'hse'){
                //     this.$emit('close',false);
                // }else{
                //     $(event.target).closest('.modal_wrap').hide();
                // }
                
            }
            // dragMouseDown: function (event) {
            //     event.preventDefault()
            //     // get the mouse cursor position at startup:
            //     this.positions.clientX = event.clientX
            //     this.positions.clientY = event.clientY
            //     document.onmousemove = this.elementDrag
            //     document.onmouseup = this.closeDragElement
            //     },
            // elementDrag: function (event) {
            //     event.preventDefault()
            //     this.positions.movementX = this.positions.clientX - event.clientX
            //     this.positions.movementY = this.positions.clientY - event.clientY
            //     this.positions.clientX = event.clientX
            //     this.positions.clientY = event.clientY
            //     // set the element's new position:
            //     this.$refs.draggableContainer.style.top = (this.$refs.draggableContainer.offsetTop - this.positions.movementY) + 'px'
            //     this.$refs.draggableContainer.style.left = (this.$refs.draggableContainer.offsetLeft - this.positions.movementX) + 'px'
            // },
            // closeDragElement () {
            //     document.onmouseup = null
            //     document.onmousemove = null
            // },
            
        }
    };
</script>