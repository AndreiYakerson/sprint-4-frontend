import { useState } from "react"
import { showErrorMsg } from "../../services/event-bus.service"

export function TitleEditor({ info, onUpdate }) {

    const [nameToEdit, setNameToEdit] = useState(info?.currTitle)
    const [isEditing, setIsEditing] = useState(false)


    function saveChanges() {
        setIsEditing(false)
        if (nameToEdit && nameToEdit !== info?.currTitle) {
            onUpdate(nameToEdit)
            // if (placeholder) setNameToEdit('')
        } else if (!nameToEdit) {
            showErrorMsg(`Title can't be empty`)
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
                // placeholder={placeholder ? "+ Add task" : ""}
                />
                : <span className="task-name" onClick={() => setIsEditing(true)}>
                    {/* {placeholder && !nameToEdit ? placeholder : nameToEdit} */}
                    {info?.currTitle}
                </span>
            }
        </>
    )
}