<template>
	<modal :pass="{widthObject: 500, popupTitle:'코칭명'}">
		<template v-slot:contents>
			<ul class="tabs state<?=$coach['is_coach_cancel']?1:$measure['state']?>">
				<li class="active"><button data-id="tab1">코칭</button></li>
				<li><button data-id="tab2">조치</button></li>
			</ul>
			<div id="tab1" class="tab-content">
				<div class="photo-area mb10">
					<i class="photo-file-size"><?=$coach_image_info?></i>
					<div class="fileinput-preview">
						<img src="<?=$coach_image?>" alt="이미지">
					</div>
				</div>
				<!-- <? if($latitude && $longitude) { ?> -->
				<div class="map-area"><!--active-->
					<div class="toggle-area">위치보기</div>
					<div id="map" style="width:100%;height:350px;"></div>
				</div>
				<table class="light">
					<caption>코칭</caption>
					<tbody>
						<tr>
							<th scope="row">코칭명</th>
							<td colspan='3'><?=$coach['subject']?></td>
						</tr>
						<tr>
							<th scope="row">진도</th>
							<td class="type<?=get_state_code($coach['uid'])?>"><?=get_state_name($coach['uid'])?></td>
							<th scope="row">코칭유형</th>
							<td><?=$arr_coach_type[$coach['coach_type']]?></td>
						</tr>
						<tr>
							<th scope="row"><?=$arr_code_group[0]?></th>
							<td><?=$coach['check_name']?></td>
							<th scope="row"><?=$arr_code_group[1]?></th>
							<td><?=$coach['accd_name']?></td>
						</tr>
						<tr>
							<th scope="row">AREA</th>
							<td><?=$coach['area_name']?></td>
							<th scope="row">조치부서</th>
							<td><?=$coach['dept_name']?></td>
						</tr>
						<tr>
							<th scope="row">코칭내용</th>
							<td colspan="3" class="tl"><?=nl2br($coach['contents'])?></td>
						</tr>
					</tbody>
				</table>

				<!-- <? if($danger){ ?> -->
				<p class="table-title mt20">위험성평가</p>
				<table class="mt10">
					<caption>위험성평가</caption>
					<tbody>
						<tr>
							<th scope="row" style="width:160px;">위험분류</th>
							<td><?=$danger['danger_type']?></td>
						</tr>
						<tr>
							<th scope="row">위험발생 상황 및 결과</th>
							<td><?=nl2br($danger['contents1'])?></td>
						</tr>
						<tr>
							<th scope="row">현재의 안전보건조치</th>
							<td><?=nl2br($danger['contents2'])?></td>
						</tr>
						<tr>
							<th scope="row">현재위험성</th>
							<td><span class="danger<?=($danger['freq']*$danger['itns'])?>"><?=get_danger_type_text($danger['freq'], $danger['itns'])?></span></td>
						</tr>
						<tr>
							<th scope="row">위험성 감소대책</th>
							<td><?=nl2br($danger['contents3'])?></td>
						</tr>
						<tr>
							<th scope="row">개선후 위험성</th>
							<td><span class="danger<?=($danger['freq2']*$danger['itns2'])?>"><?=get_danger_type_text($danger['freq2'], $danger['itns2'])?></span></td>
						</tr>
					</tbody>
				</table>

			<!--<? if(!isset($readonly)){ ?>
				<? if($type!="search" && $act == "coach"){ ?> -->
				<div class="buttonbox mt10">
					<div class="fr">
						<a href="coach_write.php?uid=<?=$coach['uid']?>" class="btn btn-icon btn-dark"><span class="mi">edit</span>&nbsp;수정</a>
						<a href="javascript:;" class="btn btn-icon btn-danger" onclick="coach_del('<?=$coach['uid']?>', '<?=$coach['subject']?>');"><span class="mi">clear</span>&nbsp;삭제</a>
					</div>
				</div><!-- } buttonbox -->
			<!-- <? } else if($type != "search" && $act == "measure") { ?>
				<? if(!$measure['state']) { ?> -->
				<div class="buttonbox mt10">
					<div class="fr">
						<a href="measure_cancel.php?uid=<?=$uid?>" class="btn btn2 btn-icon btn-secondary"><span class="mi">undo</span>&nbsp;반려</a>
						<a href="measure_write.php?uid=<?=$uid?>" class="btn btn-icon btn-primary"><span class="mi">edit</span>&nbsp;조치등록</a>
					</div>
				</div><!-- } buttonbox -->
			</div><!-- // tab-content -->

			<div id="tab2" class="tab-content">
				<div class="photo-area mb10">
					<i class="photo-file-size"><?=$measure_image_info?></i>
					<div class="fileinput-preview2">
						<img src="<?=$measure_image?>" alt="이미지">
					</div>
					<!-- <? if($measure_file['overlay_json'] && !$measure_file['full_image']) { ?><div class="m-signature-pad measure"></div><? } ?> -->
				</div>
				<table class="light">
					<caption>조치</caption>
					<tbody>
						<!-- <? if($measure['state']==2){ ?> -->
						<tr>
							<th scope="row" class="w100">반려사유</th>
							<td colspan="3"><?=$measure['contents']?></td>
						</tr>
						<!-- <? } else if($coach['is_coach_cancel']){ ?> -->
						<tr>
							<th scope="row" class="w100">반려사유</th>
							<td colspan="3"><?=$coach['cancel_contents']?></td>
						</tr>
						<!-- <? } else { ?> -->
						<tr>
							<th scope="row" class="w100">조치부서</th>
							<td><?=$coach['dept_name']?></td>
						</tr>
						<tr>
							<th scope="row">조치자</th>
							<td><?=get_member_name($measure['memberuid'])?></td>
						</tr>
						<tr>
							<th scope="row">조치유형</th>
							<td><?=$measure['measure_name']?></td>
						</tr>
						<tr>
							<th scope="row">조치일자</th>
							<td><?=convertDatetime($measure['resultdt'], "Y-m-d")?></td>
						</tr>
						<tr>
							<th scope="row">조치내용</th>
							<td colspan="3"><?=nl2br($measure['contents'])?></td>
						</tr>
						<!-- <? if($measure['measure_filename']){
							$file_size = filesize(DATA_PATH."/file/works_file/".$measure['measure_filename']);
						?> -->
						<tr>
							<th scope="row">파일첨부</th>
							<td colspan="3">
								<div class="file_download">
									<img src="/_asset/img/board/icon_filedown.png" alt="파일" class="w30">
									<a href="/file_download.php?uid=<?=$measure['uid']?>" class="ml5"><?=$measure['measure_sourcefile']?>(<?=get_filesize($file_size)?>)</a>
								</div>
							</td>
						</tr>
					</tbody>
				</table>

				<!-- <? if($type!="search" && $coach['is_coach_cancel']) { ?> -->
				<div class="buttonbox mt10">
					<div class="fr">
						<a href="measure_write.php?uid=<?=$measure['uid']?>&is_cancel_type=1" class="btn btn-icon btn-warning"><span class="mi">refresh</span>&nbsp;재조치</a>
					</div>
				</div><!-- } button-area -->
				<!-- <? } else if($type!="search" && $act == "measure"){ ?> -->
				<div class="buttonbox mt10">
					<div class="fr">
						<a href="javascript:;" class="btn btn-icon btn-danger" onclick="measure_del('<?=$measure['uid']?>');"><span class="mi">clear</span>&nbsp;삭제</a>
						<a href="measure_write.php?uid=<?=$measure['uid']?>" class="btn btn-icon btn-primary"><span class="mi">edit</span>&nbsp;수정</a>
					</div>
				</div><!-- } button-area -->
				<!-- <? } else if($type != "search" && $act == "coach") { ?>
				<? if(!$coach['state']) { ?> -->
				<div class="buttonbox mt10">
					<div class="fr">
						<a href="javascript:;" class="btn btn-icon btn-warning" onclick="result_action('2');"><span class="mi">assignment_return</span>&nbsp;반려</a>
						<a href="javascript:;" class="btn btn-icon btn-primary" onclick="result_action('1');"><span class="mi">done</span>&nbsp;완료</a>
					</div>
				</div><!-- } button-area -->
			</div>

			<div class="form-group">
				<label for="register_opinion" class="title"><?=$member['name']?> <?=get_job_name($member['job_uid'])?> - <?=get_dept_name($member['dept_uid'])?></label>
			</div>

			<div class="clearfix">
				<textarea name="comment" rows="3" id="register_opinion" required></textarea>
				<input type="submit" value="의견등록" title="의견등록" class="btn btn-dark mt10" style="width:100%;">
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
