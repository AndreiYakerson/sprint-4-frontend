//Services
import { useEffect, useState } from 'react'
import { showSuccessMsg } from '../../../services/event-bus.service'
import { boardService } from '../../../services/board'
//Cmp

import { FloatingContainerCmp } from '../../FloatingContainerCmp'
//Icons

import editPen from '/icons/edit-pen.svg'
import plus from '/icons/plus.svg'
import xMark from '/icons/x-mark.svg'
import { SvgIcon } from '../../SvgIcon'
import { getVarColors } from '../../../services/util.service'

export function LabelsListEdit({ labels, onUpdateLabels, onClose }) {
    const [anchorEl, setAnchorEl] = useState()
    const [colorAnchorEl, setColorAnchorEl] = useState()
    const [labelsToUpdate, setLabelsToUpdate] = useState(labels)
    const [editingLabel, setEditingLabel] = useState(labels)
    const bgColors = getVarColors()

    useEffect(() => {
        if (editingLabel) {
            setLabelsToUpdate(prevLabels => {
                let labels = prevLabels.map(label => label.id === editingLabel.id ? { ...label, cssVar: editingLabel.cssVar } : label)
                onUpdateLabels(labels)
                return labels
            })
        }

    }, [editingLabel])



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
    function handelColorChange(color, id) {
        setEditingLabel(prevLabel => ({ ...prevLabel, cssVar: color }))
        // setLabelsToUpdate(prevLabels => {
        // return prevLabels.map(label => label.id === id ? { ...label, cssVar: color } : label)
        // })
        setColorAnchorEl(null)
    }

    function changeLabelColor(ev, label) {
        setEditingLabel(label)
        setColorAnchorEl(ev.currentTarget)
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
                {labelsToUpdate.map(l => (
                    <li key={l.id} className="label-list-edit-container flex">
                        <span className="drag-icon">
                            <img className='icon' src={editPen} alt="icon color" />
                        </span>

                        <section className='label edit'>
                            <span
                                className="color-icon-container"
                                onClick={(ev) => changeLabelColor(ev, l)}
                                style={{ backgroundColor: `var(${l.cssVar})` }}
                            >
                                <SvgIcon iconName='bucket' size={16} colorName='whiteText' />
                            </span>


                            {colorAnchorEl && editingLabel?.id === l.id && (
                                <FloatingContainerCmp
                                    anchorEl={colorAnchorEl}
                                    onClose={() => setColorAnchorEl(null)}
                                >
                                    <div className='color-option-container'>
                                        {bgColors.map(color => (
                                            <span
                                                key={color}
                                                className='color-option'
                                                style={{ background: `var(${color})` }}
                                                onClick={() => handelColorChange(color, l.id)}
                                            />
                                        ))}
                                    </div>
                                </FloatingContainerCmp>
                            )}

                            <input
                                name='title'
                                type="text"
                                value={l.txt}
                                onBlur={updateLabel}
                                onKeyDown={ev => ev.key === 'Enter' && handelChange(ev, l.id)}
                                onChange={(ev) => handelChange(ev, l.id)}
                            />
                        </section>

                        <span className="more-icon" onClick={(ev) => setAnchorEl(ev.currentTarget)}>
                            <SvgIcon iconName='dots' size={16} />
                        </span>

                        {anchorEl && (
                            <FloatingContainerCmp anchorEl={anchorEl} onClose={() => setAnchorEl(null)}>
                                <button class='now-con' onClick={() => onRemoveLabel(l.id)}>
                                    <SvgIcon iconName='trash' size={20}  />
                                </button>

                                {/* <button onClick={() => onRemoveLabel(l.id)} className="delete">
                                    <img className='icon big' src={xMark} alt='delete icon' /> Delete
                                </button> */}
                            </FloatingContainerCmp>
                        )}
                    </li>
                ))}
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
                className='edit-apply-btn edit'> Apply </button>
        </>
    )
}