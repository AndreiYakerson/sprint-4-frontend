import { TaskDetails } from "./TaskDetails"

export function TaskList({ tasks }) {
    return (
        <section className="task-list">
            {tasks.map(task => {
                return <div key={task.id} className="task-details">
                    <TaskDetails task={task} />
                </div>
            })}
        </section>
    )
}