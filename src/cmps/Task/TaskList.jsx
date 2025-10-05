import { useEffect, useRef } from "react"
import { useState } from "react"
import { useParams } from "react-router"

// services
import { updateTasksOrder } from "../../store/actions/board.actions.js"
import { showErrorMsg, showSuccessMsg } from "../../services/event-bus.service.js"

// cmps
import { TaskPreview } from "../Task/TaskPreview"

// dnd
import { closestCorners, DndContext } from "@dnd-kit/core"
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"




export function TaskList({ tasks, groupId }) {
    const { boardId } = useParams()

    const [localTasks, setLocalTasks] = useState(tasks)
    const [placeholderIndex, setPlaceholderIndex] = useState(null);
    const [activeId, setActiveId] = useState(null); // Track the currently ac


    useEffect(() => {
        setLocalTasks(tasks)
    }, [tasks])


    const previousOverId = useRef(null);


    function onDragOver(event) {

        const { active, over } = event;

        if (!over) {
            if (placeholderIndex !== null) {
                setPlaceholderIndex(null); // No valid target
            }
            return;
        }

        if (previousOverId.current === over.id) {
            return; // Skip if `over.id` hasn't changed
        }

        previousOverId.current = over.id; // Update the previous `over.id`


        const overIndex = localTasks.findIndex((task) => task.id === over.id);


        if (overIndex !== placeholderIndex) {
            setPlaceholderIndex(overIndex);
        }
    }

    function onDragEnd(event) {
        const { active, over } = event;

        if (!over || active.id === over.id) {
            setPlaceholderIndex(null); // Reset placeholder
            return;
        }

        const oldIndex = localTasks.findIndex((task) => task.id === active.id);
        const newIndex = localTasks.findIndex((task) => task.id === over.id);

        const reorderedTasks = arrayMove(localTasks, oldIndex, newIndex);
        setLocalTasks(reorderedTasks);
        onUpdateTasksOrder(reorderedTasks, groupId)
        setPlaceholderIndex(null); // Reset placeholder
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

        <DndContext
            collisionDetection={closestCorners}
            onDragOver={onDragOver}
            onDragEnd={onDragEnd}
        >


            <section className="task-list">

                <SortableContext items={localTasks.map((task) => task.id)} strategy={verticalListSortingStrategy} >
                    {localTasks.map((task, idx) => {

                        return (


                            <div
                                className="table-row"
                                key={task.id}
                            >

                                <TaskPreview
                                    task={task}
                                    groupId={groupId}
                                />
                            </div>

                        )
                    })}

                </SortableContext>

            </section >

        </DndContext >
    )
}