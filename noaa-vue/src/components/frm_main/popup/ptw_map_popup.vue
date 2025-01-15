<template>
	<modal :pass="{widthObject: 800, heightObject: 500, popupTitle: viewModel.item.title}">
		<template v-slot:contents>
			<div id="map" class="map"></div>
		</template>
	</modal>
</template>
<script>
import Axios from 'axios';
import Vue from 'vue'
import Common from '../../common.js';
import Modal from './modal.vue'
import ImageLayer from 'ol/layer/Image';
import Map from 'ol/Map';
import Projection from 'ol/proj/Projection';
import Static from 'ol/source/ImageStatic';
import View from 'ol/View';
import {getCenter} from 'ol/extent';
import Icon from 'ol/style/Icon';
import Style from 'ol/style/Style';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import SourceVector from 'ol/source/Vector';
import LayerVector from 'ol/layer/Vector';
import ptwRefFilePopup from '../popup/ptwRefFilePopup.vue'


export default {
	components: {
		Modal,
		ImageLayer,
		Map,
		Projection,
		Static,
		View,
		Icon,
		Style,
		Feature,
		Point,
		SourceVector,
		LayerVector,
		getCenter,
	},
	data: function () {
		return {
			uid:'',
			viewModel: {
				item: {
				},
			},
		}
	},
	mounted: function () {
	},
	methods: {
		fnInit: function(uid) {
			let vm = this;
			vm.uid = uid
			Modal.methods.fnInit();
			vm.fnDetail(uid);
		},
		fnDetail: function(uid){
			let vt = this;
			let vm = this.viewModel;
			let data = {
				mapperId: 'ptw.selectPtwList',
				pageNo: 0,
				uid: uid,
			};

			Axios.post("/list",data).then(function(rs) {
				vm.item = rs.data.list[0];
			}).then(function(){
				vt.fnMap();
			})
		},
		fnMap(){		
			//map 초기화
			$("#map").empty();
			
			let vm = this;
			let extent = [0,0,1113,422];
			let projection = new Projection({
				code: 'xkcd-image',
				units: 'pixels',
				extent: extent,
			});
			
			let iconStyle = new Style({
				image: new Icon(({
					crossOrigin: 'anonymous',
					anchor: [0.5, 1],
					anchorXUnits: 'fraction',
					anchorYUnits: 'fraction',
					scale: 30 / 30,
					src: '/design/main_asset/asset/img/map/pin.svg',
					// color:color
				}))
			});

			let iconFeature = new Feature({});
			iconFeature.setStyle(iconStyle);
			iconFeature.set("type", "3");
			
			var geometry = new Point([]);
			if(vm.viewModel.item.coord_x != '' || vm.viewModel.item.coord_y != ''){
				var geometry = new Point([vm.viewModel.item.coord_x, vm.viewModel.item.coord_y])
			}
			
			iconFeature.setGeometry(geometry);

			let vectorSource = new SourceVector({ features: [iconFeature] });

			//Setup a Vector Layer
			let vectorLayer = new LayerVector({ source: vectorSource });
			
			let map = new Map({
				layers: [
					new ImageLayer({
						source: new Static({
							url: '/design/main_asset/asset/img/map/map.png',
							projection: projection,
							imageExtent: extent,
						}),
					}), vectorLayer
				],
				target: 'map',
				view: new View({
					projection: projection,
					center: getCenter(extent),
					zoom: 2,
					maxZoom: 8,
				}),
			});	
		},
	}
};
</script>
