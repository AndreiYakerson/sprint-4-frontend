
// SERVICES
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
// COMPONENTS
import { StatusAnimation } from "../../StatusAnimation.jsx";
import { onCloseFloating } from "../../../store/actions/system.actions.js";
import { LabelSelect } from "../labels/LabelSelect.jsx";
import { FloatingContainerCmp } from "../../FloatingContainerCmp.jsx";

export function StatusPicker({ info, onUpdate }) {
    const board = useSelector(state => state.boardModule.board)
    const [labels, setLabels] = useState(board.statuses)

    const [statusAnchor, setStatusAnchor] = useState()
    const [showDoneAnimation, setShowDoneAnimation] = useState(false)
    const label = labels.find(l => l.id === info.selectedStatus?.id)
    const timeOutRef = useRef(null)

    const [isOpen, setIsOpen] = useState(false)
    const statusRef = useRef(null)

    useEffect(() => {
        return (() => {
            setStatusAnchor(null)
            if (timeOutRef.current) clearTimeout(timeOutRef.current)
            onCloseFloating()
        })
    }, [])

    useEffect(() => {
        setLabels(board.statuses)
    }, [board.statuses])


    function onSetDoneAnimation() {
        setShowDoneAnimation(true)
        timeOutRef.current = setTimeout(() => {
            setShowDoneAnimation(false)
        }, 3400)
    }

    function onAnimate(label) {
        if (label?.id === 'done') onSetDoneAnimation()
        if (label?.id !== 'done' && showDoneAnimation) {
            setShowDoneAnimation(false)
            clearTimeout(timeOutRef.current)
        }
    }

    function onClose() {
        console.log("🚀 ~ onClose ~ onClose:")
        setStatusAnchor(null)
        onCloseFloating()
    }

    const labelToShow = label ? label : labels.find(status => status.id === 'Not Started')

    return (
        <div ref={statusRef} className={`labels-select-container ${isOpen ? "focus" : ""}`}
            style={{ background: `var(${labelToShow?.cssVar})` }}
            onClick={(ev) => {
                ev.stopPropagation()
                setIsOpen(true)
            }}>
            <div className="label-txt">
                {labelToShow?.txt}
            </div>
            <StatusAnimation color={`var(${labelToShow?.cssVar})`} />
            {showDoneAnimation && <div className="done-animation" />}

            {isOpen && (
                <FloatingContainerCmp
                    anchorEl={statusRef.current}
                    onClose={() => setIsOpen(false)}
                >
                    <LabelSelect
                        type="status"
                        onAnimate={onAnimate}
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



