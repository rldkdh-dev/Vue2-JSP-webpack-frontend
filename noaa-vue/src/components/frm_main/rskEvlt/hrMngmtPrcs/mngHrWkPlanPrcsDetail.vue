<template>
    <div>
        <div class="contents write">
            <div>
                <table class="table horizontal">
                    <caption>대형(고)위험 작업관리 상세</caption>
                    <tbody>
                        <tr>
                            <th scope="row" class="w150"><label>위험구분</label></th>
                            <td>{{ viewModel.data.detail.risk_nm }}</td>
                            <th scope="row" class="w150"><label>작업유형</label></th>
                            <td>{{ viewModel.data.detail.job_type_text }}</td>
                            <th scope="row" class="w150"><label>위험명</label></th>
                            <td>{{ viewModel.data.detail.risk }}</td>
                        </tr>
                        <tr>
                            <th scope="row"><label>대상현장</label></th>
                            <td>{{ viewModel.data.detail.bplc_nm }}</td>
                            <th scope="row"><label>일정</label></th>
                            <td>{{ viewModel.data.detail.job_week_dates }}</td>
                            <th scope="row"><label>야간작업 여부</label></th>
                            <td>{{ viewModel.data.detail.job_se == 'Y' ? '유' : '무' }}</td>
                        </tr>
                        <tr>
                            <th scope="row"><label>라이브캠</label></th>
                            <td>{{ viewModel.data.detail.livecam_yn == 'Y' ? '유' : '무' }}</td>
                            <th scope="row"><label>작업위치</label></th>
                            <td class="pre">{{ viewModel.data.detail.job_risk_factor }}</td>
                            <th scope="row"><label>작업내용</label></th>
                            <td class="pre">{{ viewModel.data.detail.job_cn }}</td>
                        </tr>
                        <tr>
                            <th scope="row"><label>핵심이행사항</label></th>
                            <td class="pre" colspan="3">{{ viewModel.data.detail.atrz_stts }}</td>
                            <th scope="row"><label>점검자</label></th>
                            <td>{{ viewModel.data.detail.insctr }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="btn-group btn-right">
                <a href="#/" class="btn btn-white"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-list-back"></use></svg>목록</a>
            </div>
        </div>
    </div>
    </template>
    
    <script>
        import "es6-promise/auto";
        import Vue from "vue";
        import Axios from "axios";
        import board from "../../../../common/js/board";
    
        export default {
            components: {
                'board' : board
            },
            data: function() {
                return {
                    imgsrc:'',
                    viewModel:{
                        userInfo:{},
                        bplc_sn_key:'',
                        job_plan_sn_key:'',
                        data:{
                            detail:{},
                            rvwList:[]
                        }
                    }
                };
            },
            activated:function(){
                this.fnInit();
            },
            deactivated:function(){
                this.$destroy();
            },
            mounted: function() {
                // let vm = this;
    
                //메뉴 타이틀 상세 타이틀 설정(상세,등록,수정)
                //board.fnGetMenuTitle(vm);
                // vm.fnInit();
    
            },
            methods: {
                 fnInit:function() {
                    let vm = this;
                    vm.viewModel.userInfo = vm.$store.state.global.userInfo;
    
                    let sn = vm.$route.params.sn;
                    vm.viewModel.bplc_sn_key = sn.split(',')[0];
                    vm.viewModel.job_plan_sn_key = sn.split(',')[1];
                    vm.fnDetail();
                },
                fnDetail:function(){
                    let vm = this;
    
                    let data = {
                        mapperId_LIST:'HrMngmtPrcs.selectHrWkPlanPrcsDetail',
                        mapperId_RVW:'HrMngmtPrcs.selectHrWkPlanPrcsRvwDetail',
                        bplc_sn_key: vm.viewModel.bplc_sn_key,
                        job_plan_sn_key: vm.viewModel.job_plan_sn_key
                    }
                    
                    Axios.post("/selectHrWkPlanPrcsDetail.do", data).then(function(response) {
                        vm.viewModel.data.detail = response.data.detail[0];
                        vm.viewModel.data.rvwList = response.data.detailRvw;

                        if(vm.viewModel.data.detail.job_type.indexOf('ETC') > -1) {
                            let job_type_etcArr = vm.viewModel.data.detail.job_type.split('\(');
                            vm.viewModel.data.detail.job_nm += job_type_etcArr[1].replace('\)',''); 
                        }
                        
                        //console.log(' detail : ' , vm.viewModel.data.detail);

                        vm.viewModel.data.detail.risk_se = (vm.viewModel.data.detail.risk_se == 'LGZ_RISK') ? '대형' : '고';
                        vm.viewModel.data.detail.job_week_dates = '';
                        $.each(vm.viewModel.data.rvwList, function(idx, item) {
                            if(vm.viewModel.data.detail.job_week_dates != '') 
                                vm.viewModel.data.detail.job_week_dates = vm.viewModel.data.detail.job_week_dates + ', ';
                            vm.viewModel.data.detail.job_week_dates = vm.viewModel.data.detail.job_week_dates + 
                            (item.cstrn_bgng_dt + '~' + item.cstrn_end_dt);
                        });

                    });
                }
            }
        };
    </script>