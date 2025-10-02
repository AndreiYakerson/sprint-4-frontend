import { useState } from "react"
import { showErrorMsg } from "../../services/event-bus.service"

export function TitleEditor({ info, onUpdate }) {

    const [nameToEdit, setNameToEdit] = useState(info?.currTitle || '')
    const [isEditing, setIsEditing] = useState(false)


    function saveChanges() {
        setIsEditing(false)
        const trimmedName = nameToEdit?.trim()

        if (trimmedName && trimmedName !== info?.currTitle) {
            onUpdate(trimmedName)
            if (info?.placeholder) setNameToEdit('')
        } else if (!trimmedName) {
            if (!info?.placeholder) showErrorMsg(`Title can't be empty`)
            setNameToEdit(info?.currTitle)
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
                    placeholder={info?.placeholder ? "+ Add Task" : ""}
                />
                : <span className="task-name" onClick={() => setIsEditing(true)}>
                    {info?.placeholder && !info?.currTitle ? info?.placeholder : info?.currTitle}
                </span>
            }
        </>
    )
}