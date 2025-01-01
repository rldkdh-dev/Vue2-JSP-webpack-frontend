<template>
    <table id="tbl_quizlist" class="form-table">
        <colgroup>
            <col width="10%">
            <col width="*">
        </colgroup>
        <tr v-for="(item, i) in viewModel.quizlist" :key="pass.id+i" :id="pass.id+i">
            <th scope="row">{{i + 1}}.문항</th>
            <td>
                <!-- <input type="hidden" name="qs_nos" value="{{ i }}">
                <input type="hidden" name="qs_uids[<?=$key?>]" value="<?=$item['uid']?>"> -->
                <div class="field-group">
                    <div class="inline-block">
                        <input type="text" class="w650" :id="'quiz'+i" placeholder="문제를 입력해주세요." v-model="viewModel.quizlist[i].question">
                    </div>
                    <div class="inline-block">
                        <button type="button" class="btn btn-icon btn-danger2" @click="fnDeleteQuestion(i)"><span class="mi">close</span></button>
                        <button type="button" class="btn btn-icon btn-light2" @click="fnMoveQuiz(i, -1)"><span class="mi">arrow_upward</span></button>
                        <button type="button" class="btn btn-icon btn-light2" @click="fnMoveQuiz(i, 1)"><span class="mi">arrow_downward</span></button>
                    </div>
                    <div class="inline-block">
                        배점 : (
                            <div class="unit_wrap percent mt5">
                                <input type="number" id="score" name="score" class="w150" v-model="viewModel.quizlist[i].score" >
                            </div>
                        )
                    </div>
                    <div class="mt5">
                        <div class="area">
                            <ul>
                                <li v-for="(optionItem, j) in item.optionlist" :id="pass.id+i+'_'+j" :key="pass.id+i+'_'+j" class="mb5">
                                    <label class="radio_label in" style="vertical-align: middle" @click="fnClickLabel(i, j)">
                                        <input type="radio" :id="'option_num'+i+'_'+j" :name="'option_num'+i" :value="j+1">
                                        <span class="checkmark" :id="'checkmark'+i+'_'+j"></span>
                                        <!--
                                             <span class="checkmark" :id="'checkmark'+i+'_'+j" name="checkmark"></span> -->
                                        <span class="txt">{{j+1}}</span>
                                    </label>
                                    <input type="text" class="w650" :id="'option'+i+'_'+j" placeholder="객관식문항을 입력해주세요." v-model="item.optionlist[j].option">
                                    <button type="button" class="btn btn-icon btn-light2 md" @click="fnDeleteOption(i,j)"><span class="mi">close</span></button>
                                </li>
                                <!-- <? for($i=0;$i<count($opt_list);$i++) { ?>
                                <li class="mb5">
                                    <label class="radio_label in" style="vertical-align: middle">
                                        <input type="radio" name="answer[<?=$key?>]" value="<?=$i+1?>" <?=get_checked(($i+1), $item['answer_no'])?>>
                                        <span class="checkmark"></span>
                                        <span class="txt"><?=$i+1?></span>
                                    </label>

                                    <input type="text" name="opt[<?=$key?>][]" class="w690" required="" placeholder="객관식문항을 입력해주세요." value="<?=$opt_list[$i]['option']?>">
                                    <button type="button" class="btn btn-icon btn-light2 md" onclick="opt_del(this);"><span class="mi">close</span></button>
                                </li>
                                <? } ?> -->
                            </ul>
                            <button type="button" class="btn btn-secondary" @click="fnAddOption(i)"><span class="mi">추가</span></button>
                            <!-- <input type="button" onclick="opt_add(this, '<?=$key?>');" class="btn btn-secondary" value="추가"> -->
                        </div>
                    </div>
                </div>
            </td>
        </tr>
    </table>
</template>
<script>
import 'es6-promise/auto'
import Vue from 'vue'
import Axios from 'axios'

export default{
    props: ['pass'],
    data: function () {
        return {
            viewModel: {
                quizlist: [{seq: 0, optionlist: [{optionSeq :0,},{optionSeq :1,},{optionSeq :2,}],},],
            }
        }
    },
    mounted: function() {
    },
    methods: {
        fnInit:function(list){
            let vt = this;
            let vm = this.viewModel;
            let templist = [];
            let cnt = 0;
            vm.quizlist= [];
            for(let i=0; i<list.length;i++){
                templist.push({"optionSeq" :(list[i].option_num)-1, "option_num":list[i].option_num, "option" : list[i].option, "option_uid" : list[i].option_uid, "is_answer" : list[i].is_answer })
                if(i == list.length-1){
                    vm.quizlist.push({"seq": cnt, "question_uid": list[i].question_uid, "question" : list[i].question, "score": list[i].score, "answer_no": list[i].answer_no ,  "optionlist" : templist});
                }else if(list[i].question_uid != list[(i+1)].question_uid){
                    vm.quizlist.push({"seq": cnt, "question_uid": list[i].question_uid, "question" : list[i].question, "score": list[i].score, "answer_no": list[i].answer_no , "optionlist" : templist});
                    templist = [];
                    cnt = 0;
                }
                cnt++;
            }

            setTimeout(() => {
                this.fnIsAnswerCheck();
            }, 100);
        },
    	fnInsertQuiz: function(id) {
            let vt = this;
            let vm = this.viewModel;
            let data = {
                mapperId: 'edu.deletEduQuestion',
                quiz_uid: id
            };
            if(confirm("삭제하시겠습니까?")) {
                Axios.post("/delete", data)
                .then(function(rs) {
                    vm.fnList(0);
                });
            }
            
            for(let i=0; i<vm.quizlist.length; i++) {
                let key = vm.filelist[i].file_seq;
                if(vm.filelist[i].file != null) {
                    frm.append("uploadFiles", vm.filelist[i].file);
                    frm.append("key", 0)
                    if(key!=null) {
                        Axios.post('/file/drop/'+key, key).then((response) => {
                            vt.fnAfterDelete(i)
                        });
                    }
                } else {
                    frm.append("key", key)
                }
            }
            Axios.post('/main/file/upload', frm, {headers: {'Content-Type': 'multipart/form-data'}}).then((response) => {
                console.log(response.data)
            });
        },
        fnAddQuiz: function() {
            let vm = this.viewModel;
            vm.quizlist.push({seq: vm.quizlist.length, optionlist: [{optionSeq :0,},{optionSeq :1,},{optionSeq :2,}],},);
        },
        fnDeleteOption:function(index, optionIndex) {
            let vt = this;
            let vm = this.viewModel;
            let qlist = vm.quizlist[index];
            let key = qlist.optionlist[optionIndex].seq;

            if(key == undefined && confirm('삭제하시겠습니까?')) {
                if(qlist.optionlist.length > 1) {
                    qlist.optionlist.splice(index, 1);
                    for(let i=0; i<qlist.optionlist.length; i++){
                        qlist.optionlist[i].optionSeq = i;
                    }
                } else {
                    // $('#option'+index+'_'+optionIndex).val(null);
                    // qlist.optionlist = [{optionSeq: 0},{optionSeq :1,},{optionSeq :2,}]
                    alert("더이상 삭제할수 없습니다.");
                }
                vt.$emit('quizlist.optionlist', vm);
            }
        },
        fnDeleteQuestion: function(index) {
            let vt = this;
            let vm = this.viewModel;
            let key = vm.quizlist[index].quiz_uid;

            if(key == undefined && confirm('삭제하시겠습니까?')) {
                vt.fnAfterDelete(index)
            }
        },
        fnAfterDelete: function(index) {
            let vt = this;
            let vm = this.viewModel;
            if(vm.quizlist.length > 1) {
                vm.quizlist.splice(index, 1);
                for(let i=0; i<vm.quizlist.length; i++){
                    vm.quizlist[i].seq = i;
                }
            } else {
                $('#quiz'+vt.pass.id+index).val(null);
                vm.quizlist = [{seq: 0, optionlist: [{optionSeq :0,},{optionSeq :1,},{optionSeq :2,}],},]
            }
            vt.$emit('quizlist', vm);
        },
        fnMoveQuiz: function(index, ud) {
            //문항 순서 바꾸기
            let vt = this;
            let vm = this.viewModel;
            let item1 = vm.quizlist[index];
            let item2 = vm.quizlist[index+ud];

            if((index == 0 && ud == -1) || (index == vm.quizlist.length-1 && ud == 1)){
                
            }else{
                vm.quizlist[index] = item2;
                vm.quizlist[index+ud] = item1;
                vm.quizlist.splice(index, 1, item2);
                vm.quizlist.splice(index+ud, 1, item1);
            }
        },
        // fnDragOver: function(event){
        //     event.stopPropagation();
        //     event.preventDefault();
        // },
        fnAddOption: function(index){
            let vm = this.viewModel;
            vm.quizlist[index].optionlist.push({"optionSeq": vm.quizlist[index].optionlist.length});
        },
        fnClickLabel:function(i, j){
            let vm = this.viewModel;
            vm.quizlist[i].answer_no = (j+1);
        }, 
        fnIsAnswerCheck : function(){
            let vm = this.viewModel;
            for(let i=0; i<vm.quizlist.length; i++){
                for(let j=0; j<vm.quizlist[i].optionlist.length; j++){
                    if(vm.quizlist[i].optionlist[j].is_answer == 1){
                        $("#checkmark"+i+"_"+j).trigger("click");
                    }
                }
            };
        }
    }
}
</script>