import { makeId } from '../../../services/util.service'
import editPen from '/icons/edit-pen.svg'

export function PriorityList({ labels, switchEditMode, onUpdateTask }) {

    return (
        <>
            <ul className="label-list">
                {labels.map(label => {
                    return <li key={label.id}
                        onClick={() => onUpdateTask(label)}
                        className="label"
                        style={{ backgroundColor: `var(${label.cssVar})`, cursor: 'pointer' }}>
                        {label.txt}
                    </li>
                })}
                <li className="label"
                    onClick={() => onUpdateTask({ txt: 'Default Label', cssVar: '--group-title-clr18', id: makeId() })}
                    style={{ backgroundColor: 'var(--group-title-clr18)', color: 'var(--group-title-clr18)', cursor: 'pointer' }}>
                    Default Label
                </li>
            </ul>
            <button onClick={switchEditMode} className='edit-labels'>
                <img className='icon big' src={editPen} alt="Edit Icon" /> Edit Labels</button>
        </>
    )
}