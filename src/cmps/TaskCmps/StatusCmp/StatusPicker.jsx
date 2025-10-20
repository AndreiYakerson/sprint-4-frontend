
// SERVICES
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
// COMPONENTS
import { StatusAnimation } from "../../StatusAnimation.jsx";
import { onCloseFloating, onSetFloating } from "../../../store/actions/system.actions.js";
import { LabelSelect } from "../labels/LabelSelect.jsx";

export function StatusPicker({ info, onUpdate }) {
    const board = useSelector(state => state.boardModule.board)
    // const floating = useSelector(state => state.systemModule.floating)
    const [labels, setLabels] = useState(board.statuses)
    const [statusAnchor, setStatusAnchor] = useState()
    const label = labels.find(l => l.id === info.selectedStatus?.id)

    useEffect(() => {
        return () => {
            setStatusAnchor(null)
        }
    }, [])

    useEffect(() => {
        if (statusAnchor) {
            onCloseFloating()
            onSetFloating(
                <LabelSelect
                    type="statuses"
                    labels={labels}
                    onUpdate={onUpdate}
                    onClose={onClose}
                />, statusAnchor)
        }
    }, [statusAnchor])

    const [showDoneAnimation, setShowDoneAnimation] = useState(false)
    const timeOutRef = useRef(null)

    useEffect(() => {
        setLabels(board.statuses)
    }, [board.statuses])


    useEffect(() => {
        return (() => {
            if (timeOutRef.current) clearTimeout(timeOutRef.current)
        })
    }, [])

    function onSetDoneAnimation() {
        setShowDoneAnimation(true)
        timeOutRef.current = setTimeout(() => {
            setShowDoneAnimation(false)
        }, 3400)
    }

    function onSaveLabel(label) {
        const newLabel = ({ ...label, updatedAt: Date.now() })

        /// done animtion 
        if (label?.id === 'done') onSetDoneAnimation()
        if (label?.id !== 'done' && showDoneAnimation) {
            setShowDoneAnimation(false)
            clearTimeout(timeOutRef.current)
        }

        setSelectedLabelId(newLabel.id)
        onUpdate(newLabel)
        onClose()
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
        console.log("🚀 ~ onClose ~ onClose:")
        setStatusAnchor(null)
        onCloseFloating()
    }

    const labelToShow = label ? label : labels.find(status => status.id === 'default')

    return (
        <div className={`labels-select-container ${statusAnchor ? "focus" : ""}`}
            style={{ background: `var(${labelToShow?.cssVar})` }}
            onClick={(ev) => setStatusAnchor(ev.currentTarget)}>
            <div className="label-txt">
                {labelToShow?.txt}
            </div>
            <StatusAnimation color={`var(${labelToShow?.cssVar})`} />

            {showDoneAnimation && <div className="done-animation" />}

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
                                <LabelsListEdit labels={labels} type={'status'} onUpdateLabels={onUpdateLabels} onClose={onClose} onSwitchEditMode={switchEditMode} />
                            }

                        </div>
                    </div>


                </FloatingContainerCmp>}
        </div>
    )

}



