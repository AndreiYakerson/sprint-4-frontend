import { useState } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"

// services
import { removeTask, updateTask } from "../../store/actions/board.actions.js"
import { showErrorMsg, showSuccessMsg } from "../../services/event-bus.service"
import { onSetPopUpIsOpen } from "../../store/actions/system.actions.js"

// cmps
import { DynamicCmp } from "../DynamicCmp"
import { TitleEditor } from "./TitleEditor"

// icon
import updateIcon from "/icons/update.svg"
import person from "/icons/person.svg"
import plus from "/icons/plus.svg"
import { MembersCmp } from "../TaskCmps/MembersCmp.jsx"
import { FloatingContainerCmp } from "../FloatingContainerCmp.jsx"
import { MembersSelectCmp } from "../TaskCmps/MembersSelectCmp.jsx"
import { PopUp } from "../PopUp.jsx"
import { useSelector } from "react-redux"

export function TaskPreview({ task, groupId }) {
    const navigate = useNavigate()
    const [membersSelectEl, setMembersSelectEl] = useState(null)
    const [memberEl, setMemberEl] = useState(null)

    const { boardId, taskId } = useParams()

    const [cmps, setCmps] = useState(
        [
            {
                type: 'TitleEditor',
                info: {
                    label: 'Title:',
                    propName: 'title',
                    currTitle: task.title,
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
        console.log("🚀 ~ updateCmpInfo ~ updatedTask:", updatedTask)
        updatedTask[taskPropName] = data

        // onUpdateTask(updatedTask, activityTitle)
        try {
            await updateTask(boardId, groupId, updatedTask, activityTitle)
            showSuccessMsg(`Task updated`)
        } catch (err) {
            console.log('err:', err)
            showErrorMsg('Cannot update task')
        }
    }

    //FIXME צריך להפוך להיות action  

    // async function onUpdateTask(updatedTask, activityTitle) {
    //     try {
    //         await updateTask(boardId, groupId, updatedTask, activityTitle)
    //         showSuccessMsg(`Task updated`)
    //     } catch (err) {
    //         console.log('err:', err)
    //         showErrorMsg('Cannot update task')
    //     }
    // }

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
                <div className="task-title flex align-center">
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
                {cmpsOrder.map(colName => {
                    return <div onClick={(ev) => setMembersSelectEl(ev.currentTarget)} key={colName} className="cell">
                        <span className="cmp-img">
                            <img src={plus} className="icon big " alt="plus icon" />
                            <img
                                onMouseLeave={() => setMemberEl(null)}
                                onMouseOver={(ev) => setMemberEl(ev.currentTarget)}
                                // src={loggedinUser?  loggedinUser.img : person}
                                src={person}
                                className="icon big hover-show"
                                alt="person icon"
                            />
                        </span>

                        {/* <PopUp>
                            <MembersSelectCmp
                            //  updateTask={()=>onUpdateTask()}
                            //  activityTitle={activityTitle}
                              />
                        </PopUp> */}

                        {membersSelectEl &&
                            < FloatingContainerCmp
                                anchorEl={membersSelectEl}
                                onClose={() => setMembersSelectEl(null)}
                            >
                                <MembersSelectCmp />
                            </FloatingContainerCmp>
                        }


                        {memberEl && !task.AddedMembers?.length && !membersSelectEl &&
                            < FloatingContainerCmp
                                anchorEl={memberEl}
                                onClose={() => setMemberEl(null)}
                            >
                                <MembersCmp />
                            </FloatingContainerCmp>
                        }
                    </div>
                })}
                <div className="cell full"></div>
            </div >

        </>
    )
}




{/* {cmpsOrder.map((cmp, idx) => {
                return (


                    // <DynamicCmp
                    //     cmp={cmp}
                    //     key={idx}
                    //     onUpdate={data => {
                    //         console.log('Updating: ', cmp, 'with data:', data)
                    //         // make a copy, update the task, create an action
                    //         // Call action: updateTask(task, action)
                    //     }}
                    // />
                )
            })} */}