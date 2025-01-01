<template>
    <div>
        <div class="contents write">
            <div>
                <table class="table horizontal write">
                    <caption>노사협의체 회의록 등록</caption>
                    <tbody>
                        <tr>
                            <th scope="row" class="w180 essential"><label for="">현장</label></th>
                            <td colspan="2" v-if="userInfo.hdofc_mngr_yn != 'Y'">
                                <div class="input_group">
                                    {{ viewModel.bplc_nm }}
                                </div>
                            </td>
                            <td colspan="2" v-if="userInfo.hdofc_mngr_yn == 'Y'">
                                <div class="input_btn">
                                    <input type="text" id="bplc_nm" v-model="viewModel.bplc_nm" readonly>    
                                    <input type="hidden" v-if="viewModel.bplc_sn" id="bplc" v-model="viewModel.bplc_sn">
                                    <button @click="fnBplcPopup();" v-if="userInfo.hdofc_mngr_yn =='Y'"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-search"></use></svg></button>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row" class="essential"><label for="">회의 일시</label></th>
                            <td>
                                <div class="input_group">
                                    <div class="datepicker_box">
                                        <input type="text" class="datepicker" id="p2" title="회의일시" placeholder="회의일시 선택" readonly>
                                    </div>
                                    <select id="meet_bgn_hour" v-model="viewModel.meet_bgn_hour" class="w80" ref="meet_bgn_hour">
                                        <option value="">선택</option>
                                        <option :value="(i-1 < 10) ? (0+''+(i-1)):(i-1)" v-for="i in 24" :key="i">
                                            {{ (i-1 < 10) ? (0+''+(i-1)) : (i-1)}}시
                                        </option>
                                    </select>
                                    <span>:</span>
                                    <select id="meet_bgn_min" v-model="viewModel.meet_bgn_min" class="w80" ref="meet_bgn_min">
                                        <option value="">선택</option>
                                        <option :value="(i-1 == 0) ? (0+''+(i-1) * 10):((i-1) * 10)" v-for="i in 6" :key="i">
                                            {{ (i-1 == 0) ? (0+''+(i-1) * 10) : ((i-1) * 10) }}분
                                        </option>
                                    </select>
                                    <span>~</span>
                                    <select id="meet_end_hour" v-model="viewModel.meet_end_hour" class="w80" ref="meet_end_hour">
                                        <option value="">선택</option>
                                        <option :value="(i-1 < 10) ? (0+''+(i-1)):(i-1)" v-for="i in 24" :key="i">
                                            {{ (i-1 < 10) ? (0+''+(i-1)) : (i-1)}}시
                                        </option>
                                    </select>
                                    <span>:</span>
                                    <select id="meet_end_min" v-model="viewModel.meet_end_min" class="w80" ref="meet_end_min">
                                        <option value="">선택</option>
                                        <option :value="(i-1 == 0) ? (0+''+(i-1) * 10):((i-1) * 10)" v-for="i in 6" :key="i">
                                            {{ (i-1 == 0) ? (0+''+(i-1) * 10) : ((i-1) * 10) }}분
                                        </option>
                                    </select>
                                </div>
                            </td> 
                        </tr>
                        <tr>
                            <th scope="row" class="essential"><label for="">회의 장소</label></th>
                            <td >
                                <div class="input_group">
                                    <input type="text" v-model="viewModel.mtg_plc">    
                                </div>
                            </td> 
                        </tr>
                        <tr>
                            <th scope="row" class="essential"><label for="">회의 내용</label></th>
                            <td ><textarea id="" rows="15" title="회의 내용" v-model="viewModel.mtg_cn"></textarea></td> 
                        </tr>
                    </tbody>
                </table>
                <div class="table_footer btn-right">
                    <a href="#" class="btn btn-purple" @click="fnSave()" v-if="state != 'detail'"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-post-add"></use></svg>{{state_k}}</a>
                    <router-link to="/" class="btn btn-white"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-list-back"></use></svg>목록</router-link>
                </div>
            </div>
        </div>
        <bplcPopup ref="bplc" v-if="bplcPop==true" :pass="{dept_sn: userInfo.dept_sn, team_sn: userInfo.team_sn}"></bplcPopup>
    </div>
</template>

<script>
    import "es6-promise/auto";
    import Vue from "vue";
    import Axios from "axios";
    import BplcPopup from "../../popup/bplc_popup.vue";
    import Fileform from "../../fileform2.vue";
    
    export default {
        components: {
            BplcPopup, Fileform
        },
        data: function() {
            return {
                userInfo:{},
                bplcPop:false,
                viewModel:{
                    list:{},
                    meet_bgn_hour:'',
                    meet_bgn_min:'',
                    meet_end_hour:'',
                    meet_end_min:'',
                },
                isSaved:false,
            };
        },
        mounted: function() {
            let vt = this;
            let vm = this.viewModel;
            
            vt.userInfo = this.$store.state.global.userInfo,
            vt.uid = window.location.href.split('/').pop();
            vt.state = window.location.href.split('/').reverse()[1];
            calendarInput();
            if(vt.state == 'update' && vt.uid != null){
                vt.state_k = '수정';
                // vt.fnDetail(vt.uid);
            }else{
                vt.state_k = '등록';
                vt.fnInit();
            }
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
        activated:function(){
            this.fnInit();
        },
        deactivated:function(){
            this.$destroy();
        },
        methods: {
            fnInit:function(){
                let vt = this;
                let vm = this.viewModel;
                
                vm.bplc_sn = (vt.userInfo.bplc_sn == 0) ? '' : vt.userInfo.bplc_sn;
                vm.bplc_nm = (vt.userInfo.bplc_sn == 0) ? '' : vt.userInfo.bplc_nm;

                vt.$forceUpdate(); 
            },
            fnDetail:function(value){
                let vt = this;
                let vm = this.viewModel;
                vm.fileList = [];
                vm.actionFileList = [];
                let data = {
                    chck_sn : value
                }
            },
            fnBplcPopup: function(){
                let vt = this;
				vt.bplcPop = true;
				vt.$nextTick(function() {
					if(vt.bplcPop) {
						vt.$refs.bplc.fnInit();
					}
				})
            },
            fnBplcAdd: function(item){
                let vm = this.viewModel;

                vm.bplc_sn = item.bplc_sn;
                vm.bplc_nm = item.bplc_nm;
            },
            fnSave:function(){
                let vt = this;
                let vm = this.viewModel;
                if(!vm.bplc_nm){
                    return alert("현장을 확인해주시기 바랍니다.");
                }
                if(!$(".datepicker").val() || !vm.meet_bgn_hour || !vm.meet_bgn_min || !vm.meet_end_hour || !vm.meet_end_min){
                    return alert("회의일시를 확인해주시기 바랍니다.");
                } 
                if((vm.meet_bgn_hour > vm.meet_end_hour)||((vm.meet_bgn_hour == vm.meet_end_hour)&&(vm.meet_bgn_min > vm.meet_end_min))){
                    return alert("회의 시작시간을 확인해주시기 바랍니다.");
                }
                if(!vm.mtg_plc || !vm.mtg_cn){
                    return alert("회의 장소 및 내용을 입력해주시기 바랍니다.");
                }
                if(confirm(vt.state_k+" 하시겠습니까?")){
                    let data = {
                        //  : (isNaN(vt.uid))? -1:vt.uid,
                        bplc_sn : vm.bplc_sn,
                        mtg_dt : $(".datepicker").val(),
                        mtg_bgn_tm : vm.meet_bgn_hour + ':'+ vm.meet_bgn_min,
                        mtg_end_tm : vm.meet_end_hour + ':'+ vm.meet_end_min,
                        mtg_plc : vm.mtg_plc,
                        mtg_cn : vm.mtg_cn,
                        prgrs_sittn: '1', //진행상황 (1.회의등록 / 2.심의,의결사항 등록 / 3.협의사항 등록 / 4.건의사항 등록 / 5.피드백 등록)
                        reg_id : vt.userInfo.user_id
                    }

                    //수정
                    // if(vt.state == 'update' && (vt.uid != '' && vt.uid != null && vt.uid != undefined)){
                    //     vt.$router.push('/');
                    // }else{
                    // }
                    
                    //등록
                    Axios.post("/insertMauImplAct.do", data).then(function(res){
                        console.log(res);
                        if(res.date != 0){
                            vt.isSaved = true;
                            alert(vt.state_k+" 되었습니다.");
                            vt.$router.push('/');
                        }else{
                            alert(vt.state_k+"이 중단되었습니다.");
                        }
                    }).catch(function(ex) {
                        console.log(ex);
                    });
                }
            }
            
        }
    };
</script>