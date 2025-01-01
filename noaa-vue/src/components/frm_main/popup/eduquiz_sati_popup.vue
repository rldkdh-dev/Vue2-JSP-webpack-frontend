<template>
	<modal :pass="{widthObject: 1000, popupTitle:'교육 만족도 조사'}">
		<template v-slot:contents>
			<div class="w_box">
				<h1 style="text-align: center; font-size: 16px; padding-top: 30px;">{{ item.subject }}</h1>
				<div class="clearfix">
					<div class="chart-box chart1" style="width:40%;float: left;">
						<apexchart type="bar" height="300" width="400" :options="mainBar" :series="mainBarSeries"></apexchart>
					</div>
					<div class="chart-box chart2" style="width:40%;float: left; margin-left:50px;">
						<apexchart type="donut" height="300" width="400" :options="mainDonut"></apexchart>
					</div>
				</div>
			</div>
		</template>
	</modal>
</template>
<script>
import Axios from 'axios';
import Vue from 'vue'
import Modal from './modal.vue'
import VueApexCharts from "vue-apexcharts";

Vue.component("apexchart", VueApexCharts);

export default {
	components: {
		Modal,
		VueApexCharts
	},
	data: function () {
		return {
			list:[],
			item:{},
			mainDonut: {},
			mainBar: {},
			mainBarSeries: []
		}
	},
	mounted: function () {
	},
	methods: {
		fnInit: function(id) {
			Modal.methods.fnInit();
			this.fnSetContents(id);
		},
		fnSetContents: function(id){
			let vt = this;  
			let senddata = {
				mapperId :['edu.selectEduQuizList','edu.selectStsfcList'],
				quiz_uid: id,
				uid: id 
			};
			Axios.post("/multiList", senddata).then(function(response) {
				vt.item = response.data.list1[0];
				vt.list = response.data.list2;
				
				let stsfcS = [];
				let stsfcL = [];
				for(var i=0; i<vt.list.length;i++){
					stsfcL.push(vt.list[i].cd_name);
					stsfcS.push(vt.list[i].stsfc_cnt);
				} 

				vt.mainBarSeries =[{
					name: "교육 만족도",
					data:stsfcS
				}],
				vt.mainBar = {
					colors: ['#ef9a9a', '#f48fb1', '#ce93d8', '#b39ddb', '#9fa8da'],
					chart: {
						type: 'bar',
						height: '300'
					},
					xaxis: {
						type: 'category',
						categories: stsfcL
					},		              
					plotOptions: {
						bar: {
							horizontal: false,
							columnWidth: "20%",
							endingShape: "rounded"
						}
					}     
				}
					
				vt.mainDonut = {
					series:stsfcS,
					colors: ['#ef9a9a', '#f48fb1', '#ce93d8', '#b39ddb', '#9fa8da'],
					labels: stsfcL,
					responsive: [
						{
						breakpoint: 480,
						options: {
							legend: {
								position: "bottom"
							}
						}
						}
					],
				};
			});
		},
	}
};
</script>
