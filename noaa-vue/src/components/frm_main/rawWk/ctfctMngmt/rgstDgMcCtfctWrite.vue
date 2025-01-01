<template>
    <div>
        <div class="contents write">
            <div>
                <table class="table horizontal write">
                    <caption>인증서관리 등록</caption>
                    <tbody>
                        <tr>
                            <th scope="row" class="essential"><label for="bplc">현장명</label></th>
                            <td v-if="viewModel.user.user_roles == 'ROLE_001' && viewModel.user.user_type_code == 'ACC_0000'">
                            <div class="input_group input_btn">
                                <input type="text" id="bplc_nm" v-model="viewModel.data.bplc_nm" disabled>    
                                <input type="hidden" id="bplc" v-model="viewModel.data.bplc_sn">
                                <button @click="fnBplcPopup();" v-if="viewModel.userInfo.bplc_yn !='Y'"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-search"></use></svg></button>
                            </div>
                        </td>
                        <td v-else colspan="3">
                            <input type="hidden" id="bplc" v-model="viewModel.data.bplc_sn">
                            <input type="text" id="bplc_nm" v-model="viewModel.data.bplc_nm" disabled>
                        </td>
                        </tr>
                        <tr>
                            <th scope="row" class="essential"><label for="crtfct">구분</label></th>
                            <td>
                                <select title="구분" id="crtfct" v-model="crtfct">
                                    <option v-for="(item, i) in viewModel.crtfctList" :key="i" :value="item.value">{{ item.text }}</option>
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row" class="essential"><label for="rmrk">품명</label></th>
                            <td>
                                <input type="text" id="rmrk" v-model="viewModel.data.rmrk">
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">
                                <label for="">첨부</label>
                                <div class="help_area">
                                    <svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-info-circle"></use></svg>
                                    <div class="tip"><p>인증 대상이 아닌 품목인 경우 시험성적서 등 첨부 가능</p></div>
                                </div>
                            </th>
                            <td>
                                <fileform @filelist="fnFilelist"  @fileDelete="fnFileDelete" :pass="{id:'sc'}" ref="files"></fileform>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="table_footer btn-right">
                <button class="btn btn-purple" @click.prevent="fnSave()"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-post-add"></use></svg>등록</button>
                <router-link :to="'/'" class="btn btn-white"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-list-back"></use></svg>목록</router-link>
            </div>
        </div>
        <bplc ref="bplc" v-if="bplcPop==true" :pass="{dept_sn: viewModel.user.dept_sn, team_sn: viewModel.user.team_sn}"></bplc>
    </div>
</template>

<script>
    import "es6-promise/auto";
    import Vue from "vue";
    import Axios from "axios";
    import Message, {messageUtil} from "../../../../common/js/message";
    import fromValidation from "../../../../common/js/fromValidation";
    import fileform from '../../../../common/vue/fileform2.vue';
    import bplc from "../../popup/bplc_popup2.vue";

    export default {
        data: function() {
            return {
                mttrForm:false,
                bplcPop:false, //현장 팝업
                crtfct:'',
                crtfct_sn:'',
                viewModel:{
                    crtfctList:[
                            {value:"", text:"구분을 선택해주세요"},    
                            {value:"1", text:"유해위험기계기구"},
                            {value:"2", text:"보호구"}, 
                        ],
                    codeList:[],
                    data:{
                        crtfct_se: '',
                        clsf_cd: '',
                        bplc_nm:'',
                        bplc_sn:'',
                        crtfct:'',
                        rmrk:'',
                    },
                    user:{
                        bplc_sn:'',
                        bplc_nm:'',
                    },
                    rsltList:[],
                    userInfo:{},
                    rcmdt:[],
                    filelist: [],
                    deletefileList:[],
					fileGroup: '',
                },
                isSaved:false,
            };
        },
        components: {
            'bplc' : bplc,
            'fileform' : fileform,
        },
        mounted: function() {
            let vm = this;
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
            calendarInput();

            let crtfct_sn = vm.$route.params.crtfct_sn;
            vm.crtfct_sn = crtfct_sn;
                if(crtfct_sn != undefined){
                    vm.fnDetail(crtfct_sn);
                }
            vm.viewModel.data.bplc_sn = vm.viewModel.user.bplc_sn == 0 ? '' : vm.viewModel.user.bplc_sn;
            vm.viewModel.data.bplc_nm = vm.viewModel.user.bplc_sn == 0 ? '' : vm.viewModel.user.bplc_nm;
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
            fnDetail: function(crtfct_sn){
				let vm = this;
				let send = {
					crtfct_sn: crtfct_sn,
                    mng_sn:crtfct_sn
				};
					Axios.post("/detailRgstDgMcCtfctList.do",send).then(function(rs) {
                        vm.viewModel.data = rs.data.detail;
                        vm.viewModel.filelist = rs.data.fileList;
                        vm.viewModel.data.bplc_nm = rs.data.detail.bplc;
                        vm.crtfct = rs.data.detail.crtfct_se;

                        vm.$refs.files.fnFileLoadList(vm.viewModel.filelist);
				});
				
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
                    {id: 'crtfct', type: 'input', title: '구분 선택'},
                    {id: 'rmrk', type: 'input', title: '비고'},
                ];
                if(!fromValidation(valiData)){
                        return false;
                }
                // if(vm.viewModel.data.bplc_sn == '' || vm.viewModel.data.bplc_sn == null){
                //             alert('현장명 선택은 필수입니다.');
                //             return false;
                // }                
                let data = {
                    bplc_sn:vm.viewModel.data.bplc_sn,
                    bplc:vm.viewModel.data.bplc_nm,
                    rmrk:vm.viewModel.data.rmrk,
                    crtfct_se:vm.crtfct,
                    mng_sn: vm.viewModel.data.mng_sn,
                    file_sn: vm.viewModel.data.file_sn,
                    reg_id: vm.$store.state.global.userInfo.user_id,
                    mod_id: vm.$store.state.global.userInfo.user_id,
                    user_id: vm.$store.state.global.userInfo.user_id,
                    crtfct_sn:vm.$route.params.crtfct_sn,
                    deletefileList : vm.viewModel.deletefileList,
                }


                frm.append('data', new Blob([ JSON.stringify(data) ], {type : "application/json"}));
                    
                frm.append("filePath", "dgMcCtfct");

                if(vm.crtfct_sn != undefined && vm.crtfct_sn != null && vm.crtfct_sn != ''){
                    if(confirm('수정하시겠습니까?')){
                        Axios.post("/updateRgstDgMcCtfct.do",frm).then(function(rs){
                            vm.isSaved = true;
                            vm.$router.push('/');
                            alert('수정되었습니다.');
                        })
                    
                    } else{alert('취소되었습니다.');
                }
                } else {
                    if(confirm('등록하시겠습니까?')){
                        if(vm.viewModel.data.bplc_sn == '' || vm.viewModel.data.bplc_sn == null){
                            alert('현장명 선택은 필수입니다.');
                            return false;
                    } else{
                            Axios.post("/insertRgstDgMcCtfct.do",frm).then(function(rs){
                                vm.isSaved = true;
                                vm.$router.push('/');
                                alert('등록되었습니다.');
                            })
                        }
                    } 
                    else{
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