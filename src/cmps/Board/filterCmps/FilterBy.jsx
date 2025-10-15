import { useEffect, useRef, useState } from "react"
import { boardService } from "../../../services/board/index.js"

export function FilterBy({ board, filterBy, onSetFilterBy }) {

    const [boardData, setBoardData] = useState(board)
    const [filterToEdit, setFilterToEdit] = useState(filterBy)
    const restFiltersRef = useRef(boardService.getDefaultFilterBoardDetails())

    useEffect(() => {
        onSetFilterBy(filterToEdit)
    }, [filterToEdit])

    const dateFilterOptions = ['overdue', 'done on time', 'done overdue', 'today',
        'tomorrow', 'yesterday', 'this week', 'last week', 'next week',
        'this month', 'last month', 'next month']

    function hendelchange(value, propName) {

        if (filterToEdit[propName].includes(value)) {
            setFilterToEdit(prev => ({ ...prev, [propName]: prev[propName].filter(v => v !== value) }))
        } else {
            setFilterToEdit(prev => ({ ...prev, [propName]: [...prev[propName], value] }))
        }

    }

    function onRestFilters() {
        setFilterToEdit(restFiltersRef.current)
    }

    const isAllEmpty = Object.values(filterBy).every(arr => Array.isArray(arr) && arr.length === 0)

    return (
        <section className="filter-by-board-details">
            <header className="filter-header flex align-center justify-between">
                <span className="filter-title">Filters</span>
                <button className="white" onClick={onRestFilters} disabled={isAllEmpty}>Clear all</button>
            </header>

            <section className="filters-container flex">

                <div className="option-containe">
                    <div className="option-title">
                        Groups
                        {filterToEdit?.byGroups?.length > 0 &&
                            ` / ${filterToEdit?.byGroups?.length}`}
                    </div>
                    <ul className="options-list">
                        {boardData.groups.map(group => {
                            return <li
                                className={`option-item ${filterToEdit?.byGroups?.includes(group.id) ? "active" : ""}`}
                                key={group.id}
                                onClick={() => hendelchange(group.id, 'byGroups')}
                            >
                                <div className="item-color" style={{ backgroundColor: group?.style['--group-color'] }}></div>
                                <span>{group?.title}</span>
                            </li>
                        })}
                    </ul>
                </div>

                <div className="option-containe">
                    <div className="option-title">
                        Name
                        {filterToEdit?.byNames?.length > 0 && ` / ${filterToEdit?.byNames?.length}`}
                    </div>
                    <ul className="options-list">
                        {boardData.groups.map(group => {
                            return group?.tasks.map(task => {
                                return <li
                                    className={`option-item ${filterToEdit?.byNames?.includes(task.title) ? "active" : ""}`}
                                    key={task.title}
                                    onClick={() => hendelchange(task?.title, 'byNames')}
                                >
                                    <span>{task?.title}</span>
                                </li>
                            })
                        })}
                    </ul>
                </div>

                <div className="option-containe">
                    <div className="option-title">
                        Status
                        {filterToEdit?.byStatuses?.length > 0 && ` / ${filterToEdit?.byStatuses?.length}`}
                    </div>
                    <ul className="options-list">
                        {boardData.statuses.map(s => {
                            return <li
                                key={s.id}
                                className={`option-item ${filterToEdit?.byStatuses?.includes(s.id) ? "active" : ""}`}
                                onClick={() => hendelchange(s.id, 'byStatuses')}
                            >
                                <div className="item-color" style={{ backgroundColor: `var(${s?.cssVar})` }}></div>
                                <span>{s?.txt}</span>
                            </li>
                        })}
                    </ul>
                </div>

                <div className="option-containe">
                    <div className="option-title">
                        Priority
                        {filterToEdit?.byPriorities?.length > 0 && ` / ${filterToEdit?.byPriorities?.length}`}
                    </div>
                    <ul className="options-list">
                        {boardData.priorities.map(p => {
                            return <li
                                key={p.id}
                                className={`option-item ${filterToEdit?.byPriorities?.includes(p.id) ? "active" : ""}`}
                                onClick={() => hendelchange(p.id, 'byPriorities')}
                            >
                                <div className="item-color" style={{ backgroundColor: `var(${p?.cssVar})` }}></div>
                                <span>{p?.txt}</span>
                            </li>
                        })}
                    </ul>
                </div>

                <div className="option-containe">
                    <div className="option-title">
                        Member
                        {filterToEdit?.byMembers?.length > 0 && ` / ${filterToEdit?.byMembers?.length}`}
                    </div>
                    <ul className="options-list">
                        {boardData.members.map(m => {
                            return <li
                                key={m?._id}
                                className={`option-item ${filterToEdit?.byMembers?.includes(m?._id) ? "active" : ""}`}
                                onClick={() => hendelchange(m?._id, 'byMembers')}
                            >
                                <img src={m?.imgUrl} alt="user-imgUrl" className="member-icon" />
                                <span>{m?.fullname}</span>
                            </li>
                        })}
                    </ul>
                </div>

                <div className="option-containe">
                    <div className="option-title">
                        Due Date
                        {filterToEdit?.byDueDateOp?.length > 0 && ` / ${filterToEdit?.byDueDateOp?.length}`}
                    </div>
                    <ul className="options-list date-ops">
                        {dateFilterOptions.map((dateOption, idx) => {
                            return <li
                                key={idx}
                                className={`option-item ${filterToEdit?.byDueDateOp?.includes(dateOption) ? "active" : ""}`}
                                onClick={() => hendelchange(dateOption, 'byDueDateOp')}
                            >
                                <span>{dateOption}</span>
                            </li>
                        })}
                    </ul>
                </div>

            </section>

        </section >
    )
}

