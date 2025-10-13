import { useEffect, useMemo, useState } from "react"
import { DateTime, Info, Interval } from "luxon"

// cmps
import { SvgIcon } from "../../SvgIcon.jsx"
import { CustomSelect } from "../../CustomSelect.jsx"

export function Calendar({ dateInfo, onUpDate, onSetIsEditing }) {
    const today = DateTime.local().setLocale("en")
    const weekDays = Info.weekdays("short", { locale: "en" })
    const months = Info.months("long", { locale: "en" })
    const years = Array.from({ length: 50 }, (_, i) => today.year - 25 + i)

    /// Think of a better way to avoid lots of renderings of the hours over and over again
    const times = useMemo(() => {
        const arr = []
        for (let h = 0; h < 24; h++) {
            for (let m of [0, 30]) {
                arr.push(DateTime.fromObject({ hour: h, minute: m }).toFormat("hh:mm a"))
            }
        }
        return arr
    }, [])

    const [firstDayOfMonth, setFirstDayOfMonth] = useState(today.startOf('month'))
    const [activeDay, setActiveDay] = useState(null)
    const [inputDate, setInputDate] = useState(today.toFormat("MM/dd/yyyy"))
    const [inputTime, setInputTime] = useState(today.toFormat("hh:mm a"))
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
            setInputTime(parsedDate.toFormat("hh:mm a"))
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
        const parsedTime = DateTime.fromFormat(inputTime, "hh:mm a")
        const newDate = dayOfMonth.set({
            hour: parsedTime.hour,
            minute: parsedTime.minute
        })

        setActiveDay(newDate)
        setInputDate(newDate.toFormat("MM/dd/yyyy"))
        onUpDate({ date: newDate.ts, isTimeShow })
        onSetIsEditing(false)
    }

    function onSaveDate() {
        const parsedTime = DateTime.fromFormat(inputTime, "hh:mm a")
        const newDate = activeDay.set({
            hour: parsedTime.hour,
            minute: parsedTime.minute
        })

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
        <section className={`calendar-container focus`} onClick={(ev) => ev.stopPropagation()}>
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

                {isTimeShow && (
                    <CustomSelect
                        labelsInfo={{
                            selectedLabel: inputTime,
                            options: times,
                            type: "times"
                        }}
                        onSaveLabels={(val) => setInputTime(val)}
                    />
                )}
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