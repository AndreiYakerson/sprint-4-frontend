import { TaskList } from "./Task/TaskList"

export function GroupList({ groups, onRemoveGroup, onUpdateGroup, onAddTask, onRemoveTask, onUpdateTask, onUpdateTasksOrder }) {
    
    
    return (
        <section className="group-list">
            {groups.map(group => {
                return <div key={group.id} className="group-container">

                    <header>
                        <button onClick={() => onRemoveGroup(group.id)}>x</button>
                        {group.title}
                        <button onClick={() => onUpdateGroup(group)}>Update Title</button>
                    </header>

                    <TaskList
                        tasks={group.tasks}
                        onRemoveTask={(taskId) => onRemoveTask(group.id, taskId)}
                        onUpdateTask={(task) => onUpdateTask(group.id, task)}
                        groupId={group.id}
                        onUpdateTasksOrder={onUpdateTasksOrder}
                    />

                    <button onClick={() => onAddTask(group.id)}>+ Add task</button>
                </div>
            })}
        </section>
    )
}