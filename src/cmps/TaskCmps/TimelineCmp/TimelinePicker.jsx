import { useEffect, useRef, useState } from "react";

//cmps
import { SvgIcon } from "../../SvgIcon";
import { TimelineCalendar } from "./TimelineCalendar";
import { FloatingContainerCmp } from "../../FloatingContainerCmp";

export function TimelinePicker({ info, onUpdate }) {

    const [hovered, setHovered] = useState(false)
    const [dates, setDates] = useState({
        startDate: info?.selectedTimeline?.startDate,
        endDate: info?.selectedTimeline?.endDate
    })
    const [isEditing, setIsEditing] = useState(false)
    const [sumDateInfo, setSumDateInfo] = useState({
        start: null, end: null, daysDiff: null, timeElapsedPercent: null
    })

    const timelinePickerRef = useRef(null)

    useEffect(() => {
        if (dates?.startDate) {
            setDatesData(dates)
        } else {
            setSumDateInfo({ start: null, end: null, daysDiff: null, timeElapsedPercent: null })
        }
    }, [dates])

    useEffect(() => {
        if (info?.selectedTimeline?.startDate !== dates.startDate ||
            info?.selectedTimeline?.endDate !== dates.endDate
        ) {
            setDates({
                startDate: info?.selectedTimeline?.startDate,
                endDate: info?.selectedTimeline?.endDate
            })
        }
    }, [info])

    function onSaveDate(newDates) {
        setDates(newDates)
    }

    function onRest() {
        const restDates = { startDate: '', startDate: '' }
        setDates(restDates)
        onUpdate(restDates)
        if (isEditing) setIsEditing(false)
    }


    function onSetIsEditing(isEditing) {
        setIsEditing(isEditing)

        if (dates.startDate !== info?.selectedTimeline?.startDate ||
            dates.endDate !== info?.selectedTimeline?.endDate
        ) {
            onUpdate(dates)
        }
    }

    function toggleIsEditing() {
        setIsEditing(!isEditing)
    }



    function setDatesData({ startDate, endDate }) {

        const today = new Date()
        const start = startDate
        const end = endDate

        if (!end || setStringDate(start) === setStringDate(end)) {

            if (today < start) {
                return setSumDateInfo(({ start: start, end: null, daysDiff: 1, timeElapsedPercent: 0 }))
            } else {
                return setSumDateInfo(({ start: start, end: null, daysDiff: 1, timeElapsedPercent: 100 }))
            }

        } else {
            const daysDiff = CalculateDaysBetweenDays(start, end)

            if (today < start) {
                return setSumDateInfo(({ start: start, end: end, daysDiff: daysDiff, timeElapsedPercent: 0 }))
            } else if (today < start || today > end) {
                return setSumDateInfo(({ start: start, end: end, daysDiff: daysDiff, timeElapsedPercent: 100 }))
            } else {
                const daysPast = CalculateDaysBetweenDays(end, today)
                const elapsedPercent = (daysPast / daysDiff) * 100

                return setSumDateInfo(({ start: start, end: end, daysDiff: daysDiff, timeElapsedPercent: elapsedPercent }))
            }
        }
    }

    function setStringDate(date) {
        const options = { month: "short", day: "numeric" }
        if (new Date(date).getFullYear() !== new Date().getFullYear()) {
            options.year = 'numeric'
        }
        return new Date(date).toLocaleDateString("en-US", options)
    }

    function CalculateDaysBetweenDays(srart, end) {
        const diffInMs = Math.abs(srart - end)
        const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24))
        return diffInDays
    }



    const { start, end, daysDiff, timeElapsedPercent } = sumDateInfo

    return (
        <section className={`timeline-picker ${isEditing ? "focus" : ""}`}
            ref={timelinePickerRef}
            onClick={toggleIsEditing}>
            {start
                ? <div
                    className="dates-container data"
                    style={{ '--timeElapsedPercent': timeElapsedPercent + '%' }}
                    onMouseEnter={() => setHovered(true)}
                    onMouseLeave={() => setHovered(false)}
                >
                    {hovered
                        ? `${start && end ? daysDiff : 1}d`
                        : (start && end ? `${setStringDate(start)} - ${setStringDate(end)}` : `${setStringDate(start)}`)
                    }
                </div>
                : <div className="dates-container"
                    onMouseEnter={() => setHovered(true)}
                    onMouseLeave={() => setHovered(false)}
                >
                    {hovered
                        ? `Set Dates`
                        : '-'
                    }
                </div>
            }

            {start && <button
                className="remove-date"
                onClick={(ev) => { onRest(), ev.stopPropagation() }}>
                <SvgIcon iconName="xMark" size={16} />
            </button>}

            {isEditing && <FloatingContainerCmp
                anchorEl={timelinePickerRef.current}
                onClose={() => onSetIsEditing(false)}
                enforceLimit={true}
                centeredX={true}
            >
                <TimelineCalendar
                    dateInfo={dates}
                    onUpDate={onSaveDate}
                    onSetIsEditing={onSetIsEditing}
                />
            </FloatingContainerCmp>}
        </section>
    )
}