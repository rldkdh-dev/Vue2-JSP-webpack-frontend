<template>
    <div>
        <div class="contents">
            <div class="divide">
                <div id="viewDiv1" class="print_page contents">
                    <div>
                        <h3>안전교육 기본정보</h3>
                        <table class="table horizontal">
                            <caption>안전교육</caption>
                            <tbody>
                                <tr>
                                    <th scope="row" class="w120"><label for="p0">현장명</label></th>
                                    <td>
                                        {{ bplc_nm }}
                                    </td>
                                    <th class="w120">작성자</th>
                                    <th class="w120">검토자</th>
                                    <th class="w120">현장소장</th>
                                </tr>
                                <tr>
                                    <th scope="row" class="w120"><label for="p1">교육종류</label></th>
                                    <td>
                                        {{ edu_nm }}
                                    </td>
                                    <td rowspan="2"><img :src="aprvr1_img" class="sign_img"  v-if="aprvr1_atrz_yn != 'N'" @error="imageLoadError1"></td>
                                    <td rowspan="2"><img :src="aprvr2_img" class="sign_img"  v-if="aprvr2_atrz_yn != 'N'" @error="imageLoadError2"></td>
                                    <td rowspan="2"><img :src="aprvr3_img" class="sign_img"  v-if="aprvr3_atrz_yn != 'N'" @error="imageLoadError3"></td>
                                </tr>
                                <tr>
                                    <th scope="row">교육명</th>
                                    <td>
                                        {{ edu_nm_ttl }}
                                    </td>
                                </tr>
                                <tr>
                                    <th scope="row">교육일시</th>
                                    <td>
                                        {{ edu_dt }}
                                    </td>
                                    <th scope="row">교육장소</th>
                                    <td colspan="3">
                                        {{ edu_plc }}
                                    </td>
                                </tr>
                                <tr>
                                    <th scope="row">교육강사</th>
                                    <td>
                                        {{ edu_instr }}
                                    </td>
                                    <th scope="row">교육방법</th>
                                    <td colspan="3">
                                        {{ edu_mthd }}
                                    </td>
                                </tr>
                                <tr>
                                    <th scope="row">교육내용</th>
                                    <template v-if="edu_se_cd == 'EA02'">
                                        <td>
                                            <p v-html="cmmn_cn"></p>
                                        </td>
                                        <td :colspan="5">
                                            <p v-html="indiv_cn"></p>
                                        </td>
                                    </template>
                                    <template v-else>
                                        <td colspan="6">
                                            <p v-html="cmmn_cn"></p>
                                        </td>
                                    </template>
                                </tr>
                                <tr>
                                    <th scope="row">교육사진</th>
                                    <td colspan="6">
                                        <imgsfileform :ref="'imgsfileform'" :pass="{id:'hsEdc', mode:'view'}"></imgsfileform>
                                        <!-- <img :src="strg_path" style="width:500px" v-if="strg_path != ''" @error="imageLoadErrors"/> -->
                                    </td>
                                </tr>
                                <tr>
                                    <th scope="row">교육교안</th>
                                    <td colspan="6">
                                        <!-- <p v-for="item in filelist" :key="item">{{ item.orgnl_file_nm }}</p> -->
                                        <ul>
                                            <li v-for="item in filelist" :key="item">
                                                <button class="btn-link" @click="fnFileDown(item)">{{ item.orgnl_file_nm }}</button>
                                            </li>
                                        </ul>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div>
                        <h3>참석자 서명</h3>
                        <table class="table">
                            <caption>참석자</caption>
                            <thead>
                                <tr>
                                    <th scope="col">직책</th>
                                    <th scope="col">이름</th>
                                    <th scope="col">서명</th>
                                    <th scope="col">직책</th>
                                    <th scope="col">이름</th>
                                    <th scope="col">서명</th>
                                </tr>
                            </thead>
                            <tbody>
                                <template v-for="(item,i) in nmpr" :key="i">
                                    <tr v-if="i%2==0">
                                        <template v-if="i%2==0">
                                            <td class="text-center">
                                                {{ nmpr[i].ocpt_detail_nm }}
                                            </td>
                                            <td class="text-center">
                                                {{ nmpr[i].user_nm }}
                                            </td>
                                            <td class="text-center">
                                                <img :src="nmpr[i].strg_path" class="sign_img" v-if="nmpr[i].sign_yn == 'Y' && nmpr[i].strg_path != ''" @error="imageLoadError(i)">
                                            </td>
                                            
                                            <td v-if="i < nmpr.length - 1" class="text-center">
                                                {{ nmpr[i+1].ocpt_detail_nm }}
                                            </td>
                                            <td v-else></td>
                                            <td v-if="i < nmpr.length - 1" class="text-center">
                                                {{ nmpr[i+1].user_nm }}
                                            </td>
                                            <td v-else></td>
                                            <td v-if="i < nmpr.length - 1" class="text-center">
                                                <img :src="nmpr[i+1].strg_path" class="sign_img" v-if="nmpr[i+1].sign_yn == 'Y' && nmpr[i+1].strg_path != ''" @error="imageLoadError(i)">
                                            </td>
                                            <td v-else></td>
                                        </template>
                                    </tr>
                                </template>
                            </tbody>
                        </table>
                    </div>
                    <div class="btn-group btn-right btn-print">
                        <button @click="fnPrint('viewDiv1')" class="btn btn-purple btn-print"><svg class="icon"><use xlink:href="/img/symbol-defs.svg#icon-print"></use></svg>인쇄</button>
                        <a @click="fnBack" href="javascript:;" class="btn btn-white"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-list-back"></use></svg>목록</a>
                    </div>
                </div>
                <div class="approval">
                    <h3>결재 정보</h3>
                    <ul>
                        <li>
                            <a href="#" class="signed">
                                <p>작성자</p>
                                <div class="user_img" id="1">
                                    <img :src="aprvr1_img" class="sign_img" v-if="aprvr1 != ''" @error="imageLoadError1">
                                </div>
                                <span>{{ aprvr1_nm == "" ? "작성자 등록":aprvr1_nm }}</span>
                            </a>
                        </li>
                        <li>
                            <a href="#" :class="[aprvr2_nm && aprvr2_atrz_yn!='Y' ? 'set':null, aprvr2_nm && aprvr2_atrz_yn=='Y' ? 'signed':null]">
                                <p>검토자</p>
                                <div class="user_img" @click="edu_cmpl_yn == 'Y' ? fnmessage('종료된 교육입니다.') : aprvr2 == $store.state.global.userInfo.user_id ? fnAprvrSign(2) : fnmessage('결재 대상이 아닙니다.')">
                                    <img :src="aprvr2_img" class="sign_img" v-if="aprvr2_atrz_yn != 'N'" @error="imageLoadError2">
                                </div>
                                <span>{{ aprvr2_nm == null ? "검토자 등록":aprvr2_nm }}</span>
                            </a>
                        </li>
                        <li>
                            <a href="#" :class="[aprvr3_nm && aprvr3_atrz_yn!='Y' ? 'set':null, aprvr3_nm && aprvr3_atrz_yn=='Y' ? 'signed':null]">
                                <p>현장소장</p>
                                <div class="user_img" id="3" @click="edu_cmpl_yn == 'Y' ? fnmessage('종료된 교육입니다.') : aprvr3 == $store.state.global.userInfo.user_id ? fnAprvrSign(3) : fnmessage('결재 대상이 아닙니다.')" v-bind:style="aprvr3_atrz_yn == 'Y' ? 'background: none;' : ''">
                                    <img :src="aprvr3_img" class="sign_img"  v-if="aprvr3_atrz_yn != 'N'" @error="imageLoadError3">
                                </div>
                                <span>{{ aprvr3_nm == null ? "현장소장 등록":aprvr3_nm }}</span>
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import "es6-promise/auto";
    import Vue from "vue";
    import Axios from "axios";
    import printJS from 'print-js';
    import imgsfileform from '../../../../common/vue/imgsfileform2.vue';
    
    export default {
      data: function() {
        return {
            uid:"",
            bplc_nm:"",
            edu_se_cd:"",
            edu_detail_cd:"",
            bzenty_nm:"",
            edu_dt:"",
            edu_nm_ttl:"",
            edu_plc:"",
            edu_instr:"",
            edu_nm:"",
            cmmn_cn:"",
            indiv_cn:"",
            etc_cn:"",
            spt_cn:"",
            edu_mthd:"",
            cnt:0,
            orgnl_file_nm:"",
            strg_path:"",
            aprvr2_atrz_yn:"",
            aprvr3_atrz_yn:"",
            // test:"/uploadfiles/temp/pwSftmt/b84202308011404501.png",
            test:"",
            list:[],
            nmpr:[],
            aprvr1:"",
            aprvr1_nm:"",
            aprvr1_img:"",
            aprvr2:"",
            aprvr2_nm:"",
            aprvr2_img:"",
            aprvr3:"",
            aprvr3_nm:"",
            aprvr3_img:"",
            edu_cmpl_yn:"",
            filelist:[],
            imgfilelist:[],
        };
      },
      components: {
            'imgsfileform' : imgsfileform,
        },
      mounted: function() {
        let vm = this;
        vm.uid = vm.$route.params.uid;
        vm.edu_se_cd = vm.$route.params.edu_se_cd;
        vm.edu_detail_cd = vm.$route.params.edu_detail_cd;
        // vm.fnInit();
      },
      activated:function(){
        this.fnInit();
      },
      deactivated:function(){
        this.$destroy();
      },
      methods: {
        fnInit:function(){
            let vm = this;
            
            let send = {
                edu_sn:vm.uid,
                edu_se_cd:vm.edu_se_cd,
                edu_detail_cd:vm.edu_detail_cd,
            }

            Axios.post("/selectEduDetail.do",send).then(function(res){
                vm.list = res.data.hsEdList;
                vm.bplc_nm = vm.list[0].bplc;
                vm.edu_se_cd = vm.list[0].edu_se_cd;
                vm.bzenty_nm = vm.list[0].bzenty_nm;
                vm.edu_dt = vm.list[0].edu_dt+' ( '+vm.list[0].edu_bgng_tm +' ~ '+ vm.list[0].edu_end_tm+' )';
                vm.edu_plc = vm.list[0].edu_plc;
                vm.edu_nm_ttl = vm.list[0].edu_nm_ttl;
                
                vm.aprvr1 = vm.list[0].aprvr1;
                vm.aprvr2 = vm.list[0].aprvr2;
                vm.aprvr3 = vm.list[0].aprvr3;
                vm.edu_cmpl_yn = vm.list[0].edu_cmpl_yn;

                vm.aprvr1_nm = vm.list[0].aprvr1_nm;
                vm.aprvr2_nm = vm.list[0].aprvr2_nm;
                vm.aprvr3_nm = vm.list[0].aprvr3_nm;

                vm.aprvr2_atrz_yn = vm.list[0].aprvr2_atrz_yn;
                vm.aprvr3_atrz_yn = vm.list[0].aprvr3_atrz_yn;


                if(vm.list[0].edu_se_cd !='EA04' && vm.list[0].edu_se_cd !='EA05' && vm.list[0].edu_se_cd != 'EA06'){
                    vm.edu_nm = vm.list[0].edu_se_nm + ' : '+ vm.list[0].edu_detail_nm;
                }else{
                    vm.edu_nm = vm.list[0].edu_se_nm;
                }
                
                vm.edu_instr = vm.list[0].edu_instr_nm;
                vm.edu_mthd = vm.list[0].edu_mthd;
                vm.cmmn_cn = vm.list[0].cmmn_cn.replaceAll(/(\n|\r\n)/g,'<br>');
                if(vm.list[0].indiv_cn != "" && vm.list[0].indiv_cn != null){
                    vm.indiv_cn = vm.list[0].indiv_cn.replaceAll(/(\n|\r\n)/g,'<br>');
                }

                vm.cnt = vm.list[0].cnt;
                var imgfilelist = vm.list.filter(item => item.file_se == '2');
                var filelist = vm.list.filter(item => item.file_se == '1');
                // if(filelist.length == 0) alert("교육교안 첨부파일이 없습니다.");
                
                if(vm.list[0].aprvr1_atrz_yn != "N"){
                    vm.aprvr1_img =  vm.list[0].aprvr1_img.charAt()=='/' ? vm.list[0].aprvr1_img : vm.list[0].aprvr1_img.substr(2);
                }
                if(vm.list[0].aprvr2_atrz_yn != "N"){
                    vm.aprvr2_img =  vm.list[0].aprvr2_img.charAt()=='/' ? vm.list[0].aprvr2_img : vm.list[0].aprvr2_img.substr(2);
                }
                if(vm.list[0].aprvr3_atrz_yn != "N"){
                    vm.aprvr3_img =  vm.list[0].aprvr3_img.charAt()=='/' ? vm.list[0].aprvr3_img : vm.list[0].aprvr3_img.substr(2);
                }

                // if(imgfilelist.length != 0){
                //     if(imgfilelist[0].strg_path.charAt()=='/') { 
                //         vm.strg_path = imgfilelist[0].strg_path;
                //     }else{
                //         vm.strg_path = imgfilelist[0].strg_path.substr(2);
                //     }
                // }else{
                //     alert("교육사진 첨부파일이 없습니다.");
                // }
                // console.log(vm.list);
                vm.imgfilelist = [];
                if(imgfilelist.length > 0){
                    for(var i=0; i<imgfilelist.length; i++){
                        vm.imgfilelist.push({strg_path : imgfilelist[i].strg_path, strg_file_nm : ''});
                    }
                }

                vm.filelist = [];
                if(filelist.length > 0){
                    for(var i=0; i<filelist.length; i++){
                        vm.filelist.push({strg_path : filelist[i].strg_path, strg_file_nm : '', orgnl_file_nm: filelist[i].orgnl_file_nm, file_sn: filelist[i].atchmnfl_sn});
                    }
                }
            }).then(function(){
                vm.fntrgtnmpr();
            }).finally(function(){
                vm.$refs.imgsfileform.fnFileLoadList(vm.imgfilelist);
            });
        },
        fntrgtnmpr:function(){
            let vm = this;
            let send = {
                edu_sn:vm.uid,
            }
            Axios.post('/selectEduNmprList.do',send).then(function(res){
                vm.nmpr = res.data.hsEdList;

                for(var i=0; i<vm.nmpr.length; i++){
                    if(vm.nmpr[i].strg_path.charAt()=='/') { 
                        vm.nmpr[i].strg_path = vm.nmpr[i].strg_path;
                    }else{
                        vm.nmpr[i].strg_path = vm.nmpr[i].strg_path.substr(2);
                    }
                }
            })
        },
        fnBack:function(){
            this.$router.push("/");
        },
        fnAprvrSign:function(i){
            let vm = this;

            let send = {
                edu_sn:vm.uid,
                edu_se_cd:vm.edu_se_cd,
                edu_detail_cd:vm.edu_detail_cd,
            }

            if(confirm('결재 하시겠습니까?')){
                Axios.post('/etcHsEdcAprvrUpdate.do',{edu_sn:vm.uid, sn:i}).then(function(){
                    alert('결재를 완료하였습니다.');  
                    vm.fnInit();

                    Axios.post("/selectEduDetail.do", send).then(function(response) {
                        if(response.data.hsEdList[0].aprvr2_nm != null && response.data.hsEdList[0].aprvr2_nm != undefined && response.data.hsEdList[0].aprvr2_nm != ""){
                            if(response.data.hsEdList[0].aprvr2_atrz_yn == "Y" && response.data.hsEdList[0].aprvr3_atrz_yn == "N"){
                                vm.callPushAlarm(response.data.hsEdList[0].aprvr3, 0);
                            } else if(response.data.hsEdList[0].aprvr2_atrz_yn == "Y" && response.data.hsEdList[0].aprvr3_atrz_yn == "Y"){
                                vm.callPushAlarm(response.data.hsEdList[0].aprvr1 + "," + response.data.hsEdList[0].aprvr2 + "," + response.data.hsEdList[0].aprvr3, 1);
                            }
                        } else {
                            if(response.data.hsEdList[0].aprvr3_atrz_yn == "N"){
                                vm.callPushAlarm(response.data.hsEdList[0].aprvr3, 0);
                            } else if(response.data.hsEdList[0].aprvr3_atrz_yn == "Y"){
                                vm.callPushAlarm(response.data.hsEdList[0].aprvr1 + "," + response.data.hsEdList[0].aprvr3, 1);
                            }
                        }
                    });
                })
            }else{
                alert('결재를 취소합니다.');
            }
        },
        callPushAlarm: function(user_id, apprv) {
            let vm = this;
            let link = '/m/main/index.do#/';

            //console.log(' link  ::  ' , link);

            $.ajax({
                type: "post",
                url:"/api/pushSendPerson.do",
                data:{
                    // 제목 및 내용
                    title : apprv == 0 ? "새로운 안전교육이 등록되었습니다." : "안전교육의 결재가 완료되었습니다.",
                    message : "PC에서 확인해주세요.",
                    user_id : user_id,
                    // 클릭 시 이동 화면주소
                    link : link
                }
            });
        },
        fnmessage(text){
            return alert(text);
        },
        fnFileDown:function(item){
            let vm = this;
            let send = {
                menu_se: item.menu_se,
                sn: item.sn,
                file_sn: item.file_sn,
                gbn:'HsEd'
            }
            
            $(".loading").show();
            $("#mask").show();

            Axios.post("/download.do",send,{responseType: "blob",}
            ).then(function(e) {
                const url = window.URL.createObjectURL(new Blob([e.data], { type: e.headers["content-type"] }))
                const link = document.createElement("a")
                link.href = url
                link.download = item.orgnl_file_nm
                link.click()
                window.URL.revokeObjectURL(url)
            }).then(function(){
                $(".loading").hide();
                $("#mask").hide();
            });
                
        },
        fnPrint : function(divName){
            // console.log(this.job_type_no);

            // if(!this.flag){
                printJS({
                    printable:divName,
                    type:'html',
                    css: ['/css/basic.css','/css/print.css'],
                    scanStyles : false,
                });
            // }else{
            //     alert("서명 이미지 및 교육사진을 확인해주세요.");
            // }
            
            
        },
        imageLoadErrors:function(){
            this.strg_path = '';
        },
        imageLoadError:function(i){
            this.nmpr[i].strg_path = '';
            this.nmpr[i+1].strg_path = '';
            // return alert("이미지를 찾을 수 없습니다.");
        },
        imageLoadError1:function(){
            this.aprvr1 = '';
        },
        imageLoadError2:function(){
            this.aprvr2_atrz_yn = 'N';
        },
        imageLoadError3:function(){
            this.aprvr3_atrz_yn = 'N';
        },
      }
    };
</script>