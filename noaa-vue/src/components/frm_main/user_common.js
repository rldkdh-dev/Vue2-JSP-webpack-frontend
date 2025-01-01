import Xlsx from 'xlsx';

export default{
    fnTableExcelFile: function(table_name, file_name){
		let workBook = Xlsx.utils.book_new();
		let workSheet = Xlsx.utils.table_to_sheet(document.getElementById(table_name)); 
  		Xlsx.utils.book_append_sheet(workBook, workSheet, 'example');
  		Xlsx.writeFile(workBook, file_name+'.xlsx');
	}
}