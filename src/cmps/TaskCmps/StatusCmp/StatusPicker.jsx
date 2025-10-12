
// SERVICES
import { useEffect, useState } from "react";
import { updateBoard } from "../../../store/actions/board.actions.js";
import { useSelector } from "react-redux";
// COMPONENTS
import { LabelsListEdit } from "../labels/LabelsListEdit.jsx";
import { LabelsList } from "../labels/LabelsList.jsx";
import { FloatingContainerCmp } from "../../FloatingContainerCmp.jsx";
import { StatusAnimation } from "../../StatusAnimation.jsx";

export function StatusPicker({ info, onUpdate }) {
    const { selectedStatus, statuses } = info
    const board = useSelector(state => state.boardModule.board)
    const [selectedLabelId, setSelectedLabelId] = useState(selectedStatus?.id)
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [labels, setLabels] = useState(statuses)
    const [anchorEl, setAnchorEl] = useState()
    const label = labels.find(l => l.id === selectedLabelId)

    useEffect(() => {
        setLabels(statuses)
    }, [statuses])


    function onSaveLabel(label) {
        const newLabel = ({ ...label, updatedAt: Date.now() })
        console.log("🚀 ~ onSaveLabel ~ newLabel:", newLabel)
        setSelectedLabelId(newLabel.id)
        onUpdate(newLabel)
        onClose()
    }

    function onUpdateLabels(labels) {
        const newBoard = { ...board, statuses: labels }
        updateBoard(newBoard)
        setLabels(labels)
    }

    function onClose() {
        setIsEditOpen(false)
        setAnchorEl(null)
    }

    function switchEditMode() {
        setIsEditOpen(prev => prev = !prev)
    }

    const editMode = !isEditOpen ? 'apply' : ''

    const labelToShow = label ? label : labels.find(status => status.id === 'default')

    return (
        <div className={`labels-select-container ${anchorEl ? "focus" : ""}`}
            style={{ background: `var(${labelToShow?.cssVar})` }}
            onClick={(ev) => setAnchorEl(ev.currentTarget)}>
            <div className="label-txt">{labelToShow?.txt}</div>
            <StatusAnimation color={`var(${labelToShow?.cssVar})`} />

            {anchorEl &&
                <FloatingContainerCmp
                    anchorEl={anchorEl}
                    onClose={onClose}

                    centeredX={true}
                    showTriangle={true}
                    enforceLimit={true}
                >
                    <div className={`labels-container ${isEditOpen}`}>
                        <div className={`label-select ${isEditOpen}`}>
                            {!isEditOpen ?
                                <LabelsList labels={labels} onSaveLabel={onSaveLabel} onSwitchEditMode={switchEditMode} />
                                :
                                <LabelsListEdit labels={labels} onUpdateLabels={onUpdateLabels} onClose={onClose} onSwitchEditMode={switchEditMode} />
                            }

                        </div>
                    </div>


                </FloatingContainerCmp>}
        </div>
    )

}



