import { useEffect, useRef, useState, useLayoutEffect } from "react"
import { Calendar } from "./Calendar"
import { SvgIcon } from "../../SvgIcon"
import { FloatingContainerCmp } from "../../FloatingContainerCmp"
import { HoveredTextCmp } from "../../HoveredTextCmp"

export function DatePicker({ info, onUpdate }) {
    const [dateToEdit, setDateToEdit] = useState(info?.selectedDate)
    const [isEditing, setIsEditing] = useState(false)
    const datePickerRef = useRef()

    const [titleMsg, setTitleMsg] = useState('')
    const [statusIcon, setStatusIcon] = useState('emptyCircle')
    const [statusColor, setStatusColor] = useState('secondaryText')
    const [iconSize, setIconSize] = useState(16)

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
        return new Date(date).toLocaleDateString("en-US", setOptions(date))
    }

    function setTime(time) {
        const options = { hour: "2-digit", minute: "2-digit", hour12: "true" }
        return new Date(time).toLocaleTimeString("en-US", options)
    }


    useEffect(() => {
        if (dateToEdit?.date) {
            const date = info?.selectedStatus ? info?.selectedStatus : { updatedAt: new Date() }
            calculateDateStatus(date)
        }
    }, [info?.selectedStatus, dateToEdit?.date])


    function calculateDateStatus(statusInfo) {
        const diffInMs = Math.abs(dateToEdit.date - statusInfo.updatedAt)
        const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))
        const now = Date.now()

        if (statusInfo.updatedAt > dateToEdit.date && dateToEdit.isTimeShow ||
            statusInfo.updatedAt > dateToEdit.date || !statusInfo?.updatedAt && now > dateToEdit.date
        ) {
            const msg = statusInfo.id === 'done' ?
                `Done ${diffInDays} ${diffInDays > 1 ? "days" : "day"} after deadline` :
                `${diffInDays} ${diffInDays > 1 ? "days" : "day"} overdue`
            setTitleMsg(msg)
            setStatusIcon('ExclamationMarkCircle')


            setStatusColor(statusInfo.id === 'done' ? "positive" : "negative")
            setIconSize(18)
            return
        }

        if (statusInfo.id === 'done') {
            setTitleMsg('Done in time')
            setStatusIcon('vMark')
            setStatusColor('positive')
            setIconSize(18)
            return
        }

        var msg = ''
        if (diffInDays === 0) {
            msg = 'Today'
        } else {
            msg = `${diffInDays > 1 ? `${diffInDays} Days left` : "Tomorrow"}`
        }

        setTitleMsg(msg)

        setIconSize(16)

        if (diffInDays < 7) {
            setStatusIcon(`day${diffInDays}`)
        } else {
            setStatusIcon('emptyCircle')
        }

        setStatusColor('secondaryText')
    }


    function setOptions(date) {
        const options = { month: "short", day: "numeric" }
        if (new Date(date).getFullYear() !== new Date().getFullYear()) {
            options.year = 'numeric'
        }
        return options
    }

    return (
        <section className={`date-picker ${isEditing ? "focus" : ""}`}
            ref={datePickerRef} onClick={toggleIsEditing}
        >

            {dateToEdit?.date && <div
                className="date-to-edit flex align-center"
                onClick={() => setIsEditing(true)} >

                <HoveredTextCmp
                    label={titleMsg}
                    position="up"
                >
                    <SvgIcon
                        iconName={statusIcon}
                        size={iconSize}
                        colorName={statusColor}
                        className='time-icon'
                    />
                </HoveredTextCmp>

                <div className={`selected-time ${info?.selectedStatus?.id === 'done' ? "done" : ""}`}>
                    <div>
                        {setDate(dateToEdit?.date)}
                        {dateToEdit?.isTimeShow && <span>, {setTime(dateToEdit?.date)}</span>}
                    </div>
                </div>


                <button
                    className="remove-date"
                    onClick={(ev) => { onSaveDate({ date: '', isTimeShow: false }), ev.stopPropagation() }}>
                    <SvgIcon iconName="xMark" size={16} />
                </button>
            </div>}




            {!isEditing && !dateToEdit?.date &&
                <div className="select-date">
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