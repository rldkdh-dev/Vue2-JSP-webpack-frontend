<template>
	<div class="main">
		<main class="map" v-cloak>
			<div id="map"></div>
			<div class="legend">
				<p>주요시설</p>
				<ul>
					<li><i class="icon_lgz"></i>대형</li>
					<li><i class="icon_high"></i>고위험</li>
					<li><i class="icon_general"></i>일반</li>
				</ul>
			</div>
		</main>
		<popups ref="popups" v-if="pop==true"></popups>
	</div>
</template>

<script>
import 'es6-promise/auto'
import Vue from 'vue'
import Axios from 'axios'
// import topheader from '../../../components/topheader.vue';
import popups from './popup/noticePopup.vue';
import store from "../../../store";
//import Common from '../../common.js';
//import VueApexCharts from "vue-apexcharts";
// Vue.use(VueApexCharts);
//Vue.component("apexchart", VueApexCharts);
Vue.component("popups", popups);

export default{
	store,
	components : {
		popups
		//VueApexCharts
	},
    data: function () {
        return {
			popuplist:[],
			user: {},
			pop: false,
        }
    },
    mounted: function() {
		let vm = this;
		
		
		// vm.fnGetPopupCheck(); // 팝업여부 확인.

		
		//vm.fnNoticeList();
		//vm.fnChart();

		//지도 표출
		//var map = vm.fnDrwMap();
		//console.log(' map 3 : ' , map );
		//vm.$store.getters["global/fnDrwMap"];
		//vm.$store.commit('global/setMap',map);

		// vm.pop=true;
		// vm.$nextTick(function() {
		// 	if(vm.pop) {
		// 		vm.$refs.popups.fnInit();
		// 	}
		// })
    },
    methods: {
        
		// fnGetPopupCheck : function(){
   		//   	let vm = this;  
    		// let senddata = {
    		// 	mapperId : 'Design.SelectPopupCheckList',
    		//   	};

			// vm.popuplist = 'ABC';
    		// Axios.post("/admindetail.do", senddata).then(function(response) {
			// 	let cookiedata = document.cookie;
			// 	let cookielist = [];
			// 	let cokielist2 = [];
			// 	let data = cookiedata.split("; ");
			// 		data.forEach(element =>{
			// 			let cookiesdata = parseInt(element.split("=")[0]);
			// 			cookielist.push(cookiesdata);
			// 		});
			// 		response.data.forEach(element2 =>{
			// 			let cookiesdata2 = element2.uid;
			// 			cokielist2.push(cookiesdata2);
			// 		});
			// 		if(cookielist.length != 0){	
			// 			let lastcookie = [{}];
			// 				lastcookie = cookielist.filter(item => cokielist2.includes(item));
			// 			let popupdata = response.data;
			// 				vm.popuplist = popupdata.filter(x=> !lastcookie.includes(x.uid));
			// 		}else{
			// 			vm.popuplist = response.data;
			// 		};
			// });
		// }
    }
}
</script>
