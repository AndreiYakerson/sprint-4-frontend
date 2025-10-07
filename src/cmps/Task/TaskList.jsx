import { useEffect, useRef } from "react"
import { useState } from "react"
import { useParams } from "react-router"

// services
import { updateTasksOrder } from "../../store/actions/board.actions.js"
import { showErrorMsg, showSuccessMsg } from "../../services/event-bus.service.js"

// cmps
import { TaskPreview } from "../Task/TaskPreview"

// dnd
import { closestCorners, DndContext, DragOverlay } from "@dnd-kit/core"
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"




export function TaskList({ tasks, groupId }) {
    const { boardId } = useParams()

    const [localTasks, setLocalTasks] = useState(tasks)


    useEffect(() => {
        setLocalTasks(tasks)
    }, [tasks])



    function onDragEnd(event) {
        const { active, over } = event;

        const oldIndex = localTasks.findIndex((task) => task.id === active.id);
        const newIndex = localTasks.findIndex((task) => task.id === over.id);

        const reorderedTasks = arrayMove(localTasks, oldIndex, newIndex);
        setLocalTasks(reorderedTasks)
        onUpdateTasksOrder(reorderedTasks, groupId)
    }

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


                            <div
                                className="table-row"
                                key={task.id}
                            >

                                <TaskPreview
                                    task={task}
                                    groupId={groupId}
                                    tasksLength={localTasks.length}
                                />
                            </div>


                        )
                    })}


            </section >

    )
}