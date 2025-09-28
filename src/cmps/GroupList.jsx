import { TaskList } from "./Task/TaskList"

export function GroupList({ groups }) {
    return (
        <section className="group-list">
            {groups.map(group => {
                return <div key={group.id}>
                    <header>{group.title}</header>
                    <section className="group-container">
                        <TaskList tasks={group.tasks} />
                    </section>
                </div>
            })}
        </section>
    )
}