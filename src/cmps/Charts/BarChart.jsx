import { useRef, useEffect } from "react"
import Chart from "chart.js/auto"

export function BarChart({ data }) {
  const canvasRef = useRef(null)
  const chartRef = useRef(null)

  useEffect(() => {
    if (!data?.byStatus?.length) return
    const ctx = canvasRef.current.getContext("2d")
    if (chartRef.current) chartRef.current.destroy()

    const labels = data.byStatus.map(s => s.txt)
    const values = data.byStatus.map(s => s.tasksCount)

    chartRef.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            label: "Tasks by Status",
            data: values,
            backgroundColor: ["#00C853", "#FFD600", "#D50000"],
            borderRadius: 6,
            barThickness: 40,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          title: { display: true, text: "Tasks by Status" },
          tooltip: {
            callbacks: {
              label: (ctx) => {
                const total = ctx.dataset.data.reduce((a, b) => a + b, 0)
                const pct = ((ctx.parsed.y / total) * 100).toFixed(1)
                return `${ctx.parsed.y} tasks (${pct}%)`
              },
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: { stepSize: 1 },
          },
        },
      },
    })

    return () => chartRef.current.destroy()
  }, [data])

  return <canvas ref={canvasRef}></canvas>
}
