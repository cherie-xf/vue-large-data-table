<template>
 <div class="vu-table">
    <div class="vu-thead">
      <div class="vu-th fixed-th">#</div>
      <div v-for="(colDef, thIndex) in colDefs" class="vu-th" v-bind:key="thIndex" :class="{'sort-key': colDef === sortKey}" @click="thOnClick(colDef)">
        <div v-if="colDef === sortKey" class="indicator" :class="{'up-arrow': !sortDesc, 'down-arrow': sortDesc}"></div>
        <div v-html="colDef"></div>
        <vuThResizer @th-resized="thResized" v-bind:thIndex="thIndex"></vuThResizer>
      </div>
    </div>
    <div class="vu-tbody" @scroll="largeDataScroll">
      <div class="vu-tbody-container">
        <vuRowFormat
        @tr-clicked="trClicked"
        @toggle-expand="groupToggleExpand"
        :row="row"
        :col-defs="colDefs"
        :col-widths="colWidths"
        :row-index="rowIndex"
        :row-heights="rowHeights"
        :change-index="changeIndex"
        :change-width="changeWidth"
        :row-translate-y="rowTranslateY"
        :set-row-height="setRowHeight" 
        :buffer-first-index="bufferFirstIndex"
        :is-unequal-row-height="isUnequalRowHeight"
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
  props:['colDefs','rows','collapseOrExpandAll'],
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
      viewHeight: 500, // default current viewport height
      lastScrollY: 0,
      rowTranslateY: 0,
      currentScrollY: 0,
      currentScrollX: 0,
      isUnequalRowHeight: false,// default is equal row height
      setRowHeight: 30,
      setRowCount: 20, // set min showing rows count in case view height is too small
      scrollHeight: 0,
      lastFirstIndex: 0,
      bufferFirstIndex: 0,
      copyrows:[],
      frameTimer: null,
      sortKey : 'id',
      sortDesc: true,
      groupKey: 'country',
      sortedRows: [],
      groupedRows:[],
      groupedMap: new Map(),
    }
  },
  created: function(){
    console.log("created table:");
    this.sortedRows = this.getSortedRows();
    if(this.groupKey && this.colDefs.indexOf(this.groupKey) > 0){
      this.sortedRows = this.getGroupedRows();
    }
    this.setScrollHeight();
    this.initCopyRow();
  },
  methods: {
    initCopyRow: function(){
      var startIdx = this.scrollRowIdxs && this.scrollRowIdxs.firstIndex? this.scrollRowIdxs.firstIndex : 0;
      var endIdx = startIdx + Math.max(this.viewHeight /this.setRowHeight + this.bufferRowCount, this.setRowCount); // 1.5 times view hight
      if(this.isUnequalRowHeight){
        endIdx = this.getUnequalLastIndex(startIdx);
      }
      endIdx = Math.ceil(endIdx + this.bufferRowCount);
      startIdx = (startIdx - this.bufferRowCount) > 0 ? Math.ceil(startIdx - this.bufferRowCount) : 0;
      this.copyrows = this.sortedRows.slice(0);
      this.copyrows = this.copyrows.splice(startIdx,  endIdx- startIdx + 1);
      this.bufferFirstIndex = startIdx;
    },
    getSortedRows: function(){
      console.log('get sorted row');
      var key = this.sortKey;
      if(key){
        var sortArr =  this.rows.sort(function(a, b){
          //console.log('in sort function:', a, b);
          if(a[key] < b[key]) return -1;
          if(a[key] > b[key]) return 1;
          return 0;
        });
        return this.sortDesc ? sortArr.reverse() : sortArr;
      } else {
        return this.rows;
      }
    },
    getGroupedRows: function(){
      var groupKey = this.groupKey;
      if(groupKey){
        var keyArray = this.rows.map(function(row){return row[groupKey];});
        var groupNameArray = keyArray.filter(function(val, idx, self){ return self.indexOf(val) === idx;});
        console.log('group name array:', groupNameArray);
        var groupMap = new Map();
        groupNameArray.forEach(function(groupName){
          groupMap.set(groupName, {
            isExpand: true,
            data: [],
          });
        });
        this.rows.forEach(function(row){
          groupMap.get(row[groupKey]).data.push(row);
        });
        this.groupedMap = new Map(groupMap);
        console.log('group map:', this.groupedMap);
        return this.groupMapToArr();
        //var groupArr = [];
        //return groupArr;
      } else {
        return this.rows;
      }
    },
    groupMapToArr: function(){
      var groupArr = [];
      var self = this;
      this.groupedMap.forEach(function(val, key){
        groupArr.push({groupName: key, count: val.data.length, groupBy: self.groupKey, isGroup: true, selected: false, isExpand: val.isExpand});
        if(val.isExpand){
          groupArr = groupArr.concat(val.data);
        }
      });
      console.log('group arr:', groupArr);
      return groupArr;
    },
    largeDataScroll:function(ev){
      var tbody = $(ev.target);
      this.currentScrollY = tbody.scrollTop();
      this.currentScrollX = tbody.scrollLeft();
      this.tbodyWidth = tbody.width();
      //console.log('lastScrollY', this.lastScrollY,'currentScrollY', this.currentScrollY);
      this.scrollTick();
      this.handleHorizontalScroll();
    },
    scrollTick: function(){
      if(cancelAnimationFrame && this.frameTimer){
        cancelAnimationFrame(this.frameTimer);
      } 
      if(requestAnimationFrame){
        this.frameTimer = requestAnimationFrame(this.updataPageConfig);
      } else {
        console.log('no request animation frame found');
        this.throttle(this.updataPageConfig, this, 1000/60);
      }
    },
    /** update the page's offset give the scroll position */
    updataPageConfig: function(){
      if(this.isUnequalRowHeight){
        this.scrollRowIdxs = this.getUnequalFirstLastIndex();
      } else {
        this.scrollRowIdxs = this.getFirstLastIndexes();
      }
      //console.log("row indexes: ", this.scrollRowIdxs);
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
      fIndex = Math.max( Math.floor((this.currentScrollY / this.setRowHeight), 0) ,0); 
      lIndex = fIndex + Math.max(this.viewHeight /this.setRowHeight, this.setRowCount); 
      //lIndex = lIndex > this.rows.length ? this.rows.length : lIndex;
      lIndex = lIndex > this.sortedRows.length ? this.sortedRows.length : lIndex;
      return {
        firstIndex: fIndex,
        lastIndex: lIndex,
      };
    },
    getRows: function(){
        var startIdx = this.scrollRowIdxs.firstIndex;
        var endIdx = Math.ceil(this.scrollRowIdxs.lastIndex);
        if(this.scrollRowIdxs.firstIndex !== this.lastFirstIndex){
          endIdx = Math.ceil(endIdx + this.bufferRowCount);
          startIdx = (startIdx - this.bufferRowCount) > 0 ? Math.ceil(startIdx - this.bufferRowCount) : 0;
          this.bufferFirstIndex = startIdx;
          this.copyrows = this.sortedRows.slice(0);
          this.copyrows = this.copyrows.splice(startIdx,  endIdx- startIdx + 1);
          this.lastFirstIndex= this.scrollRowIdxs.firstIndex;
          this.rowTranslateY = this.currentScrollY;
        } 
        this.lastScrollY = this.currentScrollY;
    },
    getUnequalFirstLastIndex: function(){
      //BINARY SEARCH  to set fIndex
      var fIndex = 0, lIndex, height, heightOnebehind;
      var low = 0; 
      var high = this.rowHeights.length - 1;
      while(low <= high){
        //console.log("get un equal row height", height, heightOnebehind, low, high);
        var mid = Math.floor(low + (high - low)/2);
        height =  this.rowHeights.slice(0, mid+1).reduce(function(res, height){
          return res += height;
        },0);
        heightOnebehind = height + this.rowHeights[fIndex];
        if(this.currentScrollY < this.rowHeights[0]){
          fIndex = 0; 
          break;
        }
        if(heightOnebehind < this.currentScrollY){
           low = mid +1;
        }
        if(height > this.currentScrollY){
           high = mid - 1;
        }
        if((this.currentScrollY > height && this.currentScrollY < heightOnebehind) || this.currentScrollY === height || this.currentScrollY === heightOnebehind ){
          fIndex = mid;
          break;
        }
        fIndex = mid;
      }
      //console.log("get first index:", fIndex);
      lIndex = this.getUnequalLastIndex(fIndex);
      return {
        firstIndex: fIndex,
        lastIndex: lIndex,
      }
    },
    getUnequalLastIndex: function(fIndex){
      var lIndex;
      for(var i = fIndex + 1, len = this.rowHeights.length; i < len; i++){
        var fullHeight = this.rowHeights.slice(0, i + 1).reduce(function(res, height){
          return res += height;
        }, 0);
        if(fullHeight >= this.currentScrollY + this.viewHeight){
          lIndex = i;
          break;
        }
        lIndex = i;
      } // end for
      //console.log('get last index', fullHeight, this.currentScrollY, this.viewHeight);
      return lIndex;
    },
    handleHorizontalScroll: function(){
      var lastPos = 0;
      //var currentPos = $(ev.target).scrollLeft();
      var currentPos = this.currentScrollX;
      var thead = $(this.$el).find('.vu-thead');
      if(lastPos !== currentPos){
        thead.css('left', 0-currentPos + 'px');
      } else {
        thead.css('left', 0 + 'px');
      }
      //var oldWidth = $(ev.target).width();
      var oldWidth = this.tbodyWidth;
      thead.width(oldWidth + currentPos);
    },
    thResized: function(args){
      this.colWidths[args.index] = args.target.width();
      this.colWidths = this.colWidths.slice(); // need change reference to trigger watch
      this.changeIndex = args.index;
      this.changeWidth = args.changeWidth;
    },
    trClicked: function(args){
      this.displayrows[args.displayIdx].selected = !this.displayrows[args.displayIdx].selected;
      console.log('table get click event', this.sortedRows[args.rowIdx].active, this.displayrows[args.displayIdx].active);
    },
    thOnClick: function(colDef){
      console.log(colDef, 'DESC:', this.sortDesc);
      if(this.sortKey === colDef){
        this.sortDesc = !this.sortDesc;
      } else {
        this.sortKey = colDef;
        this.sortDesc = true; // default to DESC
      }
    },
    groupToggleExpand: function(args){
      console.log('get event toggle expand', args.groupName);
      var groupName = args.groupName;
      this.groupedMap.get(groupName).isExpand = !this.groupedMap.get(groupName).isExpand;
      this.sortedRows = this.groupMapToArr();
      this.setScrollHeight();
      console.log('scroll height changed: ', this.scrollHeight);
      this.initCopyRow();
    },
    windowsResize: function(){
      // buffer height will change in computed according to viewHeight
      this.viewHeight = $(window).height();
      //console.log('view height', this.viewHeight, 'scroll height', tbody.height());
    },
    setScrollHeight: function(){
      var scrollHeight;
      if(this.isUnequalRowHeight){
        scrollHeight = this.rowHeights.reduce(function(res, height){
          return res += height;
        }, 0);
      } else {
        scrollHeight = this.sortedRows.length * this.setRowHeight;
      }
      this.scrollHeight = scrollHeight;
        //return scrollHeight;

      this.$nextTick(function(){
        var tbodyContainer = $(this.$el).find('.vu-tbody-container');
        tbodyContainer.height(this.scrollHeight);
      });
    },
    onResize: function(){
      this.throttle(this.windowsResize, this, 1000/60);
    },
    throttle: function(method, context, delay){
      //console.log('in throttle: ', method.tId);
      clearTimeout(method.tId);
      method.tId = setTimeout(function(){
        method.call(context);
        //method.apply(context,args);
      }, delay);
    },
  },
  mounted: function(){
    var ths = $(this.$el).find('.vu-thead > .vu-th:not(".fixed-th")').toArray();
    ths.forEach(function(th){
      var width = $(th).width();
      this.colWidths.push(width);
      $(th).css("width", width); // for resize
      $(th).css("flexGrow", "0"); // for resize
    }, this);
    this.windowsResize();
    // unbind in beforeDestroy
    $(window).bind('resize', this.onResize);
  },
  computed:{
    isExpandAll: function(){
      return this.collapseOrExpandAll;
    },
    displayrows: function(){
      return this.copyrows;
    },
    bufferRowCount: function(){
      //here to set the buffer row
      var bufferTimes = 0;
      return this.viewHeight * bufferTimes / this.setRowHeight;
    },
    /*
    // tbody with scroll height base on set rowHeight and raw data count
    scrollHeight: function(){
      var scrollHeight;
      if(this.isUnequalRowHeight){
        scrollHeight = this.rowHeights.reduce(function(res, height){
          return res += height;
        }, 0);
      } else {
        scrollHeight = this.sortedRows.length * this.setRowHeight;
      }
      console.log('scroll height change:', scrollHeight);
      return scrollHeight;
    },
    */
    sortKeyAndDir: function(){
      return [this.sortKey, this.sortDesc].join();
    },
  },
  watch:{
    sortKeyAndDir: function(){
      this.sortedRows = this.getSortedRows();
      if(this.groupKey && this.colDefs.indexOf(this.groupKey) > 0){
        this.sortedRows = this.getGroupedRows();
        // all group reset to expand need emit event to change parent collapseOrExpandAll
        this.$emit('expand-all',{});
      }
      //this.setScrollHeight(); // will call collapseOrExpandAll to re calculate scroll height
      this.initCopyRow();
    },
    collapseOrExpandAll: function(){
        console.log('Watch collapse or expand all changed: ');
        var self = this;
        this.groupedMap.forEach(function(val){val.isExpand = self.isExpandAll;});
        this.sortedRows = this.groupMapToArr();
        this.setScrollHeight();
        console.log('scroll height changed: ', this.scrollHeight);
        this.initCopyRow();
    },
  },
  beforeDesdroy: function(){
    $(window).unbind('resize');
  },
  updated: function(){
    console.log('table updated', this.currentScrollY, this.scrollHeight, this.rowTranslateY);
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.vu-table {
  height: 600px;
  width: 1000px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.vu-table .vu-thead {
  position: relative;
  height: 28px;
  display: flex;
  background-color: #d2d4d6;
  align-items: center;
  padding-right: 25px;
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

  display: inline-flex;
  align-items: center;
  justify-content: space-around;
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
  /* keep here to see if need
  scroll-snap-type: y mandatory;
  older spec implementation 
  scroll-snap-destination: 0% 100%;
  scroll-snap-points-y: repeat(100%);
  */
}
.vu-table .vu-tbody .vu-tbody-container {
  height: 100%;
}
/*
.vu-table .vu-tbody >>> .vu-format-tr {
  display: flex;
  align-items: center;
  background-color: #f9f9f9;
}
.vu-table .vu-tbody >>> .vu-format-tr.odd {
  background-color: #eff4f7;
}
.vu-table .vu-tbody .vu-format-tr >>> .vu-td {
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
*/
.indicator {
  display: inline-block;
}
.right-arrow {
  width:0;
  height: 0;
  border-top: 5px solid transparent;
  border-left: 10px solid #333;
  border-bottom: 5px solid transparent;
}
.down-arrow {
  width:0;
  height: 0;
  border-top: 10px solid #333;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
}
.up-arrow {
  width:0;
  height: 0;
  border-bottom: 10px solid #333;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
}
</style>