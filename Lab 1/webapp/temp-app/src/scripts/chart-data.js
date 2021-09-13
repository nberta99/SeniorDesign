export const tempChartData = {
    type: "line",
    data: {
      labels: Array(301).fill().map((_, idx) => 300 - idx),
      datasets: [
        {
          label: "Temperature Readings",
          data: Array(301).fill(35),
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
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
              padding: 5,
              min: 10,
              max: 50
            }
          }
        ]
      }
    }
  };
  
  export default tempChartData;