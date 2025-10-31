import { useEffect, useMemo, useState } from "react"
import { DateTime, Info, Interval } from "luxon"

// cmps
import { SvgIcon } from "../../SvgIcon.jsx"
import { CustomSelect } from "../../CustomSelect.jsx"

export function Calendar({ dateInfo, onUpdate, onSetIsEditing }) {
    const today = DateTime.local().setLocale("en")
    const weekDays = Info.weekdays("short", { locale: "en" })
    const months = Info.months("long", { locale: "en" })
    const years = Array.from({ length: 50 }, (_, i) => today.year - 25 + i)

    const timeOptions = useMemo(generateTimes, [])

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

    useEffect(() => {
        const parsed = DateTime.fromFormat(inputDate, "MM/dd/yyyy")
        if (parsed.isValid) {
            setActiveDay(parsed)
            setFirstDayOfMonth(parsed.startOf("month"))
        }
    }, [inputDate])


    function handleGoToPrevMonth() {
        setFirstDayOfMonth(firstDayOfMonth.minus({ month: 1 }))
    }
    function handleGoToNextMonth() {
        setFirstDayOfMonth(firstDayOfMonth.plus({ month: 1 }))
    }

    function handleGoToToday() {
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

    function toggleIsTimeShow() {
        setIsTimeShow(!isTimeShow)
    }

    function onSetActiveDay(dayOfMonth) {
        const parsedTime = DateTime.fromFormat(inputTime, "hh:mm a")
        const newDate = dayOfMonth.set({ hour: parsedTime.hour, minute: parsedTime.minute })

        setActiveDay(newDate)
        setInputDate(newDate.toFormat("MM/dd/yyyy"))
        onUpdate({ date: newDate.ts, isTimeShow })
        onSetIsEditing(false)
    }

    function onSaveDate() {
        const parsedTime = DateTime.fromFormat(inputTime, "hh:mm a")
        const newDate = activeDay.set({
            hour: parsedTime.hour,
            minute: parsedTime.minute
        })

        onUpdate({ date: newDate.ts, isTimeShow })
        onSetIsEditing(false)
    }


    // util funcs

    function generateTimes() {
        const hours = []
        for (let hour = 0; hour < 24; hour++) {
            for (let minute of [0, 30]) {
                hours.push(DateTime.fromObject({ hour, minute }).toFormat("hh:mm a"))
            }
        }
        return hours
    }


    function getDayCellClasses(dayOfMonth) {

        var classes = []

        if (dayOfMonth.month !== firstDayOfMonth.month) {
            classes.push('inactive')
        }

        if (activeDay?.startOf("day").toISODate() === dayOfMonth?.startOf("day").toISODate()) {
            classes.push('active')
        }

        if (today.startOf("day").toISODate() === dayOfMonth?.toISODate()) {
            classes.push('today')
        }

        return classes.join(' ')

    }

    return (
        <section
            className={`calendar-container focus`}
            onClick={(ev) => ev.stopPropagation()}
        >

            <div className="btns-actions flex justify-between">
                <button onClick={handleGoToToday}>Today</button>

                <button
                    onClick={toggleIsTimeShow}
                    className={`white icon-svg ${isTimeShow ? "active" : ""}`}
                >
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
                    onKeyDown={(ev) => { if (ev.key === "Enter") onSaveDate() }}
                />

                {isTimeShow && (
                    <CustomSelect
                        labelsInfo={{
                            selectedLabel: inputTime,
                            options: timeOptions,
                            type: "timeOptions"
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
                    <button
                        onClick={handleGoToPrevMonth}
                        className="white icon-svg"
                    >
                        <SvgIcon iconName="chevronLeft" size={20} />
                    </button>

                    <button
                        onClick={handleGoToNextMonth}
                        className="white icon-svg"
                    >
                        <SvgIcon iconName="chevronRight" size={20} />
                    </button>
                </div>
            </div>


            <div className="calendar-table">

                <ul className="week-days-list flex">
                    {weekDays.map((weekDay, idx) => (
                        <li key={idx}>{weekDay}</li>
                    ))}
                </ul>

                <ul className="days-list">

                    {daysOfMonth.map((dayOfMonth, idx) => (
                        <li key={idx}>
                            <span
                                className={`day-cell ${getDayCellClasses(dayOfMonth)}`}
                                onClick={() => onSetActiveDay(dayOfMonth)}
                            >
                                {dayOfMonth.day}
                            </span>
                        </li>
                    ))}

                </ul>
            </div>

        </section >
    )
}

