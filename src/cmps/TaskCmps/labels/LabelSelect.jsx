import { useEffect, useState } from "react";
import { LabelsList } from "./LabelsList";
import { LabelsListEdit } from "./LabelsListEdit";
import { updateBoard } from "../../../store/actions/board.actions";
import { useSelector } from "react-redux";

export function LabelSelect({ labels, onClose, onUpdate, type, onCloseAnchor, onAnimate }) {
    const board = useSelector(state => state.boardModule.board)
    const [labelsToSelect, setLabelsToSelect] = useState(labels)
    const [isEditOpen, setIsEditOpen] = useState(false)


    useEffect(() => {
        setLabelsToSelect(labels)
    }, [labels])


    useEffect(() => {
        return () => onCloseAnchor(null)
    }, [])

    function switchEditMode() {
        setIsEditOpen(prev => !prev)
    }

    function onSaveLabel(label) {
        const newLabel = ({ ...label, updatedAt: Date.now() })
        onClose()
        onUpdate(newLabel)
        if (onAnimate) onAnimate(newLabel)
    }


    async function onUpdateLabels(labels) {
        const newBoard = {
            ...board,
            [type === "priority" ? "priorities" : "statuses"]: labels
        }
        try {
            updateBoard(newBoard)
            setLabelsToSelect(labels)
        } catch (error) {
            console.log(' Cannot update label')

        }
    }

    return (
        <div className={`labels-container ${isEditOpen ? 'true' : 'false'}`}>
            <div className={`label-select  ${isEditOpen ? 'true' : 'false'}`}>
                {!isEditOpen ?
                    <LabelsList labels={labelsToSelect} onSaveLabel={onSaveLabel} onSwitchEditMode={switchEditMode} />
                    :
                    <LabelsListEdit labels={labelsToSelect} onClose={onClose} type={type} onUpdateLabels={onUpdateLabels} onSwitchEditMode={switchEditMode} />
                }
            </div>
        </div>
    )
}