import { useEffect, useRef, useState } from "react"
import { useSelector } from "react-redux"
// services
import { boardService } from "../../services/board/index.js"
import { setNewGroupIdToEdit } from "../../store/actions/board.actions.js"

export function GroupTitleEditor({ info, onUpdate }) {

    const [titleToEdit, setTitleToEdit] = useState(info)
    const [isEditing, setIsEditing] = useState(false)
    const [isColorPickerOpen, setIsColorPickerOpen] = useState(false)
    const [colors, setColors] = useState(boardService.getGroupColors())

    const newGroupIdToEdit = useSelector(storeState => storeState.boardModule.newGroupIdToEdit)

    const editorRef = useRef()


    useEffect(() => {

        return (() => {
            setIsColorPickerOpen(false)
        })

    }, [])

    useEffect(() => {
        if (newGroupIdToEdit === info?.groupId) {
            setIsEditing(true)
            setNewGroupIdToEdit(null)
        }

    }, [newGroupIdToEdit])

    useEffect(() => {
        if (!isEditing && info.title !== titleToEdit.title ||
            !isEditing && info.color !== titleToEdit.color) {
            onSaveChange()
        }
    }, [isEditing])

    useEffect(() => {
        if (isEditing) {
            window.addEventListener('mousedown', handleClickOutside)
        }
        return () => {
            window.removeEventListener('mousedown', handleClickOutside)
        }
    }, [isEditing])


    function handleClickOutside({ target }) {
        const elEditorRef = editorRef.current

        if (target !== elEditorRef && !elEditorRef.contains(target)) {
            setIsEditing(false)
            setIsColorPickerOpen(false)
        }
    }

    function onSaveChange() {
        var trimmedTitle = titleToEdit?.title?.trim()

        if (!trimmedTitle || trimmedTitle === info.title && info.color === titleToEdit.color) {
            setTitleToEdit(prev => ({ ...prev, title: info?.title, color: info?.color }))
            return
        }

        onUpdate({
            title: trimmedTitle,
            style: {
                ...info.style,
                ...{ '--group-color': titleToEdit.color, }
            },
        })
    }


    function toggleColorPicker() {
        setIsColorPickerOpen(!isColorPickerOpen)
    }

    function onSetGroupColor(color) {
        setTitleToEdit(prev => ({ ...prev, color: color }))
        setIsColorPickerOpen(false)
        setIsEditing(false)
    }

    const availableColors = colors.filter(c => c !== titleToEdit.color)


    return (
        <>
            {isEditing
                ?
                <div className="group-title-editor" ref={editorRef}>

                    <div
                        className="prev-color"
                        style={{ backgroundColor: titleToEdit.color }}
                        onClick={toggleColorPicker}
                    >

                    </div>
                    <input
                        type="text"
                        value={titleToEdit.title}
                        onChange={(ev) => setTitleToEdit(prev => ({ ...prev, title: ev.target.value }))}
                        name="title"
                        id="title"
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                setIsEditing(false)
                                setIsColorPickerOpen(false)
                            }
                        }}
                        autoFocus
                    />


                    {isColorPickerOpen && <ul className="color-picker">
                        {availableColors.map(color => {
                            return <li
                                key={color}
                                style={{ backgroundColor: color }}
                                onClick={() => onSetGroupColor(color)}
                            ></li>
                        })}
                    </ul>}

                </div>

                : <div onClick={() => setIsEditing(true)}>{info?.title}</div>
            }

        </>
    )
}