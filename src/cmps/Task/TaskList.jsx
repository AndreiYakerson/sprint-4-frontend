import { useEffect, useRef } from "react"
import { useState } from "react"
import { useParams } from "react-router"

// services
import { updateTasksOrder } from "../../store/actions/board.actions.js"
import { showErrorMsg, showSuccessMsg } from "../../services/event-bus.service.js"

// cmps
import { TaskPreview } from "../Task/TaskPreview"
import { closestCorners, DndContext, DragOverlay, MouseSensor, useSensor, useSensors } from "@dnd-kit/core"
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { TaskOverlay } from "./TaskOverlay.jsx"

// dnd





export function TaskList({ tasks, groupId }) {
    const { boardId } = useParams()

    const [localTasks, setLocalTasks] = useState(tasks)
    const [activeId, setActiveId] = useState(null);


    useEffect(() => {
        setLocalTasks(tasks)
    }, [tasks])

    const mouseSensor = useSensor(MouseSensor, {
        activationConstraint: {
            distance: 10,
            // delay: 0,
            // tolerance: 50, 
        },
    });

    const sensors = useSensors(mouseSensor);

    async function onUpdateTasksOrder(tasks, groupId) {
        try {
            await updateTasksOrder(tasks, boardId, groupId)
            showSuccessMsg('tasks order updated successfully')
        } catch (err) {
            console.log(err)
            showErrorMsg('cannot update tasks order')
        }

    }


    function handleDragStart(event) {
        setActiveId(event.active.id);
    }

    function handleDragEnd(event) {
        const { active, over } = event;

        setActiveId(null);

        // setIsDragging(false)

        if (!over || active.id === over.id) {
            return;
        }

        const oldIndex = localTasks.findIndex((task) => task.id === active.id);
        const newIndex = localTasks.findIndex((task) => task.id === over.id);

        const reorderedTasks = arrayMove(localTasks, oldIndex, newIndex);


        setLocalTasks(reorderedTasks)
        onUpdateTasksOrder(reorderedTasks, groupId)

    }



    return (


        <DndContext
            collisionDetection={closestCorners}
            sensors={sensors}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >

            <section className="task-list">
                <SortableContext items={localTasks} strategy={verticalListSortingStrategy}>
                    {localTasks.map((task, idx) => {

                        return (
                            <div
                                className="table-row"
                                key={task.id}
                            >

                                <TaskPreview
                                    tasks={localTasks}
                                    task={task}
                                    taskIdx={idx}
                                    groupId={groupId}
                                    tasksLength={localTasks.length}
                                />
                            </div>
                        )

                    })}
                </SortableContext>

                    {/* <DragOverlay>
                        {activeId ? (
                            <div className="table-row drag-preview">
                                <TaskPreview
                                    task={localTasks.find(task => task.id === activeId)}
                                    groupId={groupId}
                                    isDragPreview
                                />
                            </div>
                        ) : null}
                    </DragOverlay> */}
                    
                    <DragOverlay>
                        {activeId ? (
                            <div className="table-row drag-preview">
                                <TaskOverlay
                                    task={localTasks.find(task => task.id === activeId)}
                                    groupId={groupId}
                                    isDragPreview
                                />
                            </div>
                        ) : null}
                    </DragOverlay>
            </section >

        </DndContext>
    )
}