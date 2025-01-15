<template>
    <div>
        <div class="contents">
            <div class="divide">
                <div>
                    <h3>기본정보</h3>
                    <table class="table horizontal write">
                        <caption>계획등록</caption>
                        <tbody>
                            <tr>
                                <th scope="row"><label for="p1">교육종류</label></th>
                                <td>
                                    <select title="선택" id="p1">
                                        <option disabled="" selected="">선택</option>
                                        <option selected>근로자 정기교육</option>
                                        <option>관리감독자교육</option>
                                        <option>위험작업 특별교육</option>
                                    </select>
                                </td>
                                <th scope="row"><label for="p0">교육명</label></th>
                                <td><input type="text" placeholder="입력해주세요." id="p0"></td>
                            </tr>
                            <tr>
                                <th scope="row"><label for="p3">현장명</label></th>
                                <td><input type="text" placeholder="입력해주세요." id="p3"></td>
                                <th scope="row"><label for="p31">업체명</label></th>
                                <td><input type="text" placeholder="입력해주세요." id="p31"></td>
                            </tr>
                            <tr>
                                <th scope="row">
                                    <label for="p2">일시</label>
                                    <div class="help_area">
                                        <svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-info-circle"></use></svg>
                                        <div class="tip"><p>교육시간 2시간 단위<br>(매월 2시간 실시_법 上 기준)</p></div>
                                    </div>
                                </th>
                                <td>
                                    <div class="datepicker_box">
                                        <input type="text" class="datepicker" id="p2" title="교육일시" placeholder="교육일시 선택" disabled>
                                    </div>
                                </td>
                                <th scope="row">
                                    <label for="p4">장소</label>
                                    <div class="help_area">
                                        <svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-info-circle"></use></svg>
                                        <div class="tip"><p>안전교육장 안전팀, 타 협력사 사용시간 <br>사전 조회 후 겹치지 않게</p></div>
                                    </div>
                                </th>
                                <td><input type="text" placeholder="입력해주세요." id="p4"></td>
                            </tr>
                            <tr>
                                <th scope="row">
                                    <label for="p8">교육실시자</label>
                                    <div class="help_area">
                                        <svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-info-circle"></use></svg>
                                        <div class="tip"><p>협력사 소장, EPC 시공담당, EPC 안전담당 (3명 모두 기입)</p></div>
                                    </div>
                                </th>
                                <td colspan="3"><input type="text" title="검색" id="p8"></td>
                            </tr>
                            <tr>
                                <th scope="row">
                                    <label for="p9">교육내용</label>
                                    <div class="help_area">
                                        <svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-info-circle"></use></svg>
                                        <div class="tip">
                                            <p>교육 내용은 법적인 사항으로 기입된 내용에서 수정 변경하지 말 것.</p><br>(추가하는 것은 가능)
                                        </div>
                                    </div>
                                </th>
                                <td colspan="3"><textarea title="교육내용입력" placeholder="입력해주세요." id="" rows="20">* 근로자 정기교육 </textarea></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="approval">
                    <h3>결재 정보</h3>
                    <ul>
                        <li>
                            <a href="#">
                                <div class="user_img">
                                    <!-- <img src="../../img/user1.png" alt="차안전"> -->
                                </div>
                                <span>안전</span>
                            </a>
                        </li>
                        <li>
                            <a href="#">
                                <div class="user_img">
                                    <!-- <img src="../../img/user1.png" alt="차안전"> -->
                                </div>
                                <span>시공</span>
                            </a>
                        </li>
                        <li>
                            <a href="#">
                                <div class="user_img">
                                    <!-- <img src="../../img/user1.png" alt="차안전"> -->
                                </div>
                                <span>소장</span>
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="question_list ol_counter">
                <h3 class="question"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-question"></use></svg>문제 등록</h3>
                <table class="table horizontal write">
                    <caption>문제등록</caption>
                    <tbody>
                        <tr v-for="(item ,i) in list" :key="item">
                            <th scope="row"><label for="s1">문항</label></th>
                            <td>
                                <div>
                                    <div class="input_group">
                                        <select class="wa" id="s1" v-model="list[i].selectQuestion">
                                            <option value="0">객관식</option>
                                            <option value="1">객관식 (이미지첨부)</option>
                                            <option value="2">주관식</option>
                                        </select>
                                        <textarea title="내용입력" placeholder="입력해주세요." id="" rows="1" @input="item.title = $event.target.value"></textarea>
                                        <div class="icon_box">
                                            <a @click="fnQuestionListDelete(i)" href="javascript:;" class="btn btn-icon"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-delete-circle"></use></svg></a>
                                        </div>
                                    </div>
                                    <ol v-if="item.selectQuestion == '0'">
                                        <li v-for="(items , j) in list[i].question " :key="items" :value="j">
                                            <button :class="items.active == true ? 'on':''" @click="fnAnswerCheck(i,j)"></button>
                                            <textarea title="내용입력" placeholder="입력해주세요." id="a" rows="1" @input="items.text = $event.target.value"></textarea>
                                            <div class="icon_box">
                                                <a @click="fnQuestionAdd(i,j)" href="javascript:;" class="btn btn-icon"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-add-circle"></use></svg></a>
                                                <a @click="fnQuestionDelete(i,j)" href="javascript:;" class="btn btn-icon"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-circle-minus"></use></svg></a>
                                            </div>
                                        </li>
                                    </ol>
                                    <ol v-else-if="item.selectQuestion == '1'">
                                        <li v-for="(items , j) in list[i].question " :key="items" :value="j">
                                            <button :class="items.active == true ? 'on':''" @click="fnAnswerCheck(i,j)"></button>
                                            <textarea title="내용입력" placeholder="입력해주세요." id="d" rows="1" @input="items.text = $event.target.value"></textarea>
                                            <div class="upload_file_wrap">
                                                <div class="upload_file">
                                                    <div class="btn filebox">
                                                        첨부파일을 마우스로 드래그해서 추가해 주세요.
                                                    </div>
                                                    <input type="file" hidden="" :id="f01+j">
                                                    <label :for="f01+j" class="btn btn-white"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-folder-filled"></use></svg>찾아보기</label>
                                                </div>
                                            </div>
                                            <div class="icon_box">
                                                <a @click="fnQuestionAdd(i,j)" href="javascript:;" class="btn btn-icon"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-add-circle"></use></svg></a>
                                                <a @click="fnQuestionDelete(i,j)" href="javascript:;" class="btn btn-icon"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-circle-minus"></use></svg></a>
                                            </div>
                                        </li>
                                    </ol>
                                    <ol v-else></ol>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div class="table_footer btn-left">
                    <a href="javascript:;" class="btn btn-yellow" @click="fnQuizadd"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-question-add"></use></svg>문제추가</a>
                </div>
            </div>
            <div class="btn-group btn-right">
                <a @click="fnUpload()" href="javascript:;" class="btn btn-purple"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-post-add"></use></svg>등록</a>
                <router-link to="/" class="btn btn-white"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-list-back"></use></svg>목록</router-link>
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
            list:[
                { 
                    selectQuestion:'0',
                    title:'',
                    question:[
                        {no:0,text:'',active:false,},
                        {no:1,text:'',active:false,}
                    ]
                },
            ],
        };
      },
      mounted: function() {},
      methods: {
        fnAnswerCheck:function(ind1,ind2){
            let vm = this;
            for(var i=0; i<vm.list[ind1].question.length; i++ ){
                if(i == ind2){
                    vm.list[ind1].question[ind2].active = true;
                }else{
                    vm.list[ind1].question[i].active = false;
                }
            }
        },
        fnQuizadd:function(){
            this.list.push({selectQuestion:'0',question:[{no:0,text:'',active:false,},{no:1,text:'',active:false,}]});
        },
        fnQuestionAdd:function(i,j){
            this.list[i].question.push({no:this.list[i].question.length,text:'',active:false,});
        },
        fnQuestionDelete:function(i,j){
            if(this.list[i].question.length <= 2){
                return alert("객관식 보기의 최소갯수는 2개입니다.");
            }else{
                this.list[i].question.splice(j,1);
                for(var k=0; k<this.list[i].question.length; k++){ // 문항 no 재정의
                    this.list[i].question[k].no = i;
                }
            }
        },
        fnQuestionListDelete:function(i){
            if(this.list.length <= 1){
                return alert("문항은 1개 이상이여야 합니다.");
            }else{
                this.list.splice(i,1); 
            }
        },
        fnUpload:function(){
            console.log(this.list);
        }
      }
    };
</script>