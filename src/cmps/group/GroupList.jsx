import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
// import { useState } from "react"
// import { ConfirmCmp } from "./ConfirmCmp"
// import { PopUp } from "./PopUp"

import { useParams } from "react-router"
// services
import { showErrorMsg, showSuccessMsg } from "../../services/event-bus.service"

// cmps
import { TaskList } from "../Task/TaskList";

import { addTask, removeGroup, updateGroup, updateGroupsOrder } from "../../store/actions/board.actions"
import { useState } from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";

export function GroupList({ groups }) {
    const { boardId } = useParams()

    const [localGroups, setLocalGroups] = useState(groups)
    useEffect(() => {
        setLocalGroups(groups)
    }, [groups])


    // Handle drag-and-drop events
    function handleDragEnd(result) {
        const { destination, source } = result;

        // If dropped outside a valid destination, do nothing
        if (!destination) return;

        // If the position hasn't changed, do nothing
        if (destination.index === source.index) return;

        // Reorder the groups array
        const reorderedGroups = Array.from(groups);
        const [movedGroup] = reorderedGroups.splice(source.index, 1);
        reorderedGroups.splice(destination.index, 0, movedGroup);

        // Update the state with the reordered groups
        setLocalGroups(reorderedGroups);
        
        updateGroupsOrder(reorderedGroups, boardId)
    }

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

    const demoColumns = ["Status", "Priority", "Members", "Date"];

    return (
        <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="group-list">
                {(provided) => (
                    <section
                        className="group-list"
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                    >
                        {localGroups.map((group, idx) => (
                            <Draggable key={group.id} draggableId={group.id} index={idx}>
                                {(provided) => (
                                    <div
                                        className="group-container"
                                        {...provided.draggableProps}
                                        ref={provided.innerRef}
                                        style={{
                                            ...provided.draggableProps.style, // Include styles from react-beautiful-dnd
                                            ...group.style, // Add your custom styles
                                        }}
                                    >
                                        <header
                                            className="group-header"
                                            {...provided.dragHandleProps} // Make the header the drag handle
                                        >
                                            <div className="group-title-row">
                                                <div className="group-menu-wrapper">
                                                    <button onClick={() => onRemoveGroup(group.id)}>X</button>
                                                </div>
                                                <div className="collapse-group"></div>
                                                <div className="group-title flex">
                                                    <div>{group.title}</div>
                                                </div>
                                                <button onClick={() => onUpdateGroup(group)}>Update Title</button>
                                                <div className="task-count">
                                                    {group?.tasks?.length > 0 ? `${group?.tasks?.length} Tasks`
                                                        : 'No Tasks'}
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
                                                    {demoColumns.map((colName) => {
                                                        return (
                                                            <div key={colName} className="cell">
                                                                <span>{colName}</span>
                                                            </div>
                                                        );
                                                    })}
                                                    <div className="cell full"></div>
                                                </div>

                                            </div>
                                        </header>

                                        <TaskList tasks={group.tasks} groupId={group.id} />

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
                                )}
                            </Draggable>
                        ))}
                        {provided.placeholder}
                    </section>
                )}
            </Droppable>
        </DragDropContext>
    );
}