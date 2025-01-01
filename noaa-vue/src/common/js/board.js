import Axios from 'axios';
import Vue from 'vue';
import VueDOMPurifyHTML from 'vue-dompurify-html';
    
Vue.use(VueDOMPurifyHTML);
    
Vue.config.productionTip = false;
export default{
    fnBoardHitUpdate : function(bbs_id,uid){
		let data= { mapperId:'information.updateHit',
				    bbs_id:bbs_id,
				    uid:uid};
		Axios.post("/update", data).then(function(){
       			}).catch(function(ex) {
                     console.log(ex);
        	});
	},fnBoardContent:function(data){
		let boardContents= data;
		return boardContents;
	},fnGetMenuTitle: function(vm) {
		var path = vm.$route.path;
		var headerLastTag = $('.main .page_header .breadcrumb li:last-child');
		var headerTxt = '';
		var btnTxt = '';
        if(path == '/write') {
			headerTxt = ' - 등록';
			btnTxt = '등록';
		}
		else if(path.indexOf('/detail') > -1) {headerTxt = ' - 상세';}
		else if(path.indexOf('/write/') > -1) {
			headerTxt = ' - 수정';
			btnTxt = '수정';
		}
		else if(path.indexOf('/preview/') > -1) {headerTxt = ' - 주차별 미리보기'; btnTxt = '미리보기';}
		else headerTxt = '';

		$('.main .page_header h2').text(headerLastTag.text() + headerTxt);
		$('.main .contents .btn-group.btn-right a.btn.btn-purple').text(btnTxt);
	}
}