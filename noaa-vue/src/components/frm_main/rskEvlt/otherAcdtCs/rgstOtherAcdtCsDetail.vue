<template>
<div>
    <div class="contents write">
        <div>
            <table class="table horizontal write">
                <caption>타사사고 이력 등록</caption>
                <tbody>
                    <tr>
                        <th scope="row" colspan="2"><label for="">사고명</label></th>
                        <td colspan="2">{{ viewModel.data.ACDNT_NM }}</td>
                    </tr>
                    <tr>
                        <th scope="row" colspan="2"><label for="">발생일시</label></th>
                        <td colspan="2">
                            {{ viewModel.data.OCRN_DT }}
                        </td>
                    </tr>
                    <tr>
                        <th scope="rowgroup" class="w90">사고유형</th>
                        <th scope="row" class="th2 w120"><label for="">인적사고</label></th>
                        <td colspan="2">{{ viewModel.data.HN_ACDNT_TYPE }}</td>
                    </tr>
                    <tr>
                        <th scope="rowgroup" rowspan="2">사고분류</th>
                        <th scope="row" class="th2"><label for="">공종</label></th>
                        <td colspan="2">{{ viewModel.data.ACDNT_CLSF_CFNL_LCLSF }}</td>
                    </tr>
                    <tr>
                        <th scope="row" class="th2"><label for="">기인물</label></th>
                        <td colspan="2">{{ viewModel.data.ACDNT_CLSF_ACDNT_OBJECT_LCLSF }}</td> 
                    </tr>
                    <tr>
                        <th scope="row" colspan="2"><label for="">사고경위</label></th>
                        <td colspan="2">{{ viewModel.data.ACDNT_CRCMSTNCS }}</td>
                    </tr>
                    <tr>
                        <th scope="row" colspan="2"><label for="">사고원인</label></th>
                        <td colspan="2">{{ viewModel.data.ACDNT_CAUSE }}</td>
                    </tr>
                    <tr>
                        <th scope="rowgroup" rowspan="2">피해상황</th>
                        <th scope="row" class="th2"><label for="">사망자수 (명)</label></th>
                        <td>
                            <div class="unit_box input_group">
                                <label for="">내국인:</label>
                                <p>{{ viewModel.data.DMGE_SITTN_DCSC_CNT_NATIVE }}</p>
                                <span class="unit">명</span>
                            </div>
                        </td>  
                        <td>
                            <div class="unit_box input_group">
                                <label for="">외국인:</label>
                                <p>{{ viewModel.data.DMGE_SITTN_DCSC_CNT_FRGNR }}</p>
                                <span class="unit">명</span>
                            </div>
                        </td>   
                    </tr>
                    <tr>
                        <th scope="row" class="th2"><label for="">부상자수 (명)</label></th>
                        <td>
                            <div class="unit_box input_group">
                                <label for="">내국인:</label>
                                <p>{{ viewModel.data.DMGE_SITTN_INJPSN_CNT_NATIVE }}</p>
                                <span class="unit">명</span>
                            </div>
                        </td>  
                        <td>
                            <div class="unit_box input_group">
                                <label for="">외국인:</label>
                                <p>{{ viewModel.data.DMGE_SITTN_INJPSN_CNT_FRGNR }}</p>
                                <span class="unit">명</span>
                            </div>
                        </td>   
                    </tr>
                    <tr>
                        <th scope="row" colspan="2"><label for="">재발방지대책</label></th>
                        <td colspan="2">{{ viewModel.data.RECR_PRVN_CNTRPLN }}</td>
                    </tr>
                    <tr>
                        <th scope="row" colspan="2"><label for="">현장사진</label></th>
                        <td colspan="2">
                            <imgsfileform :ref="'imgsfiles'" :pass="{id:'othersAcdtCs', gbn:'othersAcdtCs', mode:'view'}" @filelist="fnImgFileList" @fileDelete="fnImgFileDelete"></imgsfileform>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div class="table_footer btn-right">
                <!-- <a href="" class="btn btn-purple"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-post-add"></use></svg>등록</a> -->
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
                fileLoadList:[],
                viewModel:{
                    userInfo:{},
                    data:{},
                    pager: {
                        model: {},
                        pageNo: 1,
                        totalSize: 0,
                        rowSize: 10,
                        blockSize: 10,
                        list: [],
                        callBack: function (n) {
                            try{
                                this.model.fnList(n);
                            } catch(e){
                                console.log('callback error  ' + e);
                            }
                        }
                    },
                }
            };
        },
        mounted: function() {
            let vt = this;
            
            vt.userInfo = this.$store.state.global.userInfo,
            vt.uid = window.location.href.split('/').pop();
            
            vt.fnInit(vt.uid);
        },
        activated:function(){
            this.fnInit();
        },
        deactivated:function(){
            this.$destroy();
        },
        methods: {
            fnInit:function(value){
                let vt = this;
                let send = {
                    OTHCMPNY_ACDNT_SN : value
                }
                Axios.post("/selectOtherAcdtCsDetailList.do", send).then(function(response) {
                    console.log(response.data);
                    vt.viewModel.data = response.data.otherAcdtCs;
                    vt.viewModel.data.OCRN_DT = (vt.viewModel.data.OCRN_DT).substring(0,16);

                    vt.fileLoadList = response.data.fileList;
                    vt.$refs.imgsfiles.fnFileLoadList(vt.fileLoadList);
                }).catch(function(ex) {
                    console.log(ex);
                });;

            }
        }
    };
</script>