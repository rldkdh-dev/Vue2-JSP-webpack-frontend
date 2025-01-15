<template>
<div>
    <div class="contents write">
        <div>
            <table class="table horizontal write">
                <caption>타사사고 이력 등록</caption>
                <tbody>
                    <tr>
                        <th scope="row" colspan="2" class="essential"><label for="">사고명</label></th>
                        <td colspan="2"><input type="text" id="" title="입력" v-model="viewModel.ACDNT_NM"></td>
                    </tr>
                    <tr>
                        <th scope="row" colspan="2" class="essential"><label for="">발생일시</label></th>
                        <td colspan="2">
                            <div class="datepicker_box">
                                <input type="text" class="datetimepicker" placeholder="발생일시" id="datetimepicker" readonly>
                                <img class="ui-datepicker-trigger" src="/img/ic-calendar.png" alt="날짜선택" title="날짜선택">
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <th scope="rowgroup" class="w90">사고유형</th>
                        <th scope="row" class="th2 w120"><label for="">인적사고</label></th>
                        <td colspan="2"><input type="text" id="" title="입력" v-model="viewModel.HN_ACDNT_TYPE"></td>
                    </tr>
                    <tr>
                        <th scope="rowgroup" rowspan="2">사고분류</th>
                        <th scope="row" class="th2"><label for="">공종</label></th>
                        <td colspan="2"><input type="text" id="" title="입력" v-model="viewModel.ACDNT_CLSF_CFNL_LCLSF"></td>
                    </tr>
                    <tr>
                        <th scope="row" class="th2"><label for="">기인물</label></th>
                        <td colspan="2"><input type="text" id="" title="입력" v-model="viewModel.ACDNT_CLSF_ACDNT_OBJECT_LCLSF"></td> 
                    </tr>
                    <tr>
                        <th scope="row" colspan="2"><label for="">사고경위</label></th>
                        <td colspan="2"><input type="text" id="" title="입력" v-model="viewModel.ACDNT_CRCMSTNCS"></td>
                    </tr>
                    <tr>
                        <th scope="row" colspan="2"><label for="">사고원인</label></th>
                        <td colspan="2"><input type="text" id="" title="입력" v-model="viewModel.ACDNT_CAUSE"></td>
                    </tr>
                    <tr>
                        <th scope="rowgroup" rowspan="2">피해상황</th>
                        <th scope="row" class="th2"><label for="">사망자수 (명)</label></th>
                        <td>
                            <div class="unit_box input_group">
                                <label for="">내국인:</label>
                                <input type="text" id="" title="입력" v-model="viewModel.DMGE_SITTN_DCSC_CNT_NATIVE" oninput="this.value=this.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');" placeholder="숫자 입력">
                                <span class="unit">명</span>
                            </div>
                        </td>  
                        <td>
                            <div class="unit_box input_group">
                                <label for="">외국인:</label>
                                <input type="text" id="" title="입력" v-model="viewModel.DMGE_SITTN_DCSC_CNT_FRGNR" oninput="this.value=this.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');" placeholder="숫자 입력">
                                <span class="unit">명</span>
                            </div>
                        </td>   
                    </tr>
                    <tr>
                        <th scope="row" class="th2"><label for="">부상자수 (명)</label></th>
                        <td>
                            <div class="unit_box input_group">
                                <label for="">내국인:</label>
                                <input type="text" id="" title="입력" v-model="viewModel.DMGE_SITTN_INJPSN_CNT_NATIVE" oninput="this.value=this.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');" placeholder="숫자 입력">
                                <span class="unit">명</span>
                            </div>
                        </td>  
                        <td>
                            <div class="unit_box input_group">
                                <label for="">외국인:</label>
                                <input type="text" id="" title="입력" v-model="viewModel.DMGE_SITTN_INJPSN_CNT_FRGNR" oninput="this.value=this.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');" placeholder="숫자 입력">
                                <span class="unit">명</span>
                            </div>
                        </td>   
                    </tr>
                    <tr>
                        <th scope="row" colspan="2"><label for="">재발방지대책</label></th>
                        <td colspan="2"><input type="text" id="" title="입력" v-model="viewModel.RECR_PRVN_CNTRPLN"></td>
                    </tr>
                    <tr>
                        <th scope="row" colspan="2"><label for="">현장사진</label></th>
                        <td colspan="2">
                            <imgsfileform :ref="'imgsfiles'" :pass="{id:'othersAcdtCs', gbn:'othersAcdtCs'}" @filelist="fnImgFileList" @fileDelete="fnImgFileDelete"></imgsfileform>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div class="table_footer btn-right">
                <a href="#" class="btn btn-purple" @click="fnOtherCaseSave()"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-post-add"></use></svg>{{state_k}}</a>
                <router-link to="/" class="btn btn-white"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-list-back"></use></svg>목록</router-link>
            </div>
        </div>
    </div>
</div>
</template>

<script>
    import "es6-promise/auto";
    import Vue from "vue";
    import Axios from "axios";
    import imgsfileform from '../../../../common/vue/imgsfileform2.vue';
    
    export default {
        components: {
            imgsfileform
        },
        data: function() {
            return {
                imgsrc:'',
                userInfo:{},
                uid:'',
                state:'',
                state_k:'',
                viewModel:{
                    ACDNT_NM : '',
                    OCRN_DT  : '',
                    HN_ACDNT_TYPE : '',
                    ACDNT_CLSF_CFNL_LCLSF : '',
                    ACDNT_CLSF_ACDNT_OBJECT_LCLSF : '',
                    ACDNT_CRCMSTNCS : '',
                    ACDNT_CAUSE : '',
                    DMGE_SITTN_DCSC_CNT_NATIVE : '',
                    DMGE_SITTN_DCSC_CNT_FRGNR : '',
                    DMGE_SITTN_INJPSN_CNT_NATIVE : '',
                    DMGE_SITTN_INJPSN_CNT_FRGNR : '',
                    RECR_PRVN_CNTRPLN : '',
                },
                fileLoadList:[],
                imgList:[],
                deleteImgList:[],
                isSaved:false,
            };
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
            let vt = this;
            vt.userInfo = this.$store.state.global.userInfo,
            vt.uid = window.location.href.split('/').pop();
            vt.state = window.location.href.split('/').reverse()[1];
            calendarInput();
            $('.datetimepicker').datetimepicker({});
           
            if(vt.state == 'update' && vt.uid != null){
                vt.state_k = '수정';
                vt.fnDetail(vt.uid);
            }else{
                vt.state_k = '등록';
                vt.fnInit();
            }
        },
        activated:function(){
            this.fnInit();
        },
        deactivated:function(){
            this.$destroy();
        },
        methods: {
            fnInit:function(){
                let vt = this;
                vt.userInfo = vt.$store.state.global.userInfo;
            },
            fnDetail:function(uid){
                let vt = this;
                let send = {
                    OTHCMPNY_ACDNT_SN : uid
                }
                Axios.post("/selectOtherAcdtCsDetailList.do", send).then(function(response) {
                    console.log(response.data);
                    vt.viewModel = response.data.otherAcdtCs;
                    vt.viewModel.OCRN_DT = (vt.viewModel.OCRN_DT).substring(0,16);
                    $('.datetimepicker').val(vt.viewModel.OCRN_DT);

                    vt.fileLoadList = response.data.fileList;
                    vt.$refs.imgsfiles.fnFileLoadList(vt.fileLoadList);
                }).catch(function(ex) {
                    console.log(ex);
                });;

            },
            fnOtherCaseSave:function(){
                let vt = this;
                let frm = new FormData();

                for(let i=0; i<vt.imgList.length; i++) {
                    let key = vt.imgList[i].file_seq;
                    if(vt.imgList[i].file != null) {
                        frm.append("uploadFiles", vt.imgList[i].file);
                        frm.append("fileTitle", vt.imgList[i].file.name);
                        
                        if(vt.imgList[i].file_sn){
                            frm.append("deleteFiles", vt.imgList[i].file_sn);
                        }
                        frm.append("key", 0)
                    } else {
                        if(vt.imgList[i].file == undefined){
                            
                        }else{
                            frm.append("fileTitle", vt.imgList[i].file_title);
                            frm.append("key", key)
                        }
                    }
                }
                if(vt.deleteImgList != null){
                    for(let i=0; i<vt.deleteImgList.length; i++){
                        frm.append("deleteFiles", vt.deleteImgList[i]);
                    }   
                }
                vt.fnOtherCaseInsert(frm);
            },
            fnOtherCaseInsert:function(frm){
                let vt = this;
                let vm = this.viewModel;

                if(vm.ACDNT_NM == null || vm.ACDNT_NM == "" || vm.ACDNT_NM == undefined){
                    return alert('사고명은 필수 항목입니다.');
                } else if($(".datetimepicker").val() == ""){
                    return alert("발생일시를 확인해주시기 바랍니다.");
                } 
                
                let data = {
                    OTHCMPNY_ACDNT_SN : (isNaN(vt.uid))? -1:vt.uid,
                    ACDNT_NM : vm.ACDNT_NM,
                    OCRN_DT : $(".datetimepicker").val(),
                    HN_ACDNT_TYPE : vm.HN_ACDNT_TYPE,
                    ACDNT_CLSF_CFNL_LCLSF : vm.ACDNT_CLSF_CFNL_LCLSF,
                    ACDNT_CLSF_ACDNT_OBJECT_LCLSF : vm.ACDNT_CLSF_ACDNT_OBJECT_LCLSF,
                    ACDNT_CRCMSTNCS : vm.ACDNT_CRCMSTNCS,
                    ACDNT_CAUSE : vm.ACDNT_CAUSE,
                    DMGE_SITTN_DCSC_CNT_NATIVE : (vm.DMGE_SITTN_DCSC_CNT_NATIVE == null)? 0:vm.DMGE_SITTN_DCSC_CNT_NATIVE,
                    DMGE_SITTN_DCSC_CNT_FRGNR : (vm.DMGE_SITTN_DCSC_CNT_FRGNR == null)? 0:vm.DMGE_SITTN_DCSC_CNT_FRGNR,
                    DMGE_SITTN_INJPSN_CNT_NATIVE : (vm.DMGE_SITTN_INJPSN_CNT_NATIVE == null)? 0:vm.DMGE_SITTN_INJPSN_CNT_NATIVE,
                    DMGE_SITTN_INJPSN_CNT_FRGNR : (vm.DMGE_SITTN_INJPSN_CNT_FRGNR == null)? 0:vm.DMGE_SITTN_INJPSN_CNT_FRGNR,
                    RECR_PRVN_CNTRPLN : vm.RECR_PRVN_CNTRPLN,
                    // SPT_PHOTO:,
                    REG_ID: vt.userInfo.user_id,
                    // file_img_se : 'img'
                }
                console.log($(".datetimepicker").val());
                console.log(data);
                frm.append('data', new Blob([ JSON.stringify(data) ], {type : "application/json"}));
                
                frm.append("filePath", "othersAcdt");

                if(confirm(vt.state_k+" 하시겠습니까?")){

                    //수정
                    if(vt.state == 'update' && (vt.uid != '' && vt.uid != null && vt.uid != undefined)){
                        Axios.post("/updateOthersAcdtCs.do", frm).then(function(res){
                            console.log(res);
                        }).catch(function(ex) {
                            console.log(ex);
                        });
                        vt.isSaved = true;
                        vt.$router.push('/');
                    }else{//등록
                        Axios.post("/insertOthersAcdtCs.do", frm).then(function(res){
                            console.log(res);
                        }).catch(function(ex) {
                            console.log(ex);
                        });
                        vt.isSaved = true;
                        vt.$router.push('/');
                    }
                }
            },
            fnImgFileList:function(vm){
                let vt = this;
                vt.imgList = vm.viewModel.filelist;
            },
            fnImgFileDelete:function(vm){
                let vt = this;
                vt.deleteImgList = vm.viewModel.deletefileList;
            },
            fnDatePick:function(){
                let vt = this;
                console.log($(".datetimepicker").val());
                vt.viewModel.OCRN_DT = $(".datetimepicker").val();
            }
        }
    };
</script>