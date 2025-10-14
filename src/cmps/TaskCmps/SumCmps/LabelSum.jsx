import { useEffect, useState } from "react"
import { HoveredTextCmp } from "../../HoveredTextCmp"

export function LabelSum({ info }) {

    const [labels, setLabels] = useState(info?.labels)

    useEffect(() => {
        setLabels(info?.labels)
    }, [info])


    function getLabelsStats(labels) {

        var labelsCountMap = labels.reduce((acc, label) => {
            if (acc[label.id]) acc[label.id]++
            else acc[label.id] = 1
            return acc
        }, {})


        var filterdLabelsData = Object.keys(labelsCountMap).map(labelId => {
            var label = labels.find(l => l.id === labelId)
            label.count = labelsCountMap[labelId]
            label.percentage = parseFloat(((labelsCountMap[labelId] / labels.length) * 100).toFixed(1))
            label.msg = `${label?.txt} ${label?.count}/${labels?.length} ${label?.percentage}%`
            return label
        })

        filterdLabelsData = sortLabels(filterdLabelsData)

        return filterdLabelsData
    }

    function sortLabels(statuses) {
        const order = info?.type === 'status' ? ['done', 'working', 'stuck'] : ['critical', 'high', 'medium', 'low']

        const sorted = statuses.sort((a, b) => {
            const aIndex = order.indexOf(a.id)
            const bIndex = order.indexOf(b.id)

            if (a.id === 'default') return 1
            if (b.id === 'default') return -1

            if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex

            if (aIndex !== -1) return -1

            if (bIndex !== -1) return 1

            return 0
        })

        return sorted
    }

    return (
        <section className="labels-sum">
            <div className="label-list">
                {labels?.length > 0 && getLabelsStats(labels).map((label) => {
                    return <HoveredTextCmp
                        label={label.msg}
                        position={'up'}
                        style={{ width: label.percentage + "%", backgroundColor: `var(${label.cssVar})` }}
                    >
                    </HoveredTextCmp>
                })}
            </div>
        </section>
    )
}
