<template>
<div>
    <div class="contents write">
        <div>
            <table class="table horizontal write">
                <tbody>
                    <tr>
                        <th scope="row"><label for="emgcPl01">분류</label></th>
                        <td colspan="3">
                            <select title="비상사태 분류">
                                <option disabled selected>분류 선택</option>
                                <option>중대재해</option>
                                <option>방화/소방</option>
                                <option>풍수해</option>
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row"><label for="emgcPl02">현장명</label></th>
                        <td colspan="3"><input type="text" id="emgcPl02"></td>
                    </tr>
                    <tr>
                        <th scope="row"><label for="">문서번호</label></th>
                        <td><input type="text" id=""></td>
                        <th scope="row"><label for="">개정번호</label></th>
                        <td><input type="text" id=""></td>
                    </tr>
                    <tr>
                        <th scope="row"><label for="">시행일자</label></th>
                        <td><input type="text" id=""></td>
                        <th scope="row"><label for="">개정일자</label></th>
                        <td><input type="text" id=""></td>
                    </tr>
                </tbody>
            </table>
            <table class="table horizontal write">
                <tbody>
                    <tr>
                        <th scope="row"><label for="">작성자</label></th>
                        <td><input type="text" id=""></td>
                        <th scope="row"><label for="">조정자</label></th>
                        <td><input type="text" id=""></td>
                        <th scope="row"><label for="">결정자</label></th>
                        <td><input type="text" id=""></td>
                    </tr>
                </tbody>
            </table>
            <div class="table_footer btn-right">
                <a href="" class="btn btn-purple"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-post-add"></use></svg>등록</a>
            </div>
        </div>
    </div>
</div>
</template>

<script>
    import "es6-promise/auto";
    import Vue from "vue";
    import Axios from "axios";
    
    export default {
      data: function() {
        return {
			imgsrc:'',
		};
      },
      mounted: function() {
		let vm = this;
		//vm.fnInit();
	  },
      methods: {

		fnInit:function(){
			let vm = this;
            let send = {
                mapperId:'Data.selectPolicy',
                totalId:'Data.getBaseCheckListTotalCount',
            }
            Axios.post("/adminlist", send)
            .then(function(response) {
                vm.imgsrc = response.data.list[0].contents;
                // editor.setData('\''+text+'\'');
                // editor.setData(text);
				$('.image').css('width', '44.41%');
            });
        },
	  }
    };
</script>
