import { useEffect, useState } from "react"
import { DateTime, Info, Interval } from "luxon"

// cmps
import { SvgIcon } from "../../SvgIcon.jsx"

export function Calendar({ dateInfo, onUpDate, onSetIsEditing, position }) {
    const today = DateTime.local().setLocale("en")
    const weekDays = Info.weekdays("short", { locale: "en" })
    const months = Info.months("long", { locale: "en" })
    const years = Array.from({ length: 50 }, (_, i) => today.year - 25 + i)


    const [firstDayOfMonth, setFirstDayOfMonth] = useState(today.startOf('month'))
    const [activeDay, setActiveDay] = useState(null)
    const [inputDate, setInputDate] = useState(today.toFormat("MM/dd/yyyy"))
    const [inputTime, setInputTime] = useState(today.toFormat("HH:mm"))
    const [isTimeShow, setIsTimeShow] = useState(false)

    const daysOfMonth = Interval.fromDateTimes(
        firstDayOfMonth.startOf('week'),
        firstDayOfMonth.endOf('month').endOf('week')
    ).splitBy({ day: 1 }).map(day => day.start)


    useEffect(() => {

        if (dateInfo?.date) {
            const parsedDate = DateTime.fromMillis(Number(dateInfo.date))

            setActiveDay(parsedDate.startOf("day"))
            setFirstDayOfMonth(parsedDate.startOf("month"))
            setInputDate(parsedDate.toFormat("MM/dd/yyyy"))
            setInputTime(parsedDate.toFormat("HH:mm"))
            setIsTimeShow(dateInfo?.isTimeShow)
        }
    }, [])


    function onPrevMonth() {
        setFirstDayOfMonth(firstDayOfMonth.minus({ month: 1 }))
    }
    function onNextMonth() {
        setFirstDayOfMonth(firstDayOfMonth.plus({ month: 1 }))
    }
    function onToday() {
        setFirstDayOfMonth(today.startOf("month"))
        setActiveDay(today.startOf("day"))
        setInputDate(today.toFormat("MM/dd/yyyy"))
        setInputTime(today.toFormat("HH:mm"))
    }

    function onSelectMonth(ev) {
        const monthIndex = parseInt(ev.target.value)
        setFirstDayOfMonth(firstDayOfMonth.set({ month: monthIndex + 1 }))
    }

    function onSelectYear(ev) {
        const year = parseInt(ev.target.value)
        setFirstDayOfMonth(firstDayOfMonth.set({ year }))
    }

    function onSetActiveDay(dayOfMonth) {
        const [hour, minute] = inputTime.split(":").map(Number)
        const newDate = dayOfMonth.set({ hour, minute })

        setActiveDay(newDate)
        setInputDate(newDate.toFormat("MM/dd/yyyy"))
        onUpDate({ date: newDate.ts, isTimeShow })
        onSetIsEditing(false)
    }

    function onSaveDate() {
        const [hour, minute] = inputTime.split(":").map(Number)
        const newDate = activeDay.set({ hour, minute })

        onUpDate({ date: newDate.ts, isTimeShow })
        onSetIsEditing(false)
    }


    useEffect(() => {
        const parsed = DateTime.fromFormat(inputDate, "MM/dd/yyyy")
        if (parsed.isValid) {
            setActiveDay(parsed)
            setFirstDayOfMonth(parsed.startOf("month"))
        }
    }, [inputDate])


    function toggleIsTimeShow() {
        setIsTimeShow(!isTimeShow)
    }

    return (
        <section className={`calendar-container ${position} focus`} onClick={(ev) => ev.stopPropagation()}>
            <div className="btns-actions flex justify-between">
                <button onClick={onToday}>Today</button>
                <button onClick={toggleIsTimeShow} className={`white icon-svg ${isTimeShow ? "active" : ""}`}>
                    <SvgIcon iconName="clock" size={20} />
                </button>
            </div>

            <div className="date-time-input">
                <input
                    type="text"
                    name="date-input"
                    placeholder="MM/DD/YYYY"
                    value={inputDate}
                    autoFocus
                    onChange={(ev) => setInputDate(ev.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") onSaveDate()
                    }}
                />
                {isTimeShow &&
                    < input
                        type="time"
                        name="time-input"
                        className="time-input"
                        value={inputTime}
                        onChange={(ev) => setInputTime(ev.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") onSaveDate()
                        }}
                    />}
            </div>


            <div className="calendar-table-date-select flex justify-between">

                <div className="flex">
                    <select value={firstDayOfMonth.month - 1} name="month-select" onChange={onSelectMonth}>
                        {months.map((month, idx) => (
                            <option key={idx} value={idx}>{month}</option>
                        ))}
                    </select>

                    <select value={firstDayOfMonth.year} onChange={onSelectYear} name="year-select" className="year-select">
                        {years.map((year, idx) => (
                            <option key={idx} value={year}>{year}</option>
                        ))}
                    </select>
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
                            <span className={`day-num
                             ${dayOfMonth.month !== firstDayOfMonth.month ? "inactive" : ""}
                             ${activeDay?.startOf("day").toISODate() === dayOfMonth?.startOf("day").toISODate() ? 'active' : ''}
                             ${today.startOf("day").toISODate() === dayOfMonth?.toISODate() ? 'today' : ''}`}
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