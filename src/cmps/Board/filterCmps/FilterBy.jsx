import { useEffect, useState } from "react"

export function FilterBy({ board, filterBy, onSetFilterBy }) {

    const [boardData, setBoardData] = useState(board)
    const [filterToEdit, setFilterToEdit] = useState(filterBy)

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

    return (
        <section className="filter-by-board-details">
            <header>
                <h2>filters</h2>
                <button>clear all</button>
            </header>

            <section className="filters-container flex">

                <div>
                    <span className="option-title">
                        Groups
                        {filterToEdit?.byGroups?.length > 0 &&
                            ` / ${filterToEdit?.byGroups?.length}`}
                    </span>
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

                <div>
                    <span className="option-title">
                        Name
                        {filterToEdit?.byNames?.length > 0 && ` / ${filterToEdit?.byNames?.length}`}
                    </span>
                    <ul className="options-list">
                        {boardData.groups.map(group => {
                            return group?.tasks.map(task => {
                                return <li
                                    className={`option-item ${filterToEdit?.byNames?.includes(task.title) ? "active" : ""}`}
                                    key={task.title}
                                    onClick={() => hendelchange(task?.title, 'byNames')}
                                >
                                    {task?.title}
                                </li>
                            })
                        })}
                    </ul>
                </div>

                <div>
                    <span className="option-title">
                        Status
                        {filterToEdit?.byStatuses?.length > 0 && ` / ${filterToEdit?.byStatuses?.length}`}
                    </span>
                    <ul className="options-list">
                        {boardData.statuses.map(s => {
                            return <li
                                key={s.id}
                                className={`option-item ${filterToEdit?.byStatuses?.includes(s.id) ? "active" : ""}`}
                                onClick={() => hendelchange(s.id, 'byStatuses')}
                            >
                                <div className="item-color" style={{ backgroundColor: `var(${s?.cssVar})` }}></div>
                                {s?.txt}
                            </li>
                        })}
                    </ul>
                </div>

                <div>
                    <span className="option-title">
                        Priority
                        {filterToEdit?.byPriorities?.length > 0 && ` / ${filterToEdit?.byPriorities?.length}`}
                    </span>
                    <ul className="options-list">
                        {boardData.priorities.map(p => {
                            return <li
                                key={p.id}
                                className={`option-item ${filterToEdit?.byPriorities?.includes(p.id) ? "active" : ""}`}
                                onClick={() => hendelchange(p.id, 'byPriorities')}
                            >
                                <div className="item-color" style={{ backgroundColor: `var(${p?.cssVar})` }}></div>
                                {p?.txt}
                            </li>
                        })}
                    </ul>
                </div>

                <div>
                    <span className="option-title">
                        Member
                        {filterToEdit?.byMembers?.length > 0 && ` / ${filterToEdit?.byMembers?.length}`}
                    </span>
                    <ul className="options-list">
                        {boardData.members.map(m => {
                            return <li
                                key={m?._id}
                                className={`option-item ${filterToEdit?.byMembers?.includes(m?._id) ? "active" : ""}`}
                                onClick={() => hendelchange(m?._id, 'byMembers')}
                            >
                                <img src={m?.imgUrl} alt="user-imgUrl" className="member-icon" />
                                {m?.fullname}
                            </li>
                        })}
                    </ul>
                </div>

                <div>
                    <span className="option-title">
                        Due Date
                        {filterToEdit?.byDueDateOp?.length > 0 && ` / ${filterToEdit?.byDueDateOp?.length}`}
                    </span>
                    <ul className="options-list">
                        {dateFilterOptions.map((dateOption, idx) => {
                            return <li
                                key={idx}
                                className={`option-item ${filterToEdit?.byDueDateOp?.includes(dateOption) ? "active" : ""}`}
                                onClick={() => hendelchange(dateOption, 'byDueDateOp')}
                            >
                                {dateOption}
                            </li>
                        })}
                    </ul>
                </div>

            </section>

        </section >
    )
}

