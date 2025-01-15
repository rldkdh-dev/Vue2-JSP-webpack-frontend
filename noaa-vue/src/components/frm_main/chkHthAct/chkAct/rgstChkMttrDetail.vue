<template>
   <div>
        <h3>조치사항</h3>

        <table class="table horizontal write">
            <caption>조치사항 상세</caption>
            <tbody v-for="(item, i) in viewModel.mttrList" :key="i">
                <tr>
                    <th scope="row" rowspan="5" class="text-center">
                        {{ i+1 }}
                    </th>
                    <th scope="row" class=""><label for="">지적/요청사항</label></th>
                    <td>
                        <textarea style="border: none; background-color: white;" disabled >{{ item.actn_mttr }}</textarea>
                    </td>
                </tr>
                <tr>
                    <th scope="row" class=""><label for="">조치자</label></th>
                    <td>
                        {{ item.actn_pic_nm }}
                    </td>
                </tr>
                <tr>
                    <th scope="row" class=""><label for="">사진등록</label></th>
                    <td>
                        <imgsfileform :pass="{id:'mttr'+i, index:i, gbn:'mttr'}" @filelist="fnImgFileList" @fileDelete="fnImgFileDelete" v-if="pass.mode=='update' && item.actn_pic == viewModel.userInfo.user_id" :ref="'imgsfileform'"></imgsfileform>
                        <imgsfileform :pass="{id:'mttr'+i, index:i, gbn:'mttr', mode:'view'}" @filelist="fnImgFileList" @fileDelete="fnImgFileDelete" v-else :ref="'imgsfileform'"></imgsfileform>
                    </td>
                </tr>
                <tr>
                    <th scope="row" class=""><label for="">조치내용</label></th>
                    <td>
                        <textarea id="actn_sttus" title="조치내용" v-model="item.actn_sttus" v-if="pass.mode=='update' && item.actn_pic == viewModel.userInfo.user_id">{{ item.actn_sttus }}</textarea>
                        <textarea v-else style="border: none; background-color: white;" disabled >{{ item.actn_sttus }}</textarea>
                    </td>
                </tr>
                <tr>
                    <th scope="row" class=""><label for="">진행현황</label></th>
                    <td>
                        <div v-if="pass.mode=='update' && item.actn_pic == viewModel.userInfo.user_id">
                            <template v-for="(cd_item, cd_i) in viewModel.mttrPrgrsList" :key="cd_i">
                                <label :for="'actn_prgrs'+i+'_'+cd_item.CODE"><input type="radio" :id="'actn_prgrs'+i+'_'+cd_item.CODE" :name="'radio_btn02'+i" v-model="item.actn_prgrs" :value="cd_item.CODE">{{ cd_item.CODE_NM }}</label>
                            </template>
                        </div>
                        <span v-else>{{ item.actn_prgrs_nm }}</span>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
    import "es6-promise/auto";
    import Vue from "vue";
    import Axios from "axios";
    import imgsfileform from '../../../../common/vue/imgsfileform2.vue';

    export default {
        props: ['pass'],
        data: function() {
            return {
                imgShow: false,
                popIndex: '',
                viewModel:{
                    mttrList:[],
                    delItemList:[],
                    mttrPrgrsList:[],
                    userInfo:{},
                },
            };
        },
        components:{
            'imgsfileform' : imgsfileform,
        },
        mounted: function() {
            let vm = this
            vm.viewModel.userInfo = vm.$store.state.global.userInfo;

            if(vm.$parent.sn == undefined && vm.pass.mode != 'update'){
                vm.fnWrite();
            }
        },
        methods: {
            fnAdd: function(){
                let vm = this;
                vm.viewModel.mttrList.push({actn_mttr:'', actn_pic_nm:''});

                vm.fnWrite();
            },
            fnDel: function(){
                let vm = this;

                vm.viewModel.delItemList.sort();

                if(vm.viewModel.delItemList.length > 0 ){

                    for(let i=vm.viewModel.delItemList.length-1; i>=0; i--){
                        let index = vm.viewModel.delItemList[i];
                        vm.viewModel.mttrList.splice(index, 1);
                    }
                    
                }else{
                    alert("삭제할 조치사항을 선택해주세요.");
                }

                //조치사항 하나도 없을 경우는 새로 하나 생성
                if(vm.viewModel.mttrList.length == 0){
                    vm.viewModel.mttrList.push({actn_mttr:'', actn_pic_nm:''});
                }

                //삭제 리스트 초기화
                vm.viewModel.delItemList = [];

                vm.fnWrite();
            },
            fnPopup: function(i) {
				let vm = this;
                vm.popIndex = i;
                vm.$parent.fnPopup();
			},
            fnMemberAdd: function(item){
                let vm = this;

                vm.viewModel.mttrList[vm.popIndex].actn_pic_nm = item.user_nm;
                vm.viewModel.mttrList[vm.popIndex].actn_pic = item.user_id;

                vm.fnWrite();
            },
            fnWrite:function(){
                let vm = this;
                vm.$emit('mttrList', vm);
            },
            fnLoadList:function(list, fileList){
                let vm = this;
                vm.viewModel.mttrList = list;

                for(let i=0; i<vm.viewModel.mttrList.length; i++){
                    vm.viewModel.mttrList[i].imgfilelist = fileList.filter(data => data.sub_sn == vm.viewModel.mttrList[i].actn_mttr_sn);
                }        
            },
            fnImgFileList:function(vm){
                this.viewModel.mttrList[vm.viewModel.index].imgfilelist = vm.viewModel.filelist;
                this.fnWrite();
            },
            fnImgFileDelete:function(vm){
                this.viewModel.mttrList[vm.viewModel.index].imgdeletefileList = vm.viewModel.deletefileList;
                this.fnWrite();
            },
            fnFileLoadList: function(i){
                let vm = this;
                if(vm.viewModel.mttrList[i] != undefined && vm.viewModel.mttrList[i].imgfilelist != null){
                    vm.$refs.imgsfileform[i].fnFileLoadList(vm.viewModel.mttrList[i].imgfilelist);
                }
            },
        }
    };
</script>