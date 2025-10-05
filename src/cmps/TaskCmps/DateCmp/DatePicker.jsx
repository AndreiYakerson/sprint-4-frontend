import { useEffect, useRef, useState, useLayoutEffect } from "react"
import { Calendar } from "./Calendar"

export function DatePicker({ info, onUpdate }) {

    const [dateToEdit, setDateToEdit] = useState(info?.dueDate)
    const [isEditing, setIsEditing] = useState(false)
    const [position, setPosition] = useState("down")
    const datePickerRef = useRef()

    function onSetIsEditing(isEditing) {
        setIsEditing(isEditing)
    }

    useEffect(() => {
        if (isEditing) {
            window.addEventListener('mousedown', handleClickOutside)
        }
        return () => {
            window.removeEventListener('mousedown', handleClickOutside)
        }
    }, [isEditing])


    function handleClickOutside({ target }) {
        const elDatePicker = datePickerRef.current

        if (target !== elDatePicker && !elDatePicker.contains(target)) {
            setIsEditing(false)
        }
    }

    useLayoutEffect(() => {
        if (isEditing && datePickerRef.current) {
            const rect = datePickerRef.current.getBoundingClientRect()
            const spaceBelow = window.innerHeight - rect.bottom
            const spaceAbove = rect.top

            if (spaceBelow < 300 && spaceAbove > spaceBelow) {
                setPosition("up")
            } else {
                setPosition("down")
            }
        }
    }, [isEditing])



    function setDate(date) {
        const options = { month: "short", day: "numeric" }
        if (new Date(date).getFullYear() !== new Date().getFullYear()) {
            options.year = 'numeric'
        }
        return new Date(date).toLocaleDateString("en-US", options)
    }

    function setTime(time) {
        const options = { hour: "2-digit", minute: "2-digit", hour12: "true" }
        return new Date(time).toLocaleTimeString("en-US", options)
    }

    return (
        <section className="date-picker" ref={datePickerRef}>
            {dateToEdit?.date && <div
                className="date-to-edit"
                onClick={() => setIsEditing(true)} >
                {setDate(dateToEdit?.date)}
                {dateToEdit?.isTimeShow && `, ${setTime(dateToEdit?.date)}`}
                <button onClick={(ev) => { setDateToEdit({ date: '', isTimeShow: false }), ev.stopPropagation() }}>x</button>
            </div>}

            {!isEditing && !dateToEdit?.date &&
                <div className="select" onClick={() => onSetIsEditing(true)}>Select Date</div>
            }

            {isEditing && <Calendar
                dateInfo={dateToEdit}
                onUpDate={(data) => { setDateToEdit(data) }}
                onSetIsEditing={onSetIsEditing}
                position={position}
            />}

        </section>
    )
}