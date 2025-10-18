
// SERVICES
import { useEffect, useState } from "react";
import { updateBoard } from "../../../store/actions/board.actions.js";
import { useSelector } from "react-redux";
// COMPONENTS
import { LabelsListEdit } from "../labels/LabelsListEdit.jsx";
import { LabelsList } from "../labels/LabelsList.jsx";
import { FloatingContainerCmp } from "../../FloatingContainerCmp";
import { StatusAnimation } from "../../StatusAnimation.jsx";
import { onCloseFloating, onSetFloating } from "../../../store/actions/system.actions.js";
import { LabelSelect } from "../labels/LabelSelect.jsx";

export function StatusPicker({ info, onUpdate }) {
    const board = useSelector(state => state.boardModule.board)
    const floating = useSelector(state => state.systemModule.floating)
    const [selectedLabelId, setSelectedLabelId] = useState(info.selectedStatus?.id)
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [labels, setLabels] = useState(board.statuses)
    const [statusAnchor, setStatusAnchor] = useState()
    const label = labels.find(l => l.id === selectedLabelId)




    useEffect(() => {
        if (statusAnchor) {
            onCloseFloating()
            const content = <LabelSelect
                isEditOpen={isEditOpen}
                labels={labels}
                onSaveLabel={onSaveLabel}
                onUpdateLabels={onUpdateLabels}
                switchEditMode={switchEditMode}
                onClose={onClose}
            />
            onSetFloating(content, statusAnchor)
        }

    }, [selectedLabelId, statusAnchor, isEditOpen])

    useEffect(() => {
        setLabels(board.statuses)
    }, [board.statuses])


    function onSaveLabel(label) {
        const newLabel = ({ ...label, updatedAt: Date.now() })
        setSelectedLabelId(newLabel.id)
        onClose()
        onUpdate(newLabel)
    }

    async function onUpdateLabels(labels) {
        const newBoard = { ...board, statuses: labels }
        try {
            updateBoard(newBoard)
            setLabels(labels)
        } catch (error) {

        }
    }

    function onClose() {
        setIsEditOpen(false)
        setStatusAnchor(null)
        onCloseFloating()
    }

    function switchEditMode() {
        setIsEditOpen(prev => !prev)
    }

    const editMode = !isEditOpen ? 'apply' : ''

    const labelToShow = label ? label : labels.find(status => status.id === 'default')

    console.log("🚀 ~ StatusPicker ~ statusAnchor:", statusAnchor)
    return (
        <div className={`labels-select-container ${statusAnchor ? "focus" : ""}`}
            style={{ background: `var(${labelToShow?.cssVar})` }}
            onClick={(ev) => setStatusAnchor(ev.currentTarget)}>
            <div className="label-txt">
                {labelToShow?.txt}
            </div>
            <StatusAnimation color={`var(${labelToShow?.cssVar})`} />
        </div>
    )

}



