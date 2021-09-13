<template>
  <div id="app">
    <h2>Temperature Sensor</h2>
    <Temperature/>
    <Graph/>
  </div>
</template>

<script>
import Graph from './components/Graph.vue'
import Temperature from "./components/Temperature.vue";

export default {
  name: 'App',
  components: {
    Graph,
    Temperature
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  /*margin-top: 60px;*/
}
</style>
