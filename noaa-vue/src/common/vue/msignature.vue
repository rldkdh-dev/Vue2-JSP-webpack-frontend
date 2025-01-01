<template>
<div v-if="drawing == 'coach'">
    <div class="mb5">
        <img :src="imgSrc" id="tempImg" style="display: none;">
    </div>
    <canvas id="signatureCanvas" style="touch-action: none;"></canvas>
</div>
<div v-else>
    <div class="mb5">
        <p>서명 (마우스로 싸인)을 해주세요.</p>
        <button @click="erase" class="btn btn-small btn-white"><svg class="icon">
                <use xlink:href="/img/symbol-defs.svg#icon-signature-reset"></use>
            </svg>서명 초기화</button>
        <img :src="imgSrc" id="tempImg" style="display: none;">
    </div>
    <canvas id="signatureCanvas" style="background-color: white;"></canvas>
</div>
</template>

<script>
let context;
let canvas;
let x = 0;
let y = 0;
let offsetX = 0;
let offsetY = 0;
export default {
    // eslint-disable-next-line vue/multi-word-component-names
    name: "signature",
    props: {
        // eslint-disable-next-line vue/require-prop-type-constructor
        imgSrc: "",
        drawing: {
            type: String,
            default: "false"
        },
        imgWidth: {
            type: Number,
            default: 0
        },
        imgHeight: {
            type: Number,
            default: 0
        },
        penColor: {
            type: String,
            default: "#ff0000"
        },
        penWidth: {
            type: Number,
            default: 1
        }
    },
    mounted() {
        const vm = this;

        canvas = document.getElementById('signatureCanvas');
        context = canvas.getContext('2d');
        let isDrawing;

        function drawSign(ctx, x1, y1, x2, y2) {
            if (ctx != null) {
                ctx.save();
                ctx.beginPath();

                if (vm._props.drawing == 'coach') {
                    ctx.strokeStyle = vm._props.penColor;
                    ctx.lineWidth = vm._props.penWidth;
                } else {
                    ctx.strokeStyle = "";
                    ctx.lineWidth = 3;
                }
                ctx.moveTo(x1, y1);
                ctx.lineTo(x2, y2);
                ctx.stroke();
                ctx.closePath();
                ctx.restore();
            }
        }
        canvas.addEventListener("touchstart", function (e) {
            const rect = canvas.getBoundingClientRect();
            x = e.touches[0].clientX - rect.left;
            y = e.touches[0].clientY - rect.top;
            isDrawing = true;
            e.preventDefault();

        });
        canvas.addEventListener("touchmove", function (e) {
            if (isDrawing) {
                const rect = canvas.getBoundingClientRect();
                offsetX = e.touches[0].clientX - rect.left;
                offsetY = e.touches[0].clientY - rect.top;
                drawSign(context, x, y, offsetX, offsetY);
                x = offsetX;
                y = offsetY;
                vm.$parent.drawYn = true;
            }
        });
        canvas.addEventListener("touchend", function (e) {
            if (isDrawing) {
                drawSign(context, x, y, offsetX, offsetY);
                x = 0;
                y = 0;
                offsetX = 0;
                offsetY = 0;
                isDrawing = false;
            }
        });

        // const img = document.getElementById('tempImg');
        // img.src = vm._props.imgSrc;
        // img.addEventListener("load", function() {
        // 	if(vm._props.drawing == 'coach'){
        // 		canvas.width=vm._props.imgWidth;
        // 	    canvas.height=vm._props.imgHeight;
        //         context.drawImage(img, 0, 0, canvas.width, canvas.height);
        // 	}else{
        // 		context.drawImage(img, 10, 10);
        // 	}
        // })

    },
    methods: {
        // 캔버스를 파일 오브젝트로 변경.
        canvasToFileObject: function (fileName) {
            let baseData = canvas.toDataURL();
            let filename = fileName ? fileName : "sign.png";
            var arr = baseData.split(','),
                mime = arr[0].match(/:(.*?);/)[1],
                bstr = atob(arr[1]),
                n = bstr.length,
                u8arr = new Uint8Array(n);
            while (n--) {
                u8arr[n] = bstr.charCodeAt(n);
            }
            return new File([u8arr], filename, {
                type: mime
            });
        },
        //캔버스 이미지 클리어.
        erase: function () {
            let vm = this;
            vm.$parent.drawYn = false;
            if (context != null) {
                context.clearRect(0, 0, canvas.width, canvas.height);

                // 안전보건코칭(coach)일때 canvas 클리어 이후 이미지 다시 그려주기
                if (vm._props.drawing == 'coach') {
                    const img = document.getElementById('tempImg');
                    context.drawImage(img, 0, 0, canvas.width, canvas.height);
                }

            }
        },
        fnInitCanvas: function (img) {
            let newImg = new Image();
            newImg.src = img;
            newImg.onload = function () {
                context.drawImage(newImg, 0, 0, 300, 150);
            }
        }

    }
}
</script>

<style scoped>
canvas {
    border: solid 1px;
}
</style>
