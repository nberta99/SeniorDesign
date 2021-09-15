<template>
  <div class="graph">
    <canvas id="temperature-chart"></canvas>
  </div>
</template>

<script>
import Chart from 'chart.js'
import tempChartData from '../scripts/chart-data.js'
import Axios from 'axios';

var tempUnit = 'C'
var updatedVal = false

export default {
  name: 'Graph',
  props: ['tempUnit'],
  data() {
    return {
      tempChartData: tempChartData
    }
  },
  watch: {
    tempUnit(val) {
      tempUnit = val
      updatedVal = true
    }
  },
  mounted() {
    const ctx = document.getElementById('temperature-chart');

    var tempChart = new Chart(ctx, this.tempChartData);
    async function getTempData() {
      let url = "http://localhost:3000/tempData" + `?unit=${tempUnit}`
      // console.log(tempUnit + " graph")
      Axios.get(url).then((response) => {
        addData(tempChart, response.data)
      })
    }

    function addData(chart, data) {
      chart.data.datasets.forEach((dataset) => {
          dataset.data = data
      });
      if (updatedVal) {
        changeAxes(chart)
      }
      chart.update();
    }

    function changeAxes(chart) {
      if (tempUnit == 'C') {
        chart.options.scales.yAxes[0].ticks.min = 10
        chart.options.scales.yAxes[0].ticks.max = 50
        chart.options.scales.yAxes[0].scaleLabel.labelString = 'Temperature (°C)'
      } else if (tempUnit == 'F') {
        chart.options.scales.yAxes[0].ticks.min = 50
        chart.options.scales.yAxes[0].ticks.max = 122
        chart.options.scales.yAxes[0].scaleLabel.labelString = 'Temperature (°F)'
      }
      chart.update();
    }

    setInterval(function() {
      getTempData()
    }, 700)
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
