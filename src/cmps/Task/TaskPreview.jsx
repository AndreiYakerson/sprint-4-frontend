import { useState } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"

// services
import { removeTask, updateTask } from "../../store/actions/board.actions.js"
import { showErrorMsg, showSuccessMsg } from "../../services/event-bus.service"

// cmps
// import { DynamicCmp } from "../DynamicCmp"
import { TitleEditor } from "./TitleEditor"

// icon
import updateIcon from "/icons/update.svg"
import person from "/icons/person.svg"
import plus from "/icons/plus.svg"
import danPic from "/img/danPic.jpg"


import { FloatingContainerCmp } from "../FloatingContainerCmp.jsx"
import { MemberTaskSelect } from "../TaskCmps/MembersCmp/MemberTaskSelect.jsx"
import { PopUp } from "../PopUp.jsx"
import { useSelector } from "react-redux"
import { MemberSelectedPreview } from "../TaskCmps/MembersCmp/MemberSelectedPreview.jsx"
import { DatePicker } from "../TaskCmps/DateCmp/DatePicker.jsx"
import { PriorityPreview } from "../TaskCmps/PriorityCmp/PriorityPreview.jsx"

export function TaskPreview({ task, groupId, dragHandleProps }) {
    const navigate = useNavigate()
    const isFloatingOpen = useSelector(state => state.systemModule.isFloatingOpen)

    const [membersSelectEl, setMembersSelectEl] = useState(null)
    const [memberEl, setMemberEl] = useState(null)

    const { boardId, taskId } = useParams()

    const [cmps, setCmps] = useState(
        [
            {
                type: 'TitleEditor',
                info: {
                    taskId: task?.id,
                    label: 'Title:',
                    propName: 'title',
                    currTitle: task?.title,
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
        ]
    )

    const cmpsOrder = ['StatusPicker', 'PriorityPicker', 'MemberPicker', 'DatePicker']

    async function updateCmpInfo(cmp, cmpInfoPropName, data, activityTitle) {

        console.log('data:', data)

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
        <>
            <div className="sticky-cell-wrapper">
                <div className="task-menu-wrapper">
                    <button onClick={onRemoveTask}>X</button>
                </div>
                <div className="table-border"></div>
                <div className="task-select"></div>
                <div className="task-title flex align-center" {...dragHandleProps}>
                    <TitleEditor info={cmps.find(cmp => cmp.type === 'TitleEditor')?.info} onUpdate={(data) => {
                        updateCmpInfo(cmps.find(cmp => cmp.type === 'TitleEditor'),
                            'currTitle', data, `Changed title to ${data}`)

                    }} />

                    <div className="grab-block"></div>

                    <div onClick={onToggleTaskDetails} className={`task-updates-cell ${task.id === taskId ? "focus" : ""}`}>
                        <img src={updateIcon} alt="update" className="icon big" />
                    </div>

                    {/* {task.title}
                    <Link to={taskId && taskId === task?.id ? `/board/${boardId}` : `/board/${boardId}/task/${task.id}`}
                        className="btn">details</Link>
                    <button onClick={() => onUpdateTask()}>update</button> */}
                </div>
            </div >


            <div className="task-columns flex">
                {cmpsOrder.map((colName, idx) => {
                    
                        if (colName === 'PriorityPicker') {
                            return <div style={{ cursor: 'pointer' }} key={colName} className={`column-cell ${colName}`}>
                                <PriorityPreview />
                            </div>
                        }
                    
                    if (colName === 'MemberPicker') {
                        return <div onClick={(ev) => setMembersSelectEl(ev.currentTarget)} style={{ cursor: 'pointer' }} key={colName} className={`column-cell ${colName}`}>
                            <MemberSelectedPreview task={task} />

                            {membersSelectEl &&
                                < FloatingContainerCmp
                                    anchorEl={membersSelectEl}
                                    onClose={() => setMembersSelectEl(null)}
                                >
                                    <MemberTaskSelect
                                        boardId={boardId}
                                        groupId={groupId}
                                        task={task}
                                        onClose={() => setMembersSelectEl(null)}
                                    />
                                </FloatingContainerCmp>
                            }
                        </div>
                    } else if (colName === 'DatePicker') {
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
        </>
    )
}



function DynamicCmp({ cmp, updateCmpInfo }) {
    switch (cmp?.type) {
        // case 'StatusPicker':
        //     return <StatusPicker info={cmp.info} onUpdate={(data) => {
        //         updateCmpInfo(cmp, 'selectedStatus', data, `Changed Status to ${data}`)
        //     }} />
        case 'DatePicker':
            return <DatePicker info={cmp?.info} onUpdate={(data) => {
                updateCmpInfo(cmp, 'selectedDate', data, `Changed due date to ${data}`)
            }} />
        // case 'MemberPicker':
        //     return <MemberPicker info={cmp.info} onUpdate={(data) => {
        //         updateCmpInfo(cmp, 'selectedMemberIds', data, `Changed members`)
        //     }} />
        default:
            return <p>{cmp?.type}</p>
    }
}

