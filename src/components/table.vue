<template>
 <div class="vu-table">
    <div class="vu-thead">
      <div class="vu-th fixed-th">#</div>
      <div v-for="(coldef, thIndex) in colDefs" class="vu-th" v-bind:key="thIndex">
        <div v-html="coldef"></div>
        <vuThResizer @th-resized="thResized" v-bind:thIndex="thIndex"></vuThResizer>
      </div>
    </div>
    <div class="vu-tbody" @scroll="largetDataScroll">
      <div class="vu-tbody-container">
        <vuRowFormat
        v-bind:row="row"
        v-bind:col-defs="colDefs"
        v-bind:col-widths="colWidths"
        v-bind:row-index="rowIndex"
        v-bind:row-heights="rowHeights"
        v-bind:change-index="changeIndex"
        v-bind:change-width="changeWidth"
        v-bind:row-translate-y="rowTranslateY"
        v-bind:last-first-index="lastFirstIndex" 
        v-for="(row, rowIndex) in displayrows"
        v-bind:key="rowIndex"></vuRowFormat>
        </div>
    </div>
    <div class="vu-tfoot"></div>
  </div>
</template>
<script>

import vuRowFormat from './vu-row-format.vue'
import vuThResizer from './vu-th-resizer.vue'

export default {
  name: 'vuTable',
  props:['colDefs','rows'],
  //template: '#vu-table-component',
  comonents: {
    vuRowFormat,
    vuThResizer
  },
  data: function(){
    return {
      colWidths: [],
      changeIndex: null,
      changeWidth: 0,
      rowHeights: [],
      viewHeight: 500, // current viewport height
      ticking: false,
      lastScrollY: 0,
      rowTranslateY: 0,
      currentScrollY: 0,
      setRowHeight: 26,
      setRowCount: 50,
      lastFirstIndex: 0,
      copyrows:[],
    }
  },
  created: function(){
    console.log('created');
    this.copyrows = this.rows.slice(0, 50);
  },
  methods: {
    thResized: function(args){
      this.colWidths[args.index] = args.target.outerWidth();
      this.colWidths = this.colWidths.slice(); // need change reference to trigger watch
      this.changeIndex = args.index;
      this.changeWidth = args.changeWidth;
    },
    handleHorizontalScroll: function(ev){
      var lastPos = 0;
      console.log('scroll top', $(ev.target).scrollTop());
      var currentPos = $(ev.target).scrollLeft();
      var thead = $(this.$el).find('.vu-thead');
      if(lastPos !== currentPos){
        thead.css('left', 0-currentPos + 'px');
      } else {
        thead.css('left', 0 + 'px');
      }
      var oldWidth = $(ev.target).width();
      thead.width(oldWidth + currentPos);
    },
    largetDataScroll:function(ev){
      var tbody = $(ev.target);
      this.currentScrollY = tbody.scrollTop();
      console.log('lastScrollY', this.lastScrollY,'currentScrollY', this.currentScrollY);
      this.scrollTick();
    },
    scrollTick: function(){
      console.log('scroll tick', this.ticking);
      this.updataPageConfig();
      /*
      if(!this.ticking){
        this.updateFrame();
        this.ticking = true;
      }
      */
    },
    getRows: function(){
        console.log('get rows',this.scrollRowIdxs.firstIndex, this.lastFirstIndex);
        //TODO: may add buffer rows to reduce the bounce : firstindex > lastfirstindex + bufferrows
        if(this.scrollRowIdxs.firstIndex !== this.lastFirstIndex){
          this.copyrows = this.rows.slice(0);
          this.copyrows = this.copyrows.splice(this.scrollRowIdxs.firstIndex, Math.ceil(this.scrollRowIdxs.lastIndex));
          this.lastFirstIndex= this.scrollRowIdxs.firstIndex;
          this.rowTranslateY = this.currentScrollY;
        } 
        this.lastScrollY = this.currentScrollY;
        //this.ticking = false;
    },
    /** update the page's offset give the scroll position */
    updataPageConfig: function(){
      this.scrollRowIdxs = this.getFirstLastIndexes();
      console.log("row indexes: ", this.scrollRowIdxs);
      if(this.currentScrollY > this.lastScrollY){
        // scroll down
        this.getRows();
      } else if (this.currentScrollY < this.lastScrollY){
        // scroll up
        this.getRows();
      } else {
        // no scroll
      }
    },
    /** gets the first and last indexes of rows base on offset, row hight, page size, overall count */
    getFirstLastIndexes: function(){
      var fIndex, lIndex;
      fIndex = Math.max( Math.floor((this.lastScrollY / this.setRowHeight), 0) ,0); 
      lIndex = fIndex + Math.min(this.viewHeight/this.setRowHeight, this.setRowCount);
      return {
        firstIndex: fIndex,
        lastIndex: lIndex,
      };
    }
  },
  mounted: function(){
    //console.log('mounted', moment(Date.now()).format("mm:ss"));
    var ths = $(this.$el).find('.vu-thead > .vu-th:not(".fixed-th")').toArray();
    ths.forEach(function(th){
      this.colWidths.push(th.offsetWidth);
      $(th).css("width", th.offsetWidth); // for resize
      $(th).css("flexGrow", "0"); // for resize
    }, this);
    this.viewHeight = $(window).height();
    var tbody = $(this.$el).find('.vu-tbody-container');
    tbody.height(this.scrollHeight);
    console.log('view height', this.viewHeight);
    console.log('scroll height', tbody.height());
  },
  computed:{
    displayrows: function(){
      return this.copyrows;
    },
    /*
    // buffer row height = count * equal row height
    bufferHeight: function(){
      return this.setRowCount * this.setRowHeight + 'px';
    },
    */
    // tbody with scroll height base on set rowHeight and raw data count
    scrollHeight: function(){
      return this.rows.length * this.setRowHeight;
    }

  },
  updated: function(){
    console.log('updated', this.copyrows);
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.vu-table {
  height: 400px;
  display: flex;
  flex-direction: column;
}
.vu-table .vu-thead {
  position: relative;
  height: 28px;
  display: flex;
  background-color: #d2d4d6;
  align-items: center;
  padding-right: 15px;
}
.vu-table .vu-thead .vu-th {
  flex-grow: 1;
  overflow-x: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding: 4px;
  font-weight: bold;
  border-right: 1px solid silver;
  position: relative;
  flex-shrink: 0;
}
.vu-table .vu-thead .vu-th:not(.fixed-th) {
  min-width: 50px;
}
.vu-table .vu-thead .vu-th.fixed-th {
  width: 45px;
  flex-grow: 0;
}
.vu-table .vu-thead .vu-th .vu-th-resizer {
  height: 100%;
  width: 14px;
  background-color: transparent;
  position: absolute;
  top: 0;
  right: -7px;
  cursor: col-resize;
}
.vu-table .vu-tfoot {
  height: 30px;
  background-color: #d2d4d6;
}
.vu-table .vu-tbody {
  max-height: calc(100% - 28px - 30px);
  overflow: auto;
}
.vu-table .vu-tbody .vu-tbody-container {
  height: 100%;
}
.vu-table .vu-tbody .vu-format-tr {
  display: flex;
  align-items: center;
  background-color: #f9f9f9;
}
.vu-table .vu-tbody .vu-format-tr.odd {
  background-color: #eff4f7;
}
.vu-table .vu-tbody .vu-format-tr >>> .vu-td {
  height: 100%;
  overflow-x: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex-shrink: 0;
  padding: 2px 4px;
  border-right: 1px solid #F1F1F1;
}
.vu-table .vu-tbody .vu-format-tr >>> .vu-td.fixed-td {
  width: 45px;
  flex-grow: 0;
}
</style>