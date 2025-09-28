import { TaskPreview } from "../Task/TaskPreview"

export function TaskList({ tasks, onRemoveTask, onUpdateTask }) {
    console.log("🚀 ~ TaskList ~ tasks:", tasks)
    return (
        <section className="task-list">
            {tasks.map(task => {
                return <div key={task.id} className="task-detail flex align-center">
                    <button onClick={() => onRemoveTask(task.id)}>X</button>
                    <TaskDetails task={task} />
                    <button onClick={() => onUpdateTask(task)}>Update Title</button>
                </div>
            })}
        </section>
    )
}