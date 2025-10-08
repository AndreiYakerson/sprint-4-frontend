

// SERVICES
import { useEffect, useState } from "react";
import { updateBoard } from "../../../store/actions/board.actions";
import { useSelector } from "react-redux";

// COMPONENTS
import { LabelsListEdit } from "./LabelsListEdit";
import { LabelsList } from "./LabelsList";
import { FloatingContainerCmp } from "../../FloatingContainerCmp";
import { StatusAnimation } from "../../StatusAnimation";

export function PriorityPicker({ info, onUpdate }) {
    const { boardPriorities, taskPriority } = info
    const [anchorEl, setAnchorEl] = useState()
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [labels, setLabels] = useState(boardPriorities)
    const [selectedLabelId, setSelectedLabelId] = useState(taskPriority?.id)
    const board = useSelector(state => state.boardModule.board)
    const label = labels.find(l => l.id === selectedLabelId)


    useEffect(() => {
        setLabels(boardPriorities)
    }, [boardPriorities])


    function onSaveLabel(label) {
        const newLabel = ({ ...label, updatedAt: Date.now() })
        console.log("🚀 ~ onSaveLabel ~ newLabel:", newLabel)
        setSelectedLabelId(newLabel.id)
        onUpdate(newLabel)
        onClose()
    }

    function onUpdateLabels(labels) {
        const newBoard = { ...board, priorities: labels }
        updateBoard(newBoard)
        setLabels(labels)
    }

    function onClose() {
        setIsEditOpen(false)
        setAnchorEl(null)
    }
    const editMode = !isEditOpen ? 'apply' : ''

    const labelToShow = label ? label : labels.find(label => label.id === 'default')

    //FIXME  להפוך את זה לקומפוננטה אחת לבחירה של לייבלים
    return (
        <div className="priority-picker"
            style={{ background: `var(${labelToShow?.cssVar})` }}
            onClick={(ev) => setAnchorEl(ev.currentTarget)}>
            {labelToShow?.txt}
            <StatusAnimation color={`var(${labelToShow?.cssVar})`} />


            {anchorEl &&
                <FloatingContainerCmp
                    anchorEl={anchorEl}
                    onClose={onClose}>
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



