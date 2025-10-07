
// SERVICES
import { useState } from "react";
import { updateBoard } from "../../../store/actions/board.actions";
import { useSelector } from "react-redux";

// COMPONENTS
import { LabelsListEdit } from "./LabelsListEdit";
import { LabelsList } from "./LabelsList";
import { FloatingContainerCmp } from "../../FloatingContainerCmp";

export function PriorityPicker({ info, onUpdate }) {
    const { boardPriorities, taskPriority } = info
    const [isEditOpen, setIsEditOpen] = useState(false)
    const board = useSelector(state => state.boardModule.board)

    function onSaveLabel(label) {
        onUpdate(label)
        onClose()
    }

    function onUpdateLabels(labels) {
        const newBoard = { ...board, priorities: labels }
        updateBoard(newBoard)
    }

    function onClose() {
        setIsEditOpen(false)
        setAnchorEl(null)
    }

    const editMode = !isEditOpen ? 'apply' : ''


    const [anchorEl, setAnchorEl] = useState()
    //FIXME  להפוך את זה לקומפוננטה אחת לבחירה של לייבלים
    return (
        <div className="priority-picker"
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
                                <LabelsList labels={boardPriorities} onSaveLabel={onSaveLabel} switchEditMode={() => setIsEditOpen(prev => prev = !prev)} />
                                :
                                <LabelsListEdit labels={boardPriorities} onUpdateLabels={onUpdateLabels} onClose={onClose} />
                            }
                        </div>
                    </div>


                </FloatingContainerCmp>}
        </div>
    )

}



