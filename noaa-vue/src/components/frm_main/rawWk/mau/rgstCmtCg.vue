<template>
<div>
    <div class="search_area">
        <button class="btn_toggle_search">검색</button>
        <div>
            <div class="search_container">
                <div class="row">
                    <div class="datepicker_box">
                        <input type="text" class="datepicker hasDatepicker" id="dp1687913692598"><img class="ui-datepicker-trigger" src="/img/ic-calendar.png" alt="날짜선택" title="날짜선택">
                    </div>
                </div>
                <div class="row">
                    <select title="조치부서 선택">
                        <option disabled="" selected="">조치부서 선택</option>
                        <option>선택</option>
                        <option>선택</option>
                    </select>
                    <input type="text" placeholder="검색어를 입력하세요." title="검색어 입력">
                    <input type="text" placeholder="검색어를 입력하세요." title="검색어 입력">
                </div>
                <div class="row">
                    <select title="조치부서 선택">
                        <option disabled="" selected="">조치부서 선택</option>
                        <option>선택</option>
                        <option>선택</option>
                    </select>
                    <select title="조치부서 선택">
                        <option disabled="" selected="">조치부서 선택</option>
                        <option>선택</option>
                        <option>선택</option>
                    </select>
                    <select title="조치부서 선택">
                        <option disabled="" selected="">조치부서 선택</option>
                        <option>선택</option>
                        <option>선택</option>
                    </select>
                    <select title="조치부서 선택">
                        <option disabled="" selected="">조치부서 선택</option>
                        <option>선택</option>
                        <option>선택</option>
                    </select>
                    <select title="조치부서 선택">
                        <option disabled="" selected="">조치부서 선택</option>
                        <option>선택</option>
                        <option>선택</option>
                    </select>
                    <input type="text" placeholder="검색어를 입력하세요." title="검색어 입력">
                    <input type="text" placeholder="검색어를 입력하세요." title="검색어 입력">
                    <input type="text" placeholder="검색어를 입력하세요." title="검색어 입력">
                </div>
            </div>
            <div class="btn-group">
                <a href="" class="btn btn-default-line"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-refresh"></use></svg>초기화</a>
                <a href="" class="btn btn-default"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-search"></use></svg>검색</a>
            </div>
        </div>
    </div>
    <div class="contents">
        
        <div>
            <div class="table_top">
                <div class="total_count">총 <em>123,456</em>건</div>
                <div class="icon_box">
                    <button class="btn btn-white"><i class="icon_pdf"></i></button>
                    <button class="btn btn-white"><i class="icon_word"></i></button>
                    <button class="btn btn-white"><i class="icon_ppt"></i></button>
                    <button class="btn btn-white"><i class="icon_excel"></i></button>
                </div>
                <select>
                    <option value="10">10개씩 보기</option>
                    <option value="30">30개씩 보기</option>
                    <option value="50">50개씩 보기</option>
                    <option value="100">100개씩 보기</option>
                </select>
            </div>
            <table class="table">
                <caption>위원회/협의체 등록</caption>
                <thead>
                    <tr>
                        <th scope="col">선택</th>
                        <th scope="col">번호</th>
                        <th scope="col">제목</th>
                        <th scope="col">휴대전화번호</th>
                        <th scope="col">이름</th>
                        <th scope="col">숫자</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            <input type="checkbox" id="" title="선택">
                        </td>
                        <td>24</td>
                        <td class="text-left">왼쪽정렬</td>
                        <td>010-1234-5678</td>
                        <td>김안전</td>
                        <td class="text-right">123,456,789</td>
                    </tr>
                </tbody>
            </table>
            <div class="table_footer">
                <pager :pass="viewModel.pager"></pager>
                <div class="btn-group"> 
                    <div class="upload_file">
                        <div class="btn filebox">
                            첨부파일을 마우스로 드래그해서 추가해 주세요.
                            <svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-mouse"></use></svg>
                        </div>
                    </div>				
                    <a href="" class="btn btn-white"><i class="icon_excel"></i>엑셀업로드</a>
                    <a href="" class="btn btn-purple"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-post-add"></use></svg>등록</a>
                    <a href="" class="btn btn-gray"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-trash-can"></use></svg>삭제</a>
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script>
    import "es6-promise/auto";
    import Vue from "vue";
    import Axios from "axios";
    import Pager from "../../../paging.vue";
    
    export default {
        components: {
            'pager': Pager,
        },
        data: function() {
            return {
                imgsrc:'',
                viewModel:{
                    userInfo:{},
                    pager: {
                        model: {},
                        pageNo: 1,
                        totalSize: 0,
                        rowSize: 10,
                        blockSize: 10,
                        list: [],
                        callBack: function (n) {
                            try{
                                this.model.fnList(n);
                            } catch(e){
                                console.log('callback error  ' + e);
                            }
                        }
                    },
                }
            };
        },
        mounted: function() {
            let vm = this;
            //vm.fnInit();
        },
        methods: {
            fnInit:function(){
                let vm = this;
                vm.viewModel.userInfo = vm.$store.state.global.userInfo;
                vm.fnList(0)
            },
            fnList:function(paramPageNo){
				let vm = this;
				
                vm.viewModel.pager.pageNo = paramPageNo == 0 ? 1 : paramPageNo;
                
                let send = {
                    mapperId:'Data.selectPolicy',
                    totalId:'Data.getBaseCheckListTotalCount',
                }
                Axios.post("/adminlist", send)
                .then(function(response) {
                    // vm.imgsrc = response.data.list[0].contents;
                    // editor.setData('\''+text+'\'');
                    // editor.setData(text);
                    // $('.image').css('width', '44.41%');

                    //페이징세팅
                    Pager.props = Pager.methods.createPaging(vm.viewModel.pager, vm, "list");
                });
            }
        }
    };
</script>