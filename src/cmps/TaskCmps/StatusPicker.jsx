
// SERVICES
import { useState } from "react";
import { updateBoard } from "../../store/actions/board.actions.js";
import { useSelector } from "react-redux";
// COMPONENTS
import { LabelsListEdit } from "./PriorityCmp/LabelsListEdit.jsx";
import { LabelsList } from "./PriorityCmp//LabelsList";
import { FloatingContainerCmp } from "../FloatingContainerCmp.jsx";

export function StatusPicker({ info, onUpdate }) {
    const { selectedStatus, statuses } = info
    const [isEditOpen, setIsEditOpen] = useState(false)
    const board = useSelector(state => state.boardModule.board)

    function onSaveLabel(label) {
        onUpdate(label)
        onClose()
    }

    function onUpdateLabels(labels) {
        const newBoard = { ...board, statuses: labels }
        updateBoard(newBoard)
    }

    function onClose() {
        setIsEditOpen(false)
        setAnchorEl(null)
    }

    const editMode = !isEditOpen ? 'apply' : ''

    const status = selectedStatus ?  selectedStatus : statuses.find(status => status.id === 'default')



    const [anchorEl, setAnchorEl] = useState()
    return (
        <div className="priority-picker"
            style={{ background: `var(${status.cssVar})` }}
            onClick={(ev) => setAnchorEl(ev.currentTarget)}>
            {status.txt}
            {anchorEl &&
                <FloatingContainerCmp
                    anchorEl={anchorEl}
                    onClose={onClose}>
                    <div className={`priority-container ${isEditOpen}`}>
                        <div className={`priority-select ${isEditOpen}`}>
                            {!isEditOpen ?
                                <LabelsList labels={statuses} onSaveLabel={onSaveLabel} switchEditMode={() => setIsEditOpen(prev => prev = !prev)} />
                                :
                                <LabelsListEdit labels={statuses} onUpdateLabels={onUpdateLabels} onClose={onClose} />
                            }

                        </div>
                    </div>


                </FloatingContainerCmp>}
        </div>
    )

}



