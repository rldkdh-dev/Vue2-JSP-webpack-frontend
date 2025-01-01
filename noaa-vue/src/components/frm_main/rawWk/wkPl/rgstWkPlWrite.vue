<template>
    <div>
        <div class="contents write">
            <div>
                <table class="table horizontal write">
                    <caption>작업계획서 등록</caption>
                    <tbody>
                        <tr>
                            <th scope="row" class="w180 essential"><label for="bplc">현장명</label></th>
                            <td v-if="viewModel.user.user_roles == 'ROLE_001' && viewModel.user.user_type_code == 'ACC_0000'">
                            <div class="input_group input_btn">
                                <input type="text" id="bplc_nm" v-model="viewModel.data.bplc_nm" disabled>    
                                <input type="hidden" id="bplc" v-model="viewModel.data.bplc_sn">
                                <button @click="fnBplcPopup();" v-if="viewModel.user.bplc_yn !='Y'"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-search"></use></svg></button>
                            </div>
                        </td>
                        <td v-else>
                            <input type="text" id="bplc_nm" v-model="viewModel.data.bplc_nm" disabled>
                            <input type="hidden" id="bplc" v-model="viewModel.data.bplc_sn">
                        </td>
                        </tr>
                        <tr>
                            <th scope="row" class="essential"><label for="pic">담당자</label></th>
                            <td><input type="text" id="pic" v-model="viewModel.data.pic" disabled></td>
                        </tr>
                        <tr>
                            <th scope="row" class="essential"><label for="dt">날짜</label></th>
                            <td><div class="input_group">
                                <div class="datepicker_box">
                                    <input type="text" class="datepicker" id="dt" placeholder="날짜" title="날짜" readonly>
                                </div>
                                <span>*해당 서류 승인 일자를 입력해주세요 </span>
                            </div>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row" class="essential"><label for="ttl">제목</label></th>
                            <td><input type="text" id="ttl" v-model="viewModel.data.ttl"></td>
                        </tr>
                        <tr>
                            <th scope="row"><label for="">첨부</label></th>
                            <td>
                                <fileform @filelist="fnFilelist"  @fileDelete="fnFileDelete" :pass="{id:'sc'}" ref="files"></fileform>
                            </td>
                        </tr>
                    </tbody>
                </table>
                
                <div class="table_footer btn-right">
                    <a href="" class="btn btn-purple" @click.prevent="fnSave()"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-post-add"></use></svg>등록</a>
                    <a href="" class="btn btn-white"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-list-back"></use></svg>목록</a>
                </div>
            </div>
        </div>
        <bplc ref="bplc" v-if="bplcPop==true" :pass="{dept_sn: viewModel.user.dept_sn, team_sn: viewModel.user.team_sn}"></bplc>
    </div>
    </template>
    
    <script>
        import "es6-promise/auto";
        import Axios from "axios";
        import fileform from "../../../../common/vue/fileform2.vue";
        import bplc from "../../popup/bplc_popup2.vue";
        import fromValidation from "../../../../common/js/fromValidation";
        import Vue from "vue"
        Vue.component('fileform',fileform);
        Vue.component('bplc', bplc)
    
        export default {
          data: function() {
            return {
                list:[],
                bplcPop:false, //현장 팝업
                viewModel: {
                    scenario: {},
                    user: {},
                    filelist: [],
                    fileGroup: '',
                    img_filelist: [],
                    imgfileGroup: '',
                    deletefileList: [],
                    data:{
                        bplc_nm:'',
                        bplc_sn:'',
                        bplc:'',
                        dt:'',
                        ttl:'',
                        job_actpln_sn:'',
                        pic:'',
                        atch_photo:'',
                        mng_sn:'',
                        file_sn:'',
                        reg_id:'',
                        user_id:'',
                    }
                },
                isSaved:false,
            };
          },
        mounted: function() {
            let vm = this;
            vm.viewModel.data.job_actpln_sn = vm.$route.params.job_actpln_sn;
            vm.fnInit();
        },
        activated:function(){
            this.fnInit();
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
        methods: {
            fnInit: function() {
                let vm = this;	
                vm.viewModel.user = vm.$store.state.global.userInfo;
                vm.viewModel.data.pic = vm.viewModel.user.user_name;
                calendarInput();
    
                let sn = vm.$route.params.job_actpln_sn;
    
                    if(sn != undefined){
                        vm.fnDetail(sn);
                    }
    
                    vm.viewModel.data.bplc_sn = vm.viewModel.user.bplc_sn == 0 ? '' : vm.viewModel.user.bplc_sn;
                    vm.viewModel.data.bplc_nm = vm.viewModel.user.bplc_sn == 0 ? '' : vm.viewModel.user.bplc_nm;
                },
                fnDetail: function(job_actpln_sn){
                    let vm = this;
                    let send = {
                        job_actpln_sn: job_actpln_sn,
                        mng_sn:job_actpln_sn
                    };
                        Axios.post("/detailRgstWkPlList.do",send).then(function(rs) {
                            vm.viewModel.data = rs.data.detail;
                            vm.viewModel.filelist = rs.data.fileList;
                            vm.viewModel.data.dt = $('#dt').val(rs.data.detail.dt);
                            vm.viewModel.data.bplc_nm = rs.data.detail.bplc;
                            vm.viewModel.data.bplc_sn = rs.data.detail.bplc_sn;
                            vm.$refs.files.fnFileLoadList(vm.viewModel.filelist);
                    });
                    
                },
                fnBplcPopup:function(){
                let vm = this;
				vm.bplcPop=true;
				vm.$nextTick(function() {
					if(vm.bplcPop) {
						vm.$refs.bplc.fnInit();
                        }
                    })
                },
                fnBplcAdd: function(item){
                    let vm = this;

                    vm.viewModel.data.bplc_sn = item.bplc_sn;
                    vm.viewModel.data.bplc_nm = item.bplc_nm;
                },
                fnFileDelete: function(vm){
                    this.viewModel.deletefileList = vm.deletefileList;
                },
                fnSave: function(){
                    let vm = this;
                    let frm = new FormData();
                    for(let i=0; i<vm.viewModel.filelist.length; i++) {
                        let key = vm.viewModel.filelist[i].file_seq;
                        if(vm.viewModel.filelist[i].file != null) {
                            frm.append("fileTitle", vm.viewModel.filelist[i].file_title);
                            frm.append("uploadFiles", vm.viewModel.filelist[i].file);
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
    
                        vm.fngetFileInfo(frm);
                    },
    
                fngetFileInfo:function(frm){
                    let vm = this;
                    const valiData = [
                        // {id: 'bplc', type: 'select', title: '현장명'},
                        {id: 'dt', type: 'input', title: '날짜'},
                        {id: 'ttl', type: 'input', title: '제목'},
                    ];
                    if(!fromValidation(valiData)){
                            return false;
                    }
                    let data = {
                        bplc:vm.viewModel.data.bplc_nm,
                        bplc_sn:vm.viewModel.data.bplc_sn,
                        dt:$('#dt').val(),
                        ttl:vm.viewModel.data.ttl,
                        pic:vm.viewModel.data.pic,
                        mng_sn: vm.viewModel.data.mng_sn,
                        file_sn: vm.viewModel.data.file_sn,
                        atch_photo:vm.viewModel.imgfileGroup != '' ? 1:0,
                        reg_id: vm.$store.state.global.userInfo.user_id,
                        mod_id: vm.$store.state.global.userInfo.user_id,
                        user_id: vm.$store.state.global.userInfo.user_id,
                        job_actpln_sn:vm.$route.params.job_actpln_sn,
                        deletefileList : vm.viewModel.deletefileList,
                    }
    
                    frm.append('data', new Blob([ JSON.stringify(data) ], {type : "application/json"}));
                        
                    frm.append("filePath", "rgstRgstWkPl");               
                    if(vm.viewModel.data.bplc_sn == '' || vm.viewModel.data.bplc_sn == null){
                            alert('현장명 선택은 필수입니다.');
                            return false;
                }
                    if(vm.$route.params.job_actpln_sn != undefined && vm.$route.params.job_actpln_sn != null && vm.$route.params.job_actpln_sn != ''){
                        if(confirm('수정하시겠습니까?')){
                            Axios.post("/updateRgstWkPl.do",frm).then(function(rs){
                                vm.isSaved = true;
                                vm.$router.push('/');
                                alert('수정되었습니다.');
                            })
                        
                            } else {alert('취소되었습니다.');
                        }
                    } else {
                        if(confirm('등록하시겠습니까?')){
                            if(vm.viewModel.data.bplc_sn == '' || vm.viewModel.data.bplc_sn == null){
                            alert('현장명 선택은 필수입니다.');
                            return false;
                    } else{
                                Axios.post("/insertRgstWkPl.do",frm).then(function(rs){
                                    vm.isSaved = true;
                                    vm.$router.push('/');
                                    alert('등록되었습니다.');
                                    })
                                }
                            } else {
                                    alert('취소되었습니다.');
                        }
                    } 
                },
                fnFilelist:function(vm){
                        this.viewModel.filelist = vm.filelist;
                        this.viewModel.fileGroup = vm.fileGroup;
                },
            }
        };
    </script>
    