<template>
  <ul class="pagination">
    <li>
      <a href="" class="prev" :class="{'disabled':pass.pageNo<=1}" @click.prevent="onClickPagerNo(pass.pageNo-1)"></a>
    </li>
    <li v-for="item in pass.list" v-bind:key="item" :class="{'active':item==pass.pageNo}">
      <a href="" @click.prevent="onClickPagerNo(item)"><span>{{item}}</span></a>
    </li>
    <li>
      <a href="" class="next" :class="{'disabled':pass.totalSize < pass.rowSize*pass.pageNo}" @click.prevent="onClickPagerNo(pass.pageNo + 1)"></a>
    </li>
  </ul>
</template>
<script>
  export default{
    props:['pass'],
    mounted: function() {
      // console.log(this.pass)
    }
    ,methods:{
      onClickPagerNo:function(n){
        let _endPagerNo=parseInt((this.pass.totalSize-1)/this.pass.rowSize)+1;

        this.pass.pageNo=n==0?1:(n<_endPagerNo)?n:_endPagerNo;
        this.pass.callBack(this.pass.pageNo);
      }
      ,createPaging:function(pager,vm,cbType){
        pager.callBackType=cbType;
        let _list=[];
        let _endPagerNo=parseInt((pager.totalSize-1)/pager.rowSize)+1;

        let _startBlock=parseInt((pager.pageNo-1)/pager.blockSize)*pager.blockSize+1;
        let index=0;
        let _endBlock=0;
        let _nextBlock=0;

        for(let i=_startBlock;i<=_endPagerNo;i++){
          if(index<pager.blockSize){
            _list.push(i);
            _endBlock=i;
            if(i<_endPagerNo){
              _nextBlock=i+1;
            }else{
              _nextBlock=0;
            }
            index++;
          }else{
            break; 
          }
        }//end for
        pager.list=_list;
        pager.model=vm;
        pager.startBlock=_startBlock;
        pager.nextBlock=_nextBlock;
        return pager;
      }
    }
  }
</script>