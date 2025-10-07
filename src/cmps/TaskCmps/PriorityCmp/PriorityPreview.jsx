import { useState } from "react";
import { FloatingContainerCmp } from "../../FloatingContainerCmp";
import { PriorityListEdit } from "./PriorityListEdit";
import { PriorityList } from "./PriorityList";
import { useSelector } from "react-redux";
import { updateBoard } from "../../../store/actions/board.actions";

export function PriorityPreview() {
    const [isEditOpen, setIsEditOpen] = useState(false)
    const board = useSelector(state => state.boardModule.board)

    function onSave(labels) {
        const newBoard = { ...board, priorities: labels }
        updateBoard(newBoard)
        showSuccessMsg(' Priority label saved')
        onClose()
    }

    function onUpdate(labels) {
        const newBoard = { ...board, priorities: labels }
        updateBoard(newBoard)
    }

    function onClose() {
            console.log("🚀 ~ PriorityPreview ~ isEditOpen:", isEditOpen)

        setIsEditOpen(false)
        setAnchorEl(null)
    }

    const editMode = !isEditOpen ? 'apply' : ''


    const [anchorEl, setAnchorEl] = useState()
    return (
        <div className="priority-preview"
            onClick={(ev) => setAnchorEl(ev.currentTarget)}>
            {anchorEl &&
                <FloatingContainerCmp
                    anchorEl={anchorEl}
                    onClose={onClose}>
                    <div className={`priority-container ${isEditOpen}`}>
                        <div className={`priority-select ${isEditOpen}`}>
                            {!isEditOpen ?
                                <PriorityList labels={board.priorities} switchEditMode={() => setIsEditOpen(prev => prev = !prev)} />
                                :
                                <PriorityListEdit labels={board.priorities} onSave={onSave} onUpdate={onUpdate} onClose={onClose} />
                            }

                        </div>
                    </div>


                </FloatingContainerCmp>}
        </div>
    )

}



