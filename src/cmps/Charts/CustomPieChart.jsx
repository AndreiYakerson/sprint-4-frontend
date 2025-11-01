import { PieChart } from "./PieChart";

export function CustomPieChart({ data }) {
    console.log("🚀 ~ CustomPieChart ~ data:", data)
    const { byStatus } = data

    return (
        <div className="custom-pie-chart">
            <span className="pai-chart-container"> <PieChart data={data} /> </span>
            <ul className="labels">
                {byStatus.map(status => {
                    const color = getComputedStyle(document.documentElement).getPropertyValue(status.cssVar.trim()).trim()
                    console.log("🚀 ~ CustomPieChart ~ color:", color)
                    return <li key={status.txt} className="label">
                        <span className="circle" style={{ backgroundColor:color}}></span>
                        <span className="text text-overflow">{status.txt}</span>
                        <span className="percentage">{status.tasksPercentage}%</span>
                    </li>;
                }
                )}
            </ul>
        </div>
    )
}