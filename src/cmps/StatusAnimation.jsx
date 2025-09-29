
export function StatusAnimation({ color }) {
    const colorParts = color.split(',')
    const newPart = colorParts[1] - 30
    const newColor = color.replace(colorParts[1], newPart)

    return <div className="status-animation" style={{ background: `linear-gradient(45deg,${newColor} 50%, #ffffff  50%)` }}></div>
}