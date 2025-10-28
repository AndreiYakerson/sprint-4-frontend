import Chart from 'chart.js/auto'
import { useEffect, useRef } from "react"

export function PieChart({ data }) {
  console.log("🚀 ~ PieChart ~ data:", data)
  const canvasRef = useRef(null)
  const chartRef = useRef(null)

  useEffect(() => {
    if (!data?.byStatus?.length) return
    const ctx = canvasRef.current.getContext("2d")
    if (chartRef.current) chartRef.current.destroy()

    const root = getComputedStyle(document.documentElement)
    const labels = data.byStatus.map(s => s.txt)
    const values = data.byStatus.map(s => s.tasksCount)
    const colors = data.byStatus.map(s =>
      root.getPropertyValue(s.cssVar.trim()).trim() || '#ccc')
    console.log("🚀 ~ PieChart ~ colors:", colors)

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
        plugins: {
          legend: {
            position: "right",
            labels: {
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
