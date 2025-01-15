<template>
<div>
    <div class="contents">
        <div class="box">
            <h3>선수 등록</h3>
            <div class="divide">
                <div :class="['img_area', 'img_upload', { 'no-img': !image }]">
                    <label for="img_upload_01">
                        <img v-if="image" :src="image" alt="Image Preview" />
                        <input type="file" id="img_upload_01" ref="imgfile" @change="fnfile" hidden="" accept="image/*">
                    </label>
                </div>
                <div>
                    <table class="table horizontal write">
                        <caption>선수 등록</caption>
                        <tbody>
                            <tr>
                                <th scope="row">이름 [필수]</th>
                                <td><input type="text" title="이름" v-model="viewModel.data.name"></td>
                                <th scope="row">넘버 [필수]</th>
                                <td><input type="text" title="넘버" v-model="viewModel.data.backnum"></td>
                            </tr>
                            <tr>
                                <th scope="row">포지션 [필수]</th>
                                <td>
                                    <select title="포지션" v-model="viewModel.data.position">
                                        <option value="">선택</option>
                                        <option value="1">투수</option>
                                        <option value="2">내야수</option>
                                        <option value="3">외야수</option>                   
                                        <option value="4">포수</option>
                                        <option value="5">코치</option>
                                        <option value="6">감독</option>
                                    </select>
                                </td>
                                <th scope="row">수비위치 [필수]</th>
                                <td>
                                    <select title="수비위치" v-model="viewModel.data.pos">
                                        <option value="">선택</option>
                                        <option value="0">감독코치</option>
                                        <option value="1">투수</option>
                                        <option value="2">포수</option>
                                        <option value="3">1루수</option>
                                        <option value="4">2루수</option>
                                        <option value="5">3루수</option>
                                        <option value="6">유격수</option>
                                        <option value="7">우익수</option>
                                        <option value="8">중견수</option>
                                        <option value="9">좌익수</option>
                                        <option value="D">지명타자</option>
                                    </select>
                                </td>
                            </tr>
                            <tr>
                                <th scope="row">히트타입 [필수]</th>
                                <td colspan="3">
                                    <select title="히트타입" v-model="viewModel.data.hittype">
                                        <option value="">선택</option>
                                        <option value="1">좌투좌타</option>
                                        <option value="2">좌투우타</option>
                                        <option value="3">우투좌타</option>
                                        <option value="4">우투우타</option>
                                    </select>
                                </td>
                            </tr>
                            <tr>
                                <th scope="row">사용여부</th>
                                <td colspan="3"><input type="checkbox" title="사용여부" v-model="viewModel.data.openyn" :true-value="'Y'" :false-value="'N'"></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div class="btn-group btn-right">
                <router-link to="/" class="btn btn-white">목록</router-link>
                <button class="btn btn-blue" @click.prevent="fnSave()">등록</button>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import 'es6-promise/auto'
import Vue from 'vue'
import Axios from 'axios'
import Xlsx from 'xlsx'
import pager from "../../../common/vue/admin_paging.vue";
import Message, {messageUtil} from "../../../common/js/message";
import excelform from "../../frm_main/excelform.vue";
import printJS from 'print-js'

Vue.component("pager", pager);
Vue.config.devtools = true;

export default {
    components: {
        pager,
        'excelform': excelform,
    },
    data: function () {
        return {
            pop:false,
            printPop:false,
            excelDownload: [],           
            write: 'N',
            image: null,
            imageInfo: {
                filename: "",
                fileExt: "",
            },
            viewModel: {
                userInfo: {},
                serachList: {
                    text: "",
                    select_cat: "",
                },
                data: {
                    name: "",
                    backnum: "",
                    position: "",
                    pos: "",
                    hittype: "",
                    openyn: "N",
                },
            }
        }
    },
    activated:function(){
        calendarInput();
        this.fnInit();
    },
    deactivated:function(){
        this.$destroy();
    },
    mounted: function () {
    },
    methods: {
        fnInit: function(){
            let vm = this;
            let sn = vm.$route.params.sn;
            let pcode = vm.$route.params.pcode;

            vm.viewModel.userInfo = vm.$store.state.global.userInfo;

            if(sn == 'write') {
                vm.write = 'Y'
            } else {
                vm.fnList(sn, pcode);
            }
        },
        fnList: function (sn, pcode) {
            let vm = this;

            let send = {
                idx: sn,
                pcode: pcode
            };

            Axios.post("/getPlayerDetail.do", send).then (function (rs) {
                vm.viewModel.data = rs.data.player;
                vm.imageInfo = rs.data.file[0];

                if(vm.imageInfo != null) {
                    let item = vm.imageInfo.file_path;
                    if(item.charAt()=='/'){
                        vm.imageInfo.file_path = item;
                    }else{
                        vm.imageInfo.file_path = item.substring(2);
                    }
                    vm.image = vm.imageInfo.file_path + vm.imageInfo.file_id;

                }
            });
        },
        fnfile: function() {
            let vm = this;
            let file = vm.$refs.imgfile.files[0];
            let maxSize = 1 * 1024 * 1024 * 1024;
            let fileUploadType = ['jpg', 'gif', 'png', 'jpeg'];
            let filename = file.name;
            let fileExt = vm.$refs.imgfile.files[0].type.split('/')[1];

            if (fileUploadType.indexOf(fileExt) === -1) {
                alert(messageUtil(Message.UPLOAD_FILE_TYPE, ['이미지']));
                return;
            }

            if (file.size > maxSize) {
                alert("첨부파일 사이즈는 1GB 이내로 등록 가능합니다.");
                return;
            }

            let reader = new FileReader();
            reader.onload = function(e) {
                vm.image = e.target.result;
                // vm.imageInfo.filename = filename;
                // vm.imageInfo.fileExt = fileExt;
            }
            reader.readAsDataURL(file);
        },
        fnSave: function() {
            let vm = this;
            let frm = new FormData();

            if(!vm.viewModel.data.name){
                return alert("이름을 입력해주시기 바랍니다.");
            }
            if(!vm.viewModel.data.backnum){
                return alert("넘버를를 선택해주시기 바랍니다.");
            }
            if(!vm.viewModel.data.position){
                return alert("포지션을 입력해주시기 바랍니다.");
            }
            if(!vm.viewModel.data.pos){
                return alert("수비위치를 입력해주시기 바랍니다.");
            }
            if(!vm.viewModel.data.hittype){
                return alert("히트타입을 입력해주시기 바랍니다.");
            }

            let send = {
                name: vm.viewModel.data.name,
                backnum: vm.viewModel.data.backnum,
                position: vm.viewModel.data.position,
                pos: vm.viewModel.data.pos,
                hittype: vm.viewModel.data.hittype,
                open_yn: vm.viewModel.data.openyn,
                pcode: vm.viewModel.data.pcode,
                idx: vm.viewModel.data.idx,
            }

            if(vm.image !== "" && vm.$refs.imgfile.files[0] !== undefined) {
                frm.append("fileTitle", vm.$refs.imgfile.files[0].name);
                frm.append("uploadFiles", vm.$refs.imgfile.files[0]);
                frm.append("filePath", 'player');
                if (vm.imageInfo && vm.imageInfo.file_id) {
                    console.log(vm.imageInfo);
                    console.log(vm.imageInfo.file_id);
                    frm.append("deleteFilesid", vm.imageInfo.file_id);
                }
            }
            frm.append('param', JSON.stringify(send));

            if(vm.write == 'Y') {
                if(confirm(Message.CREATE_CONFIRM)) {
                    Axios.post("/insertPlayer.do", frm, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    }).then (function (rs) {
                        if(rs.data == 1) {
                            alert('저장되었습니다.');
                            vm.$router.push('/');
                        }
                    }).catch(function (ex) {
                        alert(Message.ERROR);
                    });
                }
            } else {
                if(confirm(Message.UPDATE_CONFIRM)) {
                    Axios.post("/updatePlayer.do", frm).then (function (rs) {
                        if(rs.data == 1) {
                            alert('저장되었습니다.');
                            vm.$router.push('/');
                        }
                    }).catch(function (ex) {
                        alert(Message.ERROR);
                    });
                }
            }
        },      

    }
}
</script>
