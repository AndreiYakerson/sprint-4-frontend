import Chart from 'chart.js/auto'
import { useEffect, useRef, useState } from "react"

export function PieChart({ data }) {
  const canvasRef = useRef(null)
  const chartRef = useRef(null)

  // const [windowWidth, setWindowWidth] = useState(window.innerWidth)

  // useEffect(() => {
  //   function handleResize() {
  //     setWindowWidth(window.innerWidth)
  //   }
  //   window.addEventListener('resize', handleResize)
  //   return () => window.removeEventListener('resize', handleResize)
  // }, [])

  useEffect(() => {
    if (!data?.byStatus?.length) return
    const ctx = canvasRef.current.getContext("2d")
    if (chartRef.current) chartRef.current.destroy()
    const filteredStatusData = data.byStatus.filter(s => s.id !== 'default');

    const root = getComputedStyle(document.documentElement)
    const labels = filteredStatusData.map(s => s.txt);
    // למה לא להראות את הnot started
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
            display: false,
            position: "right",
          },
        },
      },
    })

    return () => chartRef.current.destroy()
  }, [data])

  return <canvas ref={canvasRef}></canvas>
}
