<template>
    <modal :pass="{popupTitle: pass.title}">
		<template v-slot:contents>
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
                                        <a @click="fnFileDown(item)" style="cursor: pointer;" class="btn-link">{{ item.orgnl_file_nm }}</a>
                                    </li>
                                </ul>
                            </td>
                        </tr>
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
                            <!-- <th scope="colgroup" :colspan="viewModel.deptSize">조치결과</th> -->
                        </tr>
                        <!-- <tr>
                            <th scope="col" v-for="dept in viewModel.deptList" :key="dept.dept_sn">
                                {{ dept.dept_nm }}
                            </th>
                        </tr> -->
                    </thead>
                    <tbody v-if="viewModel.cnsltnList.length > 0">
                        <tr v-for="(data, i) in viewModel.cnsltnList">
                            <td>{{ data.cnsltn_mttr }}</td>
                            <td>{{ data.detail_mttr }}</td>
                            <td>{{ data.rply_nd_actn_term }}</td>
                            <td>{{ data.dept_nm }}</td>
                            <!-- <td scope="col" v-for="dept in viewModel.deptList" :key="dept.dept_sn">
                                <template v-if="data.dept_list.findIndex(data => data == dept.dept_sn) > -1">
                                    {{ data.actn_cn_list[data.dept_list.findIndex(data => data == dept.dept_sn)] }}
                                </template>
                            </td> -->
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
                <h3>조치결과</h3>
                <table class="table write">
                    <caption>조치결과</caption>
                    <tbody v-for="(dept, i) in viewModel.deptList" :key="dept.dept_sn">
                        <tr v-if="i==0">
                            <th colspan="3">조치결과</th>
                        </tr>
                        <tr>
                            <th rowspan="3" class="w100">{{ dept.dept_nm }}</th>
                            <th class="w100">결과</th>
                            <td class="text-left">
                                <template v-for="(data, i) in viewModel.cnsltnList">
                                    <template v-if="data.dept_list.findIndex(data => data == dept.dept_sn) > -1">
                                        {{ data.actn_rslt_list[data.dept_list.findIndex(data => data == dept.dept_sn)] == 'N' ? '미완료' : '완료'}} 
                                    </template>
                                    <template v-else>-</template>
                                </template>
                            </td>
                        </tr>
                        <tr>
                            <th>내용</th>
                            <td class="text-left">
                                <template v-for="(data, i) in viewModel.cnsltnList">
                                    <template v-if="data.dept_list.findIndex(data => data == dept.dept_sn) > -1">
                                        <p style="white-space: pre-wrap">{{ data.actn_cn_list[data.dept_list.findIndex(data => data == dept.dept_sn)] }}</p>
                                    </template>
                                </template>
                            </td>
                        </tr>
                        <tr>
                            <th>첨부</th>
                            <td class="text-left">
                                <ul>
                                    <li v-for="item in viewModel.filelist2.filter(data=> data.sub_sn == dept.dept_sn)">
                                        <a @click="fnFileDown(item)" style="cursor: pointer;" class="btn-link">{{ item.orgnl_file_nm }}</a>
                                    </li>
                                </ul>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </template>
	</modal>
</template>

<script>
    import "es6-promise/auto";
    import Vue from "vue";
    import Axios from "axios";
    import Modal from '../../../popup/modal.vue'
    import Message, {messageUtil} from "../../../../../common/js/message";

    export default {
        props: ['pass'],
        data: function() {
            return {
                viewModel:{
                    data:{},
                    userInfo:{},
                    deptList:[],
                    deptSize: 1,
                    //파일리스트
                    filelist:[],
                    filelist2:[],
                    //협의사항리스트
                    cnsltnList:[{dept:'', dept_nm:'', cnsltn_mttr:'', detail_mttr:'', rply_nd_actn_term:''}],
                },
            };
        },
        components: {
            Modal
        },
        mounted: function() {
            let vm = this;
        },
        methods: {
            fnInit:function(sn, m_sn){
                let vm = this;
                vm.viewModel.userInfo = vm.$store.state.global.userInfo;

                Modal.methods.fnInit();

                vm.fnDetail(sn, m_sn);
            },
            fnDetail: function(sn, m_sn){
                let vm = this;


                let data = {
                    mtg_sn: sn,
                    cnsltn_mttr_sn: m_sn,
                }

                Axios.post("/selectPwSftmtMttr.do", data)
                .then(function(response) {
                    vm.viewModel.data = response.data.detail;

                    vm.viewModel.filelist = response.data.filelist;
                    vm.viewModel.filelist2 = response.data.filelist2;

                    vm.viewModel.cnsltnList = response.data.cnsltnList;
                    vm.viewModel.deptList = response.data.deptList;
                    vm.viewModel.deptSize = vm.viewModel.deptList.length;

                    for(let i=0; i<vm.viewModel.cnsltnList.length; i++){
                        vm.viewModel.cnsltnList[i].dept_list = [];
                        vm.viewModel.cnsltnList[i].actn_cn_list = [];
                        vm.viewModel.cnsltnList[i].actn_rslt_list = [];
                        if(vm.viewModel.cnsltnList[i].dept != null && vm.viewModel.cnsltnList[i].dept != undefined){
                            let dept_list = vm.viewModel.cnsltnList[i].dept.split(',');
                            let actn_rslt_list = vm.viewModel.cnsltnList[i].actn_rslt.split(',');
                            let actn_cn_list = vm.viewModel.cnsltnList[i].actn_cn.split('||');
                            for(let j=0; j<dept_list.length; j++){
                                vm.viewModel.cnsltnList[i].dept_list.push(dept_list[j]);
                                vm.viewModel.cnsltnList[i].actn_rslt_list.push(actn_rslt_list[j]);
                                vm.viewModel.cnsltnList[i].actn_cn_list.push(actn_cn_list[j]);
                            }
                        }
                    }
                });
            },
            fnFileDown:function(item){
                let vm = this;
                let send = {
                    file_se: item.file_se,
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
        }
    };
</script>