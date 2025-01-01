import 'es6-promise/auto'
import Vue from 'vue';
import Axios from 'axios';
import device from "vue-device-detector";
import store from "../../store";
import Pager from "../../common/vue/paging";
// import Session from "../../components/frm_main/session.vue";
// import eventBus from '../../components/eventbus.js';
Vue.config.devtools = true;
Vue.use(device)
new Vue({
	store,
	el: '#scope-main-menu',
	components: {
		'pager': Pager
	},
	data: function() {
		return {
			pager: {
				model: {},
				pageNo: 1,
				totalSize: 0,
				rowSize: 5,
				blockSize: 5,
				list: [],
				callBack: function(n) {
					try {
						this.model.fnGetBplcList(n);
					} catch (e) {
						console.log('callback error  ' + e);
					}
				}
			},
			windowpath: '',
			sessionuser: {},
			user_pic_path : '',
			isOpened: true,
			timerCount: 10800,
			sessiontime: '',
			menulevelone: [],
			menuleveltwo: [],
			menulevelthree: [],
			nowMenulevelone: '',
			nowMenuleveltwo: '',
			nowMenulevelthree: '',
			menuleveloneTitle: '',
			menuleveltwoTitle: '',
			menulevelthreeTitle: '',

			map: null,
			sidoList: [],
			sigunguGroupArr: [],
			selectedSidoInfoArr: [],
			selectedSigunguInfoArr: [],
			bplcListAll: [],
			bplcList: [],
			bplcMarker: null,
			customOverlay: null,
			bplc_sn: null,
			markerArr: [],
			risk_se: 'ALL',

			favoriteMenu: []
		}
	},
	watch: {
		isOpened: function() {
			if (!this.isOpened) {
				body.classList.add('menu-opened');
			} else {
				body.classList.remove('menu-opened');
			}
		},
		timerCount: {
			handler(value) {
				if (value > 0) {
					setTimeout(() => {
						this.timerCount--;
						let hour, min, sec
						hour = parseInt(this.timerCount / 3600);
						min = parseInt((this.timerCount % 3600) / 60);
						sec = this.timerCount % 60;
						if (hour.toString().length == 1) hour = "0" + hour;
						if (min.toString().length == 1) min = "0" + min;
						if (sec.toString().length == 1) sec = "0" + sec;
						this.sessiontime = hour + "시간 " + min + "분 " + sec + "초";
						$("#session_time").text(this.sessiontime);
					}, 1000);
				}
			},
			immediate: true
		},
	},

	mounted: function() {
		let vm = this;
		vm.windowpath = window.location.pathname;

		console.log(' windowpath : ', vm.windowpath);

		if (vm.$device.ios != false || vm.$device.android != false) {
			window.location.href = "/m" + window.location.pathname;
		};
		// vm.fnSessionUser();
	},
	methods: {
		fnSessionUser: function() {
			let vm = this;

			Axios.post("/api/account/myInfo.do", {}).then(function(response) {
				vm.$store.commit("global/setUserInfo", response.data.detailUser);
				//vm.$store.commit("global/setBaseFilePath", response.data.baseFilePath);
				if (response.data.detailUser == {} || response.data.detailUser == null) {
					alert('세션이 만료되어 로그아웃 되었습니다. 다시 로그인 해주세요.');
					window.location.href = '/account/login.do';
				} else {
					// if (response.data.detailUser.sign_reg_yn != "Y" && response.data.detailUser.prvc_agre_yn != 'Y') {
					// 	alert("이용하시려면 개인정보 수집 동의 및 서명등록이 필요합니다.");
					// 	location.href = "/account/sign.do";
					// }
				vm.sessionuser = response.data.detailUser;
				
				// if(vm.sessionuser.user_pic_path.charAt()=='/') {       //리눅스 경로때문에 사용
				// 	vm.user_pic_path = vm.sessionuser.user_pic_path;
				// }else{
				// 	vm.user_pic_path = vm.sessionuser.user_pic_path.substring(2);
				// }

				//console.log(' sessionuser : ' , vm.sessionuser);

				

					// vm.fnGetSelectMenu();

					// if (vm.windowpath == '/main/index.do') {
					// 	vm.map = vm.fnDrwMap();
					// 	vm.fnGetSigunguList();
					// 	vm.fnGetBplcList(0);
					// 	vm.fnSetEvtListener();
					// } else {
					// 	vm.fnGetFavoriteList();
					// }
				}




			});
		},

		fnDrwMap: function() {
			let vm = this;
			var container = document.getElementById('map'); //지도를 담을 영역의 DOM 레퍼런스
			var options = { //지도를 생성할 때 필요한 기본 옵션
				center: new kakao.maps.LatLng(37.541, 126.986), //지도의 중심좌표.
				level: 10 //지도의 레벨(확대, 축소 정도)
			};

			let map = new kakao.maps.Map(container, options); //지도 생성 및 객체 리턴
			//vm.map = map;
			//console.log(' map : ' , map );
			//vm.$store.commit("global/setMap", map);
			//map.setMapTypeId(kakao.maps.MapTypeId.HYBRID);

			// 일반 지도와 스카이뷰로 지도 타입을 전환할 수 있는 지도타입 컨트롤을 생성합니다
			var mapTypeControl = new kakao.maps.MapTypeControl();

			// 지도에 컨트롤을 추가해야 지도위에 표시됩니다
			// kakao.maps.ControlPosition은 컨트롤이 표시될 위치를 정의하는데 TOPRIGHT는 오른쪽 위를 의미합니다
			map.addControl(mapTypeControl, kakao.maps.ControlPosition.TOPRIGHT);

			// 지도 확대 축소를 제어할 수 있는  줌 컨트롤을 생성합니다
			var zoomControl = new kakao.maps.ZoomControl();
			map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);

			mapTypeControl.a.parentNode.classList.add('map_controls');

			vm.map = map;
			return vm.map;
		},
		fnSetCenter: function() {
			var moveLatLon = new kakao.maps.LatLng(37.541, 126.986);
			this.map.panTo(moveLatLon);
		},
		fnSetEvtListener: function() {
			let vm = this;
			$('#sido_group').on('change', function() {

				vm.selectedSidoInfoArr = $(this).val().split(',');
				$('#sigungu_group option:eq(0)').prop('selected', true);

				var sido = vm.selectedSidoInfoArr[0];
				var sigunguArr = [];

				$.each(vm.sigunguList, function(idx, item) {
					if (item.SIDO == sido) {
						sigunguArr.push({
							gungu: item.GUNGU,
							lat: item.LAT,
							lng: item.LON
						});
					}
				});

				vm.sigunguGroupArr = sigunguArr;
			});

			$('#sigungu_group').on('change', function() {
				vm.selectedSigunguInfoArr = $(this).val().split(',');
			});

			$('#goCenterEvt').on('click', function() {
				if ($('#sido_group').val() == '') return;

				if (vm.customOverlay != null) vm.customOverlay.setMap(null);

				var sidoGroupArrList = [];

				if ($('#sigungu_group').val() == '') { //시도 선택
					sidoGroupArrList = vm.selectedSidoInfoArr;
					vm.map.setLevel(10);
				}
				else {
					vm.map.setLevel(5);
					sidoGroupArrList = vm.selectedSigunguInfoArr; //시군구 선택
				}

				var latlng = {
					lat: sidoGroupArrList[1],
					lng: sidoGroupArrList[2]
				}

				//var map = vm.$store.getters["global/fnDrwMap"];
				//var map = this.$store.state.global.map;
				//console.log(' map 22 : ' , JSON.parse(map) );

				var moveLatLon = new kakao.maps.LatLng(latlng.lat, latlng.lng);
				// 만약 이동할 거리가 지도 화면보다 크면 부드러운 효과 없이 이동합니다
				vm.map.panTo(moveLatLon);
			});


			// $('#map .overlaybox').on('click', function() {
			//     console.log(11);
			// });
		},
		fnGetSigunguList: function() {
			let vm = this;
			Axios.post("/main/getSigunguList.do", {}).then(function(response) {
				vm.sidoList = response.data[0];
				vm.sigunguList = response.data[1];
			});

		},
		//위경도 -> 픽셀point
		fnPointFromCoords: function(latlng) {
			// 지도 컨테이너내 픽셀 좌표로 변환합니다 
			let vm = this;
			let proj = vm.map.getProjection(),
				coords = proj.containerPointFromCoords(latlng);
			return new kakao.maps.Point(coords.x, coords.y);
		},
		//픽셀point -> 위경도
		fnCoordsFromPoint: function(xy) {
			let vm = this;
			let proj = vm.map.getProjection(),
				coords = proj.coordsFromContainerPoint(xy);
			return new kakao.maps.LatLng(coords.Ma, coords.La);
		},
		fnHideMarkers: function() {
			let vm = this;
			if (vm.customOverlay != null) vm.customOverlay.setMap(null);
			if (vm.markerArr.length > 0) {
				$.each(vm.markerArr, function(idx, item) {
					item.setMap(null);
				});
				vm.markerArr = [];
			}
		},
		fnShowMarkers: function() {
			let vm = this;
			// 마커가 지도 위에 표시되도록 설정합니다
			$.each(vm.markerArr, function(idx, item) {
				item.setMap(vm.map);
			});
		},
		fnDrawBplcMarkers: function() {
			let vm = this;

			//마커 삭제..
			vm.fnHideMarkers();

			if (vm.bplcListAll != null && vm.bplcListAll.length > 0) {

				$.each(vm.bplcListAll, function(idx, item) {
					// 마커가 표시될 위치입니다 
					var markerPosition = new kakao.maps.LatLng(item.LOT, item.LAT);
					var src = '/img/risk/' + item.RISK_SE + '.png';

					// 마커를 생성합니다
					var marker = new kakao.maps.Marker({
						position: markerPosition,
						image: new kakao.maps.MarkerImage(src, new kakao.maps.Size(30, 30)
							// , {  
							//     spriteOrigin: new kakao.maps.Point(5, 0),
							//     spriteSize: new kakao.maps.Size(40, 30)
							// }
						),
						title: item.BPLC_NM
					});

					// 마커에 마우스오버 이벤트를 등록합니다
					kakao.maps.event.addListener(marker, 'mouseover', function(evt) {

						//오버레이 위치 조정
						let latLon = new kakao.maps.LatLng(item.LOT, item.LAT);
						let xyPos = vm.fnPointFromCoords(latLon);

						// console.log(' xyPos 1 : ' , xyPos);
						// console.log(' moveLatLon 1 : ' , latLon);

						if (xyPos.y <= 600 && xyPos.y > 400) xyPos.x = xyPos.x + 300, xyPos.y = xyPos.y + 200;
						else if (xyPos.y <= 400 && xyPos.y > 200) xyPos.x = xyPos.x + 300, xyPos.y = xyPos.y + 400;
						else if (xyPos.y <= 200) xyPos.x = xyPos.x + 300, xyPos.y = xyPos.y + 600;

						if (xyPos.x > 1400) xyPos.x = xyPos.x - 600;

						let movePos = new kakao.maps.Point(xyPos.x, xyPos.y);
						let moveLatLon = vm.fnCoordsFromPoint(movePos);

						vm.fnMakeBplcInfoOverlay(item.BPLC_SN, moveLatLon.La, moveLatLon.Ma, item.BPLC_NM, item.BPLC_ADDR, item.BGNG_DT, item.END_DT, item.CTRT_AMT, item.BPLC_MNGR, item.SAFE_MNGR, item.OUTSRC_TYPE, item.CTRT_OFFIC, item.ORDER_OFFIC);
					});

					// 마커에 마우스아웃 이벤트를 등록합니다
					kakao.maps.event.addListener(marker, 'mouseout', function() {
						// 마커에 마우스아웃 이벤트가 발생하면 인포윈도우를 제거합니다
						//infowindow.close();
						vm.customOverlay.setMap(null);
					});

					// 마커를 클릭했을 때 커스텀 오버레이를 표시합니다
					kakao.maps.event.addListener(marker, 'click', function() {
						//vm.fnMakeBplcInfoOverlay(item.BPLC_SN, item.LAT, item.LOT, item.BPLC_NM, item.BPLC_ADDR, item.BPLC_MNGR);
						location.href = '/chkHthAct/chkAct/rgstChk.do';
					});

					vm.markerArr.push(marker);

				});

			}

			vm.fnShowMarkers();
		},
		fnGetBplcList: function(paramPageNo) {
			let vm = this;

			vm.pager.pageNo = paramPageNo == 0 ? 1 : paramPageNo;

			let send = {
				pageYn: 'Y',
				pageNo: vm.pager.pageNo,
				pageSize: vm.pager.rowSize,
				risk_se: vm.risk_se
			};

			Axios.post("/main/getBplcList.do", send).then(function(response) {
				vm.bplcListAll = response.data.listAll;
				vm.bplcList = response.data.list;
				vm.pager.totalSize = response.data.totalCNT;

				vm.map.setLevel(10);
				vm.fnSetCenter();
				vm.fnDrawBplcMarkers();

				//페이징세팅
				Pager.props = Pager.methods.createPaging(vm.pager, vm, "list");
			});
		},
		fnGetSelectMenu: function() {
			let vm = this;

			//console.log(' sessionuser : ' , vm.sessionuser);
			
			let sendData = {
				menu_code: vm.sessionuser.user_type_code,
				role_id: vm.sessionuser.bplc_yn == 'N' ? 'ROLE_001' : vm.sessionuser.ocpt_se_cd == 'MNG' ? 'ROLE_002' : 'ROLE_003' ,
				dept_sn: vm.sessionuser.dept_sn,
			};

			Axios.post("/account/MainMenu/list.do", sendData).then(function(response) {

				vm.$store.commit("global/setMenuList", response.data);
				vm.menulevelone = response.data.menulevelone;
				vm.menuleveltwo = response.data.menuleveltwo;
				vm.menulevelthree = response.data.menulevelthree;

				// console.log(' vm.menulevelone : ' , vm.menulevelone);
				// console.log(' vm.menuleveltwo : ' , vm.menuleveltwo);
				// console.log(' vm.menulevelthree : ' , vm.menulevelthree);

				var nowMenulevelArr = vm.windowpath.split('/');
				vm.nowMenulevelone = nowMenulevelArr[1];
				vm.nowMenuleveltwo = '/' + vm.nowMenulevelone + '/' + nowMenulevelArr[2];
				vm.nowMenulevelthree = vm.nowMenuleveltwo + '/' + nowMenulevelArr[3];

				//aside heder title 추출
				$.each(vm.menulevelone, function(idx, item) {
					if (item.menu_url.indexOf(vm.windowpath.split('/')[1]) > -1) vm.menuleveloneTitle = item.menu_title;
				});
				$.each(vm.menuleveltwo, function(idx, item) {
					if (item.menu_url.indexOf(vm.windowpath.split('/')[1] + '/' + vm.windowpath.split('/')[2]) > -1) vm.menuleveltwoTitle = item.menu_title;
				});
				$.each(vm.menulevelthree, function(idx, item) {
					if (item.menu_url.indexOf(vm.windowpath.split('/')[3]) > -1) vm.menulevelthreeTitle = item.menu_title;
				});

				//console.log(' vm.menuleveloneTitle : ', vm.menuleveloneTitle);
				//console.log(' vm.menuleveltwoTitle : ', vm.menuleveltwoTitle);
				//console.log(' vm.menulevelthreeTitle : ', vm.menulevelthreeTitle);

				// vm.$store.commit("global/setMenuTitleInfo", {
				//     menuleveloneTitle : vm.menuleveloneTitle,
				//     menuleveltwoTitle : vm.menuleveltwoTitle,
				//     menulevelthreeTitle : vm.menulevelthreeTitle
				// });

			});
		},
		fnMenuClick: function(code) {
			$('.side_nav #' + code).toggleClass('opened');
		},
		fnGetFavoriteList: function() {
			let vm = this;
			let sendData = {
				user_id: vm.sessionuser.user_id
			}
			Axios.post("/account/MainMenu/getFavoriteMenu.do", sendData).then(function(response) {
				vm.favoriteMenu = response.data;
				if (vm.favoriteMenu.length > 0 && vm.favoriteMenu != null) {
					$('.my_menu').addClass('opened');
					//$('.my_menu .favorit_list').show();
				} else {
					$('.my_menu').removeClass('opened');
					//$('.my_menu .favorit_list').hide();
				}

				$('.page_header .breadcrumb .favorite').removeClass('on');
				$('.favorite').find('use').attr('xlink:href', '/img/symbol-defs.svg#icon-star-line');

				$.each(vm.favoriteMenu, function(idx, item) {
					if (item.url == vm.windowpath) {
						$('.page_header .breadcrumb .favorite').addClass('on');
						$('.favorite').find('use').attr('xlink:href', '/img/symbol-defs.svg#icon-star');
					}
				});
			});

		},
		isNowMenu: function(url) {
			let vm = this;
			if (vm.nowMenulevelthree.indexOf(url) > -1) return true;
			return false;
		},
		fnMoveBplcNode: function(bplc_sn, lat, lot, bplc_nm, bplc_addr, bgng_dt, end_dt, ctrt_amt, bplc_mngr, safe_mngr, outsrc_type, ctrt_offic, order_offic) {
			let vm = this;
			if (lat == '' || lot == '') {
				alert('좌표값이 없습니다.');
				return;
			}

			vm.map.setLevel(5);

			var latLon = new kakao.maps.LatLng(lot, lat);
			let xyPos = vm.fnPointFromCoords(latLon);
			let movePos = new kakao.maps.Point(xyPos.x, (xyPos.y - 300));
			let moveLatLon = vm.fnCoordsFromPoint(movePos);

			// 만약 이동할 거리가 지도 화면보다 크면 부드러운 효과 없이 이동합니다
			vm.map.panTo(moveLatLon);

			vm.fnMakeBplcInfoOverlay(bplc_sn, lat, lot, bplc_nm, bplc_addr, bgng_dt, end_dt, ctrt_amt, bplc_mngr, safe_mngr, outsrc_type, ctrt_offic, order_offic);
		},
		fnMakeBplcInfoOverlay: function(bplc_sn, lat, lot, bplc_nm, bplc_addr, bgng_dt, end_dt, ctrt_amt, bplc_mngr, safe_mngr, outsrc_type, ctrt_offic, order_offic) {
			let vm = this;
			let addr = (bplc_addr.length > 30) ? bplc_addr.substr(0, 30) + '</br>' + bplc_addr.substr(30, bplc_addr.length - 1) : bplc_addr;
			var content = '<div>' +
				'<div class="popup_panel">' +
				'   <div class="popup_header">' +
				'       <h4>현장정보</h4>' +
				'           <div class="icon_box">' +
				'               <button class="btn btn-icon btn_popup_close"><svg class="icon"><use xlink:href="/img/symbol-defs.svg#icon-delete"></use></svg></button>' +
				'           </div>' +
				'       </div>' +
				'       <div class="contents popup_contents">' +
				'           <div>' +
				'               <table class="table horizontal">' +
				'                   <caption>현장정보</caption>' +
				'                   <tbody>' +
				'                       <tr>' +
				'                           <th scope="row">현장명</th>' +
				'                           <td>' + bplc_nm + '</td>' +
				'                        </tr>' +
				'                        <tr>' +
				'                            <th scope="row">현장주소</th>' +
				'                            <td>' + addr + '</td>' +
				'                        </tr>' +
				'                        <tr>' +
				'                            <th scope="row">공사기간</th>' +
				'                            <td>' + bgng_dt + '~' + end_dt + '</td>' +
				'                        </tr>' +
				'                        <tr>' +
				'                            <th scope="row">계약금액(단위:백만원)</th>' +
				'                            <td>' + ctrt_amt + '</td>' +
				'                        </tr>' +
				'                        <tr>' +
				'                            <th scope="row">소장</th>' +
				'                            <td>' + bplc_mngr + '</td>' +
				'                        </tr>' +
				'                        <tr>' +
				'                            <th scope="row">안전관리자</th>' +
				'                            <td>' + safe_mngr + '</td>' +
				'                        </tr>' +
				'                        <tr>' +
				'                            <th scope="row">도급유형</th>' +
				'                            <td>' + outsrc_type + '</td>' +
				'                        </tr>' +
				'                        <tr>' +
				'                            <th scope="row">계약처</th>' +
				'                            <td>' + ctrt_offic + '</td>' +
				'                        </tr>' +
				'                        <tr>' +
				'                            <th scope="row">발주처</th>' +
				'                            <td>' + order_offic + '</td>' +
				'                        </tr>' +
				'                    </tbody></table></div></div></div></div>';

			// 커스텀 오버레이가 표시될 위치입니다 
			var position = new kakao.maps.LatLng(lot, lat);

			//오버레이 삭제..
			if (vm.customOverlay != null) vm.customOverlay.setMap(null);

			// 커스텀 오버레이를 생성합니다
			vm.customOverlay = new kakao.maps.CustomOverlay({
				position: position,
				content: content,
				xAnchor: 0.5,
				yAnchor: 1.1
			});

			// 커스텀 오버레이를 지도에 표시합니다
			vm.customOverlay.setMap(vm.map);

			$('#map .btn_popup_close').on('click', function() {
				vm.customOverlay.setMap(null);
				vm.bplc_sn = null;
			});

		}
	}

});