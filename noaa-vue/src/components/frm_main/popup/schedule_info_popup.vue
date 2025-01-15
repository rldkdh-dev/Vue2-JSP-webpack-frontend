<template>
	<modal :pass="{widthObject: 500, popupTitle: type +' - '+title}">
		<template v-slot:contents>
            <table class="mt10">
                <tbody>
                <tr>
                    <th class="w80">일정</th>
                    <td>
                        <span>{{ start_date + ' ~ ' + end_date }}</span>
                    </td>
                </tr>
                <tr>
                    <th class="vat">일정내용</th>
                    <td class="tl">
                        <p style="min-height:100px;">{{ contants }}</p>
                    </td>
                </tr>
                <tr>
                    <th>작성자</th>
                    <td class="tl">
                        <span>{{ membername }}</span>
                    </td>
                </tr>
                </tbody>
            </table>
            <div class="buttonbox">
                <a href="javascript:;" class="btn btn-save btn-primary" @click="fnupdate(uid)">수정</a>
                <a href="javascript:;" class="btn btn-danger" @click="fndelete()"><span class="mi">delete</span>삭제</a>
                <a href="javascript:btn_formbox_close();" class="btn btn-cancel">취소</a>
            </div>
		</template>
	</modal>
</template>
<script>
    import "es6-promise/auto";
    import Vue from "vue";
    import Axios from "axios";
    import Modal from './modal.vue'
    Vue.component('modal',Modal);
    
    export default {
      data: function() {
        return {
            list:[],
            type:"",
            title:"",
            memberuid:"",
            membername:"",
            start_date:"",
            end_date:"",
            contants:"",
            uid:"",
        };
      },
      mounted: function() {

      },
      methods: {
        fnInit: function(id) {
			Modal.methods.fnInit();
			this.memberuid = this.$store.state.global.userInfo.memberuid
            
            this.uid = id;
            if(id != undefined && id != "" && id != null){
                this.fnSetContents(id);
            }
		},
		fnSetContents: function(uid){
			let vm = this; 
			let senddata = {
				mapperId : 'workplace.selectScheduleinfolist',
				totalId : 'base.selectdeptTotalCount',
				pageNo: 1, 
				pageSize: 10,  
			    uid: uid,
			};
			Axios.post("/list", senddata).then(function(response) {
				vm.list = response.data.list;

                vm.start_date = vm.list[0].start_date;
                vm.end_date = vm.list[0].end_date;
                vm.contants = vm.list[0].contents;
                vm.membername = vm.list[0].membername;
                vm.type = vm.list[0].type;
                vm.title = vm.list[0].title;
			});
		},
        fnupdate:function(uid){
            let vm = this;
            vm.$parent.fnCalendar(0,uid);
        },
        fndelete:function(){

            Axios.post("/delete", {uid:this.uid,mapperId : 'workplace.scheduledelete'}).then(function(response) {
                window.location.href="/main/schedule"
            });
        }
      }
    };
</script>