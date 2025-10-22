
import { useEffect, useRef, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"

//dnd-kit
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

// services
import { duplicateTask, removeTask, updateTask } from "../../store/actions/board.actions.js"
import { showErrorMsg, showSuccessMsg } from "../../services/event-bus.service"

// cmps
import { SvgIcon } from "../SvgIcon.jsx"
import { ActionsMenu } from "../ActionsMenu.jsx"
import { FloatingContainerCmp } from "../FloatingContainerCmp.jsx"
import { useSearchParams } from "react-router-dom";

// DynamicCmp
import { TitleEditor } from "./TitleEditor"
import { DatePicker } from "../TaskCmps/DateCmp/DatePicker.jsx"
import { PriorityPicker } from "../TaskCmps/PriorityCmp/PriorityPicker.jsx"
import { MemberPicker } from "../TaskCmps/MembersCmp/MemberPicker.jsx"
import { StatusPicker } from "../TaskCmps/StatusCmp/StatusPicker.jsx"
import { TimelinePicker } from "../TaskCmps/TimelineCmp/TimelinePicker.jsx"


export function TaskPreview({ task, groupId, taskIdx }) {
    const navigate = useNavigate()
    const { boardId, taskId } = useParams()
    const [searchParams] = useSearchParams();

    // dnd
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id, disabled: searchParams.size > 0 })
    const style = {
        transition,
        transform: CSS.Transform.toString(transform),
        opacity: isDragging ? 0 : 1,
        border: isDragging ? '1px dashed transparent' : '',


    }

    const board = useSelector(state => state.boardModule.board)
    const cmpOrder = board?.cmpOrder || []
    const [titleToEdit, setTitleToEdit] = useState({ taskId: task?.id, currTitle: task?.title })

    const [cmps, setCmps] = useState(
        [
            {
                type: 'StatusPicker',
                info: {
                    label: 'Status:',
                    propName: 'status',
                    selectedStatus: task.status,

                }
            },
            {
                type: 'MemberPicker',
                info: {
                    label: 'Members:',
                    propName: 'memberIds',
                    selectedMemberIds: task.memberIds || [],

                }
            },
            {
                type: 'PriorityPicker',
                info: {
                    label: 'priority:',
                    propName: 'priority',
                    taskPriority: task.priority,
                    boardPriorities: board.priorities,

                }
            },
            {
                type: 'DatePicker',
                info: {
                    label: 'Due date:',
                    propName: 'dueDate',
                    selectedDate: task?.dueDate,
                    selectedStatus: task.status,
                }
            },
            {
                type: 'TimelinePicker',
                info: {
                    label: 'timeline:',
                    propName: 'timeline',
                    selectedTimeline: task?.timeline,
                }
            },
        ]
    )



    const [isMenuOpen, setIsMenuOpen] = useState(false)

    const btnRef = useRef(null)
    const menuRef = useRef(null)

    function toggleIsMenuOpen(ev) {
        ev.stopPropagation()
        setIsMenuOpen(!isMenuOpen)
    }

    function onCloseMenu() {
        setIsMenuOpen(false)
    }

    // crudl fncs

    async function updateCmpInfo(cmp, cmpInfoPropName, data, activityTitle) {

        console.log('data:', data)

        const taskPropName = cmp.info.propName
        console.log(`Updating: ${taskPropName} to: `, data)

        // Update cmps in local state
        const updatedCmp = structuredClone(cmp)
        updatedCmp.info[cmpInfoPropName] = data
        setCmps(prevCmps =>
            prevCmps.map(currCmp =>
                currCmp.info.propName !== cmp.info.propName ? currCmp : updatedCmp
            )
        )

        // Update the task
        const updatedTask = structuredClone(task)
        updatedTask[taskPropName] = data

        try {
            await updateTask(boardId, groupId, updatedTask, activityTitle)
            showSuccessMsg(`Task updated`)

            //If the status was updated successfully, in order to synchronize the status with the due date, 
            // this function updates the status data in the due date component.
            if (taskPropName === 'status') setStatusInDatePickerCmp(data)

        } catch (err) {
            console.log('err:', err)
            showErrorMsg('Cannot update task')
        }
    }

    function setStatusInDatePickerCmp(status) {
        setCmps(prevCmps =>
            prevCmps.map(currCmp =>
                currCmp.info.propName !== 'dueDate'
                    ? currCmp
                    : { ...currCmp, info: { ...currCmp.info, selectedStatus: status } }
            )
        )
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
            : `/board/${boardId}/task/${task.id}/updates`)
    }


    async function onDuplicateTask(task) {
        const taskCopy = structuredClone(task)
        taskCopy.title = taskCopy.title + ' (copy)'
        delete taskCopy?.id, delete taskCopy.createdAt

        try {
            await duplicateTask(boardId, groupId, taskCopy, taskIdx + 1)
            showSuccessMsg('task duplicated to the board')
        } catch (err) {
            console.log(err)
            showErrorMsg('cannot duplicate task')
        }
    }


    /// task title

    useEffect(() => {
        if (task?.title !== titleToEdit?.currTitle) {
            setTitleToEdit(prev => ({ ...prev, currTitle: task?.title }))
        }
    }, [task])

    async function onUpdateTaskTitle(newTitle, activityTitle) {
        const preTitleCopy = task?.title
        setTitleToEdit(prev => ({ ...prev, currTitle: newTitle }))

        const taskToUpdate = structuredClone(task)
        taskToUpdate.title = newTitle

        try {
            await updateTask(boardId, groupId, taskToUpdate, activityTitle)
        } catch (err) {
            showErrorMsg('cannot update task')
            setTitleToEdit(prev => ({ ...prev, currTitle: preTitleCopy }))
        }
    }


    return (

        <div className="task-preview" style={style} ref={setNodeRef} {...attributes}  >


            <div className="sticky-cell-wrapper" {...listeners}>
                <div className="task-menu-wrapper">
                    <button
                        onClick={toggleIsMenuOpen}
                        className='btn-shrink-wrapper '
                        ref={btnRef}>
                        <div
                            className={`btn white ${isMenuOpen ? "menu-open" : ""} shrink`}
                        >
                            <SvgIcon
                                iconName="dots"
                                size={16}
                                colorName={'primaryText'}
                            />
                        </div>
                    </button>


                    {isMenuOpen && <FloatingContainerCmp anchorEl={btnRef.current} onClose={onCloseMenu}>
                        <ActionsMenu
                            menuRef={menuRef}
                            onCloseMenu={onCloseMenu}
                            onRemoveItem={() => onRemoveTask(task?.id)}
                            onToggleIsItemOpen={() => onToggleTaskDetails()}
                            isItemOpen={taskId === task?.id}
                            onDuplicateItem={() => onDuplicateTask(task)}
                        />
                    </FloatingContainerCmp>}

                </div>

                <div className="table-border"></div>
                <div className="task-select"></div>
                <div className="task-title flex align-center">
                    <TitleEditor info={titleToEdit} onUpdate={(newTitle) => {
                        onUpdateTaskTitle(newTitle, `Changed title to ${newTitle}`)
                    }} />

                    <div className="grab-block" ></div>

                    <div onClick={onToggleTaskDetails} className={`task-updates-cell ${task.id === taskId ? "focus" : ""}`}>
                        <SvgIcon
                            iconName="bubblePlus"
                            size={20}
                            colorName={'primaryText'}
                        />
                    </div>
                </div>
            </div >

            <div className="task-columns flex">
                {cmpOrder.map((colName, idx) => {

                    if (colName === 'status') {
                        var cmp = cmps.find(cmp => cmp?.type === 'StatusPicker')
                        return <div className="column-cell status" key={colName}>
                            <DynamicCmp cmp={cmp} updateCmpInfo={updateCmpInfo} />

                        </div>
                    }
                    if (colName === 'members') {
                        var cmp = cmps.find(cmp => cmp?.type === 'MemberPicker')
                        return <div className="column-cell members" key={colName}>
                            <DynamicCmp cmp={cmp} updateCmpInfo={updateCmpInfo} />
                        </div>
                    }
                    if (colName === 'priority') {
                        var cmp = cmps.find(cmp => cmp?.type === 'PriorityPicker')
                        return <div className="column-cell priority" key={colName}>
                            <DynamicCmp cmp={cmp} updateCmpInfo={updateCmpInfo} />
                        </div>
                    }
                    if (colName === 'date') {
                        var cmp = cmps.find(cmp => cmp?.type === 'DatePicker')
                        return <div className="column-cell due-date " key={colName}>
                            <DynamicCmp cmp={cmp} updateCmpInfo={updateCmpInfo} />
                        </div>
                    }
                    if (colName === 'timeline') {
                        var cmp = cmps.find(cmp => cmp?.type === 'TimelinePicker')
                        return <div className="column-cell timeline " key={colName}>
                            <DynamicCmp cmp={cmp} updateCmpInfo={updateCmpInfo} />
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
                updateCmpInfo(cmp, 'taskPriority', data, `Changed due priority to ${data}`)
            }} />
        case 'MemberPicker':
            return <MemberPicker info={cmp.info} onUpdate={(data) => {
                updateCmpInfo(cmp, 'selectedMemberIds', data, `Changed members`)
            }} />
        case 'TimelinePicker':
            return <TimelinePicker info={cmp.info} onUpdate={(data) => {
                updateCmpInfo(cmp, 'selectedTimeline', data, `Changed timeline dates`)
            }} />
        default:
            return <p>{cmp?.type}</p>
    }
}

