import { useSelector } from "react-redux";
import { useState, useEffect } from "react";


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
import { DndContext } from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";


export function GroupList({ groups, managingType }) {
    const { boardId } = useParams()

    const [localGroups, setLocalGroups] = useState(groups)


    useEffect(() => {
        setLocalGroups(groups)
    }, [groups])


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

    function onDragEnd(event) {
        const { active, over } = event;

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
            onDragEnd={onDragEnd}
        >

            <section
                className="group-list"
            >

                <SortableContext items={localGroups} strategy={verticalListSortingStrategy} >
                    {localGroups.map((group, idx) => (

                        <GroupPreview
                            key={group.id}
                            group={group}
                            GroupTitleEditor={GroupTitleEditor}
                            managingType={managingType}
                            TaskList={TaskList}
                            TitleEditor={TitleEditor}
                            onUpdateGroup={onUpdateGroup}
                            onRemoveGroup={onRemoveGroup}
                            onAddTask={onAddTask}
                            groupsLength={localGroups.length}
                        />

                    ))}
                </SortableContext>
            </section>

        </DndContext>
    )
}

