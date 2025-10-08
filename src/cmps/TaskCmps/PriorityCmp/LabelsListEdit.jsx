//Services
import { useState } from 'react'
import { showSuccessMsg } from '../../../services/event-bus.service'
import { boardService } from '../../../services/board'
//Cmp

import { FloatingContainerCmp } from '../../FloatingContainerCmp'
//Icons

import editPen from '/icons/edit-pen.svg'
import plus from '/icons/plus.svg'
import xMark from '/icons/x-mark.svg'
import moreIcon from '/icons/more.svg'

export function LabelsListEdit({ labels, onUpdateLabels, onClose }) {
    const [anchorEl, setAnchorEl] = useState()
    const [labelsToUpdate, setLabelsToUpdate] = useState(labels)


    function updateLabel() {
        onUpdateLabels(labelsToUpdate)
        onClose()
    }

    function handelChange(ev, id) {
        const value = ev.target.value
        setLabelsToUpdate(prevLabels => {
            return prevLabels.map(label => label.id === id ? { ...label, txt: value } : label)
        })
    }

    function onRemoveLabel(id) {
        setLabelsToUpdate(prev => {
            const labels = prev.filter(label => label.id !== id)
            onUpdateLabels(labels)
            return labels
        })
        showSuccessMsg(' Priority label removed')
        setAnchorEl(null)
    }

    function addNewLabel() {
        const newLabel = boardService.getEmptyPriorityLabel()
        setLabelsToUpdate(prev => {
            const labels = [...prev, newLabel]
            onUpdateLabels(labels)
            return labels
        })
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
                                onBlur={updateLabel}
                                onKeyDown={ev => ev.key === 'Enter' && handelChange(ev, label.id)}
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
                                <button onClick={() => onRemoveLabel(label.id)}
                                    className="delete">
                                    <img className='icon big' src={xMark} alt='delet icon' /> Delete
                                </button>
                            </FloatingContainerCmp>}

                    </li>
                })}
                <li className='default label edit'>
                    <span className="color-icon-container"
                        style={{ backgroundColor: 'var(--group-title-clr18)' }}>
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
            <button onClick={updateLabel}
                className='edit-labels edit'> Apply </button>
        </>
    )
}