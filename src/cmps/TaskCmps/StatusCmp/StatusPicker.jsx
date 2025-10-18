
// SERVICES
import { useEffect, useState } from "react";
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

    useEffect(() => {
        setLabels(board.statuses)
    }, [board.statuses])


    function onClose() {
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
        </div>
    )

}



