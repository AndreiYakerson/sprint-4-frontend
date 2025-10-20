
// SERVICES
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
// COMPONENTS
import { StatusAnimation } from "../../StatusAnimation.jsx";
import { onCloseFloating, onSetFloating } from "../../../store/actions/system.actions.js";
import { LabelSelect } from "../labels/LabelSelect.jsx";

export function StatusPicker({ info, onUpdate }) {
    const board = useSelector(state => state.boardModule.board)
    const [labels, setLabels] = useState(board.statuses)

    const [statusAnchor, setStatusAnchor] = useState()
    const [showDoneAnimation, setShowDoneAnimation] = useState(false)
    const label = labels.find(l => l.id === info.selectedStatus?.id)
    const timeOutRef = useRef(null)

    useEffect(() => {
        return (() => {
            setStatusAnchor(null)
            if (timeOutRef.current) clearTimeout(timeOutRef.current)
            onCloseFloating()
        })
    }, [])

    useEffect(() => {
        if (statusAnchor) {
            onSetFloating(
                <LabelSelect
                    type="status"
                    onAnimate={onAnimate}
                    labels={labels}
                    onUpdate={onUpdate}
                    onCloseAnchor={setStatusAnchor}
                    onClose={onClose}
                />, statusAnchor)
        }

    }, [statusAnchor])

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
        setStatusAnchor(null)
        onCloseFloating()
    }

    const labelToShow = label ? label : labels.find(status => status.id === 'Not Started')

    return (
        <div className={`labels-select-container ${statusAnchor ? "focus" : ""}`}
            style={{ background: `var(${labelToShow?.cssVar})` }}
            onClick={(ev) => setStatusAnchor(ev.currentTarget)}>
            <div className="label-txt">
                {labelToShow?.txt}
            </div>
            <StatusAnimation color={`var(${labelToShow?.cssVar})`} />
            {showDoneAnimation && <div className="done-animation" />}
        </div>
    )

}



