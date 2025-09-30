import { TaskPreview } from "../Task/TaskPreview"
import { TaskDetails } from "./TaskDetails"

export function TaskList({ tasks, onRemoveTask, onUpdateTask }) {
    return (
        <section className="task-list">
            {tasks.map(task => {
                return <div key={task.id} className="table-row">
                    <TaskPreview task={task} onRemoveTask={() => onRemoveTask(task.id)} />
                </div>
            })}
        </section>
    )
}