import { useEffect, useRef, useState } from "react"
import { useSelector } from "react-redux"
import { useParams } from "react-router"

import "react-quill-new/dist/quill.snow.css"
import ReactQuill from "react-quill-new"

// services
import { addUpdateToTask } from "../../store/actions/board.actions"
import { formatTimeAgo } from "../../services/util.service"

// img
import noUpdatesImg from '/img/no-updates.svg'

export function Updates() {
    const { boardId } = useParams()
    const task = useSelector(storeState => storeState.boardModule.taskDetails)

    const editorWrapperRef = useRef(null)
    const boxRef = useRef(null)
    const quillRef = useRef(null)

    const [isEditing, setIsEditing] = useState(false)
    const [updateToEdit, setUpdateToEdit] = useState("")

    async function onAddUpdateToTask(ev) {
        ev.preventDefault()
        try {
            await addUpdateToTask(boardId, task?.groupId, task?.id, updateToEdit)
            setIsEditing(false)
            setUpdateToEdit("")
        } catch (err) {
            console.log("err:", err)
        }
    }

    useEffect(() => {
        function handleClickOutside(ev) {
            if (!isEditing) return
            const wrapperEl = editorWrapperRef.current
            if (wrapperEl && !wrapperEl.contains(ev.target)) {
                setIsEditing(false)
                setUpdateToEdit("")
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [isEditing])

    if (!task) return null

    const { updates } = task
    const toolbarOptions = [
        [{ size: ["small", false, "large", "huge"] }],
        ["bold", "italic", "underline", "strike"],
        [{ color: [] }],
        ["link"],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ align: [] }],
        ["clean"]
    ]

    return (
        <section className="task-details-updates">
            {isEditing ? (
                <form onSubmit={onAddUpdateToTask} className="update-form" ref={editorWrapperRef}>
                    <div className="text-editor-wrapper">
                        <ReactQuill
                            ref={quillRef}
                            theme="snow"
                            value={updateToEdit}
                            onChange={setUpdateToEdit}
                            placeholder="Write an update..."
                            modules={{ toolbar: toolbarOptions }}
                        />
                    </div>
                    <button type="submit" className="blue">Update</button>
                </form>
            ) : (
                <div ref={boxRef} className="editor-placeholder" onClick={() => setIsEditing(true)}>
                    Write an update
                </div>
            )}

            {updates?.length > 0
                ? (
                    <ul className="updates-list">
                        {updates.map(update => (
                            <li key={update?.id} className="update-item">
                                <header className="update-header">
                                    <img
                                        className="user-img"
                                        src={update?.byMember?.imgUrl}
                                        alt={update?.byMember?.fullname}
                                    />
                                    <div className="update-user-name">{update?.byMember?.fullname}</div>
                                    <div>{formatTimeAgo(update?.createdAt)}</div>
                                </header>

                                <div
                                    className="update-txt"
                                    dangerouslySetInnerHTML={{ __html: update?.title }}
                                />
                            </li>
                        ))}
                    </ul>
                )
                : <div className="no-updates-msg">
                    <img src={noUpdatesImg} alt="no-updates" />
                    <h3>No updates yet</h3>
                    <h4>
                        Share progress, mention a teammate,
                        or upload a file to get things moving
                    </h4>
                </div>
            }

        </section>
    )
}