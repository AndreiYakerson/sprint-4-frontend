// SERVICES
import { useEffect, useRef, useState } from "react"
import { useSelector } from "react-redux"
// COMPONENTS
import { StatusAnimation } from "../../StatusAnimation.jsx"
import { onCloseFloating, onSetFloating } from "../../../store/actions/system.actions.js"
import { LabelSelect } from "../labels/LabelSelect.jsx"
import { FloatingContainerCmp } from "../../FloatingContainerCmp.jsx"

export function PriorityPicker({ info, onUpdate }) {
    const board = useSelector(state => state.boardModule.board)
    const [labels, setLabels] = useState(board.priorities)
    const [isOpen, setIsOpen] = useState(null)
    const priorityRef = useRef(null)
    const [priorityAnchor, setPriorityAnchor] = useState()
    const label = labels.find(l => l.id === info.taskPriority?.id)

    useEffect(() => {
        return () => {
            onCloseFloating()
            setPriorityAnchor(null)
        }
    }, [])

    // useEffect(() => {
    //     if (priorityAnchor) {
    //         onSetFloating(<LabelSelect
    //             type="priority"
    //             labels={labels}
    //             onCloseAnchor={setPriorityAnchor}
    //             onUpdate={onUpdate}
    //             onClose={onClose}
    //         />, priorityAnchor)
    //     }

    // }, [priorityAnchor])

    useEffect(() => {
        setLabels(board.priorities)
    }, [board.priorities])

    function onClose() {
        setPriorityAnchor(null)
        onCloseFloating()
    }

    const labelToShow = label ? label : labels.find(l => l.id === 'default')

    return (
        <div ref={priorityRef} className={`labels-select-container ${priorityAnchor ? "focus" : ""}`}
            style={{ background: `var(${labelToShow?.cssVar})` }}
            onClick={(ev) => setIsOpen(ev.currentTarget)}>
            <div className="label-txt">
                {labelToShow?.txt}
            </div>
            {/* <StatusAnimation color={`var(${labelToShow?.cssVar})`} /> */}

            {isOpen && (
                <FloatingContainerCmp
                    anchorEl={priorityRef.current}
                    onClose={() => setIsOpen(false)}
                >
                    <LabelSelect
                        type="priority"
                        // onAnimate={onAnimate}
                        labels={labels}
                        onUpdate={onUpdate}
                        onCloseAnchor={() => setIsOpen(false)}
                        onClose={() => setIsOpen(false)}
                    />
                </FloatingContainerCmp>
            )}
        </div>
    )
}
