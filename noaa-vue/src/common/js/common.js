import Vue from 'vue'
import Xlsx from 'xlsx';
import Axios from 'axios';
import 'regenerator-runtime/runtime'; // 꼭 추가

Vue.filter('yyyyMMdd', function(value) {
    if(value == null || value == '') return '';
    var date = new Date(value);
    var year = date.getFullYear();
    var month = (date.getMonth() + 1)<10? "0" + (date.getMonth()+1) : date.getMonth()+1;
    var day = date.getDate()<10? "0"+(date.getDate()) : date.getDate();
    return year + '-' + month + '-' + day;
})
Vue.filter('yyyyMMddHHmm', function(value) {
    if(value == null) return '';
    var date = new Date(value);
    var year = date.getFullYear();
    var month = (date.getMonth() + 1)<10? "0" + (date.getMonth()+1) : date.getMonth()+1;
    var day = date.getDate()<10? "0"+(date.getDate()) : date.getDate();

    var hh=date.getHours()<10? "0"+(date.getHours()) : date.getHours();
    var mm=date.getMinutes()<10? "0"+(date.getMinutes()) : date.getMinutes();

    return year + '-' + month + '-' + day + ' ' + hh + ':' + mm;
})
Vue.filter('moneyFilter', function(value) {
    return String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
})
Vue.filter('filesize', function(value) {
    let size=0;
    if (value >= 1048576) {
        size = (value/1048576).toFixed(1).toString() + "M";
    } else if (value >= 1024) {
        size = (value/1024).toFixed(1).toString() + "K";
    } else {
        size = (value).toString() + "byte";
    }
    return size;
})
export default{
    fnPrintDate: function(_date){
	
        let _month=_date.getMonth();
        _month="0"+(_month+1);
        let _day="0"+_date.getDate();
        
        return _date.getFullYear()+"-"+_month.substring(_month.length-2,_month.length)+"-"+_day.substring(_day.length-2,_day.length);
        
    }

    ,fnPrintDateByNum: function(_date){
        if(_date!=null && _date!=""){
            let year=_date.substring(0,4);
            let month=_date.substring(4,6);
            let day=_date.substring(6,8);
            return year+"-"+month+"-"+day;
        }
        return "";
    }

    ,fnConvertStrDate: function(str,exp){
        let year;
        let month;
        let day;
        if(exp == null){
            year = str.substring(0,4);
            month = str.substring(4,6);
            day = str.substring(6,8);  
        }else{
            str=str.split(exp);
            year = str[0];
            month = str[1];
            day = str[2];  
        }
        return new Date(year,month,day);
    }
    
    ,fnConvertDateStr: function(paramDate,exp){
        let _date = new Date(paramDate);
        let month = _date.getMonth() + 1;
        let day = _date.getDate();
        let year = _date.getFullYear();
        let _month = month < 10 ? "0"+ month: month;
        let _day = day < 10 ? "0"+ day: day;
        if(exp == null){
            return year+ "/"+ _month+ "/" + _day;
        }else{
            return year+ exp+ _month+ exp + _day;
        }
    }

    ,fnDateTimeStr : function(date){	
        if(date==null){
            return '';
        }else{
            let dt = new Date(date);
            let month = dt.getMonth() + 1;
            let day = dt.getDate();
            let year = dt.getFullYear();
            day=day<10?"0"+day:day;
            let _month = month < 10 ? "0"+ month: month;

        return year+'-'+_month+'-'+day;
            
        }
    }

    ,fnDateTimeStrtime : function(date){	
        if(date==null){
            return '';
        }else{
            let dt = new Date(date);
        
            let month = dt.getMonth() + 1;
            let day = dt.getDate();
            let year = dt.getFullYear();
            let hh=dt.getHours();
            let min=dt.getMinutes();
            let ss=dt.getSeconds();
            day=day<10?"0"+day:day;
            hh=hh<10?"0"+hh:hh;
            min=min<10?"0"+min:min;
            ss=ss<10?"0"+ss:ss;
            let _month = month < 10 ? "0"+ month: month;

        return year+'-'+_month+'-'+day+" "+hh+":"+min+":"+ss;
            
        }
    }

    ,fnOnFileDownload:function(seq){
		window.location='/file/download/'+seq;
    }
    
    ,fnConvertDateTimeStr : function(_date,exp){	
        if(_date==null){
            return '';
        }
        
        let dt = new Date(_date);
        
        let month = dt.getMonth() + 1;
        let day = dt.getDate();
        let year = dt.getFullYear();
        let hh=dt.getHours();
        let min=dt.getMinutes();
        let ss=dt.getSeconds();
        day=day<10?"0"+day:day;
        hh=hh<10?"0"+hh:hh;
        min=min<10?"0"+min:min;
        ss=ss<10?"0"+ss:ss;
        let _month = month < 10 ? "0"+ month: month;
        if(exp == null){
            return year+ "/"+ _month+ "/" + day+" "+hh+":"+min+":"+ss;
        }else{
            return year+ exp+ _month+ exp + day+" "+hh+":"+min+":"+ss;
        }
    }

    ,fnTableExcelFile: function(table_name, file_name){
		let workBook = Xlsx.utils.book_new();
		let workSheet = Xlsx.utils.table_to_sheet(document.getElementById(table_name)); 
  		Xlsx.utils.book_append_sheet(workBook, workSheet, 'example');
  		Xlsx.writeFile(workBook, file_name+'.xlsx');
	},

    //날짜 주차 추출
    getWeek : function(date) {
        const currentDate = date.getDate();
        const firstDay = new Date(date.setDate(1)).getDay();
      
        return Math.ceil((currentDate + firstDay) / 7);
    },
    fnGetBaseCodeJson: async function (arr) {
        let data = {};
    
        // 입력 데이터 처리
        if (typeof arr === "string") {
            data.code_category_id = arr;
        } else if (typeof arr === "object") {
            if (Array.isArray(arr)) {
                data.search_code_category_id = arr;
            } else {
                return 'Type Error!!';
            }
        }
    
        try {
            // Axios 요청과 결과 처리
            const response = await Axios.post("/usingCodeList.do", data);
            return response.data.codeList; // 요청 성공 시 codeList 반환
        } catch (error) {
            console.error("Error in fnGetBaseCodeJson:", error);
            return error; // 요청 실패 시 에러 반환
        }
    }
      
}