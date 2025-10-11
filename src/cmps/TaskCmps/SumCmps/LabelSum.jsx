import { HoveredTextCmp } from "../../HoveredTextCmp"

export function LabelSum({ labels }) {

    function getLabelsStats(labels) {

        var labelsCountMap = labels.reduce((acc, label) => {
            if (acc[label.id]) acc[label.id]++
            else acc[label.id] = 1
            return acc
        }, {})


        const filterdLabelsData = Object.keys(labelsCountMap).map(labelId => {
            var label = labels.find(l => l.id === labelId)
            label.count = labelsCountMap[labelId]
            label.percentage = parseFloat(((labelsCountMap[labelId] / labels.length) * 100).toFixed(1))
            label.msg = `${label?.txt} ${label?.count}/${labels?.length} ${label?.percentage}%`
            return label
        })

        // reorder
        // to do   - Build a function that sorts the labels, arranging which type of label will always come first, and so on.

        return filterdLabelsData
    }

    return (
        <section className="labels-sum">
            <div className="label-list">
                {getLabelsStats(labels).map((label) => {
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
