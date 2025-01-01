<template>
<div>
    <div class="contents write">
        <div>
            <table class="table horizontal write">
                <caption>미세먼지 프로그램 등록</caption>
                <tbody>
                    <tr>
                        <th scope="row" class="w180 essential"><label for="bplc">현장명</label></th>
                        <td>
                            <div class="input_group" v-if="viewModel.userInfo.bplc_sn != 0">
                                <input type="text" id="bplc_nm" v-model="viewModel.data.bplc_nm" disabled>
                                <input type="hidden" id="bplc" v-model="viewModel.data.bplc_sn">
                                <!-- <a @click="fnPopup();"><svg class="icon">
                                        <use xlink:href="../../img/symbol-defs.svg#icon-search"></use>
                                    </svg></a> -->
                            </div>
                            <div class="input_group" v-else>
                                <input type="text" id="bplc_nm" v-model="viewModel.data.bplc_nm" disabled>
                                <input type="hidden" id="bplc" v-model="viewModel.data.bplc_sn">
                                <a @click="fnPopup();"><svg class="icon">
                                        <use xlink:href="../../img/symbol-defs.svg#icon-search"></use>
                                    </svg></a>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row" class="essential"><label for="title">제목</label></th>
                        <td>
                            <div class="input_group">
                                <input type="text" id="ttl" v-model="viewModel.data.ttl">
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row" class="essential"><label for="cn">내용</label></th>
                        <td>
                            <textarea type="text" id="cn" v-model="viewModel.data.cn"></textarea>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row"><label for="">첨부</label></th>
                        <td>
                            <fileform @filelist="fnFilelist" @fileDelete="fnFileDelete" :pass="{id:'sc'}" ref="files"></fileform>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div class="table_footer btn-right">
                <button class="btn btn-purple" @click.prevent="fnSave()"><svg class="icon">
                        <use xlink:href="../../img/symbol-defs.svg#icon-post-add"></use>
                    </svg>등록</button>
                <router-link to="/" class="btn btn-white"><svg class="icon">
                        <use xlink:href="../../img/symbol-defs.svg#icon-list-back"></use>
                    </svg>목록</router-link>
            </div>
        </div>
    </div>
    <bplc ref="bplc" v-if="bplcPop==true" :pass="{dept_sn: viewModel.userInfo.dept_sn, team_sn: viewModel.userInfo.team_sn}"></bplc>
</div>
</template>

<script>
import "es6-promise/auto";
import Vue from "vue";
import Axios from "axios";
import Fileform from '../../../../common/vue/fileform2.vue'
import Message, {
    messageUtil
} from "../../../../common/js/message";
import fromValidation from "../../../../common/js/fromValidation";
import bplc from "../../popup/bplc_popup.vue";

export default {
    components: {
        'fileform': Fileform,
        'bplc': bplc,
    },
    data: function () {
        return {
            bplcPop: false,
            viewModel: {
                userInfo: {},
                filelist: [],
                fileGroup: '',
                data: {},
                list: {
                    qlfcList: [],
                    bplcNm: []
                },
            },
            mode: '',
            isSaved:false,
        };
    },
    mounted: function () {
        let vm = this;
        vm.viewModel.userInfo = vm.$store.state.global.userInfo;
        calendarInput();
        vm.fnInit();
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
        fnInit: function () {
            let vm = this;
            vm.viewModel.userInfo = vm.$store.state.global.userInfo;

            let sn = vm.$route.params.sn;
            vm.viewModel.data.bplc_sn = vm.viewModel.userInfo.bplc_sn;
            vm.viewModel.data.bplc_nm = vm.viewModel.userInfo.bplc_nm;
            vm.viewModel.data.user_id = vm.viewModel.userInfo.user_id;
            vm.$route.params.sn = sn;
            if (sn != undefined) {
                vm.fnDetail(sn);
            }
        },
        fnDetail: function (sn) {
            let vm = this;
            let data = {
                prgrm_sn: sn,
            }
            Axios.post("/selectFdPrgrDetail.do", data)
                .then(function (response) {
                    vm.viewModel.data = response.data.detail;
                    vm.viewModel.filelist = response.data.fileList;

                    vm.$refs.files.fnFileLoadList(vm.viewModel.filelist);
                });
        },
        fnFileDelete: function (vm) {
            this.viewModel.deletefileList = vm.deletefileList;
        },
        fnSave: function () {
            let vm = this;
            let frm = new FormData();
            if (vm.viewModel.filelist != null && vm.viewModel.filelist != undefined) {
                for (let i = 0; i < vm.viewModel.filelist.length; i++) {
                    let key = vm.viewModel.filelist[i].file_seq;
                    if (vm.viewModel.filelist[i].file != null) {
                        frm.append("fileTitle", vm.viewModel.filelist[i].file_title);
                        frm.append("uploadFiles", vm.viewModel.filelist[i].file);
                        if (vm.viewModel.filelist[i].file_sn) {
                            frm.append("deleteFiles", vm.viewModel.filelist[i].file_sn);
                        }
                        frm.append("key", 0)
                    } else {
                        if (vm.viewModel.filelist[i].file == undefined) {

                        } else {
                            frm.append("fileTitle", vm.viewModel.filelist[i].file_title);
                            frm.append("key", key)
                        }
                    }
                }
                if (vm.viewModel.deletefileList != null && vm.viewModel.deletefileList != undefined) {
                    for (let i = 0; i < vm.viewModel.deletefileList.length; i++) {
                        frm.append("deleteFiles", vm.viewModel.deletefileList[i]);
                    }
                }
            }
            vm.fngetFileInfo(frm);
        },
        fngetFileInfo: function (frm) {
            let vm = this;
            const valiData = [{
                    id: 'bplc_nm',
                    type: 'input',
                    title: '현장명'
                },
                {
                    id: 'ttl',
                    type: 'input',
                    title: '제목'
                },
                {
                    id: 'cn',
                    type: 'input',
                    title: '내용'
                },
            ];

            if (!fromValidation(valiData)) {
                return false;
            }

            let data = {
                user_id: vm.viewModel.userInfo.user_id,
                bplc_sn: vm.viewModel.data.bplc_sn,
                ttl: vm.viewModel.data.ttl,
                cn: vm.viewModel.data.cn,
                prgrm_sn: vm.$route.params.sn,
            };

            frm.append('data', new Blob([JSON.stringify(data)], {
                type: "application/json"
            }));

            frm.append("filePath", "fdPrgr");

            if (vm.$route.params.sn == undefined) {
                if (confirm(Message.CREATE_CONFIRM)) {
                    Axios.post("/insertFdPrgr.do", frm).then(function (response) {
                        if (response.data == 1) {
                            vm.isSaved = true;
                            vm.$router.push('/');
                            alert("저장되었습니다.");
                        }

                    }).catch(function (ex) {
                        alert(Message.ERROR);
                    });
                }
            } else {
                if (confirm(Message.UPDATE_CONFIRM)) {
                    Axios.post("/updateFdPrgr.do", frm).then(function (response) {
                        if (response.data == 1) {
                            vm.isSaved = true;
                            vm.$router.push('/');
                            alert("저장되었습니다.");
                        }

                    }).catch(function (ex) {
                        alert(Message.ERROR);
                    });
                }
            }
        },
        fnFilelist: function (vm) {
            this.viewModel.filelist = vm.filelist;
            this.vie, wModel.fileGroup = vm.fileGroup;
        },
        fnPopup: function () {
            let vm = this;
            vm.bplcPop = true;
            vm.$nextTick(function () {
                if (vm.bplcPop) {
                    vm.$refs.bplc.fnInit();
                }
            })
        },
        fnBplcAdd: function (item) {
            let vm = this;

            vm.viewModel.data.bplc_sn = item.bplc_sn;
            vm.viewModel.data.bplc_nm = item.bplc_nm;
            let data = {
                bplc_sn: vm.viewModel.data.bplc_sn,
            }
        }
    }
};
</script>
