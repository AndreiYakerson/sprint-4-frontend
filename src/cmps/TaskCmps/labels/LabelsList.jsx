import { makeId } from '../../../services/util.service'
import { SvgIcon } from '../../SvgIcon'
import editPen from '/icons/edit-pen.svg'

export function LabelsList({ labels, onSwitchEditMode, onSaveLabel }) {

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
                {/* <li className="label"
                    onClick={() => onSaveLabel({ txt: 'Default Label', cssVar: '--group-title-clr18', id: 'default' })}
                    style={{ backgroundColor: 'var(--group-title-clr18)', color: 'var(--group-title-clr18)' }}>
                    Default Label
                </li> */}
            </ul>

            <section className="actions">
                <button onClick={onSwitchEditMode} className='edit-labels-btn'>
                    <SvgIcon iconName='pen' size={20} />
                    Edit Labels</button>
            </section>
        </>
    )
}