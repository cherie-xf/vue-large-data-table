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
  name: 'HelloWorld',
  props: {
    msg: String
  },
  components:{
    vuTable
    //vuRowFormat

  },
    data: function(){
    return {
      colDefs: ["threat", "threattype", "threatlevel", "threatweight", "incidents"],

    }
  },
  computed: {
    rows: function(){
      var arr = [];
      for(var i = 0, len = 200; i<len; i++){
        var subarr = [];
        for(var j=0, jlen = 5; j<jlen; j++){
          subarr.push("test");
        }
        arr.push(subarr);

      }
      console.log(arr);
      return arr;
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
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
