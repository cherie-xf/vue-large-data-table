<template>
  <div class="vu-format-tr" :class="{'odd': (rowIndex+1+lastFirstIndex)%2 !==0}">
    <div class="vu-td fixed-td">{{rowIndex+1+lastFirstIndex}}</div>
    <div v-for="(col, colIndex) in row" :key="colIndex" class="vu-td" :style="{width: colWidths[colIndex]+'px'}" v-html="col"></div>
  </div>
</template>
<script>
export default {
  name:'vuRowFormat',
  props:['colDefs','row', 'rowIndex', 'colWidths', 'changeIndex', 'changeWidth', 'rowHeights', 'rowTranslateY', 'lastFirstIndex'],
  //template:'<div class="vu-format-tr"></div>',
  mounted: function(){
    /*
    if((this.rowIndex + 1) % 2 !== 0){
      $(this.$el).addClass('odd');
    }
    $(this.$el).append('<div class="vu-td fixed-td">'+(this.rowIndex + 1)+'</div>');
    this.$nextTick(function(){
      this.row.forEach(function(col, idx){
        var td = $('<div class="vu-td"></div>').append(col);
        if(this.colWidths[idx]){
          td.width(this.colWidths[idx]);
        }
        $(this.$el).append(td);
      }, this);
    });
    */
    this.rowHeights[this.rowIndex] = $(this.$el).height();
    console.log('row height', $(this.$el).height());
  },
  methods: {
    resizeTds: function(){
      this.$nextTick(function(){
        var tds = $(this.$el).find('.vu-td:not(".fixed-td")').toArray();
        $(tds[this.changeIndex]).outerWidth(this.colWidths[this.changeIndex]);
        var oldWidth = $(this.$el).width();
        $(this.$el).width(oldWidth + this.changeWidth);

      });
    },
    scrollHandle: function(){
      $(this.$el).css('transform', 'translate3d(0px, '+ this.rowTranslateY +'px, 0px');
    }
  },
  watch: {
    colWidths: function(){
      this.resizeTds();
    },
    rowTranslateY: function(){
      console.log('row format current scroll y change', this.currentScrollY)
      this.scrollHandle();
    },
  }

}
</script>

<style scoped>
/* why not work?
.vu-td {
  height: 100%;
  overflow-x: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex-shrink: 0;
  padding: 2px 5px;
  border-right: 1px solid #F1F1F1;
}

.vu-td.fixed-td {
  width: 45px;
  flex-grow: 0;
}
*/
</style>