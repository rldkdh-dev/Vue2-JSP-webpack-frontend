<template>
	<modal :pass="{widthObject: 500, popupTitle: subject}">
		<template v-slot:contents>
            <!-- 설문기간 -->
            <div class="date" style="float:right;margin-top: 15px;">
                설문기간 : {{ sdt +' - '+ edt }}
            </div>
            <h3 style="font-size:16px;margin-top:10px;margin-bottom:5px;">참여인원 : {{cnt}}명</h3>

            <div class="tbl_frm01">
                <table class="tablef">
                <tbody v-for="item in list1" :key="item.uid">
                    <tr>
                        <td height=30 colspan="2" style="padding:10px 5px;" title="">
                            {{ item.no +1+'.'+item.question }}
                        </td>
                    </tr>
                    <tr v-if="item.qtype == 's'">
                        <td>
                        <!--
                        <a href="javascript:;" onclick="show_popup('/inc/survey_result_data.php?uid=<?=$row['uid']?>');"><b>답변이 <?=$cnt?>개 있습니다.</b></a>
                        <span class="extext">클릭하시면 [<?=$strtype?>]답변을 보실수 있습니다.</span>
                        -->
                        <b>답변이 {{item.count}}개 있습니다.</b>
                                <!-- <b>답변이 {$optcnt}개 있습니다.</b>";
                                <span class='extext'>클릭하시면 [기타]답변을 보실수 있습니다.</span>"; -->
                        </td>
                    </tr>
                    <tr v-else v-for="items in list2" :key="items.uid">
                        <td v-if="item.no == items.num">
                            <div class="graph2 bar">
                                <span class="">{{ items.no +1+'.'+items.content }}</span>
                                <div v-if="items.count != 0" class="inner-bar" :style="{width: (items.count/items.cnt) * 100+'%'}"></div>
                                <div v-else class="inner-bar" style="width:0%"></div>
                                <span class="val_title">{{ items.count > 0 ? items.count+'('+ (items.count/items.cnt) * 100 +'%)' : '0(0%)' }}</span>
                                <!-- <span class="val_title">{{ items.count+'('+ (items.count/items.cnt) * 100 +'%)' }}</span> -->
                            </div>
                        </td>
                    </tr>
                </tbody>
                </table>
            </div>
		</template>
	</modal>
</template>
<style>
.graph2.bar {position: relative;width: 100%;height: 20px;border-radius: 4px;margin-bottom: 2px;background: #edeff2;}
.graph2.bar span {position: absolute;top: 3px;left: 5px;font-size: 12px;color: #000;}
.graph2.bar span.answer_none {color: #000;}
.graph2.bar span.val_title {display: inline-block;padding: 0 5px;background: #fff;border-radius: 3px;top: 1px;left: auto;right: 2px;color: #000;}
.graph2.bar .inner-bar {height: 100%;border-radius: 4px;background: #55b0ff;}
</style>
<script>
    import "es6-promise/auto";
    import Vue from "vue";
    import Axios from "axios";
    import Modal from './modal.vue'
    
    export default {
        components: {
		     Modal
	    },
      data: function() {
        return {
            list1:[],
            list2:[],
            list3:[],
            subject:"",
            sdt:"",
            edt:"",
            cnt:0
        };
      },
      mounted: function() {

      },
      methods: {
		fnInit: function(id) {
			$("#popupBase").show();
			$("#mask").show();
			this.fnSetContents(id);
		},
		fnSetContents: function(id){
    		let vm = this;

    		let senddata = {
    			mapperId:['survey.selectSurveypopup','survey.selectOptionitemList','survey.selectOptioninfo'],
                uid:id,
    		};
    		Axios.post("/multiList", senddata).then(function(rs) {
                vm.list1 = rs.data.list1;
                vm.list2 = rs.data.list2;
                vm.list3 = rs.data.list3;
                console.log(vm.list3);
                vm.subject = vm.list3[0].subject;
                vm.sdt = vm.list3[0].sdt;
                vm.edt = vm.list3[0].edt;
                vm.cnt = vm.list3[0].cnt;
            });
		},
      }
    };
</script>
