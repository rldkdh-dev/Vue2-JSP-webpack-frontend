<template>
    <modal :pass="{popupTitle:'안전보건 교육자료 상세'}">
        <template v-slot:contents>
            <div>
                <table class="table horizontal write">
                    <caption>안전보건 교육자료 상세</caption>
                    <tbody>
                        <tr>
                            <th scope="row"><label for="">종류</label></th>
                            <td>
                                {{ item.edu_se_nm }}
                            </td>
                        </tr>
                        <tr>
                            <th scope="row"><label for="">교육명</label></th>
                            <td>{{ item.edu_nm_ttl }}</td>
                        </tr>
                        <tr>
                            <th scope="row"><label for="">교육일시</label></th>
                            <td>
                                {{ item.edu_dt }}
                            </td>
                        </tr>
                        <tr>
                            <th scope="row"><label for="">작성자</label></th>
                            <td>
                                {{ item.reg_nm }}
                            </td>
                        </tr>
                        <tr>
                            <th scope="row"><label for="">첨부파일</label></th>
                            <td>
                                <ul>
                                    <li v-for="item in viewModel.filelist">
                                        <a class="btn-link" @click="fnFileDown(item)">{{ item.orgnl_file_nm }}</a>
                                    </li>
                                </ul>
                            </td>
                        </tr>
                    </tbody>
                </table>                    
            </div>
        </template>
    </modal>
</template>
<script>
    import "es6-promise/auto";
    import Vue from "vue";
    import Axios from "axios";
    import Message, {messageUtil} from "../../../../common/js/message";
    import modal from '../../../../common/vue/modal.vue';
    Vue.component('modal',modal);
    export default {
      data: function() {
        return {
            isAlert:false,
            uid:"",
            item:{},
            eduCodeList:[],
            viewModel:{
                filelist:[{seq: 0}],
                fileGroup: '',
                deletefileList: [],
            }
        };
      },
      mounted: function() {
      },
      methods: {
        fnInit:function(sn){
            let vm = this;

            modal.methods.fnInit();
            vm.uid = sn;
            vm.reg_id = vm.$store.state.global.userInfo.user_id;
            if(sn != "" && sn != undefined){
                vm.fnwkRglHsEdc(sn);
            }
        },
        fnwkRglHsEdc:function(sn){
            let vm = this;

            let item = {}
            Axios.post('/selectWkRglHsEdcWrite.do',{edu_sn:sn}).then(function(res){
                vm.item = res.data.hsEdList[0];
                if(res.data.hsEdList[0].cnt > 0){
                    vm.fnFileLoad(res.data.hsEdList[0].edu_sn);
                }
            });
        },
        fnFileLoad: function(groupid) {
            let vt = this;
            let vm = this.viewModel;

            Axios.post("/hsEdFilelist.do",{groupid:groupid}).then(function(rs) {
                let filelist = rs.data.filelist;
                if(filelist.length>0) {
                    vm.filelist = filelist;
                    vm.fileGroup = rs.data.atchmnfl_sn;
                    for(let i=0; i<rs.data.filelist.length; i++) {
                        vm.filelist[i].seq = i;
                    }
                }
                // vt.$emit('filelist', vm);
            });
        },
        fnClose:function(){
            this.$parent.fnInit();
            this.$emit('close',false);
        },
        fnFileDown:function(item){
            let vm = this;
            let send = {
                file_sn: item.file_sn,
                gbn:'wkRgl'
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
      }
    };
</script>