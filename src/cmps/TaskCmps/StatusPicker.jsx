
// SERVICES
import { useEffect, useState } from "react";
import { updateBoard } from "../../store/actions/board.actions.js";
import { useSelector } from "react-redux";
// COMPONENTS
import { LabelsListEdit } from "./PriorityCmp/LabelsListEdit.jsx";
import { LabelsList } from "./PriorityCmp//LabelsList";
import { FloatingContainerCmp } from "../FloatingContainerCmp.jsx";
import { StatusAnimation } from "../StatusAnimation.jsx";

export function StatusPicker({ info, onUpdate }) {
    const { selectedStatus, statuses } = info
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [selectedLabelId, setSelectedLabelId] = useState(selectedStatus?.id)
    const [labels, setLabels] = useState(statuses)
    const board = useSelector(state => state.boardModule.board)
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

    const editMode = !isEditOpen ? 'apply' : ''

    const labelToShow = label ? label : labels.find(status => status.id === 'default')



    const [anchorEl, setAnchorEl] = useState()
    return (
        <div className={`priority-picker ${anchorEl ? "focus" : ""}`}
            style={{ background: `var(${labelToShow?.cssVar})` }}
            onClick={(ev) => setAnchorEl(ev.currentTarget)}>
            {labelToShow?.txt}
            <StatusAnimation color={`var(${labelToShow?.cssVar})`} />

            {anchorEl &&
                <FloatingContainerCmp
                    anchorEl={anchorEl}
                    onClose={onClose}

                    centeredX={true}
                    showTriangle={true}
                    enforceLimit={true}
                >
                    <div className={`priority-container ${isEditOpen}`}>
                        <div className={`priority-select ${isEditOpen}`}>
                            {!isEditOpen ?
                                <LabelsList labels={labels} onSaveLabel={onSaveLabel} switchEditMode={() => setIsEditOpen(prev => prev = !prev)} />
                                :
                                <LabelsListEdit labels={labels} onUpdateLabels={onUpdateLabels} onClose={onClose} />
                            }

                        </div>
                    </div>


                </FloatingContainerCmp>}
        </div>
    )

}



