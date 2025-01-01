<template>
<div>
    <div class="contents write">
        <div>
            <table class="table horizontal write">
                <caption>아차사고 이력등록</caption>
                <tbody>
                    <tr>
                        <th scope="row"><label for="">일자</label></th>
                        <td>
                            <div class="datepicker_box">
                                <input type="text" class="datepicker" id="" title="datepicker">
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row"><label for="">제목</label></th>
                        <td><input type="text" id="" title="제목"></td> 
                    </tr>
                    <tr>
                        <th scope="row"><label for="">위치</label></th>
                        <td>
                            <select title="위치">
                                <option disabled selected>장소 선택</option>
                                <option>1공장</option>
                                <option>2공장</option>
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row"><label for="">아차사고 내용</label></th>
                        <td><textarea title="아차사고 내용"></textarea></td> 
                    </tr>
                    <tr>
                        <th scope="row"><label for="">재발방지 대책</label></th>
                        <td><textarea title="재발방지 대책"></textarea></td> 
                    </tr>
                    <tr>
                        <th scope="row"><label for="">사진</label></th>
                        <td>
                            <div class="upload_file_wrap">
                                <div class="upload_file">
                                    <div class="btn filebox">
                                        첨부파일을 마우스로 드래그해서 추가해 주세요.
                                    </div>
                                    <input type="file" hidden="" id="uf01">
                                    <label for="uf01" class="btn btn-white"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-folder-filled"></use></svg>찾아보기</label>
                                </div>
                                <div class="icon_box">
                                    <a href="" class="btn btn-icon"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-add-circle"></use></svg></a>
                                    <a href="" class="btn btn-icon"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-circle-minus"></use></svg></a>
                                </div>
                                <div class="icon_box">
                                    <a href="" class="btn btn-icon"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-arrow-up-circle"></use></svg></a>
                                    <a href="" class="btn btn-icon"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-arrow-down-circle"></use></svg></a>
                                </div>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row"><label for="">첨부</label></th>
                        <td>
                            <div class="upload_file_wrap">
                                <div class="upload_file">
                                    <div class="btn filebox">
                                        첨부파일을 마우스로 드래그해서 추가해 주세요.
                                    </div>
                                    <input type="file" hidden="" id="uf01">
                                    <label for="uf01" class="btn btn-white"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-folder-filled"></use></svg>찾아보기</label>
                                </div>
                                <div class="icon_box">
                                    <a href="" class="btn btn-icon"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-add-circle"></use></svg></a>
                                    <a href="" class="btn btn-icon"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-circle-minus"></use></svg></a>
                                </div>
                                <div class="icon_box">
                                    <a href="" class="btn btn-icon"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-arrow-up-circle"></use></svg></a>
                                    <a href="" class="btn btn-icon"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-arrow-down-circle"></use></svg></a>
                                </div>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div class="table_footer btn-right">
                <a href="" class="btn btn-purple"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-post-add"></use></svg>등록</a>
                <a href="" class="btn btn-white"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-list-back"></use></svg>목록</a>
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