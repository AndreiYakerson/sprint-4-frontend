import { useEffect } from "react"
import { useState } from "react"
import { useParams } from "react-router"


// services
import { updateTasksOrder } from "../../store/actions/board.actions.js"
import { showErrorMsg, showSuccessMsg } from "../../services/event-bus.service.js"

// cmps
import { TaskPreview } from "../Task/TaskPreview"

export function TaskList({ tasks, groupId }) {
    const { boardId } = useParams()

    const [localTasks, setLocalTasks] = useState(tasks)
    useEffect(() => {
        setLocalTasks(tasks)
    }, [tasks])

    //TODO must setTasks()


    async function onUpdateTasksOrder(tasks, groupId) {
        try {
            await updateTasksOrder(tasks, boardId, groupId)
            showSuccessMsg('tasks order updated successfully')
        } catch (err) {
            console.log(err)
            showErrorMsg('cannot update tasks order')
        }

    }

    return (

        <section className="task-list">
            {localTasks.map((task, idx) => {

                return (
                    <div className="table-row" key={task.id} >
                        <TaskPreview
                            task={task}
                            groupId={groupId}
                        />
                    </div>
                )
            }
            )}
        </section >
    )
}