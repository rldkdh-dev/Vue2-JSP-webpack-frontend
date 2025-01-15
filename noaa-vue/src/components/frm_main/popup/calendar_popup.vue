<template>
<modal :pass="{popupTitle:'마스크 불출 정보'}">
    <template v-slot:contents>
        <div class="contents">
            <div>
                <table class="table horizontal write">
                    <caption>마스크 불출 정보</caption>
                    <tbody>
                        <tr>
                            <th scope="row"><label for="bplc">현장명</label></th>
                            <td colspan="3">
                                <input type="text" id="bplc_nm" v-model="viewModel.data.bplc_nm" disabled>
                            </td>
                        </tr>
                        <!-- <tr>
                            <th scope="row"><label for="prdct_nm">담당자</label></th>
                            <td colspan="3">
                                <input type="text" id="bplc_pic" v-model="viewModel.data.bplc_pic">
                            </td>
                        </tr> -->
                        <tr>
                            <th scope="row"><label for="mkr">마스크제공여부</label></th>
                            <td colspan="3">
                                <select id="mask_pvsn_yn">
                                    <option value="Y" selected>Y</option>
                                    <option value="N">N</option>
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row"><label for="">선택날짜</label></th>
                            <td>
                                <input type="text" id="pvsn_day" v-model="viewModel.data.pvsn_day" readonly>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row"><label for="">미세먼지 농도</label></th>
                            <td>
                                <input type="text" id="pm10" v-model="pm10" readonly>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row"><label for="">초미세먼지 농도</label></th>
                            <td>
                                <input type="text" id="pm25" v-model="pm25" readonly>
                            </td>
                        </tr>
                        <!-- <tr>
                            <th scope="row"><label for="">사진등록</label></th>
                            <td>
                                <imgsfileform :ref="'imgsfileform'" :pass="{id:'chckRslt'+i, index:i, gbn:'chckRslt'}" @filelist="fnImgFileList" @fileDelete="fnImgFileDelete"></imgsfileform>
                            </td>
                        </tr> -->
                    </tbody>
                </table>

                <div class="table_footer btn-right">
                    <button class="btn btn-purple" @click.prevent="fnSave()"><svg class="icon">
                            <use xlink:href="../../img/symbol-defs.svg#icon-post-add"></use>
                        </svg>등록</button>
                    <button href="" class="btn btn-gray" @click.prevent="fnDelete()" v-if="deleteBtn"><svg class="icon">
                            <use xlink:href="../../img/symbol-defs.svg#icon-trash-can"></use>
                        </svg>삭제</button>
                </div>
            </div>
        </div>
    </template>
</modal>
</template>

<script>
import 'es6-promise/auto'
import Vue from 'vue'
import Axios from 'axios'
import Modal from './modal.vue'
import Pager from "../../paging.vue";
import imgsfileform from '../../../common/vue/imgsfileform3.vue';
import Message, {
    messageUtil
} from "../../../common/js/message.js";
import fromValidation from "../../../common/js/fromValidation.js";
export default {
    props: ['pass'],
    components: {
        'imgsfileform': imgsfileform,
        Pager,
        Modal,
    },
    data: function () {
        let vm = this;
        return {
            deleteBtn: false,
            search: '',
            bplcList: [],
            bplcOrgList: [],
            pm10: '',
            pm25: '',
            sidoNm : '',
            sigunguNm : '',
            viewModel: {
                imgfilelist: [],
                imgdeletefileList: [],
                userInfo: {},
                chkTypeList: [],
                chkRsltList: [],
                filelist: [],
                data: {
                    bplc_pic: "",
                    bplc_nm: "",
                    bplc_sn: "",
                    mask_pvsn_yn: "Y",
                    pvsn_day: "",
                }
            }
        }
    },
    mounted: function () {
        let vm = this;
        calendarInput();
        vm.viewModel.userInfo = vm.$store.state.global.userInfo;
    },
    methods: {
        fnInit: function () {
            let vm = this;

            vm.viewModel.data.pvsn_day = vm.$parent.pvsn_day;
            vm.viewModel.data.id = Number(vm.$parent.calendarId);
            vm.viewModel.data.bplc_nm = vm.$parent.viewModel.bplc_nm;
            vm.viewModel.data.bplc_sn = vm.$parent.viewModel.bplc_sn;
            vm.sidoNm = vm.$parent.sidoNm;
            vm.sigunguNm = vm.$parent.sigunguNm;
            
            let data = {
                sidoNm : vm.sidoNm,
                sigunguNm : vm.sigunguNm,
                search_date : vm.viewModel.data.pvsn_day,
            }

            Axios.post("/selectFdPrgrMask.do", data).then(function (res) {
                vm.pm10 = '';
                vm.pm25 = '';
                vm.result = res.data.list2;
                if(vm.result != null){
                    vm.pm10 = vm.result[0].pm10;
                    vm.pm25 = vm.result[0].pm25;
                }
            })
            
            vm.viewModel.filelist = [];
            Modal.methods.fnInit();
            if (vm.viewModel.data.id != 0) {
                vm.deleteBtn = true;
                vm.fnDetail(vm.viewModel.data.id);
            } else {
                vm.deleteBtn = false;
            }
        },
        fnList: function () {
            let vm = this;
            let data = {
                mapperId: 'base.selectBplcList',
                pageNo: 0,
                name: "",
            };
            Axios.post("/list.do", data).then(function (rs) {
                vm.bplcList = rs.data.list;
                vm.bplcOrgList = rs.data.list;
            });
        },
        fnDetail: function (id) {
            let vm = this;
            let data = {
                id: Number(id),
            }
            Axios.post("/selectFdPrgrMaskDetail.do", data).then(function (res) {
                vm.viewModel.data.bplc_sn = res.data.result.BPLC_SN;
                vm.viewModel.data.bplc_nm = res.data.result.BPLC_NM;
                vm.viewModel.data.bplc_pic = res.data.result.BPLC_PIC;
                vm.pm10 = res.data.result.PM10;
                vm.pm25 = res.data.result.PM25;
                $("#mask_pvsn_yn").val(res.data.result.MASK_PVSN_YN)
                $("#pvsn_day").val(res.data.result.PVSN_DAY)
                vm.viewModel.data.pvsn_day = res.data.result.PVSN_DAY;
                vm.viewModel.filelist = res.data.fileList;
            });
        },
        fnImgFileList: function (vm) {
            this.viewModel.imgfilelist = vm.viewModel.filelist;
        },
        fnImgFileDelete: function (vm) {
            this.viewModel.imgdeletefileList = vm.viewModel.deletefileList;
        },
        fnSave: function () {
            let vm = this;
            let frm = new FormData();
            for (let i = 0; i < vm.viewModel.imgfilelist.length; i++) {

                if (vm.viewModel.imgfilelist[i] != null) {
                    for (let j = 0; j < vm.viewModel.imgfilelist.length; j++) {
                        let key = vm.viewModel.imgfilelist[j].file_seq;

                        if (vm.viewModel.imgfilelist[j].file != null) {
                            frm.append("uploadFiles", vm.viewModel.imgfilelist[j].file);
                            frm.append("fileTitle", vm.viewModel.imgfilelist[j].file.name);
                            if (vm.viewModel.imgfilelist[j].file_sn) {
                                frm.append("deleteFiles", vm.viewModel.imgfilelist[j].file_sn);
                            }
                            frm.append("key", 0)
                        } else {
                            if (vm.viewModel.imgfilelist[j].file == undefined) {

                            } else {
                                frm.append("fileTitle", vm.viewModel.imgfilelist[j].file_title);
                                frm.append("key", key)
                            }
                        } /*  */
                    }
                }
            }
            for (let i = 0; i < vm.viewModel.imgdeletefileList.length; i++) {
                if (vm.viewModel.imgdeletefileList[i] != null) {
                    for (let j = 0; j < vm.viewModel.imgdeletefileList.length; j++) {
                        frm.append("deleteFiles", vm.viewModel.imgdeletefileList[j]);
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
                    id: 'mask_pvsn_yn',
                    type: 'select',
                    title: '마스크제공수량'
                },
                {
                    id: 'pvsn_day',
                    type: 'input',
                    title: ''
                },
            ];

            if (!fromValidation(valiData)) {
                return false;
            }

            frm.append("filePath", "fdPrgr");
            if (vm.viewModel.data.id != 0 && vm.viewModel.data.id != null && vm.viewModel.data.id != undefined && vm.viewModel.data.id != "") {
                let data = {
                    user_id: vm.viewModel.userInfo.user_id,
                    bplc_pic: vm.viewModel.userInfo.user_nm,
                    bplc_sn: vm.viewModel.data.bplc_sn,
                    mask_pvsn_yn: $("#mask_pvsn_yn").val(),
                    pvsn_day: vm.viewModel.data.pvsn_day,
                    minu_dust_sn: vm.viewModel.data.id,
                };

                frm.append('data', new Blob([JSON.stringify(data)], {
                    type: "application/json"
                }));
                vm.$parent.fnUpdate(frm);
            } else {
                let data = {
                    user_id: vm.viewModel.userInfo.user_id,
                    bplc_pic: vm.viewModel.userInfo.user_nm,
                    bplc_sn: vm.viewModel.data.bplc_sn,
                    mask_pvsn_yn: $("#mask_pvsn_yn").val(),
                    pvsn_day: vm.viewModel.data.pvsn_day,
                    pm10 : vm.pm10,
                    pm25 : vm.pm25,
                };

                frm.append('data', new Blob([JSON.stringify(data)], {
                    type: "application/json"
                }));
                vm.$parent.fnInsert(frm);
            }

        },
        fnDelete: function () {
            let vm = this;
            let data = {
                minu_sn: vm.viewModel.data.id,
            }
            if (confirm(Message.DELETE_CONFIRM)) {
                Axios.post("/deleteFdPrgrMask.do", data).then(function (res) {
                    if (res.data == 1) {
                        alert("삭제완료되었습니다.");
                        vm.$parent.calendarPopup = false;
                        vm.$parent.fnRender();
                    }
                })
            }
        }
    }
}
</script>
