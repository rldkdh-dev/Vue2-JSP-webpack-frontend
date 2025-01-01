<script>
import 'es6-promise/auto'
import Vue from 'vue'
import Axios from 'axios'
import eventBus from '../../eventbus.js';


Vue.config.devtools = true;

export default {
    components: {
        // 'resignPopup': resignPopup,
        // 'printPopup': printPopup,
    },
    data: function () {
        return {
            select: "0",
            viewModel: {
                codeList: [],
                colNames: [],
                colValue: [],
                gradeList: [],
                userInfo: {},
                serachList: {
                    ym_calcu_basic: "",
                },
                bplc_sn: "",
                pager: {
                    model: {},
                    pageNo: 1,
                    totalSize: 0,
                    rowSize: 10,
                    blockSize: 10,
                    gradeList: [],
                    callBack: function (n) {
                        this.model.fnGetSelectList(n);
                    }
                },
            }
        }
    },
    mounted: function () {
        // eventBus.$on('onDetail', ym_calcu_basic => {
        //     this.onDetail(ym_calcu_basic);
        // })
    },
    methods: {
        // onDetail: function (ym_calcu_basic) {
        //     console.log("YM_CALCU_BASIC : ", ym_calcu_basic);
        // }

    }
}
</script>