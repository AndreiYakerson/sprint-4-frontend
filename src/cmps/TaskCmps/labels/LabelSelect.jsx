import { useEffect, useState } from "react";
import { LabelsList } from "./LabelsList";
import { LabelsListEdit } from "./LabelsListEdit";
import { updateBoard } from "../../../store/actions/board.actions";
import { useSelector } from "react-redux";

export function LabelSelect({ labels, onClose, onUpdate,type}) {
    const board = useSelector(state => state.boardModule.board)
    const [labelsToSelect, setLabelsToSelect] = useState(labels)
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [selectedLabelId, setSelectedLabelId] = useState()

    useEffect(() => {
        return () => onClose()
    }, [])

    function switchEditMode() {
        setIsEditOpen(prev => !prev)
    }

    function onSaveLabel(label) {
        const newLabel = ({ ...label, updatedAt: Date.now() })
        setSelectedLabelId(newLabel.id)
        onClose()
        onUpdate(newLabel)
    }


    async function onUpdateLabels(labels) {
        const newBoard = {
            ...board,
            [type === "priority" ? "priorities" : "statuses"] : labels
        }
        try {
            updateBoard(newBoard)
            setLabelsToSelect(labels)
        } catch (error) {

        }
    }

    return (
        <div className={`labels-container ${isEditOpen}`}>
            <div className={`label-select ${isEditOpen}`}>
                {!isEditOpen ?
                    <LabelsList labels={labelsToSelect} onSaveLabel={onSaveLabel} onSwitchEditMode={switchEditMode} />
                    :
                    <LabelsListEdit labels={labelsToSelect} onUpdateLabels={onUpdateLabels} onSwitchEditMode={switchEditMode} />
                }
            </div>
        </div>
    )
}