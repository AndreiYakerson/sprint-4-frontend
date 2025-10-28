import Chart from 'chart.js/auto'
import { useEffect, useRef } from "react"

export function PieChart({ data }) {
  const canvasRef = useRef(null)
  const chartRef = useRef(null)

  useEffect(() => {
    if (!data?.byStatus?.length) return
    const ctx = canvasRef.current.getContext("2d")
    if (chartRef.current) chartRef.current.destroy()
    const filteredStatusData = data.byStatus.filter(s => s.id !== 'default');

    const root = getComputedStyle(document.documentElement)
    const labels = filteredStatusData.map(s => s.txt);
    const values = filteredStatusData.map(s => s.tasksCount);
    const colors = filteredStatusData.map(s => root.getPropertyValue(s.cssVar.trim()).trim() || '#ccc');

    chartRef.current = new Chart(ctx, {
      type: "pie",
      data: {
        labels,
        datasets: [{
          data: values,
          backgroundColor: colors,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: {
          padding: {
            right: 10, // Increase this value to move the pie chart further left
          }
        },
        plugins: {
          legend: {
            position: "right",

            labels: {
              // font:{size:20},
              usePointStyle: true,
              padding: 20,
              generateLabels: (chart) => {
                const total = chart.data.datasets[0].data.reduce((a, b) => a + b, 0)
                return chart.data.labels.map((label, i) => ({
                  text: `${label} (${((chart.data.datasets[0].data[i] / total) * 100).toFixed(1)}%)`,
                  fillStyle: chart.data.datasets[0].backgroundColor[i],
                }))
              },
            },
          },
        },
      },
    })

    return () => chartRef.current.destroy()
  }, [data])

  return <canvas ref={canvasRef}></canvas>
}
