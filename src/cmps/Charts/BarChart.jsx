import { useRef, useEffect } from "react"
import Chart from "chart.js/auto"

export function BarChart({ data }) {
  const canvasRef = useRef(null)
  const chartRef = useRef(null)

  useEffect(() => {
    if (!data?.byPriority?.length) return
    const ctx = canvasRef.current.getContext("2d")
    if (chartRef.current) chartRef.current.destroy()
    const root = getComputedStyle(document.documentElement)
    const filteredStatusData = data.byPriority.filter(s => s.id !== 'default');

    const labels = filteredStatusData.filter(s => s.txt !== 'Default Label').map(s => s.txt)
    const values = filteredStatusData.map(s => s.tasksCount)
    const colors = filteredStatusData
      .filter(s => s.txt !== 'Default Label')
      .map(s => root.getPropertyValue(s.cssVar.trim()).trim() || '#ccc')

    chartRef.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            label: "Tasks by Priority",
            data: values,
            backgroundColor: colors,
            borderRadius: 6,
            barThickness: 40,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
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
            grid: {
                    color: 'rgb(236 236 236 / 50%)', 
                },
          },
          x:{ grid: {
                    color: '', 
                },}
        },
      },
    })

    return () => chartRef.current.destroy()
  }, [data])

  // Add style to the canvas element
  return <canvas ref={canvasRef} style={{ height: '100%' }}></canvas>
}