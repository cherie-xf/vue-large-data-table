<template>
 <div class="vu-table">
    <div class="vu-thead">
      <div class="vu-th fixed-th">#</div>
      <div v-for="(coldef, thIndex) in colDefs" class="vu-th" v-bind:key="thIndex">
        <div v-html="coldef"></div>
        <vuThResizer @th-resized="thResized" v-bind:thIndex="thIndex"></vuThResizer>
      </div>
    </div>
    <div class="vu-tbody">
      <div class="vu-tbody-container" @scroll="handleHorizontalScroll">
        <vuRowFormat
        v-bind:row="row"
        v-bind:col-defs="colDefs"
        v-bind:col-widths="colWidths"
        v-bind:row-index="rowIndex"
        v-bind:row-heights="rowHeights"
        v-bind:change-index="changeIndex"
        v-bind:change-width="changeWidth"
        v-for="(row, rowIndex) in copyrows"
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
    }
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
      var currentPos = $(ev.target).scrollLeft();
      var thead = $(this.$el).find('.vu-thead');
      if(lastPos !== currentPos){
        thead.css('left', 0-currentPos + 'px');
      } else {
        thead.css('left', 0 + 'px');
      }
      var oldWidth = $(ev.target).width();
      thead.width(oldWidth + currentPos);
    }
  },
  beforeMount: function(){
    //console.log('beforeMount', moment(Date.now()).format("mm:ss"));
  },
  mounted: function(){
    //console.log('mounted', moment(Date.now()).format("mm:ss"));
    var ths = $(this.$el).find('.vu-thead > .vu-th:not(".fixed-th")').toArray();
    ths.forEach(function(th){
      this.colWidths.push(th.offsetWidth);
      $(th).css("width", th.offsetWidth); // for resize
      $(th).css("flexGrow", "0"); // for resize
    }, this);
    console.log(this.colWidths);
  },
  computed:{
    copyrows: function(){
      //return this.rows.splice(0, 50);
      return this.rows;
    }
  },
  updated: function(){
    //console.log('updated', moment(Date.now()).format("mm:ss"));
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.vu-table {
  height: 100%;
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
  height: calc(100% - 28px - 30px);
}
.vu-table .vu-tbody .vu-tbody-container {
  height: 100%;
  overflow: auto;
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