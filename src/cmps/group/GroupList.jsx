import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

// import { useState } from "react"
// import { ConfirmCmp } from "./ConfirmCmp"
// import { PopUp } from "./PopUp"

import { useParams } from "react-router"
// services
import { showErrorMsg, showSuccessMsg } from "../../services/event-bus.service"
import { addTask, removeGroup, updateGroup, updateGroupsOrder } from "../../store/actions/board.actions"

// cmps
import { TaskList } from "../Task/TaskList";
import { TitleEditor } from "../Task/TitleEditor";
import { GroupTitleEditor } from "./GroupTitleEditor";
import { GroupPreview } from "./GroupPreview";


export function GroupList({ groups, managingType }) {
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

    async function onUpdateGroup(group, newVals) {
        const groupToUpdate = { ...structuredClone(group), ...newVals }

        try {
            await updateGroup(boardId, groupToUpdate)
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

    async function onAddTask(groupId, title) {
        try {
            await addTask(boardId, groupId, title)
            showSuccessMsg('task added to the board')
        } catch (err) {
            console.log(err)
            showErrorMsg('cannot add task')
        }
    }


    

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
                                {(provided) => {
                                    return <GroupPreview
                                        group={group}
                                        provided={provided}
                                        GroupTitleEditor={GroupTitleEditor}
                                        managingType={managingType}
                                        TaskList={TaskList}
                                        TitleEditor={TitleEditor}
                                        onAddTask={onAddTask}
                                        onUpdateGroup={onUpdateGroup}
                                        onRemoveGroup={onRemoveGroup}
                                    />
                                }
                                    
                                }
                            </Draggable>
                        ))}
                        {provided.placeholder}
                    </section>
                )}
            </Droppable>
        </DragDropContext>
    );
}