import { TaskList } from "./TaskList"

export function GroupList({ groups }) {
    return (
        <section className="group-list">
            {groups.map(group => {
                return <div key={group.id} className="group-container">
                    <TaskList tasks={group.tasks} />
                </div>
            })}
        </section>
    )
}