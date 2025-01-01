 <template>
    <div>
        <div class="contents">
            <div class="divide">
                <div>
                    <div>
                        <h3>기본 정보</h3>
                        <table class="table horizontal write">
                            <caption>액션플랜 등록</caption>
                            <tbody>
                                <tr>
                                    <th scope="row" class="w100 essential">이름</th>
                                    <td>
                                        <input type="text" id="user_name" v-model="viewModel.userInfo.user_name" disabled>
                                    </td>
                                </tr>
                                <tr>
                                    <th scope="row" class="essential"><label for="bplc">현장명</label></th>
                                    <td>
                                        <div class="input_group input_btn">
                                            <input type="text" id="bplc_nm" v-model="viewModel.data.bplc_nm" disabled>    
                                            <input type="hidden" id="bplc" v-model="viewModel.data.bplc_sn">
                                            <button @click="fnPopup();" v-if="viewModel.userInfo.bplc_yn !='Y'"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-search"></use></svg></button>
                                        </div>
                                    </td>                            
                                </tr>
                                <tr>
                                    <th scope="row">직위</th>
                                    <td>
                                        <input type="text" id="jbttl_nm" v-model="viewModel.data.wrtr_dty_type" disabled>
                                    </td>
                                </tr>
                                <!-- <tr>
                                    <th>사번</th>
                                    <td>
                                        <input type="text" id="wrtr_empno" v-model="viewModel.data.wrtr_empno">
                                    </td>
                                </tr>
                                <tr>
                                    <th>직무유형</th>
                                    <td>
                                        <input type="text" id="wrtr_dty_type" v-model="viewModel.data.wrtr_dty_type">
                                    </td>
                                </tr> -->
                            </tbody>
                        </table>
                    </div>
                    <div>
                        <div>
                            <h3>ActionPlan 평가 계획</h3>
                            <div class="table_top btn-right">
                                <button @click.prevent="fnAddActpln()" class="btn btn-light-purple"><svg class="icon"><use xlink:href="/img/symbol-defs.svg#icon-wrap-text"></use></svg>목표추가</button>
                            </div>
                            <table class="table">
                                <caption>안전보건목표 추진계획서 등록</caption>
                                <thead>
                                    <tr>
                                        <th scope="colgroup">View<br>Point</th>
                                        <th scope="colgroup" class="essential">KFS</th>
                                        <th scope="col" class="essential">세부 목표</th>
                                        <th scope="col" class="essential">%</th>
                                        <th scope="col" class="essential">1/4분기</th>
                                        <th scope="col" class="essential">2/4분기</th>
                                        <th scope="col" class="essential">3/4분기</th>
                                        <th scope="col" class="essential">4/4분기</th>
                                        <th scope="col">관리</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(item, i) in viewModel.actplnList" :key="i">
                                        <td id="safety" :rowspan="viewModel.actplnList.length" v-if="i == 0">
                                                안전보건
                                        </td>
                                        <td>
                                            <textarea v-model="item.kfs" @input="fnChange(item.kfs, i)"></textarea>
                                        </td>
                                        <td>
                                            <textarea v-model="item.detail_goal" @input="fnChange2(item.detail_goal, i)"></textarea>
                                        </td>
                                        <td>
                                            <textarea v-model="item.pt" ref="pt" @input="inputNumber($event)" oninput="this.value = this.value.toString().replace(/[^0-9]/g, '').replace(/(^0+)/, '');" maxlength="3"></textarea>                   
                                        </td>
                                        <td>
                                            <textarea v-model="item.one_qu"></textarea>
                                        </td>
                                        <td>
                                            <textarea v-model="item.two_qu"></textarea>
                                        </td>
                                        <td>
                                            <textarea v-model="item.three_qu"></textarea>                            
                                        </td>
                                        <td>
                                            <textarea v-model="item.four_qu"></textarea>
                                        </td>
                                        <td>
                                            <button @click.prevent="fnSelActPln(i)" class="btn btn-icon"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-circle-minus"></use></svg></button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div>
                        <div>
                            <h3>ActionPlan 평가 기준표</h3>
                            <!-- <div class="table_top btn-right">
                                <button @click.prevent="fnAddActpln2()" class="btn btn-light-purple"><svg class="icon"><use xlink:href="/img/symbol-defs.svg#icon-wrap-text"></use></svg>기준추가</button>
                            </div> -->
                            <table class="table">
                                <caption>안전보건목표 평가기준 등록</caption>
                                <thead>
                                    <tr>
                                        <th scope="colgroup" rowspan="2">View<br>Point</th>
                                        <th scope="colgroup" rowspan="2" class="essential">KFS</th>
                                        <th scope="col" rowspan="2" class="essential">세부 목표</th>
                                        <th scope="col" rowspan="2">반기구분</th>
                                        <th scope="col" colspan="5">평가기준</th>
                                        <th scope="col" rowspan="2">관리</th>
                                    </tr>
                                    <tr>
                                        <th scope="col" class="essential">S</th>
                                        <th scope="col" class="essential">A</th>
                                        <th scope="col" class="essential">B</th>
                                        <th scope="col" class="essential">C</th>
                                        <th scope="col" class="essential">D</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <template v-for="(item, i) in viewModel.actplnList2" :key="i">
                                        <tr>
                                            <td :rowspan="Number(viewModel.actplnList2.length) * 2" v-if="i == 0">
                                                안전보건
                                            </td>
                                            <td rowspan="2">
                                                <textarea title="KFS 입력" v-model="item.kfs" disabled></textarea>
                                            </td>
                                            <td rowspan="2">
                                                <textarea title="세부목표 입력" v-model="item.detail_goal" disabled></textarea>
                                            </td>
                                            <td>
                                                상
                                            </td>
                                            <td> 
                                                <textarea title="S" v-model="item.frhfyr_evl_crtr_s"></textarea>
                                            </td>
                                            <td>
                                                <textarea title="A" v-model="item.frhfyr_evl_crtr_a"></textarea>
                                            </td>
                                            <td>
                                                <textarea title="B" v-model="item.frhfyr_evl_crtr_b"></textarea>
                                            </td>
                                            <td>
                                                <textarea title="C" v-model="item.frhfyr_evl_crtr_c"></textarea>
                                            </td>
                                            <td>
                                                <textarea title="D" v-model="item.frhfyr_evl_crtr_d"></textarea>
                                            </td>
                                            <td rowspan="2">
                                                <button @click="fnSelActPln2(i)" class="btn btn-icon"><svg class="icon"><use xlink:href="/img/symbol-defs.svg#icon-circle-minus"></use></svg></button>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                하
                                            </td>
                                            <td>
                                                <textarea title="S1" v-model="item.shyy_evl_crtr_s"></textarea>
                                            </td>
                                            <td>
                                                <textarea title="A1" v-model="item.shyy_evl_crtr_a"></textarea>
                                            </td>
                                            <td>
                                                <textarea title="B1" v-model="item.shyy_evl_crtr_b"></textarea>
                                            </td>
                                            <td>
                                                <textarea title="C1" v-model="item.shyy_evl_crtr_c"></textarea>
                                            </td>
                                            <td>
                                                <textarea title="D1" v-model="item.shyy_evl_crtr_d"></textarea>
                                            </td>
                                        </tr>
                                    </template>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div class="btn-group btn-right">
                        <button @click.prevent="fnRealSave();" class="btn btn-purple"><svg class="icon"><use xlink:href="/img/symbol-defs.svg#icon-post-add"></use></svg>등록</button>
                        <router-link :to="'/'" class="btn btn-white"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-list-back"></use></svg>목록</router-link>
                    </div>
                </div>
                <div class="approval">
                    <h3>결재 정보</h3>
                    <ul>
                        <li class="signed">
                            <a href="javascript:;">
                                <p class="essential">작성자</p>
                                <div class="user_img" id="1">
                                    <img :src="viewModel.data.wrtr_sign">
                                </div>
                                <span>{{ viewModel.data.wrtr_nm == "" ? "작성자 등록":viewModel.data.wrtr_nm }}</span>
                            </a>
                        </li>
                        <li :class="[viewModel.data.dcsnr != '' && viewModel.data.dcsnr_sign_yn != 'Y' ? 'set' : viewModel.data.dcsnr != '' && viewModel.data.dcsnr_sign_yn=='Y' ? 'signed' : null]"  @click="fnAprvrpopup('dcsnr')">
                            <a href="javascript:;">
                                <p class="essential">현장소장</p>
                                <div class="user_img" id="3">
                                    <img :src="viewModel.data.dcsnr_sign" v-bind:style="viewModel.data.dcsnr_sign_yn != 'Y' ? 'display: none;' : ''">
                                </div>
                                <span>{{ viewModel.data.dcsnr_nm == "" ? "현장소장 등록":viewModel.data.dcsnr_nm }}</span>
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <user ref="user" v-if="userPop==true" :pass="{dept_sn: viewModel.userInfo.dept_sn, team_sn: viewModel.userInfo.team_sn, title:'실행담당자', multi:'Y', bplc_yn:'Y', bplc_sn: viewModel.data.bplc_sn}"></user>
        <bplc ref="bplc" v-if="bplcPop==true" :pass="{dept_sn: viewModel.userInfo.dept_sn, team_sn: viewModel.userInfo.team_sn}"></bplc>

        <user ref="aprvr" v-if="aprvrPop==true" :pass="{dept_sn: viewModel.userInfo.dept_sn, team_sn: viewModel.userInfo.team_sn, title:'결재자', bplc_yn:'Y', bplc_sn: viewModel.data.bplc_sn, ocpt_detail_cd:1}"></user>
    </div>
</template>

<script>
    import "es6-promise/auto";
    import Vue from "vue";
    import Axios from "axios";
    import Message, {messageUtil} from "../../../../common/js/message";
    import fromValidation from "../../../../common/js/fromValidation";
    import bplc from "../../popup/bplc_popup.vue";
    import user from "../../popup/user_popup.vue";

    export default {
        components: {
            'bplc' : bplc,
            'user' : user,
        },
        data: function() {
            return {
                bplcPop:false,
                userPop:false,
                aprvrPop:false,
                popIndex: '',
                AprvrGbn:'',
                viewModel:{
                    data:{
                        dcsnr:'',
                        dcsnr_nm:'',
                    },
                    userInfo:{},
                    //추진계획서 리스트
                    actplnList:[{seq:1}],
                    actplnList2:[{seq2:1}],
                    selActplnList:[],
                },
                mode: '',
                isSaved:false,
            };
        },
        mounted: function() {
            let vm = this;
            // vm.fnInit();
        },
        activated:function(){
            this.fnInit();
        },
        deactivated:function(){
            this.$destroy();
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
        methods: {
            fnInit:function(){
                let vm = this; 
                vm.viewModel.userInfo = vm.$store.state.global.userInfo;

                let sn = vm.$route.params.plan_sn;
                
                if(sn != undefined){
                    vm.fnDetail(sn);
                }else{
                    if(vm.$store.state.global.userInfo.bplc_sn != 0){
                        let data = {
                            bplc_sn :  vm.$store.state.global.userInfo.bplc_sn
                        }
                        Axios.post('/selectDcsnrDetail.do', data).then(function(response) {
                            vm.viewModel.data.dcsnr_nm = response.data.detail.dcsnr_nm;
                            vm.viewModel.data.dcsnr = response.data.detail.dcsnr;
                            vm.viewModel.data.dcsnr_sign_yn = 'N';
                            
                            vm.viewModel.data.bplc_sn = vm.viewModel.userInfo.bplc_sn == 0 ? '' : vm.viewModel.userInfo.bplc_sn;
                            vm.viewModel.data.bplc_nm = vm.viewModel.userInfo.bplc_sn == 0 ? '' : vm.viewModel.userInfo.bplc_nm;
                        });
                    }

                    vm.viewModel.data.wrtr_dty_type = vm.viewModel.userInfo.ocpt_detail_nm;
                    vm.viewModel.data.wrtr = vm.$store.state.global.userInfo.user_id;
                    vm.viewModel.data.wrtr_nm = vm.$store.state.global.userInfo.user_name;
                    vm.viewModel.data.wrtr_sign = vm.$store.state.global.userInfo.aprvr_path.charAt() == '/' ? vm.$store.state.global.userInfo.aprvr_path : vm.$store.state.global.userInfo.aprvr_path.substr(2);
                }

                //날짜
                calendarInput();
                // if(sn != undefined && sn != null && sn != ''){
                //     vm.fnDetail(sn);
                    
                // }
            },
            inputNumber(event){
                let vm = this;

                vm.result = event.target.value
                vm.viewModel.sum = 0;
                
                for(let i=0; i<vm.viewModel.actplnList.length; i++){
                    vm.viewModel.sum = vm.viewModel.sum + Number(vm.viewModel.actplnList[i].pt);
                }
            },
            fnChange: function(kfs, i){
                let vm = this;

                vm.viewModel.actplnList2[i].kfs = kfs;
            },
            fnChange2: function(detail_goal, i){
                let vm = this;

                vm.viewModel.actplnList2[i].detail_goal = detail_goal;
            },
            fnDetail: function(sn){
                let vm = this;
                
                let data = {
                    plan_sn: sn
                }
                Axios.post("/selectAtPlDetail.do", data)
                .then(function(response) {
                    vm.viewModel.data = response.data.detail;
                    vm.viewModel.actplnList = response.data.list;
                    vm.viewModel.actplnList2 = response.data.list2;
                    vm.viewModel.sum = 0;
                    for(let i=0; i<vm.viewModel.actplnList.length; i++){
                        vm.viewModel.sum = vm.viewModel.sum + Number(response.data.list[i].pt);
                    }

                    vm.viewModel.data.wrtr_sign = vm.$store.state.global.userInfo.aprvr_path.charAt() == '/' ? vm.$store.state.global.userInfo.aprvr_path : vm.$store.state.global.userInfo.aprvr_path.substr(2);
                    vm.viewModel.data.dcsnr_sign = vm.viewModel.data.dcsnr_sign.charAt() == '/' ? vm.viewModel.data.dcsnr_sign : vm.viewModel.data.dcsnr_sign.substr(2);
                    vm.viewModel.data.dcsnr = response.data.detail.dcsnr;
                    vm.viewModel.data.dcsnr_nm = response.data.detail.dcsnr_nm;
                });
            },
            fnRealSave: function(){
                let vm = this;
                const valiData = [
                ];

                if(!fromValidation(valiData)){
                    return false;
                }

                if(vm.viewModel.data.dcsnr_nm == ''){
                    alert(messageUtil(Message.VALIDATION_REQUIRED, ['결재자 소장']))
                    return false;
                }

                if(vm.viewModel.sum != 100){
                    alert("평가 계획 %의 합은 100이어야 합니다.");
                    return false;
                }

                if(vm.viewModel.actplnList.length > 0){
                    for(let i = 0; i<vm.viewModel.actplnList.length; i++){
                        let item = vm.viewModel.actplnList[i];

                        if(item.kfs == '' || item.kfs == undefined){
                            alert(messageUtil(Message.VALIDATION_REQUIRED, ['KFS']))
                            return false;
                        }else if(item.detail_goal == '' || item.detail_goal == undefined){
                            alert(messageUtil(Message.VALIDATION_REQUIRED, ['세부 목표']))
                            return false;
                        }else if(item.pt == '' || item.pt == undefined){
                            alert(messageUtil(Message.VALIDATION_REQUIRED, ['%']))
                            return false;
                        // }else if(item.one_qu == '' || item.one_qu == undefined){
                        //     alert(messageUtil(Message.VALIDATION_REQUIRED, ['1/4분기']))
                        //     return false;
                        // }else if(item.two_qu == '' || item.two_qu == undefined){
                        //     alert(messageUtil(Message.VALIDATION_REQUIRED, ['2/4분기']))
                        //     return false;
                        // }else if(item.three_qu == '' || item.three_qu == undefined){
                        //     alert(messageUtil(Message.VALIDATION_REQUIRED, ['3/4분기']))
                        //     return false;
                        // }else if(item.four_qu == '' || item.four_qu == undefined){
                        //     alert(messageUtil(Message.VALIDATION_REQUIRED, ['4/4분기']))
                        //     return false;
                        }
                    }
                }

                if(vm.viewModel.actplnList2.length > 0){
                    for(let i = 0; i<vm.viewModel.actplnList2.length; i++){
                        let item = vm.viewModel.actplnList2[i];

                         if(item.kfs == '' || item.kfs == undefined){
                            alert(messageUtil(Message.VALIDATION_REQUIRED, ['KFS']))
                            return false;
                        }else if(item.detail_goal == '' || item.detail_goal == undefined){
                            alert(messageUtil(Message.VALIDATION_REQUIRED, ['세부 목표']))
                            return false;
                        }else if(item.frhfyr_evl_crtr_s == '' || item.frhfyr_evl_crtr_s == undefined){
                            alert(messageUtil(Message.VALIDATION_REQUIRED, ['상반기 S']))
                            return false;
                        }else if(item.frhfyr_evl_crtr_a == '' || item.frhfyr_evl_crtr_a == undefined){
                            alert(messageUtil(Message.VALIDATION_REQUIRED, ['상반기 A']))
                            return false;
                        }else if(item.frhfyr_evl_crtr_b == '' || item.frhfyr_evl_crtr_b == undefined){
                            alert(messageUtil(Message.VALIDATION_REQUIRED, ['상반기 B']))
                            return false;
                        }else if(item.frhfyr_evl_crtr_c == '' || item.frhfyr_evl_crtr_c == undefined){
                            alert(messageUtil(Message.VALIDATION_REQUIRED, ['상반기 C']))
                            return false;
                        }else if(item.frhfyr_evl_crtr_d == '' || item.frhfyr_evl_crtr_d == undefined){
                            alert(messageUtil(Message.VALIDATION_REQUIRED, ['상반기 D']))
                            return false;
                        }else if(item.shyy_evl_crtr_s == '' || item.shyy_evl_crtr_s == undefined){
                            alert(messageUtil(Message.VALIDATION_REQUIRED, ['하반기 S']))
                            return false;
                        }else if(item.shyy_evl_crtr_a == '' || item.shyy_evl_crtr_a == undefined){
                            alert(messageUtil(Message.VALIDATION_REQUIRED, ['하반기 A']))
                            return false;
                        }else if(item.shyy_evl_crtr_b == '' || item.shyy_evl_crtr_b == undefined){
                            alert(messageUtil(Message.VALIDATION_REQUIRED, ['하반기 B']))
                            return false;
                        }else if(item.shyy_evl_crtr_c == '' || item.shyy_evl_crtr_c == undefined){
                            alert(messageUtil(Message.VALIDATION_REQUIRED, ['하반기 C']))
                            return false;
                        }else if(item.shyy_evl_crtr_d == '' || item.shyy_evl_crtr_d == undefined){
                            alert(messageUtil(Message.VALIDATION_REQUIRED, ['하반기 D']))
                            return false;
                        }
                    }
                }

                let data = {
                    reg_id: vm.viewModel.userInfo.user_id,
                    bplc_sn: vm.viewModel.data.bplc_sn,
                    wrtr_empno: vm.viewModel.data.wrtr_empno,
                    wrtr_dty_type: vm.viewModel.data.wrtr_dty_type,
                    wrtr_sign_yn: 'Y',
                    bplc_mngr_sign_yn: vm.viewModel.data.bplc_mngr_sign_yn,
                    list: vm.viewModel.actplnList,
                    list2: vm.viewModel.actplnList2,
                    plan_sn: parseInt(vm.$route.params.plan_sn),
                    wrtr: vm.viewModel.userInfo.user_id,
                    bplc_mngr: vm.viewModel.data.dcsnr,
                };
                
                if(vm.viewModel.data.plan_sn == undefined){
                    if(confirm(Message.CREATE_CONFIRM)){
                        $(".loading").show();
                        $("#mask").show();
                        Axios.post("/insertAtPl.do", data).then(function(response) {
                            if(response.data == 1){
                                vm.isSaved = true;
                                vm.$router.push('/');
                                alert("저장되었습니다.");
                                vm.callPushAlarm(vm.viewModel.data.dcsnr);
                            }
                            
                        }).catch(function(ex) {
                            alert(Message.ERROR);
                        }).finally(function(){
                            $(".loading").hide();
                            $("#mask").hide();
                        });
                    }
                }else{
                    if(vm.viewModel.data.bplc_mngr_sign_yn == 'Y'){
                        alert('이미 현장소장 결재가 완료되어 수정이 불가능합니다.')
                        } else {
                        if(confirm(Message.UPDATE_CONFIRM)){
                            $(".loading").show();
                            $("#mask").show();
                            Axios.post("/updateAtPl.do", data).then(function(response) {
                                vm.isSaved = true;
                                vm.$router.push('/');
                                alert("저장되었습니다.");
                            }).catch(function(ex) {
                                alert(Message.ERROR);
                            }).finally(function(){
                                $(".loading").hide();
                                $("#mask").hide();
                            });
                        }
                    }
                }
            },

            fnPopup: function(){
                let vm = this;
				vm.bplcPop=true;
                vm.userPop=false;
                vm.aprvrPop=false;

				vm.$nextTick(function() {
					if(vm.bplcPop) {
						vm.$refs.bplc.fnInit();
					}
				})
            },
            fnBplcAdd: function(item){
                let vm = this;

                vm.viewModel.data.bplc_sn = item.bplc_sn;
                vm.viewModel.data.bplc_nm = item.bplc_nm;

                vm.viewModel.data.dcsnr = item.mng_user_id == undefined ? null : item.mng_user_id;
                vm.viewModel.data.dcsnr_nm = item.mng_user_nm == undefined ? null : item.mng_user_nm;
            },
            fnUserPopup: function(i) {
                let vm = this;
                vm.popIndex = i;
                
                if(vm.viewModel.data.bplc_sn == null){
                    alert("현장명을 선택해주세요.");
                    return false;
                }else{
                    vm.bplcPop=false;
                    vm.userPop=true;
                    vm.aprvrPop=false;

                    vm.$nextTick(function() {
                        if(vm.userPop) {
                            vm.$refs.user.fnInit();
                        }
                    })
                }
            },
            fnAddActpln: function(){
                let vm = this;

                vm.viewModel.actplnList.push({seq:(vm.viewModel.actplnList[Number(vm.viewModel.actplnList.length)-1].seq) + 1});
                vm.viewModel.actplnList2.push({seq2:(vm.viewModel.actplnList2[Number(vm.viewModel.actplnList2.length)-1].seq2) + 1});                
            },
            fnAddActpln2: function(){
                let vm = this;
                
                vm.viewModel.actplnList2.push({seq2:(vm.viewModel.actplnList2[Number(vm.viewModel.actplnList2.length)-1].seq2) + 1});
            },
            fnSelActPln: function(index){
                let vm = this;

                // vm.viewModel.selActplnList.push({seq:seq});
                
                vm.viewModel.actplnList.splice(index, 1);
                
                if(vm.viewModel.actplnList.length == 0){
                        vm.viewModel.actplnList.push({seq:1});
                    }
                
                vm.viewModel.actplnList2.splice(index, 1);
                
                if(vm.viewModel.actplnList2.length == 0){
                        vm.viewModel.actplnList2.push({seq:1});
                    }
                // vm.fnDelActpln();
            },
            fnSelActPln2: function(index){
                let vm = this;

                // vm.viewModel.selActplnList.push({seq:seq});
                
                vm.viewModel.actplnList.splice(index, 1);
                
                if(vm.viewModel.actplnList.length == 0){
                        vm.viewModel.actplnList.push({seq:1});
                    }

                vm.viewModel.actplnList2.splice(index, 1);
                
                if(vm.viewModel.actplnList2.length == 0){
                        vm.viewModel.actplnList2.push({seq:1});
                    }
            },
            fnDelActpln: function(){
                let vm = this;
                if(vm.viewModel.selActplnList.length > 0 ){
                    for(let i=(vm.viewModel.selActplnList.length-1); i==0; i--){
                        let index = vm.viewModel.actplnList.findIndex(data => data.seq == vm.viewModel.selActplnList[i].seq);

                        vm.viewModel.actplnList.splice(index, 1);                        
                    }

                    //삭제 리스트 초기화
                    vm.viewModel.selActplnList = [];

                    if(vm.viewModel.selActplnList.length == 0){
                        vm.viewModel.actplnList.push({seq:1});
                    }
                }else{
                    alert("삭제할 추진계획서를 선택해주세요.");
                    return false;
                }
            },
            fnAprvrpopup: function(gbn){
                let vm = this;

                vm.AprvrGbn = gbn;      //어느 결재자 정보인지 담아두기.

                vm.bplcPop=false;
                vm.userPop=false;

                if(vm.viewModel.data.bplc_sn == null){
                    alert("현장명을 선택해주세요.");
                    return false;
                }else if(gbn == 'dcsnr' && vm.viewModel.data.dcsnr_sign_yn == 'Y'){
                    alert("소장은 이미 결재를 진행하여 변경할 수 없습니다.");
                }else{
                    vm.aprvrPop=true;
                    vm.$nextTick(function() {
                    if(vm.aprvrPop) {
                        vm.$refs.aprvr.fnInit();
                    }
                })
                }
            },
            fnMemberAdd: function(item){
                let vm = this;
                
                vm.viewModel.data.dcsnr = item.user_id;
                vm.viewModel.data.dcsnr_nm = item.user_nm;

                //결재담당자 팝업 초기화
                vm.aprvrPop = false;
            },
            callPushAlarm: function(user_id) {
                let vm = this;
                let send = {
                    bplc_sn : vm.viewModel.data.bplc_sn
                }
                    
                let link = '/m/main/index.do#/';

                //console.log(' link  ::  ' , link);

                $.ajax({
                    type: "post",
                    url:"/api/pushSendPerson.do",
                    data:{
                        // 제목 및 내용
                        title : "새로운 액션플랜이 등록되었습니다.",
                        message : "PC에서 확인해주세요.",
                        user_id : user_id,
                        // 클릭 시 이동 화면주소
                        link : link
                    }
                });
            }
        }
    };
</script>