import { useEffect, useState } from "react"
import { showErrorMsg } from "../../services/event-bus.service"
import { useSelector } from "react-redux"
import { setNewTaskIdToEdit } from "../../store/actions/board.actions"

export function TitleEditor({ info, onUpdate, onSetRenameBoard }) {

    const [nameToEdit, setNameToEdit] = useState(info?.currTitle || '')
    const [isEditing, setIsEditing] = useState(false)
    const newTaskIdToEdit = useSelector(storeState => storeState.boardModule.newTaskIdToEdit)


    useEffect(() => {
        if (newTaskIdToEdit === info?.taskId) {
            setIsEditing(true)
            setNewTaskIdToEdit(null)
        }

    }, [newTaskIdToEdit])

    useState(() => {
        if (info?.toRenameBoard) {
            setIsEditing(true)
        }
    }, [info])

    function saveChanges() {
        setIsEditing(false)
        const trimmedName = nameToEdit?.trim()

        if (trimmedName && trimmedName !== info?.currTitle) {
            onUpdate(trimmedName)
            if (info?.placeholder) setNameToEdit('')
        } else if (!trimmedName) {
            if (info?.toRenameBoard) {
                setNameToEdit(info?.currTitle)
                return onSetRenameBoard(false)
            }
            if (!info?.placeholder) showErrorMsg(`Title can't be empty`)
            setNameToEdit(info?.currTitle)
        } else if (info?.toRenameBoard) {
            onSetRenameBoard(false)
        }
    }

    return (
        <>
            {isEditing
                ? <input
                    type="text"
                    name="task-title"
                    id="task-title"
                    className='task-title-input'
                    value={nameToEdit}
                    autoFocus
                    onChange={(ev) => setNameToEdit(ev.target.value)}
                    onBlur={() => saveChanges()}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") saveChanges()
                    }}
                    placeholder={info?.placeholder ? info?.placeholder : "+ Add Item"}
                />
                : <span className="task-name" onClick={() => setIsEditing(true)}>
                    {info?.placeholder && !info?.currTitle ? info?.placeholder : info?.currTitle}
                </span>
            }
        </>
    )
}