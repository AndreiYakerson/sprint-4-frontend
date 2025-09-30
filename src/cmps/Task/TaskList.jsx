import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd"
import { TaskPreview } from "../Task/TaskPreview"
import { TaskDetails } from "./TaskDetails"
import { useState } from "react"
import { useEffect } from "react"

export function TaskList({ tasks, onRemoveTask, onUpdateTask, groupId, onUpdateTasksOrder }) {



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

        // setTasks(reorderedTasks)

        onUpdateTasksOrder(reorderedTasks, groupId)
    }


    return (
        <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="task-list">
                

                {(provided) => (
                    <section className="task-list" {...provided.droppableProps} ref={provided.innerRef}>
                        {tasks.map((task, idx) => {

                            return (
                                <Draggable key={task.id} draggableId={task.id} index={idx}>
                                    {(provided, snapshot) => (

                                        <div className={`table-row ${snapshot.isDragging ? 'tilted' : ''}`} {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}>
                                            <TaskPreview
                        task={task}
                                                onRemoveTask={() => onRemoveTask(task.id)}
                                                onUpdateTask={() => onUpdateTask(task)}
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