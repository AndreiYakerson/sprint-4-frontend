import { DynamicCmp } from "../DynamicCmp.jsx";

export function TaskDetails({ task }) {
    return (
        <div className="task-details">
            {task.title}
            {

                //TODO <DynamicCmp />
            }
        </div>
    )
}