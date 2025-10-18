// SERVICES
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
// COMPONENTS
import { StatusAnimation } from "../../StatusAnimation.jsx"
import { onCloseFloating, onSetFloating } from "../../../store/actions/system.actions.js"
import { LabelSelect } from "../labels/LabelSelect.jsx"

export function PriorityPicker({ info, onUpdate }) {
    const board = useSelector(state => state.boardModule.board)
    const [labels, setLabels] = useState(board.priorities)
    const [priorityAnchor, setPriorityAnchor] = useState()
    const label = labels.find(l => l.id === info.taskPriority?.id)

    useEffect(() => {
        return () => setPriorityAnchor(null)
    }, [])

    useEffect(() => {
        if (priorityAnchor) {
            onCloseFloating()
            const content = <LabelSelect
                type="priority"
                labels={labels}
                onUpdate={onUpdate}
                onClose={onClose}
            />
            onSetFloating(content, priorityAnchor)
        }
    }, [priorityAnchor])

    useEffect(() => {
        setLabels(board.priorities)
    }, [board.priorities])

    function onClose() {
        setPriorityAnchor(null)
        onCloseFloating()
    }

    const labelToShow = label ? label : labels.find(l => l.id === 'default')

    return (
        <div className={`labels-select-container ${priorityAnchor ? "focus" : ""}`}
            style={{ background: `var(${labelToShow?.cssVar})` }}
            onClick={(ev) => setPriorityAnchor(ev.currentTarget)}>
            <div className="label-txt">
                {labelToShow?.txt}
            </div>
            <StatusAnimation color={`var(${labelToShow?.cssVar})`} />
        </div>
    )
}
