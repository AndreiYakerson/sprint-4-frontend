import editPen from '/icons/edit-pen.svg'

export function PriorityList({ labels, switchEditMode }) {

    return (
        <>
            <ul className="label-list">
                {labels.map(label => {
                    return <li key={label.id}
                        className="label"
                        style={{ backgroundColor:`var(${label.cssVar})`}}>
                        {label.txt}
                    </li>
                })}
                <li className="label"
                    style={{ backgroundColor: 'var(--group-title-clr18)', color: 'var(--group-title-clr18)' }}>
                    Default Label
                </li>
            </ul>
            <button onClick={switchEditMode} className='edit-labels'>
                <img className='icon big' src={editPen} alt="Edit Icon" /> Edit Labels</button>
        </>
    )
}