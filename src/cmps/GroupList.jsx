import { TaskList } from "./Task/TaskList"

export function GroupList({ groups, onRemoveGroup, onUpdateGroup, onAddTask, onRemoveTask, onUpdateTask }) {

    const demoColumns = ['Status', 'Priority', 'Members', 'Date']

    return (
        <section className="group-list">
            {groups.map(group => {
                return <div key={group.id} className="group-container"
                    style={{ '--group-color': group?.color ? group?.color : '#d0d4e4' }}
                >

                    <header className="group-haeder">

                        <div className="group-title-container">
                            <div className="group-menu-wrapper">
                                <button onClick={() => onRemoveGroup(group.id)}>X</button>
                            </div>
                            <div className="collapse-group"></div>
                            <div className="group-title">
                                {group.title}
                                <button onClick={() => onUpdateGroup(group)}>Update Title</button>
                            </div>



                        </div>

                        <div className="temporary-white-block"></div>

                        <div className="table-row table-header">

                            <div className="sticky-cell-wrapper">
                                <div className="task-menu-wrapper"></div>
                                <div className="table-border"></div>
                                <div className="task-select"></div>
                                <div className="task-title">Task</div>
                            </div>

                            <div className="task-columns flex">
                                {demoColumns.map(colName => {
                                    return <div key={colName} className="cell">
                                        <span>{colName}</span>
                                    </div>
                                })}
                                <div className="cell full"></div>
                            </div>

                        </div>
                    </header>

                    <TaskList
                        tasks={group.tasks}
                        onRemoveTask={(taskId) => onRemoveTask(group.id, taskId)}
                        onUpdateTask={(task) => onUpdateTask(group.id, task)}
                    />

                    <div className="table-row">
                        <div className="sticky-cell-wrapper">
                            <div className="task-menu-wrapper"></div>
                            <div className="table-border"></div>
                            <div className="task-select"></div>
                            <div className="add-task-cell">
                                <button onClick={() => onAddTask(group.id)}>+ Add task</button>
                            </div>
                        </div>

                        <div className="task-columns flex">
                            <div className="cell full"></div>
                        </div>

                    </div>

                </div>
            })}
        </section>
    )
}