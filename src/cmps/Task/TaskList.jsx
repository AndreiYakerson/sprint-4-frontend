import { TaskPreview } from "../Task/TaskPreview"
import { TaskDetails } from "./TaskDetails"

export function TaskList({ tasks, onRemoveTask, onUpdateTask }) {
    return (
        <section className="task-list">
            {tasks.map(task => {
                return <div key={task.id} className="task-detail flex align-center">
                    <button onClick={() => onRemoveTask(task.id)}>X</button>
                    <TaskPreview task={task} />
                    <button onClick={() => onUpdateTask(task)}>Update Title</button>
                </div>
            })}
        </section>
    )
}