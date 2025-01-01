<template>
    <modal :pass="{popupTitle: '폴더명'}">
		<template v-slot:contents>
			<div>
                <table class="table horizontal write">
                    <caption>점검활동 상세</caption>
                    <tbody>
                        <tr>
                            <th scope="row" class="essential"><label for="">폴더명</label></th>
                            <td>
                                <input type="text" id="folder_nm" v-model="viewModel.data.folder_nm" placeholder="폴더명">
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="table_footer btn-right">
                <button class="btn btn-purple" @click.prevent="fnSave()"><svg class="icon"><use xlink:href="../../img/symbol-defs.svg#icon-post-add"></use></svg>등록</button>
            </div>
		</template>
	</modal>
</template>

<script>
    import "es6-promise/auto";
    import Vue from "vue";
    import Axios from "axios";
    import Modal from "../../../../common/vue/modal.vue";
    import Message, {messageUtil} from "../../../../common/js/message";
    import fromValidation from "../../../../common/js/fromValidation";

    export default {
        props: ['pass'],
        data: function() {
            return {
                viewModel:{
                    data: {
                        menu_se:$("#menu_se").val(),
                        folder_nm:'',
                        folder_id:'',
                    }
                },
            };
        },
        components: {
            Modal
        },
        mounted: function() {
            let vm = this;
            // vm.fnInit();
        },
        methods: {
            fnInit:function(parentId, topLvlId){
                let vm = this;
                vm.viewModel.userInfo = vm.$store.state.global.userInfo;

                Modal.methods.fnInit();
                vm.viewModel.data.folder_nm = '';
                vm.viewModel.data.folder_id = '';
                vm.viewModel.data.parent_id = parentId;
                vm.viewModel.data.top_lvl_id = topLvlId;
            },
            fnUpdt:function(folder_id, folder_nm){
                let vm = this;
                vm.viewModel.userInfo = vm.$store.state.global.userInfo;

                Modal.methods.fnInit();

                vm.viewModel.data.folder_nm = folder_nm;
                vm.viewModel.data.folder_id = folder_id;
            },
            fnSave:function(){
                let vm = this;
                const valiData = [
                    {id: 'folder_nm', type: 'select', title: '폴더명'},
                ];
                
                if(!fromValidation(valiData)){
                    return false;
                }

                let data = {
                    user_id: vm.viewModel.userInfo.user_id,
                    bplc_sn: vm.$parent.bplc_sn,
                    dept_sn: vm.$parent.dept_sn,
                    folder_nm: vm.viewModel.data.folder_nm,
                    menu_se: vm.viewModel.data.menu_se,
                    parent_id: vm.viewModel.data.parent_id,
                    folder_id: vm.viewModel.data.folder_id,
                    top_lvl_id: vm.viewModel.data.top_lvl_id,
                };

                if(confirm(Message.CREATE_CONFIRM)){
                    Axios.post("/insertOhStdFolder.do", data).then(function(response) {
                        if(response.data == 1){
                            alert("저장되었습니다.");
                            vm.$parent.folderPop = false;
                            vm.$parent.fnFolderClick(vm.$parent.folder_id, vm.$parent.top_lvl_id);
                        }else{
                            alert(Message.ERROR);    
                        }
                    }).catch(function(ex) {
                        alert(Message.ERROR);
                    });
                }
            },
        }
    };
</script>