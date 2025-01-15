<template>
    <div>
        <div class="search_area opened" v-if="viewModel.userInfo.bplc_yn == 'N'">
            <div class="row">
                <div class="input_group" style="width:20rem">
                    <select id="list" v-model="bplc_use_yn" class="wp28">
                        <option value="A">전체</option>
                        <option value="Y" selected="selected">운영</option>
                        <option value="N">종료</option>
                    </select>
                    <select title="현장명" v-model="bplc_sn">
                        <option value='' disabled>현장명 선택</option>
                        <option v-for="(item, i) in viewModel.bplcList" :key="i" :value="item.bplc_sn">{{ item.bplc_nm }}</option>
                    </select>
                </div>
            </div>
        </div>
        
        <div class="contents" v-if="bplc_sn != ''">
            <div>
                
                <div class="table_top">
                    <h4>
                        <span @click="fnTitleClick(0)" class="btn-link">{{ bplc_nm }}</span><span v-for="(item, idx) in titleList">> <span @click="fnTitleClick(item)" :class="'btn-link'" >{{ item.folder_nm }}</span></span>
                    </h4>
                </div>
                <table class="table">
                    <caption>안전보건 자료 공유폴더 목록</caption>
                    <thead>
                        <tr>
                            <!-- <th scope="col" class="w50">번호</th>
                            <th scope="col">제목</th>
                            <th scope="col">작성일</th>
                            <th scope="col">작성자</th>
                            <th scope="col">첨부</th>
                            <th scope="col">관리</th> -->
                            <th>
                                폴더/파일명
                                <button @click="fnSort(1, 'file_up');" v-if="sortType == 'file_down'" class="btn btn-icon"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-arrow-down-circle"></use></svg></button>
                                <button @click="fnSort(1, 'file_down');" v-else-if="sortType == 'file_up'" class="btn btn-icon"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-arrow-up-circle"></use></svg></button>
                                <button @click="fnSort(1, 'file_down');" v-else class="btn btn-icon"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-minus-rounded"></use></svg></button>
                            </th>
                            <th class="w200">파일크기</th>
                            <th class="w200">최종 수정자</th>
                            <th class="w200">
                                최종 수정일자
                                <button @click="fnSort(2, 'date_up');" v-if="sortType == 'date_down'" class="btn btn-icon"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-arrow-down-circle"></use></svg></button>
                                <button @click="fnSort(2, 'date_down');" v-else-if="sortType == 'date_up'" class="btn btn-icon"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-arrow-up-circle"></use></svg></button>
                                <button @click="fnSort(2, 'date_down');" v-else class="btn btn-icon"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-minus-rounded"></use></svg></button>
                            </th>
                            <th class="w200">관리</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="folder_id != 0">
                            <td colspan="5" class="text-left" @click="fnTitleClick(titleList.length-2 >= 0 ? titleList[titleList.length-2] : 0)">
                                <b><span class="btn-link">← 이전폴더로 이동</span></b>
                            </td>
                        </tr>
                        <tr v-for="(item, i) in viewModel.list" :key="i">
                            <td class="text-left" @click="item.gbn == 'FOLDER' ? fnFolderClick(item.folder_id, item.top_lvl_id) : fnFileClick(item)">
                                <svg class="icon">
                                    <use xlink:href="../../img/symbol-defs.svg#icon-folder-filled" v-if="item.gbn == 'FOLDER'"></use>
                                    <use xlink:href="../../img/symbol-defs.svg#icon-attachment" v-else></use>
                                </svg><span style="margin-left: 0.5rem;">{{ item.folder_nm }}</span>
                            </td>
                            <td>
                               <span v-if="item.gbn == 'FILE'">{{ item.file_sz|filesize }}</span>
                               <span v-else>-</span>
                            </td>
                            <td>{{ item.wrtr }}</td>
                            <td>{{ item.mod_dt|yyyyMMddHHmm }}</td>
                            <td v-if="item.gbn == 'FOLDER'" >
                                <button class="btn btn-icon" @click="fnUpdateFolder(item)"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-edit-contents"></use></svg></button>
                                <button class="btn btn-icon" @click="fnDeleteFolder(item)"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-delete-sweep"></use></svg></button>
                            </td>
                            <td v-else>
                                <button class="btn btn-icon" @click="fnDelete(item)"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-delete-sweep"></use></svg></button>
                            </td>
                        </tr>
                        <tr v-if="viewModel.list.length == 0">
                            <td colspan="4">등록된 데이터가 없습니다.</td>
                        </tr>
                    </tbody>
                </table>
                <div class="table_footer btn-right">
                    <!-- <pager :pass="viewModel.pager"></pager> -->
                    <div class="btn-group"> 
                        <!-- <router-link :to="'/write'" class="btn btn-purple"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-post-add"></use></svg>등록</router-link> -->
                        <input type="file" hidden :id="'fileupload'" @change="fnSetFileName()" multiple>
                        <label :for="'fileupload'" class="btn btn-white"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-attachment"></use></svg>파일등록</label>
                        <button class="btn btn-purple" @click="fnFolderAdd();" v-if="viewModel.userInfo.bplc_yn == 'N' || viewModel.userInfo.ocpt_se_cd == 'MNG'"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-folder-filled"></use></svg>폴더등록</button>
                    </div>
                </div>
            </div>
        </div>
        <fileViewPopup ref="fileViewPopup" v-if="fileViewPop==true"></fileViewPopup>
        <folderPopup ref="folderPopup" v-if="folderPop==true"></folderPopup>
    </div>
</template>

<script>
   import "es6-promise/auto";
    import Vue from "vue";
    import Axios from "axios";
    import Common from '../../../../common/js/common.js';
    import Pager from "../../../../common/vue/paging.vue";
    import Message, {messageUtil} from "../../../../common/js/message";
    import fileViewPopup from "../../popup/fileViewPopup.vue";
    import folderPopup from "../popup/folderPopup.vue";

    export default {
        components: {
            'pager': Pager,
            'fileViewPopup': fileViewPopup,
            'folderPopup': folderPopup,
        },
        data: function() {
            return {
                fileViewPop:false,
                folderPop:false,
                viewModel:{
                    search:{},
                    userInfo:{},
                    bplcList:[],
                    list: [],
                    title:{},
                },
                titleList:[],
                menu_se:$("#menu_se").val(),
                folder_id:0,
                top_lvl_id:0,
                bplc_use_yn:0,
                bplc_sn:0,
                bplc_nm:'',
                gbn:1,
                sortType:'file_down'
            };
        },
        watch: {
            'bplc_use_yn': {
                handler() {
                    let vm = this;
                    if(vm.viewModel.userInfo.user_roles == 'ROLE_001'){
                        vm.fnGetBplcList();
                    }
                }
            },
            'bplc_sn': {
                handler() {
                    let vm = this;
                    vm.fnChngBplc();
                }
            },
        },
        mounted: function() {
            let vm = this;
            vm.fnInit();

            vm.$router.afterEach(function(to, from){
                vm.fnList();
            })
        },
        methods: {
            fnSort: function(gbn, sortType){
                let vm = this;

                vm.gbn = gbn;
                if(sortType != undefined){
                    vm.sortType = sortType;
                }

                if(gbn == 1){
                    if(vm.sortType == 'file_up'){
                        let folders = vm.viewModel.list.filter(item => item.gbn === "FOLDER");
                        let files = vm.viewModel.list.filter(item => item.gbn === "FILE");

                        // 이름에 따라 정렬
                        folders.sort((a, b) => a.folder_nm.localeCompare(b.folder_nm));
                        files.sort((a, b) => a.folder_nm.localeCompare(b.folder_nm));

                        // 정렬된 리스트 합치기
                        vm.viewModel.list = [...folders, ...files];
                    }else{
                        let folders = vm.viewModel.list.filter(item => item.gbn === "FOLDER");
                        let files = vm.viewModel.list.filter(item => item.gbn === "FILE");

                        // 이름에 따라 정렬
                        folders.sort((a, b) => b.folder_nm.localeCompare(a.folder_nm));
                        files.sort((a, b) => b.folder_nm.localeCompare(a.folder_nm));

                        // 정렬된 리스트 합치기
                        vm.viewModel.list = [...folders, ...files];
                    }
                }else{
                    if(vm.sortType == 'date_up'){
                        let folders = vm.viewModel.list.filter(item => item.gbn === "FOLDER");
                        let files = vm.viewModel.list.filter(item => item.gbn === "FILE");

                        // 이름에 따라 정렬
                        folders.sort((a, b) => a.mod_dt.localeCompare(b.mod_dt));
                        files.sort((a, b) => a.mod_dt.localeCompare(b.mod_dt));

                        // 정렬된 리스트 합치기
                        vm.viewModel.list = [...folders, ...files];
                    }else{
                        let folders = vm.viewModel.list.filter(item => item.gbn === "FOLDER");
                        let files = vm.viewModel.list.filter(item => item.gbn === "FILE");

                        // 이름에 따라 정렬
                        folders.sort((a, b) => b.mod_dt.localeCompare(a.mod_dt));
                        files.sort((a, b) => b.mod_dt.localeCompare(a.mod_dt));

                        // 정렬된 리스트 합치기
                        vm.viewModel.list = [...folders, ...files];
                    }
                }
            },
            fnInit: function(){
                let vm = this;
                vm.viewModel.userInfo = vm.$store.state.global.userInfo;
                vm.bplc_use_yn = vm.viewModel.userInfo.bplc_yn == 'N' ? 'Y' : 'A';
                vm.bplc_sn = (vm.viewModel.userInfo.bplc_yn == 'N' && (vm.viewModel.userInfo.bplc_sn == 0 || vm.viewModel.userInfo.bplc_use_yn == 'N')) ? '' : vm.viewModel.userInfo.bplc_sn;
                vm.bplc_nm = (vm.viewModel.userInfo.bplc_yn == 'N' && (vm.viewModel.userInfo.bplc_sn == 0 || vm.viewModel.userInfo.bplc_use_yn == 'N')) ? '' : vm.viewModel.userInfo.bplc_nm;


                if(vm.$route.params.folderId != undefined){
                    vm.bplc_sn = vm.$route.params.bplcSn;
                    vm.fnFolderClick(vm.$route.params.folderId, vm.$route.params.topLvlId);
                }else if(vm.bplc_sn != ''){
                    vm.fnList();
                }
                
                // if(vm.viewModel.userInfo.bplc_yn == 'Y'){
                // }else{
                //     vm.fnGetBplcList();
                // }
            },            
            fnList:function(){
                //목록 조회
                let vm = this;

                let send = {
                    menu_se: vm.menu_se,
                    bplc_sn: vm.bplc_sn,
                    folder_id: 0,
                    top_lvl_id: 0,
                }

                Axios.post("/selectOhStdFolderList.do", send)
                .then(function(response) {
                    vm.viewModel.list = response.data.list;

                    //초기화
                    vm.folder_id = 0,
                    vm.top_lvl_id = 0,
                    vm.titleList = [];
                }).then(function(){
                    vm.fnSort(vm.gbn);
                });
            },
            fnGetBplcList:function(){
                //현장정보 가져오기

                let vm = this;

                let data = {
                    mapperId: 'comm.selectAllBplcList',
                    bplc_use_yn: vm.bplc_use_yn,
                    dept_sn: vm.viewModel.userInfo.dept_sn,
                    team_sn: vm.viewModel.userInfo.team_sn,
                };
                Axios.post("/list.do", data).then(function (rs) {
                    vm.viewModel.bplcList = rs.data.list;

                    vm.bplc_sn = '';
                    if(vm.viewModel.userInfo.bplc_use_yn == 'Y' && vm.bplc_use_yn == 'Y'){
                        vm.bplc_sn = vm.viewModel.userInfo.bplc_sn == 0 ? '' : vm.viewModel.userInfo.bplc_sn;
                    }
                });
            },
            // fnMove: function(folder_id, top_lvl_id){
            //     let vm = this;
            //     vm.$router.push('/'+ vm.bplc_sn + folder_id + top_lvl_id);
            // },
            fnFolderClick: function(folder_id, top_lvl_id){
                let vm = this;

                //타이틀 초기화
                vm.titleList = [];

                vm.folder_id = folder_id == undefined ? 0 : folder_id;
                vm.top_lvl_id = top_lvl_id == undefined ? 0 : top_lvl_id;

                let send = {
                    menu_se: vm.menu_se,
                    bplc_sn: vm.bplc_sn,
                    folder_id: vm.folder_id,
                    top_lvl_id: vm.top_lvl_id,
                }

                Axios.post("/selectOhStdFolderList.do", send)
                .then(function(response) {
                    vm.viewModel.list = response.data.list;             
                    vm.viewModel.title = response.data.title;
                }).then(function(){
                    if(vm.viewModel.title != null){
                        vm.top_lvl_id = vm.viewModel.title.top_lvl_id;
                        vm.bplc_nm = vm.viewModel.title.bplc_nm;

                        let tot_id = vm.viewModel.title.tot_id.split(',');
                        let folder_nm = vm.viewModel.title.folder_nm.split(',');
                        
                        for(let i=0; i<folder_nm.length; i++){
                            vm.titleList.push({'folder_id':tot_id[i], 'folder_nm': folder_nm[i], 'top_lvl_id': vm.viewModel.title.top_lvl_id})
                        }
                    }
                }).then(function(){
                    vm.fnSort(vm.gbn);
                });
            },
            fnFileClick: function(item){

                const link = document.createElement("a");
                link.href = item.file_path.charAt()=='/' ? item.file_path : item.file_path.substring(2);
                link.download = item.folder_nm;
                link.click();
                    
                // let vm = this;

                // let send = {
                //     menu_se: item.menu_se,
                //     sn: item.folder_id,
                //     file_sn: item.file_sn,
                //     gbn:'ohStdFold'
                // }

                // $(".loading").show();
                // $("#mask").show();

                // Axios.post("/download.do",send,{responseType: "blob",}
                // ).then(function(e) {
                //     const url = window.URL.createObjectURL(new Blob([e.data], { type: e.headers["content-type"] }))
                //     const link = document.createElement("a")
                //     link.href = url
                //     link.download =  item.folder_nm
                //     link.click()
                //     window.URL.revokeObjectURL(url)
                // }).then(function(){
                //     $(".loading").hide();
                //     $("#mask").hide();
                // });
            },
            fnFolderAdd: function(){
                let vm = this;
                
                vm.folderPop=true;
                
                vm.$nextTick(function() {
                    if(vm.folderPop) {
                        vm.$refs.folderPopup.fnInit(vm.folder_id, vm.top_lvl_id);
                    }
                })
            },
            fnSetFileName: function(index) {
                let vm = this;
                let frm = new FormData();

                let maxSize = 1 * 1024 * 1024 * 1024;
                let exCnt = 0;
                let uploadCnt = 0;
                let files = $('#fileupload')[0].files;
                
                for(let i=0; i<files.length; i++){
                    let file = files[i];
                    
                    let filename = file.name;

                    if(file.size > maxSize){
                        // alert("첨부파일 사이즈는 1GB 이내로 등록 가능합니다.");
                        // return false;
                        exCnt++;
                    }else{
                        uploadCnt++;
                        frm.append("fileTitle", filename);
                        frm.append("uploadFiles", file);
                    }
                }

                let data = {
                    user_id: vm.viewModel.userInfo.user_id,
                    wrtr: vm.viewModel.userInfo.user_name,
                    menu_se: vm.menu_se,
                    bplc_sn: vm.bplc_sn,
                    folder_id: vm.folder_id,
                    top_lvl_id: vm.top_lvl_id,
                };

                frm.append('data', new Blob([ JSON.stringify(data) ], {type : "application/json"}));

                frm.append("filePath", "ohStd");

                if(confirm(Message.CREATE_CONFIRM)){
                    Axios.post("/insertOhStdFolderFile.do", frm).then(function(response) {
                        if(response.data == 1){
                            if(exCnt > 0){
                                if(uploadCnt == 0){
                                    alert("모든 파일이 1GB가 초과되어 저장에 실패하였습니다.")
                                }else{
                                    alert("1GB초과한 파일을 제외한 파일이 저장되었습니다.");
                                }
                            }else{
                                alert("저장되었습니다.");
                            }
                            vm.fnFolderClick(vm.folder_id, vm.top_lvl_id);
                        }else{
                            alert(Message.ERROR);    
                        }
                    }).catch(function(ex) {
                        alert(Message.ERROR);
                    });
                }else{
                    //파일 초기화 해주기
                    $('#fileupload').val("");
                }
            },
            fnDeleteFolder: function(item){
                let vm = this;

                let send = {
                    folder_id: item.folder_id,
                    menu_se: vm.menu_se,
                    bplc_sn: item.bplc_sn,
                }

                if(confirm("하위파일,폴더까지 삭제됩니다.\n그래도 삭제하시겠습니까?")){
                    Axios.post("/deleteOhStdFolder.do", send)
                    .then(function(response) {
                        if(response.data == 1){
                            alert("삭제가 완료되었습니다.");
                            vm.fnFolderClick(item.parent_id, item.top_lvl_id);
                        }
                    }).catch(function(ex) {
                        alert(Message.ERROR);
                    });
                }
            },
            fnUpdateFolder: function(item){
                let vm = this;
                
                vm.folderPop=true;
                
                vm.$nextTick(function() {
                    if(vm.folderPop) {
                        vm.$refs.folderPopup.fnUpdt(item.folder_id, item.folder_nm);
                    }
                })
            },
            fnDelete: function(item){
                let vm = this;
                let send = {
                    folder_id: item.folder_id,
                    file_sn: item.file_sn,
                    menu_se: vm.menu_se,
                    bplc_sn: vm.bplc_sn,
                }

                if(confirm(Message.DELETE_CONFIRM)){
                    Axios.post("/deleteOhStdFolderFile.do", send)
                    .then(function(response) {
                        if(response.data == 1){
                            alert("삭제가 완료되었습니다.");
                            vm.fnFolderClick(item.folder_id, vm.top_lvl_id);
                        }
                    }).catch(function(ex) {
                        alert(Message.ERROR);
                    });
                }
            },
            fnTitleClick: function(item){
                let vm = this;

                if(item == 0){
                    vm.fnList();
                }else{
                    vm.fnFolderClick(item.folder_id, item.top_lvl_id);    
                }
                
            },
            fnChngBplc: function(){
                let vm = this;

                let list = vm.viewModel.bplcList.filter(data => data.bplc_sn == vm.bplc_sn);

                if(list.length > 0){
                    vm.bplc_nm = list[0].bplc_nm;
                    if(vm.bplc_nm != undefined){
                        vm.fnList();
                    }
                }else{
                    vm.bplc_nm = '';
                }
            }
        }
    };
</script>