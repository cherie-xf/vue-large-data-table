<template>
  <div id="app">
    <!--
    <img src="./assets/logo.png">
    -->
    <init msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script>
import init from './components/init.vue'

export default {
  name: 'app',
  components: {
    init,
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
