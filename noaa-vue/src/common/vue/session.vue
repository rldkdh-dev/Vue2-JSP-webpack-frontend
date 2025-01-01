<template>
	<div class="member_info">
		<div class="member">
			<span class="name">{{sessionuser.user_name}}</span>
			<span class="team">{{sessionuser.user_group}} {{sessionuser.user_dept}} {{sessionuser.user_type_title}}</span>
			<a href="#" class="btn-notification"><img :src="icon" alt=""><i class="notification"></i></a>
			<a href="#" class="btn_mypage icon"><span class="mi">&#xf02e;</span></a>
		</div>
	</div>
</template>
<script>
import 'es6-promise/auto'
import Vue from 'vue'
import Axios from 'axios'
import device from "vue-device-detector";
import eventBus from '../eventbus.js';

export default{
    data: function () {
        return {
            sessionuser: {},
        }
    },
    mounted: function() {
    	this.fnSessionUser();
    },
    methods: {
    	fnSessionUser: function() {
            let vm = this;
            Axios.post("/api/account/myInfo", {}).then(function(response) {
                vm.sessionuser = response.data.detailUser;
                
                if(vm.sessionuser.user_roles == 'ROLE_001'){
                    vm.sessionuser.menu_use_type = 'ADMIN'
                }else{
                    vm.sessionuser.menu_use_type = 'USER'
                }
                eventBus.$emit('user', vm.sessionuser);
            });
        },
    }
}
</script>