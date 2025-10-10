import { makeId } from '../../../services/util.service'
import editPen from '/icons/edit-pen.svg'

export function LabelsList({ labels, switchEditMode, onSaveLabel}) {

    return (
        <>
            <ul className="label-list">
                {labels.map(label => {
                    return <li key={label.id}
                        onClick={() => onSaveLabel(label)}
                        className="label"
                        style={{ backgroundColor: `var(${label.cssVar})`, cursor: 'pointer' }}>
                        {label.txt}
                    </li>
                })}
                <li className="label"
                    onClick={() => onSaveLabel({ txt: 'Default Label', cssVar: '--group-title-clr18', id: makeId() })}
                    style={{ backgroundColor: 'var(--group-title-clr18)', color: 'var(--group-title-clr18)' }}>
                    Default Label
                </li>
            </ul>
            <button onClick={switchEditMode} className='edit-labels-btn'>
                <img className='icon big' src={editPen} alt="Edit Icon" /> Edit Labels</button>
        </>
    )
}