<template>
  <div class="hello">
    <!--
    <h1>{{ msg }}</h1>
      <vu-table v-bind:col-defs="colDefs" v-bind:rows="rows" ng-non-bindable> </vu-table>
      -->
      <div class="toolbar">
        <div>
          <label for="checkbox">Expand All</label>
          <input type="checkbox" id="checkbox" v-model="collapseOrExpandAll">
        </div>
        <div>
          <button v-on:click="getLargeData">Display (300k x 10) rows</button>
        </div>
        <div>
          <button v-on:click="getSvgData">Display Svg Graph Data</button>
        </div>
        <div>
          <button v-on:click="getGroupData">Display group Data</button>
        </div>
        <div>
          <button v-on:click="getLargeCol">Display (100k x 50) rows</button>
        </div>
      </div>
      <h2>{{message}}</h2>
      <div class="table">
        <vuTable @expand-all="setExpandAll" 
          :col-defs="colDefs" 
          :rows="rows" 
          :show-svg="showSvg"
          :show-unequal="showUnequal"
          :collapse-or-expand-all="collapseOrExpandAll"></vuTable>
      </div>


  </div>
</template>

<script>
import vuTable from './table.vue'
//import vuRowFormat from './vu-row-format.vue'
//const dataURL = "https://mdn.github.io/learning-area/javascript/oojs/json/superheroes.json";
const dataURL = "https://cdn.rawgit.com/Swimlane/angular-data-table/master/demos/data/olympics.json";
export default {
  name: 'init',
  props: {
    msg: String
  },
  components:{
    vuTable
    //vuRowFormat

  },
  data: function(){
    return {
      //colDefs: ["id","squadName", "selected", "formed", "homeTown", "members","secretBase"],
      //colDefs: ["age","athlete", "bronze", "country", "date", "gold","silver", "sport", "total","year"],
      rows:[],
      colDefs:[],
      groupData:{},
      largeData:{},
      largeCol:{},
      svgData:{},
      jsonObj: null,
      isDataReady: false,
      jsonData: [],
      collapseOrExpandAll: true, // true : expand all, fasle: collapse all
      showSvg:false,
      showUnequal: false,
      message:"",
    }
  },
  created: function(){
    this.createLargeData();
    this.createLargeCol();
    this.createGroupData();
    this.createdSvgData();
    this.getLargeData();
  },
  computed: {
    /*
    rows: {
      get: function(){
        var arr = [];
        for(var i = 0, len = 100000; i<len; i++){
          //var tempObj = Object.assign({},this.jsonObj);
          var tempObj = $.extend({id: i}, this.jsonObj);
          tempObj.id = i+1;
          tempObj.formed = Math.floor(Math.random() * (2018 - 1956)) + 1956;
          tempObj.squadName = Math.random().toString(36).substr(2, 5)
 + tempObj.squadName;
        arr.push(tempObj);
        }
        return arr;
      },
    }
    */
  },
  methods: {
    createLargeData: function(){
      var rowarr = [];
      for(var i = 0, len = 300000; i<len; i++){
        var subarr = [];
        for(var j=0, jlen = 10; j<jlen; j++){
          subarr.push('td-'+ Math.random().toString(36).substr(2, 5));
        }
        rowarr.push(subarr);
      }
      var colarr = [];
      for(var k = 0, klen = 10; k < klen; k++){
        colarr.push('title' + (k+1));
      }
      this.largeData = {
        rows: rowarr,
        colDefs: colarr,
      };
    },
    createLargeCol: function(){
      var rowarr = [];
      for(var i = 0, len = 100000; i<len; i++){
        var subarr = [];
        for(var j=0, jlen = 50; j<jlen; j++){
          subarr.push('td-'+ Math.random().toString(36).substr(2, 5));
        }
        rowarr.push(subarr);
      }
      var colarr = [];
      for(var k = 0, klen = 50; k < klen; k++){
        colarr.push('title' + (k+1));
      }
      this.largeCol = {
        rows: rowarr,
        colDefs: colarr,
      };
    },
    createGroupData: function(){
      var colDefs = ["id","selected","athlete","age", "country", "year", "date","sport", "gold", "silver", "bronze","total"];
      this.groupData.colDefs = colDefs;
      this.groupData.rows = [];
      var self = this; // create a closure to access component in the callback below
      $.getJSON(dataURL, function(data) {
        /*
        self.jsonObj = {};
        self.jsonObj.squadName = data.squadName;
        self.jsonObj.active = !(data.active);
        self.jsonObj.formed = data.formed;
        self.jsonObj.homeTown = data.homeTown;
        self.jsonObj.members = data.members;
        self.jsonObj.secretBase = data.secretBase;
        console.log('init data, json object:', self.jsonObj);
        */
      for(var i = 0, len = data.length; i< len; i++){
        data[i] = $.extend({id: i+1, selected: false}, data[i]);

      }
      self.jsonData = data;
      self.groupData.rows = data;
      }, function(e){
        console.log('init data, json object , erro:', e);
      });
    },
    createdSvgData:function(){
      var rowarr = [];
      for(var i = 0, len = 10000; i<len; i++){
        var subarr = [];
        for(var j=0, jlen = 5; j<jlen; j++){
          subarr.push('td-'+ Math.random().toString(36).substr(2, 5));
        }
        rowarr.push(subarr);
      }
      var colarr = [];
      for(var k = 0, klen = 5; k < klen; k++){
        colarr.push('title' + (k+1));
      }
      this.svgData = {
        rows: rowarr,
        colDefs: colarr,
      };
    },
    setExpandAll: function(){
      console.log('get expand all in init');
      this.collapseOrExpandAll = true;
    },
    getLargeData: function(){
      this.rows = this.largeData.rows;
      this.colDefs = this.largeData.colDefs;
      this.showSvg = false;
      this.showUnequal = false;
      this.message="Display 30k x 10 Data";
    },
    getLargeCol: function(){
      this.rows = this.largeCol.rows;
      this.colDefs = this.largeCol.colDefs;
      this.showSvg = false;
      this.showUnequal = false;
      this.message="Display 10k x 50 Data";
    },
    getGroupData: function(){
      this.rows = this.groupData.rows;
      this.colDefs = this.groupData.colDefs;
      this.showSvg = false;
      this.showUnequal = false;
      this.message="Display Group Data";
    },
    getSvgData: function(){
      this.rows = this.svgData.rows;
      this.colDefs = this.svgData.colDefs;
      this.showSvg = true;
      this.showUnequal = false;
      this.message="Display Svg Graph Data";
    },
    getUnequalData: function(){
      this.rows = this.svgData.rows;
      this.colDefs = this.svgData.colDefs;
      this.showSvg = false;
      this.showUnequal = true;
      this.message="Display Not Equal Row Height Data";
    }
  },
  watch: {
    jsonObj: function(){
      console.log('init get async data, set data ready flag in watch');
      // very important for the ajax get data

    },
    jsonData: function(){
      console.log('init get async data, set data ready flag in watch');
      // very important for the ajax get data
      if(rows.length === 0){
        this.rows = this.groupData.rows;
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.hello{
  max-height: 100%;
  height: auto;
}
.toolbar{
  display: flex;
  justify-content: center;
}
.table {
  display: flex;
  justify-content: center;

}
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
