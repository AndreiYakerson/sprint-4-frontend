import { useSelector } from "react-redux";
import { useState, useEffect } from "react";


// import { useState } from "react"
// import { ConfirmCmp } from "./ConfirmCmp"

import { useParams } from "react-router"
// services
import { showErrorMsg, showSuccessMsg } from "../../services/event-bus.service"
import { addColumn, addGroup, addTask, removeColumn, removeGroup, setNewGroupIdToEdit, updateGroup, updateGroupsOrder } from "../../store/actions/board.actions"

// cmps
import { TaskList } from "../Task/TaskList";
import { GroupPreview } from "./GroupPreview";
import { GroupCollapsed } from "./GroupCollapsed";
import { closestCorners, DndContext, DragOverlay, MouseSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { GroupOverlay } from "./GroupOverlay";



export function GroupList({ groups, managingType }) {
    const { boardId } = useParams()

    const [localGroups, setLocalGroups] = useState(groups)
    const [isDragging, setIsDragging] = useState(false)
    const [activeId, setActiveId] = useState(null);

    const board = useSelector(state => state.boardModule.board)


    


    const mouseSensor = useSensor(MouseSensor, {
        activationConstraint: {
            distance: 15,
        },
    });

    const sensors = useSensors(mouseSensor);


    useEffect(() => {
        setLocalGroups(groups)
    }, [groups, board])


    async function onUpdateGroup(groupToUpdate) {

        try {
            await updateGroup(boardId, groupToUpdate)
            showSuccessMsg('group updated successfully')
        } catch (err) {
            console.log(err)
            showErrorMsg('cannot update group')
            throw err
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

    async function onAddGroup() {
        try {
            await addGroup(boardId)
            showSuccessMsg('group added to the board')
        } catch (err) {
            console.log(err)
            showErrorMsg('cannot add group')
        }
    }

    function onAddColumn(columnType) {
        addColumn(board, columnType)
    }

    function onRemoveColumn(colName) {
        removeColumn(board, colName)
        
    }

    // This needs to be improved, add the group's IDX, and add the new one below it.

    async function onAddTask(groupId, title) {
        try {
            await addTask(boardId, groupId, title)
            showSuccessMsg('task added to the board')
        } catch (err) {
            console.log(err)
            showErrorMsg('cannot add task')
        }
    }


    async function onOpenGroupEditor(groupId) {
        try {
            setNewGroupIdToEdit(groupId)
        } catch (err) {
            console.log(err)
            showErrorMsg('cannot open group editor')
        }
    }




    function onDragStart(event) {
        const { active } = event;
        setActiveId(active.id);
        setIsDragging(true)
    }

    function onDragEnd(event) {
        const { active, over } = event;
        setActiveId(null);
        setIsDragging(false)

        if (!over || active.id === over.id) {
            return;
        }

        const oldIndex = localGroups.findIndex((group) => group.id === active.id);
        const newIndex = localGroups.findIndex((group) => group.id === over.id);

        const reorderedGroups = arrayMove(localGroups, oldIndex, newIndex);
        setLocalGroups(reorderedGroups);
        onUpdateGroupsOrder(reorderedGroups, boardId)
    }

    async function onUpdateGroupsOrder(groups, boardId) {
        try {
            await updateGroupsOrder(groups, boardId)
            showSuccessMsg('groups order updated successfully')
        } catch (err) {
            console.log(err)
            showErrorMsg('cannot update groups order')
        }

    }

    return (

        <DndContext
            collisionDetection={closestCorners}
            sensors={sensors}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
        >

            <section
                className={`group-list ${isDragging ? 'collapsed' : ''}`}
            >

                <SortableContext items={localGroups} strategy={verticalListSortingStrategy} >
                    {localGroups.map((group, idx) => {

                        return isDragging ?
                            <GroupCollapsed
                                key={group.id}
                                group={group}
                                groupsLength={localGroups.length}
                            />
                            :

                            <GroupPreview
                                key={group.id}
                                group={group}
                                managingType={managingType}
                                TaskList={TaskList}
                                onUpdateGroup={onUpdateGroup}
                                onRemoveGroup={onRemoveGroup}
                                onAddTask={onAddTask}
                                groupsLength={localGroups.length}
                                onAddGroup={onAddGroup}
                                onOpenGroupEditor={onOpenGroupEditor}
                                onAddColumn={onAddColumn}
                                onRemoveColumn={onRemoveColumn}
                            />

                    })}


                </SortableContext>

            </section>
            <DragOverlay>

                {activeId ? (
                    <GroupOverlay
                        group={localGroups.find(group => group.id === activeId)}
                        groupsLength={localGroups.length}
                    />
                ) : null}
            </DragOverlay>


        </DndContext>
    )
}

