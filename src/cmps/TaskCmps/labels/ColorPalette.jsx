export function ColorPalette({bgColors , handelColorChange, label}) {
    return (
        <div className='color-option-container'>
            {bgColors.map(color => (
                <span
                    key={color}
                    className='color-option'
                    style={{ background: `var(${color})` }}
                    onClick={() => handelColorChange(color, label.id)}
                />
            ))}
        </div>)

}