<template>
	<div class="percent-group">
        <template v-if="this.pass.val!=undefined">
            <span :style="(percent>100) ? 'width: 100%' : 'width:'+percent+'%'" :class="{'warning': percent>100}">{{percent}}%</span>
            <span :style="'width:'+rest+'%'"></span>
            <span style="width: 100%"></span>
        </template>
        <template v-else>
            <span style="width:0%"></span>
            <span style="width:0%"></span>
            <span style="width:100%"></span>
        </template>
    </div>
</template>
<script>
import 'es6-promise/auto'
import Vue from 'vue'
import device from "vue-device-detector";

export default{
    props: ['pass'],
    computed: {
		percent: function() {
            return Math.round(this.pass.val / this.pass.max * 100, 1)
		},
		rest: function() {
            return Math.round(this.pass.rest / this.pass.max * 100, 1)
		},
	},
}
</script>