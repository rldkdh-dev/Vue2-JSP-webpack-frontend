<template>
    <modal :pass="{popupTitle: '점검등록'}">
		<template v-slot:contents>
            <div class="btn-group btn-right">
                <button class="btn btn-white" @click="fnDownlaod();"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-download"></use></svg>다운로드</button>
                <button class="btn btn-purple" @click="fnPrint();"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-print"></use></svg>인쇄</button>
            </div>

            <div id="viewDiv" class="print_page">
                <div class="a4 contents">
                    <div>
                        <table class="table horizontal print" id="table">
                            <caption>점검활동 상세</caption>
                            <tbody>
                                <tr>
                                    <th scope="row"><label for="bplc">현장명</label></th>
                                    <td>
                                        {{ viewModel.data.bplc_nm }}
                                    </td>
                                    <td rowspan="3" class="print_title">
                                        <div class="logo">
                                            <div class="logo_img"><img src="/img/logo.png" alt="GS네오텍 로고"></div>
                                            <span>스마트 <strong>안전보건</strong> 솔루션</span>
                                        </div>
                                        <p>점검</p>
                                    </td>
                                </tr> 
                                <tr>
                                    <th scope="row"><label for="">작성자</label></th>
                                    <td>
                                        {{viewModel.data.user_nm}}
                                    </td> 
                                </tr>
                                <tr>
                                    <th scope="row"><label for="">조회일자</label></th>
                                    <td>
                                        {{ date }}
                                    </td> 
                                </tr>
                                <tr>
                                    <th scope="row" class="w180"><label for="">점검유형</label></th>
                                    <td colspan="2">
                                        <ul class="input_wrap">
                                            <li v-for="(item, i) in viewModel.chkTypeList" :key="i">
                                                <label :for="'chck_clsf'+item.CODE">
                                                    <input type="checkbox" :id="'chck_clsf'+item.CODE" v-model="viewModel.data.chck_clsf" :value="item.CODE" disabled>{{ item.CODE_NM }}
                                                </label>
                                            </li>
                                        </ul>
                                    </td>
                                </tr>
                                <!-- <tr v-if = "viewModel.data.chck_clsf.indexOf('REC') > -1 || viewModel.data.chck_clsf.indexOf('FC') > -1" > -->
                                <tr v-if = "viewModel.data.chck_clsf.indexOf('FC') > -1" >
                                    <th scope="row"><label for="">현장팀명</label></th>
                                    <td colspan="2">
                                        {{viewModel.data.bplc_team}}
                                    </td> 
                                </tr>
                                <tr>
                                    <th scope="row"><label for="chck_dt">점검일자</label></th>
                                    <td colspan="2">
                                        {{ viewModel.data.chck_dt|yyyyMMdd }}
                                    </td> 
                                </tr>
                                <tr>
                                    <th scope="row"><label for="">점검항목</label></th>
                                    <td colspan="2">{{viewModel.data.chck_mttr}}</td>
                                </tr>
                                <tr v-if="viewModel.data.chck_clsf.indexOf('JC') !== -1">
                                    <th scope="row"><label for="">허가서 선택</label></th>
                                    <td colspan="2">
                                        {{viewModel.data.job_type_nm}}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div v-if="viewModel.data.chck_clsf.indexOf('FC') > -1">
                        <h3>자율안전점검표</h3>
                        <table class="table horizontal print">
                            <caption>점검활동 등록</caption>
                            <tbody>
                                <tr>
                                    <th scope="row" class="w200"><label for="">확인자</label></th>
                                    <td>
                                        {{ viewModel.data.idfr_nm }}
                                    </td>
                                </tr>
                                <tr>
                                    <td class="text-center" colspan="2">
                                        <img :src="viewModel.data.img_path" onerror="this.src='../../../img/no-img.png'">
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <table class="table print">
                            <caption>자율안전점검표 등록</caption>
                            <thead>
                                <tr>
                                    <th scope="col" rowspan="2">번호</th>
                                    <th scope="col" rowspan="2">구분</th>
                                    <th scope="col" rowspan="2">자율점검항목</th>
                                    <th scope="col" colspan="2">점검결과</th>
                                </tr>
                                <tr>
                                    <th scope="col">적정결과</th>
                                    <th scope="col">조치</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(item,index) in viewModel.itemList">
                                    <td>{{index + 1}}</td>
                                    <template v-if="item.row1 == 'Y'">
                                        <td :rowspan="item.row1_cnt" class="text-left">
                                            {{ item.se_cn }}
                                        </td>
                                    </template>
                                    <td class="text-left">{{ item.artcl_cn }}</td>
                                    <td>
                                        {{ item.chck_rslt == 'Y' ? '적정' : '부적정' }}
                                    </td>
                                    <td class="text-left">
                                        {{ item.actn }}
                                    </td>
                                </tr>
                                <tr>
                                    <th>점검의견</th>
                                    <td colspan="4" class="text-left">{{viewModel.data.chck_opnn}}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <rgstChkSubDetail ref="sub" :pass="{mode: 'popup_view', gbn:'chk'}" v-else></rgstChkSubDetail>
                </div>
            </div>
		</template>
	</modal>
</template>

<script>
    import "es6-promise/auto";
    import Vue from "vue";
    import Axios from "axios";
    import Modal from '../../../popup/modal.vue'
    import printJS from 'print-js'
    import imgsfileform from '../../../../../common/vue/imgsfileform2.vue';
    import common from "../../../../common";
    import rgstChkSubDetail from "../rgstChkSubDetail.vue";

    export default {
        props: ['pass'],
        data: function() {
            return {
                date:'',
                viewModel:{
                    mttrForm: false,
                    data:{
                        chck_clsf: [],
                        chck_rslt: 'G',
                    },
                    userInfo:{},
                    imgfilelist:[],
                    chkTypeList:[],
                    chkRsltList:[],
                    mttrPrgrsList:[],
                },
            };
        },
        components: {
            Modal,
            'imgsfileform' : imgsfileform,
            'rgstChkSubDetail' : rgstChkSubDetail,
        },
        mounted: function() {
            let vm = this;
        },
        methods: {
            fnInit:function(sn){
                let vm = this;
                vm.viewModel.userInfo = vm.$store.state.global.userInfo;

                Modal.methods.fnInit();
                
                vm.nowDate();
                vm.fnDetail(sn);
            },
            fnDetail:function(sn){
                let vm = this;
                let data = {
                    user_id: vm.viewModel.userInfo.user_id, 
                    chck_act_sn: sn,
                }
                Axios.post("/selectChkActDetail.do", data)
                .then(function(response) {
                    vm.viewModel.data = response.data.detail;
                    vm.viewModel.chkTypeList = response.data.chkTypeList;
                    vm.viewModel.chkRsltList = response.data.chkRsltList;
                    
                    if(vm.viewModel.data.chck_clsf.indexOf("FC") == -1){
                        vm.viewModel.mttrPrgrsList = response.data.mttrPrgrsList;
                        
                        //점검 항목 + 파일
                        vm.viewModel.rsltList = response.data.rsltList;
                        vm.viewModel.filelist = response.data.fileList;
                        vm.viewModel.mttrFileList = response.data.mttrFileList;
                    }else{
                        vm.viewModel.itemList = response.data.itemList;

                        vm.viewModel.data.img_path = vm.viewModel.data.img_path.charAt() == '/' ? vm.viewModel.data.img_path : vm.viewModel.data.img_path.substr(2);
                    }
                    
                }).then(function(){
                    
                    if(vm.viewModel.data.chck_clsf.indexOf("FC") == -1){
                        //점검결과 코드 리스트 전달
                        vm.$refs.sub.viewModel.chkRsltList = vm.viewModel.chkRsltList;

                        //점검사항 리스트
                        if(vm.viewModel.rsltList.length > 0){
                            vm.$refs.sub.fnLoadList(vm.viewModel.rsltList, vm.viewModel.filelist, vm.viewModel.mttrFileList);
                        }
                    }
                    
                    //점검등록 체크
                    var arr = vm.viewModel.data.chck_clsf.split(',');
                    vm.viewModel.data.chck_clsf = [];
                    for(let i=0; i<arr.length; i++){
                        vm.viewModel.data.chck_clsf.push(arr[i]);
                    }


                });
            },
            fnPrint : function(){
                printJS({
                    printable:'viewDiv',
                    type:'html',
                    css: ['/css/basic.css','/css/print.css'],
                    scanStyles : false,
                });
            },
            fnDownlaod: function(){
                let vm = this;
                let fileNm = '점검_' + common.fnDateTimeStr(vm.viewModel.data.chck_dt) + '.pdf';   
                var editorData = $("#viewDiv").html();
                
                var linkBasic = document.createElement('link');
                linkBasic.href = '/css/form.css';
                linkBasic.rel = 'stylesheet';
                linkBasic.type = 'text/css';
                document.head.appendChild(linkBasic);

                var hiddenDiv = document.createElement('div');
                hiddenDiv.classList.add("downloadformDiv");
                hiddenDiv.innerHTML = editorData;
                document.body.appendChild(hiddenDiv);

                let chckEls = hiddenDiv.querySelectorAll('input[type="checkbox"]');
                chckEls.forEach(chckEl => {
                    if(vm.viewModel.data.chck_clsf.indexOf(chckEl.value) > -1){
                        chckEl.checked = 'true';
                    }
                });
                
                // let divWrite = hiddenDiv.querySelector('.write');
                // divWrite.style.setProperty('padding-right', '0', 'important');

                $(".loading").show();
                $("#mask").show();
                
                setTimeout(() => {
                    html2pdf().from(hiddenDiv).set({
                        margin: 5,
                        html2canvas: { scale: 3 },
                        jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4'}
                    }).save(fileNm).then((pdf) => {
                        document.body.removeChild(hiddenDiv);
                        document.head.removeChild(linkBasic);
                    }).then(function(){
                        $(".loading").hide();
                        $("#mask").hide();
                    });
                }
                , 1000);
            },
            nowDate(){
                let vm = this;
                let myDate = new Date();
                let wk = myDate.getDay();
                let yy = String(myDate.getFullYear());
                let mm = myDate.getMonth() + 1 < 10? "0" + (myDate.getMonth() + 1): myDate.getMonth() + 1; 
                let dd = String(myDate.getDate() < 10 ? '0' + myDate.getDate() : myDate.getDate());

                vm.date = yy + '-' + mm + '-' + dd;
            },
        }
    };
</script>
