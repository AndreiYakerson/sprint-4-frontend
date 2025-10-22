import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router"
import { useSelector } from "react-redux"

// services
import { getTaskById, updateTask } from "../../store/actions/board.actions"

// cmps
import { SvgIcon } from "../SvgIcon"
import { showErrorMsg } from "../../services/event-bus.service"
import { TitleEditor } from "./TitleEditor"


export function TaskDetails() {
    const { boardId, taskId } = useParams()
    const navigate = useNavigate()

    const board = useSelector(storeState => storeState.boardModule.board)
    const task = useSelector(storeState => storeState.boardModule.taskDetails)
    const [titleToEdit, setTitleToEdit] = useState('')


    useEffect(() => {
        if (taskId && boardId) {
            loadTask(boardId, taskId)
        }
    }, [taskId, board])

    useEffect(() => {
        if (task?.title !== titleToEdit) {
            setTitleToEdit(task?.title)
        }
    }, [task])

    async function loadTask(boardId, taskId) {
        try {
            await getTaskById(boardId, taskId)
        } catch (err) {
            console.log(err)
            showErrorMsg('cannot load task')
        }
    }

    async function onUpdateTaskTitle(newTitle) {
        const preTitleCopy = task?.title
        setTitleToEdit(newTitle)

        const taskToUpdate = structuredClone(task)
        delete taskToUpdate.groupId
        taskToUpdate.title = newTitle

        try {
            await updateTask(board?._id, task?.groupId, taskToUpdate)
        } catch (err) {
            showErrorMsg('cannot update task')
            setTitleToEdit(preTitleCopy)
        }
    }

    function onCloseTaskDetails() {
        navigate(`/board/${boardId}`)
    }

    if (!task) return
    return (
        <div className={`task-details ${task ? "open" : ""}`}>

            <header className="task-details-header">

                <button
                    onClick={onCloseTaskDetails}
                    className="transparent close-btn">
                    <SvgIcon iconName='xMark' size={24} colorName='secondaryText' />
                </button>

                <div className="task-title-container">
                    <h2>
                        <TitleEditor
                            info={{ currTitle: titleToEdit }}
                            onUpdate={onUpdateTaskTitle}
                        />
                    </h2>
                </div>

                <nav className="task-details-nav flex">
                    <div className='nav-btn-wrapper'>
                        <button className="btn-name">Updates</button>
                    </div>
                    <div className='nav-btn-wrapper'>
                        <button className="btn-name">Files</button>
                    </div>
                    <div className='nav-btn-wrapper'>
                        <button className="btn-name">Activity Log</button>
                    </div>
                </nav>

            </header>

            <div className="task-details-content">

            </div>


        </div>
    )
}