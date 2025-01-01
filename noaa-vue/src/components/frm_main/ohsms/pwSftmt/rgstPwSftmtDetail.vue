<template>
    <div>
        <div class="contents write">
            <div class="btn-group btn-right">
                <button class="btn btn-white" @click="fnDownload();"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-download"></use></svg>다운로드</button>
            </div>
            <div id="viewDiv" class="a4 contents">
                <div>
                    <h3>기본정보</h3>
                    <table class="table horizontal write">
                        <caption>주간안전회의록 등록</caption>
                        <tbody>
                            <tr>
                                <th scope="row"><label>회의명</label></th>
                                <td>
                                    {{ viewModel.data.mtg_nm }}
                                </td>
                                <th scope="row"><label>회의일시</label></th>
                                <td>
                                    {{ viewModel.data.mtg_dt }} {{ viewModel.data.mtg_st_time }} <span v-if="viewModel.data.mtg_st_time != '' || viewModel.data.mtg_ed_time != ''">~</span> {{ viewModel.data.mtg_ed_time }}
                                </td>
                                
                            </tr>
                            <tr>
                                <th scope="row"><label for="">회의장소</label></th>
                                <td colspan="5">{{ viewModel.data.mtg_plc }}</td>
                            </tr>
                            <tr>
                                <th scope="row"><label for="">안건</label></th>
                                <td colspan="5">{{ viewModel.data.mtg_agnd }}</td>
                            </tr>
                            <tr>
                                <th scope="row"><label>첨부</label></th>
                                <td colspan="5">
                                    <ul>
                                        <li v-for="item in viewModel.filelist">
                                            <button class="btn-link" @click="fnFileDown(item)">{{ item.orgnl_file_nm }}</button>
                                        </li>
                                    </ul>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div>
                    <h3>참석자</h3>
                    <table class="table write">
                        <caption>참석자</caption>
                        <thead>
                            <tr>
                                <th scope="col">부서명</th>
                                <th scope="col">팀명</th>
                                <th scope="col">직책</th>
                                <th scope="col">성명</th>
                                <th scope="col">서명</th>
                            </tr>
                        </thead>
                        <tbody v-if="viewModel.atdrnList.length > 0">
                            <tr v-for="item in viewModel.atdrnList" :key="item">
                                <td>{{ item.dept_nm }}</td>
                                <td>{{ item.team_nm }}</td>
                                <td>{{ item.jbttl_nm }}</td>
                                <td>{{ item.user_nm }}</td>
                                <td>
                                    <button v-if="viewModel.userInfo.user_id == item.user_id && item.atdrn_sign_yn == 'N'" @click="fnSign" class="btn btn-small btn-blue" >서명확인</button>
                                    <img v-else-if="item.atdrn_sign_yn == 'Y'" :src="item.uploadImageSrc" style="width: 50px;">
                                </td>
                            </tr>
                        </tbody>
                        <tbody v-else>
                            <tr>
                                <td colspan="5">데이터가 없습니다</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div>
                    <h3>금주 대형/고위험 일정</h3>
                    <table class="table">
                        <caption>금주 대형/고위험 일정</caption>
                        <thead>
                            <tr>
                                <th scope="col" rowspan="2">대상 현장</th>
                                <th scope="col" rowspan="2">위험명</th>
                                <th scope="col" rowspan="2">라이브<br>촬영</th>
                                <th scope="col" rowspan="2">작업 및 위험요소</th>
                                <th scope="col" rowspan="2">작업내용</th>
                                <th scope="colgroup" colspan="7">일정 - {{ viewModel.data.mtg_month }}월 {{ viewModel.data.mtg_week }}주차</th>
                                <th scope="col" rowspan="2">핵심이행사항</th>
                                <th scope="col" rowspan="2" class="w160">점검자</th>
                            </tr>
                            <tr class="calendar_week">
                                <template v-for="(item, i) in viewModel.hrMngmtData.rvwArr" :key="i">
                                    <th scope="col" :class="i==(viewModel.hrMngmtData.rvwArr.length-1) ? 'sun' : (i==(viewModel.hrMngmtData.rvwArr.length-2) ? 'sat' : '')">{{ item }}</th>
                                </template>
                            </tr>
                        </thead>
                        <tbody class="calendar_week">
                            <template v-if="viewModel.hrMngmtData.length > 0">
                                <tr  v-for="(itemA, A) in viewModel.hrMngmtData" :key="A">
                                    <td rowspan="">{{ itemA.bplc_nm }}</td>
                                    <td>{{ itemA.risk }}</td>
                                    <td>-</td>
                                    <td class="text-left">{{ itemA.job_risk_factor }}</td>
                                    <td class="text-left">{{ itemA.job_cn }}</td>
                                    <template v-if="viewModel.hrMngmtData.rvwArr != undefined">
                                        <template v-for="(itemB, B) in viewModel.hrMngmtData.rvwArr" :key="B">
                                            <td>
                                                <div v-for="(itemC, C) in viewModel.rvwData" 
                                                :class="(itemA.bplc_sn == itemC.bplc_sn && itemA.job_plan_sn == itemC.job_plan_sn) ? 
                                                (itemB==Number(itemC.cstrn_bgng_dt.split('-')[2]) ? 'bar x'+itemC.bgng_end_between_days : '') : ''"></div>
                                            </td>
                                        </template>
                                    </template>
                                    <template v-else>
                                        <td colspan="7"></td>
                                    </template>
                                    <td class="text-left">
                                        <ul class="bl_dot">
                                            <li>{{ itemA.atrz_stts }}</li>
                                        </ul>
                                    </td>
                                    <td>{{ itemA.insctr }}</td>
                                </tr>
                            </template>
                            <template v-else>
                                <tr>
                                    <td colspan="14">데이터가 없습니다</td>
                                </tr>
                            </template>
                        </tbody>
                    </table>
                </div>
                <div>
                    <h3>금회 협의사항</h3>
                    <table class="table write">
                        <caption>금회 협의사항</caption>
                        <thead>
                            <tr>
                                <th scope="col" rowspan="2">협의사항</th>
                                <th scope="col" rowspan="2">세부사항</th>
                                <th scope="col" rowspan="2">회신 및 조치기한</th>
                                <th scope="col" rowspan="2">담당부서</th>
                                <th scope="colgroup" :colspan="viewModel.deptSize">조치결과</th>
                            </tr>
                            <tr>
                                <th scope="col" v-for="dept in viewModel.deptList" :key="dept.dept_sn">
                                    {{ dept.dept_nm }}
                                </th>
                            </tr>
                        </thead>
                        <tbody v-if="viewModel.cnsltnList.length > 0">
                            <tr v-for="(data, i) in viewModel.cnsltnList">
                                <td class="text-left">{{ data.cnsltn_mttr }}</td>
                                <td class="text-left">{{ data.detail_mttr }}</td>
                                <td class="text-left">{{ data.rply_nd_actn_term }}</td>
                                <td class="text-left">{{ data.dept_nm }}</td>
                                <td scope="col" class="text-left" v-for="dept in viewModel.deptList" :key="dept.dept_sn">
                                    <template v-if="data.dept_list.findIndex(data => data == dept.dept_sn) > -1">
                                        <p style="white-space: pre-wrap">{{ data.actn_cn_list[data.dept_list.findIndex(data => data == dept.dept_sn)] }}</p>
                                    </template>
                                </td>
                            </tr>
                        </tbody>
                        <tbody v-else>
                            <tr>
                                <td :colspan="4 + viewModel.deptSize">데이터가 없습니다</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div>
                    <h3>회의사진 첨부</h3>
                    <imgsfileform :ref="'imgsfileform'" :pass="{id:'pwSftmt', mode:'view'}"></imgsfileform>
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
                            </tr>
                        </thead>
                        <tbody v-if="viewModel.suggestList.length > 0">
                            <tr v-for="(data, i) in viewModel.suggestList">
                                <td>{{ data.se_nm }}</td>
                                <td>{{ data.cn }}</td>
                                <td>{{ data.actn_rslt }}</td>
                            </tr>
                        </tbody>
                        <tbody v-else>
                            <tr>
                                <td colspan="4">데이터가 없습니다</td>
                            </tr>
                        </tbody>
                    </table>
                </div> 
            </div>
            <div class="btn-group btn-right">
                <router-link to="/" class="btn btn-white"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-list-back"></use></svg>목록</router-link>
            </div>
        </div> 
    </div>    
</template>

<script>
    import "es6-promise/auto";
    import Vue from "vue";
    import Axios from "axios";
    import Common from "../../../../common/js/common.js";
    import imgsfileform from "../../../../common/vue/imgsfileform2.vue";
    
    export default {
        data: function() {
            return {
                viewModel:{
                    data:{},
                    userInfo:{},
                    deptList:[],
                    deptSize: 1,
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
                    hrMngmtData:[
                        {job_month: '', job_week:''}
                    ],
                    rvwData:[],
                },
            };
        },
        components: {
            'imgsfileform' : imgsfileform,
        },
        activated:function(){
            this.fnInit();
        },
        deactivated:function(){
            this.$destroy();
        },
        mounted: function() {
            let vm = this;
            // vm.fnInit();
        },
        methods: {
            fnInit:function(){
                let vm = this;
                vm.viewModel.userInfo = vm.$store.state.global.userInfo;

                let sn = vm.$route.params.sn;

                vm.fnDetail(sn);
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
                    vm.viewModel.hrMngmtData = response.data.HrMngmtDetail;
                    vm.viewModel.rvwData = response.data.HrMngmtDetailRvw;
                    vm.viewModel.deptList = response.data.deptList;
                    vm.viewModel.deptSize = vm.viewModel.deptList.length;

                    vm.$nextTick(function() {
                        vm.$refs.imgsfileform.fnFileLoadList(vm.viewModel.imgfilelist);
                    });

                    if(vm.viewModel.rvwData.length > 0){
                        //주차 날짜 생성..
                        var rvwList = vm.viewModel.rvwData;
                        var frstDayOfWeek = Number(rvwList[0].frstDayOfWeek);
                        var lastDayOfWeek = Number(rvwList[0].lastDayOfWeek);
                        // var rvwArr = [];
                        // for(var ii = frstDayOfWeek; ii <= lastDayOfWeek; ii++) {
                        //     rvwArr.push(ii);
                        // }
                    }
                    
                    if(vm.viewModel.hrMngmtData.length > 0){
                        vm.viewModel.hrMngmtData.rvwArr = vm.viewModel.rvwData[0].bgng_end_between_daysArr;
                    }else{
                        vm.viewModel.data.rvwArr = ['-','-','-','-','-','-','-'];
                    }

                    //서명 가져오기
                    if(vm.viewModel.atdrnList.length > 0) {
                        for(let i=0; i<vm.viewModel.atdrnList.length;i++){
                            if(vm.viewModel.atdrnList[i].strg_path != null){
                                if(vm.viewModel.atdrnList[i].strg_path.charAt()=='/') {       //리눅스 경로때문에 사용
                                vm.viewModel.atdrnList[i].uploadImageSrc = vm.viewModel.atdrnList[i].strg_path + vm.viewModel.atdrnList[i].strg_file_nm;
                                }else{
                                    vm.viewModel.atdrnList[i].uploadImageSrc = vm.viewModel.atdrnList[i].strg_path.substring(2) + vm.viewModel.atdrnList[i].strg_file_nm;
                                }    
                            }
                        }
                    }

                    for(let i=0; i<vm.viewModel.cnsltnList.length; i++){
                        vm.viewModel.cnsltnList[i].dept_list = [];
                        vm.viewModel.cnsltnList[i].actn_cn_list = [];
                        if(vm.viewModel.cnsltnList[i].dept != null && vm.viewModel.cnsltnList[i].dept != undefined){
                            let dept_list = vm.viewModel.cnsltnList[i].dept.split(',');
                            let actn_cn_list = vm.viewModel.cnsltnList[i].actn_cn.split('||');
                            for(let j=0; j<dept_list.length; j++){
                                vm.viewModel.cnsltnList[i].dept_list.push(dept_list[j]);
                                vm.viewModel.cnsltnList[i].actn_cn_list.push(actn_cn_list[j]);
                            }
                        }
                    }
                });
            },
            fnFileDown:function(item){
                let vm = this;
                let send = {
                    file_se: 1,
                    mtg_sn: vm.viewModel.data.mtg_sn,
                    file_sn: item.file_sn,
                    gbn:'pwSftmt'
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
            fnSign: function(){
                let vm = this;
                let send = {
                    mtg_sn: vm.viewModel.data.mtg_sn,
                    user_id: vm.viewModel.userInfo.user_id,
                }

                if(confirm("서명하시겠습니까?")){
                    Axios.post("/updatePwSftmtSign.do", send)
                        .then(function(response) {
                        alert("서명이 완료되었습니다.");
                        vm.fnDetail(vm.viewModel.data.mtg_sn);
                    });    
                }
            },
            fnDownload: function(){
                let vm = this;

                let doc = new jsPDF('p', 'mm', 'a4')

                let a4_cnt = document.getElementsByClassName('a4').length;

                $('#viewDiv.a4').each(function (index, item) {
                    html2canvas(item, {
                        scale: 3
                    }).then(function (canvas) {
                        // 캔버스를 이미지로 변환
                        let imgData = canvas.toDataURL('image/jpeg');

                        let canWidth = canvas.width / 10;
                        let canHeight = canvas.height / 10;

                        let imgWidth = 190; // 이미지 가로 길이(mm) A4 기준
                        let imgHeight = canHeight * imgWidth / canWidth;
                        let margin = 10; // 출력 페이지 여백설정

                        // 첫 페이지 출력
                        if (index != 0) {
                            doc.addPage();
                        }
                        doc.addImage(imgData, 'jpeg', margin, margin, imgWidth, imgHeight);

                        // 파일 저장
                        if (Number(a4_cnt - 1) == index) {
                            doc.save(vm.viewModel.data.mtg_nm + '.pdf');
                        }
                    });
                });
            },
        }
    };
</script>
