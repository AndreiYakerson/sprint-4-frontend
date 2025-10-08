
export function StatusAnimation({ color }) {
   const varColor = color.replace(/var\((--[^)]+)\)/, '$1')
    console.log(color);
    

    const rgbColor = getCssVarAsRgb(varColor)
    const colorParts = rgbColor.split(',')
    const newPart = colorParts[1] - 30
    const newColor = rgbColor.replace(colorParts[1], newPart)
    return <div className="status-animation" style={{ background: `linear-gradient(45deg,${newColor} 50%, #ffffff  50%)` }}>
        <div className="task-editor-btn" style={{color: `${color}`}}>+</div>
    </div>
}

function getCssVarAsRgb(variableName) {
    const root = document.documentElement; // Get the root element (HTML)
    const cssVar = getComputedStyle(root).getPropertyValue(variableName); // Get the CSS variable value
    return cssVar.trim(); // Trim any extra whitespace
}