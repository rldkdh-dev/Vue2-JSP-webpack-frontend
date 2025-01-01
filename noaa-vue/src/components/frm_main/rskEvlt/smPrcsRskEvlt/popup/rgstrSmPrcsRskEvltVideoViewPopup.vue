<template>
    <modal :pass="{popupTitle: '회의 동영상 보기'}" @close="close()">
		<template v-slot:contents>
            <div class="divide video">
                <div>
                    <video controls width="640" height="360" ref="video" id="video">
                        <source :src="videoSrc" :type="'video/mp4'">
                    </video>
                </div>
                <div>
                    <ul class="list w360">
                        <li class="play" v-for="(item, i) in viewModel.filelist" :key="i">
                            <!-- <a href="javascript:void(0);" class="thumbnail">
                                <img src="/" alt="섬네일 이미지">
                                <svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-video-pause"></use></svg>
                            </a> -->
                            <div>
                                <a href="javascript:void(0);" @click="fnChngVideo(i)">{{ item.orgnl_file_nm }}</a>
                                <span>{{ item.reg_dt|yyyyMMdd }}</span>
                            </div>
                        </li>
                    </ul>
                </div>
                
            </div>
		</template>
	</modal>
</template>

<script>
    import "es6-promise/auto";
    import Vue from "vue";
    import Axios from "axios";
    import Modal from '../../../popup/modal.vue'
    import Message, {messageUtil} from "../../../../../common/js/message";

    export default {
        props: ['pass'],
        data: function() {
            return {
                viewModel:{
                    data:{},
                    userInfo:{},
                    filelist: [],
                },
                videoSrc:'',
                videoExtn:'',
            };
        },
        components: {
            Modal,
        },
        mounted: function() {
            let vm = this;
        },
        methods: {
            fnInit:function(sn){
                let vm = this;
                vm.viewModel.userInfo = vm.$store.state.global.userInfo;

                Modal.methods.fnInit();

                vm.fnDetail(sn);
            },
            fnDetail: function(sn){
                let vm = this;

                let send = {
                    spcm_risk_evl_sn: sn,
                    file_se:1
                }

                Axios.post("/selectSmPrcsRskEvltFileDetail.do", send)
                .then(function(response) {
                    vm.viewModel.data = response.data.detail;
                    vm.viewModel.filelist = response.data.fileList;
                }).then(function(){
                    vm.fnChngVideo(0)
                });
            },
            fnChngVideo:function(idx){
                let vm = this;

                vm.videoSrc = (vm.viewModel.filelist[idx].strg_path.charAt()=='/' ? vm.viewModel.filelist[idx].strg_path : vm.viewModel.filelist[idx].strg_path.substring(2)) + vm.viewModel.filelist[idx].strg_file_nm;
                vm.videoExtn = vm.viewModel.filelist[idx].file_extn;

                vm.$refs.video.load(); // 비디오 로드
                vm.$refs.video.play(); // 비디오 실행
            },
            close: function(){
                let vm = this;
                vm.$refs.video.pause();
            }
        }
    };
</script>