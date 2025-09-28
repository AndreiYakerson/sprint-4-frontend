
export function StatusAnimation({ color }) {
    const colorParts = color.split(',')
    const newPart = colorParts[1] - 30
    const newColor = color.replace(colorParts[1], newPart)
    
    return <div className="status-animation" style={{ background: `linear-gradient(235deg, rgb(251, 251, 250) 50%, ${newColor} 50%)` }}></div>
}