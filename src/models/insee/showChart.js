import Chart from 'chart.js/auto'

export function addChart(divId, data, xdata, ydata, label) {
  return new Chart(
    document.getElementById(divId),
    {
      type: 'bar',
      data: {
        labels: data.map(row => row[xdata]),
        datasets: [
          {
            label: label,
            data: data.map(row => row[ydata])
          }
        ]
      }
    }
  )
}