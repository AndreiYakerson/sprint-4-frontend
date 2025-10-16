import { useEffect, useState } from "react"

export function PersonFilter({ members, filterBy, onSetFilterBy }) {

    const [filterToEdit, setFilterToEdit] = useState(filterBy)

    useEffect(() => {
        onSetFilterBy(filterToEdit)
    }, [filterToEdit])

    function handleChange(personId, ev) {
        // const el = ev.currentTarget

        requestAnimationFrame(() => {
            if (personId === filterToEdit?.byPerson) {
                setFilterToEdit({ byPerson: '' })
            } else {
                setFilterToEdit({ byPerson: personId })
            }
        })
    }

    return (
        <section className="person-filter">

            <header className="person-filter-header">
                Filter this board by person
            </header>

            <ul className="person-list">
                {members?.length > 0 && members.map(m => {
                    return <li className={`person-item ${filterToEdit?.byPerson === m?._id ? "selected" : ""}`}
                        key={m?._id}
                        onClick={(ev) => handleChange(m._id, ev)}>
                        <img src={m.imgUrl} alt={m.fullname} />
                    </li>
                })}
            </ul>
        </section>
    )
}