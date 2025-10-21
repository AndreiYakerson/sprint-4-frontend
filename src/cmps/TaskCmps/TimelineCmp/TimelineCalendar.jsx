import { useEffect, useState } from "react"
import { DateTime, Info, Interval } from "luxon"

// hook
import { useEffectUpdate } from "../../../customHooks/useEffectUpdate.js"

// cmps
import { SvgIcon } from "../../SvgIcon.jsx"
import { CustomSelect } from "../../CustomSelect.jsx"

export function TimelineCalendar({ dateInfo, onUpDate, onSetIsEditing }) {
    const today = DateTime.local().setLocale("en")
    const weekDays = Info.weekdays("short", { locale: "en" })
    const months = Info.months("long", { locale: "en" })
    const years = Array.from({ length: 50 }, (_, i) => today.year - 25 + i)



    const [dates, setDates] = useState({ startDate: 0, endDate: 0 })
    const [firstDayOfMonth, setFirstDayOfMonth] = useState(today.startOf('month'))
    const [inputStartDate, setInputStartDate] = useState(null)
    const [inputEndDate, setInputEndDate] = useState(null)

    const daysOfMonth = Interval.fromDateTimes(
        firstDayOfMonth.startOf('week'),
        firstDayOfMonth.endOf('month').endOf('week')
    ).splitBy({ day: 1 }).map(day => day.start)


    useEffect(() => {
        if (dateInfo?.startDate) {
            const start = DateTime.fromMillis(dateInfo?.startDate)
            const end = DateTime.fromMillis(dateInfo?.endDate)

            setDates({ startDate: start, endDate: end })
            setFirstDayOfMonth(start.startOf("month"))
            setInputStartDate(start.toFormat("MM/dd/yyyy"))
            setInputEndDate(end.toFormat("MM/dd/yyyy"))
        }
    }, [])


    useEffectUpdate(() => {
        if (dates?.startDate?.ts !== dateInfo.startDate ||
            dates?.endDate?.ts !== dateInfo.endDate
        ) {
            onUpDate({ startDate: dates?.startDate?.ts || 0, endDate: dates?.endDate?.ts || 0 })
        }
    }, [dates])




    function onPrevMonth() {
        setFirstDayOfMonth(firstDayOfMonth.minus({ month: 1 }))
    }
    function onNextMonth() {
        setFirstDayOfMonth(firstDayOfMonth.plus({ month: 1 }))
    }


    function onSelectYear(selectedYear) {
        const year = parseInt(selectedYear)
        setFirstDayOfMonth(firstDayOfMonth.set({ year }))
    }

    function onSelectMonth(selectedMonth) {
        const monthIndex = parseInt(selectedMonth)
        setFirstDayOfMonth(firstDayOfMonth.set({ month: monthIndex + 1 }))
    }



    function onSetActiveDay(dayOfMonth) {
        const date = dayOfMonth.startOf("day")


        setDates(prev => {
            if (!prev.startDate) {
                setInputStartDate(date.toFormat("MM/dd/yyyy"))
                return { startDate: date, endDate: '' }
            } else if (!prev.endDate) {

                const start = date.ts < prev.startDate.ts ? date : prev.startDate
                const end = date.ts < prev.startDate.ts ? prev.startDate : date

                setInputStartDate(start.toFormat("MM/dd/yyyy"))
                setInputEndDate(end.toFormat("MM/dd/yyyy"))

                return { startDate: start, endDate: end }

            } else if (prev.startDate && prev.endDate) {
                if (prev.startDate && prev.endDate) {

                    if (date.ts < prev.startDate.ts) {
                        setInputStartDate(date.toFormat("MM/dd/yyyy"))
                        return { startDate: date, endDate: prev.endDate }
                    }

                    else if (date.ts > prev.endDate.ts) {
                        setInputEndDate(date.toFormat("MM/dd/yyyy"))
                        return { startDate: prev.startDate, endDate: date }
                    }

                    else {
                        setInputStartDate(date.toFormat("MM/dd/yyyy"))
                        setInputEndDate(null)
                        return { startDate: date, endDate: '' }
                    }
                }
            }
            return prev
        })
    }

    function onSetInputStartDate(dateStr) {
        setInputStartDate(dateStr)
        if (!dateStr) setDates(prev => ({ ...prev, startDate: '' }))
        const parsed = DateTime.fromFormat(dateStr, "MM/dd/yyyy")
        if (!parsed.isValid) return

        const newStart = parsed.startOf("day")
        const currentEnd = dates?.endDate

        if (currentEnd && newStart > currentEnd) {
            setDates({ startDate: currentEnd, endDate: newStart })
            setInputStartDate(currentEnd.toFormat("MM/dd/yyyy"))
            setInputEndDate(newStart.toFormat("MM/dd/yyyy"))
        } else {
            setDates(prev => ({ ...prev, startDate: newStart }))
            setFirstDayOfMonth(parsed.startOf("month"))
        }
    }


    function onSetInputEndDate(dateStr) {
        setInputEndDate(dateStr)
        if (!dateStr) setDates(prev => ({ ...prev, endDate: '' }))
        const parsed = DateTime.fromFormat(dateStr, "MM/dd/yyyy")
        if (!parsed.isValid) return

        const newEnd = parsed.startOf("day")
        const currentStart = dates?.startDate

        if (currentStart && newEnd < currentStart) {
            setDates({ startDate: newEnd, endDate: currentStart })
            setInputStartDate(newEnd.toFormat("MM/dd/yyyy"))
            setInputEndDate(currentStart.toFormat("MM/dd/yyyy"))
        } else {
            setDates(prev => ({ ...prev, endDate: newEnd }))
        }
    }



    function getDayCellClasses(dayOfMonth) {

        var css = []

        if (dayOfMonth.month !== firstDayOfMonth.month) {
            css.push('inactive')
        }

        if (today.startOf("day").toISODate() === dayOfMonth?.toISODate()) {
            css.push('today')
        }

        if (dates?.startDate && dates?.startDate?.startOf("day")?.toISODate() < dayOfMonth?.startOf("day").toISODate() &&
            dates?.endDate && dates?.endDate?.startOf("day")?.toISODate() > dayOfMonth?.startOf("day").toISODate() ? 'today' : '') {
            css.push('between')
        }

        if (dates?.startDate && dates?.startDate?.startOf("day")?.toISODate() === dayOfMonth?.startOf("day").toISODate()) {
            css.push('active start')
            if (dates?.startDate && dates?.endDate && dates?.startDate?.ts !== dates?.endDate?.ts) {
                css.push('time-line')
            }
        }


        if (dates?.endDate && dates?.endDate?.startOf("day")?.toISODate() === dayOfMonth?.startOf("day").toISODate()
            && dates?.startDate?.ts !== dates?.endDate?.ts
        ) {
            css.push('active end')

            if (dates?.startDate && dates?.endDate && dates?.startDate?.ts !== dates?.endDate?.ts) {
                css.push('time-line')
            }
        }


        return css.join(' ')

    }

    function getDifDay({ startDate, endDate }) {
        if (!startDate || !endDate) return
        const diffInDays = endDate.diff(startDate, "days").days + 1
        return `${diffInDays} ${diffInDays > 1 ? "days" : "day"} selected`
    }

    return (
        <section className={`calendar-container timeline focus`} onClick={(ev) => ev.stopPropagation()}>
            <div className="timeline-header flex justify-between ">
                <span className="set-title">Set dates</span>
                <span>{getDifDay(dates)}</span>
            </div>


            <div className="dates-input flex">
                <input
                    type="text"
                    name="date-input"
                    placeholder="MM/DD/YYYY"
                    value={inputStartDate || ''}
                    autoFocus
                    onChange={(ev) => onSetInputStartDate(ev.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") onSetIsEditing(false)
                    }}
                />

                <input
                    type="text"
                    name="date-input"
                    placeholder="MM/DD/YYYY"
                    value={inputEndDate || ''}
                    onChange={(ev) => onSetInputEndDate(ev.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") onSetIsEditing(false)
                    }}
                />
            </div>


            <div className="calendar-table-date-select flex justify-between">

                <div className="flex">
                    <CustomSelect
                        labelsInfo={
                            {
                                selectedLabel: firstDayOfMonth.month - 1,
                                options: months,
                                type: 'months'
                            }}
                        onSaveLabels={(month) => onSelectMonth(month)}
                    />

                    <CustomSelect
                        labelsInfo={
                            {
                                selectedLabel: firstDayOfMonth.year,
                                options: years,
                                type: 'years'
                            }}
                        onSaveLabels={(year) => onSelectYear(year)}
                    />
                </div>

                <div>
                    <button onClick={onPrevMonth} className="white icon-svg">
                        <SvgIcon iconName="chevronLeft" size={20} /></button>
                    <button onClick={onNextMonth} className="white icon-svg">
                        <SvgIcon iconName="chevronRight" size={20} /></button>
                </div>

            </div>


            <div className="calendar-table">
                <ul className="flex">
                    {weekDays.map((weekDay, weekDayIndex) => {
                        return <li key={weekDayIndex}>{weekDay}</li>
                    })}
                </ul>

                <ul className="date-num-list">
                    {daysOfMonth.map((dayOfMonth, dayOfMonthIndex) => {
                        return <li key={dayOfMonthIndex}>
                            <span className={`day-num ${getDayCellClasses(dayOfMonth)}`}
                                onClick={() => onSetActiveDay(dayOfMonth)}>
                                {dayOfMonth.day}
                            </span>
                        </li>
                    })}
                </ul>
            </div>
        </section >
    )
}