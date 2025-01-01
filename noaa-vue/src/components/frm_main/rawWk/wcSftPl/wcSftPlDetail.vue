<template>
<div>
    <div class="contents write">
        <div>
            <table class="table horizontal">
                <caption>기상변화 안전대책 상세</caption>
                <tbody>
                    <tr>
                        <th scope="row" class="w180"><label for="wether_type_text">기상유형</label></th>
                        <td>{{ viewModel.data.wether_type_text }}</td>
                    </tr>
                    <tr>
                        <th scope="row"><label for="reg_bgng_day">등록기간</label></th>
                        <td>{{ viewModel.data.reg_bgng_day }} ~ {{ viewModel.data.reg_end_day }}</td>
                    </tr>
                    <tr>
                        <th scope="row"><label for="reg_id">등록자</label></th>
                        <td>{{ viewModel.data.reg_id }}</td>
                    </tr>
                    <tr>
                        <th scope="row"><label for="sndng_dt">알림설정</label></th>
                        <td>
                            <template v-for="(item, index) in viewModel.ntcnList" :key="index">
                            {{ (index != 0) ? (', '+item.SNDNG_DT) : item.SNDNG_DT}}
                            </template>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row"><label for="ttl">제목</label></th>
                        <td>{{ viewModel.data.ttl }}</td>
                    </tr>
                    <tr>
                        <th scope="row"><label for="bplcNm">알림 등록 현장</label></th>
                        <td>{{ viewModel.bplcNm }}</td>
                    </tr>
                    <tr>
                        <th scope="row"><label for="">안내문</label></th>
                        <td>{{ viewModel.data.gdcc }}</td>
                    </tr>
                    <tr>
                        <th scope="row"><label for="">첨부</label></th>
                        <td>
                            <ul>
                                <li v-for="item in viewModel.filelist">
                                    <button class="btn-link" @click="fnFileDown(item)">{{ item.orgnl_file_nm }}</button>
                                </li>
                            </ul>
                        </td>
                    </tr>
                </tbody>
            </table>
            
            <div class="table_footer btn-right">
                <router-link to="/" class="btn btn-white"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-list-back"></use></svg>목록</router-link>
            </div>
        </div>
    </div>
    <dept ref="dept" v-if="deptPop==true" :pass="{group_id: viewModel.userInfo.user_group_id}"></dept>
</div>
</template>

<script>
    import "es6-promise/auto";
    import Vue from "vue";
    import Axios from "axios";
    //import dept from "../../popup/dept_popup.vue";
    //import fileform from "../../../../common/vue/fileform";
    //import chmcl from './popup/chmcl.vue'
    import board from "../../../../common/js/board";
    
    export default {
        data: function() {
            return {
                viewModel:{
                    data:{},
                    bplcNm:[],
                    userInfo:{},
                    filelist:[],
                    ntcnList:[]
                }
            };
        },
        components: {
        //     'chmcl': chmcl
            'board' : board
        },
        mounted: function() {
            let vm = this;

            //메뉴 타이틀 상세 타이틀 설정(상세,등록,수정)
            ////board.fnGetMenuTitle(vm);

            let sn = vm.$route.params.sn;

            vm.viewModel.userInfo = vm.$store.state.global.userInfo;

            vm.fnDetail(sn);
        },
        methods: {
            fnDetail:function(sn) {
                let vm = this;
                let data = {
                    isUser: false,
                    user_roles: vm.viewModel.userInfo.user_roles,
                    user_type_code: vm.viewModel.userInfo.user_type_code,
                    safe_cntrpln_sn: sn
                }

                Axios.post("/selectWcSftPlDetail.do", data).then(function(response) {
                    vm.viewModel.data = response.data.detail[0];

                    $.each(response.data.detail,function(idx, item) {
                        let comma = ', ';
                        if(idx == 0) comma = '';

                        vm.viewModel.bplcNm += (comma + item.bplc_nm);
                    });
                    vm.viewModel.filelist = response.data.fileList;
                    vm.viewModel.ntcnList = response.data.ntcnList;

                    //console.log(' response : ' , response );
            });

        },
        fnFileDown:function(item){
			let vm = this;
			let send = {
                gbn: 'wcsftpl',
				safe_cntrpln_sn: item.safe_cntrpln_sn,
				orgnl_file_nm: item.orgnl_file_nm
			}

            $(".loading").show();
            $("#mask").show();
            
			Axios.post("/download.do",send,{responseType: "blob",}).then(function(e) {
				const url = window.URL.createObjectURL(new Blob([e.data], { type: e.headers["content-type"] }));
				const link = document.createElement("a");
				link.href = url;
				link.download = item.orgnl_file_nm;
				link.click();
				window.URL.revokeObjectURL(url);
			}).then(function(){
                $(".loading").hide();
                $("#mask").hide();
            });
				
        }
        }
    };
</script>
