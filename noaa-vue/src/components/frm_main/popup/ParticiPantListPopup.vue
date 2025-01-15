<template>
    <div>
        <div class="popup modal active">
            <div class="popup_panel">
                <div class="popup_header">
                    <h4>참석자 명단</h4>
                    <div class="icon_box">
                        <!-- <button class="btn btn-icon btn_fullscreen"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-fullscreen"></use></svg></button> -->
                        <button class="btn btn-icon btn_popup_close" @click="fnClose()"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-delete"></use></svg></button>
                    </div>
                </div>
                <div class="contents popup_contents">
                    <table class="table">
                        <caption>참석자 명단</caption>
                        <thead>
                            <tr>
                                <th scope="col">직책</th>
                                <th scope="col">이름</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="item in list" :key="item">
                                <td>{{ item.jbgd_nm }}</td>
                                <td>{{ item.user_nm }}</td>
                            </tr>
                        </tbody>
                    </table>
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
            edu_sn:0,
            list:[]
        };
      },
      mounted: function() {},
      methods: {
        fnInit:function(sn){
            this.edu_sn = sn;
            this.fnSet(sn);
        },
        fnClose:function(){
            // this.$parent.fnInit();
            this.$emit('close',false);
        },
        fnSet:function(sn){
            let vm = this;

            Axios.post("/selectParticiPantList.do",{sn:sn}).then(function(res){
                vm.list = res.data.participantList
            })
        },
      }
    };
</script>