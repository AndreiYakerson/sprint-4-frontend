
// SERVICES
import { useState } from "react";
import { updateBoard } from "../../../store/actions/board.actions";
import { useSelector } from "react-redux";
// COMPONENTS
import { PriorityListEdit } from "./PriorityListEdit";
import { PriorityList } from "./PriorityList";
import { FloatingContainerCmp } from "../../FloatingContainerCmp";

export function PriorityPicker({ info, onUpdate }) {
    const { boardPriorities, taskPriority } = info
    const [isEditOpen, setIsEditOpen] = useState(false)
    const board = useSelector(state => state.boardModule.board)

    function onSaveTaskLabel(label) {
        onUpdate(label)
        onClose()
    }

    function UpdateBoardLabels(labels) {
        const newBoard = { ...board, priorities: labels }
        updateBoard(newBoard)
    }

    function onClose() {
        setIsEditOpen(false)
        setAnchorEl(null)
    }

    const editMode = !isEditOpen ? 'apply' : ''


    const [anchorEl, setAnchorEl] = useState()
    return (
        <div className="priorit-picker"
            style={{ background: `var(${taskPriority.cssVar})` }}
            onClick={(ev) => setAnchorEl(ev.currentTarget)}>
            {taskPriority.txt}
            {anchorEl &&
                <FloatingContainerCmp
                    anchorEl={anchorEl}
                    onClose={onClose}>
                    <div className={`priority-container ${isEditOpen}`}>
                        <div className={`priority-select ${isEditOpen}`}>
                            {!isEditOpen ?
                                <PriorityList labels={boardPriorities} onUpdateTask={onSaveTaskLabel} switchEditMode={() => setIsEditOpen(prev => prev = !prev)} />
                                :
                                <PriorityListEdit labels={boardPriorities} onUpdateLabel={UpdateBoardLabels} onClose={onClose} />
                            }

                        </div>
                    </div>


                </FloatingContainerCmp>}
        </div>
    )

}



