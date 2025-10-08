import { useEffect, useRef, useState, useLayoutEffect } from "react"
import { Calendar } from "./Calendar"
import { SvgIcon } from "../../SvgIcon"
import { functions, functionsIn } from "lodash"
import { FloatingContainerCmp } from "../../FloatingContainerCmp"

export function DatePicker({ info, onUpdate }) {
    const [dateToEdit, setDateToEdit] = useState(info?.selectedDate)
    const [isEditing, setIsEditing] = useState(false)
    const datePickerRef = useRef()


    function onSaveDate(dateInfo) {
        onUpdate(dateInfo)
        setDateToEdit(dateInfo)
        setIsEditing(false)
    }


    function onSetIsEditing(isEditing) {
        setIsEditing(isEditing)
    }

    function toggleIsEditing() {
        setIsEditing(!isEditing)
    }


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
        <section className="date-picker" ref={datePickerRef} onClick={toggleIsEditing}>
            {dateToEdit?.date && <div
                className="date-to-edit"
                onClick={() => setIsEditing(true)} >
                {setDate(dateToEdit?.date)}
                {dateToEdit?.isTimeShow && `, ${setTime(dateToEdit?.date)}`}
                <button
                    className="remove-date"
                    onClick={(ev) => { onSaveDate({ date: '', isTimeShow: false }), ev.stopPropagation() }}>
                    <SvgIcon iconName="xMark" size={16} />
                </button>
            </div>}

            {!isEditing && !dateToEdit?.date &&
                <div className="select">
                    <SvgIcon iconName="plus" size={15} className='plus-blue' colorName='whiteText' />
                    <SvgIcon iconName="calendar" size={20} />
                </div>
            }


            {isEditing && <FloatingContainerCmp
                anchorEl={datePickerRef.current}
                onClose={() => onSetIsEditing(false)}
                enforceLimit={true}
                centeredX={true}
            >
                <Calendar
                    dateInfo={dateToEdit}
                    onUpDate={onSaveDate}
                    onSetIsEditing={onSetIsEditing}
                />
            </FloatingContainerCmp>}

        </section>
    )
}