import { useEffect, useState } from "react"

export function DateSum({ dates }) {

    const [hovered, setHovered] = useState(false);
    const [sumDateInfo, setSumDateInfo] = useState({
        start: null, end: null, daysDiff: null, timeElapsedPercent: null
    })

    useEffect(() => {
        if (dates?.length > 0) {
            setDatesData(dates)
        } else {
            setSumDateInfo({ start: null, end: null, daysDiff: null, timeElapsedPercent: null })
        }
    }, [dates])


    function setDatesData(dates) {

        const today = new Date()
        const start = dates[0]
        const end = dates[dates?.length - 1]

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
                const daysPast = CalculateDaysBetweenDays(dates[0], today)
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
        <section className="date-sum">
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
                : <div className="dates-container"> - </div>
            }
        </section>
    )
}


