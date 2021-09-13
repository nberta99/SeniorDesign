<template>
  <div id="app">
    <h2>Temperature Sensor</h2>
    <TempComponents/>
  </div>
</template>

<script>
import TempComponents from './components/TempComponents.vue'

export default {
  name: 'App',
  components: {
    TempComponents
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
