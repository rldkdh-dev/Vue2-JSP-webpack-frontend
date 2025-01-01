<template>
    <div>
        <div class="contents write">
            <div>
                <h3>기본정보</h3>
                <table class="table horizontal write">
                    <caption>주간안전회의록 등록</caption>
                    <tbody>
                        <tr>
                            <th class="essential" scope="row"><label>회의명</label></th>
                            <td>
                                <div class="input_group">
                                    <div class="yearpicker_box">
                                        <input type="text" id="mtg_year" class="yearpicker" readonly>
                                    </div>
                                    <select title="월" v-model="viewModel.data.mtg_month" class="w120" id="mtg_month">
                                        <option value="">월 선택</option>
                                        <option :value=" i < 10 ? 0+''+i : i " v-for="i in 12">
                                            {{ i < 10 ? 0+''+i : i }}월
                                        </option>
                                    </select>
                                    <select title="주차" v-model="viewModel.data.mtg_week" class="w120" id="mtg_week">
                                        <option value="">주차 선택</option>
                                        <option v-for="(i) in 5" :key="i" :value="i">
                                            {{ i }}주차
                                        </option>
                                    </select>
                                    <span>&nbsp;주간안전회의</span>
                                </div>
                            </td>
                            <th scope="row" class="essential"><label>회의일시</label></th>
                            <td>
                                <div class="input_group">
                                    <div class="datepicker_box w120">
                                        <input type="text" class="datepicker" id="mtg_dt" title="회의일시" readonly>
                                    </div>
                                    <select id="sdt_hour" v-model="viewModel.data.mtg_dt_st_hour" class="w80">
                                        <option value="">선택</option>
                                        <option :value="i-1 < 10 ? 0+''+(i-1) : i-1" v-for="i in 24">
                                            {{ i-1 < 10 ? 0+''+(i-1) : i-1}}시
                                        </option>
                                    </select>
                                    <span>:</span>
                                    <select id="sdt_min" v-model="viewModel.data.mtg_dt_st_min" class="w80">
                                        <option value="">선택</option>
                                        <option :value="i-1 == 0 ? 0+''+(i-1) * 10 : (i-1) * 10" v-for="i in 6">
                                            {{ i-1 == 0 ? 0+''+(i-1) * 10 : (i-1) * 10 }}분
                                        </option>
                                    </select>
                                    <span>~</span>
                                    <select id="sdt_hour" v-model="viewModel.data.mtg_dt_ed_hour" class="w80">
                                        <option value="">선택</option>
                                        <option :value="i-1 < 10 ? 0+''+(i-1) : i-1" v-for="i in 24">
                                            {{ i-1 < 10 ? 0+''+(i-1) : i-1}}시
                                        </option>
                                    </select>
                                    <span>:</span>
                                    <select id="sdt_min" v-model="viewModel.data.mtg_dt_ed_min" class="w80">
                                        <option value="">선택</option>
                                        <option :value="i-1 == 0 ? 0+''+(i-1) * 10 : (i-1) * 10" v-for="i in 6">
                                            {{ i-1 == 0 ? 0+''+(i-1) * 10 : (i-1) * 10 }}분
                                        </option>
                                    </select>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row"><label for="">회의장소</label></th>
                            <td colspan="5"><input type="text" id="mtg_plc" v-model="viewModel.data.mtg_plc" title="회의장소"></td>
                        </tr>
                        <tr>
                            <th scope="row"><label for="">안건</label></th>
                            <td colspan="5"><input type="text" id="mtg_agnd" title="안건" v-model="viewModel.data.mtg_agnd"></td>
                        </tr>
                        <tr>
                            <th scope="row"><label>첨부</label></th>
                            <td colspan="5">
                                <fileform @filelist="fnFilelist"  @fileDelete="fnFileDelete" :pass="{id:'sc'}" ref="files"></fileform>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div>
                <h3>참석자</h3>
                <div class="table_top btn-right">
                    <button class="btn btn-white" @click="fnAtdrnPopup();"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-group-add"></use></svg>참석자추가</button>
                </div>
                <table class="table write">
                    <caption>참석자 등록</caption>
                    <thead>
                        <tr>
                            <th scope="col">부서명</th>
                            <th scope="col">팀명</th>
                            <th scope="col">직책</th>
                            <th scope="col">성명</th>
                        </tr>
                    </thead>
                    <tbody v-if="viewModel.atdrnList.length > 0">
                        <tr v-for="item in viewModel.atdrnList" :key="item">
                            <td>{{ item.dept_nm }}</td>
                            <td>{{ item.team_nm }}</td>
                            <td>{{ item.jbttl_nm }}</td>
                            <td>{{ item.user_nm }}</td>
                        </tr>
                    </tbody>
                    <tbody v-else>
                        <tr>
                            <td colspan="4">데이터가 없습니다</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div>
                <h3>금회 협의사항</h3>
                <table class="table write">
                    <caption>금회 협의사항 등록</caption>
                    <thead>
                        <tr>
                            <th scope="col">협의사항</th>
                            <th scope="col">세부사항</th>
                            <th scope="col">회신 및 조치기한</th>
                            <th scope="col">담당부서</th>
                            <th scope="col">관리</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(data, i) in viewModel.cnsltnList">
                            <td><textarea rows="3" title="금회협의사항 입력" v-model="data.cnsltn_mttr"></textarea></td>
                            <td><textarea rows="3" title="세부사항 입력" v-model="data.detail_mttr"></textarea></td>
                            <td><textarea rows="3" title="회신 및 조치기한 입력" v-model="data.rply_nd_actn_term"></textarea></td>
                            <td>
                                <div class="input_group input_btn">
                                    <input type="text" :id="'dept_nm' + i" title="담당부서 입력" v-model="data.dept_nm" readonly @click="fnPopup(i);">
                                    <label :for="'dept_nm'  + i"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-search"></use></svg></label>
                                </div>
                            </td>
                            <td>
                                <div class="icon_box">
                                    <button @click.prevent="fnAddCnsltn()" class="btn btn-icon"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-add-circle"></use></svg></button>
                                    <button @click.prevent="fnDeleteCnsltn(i)" class="btn btn-icon"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-circle-minus"></use></svg></button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div>
                <h3>회의사진 첨부</h3>
                <imgsfileform :ref="'imgsfileform'" :pass="{id:'pwSftmt'}" @filelist="fnImgFileList" @fileDelete="fnImgFileDelete"></imgsfileform>
            </div>
            <div>
                <h3>기타 건의 / 공지사항</h3>
                <table class="table write">
                    <caption>기타 건의, 공지사항 등록</caption>
                    <thead>
                        <tr>
                            <th scope="col">구분</th>
                            <th scope="col">내용</th>
                            <th scope="col">조치결과</th>
                            <th scope="col">관리</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(data, i) in viewModel.suggestList">
                            <td>
                                <select title="구분항목" v-model="data.se">
                                    <option v-for="(item, i) in viewModel.suggestSeList" :value="item.CODE">{{ item.CODE_NM }}</option>
                                </select>
                            </td>
                            <td><textarea rows="1" title="내용 입력" v-model="data.cn"></textarea></td>
                            <td><textarea rows="1" title="조치결과 입력" v-model="data.actn_rslt"></textarea></td>
                            <td>
                                <div class="icon_box">
                                    <button @click.prevent="fnAddSuggest()" class="btn btn-icon"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-add-circle"></use></svg></button>
                                    <button @click.prevent="fnDeleteSuggest(i)" class="btn btn-icon"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-circle-minus"></use></svg></button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="btn-group btn-right">
                <button class="btn btn-purple" @click.prevent="fnSave()"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-post-add"></use></svg>등록</button>
                <router-link to="/" class="btn btn-white"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-list-back"></use></svg>목록</router-link>
            </div>
        </div>
        <dept ref="dept" v-if="deptPop==true" :pass="{title:'담당 부서', multi:'Y'}"></dept>
        <atdrn ref="atdrn" v-if="atdrnPop==true" :pass="{title:'참석자'}"></atdrn>
        <!-- <user ref="user" v-if="userPop==true" :pass="{dept_sn: viewModel.userInfo.dept_sn, team_sn: viewModel.userInfo.team_sn, title:'조치자', multi:'Y'}"></user> -->
    </div>    
</template>

<script>
    import "es6-promise/auto";
    import Vue from "vue";
    import Axios from "axios";
    import Common from "../../../../common/js/common.js";
    import atdrn from "./popup/rgstPwSftmtPopup.vue";
    import fileform from "../../../../common/vue/fileform2.vue";
    import imgsfileform from "../../../../common/vue/imgsfileform2.vue";
    import Message, {messageUtil} from "../../../../common/js/message";
    import fromValidation from "../../../../common/js/fromValidation";
    import dept from "../../popup/dept_popup.vue";
    
    
    export default {
        data: function() {
            return {
                deptPop:false,
                atdrnPop:false,
                popIndex: 0,
                viewModel:{
                    data:{
                        mtg_month:'',
                        mtg_week:'',
                        mtg_dt_st_hour:'',
                        mtg_dt_st_min:'',
                        mtg_dt_ed_hour:'',
                        mtg_dt_ed_min:'',
                    },
                    userInfo:{},
                    //이미지파일리스트
                    imgfilelist:[],
                    imgdeletefileList: [],
                    //파일리스트
                    filelist:[],
                    deletefileList: [],
                    //협의사항리스트
                    cnsltnList:[{dept:'', dept_nm:'', cnsltn_mttr:'', detail_mttr:'', rply_nd_actn_term:''}],
                    //기타건의사항리스트
                    suggestList:[{se: 'SUG', cn:'', actn_rslt:''}],
                    suggestSeList:[],
                    atdrnList:[],
                },
                isSaved:false,
            };
        },
        components: {
            'fileform' : fileform,
            'imgsfileform' : imgsfileform,
            'dept' : dept,
            'atdrn' : atdrn,
        },
        activated:function(){
            this.fnInit();
            calendarInput();
        },
        deactivated:function(){
            this.$destroy();
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
        mounted: function() {
            let vm = this;
            // vm.fnInit();
            //캘린더
            // calendarInput();
            // $(".yearpicker").yearpicker();
        },
        methods: {
            fnInit:function(){
                let vm = this;
                vm.viewModel.userInfo = vm.$store.state.global.userInfo;

                let sn = vm.$route.params.sn;

                if(sn != undefined){
                    vm.fnDetail(sn);
                }else{
                    vm.fnWriteInfo();

                    let myDate = new Date();
                    let thisYear = myDate.getFullYear();
                    let thisMonth = myDate.getMonth() + 1 < 10? "0" + (myDate.getMonth() + 1): myDate.getMonth() + 1;

                    $(".yearpicker").yearpicker({
                        year: thisYear,
                    });
                    vm.viewModel.data.mtg_month = thisMonth;
                }
            },
            fnDetail: function(sn){
                let vm = this;
                let data = {
                    mtg_sn: sn
                }

                Axios.post("/selectPwSftmtDetail.do", data)
                .then(function(response) {
                    vm.viewModel.suggestSeList = response.data.suggestSeList;
                    vm.viewModel.data = response.data.detail;
                    vm.viewModel.imgfilelist = response.data.imgfilelist;
                    vm.viewModel.filelist = response.data.filelist;
                    vm.viewModel.cnsltnList = response.data.cnsltnList;
                    vm.viewModel.suggestList = response.data.suggestList;
                    vm.viewModel.atdrnList = response.data.atdrnList;

                    vm.$refs.files.fnFileLoadList(vm.viewModel.filelist);
                    vm.$refs.imgsfileform.fnFileLoadList(vm.viewModel.imgfilelist);

                    $(".yearpicker").yearpicker({
                        year: Number(vm.viewModel.data.mtg_year)
                    });
                    
                    $("#mtg_dt").val(vm.viewModel.data.mtg_dt);

                    if(vm.viewModel.data.mtg_st_time != ''){
                        vm.viewModel.data.mtg_dt_st_hour = vm.viewModel.data.mtg_st_time.split(':')[0];
                        vm.viewModel.data.mtg_dt_st_min = vm.viewModel.data.mtg_st_time.split(':')[1];
                    }else{
                        vm.viewModel.data.mtg_dt_st_hour = '';
                        vm.viewModel.data.mtg_dt_st_min = '';
                    }

                    if(vm.viewModel.data.mtg_ed_time != ''){
                        vm.viewModel.data.mtg_dt_ed_hour = vm.viewModel.data.mtg_ed_time.split(':')[0];
                        vm.viewModel.data.mtg_dt_ed_min = vm.viewModel.data.mtg_ed_time.split(':')[1];
                    }else{
                        vm.viewModel.data.mtg_dt_ed_hour = '';
                        vm.viewModel.data.mtg_dt_ed_min = '';
                    }

                    if(vm.viewModel.cnsltnList.length == 0){
                        vm.viewModel.cnsltnList.push({dept:'', dept_nm:'', cnsltn_mttr:'', detail_mttr:'', rply_nd_actn_term:''});
                    }

                    if(vm.viewModel.suggestList.length == 0){
                        vm.viewModel.suggestList.push({se: 'SUG', cn:'', actn_rslt:''});
                    }
                    
                });
            },
            fnWriteInfo: function(){
                let vm = this;
                let data = {}

                Axios.post("/selectPwSftmtWriteInfo.do", data)
                .then(function(response) {
                    vm.viewModel.suggestSeList = response.data.suggestSeList;
                });
            },
            // 협의사항(추가)
            fnAddCnsltn: function() {
                let vm = this;
                vm.viewModel.cnsltnList.push({dept:'', dept_nm:'', cnsltn_mttr:'', detail_mttr:'', rply_nd_actn_term:''});
            },
            // 협의사항(삭제)
            fnDeleteCnsltn: function(index) {
                let vm = this;
                vm.viewModel.cnsltnList.splice(index, 1);

                //협의사항 하나도 없을 경우는 새로 하나 생성
                if(vm.viewModel.cnsltnList.length == 0){
                    vm.viewModel.cnsltnList.push({dept:'', dept_nm:'', cnsltn_mttr:'', detail_mttr:'', rply_nd_actn_term:''});
                };
            },
            // 기타 건의 / 공지사항(추가)
            fnAddSuggest: function() {
                let vm = this;
                vm.viewModel.suggestList.push({se: 'SUG', cn:'', actn_rslt:''});
            },
            // 기타 건의 / 공지사항(삭제)
            fnDeleteSuggest: function(index) {
                let vm = this;
                vm.viewModel.suggestList.splice(index, 1);

                //기타 건의 / 공지사항 하나도 없을 경우는 새로 하나 생성
                if(vm.viewModel.suggestList.length == 0){
                    vm.viewModel.suggestList.push({se: 'SUG', cn:'', actn_rslt:''});
                };
            },
            fnPopup: function(i) {
                let vm = this;
                vm.popIndex = i;
                vm.deptPop=true;
				vm.$nextTick(function() {
					if(vm.deptPop) {
						vm.$refs.dept.fnInit();
					}
				})
            },
            fnAtdrnPopup: function(){
                let vm = this;
                vm.atdrnPop=true;
				vm.$nextTick(function() {
					if(vm.atdrnPop) {
						vm.$refs.atdrn.fnInit();

                        vm.$refs.atdrn.viewModel.userSelectList = [];
                        
						for(let i = 0; i<vm.viewModel.atdrnList.length; i++){
                            let item = vm.viewModel.atdrnList[i];
                            vm.$refs.atdrn.viewModel.userSelectList.push(item);
                        }
					}
				})
            },
            fnMultDeptAdd: function(list){
                let vm = this;

                let deptNmStr = "";
                let deptSnStr = "";
                for(let i=0; i<list.length; i++){
                    if(deptNmStr == ""){
                        deptNmStr = list[i].dept_nm;
                        deptSnStr = list[i].dept_sn;
                    }else{
                        deptNmStr += "," + list[i].dept_nm;
                        deptSnStr += "," + list[i].dept_sn;
                    }
                }

                vm.viewModel.cnsltnList[vm.popIndex].dept = deptSnStr;
                vm.viewModel.cnsltnList[vm.popIndex].dept_nm = deptNmStr;
            },
            fnSave: function(){
                let vm = this;
                let frm = new FormData();
                for(let i=0; i<vm.viewModel.filelist.length; i++) {
                    let key = vm.viewModel.filelist[i].file_seq;
                    if(vm.viewModel.filelist[i].file != null) {
                        frm.append("fileTitle", vm.viewModel.filelist[i].file_title);
                        frm.append("uploadFiles", vm.viewModel.filelist[i].file);
                        frm.append("file_se", 1);
                        if(vm.viewModel.filelist[i].file_sn){
                            frm.append("deleteFiles", vm.viewModel.filelist[i].file_sn);
                        }
                        frm.append("key", 0)
                    } else {
                        if(vm.viewModel.filelist[i].file == undefined){
                            
                        }else{
                            frm.append("fileTitle", vm.viewModel.filelist[i].file_title);
                            frm.append("key", key)
                        }
                    }
                }
                for(let i=0; i<vm.viewModel.deletefileList.length; i++){
                    frm.append("deleteFiles", vm.viewModel.deletefileList[i]);
                }

                ////////////////////////이미지//////////////////////////////
                for(let i=0; i<vm.viewModel.imgfilelist.length; i++) {
                    let key = vm.viewModel.imgfilelist[i].file_seq;
                    if(vm.viewModel.imgfilelist[i].file != null) {
                        frm.append("fileTitle", vm.viewModel.imgfilelist[i].file_title);
                        frm.append("uploadFiles", vm.viewModel.imgfilelist[i].file);
                        frm.append("file_se", 2);
                        if(vm.viewModel.imgfilelist[i].file_sn){
                            frm.append("deleteFiles", vm.viewModel.imgfilelist[i].file_sn);
                        }
                        frm.append("key", 0)
                    } else {
                        if(vm.viewModel.imgfilelist[i].file == undefined){
                            
                        }else{
                            frm.append("fileTitle", vm.viewModel.imgfilelist[i].file_title);
                            frm.append("key", key)
                        }
                    }
                }

                for(let i=0; i<vm.viewModel.imgdeletefileList.length; i++){
                    frm.append("deleteFiles", vm.viewModel.imgdeletefileList[i]);
                }
                
                vm.fngetFileInfo(frm);
            },
            fngetFileInfo:function(frm){
                let vm = this;
                const valiData = [
                    {id: 'mtg_year', type: 'select', title: '회의명(년도)'},
                    {id: 'mtg_month', type: 'select', title: '회의명(월)'},
                    {id: 'mtg_week', type: 'select', title: '회의명(주차)'},
                    {id: 'mtg_dt', type: 'select', title: '회의일'},
                ];
                
                if(!fromValidation(valiData)){
                    return false;
                }

                let st_time = '';
                let ed_time = '';
                if(vm.viewModel.data.mtg_dt_st_hour != '' || vm.viewModel.data.mtg_dt_st_min != ''){
                    st_time = vm.viewModel.data.mtg_dt_st_hour + ':' + vm.viewModel.data.mtg_dt_st_min;
                }
                
                if(vm.viewModel.data.mtg_dt_ed_hour != '' || vm.viewModel.data.mtg_dt_ed_min != ''){
                    ed_time = vm.viewModel.data.mtg_dt_ed_hour + ':' + vm.viewModel.data.mtg_dt_ed_min;
                }


                let data = {
                    user_id: vm.viewModel.userInfo.user_id,
                    mtg_year: $("#mtg_year").val(),
                    mtg_month: vm.viewModel.data.mtg_month,
                    mtg_week: vm.viewModel.data.mtg_week,
                    mtg_dt: $("#mtg_dt").val(),
                    mtg_st_time: st_time,
                    mtg_ed_time: ed_time,
                    mtg_plc: vm.viewModel.data.mtg_plc,
                    mtg_agnd: vm.viewModel.data.mtg_agnd == undefined ? '' : vm.viewModel.data.mtg_agnd,
                    mtg_sn: vm.viewModel.data.mtg_sn,
                    cnsltnList: vm.viewModel.cnsltnList,
                    suggestList: vm.viewModel.suggestList,
                    atdrnList: vm.viewModel.atdrnList,
                };

                frm.append('data', new Blob([ JSON.stringify(data) ], {type : "application/json"}));
                
                frm.append("filePath", "pwSftmt");

                if(vm.viewModel.data.mtg_sn == undefined){
                    if(confirm(Message.CREATE_CONFIRM)){
                        Axios.post("/insertPwSftmt.do", frm).then(function(response) {
                            if(response.data == 888){
                                alert("이미 해당 주에 주간회의가 있습니다.");
                                return false;
                            }else if(response.data == 1){
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
                }else{
                    // 수정 전 조치 참석 체크
                    Axios.post("/selectRegYnChk.do", data).then(function(response) {
                        if(response.data == 0){
                            if(confirm(Message.UPDATE_CONFIRM)){
                                Axios.post("/updatePwSftmt.do", frm).then(function(response) {
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
                        }else{
                            if(response.data == 999){
                                alert("참석 및 조치를 진행하여 수정이 불가합니다.")
                            }else{
                                alert("이미 해당 주에 주간회의가 있습니다.");
                            }
                        }
                    })                   
                }
            },
            fnFilelist:function(vm){
                this.viewModel.filelist = vm.filelist;
            },
            fnFileDelete: function(vm){
                this.viewModel.deletefileList = vm.deletefileList;
            },
            fnImgFileList:function(vm){
                this.viewModel.imgfilelist = vm.viewModel.filelist;
            },
            fnImgFileDelete:function(vm){
                this.viewModel.imgdeletefileList = vm.viewModel.deletefileList;
            },
            fnAtdrnList:function(list){
                let vm = this;

                vm.viewModel.atdrnList = [];

                for(let i = 0; i<list.length; i++){
                    vm.viewModel.atdrnList.push({
                        'user_id': list[i].user_id, 'user_nm' :list[i].user_nm
                        , 'dept_sn' : list[i].dept_sn, 'dept_nm':list[i].dept_nm
                        , 'team_sn' : list[i].team_sn, 'team_nm':list[i].team_nm 
                        , 'jbgd_sn' : list[i].jbgd_sn, 'jbttl_nm':list[i].jbttl_nm 
                    })
                }
            }
        }
    };
</script>
