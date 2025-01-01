<template>
	<modal :pass="{widthObject: 500, popupTitle: 'PPT 다운로드'}">
		<template v-slot:contents>
            <div class="content-area res">
	
                <p class="fs14">ppt로 출력하시겠습니까?</p>

                <div class="buttonbox">
                    <a href="javascript:;" class="btn btn-dark" @click="fnPPTdownload('l')">슬라이드 세로</a>
                    <a href="javascript:;" class="btn btn-save btn-primary" @click="fnPPTdownload('w')">슬라이드 가로</a>
                </div><!-- } button-area -->

            </div><!-- // content-area -->
		</template>
	</modal>
</template>
<script>
    import "es6-promise/auto";
    import Vue from "vue";
    import Axios from "axios";
    import Modal from './modal.vue'
    Vue.component('Modal',Modal);
    export default {
      data: function() {
        return {
            list:[],
        };
      },
      mounted: function() {

      },
      methods: {
          fnInit: function(list) {
        $("#popupBase").show();
        $("#mask").show();
              this.list = list;
        // this.fnSetContents(id);
        },
        fnPPTdownload:function(type){ 
          let vm =this;
          Axios.post("/poi/ppt",{list:vm.list,type:type},{responseType: "blob",}
          ).then(function(e) {
            const url = window.URL.createObjectURL(new Blob([e.data], { type: e.headers["content-type"] }))
            const link = document.createElement("a")
            link.href = url
            link.download = "안전보건코칭_ppt.pptx"
            link.click()
            window.URL.revokeObjectURL(url)
          });
        }
      }
    };
</script>