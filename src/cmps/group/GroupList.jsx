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




    return (



        <section
            className="group-list"
        >
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
                />

            ))}
        </section>
    )
}

