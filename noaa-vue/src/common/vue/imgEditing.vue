<template>
    <div class="signature-control-area" style="display:none;">
        <div class="slider-control-area">
            <div id="thick-slider"><span class="s-dot"></span><span class="b-dot"></span></div>
        </div>
        <div class="color-control-area">
            <ul id="color_picker">
                <li><div class="color-pick color-01" data-color="#ffffff"><i></i></div></li>
                <li><div class="color-pick color-02" data-color="#000000"><i></i></div></li>
                <li><div class="color-pick color-03" data-color="#f3ff00"><i></i></div></li>
                <li><div class="color-pick color-04 active" data-color="#ff0000"><i></i></div></li>
                <li><div class="color-pick color-05" data-color="#1b00ff"><i></i></div></li>
                <li><div class="color-pick color-06" data-color="#00be00"><i></i></div></li>
            </ul>
        </div>
    </div>
</template>

<script>
import Axios from 'axios'

    export default {
		components: {
		},
		data: function() {
            return{
                colorR : 255,
                colorG : 0,
                colorB : 0,
                opacity : 1.0,
                signaturePad:'',
                canvas:'',
                canvasImg:'',
                canvasOverlay:'',
                context:'',

                signatureJSON : '',
                overlay_maxwidth : '',
                overlay_maxHeight:'',
				cv_width : '',
				cv_height : '',
				cv_ratio : '',

                editInfo : {},
                editableClickYn: "N",
            }
        },
        mounted: function() {
			console.log('img-editing')
			this.user = this.$store.state.global.userInfo;
            this.canvas = document.getElementById('signatureCanvas');
            this.context = this.canvas.getContext('2d');
			this.signaturePad = new SignaturePad(this.canvas, { minWidth: 0.5, maxWidth: 2.5 });
            this.fnEditor()
		},
		methods: {
            fnEditor:function(){
                let vm = this;
                vm.signaturePad.off();
                $('#editable').on('click', function() {
                    vm.editableClickYn = "Y";
				    $(this).toggleClass("active");
                    if($(this).hasClass("active")){
                        if(vm.signaturePad != undefined){
                            vm.signaturePad.on();
                        }else{
                            vm.signaturePad = new SignaturePad(vm.canvas, { minWidth: 0.5, maxWidth: 2.5 });
                        }
                        vm.fnChangeColor();
                        vm.fnResizeCanvas();
                        $(".signature-control-area").show();
                    }else{
                        vm.fnEditable_close();
                    }
			    })
                $("#thick-slider").slider({
                    value:2.5,min:0.5,max:10,step:0.5,
                    slide: function(event, ui) {
                        if(vm.signaturePad != undefined){
                            vm.signaturePad.maxWidth = ui.value;
                            //vm.signaturePad.clear();
                        }
                    }
                });
                $("#bright-slider").slider({
                    value:1.0,min:0.1,max:1.0,step:0.1,
                    slide: function(event, ui) {
                        opacity = ui.value;
                        vm.fnChangeColor();
                    }
                });

                $("#color_picker li div").click(function (){
                    $("#color_picker li div").removeClass('active');
                    $(this).addClass('active');
                    var hex = $(this).data('color');
                    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
                    vm.colorR = parseInt(result[1], 16);
                    vm.colorG = parseInt(result[2], 16);
                    vm.colorB = parseInt(result[3], 16);
                    vm.fnChangeColor();
                });

                $('#editclear').on('click', function() {
                    if(vm.signaturePad != undefined){
                        vm.signaturePad.clear();
                    }
                });
            },
            fnChangeColor : function(){
                let vm = this;
                if(vm.signaturePad != undefined){
                    vm.signaturePad.penColor = "rgb(" + vm.colorR + ", " + vm.colorG + ", " + vm.colorB + ", " + vm.opacity + ")";
                }
            },
            fnEditable_close : function(){
                let vm = this;
                if(vm.signaturePad != undefined){
                    vm.signaturePad.off();
                }
                $(".signature-control-area").hide();
            },
            fnResizeCanvas : function() {
                let vm = this;
                var ratio =  Math.max(window.devicePixelRatio || 1, 1);
                
                //if(vm.canvas.width != vm.canvas.offsetWidth || vm.canvas.height != vm.canvas.offsetHeight){
                    vm.canvas.width = vm.canvas.offsetWidth;
                    vm.canvas.height = vm.canvas.offsetHeight;
                    console.log("img loading");
                    
                    // let newImg = new Image();
                    // newImg.src = vm.$parent.uploadImageSrc_cnvs;
                    // newImg.onload = function() {
                    //     vm.context.drawImage(newImg, 0,0,vm.canvas.width, vm.canvas.height);
                    // }
                    
                //}  

                // if(vm.canvas.width != vm.canvas.offsetWidth * ratio || vm.canvas.height != vm.canvas.offsetHeight * ratio){
                //     vm.canvas.width = vm.canvas.offsetWidth * ratio;
                //     vm.canvas.height = vm.canvas.offsetHeight * ratio;

                //     alert(vm.canvas.width)
                //     setTimeout(function () {
                //         console.log("");
                //         let newImg = new Image();
                //         newImg.src = vm.$parent.uploadImageSrc_cnvs;
                //         vm.context.scale(1,1);
                //         vm.context.drawImage(newImg, 0,0,vm.canvas.width, vm.canvas.height);
                //     }, 800);
                // }        
            },
            fnResizeCanvasImg : function() {
                let vm = this;
                var ratio =  Math.max(window.devicePixelRatio || 1, 1);
                
                vm.canvas.width = vm.canvas.offsetWidth;
                vm.canvas.height = vm.canvas.offsetHeight;
                console.log("img loading");
                
                let newImg = new Image();
                newImg.src = vm.$parent.uploadImageSrc_cnvs;
                newImg.onload = function() {
                    vm.context.drawImage(newImg, 0,0,vm.canvas.width, vm.canvas.height);
                }
            },
            fnImging : function(param, gbn){     //저장 로직
                let vm = this;
                var image = new Image();
                var edit;
                var editImg = new Image();
				if(vm.signaturePad != undefined){
					var signatureData = vm.signaturePad.toData();
					var myJsonString = JSON.stringify(signatureData);
					vm.signatureJSON = myJsonString;
					vm.overlay_maxwidth = vm.signaturePad.maxWidth;
                    vm.overlay_maxHeight = vm.signaturePad.maxHeight;
					// vm.cv_width = vm.canvas.width;
					// vm.cv_height = vm.canvas.height;
					vm.cv_ratio = Math.max(window.devicePixelRatio || 1, 1);

                    image.src = vm.signaturePad.toDataURL("image/png"); //Convert
					// vm.signatureImage = image;
				}

                image.addEventListener("load", function() {
                    html2canvas(document.querySelector("#signatureCanvas"), {backgroundColor:null, logging: true, allowTaint:true, useCORS:true}).then(canvas => {
                        var newImg = new Image();
                        canvas.getContext('2d').drawImage(newImg, 0, 0, vm.canvas.width, vm.canvas.height); //이미지, x좌표, y좌표, 가로크기, 세로크기 
                        edit = canvas.toDataURL("image/png", 1);
                        editImg.src = edit;

                        let sendData = {
                            originImg : param, 
                            editImg : edit,
                            canvasWidth : vm.canvas.width,
                            canvasHeight : vm.canvas.height,
                            uid: vm.$parent.uid,
                            mode: vm.$parent.mode,
                            editableClickYn: vm.editableClickYn,
                            gbn: gbn,
                        }
                        Axios.post('/imgEdit', sendData).then((rs) => {
                            vm.editInfo = rs.data;
                            vm.editInfo.overlay_ratio = vm.cv_ratio;
                            vm.editInfo.overlay_maxwidth = vm.overlay_maxwidth;
                            vm.editInfo.overlay_maxHeight = vm.overlay_maxHeight;
                            vm.editInfo.signatureJSON = vm.signatureJSON;
                            //vm.$emit('editInfo', vm.editInfo);
                            let parentVm = {}

                            if(gbn == "coach"){
                                parentVm = vm.$parent.viewModel;
                            }else if(gbn == "opin"){
                                parentVm = vm.$parent;
                            }else{
                                parentVm = vm.$parent.viewModel.img;
                            }
                            let imgData = {
                                filename : vm.editInfo.orginImgName,
                                mime : parentVm.filelist.type,
                                size : vm.editInfo.overlay_bytes != undefined ? vm.editInfo.overlay_bytes : vm.editInfo.bytes,
                                source : parentVm.filelist.name, 
                                ext : vm.editInfo.originType,
                                overlay_json : vm.signatureJSON, 
                                overlay_maxwidth : vm.overlay_maxwidth, 
                                overlay_width : vm.editInfo.overlay_width, 
                            	overlay_height : vm.editInfo.overlay_height, 
                                overlay_ratio : vm.cv_ratio, 
                                overlay_image : vm.editInfo.editImgName, 
                                full_image: vm.editInfo.overlayImgName,
                                image_width : vm.editInfo.originWidth, 
                            	image_height : vm.editInfo.originHeight,
                            	filePath : vm.editInfo.workPath,
                                work_uid: vm.$parent.uid == "" ? parentVm.seq : vm.$parent.uid,
                            }

                            // if(vm.$parent.mode == "update"){
                            //     imgData.mapperId = 'coach.updateCoachImg';
                            // }else{
                            if(gbn == "opin"){
                                imgData.mapperId = 'opin.insertOpinImg';
                            }else{
                                imgData.mapperId = 'coach.insertCoachImg';
                            }
                            
                            // }
                            Axios.post("/insert", imgData).then(function(res){
								//vt.$refs.imgEdit.fnImging(vm.originImg);
                                vm.$parent.fnFileCmpl();
							});
                        });
                    });
                })             
            }
        }
    }
</script>