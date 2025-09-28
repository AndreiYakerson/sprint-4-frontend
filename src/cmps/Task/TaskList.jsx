import { TaskPreview } from "../Task/TaskPreview"

export function TaskList({ tasks }) {
    return (
        <section className="task-list">
            {tasks.map(task => {
                return <div key={task.id} className="task-details">
                    <TaskPreview task={task} />
                </div>
            })}
        </section>
    )
}