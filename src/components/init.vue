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
const dataURL = "https://mdn.github.io/learning-area/javascript/oojs/json/superheroes.json";
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
      colDefs: ["squadName", "selected", "formed", "homeTown", "members","secretBase"],
      jsonObj: null,
      isDataReady: false,
    }
  },
  created: function(){
    var self = this; // create a closure to access component in the callback below
    $.getJSON(dataURL, function(data) {
      self.jsonObj = {};
      self.jsonObj.squadName = data.squadName;
      self.jsonObj.active = !(data.active);
      self.jsonObj.formed = data.formed;
      self.jsonObj.homeTown = data.homeTown;
      self.jsonObj.members = data.members;
      self.jsonObj.secretBase = data.secretBase;
      console.log('init data, json object:', self.jsonObj);
    });

  },
  computed: {
    rows: {
      get: function(){
        var arr = [];
        for(var i = 0, len = 100000; i<len; i++){
        arr.push(this.jsonObj);
        }
        console.log('init computed rows:', this.jsonObj);
        return arr;
      },
    }
    /*
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
      console.log('init jsonObj watched change', this.jsonObj);
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
