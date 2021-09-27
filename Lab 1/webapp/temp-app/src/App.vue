<template>
  <div id="app">
    <h2>Temperature Sensor UI</h2>
    <!-- <TempComponents/> -->
    <NotificationInfo/>
  </div>
</template>

<script>
// import TempComponents from './components/TempComponents.vue'
import NotificationInfo from './components/NotificationInfo.vue'

export default {
  name: 'App',
  components: {
    // TempComponents,
    NotificationInfo
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
