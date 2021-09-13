export const tempChartData = {
    type: "line",
    data: {
      labels: Array(301).fill().map((_, idx) => 300 - idx),
      datasets: [
        {
          label: "Temperature Readings",
          data: Array(301).fill(null),
          backgroundColor: "rgba(54,73,93,.5)",
          borderColor: "#36495d",
          borderWidth: 3
        }
      ]
    },
    options: {
      legend: {
        display: false
      },
      title: {
        display: true,
        text: "Temperature Chart"
      },
      animation: {
        duration: 0
      },
      responsive: true,
      lineTension: 1,
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true,
            padding: 5,
            min: 10,
            max: 50
          },
          scaleLabel: {
            display: true,
            labelString: 'Temperature'
          }
        }],
        xAxes: [{
          ticks: {
            beginAtZero: true,
            padding: 5,
            min: 300,
            max: 0
          },
          scaleLabel: {
            display: true,
            labelString: 'Seconds Ago'
          }
        }]
      }
    }
  };
  
  export default tempChartData;