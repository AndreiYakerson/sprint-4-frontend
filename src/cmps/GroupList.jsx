// import { useState } from "react"
// import { ConfirmCmp } from "./ConfirmCmp"
// import { PopUp } from "./PopUp"

import { useParams } from "react-router"
// services
import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service"

// cmps
import { TaskList } from "./Task/TaskList"
import { addTask, removeGroup, updateGroup } from "../store/actions/board.actions"

export function GroupList({ groups }) {
    const { boardId } = useParams()

    async function onUpdateGroup(group) {
        const title = prompt('New title?', group.title) || ''
        if (title === '' || title === group.title) return

        group.title = title

        try {
            await updateGroup(boardId, group)
            showSuccessMsg('group updated successfully')
        } catch (err) {
            console.log(err)
            showErrorMsg('cannot update group')
        }
    }

    async function onRemoveGroup(groupId) {
        try {
            await removeGroup(boardId, groupId)
            showSuccessMsg('group removed successfully')
        } catch (err) {
            console.log(err)
            showErrorMsg('cannot remove group')
        }
    }

    async function onAddTask(groupId) {
        try {
            await addTask(boardId, groupId)
            showSuccessMsg('task added to the board')
        } catch (err) {
            console.log(err)
            showErrorMsg('cannot add task')
        }
    }

    const demoColumns = ['Status', 'Priority', 'Members', 'Date']

    return (
        <section className="group-list">
            {groups.map(group => {
                return <div key={group.id} className="group-container"
                    style={group?.style ? group?.style : { '--group-color': '#d0d4e4' }}
                >

                    <header className="group-haeder">

                        <div className="group-title-row">
                            <div className="group-menu-wrapper">
                                <button onClick={() => onRemoveGroup(group.id)}>X</button>
                            </div>
                            <div className="collapse-group"></div>
                            <div className="group-title flex">
                                <div>{group.title}</div>

                            </div>
                            <button onClick={() => onUpdateGroup(group)}>Update Title</button>
                            <div className="task-count">{group?.tasks?.length > 0 ? group?.tasks?.length : 'No'} Tasks</div>
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
                        groupId={group.id}
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

                    <div className="table-row sum-row">
                        <div className="sticky-cell-wrapper">
                            <div className="border-radius-block">
                                <span></span>
                            </div>
                        </div>

                        <div className="task-columns flex">
                            {demoColumns.map(colName => {
                                return <div key={colName} className="cell">
                                    <span></span>
                                </div>
                            })}
                            <div className="cell full"></div>
                        </div>
                    </div>

                </div>
            })}
        </section >
    )
}