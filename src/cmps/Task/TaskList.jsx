import { useEffect } from "react"
import { useState } from "react"
import { useParams } from "react-router"
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd"

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

    function handleDragEnd(result) {
        const { destination, source } = result;

        // If dropped outside a valid destination, do nothing
        if (!destination) return;

        // If the position hasn't changed, do nothing
        if (destination.index === source.index) return;

        // Reorder the tasks array
        const reorderedTasks = Array.from(tasks);
        const [movedTask] = reorderedTasks.splice(source.index, 1);
        reorderedTasks.splice(destination.index, 0, movedTask);


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
        <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="task-list">


                {(provided) => (
                    <section className="task-list" {...provided.droppableProps} ref={provided.innerRef}>
                        {localTasks.map((task, idx) => {

                            return (
                                <Draggable key={task.id} draggableId={task.id} index={idx}>
                                    {(provided, snapshot) => (
                                        <div className={`table-row ${snapshot.isDragging ? 'dragged' : ''} ${snapshot.isDraggingOver ? 'dragging-over' : ''}`} {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}>
                                            <TaskPreview
                                                task={task}
                                                groupId={groupId}
                                            />
                                        </div>
                                    )}
                                </Draggable>
                            )
                        })}
                        {provided.placeholder}
                    </section >
                )}
            </Droppable>
        </DragDropContext>
    )
}