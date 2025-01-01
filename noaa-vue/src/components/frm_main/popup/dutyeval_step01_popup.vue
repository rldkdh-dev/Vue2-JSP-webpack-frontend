<template>
	<modal :pass="{widthObject: 500, popupTitle:'직무이행평가'}">
		<template v-slot:contents>
			<div class=" mb10">
				<h2><?=$write['subject']?></h2>
				<p>피평가자 : <?=$state_mb['dept_name']?> <?=$state_mb['job_name']?> <?=$state_mb['name']?></p>
			</div>

			<!-- <? if($name){ ?> -->
			<div class="fr mb10">
				<span>평가일 : <?=$regdt?></span>
				<span><?=$dept_name?></span>
				<span><?=$job_name?></span>
				<span><?=$name?></span>
			</div>
			<!-- <? } ?> -->

			<table id="tbl_checklist" class="">
				<caption>직무이행평가</caption>
				<thead>
					<tr>
						<!--<th scope="col">선택</th>-->
						<th scope="col">항목</th>
						<th scope="col" class="w50">배점</th>
						<th scope="col" class="w60">득점</th>
					</tr>
				</thead>
				<tbody>
					<!-- <?
					$sum = 0;
					foreach($score_list as $row){
						$sum += $row['dpoint'];
					?> -->
					<tr>
						<td class="tl"><?=$row['subject']?></td>
						<td><?=$row['point']?></td>
						<td class="np">
							<select title="득점" class="nb" onchange="ckpoint_change();" <?=!$regdt && $write['eval_memberuid'] == $member['uid']?"":"disabled"?>>
							<!-- <?
							for($i=0; $i<$row['point']; $i++){
								$dpoint = ($i+1);
								echo '<option value="'.$dpoint.'" '.get_selected($dpoint, $row['sc_point']).'>'.$dpoint.'점</option>';
							}
							?> -->
							</select>
						</td>
					</tr>
				</tbody>
				<tfoot>
					<tr>
						<td>합계</td>
						<td>100</td>
						<td><span id="dpoint_sum"><?=$sum?></span></td>
					</tr>
				</tfoot>
			</table>

			<div class="buttonbox mt10">
				<!-- <? if(!$regdt && $write['eval_memberuid'] == $member['uid']) { ?> -->
				<input type="submit" title="평가저장" class="btn btn-primary" value="평가저장">
				<!-- <? } ?> -->
			</div>
		</template>
	</modal>
</template>
<script>
import Axios from 'axios';
import Vue from 'vue'
import Pager from '../../paging.vue'
import Modal from './modal.vue'

export default {
	components: {
		Pager, Modal
	},
	data: function () {
		return {
			viewModel:{
				list:[],
				keyword:"",
				pageNum:0,
				pager: {
					model: {},
					pageNo: 1,
					totalSize: 0,
					rowSize:5,
					blockSize: 5,
					list: [],
					callBack: function (n) {
						this.model.fnSetContents();
					}
				},
			},
		}
	},
	mounted: function () {
		console.log('dept-popup')
	},
	methods: {
		fnInit: function(id) {
			Modal.methods.fnInit();
			this.fnSetContents(id);
		},
		fnSetContents: function(){
			let vt = this;  
			let vm = this.viewModel;  
			let senddata = {
				mapperId : 'base.selectdeptList',
				totalId : 'base.selectdeptTotalCount',
				pageNo: vm.pager.pageNo, 
				pageSize: vm.pager.rowSize,  
				name: vm.keyword 
			};
			Axios.post("/list", senddata).then(function(response) {
				vm.list = response.data.list;
				vm.pager.totalSize = response.data.totalCNT;
				Pager.props = Pager.methods.createPaging(vm.pager, vt, "list");
			});
		},
		fnRowClick : function(item){
			this.$parent.deptuid = item.uid;		
			this.$parent.dept = item.name;
			this.$parent.groupuid = item.group_uid;		
			this.$parent.group = item.group_name;
			
			$('.overlay_mask, .overlay_formbox').hide();
			$('body').removeClass("fix");
			
		},
	}
};
</script>
