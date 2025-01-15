<template>
<div>
    <div class="contents write">
        <div>
            <table class="table horizontal write">
                <caption>MSDS 관리 등록</caption>
                <tbody>
                    <tr>
                        <th scope="row" class="w180"><label for="bplc">현장명</label></th>
                        <td>
                            {{ viewModel.data.bplc }}
                        </td>
                    </tr>
                    <tr>
                        <th scope="row"><label for="pic">담당자</label></th>
                        <td>
                            {{ viewModel.data.pic }}
                        </td>
                    </tr>
                    <tr>
                        <th scope="row"><label for="dt">날짜</label></th>
                        <td>
                            {{ viewModel.data.dt }}
                        </td>
                    </tr>
                    <!-- <tr>
                        <th scope="row"><label for="prtc_eqpmnt_nm">보호구 명</label></th>
                        <td>
                            {{ viewModel.data.prtc_eqpmnt_nm }}
                        </td>
                    </tr> -->
                    <tr>
                        <th scope="row"><label for="">첨부</label></th>
                        <td v-if="viewModel.filelist.length > 0">
                            <!-- <fileform @filelist="fnFilelist"  @getFileInfo="fngetFileInfo" :pass="{id:'sc'}" ref="files"></fileform> -->
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
    import dept from "../../popup/dept_popup.vue";
    import fileform from "../../fileform.vue";
    
    export default {
        data: function() {
            return {
                viewModel: {
					scenario: {},
					user: {},
					filelist: [],
					fileGroup: '',
                    deletefileList: [],
                    data:{
                        bplc:'',
                        dt:'',
                        prtc_eqpmnt_nm:'',
                        prtc_eqpmnt_sn:'',
                        pic:'',
                        photo_atchmnfl:'',
                        atchmnfl:'',
                        mng_sn:'',
                        file_sn:'',
                        reg_id:'',
                        user_id:'',
                    }
				}
            };
        },
        components: {
        },
        mounted: function() {
            let vm = this;
            vm.prtc_eqpmnt_sn = vm.$route.params.prtc_eqpmnt_sn;
            vm.viewModel.userInfo = vm.$store.state.global.userInfo;

            vm.fnDetail(vm.prtc_eqpmnt_sn);
        },
        methods: {
            fnDetail: function(prtc_eqpmnt_sn){
				let vm = this;
				let send = {
					prtc_eqpmnt_sn: prtc_eqpmnt_sn,
                    mng_sn:prtc_eqpmnt_sn,
				};
					Axios.post("/detailPrttMngmtList.do",send).then(function(rs) {
                        vm.viewModel.data = rs.data.detail;
                        vm.viewModel.filelist = rs.data.fileList;
                        vm.viewModel.data.dt = rs.data.detail.dt;
                        vm.viewModel.data.bplc = rs.data.detail.bplc;
                        console.log(rs.data.fileList);
                        // vm.$refs.files.fnFileLoadList(vm.viewModel.filelist);
				});
				
			},
            fnFileDown:function(item){
                let vm = this;
                let send = {
                    menu_se: item.menu_se,
                    sn: item.sn,
                    file_sn: item.file_sn,
                    gbn:'rawWk'
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
