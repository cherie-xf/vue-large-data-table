<template>
  <div id="app">
    <!--
    <img src="./assets/logo.png">
    -->
    <HelloWorld msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
//import vuTable from './components/table.vue'
//import vuRowFormat from './components/vu-row-format.vue'
//import vuThResizer from './components/vu-th-resizer.vue'

export default {
  name: 'app',
  components: {
    HelloWorld,
    //vuTable,
    //vuRowFormat,
    //vuThResizer,
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 10px;
}
</style>
