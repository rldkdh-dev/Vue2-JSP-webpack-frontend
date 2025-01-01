<template>
	<modal :pass="{widthObject: 500, popupTitle: '안전보건 활동 현황등록'}">
		<template v-slot:contents>
            <input type="hidden" name="uid" value="">
            <input type="hidden" name="qstr" value="">
            <table class="mt10">
                <tbody>
                <tr>
                    <th style="width:120px;">시작일</th>
                    <td>
                        <div class="datepicker_box">
                            <input type="text" id="start_date" name="start_date" class="datepicker" readonly value="">
                        </div>
                    </td>
                </tr>
                <tr>
                    <th>종료일</th>
                    <td>
                        <div class="datepicker_box">
                            <input type="text" id="end_date" name="end_date" class="datepicker" readonly value="">
                        </div>
                    </td>
                </tr>
                <tr>
                    <th>구분</th>
                    <td>
                        <select name="type" id="type" v-model="select_type">
                            <option v-for="item in type" :key="item" :value="item.value">{{ item.name }}</option>
                        </select>
                    </td>
                </tr>
                <tr>
                    <th>제목</th>
                    <td>
                        <input type="text" name="title" class="full" :value=title @input="title = $event.target.value" v-model="title"/>
                    </td>
                </tr>
                <tr>
                    <th>일정내용</th>
                    <td class="tl">
                        <textarea name="contents" class="full h100" :value=contents @input="contents = $event.target.value" v-model="contents"></textarea>
                    </td>
                </tr>
                </tbody>
            </table>

            <div class="buttonbox">
                <input v-if="uid != undefined" type="submit" value="저장" class="btn btn-save btn-primary" @click="fnupdateschedule()">
                <input v-else type="submit" value="저장" class="btn btn-save btn-primary" @click="fninsertschedule()">
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
    import Message, {messageUtil} from "../../../common/message";
	import fromValidation from "../../../common/fromValidation";
    Vue.component('modal',Modal);
    
    export default {
      data: function() {
        return {
            list:[],
            uid:"",
            title:"",
            contents:"",
            type:[
                {value:"", name:"선택"},
                {value:"대관", name:"대관"},
                {value:"회의", name:"회의"},
                {value:"점검", name:"점검"},
                {value:"휴가", name:"휴가"},
                {value:"기타", name:"기타"},
            ],
            select_type:"",
            memberuid:"",
            selectDate:"",
        };
      },
      mounted: function() {

      },
      methods: {
        fnInit: function(date,id) {
			Modal.methods.fnInit();
			this.selectDate = date;
			this.memberuid = this.$store.state.global.userInfo.memberuid
            this.uid = id;
            //데이터가  남아있어서 초기화
            this.select_type = "";
            this.title = "";
            this.contents ="";
            
            this.fnDatepicker();
            if(id != undefined && id != "" && id != null){
                this.fnSetContents(id);
            }
		},
		fnSetContents: function(uid){
			let vm = this; 
			let senddata = {
				mapperId : 'workplace.updateSchedulelist',
				totalId : 'base.selectdeptTotalCount',
				pageNo: 1, 
				pageSize: 10,  
			    uid: vm.uid,
			};
			Axios.post("/list", senddata).then(function(response) {
				vm.list = response.data.list;
                $("#start_date").val(vm.list[0].start_date);
                $("#end_date").val(vm.list[0].end_date);
                vm.select_type = vm.list[0].type;
                vm.title = vm.list[0].title;
                vm.contents = vm.list[0].contents;
			});
		},
        fnDatepicker: function(){
            let vm = this;
            $( "#start_date" ).datepicker({ dateFormat: 'yy-mm-dd' });
            $( "#end_date" ).datepicker({ dateFormat: 'yy-mm-dd' });
            // vm.setNowTimes();
            $("#start_date").val(vm.selectDate);
            $("#end_date").val(vm.selectDate);
        },
        fninsertschedule:function(){
            let vm = this;
            const date = $("#start_date").val().split('-');

            //구분없이 등록되어 필수체크
            const valiData = [
				{id: 'type', type: 'select', title: '구분'},
            ]
            if(fromValidation(valiData) && confirm(Message.CREATE_CONFIRM)) {
                let send={
                    mapperId : 'workplace.insertSchedule' ,
                    memberuid : vm.memberuid,
                    type:vm.select_type,
                    year:date[0],
                    month:date[1],
                    day:date[2],
                    title:vm.title,
                    contents:vm.contents,
                    start_date:$("#start_date").val(),
                    end_date:$("#end_date").val(),
                }
                
                Axios.post("/insert", send).then(function(response) {
                    $('.overlay_mask, .overlay_formbox').hide();
                    $('body').removeClass("fix");
                    window.location.href="/main/schedule"
                });
            };
        },
        fnupdateschedule:function(){
            let vm = this;
            const date = $("#start_date").val().split('-');

            //구분없이 등록되어 필수체크
            const valiData = [
				{id: 'type', type: 'select', title: '구분'},
            ]
            if(fromValidation(valiData) && confirm(Message.UPDATE_CONFIRM)) {
                let send={
                    mapperId : 'workplace.updateSchedule' ,
                    type:vm.select_type,
                    year:date[0],
                    month:date[1],
                    day:date[2],
                    title:vm.title,
                    contents:vm.contents,
                    start_date:$("#start_date").val(),
                    end_date:$("#end_date").val(),
                    uid:vm.uid,
                }
                
                Axios.post("/update", send).then(function(response) {
                    $('.overlay_mask, .overlay_formbox').hide();
                    $('body').removeClass("fix");
                    window.location.href="/main/schedule"
                });
            }
        }
      }
    };
</script>