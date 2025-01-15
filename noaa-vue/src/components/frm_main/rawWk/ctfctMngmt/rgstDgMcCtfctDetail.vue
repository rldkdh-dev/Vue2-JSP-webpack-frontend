<template>
    <div>
        <div class="contents write">
			<div>
                <table class="table horizontal write">
                    <caption>건의사항 상세</caption>
                    <tbody>
                        <tr>
                            <th scope="row" class="w180"><label for="bplc">현장</label></th>
                            <td>
                                {{ viewModel.data.bplc_nm }}
                            </td>
                        </tr>
                        <tr>
                            <th scope="row"><label for="">분류</label></th>
                            <td v-if="viewModel.data.crtfct_se == 1">
                                유해위험기계기구
                            </td>
                            <td v-else-if="viewModel.data.crtfct_se == 2">
                                보호구
                            </td>
                            <td v-else>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row"><label for="">작성자</label></th>
                            <td>
                                {{ viewModel.data.jbttl_nm }} {{ viewModel.data.reg_nm }}
                            </td>
                        </tr>
                        <tr>
                            <th scope="row"><label for="">비고</label></th>
                            <td>
                                {{viewModel.data.rmrk}}
                            </td>
                        </tr>
                        <tr>
                            <th scope="row"><label for="">첨부</label></th>
                                <td v-if="viewModel.filelist.length > 0">
                                <ul>
                                    <li v-for="item in viewModel.filelist">
                                        <button class="btn-link" @click="fnFileDown(item)">{{ item.orgnl_file_nm }}</button>
                                    </li>
                                </ul>
                                </td>
                                <td v-else>
                                    첨부된 파일이 없습니다.
                                </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="table_footer btn-right">
                <router-link :to="'/'" class="btn btn-white"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-list-back"></use></svg>목록</router-link>
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
        data: function() {
            return {
                viewModel:{
                    filelist:[],
                    data:{
                        crtfct_se: '',
                        clsf_cd: '',
                        bplc_nm:'',
                        bplc_sn:'',
                        crtfct:'',
                        rmrk:'',
                        reg_nm:'',
                        jbttl_nm:'',
                    },
                    rsltList:[],
                    userInfo:{},
                },
            };
        },
        mounted: function() {
            let vm = this;
            vm.fnInit();
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

                //현장 여부 체크 'y'면 현장명 고정
                if(vm.viewModel.user.bplc_yn == 'Y'){
                    vm.viewModel.data.bplc_sn = vm.viewModel.user.bplc_sn;
                    vm.viewModel.data.bplc_nm = vm.viewModel.user.bplc_nm;
                }
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
				});
				
			},
            fnFileDown:function(item){
                let vm = this;
                let send = {
                    menu_se: item.menu_se,
                    sn: vm.$route.params.crtfct_sn,
                    file_sn: item.file_sn,
                    gbn:'rgstDgMcCtfct'
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