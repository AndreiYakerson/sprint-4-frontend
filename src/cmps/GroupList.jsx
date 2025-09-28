import { TaskList } from "./Task/TaskList"

export function GroupList({ groups, onRemoveGroup, onUpdateGroup }) {
    console.log("🚀 ~ GroupList ~ groups:", groups)
    return (
        <section className="group-list">
            {groups.map(group => {
                return <div key={group.id} className="group-container">

                    <header>
                        <button onClick={() => onRemoveGroup(group.id)}>x</button>
                        {group.title}
                        <button onClick={() => onUpdateGroup(group)}>Update Title</button>
                    </header>

                    <TaskList tasks={group.tasks} />
                </div>
            })}
        </section>
    )
}