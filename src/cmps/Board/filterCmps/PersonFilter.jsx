import { useEffect, useState } from "react"
import { SvgIcon } from "../../SvgIcon"
import { HoveredTextCmp } from "../../HoveredTextCmp"

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

            <header className="person-filter-header flex align-center ">
                <span>Filter this board by person</span>
                <HoveredTextCmp
                    label="See items assigned to a specific person on this board"
                    position="up"
                    onClick={(ev) => setAnchorEl(ev.currentTarget)}
                >
                    <SvgIcon iconName="questionMark" size={20} colorName="secondaryText" />
                </HoveredTextCmp>

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