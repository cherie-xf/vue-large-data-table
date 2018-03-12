<template>
  <div class="vu-format-tr" :class="{'odd': (rowIndex+1+bufferFirstIndex)%2 !==0}">
    <div class="vu-td fixed-td">{{rowIndex+1+bufferFirstIndex}}</div>
    <div v-for="(col, colIndex) in row" :key="colIndex" class="vu-td" :style="{width: colWidths[colIndex]+'px'}" v-html="col"></div>
  </div>
</template>
<script>
export default {
  name:'vuRowFormat',
  props:['colDefs','row', 'rowIndex', 'colWidths', 'changeIndex', 'changeWidth', 'rowHeights', 'rowTranslateY', 'setRowHeight', 'bufferFirstIndex','isUnequalRowHeight'],
  mounted: function(){
    if(!this.isUnequalRowHeight){
      $(this.$el).height(this.setRowHeight);
    }
    this.rowHeights[this.rowIndex] = $(this.$el).height();
    console.log('is equal row height: ', this.isUnequalRowHeight);
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
      $(this.$el).css('transform', 'translate3d(0px, '+ this.bufferFirstIndex  * this.setRowHeight +'px, 0px');
    }
  },
  watch: {
    colWidths: function(){
      this.resizeTds();
    },
    rowTranslateY: function(){
      //console.log('row format current scroll y change', this.rowTranslateY)
      //console.log('buffer first index change', this.bufferFirstIndex)
      //console.log('current first index change', this.lastFirstIndex)
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