<template>

	<main class="site_main">
		<div class="page_contents container" style="min-height: calc(100vh - 150px);">
			<div class="w_box">
				<div class="mypage">
					<h1>비밀번호 변경</h1>
					<form name="frm" method="post">
						<table class="form-table mt10 mb10">
							<tbody>
								<tr>
									<th>기존 비밀번호</th>
									<td><input type="password" class="full" v-model="viewModel.user_pwd"></td>
								</tr>
								<tr>
									<th>변경할 비밀번호</th>
									<td><input type="password" class="full" v-model="viewModel.user_pwd2"></td>
								</tr>
								<tr>
									<th>변경할 비밀번호 확인</th>
									<td><input type="password" class="full" v-model="viewModel.user_pwd3"></td>
								</tr>
							</tbody>
						</table>
					</form>
				</div>
				<div class="table_footer mypage">
					<div class="buttonbox">
						<a href="javascript:void(0);" class="btn btn-save btn-primary" v-on:click="fnUpdate()">변경</a>
						<a href="javascript:history.back();" class="btn btn-cancel">취소</a>
					</div>
				</div>

			</div>
	    </div>
	</main>
</template>

<script>
    import "es6-promise/auto";
    import Vue from "vue";
    import Axios from "axios";
    
    export default {
      data: function() {
        return {
			viewModel:{
				list:[],
				detailUser: {user_type_code:''},
				user_pwd:"",
				user_pwd2:"",
				user_pwd3:"",
				pwdCnt:"",
				regPass :  /^[A-Za-z0-9]{8,16}$/,
			}
		};
      },
      mounted: function() {
		this.user = this.$store.state.global.userInfo;
		this.user_id = this.$store.state.global.userInfo.user_id;
		let vm = this;
		vm.fnGetSelectList();
	  },
      methods: {
		// fnUpdate: function(){
    	// 	let vm = this;
		// 	let send = {
		// 			mapperId : 'user.changePassword',
		// 			user_id : vm.$store.state.global.userInfo.user_id,
		// 			user_pwd : vm.viewModel.user_pwd2,
		// 		}
		// 	let send2 = {
		// 			mapperId : 'user.changePasswordCnt',
		// 			user_id : vm.$store.state.global.userInfo.user_id,
		// 			user_pwd : vm.viewModel.user_pwd,
		// 	}
		// 	Axios.post('/list',send2).then(function(rs) {
		// 		console.log(rs.data);
		// 		vm.viewModel.pwdCnt = rs.data.pwdcnt;
		// 	})
		// 	if(vm.viewModel.user_pwd == null || vm.viewModel.user_pwd==""){
        //         alert("기존 비밀번호를 입력하세요.");
        //         return false;
        //     } 
		// 	else if(vm.viewModel.pwdCnt != null && vm.viewModel.pwdCnt != ""){
		// 		Axios.post('/api/account/pwd/update',send).then(function(rs) {
		// 		}); alert('비밀번호가 변경되었습니다.')
		// 		window.location.href= "/main/mypage/";
		// 	}
		// 	else{
		// 		alert("기존 비밀번호가 일치하지 않습니다.");
		// 	}
    	// },
		fnUpdate: function(){
			let vm = this;

			//변경 비밀번호 두개 일치하는지 확인
			if(vm.viewModel.user_pwd2 != vm.viewModel.user_pwd3){
				alert("변경할 비밀번호가 일치하지 않습니다.\n확인 후 다시 변경해주세요.");
				return false;
			}
			
    		let send = {
                user_id : vm.$store.state.global.userInfo.user_id,
                user_pwd : vm.viewModel.user_pwd2,
                user_org_pwd : vm.viewModel.user_pwd,
    		};
            let result = confirm("비밀번호를 변경하시겠습니까?");
            if(result){
    			Axios.post("/api/account/pwd/update", {detail:send})
				.then(function(response) {
					if(response.data.resultCount == 1){
						alert('변경이 완료되었습니다. 다시 로그인해주세요.');
						window.location.href= "/admin/logout?returnURI=/account/login";
					}else{
						alert("기존 비밀번호를 확인해주세요.");
						return false;
					}
				});
            }else{
                alert('비밀번호 변경을 취소하셨습니다.');
            }
        },
		fnGetSelectList: function() {
				let vm = this;
				console.log(vm.user);
				let data = {
					mapperId: 'mainmypage.mypageList',
					team_leader: vm.$store.state.global.userInfo.team_leader,
				};
				Axios.post("/detail",data).then(function(response) {
					vm.viewModel.list = response.data[0];
				});
        	},
	  }
    };
</script>
