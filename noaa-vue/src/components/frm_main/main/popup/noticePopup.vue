<template>
    <modal :pass="{popupTitle: '공지'}">
		<template v-slot:contents>
			<div class="pre">
                □ 서버 증설 작업에 따른 일시 접속 제한 안내.

                - 작업일시 : 2024년 9월 5일 목요일
                        오후 15:00~(약 5~6시간 소요 예상)
                - 작업내용 : 서버 용량 증설 작업

                ※ 작업 완료시간 변동 시 사전 공지 예정(조기, 연장 등)
                ※ 서버작업 해당일 필요 인쇄 서류의 경우 서버 폐쇄 전 미리 인쇄 바랍니다.(일일, 상시 위평표 등)
            </div>
		</template>
	</modal>
</template>

<script>
    import "es6-promise/auto";
    import Vue from "vue";
    import Axios from "axios";
    import Modal from '../../popup/modal.vue'

    export default {
        props: ['pass'],
        data: function() {
            return {
            };
        },
        components: {
            Modal
        },
        mounted: function() {
            let vm = this;
            // vm.fnInit();
        },
        methods: {
            fnInit:function(sn){
                let vm = this;

                Modal.methods.fnInit();
            },
        }
    };
</script>