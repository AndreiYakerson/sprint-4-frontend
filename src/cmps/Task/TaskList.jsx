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
    const [placeholderIndex, setPlaceholderIndex] = useState(null);
    const [activeId, setActiveId] = useState(null);


    useEffect(() => {
        setLocalTasks(tasks)
    }, [tasks])




    function onDragOver(event) {
        const { active, over } = event;

        if (!over) {
            setPlaceholderIndex(null);
            return;
        }

        const overIndex = localTasks.findIndex((task) => task.id === over.id);

        if (overIndex !== placeholderIndex) {
            setPlaceholderIndex(overIndex);
        }
    }


    function onDragStart(event) {
        const { active } = event;
        setActiveId(active.id);
    }


    function onDragEnd(event) {
        const { active, over } = event;

        if (!over || active.id === over.id) {
            setPlaceholderIndex(null);
            return;
        }

        const oldIndex = localTasks.findIndex((task) => task.id === active.id);
        const newIndex = localTasks.findIndex((task) => task.id === over.id);

        const reorderedTasks = arrayMove(localTasks, oldIndex, newIndex);
        setLocalTasks(reorderedTasks)
        onUpdateTasksOrder(reorderedTasks, groupId)
        setPlaceholderIndex(null)
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
            onDragStart={onDragStart}
            onDragOver={onDragOver}
            onDragEnd={onDragEnd}
        >


            <section className="task-list">

                <SortableContext items={localTasks} strategy={verticalListSortingStrategy} >
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

            <DragOverlay>
                {activeId ? (
                    <div className="drag-overlay">
                        <TaskPreview task={localTasks.find((task) => task.id === activeId)} groupId={groupId} />
                    </div>
                ) : null}
            </DragOverlay>

        </DndContext >
    )
}