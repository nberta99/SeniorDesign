<template>
  <div class="graph">
    <canvas id="temperature-chart"></canvas>
  </div>
</template>

<script>
import Chart from 'chart.js'
import tempChartData from '../scripts/chart-data.js'
import Axios from 'axios';

export default {
  name: 'Graph',
  data() {
    return {
      tempChartData: tempChartData
    }
  },
  mounted() {
    const ctx = document.getElementById('temperature-chart');
    new Chart(ctx, this.tempChartData);
  }
}

async function getTempData() {
    let url = "http://localhost:3000/tempData";
    Axios.get(url).then((response) => {
      console.log(response.data)
      // tempChart.update()
    })
}

setInterval(function() {
  getTempData()
}, 700)
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
