<template>
  <div class="vu-format-tr" :class="{'odd': (rowIndex+1+bufferFirstIndex)%2 !==0, 'selected': displayRow.active}" @click="onClick">
    <div class="vu-td fixed-td">{{rowIndex+1+bufferFirstIndex}}</div>
    <div v-for="(col, key, colIndex) in displayRow" :key="key" class="vu-td" :style="{width: colWidths[colIndex]+'px'}" >{{col}}</div>
      <!--
    <div v-for="(col, colIndex) in row" :key="colIndex" class="vu-td" :style="{width: colWidths[colIndex]+'px'}" v-html="col"></div>
    <div v-if="(rowIndex+1+bufferFirstIndex) % 2 === 0" v-for="(col, colIndex) in row" :key="colIndex" class="vu-td" :style="{width: colWidths[colIndex]+'px'}" v-html="col"></div>
    <graphCol v-if="(rowIndex+1+bufferFirstIndex) % 2 !== 0" v-for="(col, colIndex) in row" :key="colIndex" class="vu-td" :style="{width: colWidths[colIndex]+'px'}"></graphCol>
    <img v-if="(rowIndex+1+bufferFirstIndex) % 2 !== 0" v-for="(col, colIndex) in row" :key="colIndex" class="vu-td" :style="{width: colWidths[colIndex]+'px'}" height="200" src="http://thecatapi.com/api/images/get?format=src&amp;type=gif">
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
      displayRow: this.row,
    };
  },
  props:['colDefs','row', 'rowIndex', 'colWidths', 'changeIndex', 'changeWidth', 'rowHeights', 'rowTranslateY', 'setRowHeight', 'bufferFirstIndex','isUnequalRowHeight'],
  beforeMounted: function(){
    console.log("befor mounted:", this.row);

  },
  mounted: function(){
    if(!this.isUnequalRowHeight){
      $(this.$el).height(this.setRowHeight);
    } else {
      this.height = this.$el.offsetHeight,
      console.log('row height: ', this.height);
      this.rowHeights[this.rowIndex] = this.height;
    }
    console.log("row format mounted:", this.rowData);
  },
  methods: {
    resizeTds: function(){
      this.$nextTick(function(){
        var oldWidth = this.$el.offsetWidth;
        var scrollWidth = $(this.$el)[0].scrollWidth;
        if(oldWidth !== scrollWidth){
          $(this.$el).width(scrollWidth);
          console.log('resize tds', $(this.$el).width(), $(this.$el)[0].scrollWidth);
        }
        if(this.changeIndex !== null && this.changeWidth > 0){
          var tds = $(this.$el).find('.vu-td:not(".fixed-td")').toArray();
          $(tds[this.changeIndex]).outerWidth(this.colWidths[this.changeIndex]);
          $(this.$el).width(oldWidth + this.changeWidth);
        }

      });
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
      //this.isSelected = ! this.isSelected;
      //this.row.active = !this.row.active;
      this.$emit('tr-clicked', {
        index: this.rowIndex,
      });
      console.log("clicked in row", this.row.active);
    }
  },
  computed: {
    isSelected: function(){
      this.$nextTick(function(){
        console.log('computed in row active');
        return this.displayRow.active;
      });
    }
  },
  watch: {
    colWidths: function(){
      this.resizeTds();
    },
    rowTranslateY: function(){
      this.scrollHandle();
    },
    row: function(){
      console.log('row formate watch change:', row.active);
    }
    /*
    // TODO: row height change
    height: function(){
      console.log("watch the elm height change:", this.rowHeights[this.rowIndex]);
      this.rowHeights[this.rowIndex] = this.$el.offsetHeight;
    }
    */
  },
  updated: function(){
    console.log("row format update", this.row);
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