
// services
import { useParams, Link, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { removeTask, updateTask } from "../../store/actions/board.actions.js"
import { showErrorMsg, showSuccessMsg } from "../../services/event-bus.service"
import { useSelector } from "react-redux"
import { DatePicker } from "../TaskCmps/DateCmp/DatePicker.jsx"
import { PriorityPicker } from "../TaskCmps/PriorityCmp/PriorityPicker.jsx"

// dnd kit
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
// import { DragOverlay } from "@dnd-kit/core"

// cmps
// import { DynamicCmp } from "../DynamicCmp"
import { TitleEditor } from "./TitleEditor"

// icon
// import updateIcon from "/icons/update.svg"
import { MemberPicker } from "../TaskCmps/MembersCmp/MemberPicker.jsx"
import { StatusPicker } from "../TaskCmps/StatusPicker.jsx"


// import { FloatingContainerCmp } from "../FloatingContainerCmp.jsx"
// import { MemberTaskSelect } from "../TaskCmps/MembersCmp/MemberTaskSelect.jsx"
// import { PopUp } from "../PopUp.jsx"
// import { MemberSelectedPreview } from "../TaskCmps/MembersCmp/MemberSelectedPreview.jsx"
// import { PriorityPreview } from "../TaskCmps/PriorityCmp/PriorityPreview.jsx"


import { SvgIcon } from "../SvgIcon.jsx"



export function TaskPreview({ task, groupId, tasksLength }) {
    const navigate = useNavigate()
    const isFloatingOpen = useSelector(state => state.systemModule.isFloatingOpen)
    const board = useSelector(state => state.boardModule.board)

    const [membersSelectEl, setMembersSelectEl] = useState(null)
    const [memberEl, setMemberEl] = useState(null)

    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id, disabled: tasksLength < 2 })

    const style = {
        transition: transition,
        transform: CSS.Transform.toString(transform),
    }
    const { boardId, taskId } = useParams()

    const [cmps, setCmps] = useState(
        [
            {
                type: 'StatusPicker',
                info: {
                    label: 'Status:',
                    propName: 'status',
                    selectedStatus: task.status,
                    statuses: board.statuses,
                }
            },
            {
                type: 'MemberPicker',
                info: {
                    label: 'Members:',
                    propName: 'memberIds',
                    selectedMemberIds: task.memberIds || [],
                    members: board.members,
                }
            },
            {
                type: 'PriorityPicker',
                info: {
                    label: 'priority:',
                    propName: 'priority',
                    taskPriority: task.priority,
                    boardPriorities: board.priorities,
                    boardId: board._id
                }
            },
            {
                type: 'DatePicker',
                info: {
                    label: 'Due date:',
                    propName: 'dueDate',
                    selectedDate: task?.dueDate,
                }
            },
            {
                type: 'TitleEditor',
                info: {
                    taskId: task?.id,
                    label: 'Title:',
                    propName: 'title',
                    currTitle: task?.title,
                }

            },
        ]
    )
    //QUESTION  Updates the view on change to task and board
    // אני חושש שזה גורם לרינדור מיותר 
    useEffect(() => {
        setCmps([

            {
                type: 'StatusPicker',
                info: {
                    label: 'Status:',
                    propName: 'status',
                    selectedStatus: task.status,
                    statuses: board.statuses,
                }
            },
            {
                type: 'MemberPicker',
                info: {
                    label: 'Members:',
                    propName: 'memberIds',
                    selectedMemberIds: task.memberIds || [],
                    members: board.members,
                }
            },
            {
                type: 'PriorityPicker',
                info: {
                    label: 'priority:',
                    propName: 'priority',
                    taskPriority: task.priority,
                    boardPriorities: board.priorities,
                    boardId: board._id
                }
            },
            {
                type: 'DatePicker',
                info: {
                    label: 'Due date:',
                    propName: 'dueDate',
                    selectedDate: task?.dueDate,
                }
            },
            {
                type: 'TitleEditor',
                info: {
                    taskId: task?.id,
                    label: 'Title:',
                    propName: 'title',
                    currTitle: task?.title,
                }
            },
        ])
    }, [task, board])

    const cmpsOrder = ['StatusPicker', 'PriorityPicker', 'MemberPicker', 'DatePicker']

    async function updateCmpInfo(cmp, cmpInfoPropName, data, activityTitle) {

        const taskPropName = cmp.info.propName
        console.log(`Updating: ${taskPropName} to: `, data)

        // Update cmps in local state
        const updatedCmp = structuredClone(cmp)
        updatedCmp.info[cmpInfoPropName] = data
        setCmps(cmps.map(currCmp => (currCmp.info.propName !== cmp.info.propName) ? currCmp : updatedCmp))

        // Update the task
        const updatedTask = structuredClone(task)
        updatedTask[taskPropName] = data

        try {
            await updateTask(boardId, groupId, updatedTask, activityTitle)
            showSuccessMsg(`Task updated`)
        } catch (err) {
            console.log('err:', err)
            showErrorMsg('Cannot update task')
        }
    }


    async function onRemoveTask() {
        try {
            await removeTask(boardId, groupId, task.id)
            showSuccessMsg('task removed successfully')
        } catch (err) {
            console.log(err)
            showErrorMsg('cannot remove task')
        }
    }


    function onToggleTaskDetails() {
        navigate(taskId && taskId === task?.id
            ? `/board/${boardId}`
            : `/board/${boardId}/task/${task.id}`)
    }



    return (
        <div className={`task-preview ${isDragging ? 'dragged' : ''}`} ref={setNodeRef} style={style} {...attributes}>

            {isDragging ? <div className="dragged"></div> :

                <div className="sticky-cell-wrapper" >
                    <div className="task-menu-wrapper">
                        <button onClick={onRemoveTask} className="white">
                            <SvgIcon
                                iconName="trash"
                                size={20}
                                colorName={'primaryText'}
                            /></button>
                    </div>

                    <div className="table-border"></div>
                    <div className="task-select"></div>
                    <div className="task-title flex align-center">
                        <TitleEditor info={cmps.find(cmp => cmp.type === 'TitleEditor')?.info} onUpdate={(data) => {
                            updateCmpInfo(cmps.find(cmp => cmp.type === 'TitleEditor'),
                                'currTitle', data, `Changed title to ${data}`)

                        }} />

                        <div className="grab-block" {...listeners}></div>

                        <div onClick={onToggleTaskDetails} className={`task-updates-cell ${task.id === taskId ? "focus" : ""}`}>
                            <SvgIcon
                                iconName="bubblePlus"
                                size={20}
                                colorName={'primaryText'}
                            />
                        </div>
                    </div>

                </div >
            }


            <div className="task-columns flex">
                {cmpsOrder.map((colName, idx) => {

                    if (colName === 'StatusPicker') {
                        var cmp = cmps.find(cmp => cmp?.type === 'StatusPicker')
                        return <div className="column-cell" key={colName}>
                            {DynamicCmp({ cmp, updateCmpInfo })}
                        </div>
                    }
                    if (colName === 'MemberPicker') {
                        var cmp = cmps.find(cmp => cmp?.type === 'MemberPicker')
                        return <div className="column-cell" key={colName}>
                            {DynamicCmp({ cmp, updateCmpInfo })}
                        </div>
                    }
                    if (colName === 'PriorityPicker') {
                        var cmp = cmps.find(cmp => cmp?.type === 'PriorityPicker')
                        return <div className="column-cell" key={colName}>
                            {DynamicCmp({ cmp, updateCmpInfo })}
                        </div>
                    }
                    if (colName === 'DatePicker') {
                        var cmp = cmps.find(cmp => cmp?.type === 'DatePicker')
                        return <div className="column-cell" key={colName}>
                            {DynamicCmp({ cmp, updateCmpInfo })}
                        </div>
                    }
                    else {
                        return <div className="column-cell" key={idx}></div>
                    }
                })
                }
                <div className="column-cell full"></div>
            </div >
        </div>
    )
}




function DynamicCmp({ cmp, updateCmpInfo }) {
    switch (cmp?.type) {
        case 'StatusPicker':
            return <StatusPicker info={cmp.info} onUpdate={(data) => {
                updateCmpInfo(cmp, 'selectedStatus', data, `Changed Status to ${data}`)
            }} />
        case 'DatePicker':
            return <DatePicker info={cmp?.info} onUpdate={(data) => {
                updateCmpInfo(cmp, 'selectedDate', data, `Changed due date to ${data}`)
            }} />
        case 'PriorityPicker':
            return <PriorityPicker info={cmp?.info} onUpdate={(data) => {
                updateCmpInfo(cmp, 'selectedPriority', data, `Changed due priority to ${data}`)
            }} />
        case 'MemberPicker':
            return <MemberPicker info={cmp.info} onUpdate={(data) => {
                updateCmpInfo(cmp, 'selectedMemberIds', data, `Changed members`)
            }} />
        default:
            return <p>{cmp?.type}</p>
    }
}

