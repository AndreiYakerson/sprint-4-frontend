

// SERVICES
import { useEffect, useState } from "react";
import { updateBoard } from "../../../store/actions/board.actions";
import { useSelector } from "react-redux";

// COMPONENTS
import { LabelsListEdit } from "../labels/LabelsListEdit.jsx";
import { LabelsList } from "../labels/LabelsList.jsx";
import { FloatingContainerCmp } from "../../FloatingContainerCmp";
import { StatusAnimation } from "../../StatusAnimation";

export function PriorityPicker({ info, onUpdate }) {
    const {taskPriority } = info
    const board = useSelector(state => state.boardModule.board)
    const [anchorEl, setAnchorEl] = useState()
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [labels, setLabels] = useState(board.priorities)
    const [selectedLabelId, setSelectedLabelId] = useState(taskPriority?.id)
    const label = labels.find(l => l.id === selectedLabelId)


    useEffect(() => {
        setLabels(board.priorities)
    }, [board.priorities])


    function onSaveLabel(label) {
        const newLabel = ({ ...label, updatedAt: Date.now() })
        setSelectedLabelId(newLabel.id)
        onUpdate(newLabel)
        onClose()
    }

    async function onUpdateLabels(labels) {
        const newBoard = { ...board, priorities: labels }
       try {
         updateBoard(newBoard)
         setLabels(labels)
       } catch (error) {
        
       }
    }

    function onClose() {
        setIsEditOpen(false)
        setAnchorEl(null)
    }

    function switchEditMode() {
        setIsEditOpen(prev => prev = !prev)
    }



    const editMode = !isEditOpen ? 'apply' : ''

    const labelToShow = label ? label : labels.find(label => label.id === 'default')

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



