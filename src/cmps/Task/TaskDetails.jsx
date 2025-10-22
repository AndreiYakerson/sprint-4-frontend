import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router"
import { SvgIcon } from "../SvgIcon"
import { NavLink } from "react-router-dom"


export function TaskDetails() {
    const { boardId, taskId } = useParams()
    const navigate = useNavigate()

    const board = useSelector(storeState => storeState.boardModule.board)
    const [task, setTask] = useState(null)


    useEffect(() => {
        if (taskId && board) {
            setTaskForDetails(taskId, board)
        }
    }, [board, taskId])

    function setTaskForDetails(taskId, board) {
        var foundTask = null
        for (const group of board?.groups) {
            const task = group.tasks.find(task => task.id === taskId)
            if (task) {
                foundTask = task
                break
            }
        }

        if (foundTask) {
            setTask(foundTask)
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
                    <h2>{task?.title}</h2>
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