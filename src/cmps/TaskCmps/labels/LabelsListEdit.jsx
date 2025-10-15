//Services
import { useEffect, useState } from 'react'
import { showSuccessMsg } from '../../../services/event-bus.service'
import { boardService } from '../../../services/board'
//Cmp

import { FloatingContainerCmp } from '../../FloatingContainerCmp'
//Icons

import { SvgIcon } from '../../SvgIcon'
import { getVarColors } from '../../../services/util.service'

export function LabelsListEdit({ labels, onUpdateLabels, onClose }) {
    const [anchorEl, setAnchorEl] = useState()
    const [colorAnchorEl, setColorAnchorEl] = useState()
    const [labelsToUpdate, setLabelsToUpdate] = useState(labels)
    const [editingLabel, setEditingLabel] = useState()
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
        setLabelsToUpdate(prevLabels => {
            return prevLabels.map(label => label.id === id ? { ...label, cssVar: color } : label)
        })
        setColorAnchorEl(null)
    }

    function changeLabelColor(ev, id) {
        setEditingLabel(labelsToUpdate.find(label => label.id === id))
        setColorAnchorEl(ev.currentTarget)
    }

    function onOpenMenu(ev, id) {
        setAnchorEl(ev.currentTarget)
        setEditingLabel(labelsToUpdate.find(label => label.id === id))
    }

    function onCloseMenu() {
        setAnchorEl(null)
        setEditingLabel(null)
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
                {labelsToUpdate.map(label => (
                    <li key={label.id} className="label-list-edit-container flex">
                        <SvgIcon iconName='dragBox' size={16} className='drag-icon' />
                        <section className='label edit'>
                            <span
                                className="color-icon-container"
                                onClick={(ev) => changeLabelColor(ev, label.id)}
                                style={{ backgroundColor: `var(${label.cssVar})` }}
                            >
                                <SvgIcon iconName='bucket' size={16} colorName='whiteText' />
                            </span>


                            {colorAnchorEl && editingLabel?.id === label.id && (
                                <FloatingContainerCmp
                                    anchorEl={colorAnchorEl}
                                    onClose={onCloseMenu}
                                >
                                    <div className='color-option-container'>
                                        {bgColors.map(color => (
                                            <span
                                                key={color}
                                                className='color-option'
                                                style={{ background: `var(${color})` }}
                                                onClick={() => handelColorChange(color, label.id)}
                                            />
                                        ))}
                                    </div>
                                </FloatingContainerCmp>
                            )}

                            <input
                                name='title'
                                type="text"
                                value={label.txt}
                                onBlur={updateLabel}
                                onKeyDown={ev => ev.key === 'Enter' && handelChange(ev, label.id)}
                                onChange={(ev) => handelChange(ev, label.id)}
                            />
                        </section>

                        <button className="more-icon-btn" onClick={(ev) => onOpenMenu(ev, label.id)}>
                            <SvgIcon iconName='dots' size={16} />
                        </button>

                        {anchorEl && (
                            <FloatingContainerCmp anchorEl={anchorEl} onClose={onCloseMenu}>
                                <button className='now-con' onClick={() => onRemoveLabel(editingLabel.id)}>
                                    <SvgIcon iconName='trash' size={20} />
                                </button>
                            </FloatingContainerCmp>
                        )}
                    </li>
                ))}
                <li className='label-list-edit container '>
                    <div className="label-list-edit-container flex" >
                        <SvgIcon iconName='dragBox' size={16} className='drag-icon' />
                        <section className='label default edit' >
                            <span
                                className="color-icon-container"
                                style={{ backgroundColor: `var(--group-title-clr18)` }}
                            >
                                <SvgIcon iconName='bucket' size={16} colorName='whiteText' />
                            </span>
                            <SvgIcon iconName='pen' colorName='grayPerson' size={16} />
                            <input
                                placeholder={'Default Label'}
                            />

                        </section>
                        <button className="more-icon-btn" onClick={(ev) => onOpenMenu(ev, label.id)}>
                            <SvgIcon iconName='dots' size={16} />
                        </button>
                    </div>
                </li >

                <li className='label-list-edit container '>
                    <div className="label-list-edit-container flex"
                        onClick={addNewLabel}>
                        <span style={{ width: '16px' }}></span>
                        <section className='label default edit' >
                            <span
                                className="color-icon-container"
                                style={{ backgroundColor: 'transparent' }}>
                                <SvgIcon iconName='plus' size={16} />
                            </span>
                            <input
                                placeholder={'New Label'}
                            />
                        </section>
                    </div>
                </li>
            </ul>
            <section className="actions">
                <button onClick={updateLabel}
                    className='edit-apply-btn edit'> Apply </button>
            </section>
        </>
    )
}