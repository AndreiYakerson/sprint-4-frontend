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
import { GroupCollapsed } from "./GroupCollapsed";


export function GroupList({ groups, managingType }) {
    const { boardId } = useParams()

    const [localGroups, setLocalGroups] = useState(groups)
    const [isDragging, setIsDragging] = useState(false)
    console.log('isDragging', isDragging)


    useEffect(() => {
        setLocalGroups(groups)
    }, [groups])


    // Handle drag-and-drop events
    function handleDragEnd(result) {
        const { destination, source } = result;

        setIsDragging(false)

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
        <DragDropContext
            onDragEnd={handleDragEnd}
            onDragUpdate={(update) => {
                if (!update.destination) {
                    console.log('No valid destination, placeholder not rendered');
                    return;
                }
            
                const elList = document.querySelector('.group-list');
                console.log('elList',elList);
                

                const placeholder = document.querySelector('.group-list  div.placeholder');
                if (placeholder) {
                    placeholder.style.height = '50px'; // Match the height of collapsed groups
                    placeholder.style.marginBottom = '10px'; // Add consistent spacing
                    console.log('Placeholder!!!',placeholder);
                    
                } else {
                    console.log('Placeholder not found');
                }
            }}
        >
            <Droppable droppableId="group-list">
                {(provided) => (
                    <section
                        className={`group-list ${isDragging ? 'collapsed' : ''}`}
                        {...provided.droppableProps}
                        ref={provided.innerRef}

                    >
                        {localGroups.map((group, idx) => (
                            <Draggable key={group.id} draggableId={group.id} index={idx}>
                                {(provided, snapshot) => {
                                    if (snapshot.isDragging) setIsDragging(true)


                                    return !isDragging ? <GroupPreview
                                        group={group}
                                        provided={provided}
                                        GroupTitleEditor={GroupTitleEditor}
                                        managingType={managingType}
                                        TaskList={TaskList}
                                        TitleEditor={TitleEditor}
                                        onUpdateGroup={onUpdateGroup}
                                        onRemoveGroup={onRemoveGroup}
                                        onAddTask={onAddTask}
                                        isDragging={isDragging}
                                    /> : <GroupCollapsed
                                        group={group}
                                        provided={provided}
                                        snapshot={snapshot}
                                        isDragging={isDragging}
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