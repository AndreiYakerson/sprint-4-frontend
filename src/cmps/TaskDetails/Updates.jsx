import { useEffect, useRef, useState } from "react"
import { addUpdateToTask } from "../../store/actions/board.actions"
import { useParams } from "react-router"
import { useSelector } from "react-redux"
import { formatTimeAgo } from "../../services/util.service"

export function Updates(props) {

    const { boardId } = useParams()
    const task = useSelector(storeState => storeState.boardModule.taskDetails)

    const editorRef = useRef(null)
    const boxRef = useRef(null)


    const [isEditing, setIsEditing] = useState(false)
    const [updateToEdit, setUpdateToEdit] = useState('')

    async function onAddUpdateToTask(ev) {
        ev.preventDefault()

        try {
            await addUpdateToTask(boardId, task?.groupId, task?.id, updateToEdit)
            setIsEditing(false)
            setUpdateToEdit('')
        } catch (err) {
            console.log('err:', err)
        }
    }

    useEffect(() => {
        function handleClickOutside(ev) {
            if (!isEditing) return

            const editorEl = editorRef.current

            if (editorEl && !editorEl.contains(ev.target)) {
                setIsEditing(false)
                setUpdateToEdit('')
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [isEditing])




    if (!task) return

    const { updates } = task

    return (
        <section className="task-details-updates">

            {isEditing
                ? <form
                    ref={editorRef}
                    onSubmit={onAddUpdateToTask}
                    className="update-editor"
                >
                    <textarea
                        name="update"
                        id="update"
                        value={updateToEdit}
                        autoFocus
                        onChange={(ev) => setUpdateToEdit(ev.target.value)}
                        required
                    ></textarea>
                    <button type="submit" className="blue">Update</button>
                </form>
                : <div
                    ref={boxRef}
                    className="box"
                    onClick={() => setIsEditing(true)}
                >
                    Write an update
                </div>
            }


            {updates?.length > 0 &&
                <ul className="updates-list">
                    {updates.map(update => {
                        return <li key={update?.id} className="update-item">
                            <header className="update-header">
                                <img
                                    className="user-img"
                                    src={update?.byMember?.imgUrl}
                                    alt={update?.byMember?.fullname}
                                />
                                <div className="fullname">{update?.byMember?.fullname}</div>
                                <div>{formatTimeAgo(update?.createdAt)}</div>
                            </header>
                            <pre className="update-txt">
                                {update?.title}
                            </pre>
                        </li>
                    })}
                </ul>
            }


        </section>
    )

}