<template>
	<modal :pass="{widthObject: 800, popupTitle: '작업허가서 정보'}">
		<template v-slot:contents>
			<div class="content-area res danger">
				<p class="table-title">작업허가서 정보</p>
				<table class="mt10">
					<tbody>
					<tr>
						<th class="w120">작업명</th>
						<td colspan="3">{{item.title}}</td>
					</tr>
					<tr>
						<th>허가서 번호</th>
						<td colspan="3">{{item.docno}}</td>
					</tr>
					<tr>
						<th>작업 수행일</th>
						<td colspan="3">{{item.sdt}} {{item.stime}} ~ {{item.edt}} {{item.etime}}</td>
					</tr>
					<tr>
						<th>설비명</th>
						<td colspan="3">{{ item.plant }}</td>
					</tr>
					<tr>
						<th>발행부서</th>
						<td>{{item.s_dept1_nm}}</td>
						<td colspan="2">
							<b style="font-weight:bold;">
								<template v-if="item.step >= 1" >
									승인완료
								</template>
								<template v-else>
									승인대기
								</template>
							</b>
						</td>
					</tr>
					<tr>
						<th>소관부서</th>
						<td>{{item.s_dept2_nm}}</td>
						<td colspan="2">
							<b style="font-weight:bold;">
								<template v-if="item.step >= 2" >
									승인완료
								</template>
								<template v-else>
									승인대기
								</template>
							</b>
						</td>
					</tr>
					<tr>
						<th>안전부서</th>
						<td>{{item.s_dept3_nm}}</td>
						<td colspan="2">
							<b style="font-weight:bold;">
								<template v-if="item.s_dept3_nm != null">
									<template v-if="item.step >= 3" >
										승인완료
									</template>
									<template v-else>
										승인대기
									</template>
								</template>
							</b>
						</td>
					</tr>
					<tr>
						<th>작업완료</th>
						<td colspan="3">
							<b style="font-weight:bold;">
								<template v-if="item.step >= 4" >
									작업완료
								</template>
								<template v-else >
								</template>
							</b>
						</td>
					</tr>
					<tr>
						<th>작업자 투입 인력</th>
						<td colspan="3">{{item.pcount}}명</td>
					</tr>
					<tr>
						<th>협력업체명</th>
						<td colspan="3">{{item.partner}}</td>
					</tr>
					<tr>
						<th>유해위험물질</th>
						<td colspan="3">{{item.hzrds_sbstn}}</td>
					</tr>
					<tr>
						<th>비상대피소</th>
						<td colspan="3">{{item.exit_name}}</td>
					</tr>
					</tbody>
				</table>

				<p class="table-title mt20">참조파일</p>
				<table class="mt10">
				<thead>
				<tr>
					<!--<th>선택</th>-->
					<th>제목</th>
					<th class="w60">타입</th>
					<th class="w80">용량</th>
					<th class="w110">등록날짜</th>
					<th class="w80">다운로드</th>
				</tr>
				</thead>
				<tbody>
					<template v-if="fileList.length > 0">
						<tr v-for="(item,index) in fileList">
							<td scope="row">{{item.file_title}}</td>
							<td>
								<a :class="item.file_ext+'_icon'">{{ item.file_ext }}</a>
							</td>
							<td>{{item.file_size}}</td>
							<td>{{item.create_date}}</td>
							<td>
								<a href="" class="btn btn-icon btn-info2" value="item.uid" @click.prevent="fnRowClick(item.file_seq)"><span class="mi">file_download</span></a>
							</td>
						</tr>
					</template>					
					<template v-else>
						<tr><td colspan="5" class="tc">데이터가 없습니다.</td></tr>
					</template>
				</tbody>
				</table>
			</div>
		</template>
	</modal>
</template>
<script>
import Axios from 'axios';
import Vue from 'vue'
import Common from '../../common.js';
import Pager from '../../paging.vue'
import Modal from './modal.vue'

export default {
	components: {
		Pager, Modal
	},
	data: function () {
		return {
			uid:'',
			item:{},
			fileList:[],
		}
	},
	mounted: function () {
	},
	methods: {
		fnInit: function(uid){
			let vm = this;
			vm.uid = uid;
			Modal.methods.fnInit();
			vm.fnDetail();
		},
		fnDetail: function(){
			let vm = this;
			
			let data = {
				mapperId: ['ptw.selectPtwList','ptw.selectPtwFilesList'],
				uid: vm.uid,
				fileInfo:"Y"
			};
			Axios.post("/multiList",data).then(function(rs) {
				vm.item = rs.data.list1[0];
				vm.fileList = rs.data.list2;
			})
		},
		fnRowClick : function(item){
			Common.fnOnFileDownload(item);			
		},
	}
};
</script>

