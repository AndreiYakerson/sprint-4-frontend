import { PieChart } from "./PieChart";

export function CustomPieChart({ data }) {
    const { byStatus } = data
    console.log("🚀 ~ CustomPieChart ~ byStatus:", byStatus)

    return (
        <div className="custom-pie-chart">
            <span className="pai-chart"> <PieChart data={data} /> </span>
            <ul className="labels">
                {byStatus.map(status => <li key={status.txt} className="label"><span className="circle"></span> {status.txt}</li>)}
            </ul>
        </div>
    )
}