//Services
import { useEffect, useState } from 'react'
import { showErrorMsg, showSuccessMsg } from '../../../services/event-bus.service'
import { boardService } from '../../../services/board'
//Cmp
import { onCloseFloating, onCloseFloatingSecondary, onSetFloatingSecondary } from '../../../store/actions/system.actions'
import { ColorPalette } from './ColorPalette'
import { FloatingContainerCmp } from '../../FloatingContainerCmp'
//Icons

import { SvgIcon } from '../../SvgIcon'
import { getVarColors } from '../../../services/util.service'
import { ActionsMenu } from '../../ActionsMenu'
import { useSelector } from 'react-redux'

export function LabelsListEdit({ labels, onUpdateLabels, onSwitchEditMode, onClose, type }) {
    const board = useSelector(state => state.boardModule.board)

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
            const res = labelsInUse.some(l => l.id === editingLabel.id) || editingLabel.id === 'default' ? 'active-label hover-show up' : ''
            const data = editingLabel.id === 'default' ? 'Cannot remove Default label' : 'label in use, remove from tasks before delete'
            onCloseFloatingSecondary()
            onSetFloatingSecondary(
                <span className={res} data-type={data}>
                    <ActionsMenu
                        onCloseMenu={onCloseMenu}
                        isHrShown={false}
                        onRemoveItem={() => onRemoveLabel(editingLabel.id)}
                    />
                </span>
                , anchorEl)
        }
    }, [colorAnchorEl, editingLabel])


    function handelChange(ev, id) {
        const value = ev.target.value
        setLabelsToUpdate(prevLabels => prevLabels.map(label => label.id === id ? { ...label, txt: value } : label))
    }

    function handelColorChange(color, id) {
        const newLabels = labelsToUpdate.map(l => l.id === id ? { ...l, cssVar: color } : l)
        setEditingLabel(prevLabel => ({ ...prevLabel, cssVar: color }))
        setLabelsToUpdate(newLabels)
        onUpdateLabels(newLabels)
        onCloseColorPallet()
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
            labelToEdit = { id: 'default', txt: 'Default Label', cssVar: ' --group-title-clr18' };
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
        if (labelsInUse.some(label => label.id === id)) return showErrorMsg(' Cannot remove label')
        const newLabels = labelsToUpdate.filter(label => label.id !== id)
        setLabelsToUpdate(newLabels)
        showSuccessMsg(' label removed')
        onUpdateLabels(newLabels)
        setAnchorEl(null)
        onClose()

    }

    function addNewLabel() {
        const newLabel = boardService.getEmptyPriorityLabel()
        const newLabels = [...labelsToUpdate, newLabel]
        setLabelsToUpdate(newLabels)
        onUpdateLabels(newLabels)
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