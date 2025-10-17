import { useEffect, useState } from "react"
import { CustomSelect } from "../../CustomSelect"
import { SvgIcon } from "../../SvgIcon"

export function SortBy({ sortByData, sortOptions, onSetFilterBy }) {
    const [sortByToEdit, setSortByToEdit] = useState(sortByData)

    console.log('sortByData:', sortByData)

    useEffect(() => {
        onSetFilterBy(sortByToEdit)
    }, [sortByToEdit])

    function handleChange(name, value) {
        setSortByToEdit(prev => ({ ...prev, [name]: value }))
    }

    function onRestSort() {
        setSortByToEdit({ sortBy: '', dir: -1 })
    }

    console.log('sortOptions:', sortOptions)

    return (
        <section className="sort-by-board-details">
            <header className="sort-by-header">Sort By</header>

            <div className="sort-select">
                <CustomSelect
                    labelsInfo={{
                        options: [...sortOptions, "name"],
                        selectedLabel: sortByToEdit.sortBy,
                        type: "sortBy",
                        valueType: 'column'
                    }}
                    onSaveLabels={value => handleChange("sortBy", value)}
                />

                <CustomSelect
                    labelsInfo={{
                        options: ["ascending", "descending"],
                        selectedLabel:
                            sortByToEdit.dir === -1 ? "ascending" : "descending",
                        type: "sortBy",
                        valueType: 'dir'
                    }}
                    onSaveLabels={value =>
                        handleChange("dir", value === "ascending" ? -1 : 1)
                    }
                />
                {sortByToEdit?.sortBy &&
                    <button onClick={onRestSort} className="white">
                        <SvgIcon iconName='xMark' size={20} colorName='secondaryText' />
                    </button>
                }
            </div>

        </section>
    )
}