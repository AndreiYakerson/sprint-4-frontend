import { useEffect, useState } from "react"
import { Outlet, useNavigate, useParams } from "react-router"
import { useSelector } from "react-redux"

// services
import { getTaskById, updateTask } from "../../store/actions/board.actions"

// cmps
import { SvgIcon } from "../SvgIcon"
import { showErrorMsg, showSuccessMsg } from "../../services/event-bus.service"
import { TitleEditor } from "./TitleEditor"
import { NavLink } from "react-router-dom"


export function TaskDetails() {
    const { boardId, taskId } = useParams()
    const navigate = useNavigate()

    const board = useSelector(storeState => storeState.boardModule.board)
    const task = useSelector(storeState => storeState.boardModule.taskDetails)

    const [titleToEdit, setTitleToEdit] = useState('')
    const [isTaskLoading, setIsTaskLoading] = useState(false)


    useEffect(() => {
        if (taskId && boardId) {
            loadTask(boardId, taskId)
        }
    }, [taskId])

    useEffect(() => {
        if (task?.title !== titleToEdit) {
            setTitleToEdit(task?.title)
        }
    }, [task])

    async function loadTask(boardId, taskId) {
        setIsTaskLoading(true)
        try {
            await getTaskById(boardId, taskId)
        } catch (err) {
            console.log(err)
            showErrorMsg('cannot load task')
        } finally {
            setTimeout(() => {
                setIsTaskLoading(false)
            }, 100)
        }
    }

    async function onUpdateTaskTitle(newTitle) {
        console.log("🚀 ~ onUpdateTaskTitle ~ newTitle:", newTitle)
        const preTitleCopy = task?.title
        setTitleToEdit(newTitle)

        const taskToUpdate = structuredClone(task)
        delete taskToUpdate.groupId
        delete taskToUpdate.activities
        taskToUpdate.title = newTitle

        const activityTitle = `Changed title to ${newTitle}`

        try {
            await updateTask(board?._id, task?.groupId, taskToUpdate, activityTitle)
            showSuccessMsg('task updated successfully')
        } catch (err) {
            showErrorMsg('cannot update task')
            setTitleToEdit(preTitleCopy)
        }
    }

    function onCloseTaskDetails() {
        navigate(`/board/${boardId}`)
    }

    // if (!task) return
    return (
        <div className={`task-details ${taskId ? "open" : ""}`}>

            <header className="task-details-header">

                <button
                    onClick={onCloseTaskDetails}
                    className="transparent close-btn">
                    <SvgIcon iconName='xMark' size={24} colorName='secondaryText' />
                </button>

                <div className="task-title-container">
                    {isTaskLoading
                        ? <div className="shimmer-block"></div>
                        : <h2>
                            <TitleEditor
                                info={{ currTitle: titleToEdit }}
                                onUpdate={onUpdateTaskTitle}
                            />
                        </h2>
                    }
                </div>

                <nav className="task-details-nav flex">
                    <div className='nav-btn-wrapper'>
                        <NavLink to='updates' className="btn btn-name">Updates</NavLink>
                    </div>
                    {/* <div className='nav-btn-wrapper'>
                        <NavLink to='files' className="btn btn-name">Files</NavLink>
                    </div> */}
                    <div className='nav-btn-wrapper'>
                        <NavLink to='log' className="btn btn-name">Activity Log</NavLink>
                    </div>
                </nav>

            </header>

            <div className="task-details-content">
                {isTaskLoading
                    ? <div className="mini-loader-wrapper">
                        <div className="mini-loader"></div>
                    </div>
                    : <Outlet />
                }
            </div>


        </div>
    )
}