import { DynamicCmp } from "../DynamicCmp.jsx";

export function TaskDetails({ task, onCloseTaskDetails }) {
    return (
        <div className="task-details">
            <button onClick={onCloseTaskDetails}>X</button>
            <h2>{task?.title}</h2>
            {
            }
        </div>
    )
}