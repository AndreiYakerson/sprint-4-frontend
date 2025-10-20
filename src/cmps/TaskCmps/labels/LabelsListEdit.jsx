//Services
import { useEffect, useState } from 'react'
import { showErrorMsg, showSuccessMsg } from '../../../services/event-bus.service'
import { boardService } from '../../../services/board'
//Cmp

import { FloatingContainerCmp } from '../../FloatingContainerCmp'
//Icons

import { SvgIcon } from '../../SvgIcon'
import { getVarColors } from '../../../services/util.service'
import { ActionsMenu } from '../../ActionsMenu'
import { useSelector } from 'react-redux'

export function LabelsListEdit({ labels, onUpdateLabels, onSwitchEditMode, onClose, type }) {
    const board = useSelector(state => state.boardModule.board)
import { onCloseFloating, onCloseFloatingSecondary, onSetFloatingSecondary } from '../../../store/actions/system.actions'
import { ColorPalette } from './ColorPalette'

    const [anchorEl, setAnchorEl] = useState()
    const [colorAnchorEl, setColorAnchorEl] = useState()
    const [labelsToUpdate, setLabelsToUpdate] = useState(labels)
    const [labelsInUse, setLabelsInUse] = useState()
    const [editingLabel, setEditingLabel] = useState()
    const bgColors = getVarColors()

    useEffect(() => {
        const active = []
        board.groups.forEach(group =>
            group.tasks.forEach(task => {
                const label = task[type]
                label &&
                    // label.id !== 'default' &&
                    !active.some(l => l.id === label.id) &&
                    active.push(label)
            })
        )
        setLabelsInUse(active)
    }, [board, type])
    useEffect(() => {
        if (colorAnchorEl && editingLabel) {
            onCloseFloatingSecondary()
            onSetFloatingSecondary(
                <ColorPalette
                    bgColors={bgColors}
                    handelColorChange={handelColorChange}
                    label={editingLabel} />
                , colorAnchorEl)
        }
    }, [colorAnchorEl, editingLabel])

    useEffect(() => {
        if (anchorEl && editingLabel) {
            onCloseFloatingSecondary()
            onSetFloatingSecondary(
                <button className='now-con' onClick={() => {
                    onCloseFloating()
                    onRemoveLabel(editingLabel.id)
                }}>
                    <SvgIcon iconName='trash' size={20} />
                </button>
                , anchorEl)
        }
    }, [colorAnchorEl, editingLabel])


    function handelChange(ev, id) {
        const value = ev.target.value
        setLabelsToUpdate(prevLabels => {
            return prevLabels.map(label => label.id === id ? { ...label, txt: value } : label)
        })
    }

    function handelColorChange(color, id) {
        setEditingLabel(prevLabel => ({ ...prevLabel, cssVar: color }))
        setLabelsToUpdate(prevLabels => {
            let labels = prevLabels.map(label => label.id === id ? { ...label, cssVar: color } : label)
            onUpdateLabels(labels)
            setColorAnchorEl(null)
            return labels
        })
        setTimeout(() => {
            onCloseColorPallet()
        }, 0);
    }



    function changeLabelColor(ev, id) {
        const label = labelsToUpdate.find(label => label.id === id)
        onOpenColorPallet(ev, label)
    }

    function onOpenColorPallet(ev, label) {
        setEditingLabel(label)
        setColorAnchorEl(ev.currentTarget)
    }

    function onCloseColorPallet() {
        setEditingLabel(null)
        setColorAnchorEl(null)
        onClose()
    }

    function onOpenActionMenu(ev, id) {
        setAnchorEl(ev.currentTarget);
        let labelToEdit;
        if (id === 'default') {
            labelToEdit = { id: 'default', txt: 'Default Label', cssVar:' --group-title-clr18'};
        } else {
            labelToEdit = labelsToUpdate.find(label => label.id === id);
        }
        setEditingLabel(labelToEdit);
}

function onCloseMenu() {
    setAnchorEl(null)
    setEditingLabel(null)
}

function onRemoveLabel(id) {
    if (labelsInUse.some(label => label.id === id)) {
        return showErrorMsg(' Cannot remove label')
    }
    setLabelsToUpdate(prev => {
        const labels = prev.filter(label => label.id !== id)
        onUpdateLabels(labels)
        return labels
    })
    showSuccessMsg(' label removed')
    setAnchorEl(null)
}

function addNewLabel() {
    const newLabel = boardService.getEmptyPriorityLabel()
    setLabelsToUpdate(prev => {
        const labels = [...prev, newLabel]
        onUpdateLabels(labels)
        return labels
    })
    showSuccessMsg('new label added')
}

function onApply() {
    onUpdateLabels(labelsToUpdate)
    onSwitchEditMode()
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
                            onBlur={() => onUpdateLabels(labelsToUpdate)}
                            onKeyDown={ev => ev.key === 'Enter' && handelChange(ev, label.id)}
                            onChange={(ev) => handelChange(ev, label.id)}
                        />
                    </section>

                    <button className={`more-icon-btn ${anchorEl && editingLabel?.id === label?.id ? "open" : ""}`}
                        onClick={(ev) => onOpenActionMenu(ev, label.id)}>
                        <SvgIcon iconName='dots' size={16} />
                    </button>

                    {anchorEl && editingLabel && (
                        <FloatingContainerCmp anchorEl={anchorEl} onClose={onCloseMenu}>
                            <span
                                data-type={' Labeled in use. Change it before'}
                                className={
                                    labelsInUse?.some(l => l.id === editingLabel.id)
                                        ?
                                        'active-label hover-show up'
                                        :
                                        ''
                                }>
                                <ActionsMenu
                                    onCloseMenu={onCloseMenu}
                                    isHrShown={false}
                                    onRemoveItem={() => onRemoveLabel(editingLabel.id)}
                                />
                            </span>
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
                        <input
                            placeholder={'Default Label'}
                        />

                    </section>

                    <button className={`more-icon-btn `}
                        onClick={(ev) => onOpenActionMenu(ev, 'default')}>
                        <SvgIcon iconName='dots' size={16} />
                    </button>

                </div>
            </li >

            <li className='label-list-edit-container '>
                <div className="label-list-edit-container flex"
                    onClick={addNewLabel}>
                    <span style={{ width: '16px' }}></span>
                    <section className='label new edit' >
                        <span
                            className="color-icon-container"
                            style={{ backgroundColor: 'transparent' }}>
                            <SvgIcon iconName='plus' size={16} />
                        </span>
                        <span className='new-label-tab'>New Label</span>
                    </section>
                </div>
            </li>
        </ul>
        <section className="actions">
            <button onClick={onApply}
                className='edit-apply-btn edit'> Apply </button>
        </section>
    </>
)
}