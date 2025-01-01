<template>
    <div>
        <div class="contents write">
            <div>
                <table class="table horizontal write">
                    <caption>아차사고 이력등록</caption>
                    <tbody>
                        <tr>
                            <th scope="row" class="w180 essential"><label for="dt">발생일시</label></th>
                            <td>
                                <div class="datepicker_box">
                                    <input type="text" class="datepicker" id="dt" title="datepicker" readonly>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row" class="essential"><label for="ttl">사고명</label></th>
                            <td><input type="text" id="ttl" title="제목" v-model="ttl"></td> 
                        </tr>
                        <tr>
                            <th scope="row" class="essential"><label for="pstn">위치</label></th>
                            <td>
                                <input type="text" id="pstn" title="위치" v-model="PSTN">
                            </td>
                        </tr>
                        <tr>
                            <th scope="row" class="essential"><label for="bplc_nm">현장명</label></th>
                            <td>
                                <div class="input_group input_btn" v-if="userInfo.bplc_sn != 0">
                                    <input type="text" title="현장명" v-model="bplc_nm" readonly>
                                </div>
                                <div class="input_group input_btn" v-else>
                                    <input type="text" title="현장명" id="bplc_nm" v-model="bplc_nm" readonly @click="fnPopup();">
                                    <input type="hidden" id="bplc" v-model="bplc_sn">
                                    <label for="bplc_nm">
                                        <svg class="icon">
                                            <use xlink:href="../../img/symbol-defs.svg#icon-search"></use>
                                        </svg>
                                    </label>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row" class="essential"><label for="cn">아차사고 내용</label></th>
                            <td><textarea id="cn" title="아차사고 내용" v-model="CN"></textarea></td> 
                        </tr>
                        <tr>
                            <th scope="row" class="essential"><label for="recr_prvn_cntrpln">재발방지 대책</label></th>
                            <td><textarea id="recr_prvn_cntrpln" title="재발방지 대책" v-model="RECR_PRVN_CNTRPLN"></textarea></td> 
                        </tr>
                        <tr>
                            <th scope="row"><label for="scimg">사진</label></th>
                            <td>
                                <imgfileform id="scimg" @filelist="fnImgFilelist" :pass="{id:'nms'}" ref="imgfile"></imgfileform>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row"><label for="file">첨부</label></th>
                            <td>
                                <fileform id="file" @filelist="fnFilelist" :pass="{id:'sc'}" ref="files"></fileform>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div class="table_footer btn-right">
                    <a v-if="uid == undefined" href="javascript:;" class="btn btn-purple" @click="fnupload()"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-post-add"></use></svg>저장</a>
                    <a v-else href="javascript:;" class="btn btn-purple" @click="fnupload()"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-post-add"></use></svg>수정</a>
                    <a @click="fnBack()" href="javascript:;" class="btn btn-white"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-list-back"></use></svg>목록</a>
                </div>
            </div>
        </div>
        <bplc ref="bplc" v-if="bplcPop==true" :pass="{dept_sn: userInfo.dept_sn, team_sn: userInfo.team_sn}"></bplc>
    </div>
</template>
<script>
    import "es6-promise/auto";
    import Vue from "vue";
    import Axios from "axios";
    import Fileform from "../../../../common/vue/mngmtfileform.vue";
    import Imgfileform from "../../../../common/vue/imgfileform.vue";
    import bplc from "../../popup/bplc_popup.vue";

    Vue.component('fileform', Fileform);
    Vue.component('bplc', bplc);
    Vue.component('imgfileform', Imgfileform);
    export default {
      data: function() {
        return {
            uid:'',
            bplcPop:false,
            atch_photo:0,
            file_se:0,
            userInfo:{},
            bplc_nm:"",
            ttl:"",
            CN:"",
            PSTN:"",
            bplc_sn:"",
            RECR_PRVN_CNTRPLN:"",
            viewModel: {
                filelist: [],
                fileGroup: '',
                img_filelist: [],
 				imgfileGroup: '',
                filelength:0,
			},
            img_fc:0,
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
        let vm = this;
        vm.uid = vm.$route.params.uid;
        vm.file_se = parseInt(vm.$route.params.atchmnfl);
        vm.userInfo = vm.$store.state.global.userInfo;
        vm.bplc_nm = vm.$store.state.global.userInfo.bplc_nm;
        vm.bplc_sn = vm.$store.state.global.userInfo.bplc_sn;
        calendarInput();
        if(vm.uid != "" && vm.uid != undefined){
            vm.fnmngmt();
        }
      },
      deactivated:function(){
        this.$destroy();
      },
      methods: {
        fnmngmt:function(){
            let vm = this;
            let mapperId = "slpAcdtCs.MngmtFilelist"
            Axios.post('/selectMngmtSlpAcdtCsWrite.do',{acdnt_mng_sn:vm.uid ,file_se:vm.file_se}).then(function(res){
                $(".datepicker").val(res.data.rskEvltList[0].ocrn_dt);
                vm.ttl = res.data.rskEvltList[0].ttl;
                vm.PSTN = res.data.rskEvltList[0].pstn;
                vm.CN = res.data.rskEvltList[0].cn;
                vm.RECR_PRVN_CNTRPLN = res.data.rskEvltList[0].recr_prvn_cntrpln;
                vm.bplc_sn = res.data.rskEvltList[0].bplc_sn;
                vm.bplc_nm = res.data.rskEvltList[0].bplc_nm;
                vm.img_fc = res.data.rskEvltList[0].img_file_se;
                for(var i=0; i<res.data.rskEvltList.length; i++){
                    var send={
                        groupid:res.data.rskEvltList[0].acdnt_mng_sn,
                        mapperId:mapperId,
                    }
                    if(vm.file_se == 0 ){
                        alert("등록된 파일이 없습니다.");
                    }else{
                        if(res.data.rskEvltList[i].file_extn != "I"){
                            send.se = res.data.rskEvltList[i].file_extn;
                            vm.$refs.files.fnFileLoad(send);
                        }else{
                            send.se = res.data.rskEvltList[i].file_extn;
                            vm.$refs.imgfile.fnFileLoad(send);
                        };
                    }
                }
            });
            
        },
        fnupload:function(){
            let vm = this;
            let send = {
                ocrn_dt:$(".datepicker").val(),
                cn:vm.CN,
                pstn:vm.PSTN,
                ttl:vm.ttl,
                bplc_sn:vm.bplc_sn,
                recr_prvn_cntrpln:vm.RECR_PRVN_CNTRPLN,
                reg_id:vm.userInfo.user_id,
            }
            if($(".datepicker").val() == "") return alert("날짜를 선택해주세요.");
            if(vm.SPT == "") return alert("사고명을 적어주세요");
            if(vm.PSTN == "") return alert("위치를 선택해주세요.");
            if(vm.CN == "") return alert("아차사고를 적어주세요.");
            if(vm.RECR_PRVN_CNTRPLN == "") return alert("재발방지대책을 적어주세요.");

            if( vm.uid != "" && vm.uid != undefined){
                send.acdnt_mng_sn = vm.uid;
                if(confirm("수정하시겠습니까?")){
                    Axios.post("/updateMngmtSlpAcdtCsWrite.do",send).then(function(res){
                        if(res != 0){
                            if(vm.viewModel.fileGroup !=''){
                                vm.$refs.files.fnInsertFile(vm.userInfo.user_id,vm.$store.state.global.userInfo.bplc_sn);
                            };

                            if(vm.viewModel.imgfileGroup != ''){
                                var filemapperId = "";
                                vm.img_fc != 0 ?  filemapperId = "slpAcdtCs.updateFileMngmtSlpAcdtCs" : filemapperId = "slpAcdtCs.insertFileMngmtSlpAcdtCs";
                                vm.$refs.imgfile.fnInsertFile(filemapperId,vm.userInfo.user_id,vm.$store.state.global.userInfo.bplc_sn);
                            };
                            vm.isSaved = true;
                            alert("수정 되었습니다.");
                            setTimeout(()=> vm.$router.push("/") , 200);
                        }else{
                            alert("수정을 실패 했습니다.");
                        }
                    })
                }
            }else{
                if(confirm("등록하시겠습니까?")){
                    Axios.post("/insertMngmtSlpAcdtCsWrite.do",send).then(function(res){
                        if(res != 0){
                            if(vm.viewModel.fileGroup !=''){
                                vm.$refs.files.fnInsertFile(vm.userInfo.user_id,vm.$store.state.global.userInfo.bplc_sn); /// 현장일련번호 보내야함 
                            };
                            if(vm.viewModel.imgfileGroup != ''){
                                const filemapperId = "slpAcdtCs.insertFileMngmtSlpAcdtCs";
                                vm.$refs.imgfile.fnInsertFile(filemapperId,vm.userInfo.user_id,vm.$store.state.global.userInfo.bplc_sn);
                            };

                            vm.isSaved = true;
                            alert("등록 되었습니다.");
                            setTimeout(()=> vm.$router.push("/") , 200);
                            
                            
                        }else{
                            alert("등록을 실패 했습니다.");
                        }
                    })
                }
            }
        },
        fnFilelist: function(vm) {
            this.viewModel.filelist = vm.filelist;
            this.viewModel.fileGroup = vm.fileGroup;
		},
        fnImgFilelist: function(vm) {
            this.viewModel.img_filelist.push(vm.filelist);
			this.viewModel.imgfileGroup = vm.fileGroup;
		},
        fnBack:function(){
            // if(confirm("작성을 중단하고 목록으로 가시겠습니까?")){
                this.$router.push("/");
            // }
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

            vm.bplc_sn = item.bplc_sn;
            vm.bplc_nm = item.bplc_nm;
        },
      }
    };
</script>