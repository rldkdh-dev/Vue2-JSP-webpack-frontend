<template>
    <div>
        <div class="contents write">
            <div>
                <table class="table horizontal write">
                    <caption>건의사항 상세</caption>
                    <tbody>
                        <tr>
                            <th scope="row" class="w220"><label for="ttl">제목</label></th>
                            <td colspan="3">{{ viewModel.data.ttl }}</td>
                        </tr>
                        <tr>
                            <th scope="row"><label for="se">구분</label></th>
                            <td>{{ viewModel.data.se_nm }}</td>
                            <th scope="row"><label for="wrtr">작성자</label></th>
                            <td>{{ viewModel.data.reg_nm }}</td>
                        </tr>
                        <tr>
                            <th scope="row"><label for="cn">내용</label></th>
                            <td colspan="3" style="white-space: pre-wrap;">{{ viewModel.data.cn }}</td>
                        </tr>
                        <tr>
                            <th scope="row"><label for="wrtr">첨부파일</label></th>
                            <td colspan="3">
                                <ul>
                                    <li v-for="item in viewModel.filelist">
                                        <a @click="fnFileDown(item)" style="cursor: pointer;" class="btn-link">{{ item.orgnl_file_nm }}</a>
                                    </li>
                                </ul>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row"><label for="ans">답변</label></th>
                            <td :colspan="3"><textarea rows="5" id="ans" v-model="viewModel.data.ans" ></textarea></td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="table_footer btn-right">
                <button class="btn btn-purple" @click.prevent="fnSave()"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-post-add"></use></svg>등록</button>
                <router-link :to="'/'" class="btn btn-white"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-list-back"></use></svg>목록</router-link>
            </div>
        </div>
    </div>
</template>

<script>
    import "es6-promise/auto";
    import Vue from "vue";
    import Axios from "axios";
    import Message, {messageUtil} from "../../../../common/js/message";
    import fromValidation from "../../../../common/js/fromValidation";

    export default {
        data: function() {
            return {
                viewModel:{
                    data:{},
                    userInfo:{},
                    filelist:[],
                },
                isSaved:false,
            }
        },
        components: {
        },
        activated:function(){
            this.fnInit();
        },
        deactivated:function(){
            this.$destroy();
        },
        mounted: function() {
            let vm = this;
        },
        beforeRouteLeave: function(to, from, next){
            let vm = this;
            if(!vm.isSaved){
                if(!confirm("페이지를 이동할 경우 현재 페이지는 저장되지 않습니다.\n그래도 나가시겠습니까?")){
                    return false;
                } 
            }
            next();
        },
        methods: {
            fnInit: function(){
                let vm = this;
                let sn = vm.$route.params.sn;

                vm.viewModel.userInfo = vm.$store.state.global.userInfo;

                vm.fnDetail(sn);
            },
            fnDetail:function(sn){
                let vm = this;
                let data = {
                    sugest_sn: sn,
                }
                Axios.post("/selectSugestDetail.do", data)
                .then(function(response) {
                    vm.viewModel.data = response.data.detail;
                    vm.viewModel.filelist = response.data.fileList;

                    vm.$refs.files.fnFileLoadList(vm.viewModel.filelist);
                });
            },
            fnFileDown:function(item){
                let vm = this;
                let send = {
                    sn: item.sn,
                    file_sn: item.file_sn,
                    gbn:'sugest'
                }
                $(".loading").show();
                $("#mask").show();
                Axios.post("/download.do",send,{responseType: "blob",}
                ).then(function(e) {
                    const url = window.URL.createObjectURL(new Blob([e.data], { type: e.headers["content-type"] }))
                    const link = document.createElement("a")
                    link.href = url
                    link.download = item.orgnl_file_nm
                    link.click()
                    window.URL.revokeObjectURL(url)
                }).then(function(){
                    $(".loading").hide();
                    $("#mask").hide();
                });
            },
            fnSave:function(){
                let vm = this;

                const valiData = [
					{id: 'ans', type: 'input', title: '답변'},
				];

                if(!fromValidation(valiData)){
                    return false;
                }

                let data = {
                    reg_id: vm.viewModel.userInfo.user_id,
                    ans: vm.viewModel.data.ans,
                    sugest_sn: vm.viewModel.data.sugest_sn,
                };
                

                if(confirm("저장하시겠습니까?")){
                    Axios.post("/updateSugestReply.do", data).then(function(response) {
                        if(response.data == 1){
                            vm.isSaved = true;
                            vm.$router.push('/');
                            alert("저장되었습니다.");
                        }else{
                            alert(Message.ERROR);    
                        }
                    }).catch(function(ex) {
                        alert(Message.ERROR);
                    });
                }
            },
        }
    };
</script>