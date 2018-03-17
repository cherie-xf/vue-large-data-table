<template>
  <div class="hello">
    <!--
    <h1>{{ msg }}</h1>
      <vu-table v-bind:col-defs="colDefs" v-bind:rows="rows" ng-non-bindable> </vu-table>
      -->
      <vuTable v-bind:col-defs="colDefs" v-bind:rows="rows" v-if="isDataReady"></vuTable>
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
      colDefs: ["id","selected","athlete","age", "country", "year", "date","sport", "gold", "silver", "bronze","total"],
      jsonObj: null,
      isDataReady: false,
      jsonData: [],
    }
  },
  created: function(){
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

    }, function(e){
      console.log('init data, json object , erro:', e);

    });

  },
  computed: {
    rows: function(){
      return this.jsonData;
    }
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
    rows: function(){
      var arr = [];
      for(var i = 0, len = 100; i<len; i++){
        var subarr = [];
        for(var j=0, jlen = 50; j<jlen; j++){
          subarr.push("test test test" + (i+1));
        }
        arr.push(subarr);
      }
      return arr;
    },
    colDefs: function(){
      var arr = [];
      for(var i = 0, len = 50; i < len; i++){
        arr.push('title' + (i+1));
      }
      return arr;
    }
    */
  },
  watch: {
    jsonObj: function(){
      console.log('init get async data, set data ready flag in watch');
      // very important for the ajax get data
      this.isDataReady = true;

    },
    jsonData: function(){
      console.log('init get async data, set data ready flag in watch');
      // very important for the ajax get data
      this.isDataReady = true;
      
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.hello{
  max-height: 100%;
  height: auto;
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
