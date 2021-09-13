<template>
  <div class="temperature">
    <h1>75.1</h1>
    <button type="button" class="btn btn-info" onclick="changeUnit();">Change to Farenheit</button>
  </div>
</template>

<script>
export default {
  name: 'Temperature'
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
