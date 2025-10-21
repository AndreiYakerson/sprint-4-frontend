import { useEffect, useState } from "react"
import { HoveredTextCmp } from "../../HoveredTextCmp"
// import { FloatingContainerCmpNewNotToUse } from "../../FloatingContainerCmpNewNotToUse"
import { SumSelectMenu } from "./SumSelectMenu"
import { useRef } from "react"
import { useSelector } from "react-redux"
import { FloatingContainerCmp } from "../../FloatingContainerCmp.jsx"

export function LabelSum({ info }) {

    const board = useSelector(storeState => storeState.boardModule.board)

    const [labels, setLabels] = useState(info?.labels)
    const [isLabelsFilterd, setIsLabelsFilterd] = useState(false)
    const [isMenuOpen, setIsMenuOpen] = useState(false)


    const listRef = useRef(null)

    function toggleIsMenuOpen(ev) {
        ev.stopPropagation()
        setIsMenuOpen(!isMenuOpen)
    }

    function onCloseMenu() {
        setIsMenuOpen(false)
    }

    useEffect(() => {
        setLabels(info?.labels)
    }, [info])

    function onSetIsLabelsFilterd(isFilterd) {
        setIsLabelsFilterd(isFilterd)
    }

    function getLabelsStats(labels) {

        var labelsCountMap = labels.reduce((acc, label) => {
            if (acc[label.id]) acc[label.id]++
            else acc[label.id] = 1
            return acc
        }, {})


        var currLabels = info?.type === 'status' ? board?.statuses : board?.priorities

        var filterdLabelsData = Object.keys(labelsCountMap).map(labelId => {
            var label = currLabels.find(l => l.id === labelId)

            if (!label) return { txt: 'Default Label', cssVar: '--group-title-clr18', id: labelId, count: 0, percentage: 0, msg: '' }

            label.count = labelsCountMap[labelId]
            label.percentage = parseFloat(((labelsCountMap[labelId] / labels.length) * 100).toFixed(1))
            label.msg = `${label?.txt} ${label?.count}/${labels?.length} ${label?.percentage}%`
            return label
        })

        filterdLabelsData = sortLabels(filterdLabelsData)

        return filterdLabelsData
    }

    function sortLabels(statuses) {
        const order = info?.type === 'status'
            ? ['done', 'working', 'stuck']
            : ['critical', 'high', 'medium', 'low']

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
            <div className="label-list" ref={listRef} onClick={toggleIsMenuOpen}>
                {labels?.length > 0 && getLabelsStats(labels).map((label) => {
                    if (isLabelsFilterd) {
                        if (label.id === 'done' || label.id === 'critical') {
                            return <HoveredTextCmp
                                key={label.id}
                                label={label.msg}
                                position={'up'}
                                style={{ width: label.percentage + "%", backgroundColor: `var(${label.cssVar})` }}
                            >
                            </HoveredTextCmp>
                        }
                    } else {
                        return <HoveredTextCmp
                            key={label.id}
                            label={label.msg}
                            position={'up'}
                            style={{ width: label.percentage + "%", backgroundColor: `var(${label.cssVar})` }}
                        >
                        </HoveredTextCmp>
                    }
                })}
            </div>

            {
                isMenuOpen && <FloatingContainerCmp
                    anchorEl={listRef.current}
                    onClose={onCloseMenu}
                    offsetX={-listRef?.current?.getBoundingClientRect().width * 2}
                    offsetY={listRef?.current?.getBoundingClientRect().height + 10}
                >
                    <SumSelectMenu
                        isLabelsFilterd={isLabelsFilterd}
                        type={info?.type}
                        onSetIsLabelsFilterd={onSetIsLabelsFilterd}
                    />
                </FloatingContainerCmp>
            }

        </section >
    )
}
