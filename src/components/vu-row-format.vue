<template>
  <div class="vu-format-tr" :class="{'odd': (rowIndex+1+bufferFirstIndex)%2 !==0, 'selected': displayRow.selected}" @click="onClick">
    <div class="vu-td fixed-td">{{rowIndex+1+bufferFirstIndex}}</div>
    <div v-if="Array.isArray(displayRow) !== Array && !displayRow.isGroup" v-for="(col, key, colIndex) in displayRow" :key="key" class="vu-td" :style="{'width': colWidths[colIndex]+'px'}" >{{col}}</div>
    <div v-if="Array.isArray(displayRow) === Array && !displayRow.isGroup" v-for="(col, colIndex) in displayRow" :key="colIndex" class="vu-td" :style="{'width': colWidths[colIndex]+'px'}" >{{col}}</div>
    <div v-if="displayRow.isGroup" class="vu-group-td" >{{displayRow.groupName + ' ('+displayRow.count+') '}}</div>
    <!--
    <div v-if="(rowIndex+1+bufferFirstIndex) % 2 === 0" v-for="(col, key) in row" :key="key" class="vu-td" :style="{}" v-html="col"></div>
    <div v-if="(rowIndex+1+bufferFirstIndex) % 2 !== 0" v-for="(col, colIndex) in row" :key="colIndex" class="vu-td" :style="{height: 200+'px'}" >
      <img height="200" src="http://thecatapi.com/api/images/get?format=src&amp;type=gif">
    </div>
    -->
      <!--
    <graphCol v-for="(col, colIndex) in displayRow" :key="colIndex" class="vu-td" :style="{width: colWidths[colIndex]+'px'}"></graphCol>
    -->
    <!--
    <div v-for="(col, colIndex) in row" :key="colIndex" class="vu-td" :style="{width: colWidths[colIndex]+'px'}" v-html="col"></div>
      -->
  </div>
</template>
<script>
import graphCol from './graphCol.vue'
export default {
  name:'vuRowFormat',
  components: {
    graphCol,
  },
  data: function() {
    return {
      height: 0,
      //isSelected: false,
    };
  },
  props:['colDefs','row', 'rowIndex', 'colWidths', 'changeIndex', 'changeWidth', 'rowHeights', 'rowTranslateY', 'setRowHeight', 'bufferFirstIndex','isUnequalRowHeight'],
  mounted: function(){
    if(!this.isUnequalRowHeight){
      $(this.$el).height(this.setRowHeight);
    } else {
      this.height = this.$el.offsetHeight,
      this.rowHeights[this.rowIndex] = this.height;
    }
    this.initTdWith();

  },
  methods: {
    initTdWith: function(){
      $(this.$el).find('.vu-td:not(".fixed-td")').toArray().forEach(function(td, idx){
        if(this.colWidths[idx]){
          $(td).width(this.colWidths[idx]);
        }
      }, this);
    },
    resizeTds: function(){
        var oldWidth = $(this.$el).width();
        if(this.changeIndex !== null && this.changeWidth > 0){
          var tds = $(this.$el).find('.vu-td:not(".fixed-td")').toArray();
          $(tds[this.changeIndex]).width(this.colWidths[this.changeIndex]);
          $(this.$el).width(oldWidth + this.changeWidth);
        }
    },
    scrollHandle: function(){
      var transHeight = 0;
      if(this.isUnequalRowHeight){
        transHeight = this.rowHeights.slice(0, this.bufferFirstIndex).reduce(function(res, height){
          return res += height;
        }, 0);
      } else {
        transHeight = this.bufferFirstIndex  * this.setRowHeight;
      }
      $(this.$el).css('transform', 'translate3d(0px, '+ transHeight +'px, 0px');
    },
    onClick: function(){
      this.$emit('tr-clicked', {
        displayIdx: this.rowIndex,
        rowIdx: this.rowIndex + this.bufferFirstIndex,
      });
      console.log("clicked in row", this.row.selected, "row index:", this.rowIndex, "buffer index:", this.rowIndex + this.bufferFirstIndex);
    }
  },
  computed: {
    displayRow: function(){
      return this.row;
    },
  },
  watch: {
    colWidths: function(){
      this.resizeTds();
    },
    rowTranslateY: function(){
      this.scrollHandle();
    },
    /*
    // TODO: row height change
    height: function(){
      console.log("watch the elm height change:", this.rowHeights[this.rowIndex]);
      this.rowHeights[this.rowIndex] = this.$el.offsetHeight;
    }
    */
  },
  updated: function(){
    this.initTdWith();
    // fix mounted with x scroll bar, row width need expand
    var oldWidth = $(this.$el).width();
    var scrollWidth = $(this.$el)[0].scrollWidth;
    if(oldWidth !== scrollWidth){
      $(this.$el).width(scrollWidth);
    }
  }


}
</script>

<style scoped>
.vu-format-tr{
  display: flex;
  align-items: center;
  background-color: #f9f9f9;
}
.vu-format-tr.odd {
  background-color: #eff4f7;
}
.vu-format-tr.selected {
  background-color: #667481;
}
.vu-td {
  overflow-x: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex-shrink: 0;
  padding: 2px 4px;
  border-right: 1px solid #F1F1F1;
  /* for border*/
  height: 100%; 
  display: flex;
  align-items: center;
}

.vu-td.fixed-td {
  width: 45px;
  flex-grow: 0;
}
</style>