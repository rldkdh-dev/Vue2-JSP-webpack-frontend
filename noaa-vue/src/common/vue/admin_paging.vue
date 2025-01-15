<template>
    <ul class="pagination">
        <li v-if="pass.pageNo>1" v-on:click="onClickPagerNo(pass.pageNo-1)" class="prev">
            <a href="javascript:void(0)">이전</a>
        </li>
        <li v-on:click="onClickPagerNo(item)" v-for="item in pass.list" v-bind:key="item">
            <span v-if="item==pass.pageNo" v-bind:class="{'active':item==pass.pageNo}" style="color:#0070d2; cursor:pointer;">{{item}}</span>
            <span v-else style="color:#000000; cursor:pointer;">{{item}}</span>
        </li>
        <li v-if="pass.totalSize >= pass.rowSize*pass.pageNo" v-on:click="onClickPagerNo(pass.pageNo + 1)" class="next">
            <a href="javascript:void(0)">다음</a>
        </li>
        <li v-else-if="pass.totalSize <= pass.rowSize*pass.pageNo"></li>
    </ul>
</template>

<script>
export default {
    props: ['pass'],
    methods: {
        onClickPagerNo: function(n) {
            this.pass.pageNo = n == 0 ? 1 : n;
            this.pass.callBBBBack(n);
        },
        createPaging: function(pager, vm, cbType) {
            pager.callBackType = cbType;
            let _list = [];
            let _endPagerNo = parseInt((pager.totalSize - 1) / pager.rowSize) + 1;

            let _startBlock = parseInt((pager.pageNo - 1) / pager.blockSize) * pager.blockSize + 1;
            let index = 0;
            let _endBlock = 0;
            let _nextBlock = 0;

            for (let i = _startBlock; i <= _endPagerNo; i++) {
                if (index < pager.blockSize) {
                    _list.push(i);
                    _endBlock = i;
                    if (i < _endPagerNo) {
                        _nextBlock = i + 1;
                    } else {
                        _nextBlock = 0;
                    }
                    index++;
                } else {
                    break;
                }
            } //end for
            pager.list = _list;
            pager.model = vm;
            pager.startBlock = _startBlock;
            pager.nextBlock = _nextBlock;
            return pager;
        }
    }
}
</script>
