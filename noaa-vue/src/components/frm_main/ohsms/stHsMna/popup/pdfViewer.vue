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
				<div class="contents popup_contents" style="min-height: 500px;" id="contents">
					<slot name="contents">
                        <div id="pdf_viewer" width="1500px"></div>
                    </slot>
				</div>
			</div>
		</div>
	</div>
</template>
<style>
.pdfobject-container {height: 100%; width: 1500px; border: 1rem solid #eee; }
.pdfobject {min-height: calc(80vh);}
</style>
<script>
    import "es6-promise/auto";
    import Vue from "vue";
    import Axios from "axios";
    // import PDFObject from "pdfobject";

    export default {
        data: function() {
            return {
                pass:{
                    popupTitle:'',
                },
                path:"",
                positions: {
                clientX: undefined,
                clientY: undefined,
                movementX: 0,
                movementY: 0
                }
            };
        },
        mounted: function() {
            let vm = this;
        },
        methods: {
            fnSetContents:function(path,popupTitle){
                let vm = this;
                vm.path = path;
                vm.bool = true;
                vm.pass.popupTitle=popupTitle;
                PDFObject.embed(vm.path, "#pdf_viewer", {
                    height: "100%",
                    pdfOpenParams: { view: 'FitV', page: '2' },
                    forcePDFJS: true
                    });
            },
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
            },
            fnClose :function(event){
		        let vm = this;
                //popup 닫기
        		$(event.target).closest('.modal_wrap').hide();
                vm.$parent.bool =false;
        	},
            
        }
    };
</script>