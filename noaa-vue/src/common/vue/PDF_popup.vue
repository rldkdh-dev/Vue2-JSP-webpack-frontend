<template>
	<!-- <div>
		<div id='mask' class="overlay_mask" style="opacity: 0.45; display: none;"></div>
		<div id="popupBase"  class="overlay_formbox ui-draggable" style="left: 42%; top: 15%; position: absolute; display:none;" ref="draggableContainer">
	  		<div class="overlay_gen_box ui-resizable" style="width: 500px;">
				<a href="javascript:void(0);" class="btn_fullscreen" onclick="btn_fullscreen();"></a>
				<a href="javascript:void(0);" class="btn_formbox_close" onclick="btn_formbox_close();"></a>
		  
				<div class="formbox_panel">
					<div class="title-area type">
						<span class="title"  @mousedown="dragMouseDown">PDF 뷰어</span>
					</div>
					<div class="content-area res">  -->
						<div id="pdf_viewer"></div>
					<!-- </div>
				</div>
				<div class="ui-resizable-handle ui-resizable-se of_rse" style="z-index:90; display:block;"></div>
			</div>
		</div>
	</div> -->
</template>
<style>
.overlay_gen_box {width: 800px;}
.pdfobject-container {height: 100%;border: 1rem solid #eee; }
.pdfobject {min-height: calc(80vh);}
</style>
<script>
    import "es6-promise/auto";
    import Vue from "vue";
    import Axios from "axios";
    
    export default {
      data: function() {
        return {
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
        fnSetContents:function(path){
            let vm = this;
            vm.path = path;
            vm.bool = true;
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
        }
      }
    };
</script>