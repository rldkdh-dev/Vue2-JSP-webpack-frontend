<!-- <template>
  <div>
      <div class="contents">
          <div class="box">
              <h3>선수 등록</h3>
              <div class="divide">
                  <div class="img_area img_upload no-img">
                      <label for="img_upload_01">
                          <input type="file" id="img_upload_01" hidden="">
                      </label>
                  </div>
                  <div>
                      <table class="table horizontal write">
                          <caption>선수 등록</caption>
                          <tbody>
                              <tr>
                                  <th scope="row">이름 [필수]</th>
                                  <td><input type="text" title="이름"></td>
                                  <th scope="row">넘버 [필수]</th>
                                  <td><input type="text" title="넘버"></td>
                              </tr>
                              <tr>
                                  <th scope="row">포지션 [필수]</th>
                                  <td>
                                      <select title="포지션">
                                          <option></option>
                                      </select>
                                  </td>
                                  <th scope="row">수비위치 [필수]</th>
                                  <td>
                                      <select title="수비위치">
                                          <option></option>
                                      </select>
                                  </td>
                              </tr>
                              <tr>
                                  <th scope="row">히트타입 [필수]</th>
                                  <td colspan="3">
                                      <select title="히트타입">
                                          <option></option>
                                      </select>
                                  </td>
                              </tr>
                              <tr>
                                  <th scope="row">사용여부</th>
                                  <td colspan="3"><input type="checkbox" title="사용여부"></td>
                              </tr>
                          </tbody>
                      </table>
                  </div>
              </div>
              <div class="btn-group btn-right"> -->
                <template>

                    <div id="contents">
                        <div class="box">
                            <h3>쿠폰 발급관리 등록</h3>
                            <div>
                                <table class="table horizontal write">
                                    <!-- <caption>쿠폰 발행 정보</caption> -->
                                    <tbody>
                                        <tr>
                                            <th scope="row">발급방법</th>
                                                <td>
                                                    <input type="text" title="발행처" v-model="vm.viewModel.detail.DT_REG">
                                                </td>
                                            <th scope="row">발급수량</th>
                                                <td>
                                                    <input type="text" title="발급수량" v-model="vm.viewModel.detail.DT_REG">
                                                </td>    
                                        </tr>
                                        <tr>
                                            <th scope="row">발급구분</th>
                                                <td>
                                                    <input type="text" title="발급구분" v-model="vm.viewModel.detail.DT_REG">
                                                </td>
                                            <th scope="row">출석회차</th>
                                                <td>
                                                    <input type="text" title="출석회차" v-model="vm.viewModel.detail.DT_REG">
                                                </td>
                                        </tr>
                                        <tr>
                                            <th scope="row">발급기준</th>
                                                <td>
                                                    <input type="text" title="발급기준" v-model="vm.viewModel.detail.DT_REG">
                                                </td>
                                            <th scope="row">발급쿠폰</th>
                                                <td>
                                                    <input type="text" title="발급쿠폰" v-model="vm.viewModel.detail.DT_REG">
                                                </td>
                                        </tr>
                                        <tr>
                                            <th scope="row">출석시작일자</th>
                                                <td>
                                                    <input type="text" title="출석시작일자" v-model="vm.viewModel.detail.DT_REG">
                                                </td>
                                            <th scope="row">출석종료일자</th>
                                                <td>
                                                    <input type="text" title="출석종료일자" v-model="vm.viewModel.detail.DT_REG">
                                                </td>
                                        </tr>
                                        <tr>
                                            <th scope="row">발급시작일자</th>
                                                <td>
                                                    <input type="text" title="발급시작일자" v-model="vm.viewModel.detail.DT_REG">
                                                </td>
                                            <th scope="row">발급종료일자</th>
                                                <td>
                                                    <input type="text" title="발급종료일자" v-model="vm.viewModel.detail.DT_REG">
                                                </td>
                                        </tr>
                                        <tr>
                                            <th scope="row">회원구분</th>
                                                <td>
                                                    <input type="text" title="회원구분" v-model="vm.viewModel.detail.DT_REG">
                                                </td>
                                            <th scope="row">회원등급</th>
                                                <td>
                                                    <input type="text" title="회원등급" v-model="vm.viewModel.detail.DT_REG">
                                                </td>
                                        </tr>                                                                  
                                    </tbody>
                                </table>
                  <router-link to="/" class="btn btn-white">목록</router-link>
                  <button class="btn btn-blue" @click.prevent="fnSave()">등록</button>
              </div>
          </div>
      </div>  
  </template>
  
  <script>
  import 'es6-promise/auto'
  import Vue from 'vue'
  import Axios from 'axios'
  import Xlsx from 'xlsx'
  import pager from "../../../common/vue/admin_paging.vue";
  import Message, {messageUtil} from "../../../common/js/message";
  import excelform from "../../frm_main/excelform.vue";
  import printJS from 'print-js'
  
  Vue.component("pager", pager);
  Vue.config.devtools = true;
  
  export default {
      components: {
          pager,
          'excelform': excelform,
      },
      data: function () {
          return {
              pop:false,
              printPop:false,
              excelDownload: [],
              write: 'N',
              viewModel: {
                  userInfo: {},
                  serachList: {
                      text: "",
                      select_cat: "",
                  },
                  list: [],
              }
          }
      },
      activated:function(){
          calendarInput();
          this.fnInit();
      },
      deactivated:function(){
          this.$destroy();
      },
      mounted: function () {
        let vm = this;
              let sn = vm.$route.params.sn;
      },
      methods: {
          fnInit: function(){
              let vm = this;
              let sn = vm.$route.params.sn;
  
              vm.viewModel.userInfo = vm.$store.state.global.userInfo;
  
              if(sn!='write') {
                  vm.fnList(sn);
              } else {
                  vm.write = 'Y'
              }
          },
          fnList: function (sn) {
              let vm = this;
  
              let send = {
                  st_Coupon: sn,
              };
  
              Axios.post("/getCouponDetail.do", send).then (function (rs) {
                  vm.viewModel.list = rs.data.list;
                  vm.$refs.sdt.value = rs.data.list.dt_Coupon_st;
                  vm.$refs.edt.value = rs.data.list.dt_Coupon_ed;
  
              });
          },
          fnSave: function() {
              let vm = this;
  
              let send = {
                  st_Coupon: vm.viewModel.list.st_Coupon,
                  dt_Coupon_st: vm.$refs.sdt.value,
                  dt_Coupon_ed: vm.$refs.edt.value,
                  user_id: vm.viewModel.userInfo.user_id,
              }
  
              if(vm.write == 'Y') {
                  if(confirm(Message.CREATE_CONFIRM)) {
                      Axios.post("/insertCoupon.do", send).then (function (rs) {
                          if(rs.data == 1) {
                              alert('저장되었습니다.');
                              vm.$router.push('/');
                          }
                      }).catch(function (ex) {
                          alert(Message.ERROR);
                      });
                  }
              } else {
                  if(confirm(Message.UPDATE_CONFIRM)) {
                      Axios.post("/updateCoupon.do", send).then (function (rs) {
                          if(rs.data == 1) {
                              alert('저장되었습니다.');
                              vm.$router.push('/');
                          }
                      }).catch(function (ex) {
                          alert(Message.ERROR);
                      });
                  }
              }
          }
  
      }
  }
  </script>
  