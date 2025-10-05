import { useEffectUpdate } from '../../../customHooks/useEffectUpdate'

import { useMemo, useState } from 'react'
import { FloatingContainerCmp } from '../../FloatingContainerCmp'
import { showSuccessMsg } from '../../../services/event-bus.service'
import { boardService } from '../../../services/board'
import { debounce } from '../../../services/util.service'

import editPen from '/icons/edit-pen.svg'
import plus from '/icons/plus.svg'
import xMark from '/icons/x-mark.svg'
import moreIcon from '/icons/more.svg'

export function PriorityListEdit({ labels, onSave, onUpdate, onClose }) {
    const [anchorEl, setAnchorEl] = useState()
    const [labelsToUpdate, setLabelsToUpdate] = useState(labels)

    const debounceUpdate = useMemo(() => {
        return debounce(updateLabel, 500)
    }, [onSave])

    useEffectUpdate(() => debounceUpdate(labelsToUpdate), [labelsToUpdate])

    function handelChange(ev, id) {
        const value = ev.target.value
        setLabelsToUpdate(prevLabels => {
            return prevLabels.map(label => label.id === id ? { ...label, txt: value } : label)
        })
    }

    function updateLabel(value) {
        onUpdate(value)
    }

    function onRemoveLabel(id) {
        const NewLabels = labelsToUpdate.filter(label => label.id !== id)
        setLabelsToUpdate(NewLabels)
        onUpdate(NewLabels)
        showSuccessMsg(' Priority label removed')
        setAnchorEl(null)
    }

    function addNewLabel() {
        const newLabel = boardService.getEmptyPriorityLabel()
        const updatedLabels = structuredClone(labels)
        updatedLabels.push(newLabel)
        setLabelsToUpdate(updatedLabels)
        onUpdate(updatedLabels)
        showSuccessMsg('new Priority label added')

    }

    return (
        <>
            <ul className='label-list edit'>
                {labelsToUpdate.map(label => {
                    return <li key={label.id} className="label-list-edit-container flex">
                        <span className="drag-icon">
                            <img className='icon ' src={editPen} alt="icon color" />
                        </span>
                        <section className='label edit'>
                            <span className="color-icon-container"
                                style={{ backgroundColor: `var(${label.cssVar})` }}>
                                <img className='icon ' src={editPen} alt="icon color" />
                            </span>
                            <input name='title'
                                type="text"
                                value={label.txt}
                                onBlur={() => onSave(labelsToUpdate)}
                                onKeyDown={e => e.key === 'Enter' && updateLabel(labelsToUpdate)}
                                onChange={(ev) => handelChange(ev, label.id)}
                            />
                        </section>
                        <span className="more-icon"
                            onClick={(ev) => setAnchorEl(ev.currentTarget)}>
                            <img className='icon ' src={moreIcon} alt="icon color" />
                        </span>

                        {anchorEl &&
                            <FloatingContainerCmp
                                anchorEl={anchorEl}
                                onClose={() => setAnchorEl(null)}
                            >
                                <button onClick={() =>
                                    onRemoveLabel(label.id)}
                                    className="delete">
                                    <img className='icon big' src={xMark} alt='delet icon' /> Delete
                                </button>
                            </FloatingContainerCmp>}

                    </li>
                })}
                <li className='default label edit'>
                    <span className="color-icon-container"
                        style={{ backgroundColor: '#c4c4c4' }}>
                        <img className='icon ' src={editPen} alt="icon color" />
                    </span>
                    Default Label
                </li>
                <li className='new-label-container '>
                    <div className="new label edit"
                        onClick={addNewLabel}>
                        <span
                            className="color-icon-container edit"
                            style={{ backgroundColor: 'transparent' }}>
                            <img className='icon' src={plus} alt="icon color" />
                        </span>
                        New Label
                    </div>
                </li>
            </ul>
            <button onClick={() => {
                onClose()
                onUpdate(labelsToUpdate)
            }}
                className='edit-labels edit'> Apply </button>
        </>
    )
}