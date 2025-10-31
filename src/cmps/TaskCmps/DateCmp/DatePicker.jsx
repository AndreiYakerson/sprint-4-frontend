import { useEffect, useRef, useState } from "react"

// services
import { calculateDaysBetweenDates, formatDate, formatTime } from "../../../services/util.service.js"

//cmps
import { Calendar } from "./Calendar"
import { SvgIcon } from "../../SvgIcon"
import { FloatingContainerCmp } from "../../FloatingContainerCmp.jsx"



export function DatePicker({ info, onUpdate }) {
    const [dateToEdit, setDateToEdit] = useState(info?.selectedDate)
    const [isEditing, setIsEditing] = useState(false)
    const datePickerRef = useRef()

    const [statusMessage, setStatusMessage] = useState('')
    const [statusIcon, setStatusIcon] = useState('emptyCircle')
    const [statusColor, setStatusColor] = useState('secondaryText')
    const [iconSize, setIconSize] = useState(16)



    useEffect(() => {
        if (info?.selectedDate !== dateToEdit) {
            setDateToEdit(info?.selectedDate)
        }
    }, [info])

    useEffect(() => {
        if (dateToEdit?.date) {

            const { updatedAt = Date.now(), id = '' } = info?.selectedStatus || {}
            handleStatusUpdate({ updatedAt, id })

        }
    }, [info?.selectedStatus, dateToEdit?.date])


    function handleStatusUpdate(statusInfo) {
        const { updatedAt, id } = statusInfo
        const selectedDate = dateToEdit?.date
        const diffInDays = calculateDaysBetweenDates(selectedDate, updatedAt)
        const isAfterDeadline = updatedAt > selectedDate
        const isDone = id === 'done'

        if (isAfterDeadline) return setStatusAfterDeadline(isDone, diffInDays)
        if (isDone) return setStatusDoneInTime()

        setStatusUpcoming(diffInDays)
    }

    function setStatusAfterDeadline(isDone, diffInDays) {
        const dayWord = diffInDays > 1 ? "days" : "day"
        const msg = isDone
            ? `Done ${diffInDays} ${dayWord} after deadline`
            : `${diffInDays} ${dayWord} overdue`

        setStatusMessage(msg)
        setStatusIcon('ExclamationMarkCircle')
        setStatusColor(isDone ? "positive" : "negative")
        setIconSize(18)
    }

    function setStatusDoneInTime() {
        setStatusMessage('Done in time')
        setStatusIcon('vMark')
        setStatusColor('positive')
        setIconSize(18)
    }

    function setStatusUpcoming(diffInDays) {
        const msg =
            diffInDays === 0 ? 'Today' :
                diffInDays === 1 ? 'Tomorrow' :
                    `${diffInDays} Days left`

        setStatusMessage(msg)
        setStatusIcon(diffInDays < 7 ? `day${diffInDays}` : 'emptyCircle')
        setStatusColor('secondaryText')
        setIconSize(16)
    }


    function onSaveDate(dateInfo) {
        onUpdate(dateInfo)
        setDateToEdit(dateInfo)
        setIsEditing(false)
    }

    function onRemoveDate(ev) {
        ev.stopPropagation()
        onSaveDate({ date: '', isTimeShow: false })
    }

    function onSetIsEditing(isEditing) {
        setIsEditing(isEditing)
    }

    function toggleIsEditing() {
        setIsEditing(!isEditing)
    }

    /// tooltip


    const [tooltipData, setTooltipData] = useState({ isShow: false, text: '', el: null });

    function onSetShowTooltip(isShown, text, el) {
        if (isShown) {
            setTooltipData({ isShow: true, text, el })
        } else {
            setTooltipData({ isShow: false, text: "", el: null })
        }
    }

    return (
        <section
            className={`date-picker ${isEditing ? "focus" : ""}`}
            ref={datePickerRef} onClick={toggleIsEditing}
        >

            {dateToEdit?.date && <div
                className="date-to-edit flex align-center"
                onClick={() => setIsEditing(true)} >

                <div
                    className="svg-wrapper"
                    onMouseEnter={(ev) => onSetShowTooltip(true, statusMessage, ev.currentTarget)}
                    onMouseLeave={() => onSetShowTooltip(false, '', null)}
                >
                    <SvgIcon
                        iconName={statusIcon}
                        size={iconSize}
                        colorName={statusColor}
                        className="time-icon"
                    />

                </div>

                <div className={`selected-date ${info?.selectedStatus?.id === 'done' ? "done" : ""}`}>
                    <div>
                        {formatDate(dateToEdit?.date)}
                        {dateToEdit?.isTimeShow && <span>, {formatTime(dateToEdit?.date)}</span>}
                    </div>
                </div>


                <button
                    className="remove-date"
                    onClick={onRemoveDate}>
                    <SvgIcon iconName="xMark" size={16} />
                </button>
            </div>
            }


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
                    onUpdate={onSaveDate}
                    onSetIsEditing={onSetIsEditing}
                />
            </FloatingContainerCmp>}



            {tooltipData?.isShow && tooltipData?.el && <FloatingContainerCmp
                anchorEl={tooltipData?.el}
                onClose={() => console.log('')}
                centeredX={true}
                showTriangle={true}
                offsetX={3}
                offsetY={-3}
                isTooltip={true}
            >
                <div className="tooltip-text">{tooltipData?.text}</div>
            </FloatingContainerCmp>}


        </section>
    )
}