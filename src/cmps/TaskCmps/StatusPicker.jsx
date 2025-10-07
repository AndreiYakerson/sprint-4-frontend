
// SERVICES
import { useState } from "react";
import { updateBoard } from "../../store/actions/board.actions.js";
import { useSelector } from "react-redux";
// COMPONENTS
import { PriorityListEdit } from "./PriorityCmp/PriorityListEdit.jsx";
import { PriorityList } from "./PriorityCmp//PriorityList";
import { FloatingContainerCmp } from "../FloatingContainerCmp.jsx";

export function StatusPicker({ info, onUpdate }) {
    const { selectedStatus, statuses } = info
    const [isEditOpen, setIsEditOpen] = useState(false)
    const board = useSelector(state => state.boardModule.board)

    function onSaveTaskLabel(label) {
        onUpdate(label)
        onClose()
    }

    function UpdateBoardLabels(labels) {
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
        <div className="priorit-picker"
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
                                <PriorityList labels={statuses} onUpdateTask={onSaveTaskLabel} switchEditMode={() => setIsEditOpen(prev => prev = !prev)} />
                                :
                                <PriorityListEdit labels={statuses} onUpdateLabel={UpdateBoardLabels} onClose={onClose} />
                            }

                        </div>
                    </div>


                </FloatingContainerCmp>}
        </div>
    )

}



