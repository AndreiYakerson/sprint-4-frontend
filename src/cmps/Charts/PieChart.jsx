import Chart from 'chart.js/auto'
import { useEffect, useRef } from "react"

// 🌟 Custom hover plugin for "Done" slice glow
const glowDonePlugin = {
  id: 'glowDoneSmooth',
  afterDraw(chart) {
    const activeElements = chart.getActiveElements()
    const ctx = chart.ctx
    if (!chart.$glow) chart.$glow = { alpha: 0, radius: 0 }

    // ① Fade out when not hovered
    if (!activeElements.length) {
      chart.$glow.alpha = Math.max(0, chart.$glow.alpha - 0.08)
      chart.$glow.radius = Math.max(0, chart.$glow.radius - 2)
      if (chart.$glow.alpha > 0 || chart.$glow.radius > 0)
        requestAnimationFrame(() => chart.update())
      return
    }

    // ② Identify hovered segment
    const { datasetIndex, index } = activeElements[0]
    const label = chart.data.labels[index]
    if (label.toLowerCase() !== 'done') {
      chart.$glow.alpha = Math.max(0, chart.$glow.alpha - 0.08)
      chart.$glow.radius = Math.max(0, chart.$glow.radius - 2)
      if (chart.$glow.alpha > 0 || chart.$glow.radius > 0)
        requestAnimationFrame(() => chart.update())
      return
    }

    // ③ Collect slice geometry and color
    const arc = chart.getDatasetMeta(datasetIndex).data[index]
    const color = chart.data.datasets[datasetIndex].backgroundColor[index]

    // ④ Animate glow outward
    chart.$glow.alpha = Math.min(0.5, chart.$glow.alpha + 0.08) // opacity limit
    chart.$glow.radius = Math.min(20, chart.$glow.radius + 2)   // expansion limit

    const innerR = arc.outerRadius
    const outerR = arc.outerRadius + chart.$glow.radius

    // ⑤ Build gradient that starts at the pie edge and fades outward
    const gradient = ctx.createRadialGradient(
      arc.x, arc.y, innerR,
      arc.x, arc.y, outerR
    )
    const rgba = color.replace('rgb', 'rgba').replace(')', ',')
    gradient.addColorStop(0, `${rgba} 0.4)`)   // inner edge: partially visible
    gradient.addColorStop(1, `${rgba} 0)`)     // outer edge: fade out

    // ⑥ Draw filled ring (attached glow)
    ctx.save()
    ctx.globalAlpha = chart.$glow.alpha
    ctx.beginPath()
    ctx.moveTo(arc.x, arc.y)
    ctx.arc(arc.x, arc.y, outerR, arc.startAngle, arc.endAngle)
    ctx.arc(arc.x, arc.y, innerR, arc.endAngle, arc.startAngle, true)
    ctx.closePath()
    ctx.fillStyle = gradient
    ctx.fill()
    ctx.restore()

    // ⑦ Continue animation while active
    if (chart.$glow.alpha < 0.5 || chart.$glow.radius < 20)
      requestAnimationFrame(() => chart.update())
  },
}

// Register plugin once
Chart.register(glowDonePlugin)

// 🔹 React component
export function PieChart({ data }) {
  const canvasRef = useRef(null)
  const chartRef = useRef(null)

  useEffect(() => {
    if (!data?.byStatus?.length) return
    const ctx = canvasRef.current.getContext("2d")
    if (chartRef.current) chartRef.current.destroy()

    const filteredStatusData = data.byStatus.filter(s => s.id !== 'default')
    const root = getComputedStyle(document.documentElement)
    const labels = filteredStatusData.map(s => s.txt)
    const values = filteredStatusData.map(s => s.tasksCount)
    const colors = filteredStatusData.map(
      s => root.getPropertyValue(s.cssVar.trim()).trim() || '#ccc'
    )

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
        plugins: {
          legend: { display: false },
          glowDoneSmooth: {}, // enable the custom plugin
        },
      },
    })

    return () => chartRef.current.destroy()
  }, [data])

  return <canvas ref={canvasRef}></canvas>
}
