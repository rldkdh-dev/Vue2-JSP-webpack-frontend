<template>
	<modal :pass="{widthObject: 500, popupTitle: subject}">
		<template v-slot:contents>
            <p class="table-title">경영검토 개선조치계획 정보</p>
                <table class="mt10">
                    <tbody>
                    <tr>
                        <th class="w150">경영검토 일자</th>
                        <td class="tl">{{ viewModel.tdate }}</td>
                    </tr>
                    <tr>
                        <th>경영검토 내용</th>
                        <td class="tl">{{ viewModel.cat1 }}</td>
                    </tr>
                    <tr>
                        <th>조치부서</th>
                        <td class="tl">{{ viewModel.dept_name }}</td>
                    </tr>
                    </tbody>
                </table>

            <p class="table-title mt20">조치내용 등록</p>
                <table class="mt10">
                    <tbody>
                    <tr>
                        <th>조치담당자</th>
                        <td>{{ viewModel.improvement_name }}</td>
                    </tr>
                    <tr>
                        <th style="width:120px;">조치예정일</th>
                        <td class="tl" style="padding: 10px 5px 5px;">
                            <div class="datepicker_box w200">
                                <input type="text" id="measure_date" name="measure_date" class="datepicker" readonly value="">
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <th>조치내용 등록</th>
                        <td class="tl" style="padding:4px;">
                            <textarea name="contents2" class="full" style="resize:vertical;height:150px;" v-model="viewModel.cat2" @input="viewModel.cat2 = $event.target.value"></textarea>
                        </td>
                    </tr>
                    </tbody>
                </table>

            <p class="table-title mt20">첨부</p>
                <table class="mt10">
                    <tbody>
                    <tr>
                        <td>
                            <fileform @filelist="fnFilelist" :pass="{id:'sc'}" ref="files"></fileform>
                        </td>
                    </tr>
                    </tbody>
                </table>

            <div class="buttonbox">
                <input type="submit" value="저장" class="btn btn-save btn-primary" @click="fnupdate()">
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
    import Fileform from '../fileform.vue'

    export default {
       components: {
		    Modal,
            'fileform': Fileform
	  },
      data: function() {
        return {
            subject : "경영검토 개선조치계획 조치내용 등록",
            viewModel:{
                list:[],
				filelist: [],
				fileGroup: '',
                uid:"",
                cat1:"",
                cat2:"",
                tdate:"",
                dept_name:"",
                improvement_name:"",
            },
        };
      },
      mounted: function() {

      },
      methods: {
		fnInit: function(id) {
			$("#popupBase").show();
			$("#mask").show();
            $("#measure_date").datepicker({ dateFormat: "yy-mm-dd" });
			this.fnSetContents(id);
		},
		fnSetContents: function(id){
    		let vm = this;
    		let senddata = {
    			mapperId:"act.selectqmsimprplanpopup",
                uid:id,
    		};
    		Axios.post("/detail", senddata).then(function(rs) {
                vm.viewModel.list = rs.data;

                vm.viewModel.uid = vm.viewModel.list[0].uid;
                vm.viewModel.cat1 = vm.viewModel.list[0].cat1;
                vm.viewModel.cat2 = vm.viewModel.list[0].cat2;
                vm.viewModel.tdate = vm.viewModel.list[0].tdate;
                $("#measure_date").val(vm.viewModel.list[0].regdt);
                vm.viewModel.dept_name = vm.viewModel.list[0].dept_name;
                vm.viewModel.improvement_name = vm.viewModel.list[0].improvement_name;
                if(vm.viewModel.list[0].measure_file_grp_id != null){
                    vm.$refs.files.fnFileLoad(vm.viewModel.list[0].measure_file_grp_id);
                }
            });
		},
		fnFilelist: function(vm) {
			this.viewModel.filelist = vm.filelist;
			this.viewModel.fileGroup = vm.fileGroup;
		},
        fnupdate:function(){
            
            let vm = this;

            let send ={
                mapperId:"updateqmsimprpopup",
                uid:vm.viewModel.uid,
                cat2:vm.viewModel.cat2,
                regdt:$("#measure_date").val(),
                measure_file_grp_id: vm.viewModel.fileGroup,
            }

            Axios.post("/update",send)
            .then(function(res){
                if(vm.viewModel.fileGroup!='') {
                    vm.$refs.files.fnInsertFile()
                }
                
                btn_formbox_close();
                vm.$parent.fnGetSelectList();
            })
        }
      }
    };
</script>