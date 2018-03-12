<template>
  <div class="hello">
    <!--
    <h1>{{ msg }}</h1>
      <vu-table v-bind:col-defs="colDefs" v-bind:rows="rows" ng-non-bindable> </vu-table>
      -->
      <vuTable v-bind:col-defs="colDefs" v-bind:rows="rows"></vuTable>
  </div>
</template>

<script>
import vuTable from './table.vue'
//import vuRowFormat from './vu-row-format.vue'
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
      //colDefs: ["threat", "threattype", "threatlevel", "threatweight", "incidents"],

    }
  },
  computed: {
    rows: function(){
      var arr = [];
      for(var i = 0, len = 100000; i<len; i++){
        var subarr = [];
        for(var j=0, jlen = 50; j<jlen; j++){
          subarr.push("test" + (i+1));
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
