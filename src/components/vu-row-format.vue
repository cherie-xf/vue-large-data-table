<template>
  <div class="vu-format-tr"></div>
</template>
<script>
export default {
  name:'vuRowFormat',
  props:['colDefs','row', 'rowIndex', 'colWidths', 'changeIndex', 'changeWidth', 'rowHeights'],
  //template:'<div class="vu-format-tr"></div>',
  mounted: function(){
    if((this.rowIndex + 1) % 2 !== 0){
      $(this.$el).addClass('odd');
    }
    $(this.$el).append('<div class="vu-td fixed-td">'+(this.rowIndex + 1)+'</div>');
    this.row.forEach(function(col, idx){
      var td = $('<div class="vu-td"></div>').append(col);
      if(this.colWidths[idx]){
        td.width(this.colWidths[idx]);
      }
      $(this.$el).append(td);
    }, this);
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
    }
  },
  watch: {
    colWidths: function(){
      this.resizeTds();
    },
  },
}
</script>

<style scoped>
</style>