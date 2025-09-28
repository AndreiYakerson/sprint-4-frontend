import { TaskList } from "./Task/TaskList"

export function GroupList({ groups }) {
    console.log("🚀 ~ GroupList ~ groups:", groups)
    return (
        <section className="group-list">
            {groups.map(group => {
                return <div key={group.id} className="group-container">
                    <header>{group.title}</header>
                    
                    <TaskList tasks={group.tasks} />
                </div>
            })}
        </section>
    )
}